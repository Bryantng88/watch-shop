import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaLegacyClassification,
  MediaLegacyDecision,
  MediaOwnerType,
  MediaPipelineKey,
  MediaRole,
} from "@prisma/client";
import { prisma } from "@/server/db/client";
import { bindMedia, registerExistingMediaObject } from "../application";
import { mediaStorage } from "../storage";

export type LegacyMediaClassification =
  | "DB_AND_NAS_OK"
  | "WATCH_POOL_SELECTED"
  | "LEGACY_SOURCE_MOVED"
  | "DB_PRESENT_NAS_MISSING"
  | "PRODUCT_REFERENCE_BROKEN"
  | "UNBOUND"
  | "NEEDS_REVIEW";

/**
 * Read-only audit. It intentionally never updates MediaAsset, ProductImage, or NAS.
 */
export async function auditLegacyMediaAssets(input: {
  cursor?: string | null;
  take?: number;
}) {
  const take = Math.min(Math.max(input.take ?? 100, 1), 500);
  const assets = await prisma.mediaAsset.findMany({
    take: take + 1,
    ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
    orderBy: { id: "asc" },
  });
  const page = assets.slice(0, take);
  const keys = page.map((asset) => asset.key);
  const [productReferences, successors] = await Promise.all([
    prisma.productImage.findMany({
      where: { fileKey: { in: keys } },
      select: { id: true, productId: true, fileKey: true },
    }),
    prisma.mediaAsset.findMany({
      where: { movedFromKey: { in: keys } },
      select: { id: true, key: true, movedFromKey: true },
    }),
  ]);
  const productReferenceByKey = new Map(
    productReferences.map((item) => [item.fileKey, item]),
  );
  const successorBySourceKey = new Map(
    successors.map((item) => [String(item.movedFromKey), item]),
  );

  const physicalByKey = new Map<string, Awaited<ReturnType<typeof mediaStorage.stat>>>();
  for (let offset = 0; offset < page.length; offset += 25) {
    const chunk = page.slice(offset, offset + 25);
    const stats = await Promise.all(
      chunk.map(async (asset) => [asset.key, await mediaStorage.stat(asset.key)] as const),
    );
    stats.forEach(([key, stat]) => physicalByKey.set(key, stat));
  }

  const results = page.map((asset) => {
    const physical = physicalByKey.get(asset.key) ?? null;
    const productReference = productReferenceByKey.get(asset.key) ?? null;
    const successor = successorBySourceKey.get(asset.key) ?? null;
    let classification: LegacyMediaClassification;
    if (physical && productReference) classification = "DB_AND_NAS_OK";
    else if (
      physical &&
      asset.productId &&
      asset.key.includes(`/chosen/watch/${asset.productId}/pool/`)
    ) classification = "WATCH_POOL_SELECTED";
    else if (!physical && successor) classification = "LEGACY_SOURCE_MOVED";
    else if (!physical && productReference) classification = "PRODUCT_REFERENCE_BROKEN";
    else if (!physical) classification = "DB_PRESENT_NAS_MISSING";
    else if (!asset.productId && !asset.acquisitionId && !productReference) classification = "UNBOUND";
    else classification = "NEEDS_REVIEW";

    return {
      legacyMediaAssetId: asset.id,
      key: asset.key,
      status: asset.status,
      physicalExists: Boolean(physical),
      productImageId: productReference?.id ?? null,
      productId: asset.productId ?? productReference?.productId ?? null,
      acquisitionId: asset.acquisitionId,
      movedFromKey: asset.movedFromKey,
      successorKey: successor?.key ?? null,
      classification,
    };
  });

  const summary = results.reduce<Record<LegacyMediaClassification, number>>(
    (acc, item) => {
      acc[item.classification] += 1;
      return acc;
    },
    {
      DB_AND_NAS_OK: 0,
      WATCH_POOL_SELECTED: 0,
      LEGACY_SOURCE_MOVED: 0,
      DB_PRESENT_NAS_MISSING: 0,
      PRODUCT_REFERENCE_BROKEN: 0,
      UNBOUND: 0,
      NEEDS_REVIEW: 0,
    },
  );

  return {
    readOnly: true,
    summary,
    items: results,
    nextCursor: assets.length > take ? page.at(-1)?.id ?? null : null,
  };
}

