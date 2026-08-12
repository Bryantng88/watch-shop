import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { publicOrderRequestSchema } from "../src/domains/storefront/contracts";

const valid = publicOrderRequestSchema.parse({
  customerName: "Storefront smoke",
  phone: "0900000000",
  contactPreference: "ZALO",
  contactHandle: "0900000000",
  items: [{ productId: "product-1", quantity: 1 }],
});
assert.equal(valid.items[0].quantity, 1);
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, clientPrice: 1 }));
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, items: [{ productId: "product-1", quantity: 0 }] }));
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, items: [valid.items[0], valid.items[0]] }));
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, contactPreference: "WHATSAPP", contactHandle: undefined }));
assert.equal(publicOrderRequestSchema.parse({ ...valid, contactPreference: "INSTAGRAM", contactHandle: "@vintic" }).contactHandle, "@vintic");
assert.throws(() => publicOrderRequestSchema.parse({ ...valid, phone: "abcdefgh" }));

const orderService = readFileSync(resolve("src/domains/storefront/server/public-order.service.ts"), "utf8");
const orderForm = readFileSync(resolve("src/domains/storefront/ui/PublicOrderForm.tsx"), "utf8");
const publicOrderRoute = readFileSync(resolve("src/app/api/public/orders/route.ts"), "utf8");
const requestService = readFileSync(resolve("src/domains/purchase-request/server/purchase-request.service.ts"), "utf8");
const paymentCore = readFileSync(resolve("src/domains/payment/server/payment.core.ts"), "utf8");
assert.match(orderService, /findOrderablePublicWatchIds/);
assert.match(orderService, /purchaseRequest\.create/);
assert.match(orderService, /purchase-request:/);
assert.match(orderService, /public-rate:/);
assert.match(orderService, /PUBLIC_ORDER_IDEMPOTENCY_CONFLICT/);
assert.match(orderService, /PUBLIC_ORDER_RATE_LIMITED/);
assert.match(orderService, /purchaseRequestIngressReceipt/);
assert.match(orderService, /normalizedPhone/);
assert.match(orderService, /runBusinessEventTransaction/);
assert.match(orderService, /purchase_request\.created/);
assert.match(orderService, /purchase_request\.items_added/);
assert.match(orderForm, /action="\/api\/public\/orders"/);
assert.match(orderForm, /type="submit"/);
assert.match(publicOrderRoute, /req\.formData\(\)/);
assert.match(publicOrderRoute, /NextResponse\.redirect/);
assert.match(requestService, /convertPurchaseRequestToOrder/);
assert.match(requestService, /status: "DRAFT"/);
assert.match(paymentCore, /status: "CANCELED"/);

console.log(JSON.stringify({ ok: true, checks: 24, contract: "purchase-request-ingress" }));
