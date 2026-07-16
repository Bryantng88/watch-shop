import type { BusinessEventDefinition } from "@/domains/event/registry/business-event-registry";

export type WatchBusinessEventStatus = "ACTIVE" | "DRAFT" | "DEPRECATED";
export type WatchReviewTargetType = "CONTENT" | "IMAGE";
export type WatchReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
export type WatchReviewSourceAction = "SUBMIT" | "APPROVE" | "REJECT" | "RESET_DRAFT";

export type WatchBusinessEventDefinition = BusinessEventDefinition & {
  status: WatchBusinessEventStatus;
  businessMeaning: string;
  producer: string | null;
  emitPoint: string | null;
  targetIdPolicy: string;
  targetAliasPolicy: string;
  payloadContract: string;
  knownConsumers: string[];
  autoBindingScope: string | null;
};

export type WatchEventWatchSnapshot = {
  id: string;
  productId: string;
  saleStage?: unknown;
  product?: {
    title?: string | null;
    sku?: string | null;
    primaryImageUrl?: string | null;
    status?: unknown;
  } | null;
};

export type WatchReviewEventPayloadInput = {
  watch: WatchEventWatchSnapshot;
  reviewTargetType: WatchReviewTargetType;
  sourceAction: WatchReviewSourceAction;
  fromStatus?: WatchReviewStatus | null;
  toStatus?: WatchReviewStatus | null;
  sourceId?: string | null;
  feedbackId?: string | null;
  feedbackMessage?: string | null;
  feedbackCreatedAt?: Date | string | null;
};

export type WatchMediaPipelineEventPayloadInput = {
  watch: WatchEventWatchSnapshot;
  sourceAction:
    | "REQUEST_PHOTOSHOOT"
    | "COMPLETE_PHOTOSHOOT"
    | "ATTACH_MEDIA_ASSET"
    | "READY_FOR_PUBLISH"
    | "RECALL_MEDIA"
    | "DOWNLOAD_PUBLISH_ASSETS";
  sourceId?: string | null;
  note?: string | null;
  mediaWorkProgress?: {
    parts: {
      profile: boolean;
      content: boolean;
      image: boolean;
    };
    completed: string;
    total: number;
    updatedAt?: string | null;
    seededFromWatch?: boolean;
  } | null;
};

