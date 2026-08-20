import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  allocateAmountByChannel,
  allocateOrderContributions,
  channelWeightsFromContributions,
  summarizeCashLedger,
} from "./finance-report.calculator";
import type {
  FinanceChannel,
  FinanceChannelReport,
  FinanceChannelWeight,
  FinancePaymentBreakdown,
  FinanceReportPeriod,
  FinanceReportProjectionData,
} from "./finance-report.types";
import { upsertProjectionRecord } from "@/domains/projection/server/projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "@/domains/projection/server/projection.types";

export const FINANCE_REPORT_PROJECTION_KEY = "finance-report";
export const FINANCE_REPORT_PROJECTION_VERSION = 2;
const ROW_KEY = "global";
const CHANNELS: FinanceChannel[] = ["MEN", "WOMEN"];

type DatedContribution = {
  channel: FinanceChannel;
  recognizedAt: Date;
  revenue: number;
  cost: number;
  transactionId: string;
  kind: "PRODUCT" | "SERVICE" | "DISCOUNT";
  itemId: string;
  code: string;
  label: string;
  href: string;
};

type PaymentAllocation = {
  paymentId: string;
  channel: FinanceChannel;
  direction: "IN" | "OUT";
  status: string;
  purpose: string;
  method: string;
  amount: number;
  createdAt: Date;
  paidAt: Date | null;
  updatedAt: Date;
  code: string;
  label: string;
  href: string;
  expenseCategoryName?: string | null;
};

