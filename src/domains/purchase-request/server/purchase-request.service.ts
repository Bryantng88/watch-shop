import { ProductStatus, PurchaseRequestActivityType, PurchaseRequestItemDecision, PurchaseRequestOutcome, PurchaseRequestStatus, WatchSaleStage } from "@prisma/client";

import { createOrderApplication } from "@/domains/order/application";
import { prisma } from "@/server/db/client";

export type PurchaseRequestTerminalOutcome = Exclude<PurchaseRequestOutcome, "CONVERTED">;

export async function listPurchaseRequests(status?: PurchaseRequestStatus) {
  const rows = await prisma.purchaseRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ createdAt: "desc" }],
    take: 100,
    include: { items: { orderBy: { createdAt: "asc" } }, order: { select: { id: true, refNo: true, status: true } } },
  });
  return rows.map((row) => ({
    ...row,
    items: row.items.map((item) => ({ ...item, listPriceSnapshot: Number(item.listPriceSnapshot) })),
  }));
}

export async function startPurchaseRequest(id: string, assignedUserId: string) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.purchaseRequest.updateMany({
      where: { id, status: PurchaseRequestStatus.WAITING },
      data: { status: PurchaseRequestStatus.PROCESSING, assignedUserId, processingStartedAt: new Date() },
    });
    if (!updated.count) throw new Error("Yêu cầu không còn ở trạng thái chờ xử lý.");
    await tx.purchaseRequestActivity.create({
      data: { purchaseRequestId: id, type: PurchaseRequestActivityType.ASSIGNED, actorUserId: assignedUserId },
    });
    return tx.purchaseRequest.findUniqueOrThrow({ where: { id } });
  });
}

export async function completePurchaseRequest(input: {
  id: string;
  outcome: PurchaseRequestTerminalOutcome;
  reason: string;
  actorUserId: string;
}) {
  const reason = input.reason.trim();
  if (!reason) throw new Error("Cần nhập lý do kết thúc yêu cầu.");
  return prisma.$transaction(async (tx) => {
    const updated = await tx.purchaseRequest.updateMany({
      where: { id: input.id, status: { in: [PurchaseRequestStatus.WAITING, PurchaseRequestStatus.PROCESSING] } },
      data: { status: PurchaseRequestStatus.COMPLETED, outcome: input.outcome, completionReason: reason, completedAt: new Date() },
    });
    if (!updated.count) throw new Error("Yêu cầu đã kết thúc hoặc đã chuyển thành đơn hàng.");
    await tx.purchaseRequestActivity.create({
      data: { purchaseRequestId: input.id, type: PurchaseRequestActivityType.STATUS_CHANGED, actorUserId: input.actorUserId, note: reason },
    });
    return tx.purchaseRequest.findUniqueOrThrow({ where: { id: input.id } });
  });
}

export async function recordPurchaseRequestActivity(input: {
  id: string;
  type: "CONTACT_ATTEMPT" | "NOTE" | "FOLLOW_UP";
  note?: string;
  followUpAt?: Date | null;
  actorUserId: string;
}) {
  const note = input.note?.trim() || null;
  if (input.type !== "FOLLOW_UP" && !note) throw new Error("Cần nhập nội dung trao đổi.");
  if (input.type === "FOLLOW_UP" && !input.followUpAt) throw new Error("Cần chọn thời gian liên hệ lại.");
  return prisma.$transaction(async (tx) => {
    const request = await tx.purchaseRequest.findUnique({ where: { id: input.id }, select: { status: true } });
    if (!request) throw new Error("Không tìm thấy yêu cầu mua hàng.");
    if (request.status === PurchaseRequestStatus.COMPLETED) throw new Error("Yêu cầu đã kết thúc.");
    const activity = await tx.purchaseRequestActivity.create({
      data: { purchaseRequestId: input.id, type: input.type as PurchaseRequestActivityType, note, followUpAt: input.followUpAt ?? null, actorUserId: input.actorUserId },
    });
    await tx.purchaseRequest.update({
      where: { id: input.id },
      data: { assignedUserId: input.actorUserId, processingNote: note ?? undefined, followUpAt: input.type === "FOLLOW_UP" ? input.followUpAt : undefined },
    });
    return activity;
  });
}

