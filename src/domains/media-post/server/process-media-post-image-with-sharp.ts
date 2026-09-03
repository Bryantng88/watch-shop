import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";

import { bindMedia } from "@/domains/media/application/media-binding.service";
import { ingestSelectedMedia, registerExistingMediaObject } from "@/domains/media/application/media-ingest.service";
import { mediaRecipeHash } from "@/domains/media/application/watch-media-processing.service";
import {
  normalizeSharpImagePreset,
  processImageWithSharp,
  type SharpImagePreset,
} from "@/domains/media/application/sharp-image-processor";
import { mediaPathPolicy } from "@/domains/media/core/media-path.policy";
import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";

const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const DERIVATIVE_VARIANT = "media-post-sharp";

async function ensureDraftBinding(mediaPostId: string, mediaObjectId: string) {
  const active = await prisma.mediaBinding.findFirst({
    where: {
      mediaObjectId,
      ownerType: MediaOwnerType.MEDIA_POST,
      ownerId: mediaPostId,
      lifecycle: { not: MediaBindingLifecycle.REMOVED },
    },
    select: { id: true },
  });
  if (active) return;
  await bindMedia({
    mediaObjectId,
    ownerType: MediaOwnerType.MEDIA_POST,
    ownerId: mediaPostId,
    role: MediaRole.SOCIAL,
    audienceSegment: AudienceSegment.UNISEX,
    pipelineKey: null,
    lifecycle: MediaBindingLifecycle.DRAFT,
  });
}

export async function processMediaPostImageWithSharp(input: {
  mediaPostId: string;
  storageKey: string;
  preset?: Partial<SharpImagePreset> | null;
}) {
  const mediaPostId = String(input.mediaPostId ?? "").trim();
  const storageKey = String(input.storageKey ?? "").trim();
  if (!mediaPostId || !storageKey) throw new Error("Thiếu Media Post hoặc ảnh nguồn.");
  const post = await prisma.mediaPost.findUnique({ where: { id: mediaPostId }, select: { id: true } });
  if (!post) throw new Error("Không tìm thấy Media Post.");

  const preset = normalizeSharpImagePreset(input.preset);
  const recipe = { processor: DERIVATIVE_VARIANT, version: 1, preset };
  const recipeHash = mediaRecipeHash(recipe);
  const ingested = await ingestSelectedMedia({
    storageKey,
    destination: { ownerType: "MEDIA_POST", ownerId: post.id },
  });

  const registeredSource = await prisma.mediaObject.findUnique({
    where: { id: ingested.id },
    select: { id: true, storageKey: true, sourceMediaObjectId: true },
  });
  if (!registeredSource) throw new Error("Không đăng ký được ảnh nguồn trong Media Core.");
  let root: { id: string; storageKey: string; sourceMediaObjectId: string | null } = registeredSource;
  const visited = new Set([root.id]);
  while (root.sourceMediaObjectId && !visited.has(root.sourceMediaObjectId)) {
    visited.add(root.sourceMediaObjectId);
    const parent: { id: string; storageKey: string; sourceMediaObjectId: string | null } | null = await prisma.mediaObject.findUnique({
      where: { id: root.sourceMediaObjectId },
      select: { id: true, storageKey: true, sourceMediaObjectId: true },
    });
    if (!parent) break;
    root = parent;
  }

  const existing = await prisma.mediaObject.findFirst({
    where: {
      sourceMediaObjectId: root.id,
      derivativeVariant: DERIVATIVE_VARIANT,
      derivativeRecipeHash: recipeHash,
      storageKey: { startsWith: `media/posts/${post.id}/` },
    },
    select: { id: true, storageKey: true },
  });
  if (existing && await mediaStorage.stat(existing.storageKey)) {
    await ensureDraftBinding(post.id, existing.id);
    return { storageKey: existing.storageKey, sourceStorageKey: root.storageKey, cached: true, preset };
  }

  const source = await mediaStorage.read(root.storageKey);
  if (source.bytes.byteLength > MAX_SOURCE_BYTES) throw new Error("Ảnh nguồn vượt quá giới hạn xử lý 30 MB.");
  const bytes = new Uint8Array(await processImageWithSharp(source.bytes, preset));
  const derivativeKey = mediaPathPolicy.postDerivative({
    postId: post.id,
    mediaObjectId: root.id,
    variant: `${DERIVATIVE_VARIANT}-${recipeHash}`,
    extension: "jpg",
  });
  await mediaStorage.write({ key: derivativeKey, bytes, contentType: "image/jpeg" });
  const derivative = await registerExistingMediaObject({
    storageKey: derivativeKey,
    sourceMediaObjectId: root.id,
    derivativeVariant: DERIVATIVE_VARIANT,
    derivativeRecipeHash: recipeHash,
  });
  await ensureDraftBinding(post.id, derivative.id);
  return { storageKey: derivative.storageKey, sourceStorageKey: root.storageKey, cached: false, preset };
}
