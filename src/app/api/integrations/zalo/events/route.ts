import { after, NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { zaloIngressEventSchema } from "@/domains/storefront/contracts";
import { processZaloIngressEvent, verifyZaloIngress } from "@/domains/storefront/server";

export const runtime = "nodejs";

function errorResponse(error: unknown, eventId: string | null) {
  const message = error instanceof Error ? error.message : "";
  if (error instanceof ZodError) return { status: 400, code: "INVALID_EVENT" };
  if (error instanceof SyntaxError) return { status: 400, code: "INVALID_EVENT" };
  if (message === "ZALO_AUTH_EXPIRED") return { status: 401, code: "AUTH_EXPIRED" };
  if (message === "ZALO_AUTH_INVALID") return { status: 401, code: "AUTH_INVALID" };
  if (message === "ZALO_EVENT_CONFLICT") return { status: 409, code: "EVENT_CONFLICT" };
  if (message === "ZALO_EVENT_REPLAYED") return { status: 409, code: "EVENT_REPLAYED" };
  if (message === "ZALO_EVENT_IN_PROGRESS") return { status: 409, code: "EVENT_IN_PROGRESS" };
  if (message === "PUBLIC_ORDER_PRODUCT_UNAVAILABLE") return { status: 409, code: "PRODUCT_UNAVAILABLE" };
  console.error("[zalo-ingress] event failed", { eventId, error: message.slice(0, 160) || "UNKNOWN" });
  return { status: 500, code: "INTEGRATION_FAILED" };
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const body = await req.text();
  if (Buffer.byteLength(body, "utf8") > 64 * 1_024) {
    return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE" } }, { status: 413 });
  }

  let eventId: string | null = null;
  try {
    const verified = verifyZaloIngress({
      method: req.method,
      pathAndQuery: `${req.nextUrl.pathname}${req.nextUrl.search}`,
      body,
      headers: {
        keyId: req.headers.get("x-watchshop-key-id") ?? "",
        timestamp: req.headers.get("x-watchshop-timestamp") ?? "",
        nonce: req.headers.get("x-watchshop-nonce") ?? "",
        signature: req.headers.get("x-watchshop-signature") ?? "",
      },
    });
    const event = zaloIngressEventSchema.parse(JSON.parse(body));
    eventId = event.eventId;
    const result = await processZaloIngressEvent({
      event,
      ...verified,
      runtime: { deferConsumers: (work) => after(work) },
    });
    console.info("[zalo-ingress] accepted", {
      eventId,
      eventType: event.type,
      replayed: result.replayed,
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({ ok: true, eventId, replayed: result.replayed, data: result.response });
  } catch (error) {
    const response = errorResponse(error, eventId);
    return NextResponse.json({ error: { code: response.code }, eventId }, { status: response.status });
  }
}