export async function updatePurchaseRequestItems(input: {
  id: string;
  items: Array<{ id: string; decision: "PENDING" | "SELECTED" | "DECLINED" | "UNAVAILABLE"; agreedPrice?: number | null; reason?: string | null }>;
}) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.purchaseRequest.findUnique({ where: { id: input.id }, select: { status: true } });
    if (!request) throw new Error("Không tìm thấy yêu cầu mua hàng.");
    if (request.status !== PurchaseRequestStatus.PROCESSING) throw new Error("Chỉ cập nhật sản phẩm khi yêu cầu đang xử lý.");
    for (const item of input.items) {
      if (item.decision === "SELECTED") {
        const available = await tx.purchaseRequestItem.findFirst({
          where: { id: item.id, purchaseRequestId: input.id, product: { status: ProductStatus.AVAILABLE, watch: { is: { saleStage: WatchSaleStage.READY } } } },
          select: { id: true },
        });
        if (!available) throw new Error("Watch không còn ở trạng thái sẵn sàng để đưa vào đơn.");
      }
      const updated = await tx.purchaseRequestItem.updateMany({
        where: { id: item.id, purchaseRequestId: input.id },
        data: { decision: item.decision as PurchaseRequestItemDecision, agreedPrice: item.agreedPrice && item.agreedPrice > 0 ? item.agreedPrice : null, decisionReason: item.reason?.trim() || null },
      });
      if (!updated.count) throw new Error("Có sản phẩm không thuộc yêu cầu mua hàng này.");
    }
    return tx.purchaseRequest.findUniqueOrThrow({ where: { id: input.id }, include: { items: true } });
  });
}

export async function convertPurchaseRequestToOrder(input: { id: string; agreedPrices: Record<string, number> }) {
  const { id } = input;
  const request = await prisma.purchaseRequest.findUnique({ where: { id }, include: { items: true, order: true } });
  if (!request) throw new Error("Không tìm thấy yêu cầu mua hàng.");
  if (request.order) return request.order;
  if (request.status !== PurchaseRequestStatus.PROCESSING) {
    throw new Error("Yêu cầu phải ở trạng thái đang xử lý trước khi tạo đơn hàng.");
  }

  const order = await createOrderApplication({
    customerId: null,
    customerName: request.customerName,
    shipPhone: request.phone,
    shipAddress: request.address ?? "",
    shipCity: request.city ?? "",
    shipDistrict: request.district,
    shipWard: request.ward,
    hasShipment: Boolean(request.address),
    paymentMethod: "BANK_TRANSFER",
    notes: [request.customerNote, `Chuyển đổi từ yêu cầu ${request.reference}`].filter(Boolean).join("\n"),
    reserve: null,
    tradeIn: null,
    source: "WEB",
    verificationStatus: "VERIFIED",
    status: "DRAFT",
    items: request.items.map((item) => {
      const agreedPrice = Number(input.agreedPrices[item.id]);
      if (!Number.isFinite(agreedPrice) || agreedPrice <= 0) {
        throw new Error(`Cần chốt giá bán hợp lệ cho ${item.titleSnapshot}.`);
      }
      return {
        kind: "PRODUCT",
        productId: item.productId,
        title: item.titleSnapshot,
        quantity: 1,
        listPrice: Number(item.listPriceSnapshot),
        unitPriceAgreed: agreedPrice,
      };
    }),
    publicRequest: {
      key: request.requestKey,
      hash: request.requestHash,
      channel: request.channel as "STOREFRONT" | "ZALO",
      externalRequestId: request.externalRequestId,
      fingerprintHash: request.fingerprintHash,
      rateLimitSince: new Date(0),
      rateLimitMax: Number.MAX_SAFE_INTEGER,
    },
  });

  await prisma.purchaseRequest.update({
    where: { id },
    data: {
      orderId: order.id,
      status: PurchaseRequestStatus.COMPLETED,
      outcome: PurchaseRequestOutcome.CONVERTED,
      completedAt: new Date(),
      completionReason: "Đã xác nhận nhu cầu và chuyển thành đơn hàng nháp.",
    },
  });
  return order;
}
