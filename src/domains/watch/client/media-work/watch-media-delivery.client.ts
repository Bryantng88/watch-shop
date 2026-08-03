"use client";

export {
  waitForProjectionDelivery as waitForWatchMediaDelivery,
  waitForBulkProjectionDeliveries,
} from "@/domains/projection/client/projection-delivery.client";
export type { ProjectionDeliveryCommandResult as WatchMediaDeliveryCommandResult } from "@/domains/projection/client/projection-delivery.client";
