import type { DB } from "@/server/db/client";
import type { LookupRequest } from "../intake-schema";

const LIMIT = 6;
const version = (value: Date) => value.toISOString();
export async function executeIntakeLookup(db: DB, request: LookupRequest): Promise<Record<string, unknown>> {
  if (request.tool === "customers.search") {
    const rows = await db.customer.findMany({ where: { OR: [{ id: request.query }, { name: { contains: request.query, mode: "insensitive" } }, { phone: request.query }] }, orderBy: { id: "asc" }, take: LIMIT + 1, select: { id: true, name: true, updatedAt: true } });
    return { matches: rows.slice(0, LIMIT).map(row => ({ id: row.id, name: row.name, version: version(row.updatedAt) })), truncated: rows.length > LIMIT };
  }
  if (request.tool === "watches.search" || request.tool === "accessories.search") {
    const rows = await db.product.findMany({ where: { type: request.tool === "watches.search" ? "WATCH" : { in: ["PARTS", "ACCESSORIES", "WATCH_STRAP", "WATCH_CLASP"] }, OR: [{ id: request.query }, { sku: { equals: request.query, mode: "insensitive" } }, { title: { contains: request.query, mode: "insensitive" } }] }, orderBy: { id: "asc" }, take: LIMIT + 1, select: { id: true, title: true, sku: true, updatedAt: true } });
    return { matches: rows.slice(0, LIMIT).map(row => ({ ...row, updatedAt: undefined, version: version(row.updatedAt) })), truncated: rows.length > LIMIT, ...(request.tool === "accessories.search" ? { compatibility: "UNKNOWN — catalog matches do not establish physical stock or compatibility. Verify with staff; never promise availability." } : {}) };
  }
  if (request.tool === "watches.detail") {
    const product = await db.product.findFirst({ where: { id: request.productId, type: "WATCH" }, select: { id: true, title: true, sku: true, status: true, updatedAt: true, watch: { select: { updatedAt: true, stockStage: true, saleStage: true, serviceStage: true } } } });
    if (!product) return { found: false };
    const reservations = await db.reservation.count({ where: { productId: product.id, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } });
    return { id: product.id, title: product.title, sku: product.sku, status: product.status, version: version(product.updatedAt), watchVersion: product.watch ? version(product.watch.updatedAt) : null, stockStage: product.watch?.stockStage ?? "UNKNOWN", saleStage: product.watch?.saleStage ?? "UNKNOWN", serviceStage: product.watch?.serviceStage ?? "UNKNOWN", activeReservations: reservations, caution: "Read-only snapshot; not a stock hold, price commitment or technical diagnosis." };
  }
  const [followups, manual] = await Promise.all([
    db.salesCodexFollowup.findMany({ where: { customerId: request.customerId, productId: request.productId }, take: 10, select: { kind: true, taskItemId: true } }),
    db.taskExecution.findMany({ where: { targetType: "WATCH", targetId: request.productId, taskItem: { status: { in: ["TODO", "IN_PROGRESS"] } } }, orderBy: { createdAt: "desc" }, take: 21, select: { taskItemId: true, taskItem: { select: { id: true, title: true, status: true } } } }),
  ]);
  return { followups, openWatchWork: manual.slice(0, 20).map(row => row.taskItem), truncated: manual.length > 20, caution: "Reuse an existing follow-up for this customer/watch/kind. Unrelated work may belong to other customers; do not disclose their data." };
}
