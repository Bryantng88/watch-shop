import { MediaRole } from "@prisma/client";

import {
  mediaRecipeHash,
  normalizeSharpImagePreset,
  prepareWatchMediaSource,
  processImageWithSharp,
  storeWatchMediaDerivatives,
  type SharpImagePreset,
} from "@/domains/media/application";
import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";

const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
export type GallerySharpPreset = SharpImagePreset;
export const processGalleryImageWithSharp = processImageWithSharp;

export async function processWatchGalleryWithSharpApplication(input: {
  productId: string;
  storageKey: string;
  preset?: Partial<GallerySharpPreset> | null;
  actorUserId?: string | null;
}) {
  const productId = String(input.productId ?? "").trim();
  const storageKey = String(input.storageKey ?? "").trim();
  if (!productId || !storageKey) throw new Error("Thiếu Watch hoặc ảnh Gallery nguồn.");

  const watch = await prisma.watch.findUnique({ where: { productId }, select: { id: true } });
  if (!watch) throw new Error("Không tìm thấy Watch.");

  const preset = normalizeSharpImagePreset(input.preset);
  const recipe = { processor: "gallery-sharp", version: 1, preset };
  const recipeHash = mediaRecipeHash(recipe);
  const knownSource = await prisma.mediaObject.findUnique({
    where: { storageKey },
    select: {
      id: true,
      sourceMediaObjectId: true,
      sourceMediaObject: { select: { storageKey: true } },
    },
  });
  // Always process from the Media Core source. The supplied key can already
  // be a derivative, and processing that again would accumulate zoom/crop.
  const sourceStorageKey = knownSource?.sourceMediaObject?.storageKey ?? storageKey;
  if (knownSource) {
    const sourceId = knownSource.sourceMediaObjectId ?? knownSource.id;
    const existing = await prisma.mediaObject.findFirst({
      where: {
        sourceMediaObjectId: sourceId,
        derivativeVariant: "gallery-sharp",
        derivativeRecipeHash: recipeHash,
      },
      select: { storageKey: true },
    });
    if (existing && await mediaStorage.stat(existing.storageKey)) {
      return { storageKey: existing.storageKey, sourceStorageKey, cached: true, preset };
    }
  }

  const source = await mediaStorage.read(sourceStorageKey);
  if (source.bytes.byteLength > MAX_SOURCE_BYTES) throw new Error("Ảnh nguồn vượt quá giới hạn xử lý 30 MB.");
  const result = new Uint8Array(await processGalleryImageWithSharp(source.bytes, preset));
  const preparedSource = await prepareWatchMediaSource({ productId, storageKey: sourceStorageKey });
  const outputs = await storeWatchMediaDerivatives({
    watch: preparedSource.watch,
    sourceMediaObjectId: preparedSource.mediaObject.id,
    outputs: [{
      variant: "gallery-sharp",
      bytes: result,
      contentType: "image/jpeg",
      role: MediaRole.GALLERY,
      recipe,
    }],
  });
  const output = outputs.find((item) => item.role === MediaRole.GALLERY);
  if (!output) throw new Error("Không tạo được derivative Gallery bằng Sharp.");
  return {
    storageKey: output.key,
    sourceStorageKey: preparedSource.mediaObject.storageKey,
    cached: false,
    preset,
  };
}
