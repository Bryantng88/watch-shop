import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import { PERMISSIONS } from "@/constants/permissions";
import { mediaStorage } from "@/domains/media/storage";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/storage-key";
import { s3, S3_BUCKET } from "@/server/s3";

export const maxDuration = 60;

const HERO_ROOT = "storefront/hero/";
const DERIVATIVE_ROOT = `${HERO_ROOT}derivatives/`;
const IMAGE_EXTENSIONS = /\.(?:jpe?g|png|webp)$/i;

function boundedNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, Math.round(parsed))) : fallback;
}

function assertHeroSourceKey(value: unknown) {
  const key = normalizeKey(String(value ?? ""));
  if (!key.startsWith(HERO_ROOT) || key.startsWith(DERIVATIVE_ROOT) || !IMAGE_EXTENSIONS.test(key)) {
    throw new Error(`Chỉ được chọn ảnh trong thư mục NAS ${HERO_ROOT}`);
  }
  return key;
}

export async function GET() {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  const listed = await mediaStorage.list({ prefix: HERO_ROOT, maxKeys: 1000 });
  const sourceItems = listed.items
    .filter((item) => !item.key.startsWith(DERIVATIVE_ROOT) && IMAGE_EXTENSIONS.test(item.key))
    .sort((left, right) => (right.lastModified?.getTime() ?? 0) - (left.lastModified?.getTime() ?? 0))
    .slice(0, 200);
  const records = await prisma.storefrontHeroImage.findMany({
    where: { storageKey: { in: sourceItems.map((item) => item.key) } },
  });
  const recordByKey = new Map(records.map((item) => [item.storageKey, item]));
  const items = await Promise.all(sourceItems.map(async (item) => {
    const record = recordByKey.get(item.key);
    return {
      storageKey: item.key,
      fileName: item.key.split("/").pop() ?? item.key,
      sizeBytes: item.sizeBytes,
      lastModified: item.lastModified,
      url: await mediaStorage.sign(item.key, 600),
      record: record ? {
        id: record.id,
        altText: record.altText,
        width: record.width,
        height: record.height,
        focalX: record.focalX,
        focalY: record.focalY,
        overlayOpacity: record.overlayOpacity,
        isActive: record.isActive,
      } : null,
    };
  }));
  return NextResponse.json({ items, root: HERO_ROOT, truncated: listed.truncated || sourceItems.length >= 200 });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const body = await req.json().catch(() => ({}));
    const storageKey = assertHeroSourceKey(body.storageKey);
    const altText = String(body.altText ?? "").trim().slice(0, 240) || null;
    const focalX = boundedNumber(body.focalX, 50, 0, 100);
    const focalY = boundedNumber(body.focalY, 50, 0, 100);
    const overlayOpacity = boundedNumber(body.overlayOpacity, 55, 20, 85);
    const metadata = await mediaStorage.stat(storageKey);
    if (!metadata) throw new Error("Ảnh không còn tồn tại trên NAS. Hãy quét lại kho Hero.");
    if (metadata.sizeBytes && metadata.sizeBytes > 30 * 1024 * 1024) throw new Error("Ảnh nguồn vượt quá 30 MB.");

    const existing = await prisma.storefrontHeroImage.findUnique({ where: { storageKey } });
    let derivativeKey = existing?.derivativeKey ?? null;
    let width = existing?.width ?? 0;
    let height = existing?.height ?? 0;
    const derivativeExists = derivativeKey ? await mediaStorage.stat(derivativeKey) : null;

    if (!derivativeExists) {
      const source = await mediaStorage.read(storageKey);
      const sourceMeta = await sharp(source.bytes).autoOrient().metadata();
      width = sourceMeta.width ?? 0;
      height = sourceMeta.height ?? 0;
      if (width < 1400 || height < 500) throw new Error("Ảnh Hero cần tối thiểu 1400 × 500 px.");
      const output = await sharp(source.bytes)
        .autoOrient()
        .resize({ width: 2560, height: 1280, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88, smartSubsample: true })
        .toBuffer({ resolveWithObject: true });
      const fingerprint = createHash("sha256").update(`${storageKey}:${metadata.etag ?? metadata.sizeBytes ?? "source"}`).digest("hex").slice(0, 24);
      derivativeKey = `${DERIVATIVE_ROOT}${fingerprint}.webp`;
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: derivativeKey,
        Body: output.data,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }));
      width = output.info.width;
      height = output.info.height;
    }

    const active = await prisma.$transaction(async (tx) => {
      await tx.storefrontHeroImage.updateMany({ where: { isActive: true }, data: { isActive: false } });
      return tx.storefrontHeroImage.upsert({
        where: { storageKey },
        create: {
          storageKey,
          derivativeKey,
          originalFileName: storageKey.split("/").pop() ?? "hero",
          altText,
          mimeType: metadata.contentType || "image/*",
          sizeBytes: metadata.sizeBytes ?? 0,
          width,
          height,
          focalX,
          focalY,
          overlayOpacity,
          isActive: true,
        },
        update: { derivativeKey, altText, width, height, focalX, focalY, overlayOpacity, isActive: true },
      });
    });
    return NextResponse.json({ ok: true, activeId: active.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể chọn ảnh Hero." }, { status: 400 });
  }
}
