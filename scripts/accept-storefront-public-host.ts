import assert from "node:assert/strict";

const baseUrl = process.env.STOREFRONT_BASE_URL?.replace(/\/$/, "");
if (!baseUrl) throw new Error("STOREFRONT_BASE_URL is required");
const parsed = new URL(baseUrl);
if (parsed.protocol !== "https:" && process.env.STOREFRONT_ALLOW_HTTP !== "1") {
  throw new Error("Public acceptance requires HTTPS; set STOREFRONT_ALLOW_HTTP=1 only for a local proxy test");
}

async function get(path: string) {
  return fetch(`${baseUrl}${path}`, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
}

async function main() {
  const publicPaths = ["/products", "/request", "/offline", "/manifest.webmanifest", "/sw.js"];
  const publicResults: Record<string, number> = {};
  for (const path of publicPaths) {
    const response = await get(path);
    publicResults[path] = response.status;
    assert.equal(response.status, 200, `${path} must be public`);
  }

  const products = await get("/products");
  assert.match(products.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(products.headers.get("x-content-type-options"), "nosniff");
  const sw = await get("/sw.js");
  assert.match(sw.headers.get("cache-control") ?? "", /no-cache|no-store/);

  const privatePaths = ["/admin", "/login", "/profile", "/api/admin/users", "/api/media/sign", "/api/internal/jobs/run", "/api/health", "/api/ready"];
  const privateResults: Record<string, number> = {};
  for (const path of privatePaths) {
    const response = await get(path);
    privateResults[path] = response.status;
    assert.equal(response.status, 404, `${path} must be hidden by the public proxy`);
  }

  console.log(JSON.stringify({ ok: true, baseUrl, publicResults, privateResults }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
