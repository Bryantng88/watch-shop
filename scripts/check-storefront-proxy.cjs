// Public legal routes must reach Next without opening private routes at ingress.
const assert = require('node:assert/strict');
const fs = require('node:fs');
for (const path of ['ops/nginx/storefront-production.conf', 'ops/deployment/nginx-storefront-public.conf.example', 'ops/deployment/nginx-storefront-local.conf']) {
  const config = fs.readFileSync(path, 'utf8');
  assert.match(config, /location\s*=\s*\/privacy-policy\s*\{\s*proxy_pass\s+http:\/\/[^;]+;/, path + ': policy must be an exact public proxy route');
  assert.match(config, /location\s+\/\s*\{\s*return\s+404;/, path + ': unknown and private routes must stay closed');
}
console.log('PASS public policy route in all three proxy configurations; default deny retained.');
