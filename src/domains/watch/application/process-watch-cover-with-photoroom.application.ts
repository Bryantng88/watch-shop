import { MediaRole } from "@prisma/client";
import sharp from "sharp";

import {
  prepareWatchMediaSource,
  getWatchMediaOwner,
  storeWatchMediaDerivatives,
} from "@/domains/media/application";
import { mediaStorage } from "@/domains/media/storage";
import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  isReusableSharpCoverKey,
  isTransparentSharpCoverKey,
  type PhotoRoomAdjustment,
} from "@/domains/watch/shared/photoroom-adjustment";
import { prisma } from "@/server/db/client";

const PHOTOROOM_EDIT_URL = "https://image-api.photoroom.com/v2/edit";
const PHOTOROOM_REMOVE_BACKGROUND_URL = "https://sdk.photoroom.com/v1/segment";
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const PHOTOROOM_RELIGHT_MAX_DIMENSION = 3500;
const COVER_WIDTH = 2048;
const COVER_HEIGHT = 3840;

type PhotoRoomProcessingMode = "basic-sharp" | "plus";
type SharpShadowProfile = "light" | "legacy";


function normalizedZoom(adjustment: PhotoRoomAdjustment) {
  return Math.max(40, Math.min(200, adjustment.zoomPercent ?? 100));
}

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

