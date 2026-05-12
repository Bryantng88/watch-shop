import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { ImageRole, type MediaAssetStatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";
import { moveMediaObject } from "@/server/lib/media-storage";
import {
  type MediaProfile,
  getProfileRoot,
  normalizeKey,
  sanitizeBrowsePrefix,
} from "@/server/lib/product-image-storage";
import {
  IMAGE_EXT_RE,
  getFileNameFromKey,
  shouldHideMediaName,
  toPickedMediaAsset,
} from "./media-asset.utils";
import {
  listMediaAssetsRepo,
  listWatchChosenMediaAssetsRepo,
  markMediaAssetArchivedRepo,
  markMissingMediaAssetsNotInKeysRepo,
  upsertMediaAssetRepo,
} from "./media-asset.repo";
import { organizeActiveLooseNasFiles } from "./nas-media.service";

export function getMediaProfile(value: string | null): MediaProfile {
  if (value === "edit") return "edit";
  if (value === "sold") return "sold";
  if (value === "storefront-active") return "storefront-active";
  if (value === "storefront-chosen") return "storefront-chosen";
  return "inline";
}

export async function indexMediaPrefix(input: {
  profile?: string | null;
  prefix?: string | null;
  markMissing?: boolean;
}) {
  const profile = getMediaProfile(input.profile ?? null);
  const root = normalizeKey(getProfileRoot(profile));
  const prefix = sanitizeBrowsePrefix(input.prefix ?? null, profile) || root;

  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: prefix ? `${prefix}/` : undefined,
      Delimiter: "/",
      MaxKeys: 1000,
    })
  );

  const folders = (result.CommonPrefixes || [])
    .map((item) => normalizeKey(item.Prefix))
    .filter(Boolean)
    .filter((item) => item !== prefix)
    .filter((item) => !shouldHideMediaName(getFileNameFromKey(item)))
    .map((item) => ({ prefix: item }))
    .sort((a, b) => a.prefix.localeCompare(b.prefix));

  const dedup = new Set<string>();
  const rawFiles = (result.Contents || [])
    .map((item) => ({
      key: normalizeKey(item.Key),
      sizeBytes: item.Size ?? null,
      etag: item.ETag?.replaceAll('"', "") ?? null,
      lastModified: item.LastModified ?? null,
    }))
    .filter((item) => item.key && item.key !== prefix && item.key !== `${prefix}/`)
    .filter((item) => !shouldHideMediaName(getFileNameFromKey(item.key)))
    .filter((item) => IMAGE_EXT_RE.test(item.key))
    .filter((item) => {
      if (dedup.has(item.key)) return false;
      dedup.add(item.key);
      return true;
    });

  const assets = [];
  for (const file of rawFiles) {
    assets.push(
      await upsertMediaAssetRepo(prisma as any, {
        key: file.key,
        profile,
        sizeBytes: file.sizeBytes,
        etag: file.etag,
        lastModified: file.lastModified,
      })
    );
  }

  if (input.markMissing) {
    await markMissingMediaAssetsNotInKeysRepo(prisma as any, {
      prefix,
      keys: rawFiles.map((x) => x.key),
    });
  }

  const files = assets
    .sort((a, b) => Number(b.lastModified ?? 0) - Number(a.lastModified ?? 0))
    .map((item) => ({
      id: item.id,
      key: item.key,
      url: `/api/media/sign?key=${encodeURIComponent(item.key)}`,
      status: item.status,
      productId: item.productId,
      acquisitionId: item.acquisitionId,
      fileName: item.fileName,
    }));

  return {
    profile,
    root,
    prefix,
    folders,
    files,
    indexed: assets.length,
  };
}

export async function moveAndTrackMediaAsset(input: {
  fromKey: string;
  toPrefix: string;
  deleteSource?: boolean;
  overwrite?: boolean;
  productId?: string | null;
  acquisitionId?: string | null;
  role?: ImageRole | null;
  sortOrder?: number | null;
  status?: MediaAssetStatus;
}) {
  const moved = await moveMediaObject({
    fromKey: input.fromKey,
    toPrefix: input.toPrefix,
    deleteSource: input.deleteSource,
    overwrite: input.overwrite,
  });

  const key = normalizeKey(moved.key);
  const fromKey = normalizeKey(moved.fromKey);

  if (input.deleteSource && fromKey !== key) {
    await markMediaAssetArchivedRepo(prisma as any, fromKey);
  }

  const asset = await upsertMediaAssetRepo(prisma as any, {
    key,
    status: input.status,
    productId: input.productId ?? null,
    acquisitionId: input.acquisitionId ?? null,
    role: input.role ?? null,
    sortOrder: input.sortOrder ?? null,
    movedFromKey: fromKey,
  });

  return {
    ...moved,
    key,
    fromKey,
    asset,
    url: `/api/media/sign?key=${encodeURIComponent(key)}`,
  };
}

