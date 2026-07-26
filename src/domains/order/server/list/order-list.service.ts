import { prisma } from "@/server/db/client";
import {
  queryOrderListProjection,
} from "@/domains/projection/server/order-list.projection";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import type { OrderSearchInput } from "../shared";
import { toPlain } from "../shared";

/**
 * Admin Order List is a read-only projection surface.
 * Domain completion is handled by Payment/Shipment mutation consumers, never by this query.
 */
export async function getAdminOrderList(input: OrderSearchInput) {
  await ensureProjectionReady(prisma, "order-list");
  const result = await queryOrderListProjection(prisma, input);
  return toPlain(result);
}
