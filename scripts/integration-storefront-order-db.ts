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
      productImage: { create: { fileKey: `integration/${id}.jpg`, role: "COVER", isPrimary: true, isForStorefront: true } },
      productVariant: { create: { availabilityStatus: "ACTIVE", stockQty: 1, salePrice: 10_000_000, updatedAt: new Date() } },
      watch: { create: {
        saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "NOT_REQUIRED",
        reviewStates: { create: [
          { productId: id, targetType: "CONTENT", status: "APPROVED" },
          { productId: id, targetType: "IMAGE", status: "APPROVED" },
        ] },
        watchContent: { create: { contentStatus: "PUBLISHED", publishedAt: new Date() } },
        watchPrice: { create: { salePrice: 10_000_000, listPrice: 10_000_000 } },
      } },
    },
  });
  return id;
  }

  function request(productId: string, customerName = "Storefront Integration", requestPhone = phone) {
  return {
    customerName, phone: requestPhone, contactPreference: "PHONE" as const,
    items: [{ productId, quantity: 1 }],
  };
  }

  async function cleanup() {
  await prisma.integrationIngressReceipt.deleteMany({ where: { eventId: { startsWith: prefix } } });
  await prisma.purchaseRequest.deleteMany({ where: { requestKey: { contains: prefix } } });
  await prisma.order.deleteMany({ where: { publicRequestKey: { contains: prefix } } });
  await prisma.customer.deleteMany({ where: { phone } });
  await prisma.product.deleteMany({ where: { id: { startsWith: prefix } } });
  }

  try {
  const columns = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count FROM information_schema.columns
    WHERE table_name = 'PurchaseRequest' AND column_name = 'requestKey'
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
  assert.equal(replay.requestId, first.requestId);
  assert.equal(replay.replayed, true);
  const createdReceipt = await prisma.purchaseRequestIngressReceipt.findUnique({ where: { requestKey: `STOREFRONT:${replayKey}` } });
  assert.equal(createdReceipt?.purchaseRequestId, first.requestId);
  const createdEvent = await prisma.businessEventLog.findFirst({
    where: { eventKey: "purchase_request.created", targetType: "PURCHASE_REQUEST", targetId: first.requestId },
  });
  assert.ok(createdEvent, "Created purchase request must emit a durable business event");
  const initialActivity = await prisma.purchaseRequestActivity.findFirst({ where: { purchaseRequestId: first.requestId, type: "NOTE" } });
  assert.match(initialActivity?.note ?? "", /Khách gửi yêu cầu mua 1 Watch/);
  await assert.rejects(() => submitPublicOrder(
    { request: request(replayProduct, "Changed body"), idempotencyKey: replayKey, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:replay`, runtime: { deferConsumers } },
  ), /PUBLIC_ORDER_IDEMPOTENCY_CONFLICT/);

  const concurrentProduct = await seedWatch("concurrent");
  const concurrentPhone = `08${String(Date.now()).slice(-8)}`;
  const concurrent = await Promise.allSettled([1, 2].map((n) => submitPublicOrder(
    { request: request(concurrentProduct, "Storefront Integration", concurrentPhone), idempotencyKey: `${prefix}-concurrent-key-000${n}`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:concurrent:${n}`, runtime: { deferConsumers } },
  )));
  assert.equal(concurrent.filter((result) => result.status === "fulfilled").length, 2);
  const concurrentRequestCount = await prisma.purchaseRequestItem.count({ where: { productId: concurrentProduct } });
  assert.equal(concurrentRequestCount, 1, "Concurrent submissions from the same phone merge into one waiting request");
  const concurrentRequestIds = new Set(concurrent.flatMap((result) => result.status === "fulfilled" ? [result.value.requestId] : []));
  assert.equal(concurrentRequestIds.size, 1, "Concurrent submissions must resolve to the same waiting request");

  const mergeProduct = await seedWatch("merge");
  const mergeResult = await submitPublicOrder(
    { request: request(mergeProduct, "Storefront Integration", concurrentPhone), idempotencyKey: `${prefix}-merge-key-0001`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:merge`, runtime: { deferConsumers } },
  );
  assert.equal(mergeResult.disposition, "MERGED");
  assert.equal(mergeResult.addedItemCount, 1);
  assert.equal(mergeResult.requestId, [...concurrentRequestIds][0]);
  const mergeReplay = await submitPublicOrder(
    { request: request(mergeProduct, "Storefront Integration", concurrentPhone), idempotencyKey: `${prefix}-merge-key-0001`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:merge`, runtime: { deferConsumers } },
  );
  assert.equal(mergeReplay.replayed, true);
  assert.equal(mergeReplay.disposition, "MERGED");
  assert.equal(mergeReplay.addedItemCount, 1);
  const mergeActivity = await prisma.purchaseRequestActivity.findFirst({
    where: { purchaseRequestId: mergeResult.requestId, type: "NOTE" },
    orderBy: { createdAt: "desc" },
  });
  assert.match(mergeActivity?.note ?? "", /bổ sung 1 Watch từ Storefront/);
  const mergeEvent = await prisma.businessEventLog.findFirst({
    where: { eventKey: "purchase_request.items_added", targetType: "PURCHASE_REQUEST", targetId: mergeResult.requestId },
  });
  assert.ok(mergeEvent, "Merged purchase request must emit an items-added business event");

  await prisma.purchaseRequest.update({ where: { id: mergeResult.requestId }, data: { status: "PROCESSING" } });
  const afterProcessingProduct = await seedWatch("after-processing");
  const afterProcessing = await submitPublicOrder(
    { request: request(afterProcessingProduct, "Storefront Integration", concurrentPhone), idempotencyKey: `${prefix}-after-processing-key-0001`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:after-processing`, runtime: { deferConsumers } },
  );
  assert.notEqual(afterProcessing.requestId, mergeResult.requestId);
  assert.equal(afterProcessing.disposition, "CREATED");

  const rateProducts = await Promise.all(Array.from({ length: 6 }, (_, index) => seedWatch(`rate-${index}`)));
  for (let index = 0; index < 5; index += 1) {
    await submitPublicOrder(
      { request: request(rateProducts[index], "Storefront Integration", `07${String(Date.now() + index).slice(-8)}`), idempotencyKey: `${prefix}-rate-key-000${index}`, channel: "STOREFRONT" },
      { fingerprint: `${prefix}:same-fingerprint`, runtime: { deferConsumers } },
    );
  }
  await assert.rejects(() => submitPublicOrder(
    { request: request(rateProducts[5], "Storefront Integration", `07${String(Date.now() + 5).slice(-8)}`), idempotencyKey: `${prefix}-rate-key-0005`, channel: "STOREFRONT" },
    { fingerprint: `${prefix}:same-fingerprint`, runtime: { deferConsumers } },
  ), /PUBLIC_ORDER_RATE_LIMITED/);

  const eventId = `${prefix}-zalo-event-0001`;
  const event = { eventId, occurredAt: new Date().toISOString(), type: "watch.lookup" as const, data: { q: prefix, limit: 5 } };
  const zaloFirst = await processZaloIngressEvent({ event, keyId: "integration", nonce: `${prefix}-nonce-0001`, requestHash: `${prefix}-hash`, runtime: { deferConsumers } });
  const zaloReplay = await processZaloIngressEvent({ event, keyId: "integration", nonce: `${prefix}-nonce-0002`, requestHash: `${prefix}-hash`, runtime: { deferConsumers } });
  assert.equal(zaloFirst.replayed, false);
  assert.equal(zaloReplay.replayed, true);
  await assert.rejects(() => processZaloIngressEvent({ event, keyId: "integration", nonce: `${prefix}-nonce-0003`, requestHash: `${prefix}-changed`, runtime: { deferConsumers } }), /ZALO_EVENT_CONFLICT/);

  console.log(JSON.stringify({ ok: true, database: databaseName, checks: 23, firstRequestId: first.requestId }, null, 2));
  } finally {
    await cleanup().catch(() => undefined);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
