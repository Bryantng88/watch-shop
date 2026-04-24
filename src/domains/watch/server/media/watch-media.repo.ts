import { ImageRole } from "@prisma/client";
import { dbOrTx, withDbTransaction, type DB } from "@/server/db/client";

type WatchImageInput = {
  fileKey: string;
  isForAdmin?: boolean | null;
  isForStorefront?: boolean | null;
  sortOrder?: number | null;
};

type ReplaceWatchImagesInput = {
  productId: string;
  role: ImageRole;
  images: WatchImageInput[];
};

type ReorderWatchImagesInput = {
  productId: string;
  imageIds: string[];
  role?: ImageRole;
};

type SetWatchStorefrontImageInput = {
  productId: string;
  imageId?: string | null;
};

function normalizeSortOrder(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

async function assertWatchExists(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    select: { productId: true },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  return watch;
}

export async function replaceWatchImagesRepo(
  db: DB,
  input: ReplaceWatchImagesInput
) {
  await assertWatchExists(db, input.productId);

  return withDbTransaction(db, async (tx) => {
    await tx.productImage.deleteMany({
      where: {
        productId: input.productId,
        role: input.role,
      },
    });

    if (input.images.length > 0) {
      const data = input.images.map((image, index) => ({
        productId: input.productId,
        fileKey: image.fileKey,
        role: input.role,
        isForAdmin: image.isForAdmin ?? true,
        isForStorefront: image.isForStorefront ?? true,
        sortOrder: normalizeSortOrder(image.sortOrder, index),
      }));

      await tx.productImage.createMany({ data });
    }

    return tx.productImage.findMany({
      where: {
        productId: input.productId,
        role: input.role,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  });
}

export async function replaceWatchGalleryImagesRepo(
  db: DB,
  input: {
    productId: string;
    images: WatchImageInput[];
  }
) {
  return replaceWatchImagesRepo(db, {
    productId: input.productId,
    role: ImageRole.GALLERY,
    images: input.images,
  });
}

export async function reorderWatchImagesRepo(
  db: DB,
  input: ReorderWatchImagesInput
) {
  await assertWatchExists(db, input.productId);

  const role = input.role ?? ImageRole.GALLERY;

  return withDbTransaction(db, async (tx) => {
    for (let index = 0; index < input.imageIds.length; index += 1) {
      await tx.productImage.updateMany({
        where: {
          id: input.imageIds[index],
          productId: input.productId,
          role,
        },
        data: {
          sortOrder: index,
        },
      });
    }

    return tx.productImage.findMany({
      where: {
        productId: input.productId,
        role,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  });
}

export async function setWatchStorefrontImageRepo(
  db: DB,
  input: SetWatchStorefrontImageInput
) {
  await assertWatchExists(db, input.productId);

  return withDbTransaction(db, async (tx) => {
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
      select: {
        id: true,
        fileKey: true,
        role: true,
        productId: true,
      },
    });

    if (!image) {
      throw new Error("Không tìm thấy hình cần đặt storefront");
    }

    await tx.product.update({
      where: { id: input.productId },
      data: {
        storefrontImageKey: image.fileKey ?? null,
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

export async function getWatchInlineImageRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  return client.productImage.findFirst({
    where: {
      productId,
      role: ImageRole.INLINE,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getWatchGalleryImagesRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  return client.productImage.findMany({
    where: {
      productId,
      role: ImageRole.GALLERY,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}