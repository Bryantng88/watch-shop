import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import type { Tx } from "@/server/db/client";
import { createOrderItemsRepo } from "./order-write.repo";
import { createFromOrderTx } from "@/domains/service/server/service-request-from-order.service";
import { recordOrderMutation } from "../events/order-business-event.emitter";
import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";

export const serviceOrderDetailSelect = {
  id: true,
  refNo: true,
  customerName: true,
  updatedAt: true,
  status: true,
  paymentStatus: true,
  subtotal: true,
  hasShipment: true,
  orderItem: {
    orderBy: [{ createdAt: "asc" as const }, { id: "asc" as const }],
    take: 101,
    select: {
      id: true,
      customerItemNote: true,
      title: true,
      quantity: true,
      kind: true,
      productId: true,
      serviceScope: true,
      serviceCatalogId: true,
      linkedOrderItemId: true,
      unitPriceAgreed: true,
      subtotal: true,
      serviceRequest: {
        orderBy: { id: "asc" },
        select: { status: true },
        take: 10,
      },
    },
  },
  shipments: { select: { id: true }, take: 1 },
  Invoice: { select: { id: true }, take: 1 },
} satisfies Prisma.OrderSelect;
export type ServiceOrderRow = Prisma.OrderGetPayload<{
  select: typeof serviceOrderDetailSelect;
}>;
export function serviceOrderVersion(order: ServiceOrderRow) {
  return createHash("sha256").update(JSON.stringify(order)).digest("hex");
}
export function serviceAppendBlock(order: ServiceOrderRow) {
  if (!["DRAFT", "RESERVED", "POSTED", "PROCESSING"].includes(order.status))
    return "Đơn đã khóa hoặc kết thúc; cần xử lý trên màn hình đơn hàng.";
  if (order.paymentStatus !== "UNPAID")
    return "Đơn đã có thanh toán; cần luồng điều chỉnh tài chính riêng.";
  if (order.hasShipment || order.shipments.length || order.Invoice.length)
    return "Đơn có vận chuyển/hóa đơn; chưa hỗ trợ thêm dịch vụ qua Ben.";
  if (
    !order.orderItem.length ||
    order.orderItem.length > 100 ||
    order.orderItem.some(
      (i) =>
        i.kind !== "SERVICE" ||
        i.serviceScope !== "CUSTOMER_OWNED" ||
        i.productId,
    )
  )
    return "Ben chỉ thêm dịch vụ vào đơn dịch vụ đồng hồ khách gửi, không sửa đơn bán hàng hỗn hợp.";
  return null;
}

