import assert from "node:assert/strict";
import test from "node:test";
import { ViettelPostCarrierAdapter } from "./viettel-post.adapter";
import type { CarrierShipmentInput } from "./carrier.types";

const input: CarrierShipmentInput = {
  shipmentId: "shipment-1",
  clientOrderCode: "LOCAL-001",
  recipient: { name: "Khách test", phone: "0900000000", address: "1 Nguyễn Huệ", ward: "Bến Nghé", district: "Quận 1", city: "Hồ Chí Minh" },
  parcel: { weightGram: 700, lengthCm: 22, widthCm: 18, heightCm: 12, itemCount: 1, declaredValue: 5_000_000, contentDescription: "Đồng hồ test" },
  codAmount: 0,
  feePayer: "BUSINESS",
};

test("Viettel Post adapter selects a service and maps the total quote", async () => {
  Object.assign(process.env, {
    CARRIER_ENVIRONMENT: "staging",
    VIETTEL_POST_BASE_URL: "https://partnerdev.viettelpost.vn",
    VIETTEL_POST_TOKEN: "test-token",
    VIETTEL_POST_SENDER_ADDRESS: "1 Lê Lợi, Bến Nghé, Quận 1, Hồ Chí Minh",
  });
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    const data = calls.length === 1
      ? [{ MA_DV_CHINH: "VCN", GIA_CUOC: 30_000 }]
      : { MONEY_TOTAL: 35_000, MONEY_TOTAL_FEE: 31_000, MONEY_VAS: 4_000, KPI_HT: 48 };
    return new Response(JSON.stringify({ status: 200, error: false, data }), { status: 200 });
  };
  try {
    const quote = await new ViettelPostCarrierAdapter().quote(input);
    assert.equal(quote.shippingFee, 35_000);
    assert.equal(quote.insuranceFee, 4_000);
    assert.equal(quote.serviceCode, "VCN");
    assert.deepEqual(calls, [
      "https://partnerdev.viettelpost.vn/v2/order/getPriceAllNlp",
      "https://partnerdev.viettelpost.vn/v2/order/getPriceNlp",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
