import { createHash } from "node:crypto";
import { MediaObjectAvailability } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/storage-key";
import { mediaStorage } from "../storage";
import { mediaPathPolicy } from "../core/media-path.policy";
import { isLegacyWatchMediaSource } from "../core/media-source-path";
import { executeMediaMove } from "./media-operation.service";

export function canonicalMediaObjectIdFromKey(storageKey: string) {
  const match = normalizeKey(storageKey).match(/^media\/objects\/([^/]+)\/original\//);
  return match?.[1] ?? null;
}

/**
 * Registers an existing NAS object without moving it. This is the safe bridge
 * from legacy MediaAsset into the canonical model.
 */
export async function registerExistingMediaObject(input: {
  storageKey: string;
  originalFileName?: string | null;
  sourceMediaObjectId?: string | null;
  derivativeVariant?: string | null;
  derivativeRecipeHash?: string | null;
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
      sourceMediaObjectId: input.sourceMediaObjectId ?? null,
      derivativeVariant: input.derivativeVariant ?? null,
      derivativeRecipeHash: input.derivativeRecipeHash ?? null,
    },
    update: {
      mimeType: metadata.contentType,
      sizeBytes: metadata.sizeBytes === null ? undefined : BigInt(metadata.sizeBytes),
      etag: metadata.etag,
      availability: MediaObjectAvailability.AVAILABLE,
      verifiedAt: new Date(),
      missingAt: null,
      ...(input.sourceMediaObjectId ? { sourceMediaObjectId: input.sourceMediaObjectId } : {}),
      ...(input.derivativeVariant ? { derivativeVariant: input.derivativeVariant } : {}),
      ...(input.derivativeRecipeHash ? { derivativeRecipeHash: input.derivativeRecipeHash } : {}),
    },
  });
}

/**
 * Consumes a file from a segment source folder exactly once. The canonical object key
 * is stable for the source key, so retries cannot create duplicate files.
 * Canonical product media is registered in place. Source inbox files are always
 * consumed, even when discovery has already registered a MediaObject for them.
 */
export async function ingestSelectedMedia(input: {
  storageKey: string;
  destination?: { ownerType: "MEDIA_POST"; ownerId: string };
}) {
  let sourceKey = normalizeKey(input.storageKey);
  if (!sourceKey) throw new Error("Media source key is required.");

  let existingObject = await prisma.mediaObject.findUnique({
    where: { storageKey: sourceKey },
  });
  if (mediaPathPolicy.isCanonical(sourceKey)) {
    if (await mediaStorage.stat(sourceKey)) {
      return registerExistingMediaObject({ storageKey: sourceKey });
    }

    // A form opened before "Return to NAS" can still hold the former canonical
    // key. Resolve the embedded MediaObject id to its current physical key and
    // ingest from there instead of failing the whole Gallery save.
    const staleObjectId = canonicalMediaObjectIdFromKey(sourceKey);
    const relocatedObject = staleObjectId
      ? await prisma.mediaObject.findUnique({ where: { id: staleObjectId } })
      : null;
    const relocatedKey = normalizeKey(relocatedObject?.storageKey ?? "");
    if (!relocatedKey || relocatedKey === sourceKey || !(await mediaStorage.stat(relocatedKey))) {
      throw new Error(`Media object does not exist on NAS: ${sourceKey}`);
    }
    sourceKey = relocatedKey;
    existingObject = relocatedObject;
  }

  const isLegacySource = isLegacyWatchMediaSource(sourceKey);
  if (!mediaPathPolicy.isSource(sourceKey) && !isLegacySource) {
    return registerExistingMediaObject({ storageKey: sourceKey });
  }

  const stableObjectId = existingObject?.id ?? createHash("sha256")
    .update(sourceKey)
    .digest("hex")
    .slice(0, 32);
  const filename = sourceKey.split("/").pop() ?? "media";
  const plannedDestinationKey = input.destination?.ownerType === "MEDIA_POST"
    ? mediaPathPolicy.postOriginal({
        postId: input.destination.ownerId,
        mediaObjectId: stableObjectId,
        filename,
      })
    : mediaPathPolicy.canonicalOriginal({ mediaObjectId: stableObjectId, filename });
  const idempotencyKey = input.destination?.ownerType === "MEDIA_POST"
    ? `media-ingest:post:${input.destination.ownerId}:${sourceKey}`
    : `media-ingest:${sourceKey}`;
  const previousIngest = !input.destination
    ? await prisma.mediaOperation.findUnique({
        where: { idempotencyKey },
        select: { destinationKey: true },
      })
    : null;
  // Re-selecting an image after "Return to NAS" is a replay of the original
  // ingest lifecycle. Reuse its canonical destination even if MediaObject.id
  // was assigned later and differs from the original stable path segment.
  const destinationKey = normalizeKey(
    previousIngest?.destinationKey ?? plannedDestinationKey,
  );
  await executeMediaMove({
    idempotencyKey,
    mediaObjectId: existingObject?.id ?? null,
    sourceKey,
    destinationKey,
    deleteSource: true,
  });
  await prisma.productImage.updateMany({
    where: { fileKey: sourceKey },
    data: { fileKey: destinationKey },
  });
  await prisma.product.updateMany({
    where: { primaryImageUrl: sourceKey },
    data: { primaryImageUrl: destinationKey },
  });
  await prisma.product.updateMany({
    where: { storefrontImageKey: sourceKey },
    data: { storefrontImageKey: destinationKey },
  });
  return registerExistingMediaObject({ storageKey: destinationKey });
}
