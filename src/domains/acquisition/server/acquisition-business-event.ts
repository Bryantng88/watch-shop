import type { DB } from "@/server/db/client";
import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";

export type AcquisitionBusinessEventKey =
  | "acquisition.created"
  | "acquisition.updated"
  | "acquisition.items.updated"
  | "acquisition.posted"
  | "acquisition.canceled";

export async function emitAcquisitionBusinessEvent(
  db: DB,
  input: {
    eventKey: AcquisitionBusinessEventKey;
    acquisitionId: string;
    payload?: Record<string, unknown>;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
) {
  return recordBusinessEvent(db, {
    eventKey: input.eventKey,
    targetType: "ACQUISITION",
    targetId: input.acquisitionId,
    payload: {
      acquisitionId: input.acquisitionId,
      ...input.payload,
    },
  }, { deferConsumers: input.deferConsumers });
}
