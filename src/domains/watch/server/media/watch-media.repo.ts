import { DB, withDbTransaction } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type {
  ReplaceWatchImagesInput,
  ReorderWatchImagesInput,
  SetWatchStorefrontImageInput,
  WatchMediaItemInput,
} from "../shared";

function normalizeImageRole(role?: string | null) {
  if (!role) return null;

  const upper = role.toUpperCase();

  const allowed = new Set([
    "PRIMARY",
    "GALLERY",
    "DETAIL",
    "THUMBNAIL",
    "STOREFRONT",
    "INLINE",
  ]);

  return allowed.has(upper) ? upper : null;
}

function normalizeMediaItem(input: WatchMediaItemInput, index: number) {
  return {
    legacyProductImageId: input.legacyProductImageId ?? null,
    key: input.key ?? null,
    url: input.url ?? null,
    type: input.type ?? null,
    role: normalizeImageRole(input.role),
    sortOrder:
      typeof input.sortOrder === "number" && Number.isFinite(input.sortOrder)
        ? input.sortOrder
        : index,
    alt: input.alt ?? null,
    width:
      typeof input.width === "number" && Number.isFinite(input.width)
        ? input.width
        : null,
    height:
      typeof input.height === "number" && Number.isFinite(input.height)
        ? input.height
        : null,
    mime: input.mime ?? null,
    sizeBytes:
      typeof input.sizeBytes === "number" && Number.isFinite(input.sizeBytes)
        ? input.sizeBytes
        : null,
    dominantHex: input.dominantHex ?? null,
    contentHash: input.contentHash ?? null,
  };
}

export async function replaceWatchImagesRepo(
  db: DB,
  input: ReplaceWatchImagesInput
) {

  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: { id: true, productId: true },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để cập nhật hình");
    }

    await tx.watchMedia.deleteMany({
      where: { watchId: watch.id },
    });

    if (!input.images.length) {
      await tx.product.update({
        where: { id: input.productId },
        data: {
          primaryImageUrl: null,
          storefrontImageKey: null,
        },
      });

      return [];
    }

    const created = [];
    for (let i = 0; i < input.images.length; i += 1) {
      const item = normalizeMediaItem(input.images[i], i);

      const row = await tx.watchMedia.create({
        data: {
          watchId: watch.id,
          legacyProductImageId: item.legacyProductImageId,
          key: item.key,
          url: item.url,
          type: item.type,
          role: item.role as any,
          sortOrder: item.sortOrder,
          alt: item.alt,
          width: item.width,
          height: item.height,
          mime: item.mime,
          sizeBytes: item.sizeBytes,
          dominantHex: item.dominantHex,
          contentHash: item.contentHash,
        },
      });

      created.push(row);
    }

    const primary =
      created.find((item) => item.role === "PRIMARY") ??
      created.find((item) => item.role === "STOREFRONT") ??
      created[0] ??
      null;

    await tx.product.update({
      where: { id: input.productId },
      data: {
        primaryImageUrl: primary?.url ?? null,
        storefrontImageKey: primary?.key ?? null,
      },
    });

    return created;
  });
}

export async function reorderWatchImagesRepo(
  db: DB,
  input: ReorderWatchImagesInput
) {
  const client = dbOrTx(db);

  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: { id: true },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để sắp xếp hình");
    }

    for (let index = 0; index < input.imageIds.length; index += 1) {
      await tx.watchMedia.updateMany({
        where: {
          id: input.imageIds[index],
          watchId: watch.id,
        },
        data: {
          sortOrder: index,
        },
      });
    }

    return tx.watchMedia.findMany({
      where: { watchId: watch.id },
      orderBy: { sortOrder: "asc" },
    });
  });
}

export async function setWatchStorefrontImageRepo(
  db: DB,
  input: SetWatchStorefrontImageInput
) {

  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: { id: true },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để đặt ảnh storefront");
    }

    if (!input.imageId) {
      await tx.product.update({
        where: { id: input.productId },
        data: {
          storefrontImageKey: null,
        },
      });

      return null;
    }

    const image = await tx.watchMedia.findFirst({
      where: {
        id: input.imageId,
        watchId: watch.id,
      },
    });

    if (!image) {
      throw new Error("Không tìm thấy hình cần đặt storefront");
    }

    await tx.product.update({
      where: { id: input.productId },
      data: {
        storefrontImageKey: image.key ?? null,
        primaryImageUrl: image.url ?? null,
      },
    });

    return image;
  });
}

export async function getWatchImagesRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      watchMedia: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  return watch.watchMedia;
}