import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import type { DB } from "@/server/db/client";
import type { PURCHASE_REQUEST_BUSINESS_EVENT_KEYS } from "./purchase-request-business-event.contract";

export function emitPurchaseRequestBusinessEvent(db: DB, input: {
  eventKey: (typeof PURCHASE_REQUEST_BUSINESS_EVENT_KEYS)[number];
  eventInstanceId: string;
  purchaseRequestId: string;
  reference: string;
  channel?: string;
  productIds?: string[];
  addedItemCount?: number;
  occurredAt: Date;
  actorUserId?: string | null;
  customerEmail?: string;
  failureCode?: string;
}) {
  return recordBusinessEvent(db, {
    eventKey: input.eventKey,
    targetType: "PURCHASE_REQUEST",
    targetId: input.purchaseRequestId,
    actorUserId: input.actorUserId,
    payload: {
      eventInstanceId: input.eventInstanceId,
      purchaseRequestId: input.purchaseRequestId,
      reference: input.reference,
      channel: input.channel,
      productIds: input.productIds,
      addedItemCount: input.addedItemCount,
      occurredAt: input.occurredAt.toISOString(),
      source: "STOREFRONT_PURCHASE_REQUEST",
      actorUserId: input.actorUserId ?? null,
      customerEmail: input.customerEmail,
      failureCode: input.failureCode,
    },
  });
}
