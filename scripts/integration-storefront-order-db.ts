import assert from "node:assert/strict";

const testUrl = process.env.STOREFRONT_TEST_DATABASE_URL?.trim();
if (!testUrl) throw new Error("STOREFRONT_TEST_DATABASE_URL is required");
const parsed = new URL(testUrl);
const databaseName = parsed.pathname.replace(/^\//, "").toLowerCase();
const allowRemote = process.env.ALLOW_REMOTE_STOREFRONT_TEST_DB === "1";
if (!allowRemote && !["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error("Refusing remote test DB without ALLOW_REMOTE_STOREFRONT_TEST_DB=1");
}
if (!/(test|storefront)/.test(databaseName)) throw new Error("Test database name must contain 'test' or 'storefront'");
for (const protectedUrl of [process.env.DATABASE_URL, process.env.DIRECT_URL]) {
  if (protectedUrl?.trim() === testUrl) throw new Error("Refusing to run against the configured application database");
}
process.env.DATABASE_URL = testUrl;
process.env.DIRECT_URL = testUrl;

async function main() {
  const [{ prisma }, { submitPublicOrder, processZaloIngressEvent }] = await Promise.all([
    import("../src/server/db/client"),
    import("../src/domains/storefront/server"),
  ]);

  const prefix = `sf-it-${Date.now()}`;
  const phone = `09${String(Date.now()).slice(-8)}`;
  const deferConsumers = () => undefined;

  async function seedWatch(suffix: string) {
  const id = `${prefix}-${suffix}`;
  await prisma.product.create({
    data: {
      id, slug: id, title: `Integration Watch ${suffix}`, type: "WATCH",
      status: "AVAILABLE", contentStatus: "PUBLISHED", priceVisibility: "SHOW",
      publishedAt: new Date(),
      productImage: { create: { fileKey: `integration/${id}.jpg`, isPrimary: true, isForStorefront: true } },
      productVariant: { create: { availabilityStatus: "ACTIVE", stockQty: 1, salePrice: 10_000_000, updatedAt: new Date() } },
      watch: { create: {
        saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "NOT_REQUIRED",
        watchContent: { create: { contentStatus: "PUBLISHED", publishedAt: new Date() } },
        watchPrice: { create: { salePrice: 10_000_000, listPrice: 10_000_000 } },
      } },
    },
  });
  return id;
  }

  function request(productId: string, customerName = "Storefront Integration") {
  return {
    customerName, phone, contactPreference: "PHONE" as const,
    items: [{ productId, quantity: 1 }],
  };
  }

  async function cleanup() {
  await prisma.integrationIngressReceipt.deleteMany({ where: { eventId: { startsWith: prefix } } });
  await prisma.order.deleteMany({ where: { publicRequestKey: { contains: prefix } } });
  await prisma.customer.deleteMany({ where: { phone } });
  await prisma.product.deleteMany({ where: { id: { startsWith: prefix } } });
  }

  try {
  const columns = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count FROM information_schema.columns
    WHERE table_name = 'Order' AND column_name = 'publicRequestKey'
  `;
  assert.equal(Number(columns[0]?.count ?? 0), 1, "Storefront migration is not applied");
  await cleanup();

  const replayProduct = await seedWatch("replay");
  const replayKey = `${prefix}-replay-key-0001`;
  const first = await submitPublicOrder(
    { request: request(replayProduct), idempotencyKey: replayKey, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:replay`, runtime: { deferConsumers } },
  );
  const replay = await submitPublicOrder(
    { request: request(replayProduct), idempotencyKey: replayKey, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:replay`, runtime: { deferConsumers } },
  );
  assert.equal(replay.orderId, first.orderId);
  assert.equal(replay.replayed, true);
  await assert.rejects(() => submitPublicOrder(
    { request: request(replayProduct, "Changed body"), idempotencyKey: replayKey, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:replay`, runtime: { deferConsumers } },
  ), /PUBLIC_ORDER_IDEMPOTENCY_CONFLICT/);

  const concurrentProduct = await seedWatch("concurrent");
  const concurrent = await Promise.allSettled([1, 2].map((n) => submitPublicOrder(
    { request: request(concurrentProduct), idempotencyKey: `${prefix}-concurrent-key-000${n}`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:concurrent:${n}`, runtime: { deferConsumers } },
  )));
  assert.equal(concurrent.filter((result) => result.status === "fulfilled").length, 1);
  const concurrentOrderCount = await prisma.orderItem.count({ where: { productId: concurrentProduct } });
  assert.equal(concurrentOrderCount, 1);

  const rateProducts = await Promise.all(Array.from({ length: 6 }, (_, index) => seedWatch(`rate-${index}`)));
  for (let index = 0; index < 5; index += 1) {
    await submitPublicOrder(
      { request: request(rateProducts[index]), idempotencyKey: `${prefix}-rate-key-000${index}`, channel: "STOREFRONT" },
      { fingerprint: `${prefix}:same-fingerprint`, runtime: { deferConsumers } },
    );
  }
  await assert.rejects(() => submitPublicOrder(
    { request: request(rateProducts[5]), idempotencyKey: `${prefix}-rate-key-0005`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:same-fingerprint`, runtime: { deferConsumers } },
  ), /PUBLIC_ORDER_RATE_LIMITED/);

  const eventId = `${prefix}-zalo-event-0001`;
  const event = { eventId, occurredAt: new Date().toISOString(), type: "watch.lookup" as const, data: { q: prefix, limit: 5 } };
  const zaloFirst = await processZaloIngressEvent({ event, keyId: "integration", nonce: `${prefix}-nonce-0001`, requestHash: `${prefix}-hash`, runtime: { deferConsumers } });
  const zaloReplay = await processZaloIngressEvent({ event, keyId: "integration", nonce: `${prefix}-nonce-0002`, requestHash: `${prefix}-hash`, runtime: { deferConsumers } });
  assert.equal(zaloFirst.replayed, false);
  assert.equal(zaloReplay.replayed, true);
  await assert.rejects(() => processZaloIngressEvent({ event, keyId: "integration", nonce: `${prefix}-nonce-0003`, requestHash: `${prefix}-changed`, runtime: { deferConsumers } }), /ZALO_EVENT_CONFLICT/);

  console.log(JSON.stringify({ ok: true, database: databaseName, checks: 9, firstOrderId: first.orderId }, null, 2));
  } finally {
    await cleanup().catch(() => undefined);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