function defaultDecision(classification: LegacyMediaClassification) {
  if (
    classification === "DB_AND_NAS_OK" ||
    classification === "WATCH_POOL_SELECTED"
  ) {
    return MediaLegacyDecision.MIGRATE;
  }
  if (classification === "LEGACY_SOURCE_MOVED") return MediaLegacyDecision.IGNORE;
  if (
    classification === "DB_PRESENT_NAS_MISSING" ||
    classification === "PRODUCT_REFERENCE_BROKEN"
  ) {
    return MediaLegacyDecision.QUARANTINE;
  }
  return MediaLegacyDecision.PENDING;
}

export async function scanLegacyMediaManifest(input: {
  cursor?: string | null;
  take?: number;
}) {
  const audit = await auditLegacyMediaAssets(input);
  const existingRows = await prisma.mediaLegacyManifest.findMany({
    where: {
      legacyMediaAssetId: {
        in: audit.items.map((item) => item.legacyMediaAssetId),
      },
    },
    select: { legacyMediaAssetId: true, decision: true },
  });
  const existingDecision = new Map(
    existingRows.map((item) => [item.legacyMediaAssetId, item.decision]),
  );
  for (const item of audit.items) {
    const previousDecision = existingDecision.get(item.legacyMediaAssetId);
    const nextDecision =
      previousDecision === MediaLegacyDecision.MIGRATED ||
      previousDecision === MediaLegacyDecision.IGNORE
        ? previousDecision
        : defaultDecision(item.classification);
    await prisma.mediaLegacyManifest.upsert({
      where: { legacyMediaAssetId: item.legacyMediaAssetId },
      create: {
        legacyMediaAssetId: item.legacyMediaAssetId,
        legacyKey: item.key,
        classification: item.classification as MediaLegacyClassification,
        decision: nextDecision,
        physicalExists: item.physicalExists,
        productImageId: item.productImageId,
        productId: item.productId,
        acquisitionId: item.acquisitionId,
        movedFromKey: item.movedFromKey,
        scannedAt: new Date(),
      },
      update: {
        legacyKey: item.key,
        classification: item.classification as MediaLegacyClassification,
        decision: nextDecision,
        physicalExists: item.physicalExists,
        productImageId: item.productImageId,
        productId: item.productId,
        acquisitionId: item.acquisitionId,
        movedFromKey: item.movedFromKey,
        scannedAt: new Date(),
      },
    });
  }

  return {
    ...audit,
    manifestWritten: audit.items.length,
  };
}

function canonicalRole(role: string | null | undefined): MediaRole {
  if (role === "COVER") return MediaRole.COVER;
  if (role === "INLINE") return MediaRole.INLINE;
  if (role === "THUMB") return MediaRole.THUMBNAIL;
  return MediaRole.GALLERY;
}

