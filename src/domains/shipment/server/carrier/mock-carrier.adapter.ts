import type { CarrierAdapter, CarrierOrder, CarrierShipmentInput, CarrierTracking } from "./carrier.types";

const states = ["READY_TO_PICK", "PICKING", "TRANSPORTING", "DELIVERING", "DELIVERED"] as const;
const memoryState = new Map<string, number>();

function quoteFor(input: CarrierShipmentInput) {
  const shippingFee = 25_000 + Math.ceil(input.parcel.weightGram / 500) * 5_000;
  const insuranceFee = input.parcel.declaredValue > 3_000_000 ? Math.round(input.parcel.declaredValue * 0.005) : 0;
  return { shippingFee, insuranceFee, currency: "VND" as const, serviceCode: "MOCK_STANDARD", estimatedDeliveryAt: new Date(Date.now() + 2 * 86_400_000), raw: { simulator: true } };
}

export class MockCarrierAdapter implements CarrierAdapter {
  readonly code = "MOCK" as const;
  readonly environment = "mock" as const;
  async quote(input: CarrierShipmentInput) { return quoteFor(input); }
  async createOrder(input: CarrierShipmentInput): Promise<CarrierOrder> {
    const externalOrderCode = `MOCK-${input.clientOrderCode}-${Date.now().toString(36).toUpperCase()}`;
    memoryState.set(externalOrderCode, 0);
    return { ...quoteFor(input), externalOrderCode, trackingCode: externalOrderCode, externalStatus: states[0], statusText: "Đã tạo vận đơn test", createdAt: new Date(), raw: { simulator: true, externalOrderCode } };
  }
  async track(externalOrderCode: string): Promise<CarrierTracking> {
    const current = Math.min((memoryState.get(externalOrderCode) ?? 0) + 1, states.length - 1);
    memoryState.set(externalOrderCode, current);
    const externalStatus = states[current];
    return { externalOrderCode, externalStatus, normalizedStatus: externalStatus === "DELIVERED" ? "DELIVERED" : "SHIPPED", statusText: externalStatus.replaceAll("_", " "), occurredAt: new Date(), raw: { simulator: true, step: current } };
  }
  async cancel(externalOrderCode: string) { memoryState.delete(externalOrderCode); return { success: true, raw: { simulator: true } }; }
}