export type WatchPriceUpdatedEventPayloadInput = {
  watch: WatchEventWatchSnapshot;
  changedFields: string[];
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

export const WATCH_REVIEW_EVENT_CONSUMERS = [
  "timeline",
  "coordination",
  "workflow",
] as const;

export const WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS = [
  ...WATCH_REVIEW_EVENT_CONSUMERS,
  "projection",
] as const;

export const WATCH_REVIEW_AUTO_BINDING_SCOPE =
  "current active media weekly workspace / media-processing item";

export const WATCH_PHOTOSHOOT_AUTO_BINDING_SCOPE =
  "current active media weekly workspace / photoshoot item";

export const WATCH_MEDIA_PROCESSING_AUTO_BINDING_SCOPE =
  "current active media weekly workspace / media-processing item";

export const WATCH_PUBLISH_AUTO_BINDING_SCOPE =
  "current active media weekly workspace / publish item";

export const WATCH_BUSINESS_EVENT_DEFINITIONS: WatchBusinessEventDefinition[] = [
  {
    key: "watch.created",
    label: "Watch created",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "A Watch record was created and should appear in Watch read models.",
    producer: "acquisition-watch.repo",
    emitPoint: "createWatchDraftForAcquisitionItem",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId, acquisitionId, acquisitionItemId]",
    payloadContract: "WatchCreatedPayload",
    knownConsumers: ["projection"],
    autoBindingScope: null,
  },
  {
    key: "watch.media.photoshoot.requested",
    label: "Watch photoshoot requested",
    targetType: "WATCH",
    group: "Watch Media",
    status: "ACTIVE",
    businessMeaning: "A Watch was sent from Watch domain into Media Photoshoot work.",
    producer: "watch-media-work.service",
    emitPoint: "requestWatchPhotoshoot",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchMediaPipelinePayload",
    knownConsumers: [...WATCH_REVIEW_EVENT_CONSUMERS],
    autoBindingScope: WATCH_PHOTOSHOOT_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.media.photoshoot.completed",
    label: "Watch photoshoot completed",
    targetType: "WATCH",
    group: "Watch Media",
    status: "ACTIVE",
    businessMeaning: "Photoshoot work is done and the Watch can move to Media Processing.",
    producer: "watch-media-work.service",
    emitPoint: "completeWatchPhotoshootFromQueueItem",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchMediaPipelinePayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS, "notification"],
    autoBindingScope: WATCH_MEDIA_PROCESSING_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.media.asset.attached",
    label: "Watch media asset attached",
    targetType: "WATCH",
    group: "Watch Media",
    status: "ACTIVE",
    businessMeaning: "Media assets from NAS were attached to Watch through Watch domain.",
    producer: "watch-media-work.service",
    emitPoint: "markWatchMediaAssetAttachedFromQueueItem",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId, nasAssetIds]",
    payloadContract: "WatchMediaAssetAttachedPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_MEDIA_PROCESSING_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.content.submitted",
    label: "Watch content submitted",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Content review was submitted for a Watch.",
    producer: "watch-review.service",
    emitPoint: "submitReview(CONTENT)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId, reviewLogId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_REVIEW_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.content.approved",
    label: "Watch content approved",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Content review was approved for a Watch.",
    producer: "watch-review.service",
    emitPoint: "approveReview(CONTENT)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_REVIEW_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.content.rejected",
    label: "Watch content rejected",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Content review was rejected for a Watch.",
    producer: "watch-review.service",
    emitPoint: "rejectReview(CONTENT)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId, feedbackId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_REVIEW_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.content.unapproved",
    label: "Watch content approval revoked",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "A previous content approval was revoked by moving the review back to draft.",
    producer: "watch-review.service",
    emitPoint: "resetReviewToDraft(CONTENT)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: ["workflow", "timeline", "projection"],
    autoBindingScope: null,
  },
  {
    key: "watch.image.submitted",
    label: "Watch image submitted",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Image review was submitted for a Watch.",
    producer: "watch-review.service",
    emitPoint: "submitReview(IMAGE)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId, reviewLogId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_REVIEW_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.image.approved",
    label: "Watch image approved",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Image review was approved for a Watch.",
    producer: "watch-review.service",
    emitPoint: "approveReview(IMAGE)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_REVIEW_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.image.rejected",
    label: "Watch image rejected",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Image review was rejected for a Watch.",
    producer: "watch-review.service",
    emitPoint: "rejectReview(IMAGE)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId, feedbackId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_REVIEW_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.image.unapproved",
    label: "Watch image approval revoked",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "A previous image approval was revoked by moving the review back to draft.",
    producer: "watch-review.service",
    emitPoint: "resetReviewToDraft(IMAGE)",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchReviewEventPayload",
    knownConsumers: ["workflow", "timeline", "projection"],
    autoBindingScope: null,
  },
  {
    key: "watch.content.modified",
    label: "Watch content modified",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Watch content draft was changed.",
    producer: "watch-content.service",
    emitPoint: "saveWatchContent",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[productId]",
    payloadContract: "WatchContentModifiedPayload",
    knownConsumers: ["timeline", "workflow", "projection"],
    autoBindingScope: null,
  },
  {
    key: "watch.spec.updated",
    label: "Watch spec updated",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Watch identity/spec fields were updated and downstream read models should refresh.",
    producer: "submit-watch-form.application",
    emitPoint: "submitWatchFormApplication",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchSpecUpdatedPayload",
    knownConsumers: ["projection", "timeline"],
    autoBindingScope: null,
  },
  {
    key: "watch.price.updated",
    label: "Watch price updated",
    targetType: "WATCH",
    group: "Watch",
    status: "ACTIVE",
    businessMeaning: "Watch pricing was updated and downstream read models should refresh.",
    producer: "submit-watch-form.application",
    emitPoint: "updateWatchPricingWithDiff",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchPriceUpdatedPayload",
    knownConsumers: ["projection", "timeline", "workflow"],
    autoBindingScope: null,
  },
  {
    key: "watch.ready",
    label: "Watch ready",
    targetType: "WATCH",
    group: "Watch",
    status: "DRAFT",
    businessMeaning: "Watch became ready for sale.",
    producer: null,
    emitPoint: null,
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "TBD",
    knownConsumers: [],
    autoBindingScope: null,
  },
  {
    key: "watch.media.ready_for_publish",
    label: "Watch media ready for publish",
    targetType: "WATCH",
    group: "Watch Media",
    status: "ACTIVE",
    businessMeaning: "Watch content and media are approved and can move into Publish work.",
    producer: "watch-media-work.service",
    emitPoint: "completeWatchMediaProcessingFromQueueItem",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchMediaPipelinePayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS, "notification"],
    autoBindingScope: WATCH_PUBLISH_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.media.recalled",
    label: "Watch media recalled from publish",
    targetType: "WATCH",
    group: "Watch Media",
    status: "ACTIVE",
    businessMeaning: "Approved Watch media was recalled from Publish back to Media Processing.",
    producer: "watch-media-work.service",
    emitPoint: "recallWatchMediaFromPublishQueueItem",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchMediaPipelinePayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_MEDIA_PROCESSING_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.publish.assets.downloaded",
    label: "Watch publish assets downloaded",
    targetType: "WATCH",
    group: "Watch Media",
    status: "ACTIVE",
    businessMeaning: "Publish assets/content were downloaded from Watch domain.",
    producer: "watch-download-gallery.service",
    emitPoint: "buildWatchGalleryZip",
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "WatchPublishAssetsDownloadedPayload",
    knownConsumers: [...WATCH_MEDIA_QUEUE_PROJECTION_CONSUMERS],
    autoBindingScope: WATCH_PUBLISH_AUTO_BINDING_SCOPE,
  },
  {
    key: "watch.saleStage.posted",
    label: "Watch sale stage posted",
    targetType: "WATCH",
    group: "Watch",
    status: "DRAFT",
    businessMeaning: "Watch sale stage changed to posted.",
    producer: null,
    emitPoint: null,
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "TBD",
    knownConsumers: ["projection"],
    autoBindingScope: null,
  },
  {
    key: "watch.sold",
    label: "Watch sold",
    targetType: "WATCH",
    group: "Watch",
    status: "DRAFT",
    businessMeaning: "Watch was sold.",
    producer: null,
    emitPoint: null,
    targetIdPolicy: "watch.id",
    targetAliasPolicy: "[watch.id, productId]",
    payloadContract: "TBD",
    knownConsumers: [],
    autoBindingScope: null,
  },
];

