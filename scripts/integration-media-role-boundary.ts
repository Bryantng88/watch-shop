import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "@/server/db/client";
import { mapWatchDetailToFormValues } from "@/domains/watch/client/form/watch-form.mapper";
import { submitWatchFormApplication } from "@/domains/watch/application/submit-watch-form/submit-watch-form.application";

async function main() {
  // This test must only run against its explicitly named disposable loopback DB.
  for (const key of ["DATABASE_URL", "DIRECT_URL"]) {
    const url = new URL(process.env[key] ?? "");
    assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Loopback database required");
    assert.equal(url.pathname, "/media_role_integration_test");
  }
  assert.notEqual(process.env.NODE_ENV, "production");
  const marker = randomUUID();
  const product = await prisma.product.create({ data: {
    title: `Media boundary ${marker}`, sku: `MEDIA-TEST-${marker}`, type: "WATCH",
    watch: { create: { serialNumber: "original-serial", yearText: "1990" } },
  }, include: { watch: true } });
  assert.ok(product.watch);
  const values = mapWatchDetailToFormValues({ productId: product.id, watchId: product.watch.id, title: product.title });
  values.basic.title = "UNAUTHORIZED TITLE";
  values.header.sku = "UNAUTHORIZED SKU";
  values.basic.serialNumber = "UNAUTHORIZED SERIAL";
  values.basic.vendorId = "nonexistent-vendor";
  values.basic.brandId = "nonexistent-brand";
  values.spec.model = "UNAUTHORIZED MODEL";
  values.basic.postTargetIds = ["nonexistent-target"];
  values.pricing.salePrice = "999999";
  values.pricing.costPrice = "1";
  values.content.body = "Synthetic media content";
  const context = { canEditProduct: false, canReviewContent: false, canEditPrice: true, deferConsumers: () => {} };
  await assert.rejects(submitWatchFormApplication({ ...values, saveIntent: "NORMAL" }, context), /FORBIDDEN/);
  const result = await submitWatchFormApplication({ ...values, saveIntent: "MEDIA_WORKSPACE" }, context);
  assert.equal(result.ok, true);
  const after = await prisma.product.findUniqueOrThrow({ where: { id: product.id }, include: {
    watch: { include: { watchContent: true, watchSpecV2: true, watchPrice: true } }, postTargets: true,
  } });
  assert.equal(after.title, product.title);
  assert.equal(after.sku, product.sku);
  assert.equal(after.brandId, null);
  assert.equal(after.vendorId, null);
  assert.equal(after.watch?.serialNumber, "original-serial");
  assert.equal(after.watch?.yearText, "1990");
  assert.equal(after.watch?.watchSpecV2, null);
  assert.equal(after.watch?.watchPrice, null);
  assert.deepEqual(after.postTargets, []);
  assert.equal(after.watch?.watchContent?.body, "Synthetic media content");
  await prisma.watchReviewState.create({ data: { watchId: product.watch.id, productId: product.id, targetType: "CONTENT", status: "APPROVED" } });
  await assert.rejects(submitWatchFormApplication({ ...values, content: { ...values.content, body: "Forbidden approved edit" }, saveIntent: "MEDIA_WORKSPACE" }, context), /không có quyền chỉnh sửa nội dung đã duyệt/);
  assert.equal((await prisma.watchContent.findUniqueOrThrow({ where: { watchId: product.watch.id } })).body, "Synthetic media content");
  console.log("PASS: approved content remains protected; media content saved; forged product, spec, price, vendor, target and normal-save changes rejected or ignored");
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