export async function importVerifiedLegacyMedia(input: {
  take?: number;
  dryRun?: boolean;
}) {
  const take = Math.min(Math.max(input.take ?? 50, 1), 200);
  const manifests = await prisma.mediaLegacyManifest.findMany({
    where: {
      decision: MediaLegacyDecision.MIGRATE,
      classification: {
        in: [
          MediaLegacyClassification.DB_AND_NAS_OK,
          MediaLegacyClassification.WATCH_POOL_SELECTED,
        ],
      },
      physicalExists: true,
    },
    orderBy: { scannedAt: "asc" },
    take,
  });

  const preview = await Promise.all(
    manifests.map(async (manifest) => {
      const [legacy, productImage, watch] = await Promise.all([
        prisma.mediaAsset.findUnique({ where: { id: manifest.legacyMediaAssetId } }),
        manifest.productImageId
          ? prisma.productImage.findUnique({
              where: { id: manifest.productImageId },
              select: { role: true, sortOrder: true, productId: true },
            })
          : null,
        manifest.productId
          ? prisma.watch.findUnique({
              where: { productId: manifest.productId },
              select: { id: true, audienceSegment: true, mediaPipelineKey: true },
            })
          : null,
      ]);

      return {
        manifest,
        legacy,
        productImage,
        watch,
        eligible: Boolean(legacy && manifest.physicalExists),
      };
    }),
  );

  if (input.dryRun !== false) {
    return {
      dryRun: true,
      scanned: preview.length,
      eligible: preview.filter((item) => item.eligible).length,
      items: preview.map((item) => ({
        manifestId: item.manifest.id,
        legacyMediaAssetId: item.manifest.legacyMediaAssetId,
        key: item.manifest.legacyKey,
        ownerType: item.watch
          ? MediaOwnerType.WATCH
          : item.manifest.acquisitionId
            ? MediaOwnerType.ACQUISITION
            : null,
        ownerId: item.watch?.id ?? item.manifest.acquisitionId ?? null,
        role: canonicalRole(item.productImage?.role ?? item.legacy?.role),
        eligible: item.eligible,
      })),
    };
  }

  const results = [];
  for (const item of preview) {
    if (!item.eligible || !item.legacy) continue;

    try {
      const object = await registerExistingMediaObject({
        storageKey: item.legacy.key,
        originalFileName: item.legacy.fileName,
      });

      if (item.watch) {
        await bindMedia({
          mediaObjectId: object.id,
          ownerType: MediaOwnerType.WATCH,
          ownerId: item.watch.id,
          role: canonicalRole(item.productImage?.role ?? item.legacy.role),
          sortOrder: item.productImage?.sortOrder ?? item.legacy.sortOrder,
          audienceSegment: item.watch.audienceSegment,
          pipelineKey: item.watch.mediaPipelineKey,
          lifecycle:
            item.manifest.classification === MediaLegacyClassification.WATCH_POOL_SELECTED
              ? MediaBindingLifecycle.SELECTED
              : MediaBindingLifecycle.ATTACHED,
        });
      } else if (item.manifest.acquisitionId) {
        const acquisition = await prisma.acquisition.findUnique({
          where: { id: item.manifest.acquisitionId },
          select: { audienceSegment: true },
        });
        await bindMedia({
          mediaObjectId: object.id,
          ownerType: MediaOwnerType.ACQUISITION,
          ownerId: item.manifest.acquisitionId,
          role: canonicalRole(item.productImage?.role ?? item.legacy.role),
          sortOrder: item.productImage?.sortOrder ?? item.legacy.sortOrder,
          audienceSegment: acquisition?.audienceSegment ?? AudienceSegment.MEN,
          pipelineKey:
            acquisition?.audienceSegment === AudienceSegment.WOMEN
              ? MediaPipelineKey.WOMEN_LITE
              : acquisition?.audienceSegment === AudienceSegment.UNISEX
                ? MediaPipelineKey.UNISEX_STANDARD
                : MediaPipelineKey.MEN_STANDARD,
        });
      }

      await prisma.mediaLegacyManifest.update({
        where: { id: item.manifest.id },
        data: {
          decision: MediaLegacyDecision.MIGRATED,
          mediaObjectId: object.id,
          migratedAt: new Date(),
          note: null,
        },
      });
      results.push({ manifestId: item.manifest.id, ok: true, mediaObjectId: object.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown migration error";
      await prisma.mediaLegacyManifest.update({
        where: { id: item.manifest.id },
        data: { note: message },
      });
      results.push({ manifestId: item.manifest.id, ok: false, error: message });
    }
  }

  return {
    dryRun: false,
    scanned: preview.length,
    migrated: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    items: results,
  };
}

export async function getLegacyManifestSummary() {
  const [
    groups,
    totalLegacyAssets,
    totalManifestRecords,
    manifestCursor,
    totalCanonicalObjects,
    totalBindings,
    operationGroups,
  ] = await Promise.all([
    prisma.mediaLegacyManifest.groupBy({
      by: ["classification", "decision"],
      _count: { _all: true },
    }),
    prisma.mediaAsset.count(),
    prisma.mediaLegacyManifest.count(),
    prisma.mediaLegacyManifest.aggregate({
      _max: { legacyMediaAssetId: true },
    }),
    prisma.mediaObject.count(),
    prisma.mediaBinding.count({ where: { lifecycle: { not: "REMOVED" } } }),
    prisma.mediaOperation.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  return {
    groups,
    totalLegacyAssets,
    totalManifestRecords,
    remainingToAudit: Math.max(totalLegacyAssets - totalManifestRecords, 0),
    resumeCursor: manifestCursor._max.legacyMediaAssetId ?? null,
    totalCanonicalObjects,
    totalBindings,
    operations: operationGroups,
  };
}
