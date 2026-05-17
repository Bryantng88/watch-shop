import { postOneOrder } from "../../server";

// Confirm order: DRAFT -> POSTED, tạo payment đầu tiên và HOLD watch liên quan.
export async function confirmOrderApplication(orderId: string) {
  return postOneOrder(orderId);
}
