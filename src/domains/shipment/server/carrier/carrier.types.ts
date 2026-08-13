export type CarrierEnvironment = "mock" | "staging" | "production";
export type CarrierCode = "MOCK" | "GHN" | "GHTK" | "VIETTEL_POST" | "AHAMOVE";

export type CarrierShipmentInput = {
  shipmentId: string;
  clientOrderCode: string;
  recipient: { name: string; phone: string; address: string; city: string; district: string; ward: string };
  parcel: { weightGram: number; lengthCm?: number; widthCm?: number; heightCm?: number; itemCount: number; declaredValue: number; contentDescription: string };
  codAmount: number;
  feePayer: "BUSINESS" | "CUSTOMER";
};

export type CarrierQuote = { shippingFee: number; insuranceFee: number; currency: "VND"; serviceCode: string; estimatedDeliveryAt: Date | null; raw: unknown };
export type CarrierOrder = CarrierQuote & { externalOrderCode: string; trackingCode: string; externalStatus: string; statusText: string; createdAt: Date; raw: unknown };
export type CarrierTracking = { externalOrderCode: string; externalStatus: string; normalizedStatus: string; statusText: string; occurredAt: Date; location?: string; estimatedDeliveryAt?: Date | null; raw: unknown };

export interface CarrierAdapter {
  readonly code: CarrierCode;
  readonly environment: CarrierEnvironment;
  quote(input: CarrierShipmentInput): Promise<CarrierQuote>;
  createOrder(input: CarrierShipmentInput): Promise<CarrierOrder>;
  track(externalOrderCode: string): Promise<CarrierTracking>;
  cancel(externalOrderCode: string): Promise<{ success: boolean; raw: unknown }>;
}
