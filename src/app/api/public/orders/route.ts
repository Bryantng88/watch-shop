import { randomUUID } from "node:crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { PublicOrderProductsUnavailableError, submitPublicOrder } from "@/domains/storefront/server";
import { STOREFRONT_INTERNAL_COOKIE } from "@/domains/analytics/storefront/storefront-analytics.shared";

function fingerprint(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || req.headers.get("x-real-ip") || "unknown";
  return `${address}|${req.headers.get("user-agent") ?? "unknown"}`;
}

function publicError(error: unknown) {
  if (error instanceof ZodError) return { status: 400, code: "INVALID_REQUEST" };
  const message = error instanceof Error ? error.message : "";
  if (message === "PUBLIC_ORDER_IDEMPOTENCY_CONFLICT") return { status: 409, code: message };
  if (message === "PUBLIC_ORDER_RATE_LIMITED") return { status: 429, code: message };
  if (message === "PUBLIC_ORDER_PRODUCT_UNAVAILABLE") return { status: 409, code: message };
  if (message === "PUBLIC_ORDER_TOO_MANY_ITEMS") return { status: 409, code: message };
  if (message === "PUBLIC_ORDER_BOT_REJECTED") return { status: 400, code: "INVALID_REQUEST" };
  if (message === "PUBLIC_ORDER_PHONE_INVALID") return { status: 400, code: "INVALID_REQUEST" };
  return { status: 400, code: "ORDER_NOT_ACCEPTED" };
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const isHtmlForm = req.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ||
    req.headers.get("content-type")?.includes("multipart/form-data");
  const form = isHtmlForm ? await req.formData() : null;
  const idempotencyKey = req.headers.get("idempotency-key") ||
    (form ? String(form.get("idempotencyKey") || randomUUID()) : null);
  if (!idempotencyKey) {
    return NextResponse.json({ error: { code: "IDEMPOTENCY_KEY_REQUIRED" } }, { status: 400 });
  }

  try {
    const request = form
      ? {
          customerName: form.get("customerName"),
          customerEmail: form.get("customerEmail"),
          phone: form.get("phone"),
          contactPreference: form.get("contactPreference"),
          contactHandle: form.get("contactHandle") || undefined,
          address: form.get("address") || undefined,
          note: form.get("note") || undefined,
          website: form.get("website") || undefined,
          items: form.getAll("productId").map((productId) => ({ productId, quantity: 1 })),
        }
      : await req.json();
    const result = await submitPublicOrder(
      { request, idempotencyKey, channel: "STOREFRONT" },
      { fingerprint: fingerprint(req), analyticsInternal: req.cookies.get(STOREFRONT_INTERNAL_COOKIE)?.value === "1", runtime: { deferConsumers: (work) => after(work) } },
    );
    console.info("[storefront-purchase-request] accepted", {
      requestId: result.requestId,
      reference: result.reference,
      replayed: result.replayed,
      durationMs: Date.now() - startedAt,
    });
    if (form) {
      const params = new URLSearchParams({
        reference: result.reference,
        disposition: result.disposition,
        added: String(result.addedItemCount),
      });
      return NextResponse.redirect(
        new URL(`/request?${params.toString()}`, req.url),
        303,
      );
    }
    return NextResponse.json(result, { status: result.replayed ? 200 : 201 });
  } catch (error) {
    const response = publicError(error);
    if (response.code === "ORDER_NOT_ACCEPTED") console.error("Create public order failed", error);
    if (form) {
      return NextResponse.redirect(
        new URL(`/request?error=${encodeURIComponent(response.code)}`, req.url),
        303,
      );
    }
    return NextResponse.json({
      error: {
        code: response.code,
        ...(error instanceof PublicOrderProductsUnavailableError
          ? { unavailableProductIds: error.productIds }
          : {}),
      },
    }, { status: response.status });
  }
}
