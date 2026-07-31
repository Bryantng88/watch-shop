import { randomUUID } from "node:crypto";

import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";
import { prisma, type DB } from "@/server/db/client";

export type ShipmentMutation = {
  eventKey:
    | "shipment.created"
    | "shipment.updated"
    | "shipment.shipped"
    | "shipment.delivered"
    | "shipment.returning"
    | "shipment.returned"
    | "shipment.cancelled";
  shipmentId: string;
  orderId: string;
  orderRefNo?: string | null;
  shipmentRefNo?: string | null;
  fromStatus?: string | null;
  toStatus: string;
  carrier?: string | null;
  trackingCode?: string | null;
  note?: string | null;
  actorUserId?: string | null;
  source?: string | null;
  eventInstanceId?: string | null;
};

export async function recordShipmentMutation(
  db: DB,
  mutation: ShipmentMutation,
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(db, {
    eventKey: mutation.eventKey,
    targetType: "SHIPMENT",
    targetId: mutation.shipmentId,
    actorUserId: mutation.actorUserId ?? null,
    targetAliasIds: [mutation.orderId],
    payload: {
      eventInstanceId: mutation.eventInstanceId ?? randomUUID(),
      shipmentId: mutation.shipmentId,
      shipmentRefNo: mutation.shipmentRefNo ?? null,
      orderId: mutation.orderId,
      orderRefNo: mutation.orderRefNo ?? null,
      fromStatus: mutation.fromStatus ?? null,
      toStatus: mutation.toStatus,
      carrier: mutation.carrier ?? null,
      trackingCode: mutation.trackingCode ?? null,
      occurredAt: new Date().toISOString(),
      note: mutation.note ?? null,
      source: mutation.source ?? "SHIPMENT_DOMAIN",
    },
  }, options);
}

export async function publishShipmentMutation(
  mutation: ShipmentMutation,
  options?: BusinessEventDispatchOptions,
) {
  return recordShipmentMutation(prisma, mutation, options);
}

export async function publishShipmentMutations(
  mutations: ShipmentMutation[],
  options?: BusinessEventDispatchOptions,
) {
  const results = [];
  for (const mutation of mutations) {
    results.push(await publishShipmentMutation(mutation, options));
  }
  return results;
}

export async function recordShipmentMutations(
  db: DB,
  mutations: ShipmentMutation[],
  options?: BusinessEventDispatchOptions,
) {
  const results = [];
  for (const mutation of mutations) {
    results.push(await recordShipmentMutation(db, mutation, options));
  }
  return results;
}
