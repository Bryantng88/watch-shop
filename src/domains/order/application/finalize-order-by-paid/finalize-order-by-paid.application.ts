import { finalizeOrderByPaidAmountApplication } from "@/domains/payment/application";

export async function finalizeOrderByPaidApplication(input: {
  orderId: string;
  note?: string | null;
}) {
  return finalizeOrderByPaidAmountApplication(input);
}
