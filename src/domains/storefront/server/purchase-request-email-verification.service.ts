import { createHash, randomBytes, randomUUID } from "node:crypto";

import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { emitPurchaseRequestBusinessEvent } from "@/domains/purchase-request/server/events";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1_000;
const RESEND_COOLDOWN_MS = 60 * 1_000;
const SEND_WINDOW_MS = 24 * 60 * 60 * 1_000;
const MAX_SENDS_PER_WINDOW = 5;
const DELIVERY_TIMEOUT_MS = 10_000;

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function storefrontOrigin(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (fallbackOrigin) return new URL(fallbackOrigin).origin;
  throw new Error("STOREFRONT_EMAIL_ORIGIN_NOT_CONFIGURED");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);
}

async function deliverVerificationEmail(input: { to: string; customerName: string; reference: string; verificationUrl: string; attemptId: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.STOREFRONT_EMAIL_FROM?.trim();
  if (!apiKey || !from) throw new Error("STOREFRONT_EMAIL_NOT_CONFIGURED");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `purchase-request-verification/${input.attemptId}`,
    },
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Xác nhận email cho yêu cầu ${input.reference}`,
      html: `<p>Xin chào ${escapeHtml(input.customerName)},</p><p>Vui lòng xác nhận địa chỉ email cho yêu cầu mua hàng <strong>${escapeHtml(input.reference)}</strong>.</p><p><a href="${escapeHtml(input.verificationUrl)}">Xác nhận email</a></p><p>Liên kết có hiệu lực trong 24 giờ. Nếu bạn không gửi yêu cầu này, hãy bỏ qua email.</p>`,
    }),
  });
  if (!response.ok) throw new Error(`STOREFRONT_EMAIL_DELIVERY_FAILED:${response.status}`);
}

function failureCode(error: unknown) {
  if (error instanceof Error && error.name === "TimeoutError") return "STOREFRONT_EMAIL_DELIVERY_TIMEOUT";
  return error instanceof Error ? error.message.slice(0, 120) : "STOREFRONT_EMAIL_DELIVERY_FAILED";
}

export async function sendPurchaseRequestVerificationEmail(
  purchaseRequestId: string,
  options: { fallbackOrigin?: string; actorUserId: string; deferConsumers?: BusinessEventDispatchOptions["deferConsumers"] },
) {
  const now = new Date();
  const token = randomBytes(32).toString("base64url");
  const hash = tokenHash(token);
  const attemptId = randomUUID();

  const request = await runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`purchase-request-email:${purchaseRequestId}`}, 0))`;
    const row = await tx.purchaseRequest.findUnique({
      where: { id: purchaseRequestId },
      select: {
        id: true, reference: true, customerName: true, customerEmail: true,
        emailVerifiedAt: true, emailVerificationAttemptedAt: true,
        emailVerificationSendCount: true, emailVerificationWindowStartedAt: true,
      },
    });
    if (!row) throw new Error("PURCHASE_REQUEST_NOT_FOUND");
    if (!row.customerEmail) throw new Error("PURCHASE_REQUEST_EMAIL_MISSING");
    if (row.emailVerifiedAt) throw new Error("PURCHASE_REQUEST_EMAIL_ALREADY_VERIFIED");
    if (row.emailVerificationAttemptedAt && now.getTime() - row.emailVerificationAttemptedAt.getTime() < RESEND_COOLDOWN_MS) {
      throw new Error("EMAIL_VERIFICATION_RESEND_TOO_SOON");
    }
    const withinWindow = Boolean(row.emailVerificationWindowStartedAt && now.getTime() - row.emailVerificationWindowStartedAt.getTime() < SEND_WINDOW_MS);
    const sendCount = withinWindow ? row.emailVerificationSendCount : 0;
    if (sendCount >= MAX_SENDS_PER_WINDOW) throw new Error("EMAIL_VERIFICATION_DAILY_LIMIT_REACHED");

    await tx.purchaseRequest.update({
      where: { id: row.id },
      data: {
        emailVerificationStatus: "SENDING",
        emailVerificationTokenHash: hash,
        emailVerificationExpiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
        emailVerificationAttemptedAt: now,
        emailVerificationSendCount: sendCount + 1,
        emailVerificationWindowStartedAt: withinWindow ? row.emailVerificationWindowStartedAt : now,
        emailDeliveryFailedAt: null,
      },
    });
    delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
      eventKey: "purchase_request.email_verification_requested",
      eventInstanceId: attemptId,
      purchaseRequestId: row.id,
      reference: row.reference,
      customerEmail: row.customerEmail,
      actorUserId: options.actorUserId,
      occurredAt: now,
    }));
    return { ...row, customerEmail: row.customerEmail };
  }, { deferConsumers: options.deferConsumers });

  try {
    const verificationUrl = `${storefrontOrigin(options.fallbackOrigin)}/api/public/orders/verify-email?token=${encodeURIComponent(token)}`;
    await deliverVerificationEmail({ ...request, to: request.customerEmail, verificationUrl, attemptId });
    return await runBusinessEventTransaction(async (tx, delivery) => {
      const updated = await tx.purchaseRequest.updateMany({
        where: { id: request.id, emailVerificationTokenHash: hash, emailVerifiedAt: null },
        data: { emailVerificationStatus: "PENDING", emailVerificationSentAt: new Date(), emailDeliveryFailedAt: null },
      });
      if (!updated.count) {
        const current = await tx.purchaseRequest.findUnique({ where: { id: request.id }, select: { emailVerificationStatus: true } });
        return { status: current?.emailVerificationStatus ?? "NOT_SENT" };
      }
      await tx.purchaseRequestActivity.create({
        data: { purchaseRequestId: request.id, type: "NOTE", actorUserId: options.actorUserId, note: "Đã gửi email xác minh tới khách hàng." },
      });
      delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
        eventKey: "purchase_request.email_verification_sent", eventInstanceId: attemptId,
        purchaseRequestId: request.id, reference: request.reference, customerEmail: request.customerEmail,
        actorUserId: options.actorUserId, occurredAt: new Date(),
      }));
      return { status: "PENDING" as const };
    }, { deferConsumers: options.deferConsumers, allowNoEvents: true });
  } catch (error) {
    const code = failureCode(error);
    await runBusinessEventTransaction(async (tx, delivery) => {
      const updated = await tx.purchaseRequest.updateMany({
        where: { id: request.id, emailVerificationTokenHash: hash, emailVerifiedAt: null },
        data: { emailVerificationStatus: "DELIVERY_FAILED", emailDeliveryFailedAt: new Date() },
      });
      if (!updated.count) return;
      await tx.purchaseRequestActivity.create({
        data: { purchaseRequestId: request.id, type: "NOTE", actorUserId: options.actorUserId, note: "Không thể gửi email xác minh tới khách hàng." },
      });
      delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
        eventKey: "purchase_request.email_verification_delivery_failed", eventInstanceId: attemptId,
        purchaseRequestId: request.id, reference: request.reference, customerEmail: request.customerEmail,
        actorUserId: options.actorUserId, failureCode: code, occurredAt: new Date(),
      }));
    }, { deferConsumers: options.deferConsumers, allowNoEvents: true });
    throw error;
  }
}

