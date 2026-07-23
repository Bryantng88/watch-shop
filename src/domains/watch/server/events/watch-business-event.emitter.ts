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
  });
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
  });
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
    }),
  }, options);
}

export async function emitWatchMediaReadyForPublishEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
  },
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
  });
}

export async function emitWatchMediaRecalledEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
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
  });
}

export async function emitWatchPublishAssetsDownloadedEvent(
  db: DB,
  input: Omit<WatchMediaPipelineEventPayloadInput, "sourceAction"> & {
    actorUserId?: string | null;
    extraPayload?: Record<string, unknown>;
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
  });
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

export {
  watchReviewEventKey,
  type WatchReviewSourceAction,
  type WatchReviewStatus,
  type WatchReviewTargetType,
};