function number(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function reportChannel(value: unknown): FinanceChannel | null {
  const normalized = String(value ?? "").toUpperCase();
  return normalized === "MEN" || normalized === "WOMEN" ? normalized : null;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfQuarter(date: Date) {
  return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function paymentCategory(input: { direction: "IN" | "OUT"; purpose: string; method: string; expenseCategoryName?: string | null }) {
  if (input.direction === "IN") {
    if (input.purpose === "OPENING_BALANCE") return { key: "OPENING_BALANCE", label: "Số dư đầu kỳ", owner: "Finance" };
    if (input.purpose === "OTHER_INCOME") return { key: "OTHER_INCOME", label: "Thu nhập khác", owner: "Payment" };
    if (input.method === "COD") return { key: "COD", label: "COD chờ xác nhận", owner: "Shipment" };
    if (["SERVICE_REQUEST", "SERVICE_FEE"].includes(input.purpose)) {
      return { key: "SERVICE_IN", label: "Thu dịch vụ", owner: "Service" };
    }
    return { key: "ORDER_IN", label: "Thu tiền bán hàng", owner: "Order" };
  }
  if (input.purpose.startsWith("ACQUISITION_")) {
    return { key: "ACQUISITION_OUT", label: "Thanh toán giá vốn", owner: "Acquisition / Vendor" };
  }
  if (["MAINTENANCE_COST", "SERVICE_FEE"].includes(input.purpose)) {
    return { key: "SERVICE_OUT", label: "Chi phí TI & Service", owner: "Technical Issue" };
  }
  if (input.purpose.startsWith("SHIPMENT_")) {
    return { key: "SHIPMENT_OUT", label: "Phí giao hàng / hoàn", owner: "Shipment" };
  }
  if (input.purpose === "SALARY") return { key: "SALARY", label: "Lương nhân sự", owner: "Payment" };
  if (input.purpose === "OPERATING_EXPENSE") return {
    key: `OPERATING_EXPENSE:${input.expenseCategoryName ?? "OTHER"}`,
    label: input.expenseCategoryName ?? "Chi phí vận hành",
    owner: "Payment",
  };
  return { key: "OTHER_OUT", label: "Chi phí khác", owner: "Payment" };
}

function weightsForSegments(segments: Array<{ channel: FinanceChannel | null; amount: number }>) {
  const totals = new Map<FinanceChannel, number>(CHANNELS.map((channel) => [channel, 0]));
  for (const item of segments) {
    if (!item.channel) continue;
    totals.set(item.channel, (totals.get(item.channel) ?? 0) + Math.max(0, item.amount));
  }
  const total = [...totals.values()].reduce((sum, value) => sum + value, 0);
  if (total <= 0) return [];
  return CHANNELS.flatMap((channel) => {
    const value = totals.get(channel) ?? 0;
    return value > 0 ? [{ channel, weight: value / total }] : [];
  });
}

function periodSummary(input: {
  key: "MONTH" | "QUARTER";
  label: string;
  startAt: Date;
  endAt: Date;
  contributions: DatedContribution[];
  payments: PaymentAllocation[];
}): FinanceReportPeriod {
  const inPeriod = (date: Date) => date >= input.startAt && date <= input.endAt;
  const contributions = input.contributions.filter((item) => inPeriod(item.recognizedAt));
  const settled = input.payments.filter((item) => ["PAID", "COLLECTED"].includes(item.status));
  const effectiveDate = (item: PaymentAllocation) => item.paidAt ?? item.updatedAt;
  const latestOpeningBalance = settled
    .filter((item) => item.purpose === "OPENING_BALANCE" && effectiveDate(item) <= input.endAt)
    .sort((left, right) => effectiveDate(right).getTime() - effectiveDate(left).getTime())[0] ?? null;
  const ledgerStart = latestOpeningBalance ? effectiveDate(latestOpeningBalance) : null;
  const cashMovements = settled.filter((item) => item.purpose !== "OPENING_BALANCE");
  const paid = cashMovements.filter((item) =>
    inPeriod(effectiveDate(item)) && (!ledgerStart || effectiveDate(item) > ledgerStart),
  );
  const revenue = contributions.reduce((sum, item) => sum + item.revenue, 0);
  const otherIncome = paid
    .filter((item) => item.direction === "IN" && item.purpose === "OTHER_INCOME")
    .reduce((sum, item) => sum + item.amount, 0);
  const cogs = contributions.reduce((sum, item) => sum + item.cost, 0);
  const collected = paid
    .filter((item) => item.direction === "IN" && item.purpose !== "OPENING_BALANCE")
    .reduce((sum, item) => sum + item.amount, 0);
  const cashLedger = summarizeCashLedger(input.payments, input.startAt, input.endAt);
  const operatingOut = paid
    .filter((item) => item.direction === "OUT" && !item.purpose.startsWith("ACQUISITION_"))
    .reduce((sum, item) => sum + item.amount, 0);
  const cost = cogs + operatingOut;
  const revenueGroups = new Map<string, { key: string; label: string; count: Set<string>; amount: number }>();
  for (const item of contributions) {
    const key = `${item.channel}:${item.kind}`;
    const label = item.kind === "SERVICE"
      ? `Dịch vụ ${item.channel === "MEN" ? "Nam" : "Nữ"}`
      : `Watch ${item.channel === "MEN" ? "Nam" : "Nữ"}`;
    const current = revenueGroups.get(key) ?? { key, label, count: new Set<string>(), amount: 0 };
    current.count.add(item.transactionId);
    current.amount += item.revenue;
    revenueGroups.set(key, current);
  }
  const costGroups = new Map<string, { key: string; label: string; amount: number }>();
  costGroups.set("COGS", { key: "COGS", label: "Giá vốn Watch", amount: cogs });
  for (const payment of paid.filter((item) => item.direction === "OUT" && !item.purpose.startsWith("ACQUISITION_"))) {
    const category = paymentCategory(payment);
    const current = costGroups.get(category.key) ?? { key: category.key, label: category.label, amount: 0 };
    current.amount += payment.amount;
    costGroups.set(category.key, current);
  }
  const orderDetails = contributions.map((item) => ({
    id: item.itemId,
    code: item.code,
    source: item.kind === "SERVICE" ? "Dịch vụ" : "Bán Watch",
    label: item.label,
    amount: item.revenue,
    margin: item.revenue > 0 ? ((item.revenue - item.cost) / item.revenue) * 100 : null,
    href: item.href,
  }));
  const paymentDetails = (direction: "IN" | "OUT") => paid
    .filter((item) => item.direction === direction)
    .map((item) => ({
      id: `${item.paymentId}:${item.channel}`,
      code: item.code,
      source: paymentCategory(item).label,
      label: item.label,
      amount: item.amount,
      margin: null,
      href: item.href,
    }));

  return {
    key: input.key,
    label: input.label,
    startAt: input.startAt.toISOString(),
    endAt: input.endAt.toISOString(),
    revenue,
    otherIncome,
    collected,
    cost,
    profit: revenue + otherIncome - cost,
    ...cashLedger,
    transactionCount: new Set(contributions.map((item) => item.transactionId)).size,
    revenueBreakdown: [...revenueGroups.values()].map((item) => ({ ...item, count: item.count.size })).sort((left, right) => right.amount - left.amount),
    costBreakdown: [...costGroups.values()].filter((item) => item.amount > 0).sort((left, right) => right.amount - left.amount),
    details: {
      revenue: orderDetails.sort((left, right) => right.amount - left.amount).slice(0, 100),
      profit: orderDetails.map((item) => ({
        ...item,
        amount: (contributions.find((source) => source.itemId === item.id)?.revenue ?? 0) - (contributions.find((source) => source.itemId === item.id)?.cost ?? 0),
      })).sort((left, right) => right.amount - left.amount).slice(0, 100),
      collected: paymentDetails("IN").sort((left, right) => right.amount - left.amount).slice(0, 100),
      cost: [
        ...orderDetails.map((item) => ({ ...item, amount: contributions.find((source) => source.itemId === item.id)?.cost ?? 0, source: "Giá vốn" })),
        ...paymentDetails("OUT"),
      ].filter((item) => item.amount > 0).sort((left, right) => right.amount - left.amount).slice(0, 100),
    },
  };
}

function pendingBreakdown(payments: PaymentAllocation[], direction: "IN" | "OUT") {
  const pending = payments.filter((item) => item.direction === direction && item.status === "UNPAID");
  const grouped = new Map<string, {
    key: string;
    label: string;
    owner: string;
    paymentIds: Set<string>;
    overduePaymentIds: Set<string>;
    amount: number;
  }>();
  const overdueBefore = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  for (const payment of pending) {
    const category = paymentCategory(payment);
    const current = grouped.get(category.key) ?? {
      ...category,
      paymentIds: new Set<string>(),
      overduePaymentIds: new Set<string>(),
      amount: 0,
    };
    current.paymentIds.add(payment.paymentId);
    current.amount += payment.amount;
    if (payment.createdAt < overdueBefore) current.overduePaymentIds.add(payment.paymentId);
    grouped.set(category.key, current);
  }
  return [...grouped.values()]
    .map((item): FinancePaymentBreakdown => ({
      key: item.key,
      label: item.label,
      owner: item.owner,
      count: item.paymentIds.size,
      amount: item.amount,
      overdue: item.overduePaymentIds.size,
    }))
    .sort((left, right) => right.amount - left.amount);
}

export async function buildFinanceReportProjectionData(db: DB): Promise<FinanceReportProjectionData> {
  const client = dbOrTx(db);
  const now = new Date();
  const sixMonthsAgo = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5, 1));

  const completionEvents = await client.businessEventLog.findMany({
    where: { eventKey: "order.completed", targetType: "ORDER", createdAt: { gte: sixMonthsAgo } },
    select: { targetId: true, createdAt: true },
  });
  const completionDateByOrder = new Map(completionEvents.map((event) => [event.targetId, event.createdAt]));
  const completedOrderIds = completionEvents.map((event) => event.targetId);
  const orders = await client.order.findMany({
    where: {
      status: "COMPLETED",
      OR: [
        { updatedAt: { gte: sixMonthsAgo } },
        ...(completedOrderIds.length ? [{ id: { in: completedOrderIds } }] : []),
      ],
    },
    select: {
      id: true,
      refNo: true,
      updatedAt: true,
      orderItem: {
        select: {
          id: true,
          title: true,
          kind: true,
          subtotal: true,
          quantity: true,
          product: {
            select: {
              watch: { select: { audienceSegment: true, watchPrice: { select: { landedCost: true, costPrice: true } } } },
            },
          },
          linkedOrderItem: {
            select: {
              product: { select: { watch: { select: { audienceSegment: true } } } },
            },
          },
        },
      },
    },
  });

  const contributions: DatedContribution[] = [];
  const orderWeights = new Map<string, FinanceChannelWeight[]>();
  let unallocatedOrderItemCount = 0;
  let recognitionDateFallbackCount = 0;

  for (const order of orders) {
    const recognizedAt = completionDateByOrder.get(order.id) ?? order.updatedAt;
    if (!completionDateByOrder.has(order.id)) recognitionDateFallbackCount += 1;
    const allocated = allocateOrderContributions(order.orderItem.map((item) => {
      const watch = item.product?.watch;
      const linkedWatch = item.linkedOrderItem?.product?.watch;
      const channel = reportChannel(watch?.audienceSegment ?? linkedWatch?.audienceSegment);
      const cost = item.kind === "PRODUCT"
        ? number(watch?.watchPrice?.landedCost ?? watch?.watchPrice?.costPrice) * item.quantity
        : 0;
      if (!channel && item.kind !== "DISCOUNT") unallocatedOrderItemCount += 1;
      return {
        id: item.id,
        channel,
        kind: item.kind,
        revenue: number(item.subtotal),
        cost,
      };
    }));
    orderWeights.set(order.id, channelWeightsFromContributions(allocated));
    for (const item of allocated) {
      if (!item.channel) continue;
      contributions.push({
        channel: item.channel,
        recognizedAt,
        revenue: item.allocatedRevenue,
        cost: item.allocatedCost,
        transactionId: order.id,
        kind: item.kind,
        itemId: item.id,
        code: order.refNo ?? order.id,
        label: order.orderItem.find((source) => source.id === item.id)?.title ?? "Order item",
        href: `/admin/orders/${order.id}`,
      });
    }
  }

  const payments = await client.payment.findMany({
    where: { OR: [{ status: { in: ["PAID", "COLLECTED", "UNPAID"] } }, { createdAt: { gte: sixMonthsAgo } }] },
    select: {
      id: true,
      refNo: true,
      amount: true,
      direction: true,
      status: true,
      purpose: true,
      method: true,
      createdAt: true,
      paidAt: true,
      updatedAt: true,
      order_id: true,
      service_request_id: true,
      acquisition_id: true,
      shipment_id: true,
      technical_issue_id: true,
      financeChannel: true,
      expenseCategory: { select: { name: true } },
    },
  });

  const shipmentIds = [...new Set(payments.map((item) => item.shipment_id).filter((id): id is string => Boolean(id)))];
  const shipments = shipmentIds.length
    ? await client.shipment.findMany({ where: { id: { in: shipmentIds } }, select: { id: true, orderId: true } })
    : [];
  const shipmentOrders = new Map(shipments.map((item) => [item.id, item.orderId]));

  const referencedOrderIds = [...new Set([
    ...payments.map((item) => item.order_id),
    ...shipments.map((item) => item.orderId),
  ].filter((id): id is string => Boolean(id)))];
  const missingOrderIds = referencedOrderIds.filter((id) => !orderWeights.has(id));
  if (missingOrderIds.length) {
    const ownerOrders = await client.order.findMany({
      where: { id: { in: missingOrderIds } },
      select: {
        id: true,
        orderItem: { select: { subtotal: true, product: { select: { watch: { select: { audienceSegment: true } } } }, linkedOrderItem: { select: { product: { select: { watch: { select: { audienceSegment: true } } } } } } } },
      },
    });
    for (const order of ownerOrders) {
      orderWeights.set(order.id, weightsForSegments(order.orderItem.map((item) => ({
        channel: reportChannel(item.product?.watch?.audienceSegment ?? item.linkedOrderItem?.product?.watch?.audienceSegment),
        amount: number(item.subtotal),
      }))));
    }
  }

  const serviceIds = [...new Set(payments.map((item) => item.service_request_id).filter((id): id is string => Boolean(id)))];
  const services = serviceIds.length
    ? await client.serviceRequest.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, product: { select: { watch: { select: { audienceSegment: true } } } }, orderItem: { select: { orderId: true, product: { select: { watch: { select: { audienceSegment: true } } } } } } },
      })
    : [];
  const serviceWeights = new Map(services.map((item) => {
    const orderWeight = item.orderItem?.orderId ? orderWeights.get(item.orderItem.orderId) : null;
    const channel = reportChannel(item.product?.watch?.audienceSegment ?? item.orderItem?.product?.watch?.audienceSegment);
    return [item.id, orderWeight?.length ? orderWeight : channel ? [{ channel, weight: 1 }] : []] as const;
  }));

  const technicalIssueIds = [...new Set(payments.map((item) => item.technical_issue_id).filter((id): id is string => Boolean(id)))];
  const issues = technicalIssueIds.length
    ? await client.technicalIssue.findMany({ where: { id: { in: technicalIssueIds } }, select: { id: true, serviceRequestId: true } })
    : [];
  const issueService = new Map(issues.map((item) => [item.id, item.serviceRequestId]));

  const acquisitionIds = [...new Set(payments.map((item) => item.acquisition_id).filter((id): id is string => Boolean(id)))];
  const acquisitions = acquisitionIds.length
    ? await client.acquisition.findMany({ where: { id: { in: acquisitionIds } }, select: { id: true, audienceSegment: true, acquisitionItem: { select: { audienceSegment: true, unitCost: true, quantity: true } } } })
    : [];
  const acquisitionWeights = new Map(acquisitions.map((item) => {
    const weights = weightsForSegments(item.acquisitionItem.map((line) => ({ channel: reportChannel(line.audienceSegment), amount: number(line.unitCost) * line.quantity })));
    const fallback = reportChannel(item.audienceSegment);
    return [item.id, weights.length ? weights : fallback ? [{ channel: fallback, weight: 1 }] : []] as const;
  }));

  const paymentAllocations: PaymentAllocation[] = [];
  let unallocatedPaymentCount = 0;
  let settlementDateFallbackCount = 0;
  for (const payment of payments) {
    const direction = payment.direction === "OUT" ? "OUT" : payment.direction === "IN" ? "IN" : null;
    if (!direction) {
      unallocatedPaymentCount += 1;
      continue;
    }
    const orderId = payment.order_id ?? (payment.shipment_id ? shipmentOrders.get(payment.shipment_id) : null);
    const serviceId = payment.service_request_id ?? (payment.technical_issue_id ? issueService.get(payment.technical_issue_id) : null);
    const standaloneWeights: FinanceChannelWeight[] = payment.financeChannel === "MEN"
      ? [{ channel: "MEN", weight: 1 }]
      : payment.financeChannel === "WOMEN"
        ? [{ channel: "WOMEN", weight: 1 }]
        : payment.financeChannel === "UNISEX"
          ? [{ channel: "MEN", weight: 0.5 }, { channel: "WOMEN", weight: 0.5 }]
          : [];
    const weights = orderId
      ? orderWeights.get(orderId) ?? []
      : serviceId
        ? serviceWeights.get(serviceId) ?? []
        : payment.acquisition_id
          ? acquisitionWeights.get(payment.acquisition_id) ?? []
          : standaloneWeights;
    if (!weights.length) {
      unallocatedPaymentCount += 1;
      weights.push({ channel: "MEN", weight: 0.5 }, { channel: "WOMEN", weight: 0.5 });
    }
    if (["PAID", "COLLECTED"].includes(payment.status) && !payment.paidAt) settlementDateFallbackCount += 1;
    for (const allocation of allocateAmountByChannel(number(payment.amount), weights)) {
      const ownerHref = orderId
        ? `/admin/orders/${orderId}`
        : serviceId
          ? `/admin/services/${serviceId}`
          : payment.acquisition_id
            ? `/admin/acquisitions/${payment.acquisition_id}`
            : "/admin/payments";
      paymentAllocations.push({
        paymentId: payment.id,
        channel: allocation.channel,
        direction,
        status: payment.status,
        purpose: payment.purpose,
        method: payment.method,
        amount: allocation.amount,
        createdAt: payment.createdAt,
        paidAt: payment.paidAt,
        updatedAt: payment.updatedAt,
        code: payment.refNo ?? payment.id,
        label: paymentCategory({ direction, purpose: payment.purpose, method: payment.method, expenseCategoryName: payment.expenseCategory?.name }).label,
        href: ownerHref,
        expenseCategoryName: payment.expenseCategory?.name ?? null,
      });
    }
  }

  const endAt = endOfDay(now);
  const monthStart = startOfMonth(now);
  const quarterStart = startOfQuarter(now);
  const channelReports: FinanceChannelReport[] = CHANNELS.map((channel) => {
    const scopedContributions = contributions.filter((item) => item.channel === channel);
    const scopedPayments = paymentAllocations.filter((item) => item.channel === channel);
    return {
      channel,
      periods: [
        periodSummary({ key: "MONTH", label: "Tháng này", startAt: monthStart, endAt, contributions: scopedContributions, payments: scopedPayments }),
        periodSummary({ key: "QUARTER", label: "Quý này", startAt: quarterStart, endAt, contributions: scopedContributions, payments: scopedPayments }),
      ],
      trend: Array.from({ length: 6 }, (_, index) => {
        const startAt = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
        const endAt = endOfDay(new Date(startAt.getFullYear(), startAt.getMonth() + 1, 0));
        const period = periodSummary({ key: "MONTH", label: `T${startAt.getMonth() + 1}`, startAt, endAt, contributions: scopedContributions, payments: scopedPayments });
        return { label: period.label, revenue: period.revenue, profit: period.profit, margin: period.revenue > 0 ? (period.profit / period.revenue) * 100 : 0 };
      }),
      pendingPayments: {
        in: pendingBreakdown(scopedPayments, "IN"),
        out: pendingBreakdown(scopedPayments, "OUT"),
      },
    };
  });

  const allPeriods = [
    periodSummary({ key: "MONTH", label: "Tháng này", startAt: monthStart, endAt, contributions, payments: paymentAllocations }),
    periodSummary({ key: "QUARTER", label: "Quý này", startAt: quarterStart, endAt, contributions, payments: paymentAllocations }),
  ];
  const allReport: FinanceChannelReport = {
    channel: "ALL",
    periods: allPeriods,
    trend: Array.from({ length: 6 }, (_, index) => {
      const startAt = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
      const trendEndAt = endOfDay(new Date(startAt.getFullYear(), startAt.getMonth() + 1, 0));
      const period = periodSummary({ key: "MONTH", label: `T${startAt.getMonth() + 1}`, startAt, endAt: trendEndAt, contributions, payments: paymentAllocations });
      return { label: period.label, revenue: period.revenue, profit: period.profit, margin: period.revenue > 0 ? (period.profit / period.revenue) * 100 : 0 };
    }),
    pendingPayments: {
      in: pendingBreakdown(paymentAllocations, "IN"),
      out: pendingBreakdown(paymentAllocations, "OUT"),
    },
  };

  return {
    formulaVersion: 2,
    generatedAt: now.toISOString(),
    channels: [allReport, ...channelReports],
    quality: { unallocatedOrderItemCount, unallocatedPaymentCount, recognitionDateFallbackCount, settlementDateFallbackCount },
  };
}

