import { NextRequest, NextResponse } from "next/server";
import { createCarrierOrder, getCarrierIntegrationDetail, quoteCarrierShipment, simulateMockCarrierWebhook, syncCarrierShipment, type CarrierCode } from "@/domains/shipment/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try { return NextResponse.json(await getCarrierIntegrationDetail((await context.params).id)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "CARRIER_DETAIL_FAILED" }, { status: 400 }); }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const shipmentId = (await context.params).id;
    const body = await request.json().catch(() => ({}));
    const action = String(body.action ?? "");
    const carrierCode = String(body.carrierCode ?? "MOCK").toUpperCase() as CarrierCode;
    if (action === "quote") return NextResponse.json(await quoteCarrierShipment(shipmentId, carrierCode));
    if (action === "create") return NextResponse.json(await createCarrierOrder(shipmentId, carrierCode));
    if (action === "sync") return NextResponse.json(await syncCarrierShipment(shipmentId));
    if (action === "simulate") return NextResponse.json(await simulateMockCarrierWebhook(shipmentId));
    return NextResponse.json({ error: "INVALID_CARRIER_ACTION" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "CARRIER_ACTION_FAILED" }, { status: 400 });
  }
}
