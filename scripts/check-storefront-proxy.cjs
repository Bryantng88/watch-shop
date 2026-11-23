// Public legal routes must reach Next without opening private routes at ingress.
const assert = require('node:assert/strict');
const fs = require('node:fs');
for (const path of ['ops/nginx/storefront-production.conf', 'ops/deployment/nginx-storefront-public.conf.example', 'ops/deployment/nginx-storefront-local.conf']) {
  const config = fs.readFileSync(path, 'utf8');
  assert.match(config, /location\s*=\s*\/privacy-policy\s*\{\s*proxy_pass\s+http:\/\/[^;]+;/, path + ': policy must be an exact public proxy route');
  assert.match(config, /location\s+\/\s*\{\s*return\s+404;/, path + ': unknown and private routes must stay closed');
}
console.log('PASS public policy route in all three proxy configurations; default deny retained.');

const admin = fs.readFileSync('ops/nginx-admin-internal.conf', 'utf8');
const upload = admin.match(/location\s*=\s*\/api\/admin\/storefront\/media\s*\{([^}]+)\}/)?.[1];
assert.ok(upload, 'Website upload must have an exact proxy route');
assert.match(upload, /client_max_body_size\s+21m;/, 'Allow 20 MB files plus multipart framing');
assert.match(upload, /proxy_pass\s+http:\/\/127\.0\.0\.1:3000;/);
assert.match(upload, /proxy_set_header\s+Host\s+\$host;/);
assert.match(upload, /proxy_set_header\s+X-Forwarded-Proto\s+https;/);
assert.equal((admin.match(/client_max_body_size/g) || []).length, 1, 'Do not widen unrelated admin endpoints');
console.log('PASS exact admin website upload route; forwarding and limits retained.');
