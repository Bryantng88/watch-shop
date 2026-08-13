import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeCarrierBaseUrl } from "./carrier.config";

test("rejects production carrier hosts outside production", () => {
  assert.throws(() => assertSafeCarrierBaseUrl("https://online-gateway.ghn.vn", "staging"), /CARRIER_PRODUCTION_ENDPOINT_FORBIDDEN/);
  assert.throws(() => assertSafeCarrierBaseUrl("https://services.giaohangtietkiem.vn", "staging"), /CARRIER_PRODUCTION_ENDPOINT_FORBIDDEN/);
});

test("allows official sandbox hosts in staging", () => {
  assert.equal(assertSafeCarrierBaseUrl("https://dev-online-gateway.ghn.vn/", "staging"), "https://dev-online-gateway.ghn.vn");
  assert.equal(assertSafeCarrierBaseUrl("https://services-staging.ghtklab.com", "staging"), "https://services-staging.ghtklab.com");
});

test("mock mode only allows loopback", () => {
  assert.equal(assertSafeCarrierBaseUrl("http://127.0.0.1:3000/", "mock"), "http://127.0.0.1:3000");
  assert.throws(() => assertSafeCarrierBaseUrl("https://dev-online-gateway.ghn.vn", "mock"), /CARRIER_EXTERNAL_ENDPOINT_FORBIDDEN_IN_MOCK/);
});
