import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

import { mediaPathPolicy } from "@/domains/media/core/media-path.policy";
import { mediaStorage } from "@/domains/media/storage";
import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  type PhotoRoomAdjustment,
} from "@/domains/watch/shared/photoroom-adjustment";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";

const PHOTOROOM_EDIT_URL = "https://image-api.photoroom.com/v2/edit";
const PHOTOROOM_REMOVE_BACKGROUND_URL = "https://sdk.photoroom.com/v1/segment";
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const PHOTOROOM_RELIGHT_MAX_DIMENSION = 3500;
const COVER_WIDTH = 2048;
const COVER_HEIGHT = 3840;

type PhotoRoomProcessingMode = "basic-sharp" | "plus";
type SharpShadowProfile = "light" | "legacy";

const PHOTOROOM_PADDING_BY_SIZE = {
  small: 0.14,
  default: 0.1,
  large: 0.06,
  xlarge: 0.02,
} as const;
const PHOTOROOM_FINE_OFFSET = 0.06;

type SharpShadowSettings = {
  ambientBlur: number;
  ambientOpacity: number;
  ambientOffsetX: number;
  ambientOffsetY: number;
  contactOpacity: number;
};

const SHARP_SHADOW_PROFILES = {
  light: {
    ambientBlur: 38,
    ambientOpacity: 0.025,
    ambientOffsetX: 72,
    ambientOffsetY: 18,
    contactOpacity: 0,
  },
  legacy: {
    ambientBlur: 64,
    ambientOpacity: 0.07,
    ambientOffsetX: 20,
    ambientOffsetY: 26,
    contactOpacity: 0.045,
  },
} satisfies Record<SharpShadowProfile, SharpShadowSettings>;

function photoRoomProcessingMode(): PhotoRoomProcessingMode {
  return process.env.PHOTOROOM_PROCESSING_MODE === "basic-sharp"
    ? "basic-sharp"
    : "plus";
}

function sharpShadowProfile(): SharpShadowProfile {
  return process.env.PHOTOROOM_SHARP_SHADOW_PROFILE === "legacy"
    ? "legacy"
    : "light";
}

function imageContentType(format: string | undefined) {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  if (format === "tiff") return "image/tiff";
  return "image/jpeg";
}

function photoRoomErrorMessage(status: number, body: string) {
  const detail = body.trim().slice(0, 300);
  return `PhotoRoom xử lý ảnh thất bại (${status})${detail ? `: ${detail}` : "."}`;
}

