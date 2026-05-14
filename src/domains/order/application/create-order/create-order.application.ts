import { createOrderWithItems } from "../../server";
import type { CreateOrderInput } from "../../server/shared";

export async function createOrderApplication(input: CreateOrderInput) {
  return createOrderWithItems({
    ...input,
    source: input.source ?? "ADMIN",
    verificationStatus: input.verificationStatus ?? "VERIFIED",
    status: input.status ?? "DRAFT",
    quickFromProductId: input.quickFromProductId ?? null,
    quickFlowType: input.quickFlowType ?? "STANDARD",
  });
}
