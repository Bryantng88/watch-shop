import { createHash } from "node:crypto";
import { CarrierChargeKind, CarrierRequestStatus, CarrierSettlementStatus, CarrierWebhookStatus, Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { carrierEnvironment } from "./carrier.config";
import { getCarrierAdapter } from "./carrier.registry";
import type { CarrierCode, CarrierShipmentInput, CarrierTracking } from "./carrier.types";

const json = (value: unknown) => value as Prisma.InputJsonValue;

async function integrationInput(shipmentId: string): Promise<CarrierShipmentInput> {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { packages: { orderBy: { createdAt: "asc" }, take: 1 }, order: { select: { refNo: true, customerName: true, subtotal: true, paymentMethod: true } } },
  });
  if (!shipment) throw new Error("SHIPMENT_NOT_FOUND");
  if (!shipment.shipPhone || !shipment.shipAddress || !shipment.shipCity) throw new Error("SHIPMENT_RECIPIENT_INCOMPLETE");
  const parcel = shipment.packages[0] ?? await prisma.shipmentPackage.create({
    data: { shipmentId, weightGram: 500, lengthCm: 20, widthCm: 15, heightCm: 10, itemCount: 1, declaredValue: shipment.order.subtotal, contentDescription: "Đồng hồ" },
  });
  return {
    shipmentId,
    clientOrderCode: shipment.refNo ?? shipment.order.refNo ?? shipment.id,
    recipient: { name: shipment.customerName ?? shipment.order.customerName ?? "Khách hàng", phone: shipment.shipPhone, address: shipment.shipAddress, city: shipment.shipCity, district: shipment.shipDistrict ?? "", ward: shipment.shipWard ?? "" },
    parcel: { weightGram: parcel.weightGram, lengthCm: parcel.lengthCm ?? undefined, widthCm: parcel.widthCm ?? undefined, heightCm: parcel.heightCm ?? undefined, itemCount: parcel.itemCount, declaredValue: Number(parcel.declaredValue ?? shipment.order.subtotal ?? 0), contentDescription: parcel.contentDescription ?? "Đồng hồ" },
    codAmount: String(shipment.order.paymentMethod) === "COD" ? Number(shipment.order.subtotal ?? 0) : 0,
    feePayer: shipment.shippingFeePayer === "CUSTOMER" ? "CUSTOMER" : "BUSINESS",
  };
}

async function upsertCharges(shipmentId: string, quote: { shippingFee: number; insuranceFee: number }, settlementStatus: CarrierSettlementStatus) {
  const charges = [[CarrierChargeKind.SHIPPING, quote.shippingFee], [CarrierChargeKind.INSURANCE, quote.insuranceFee]] as const;
  for (const [kind, amount] of charges) {
    await prisma.carrierCharge.upsert({
      where: { shipmentId_kind: { shipmentId, kind } },
      create: { shipmentId, kind, estimatedAmount: amount, ...(settlementStatus !== CarrierSettlementStatus.ESTIMATED ? { chargedAmount: amount } : {}), settlementStatus },
      update: { estimatedAmount: amount, ...(settlementStatus !== CarrierSettlementStatus.ESTIMATED ? { chargedAmount: amount } : {}), settlementStatus, updatedAt: new Date() },
    });
  }
}

export async function quoteCarrierShipment(shipmentId: string, code: CarrierCode = "MOCK") {
  const input = await integrationInput(shipmentId);
  const adapter = getCarrierAdapter(code);
  const quote = await adapter.quote(input);
  await upsertCharges(shipmentId, quote, CarrierSettlementStatus.ESTIMATED);
  return { ...quote, raw: undefined };
}

