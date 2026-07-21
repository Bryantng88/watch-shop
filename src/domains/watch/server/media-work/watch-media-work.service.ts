import {
  ImageRole,
  TaskExecutionTargetType,
  TaskStatus,
  type Prisma,
} from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import {
  getQueueItemWorkflowState,
  updateQueueItemWorkflowState,
} from "@/domains/task/server/business-binding-workflow.service";
import { createSystemActivity } from "@/domains/task/server/activity";
import {
  emitWatchMediaAssetAttachedEvent,
  emitWatchMediaReadyForPublishEvent,
  emitWatchMediaRecalledEvent,
  emitWatchPhotoshootCompletedEvent,
  emitWatchPhotoshootRequestedEvent,
  type WatchMediaPipelineEventPayloadInput,
} from "@/domains/watch/server/events";
import {
  approveWatchReview,
  resetWatchReviewToDraft,
} from "@/domains/watch/server/review";

type WatchPhotoshootRow = {
  id: string;
  productId: string;
  saleStage: unknown;
  watchContent?: {
    titleOverride: string | null;
    summary: string | null;
    hookText: string | null;
    body: string | null;
    bulletSpecs: string[];
    hashTags: string | null;
  } | null;
  product: {
    title: string | null;
    sku: string | null;
    primaryImageUrl: string | null;
    postContent?: string | null;
    status: unknown;
    productImage: Array<{ id: string }>;
    productContent?: {
      generatedContent: string | null;
      specBullets: string[];
      hashtags: string[];
    } | null;
  };
};

export type RequestWatchPhotoshootResult = {
  requested: number;
  skipped: number;
  missing: number;
  items: Array<{
    watchId: string;
    productId: string;
    status: "REQUESTED" | "SKIPPED";
    reason?: string;
  }>;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function numberValue(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function mediaWorkParts(value: unknown) {
  const record = asRecord(value);

  return {
    profile: record.profile === true,
    content: record.content === true,
    image: record.image === true,
  };
}

function mediaWorkCompletedLabel(parts: {
  profile: boolean;
  content: boolean;
  image: boolean;
}) {
  return `${[parts.profile, parts.content, parts.image].filter(Boolean).length}/3`;
}

function uniqueIds(values: string[]) {
  return Array.from(new Set(values.map(clean).filter(Boolean)));
}

function hasGalleryImage(watch: WatchPhotoshootRow) {
  return watch.product.productImage.length > 0;
}

function hasWatchContent(watch: WatchPhotoshootRow) {
  const watchContent = watch.watchContent;
  const productContent = watch.product.productContent;

  return Boolean(
    clean(watchContent?.titleOverride) ||
      clean(watchContent?.summary) ||
      clean(watchContent?.hookText) ||
      clean(watchContent?.body) ||
      clean(watchContent?.hashTags) ||
      (watchContent?.bulletSpecs?.length ?? 0) > 0 ||
      clean(watch.product.postContent) ||
      clean(productContent?.generatedContent) ||
      (productContent?.specBullets?.length ?? 0) > 0 ||
      (productContent?.hashtags?.length ?? 0) > 0,
  );
}

function seedMediaWorkProgressFromWatch(watch: WatchPhotoshootRow, updatedAt = new Date().toISOString()) {
  const parts = {
    profile: false,
    content: hasWatchContent(watch),
    image: hasGalleryImage(watch),
  };

  return {
    parts,
    completed: mediaWorkCompletedLabel(parts),
    total: 3,
    updatedAt,
    seededFromWatch: true,
  };
}

function mediaWorkProgressPayload(
  value: unknown,
): WatchMediaPipelineEventPayloadInput["mediaWorkProgress"] {
  const progress = asRecord(value);
  const parts = mediaWorkParts(progress.parts);
  const completed = mediaWorkCompletedLabel(parts);

  if (![parts.profile, parts.content, parts.image].some(Boolean) && !clean(progress.updatedAt)) {
    return null;
  }

  return {
    parts,
    completed: clean(progress.completed) || completed,
    total: 3,
    updatedAt: clean(progress.updatedAt) || null,
    seededFromWatch: progress.seededFromWatch === true,
  };
}

function mergeMediaWorkProgressSeed(
  metadata: Record<string, unknown>,
  watch: WatchPhotoshootRow,
  updatedAt = new Date().toISOString(),
) {
  const current = asRecord(metadata.mediaWorkProgress);
  const currentParts = mediaWorkParts(current.parts);
  const seededParts = mediaWorkParts(seedMediaWorkProgressFromWatch(watch, updatedAt).parts);
  const parts = {
    profile: currentParts.profile || seededParts.profile,
    content: currentParts.content || seededParts.content,
    image: currentParts.image || seededParts.image,
  };
  const hasProgress = parts.profile || parts.content || parts.image;

  if (!hasProgress && !clean(current.updatedAt)) return metadata;

  return {
    ...metadata,
    mediaWorkProgress: {
      ...current,
      parts,
      completed: mediaWorkCompletedLabel(parts),
      total: 3,
      updatedAt: clean(current.updatedAt) || updatedAt,
      seededFromWatch: true,
    },
  };
}

async function reopenMediaProcessingBindingsForRecall(input: {
  db: DB;
  watchId: string;
  actorUserId?: string | null;
}) {
  const bindings = await input.db.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: input.watchId,
      taskItemId: { not: null },
    },
    select: {
      id: true,
      metadataJson: true,
      taskItem: {
        select: {
          note: true,
        },
      },
    },
  });

  let reopened = 0;

  for (const binding of bindings) {
    if (!/workTypeKey:\s*media-processing/i.test(String(binding.taskItem?.note ?? ""))) {
      continue;
    }

    const runtime = getQueueItemWorkflowState(binding);
    if (
      runtime?.workflowKey !== "watch-media-processing" ||
      runtime.currentState !== "DONE"
    ) {
      continue;
    }

    await updateQueueItemWorkflowState(input.db, binding.id, "RETURNED", {
      ...(asRecord(runtime.metadata) as Prisma.JsonObject),
      reopenedByEvent: "watch.media.recalled",
      reopenedAt: new Date().toISOString(),
      ...(input.actorUserId ? { reopenedByUserId: input.actorUserId } : {}),
    });
    reopened += 1;
  }

  return reopened;
}

