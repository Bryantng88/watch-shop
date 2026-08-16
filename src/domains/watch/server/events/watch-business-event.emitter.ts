import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
  type BusinessEventEffect,
} from "@/domains/event/server/business-event.service";
import type { DB } from "@/server/db/client";

import {
  watchReviewEventAliases,
  watchMediaPipelineEventAliases,
  watchMediaPipelineEventPayload,
  watchPriceUpdatedEventPayload,
  watchReviewEventKey,
  watchReviewEventPayload,
  type WatchEventWatchSnapshot,
  type WatchMediaPipelineEventPayloadInput,
  type WatchPriceUpdatedEventPayloadInput,
  type WatchReviewSourceAction,
  type WatchReviewStatus,
  type WatchReviewTargetType,
} from "./watch-business-event.contract";

export async function emitWatchCreatedEvent(
  db: DB,
  input: {
    watch: Pick<
      WatchEventWatchSnapshot,
      "id" | "productId" | "saleStage" | "audienceSegment" | "mediaPipelineKey"
    >;
    acquisitionId?: string | null;
    acquisitionItemId?: string | null;
    actorUserId?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
) {
  const acquisitionId = String(input.acquisitionId ?? "").trim() || null;
  const acquisitionItemId = String(input.acquisitionItemId ?? "").trim() || null;

  return recordBusinessEvent(db, {
    eventKey: "watch.created",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId, acquisitionId, acquisitionItemId]
      .map((id) => String(id ?? "").trim())
      .filter(Boolean),
    actorUserId: input.actorUserId ?? null,
    payload: {
      productId: input.watch.productId,
      watchId: input.watch.id,
      saleStage: input.watch.saleStage ?? null,
      audienceSegment: input.watch.audienceSegment ?? null,
      mediaPipelineKey: input.watch.mediaPipelineKey ?? null,
      acquisitionId,
      acquisitionItemId,
      sourceId: acquisitionItemId ?? acquisitionId,
      eventInstanceId: acquisitionItemId ?? acquisitionId,
    },
  }, { deferConsumers: input.deferConsumers });
}

export async function emitWatchReviewBusinessEvent(
  db: DB,
  input: {
    watch: WatchEventWatchSnapshot;
    reviewTargetType: WatchReviewTargetType;
    sourceAction: WatchReviewSourceAction;
    actorUserId?: string | null;
    fromStatus?: WatchReviewStatus | null;
    toStatus?: WatchReviewStatus | null;
    sourceId?: string | null;
    feedbackId?: string | null;
    feedbackMessage?: string | null;
    feedbackCreatedAt?: Date | string | null;
    effect?: BusinessEventEffect;
    revokeEventKey?: string | null;
    extraPayload?: Record<string, unknown>;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
) {
  const eventKey = watchReviewEventKey(input.reviewTargetType, input.sourceAction);
  const payload = {
    ...watchReviewEventPayload({
      watch: input.watch,
      reviewTargetType: input.reviewTargetType,
      sourceAction: input.sourceAction,
      fromStatus: input.fromStatus ?? null,
      toStatus: input.toStatus ?? null,
      sourceId: input.sourceId ?? null,
      feedbackId: input.feedbackId ?? null,
      feedbackMessage: input.feedbackMessage ?? null,
      feedbackCreatedAt: input.feedbackCreatedAt ?? null,
    }),
    ...(input.extraPayload ?? {}),
  };

  return recordBusinessEvent(db, {
    eventKey,
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchReviewEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    effect: input.effect,
    revokeEventKey: input.revokeEventKey ?? null,
    payload,
  }, { deferConsumers: input.deferConsumers });
}

export async function emitWatchDuplicateStateEvent(
  db: DB,
  input: {
    watchId: string;
    productId: string;
    state: "CONFIRMED" | "RESTORED";
    actorUserId?: string | null;
    occurredAt: Date;
  },
) {
  return recordBusinessEvent(db, {
    eventKey: input.state === "CONFIRMED"
      ? "watch.duplicate.confirmed"
      : "watch.duplicate.restored",
    targetType: "WATCH",
    targetId: input.watchId,
    targetAliasIds: [input.watchId, input.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watchId,
      productId: input.productId,
      duplicateState: input.state,
      occurredAt: input.occurredAt.toISOString(),
      sourceId: `watch-duplicate:${input.watchId}:${input.state}`,
      eventInstanceId: `watch-duplicate:${input.watchId}:${input.state}:${input.occurredAt.toISOString()}`,
    },
  });
}

export async function emitWatchContentModifiedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId">;
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.content.modified",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      productId: input.watch.productId,
      watchId: input.watch.id,
    },
  }, options);
}

export async function emitWatchInlineImageUpdatedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId">;
    storageKey: string;
    actorUserId?: string | null;
    sourceId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.inline.image.updated",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watch.id,
      productId: input.watch.productId,
      storageKey: input.storageKey,
      sourceId: input.sourceId ?? null,
    },
  }, options);
}

export async function emitWatchCoverUpdatedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId">;
    storageKey: string | null;
    previousStorageKey?: string | null;
    actorUserId?: string | null;
    actionId: string;
    entryPoint?: "WATCH_LIST_QUICK" | null;
  },
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.cover.updated",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watch.id,
      productId: input.watch.productId,
      storageKey: input.storageKey,
      previousStorageKey: input.previousStorageKey ?? null,
      sourceId: input.actionId,
      eventInstanceId: input.actionId,
      entryPoint: input.entryPoint ?? null,
    },
  });
}

export async function emitWatchCoverPhotoRoomProcessedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId">;
    actorUserId?: string | null;
    actionId: string;
    sourceStorageKey: string;
    outputStorageKey: string;
    cutoutStorageKey?: string | null;
    processingMode: string;
    processingKind: "INITIAL" | "REPROCESS";
    adjustment?: Record<string, unknown> | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.cover.photoroom.processed",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watch.id,
      productId: input.watch.productId,
      sourceStorageKey: input.sourceStorageKey,
      outputStorageKey: input.outputStorageKey,
      cutoutStorageKey: input.cutoutStorageKey ?? null,
      processingMode: input.processingMode,
      processingKind: input.processingKind,
      adjustment: input.adjustment ?? null,
      note: input.processingKind === "REPROCESS"
        ? "Xử lý lại Cover bằng PhotoRoom với thiết lập điều chỉnh."
        : "Tạo preview Cover lần đầu bằng PhotoRoom.",
      sourceId: input.actionId,
      eventInstanceId: input.actionId,
    },
  }, options);
}

export async function emitWatchStorefrontVisibilityChangedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId">;
    actorUserId?: string | null;
    actionId: string;
    before: boolean | null;
    after: boolean;
    publishedAt?: Date | null;
    source: "QUICK_PUBLISH";
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.storefront.visibility.changed",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watch.id,
      productId: input.watch.productId,
      before: input.before,
      after: input.after,
      publishedAt: input.publishedAt?.toISOString() ?? null,
      source: input.source,
      note: input.after ? "Đã bật hiển thị Watch trên storefront." : "Đã ẩn Watch khỏi storefront.",
      sourceId: input.actionId,
      eventInstanceId: input.actionId,
    },
  }, options);
}

export async function emitWatchStorefrontPriceVisibilityChangedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId">;
    actorUserId?: string | null;
    actionId: string;
    before: string | null;
    after: "SHOW" | "HIDE";
    source: "WATCH_FORM" | "QUICK_PUBLISH";
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.storefront.price_visibility.changed",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watch.id,
      productId: input.watch.productId,
      before: input.before,
      after: input.after,
      source: input.source,
      note: input.after === "SHOW" ? "Storefront hiển thị giá bán." : "Storefront hiển thị Liên hệ.",
      sourceId: input.actionId,
      eventInstanceId: input.actionId,
    },
  }, options);
}

