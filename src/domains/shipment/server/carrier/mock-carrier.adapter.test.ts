import assert from "node:assert/strict";
import test from "node:test";
import { MockCarrierAdapter } from "./mock-carrier.adapter";
import type { CarrierShipmentInput } from "./carrier.types";

const input: CarrierShipmentInput = { shipmentId: "shipment", clientOrderCode: "SH-TEST", recipient: { name: "Test", phone: "0900000000", address: "1 Test", city: "HCM", district: "Q1", ward: "Ben Nghe" }, parcel: { weightGram: 500, itemCount: 1, declaredValue: 25_000_000, contentDescription: "Watch" }, codAmount: 0, feePayer: "BUSINESS" };

test("mock quote separates shipping and insurance charges", async () => {
  const quote = await new MockCarrierAdapter().quote(input);
  assert.equal(quote.shippingFee, 30_000);
  assert.equal(quote.insuranceFee, 125_000);
});

test("mock order returns a trackable external identity", async () => {
  const adapter = new MockCarrierAdapter();
  const order = await adapter.createOrder(input);
  assert.match(order.externalOrderCode, /^MOCK-SH-TEST-/);
  const tracking = await adapter.track(order.externalOrderCode);
  assert.equal(tracking.externalStatus, "PICKING");
});
