import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { publicOrderRequestSchema } from "../src/domains/storefront/contracts";

const valid = publicOrderRequestSchema.parse({
  customerName: "Storefront smoke",
  phone: "0900000000",
  contactPreference: "ZALO",
  items: [{ productId: "product-1", quantity: 1 }],
});
assert.equal(valid.items[0].quantity, 1);
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, clientPrice: 1 }));
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, items: [{ productId: "product-1", quantity: 0 }] }));
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, items: [valid.items[0], valid.items[0]] }));

const orderService = readFileSync(resolve("src/domains/storefront/server/public-order.service.ts"), "utf8");
const requestService = readFileSync(resolve("src/domains/purchase-request/server/purchase-request.service.ts"), "utf8");
const paymentCore = readFileSync(resolve("src/domains/payment/server/payment.core.ts"), "utf8");
assert.match(orderService, /findOrderablePublicWatchIds/);
assert.match(orderService, /purchaseRequest\.create/);
assert.match(orderService, /purchase-request:/);
assert.match(orderService, /public-rate:/);
assert.match(orderService, /PUBLIC_ORDER_IDEMPOTENCY_CONFLICT/);
assert.match(orderService, /PUBLIC_ORDER_RATE_LIMITED/);
assert.match(requestService, /convertPurchaseRequestToOrder/);
assert.match(requestService, /status: "DRAFT"/);
assert.match(paymentCore, /status: "CANCELED"/);

console.log(JSON.stringify({ ok: true, checks: 12, contract: "purchase-request-ingress" }));