async function composeAdjustedStorefrontCover(
  cutoutBytes: Uint8Array,
  adjustment: PhotoRoomAdjustment,
  rotationDelta: number,
  flipHorizontalDelta = false,
  sourceHasTransparentBackground = true,
  baseZoomPercent = 100,
) {
  const sizeScale = sourceHasTransparentBackground
    ? normalizedZoom(adjustment) / 100
    : normalizedZoom(adjustment) / Math.max(40, baseZoomPercent);
  const subjectSource = sourceHasTransparentBackground
    ? sharp(cutoutBytes)
    : sharp(cutoutBytes).trim({
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      threshold: 12,
    });
  const orientedSource = flipHorizontalDelta ? subjectSource.flop() : subjectSource;
  const rotated = await orientedSource
    .rotate(rotationDelta, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer({ resolveWithObject: true });
  const resized = await sharp(rotated.data)
    .resize({
      width: Math.max(1, Math.floor((sourceHasTransparentBackground ? COVER_WIDTH : rotated.info.width) * sizeScale)),
      height: Math.max(1, Math.floor((sourceHasTransparentBackground ? COVER_HEIGHT : rotated.info.height) * sizeScale)),
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer({ resolveWithObject: true });
  const rawWidth = resized.info.width;
  const rawHeight = resized.info.height;
  const overflowX = Math.max(0, rawWidth - COVER_WIDTH);
  const overflowY = Math.max(0, rawHeight - COVER_HEIGHT);
  const offsetX = Math.round(COVER_WIDTH * adjustment.horizontalOffsetPercent / 100);
  const offsetY = Math.round(COVER_HEIGHT * adjustment.verticalOffsetPercent / 100);
  const cropLeft = Math.max(0, Math.min(overflowX,
    (adjustment.horizontalAlignment === "left" ? 0 : adjustment.horizontalAlignment === "right" ? overflowX : Math.round(overflowX / 2)) - offsetX,
  ));
  const cropTop = Math.max(0, Math.min(overflowY,
    (adjustment.verticalAlignment === "top" ? 0 : adjustment.verticalAlignment === "bottom" ? overflowY : Math.round(overflowY / 2)) - offsetY,
  ));
  const subject = overflowX || overflowY
    ? await sharp(resized.data).extract({
      left: cropLeft,
      top: cropTop,
      width: Math.min(rawWidth, COVER_WIDTH),
      height: Math.min(rawHeight, COVER_HEIGHT),
    }).png().toBuffer({ resolveWithObject: true })
    : resized;
  const subjectWidth = subject.info.width;
  const subjectHeight = subject.info.height;
  const availableX = Math.max(0, COVER_WIDTH - subjectWidth);
  const availableY = Math.max(0, COVER_HEIGHT - subjectHeight);
  const alignedLeft = adjustment.horizontalAlignment === "left"
    ? 0
    : adjustment.horizontalAlignment === "right"
      ? availableX
      : Math.round(availableX / 2);
  const alignedTop = adjustment.verticalAlignment === "top"
    ? 0
    : adjustment.verticalAlignment === "bottom"
      ? availableY
      : Math.round(availableY / 2);
  const left = Math.max(0, Math.min(availableX, alignedLeft + offsetX));
  const top = Math.max(0, Math.min(availableY, alignedTop + offsetY));
  return sharp({
    create: {
      width: COVER_WIDTH,
      height: COVER_HEIGHT,
      channels: 4,
      background: adjustment.backgroundMode === "transparent"
        ? { r: 255, g: 255, b: 255, alpha: 0 }
        : { r: 255, g: 255, b: 255, alpha: 1 },
    },
  }).composite([{ input: subject.data, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function recreateWatchCoverWithSharpApplication(input: {
  productId: string;
  storageKey: string;
  adjustment?: PhotoRoomAdjustment | null;
  baseAdjustment?: PhotoRoomAdjustment | null;
  actorUserId?: string | null;
  deferConsumers?: (work: () => Promise<void>) => void;
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh nguồn.");
  const isTransparentCutout = isTransparentSharpCoverKey(sourceKey);
  const isReusableResult = isReusableSharpCoverKey(sourceKey);
  if (!isReusableResult) {
    throw new Error("Sharp chỉ xử lý Cover đã qua PhotoRoom/Sharp; ảnh gốc cần PhotoRoom tạo nền sạch lần đầu.");
  }

  await getWatchMediaOwner(productId);
  const source = await mediaStorage.read(sourceKey);
  const cutout = source.bytes;
  const adjustment = input.adjustment ?? DEFAULT_PHOTOROOM_ADJUSTMENT;
  const baseAdjustment = input.baseAdjustment ?? DEFAULT_PHOTOROOM_ADJUSTMENT;
  const baseRotation = baseAdjustment.orientationDegrees + baseAdjustment.rotationDegrees;
  const nextRotation = adjustment.orientationDegrees + adjustment.rotationDegrees;
  const resultBytes = new Uint8Array(await composeAdjustedStorefrontCover(
    cutout,
    { ...adjustment, shadowMode: "none" },
    nextRotation - baseRotation,
    adjustment.flipHorizontal !== baseAdjustment.flipHorizontal,
    isTransparentCutout,
    normalizedZoom(baseAdjustment),
  ));
  const { watch, mediaObject } = await prepareWatchMediaSource({ productId, storageKey: sourceKey });
  const [output] = await storeWatchMediaDerivatives({
    watch,
    sourceMediaObjectId: mediaObject.id,
    outputs: [{
      variant: "cover-sharp",
      bytes: resultBytes,
      contentType: "image/png",
      role: MediaRole.COVER,
      recipe: {
        processor: "sharp-cover",
        version: 1,
        sourceStorageKey: mediaObject.storageKey,
        adjustment,
        baseAdjustment,
      },
    }],
  });
  return { storageKey: output.key, sourceStorageKey: mediaObject.storageKey, processingMode: "sharp" };
}

export async function previewWatchCoverWithSharpApplication(input: {
  productId: string;
  storageKey: string;
  adjustment?: PhotoRoomAdjustment | null;
  baseAdjustment?: PhotoRoomAdjustment | null;
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh nguồn.");
  const isTransparentCutout = isTransparentSharpCoverKey(sourceKey);
  if (!isReusableSharpCoverKey(sourceKey)) {
    throw new Error("Preview Sharp chỉ hỗ trợ Cover đã qua PhotoRoom/Sharp.");
  }
  const watchExists = await prisma.watch.findFirst({
    where: { productId },
    select: { id: true },
  });
  if (!watchExists) throw new Error("Không tìm thấy Watch.");
  const source = await mediaStorage.read(sourceKey);
  const adjustment = input.adjustment ?? DEFAULT_PHOTOROOM_ADJUSTMENT;
  const baseAdjustment = input.baseAdjustment ?? DEFAULT_PHOTOROOM_ADJUSTMENT;
  const result = await composeAdjustedStorefrontCover(
    source.bytes,
    { ...adjustment, shadowMode: "none" },
    adjustment.orientationDegrees + adjustment.rotationDegrees
      - baseAdjustment.orientationDegrees - baseAdjustment.rotationDegrees,
    adjustment.flipHorizontal !== baseAdjustment.flipHorizontal,
    isTransparentCutout,
    normalizedZoom(baseAdjustment),
  );
  return sharp(result)
    .resize({ width: 320, height: 600, fit: "fill" })
    .png({ compressionLevel: 7 })
    .toBuffer();
}

export async function processWatchCoverWithPhotoRoomApplication(input: {
  productId: string;
  storageKey: string;
  adjustment?: PhotoRoomAdjustment | null;
  actorUserId?: string | null;
  processingKind?: "INITIAL" | "REPROCESS";
  deferConsumers?: (work: () => Promise<void>) => void;
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  const apiKey = String(process.env.PHOTOROOM_API_KEY ?? "").trim();
  const processingMode = photoRoomProcessingMode();
  const adjustment = input.adjustment ?? DEFAULT_PHOTOROOM_ADJUSTMENT;
  const totalRotationDegrees = adjustment.orientationDegrees + adjustment.rotationDegrees;

  if (input.adjustment && processingMode !== "plus") {
    throw new Error("PhotoRoom adjustment requires Image Editing API mode.");
  }

  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh nguồn.");
  if (!apiKey) throw new Error("Production chưa cấu hình PHOTOROOM_API_KEY.");

  await getWatchMediaOwner(productId);
  const source = await mediaStorage.read(sourceKey);
  if (source.bytes.byteLength > MAX_SOURCE_BYTES) {
    throw new Error("Ảnh nguồn vượt quá giới hạn 30 MB của PhotoRoom.");
  }

  let preparedSource = sharp(source.bytes).rotate();
  if (adjustment.flipHorizontal) preparedSource = preparedSource.flop();
  const prepared = await preparedSource
    .rotate(totalRotationDegrees, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
    const zoomPercent = normalizedZoom(adjustment);
    const padding = Math.max(0, (1 - zoomPercent / 100) / 2);
    const horizontalOffset = adjustment.horizontalOffsetPercent / 100;
    const verticalOffset = adjustment.verticalOffsetPercent / 100;
    const paddingLeft = padding + Math.max(0, horizontalOffset);
    const paddingRight = padding + Math.max(0, -horizontalOffset);
    const paddingTop = padding + Math.max(0, verticalOffset);
    const paddingBottom = padding + Math.max(0, -verticalOffset);
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
    form.set("margin", "0");
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
  let resultBytes = processingMode === "basic-sharp"
    ? new Uint8Array(await composeBasicStorefrontCover(photoRoomBytes))
    : photoRoomBytes;
  if (processingMode === "plus" && normalizedZoom(adjustment) > 100) {
    const zoomFactor = normalizedZoom(adjustment) / 100;
    const zoomedWidth = Math.round(COVER_WIDTH * zoomFactor);
    const zoomedHeight = Math.round(COVER_HEIGHT * zoomFactor);
    const overflowX = zoomedWidth - COVER_WIDTH;
    const overflowY = zoomedHeight - COVER_HEIGHT;
    const left = adjustment.horizontalAlignment === "left"
      ? 0
      : adjustment.horizontalAlignment === "right"
        ? overflowX
        : Math.round(overflowX / 2);
    const top = adjustment.verticalAlignment === "top"
      ? 0
      : adjustment.verticalAlignment === "bottom"
        ? overflowY
        : Math.round(overflowY / 2);

    resultBytes = new Uint8Array(await sharp(resultBytes)
      .resize(zoomedWidth, zoomedHeight, { fit: "fill" })
      .extract({ left, top, width: COVER_WIDTH, height: COVER_HEIGHT })
      .png()
      .toBuffer());
  }
  if (adjustment.enhanceMetal) {
    resultBytes = new Uint8Array(await sharp(resultBytes)
      .modulate({ brightness: 1.02, saturation: 1.02 })
      .linear(1.035, 4)
      .sharpen({ sigma: 0.4 })
      .png()
      .toBuffer());
  }
  if (!resultBytes.byteLength) throw new Error("PhotoRoom trả về ảnh rỗng.");

  // Commit storage only after the external transformation succeeded. This keeps
  // the source retryable on PhotoRoom failure, while a successful run consumes
  // the cover inbox into the canonical MediaObject workspace.
  const { watch, mediaObject } = await prepareWatchMediaSource({ productId, storageKey: sourceKey });

  const outputs = await storeWatchMediaDerivatives({
    watch,
    sourceMediaObjectId: mediaObject.id,
    outputs: [
      ...(processingMode === "basic-sharp"
        ? [{
            variant: "cover-cutout",
            bytes: photoRoomBytes,
            contentType: "image/png",
            role: MediaRole.THUMBNAIL,
            recipe: {
              processor: "photoroom-segment",
              version: 1,
              sourceStorageKey: mediaObject.storageKey,
              totalRotationDegrees,
            },
          }]
        : []),
      {
        variant: "cover-edit",
        bytes: resultBytes,
        contentType: "image/png",
        role: MediaRole.COVER,
        recipe: {
          processor: `photoroom-${processingMode}`,
          version: 1,
          sourceStorageKey: mediaObject.storageKey,
          adjustment,
        },
      },
    ],
  });
  const cutoutKey = outputs.find((item) => item.role === MediaRole.THUMBNAIL)?.key ?? null;
  const outputKey = outputs.find((item) => item.role === MediaRole.COVER)?.key;
  if (!outputKey) throw new Error("Không tạo được derivative Cover từ PhotoRoom.");

  return {
    storageKey: outputKey,
    sourceStorageKey: mediaObject.storageKey,
    cutoutStorageKey: cutoutKey,
    processingMode,
    adjustment: processingMode === "plus" ? adjustment : null,
  };
}