export async function moveMediaAssetToWatchChosen(input: {
  key: string;
  productId: string;
  acquisitionId?: string | null;
  sortOrder?: number | null;
}) {
  const key = normalizeKey(input.key);
  const fileName = key.split("/").pop() ?? key;

  const targetPrefix = `products/edit/chosen/watch/${input.productId}/gallery`;
  const targetKey = `${targetPrefix}/${fileName}`;

  if (key.startsWith(`${targetPrefix}/`)) {
    const asset = await upsertMediaAssetRepo(prisma as any, {
      key,
      status: "CHOSEN",
      productId: input.productId,
      acquisitionId: input.acquisitionId ?? null,
      role: ImageRole.GALLERY,
      sortOrder: input.sortOrder ?? 0,
    });

    return {
      key: asset.key,
      fileKey: asset.key,
      url: `/api/media/sign?key=${encodeURIComponent(asset.key)}`,
      name: asset.fileName,
      sortOrder: asset.sortOrder,
    };
  }

  const moved = await moveAndTrackMediaAsset({
    fromKey: key,
    toPrefix: targetPrefix,
    deleteSource: true,
    overwrite: false,
    productId: input.productId,
    acquisitionId: input.acquisitionId ?? null,
    status: "CHOSEN",
    role: ImageRole.GALLERY,
    sortOrder: input.sortOrder ?? 0,
  });

  return {
    key: moved.key,
    fileKey: moved.key,
    url: moved.url,
    name: moved.asset.fileName,
    sortOrder: moved.asset.sortOrder,
  };
}
export async function listWatchChosenMediaPool(input: {
  productId: string;
  acquisitionId?: string | null;
}) {
  const rows = await listWatchChosenMediaAssetsRepo(prisma as any, input);
  return rows.map(toPickedMediaAsset);
}

export async function markGalleryMediaAssetsAttached(input: {
  productId: string;
  images: Array<{ fileKey: string; sortOrder?: number | null }>;
}) {
  for (const image of input.images) {
    await upsertMediaAssetRepo(prisma as any, {
      key: image.fileKey,
      status: "CHOSEN",
      productId: input.productId,
      role: ImageRole.GALLERY,
      sortOrder: image.sortOrder ?? 0,
    });
  }
}


type ReconcileMediaAssetsInput = {
  profile?: string | null;
  prefix?: string | null;
};

export async function reconcileMediaAssets(input: ReconcileMediaAssetsInput = {}) {
  const profile = input.profile?.trim() || undefined;
  const prefix = input.prefix?.trim() || undefined;

  const where = {
    ...(profile ? { profile } : {}),
    ...(prefix ? { parentPrefix: { startsWith: prefix } } : {}),
  };

  const assets = await prisma.mediaAsset.findMany({
    where,
    select: {
      id: true,
      key: true,
      isMissing: true,
      status: true,
    },
  });

  let attached = 0;
  let orphan = 0;

  for (const asset of assets) {
    const productImage = await prisma.productImage.findFirst({
      where: {
        fileKey: asset.key,
      },
      select: {
        id: true,
        productId: true,
        role: true,
        sortOrder: true,
      },
    });

    if (productImage) {
      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: {
          status: "ATTACHED",
          productId: productImage.productId,
          role: productImage.role,
          sortOrder: productImage.sortOrder,
        },
      });

      attached += 1;
      continue;
    }

    if (asset.status === "ATTACHED") {
      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: {
          status: asset.isMissing ? "MISSING" : "ACTIVE",
          productId: null,
          role: null,
          sortOrder: 0,
        },
      });

      orphan += 1;
    }
  }

  return {
    scanned: assets.length,
    attached,
    orphan,
  };
}