export const serviceCatalogSelect = {
  id: true,
  name: true,
  code: true,
  updatedAt: true,
  isActive: true,
  customerPrice: true,
  defaultPrice: true,
} satisfies Prisma.ServiceCatalogSelect;
export function serviceCatalogVersion(
  row: Prisma.ServiceCatalogGetPayload<{ select: typeof serviceCatalogSelect }>,
) {
  return createHash("sha256").update(JSON.stringify(row)).digest("hex");
}
export type ServiceAddition = {
  parentOrderItemId: string;
  serviceCatalogId: string;
  unitPriceAgreed: number;
};
export class OrderServiceAppendError extends Error {
  constructor(
    message: string,
    public status = 409,
  ) {
    super(message);
  }
}
export async function inspectServiceAppend(
  tx: Pick<Tx, "order" | "payment" | "orderItem">,
  orderId: string,
  expectedVersion: string,
  additions: ServiceAddition[],
) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: serviceOrderDetailSelect,
  });
  if (!order)
    throw new OrderServiceAppendError("Không tìm thấy đơn hàng.", 404);
  const blocked = serviceAppendBlock(order);
  if (blocked) throw new OrderServiceAppendError(blocked);
  if (serviceOrderVersion(order) !== expectedVersion)
    throw new OrderServiceAppendError(
      "Đơn đã thay đổi. Nhờ Ben tra lại và chuẩn bị bản duyệt mới.",
    );
  if (
    await tx.payment.count({
      where: {
        order_id: orderId,
        status: { in: ["PAID", "COLLECTED", "REFUNDED"] },
      },
    })
  )
    throw new OrderServiceAppendError(
      "Đơn đã có giao dịch thanh toán; cần điều chỉnh trên màn hình đơn hàng.",
    );
  if (
    !additions.length ||
    additions.length > 12 ||
    new Set(
      additions.map((a) => `${a.parentOrderItemId}:${a.serviceCatalogId}`),
    ).size !== additions.length
  )
    throw new OrderServiceAppendError("Danh sách dịch vụ không hợp lệ.");
  for (const a of additions) {
    if (
      !Number.isSafeInteger(a.unitPriceAgreed) ||
      a.unitPriceAgreed <= 0 ||
      a.unitPriceAgreed > 9999999999
    )
      throw new OrderServiceAppendError(
        "Cần giá thỏa thuận dương cho từng dịch vụ.",
      );
    const root = order.orderItem.find((i) => i.id === a.parentOrderItemId);
    if (
      !root ||
      root.linkedOrderItemId ||
      root.quantity !== 1 ||
      !root.customerItemNote?.trim() ||
      root.serviceRequest.length >= 10 ||
      root.serviceRequest.some((r) =>
        ["DELIVERED", "CANCELED"].includes(r.status),
      )
    )
      throw new OrderServiceAppendError(
        "Cần xác định dòng đồng hồ đơn lẻ đang được xử lý.",
      );
    if (
      order.orderItem.some(
        (i) =>
          (i.id === root.id || i.linkedOrderItemId === root.id) &&
          i.serviceCatalogId === a.serviceCatalogId,
      )
    )
      throw new OrderServiceAppendError(
        "Đồng hồ đã có dịch vụ này. Chưa thêm trùng.",
      );
  }
  if (
    !order.subtotal.equals(
      order.orderItem.reduce(
        (sum, i) => sum.plus(i.subtotal),
        new Prisma.Decimal(0),
      ),
    )
  )
    throw new OrderServiceAppendError(
      "Tổng đơn chưa khớp chi tiết. Cần kiểm tra trên màn hình đơn hàng.",
    );
  const increase = additions.reduce(
    (n, a) => n.plus(a.unitPriceAgreed),
    new Prisma.Decimal(0),
  );
  const afterSubtotal = order.subtotal.plus(increase);
  if (afterSubtotal.gt(9999999999))
    throw new OrderServiceAppendError(
      "Tổng tiền vượt giới hạn hỗ trợ của Ben.",
    );
  return { order, increase, afterSubtotal };
}
/** Append only. The caller owns the serializable transaction and authorization. */
export async function appendOrderServicesTx(
  tx: Tx,
  input: {
    orderId: string;
    expectedVersion: string;
    additions: ServiceAddition[];
    catalogVersions: Record<string, string>;
    actorUserId: string;
  },
  runtime: BusinessEventDispatchOptions,
) {
  await tx.$queryRaw`SELECT "id" FROM "Order" WHERE "id"=${input.orderId} FOR UPDATE`;
  const ids = [
    ...new Set(input.additions.map((a) => a.serviceCatalogId)),
  ].sort();
  if (!ids.length)
    throw new OrderServiceAppendError("Chưa có dịch vụ để thêm.");
  await tx.$queryRaw`SELECT "id" FROM "ServiceCatalog" WHERE "id" IN (${Prisma.join(ids)}) ORDER BY "id" FOR UPDATE`;
  const { order, increase, afterSubtotal } = await inspectServiceAppend(
    tx,
    input.orderId,
    input.expectedVersion,
    input.additions,
  );
  const catalogs = await tx.serviceCatalog.findMany({
    where: { id: { in: ids }, isActive: true },
    select: serviceCatalogSelect,
  });
  if (
    catalogs.length !== ids.length ||
    catalogs.some(
      (c) => serviceCatalogVersion(c) !== input.catalogVersions[c.id],
    )
  )
    throw new OrderServiceAppendError(
      "Danh mục dịch vụ đã thay đổi. Nhờ Ben chuẩn bị lại.",
    );
  const roots = await tx.orderItem.findMany({
    where: {
      orderId: order.id,
      id: { in: input.additions.map((a) => a.parentOrderItemId) },
    },
    select: { id: true, customerItemNote: true },
  });
  if (roots.some((r) => !r.customerItemNote?.trim()))
    throw new OrderServiceAppendError(
      "Dòng đồng hồ chưa đủ thông tin nhận diện; bổ sung ở đơn hàng trước.",
    );
  await createOrderItemsRepo(
    tx,
    order.id,
    input.additions.map((a) => ({
      kind: "SERVICE",
      productId: null,
      title: catalogs.find((c) => c.id === a.serviceCatalogId)!.name,
      serviceCatalogId: a.serviceCatalogId,
      serviceScope: "CUSTOMER_OWNED",
      quantity: 1,
      listPrice: 0,
      unitPriceAgreed: a.unitPriceAgreed,
      linkedOrderItemId: a.parentOrderItemId,
      customerItemNote: roots.find((r) => r.id === a.parentOrderItemId)!
        .customerItemNote,
    })),
  );
  const added = await tx.orderItem.findMany({
    where: {
      orderId: order.id,
      OR: input.additions.map((a) => ({
        linkedOrderItemId: a.parentOrderItemId,
        serviceCatalogId: a.serviceCatalogId,
      })),
    },
  });
  if (added.length !== input.additions.length)
    throw new OrderServiceAppendError(
      "Không xác định được đầy đủ dịch vụ mới.",
    );
  await tx.order.update({
    where: { id: order.id },
    data: { subtotal: afterSubtotal },
  });
  if (["POSTED", "PROCESSING"].includes(order.status)) {
    const intake = await createFromOrderTx(tx, { id: order.id, items: added });
    for (const e of intake.entries) {
      if (e.emitServiceRequestCreated)
        await recordBusinessEvent(
          tx,
          {
            eventKey: "service_request.created",
            targetType: "SERVICE_REQUEST",
            targetId: e.serviceRequestId,
            actorUserId: input.actorUserId,
            targetAliasIds: [e.orderItemId],
            payload: {
              source: "BEN_ORDER_SERVICE_APPEND",
              serviceRequestId: e.serviceRequestId,
              orderItemId: e.orderItemId,
            },
          },
          runtime,
        );
      if (e.createdTechnicalIssue)
        await recordBusinessEvent(
          tx,
          {
            eventKey: "technical_issue.created",
            targetType: "TECHNICAL_ISSUE",
            targetId: e.technicalIssueId,
            actorUserId: input.actorUserId,
            targetAliasIds: [e.serviceRequestId, e.orderItemId],
            payload: {
              source: "BEN_ORDER_SERVICE_APPEND",
              serviceRequestId: e.serviceRequestId,
              technicalIssueId: e.technicalIssueId,
              orderItemId: e.orderItemId,
            },
          },
          runtime,
        );
    }
  }
  await recordOrderMutation(
    tx,
    {
      eventKey: "order.updated",
      orderId: order.id,
      refNo: order.refNo,
      actorUserId: input.actorUserId,
      fromStatus: order.status,
      toStatus: order.status,
      source: "BEN_ORDER_SERVICE_APPEND",
      note: `Thêm ${added.length} dịch vụ; tăng ${increase.toString()} VND.`,
    },
    runtime,
  );
  return {
    id: order.id,
    reference: order.refNo || order.id,
    addedCount: added.length,
  };
}
