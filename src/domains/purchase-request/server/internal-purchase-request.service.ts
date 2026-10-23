import { createHash, randomUUID } from "node:crypto";

import { ProductStatus, PurchaseRequestActivityType, PurchaseRequestContactPreference } from "@prisma/client";

import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { emitPurchaseRequestBusinessEvent } from "@/domains/purchase-request/server/events";

const MAX_ITEMS = 20;

export type CreateInternalPurchaseRequestInput = {
  productIds: string[];
  customerName: string;
  phone: string;
  customerEmail?: string | null;
  contactPreference?: PurchaseRequestContactPreference;
  contactHandle?: string | null;
  note?: string | null;
  followUpAt?: Date | null;
  idempotencyKey: string;
  actorUserId: string;
};

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 10) return `0${digits.slice(2)}`;
  return digits;
}

export async function createInternalPurchaseRequest(input: CreateInternalPurchaseRequestInput) {
  const productIds = Array.from(new Set(input.productIds.map((id) => id.trim()).filter(Boolean)));
  const customerName = input.customerName.trim();
  const normalizedPhone = normalizePhone(input.phone);
  const customerEmail = input.customerEmail?.trim().toLowerCase() || null;
  const note = input.note?.trim() || null;
  const idempotencyKey = input.idempotencyKey.trim();

  if (!customerName) throw new Error("Cần nhập tên khách hàng.");
  if (normalizedPhone.length < 8 || normalizedPhone.length > 15) throw new Error("Số điện thoại không hợp lệ.");
  if (!productIds.length) throw new Error("Cần chọn ít nhất một Watch.");
  if (productIds.length > MAX_ITEMS) throw new Error(`Mỗi yêu cầu hỗ trợ tối đa ${MAX_ITEMS} Watch.`);
  if (!idempotencyKey) throw new Error("Thiếu mã chống tạo trùng yêu cầu.");
  if (input.followUpAt && Number.isNaN(input.followUpAt.getTime())) throw new Error("Ngày follow-up không hợp lệ.");

  const requestKey = `INTERNAL:${input.actorUserId}:${idempotencyKey}`;
  const requestHash = digest(JSON.stringify({ customerName, normalizedPhone, customerEmail, productIds: [...productIds].sort(), note }));
  const id = randomUUID();
  const now = new Date();
  const reference = `PR-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 8).toUpperCase()}`;

  return runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`internal-purchase-request:${requestKey}`}, 0))`;
    const replay = await tx.purchaseRequestIngressReceipt.findUnique({
      where: { requestKey },
      select: { requestHash: true, purchaseRequest: { select: { id: true, reference: true } } },
    });
    if (replay) {
      if (replay.requestHash !== requestHash) throw new Error("Mã yêu cầu đã được sử dụng với nội dung khác.");
      return replay.purchaseRequest;
    }

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, status: true, watch: { select: { watchPrice: { select: { salePrice: true } } } } },
    });
    const productById = new Map(products.map((product) => [product.id, product]));
    const unavailable = productIds.filter((productId) => productById.get(productId)?.status !== ProductStatus.AVAILABLE);
    if (unavailable.length) throw new Error(`${unavailable.length} Watch không còn ở trạng thái sẵn sàng bán. Hãy tải lại danh sách.`);

    const created = await tx.purchaseRequest.create({
      data: {
        id,
        reference,
        channel: "INTERNAL",
        requestKey,
        requestHash,
        fingerprintHash: digest(`internal:${input.actorUserId}`),
        customerName,
        customerEmail,
        phone: input.phone.trim(),
        normalizedPhone,
        contactPreference: input.contactPreference ?? PurchaseRequestContactPreference.PHONE,
        contactHandle: input.contactHandle?.trim() || null,
        customerNote: note,
        followUpAt: input.followUpAt ?? null,
        analyticsIsInternal: true,
        items: {
          create: productIds.map((productId) => {
            const product = productById.get(productId)!;
            return { productId, titleSnapshot: product.title, listPriceSnapshot: product.watch?.watchPrice?.salePrice ?? 0 };
          }),
        },
        activities: {
          create: {
            type: PurchaseRequestActivityType.NOTE,
            actorUserId: input.actorUserId,
            note: note || `Nhân viên tạo yêu cầu mua ${productIds.length} Watch.`,
          },
        },
      },
      select: { id: true, reference: true },
    });

    const receipt = await tx.purchaseRequestIngressReceipt.create({
      data: { requestKey, requestHash, purchaseRequestId: created.id, disposition: "CREATED", addedItemCount: productIds.length },
      select: { id: true },
    });

    delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
      eventKey: "purchase_request.created",
      eventInstanceId: receipt.id,
      purchaseRequestId: created.id,
      reference: created.reference,
      channel: "INTERNAL",
      productIds,
      addedItemCount: productIds.length,
      occurredAt: now,
      actorUserId: input.actorUserId,
      source: "ADMIN_PURCHASE_REQUEST",
    }));
    return created;
  }, { allowNoEvents: true });
}