export function watchReviewEventKey(
  targetType: WatchReviewTargetType,
  sourceAction: WatchReviewSourceAction,
) {
  const scope = targetType === "CONTENT" ? "content" : "image";

  if (sourceAction === "SUBMIT") return `watch.${scope}.submitted`;
  if (sourceAction === "APPROVE") return `watch.${scope}.approved`;
  if (sourceAction === "REJECT") return `watch.${scope}.rejected`;

  return `watch.${scope}.unapproved`;
}

export function watchReviewEventAliases(
  watch: WatchEventWatchSnapshot,
  sourceId?: string | null,
) {
  return Array.from(
    new Set([watch.id, watch.productId, sourceId].map((id) => String(id ?? "").trim()).filter(Boolean)),
  );
}

export function watchReviewEventPayload(input: WatchReviewEventPayloadInput) {
  const sourceId = String(input.sourceId ?? "").trim() || null;
  const product = input.watch.product ?? null;

  return {
    productId: input.watch.productId,
    watchId: input.watch.id,
    title: product?.title ?? null,
    watchTitle: product?.title ?? null,
    ref: product?.sku ?? null,
    sku: product?.sku ?? null,
    preview: {
      imageUrl: product?.primaryImageUrl ?? null,
      href: `/admin/watches/${input.watch.productId}`,
    },
    businessStatus: String(input.watch.saleStage || product?.status || ""),
    reviewTargetType: input.reviewTargetType,
    sourceAction: input.sourceAction,
    fromStatus: input.fromStatus ?? null,
    toStatus: input.toStatus ?? null,
    sourceId,
    eventInstanceId: sourceId,
    feedbackId: input.feedbackId ?? null,
    feedbackMessage: input.feedbackMessage ?? null,
    feedbackCreatedAt: input.feedbackCreatedAt ?? null,
  };
}

export function watchMediaPipelineEventAliases(
  watch: WatchEventWatchSnapshot,
  sourceId?: string | null,
) {
  return Array.from(
    new Set([watch.id, watch.productId, sourceId].map((id) => String(id ?? "").trim()).filter(Boolean)),
  );
}

export function watchMediaPipelineEventPayload(input: WatchMediaPipelineEventPayloadInput) {
  const sourceId = String(input.sourceId ?? "").trim() || null;
  const product = input.watch.product ?? null;

  return {
    productId: input.watch.productId,
    watchId: input.watch.id,
    title: product?.title ?? null,
    watchTitle: product?.title ?? null,
    ref: product?.sku ?? null,
    sku: product?.sku ?? null,
    preview: {
      imageUrl: product?.primaryImageUrl ?? null,
      href: `/admin/watches/${input.watch.productId}`,
    },
    businessStatus: String(input.watch.saleStage || product?.status || ""),
    sourceAction: input.sourceAction,
    sourceId,
    eventInstanceId: sourceId,
    intakeNote: input.note ?? null,
    mediaWorkProgress: input.mediaWorkProgress ?? null,
  };
}

export function watchPriceUpdatedEventPayload(input: WatchPriceUpdatedEventPayloadInput) {
  const product = input.watch.product ?? null;

  return {
    productId: input.watch.productId,
    watchId: input.watch.id,
    title: product?.title ?? null,
    watchTitle: product?.title ?? null,
    ref: product?.sku ?? null,
    sku: product?.sku ?? null,
    preview: {
      imageUrl: product?.primaryImageUrl ?? null,
      href: `/admin/watches/${input.watch.productId}`,
    },
    businessStatus: String(input.watch.saleStage || product?.status || ""),
    changedFields: input.changedFields,
    before: input.before ?? null,
    after: input.after ?? null,
  };
}

export function getWatchBusinessEventDefinition(eventKey: string) {
  return WATCH_BUSINESS_EVENT_DEFINITIONS.find((event) => event.key === eventKey) ?? null;
}
