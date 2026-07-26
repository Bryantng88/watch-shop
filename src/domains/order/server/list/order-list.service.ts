import { prisma } from "@/server/db/client";
import {
  queryOrderListProjection,
  rebuildOrderListProjectionRows,
} from "@/domains/projection/server/order-list.projection";
import type { OrderSearchInput } from "../shared";
import { toPlain } from "../shared";

/**
 * Admin Order List is a read-only projection surface.
 * Domain completion is handled by Payment/Shipment mutation consumers, never by this query.
 */
export async function getAdminOrderList(input: OrderSearchInput) {
  let result = await queryOrderListProjection(prisma, input);
  if (result.projectionRowCount === 0) {
    await rebuildOrderListProjectionRows(prisma);
    result = await queryOrderListProjection(prisma, input);
  }
  return toPlain(result);
}
