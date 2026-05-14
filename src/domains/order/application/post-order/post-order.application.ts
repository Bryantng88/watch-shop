import { postOneOrder, postOrders } from "../../server";

export async function postOrderApplication(orderId: string) {
  return postOneOrder(orderId);
}

export async function bulkPostOrdersApplication(orderIds: string[]) {
  return postOrders(orderIds);
}
