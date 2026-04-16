import { prisma } from "@/server/db/client";
import { replaceWatchImagesRepo, setWatchStorefrontImageRepo } from "./watch-media.repo";

export async function replaceWatchImages(input: any) {
  return prisma.$transaction(async (tx) => replaceWatchImagesRepo(tx as any, input));
}

export async function setWatchStorefrontImage(productId: string, imageId: string | null) {
  return prisma.$transaction(async (tx) => setWatchStorefrontImageRepo(tx as any, productId, imageId));
}
