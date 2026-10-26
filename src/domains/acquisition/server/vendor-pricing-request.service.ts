import { createHash, randomBytes } from "node:crypto";
import { AudienceSegment, Prisma } from "@prisma/client";

import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { registerExistingMediaObject } from "@/domains/media/application";
import { prisma } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/product-image-storage";
import { resolveVendorPricingRequestStatus, resolveVendorPricingSubmission } from "../shared/vendor-pricing-request.policy";
import { createAcqItem } from "./acquisition-item.repo";
import { createDraft, updateAcquisitionCost } from "./acquisition.repo";

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1_000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cleanToken(token: string) {
  return String(token ?? "").trim();
}

export type CreateVendorPricingRequestInput = {
  vendorId: string;
  currency?: string;
  notes?: string | null;
  expiresAt?: Date;
  createdByUserId?: string | null;
  publicOrigin: string;
  items: Array<{
    title?: string | null;
    audienceSegment?: "MEN" | "WOMEN";
    imageStorageKey?: string | null;
  }>;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
};

export async function createVendorPricingRequest(input: CreateVendorPricingRequestInput) {
  const vendorId = String(input.vendorId ?? "").trim();
  if (!vendorId) throw new Error("Vui lòng chọn vendor.");
  if (!input.items.length) throw new Error("Cần ít nhất một watch để gửi vendor báo giá.");

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true, isActive: true } });
  if (!vendor?.isActive) throw new Error("Vendor không tồn tại hoặc đã ngừng hoạt động.");

  const preparedItems = [] as Array<{
    title: string;
    audienceSegment: AudienceSegment;
    imageStorageKey: string | null;
    imageMediaObjectId: string | null;
  }>;
  for (const [index, raw] of input.items.entries()) {
    const sourceKey = normalizeKey(raw.imageStorageKey ?? null);
    // Register the source without moving it. The admin may still decide to save
    // the original acquisition form after sharing the vendor link.
    const mediaObject = sourceKey ? await registerExistingMediaObject({ storageKey: sourceKey }) : null;
    preparedItems.push({
      title: String(raw.title ?? "").trim() || `Đồng hồ #${index + 1}`,
      audienceSegment: raw.audienceSegment === "WOMEN" ? AudienceSegment.WOMEN : AudienceSegment.MEN,
      imageStorageKey: mediaObject?.storageKey ?? sourceKey ?? null,
      imageMediaObjectId: mediaObject?.id ?? null,
    });
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = input.expiresAt ?? new Date(Date.now() + DEFAULT_TTL_MS);
  if (expiresAt.getTime() <= Date.now()) throw new Error("Hạn dùng của link phải ở tương lai.");

  const result = await runBusinessEventTransaction(async (tx, delivery) => {
    const request = await tx.vendorAcquisitionPricingRequest.create({
      data: {
        vendorId,
        tokenHash,
        currency: String(input.currency ?? "VND").trim().toUpperCase() || "VND",
        notes: String(input.notes ?? "").trim() || null,
        expiresAt,
        createdByUserId: input.createdByUserId ?? null,
        items: {
          create: preparedItems.map((item, sortOrder) => ({ ...item, sortOrder })),
        },
      },
      select: { id: true, expiresAt: true },
    });
    const event = await delivery.emit({
      eventKey: "vendor_acquisition_pricing_request.created",
      targetType: "VENDOR_ACQUISITION_PRICING_REQUEST",
      targetId: request.id,
      actorUserId: input.createdByUserId ?? null,
      payload: { vendorId, vendorName: vendor.name, itemCount: preparedItems.length, expiresAt: request.expiresAt.toISOString() },
    });
    return { ...request, projectionDeliveryKey: event.projectionDeliveryKey };
  }, { deferConsumers: input.deferConsumers });

  return {
    ...result,
    url: `${input.publicOrigin.replace(/\/$/, "")}/vendor/acquisition/${encodeURIComponent(token)}`,
  };
}

export async function getVendorPricingRequestByToken(token: string) {
  const normalized = cleanToken(token);
  if (!normalized) return null;
  const row = await prisma.vendorAcquisitionPricingRequest.findUnique({
    where: { tokenHash: hashToken(normalized) },
    select: {
      id: true, status: true, currency: true, notes: true, expiresAt: true, submittedAt: true,
      submittedAcquisitionId: true,
      vendor: { select: { name: true } },
      items: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { id: true, title: true, audienceSegment: true, unitCost: true, vendorNote: true, imageStorageKey: true, imageMediaObjectId: true },
      },
    },
  });
  if (!row) return null;
  return { ...row, status: resolveVendorPricingRequestStatus(row) };
}

export async function getVendorPricingImage(token: string, itemId: string) {
  const normalized = cleanToken(token);
  if (!normalized || !itemId) return null;
  const item = await prisma.vendorAcquisitionPricingItem.findFirst({
    where: {
      id: itemId,
      request: { tokenHash: hashToken(normalized), status: "OPEN", expiresAt: { gt: new Date() } },
    },
    select: {
      imageStorageKey: true,
      imageMediaObject: { select: { storageKey: true, availability: true } },
    },
  });
  const key = normalizeKey(item?.imageMediaObject?.storageKey ?? item?.imageStorageKey ?? null);
  if (!key || item?.imageMediaObject?.availability === "DELETED") return null;
  return key;
}

