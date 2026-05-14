import { createOrderWithItems, createQuickOrderFromProduct } from "@/domains/order/server";

export type CreateOrderCommandInput = Record<string, any>;

export async function createOrderCommand(input: CreateOrderCommandInput) {
  return createOrderWithItems({
    ...input,
    source: input.source ?? "ADMIN",
    verificationStatus: input.verificationStatus ?? "VERIFIED",
    status: input.status ?? "DRAFT",
    quickFromProductId: input.quickFromProductId ?? null,
    quickFlowType: input.quickFlowType ?? "STANDARD",
  });
}

export async function createQuickOrderFromProductCommand(input: Parameters<typeof createQuickOrderFromProduct>[0]) {
  return createQuickOrderFromProduct(input);
}
