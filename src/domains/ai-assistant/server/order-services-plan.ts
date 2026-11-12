import type { DB } from "@/server/db/client";
import {
  serviceCatalogSelect,
  serviceCatalogVersion,
  inspectServiceAppend,
  OrderServiceAppendError,
} from "@/domains/order/server/write/order-service-append";
import {
  orderServiceProposalSchema,
  type OrderServicesDraft,
} from "../service-order-contract";
import type { Evidence } from "../live-contract";
import { AssistantError } from "./access";

export const orderServicesPermissions = [
  "ORDER_VIEW",
  "ORDER_UPDATE",
  "SERVICE_VIEW",
  "SERVICE_CREATE",
  "CUSTOMER_VIEW",
];
export async function prepareOrderServices(
  db: DB,
  raw: string,
  revision: number,
  sourceMessageId: string | undefined,
  entries: Evidence[],
): Promise<OrderServicesDraft> {
  const plan = orderServiceProposalSchema.parse(JSON.parse(raw));
  if (plan.sourceMessageId !== sourceMessageId)
    throw new AssistantError("Yêu cầu không thuộc tin nhắn hiện tại.", 409);
  const search = [...entries]
    .reverse()
    .find((e) => e.request.tool === "serviceOrders.search");
  const matches = search?.result.matches as { id: string }[] | undefined;
  if (
    !matches ||
    matches.length !== 1 ||
    matches[0].id !== plan.orderId ||
    search?.result.truncated ||
    search?.result.relaxed
  )
    throw new AssistantError(
      "Cần xác định duy nhất đơn hàng; hỏi lại hoặc tra mã đơn được chọn.",
      409,
    );
  const detail = [...entries]
    .reverse()
    .find(
      (e) =>
        e.request.tool === "serviceOrders.detail" &&
        e.request.query === plan.orderId,
    );
  if (
    detail?.result.version !== plan.expectedVersion ||
    !detail.result.canAppend
  )
    throw new AssistantError(
      "Cần đọc mới đơn và kiểm tra điều kiện trước khi đề xuất.",
      409,
    );
  let snapshot;
  try {
    snapshot = await inspectServiceAppend(
      db,
      plan.orderId,
      plan.expectedVersion,
      plan.additions,
    );
  } catch (e) {
    if (e instanceof OrderServiceAppendError)
      throw new AssistantError(e.message, e.status);
    throw e;
  }
  const catalogIds = [
    ...new Set(plan.additions.map((a) => a.serviceCatalogId)),
  ];
  const catalogs = await db.serviceCatalog.findMany({
    where: { id: { in: catalogIds }, isActive: true },
    select: serviceCatalogSelect,
  });
  for (const id of catalogIds) {
    const latest = [...entries]
      .reverse()
      .find(
        (e) =>
          e.request.tool === "services.catalog" &&
          Array.isArray(e.result.matches) &&
          (e.result.matches as { id: string }[]).some((m) => m.id === id),
      );
    const found = latest?.result.matches as
      | { id: string; version: string }[]
      | undefined;
    const catalog = catalogs.find((c) => c.id === id);
    if (
      !catalog ||
      !found ||
      found.length !== 1 ||
      latest?.result.truncated ||
      found[0].version !== serviceCatalogVersion(catalog)
    )
      throw new AssistantError(
        "Cần tra và chọn chính xác từng dịch vụ trong danh mục.",
        409,
      );
  }
  const customer = await db.order.findUnique({
    where: { id: plan.orderId },
    select: { customerName: true },
  });
  return {
    revision,
    sourceMessageId: plan.sourceMessageId,
    plan,
    orderReference: snapshot.order.refNo || plan.orderId,
    customerName: customer?.customerName || null,
    beforeSubtotal: snapshot.order.subtotal.toString(),
    afterSubtotal: snapshot.afterSubtotal.toString(),
    increase: snapshot.increase.toString(),
    requiredPermissions: orderServicesPermissions,
    requiredTaskIds: [],
    rows: plan.additions.map((a) => {
      const root = snapshot.order.orderItem.find(
        (i) => i.id === a.parentOrderItemId,
      )!;
      const c = catalogs.find((c) => c.id === a.serviceCatalogId)!;
      return {
        parentOrderItemId: root.id,
        watchLabel: `Dòng ${snapshot.order.orderItem.filter((i) => !i.linkedOrderItemId).findIndex((i) => i.id === root.id) + 1}: ${root.title.slice(0, 180)}`,
        serviceCatalogId: c.id,
        serviceName: c.name.slice(0, 180),
        catalogVersion: serviceCatalogVersion(c),
        price: a.unitPriceAgreed,
      };
    }),
  };
}
