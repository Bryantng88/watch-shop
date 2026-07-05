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
} from "@/domains/watch/server/events";
import {
  approveWatchReview,
  resetWatchReviewToDraft,
} from "@/domains/watch/server/review";

type WatchPhotoshootRow = {
  id: string;
  productId: string;
  saleStage: unknown;
  product: {
    title: string | null;
    sku: string | null;
    primaryImageUrl: string | null;
    status: unknown;
    productImage: Array<{ id: string }>;
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
    },
    distinct: ["targetId"],
  });

  return new Set(rows.map((row) => row.targetId));
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

  const metadata = asRecord(binding.metadataJson);
  const runtime = getQueueItemWorkflowState(binding);
  const runtimeMetadata = asRecord(runtime?.metadata);
  const wasAttached = Boolean(clean(metadata.mediaAssetAttachedAt));
  const attachedAt = new Date().toISOString();
  const revision = Math.max(
    numberValue(metadata.mediaAssetRevision),
    numberValue(runtimeMetadata.mediaAssetRevision),
  ) + 1;
  await db.taskExecution.update({
    where: { id: binding.id },
    data: {
      metadataJson: {
        ...metadata,
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
      workflowState: "REVIEW",
    },
  }, db);

  const event = await emitWatchMediaAssetAttachedEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `media-asset-attached:${binding.id}`,
    note: input.note ?? null,
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
    const event = await emitWatchMediaAssetAttachedEvent(db, {
      watch: toWatchEventSnapshot(watch),
      actorUserId: input.actorUserId ?? null,
      sourceId: `media-asset-attached:list:${watch.id}:${attachedAt}`,
      note: input.note ?? null,
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
    profile: currentParts.profile || input.parts.profile === true,
    content: currentParts.content || input.parts.content === true,
    image: currentParts.image || input.parts.image === true,
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
  });
  await approveWatchReview({
    productId: watch.productId,
    targetType: "IMAGE",
    userId: input.actorUserId ?? null,
  });

  const event = await emitWatchMediaReadyForPublishEvent(db, {
    watch: toWatchEventSnapshot(watch),
    actorUserId: input.actorUserId ?? null,
    sourceId: `media-ready-for-publish:${binding.id}`,
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
