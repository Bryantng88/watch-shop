import { listOrdersQuery } from "@/domains/order/application";
import type { OrderSearchInput } from "@/domains/order/server/shared";

export async function listOrdersQuery(input: OrderSearchInput) {
  return getAdminOrderList(input);
}
