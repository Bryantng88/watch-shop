import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";

import { zaloIngressEventSchema } from "../src/domains/storefront/contracts";
import { verifyZaloIngress } from "../src/domains/storefront/server/zalo-ingress-auth";

const secret = "zalo-ingress-smoke-secret-32-characters-minimum";
process.env.ZALO_INGRESS_KEYS = JSON.stringify({ smoke: secret });
const body = JSON.stringify({
  eventId: "evt-smoke-00000001",
  occurredAt: "2026-08-05T12:00:00.000+07:00",
  type: "watch.lookup",
  data: { q: "Omega", limit: 5 },
});
const timestamp = "1785906000";
const nonce = "nonce-smoke-00000001";
const bodyHash = createHash("sha256").update(body).digest("hex");
const canonical = ["v1", timestamp, nonce, "POST", "/api/integrations/zalo/events", bodyHash].join("\n");
const signature = createHmac("sha256", secret).update(canonical).digest("hex");

const verified = verifyZaloIngress({
  method: "POST", pathAndQuery: "/api/integrations/zalo/events", body,
  headers: { keyId: "smoke", timestamp, nonce, signature },
  now: new Date(Number(timestamp) * 1_000),
});
assert.equal(verified.keyId, "smoke");
assert.equal(zaloIngressEventSchema.parse(JSON.parse(body)).type, "watch.lookup");
assert.throws(() => verifyZaloIngress({
  method: "POST", pathAndQuery: "/api/integrations/zalo/events", body: `${body} `,
  headers: { keyId: "smoke", timestamp, nonce, signature },
  now: new Date(Number(timestamp) * 1_000),
}), /ZALO_AUTH_INVALID/);
assert.throws(() => verifyZaloIngress({
  method: "POST", pathAndQuery: "/api/integrations/zalo/events", body,
  headers: { keyId: "smoke", timestamp, nonce, signature },
  now: new Date((Number(timestamp) + 301) * 1_000),
}), /ZALO_AUTH_EXPIRED/);
assert.throws(() => zaloIngressEventSchema.parse({
  eventId: "evt-smoke-00000002", occurredAt: "2026-08-05T12:00:00.000+07:00",
  type: "admin.lookup", data: {},
}));

console.log(JSON.stringify({ ok: true, checks: 5, contract: "zalo-ingress-v1" }));