async function createSoftShadow(input: Buffer, options: {
  width: number;
  height: number;
  padding: number;
  blur: number;
  opacity: number;
  color: { r: number; g: number; b: number };
}) {
  const alpha = await sharp(input)
    .ensureAlpha()
    .extractChannel("alpha")
    .extend({
      top: options.padding,
      right: options.padding,
      bottom: options.padding,
      left: options.padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .blur(options.blur)
    .linear(options.opacity, 0)
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: options.width + options.padding * 2,
      height: options.height + options.padding * 2,
      channels: 3,
      background: options.color,
    },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

async function extractSubjectFromWhiteBackground(input: Uint8Array) {
  const image = await sharp(input)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = image.info;
  const pixels = image.data;
  let hasTransparentPixel = false;
  for (let offset = 3; offset < pixels.length; offset += channels) {
    if (pixels[offset] < 250) {
      hasTransparentPixel = true;
      break;
    }
  }
  if (!hasTransparentPixel) {
    throw new Error("Ảnh này đã có nền và shadow. Hãy dùng file cutout PNG trong suốt để tránh chồng bóng.");
  }
  const queue = new Uint32Array(width * height);
  let head = 0;
  let tail = 0;

  const enqueueBackground = (pixelIndex: number) => {
    const offset = pixelIndex * channels;
    if (pixels[offset + 3] === 0) return;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];
    const minimum = Math.min(r, g, b);
    const maximum = Math.max(r, g, b);
    const isLightNeutralBackground = minimum >= 205 && maximum - minimum <= 32;
    if (!isLightNeutralBackground) return;
    pixels[offset + 3] = 0;
    queue[tail++] = pixelIndex;
  };

  for (let x = 0; x < width; x += 1) {
    enqueueBackground(x);
    enqueueBackground((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueueBackground(y * width);
    enqueueBackground(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueueBackground(index - 1);
    if (x + 1 < width) enqueueBackground(index + 1);
    if (y > 0) enqueueBackground(index - width);
    if (y + 1 < height) enqueueBackground(index + width);
  }

  return sharp(pixels, { raw: image.info }).png().toBuffer();
}

export async function composeBasicStorefrontCover(cutoutBytes: Uint8Array) {
  const shadow = SHARP_SHADOW_PROFILES[sharpShadowProfile()];
  const trimmed = await sharp(cutoutBytes)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const safeInset = 0.1;
  const resized = await sharp(trimmed)
    .resize({
      width: Math.floor(COVER_WIDTH * (1 - safeInset * 2)),
      height: Math.floor(COVER_HEIGHT * (1 - safeInset * 2)),
      fit: "inside",
      withoutEnlargement: false,
    })
    .modulate({ brightness: 1.025, saturation: 1.01 })
    .png()
    .toBuffer({ resolveWithObject: true });
  const subjectWidth = resized.info.width;
  const subjectHeight = resized.info.height;
  const left = Math.round((COVER_WIDTH - subjectWidth) / 2);
  const top = Math.round((COVER_HEIGHT - subjectHeight) / 2);

  const ambientShadowPadding = 128;
  const contactShadowPadding = 48;
  const ambientShadow = await createSoftShadow(resized.data, {
    width: subjectWidth,
    height: subjectHeight,
    padding: ambientShadowPadding,
    blur: shadow.ambientBlur,
    opacity: shadow.ambientOpacity,
    color: { r: 42, g: 45, b: 47 },
  });
  const contactShadow = shadow.contactOpacity > 0
    ? await createSoftShadow(resized.data, {
      width: subjectWidth,
      height: subjectHeight,
      padding: contactShadowPadding,
      blur: 18,
      opacity: shadow.contactOpacity,
      color: { r: 30, g: 34, b: 36 },
    })
    : null;

  return sharp({
    create: {
      width: COVER_WIDTH,
      height: COVER_HEIGHT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: ambientShadow,
        left: left - ambientShadowPadding + shadow.ambientOffsetX,
        top: top - ambientShadowPadding + shadow.ambientOffsetY,
      },
      ...(contactShadow ? [{
          input: contactShadow,
          left: left - contactShadowPadding + 8,
          top: top - contactShadowPadding + 10,
        }] : []),
      { input: resized.data, left, top },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function recreateWatchCoverWithSharpApplication(input: {
  productId: string;
  storageKey: string;
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh nguồn.");

  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: { audienceSegment: true },
  });
  if (!watch) throw new Error("Không tìm thấy Watch.");

  const source = await mediaStorage.read(sourceKey);
  const cutout = await extractSubjectFromWhiteBackground(source.bytes);
  const resultBytes = new Uint8Array(await composeBasicStorefrontCover(cutout));
  const prefix = mediaPathPolicy.sourceRoot({
    segment: watch.audienceSegment,
    purpose: "cover",
  });
  const outputKey = `${prefix}/sharp-light-${productId}-${randomUUID()}.png`;
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: outputKey,
    Body: resultBytes,
    ContentType: "image/png",
  }));

  const stored = await mediaStorage.stat(outputKey);
  if (!stored || stored.sizeBytes !== resultBytes.byteLength) {
    throw new Error("Không xác minh được ảnh Sharp sau khi lưu vào kho media.");
  }
  return { storageKey: outputKey, sourceStorageKey: sourceKey, processingMode: "sharp" };
}

export async function processWatchCoverWithPhotoRoomApplication(input: {
  productId: string;
  storageKey: string;
  adjustment?: PhotoRoomAdjustment | null;
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  const apiKey = String(process.env.PHOTOROOM_API_KEY ?? "").trim();
  const processingMode = photoRoomProcessingMode();
  const adjustment = input.adjustment ?? DEFAULT_PHOTOROOM_ADJUSTMENT;

  if (input.adjustment && processingMode !== "plus") {
    throw new Error("PhotoRoom adjustment requires Image Editing API mode.");
  }

  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh nguồn.");
  if (!apiKey) throw new Error("Production chưa cấu hình PHOTOROOM_API_KEY.");

  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: { audienceSegment: true },
  });
  if (!watch) throw new Error("Không tìm thấy Watch.");

  const source = await mediaStorage.read(sourceKey);
  if (source.bytes.byteLength > MAX_SOURCE_BYTES) {
    throw new Error("Ảnh nguồn vượt quá giới hạn 30 MB của PhotoRoom.");
  }

  const prepared = await sharp(source.bytes)
    .rotate()
    .resize({
      width: PHOTOROOM_RELIGHT_MAX_DIMENSION,
      height: PHOTOROOM_RELIGHT_MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer({ resolveWithObject: true });

  const form = new FormData();
  const sourceBuffer = Uint8Array.from(prepared.data).buffer;
  const sourceBlob = new Blob([sourceBuffer], {
    type: imageContentType(prepared.info.format),
  });
  const sourceFilename = sourceKey.split("/").pop() || "watch-cover.jpg";
  if (processingMode === "basic-sharp") {
    form.set("image_file", sourceBlob, sourceFilename);
    form.set("format", "png");
    form.set("channels", "rgba");
    form.set("size", "full");
    form.set("crop", "true");
  } else {
    const padding = PHOTOROOM_PADDING_BY_SIZE[adjustment.subjectSize];
    const paddingLeft = padding + (adjustment.horizontalOffset === "positive" ? PHOTOROOM_FINE_OFFSET : 0);
    const paddingRight = padding + (adjustment.horizontalOffset === "negative" ? PHOTOROOM_FINE_OFFSET : 0);
    const paddingTop = padding + (adjustment.verticalOffset === "positive" ? PHOTOROOM_FINE_OFFSET : 0);
    const paddingBottom = padding + (adjustment.verticalOffset === "negative" ? PHOTOROOM_FINE_OFFSET : 0);
    form.set("imageFile", sourceBlob, sourceFilename);
    form.set("removeBackground", "true");
    if (adjustment.backgroundMode === "white") form.set("background.color", "FFFFFF");
    if (adjustment.shadowMode !== "none") form.set("shadow.mode", `ai.${adjustment.shadowMode}`);
    form.set("lighting.mode", "ai.preserve-hue-and-saturation");
    form.set("outputSize", `${COVER_WIDTH}x${COVER_HEIGHT}`);
    form.set("scaling", "fit");
    form.set("padding", String(padding));
    form.set("paddingLeft", String(paddingLeft));
    form.set("paddingRight", String(paddingRight));
    form.set("paddingTop", String(paddingTop));
    form.set("paddingBottom", String(paddingBottom));
    form.set("margin", "0.04");
    form.set("referenceBox", "subjectBox");
    form.set("horizontalAlignment", adjustment.horizontalAlignment);
    form.set("verticalAlignment", adjustment.verticalAlignment);
    form.set("ignorePaddingAndSnapOnCroppedSides", "false");
    form.set("export.format", "png");
  }

  const response = await fetch(
    processingMode === "basic-sharp"
      ? PHOTOROOM_REMOVE_BACKGROUND_URL
      : PHOTOROOM_EDIT_URL,
    {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
    signal: AbortSignal.timeout(90_000),
    },
  );
  if (!response.ok) {
    throw new Error(photoRoomErrorMessage(response.status, await response.text()));
  }

  const photoRoomBytes = new Uint8Array(await response.arrayBuffer());
  const resultBytes = processingMode === "basic-sharp"
    ? new Uint8Array(await composeBasicStorefrontCover(photoRoomBytes))
    : photoRoomBytes;
  if (!resultBytes.byteLength) throw new Error("PhotoRoom trả về ảnh rỗng.");

  const prefix = mediaPathPolicy.sourceRoot({
    segment: watch.audienceSegment,
    purpose: "cover",
  });
  const cutoutKey = processingMode === "basic-sharp"
    ? `${prefix}/photoroom-cutout-${productId}-${randomUUID()}.png`
    : null;
  if (cutoutKey) {
    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: cutoutKey,
      Body: photoRoomBytes,
      ContentType: "image/png",
    }));
  }
  const outputKey = `${prefix}/photoroom-${processingMode}-${productId}-${randomUUID()}.png`;
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: outputKey,
    Body: resultBytes,
    ContentType: "image/png",
  }));

  const stored = await mediaStorage.stat(outputKey);
  if (!stored || stored.sizeBytes !== resultBytes.byteLength) {
    throw new Error("Không xác minh được ảnh PhotoRoom sau khi lưu vào kho media.");
  }

  return {
    storageKey: outputKey,
    sourceStorageKey: sourceKey,
    cutoutStorageKey: cutoutKey,
    processingMode,
    adjustment: processingMode === "plus" ? adjustment : null,
  };
}