export async function emitWatchSpecUpdatedEvent(
  db: DB,
  input: {
    watch: Pick<WatchEventWatchSnapshot, "id" | "productId" | "product">;
    actorUserId?: string | null;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.spec.updated",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      productId: input.watch.productId,
      watchId: input.watch.id,
      title: input.watch.product?.title ?? null,
      sku: input.watch.product?.sku ?? null,
      before: input.before ?? null,
      after: input.after ?? null,
    },
  }, options);
}

export async function emitWatchPriceUpdatedEvent(
  db: DB,
  input: WatchPriceUpdatedEventPayloadInput & {
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.price.updated",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [input.watch.id, input.watch.productId],
    actorUserId: input.actorUserId ?? null,
    payload: watchPriceUpdatedEventPayload(input),
  }, options);
}

export async function emitWatchPhotoshootRequestedEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.media.photoshoot.requested",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload: watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "REQUEST_PHOTOSHOOT",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
    }),
  }, options);
}

export async function emitWatchPhotoshootCompletedEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.media.photoshoot.completed",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload: watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "COMPLETE_PHOTOSHOOT",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
    }),
  }, options);
}

export async function emitWatchMediaAssetAttachedEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.media.asset.attached",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload: watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "ATTACH_MEDIA_ASSET",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
      mediaSource: input.mediaSource ?? null,
      intakeRoute: input.intakeRoute ?? null,
      origin: input.origin ?? null,
      galleryImageCount: input.galleryImageCount ?? null,
      mediaWorkProgress: input.mediaWorkProgress ?? null,
    }),
  }, options);
}

export async function emitWatchMediaReadyForPublishEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.media.ready_for_publish",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload: watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "READY_FOR_PUBLISH",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
    }),
  }, options);
}

export async function emitWatchMediaRecalledEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.media.recalled",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload: watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "RECALL_MEDIA",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
    }),
  }, { deferConsumers: input.deferConsumers });
}

export async function emitWatchPublishAssetsDownloadedEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
    extraPayload?: Record<string, unknown>;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
) {
  const payload = {
    ...watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "DOWNLOAD_PUBLISH_ASSETS",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
    }),
    ...(input.extraPayload ?? {}),
  };

  return recordBusinessEvent(db, {
    eventKey: "watch.publish.assets.downloaded",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload,
  }, { deferConsumers: input.deferConsumers });
}

export async function emitWatchPostedEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.saleStage.posted",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: watchMediaPipelineEventAliases(input.watch, input.sourceId),
    actorUserId: input.actorUserId ?? null,
    payload: watchMediaPipelineEventPayload({
      watch: input.watch,
      sourceAction: "MARK_POSTED",
      sourceId: input.sourceId ?? null,
      note: input.note ?? null,
    }),
  }, options);
}

export async function emitWatchBoughtBackEvent(
  db: DB,
  input: {
    watch: {
      id: string;
      productId: string;
      saleStage?: unknown;
    };
    acquisitionId: string;
    acquisitionType: "BUY_BACK" | "TRADE_IN";
    unitCost: number;
    sourceOrderItemId?: string | null;
    actorUserId?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
) {
  return recordBusinessEvent(db, {
    eventKey: "watch.bought_back",
    targetType: "WATCH",
    targetId: input.watch.id,
    targetAliasIds: [
      input.watch.id,
      input.watch.productId,
      input.acquisitionId,
      input.sourceOrderItemId,
    ].filter((value): value is string => Boolean(value)),
    actorUserId: input.actorUserId ?? null,
    payload: {
      watchId: input.watch.id,
      productId: input.watch.productId,
      saleStage: input.watch.saleStage ?? null,
      acquisitionId: input.acquisitionId,
      acquisitionType: input.acquisitionType,
      unitCost: input.unitCost,
      sourceOrderItemId: input.sourceOrderItemId ?? null,
      sourceAction: input.acquisitionType === "TRADE_IN" ? "TRADE_IN" : "BUY_BACK",
    },
  }, { deferConsumers: input.deferConsumers });
}

export {
  watchReviewEventKey,
  type WatchReviewSourceAction,
  type WatchReviewStatus,
  type WatchReviewTargetType,
};