export async function createCarrierOrder(shipmentId: string, code: CarrierCode = "MOCK") {
  const input = await integrationInput(shipmentId);
  const adapter = getCarrierAdapter(code);
  const environment = adapter.environment;
  const idempotencyKey = `carrier:create:${environment}:${code}:${shipmentId}`;
  const existing = await prisma.carrierRequest.findUnique({ where: { idempotencyKey } });
  if (existing?.status === CarrierRequestStatus.SUCCEEDED) return getCarrierIntegrationDetail(shipmentId);
  const request = await prisma.carrierRequest.upsert({
    where: { idempotencyKey },
    create: { shipmentId, carrierCode: code, environment, operation: "CREATE_ORDER", idempotencyKey, requestJson: json(input), status: CarrierRequestStatus.PROCESSING, attemptCount: 1 },
    update: { status: CarrierRequestStatus.PROCESSING, attemptCount: { increment: 1 }, errorCode: null, errorMessage: null },
  });
  try {
    const order = await adapter.createOrder(input);
    await prisma.$transaction([
      prisma.carrierRequest.update({ where: { id: request.id }, data: { status: CarrierRequestStatus.SUCCEEDED, responseJson: json(order.raw), externalOrderCode: order.externalOrderCode, httpStatus: 200, completedAt: new Date() } }),
      prisma.shipment.update({ where: { id: shipmentId }, data: { carrier: code, carrierCode: code, carrierEnvironment: environment, externalOrderCode: order.externalOrderCode, trackingCode: order.trackingCode, carrierStatus: order.externalStatus, carrierStatusText: order.statusText, carrierCreatedAt: order.createdAt, carrierSyncedAt: new Date(), estimatedDeliveryAt: order.estimatedDeliveryAt } }),
      prisma.carrierStatusHistory.create({ data: { shipmentId, carrierCode: code, externalStatus: order.externalStatus, normalizedStatus: "READY", description: order.statusText, occurredAt: order.createdAt, payloadJson: json(order.raw) } }),
    ]);
    await upsertCharges(shipmentId, order, CarrierSettlementStatus.ACCRUED);
    return getCarrierIntegrationDetail(shipmentId);
  } catch (error) {
    await prisma.carrierRequest.update({ where: { id: request.id }, data: { status: CarrierRequestStatus.FAILED, errorMessage: error instanceof Error ? error.message : "CARRIER_CREATE_FAILED", completedAt: new Date() } });
    throw error;
  }
}

async function applyTracking(shipmentId: string, code: string, tracking: CarrierTracking) {
  await prisma.$transaction(async (tx) => {
    await tx.carrierStatusHistory.upsert({
      where: { shipmentId_carrierCode_externalStatus_occurredAt: { shipmentId, carrierCode: code, externalStatus: tracking.externalStatus, occurredAt: tracking.occurredAt } },
      create: { shipmentId, carrierCode: code, externalStatus: tracking.externalStatus, normalizedStatus: tracking.normalizedStatus, description: tracking.statusText, location: tracking.location, occurredAt: tracking.occurredAt, payloadJson: json(tracking.raw) },
      update: {},
    });
    // Carrier tracking is an external observation. Do not transition the
    // Shipment aggregate here: domain commands own Order/Payment/Inventory
    // side effects and staff confirmation remains required in this first cut.
    await tx.shipment.update({ where: { id: shipmentId }, data: { carrierStatus: tracking.externalStatus, carrierStatusText: tracking.statusText, carrierSyncedAt: new Date(), estimatedDeliveryAt: tracking.estimatedDeliveryAt } });
  });
}

export async function syncCarrierShipment(shipmentId: string) {
  const shipment = await prisma.shipment.findUniqueOrThrow({ where: { id: shipmentId } });
  if (!shipment.carrierCode || !shipment.externalOrderCode) throw new Error("CARRIER_ORDER_NOT_CREATED");
  const adapter = getCarrierAdapter(shipment.carrierCode as CarrierCode);
  const tracking = await adapter.track(shipment.externalOrderCode);
  await applyTracking(shipmentId, shipment.carrierCode, tracking);
  return getCarrierIntegrationDetail(shipmentId);
}

export async function getCarrierIntegrationDetail(shipmentId: string) {
  return prisma.shipment.findUniqueOrThrow({ where: { id: shipmentId }, include: { packages: true, carrierCharges: { orderBy: { kind: "asc" } }, carrierRequests: { orderBy: { requestedAt: "desc" }, take: 10 }, carrierStatusHistory: { orderBy: { occurredAt: "desc" }, take: 30 } } });
}