export async function getMediaAssetDashboard() {
  const [
    totalAssets,
    activeCount,
    chosenCount,
    attachedCount,
    missingCount,
  ] = await Promise.all([
    prisma.mediaAsset.count(),

    prisma.mediaAsset.count({
      where: {
        status: "ACTIVE",
        isMissing: false,
      },
    }),

    prisma.mediaAsset.count({
      where: {
        OR: [
          { status: "CHOSEN" },
          { parentPrefix: { contains: "/chosen" } },
        ],
        isMissing: false,
      },
    }),

    prisma.mediaAsset.count({
      where: {
        OR: [
          { status: "ATTACHED" },
          { productId: { not: null } },
        ],
        isMissing: false,
      },
    }),

    prisma.mediaAsset.count({
      where: {
        OR: [
          { status: "MISSING" },
          { isMissing: true },
        ],
      },
    }),
  ]);

  return {
    totalAssets,
    activeCount,
    chosenCount,
    assignedCount: attachedCount,
    missingCount,
  };
}

export async function listMediaAssets(input: {
  page?: number;
  pageSize?: number;
  q?: string | null;
  prefix?: string | null;
  profile?: string | null;
  status?: MediaAssetStatus | null;
  role?: ImageRole | null;
  productId?: string | null;
  acquisitionId?: string | null;
  missingOnly?: boolean;
}) {
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 48)));
  const q = input.q?.trim();

  const where: any = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.role ? { role: input.role } : {}),
    ...(input.productId ? { productId: input.productId } : {}),
    ...(input.acquisitionId ? { acquisitionId: input.acquisitionId } : {}),
    ...(input.profile ? { profile: input.profile } : {}),
    ...(input.prefix
      ? { parentPrefix: { startsWith: input.prefix } }
      : {}),

    ...(input.missingOnly
      ? {
        OR: [
          { status: "MISSING" },
          { isMissing: true },
        ],
      }
      : {}),

    ...(q
      ? {
        OR: [
          { key: { contains: q, mode: "insensitive" } },
          { fileName: { contains: q, mode: "insensitive" } },
          { parentPrefix: { contains: q, mode: "insensitive" } },
          { productId: { contains: q, mode: "insensitive" } },
          { acquisitionId: { contains: q, mode: "insensitive" } },
        ],
      }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.mediaAsset.count({ where }),
    prisma.mediaAsset.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items,
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function organizeActiveMediaAssets(input: {
  dryRun?: boolean;
  maxFiles?: number;
} = {}) {
  const result = await organizeActiveLooseNasFiles({
    dryRun: input.dryRun,
    maxFiles: input.maxFiles,
  });

  if (!input.dryRun) {
    for (const item of result.moved) {
      await upsertMediaAssetRepo(prisma as any, {
        key: item.toKey,
        profile: "edit",
        sizeBytes: item.sizeBytes ?? null,
        etag: item.etag ?? null,
        lastModified: item.lastModifiedDate ?? null,
        status: "ACTIVE",
        movedFromKey: item.fromKey,
      });

      await markMediaAssetArchivedRepo(prisma as any, item.fromKey);
    }
  }

  return {
    success: true,
    scanned: result.scanned,
    processed: result.processed,
    movedCount: result.moved.length,
    skippedCount: result.skipped.length,
    dryRun: result.dryRun,
    root: result.root,
    moved: result.moved.map((item) => ({
      fromKey: item.fromKey,
      toKey: item.toKey,
      batchPrefix: item.batchPrefix,
      date: item.date,
    })),
    skipped: result.skipped,
  };
}

export async function moveMediaAssetToAcquisitionInlineChosen(input: {
  key: string;
  productId: string;
  acquisitionId: string;
  sortOrder?: number | null;
}) {
  const key = normalizeKey(input.key);

  if (!key) {
    throw new Error("Media key không hợp lệ");
  }

  if (key.startsWith("products/inline/chosen/")) {
    const asset = await upsertMediaAssetRepo(prisma, {
      key,
      profile: "inline",
      status: "CHOSEN",
      productId: input.productId,
      acquisitionId: input.acquisitionId,
      role: ImageRole.INLINE,
      sortOrder: input.sortOrder ?? 0,
    });

    return {
      key: asset.key,
      fileKey: asset.key,
      url: `/api/media/sign?key=${encodeURIComponent(asset.key)}`,
      name: asset.fileName,
      sortOrder: asset.sortOrder,
    };
  }

  const moved = await moveAndTrackMediaAsset({
    fromKey: key,
    toPrefix: "products/inline/chosen/watch/inline",
    deleteSource: true,
    overwrite: false,
    productId: input.productId,
    acquisitionId: input.acquisitionId,
    role: ImageRole.INLINE,
    status: "CHOSEN",
    sortOrder: input.sortOrder ?? 0,

  });

  return {
    key: moved.key,
    fileKey: moved.key,
    url: moved.url,
    name: moved.asset.fileName,
    sortOrder: moved.asset.sortOrder,
  };
}