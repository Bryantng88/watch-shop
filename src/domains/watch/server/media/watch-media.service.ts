import { prisma } from "@/server/db/client";
import type {
  ReplaceWatchImagesInput,
  ReorderWatchImagesInput,
  SetWatchStorefrontImageInput,
} from "../shared";
import {
  getWatchImagesRepo,
  reorderWatchImagesRepo,
  replaceWatchImagesRepo,
  setWatchStorefrontImageRepo,
} from "./watch-media.repo";
import { withDbTransaction, DB } from "@/server/db/client";

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

export async function reorderWatchImages(
  input: ReorderWatchImagesInput
) {
  return reorderWatchImagesRepo(prisma as any, input);
}

export async function setWatchStorefrontImage(
  input: SetWatchStorefrontImageInput
) {
  return setWatchStorefrontImageRepo(prisma as any, input);
}

export async function getWatchImages(productId: string) {
  return getWatchImagesRepo(prisma as any, productId);
}