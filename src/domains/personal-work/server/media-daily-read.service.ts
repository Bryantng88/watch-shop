import type { DB } from "@/server/db/client";
import { expandPermissions } from "@/server/auth/permission-implications";
import { personalWorkViewAccessWhere } from "./personal-work-access";
import {
  mediaChecklistContext,
  type DailyMediaWorkSummary,
} from "../shared/media-daily";
// Read live open checklist state, not a sticky flag on the Watch or a stale snapshot.
export async function dailyMediaWorkForProducts(
  db: DB,
  userId: string | null | undefined,
  productIds: string[],
): Promise<Map<string, DailyMediaWorkSummary>> {
  const result = new Map<string, DailyMediaWorkSummary>();
  const ids = [...new Set(productIds)].filter((id) =>
    /^[\w-]{1,100}$/.test(id),
  );
  if (!userId || !ids.length) return result;
  const user = await db.user.findFirst({
    where: { id: userId, isActive: true },
    select: {
      roles: {
        select: { name: true, permissions: { select: { code: true } } },
      },
    },
  });
  const admin = user?.roles.some((role) => role.name === "ADMIN"),
    p = new Set(
      expandPermissions(
        user?.roles.flatMap((role) => role.permissions.map((v) => v.code)) ??
          [],
      ),
    );
  if (!user || (!admin && (!p.has("TASK_VIEW") || !p.has("PRODUCT_VIEW"))))
    return result;
  for (const productId of ids)
    result.set(productId, {
      productId,
      count: 0,
      taskItemId: null,
      checklistItemId: null,
    });
  const rows = await db.taskItemChecklist.findMany({
    where: {
      isDone: false,
      AND: [
        { note: { contains: '"source":"WATCH_MEDIA_DAILY"' } },
        {
          OR: ids.map((productId) => ({
            note: { contains: JSON.stringify(productId) },
          })),
        },
        {
          taskItem: {
            status: { in: ["TODO", "IN_PROGRESS"] },
            mergedIntoTaskItemId: null,
          },
        },
        {
          OR: [
            { taskItem: personalWorkViewAccessWhere(userId) },
            { personalShares: { some: { userId } } },
          ],
        },
      ],
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: { id: true, note: true, taskItemId: true },
  });
  for (const row of rows) {
    const context = mediaChecklistContext(row.note);
    if (!context?.productId) continue;
    const summary = result.get(context.productId);
    if (!summary) continue;
    summary.count++;
    summary.taskItemId ??= row.taskItemId;
    summary.checklistItemId ??= row.id;
  }
  return result;
}
export async function dailyMediaWorkForWatches(
  db: DB,
  userId: string | null | undefined,
  watchIds: string[],
) {
  const ids = [...new Set(watchIds)];
  if (!userId || !ids.length) return new Map<string, DailyMediaWorkSummary>();
  const rows = await db.watch.findMany({
    where: { id: { in: ids } },
    select: { id: true, productId: true },
  });
  const summaries = await dailyMediaWorkForProducts(
    db,
    userId,
    rows.map((row) => row.productId),
  );
  return new Map(
    rows.flatMap((row) => {
      const value = summaries.get(row.productId);
      return value ? [[row.id, value] as const] : [];
    }),
  );
}
