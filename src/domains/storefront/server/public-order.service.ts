import { createHash } from "node:crypto";

import { createOrderApplication } from "@/domains/order/application";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { prisma } from "@/server/db/client";
import {
  publicOrderIdempotencyKeySchema,
  publicOrderRequestSchema,
  type PublicOrderAccepted,
  type SubmitPublicOrderCommand,
} from "../contracts";
import { findOrderablePublicWatchIds } from "./public-catalog.repo";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX = 5;

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalRequest(request: ReturnType<typeof publicOrderRequestSchema.parse>) {
  return JSON.stringify({
    ...request,
    items: [...request.items].sort((a, b) => a.productId.localeCompare(b.productId)),
  });
}

export async function submitPublicOrder(
  raw: SubmitPublicOrderCommand,
  context: {
    fingerprint: string;
    runtime?: BusinessEventDispatchOptions;
    now?: Date;
  },
): Promise<PublicOrderAccepted & { replayed: boolean }> {
  const request = publicOrderRequestSchema.parse(raw.request);
  const idempotencyKey = publicOrderIdempotencyKeySchema.parse(raw.idempotencyKey);
  if (request.website) throw new Error("PUBLIC_ORDER_BOT_REJECTED");

  const requestHash = digest(canonicalRequest(request));
  const namespacedKey = `${raw.channel}:${raw.externalRequestId?.trim() || idempotencyKey}`;
  const existing = await prisma.order.findUnique({
    where: { publicRequestKey: namespacedKey },
    select: { id: true, refNo: true, publicRequestHash: true },
  });
  if (existing) {
    if (existing.publicRequestHash !== requestHash) throw new Error("PUBLIC_ORDER_IDEMPOTENCY_CONFLICT");
    return { orderId: existing.id, reference: existing.refNo, status: "PENDING_VERIFICATION", replayed: true };
  }

  const productIds = Array.from(new Set(request.items.map((item) => item.productId)));
  const eligibleIds = new Set(await findOrderablePublicWatchIds(prisma, productIds));
  const unavailable = productIds.filter((id) => !eligibleIds.has(id));
  if (unavailable.length) throw new Error("PUBLIC_ORDER_PRODUCT_UNAVAILABLE");

  const now = context.now ?? new Date();
  const fingerprintHash = digest(`${process.env.PUBLIC_ORDER_FINGERPRINT_SECRET ?? "watch-shop"}:${context.fingerprint}`);
  const noteParts = [
    request.note,
    `Kênh liên hệ: ${request.contactPreference === "ZALO" ? "Zalo" : "Điện thoại"}`,
  ].filter(Boolean);

  const order = await createOrderApplication({
    customerId: null,
    customerName: request.customerName,
    shipPhone: request.phone,
    shipAddress: request.address ?? "",
    shipCity: request.city ?? "",
    shipDistrict: request.district ?? null,
    shipWard: request.ward ?? null,
    hasShipment: Boolean(request.address),
    paymentMethod: "BANK_TRANSFER",
    notes: noteParts.join("\n"),
    reserve: null,
    tradeIn: null,
    source: "WEB",
    verificationStatus: "PENDING",
    status: "DRAFT",
    items: request.items.map((item) => ({
      kind: "PRODUCT",
      productId: item.productId,
      title: "",
      quantity: item.quantity,
      listPrice: 0,
      unitPriceAgreed: null,
    })),
    publicRequest: {
      key: namespacedKey,
      hash: requestHash,
      channel: raw.channel,
      externalRequestId: raw.externalRequestId ?? null,
      fingerprintHash,
      rateLimitSince: new Date(now.getTime() - RATE_LIMIT_WINDOW_MS),
      rateLimitMax: RATE_LIMIT_MAX,
    },
  }, context.runtime);

  return {
    orderId: order.id,
    reference: order.refNo ?? null,
    status: "PENDING_VERIFICATION",
    replayed: "idempotentReplay" in order && order.idempotentReplay === true,
  };
}
