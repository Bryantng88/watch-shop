import { updateOrderDraft } from "../../server";
import type { OrderDraftInput } from "../../server/shared";

export async function updateOrderApplication(orderId: string, input: OrderDraftInput) {
  return updateOrderDraft(orderId, input);
}
