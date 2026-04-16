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

export async function replaceWatchImages(
  input: ReplaceWatchImagesInput
) {
  return replaceWatchImagesRepo(prisma as any, input);
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