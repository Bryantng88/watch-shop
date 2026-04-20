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

export async function replaceWatchImages(input: ReplaceWatchImagesInput) {
  const productId = String(input.productId);

  await prisma.productImage.deleteMany({
    where: { productId },
  });

  if (!Array.isArray(input.images) || input.images.length === 0) {
    return [];
  }

  const now = new Date();

  await prisma.productImage.createMany({
    data: input.images.map((item, index) => ({
      id: crypto.randomUUID(),
      productId,
      fileKey: String(item.fileKey),
      role: (item.role as any) || "GALLERY",
      isForAdmin: item.isForAdmin ?? true,
      isForStorefront: item.isForStorefront ?? true,
      sortOrder: item.sortOrder ?? index,
      createdAt: now,
      updatedAt: now,
    })),
  });

  return prisma.productImage.findMany({
    where: { productId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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