export async function simulateMockCarrierWebhook(shipmentId: string) {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_CARRIER_TEST_UI !== "1") {
    throw new Error("CARRIER_SIMULATOR_DISABLED");
  }
  const shipment = await prisma.shipment.findUniqueOrThrow({ where: { id: shipmentId } });
  if (shipment.carrierCode !== "MOCK" || !shipment.externalOrderCode) {
    throw new Error("MOCK_CARRIER_ORDER_NOT_CREATED");
  }
  const steps = ["READY_TO_PICK", "PICKING", "TRANSPORTING", "DELIVERING", "DELIVERED"];
  const current = steps.indexOf(shipment.carrierStatus ?? "");
  const status = steps[Math.min(Math.max(current + 1, 1), steps.length - 1)];
  const rawBody = JSON.stringify({
    eventId: crypto.randomUUID(),
    externalOrderCode: shipment.externalOrderCode,
    status,
    normalizedStatus: status === "DELIVERED" ? "DELIVERED" : "SHIPPED",
    statusText: `Webhook test: ${status}`,
    occurredAt: new Date().toISOString(),
  });
  const secret = process.env.CARRIER_WEBHOOK_SECRET ?? "local-carrier-webhook";
  await receiveCarrierWebhook({ carrierCode: "MOCK", rawBody, signature: secret });
  return getCarrierIntegrationDetail(shipmentId);
}

export async function receiveCarrierWebhook(input: { carrierCode: CarrierCode; rawBody: string; signature: string | null }) {
  const environment = carrierEnvironment();
  const expected = process.env.CARRIER_WEBHOOK_SECRET ?? (environment === "mock" ? "local-carrier-webhook" : "");
  const signatureValid = Boolean(expected && input.signature === expected);
  if (!signatureValid) throw new Error("INVALID_CARRIER_WEBHOOK_SIGNATURE");
  const payload = JSON.parse(input.rawBody) as Record<string, unknown>;
  const externalOrderCode = String(payload.externalOrderCode ?? payload.order_code ?? "").trim();
  const externalStatus = String(payload.status ?? "").trim();
  if (!externalOrderCode || !externalStatus) throw new Error("INVALID_CARRIER_WEBHOOK_PAYLOAD");
  const hash = createHash("sha256").update(input.rawBody).digest("hex");
  const delivery = await prisma.carrierWebhookDelivery.upsert({
    where: { carrierCode_environment_payloadHash: { carrierCode: input.carrierCode, environment, payloadHash: hash } },
    create: { carrierCode: input.carrierCode, environment, externalEventId: typeof payload.eventId === "string" ? payload.eventId : null, externalOrderCode, payloadHash: hash, payloadJson: json(payload), signatureValid, status: CarrierWebhookStatus.RECEIVED },
    update: {},
  });
  if (delivery.status === CarrierWebhookStatus.PROCESSED) return { duplicate: true };
  const shipment = await prisma.shipment.findFirst({ where: { carrierCode: input.carrierCode, carrierEnvironment: environment, externalOrderCode } });
  if (!shipment) {
    await prisma.carrierWebhookDelivery.update({ where: { id: delivery.id }, data: { status: CarrierWebhookStatus.IGNORED, processedAt: new Date(), errorMessage: "SHIPMENT_NOT_FOUND" } });
    return { ignored: true };
  }
  const normalizedStatus = String(payload.normalizedStatus ?? (externalStatus === "DELIVERED" ? "DELIVERED" : "SHIPPED"));
  await applyTracking(shipment.id, input.carrierCode, { externalOrderCode, externalStatus, normalizedStatus, statusText: String(payload.statusText ?? externalStatus), occurredAt: payload.occurredAt ? new Date(String(payload.occurredAt)) : new Date(), location: typeof payload.location === "string" ? payload.location : undefined, raw: payload });
  await prisma.carrierWebhookDelivery.update({ where: { id: delivery.id }, data: { status: CarrierWebhookStatus.PROCESSED, processedAt: new Date() } });
  return { processed: true, shipmentId: shipment.id };
}
