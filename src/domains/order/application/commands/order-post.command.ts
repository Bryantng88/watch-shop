import { postOneOrder, postOrders } from "@/domains/order/server";

export async function postOrderCommand(orderId: string) {
  return postOneOrder(orderId);
}

export async function bulkPostOrdersCommand(orderIds: string[]) {
  return postOrders(orderIds);
}