export async function rebuildFinanceReportProjection(db: DB) {
  const data = await buildFinanceReportProjectionData(db);
  await upsertProjectionRecord(db, {
    projectionKey: FINANCE_REPORT_PROJECTION_KEY,
    projectionVersion: FINANCE_REPORT_PROJECTION_VERSION,
    rowKey: ROW_KEY,
    entityType: "FINANCE_REPORT",
    entityId: ROW_KEY,
    sortAt: data.generatedAt,
    sourceUpdatedAt: data.generatedAt,
    dataJson: data,
  });
  return data;
}

export async function queryFinanceReportProjection(db: DB) {
  const row = await dbOrTx(db).projectionRecord.findFirst({
    where: { projectionKey: FINANCE_REPORT_PROJECTION_KEY, projectionVersion: FINANCE_REPORT_PROJECTION_VERSION, rowKey: ROW_KEY },
    select: { dataJson: true },
  });
  return (row?.dataJson as FinanceReportProjectionData | undefined) ?? null;
}

function result(context: ProjectionBuildContext, scope: ProjectionScope, applied: number): ProjectionBuildResult {
  return { ok: true, status: applied ? "applied" : "skipped", projectionKey: context.projectionKey, projectionVersion: context.projectionVersion, scope, applied, skipped: applied ? 0 : 1, failed: 0 };
}

