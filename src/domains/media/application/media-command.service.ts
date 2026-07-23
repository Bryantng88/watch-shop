import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaPipelineKey,
  MediaRole,
} from "@prisma/client";
import { prisma } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/storage-key";
import { bindMedia } from "./media-binding.service";
import {
  ingestSelectedMedia,
  registerExistingMediaObject,
} from "./media-ingest.service";

function pipelineForSegment(segment: AudienceSegment) {
  if (segment === AudienceSegment.WOMEN) return MediaPipelineKey.WOMEN_LITE;
  if (segment === AudienceSegment.UNISEX) return MediaPipelineKey.UNISEX_STANDARD;
  return MediaPipelineKey.MEN_STANDARD;
}

function fileName(key: string) {
  return key.split("/").pop() ?? key;
}

async function watchOwner(productId: string) {
  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      audienceSegment: true,
      mediaPipelineKey: true,
    },
  });
  if (!watch) throw new Error(`Watch not found for product ${productId}.`);
  return watch;
}

export async function selectExistingMediaForWatch(input: {
  storageKey: string;
  productId: string;
  role: MediaRole;
  sortOrder?: number;
}) {
  const storageKey = normalizeKey(input.storageKey);
  if (!storageKey) throw new Error("Media key is required.");
  const [object, watch] = await Promise.all([
    ingestSelectedMedia({ storageKey }),
    watchOwner(input.productId),
  ]);
  const binding = await bindMedia({
    mediaObjectId: object.id,
    ownerType: MediaOwnerType.WATCH,
    ownerId: watch.id,
    role: input.role,
    sortOrder: input.sortOrder ?? 0,
    audienceSegment: watch.audienceSegment,
    pipelineKey: watch.mediaPipelineKey,
    lifecycle: MediaBindingLifecycle.SELECTED,
  });
  return {
    object,
    binding,
    key: object.storageKey,
    fileKey: object.storageKey,
    name: object.originalFileName ?? fileName(object.storageKey),
    url: `/api/media/sign?key=${encodeURIComponent(object.storageKey)}`,
    sortOrder: binding.sortOrder,
  };
}

export async function selectExistingMediaForAcquisition(input: {
  storageKey: string;
  acquisitionId: string;
  role: MediaRole;
  sortOrder?: number;
}) {
  const storageKey = normalizeKey(input.storageKey);
  if (!storageKey) throw new Error("Media key is required.");
  const [object, acquisition] = await Promise.all([
    ingestSelectedMedia({ storageKey }),
    prisma.acquisition.findUnique({
      where: { id: input.acquisitionId },
      select: { audienceSegment: true },
    }),
  ]);
  if (!acquisition) throw new Error(`Acquisition not found: ${input.acquisitionId}.`);
  const binding = await bindMedia({
    mediaObjectId: object.id,
    ownerType: MediaOwnerType.ACQUISITION,
    ownerId: input.acquisitionId,
    role: input.role,
    sortOrder: input.sortOrder ?? 0,
    audienceSegment: acquisition.audienceSegment,
    pipelineKey: pipelineForSegment(acquisition.audienceSegment),
    lifecycle: MediaBindingLifecycle.SELECTED,
  });
  return {
    object,
    binding,
    key: object.storageKey,
    fileKey: object.storageKey,
    name: object.originalFileName ?? fileName(object.storageKey),
    url: `/api/media/sign?key=${encodeURIComponent(object.storageKey)}`,
    sortOrder: binding.sortOrder,
  };
}

export async function attachWatchMedia(input: {
  productId: string;
  images: Array<{ storageKey: string; role: MediaRole; sortOrder?: number }>;
}) {
  const watch = await watchOwner(input.productId);
  const results = [];
  for (const image of input.images) {
    const object = await registerExistingMediaObject({ storageKey: image.storageKey });
    results.push(
      await bindMedia({
        mediaObjectId: object.id,
        ownerType: MediaOwnerType.WATCH,
        ownerId: watch.id,
        role: image.role,
        sortOrder: image.sortOrder ?? 0,
        audienceSegment: watch.audienceSegment,
        pipelineKey: watch.mediaPipelineKey,
        lifecycle: MediaBindingLifecycle.ATTACHED,
      }),
    );
  }
  return results;
}

export async function releaseWatchMediaNotIn(input: {
  productId: string;
  role: MediaRole;
  keepStorageKeys: string[];
}) {
  const watch = await watchOwner(input.productId);
  const keep = new Set(input.keepStorageKeys.map(normalizeKey).filter(Boolean));
  const bindings = await prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: watch.id,
      role: input.role,
      lifecycle: MediaBindingLifecycle.SELECTED,
    },
    include: { mediaObject: { select: { storageKey: true } } },
  });
  const removed = bindings.filter((binding) => !keep.has(binding.mediaObject.storageKey));
  if (removed.length) {
    await prisma.mediaBinding.updateMany({
      where: { id: { in: removed.map((binding) => binding.id) } },
      data: { lifecycle: MediaBindingLifecycle.REMOVED },
    });
  }
  return removed.map((binding) => binding.mediaObject.storageKey);
}

export async function listSelectedWatchMedia(input: {
  productId: string;
  role?: MediaRole;
}) {
  const watch = await watchOwner(input.productId);
  let bindings = await prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: watch.id,
      ...(input.role ? { role: input.role } : {}),
      lifecycle: MediaBindingLifecycle.SELECTED,
    },
    include: {
      mediaObject: {
        select: {
          storageKey: true,
          originalFileName: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  if (!bindings.length) {
    const legacyPool = await prisma.mediaAsset.findMany({
      where: {
        productId: input.productId,
        status: "CHOSEN",
        isMissing: false,
        key: { startsWith: `products/edit/chosen/watch/${input.productId}/pool/` },
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "asc" }],
      select: { key: true, sortOrder: true },
    });
    for (const legacy of legacyPool) {
      await selectExistingMediaForWatch({
        storageKey: legacy.key,
        productId: input.productId,
        role: input.role ?? MediaRole.GALLERY,
        sortOrder: legacy.sortOrder,
      });
    }
    if (legacyPool.length) {
      bindings = await prisma.mediaBinding.findMany({
        where: {
          ownerType: MediaOwnerType.WATCH,
          ownerId: watch.id,
          ...(input.role ? { role: input.role } : {}),
          lifecycle: MediaBindingLifecycle.SELECTED,
        },
        include: {
          mediaObject: {
            select: { storageKey: true, originalFileName: true },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    }
  }
  return bindings.map((binding) => ({
    key: binding.mediaObject.storageKey,
    fileKey: binding.mediaObject.storageKey,
    url: `/api/media/sign?key=${encodeURIComponent(binding.mediaObject.storageKey)}`,
    name:
      binding.mediaObject.originalFileName ??
      fileName(binding.mediaObject.storageKey),
    sortOrder: binding.sortOrder,
  }));
}
