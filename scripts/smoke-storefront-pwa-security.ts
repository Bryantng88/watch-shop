import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sw = readFileSync("public/sw.js", "utf8");
const proxy = readFileSync("ops/deployment/nginx-storefront-public.conf.example", "utf8");
const manifest = readFileSync("src/app/manifest.ts", "utf8");
const nextConfig = readFileSync("next.config.ts", "utf8");

assert.match(sw, /request\.method !== "GET"/);
assert.match(sw, /url\.pathname\.startsWith\("\/api\/"\)/);
assert.match(sw, /url\.pathname\.startsWith\("\/admin"\)/);
assert.match(sw, /publicReferrer/);
assert.doesNotMatch(sw, /caches\.open[\s\S]*\/api\/public/);
assert.match(sw, /fetch\(request\)\.catch\(\(\) => caches\.match\(OFFLINE_URL\)\)/);
assert.match(proxy, /location = \/api\/integrations\/zalo\/events/);
assert.match(proxy, /location \/ \{ return 404; \}/);
assert.doesNotMatch(proxy, /location \^~ \/api\/admin/);
assert.match(manifest, /display: "standalone"/);
assert.match(manifest, /purpose: "maskable"/);
assert.match(nextConfig, /Content-Security-Policy/);
assert.match(nextConfig, /\/api\/public\/:path\*/);

console.log(JSON.stringify({ ok: true, checks: 13, contract: "storefront-pwa-security" }));
