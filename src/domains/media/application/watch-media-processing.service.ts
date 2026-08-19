import {
  MediaBindingLifecycle,
  MediaObjectAvailability,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";
import { randomUUID } from "node:crypto";

import { prisma } from "@/server/db/client";
import { mediaPathPolicy } from "../core/media-path.policy";
import { mediaStorage } from "../storage";
import { bindMedia } from "./media-binding.service";
import { ingestSelectedMedia, registerExistingMediaObject } from "./media-ingest.service";

export async function prepareWatchMediaSource(input: {
  productId: string;
  storageKey: string;
}) {
  const watch = await prisma.watch.findUnique({
    where: { productId: input.productId },
    select: { id: true, productId: true, audienceSegment: true, mediaPipelineKey: true },
  });
  if (!watch) throw new Error("Không tìm thấy Watch.");

  // Source folders (including cover) are inboxes, never durable workspaces.
  // Ingest moves the file into media/objects/<id>/original and removes the inbox copy.
  const mediaObject = await ingestSelectedMedia({ storageKey: input.storageKey });
  const source = await mediaStorage.read(mediaObject.storageKey);
  return { watch, mediaObject, source };
}

export async function getWatchMediaOwner(productId: string) {
  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: { id: true, productId: true, audienceSegment: true, mediaPipelineKey: true },
  });
  if (!watch) throw new Error("Không tìm thấy Watch.");
  return watch;
}

export async function storeWatchMediaDerivatives(input: {
  watch: {
    id: string;
    audienceSegment: "MEN" | "WOMEN" | "UNISEX";
    mediaPipelineKey?: Parameters<typeof bindMedia>[0]["pipelineKey"];
  };
  sourceMediaObjectId: string;
  outputs: Array<{
    variant: string;
    bytes: Uint8Array;
    contentType: string;
    role: MediaRole;
  }>;
}) {
  const created = [];
  for (const output of input.outputs) {
    const key = mediaPathPolicy.derivative({
      mediaObjectId: input.sourceMediaObjectId,
      variant: `${output.variant}-${randomUUID()}`,
      extension: output.contentType === "image/png" ? "png" : "jpg",
    });
    await mediaStorage.write({ key, bytes: output.bytes, contentType: output.contentType });
    const mediaObject = await registerExistingMediaObject({ storageKey: key });
    await bindMedia({
      mediaObjectId: mediaObject.id,
      ownerType: MediaOwnerType.WATCH,
      ownerId: input.watch.id,
      role: output.role,
      audienceSegment: input.watch.audienceSegment,
      pipelineKey: input.watch.mediaPipelineKey ?? null,
      lifecycle: MediaBindingLifecycle.DRAFT,
    });
    created.push({ ...output, key, mediaObjectId: mediaObject.id });
  }

  const keepIds = new Set([input.sourceMediaObjectId, ...created.map((item) => item.mediaObjectId)]);
  const staleBindings = await prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: input.watch.id,
      role: { in: [MediaRole.COVER, MediaRole.THUMBNAIL] },
      lifecycle: MediaBindingLifecycle.DRAFT,
      mediaObjectId: { notIn: Array.from(keepIds) },
    },
    select: { id: true, mediaObjectId: true, mediaObject: { select: { storageKey: true } } },
  });

  for (const binding of staleBindings) {
    await prisma.mediaBinding.update({
      where: { id: binding.id },
      data: { lifecycle: MediaBindingLifecycle.REMOVED },
    });
    const [productReference, activeBindingCount] = await Promise.all([
      prisma.productImage.count({ where: { fileKey: binding.mediaObject.storageKey } }),
      prisma.mediaBinding.count({
        where: {
          mediaObjectId: binding.mediaObjectId,
          lifecycle: { not: MediaBindingLifecycle.REMOVED },
        },
      }),
    ]);
    if (productReference === 0 && activeBindingCount === 0) {
      await mediaStorage.delete(binding.mediaObject.storageKey);
      await prisma.mediaObject.update({
        where: { id: binding.mediaObjectId },
        data: { availability: MediaObjectAvailability.DELETED, missingAt: new Date() },
      });
    }
  }

  return created;
}
