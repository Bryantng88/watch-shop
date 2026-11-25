import { prisma, type DB } from "@/server/db/client";
import { assertPersonalChecklistAccess, assertPersonalWorkAccess } from "@/domains/personal-work/server/personal-work.service";
import type { WorkMediaTarget } from "../shared/work-media";
import { WorkMediaError } from "../shared/work-media-error";
export { WorkMediaError } from "../shared/work-media-error";
export async function authorizeWorkMedia(target: WorkMediaTarget, auth: unknown, edit = false, db: DB = prisma) {
  if (!/^[a-zA-Z0-9:_-]{1,160}$/.test(target.workId) || target.entryId && !/^[a-zA-Z0-9:_-]{1,160}$/.test(target.entryId)) throw new WorkMediaError("Công việc không hợp lệ.");
  const item = target.entryId
    ? await assertPersonalChecklistAccess(target.workId,target.entryId,auth,edit ? "EDIT" : "VIEW",db)
    : await assertPersonalWorkAccess(target.workId,auth,edit ? "EDIT" : "VIEW",db);
  const editor = "canEdit" in item ? item.canEdit : item.access !== "VIEWER";
  const canEdit = Boolean(editor) && item.status !== "DONE" && item.status !== "CANCELLED" && !item.checklistLockedAt;
  if (edit && !canEdit) throw new WorkMediaError("Công việc đã khóa; hãy mở lại trước khi thay đổi ảnh.",409);
  return { userId:item.userId, canEdit, ownerType:target.entryId ? "TASK_CHECKLIST" as const : "TASK_ITEM" as const, ownerId:target.entryId || target.workId };
}