async function buildFromEvent(db: DB, context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext }) {
  await rebuildFinanceReportProjection(db);
  return result(context, { targetType: context.sourceEvent.targetType, targetId: context.sourceEvent.targetId }, 1);
}

async function rebuild(db: DB, context: ProjectionBuildContext & { scope: ProjectionScope }) {
  await rebuildFinanceReportProjection(db);
  return result(context, context.scope, 1);
}

export const financeReportProjectionBuilder: ProjectionBuilder = {
  key: FINANCE_REPORT_PROJECTION_KEY,
  version: FINANCE_REPORT_PROJECTION_VERSION,
  description: "Finance report by MEN/WOMEN business channel with mixed-order allocation.",
  sourceEvents: [
    "order.created", "order.updated", "order.posted", "order.completed", "order.cancelled",
    "payment.created", "payment.status_updated", "payment.paid", "payment.refunded",
    "shipment.updated", "shipment.delivered", "shipment.returned",
    "technical_issue.completed", "technical_issue.updated",
    "acquisition.created", "acquisition.updated", "acquisition.posted", "acquisition.canceled",
  ],
  targetTypes: ["ORDER", "PAYMENT", "SHIPMENT", "TECHNICAL_ISSUE", "ACQUISITION", "WATCH"],
  buildFromEvent,
  rebuild,
};
