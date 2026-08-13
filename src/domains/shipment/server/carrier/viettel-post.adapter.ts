import { assertSafeCarrierBaseUrl, carrierEnvironment } from "./carrier.config";
import type { CarrierAdapter, CarrierOrder, CarrierQuote, CarrierShipmentInput, CarrierTracking } from "./carrier.types";

type ViettelPostEnvelope<T> = { status?: number; error?: boolean; message?: string; data?: T };
type ViettelPostPrice = {
  MONEY_TOTAL?: number;
  MONEY_TOTAL_FEE?: number;
  MONEY_VAS?: number;
  MONEY_COLLECTION_FEE?: number;
  KPI_HT?: number;
};
type ViettelPostService = { MA_DV_CHINH?: string; TEN_DICHVU?: string; GIA_CUOC?: number; THOI_GIAN?: string };

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`CARRIER_CONFIGURATION_MISSING:${name}`);
  return value;
}

function fullRecipientAddress(input: CarrierShipmentInput) {
  return [input.recipient.address, input.recipient.ward, input.recipient.district, input.recipient.city].filter(Boolean).join(", ");
}

export class ViettelPostCarrierAdapter implements CarrierAdapter {
  readonly code = "VIETTEL_POST" as const;
  readonly environment = carrierEnvironment();
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = assertSafeCarrierBaseUrl(
      process.env.VIETTEL_POST_BASE_URL?.trim() || "https://partnerdev.viettelpost.vn",
      this.environment,
    );
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Token: required("VIETTEL_POST_TOKEN") },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
    const envelope = await response.json() as ViettelPostEnvelope<T>;
    if (!response.ok || envelope.error || !envelope.data) {
      throw new Error(`VIETTEL_POST_API_ERROR:${envelope.message ?? response.status}`);
    }
    return envelope.data;
  }

  private common(input: CarrierShipmentInput) {
    return {
      SENDER_ADDRESS: required("VIETTEL_POST_SENDER_ADDRESS"),
      RECEIVER_ADDRESS: fullRecipientAddress(input),
      PRODUCT_TYPE: "HH",
      PRODUCT_WEIGHT: input.parcel.weightGram,
      PRODUCT_PRICE: Math.round(input.parcel.declaredValue),
      MONEY_COLLECTION: Math.round(input.codAmount),
      PRODUCT_LENGTH: input.parcel.lengthCm ?? 0,
      PRODUCT_WIDTH: input.parcel.widthCm ?? 0,
      PRODUCT_HEIGHT: input.parcel.heightCm ?? 0,
      NATIONAL_TYPE: 1,
    };
  }

  private async service(input: CarrierShipmentInput) {
    const services = await this.post<ViettelPostService[]>("/v2/order/getPriceAllNlp", { ...this.common(input), TYPE: 1 });
    const configured = process.env.VIETTEL_POST_SERVICE_CODE?.trim();
    const selected = services.find((item) => item.MA_DV_CHINH === configured) ?? services[0];
    if (!selected?.MA_DV_CHINH) throw new Error("VIETTEL_POST_SERVICE_NOT_AVAILABLE");
    return { ...selected, MA_DV_CHINH: selected.MA_DV_CHINH };
  }

  async quote(input: CarrierShipmentInput): Promise<CarrierQuote> {
    const service = await this.service(input);
    const price = await this.post<ViettelPostPrice>("/v2/order/getPriceNlp", {
      ...this.common(input),
      ORDER_SERVICE: service.MA_DV_CHINH,
      ORDER_SERVICE_ADD: process.env.VIETTEL_POST_SERVICE_ADD?.trim() || "",
    });
    const hours = Number(price.KPI_HT ?? 0);
    return {
      shippingFee: Number(price.MONEY_TOTAL ?? service.GIA_CUOC ?? 0),
      insuranceFee: Number(price.MONEY_VAS ?? 0),
      currency: "VND",
      serviceCode: service.MA_DV_CHINH,
      estimatedDeliveryAt: hours > 0 ? new Date(Date.now() + hours * 3_600_000) : null,
      raw: { service, price },
    };
  }

  async createOrder(input: CarrierShipmentInput): Promise<CarrierOrder> {
    const quote = await this.quote(input);
    const data = await this.post<Record<string, unknown>>("/v2/order/createOrderNlp", {
      ORDER_NUMBER: input.clientOrderCode,
      SENDER_FULLNAME: required("VIETTEL_POST_SENDER_NAME"),
      SENDER_ADDRESS: required("VIETTEL_POST_SENDER_ADDRESS"),
      SENDER_PHONE: required("VIETTEL_POST_SENDER_PHONE"),
      RECEIVER_FULLNAME: input.recipient.name,
      RECEIVER_ADDRESS: fullRecipientAddress(input),
      RECEIVER_PHONE: input.recipient.phone,
      PRODUCT_NAME: input.parcel.contentDescription,
      PRODUCT_DESCRIPTION: input.parcel.contentDescription,
      PRODUCT_QUANTITY: input.parcel.itemCount,
      PRODUCT_PRICE: Math.round(input.parcel.declaredValue),
      PRODUCT_WEIGHT: input.parcel.weightGram,
      PRODUCT_LENGTH: input.parcel.lengthCm ?? 0,
      PRODUCT_WIDTH: input.parcel.widthCm ?? 0,
      PRODUCT_HEIGHT: input.parcel.heightCm ?? 0,
      ORDER_PAYMENT: input.feePayer === "BUSINESS" ? 3 : 2,
      ORDER_SERVICE: quote.serviceCode,
      ORDER_SERVICE_ADD: process.env.VIETTEL_POST_SERVICE_ADD?.trim() || null,
      ORDER_NOTE: "Đơn thử nghiệm tích hợp API",
      MONEY_COLLECTION: Math.round(input.codAmount),
      EXTRA_MONEY: 0,
      CHECK_UNIQUE: true,
      PRODUCT_DETAIL: [{ PRODUCT_NAME: input.parcel.contentDescription, PRODUCT_QUANTITY: input.parcel.itemCount, PRODUCT_PRICE: Math.round(input.parcel.declaredValue), PRODUCT_WEIGHT: input.parcel.weightGram }],
    });
    const externalOrderCode = String(data.ORDER_NUMBER ?? data.ORDER_CODE ?? data.orderNumber ?? "").trim();
    if (!externalOrderCode) throw new Error("VIETTEL_POST_CREATE_RESPONSE_INVALID");
    return { ...quote, externalOrderCode, trackingCode: externalOrderCode, externalStatus: "CREATED", statusText: "Đã tạo vận đơn Viettel Post test", createdAt: new Date(), raw: data };
  }

  async track(_externalOrderCode: string): Promise<CarrierTracking> {
    void _externalOrderCode;
    throw new Error("VIETTEL_POST_TRACKING_API_PENDING_ACCOUNT_DOCUMENTATION");
  }

  async cancel(_externalOrderCode: string): Promise<{ success: boolean; raw: unknown }> {
    void _externalOrderCode;
    throw new Error("VIETTEL_POST_CANCEL_API_PENDING_ACCOUNT_DOCUMENTATION");
  }
}
