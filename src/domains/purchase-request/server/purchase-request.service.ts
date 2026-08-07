import { PurchaseRequestOutcome, PurchaseRequestStatus } from "@prisma/client";

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

export async function startPurchaseRequest(id: string) {
  const updated = await prisma.purchaseRequest.updateMany({
    where: { id, status: PurchaseRequestStatus.WAITING },
    data: { status: PurchaseRequestStatus.PROCESSING, processingStartedAt: new Date() },
  });
  if (!updated.count) throw new Error("Yêu cầu không còn ở trạng thái chờ xử lý.");
  return prisma.purchaseRequest.findUniqueOrThrow({ where: { id } });
}

export async function completePurchaseRequest(input: {
  id: string;
  outcome: PurchaseRequestTerminalOutcome;
  reason: string;
}) {
  const reason = input.reason.trim();
  if (!reason) throw new Error("Cần nhập lý do kết thúc yêu cầu.");
  const updated = await prisma.purchaseRequest.updateMany({
    where: { id: input.id, status: { in: [PurchaseRequestStatus.WAITING, PurchaseRequestStatus.PROCESSING] } },
    data: {
      status: PurchaseRequestStatus.COMPLETED,
      outcome: input.outcome,
      completionReason: reason,
      completedAt: new Date(),
    },
  });
  if (!updated.count) throw new Error("Yêu cầu đã kết thúc hoặc đã chuyển thành đơn hàng.");
  return prisma.purchaseRequest.findUniqueOrThrow({ where: { id: input.id } });
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
