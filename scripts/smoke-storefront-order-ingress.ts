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

const orderService = readFileSync(resolve("src/domains/storefront/server/public-order.service.ts"), "utf8");
const orderWrite = readFileSync(resolve("src/domains/order/server/write/order-write.service.ts"), "utf8");
assert.match(orderService, /findOrderablePublicWatchIds/);
assert.match(orderService, /listPrice: 0/);
assert.match(orderWrite, /public-order:/);
assert.match(orderWrite, /public-rate:/);
assert.match(orderWrite, /order-product:/);
assert.match(orderWrite, /PUBLIC_ORDER_IDEMPOTENCY_CONFLICT/);
assert.match(orderWrite, /PUBLIC_ORDER_RATE_LIMITED/);

console.log(JSON.stringify({ ok: true, checks: 9, contract: "storefront-order-ingress" }));
