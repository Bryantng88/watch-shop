import { verifyOrderCommand } from "@/domains/order/application";

export async function verifyOrderCommand(input: { id: string; status: "VERIFIED" | "REJECTED" }) {
  return verifyOrder(input);
}
