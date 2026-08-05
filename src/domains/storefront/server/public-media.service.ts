import { mediaStorage } from "@/domains/media/storage";
import { prisma, type DB, dbOrTx } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/storage-key";
import { publicWatchEligibilityWhere } from "./public-catalog.repo";

export async function signPublicWatchImage(
  input: { productId: string; imageId: string },
  options?: {
    db?: DB;
    expiresInSeconds?: number;
    storage?: Pick<typeof mediaStorage, "sign">;
  },
) {
  const productId = String(input.productId ?? "").trim();
  const imageId = String(input.imageId ?? "").trim();
  if (!productId || !imageId) return null;

  const image = await dbOrTx(options?.db ?? prisma).productImage.findFirst({
    where: {
      id: imageId,
      productId,
      isForStorefront: true,
      fileKey: { not: "" },
      product: { is: publicWatchEligibilityWhere() },
    },
    select: { fileKey: true },
  });

  const key = normalizeKey(image?.fileKey);
  if (!key || /^https?:/i.test(key)) return null;

  return (options?.storage ?? mediaStorage).sign(
    key,
    Math.min(Math.max(options?.expiresInSeconds ?? 300, 60), 600),
  );
}
