import {
  MediaBindingLifecycle,
  MediaObjectAvailability,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";
import { createHash } from "node:crypto";

import { prisma } from "@/server/db/client";
import { mediaPathPolicy } from "../core/media-path.policy";
import { mediaStorage } from "../storage";
import { bindMedia } from "./media-binding.service";
import { ingestSelectedMedia, registerExistingMediaObject } from "./media-ingest.service";
import { executeMediaDelete } from "./media-operation.service";

export function stableMediaRecipeJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableMediaRecipeJson).join(",")}]`;
  const row = value as Record<string, unknown>;
  return `{${Object.keys(row)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableMediaRecipeJson(row[key])}`)
    .join(",")}}`;
}

export function mediaRecipeHash(recipe: unknown) {
  return createHash("sha256")
    .update(stableMediaRecipeJson(recipe))
    .digest("hex")
    .slice(0, 20);
}

type WatchMediaOwner = {
  id: string;
  audienceSegment: "MEN" | "WOMEN" | "UNISEX";
  mediaPipelineKey?: Parameters<typeof bindMedia>[0]["pipelineKey"];
};

type WatchMediaDerivativeSpec = {
  variant: string;
  contentType: string;
  role: MediaRole;
  recipe: unknown;
};

async function resolveRootMediaObjectId(sourceMediaObjectId: string) {
  const source = await prisma.mediaObject.findUnique({
    where: { id: sourceMediaObjectId },
    select: { id: true, sourceMediaObjectId: true },
  });
  if (!source) throw new Error("Source MediaObject not found.");
  let rootId = source.id;
  let parentId = source.sourceMediaObjectId;
  const visited = new Set([rootId]);
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = await prisma.mediaObject.findUnique({
      where: { id: parentId },
      select: { id: true, sourceMediaObjectId: true },
    });
    if (!parent) break;
    rootId = parent.id;
    parentId = parent.sourceMediaObjectId;
  }
  return rootId;
}

async function bindPreparedDerivatives(input: {
  watch: WatchMediaOwner;
  created: Array<WatchMediaDerivativeSpec & {
    key: string;
    mediaObjectId: string;
    recipeHash: string;
  }>;
}) {
  for (const item of input.created) {
    await bindMedia({
      mediaObjectId: item.mediaObjectId,
      ownerType: MediaOwnerType.WATCH,
      ownerId: input.watch.id,
      role: item.role,
      audienceSegment: input.watch.audienceSegment,
      pipelineKey: input.watch.mediaPipelineKey ?? null,
      lifecycle: MediaBindingLifecycle.DRAFT,
    });
  }
}

export async function reuseWatchMediaDerivatives(input: {
  watch: WatchMediaOwner;
  sourceMediaObjectId: string;
  outputs: WatchMediaDerivativeSpec[];
}) {
  const rootId = await resolveRootMediaObjectId(input.sourceMediaObjectId);
  const reusable = [];
  for (const output of input.outputs) {
    const recipeHash = mediaRecipeHash(output.recipe);
    const existing = await prisma.mediaObject.findFirst({
      where: {
        sourceMediaObjectId: rootId,
        derivativeVariant: output.variant,
        derivativeRecipeHash: recipeHash,
        availability: { not: MediaObjectAvailability.DELETED },
      },
    });
    if (!existing || !(await mediaStorage.stat(existing.storageKey))) return [];
    reusable.push({
      ...output,
      key: existing.storageKey,
      mediaObjectId: existing.id,
      recipeHash,
    });
  }
  await bindPreparedDerivatives({ watch: input.watch, created: reusable });
  return reusable;
}

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
  // Ingest moves the file into the canonical object/original path and removes the inbox copy.
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
  watch: WatchMediaOwner;
  sourceMediaObjectId: string;
  outputs: Array<{
    variant: string;
    bytes: Uint8Array;
    contentType: string;
    role: MediaRole;
    recipe: unknown;
  }>;
}) {
  const rootId = await resolveRootMediaObjectId(input.sourceMediaObjectId);

  const created = [];
  for (const output of input.outputs) {
    const recipeHash = mediaRecipeHash(output.recipe);
    const key = mediaPathPolicy.derivative({
      mediaObjectId: rootId,
      variant: `${output.variant}-${recipeHash}`,
      extension: output.contentType === "image/png" ? "png" : "jpg",
    });
    const existing = await prisma.mediaObject.findFirst({
      where: {
        sourceMediaObjectId: rootId,
        derivativeVariant: output.variant,
        derivativeRecipeHash: recipeHash,
      },
    });
    if (!existing || !await mediaStorage.stat(existing.storageKey)) {
      await mediaStorage.write({ key, bytes: output.bytes, contentType: output.contentType });
    }
    const mediaObject = await registerExistingMediaObject({
      storageKey: existing?.storageKey ?? key,
      sourceMediaObjectId: rootId,
      derivativeVariant: output.variant,
      derivativeRecipeHash: recipeHash,
    });
    created.push({ ...output, key: mediaObject.storageKey, mediaObjectId: mediaObject.id, recipeHash });
  }
  // Persist every deterministic output before creating bindings. If binding or
  // a later database write fails, the next request can reuse these outputs and
  // never spend PhotoRoom quota a second time.
  await bindPreparedDerivatives({ watch: input.watch, created });

  const keepIds = new Set([rootId, input.sourceMediaObjectId, ...created.map((item) => item.mediaObjectId)]);
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
      await executeMediaDelete({
        idempotencyKey: `media-cleanup:${binding.mediaObjectId}`,
        mediaObjectId: binding.mediaObjectId,
        storageKey: binding.mediaObject.storageKey,
      });
      await prisma.mediaObject.update({
        where: { id: binding.mediaObjectId },
        data: { availability: MediaObjectAvailability.DELETED, missingAt: new Date() },
      });
    }
  }

  return created;
}

export async function cleanupRemovedWatchMedia(input: {
  watchId: string;
  roles: MediaRole[];
}) {
  const removed = await prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: input.watchId,
      role: { in: input.roles },
      lifecycle: MediaBindingLifecycle.REMOVED,
    },
    select: { id: true, mediaObjectId: true, mediaObject: { select: { storageKey: true } } },
  });
  for (const binding of removed) {
    const [productReference, activeBindingCount, derivativeCount] = await Promise.all([
      prisma.productImage.count({ where: { fileKey: binding.mediaObject.storageKey } }),
      prisma.mediaBinding.count({
        where: {
          mediaObjectId: binding.mediaObjectId,
          lifecycle: { not: MediaBindingLifecycle.REMOVED },
        },
      }),
      prisma.mediaObject.count({
        where: {
          sourceMediaObjectId: binding.mediaObjectId,
          availability: { not: MediaObjectAvailability.DELETED },
        },
      }),
    ]);
    if (productReference || activeBindingCount || derivativeCount) continue;
    await executeMediaDelete({
      idempotencyKey: `media-cleanup:${binding.mediaObjectId}`,
      mediaObjectId: binding.mediaObjectId,
      storageKey: binding.mediaObject.storageKey,
    });
    await prisma.mediaObject.update({
      where: { id: binding.mediaObjectId },
      data: { availability: MediaObjectAvailability.DELETED, missingAt: new Date() },
    });
  }
}
