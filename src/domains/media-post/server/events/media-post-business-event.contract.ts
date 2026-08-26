import { defineBusinessEventContract } from "@/domains/event/contract/business-event-contract.helpers";
import type { BusinessEventContract } from "@/domains/event/contract/business-event-contract.types";

export const MEDIA_POST_BUSINESS_EVENT_KEYS = [
  "media.post.created",
  "media.post.content.updated",
  "media.post.photography.completed",
  "media.post.asset.selected",
  "media.post.ready_for_publish",
  "media.post.published",
] as const;

export const MEDIA_POST_BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] =
  MEDIA_POST_BUSINESS_EVENT_KEYS.map((key) =>
    defineBusinessEventContract({
      key,
      label: key.split(".").join(" "),
      targetType: "MEDIA_POST",
      group: "Media Post",
      producer: "MediaPost",
      knownConsumers: ["coordination", "workflow", "timeline", "projection", "notification"],
      payload: {
        name: "MediaPostBusinessEventPayload",
        version: 1,
        optional: ["refNo", "title", "storageKey", "role", "targetIds", "sourceId", "note"],
      },
    }),
  );
