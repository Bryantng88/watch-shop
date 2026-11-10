import {codexExecutionReadiness} from "@/domains/personal-work/server/codex/codex-config";
import type { DB } from "@/server/db/client";
import { listPersonalCategories } from "@/domains/personal-work/server/personal-work-categories.service";
import { validatePersonalSchedule } from "@/domains/personal-work/shared/personal-work-schedule";
import { PERSONAL_WORK_TYPES } from "@/domains/personal-work/shared/personal-work.types";
import { personalWorkPlanSchema, type PersonalWorkDraft } from "../personal-work-contract";
import { hasUniqueEvidence, type Evidence } from "../live-contract";
import {hasAssistantPermission} from "../capabilities";
import { AssistantError, assistantActor, assistantRecipient } from "./access";
export async function preparePersonalWork(
  db: DB,
  userId: string,
  raw: unknown,
  revision: number,
  entries: Evidence[],
): Promise<PersonalWorkDraft> {
  const plan = personalWorkPlanSchema.parse(raw);
  validatePersonalSchedule(plan.dueAt, plan.scheduledEndAt);
  if(plan.codex){
    const actor=await assistantActor(db,userId),readiness=codexExecutionReadiness();
    if(!actor.admin)throw new AssistantError("Chỉ ADMIN được gửi việc của mình cho worker Codex.",403);
    if(!readiness.ready)throw new AssistantError(readiness.reason||"Worker Codex chưa sẵn sàng.",409);
  }
  const category = (await listPersonalCategories(userId)).find((c) => c.key === plan.categoryKey);
  const seen = entries.some(
    (e) =>
      e.request.tool === "personalWork.categories" &&
      Array.isArray(e.result.categories) &&
      (e.result.categories as { key: string }[]).some((c) => c.key === plan.categoryKey),
  );
  if (!category || !seen) throw new AssistantError("Cần tra cứu lại nhóm công việc của bạn.", 409);
  if (
    plan.kind === "TASK" &&
    plan.workType &&
    (plan.workType === "EVENT" ||
      !category.isDefault ||
      !PERSONAL_WORK_TYPES[category.domain].some((t) => t.key === plan.workType))
  )
    throw new AssistantError("Loại công việc không phù hợp nhóm đã chọn.", 409);
  let assignee;
  if (plan.assigneeUserId && plan.assigneeUserId !== userId) {
    const actor = await assistantActor(db,userId);
    if (!hasAssistantPermission(actor,"TASK_MANAGE")) throw new AssistantError("Không có quyền giao công việc.",403);
    if (!hasUniqueEvidence(entries,"personalWork.people",plan.assigneeUserId)) throw new AssistantError("Cần xác định duy nhất người thực hiện.",409);
    assignee = await assistantRecipient(db,plan.assigneeUserId) || undefined;
    if (!assignee) throw new AssistantError("Người thực hiện không còn hoạt động hoặc không có quyền công việc.",409);
  }
  const shares = [];
  for (const requested of plan.shares) {
    if (requested.userId === assignee?.id) {
      if (requested.accessLevel !== "EDITOR") throw new AssistantError("Giao việc cho người chỉ xem là mâu thuẫn. Hãy làm rõ quyền cập nhật.",409);
      continue;
    }
    if (requested.userId === userId) throw new AssistantError("Chủ sở hữu không cần tự chia sẻ.");
    if (!hasUniqueEvidence(entries, "personalWork.people", requested.userId))
      throw new AssistantError("Chưa xác định duy nhất người được chia sẻ.", 409);
    const person = await db.user.findFirst({
      where: { id: requested.userId, isActive: true },
      select: { id: true, name: true },
    });
    if (!person) throw new AssistantError("Người nhận không còn hoạt động.", 409);
    shares.push({ ...person, accessLevel: requested.accessLevel });
  }
  if (plan.syncGoogle && !(await db.googleCalendarConnection.findUnique({ where: { userId } })))
    throw new AssistantError("Bạn chưa kết nối Google Calendar.", 409);
  return { plan, revision, categoryLabel: category.label, shares, ...(assignee ? {assignee} : {}) };
}
