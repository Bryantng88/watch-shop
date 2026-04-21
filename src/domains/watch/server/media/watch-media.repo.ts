import type { Prisma } from "@prisma/client";
import { dbOrTx, withDbTransaction, type DB } from "@/server/db/client";

type ReplaceWatchImagesInput = {
  productId: string;
  images: Array<{
    id?: string | null;
    fileKey?: string | null;
    key?: string | null;
    path?: string | null;
    url?: string | null;
    role?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
    mime?: string | null;
    sizeBytes?: number | null;
    dominantHex?: string | null;
    contentHash?: string | null;
    isForAdmin?: boolean | null;
    isForStorefront?: boolean | null;
    sortOrder?: number | null;
  }>;
};

type ReorderWatchImagesInput = {
  productId: string;
  imageIds: string[];
};

type SetWatchStorefrontImageInput = {
  productId: string;
  imageId?: string | null;
};

function normalizeRole(role?: string | null) {
  const value = String(role ?? "").trim().toUpperCase();
  if (!value) return null;

  const allowed = new Set([
    "INLINE",
    "GALLERY",
    "PRIMARY",
    "DETAIL",
    "THUMBNAIL",
    "STOREFRONT",
  ]);

  return allowed.has(value) ? value : null;
}

function normalizeMediaItem(
  item: ReplaceWatchImagesInput["images"][number],
  index: number
) {
  return {
    fileKey: item.fileKey ?? item.key ?? item.path ?? null,
    url: item.url ?? null,
    role: normalizeRole(item.role),
    alt: item.alt ?? null,
    width:
      typeof item.width === "number" && Number.isFinite(item.width)
        ? item.width
        : null,
    height:
      typeof item.height === "number" && Number.isFinite(item.height)
        ? item.height
        : null,
    mime: item.mime ?? null,
    sizeBytes:
      typeof item.sizeBytes === "number" && Number.isFinite(item.sizeBytes)
        ? item.sizeBytes
        : null,
    dominantHex: item.dominantHex ?? null,
    contentHash: item.contentHash ?? null,
    isForAdmin:
      typeof item.isForAdmin === "boolean" ? item.isForAdmin : true,
    isForStorefront:
      typeof item.isForStorefront === "boolean" ? item.isForStorefront : false,
    sortOrder:
      typeof item.sortOrder === "number" && Number.isFinite(item.sortOrder)
        ? item.sortOrder
        : index,
  };
}

function pickPrimaryForProductUpdate(
  rows: Array<{
    role?: string | null;
    fileKey?: string | null;
    url?: string | null;
  }>
) {
  return (
    rows.find((item) => item.role === "INLINE") ??
    rows.find((item) => item.role === "STOREFRONT") ??
    rows.find((item) => item.role === "PRIMARY") ??
    rows[0] ??
    null
  );
}

export async function replaceWatchImagesRepo(
  db: DB,
  input: ReplaceWatchImagesInput
) {
  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: { productId: true },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để cập nhật hình");
    }

    const galleryItems = (input.images ?? [])
      .map((item, index) => normalizeMediaItem(item, index))
      .filter((item) => item.role === "GALLERY")
      .filter((item) => item.fileKey || item.url);

    await tx.productImage.deleteMany({
      where: {
        productId: input.productId,
        role: "GALLERY" as any,
      },
    });

    if (galleryItems.length > 0) {
      for (const item of galleryItems) {
        await tx.productImage.create({
          data: {
            productId: input.productId,
            fileKey: item.fileKey,
            url: item.url,
            role: item.role as any,
            alt: item.alt,
            width: item.width,
            height: item.height,
            mime: item.mime,
            sizeBytes: item.sizeBytes,
            dominantHex: item.dominantHex,
            contentHash: item.contentHash,
            isForAdmin: item.isForAdmin,
            isForStorefront: item.isForStorefront,
            sortOrder: item.sortOrder,
          } as Prisma.ProductImageUncheckedCreateInput,
        });
      }
    }

    const allImages = await tx.productImage.findMany({
      where: { productId: input.productId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const primary = pickPrimaryForProductUpdate(
      allImages.map((img: any) => ({
        role: String(img?.role ?? "").toUpperCase(),
        fileKey: img?.fileKey ?? null,
        url: img?.url ?? null,
      }))
    );

    const storefront = allImages.find(
      (img: any) => String(img?.role ?? "").toUpperCase() === "STOREFRONT"
    ) as any;

    await tx.product.update({
      where: { id: input.productId },
      data: {
        primaryImageUrl: primary?.fileKey ?? primary?.url ?? null,
        storefrontImageKey: storefront?.fileKey ?? null,
      },
    });

    return allImages;
  });
}

export async function reorderWatchImagesRepo(
  db: DB,
  input: ReorderWatchImagesInput
) {
  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: { productId: true },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để sắp xếp hình");
    }

    for (let index = 0; index < input.imageIds.length; index += 1) {
      await tx.productImage.updateMany({
        where: {
          id: input.imageIds[index],
          productId: input.productId,
          role: "GALLERY" as any,
        },
        data: {
          sortOrder: index,
        },
      });
    }

    return tx.productImage.findMany({
      where: { productId: input.productId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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
      select: { productId: true },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để đặt storefront");
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

    const image = await tx.productImage.findFirst({
      where: {
        id: input.imageId,
        productId: input.productId,
      },
    });

    if (!image) {
      throw new Error("Không tìm thấy hình cần đặt storefront");
    }

    await tx.product.update({
      where: { id: input.productId },
      data: {
        storefrontImageKey: (image as any).fileKey ?? null,
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