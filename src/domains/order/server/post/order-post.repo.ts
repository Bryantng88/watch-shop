import { dbOrTx, type DB } from "@/server/db/client";
import type { OrderVerificationStatus } from "@prisma/client";

export async function getOrderForPostRepo(db: DB, id: string) {
  return dbOrTx(db).order.findUnique({ where: { id }, include: { orderItem: true } });
}

export async function getOrdersForPostRepo(db: DB, ids: string[]) {
  return dbOrTx(db).order.findMany({
    where: { id: { in: ids }, status: "DRAFT" },
    include: { orderItem: true },
  });
}

export async function markOrderPostedRepo(db: DB, id: string, refNo: string) {
  return dbOrTx(db).order.update({
    where: { id },
    data: { status: "POSTED", refNo, updatedAt: new Date() },
  });
}

export async function updateOrderVerificationRepo(db: DB, id: string, status: OrderVerificationStatus) {
  return dbOrTx(db).order.update({ where: { id }, data: { verificationStatus: status } });
}

export async function cancelOrderRepo(db: DB, id: string, reason?: string | null) {
  return dbOrTx(db).order.update({
    where: { id },
    data: { status: "CANCELLED", notes: reason ?? undefined, updatedAt: new Date() },
  });
}
