import { prisma } from "@/server/db/client";
import type {
  ReplaceWatchImagesInput,
  ReorderWatchImagesInput,
  SetWatchStorefrontImageInput,
} from "../shared";
import {
  getWatchImagesRepo,
  reorderWatchImagesRepo,
  setWatchStorefrontImageRepo,
  replaceWatchGalleryImagesRepo
} from "./watch-media.repo";
import { withDbTransaction, DB } from "@/server/db/client";

export async function replaceWatchGalleryImages(input: {
  productId: string;
  images: Array<{
    fileKey: string;
    isForAdmin?: boolean;
    isForStorefront?: boolean;
    sortOrder?: number;
  }>;
}) {
  return replaceWatchGalleryImagesRepo(prisma, input);
}

async function reorderWatchImages(
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