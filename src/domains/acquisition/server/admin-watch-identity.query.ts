import { dbOrTx, type DB } from "@/server/db/client";
import { intakeIdentitySuffix } from "../shared/admin-watch-identity";

/** Admin-only batch read; public Product.title and WatchContent stay untouched. */
export async function loadAdminIntakeIdentities(db: DB, productIds: string[]) {
  if (!productIds.length) return new Map<string, string>();
  const rows = await dbOrTx(db).watch.findMany({
    where: { productId: { in: productIds } },
    select: {
      productId: true, acquisitionId: true,
      currentInventoryCycle: { select: { sourceAcquisitionItem: { select: {
        acquisition: { select: { refNo: true, accquisitionStt: true, vendor: { select: { name: true } } } },
      } } } },
    },
  });
  const fallbackIds = [...new Set(rows.filter(row => !row.currentInventoryCycle?.sourceAcquisitionItem && row.acquisitionId).map(row => row.acquisitionId!))];
  const acquisitions = fallbackIds.length ? await dbOrTx(db).acquisition.findMany({
    where: { id: { in: fallbackIds }, accquisitionStt: "POSTED" },
    select: { id: true, refNo: true, accquisitionStt: true, vendor: { select: { name: true } } },
  }) : [];
  const fallback = new Map(acquisitions.map(row => [row.id, row]));
  const result = new Map<string, string>();
  for (const row of rows) {
    const acq = row.currentInventoryCycle?.sourceAcquisitionItem?.acquisition ?? fallback.get(row.acquisitionId ?? "");
    if (acq?.accquisitionStt !== "POSTED") continue;
    const suffix = intakeIdentitySuffix(acq.vendor?.name, acq.refNo);
    if (suffix) result.set(row.productId, suffix);
  }
  return result;
}
