import type { DB } from "@/server/db/client";

/** A delayed/retried event from the retired intake cannot recreate its binding. */
export async function isMediaEventBeforeWithdrawal(db: DB, watchId: string, createdAt?: Date | string | null) {
  const retired = await db.taskExecution.findMany({
    where: { targetType: "WATCH", targetId: watchId, actionType: "CANCELLED" },
    select: { metadataJson: true },
  });
  const eventAt = createdAt ? new Date(createdAt).getTime() : NaN;
  return retired.some((binding) => {
    const metadata = binding.metadataJson as { mediaWithdrawal?: { withdrawnAt?: string } } | null;
    const withdrawnAt = metadata?.mediaWithdrawal?.withdrawnAt;
    if (!withdrawnAt) return false;
    return !Number.isFinite(eventAt) || eventAt <= new Date(withdrawnAt).getTime();
  });
}
