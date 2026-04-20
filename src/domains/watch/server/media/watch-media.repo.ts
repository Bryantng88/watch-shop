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
  input: {
    productId: string;
    images: Array<{
      fileKey?: string | null;
      url?: string | null;
      key?: string | null;
      path?: string | null;
      role?: string | null;
      isForAdmin?: boolean | null;
      isForStorefront?: boolean | null;
      sortOrder?: number | null;
    }>;
  }
) {
  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: {
        productId: true,
      },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch");
    }

    const galleryItems = (input.images ?? [])
      .filter((item) => String(item?.role ?? "").toUpperCase() === "GALLERY")
      .map((item, index) => ({
        productId: input.productId,
        fileKey:
          item.fileKey ??
          item.key ??
          item.path ??
          null,
        url: item.url ?? null,
        role: "GALLERY" as any,
        isForAdmin: item.isForAdmin ?? true,
        isForStorefront: item.isForStorefront ?? true,
        sortOrder:
          typeof item.sortOrder === "number" ? item.sortOrder : index,
      }))
      .filter((item) => item.fileKey || item.url);

    await tx.productImage.deleteMany({
      where: {
        productId: input.productId,
        role: "GALLERY" as any,
      },
    });

    if (galleryItems.length > 0) {
      await tx.productImage.createMany({
        data: galleryItems,
      });
    }

    return tx.productImage.findMany({
      where: {
        productId: input.productId,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
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
      productId: true,
      product: {
        select: {
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  return watch.product?.productImage ?? [];
}