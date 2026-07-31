import { randomUUID } from "node:crypto";

import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";
import { prisma, type DB } from "@/server/db/client";
import type { ORDER_BUSINESS_EVENT_KEYS } from "./order-business-event.contract";

export type OrderMutation = {
  eventKey: (typeof ORDER_BUSINESS_EVENT_KEYS)[number];
  orderId: string;
  refNo?: string | null;
  fromStatus?: string | null;
  toStatus?: string | null;
  actorUserId?: string | null;
  note?: string | null;
  source?: string | null;
};

export async function recordOrderMutation(
  db: DB,
  mutation: OrderMutation,
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: mutation.eventKey,
    targetType: "ORDER",
    targetId: mutation.orderId,
    actorUserId: mutation.actorUserId ?? null,
    payload: {
      eventInstanceId: randomUUID(),
      orderId: mutation.orderId,
      refNo: mutation.refNo ?? null,
      fromStatus: mutation.fromStatus ?? null,
      toStatus: mutation.toStatus ?? null,
      note: mutation.note ?? null,
      source: mutation.source ?? "ORDER_DOMAIN",
      occurredAt: new Date().toISOString(),
    },
  }, options);
}

export async function publishOrderMutation(
  mutation: OrderMutation,
  options?: BusinessEventDispatchOptions,
) {
  return recordOrderMutation(prisma, mutation, options);
}

export async function publishOrderMutations(
  mutations: OrderMutation[],
  options?: BusinessEventDispatchOptions,
) {
  for (const mutation of mutations) await publishOrderMutation(mutation, options);
}

export async function recordOrderMutations(
  db: DB,
  mutations: OrderMutation[],
  options?: BusinessEventDispatchOptions,
) {
  const results = [];
  for (const mutation of mutations) {
    results.push(await recordOrderMutation(db, mutation, options));
  }
  return results;
}
