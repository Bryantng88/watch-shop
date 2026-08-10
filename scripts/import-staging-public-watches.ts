import { readFile } from "node:fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";

/* eslint-disable @typescript-eslint/no-explicit-any -- guarded operational JSON import */

const databaseUrl = process.env.DATABASE_URL?.trim();
const sourceFile = process.argv[2];
if (!databaseUrl || !sourceFile) throw new Error("DATABASE_URL and source JSON path are required");
const parsedUrl = new URL(databaseUrl);
if (!["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname) || !/(test|storefront)/i.test(parsedUrl.pathname)) {
  throw new Error("Refusing to import outside a loopback test/storefront database");
}

const s3Endpoint = process.env.S3_ENDPOINT?.trim();
const s3Bucket = process.env.S3_BUCKET?.trim();
if (!s3Endpoint || !s3Bucket || !["localhost", "127.0.0.1", "::1"].includes(new URL(s3Endpoint).hostname) || !s3Bucket.includes("test")) {
  throw new Error("Refusing non-loopback or non-test object storage");
}

const stagingBaseUrl = process.env.STAGING_PUBLIC_BASE_URL?.trim();
if (!stagingBaseUrl) throw new Error("STAGING_PUBLIC_BASE_URL is required");
const stagingHost = process.env.STAGING_PUBLIC_HOST?.trim() || "staging.vinticwatches.vn";
const db = new PrismaClient({ datasourceUrl: databaseUrl });
const s3 = new S3Client({
  endpoint: s3Endpoint,
  region: process.env.S3_REGION || "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

type ExportBundle = { version: number; source: string; products: Array<Record<string, any>> };
const date = (value: unknown) => value ? new Date(String(value)) : null;

async function copyImage(productId: string, image: Record<string, any>) {
  const url = `${stagingBaseUrl}/api/public/catalog/watches/${encodeURIComponent(productId)}/images/${encodeURIComponent(image.id)}`;
  const response = await fetch(url, { headers: { Host: stagingHost } });
  if (!response.ok) throw new Error(`Image fetch ${response.status}: ${image.fileKey}`);
  const body = Buffer.from(await response.arrayBuffer());
  await s3.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: image.fileKey,
    Body: body,
    ContentType: response.headers.get("content-type") || image.mime || "image/jpeg",
    CacheControl: "no-store",
  }));
}

async function main() {
  const bundle = JSON.parse(await readFile(sourceFile, "utf8")) as ExportBundle;
  if (bundle.version !== 1 || bundle.source !== "staging-public-watch" || !Array.isArray(bundle.products)) {
    throw new Error("Invalid staging public Watch export");
  }

  let imagesCopied = 0;
  for (const row of bundle.products) {
    if (!row.watch || !row.slug || !row.id) continue;
    const brand = row.brand;
    if (brand) {
      await db.brand.upsert({
        where: { id: brand.id },
        update: { name: brand.name, slug: brand.slug, country: brand.country, foundedYear: brand.foundedYear },
        create: brand,
      });
    }

    await db.product.upsert({
      where: { id: row.id },
      update: {
        slug: row.slug, title: row.title, type: row.type, priceVisibility: row.priceVisibility,
        status: row.status, tag: row.tag, brandId: brand?.id ?? null, publishedAt: date(row.publishedAt),
      },
      create: {
        id: row.id, slug: row.slug, title: row.title, type: row.type,
        priceVisibility: row.priceVisibility, status: row.status, tag: row.tag,
        brandId: brand?.id ?? null, publishedAt: date(row.publishedAt),
        createdAt: date(row.createdAt) ?? new Date(), updatedAt: date(row.updatedAt) ?? new Date(),
      },
    });

    const watch = row.watch;
    await db.watch.upsert({
      where: { id: watch.id },
      update: {
        productId: row.id, saleStage: watch.saleStage, serviceStage: watch.serviceStage,
        stockStage: watch.stockStage, siteChannel: watch.siteChannel, gender: watch.gender,
        audienceSegment: watch.audienceSegment, mediaPipelineKey: watch.mediaPipelineKey,
        conditionGrade: watch.conditionGrade, movementType: watch.movementType,
        yearText: watch.yearText, specStatus: watch.specStatus,
      },
      create: {
        id: watch.id, productId: row.id, saleStage: watch.saleStage,
        serviceStage: watch.serviceStage, stockStage: watch.stockStage,
        siteChannel: watch.siteChannel, gender: watch.gender,
        audienceSegment: watch.audienceSegment, mediaPipelineKey: watch.mediaPipelineKey,
        conditionGrade: watch.conditionGrade, movementType: watch.movementType,
        yearText: watch.yearText, specStatus: watch.specStatus,
        createdAt: date(watch.createdAt) ?? new Date(), updatedAt: date(watch.updatedAt) ?? new Date(),
      },
    });

    if (watch.watchPrice) {
      await db.watchPrice.upsert({
        where: { watchId: watch.id },
        update: { listPrice: watch.watchPrice.listPrice, salePrice: watch.watchPrice.salePrice, pricingNote: watch.watchPrice.pricingNote },
        create: { watchId: watch.id, listPrice: watch.watchPrice.listPrice, salePrice: watch.watchPrice.salePrice, pricingNote: watch.watchPrice.pricingNote },
      });
    }
    if (watch.watchContent) {
      const content = watch.watchContent;
      await db.watchContent.upsert({
        where: { watchId: watch.id },
        update: { ...content, publishedAt: date(content.publishedAt), createdAt: date(content.createdAt), updatedAt: date(content.updatedAt) },
        create: { ...content, watchId: watch.id, publishedAt: date(content.publishedAt), createdAt: date(content.createdAt) ?? new Date(), updatedAt: date(content.updatedAt) ?? new Date() },
      });
    }
    if (watch.watchSpecV2) {
      const spec = watch.watchSpecV2;
      const specData = { ...spec, watchId: watch.id, createdAt: date(spec.createdAt) ?? new Date(), updatedAt: date(spec.updatedAt) ?? new Date() };
      await db.watchSpecV2.upsert({ where: { watchId: watch.id }, update: specData, create: specData });
    }
    for (const review of watch.reviewStates || []) {
      await db.watchReviewState.upsert({
        where: { watchId_targetType: { watchId: watch.id, targetType: review.targetType } },
        update: { productId: row.id, status: review.status, submittedAt: date(review.submittedAt), reviewedAt: date(review.reviewedAt) },
        create: { id: review.id, watchId: watch.id, productId: row.id, targetType: review.targetType, status: review.status, submittedAt: date(review.submittedAt), reviewedAt: date(review.reviewedAt), createdAt: date(review.createdAt) ?? new Date(), updatedAt: date(review.updatedAt) ?? new Date() },
      });
    }
    for (const image of row.productImage || []) {
      await copyImage(row.id, image);
      imagesCopied += 1;
      await db.productImage.upsert({
        where: { id: image.id },
        update: { ...image, productId: row.id },
        create: { ...image, productId: row.id },
      });
    }
  }

  console.log(JSON.stringify({ ok: true, database: parsedUrl.pathname.slice(1), products: bundle.products.length, imagesCopied }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => db.$disconnect());
