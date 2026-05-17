import { verifyOrder } from "../../server";

export async function verifyOrderApplication(input: { id: string; status: "VERIFIED" | "REJECTED" }) {
  return verifyOrder(input);
}