function toWatchEventSnapshot(watch: WatchPhotoshootRow) {
  return {
    id: watch.id,
    productId: watch.productId,
    saleStage: watch.saleStage,
    product: {
      title: watch.product.title,
      sku: watch.product.sku,
      primaryImageUrl: watch.product.primaryImageUrl,
      status: watch.product.status,
    },
  };
}

async function findActivePhotoshootWatchIds(db: DB, watchIds: string[]) {
  if (!watchIds.length) return new Set<string>();

  const rows = await db.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: { in: watchIds },
      taskItem: {
        status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] },
        note: {
          contains: "workTypeKey: photography",
          mode: "insensitive",
        },
      },
    },
    select: {
      targetId: true,
      metadataJson: true,
    },
  });

  return new Set(
    rows
      .filter((row) => {
        const runtime = getQueueItemWorkflowState(row);
        return runtime?.currentState !== "DONE";
      })
      .map((row) => row.targetId),
  );
}

export async function requestWatchPhotoshoot(
  input: {
    watchIds: string[];
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
): Promise<RequestWatchPhotoshootResult> {
  const watchIds = uniqueIds(input.watchIds);
  if (!watchIds.length) {
    return {
      requested: 0,
      skipped: 0,
      missing: 0,
      items: [],
    };
  }

  const watches = await db.watch.findMany({
    where: { id: { in: watchIds } },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      watchContent: {
        select: {
          titleOverride: true,
          summary: true,
          hookText: true,
          body: true,
          bulletSpecs: true,
          hashTags: true,
        },
      },
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          postContent: true,
          status: true,
          productContent: {
            select: {
              generatedContent: true,
              specBullets: true,
              hashtags: true,
            },
          },
          productImage: {
            where: { role: ImageRole.GALLERY },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });
  const watchById = new Map(watches.map((watch) => [watch.id, watch]));
  const activePhotoshootWatchIds = await findActivePhotoshootWatchIds(db, watchIds);
  const items: RequestWatchPhotoshootResult["items"] = [];

  for (const watchId of watchIds) {
    const watch = watchById.get(watchId);

    if (!watch) {
      items.push({
        watchId,
        productId: "",
        status: "SKIPPED",
        reason: "WATCH_NOT_FOUND",
      });
      continue;
    }

    if (hasGalleryImage(watch)) {
      items.push({
        watchId: watch.id,
        productId: watch.productId,
        status: "SKIPPED",
        reason: "WATCH_ALREADY_HAS_IMAGE",
      });
      continue;
    }

    if (activePhotoshootWatchIds.has(watch.id)) {
      items.push({
        watchId: watch.id,
        productId: watch.productId,
        status: "SKIPPED",
        reason: "WATCH_ALREADY_IN_ACTIVE_PHOTOSHOOT",
      });
      continue;
    }

    await emitWatchPhotoshootRequestedEvent(db, {
      watch: toWatchEventSnapshot(watch),
      actorUserId: input.actorUserId ?? null,
      sourceId: `photoshoot:${watch.id}`,
      note: input.note ?? null,
    });

    items.push({
      watchId: watch.id,
      productId: watch.productId,
      status: "REQUESTED",
    });
  }

  return {
    requested: items.filter((item) => item.status === "REQUESTED").length,
    skipped: items.filter((item) => item.status === "SKIPPED").length,
    missing: items.filter((item) => item.reason === "WATCH_NOT_FOUND").length,
    items,
  };
}

export async function completeWatchPhotoshootFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
) {
  const bindingId = clean(input.bindingId);
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
  });

  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.WATCH) {
    return { ok: true, skipped: true, reason: "NOT_WATCH_BINDING" };
  }
  if (!/workTypeKey:\s*photography/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_PHOTOSHOOT_WORKSPACE" };
  }

  const watch = await db.watch.findUnique({
    where: { id: binding.targetId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      watchContent: {
        select: {
          titleOverride: true,
          summary: true,
          hookText: true,
          body: true,
          bulletSpecs: true,
          hashTags: true,
        },
      },
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          postContent: true,
          status: true,
          productContent: {
            select: {
              generatedContent: true,
              specBullets: true,
              hashtags: true,
            },
          },
          productImage: {
            where: { role: ImageRole.GALLERY },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  const completedBinding = await db.taskExecution.findUnique({
    where: { id: binding.id },
    select: { metadataJson: true },
  });
  const completedBindingMetadata = asRecord(completedBinding?.metadataJson);
  if (clean(completedBindingMetadata.reshootNote)) {
    await db.taskExecution.update({
      where: { id: binding.id },
      data: {
        metadataJson: {
          ...completedBindingMetadata,
          reshootNote: null,
          reshootCompletedAt: new Date().toISOString(),
        },
      },
    });
  }

  const event = await emitWatchPhotoshootCompletedEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `photoshoot-completed:${binding.id}`,
    note: input.note ?? null,
  });

  return {
    ok: true,
    skipped: false,
    event,
    watchId: watch.id,
    productId: watch.productId,
  };
}

export async function markWatchMediaAssetAttachedFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
) {
  const bindingId = clean(input.bindingId);
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
  });

  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.WATCH) {
    return { ok: true, skipped: true, reason: "NOT_WATCH_BINDING" };
  }
  if (!/workTypeKey:\s*media-processing/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_PROCESSING_WORKSPACE" };
  }

  const watch = await db.watch.findUnique({
    where: { id: binding.targetId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      watchContent: {
        select: {
          titleOverride: true,
          summary: true,
          hookText: true,
          body: true,
          bulletSpecs: true,
          hashTags: true,
        },
      },
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          postContent: true,
          status: true,
          productContent: {
            select: {
              generatedContent: true,
              specBullets: true,
              hashtags: true,
            },
          },
          productImage: {
            where: { role: ImageRole.GALLERY },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  const metadata = asRecord(binding.metadataJson);
  const runtime = getQueueItemWorkflowState(binding);
  const runtimeMetadata = asRecord(runtime?.metadata);
  const wasAttached = Boolean(clean(metadata.mediaAssetAttachedAt));
  const attachedAt = new Date().toISOString();
  const metadataWithProgress = mergeMediaWorkProgressSeed(metadata, watch, attachedAt);
  const seededProgress = mediaWorkProgressPayload(metadataWithProgress.mediaWorkProgress);
  const revision = Math.max(
    numberValue(metadata.mediaAssetRevision),
    numberValue(runtimeMetadata.mediaAssetRevision),
  ) + 1;
  await db.taskExecution.update({
    where: { id: binding.id },
    data: {
      metadataJson: {
        ...metadataWithProgress,
        mediaAssetAttachedAt: attachedAt,
        mediaAssetAttachedByUserId: input.actorUserId ?? null,
        mediaAssetRevision: revision,
        mediaAssetLastAction: wasAttached ? "UPDATE" : "ATTACH",
      },
    },
  });

  if (runtime && runtime.currentState !== "DONE") {
    await updateQueueItemWorkflowState(db, binding.id, "REVIEW", {
      ...runtimeMetadata,
      mediaAssetAttachedAt: attachedAt,
      mediaAssetAttachedByUserId: input.actorUserId ?? null,
      mediaAssetRevision: revision,
      mediaAssetLastAction: wasAttached ? "UPDATE" : "ATTACH",
      ...(seededProgress ? { mediaWorkProgress: seededProgress } : {}),
    } as Prisma.JsonObject);
  }

  await createSystemActivity({
    taskItemId: binding.taskItem.id,
    sourceId: `media-asset-review:${binding.id}:${revision}:${attachedAt}`,
    title: wasAttached
      ? "Media updated and sent to review"
      : "Media attached and sent to review",
    body: clean(input.note) || null,
    actorUserId: input.actorUserId ?? null,
    metadataJson: {
      bindingId: binding.id,
      targetType: binding.targetType,
      targetId: binding.targetId,
      workTypeKey: "media-processing",
      mediaAssetAttachedAt: attachedAt,
      mediaAssetRevision: revision,
      mediaAssetLastAction: wasAttached ? "UPDATE" : "ATTACH",
      ...(seededProgress ? { mediaWorkProgress: seededProgress } : {}),
      workflowState: "REVIEW",
    },
  }, db);

  const event = await emitWatchMediaAssetAttachedEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `media-asset-attached:${binding.id}`,
    note: input.note ?? null,
    mediaWorkProgress: seededProgress,
  });

  return {
    ok: true,
    skipped: false,
    event,
    watchId: watch.id,
    productId: watch.productId,
    attachedAt,
    revision,
  };
}

export async function markWatchMediaAssetAttachedFromWatch(
  input: {
    productId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
) {
  const productId = clean(input.productId);
  if (!productId) return { ok: false, skipped: true, reason: "MISSING_PRODUCT_ID" };

  const watch = await db.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
          productImage: {
            where: { role: ImageRole.GALLERY },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  const binding = await db.taskExecution.findFirst({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: watch.id,
      taskItem: {
        status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] },
        note: {
          contains: "workTypeKey: media-processing",
          mode: "insensitive",
        },
      },
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  if (!binding) {
    const attachedAt = new Date().toISOString();
    const seededProgress = seedMediaWorkProgressFromWatch(watch, attachedAt);
    const event = await emitWatchMediaAssetAttachedEvent(db, {
      watch: toWatchEventSnapshot(watch),
      actorUserId: input.actorUserId ?? null,
      sourceId: `media-asset-attached:list:${watch.id}:${attachedAt}`,
      note: input.note ?? null,
      mediaWorkProgress: seededProgress,
    });

    return {
      ok: true,
      skipped: false,
      event,
      watchId: watch.id,
      productId: watch.productId,
      attachedAt,
      revision: 1,
    };
  }

  return markWatchMediaAssetAttachedFromQueueItem(
    {
      bindingId: binding.id,
      actorUserId: input.actorUserId ?? null,
      note: input.note ?? null,
    },
    db,
  );
}

export async function saveWatchMediaWorkDraftFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    parts: {
      profile?: boolean | null;
      content?: boolean | null;
      image?: boolean | null;
    };
    note?: string | null;
  },
  db: DB = prisma,
) {
  const bindingId = clean(input.bindingId);
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
  });

  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.WATCH) {
    return { ok: true, skipped: true, reason: "NOT_WATCH_BINDING" };
  }
  if (!/workTypeKey:\s*media-processing/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_PROCESSING_WORKSPACE" };
  }

  const metadata = asRecord(binding.metadataJson);
  const currentProgress = asRecord(metadata.mediaWorkProgress);
  const currentParts = mediaWorkParts(currentProgress.parts);
  const nextParts = {
    profile: typeof input.parts.profile === "boolean"
      ? input.parts.profile
      : currentParts.profile,
    content: typeof input.parts.content === "boolean"
      ? input.parts.content
      : currentParts.content,
    image: typeof input.parts.image === "boolean"
      ? input.parts.image
      : currentParts.image,
  };
  const updatedAt = new Date().toISOString();
  const completed = mediaWorkCompletedLabel(nextParts);

  await db.taskExecution.update({
    where: { id: binding.id },
    data: {
      metadataJson: {
        ...metadata,
        mediaWorkProgress: {
          parts: nextParts,
          completed,
          total: 3,
          updatedAt,
          updatedByUserId: input.actorUserId ?? null,
          note: clean(input.note) || null,
        },
      },
    },
  });

  await createSystemActivity({
    taskItemId: binding.taskItem.id,
    sourceId: `media-work-draft:${binding.id}:${updatedAt}`,
    title: `Media work saved ${completed}`,
    body: clean(input.note) || null,
    actorUserId: input.actorUserId ?? null,
    metadataJson: {
      bindingId: binding.id,
      targetType: binding.targetType,
      targetId: binding.targetId,
      workTypeKey: "media-processing",
      mediaWorkProgress: {
        parts: nextParts,
        completed,
        total: 3,
        updatedAt,
      },
    },
  }, db);

  return {
    ok: true,
    skipped: false,
    bindingId: binding.id,
    parts: nextParts,
    completed,
    updatedAt,
  };
}

