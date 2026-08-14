import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

import { mediaPathPolicy } from "@/domains/media/core/media-path.policy";
import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";

const PHOTOROOM_EDIT_URL = "https://image-api.photoroom.com/v2/edit";
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

function photoRoomErrorMessage(status: number, body: string) {
  const detail = body.trim().slice(0, 300);
  return `PhotoRoom xử lý ảnh thất bại (${status})${detail ? `: ${detail}` : "."}`;
}

export async function processWatchCoverWithPhotoRoomApplication(input: {
  productId: string;
  storageKey: string;
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  const apiKey = String(process.env.PHOTOROOM_API_KEY ?? "").trim();

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

  const form = new FormData();
  const sourceBuffer = Uint8Array.from(source.bytes).buffer;
  form.set(
    "imageFile",
    new Blob([sourceBuffer], { type: source.contentType || "image/jpeg" }),
    sourceKey.split("/").pop() || "watch-cover.jpg",
  );
  form.set("removeBackground", "true");
  form.set("background.color", "FFFFFF");
  form.set("shadow.mode", "ai.soft");
  form.set("outputSize", "2048x3840");
  form.set("scaling", "fit");
  form.set("padding", "0.05");
  form.set("referenceBox", "subjectBox");
  form.set("horizontalAlignment", "center");
  form.set("verticalAlignment", "center");
  form.set("export.format", "png");

  const response = await fetch(PHOTOROOM_EDIT_URL, {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    throw new Error(photoRoomErrorMessage(response.status, await response.text()));
  }

  const resultBytes = new Uint8Array(await response.arrayBuffer());
  if (!resultBytes.byteLength) throw new Error("PhotoRoom trả về ảnh rỗng.");

  const prefix = mediaPathPolicy.sourceRoot({
    segment: watch.audienceSegment,
    purpose: "cover",
  });
  const outputKey = `${prefix}/photoroom-${productId}-${randomUUID()}.png`;
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: outputKey,
    Body: resultBytes,
    ContentType: response.headers.get("content-type") || "image/png",
  }));

  const stored = await mediaStorage.stat(outputKey);
  if (!stored || stored.sizeBytes !== resultBytes.byteLength) {
    throw new Error("Không xác minh được ảnh PhotoRoom sau khi lưu vào kho media.");
  }

  return { storageKey: outputKey, sourceStorageKey: sourceKey };
}
