import PurchaseRequestQueueClient from "@/domains/purchase-request/client/PurchaseRequestQueueClient";
import { listPurchaseRequests } from "@/domains/purchase-request/server";

export const dynamic = "force-dynamic";

export default async function PurchaseRequestPage() {
  const rows = await listPurchaseRequests();
  const serialized = rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    followUpAt: row.followUpAt?.toISOString() ?? null,
    processingStartedAt: row.processingStartedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
  }));
  return <PurchaseRequestQueueClient initialRows={serialized} />;
}