export async function saveWatchMediaWorkDraftFromWatch(
  input: {
    productId: string;
    actorUserId?: string | null;
    parts: {
      profile?: boolean | null;
      content?: boolean | null;
      image?: boolean | null;
    };
    note?: string | null;
  },
  db: DB = prisma,
) {
  const productId = clean(input.productId);
  if (!productId) return { ok: false, skipped: true, reason: "MISSING_PRODUCT_ID" };

  const watch = await db.watch.findUnique({
    where: { productId },
    select: { id: true },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  const binding = await db.taskExecution.findFirst({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: watch.id,
      taskItem: {
        status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] },
        note: {
          contains: "workTypeKey: media-processing",
          mode: "insensitive",
        },
      },
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  if (!binding) {
    return { ok: true, skipped: true, reason: "NO_ACTIVE_MEDIA_PROCESSING_ITEM" };
  }

  return saveWatchMediaWorkDraftFromQueueItem(
    {
      bindingId: binding.id,
      actorUserId: input.actorUserId ?? null,
      parts: input.parts,
      note: input.note ?? null,
    },
    db,
  );
}

export async function requestWatchMediaReshootFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
) {
  const bindingId = clean(input.bindingId);
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
  });

  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.WATCH) {
    return { ok: true, skipped: true, reason: "NOT_WATCH_BINDING" };
  }
  if (!/workTypeKey:\s*media-processing/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_PROCESSING_WORKSPACE" };
  }

  const watch = await db.watch.findUnique({
    where: { id: binding.targetId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
        },
      },
    },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  const metadata = asRecord(binding.metadataJson);
  const currentProgress = asRecord(metadata.mediaWorkProgress);
  const currentParts = mediaWorkParts(currentProgress.parts);
  const updatedAt = new Date().toISOString();
  const nextParts = {
    ...currentParts,
    image: false,
  };
  const completed = mediaWorkCompletedLabel(nextParts);
  const note = clean(input.note) || "Hình ảnh chưa đạt, yêu cầu chụp lại.";

  await resetWatchReviewToDraft({
    productId: watch.productId,
    targetType: "IMAGE",
    userId: input.actorUserId ?? null,
  });

  await db.taskExecution.update({
    where: { id: binding.id },
    data: {
      metadataJson: {
        ...metadata,
        mediaWorkProgress: {
          ...currentProgress,
          parts: nextParts,
          completed,
          total: 3,
          updatedAt,
          updatedByUserId: input.actorUserId ?? null,
          note,
        },
      },
    },
  });

  const runtime = getQueueItemWorkflowState(binding);
  if (runtime?.workflowKey === "watch-media-processing") {
    await updateQueueItemWorkflowState(db, binding.id, "RETURNED", {
      ...(asRecord(runtime.metadata) as Prisma.JsonObject),
      returnedByAction: "request-reshoot",
      returnedAt: updatedAt,
      reshootRequested: true,
      ...(input.actorUserId ? { returnedByUserId: input.actorUserId } : {}),
    });
  }

  await createSystemActivity({
    taskItemId: binding.taskItem.id,
    sourceId: `media-reshoot-requested:${binding.id}:${updatedAt}`,
    title: "Yêu cầu chụp lại ảnh",
    body: note,
    actorUserId: input.actorUserId ?? null,
    metadataJson: {
      bindingId: binding.id,
      targetType: binding.targetType,
      targetId: binding.targetId,
      workTypeKey: "media-processing",
      workflowState: "RESHOOT_REQUESTED",
      mediaWorkProgress: {
        parts: nextParts,
        completed,
        total: 3,
        updatedAt,
      },
    },
  }, db);

  const activePhotoshootWatchIds = await findActivePhotoshootWatchIds(db, [watch.id]);
  if (activePhotoshootWatchIds.has(watch.id)) {
    return {
      ok: true,
      skipped: true,
      reason: "WATCH_ALREADY_IN_ACTIVE_PHOTOSHOOT",
      watchId: watch.id,
      productId: watch.productId,
      parts: nextParts,
      completed,
      updatedAt,
    };
  }

  const event = await emitWatchPhotoshootRequestedEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `media-reshoot:${binding.id}`,
    note,
  });

  const photoshootBindingId = event.consumers.coordination?.skipped === false
    ? event.consumers.coordination.bindingId
    : null;
  if (photoshootBindingId) {
    const photoshootBinding = await db.taskExecution.findUnique({
      where: { id: photoshootBindingId },
      select: { metadataJson: true },
    });
    const photoshootMetadata = asRecord(photoshootBinding?.metadataJson);

    await db.taskExecution.update({
      where: { id: photoshootBindingId },
      data: {
        metadataJson: {
          ...photoshootMetadata,
          reshootNote: note,
          reshootRequestedAt: updatedAt,
          reshootRequestedByUserId: input.actorUserId ?? null,
        },
      },
    });
  }

  return {
    ok: true,
    skipped: false,
    event,
    watchId: watch.id,
    productId: watch.productId,
    parts: nextParts,
    completed,
    updatedAt,
  };
}

export async function completeWatchMediaProcessingFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
) {
  const bindingId = clean(input.bindingId);
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
  });

  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.WATCH) {
    return { ok: true, skipped: true, reason: "NOT_WATCH_BINDING" };
  }
  if (!/workTypeKey:\s*media-processing/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_PROCESSING_WORKSPACE" };
  }

  const runtime = getQueueItemWorkflowState(binding);
  if (runtime?.currentState === "RETURNED") {
    return { ok: true, skipped: true, reason: "MEDIA_RETURNED_TO_PHOTOSHOOT" };
  }

  const watch = await db.watch.findUnique({
    where: { id: binding.targetId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
          productImage: {
            where: { role: ImageRole.GALLERY },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  await approveWatchReview({
    productId: watch.productId,
    targetType: "CONTENT",
    userId: input.actorUserId ?? null,
    emitBusinessEvent: false,
  });
  await approveWatchReview({
    productId: watch.productId,
    targetType: "IMAGE",
    userId: input.actorUserId ?? null,
    emitBusinessEvent: false,
  });

  const readyAt = new Date().toISOString();
  const event = await emitWatchMediaReadyForPublishEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `media-ready-for-publish:${binding.id}:${readyAt}`,
    note: input.note ?? null,
  });

  return {
    ok: true,
    skipped: false,
    event,
    watchId: watch.id,
    productId: watch.productId,
  };
}

export async function recallWatchMediaFromPublishQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
  db: DB = prisma,
) {
  const bindingId = clean(input.bindingId);
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      id: true,
      targetType: true,
      targetId: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
  });

  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.WATCH) {
    return { ok: true, skipped: true, reason: "NOT_WATCH_BINDING" };
  }
  if (!/workTypeKey:\s*publish/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_PUBLISH_WORKSPACE" };
  }

  const watch = await db.watch.findUnique({
    where: { id: binding.targetId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
          productImage: {
            where: { role: ImageRole.GALLERY },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!watch) return { ok: false, skipped: true, reason: "WATCH_NOT_FOUND" };

  await resetWatchReviewToDraft({
    productId: watch.productId,
    targetType: "CONTENT",
    userId: input.actorUserId ?? null,
  });
  await resetWatchReviewToDraft({
    productId: watch.productId,
    targetType: "IMAGE",
    userId: input.actorUserId ?? null,
  });
  const reopenedMediaBindings = await reopenMediaProcessingBindingsForRecall({
    db,
    watchId: watch.id,
    actorUserId: input.actorUserId ?? null,
  });

  await createSystemActivity({
    taskItemId: binding.taskItem.id,
    sourceId: `media-recalled:${binding.id}`,
    title: "Media recalled from publish",
    body: clean(input.note) || null,
    actorUserId: input.actorUserId ?? null,
    metadataJson: {
      bindingId: binding.id,
      targetType: binding.targetType,
      targetId: binding.targetId,
      workTypeKey: "publish",
      workflowState: "RECALLED",
      reopenedMediaBindings,
    },
  }, db);

  const event = await emitWatchMediaRecalledEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `media-recalled:${binding.id}`,
    note: input.note ?? null,
  });

  return {
    ok: true,
    skipped: false,
    event,
    watchId: watch.id,
    productId: watch.productId,
  };
}