export async function verifyPurchaseRequestEmail(token: string, options: { deferConsumers?: BusinessEventDispatchOptions["deferConsumers"] } = {}) {
  const normalizedToken = token.trim();
  if (!normalizedToken) return false;
  const hash = tokenHash(normalizedToken);
  const now = new Date();
  return runBusinessEventTransaction(async (tx, delivery) => {
    const request = await tx.purchaseRequest.findFirst({
      where: { emailVerificationTokenHash: hash, emailVerificationExpiresAt: { gt: now }, emailVerifiedAt: null },
      select: { id: true, reference: true, customerEmail: true },
    });
    if (!request) return false;
    const updated = await tx.purchaseRequest.updateMany({
      where: { id: request.id, emailVerificationTokenHash: hash, emailVerifiedAt: null },
      data: {
        emailVerificationStatus: "VERIFIED", emailVerifiedAt: now,
        emailVerificationTokenHash: null, emailVerificationExpiresAt: null, emailDeliveryFailedAt: null,
      },
    });
    if (!updated.count) return false;
    await tx.purchaseRequestActivity.create({
      data: { purchaseRequestId: request.id, type: "NOTE", note: "Khách hàng đã xác minh địa chỉ email." },
    });
    delivery.track(await emitPurchaseRequestBusinessEvent(tx, {
      eventKey: "purchase_request.email_verified", eventInstanceId: hash,
      purchaseRequestId: request.id, reference: request.reference,
      customerEmail: request.customerEmail ?? undefined, occurredAt: now,
    }));
    return true;
  }, { deferConsumers: options.deferConsumers, allowNoEvents: true });
}
