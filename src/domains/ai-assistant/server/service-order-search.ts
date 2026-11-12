import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import {
  serviceOrderSearchSchema,
  type ServiceOrderSearch,
} from "../service-order-contract";
import {
  hasAssistantPermission,
  type AssistantAuthority,
} from "../capabilities";
import {
  serviceCatalogSelect,
  serviceCatalogVersion,
  serviceOrderDetailSelect,
  serviceOrderVersion,
  serviceAppendBlock,
} from "@/domains/order/server/write/order-service-append";
import { AssistantError } from "./access";

export function literalTerm(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}
export function serviceTerms(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/đ/g, "d");
  if (/^(spa|ve sinh)$/.test(normalized))
    return [value, "spa", "vệ sinh", "ve sinh"];
  if (/^(thay pin|pin|battery)$/.test(normalized))
    return [value, "thay pin", "battery"];
  if (/^(kinh|glass|crystal)$/.test(normalized))
    return [value, "kính", "kinh", "glass", "crystal"];
  return [value];
}
const contains = (value: string) => ({
  contains: literalTerm(value),
  mode: "insensitive" as const,
});
export function serviceOrderWhere(
  p: ServiceOrderSearch,
): Prisma.OrderWhereInput {
  const AND: Prisma.OrderWhereInput[] = [];
  if (p.reference)
    AND.push({ OR: [{ id: p.reference }, { refNo: contains(p.reference) }] });
  if (p.customerName)
    AND.push({
      OR: [
        { customerName: contains(p.customerName) },
        { customer: { name: contains(p.customerName) } },
        {
          orderItem: {
            some: {
              serviceRequest: {
                some: { customer: { name: contains(p.customerName) } },
              },
            },
          },
        },
      ],
    });
  if (p.brand)
    AND.push({
      orderItem: {
        some: {
          OR: [
            { title: contains(p.brand) },
            { customerItemNote: contains(p.brand) },
            {
              serviceRequest: {
                some: {
                  OR: [
                    { brandSnapshot: contains(p.brand) },
                    { modelSnapshot: contains(p.brand) },
                    { refSnapshot: contains(p.brand) },
                    { skuSnapshot: contains(p.brand) },
                  ],
                },
              },
            },
          ],
        },
      },
    });
  if (p.service)
    AND.push({
      orderItem: {
        some: {
          OR: serviceTerms(p.service).flatMap((s) => [
            { title: contains(s) },
            {
              serviceCatalog: {
                OR: [{ name: contains(s) }, { code: contains(s) }],
              },
            },
            {
              serviceRequest: {
                some: { technicalIssue: { some: { summary: contains(s) } } },
              },
            },
          ]),
        },
      },
    });
  return { AND, orderItem: { some: { kind: "SERVICE" } } };
}
export async function searchServiceOrders(
  db: DB,
  raw: string,
  actor: AssistantAuthority,
) {
  const query = serviceOrderSearchSchema.parse(JSON.parse(raw));
  if (query.customerName && !hasAssistantPermission(actor, "CUSTOMER_VIEW"))
    return {
      accessDenied: true,
      missingPermission: "CUSTOMER_VIEW",
      matches: [],
    };
  const attempts: ServiceOrderSearch[] = [query];
  if (!query.reference && query.customerName && query.brand && query.service) {
    attempts.push({
      customerName: query.customerName,
      brand: query.brand,
      watchCountHint: query.watchCountHint,
    });
    attempts.push({
      customerName: query.customerName,
      service: query.service,
      watchCountHint: query.watchCountHint,
    });
  }
  for (let index = 0; index < attempts.length; index++) {
    const rows = await db.order.findMany({
      where: serviceOrderWhere(attempts[index]),
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 7,
      select: {
        id: true,
        refNo: true,
        status: true,
        customerName: hasAssistantPermission(actor, "CUSTOMER_VIEW"),
        orderItem: {
          where: { kind: "SERVICE", linkedOrderItemId: null },
          take: 26,
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
          select: { id: true, title: true, quantity: true },
        },
      },
    });
    if (!rows.length && index < attempts.length - 1) continue;
    const matches = rows
      .slice(0, 6)
      .map((row) => ({
        id: row.id,
        reference: row.refNo || row.id,
        status: row.status,
        customerName: hasAssistantPermission(actor, "CUSTOMER_VIEW")
          ? row.customerName
          : null,
        watchCount:
          row.orderItem.length < 26
            ? row.orderItem.reduce((n, item) => n + item.quantity, 0)
            : null,
        watches: row.orderItem
          .slice(0, 25)
          .map((item, i) => ({
            id: item.id,
            label: `Dòng ${i + 1}: ${item.title.slice(0, 180)}`,
          })),
        itemsTruncated: row.orderItem.length > 25,
        href: `/admin/orders/${encodeURIComponent(row.id)}`,
      }));
    if (query.watchCountHint)
      matches.sort(
        (a, b) =>
          Number(b.watchCount === query.watchCountHint) -
          Number(a.watchCount === query.watchCountHint),
      );
    return {
      matches,
      truncated: rows.length > 6,
      relaxed: index > 0,
      appliedFilters: attempts[index],
      requiresConfirmation: index > 0 || matches.length !== 1,
      searchedSources: [
        "ORDER",
        "ORDER_SERVICE_LINES",
        "LINKED_SERVICE_REQUESTS",
      ],
      scope: "all statuses; no implicit date filter",
    };
  }
  return { matches: [], truncated: false };
}

export async function readServiceOrder(
  db: DB,
  id: string,
  actor: AssistantAuthority,
) {
  const order = await db.order.findUnique({
    where: { id },
    select: serviceOrderDetailSelect,
  });
  if (!order) throw new AssistantError("Không tìm thấy đơn hàng.", 404);
  const settled = await db.payment.count({
    where: { order_id: id, status: { in: ["PAID", "COLLECTED", "REFUNDED"] } },
  });
  const reason =
    serviceAppendBlock(order) ||
    (settled
      ? "Đơn đã có giao dịch thanh toán; cần điều chỉnh tại màn hình đơn hàng."
      : null);
  return {
    order,
    projection: {
      id: order.id,
      reference: order.refNo || order.id,
      version: serviceOrderVersion(order),
      status: order.status,
      subtotal: order.subtotal.toString(),
      canAppend: !reason,
      blockedReason: reason,
      customerName: hasAssistantPermission(actor, "CUSTOMER_VIEW")
        ? (
            await db.order.findUnique({
              where: { id },
              select: { customerName: true },
            })
          )?.customerName || null
        : null,
      items: order.orderItem.map((i) => ({
        id: i.id,
        title: i.title.slice(0, 180),
        kind: i.kind,
        quantity: i.quantity,
        parentId: i.linkedOrderItemId,
        serviceCatalogId: i.serviceCatalogId,
        unitPriceAgreed: i.unitPriceAgreed?.toString() || null,
      })),
      href: `/admin/orders/${encodeURIComponent(id)}`,
    },
  };
}
export async function searchServiceCatalog(db: DB, query: string) {
  const rows = await db.serviceCatalog.findMany({
    where: {
      isActive: true,
      OR: [
        { id: query },
        ...serviceTerms(query).flatMap((s) => [
          { name: contains(s) },
          { code: contains(s) },
        ]),
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    take: 7,
    select: serviceCatalogSelect,
  });
  return {
    matches: rows
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        version: serviceCatalogVersion(r),
        referencePrice: r.customerPrice?.gt(0)
          ? r.customerPrice.toString()
          : null,
        priceUsage: "REFERENCE_ONLY",
      })),
    truncated: rows.length > 6,
  };
}
