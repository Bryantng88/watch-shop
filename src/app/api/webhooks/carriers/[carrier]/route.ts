import { NextRequest, NextResponse } from "next/server";
import { receiveCarrierWebhook, type CarrierCode } from "@/domains/shipment/server";

export async function POST(request: NextRequest, context: { params: Promise<{ carrier: string }> }) {
  try {
    const carrierCode = (await context.params).carrier.toUpperCase();
    const supported: CarrierCode[] = ["MOCK", "GHN", "GHTK", "VIETTEL_POST", "AHAMOVE"];
    if (!supported.includes(carrierCode as CarrierCode)) {
      return NextResponse.json({ error: "UNSUPPORTED_CARRIER" }, { status: 404 });
    }
    const rawBody = await request.text();
    const result = await receiveCarrierWebhook({ carrierCode: carrierCode as CarrierCode, rawBody, signature: request.headers.get("x-carrier-webhook-secret") });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "CARRIER_WEBHOOK_FAILED";
    return NextResponse.json({ error: message }, { status: message === "INVALID_CARRIER_WEBHOOK_SIGNATURE" ? 401 : 400 });
  }
}
