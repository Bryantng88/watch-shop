import { OrderFlowType } from "@prisma/client";
import { createOrderWithItems } from "../write";
import type { QuickOrderFromProductInput } from "../shared";

export async function createQuickOrderFromProduct(input: QuickOrderFromProductInput) {
  return createOrderWithItems({
    customerId: input.customerId ?? null,
    customerName: input.customerName,
    shipPhone: input.shipPhone ?? "",
    hasShipment: false,
    shipAddress: "",
    shipCity: "",
    shipDistrict: null,
    shipWard: null,
    paymentMethod: "BANK_TRANSFER",
    notes: input.notes ?? null,
    status: "DRAFT",
    source: "ADMIN",
    verificationStatus: "VERIFIED",
    quickFromProductId: input.productId,
    quickFlowType: OrderFlowType.QUICK_ORDER,
    items: [
      {
        kind: "PRODUCT",
        productId: input.productId,
        quantity: 1,
        title: "",
        listPrice: Number(input.listPrice ?? 0),
        unitPriceAgreed: input.unitPriceAgreed == null ? null : Number(input.unitPriceAgreed),
        createdFromFlow: OrderFlowType.QUICK_ORDER,
      },
    ],
  });
}
