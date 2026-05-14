import { updateOrderDraft } from "@/domains/order/server";
import type { OrderDraftInput } from "@/domains/order/server/shared";

export async function updateOrderDraftCommand(orderId: string, input: OrderDraftInput) {
  return updateOrderDraft(orderId, input);
}
