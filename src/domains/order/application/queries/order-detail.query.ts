import { getAdminOrderDetail, getOrderDraftForEdit } from "@/domains/order/server";

export async function getOrderDetailQuery(orderId: string) {
  return getAdminOrderDetail(orderId);
}

export async function getOrderDraftForEditQuery(orderId: string) {
  return getOrderDraftForEdit(orderId);
}
