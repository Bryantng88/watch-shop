import { dbOrTx, type DB } from "@/server/db/client";

/** Workspace mutations must never bypass the personal-work sharing/checklist rules. */
export async function requireWorkspaceTaskItem(db: DB, taskItemId: string) {
  const item = await dbOrTx(db).taskItem.findFirst({
    where: { id: taskItemId, personalOwnerUserId: null, task: { kind: { not: "PERSONAL" } } },
    select: { id: true, taskId: true },
  });
  if (!item?.taskId) throw new Error("Use the personal-work actions for personal work");
  return { id: item.id, taskId: item.taskId };
}
