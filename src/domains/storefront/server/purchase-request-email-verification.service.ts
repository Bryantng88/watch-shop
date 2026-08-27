import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/server/db/client";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1_000;
const RESEND_COOLDOWN_MS = 60 * 1_000;

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function storefrontOrigin(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (fallbackOrigin) return new URL(fallbackOrigin).origin;
  throw new Error("STOREFRONT_EMAIL_ORIGIN_NOT_CONFIGURED");
}

async function deliverVerificationEmail(input: {
  to: string;
  customerName: string;
  reference: string;
  verificationUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.STOREFRONT_EMAIL_FROM?.trim();
  if (!apiKey || !from) throw new Error("STOREFRONT_EMAIL_NOT_CONFIGURED");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Xác nhận email cho yêu cầu ${input.reference}`,
      html: `<p>Xin chào ${escapeHtml(input.customerName)},</p><p>Vui lòng xác nhận địa chỉ email cho yêu cầu mua hàng <strong>${escapeHtml(input.reference)}</strong>.</p><p><a href="${escapeHtml(input.verificationUrl)}">Xác nhận email</a></p><p>Liên kết có hiệu lực trong 24 giờ. Nếu bạn không gửi yêu cầu này, hãy bỏ qua email.</p>`,
    }),
  });
  if (!response.ok) throw new Error(`STOREFRONT_EMAIL_DELIVERY_FAILED:${response.status}`);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);
}

export async function sendPurchaseRequestVerificationEmail(
  purchaseRequestId: string,
  options: { fallbackOrigin?: string; enforceCooldown?: boolean } = {},
) {
  const request = await prisma.purchaseRequest.findUnique({
    where: { id: purchaseRequestId },
    select: { id: true, reference: true, customerName: true, customerEmail: true, emailVerifiedAt: true, emailVerificationSentAt: true },
  });
  if (!request?.customerEmail) throw new Error("PURCHASE_REQUEST_EMAIL_MISSING");
  if (request.emailVerifiedAt) return { status: "VERIFIED" as const };
  if (options.enforceCooldown && request.emailVerificationSentAt && Date.now() - request.emailVerificationSentAt.getTime() < RESEND_COOLDOWN_MS) {
    throw new Error("EMAIL_VERIFICATION_RESEND_TOO_SOON");
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  await prisma.purchaseRequest.update({
    where: { id: request.id },
    data: {
      emailVerificationStatus: "PENDING",
      emailVerificationTokenHash: tokenHash(token),
      emailVerificationExpiresAt: expiresAt,
      emailVerificationSentAt: new Date(),
      emailDeliveryFailedAt: null,
    },
  });

  try {
    const verificationUrl = `${storefrontOrigin(options.fallbackOrigin)}/api/public/orders/verify-email?token=${encodeURIComponent(token)}`;
    await deliverVerificationEmail({ to: request.customerEmail, customerName: request.customerName, reference: request.reference, verificationUrl });
    await prisma.purchaseRequestActivity.create({
      data: { purchaseRequestId: request.id, type: "NOTE", note: "Đã gửi email xác minh tới khách hàng." },
    });
    return { status: "PENDING" as const };
  } catch (error) {
    await prisma.$transaction([
      prisma.purchaseRequest.update({
        where: { id: request.id },
        data: { emailVerificationStatus: "DELIVERY_FAILED", emailDeliveryFailedAt: new Date() },
      }),
      prisma.purchaseRequestActivity.create({
        data: { purchaseRequestId: request.id, type: "NOTE", note: "Không thể gửi email xác minh tới khách hàng." },
      }),
    ]);
    throw error;
  }
}

export async function verifyPurchaseRequestEmail(token: string) {
  const normalizedToken = token.trim();
  if (!normalizedToken) return false;
  const now = new Date();
  const request = await prisma.purchaseRequest.findFirst({
    where: {
      emailVerificationTokenHash: tokenHash(normalizedToken),
      emailVerificationExpiresAt: { gt: now },
      emailVerifiedAt: null,
    },
    select: { id: true },
  });
  if (!request) return false;
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.purchaseRequest.updateMany({
      where: { id: request.id, emailVerifiedAt: null },
      data: {
        emailVerificationStatus: "VERIFIED",
        emailVerifiedAt: now,
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
        emailDeliveryFailedAt: null,
      },
    });
    if (result.count) {
      await tx.purchaseRequestActivity.create({
        data: { purchaseRequestId: request.id, type: "NOTE", note: "Khách hàng đã xác minh địa chỉ email." },
      });
    }
    return result.count;
  });
  return updated === 1;
}
