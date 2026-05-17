import { cancelOrder } from "../../server";

export async function cancelOrderApplication(input: { id: string; reason?: string | null }) {
  return cancelOrder(input);
}
