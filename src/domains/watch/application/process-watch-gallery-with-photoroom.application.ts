import { MediaRole } from "@prisma/client";
import sharp from "sharp";

import {
  mediaRecipeHash,
  prepareWatchMediaSource,
  storeWatchMediaDerivatives,
} from "@/domains/media/application";
import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";

const PHOTOROOM_REMOVE_BACKGROUND_URL = "https://sdk.photoroom.com/v1/segment";
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const GALLERY_MAX_DIMENSION = 2400;

export type GalleryPhotoRoomPreset = {
  backgroundBlur: number;
  metalEnhance: number;
  shadowOpacity: number;
  highlight: number;
  brightness: number;
  saturation: number;
};

function normalizePreset(value?: Partial<GalleryPhotoRoomPreset> | null): GalleryPhotoRoomPreset {
  return {
    backgroundBlur: Math.max(0, Math.min(24, Math.round(Number(value?.backgroundBlur ?? 6)))),
    metalEnhance: Math.max(0, Math.min(20, Math.round(Number(value?.metalEnhance ?? 6)))),
    shadowOpacity: Math.max(0, Math.min(20, Math.round(Number(value?.shadowOpacity ?? 6)))),
    highlight: Math.max(-10, Math.min(20, Math.round(Number(value?.highlight ?? 4)))),
    brightness: Math.max(-20, Math.min(40, Math.round(Number(value?.brightness ?? 0)))),
    saturation: Math.max(70, Math.min(130, Math.round(Number(value?.saturation ?? 100)))),
  };
}

async function composeGalleryImage(original: Uint8Array, cutout: Uint8Array, preset: GalleryPhotoRoomPreset) {
  const metadata = await sharp(original).metadata();
  const width = metadata.width ?? GALLERY_MAX_DIMENSION;
  const height = metadata.height ?? GALLERY_MAX_DIMENSION;
  const background = preset.backgroundBlur > 0
    ? await sharp(original).blur(Math.max(0.3, preset.backgroundBlur)).png().toBuffer()
    : await sharp(original).png().toBuffer();
  let subject = sharp(cutout).ensureAlpha().resize(width, height, { fit: "fill" }).modulate({
    brightness: 1 + preset.highlight / 100,
    saturation: preset.saturation / 100,
  });
  if (preset.metalEnhance > 0) {
    const strength = preset.metalEnhance / 100;
    subject = subject.linear(1 + strength * 0.45, strength * 12).sharpen({ sigma: 0.25 + strength });
  }
  const adjustedSubject = await subject.png().toBuffer();
  const layers: sharp.OverlayOptions[] = [];
  if (preset.shadowOpacity > 0) {
    const alpha = await sharp(adjustedSubject)
      .extractChannel("alpha")
      .blur(Math.max(8, Math.round(Math.min(width, height) * 0.012)))
      .linear(preset.shadowOpacity / 100, 0)
      .toBuffer();
    const shadow = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 45, g: 48, b: 52 },
      },
    }).joinChannel(alpha).png().toBuffer();
    layers.push({ input: shadow, left: 0, top: 0 });
  }
  layers.push({ input: adjustedSubject, left: 0, top: 0 });
  const composed = await sharp(background).composite(layers).png().toBuffer();
  return sharp(composed)
    .modulate({ brightness: 1 + preset.brightness / 100 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

export async function processWatchGalleryWithPhotoRoomApplication(input: {
  productId: string;
  storageKey: string;
  preset?: Partial<GalleryPhotoRoomPreset> | null;
  actorUserId?: string | null;
}) {
  const productId = String(input.productId ?? "").trim();
  const storageKey = String(input.storageKey ?? "").trim();
  const apiKey = String(process.env.PHOTOROOM_API_KEY ?? "").trim();
  if (!productId || !storageKey) throw new Error("Thiếu Watch hoặc ảnh Gallery nguồn.");
  if (!apiKey) throw new Error("Production chưa cấu hình PHOTOROOM_API_KEY.");

  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: { id: true },
  });
  if (!watch) throw new Error("Không tìm thấy Watch.");

  const preset = normalizePreset(input.preset);
  const recipe = { processor: "photoroom-gallery", version: 3, preset };
  const recipeHash = mediaRecipeHash(recipe);
  const knownSource = await prisma.mediaObject.findUnique({
    where: { storageKey },
    select: { id: true, sourceMediaObjectId: true },
  });
  if (knownSource) {
    const sourceId = knownSource.sourceMediaObjectId ?? knownSource.id;
    const existing = await prisma.mediaObject.findFirst({
      where: {
        sourceMediaObjectId: sourceId,
        derivativeVariant: "gallery-photoroom",
        derivativeRecipeHash: recipeHash,
      },
      select: { storageKey: true },
    });
    if (existing && await mediaStorage.stat(existing.storageKey)) {
      return { storageKey: existing.storageKey, sourceStorageKey: storageKey, cached: true, preset };
    }
  }

  const source = await mediaStorage.read(storageKey);
  if (source.bytes.byteLength > MAX_SOURCE_BYTES) throw new Error("Ảnh nguồn vượt quá giới hạn 30 MB của PhotoRoom.");
  const prepared = await sharp(source.bytes)
    .rotate()
    .resize({ width: GALLERY_MAX_DIMENSION, height: GALLERY_MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const form = new FormData();
  form.set("image_file", new Blob([Uint8Array.from(prepared.data).buffer], { type: `image/${prepared.info.format || "jpeg"}` }), storageKey.split("/").pop() || "gallery.jpg");
  form.set("format", "png");
  form.set("channels", "rgba");
  form.set("size", "full");
  // Keep the original canvas so the transparent subject can be composed back
  // over the softly blurred original background without changing framing.
  form.set("crop", "false");
  const response = await fetch(PHOTOROOM_REMOVE_BACKGROUND_URL, {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    const detail = (await response.text()).trim().slice(0, 300);
    throw new Error(`PhotoRoom xử lý Gallery thất bại (${response.status})${detail ? `: ${detail}` : "."}`);
  }
  const cutout = new Uint8Array(await response.arrayBuffer());
  const result = new Uint8Array(await composeGalleryImage(new Uint8Array(prepared.data), cutout, preset));
  const preparedSource = await prepareWatchMediaSource({ productId, storageKey });
  const outputs = await storeWatchMediaDerivatives({
    watch: preparedSource.watch,
    sourceMediaObjectId: preparedSource.mediaObject.id,
    // Gallery must not reuse THUMBNAIL for its transparent intermediate: that
    // role owns the Cover cutout and replacing it would break later Sharp edits.
    outputs: [{
        variant: "gallery-photoroom",
        bytes: result,
        contentType: "image/jpeg",
        role: MediaRole.GALLERY,
        recipe,
      }],
  });
  const output = outputs.find((item) => item.role === MediaRole.GALLERY);
  if (!output) throw new Error("Không tạo được derivative Gallery từ PhotoRoom.");
  return {
    storageKey: output.key,
    sourceStorageKey: preparedSource.mediaObject.storageKey,
    cached: false,
    preset,
  };
}
