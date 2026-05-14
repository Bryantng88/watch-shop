import { cancelOrderCommand } from "@/domains/order/application";

export async function cancelOrderCommand(input: { id: string; reason?: string | null }) {
  return cancelOrder(input);
}
