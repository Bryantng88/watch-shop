import { MediaRole } from "@prisma/client";
import sharp from "sharp";

import {
  mediaRecipeHash,
  prepareWatchMediaSource,
  storeWatchMediaDerivatives,
} from "@/domains/media/application";
import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";

const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const GALLERY_MAX_DIMENSION = 2400;

export type GallerySharpPreset = {
  brightness: number;
  saturation: number;
  contrast: number;
  metalEnhance: number;
  sharpen: number;
  zoom: number;
  rotation: number;
  cropAspect: "original" | "square" | "portrait" | "landscape";
  cropOffsetX: number;
  cropOffsetY: number;
};

function normalizePreset(value?: Partial<GallerySharpPreset> | null): GallerySharpPreset {
  return {
    brightness: Math.max(-20, Math.min(40, Math.round(Number(value?.brightness ?? 0)))),
    saturation: Math.max(70, Math.min(130, Math.round(Number(value?.saturation ?? 100)))),
    contrast: Math.max(-20, Math.min(30, Math.round(Number(value?.contrast ?? 0)))),
    metalEnhance: Math.max(0, Math.min(20, Math.round(Number(value?.metalEnhance ?? 6)))),
    sharpen: Math.max(0, Math.min(20, Math.round(Number(value?.sharpen ?? 6)))),
    zoom: Math.max(100, Math.min(250, Math.round(Number(value?.zoom ?? 100)))),
    rotation: Math.max(-180, Math.min(180, Math.round(Number(value?.rotation ?? 0)))),
    cropAspect: ["square", "portrait", "landscape"].includes(String(value?.cropAspect))
      ? value?.cropAspect as GallerySharpPreset["cropAspect"]
      : "original",
    cropOffsetX: Math.max(-100, Math.min(100, Math.round(Number(value?.cropOffsetX ?? 0)))),
    cropOffsetY: Math.max(-100, Math.min(100, Math.round(Number(value?.cropOffsetY ?? 0)))),
  };
}

export async function processGalleryImageWithSharp(source: Uint8Array, preset: GallerySharpPreset) {
  const contrast = preset.contrast / 100;
  const metal = preset.metalEnhance / 100;
  const rotated = await sharp(source)
    .autoOrient()
    .rotate(preset.rotation, { background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: "#ffffff" })
    .toBuffer({ resolveWithObject: true });
  const width = rotated.info.width;
  const height = rotated.info.height;
  const aspect = preset.cropAspect === "square"
    ? 1
    : preset.cropAspect === "portrait"
      ? 4 / 5
      : preset.cropAspect === "landscape"
        ? 5 / 4
        : width / height;
  let cropWidth = width;
  let cropHeight = Math.round(cropWidth / aspect);
  if (cropHeight > height) {
    cropHeight = height;
    cropWidth = Math.round(cropHeight * aspect);
  }
  const zoomScale = 100 / preset.zoom;
  cropWidth = Math.max(1, Math.min(width, Math.round(cropWidth * zoomScale)));
  cropHeight = Math.max(1, Math.min(height, Math.round(cropHeight * zoomScale)));
  const availableX = width - cropWidth;
  const availableY = height - cropHeight;
  const left = Math.max(0, Math.min(availableX, Math.round(availableX * (preset.cropOffsetX + 100) / 200)));
  const top = Math.max(0, Math.min(availableY, Math.round(availableY * (preset.cropOffsetY + 100) / 200)));

  let pipeline = sharp(rotated.data)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize({
      width: GALLERY_MAX_DIMENSION,
      height: GALLERY_MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .modulate({
      brightness: 1 + preset.brightness / 100,
      saturation: preset.saturation / 100,
    });

  if (preset.contrast !== 0 || preset.metalEnhance > 0) {
    const gain = 1 + contrast + metal * 0.35;
    pipeline = pipeline.linear(gain, 128 * (1 - gain) + metal * 5);
  }
  if (preset.sharpen > 0 || preset.metalEnhance > 0) {
    pipeline = pipeline.sharpen({ sigma: 0.35 + preset.sharpen / 12 + metal * 0.5 });
  }

  return pipeline.jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toBuffer();
}

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

  const preset = normalizePreset(input.preset);
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
