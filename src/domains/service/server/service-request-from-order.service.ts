import { ServiceRequestStatus, ServiceScope, ServiceType } from "@prisma/client";
import type { DB } from "@/server/db/client";

type OrderServiceItem = {
  id: string;
  kind?: string | null;
  serviceScope?: string | null;
  customerItemNote?: string | null;
  productId?: string | null;
  variantId?: string | null;
  serviceCatalogId?: string | null;
};

export async function createFromOrderTx(
  tx: DB,
  order: { id: string; items?: OrderServiceItem[]; orderItem?: OrderServiceItem[] },
) {
  const items = (order.items ?? order.orderItem ?? []).filter(
    (item) => String(item.kind ?? "").toUpperCase() === "SERVICE",
  );
  const ids: string[] = [];
  let skipped = 0;

  for (const item of items) {
    const existing = await tx.serviceRequest.findFirst({
      where: { orderItemId: item.id },
      select: { id: true },
    });
    if (existing) {
      skipped += 1;
      continue;
    }

    const created = await tx.serviceRequest.create({
      data: {
        type: ServiceType.PAID,
        billable: true,
        status: ServiceRequestStatus.DRAFT,
        scope: item.serviceScope === "WITH_PURCHASE"
          ? ServiceScope.WITH_PURCHASE
          : ServiceScope.CUSTOMER_OWNED,
        notes: item.customerItemNote ?? null,
        orderItemId: item.id,
        productId: item.productId ?? null,
        variantId: item.variantId ?? null,
        servicecatalogid: item.serviceCatalogId ?? null,
      },
      select: { id: true },
    });
    ids.push(created.id);
  }

  return { created: ids.length, skipped, ids };
}
