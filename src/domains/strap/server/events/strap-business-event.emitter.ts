import type { DB } from "@/server/db/client";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import type { STRAP_BUSINESS_EVENT_KEYS } from "./strap-business-event.contract";

export type StrapBusinessEventKey = typeof STRAP_BUSINESS_EVENT_KEYS[number];

export function emitStrapBusinessEvent(
  db: DB,
  input: {
    eventKey: StrapBusinessEventKey;
    variantId: string;
    productId: string;
    actorUserId?: string | null;
    payload?: Record<string, unknown>;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: input.eventKey,
    targetType: "STRAP",
    targetId: input.variantId,
    targetAliasIds: [input.variantId, input.productId],
    actorUserId: input.actorUserId ?? null,
    payload: {
      productId: input.productId,
      variantId: input.variantId,
      ...(input.payload ?? {}),
    },
  }, options);
}