export async function revokeVendorPricingRequest(input: {
  requestId: string;
  actorUserId?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  const requestId = String(input.requestId ?? "").trim();
  if (!requestId) throw new Error("Thiếu yêu cầu báo giá.");

  return runBusinessEventTransaction(async (tx, delivery) => {
    const current = await tx.vendorAcquisitionPricingRequest.findUnique({
      where: { id: requestId },
      select: { id: true, status: true, vendorId: true },
    });
    if (!current) throw new Error("Không tìm thấy yêu cầu báo giá.");
    if (current.status === "SUBMITTED") throw new Error("Báo giá đã được xác nhận nên không thể thu hồi.");
    if (current.status === "REVOKED") return { id: current.id, status: current.status };

    const revokedAt = new Date();
    const request = await tx.vendorAcquisitionPricingRequest.update({
      where: { id: current.id },
      data: { status: "REVOKED", revokedAt },
      select: { id: true, status: true },
    });
    await delivery.emit({
      eventKey: "vendor_acquisition_pricing_request.revoked",
      targetType: "VENDOR_ACQUISITION_PRICING_REQUEST",
      targetId: request.id,
      actorUserId: input.actorUserId ?? null,
      payload: { vendorId: current.vendorId, revokedAt: revokedAt.toISOString() },
    });
    return request;
  }, { deferConsumers: input.deferConsumers });
}

export type SubmitVendorPricingInput = {
  items: Array<{ id: string; unitCost: number; vendorNote?: string | null }>;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
};

export async function submitVendorPricingRequest(token: string, input: SubmitVendorPricingInput) {
  const normalized = cleanToken(token);
  if (!normalized) throw new Error("Link không hợp lệ.");
  return runBusinessEventTransaction(async (tx, delivery) => {
    const tokenHash = hashToken(normalized);
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`vendor-pricing:${tokenHash}`}, 0))`;
    const request = await tx.vendorAcquisitionPricingRequest.findUnique({
      where: { tokenHash },
      include: { items: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }, vendor: { select: { name: true } } },
    });
    if (!request) throw new Error("Link không tồn tại.");
    if (request.status === "SUBMITTED" && request.submittedAcquisitionId) {
      return { acquisitionId: request.submittedAcquisitionId, alreadySubmitted: true };
    }
    if (request.status !== "OPEN") throw new Error("Link không còn hiệu lực.");
    if (request.expiresAt.getTime() <= Date.now()) {
      throw new Error("Link đã hết hạn.");
    }
    const { responses: supplied, prices, totalAmount } = resolveVendorPricingSubmission(request.items, input.items);
    const acquisition = await createDraft(tx, {
      vendorId: request.vendorId,
      currency: request.currency,
      type: "PURCHASE",
      notes: request.notes ? `${request.notes}\nNguồn: Vendor tự xác nhận báo giá.` : "Nguồn: Vendor tự xác nhận báo giá.",
      audienceSegment: request.items[0]?.audienceSegment ?? AudienceSegment.MEN,
    });

    for (const [index, item] of request.items.entries()) {
      const response = supplied.get(item.id)!;
      const currentMedia = item.imageMediaObjectId
        ? await tx.mediaObject.findUnique({ where: { id: item.imageMediaObjectId }, select: { storageKey: true } })
        : null;
      const imageKey = normalizeKey(currentMedia?.storageKey ?? item.imageStorageKey ?? null);
      const created = await createAcqItem(tx, acquisition.id, {
        title: item.title,
        productTitle: item.title,
        quantity: 1,
        unitCost: prices[index],
        audienceSegment: item.audienceSegment,
        aiMeta: { images: imageKey ? [{ key: imageKey, url: null }] : [], aiHint: null },
      });
      await tx.acquisitionItem.update({
        where: { id: created.id },
        data: { notes: String(response.vendorNote ?? "").trim() || null },
      });
      await tx.vendorAcquisitionPricingItem.update({
        where: { id: item.id },
        data: { unitCost: new Prisma.Decimal(prices[index]), vendorNote: String(response.vendorNote ?? "").trim() || null },
      });
    }
    await updateAcquisitionCost(tx, acquisition.id, totalAmount);
    const submittedAt = new Date();
    await tx.vendorAcquisitionPricingRequest.update({
      where: { id: request.id },
      data: { status: "SUBMITTED", submittedAt, submittedAcquisitionId: acquisition.id },
    });

    await delivery.emit({
      eventKey: "acquisition.created",
      targetType: "ACQUISITION",
      targetId: acquisition.id,
      payload: { acquisitionId: acquisition.id, type: "PURCHASE", itemCount: request.items.length, totalAmount, source: "VENDOR_PRICING_REQUEST", vendorPricingRequestId: request.id },
    });
    const submittedEvent = await delivery.emit({
      eventKey: "vendor_acquisition_pricing_request.submitted",
      targetType: "VENDOR_ACQUISITION_PRICING_REQUEST",
      targetId: request.id,
      payload: { vendorId: request.vendorId, vendorName: request.vendor.name, acquisitionId: acquisition.id, totalAmount, itemCount: request.items.length, submittedAt: submittedAt.toISOString() },
    });
    return { acquisitionId: acquisition.id, alreadySubmitted: false, projectionDeliveryKey: submittedEvent.projectionDeliveryKey };
  }, { deferConsumers: input.deferConsumers });
}
