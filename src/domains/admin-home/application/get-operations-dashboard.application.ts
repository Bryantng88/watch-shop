import { queryDashboardAttention } from "./dashboard-attention.query";
import { executionCounts } from "../shared/execution-summary";
import { queryDashboardExecutionCounts } from "./execution-summary.query";
import { isPersonalEvent } from "@/domains/personal-work/shared/personal-event";
import { personalWorkViewAccessWhere } from "@/domains/personal-work/server/personal-work-access";
import { prisma } from "@/server/db/client";
import { queryOrderListProjection, queryOrderStageStatistics } from "@/domains/projection/server/order-list.projection";
import { queryProjectionStageStatistics, queryOpenOperationStageStatistics, queryStageThroughput } from "@/domains/projection/server/operation-stage-statistics.query";
import { MEDIA_OPERATION_BOARD_PROJECTION_KEY, MEDIA_OPERATION_BOARD_PROJECTION_VERSION } from "@/domains/projection/server/media-operation-board.projection";
import { TECHNICAL_ISSUE_BOARD_PROJECTION_KEY, TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION } from "@/domains/projection/server/technical-issue-board.projection";
import { stageMetrics } from "./stage-insights";
import {
  queryMediaOperationBoardInsightCounts,
  queryMediaOperationBoardProjection,
} from "@/domains/projection/server/media-operation-board.projection";
import {
  listTechnicalIssueBoardWorkspaceProjection,
  queryTechnicalIssueBoardInsightCounts,
} from "@/domains/projection/server/technical-issue-board.projection";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import type {
  OperationsDashboardData,
  OperationsDashboardQueue,
} from "../shared/operations-dashboard.types";
import { bangkokDayBounds } from "./operations-dashboard-time";

function count(map: Map<string, number>, key: string) {
  return map.get(key) ?? 0;
}

