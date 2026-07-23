import { createHash } from "node:crypto";
import { MediaObjectAvailability } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/storage-key";
import { mediaStorage } from "../storage";
import { mediaPathPolicy } from "../core/media-path.policy";
import { executeMediaMove } from "./media-operation.service";

/**
 * Registers an existing NAS object without moving it. This is the safe bridge
 * from legacy MediaAsset into the canonical model.
 */
export async function registerExistingMediaObject(input: {
  storageKey: string;
  originalFileName?: string | null;
}) {
  const storageKey = normalizeKey(input.storageKey);
  const metadata = await mediaStorage.stat(storageKey);
  if (!metadata) throw new Error(`Media object does not exist on NAS: ${storageKey}`);

  return prisma.mediaObject.upsert({
    where: { storageKey },
    create: {
      bucket: S3_BUCKET,
      storageKey,
      originalFileName: input.originalFileName ?? storageKey.split("/").pop() ?? null,
      mimeType: metadata.contentType,
      sizeBytes: metadata.sizeBytes === null ? null : BigInt(metadata.sizeBytes),
      etag: metadata.etag,
      availability: MediaObjectAvailability.AVAILABLE,
      verifiedAt: new Date(),
    },
    update: {
      mimeType: metadata.contentType,
      sizeBytes: metadata.sizeBytes === null ? undefined : BigInt(metadata.sizeBytes),
      etag: metadata.etag,
      availability: MediaObjectAvailability.AVAILABLE,
      verifiedAt: new Date(),
      missingAt: null,
    },
  });
}

/**
 * Consumes a file from a segment source folder exactly once. The canonical object key
 * is stable for the source key, so retries cannot create duplicate files.
 * Existing product media is registered in place to avoid breaking legacy refs.
 */
export async function ingestSelectedMedia(input: {
  storageKey: string;
}) {
  const sourceKey = normalizeKey(input.storageKey);
  if (!sourceKey) throw new Error("Media source key is required.");

  const existingObject = await prisma.mediaObject.findUnique({
    where: { storageKey: sourceKey },
  });
  if (existingObject || mediaPathPolicy.isCanonical(sourceKey)) {
    return registerExistingMediaObject({ storageKey: sourceKey });
  }

  const referenced = await prisma.productImage.findFirst({
    where: { fileKey: sourceKey },
    select: { id: true },
  });
  const isLegacySource =
    sourceKey.startsWith("products/edit/active/") ||
    sourceKey.startsWith("products/inline/active/");
  if (referenced || (!mediaPathPolicy.isSource(sourceKey) && !isLegacySource)) {
    return registerExistingMediaObject({ storageKey: sourceKey });
  }

  const stableObjectId = createHash("sha256")
    .update(sourceKey)
    .digest("hex")
    .slice(0, 32);
  const destinationKey = mediaPathPolicy.canonicalOriginal({
    mediaObjectId: stableObjectId,
    filename: sourceKey.split("/").pop() ?? "media",
  });
  await executeMediaMove({
    idempotencyKey: `media-ingest:${sourceKey}`,
    sourceKey,
    destinationKey,
    deleteSource: true,
  });
  return registerExistingMediaObject({ storageKey: destinationKey });
}