export async function getOperationsDashboardApplication(input: { canAssignPurchaseRequests?: boolean; userId?: string | null } = {}): Promise<OperationsDashboardData> {
  await Promise.all([
    ensureProjectionReady(prisma, "order-list"),
    ensureProjectionReady(prisma, "media-operation-board"),
    ensureProjectionReady(prisma, "technical-issue-board"),
  ]);

  const now = new Date();
  const today = bangkokDayBounds(now);
  const trendStart = new Date(today.start.getTime() - 6 * 86_400_000);
  const [orders, purchaseRequestCounts, overdueRequestCount, unassignedRequestCount, media, mediaInsights, technical, technicalInsights, paymentCounts, completedOrders, personalItems, orderStats, mediaStats, technicalStats, openStats, throughput, execution, visibleAttention] = await Promise.all([
    queryOrderListProjection(prisma, { view: "all", subFilter: "", paymentType: "", sort: "updatedDesc", page: 1, pageSize: 1 }),
    prisma.purchaseRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.purchaseRequest.count({ where: { status: { in: ["WAITING", "PROCESSING"] }, followUpAt: { lt: now } } }),
    prisma.purchaseRequest.count({ where: { status: { in: ["WAITING", "PROCESSING"] }, assignedUserId: null } }),
    queryMediaOperationBoardProjection(prisma, { page: 1, pageSize: 100 }),
    queryMediaOperationBoardInsightCounts(prisma, now),
    listTechnicalIssueBoardWorkspaceProjection(prisma, { page: 1, pageSize: 100 }),
    queryTechnicalIssueBoardInsightCounts(prisma, now),
    prisma.payment.groupBy({ by: ["status", "direction"], _count: { _all: true } }),
    prisma.order.findMany({
      where: { status: "COMPLETED", updatedAt: { gte: trendStart, lt: today.end } },
      select: { updatedAt: true },
    }),
    input.userId ? prisma.taskItem.findMany({
      where: {
        ...personalWorkViewAccessWhere(input.userId),
        OR:[{workTypeId:null},{workTypeId:{not:"CONTINUOUS"}}],
        status: { notIn: ["DONE", "CANCELLED"] },
      },
      select: { dueAt: true, status: true, workTypeId: true },
    }) : Promise.resolve([]),
    queryOrderStageStatistics(prisma, now),
    queryProjectionStageStatistics(prisma, MEDIA_OPERATION_BOARD_PROJECTION_KEY, MEDIA_OPERATION_BOARD_PROJECTION_VERSION, now),
    queryProjectionStageStatistics(prisma, TECHNICAL_ISSUE_BOARD_PROJECTION_KEY, TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION, now),
    queryOpenOperationStageStatistics(prisma, { now, todayStart: today.start, todayEnd: today.end, userId: input.userId ?? null }),
    queryStageThroughput(prisma, now),
    queryDashboardExecutionCounts(prisma),
    queryDashboardAttention(prisma, now),
  ]);

  const personalOverdue = personalItems.filter((item) => item.dueAt && item.dueAt < today.start).length;
  const personalDueToday = personalItems.filter((item) => item.dueAt && item.dueAt >= today.start && item.dueAt < today.end).length;
  const personalUpcoming = personalItems.filter((item) => item.dueAt && item.dueAt >= today.end).length;
  const personalUnscheduled = personalItems.filter((item) => !item.dueAt).length;

  const purchase = new Map(purchaseRequestCounts.map((row) => [String(row.status), row._count._all]));
  const unpaidPayments = paymentCounts.filter((row) => String(row.status) === "UNPAID");
  const unpaidPaymentCount = unpaidPayments.reduce((sum, row) => sum + row._count._all, 0);
  const unpaidIncomingCount = unpaidPayments.filter((row) => String(row.direction) === "IN").reduce((sum, row) => sum + row._count._all, 0);
  const unpaidOutgoingCount = unpaidPayments.filter((row) => String(row.direction) === "OUT").reduce((sum, row) => sum + row._count._all, 0);
  const unpaidUnclassifiedCount = unpaidPayments.filter((row) => !row.direction).reduce((sum, row) => sum + row._count._all, 0);
  const orderCounts = orders.counts;
  const queues: OperationsDashboardQueue[] = [
    {
      key: "orders",
      label: "Đơn hàng cần theo dõi",
      description: "Đơn cần xử lý, còn tiền phải thu hoặc đang chờ giao.",
      href: "/admin/orders?view=need_action",
      activeCount: Number(orderCounts.need_action ?? 0) + Number(orderCounts.processing ?? 0),
      actionLabel: "Xử lý đơn hàng",
      insights: [
        { key: "remaining-payment", label: "Còn phải thu", count: Number(orderCounts.processingSub?.remaining_payment ?? 0) + Number(orderCounts.processingSub?.delivered_remaining ?? 0), href: "/admin/orders?view=processing", severity: "risk" },
        { key: "awaiting-shipment", label: "Chờ tạo/giao hàng", count: Number(orderCounts.processingSub?.awaiting_shipment ?? 0), href: "/admin/orders?view=processing&subFilter=awaiting_shipment", severity: "attention" },
      ],
      stages: [
        { key: "need-action", label: "Cần xử lý", actionLabel: "Xử lý", count: Number(orderCounts.need_action ?? 0), href: "/admin/orders?view=need_action" },
        { key: "remaining-payment", label: "Chưa giao, còn phải thu", actionLabel: "Thu tiền", count: Number(orderCounts.processingSub?.remaining_payment ?? 0), href: "/admin/orders?view=processing&subFilter=remaining_payment" },
        { key: "delivered-remaining", label: "Đã giao, còn phải thu", actionLabel: "Thu tiền", count: Number(orderCounts.processingSub?.delivered_remaining ?? 0), href: "/admin/orders?view=processing&subFilter=delivered_remaining" },
        { key: "awaiting-shipment", label: "Chờ giao", actionLabel: "Giao hàng", count: Number(orderCounts.processingSub?.awaiting_shipment ?? 0), href: "/admin/orders?view=processing&subFilter=awaiting_shipment" },
      ],
    },
    {
      key: "purchase-requests",
      label: "Yêu cầu xử lý đơn hàng",
      description: "Yêu cầu từ storefront đang chờ tiếp nhận hoặc đang được tư vấn.",
      href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting",
      activeCount: count(purchase, "WAITING") + count(purchase, "PROCESSING"),
      actionLabel: "Xử lý yêu cầu",
      insights: [
        { key: "overdue", label: "Follow-up quá hạn", count: overdueRequestCount, href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-processing", severity: "risk" },
        { key: "unassigned", label: "Chưa có người nhận", count: unassignedRequestCount, href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting", severity: "attention" },
      ],
      stages: [
        { key: "waiting", label: "Chờ xử lý", actionLabel: "Phân công", count: count(purchase, "WAITING"), href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting" },
        { key: "processing", label: "Đang xử lý", actionLabel: "Tiếp tục", count: count(purchase, "PROCESSING"), href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-processing" },
      ],
    },
    {
      key: "media",
      label: "Watch trong Media",
      description: "Watch còn nằm trong quy trình chụp, xử lý ảnh hoặc xuất bản.",
      href: "/admin/coordination/operation?view=media-production-flow&flowStage=photography",
      activeCount: count(media.totals, "PHOTOGRAPHY") + count(media.totals, "MEDIA_PROCESSING") + count(media.totals, "PUBLISH"),
      actionLabel: "Xử lý Media",
      insights: [
        { key: "not-started", label: "Chưa bắt đầu", count: mediaInsights.notStarted, href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing", severity: "attention" },
        { key: "stale", label: "Im quá 7 ngày", count: mediaInsights.stale, href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing", severity: "attention" },
        { key: "very-stale", label: "Kẹt quá 30 ngày", count: mediaInsights.veryStale, href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing", severity: "risk" },
      ],
      stages: [
        { key: "photography", label: "Photography", actionLabel: "Chụp ảnh", count: count(media.totals, "PHOTOGRAPHY"), href: "/admin/coordination/operation?view=media-production-flow&flowStage=photography" },
        { key: "media-processing", label: "Media Processing", actionLabel: "Xử lý ảnh", count: count(media.totals, "MEDIA_PROCESSING"), href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing" },
        { key: "publish", label: "Publish", actionLabel: "Xuất bản", count: count(media.totals, "PUBLISH"), href: "/admin/coordination/operation?view=media-production-flow&flowStage=publish" },
      ],
    },
    {
      key: "technical",
      label: "Watch trong Technical",
      description: "Hạng mục kỹ thuật cần kiểm tra, xác nhận hoặc đang thực hiện.",
      href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=inspect",
      activeCount: count(technical.totals, "INSPECT") + count(technical.totals, "READY") + count(technical.totals, "PROCESSING"),
      actionLabel: "Xử lý kỹ thuật",
      insights: [
        { key: "overdue", label: "Đã quá hạn", count: technicalInsights.overdue, href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=processing", severity: "risk" },
        { key: "waiting-inspect", label: "Chờ kiểm tra", count: count(technical.totals, "INSPECT"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=inspect", severity: "attention" },
      ],
      stages: [
        { key: "inspect", label: "Kiểm tra", actionLabel: "Kiểm tra", count: count(technical.totals, "INSPECT"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=inspect" },
        { key: "ready", label: "Sẵn sàng xử lý", actionLabel: "Bắt đầu", count: count(technical.totals, "READY"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=ready" },
        { key: "processing", label: "Đang xử lý", actionLabel: "Tiếp tục", count: count(technical.totals, "PROCESSING"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=processing" },
      ],
    },
    {
      key: "payments",
      label: "Thanh toán cần xử lý",
      description: "Các khoản thu, chi đang chờ kiểm tra và đối soát.",
      href: "/admin/coordination/operation?context=PAYMENT&view=payment-flow&flowStage=payment-review",
      activeCount: unpaidPaymentCount,
      actionLabel: "Xử lý thanh toán",
      insights: [
        { key: "unpaid-incoming", label: "Khoản thu chờ đối soát", count: unpaidIncomingCount, href: "/admin/coordination/operation?context=PAYMENT&view=payment-flow&flowStage=payment-review&flowPaymentDirection=IN", severity: "risk" },
        { key: "unpaid-outgoing", label: "Khoản chi chờ xử lý", count: unpaidOutgoingCount, href: "/admin/coordination/operation?context=PAYMENT&view=payment-flow&flowStage=payment-review&flowPaymentDirection=OUT", severity: "attention" },
      ],
      stages: [
        { key: "payment-in", label: "Chờ thu / đối soát", actionLabel: "Đối soát", count: unpaidIncomingCount, href: "/admin/coordination/operation?context=PAYMENT&view=payment-flow&flowStage=payment-review&flowPaymentDirection=IN" },
        { key: "payment-out", label: "Chờ chi / xác nhận", actionLabel: "Xử lý", count: unpaidOutgoingCount, href: "/admin/coordination/operation?context=PAYMENT&view=payment-flow&flowStage=payment-review&flowPaymentDirection=OUT" },
        { key: "payment-unclassified", label: "Chưa phân loại", actionLabel: "Kiểm tra", count: unpaidUnclassifiedCount, href: "/admin/coordination/operation?context=PAYMENT&view=payment-flow&flowStage=payment-review" },
      ],
    },
    {
      key: "personal-work",
      label: "Việc cá nhân",
      description: "Công việc riêng, lịch hẹn và nhắc việc đã kết nối Google Calendar.",
      href: "/admin/personal-work",
      activeCount: personalItems.length,
      actionLabel: "Quản lý công việc",
      insights: [
        { key: "overdue", label: "Quá hạn", count: personalOverdue, href: "/admin/personal-work", severity: "risk" },
        { key: "today", label: "Đến hạn hôm nay", count: personalDueToday, href: "/admin/personal-work", severity: "attention" },
      ],
      stages: [
        { key: "personal-overdue", label: "Quá hạn", actionLabel: "Xử lý", count: personalOverdue, href: "/admin/personal-work" },
        { key: "personal-today", label: "Hôm nay", actionLabel: "Mở lịch", count: personalDueToday, href: "/admin/personal-work" },
        { key: "personal-upcoming", label: "Sắp tới", actionLabel: "Xem", count: personalUpcoming, href: "/admin/personal-work" },
        { key: "personal-unscheduled", label: "Chưa xếp lịch", actionLabel: "Xếp lịch", count: personalUnscheduled, href: "/admin/personal-work" },
      ],
    },
  ];

  for (const queue of queues) {
    if (queue.key === "purchase-requests") {
      queue.execution = executionCounts(queue.activeCount, count(purchase, "WAITING"), count(purchase, "PROCESSING"));
    } else if (queue.key === "media" || queue.key === "technical") {
      const counts = execution[queue.key];
      queue.execution = executionCounts(queue.activeCount, counts.waiting, counts.inProgress);
    } else if (queue.key === "personal-work") {
      queue.execution = executionCounts(queue.activeCount,
        personalItems.filter(item => !isPersonalEvent(item.workTypeId) && item.status === "TODO").length,
        personalItems.filter(item => !isPersonalEvent(item.workTypeId) && item.status === "IN_PROGRESS").length);
    } else {
      // Fulfilment/payment buckets do not record whether someone started work.
      queue.execution = executionCounts(queue.activeCount);
    }
  }

  const totalActive = queues.reduce((sum, queue) => sum + queue.activeCount, 0);
  const dateKey = (date: Date) => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
  const completedByDate = new Map<string, number>();
  for (const order of completedOrders) {
    const key = dateKey(order.updatedAt);
    completedByDate.set(key, (completedByDate.get(key) ?? 0) + 1);
  }
  const completionTrend = Array.from({ length: 7 }, (_, index) => {
    const dayStart = new Date(trendStart.getTime() + index * 86_400_000);
    const key = dateKey(dayStart);
    return {
      date: key,
      label: new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Bangkok", weekday: "short" }).format(dayStart),
      count: completedByDate.get(key) ?? 0,
    };
  });
  const statistics = [
    ...orderStats.map(row => ({ ...row, queueKey: "orders" })),
    ...mediaStats.map(row => ({ ...row, queueKey: "media" })),
    ...technicalStats.map(row => ({ ...row, queueKey: "technical" })),
    ...openStats,
  ];
  for (const queue of queues) {
    for (const stage of queue.stages) {
      stage.metrics = stageMetrics(
        statistics.find(row => row.queueKey === queue.key && row.stageKey === stage.key),
        throughput.find(row => row.queueKey === queue.key && row.stageKey === stage.key) ??
          (["media", "purchase-requests"].includes(queue.key) ? {
            queueKey: queue.key, stageKey: stage.key, completedCount: BigInt(0),
            averageHandlingHours: null, cohortCount: BigInt(0), cohortCompletedCount: BigInt(0),
          } : undefined),
      );
    }
  }
  return { generatedAt: now.toISOString(), totalActive, completionTrend, attention: visibleAttention, priorityAction: visibleAttention[0] ?? null, queues };
}
