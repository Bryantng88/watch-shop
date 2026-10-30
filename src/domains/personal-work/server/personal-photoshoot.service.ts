import { Prisma } from "@prisma/client";
import { dbOrTx, prisma, withDbTransaction, type DB } from "@/server/db/client";
import { getAuthUserId } from "@/server/auth/auth-user-id";
import { personalWorkOwnerAccessWhere } from "./personal-work-access";
import { createPersonalWorkItem } from "./personal-work.service";
import { personalPhotoshootDay, type PersonalPhotoshootInput, type PersonalPhotoshootPlan, type PersonalPhotoshootResult } from "../shared/personal-photoshoot";

function planWhere(userId: string, date: string): Prisma.TaskItemWhereInput {
  const { start, end } = personalPhotoshootDay(date);
  return { AND: [personalWorkOwnerAccessWhere(userId)], personalCategoryId: null, workTypeId: "PHOTOGRAPHY", status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { gte: start, lt: end } };
}
const watchLinksWhere: Prisma.TaskExecutionWhereInput = { targetType: "WATCH", actionType: { not: "CANCELLED" }, metadataJson: { path: ["source"], equals: "PERSONAL_WORK" } };

export async function listPersonalPhotoshootPlans(date: string, auth: unknown, db: DB = prisma): Promise<PersonalPhotoshootPlan[]> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const rows = await dbOrTx(db).taskItem.findMany({ where: planWhere(userId, date), orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
    select: { id: true, title: true, dueAt: true, scheduledEndAt: true, executions: { where: watchLinksWhere, select: { targetId: true } } } });
  return rows.map(row => ({ id: row.id, title: row.title, dueAt: row.dueAt!.toISOString(), scheduledEndAt: row.scheduledEndAt?.toISOString() ?? null, watchCount: new Set(row.executions.map(link => link.targetId)).size }));
}

export async function schedulePersonalWatchPhotoshoot(input: PersonalPhotoshootInput, auth: unknown, db: DB = prisma): Promise<PersonalPhotoshootResult> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const day = personalPhotoshootDay(input.date);
  if (typeof input.watchId !== "string" || !input.watchId.trim() || (input.note !== undefined && (typeof input.note !== "string" || input.note.length > 2000))) throw new Error("Yêu cầu chụp ảnh không hợp lệ");
  const client = dbOrTx(db);
  const watch = await client.watch.findUnique({ where: { id: input.watchId }, select: { id: true, productId: true, product: { select: { title: true, sku: true } } } });
  if (!watch) throw new Error("Không tìm thấy watch");
  const note = input.note?.trim() || "";
  return withDbTransaction(db, async tx => {
    // Serialize same-day scheduling so two concurrent requests create one work item.
    await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(hashtextextended(${`personal-photoshoot:${userId}:${input.date}`}, 0))) AS lock`;
    const candidates = await tx.taskItem.findMany({ where: planWhere(userId, input.date), orderBy: { createdAt: "asc" }, select: { id: true } });
    let id = input.taskItemId || (candidates.length === 1 ? candidates[0].id : null);
    if (input.taskItemId && !candidates.some(candidate => candidate.id === input.taskItemId)) throw new Error("Việc chụp không còn mở trong ngày này hoặc không thuộc quyền sở hữu của bạn");
    if (!id && candidates.length > 1) throw new Error("Ngày này có nhiều việc chụp; hãy chọn việc cần thêm watch");
    let created = false;
    if (!id) {
      const item = await createPersonalWorkItem({ title: `Chụp ảnh ${input.date.split("-").reverse().join("/")}`, categoryKey: "MEDIA", workType: "PHOTOGRAPHY", dueAt: day.dueAt.toISOString() }, auth, tx);
      id = item.id; created = true;
    }
    // Also serialize against ordinary task edits and recheck after waiting for the row lock.
    await tx.$queryRaw`SELECT id FROM "TaskItem" WHERE id = ${id} FOR UPDATE`;
    const item = await tx.taskItem.findFirst({ where: { ...planWhere(userId, input.date), id }, select: { id: true, title: true, taskId: true } });
    if (!item) throw new Error("Việc chụp vừa thay đổi. Hãy chọn lại ngày hoặc việc chụp");
    const previous = await tx.taskExecution.findFirst({ where: { ...watchLinksWhere, taskItemId: id, targetId: watch.id }, select: { id: true, metadataJson: true } });
    const previousNote = previous?.metadataJson && typeof previous.metadataJson === "object" && !Array.isArray(previous.metadataJson) ? previous.metadataJson.shootNote : null;
    const changedNote = Boolean(previous && note && previousNote !== note);
    const metadata = { source: "PERSONAL_WORK", targetLabel: watch.product.title, targetSecondary: watch.product.sku, targetHref: `/admin/watches/${watch.productId}`, shootNote: note };
    if (!previous) await tx.taskExecution.create({ data: { taskId: item.taskId, taskItemId: id, targetType: "WATCH", targetId: watch.id, actionType: "LINKED", createdByUserId: userId, metadataJson: metadata } });
    else if (changedNote) await tx.taskExecution.update({ where: { id: previous.id }, data: { metadataJson: metadata } });
    if (!previous || changedNote) {
      await tx.taskItemActivity.create({ data: { taskItemId: id, actorUserId: userId, sourceType: "DISCUSSION", title: `${changedNote ? "Cập nhật yêu cầu chụp" : "Thêm watch vào buổi chụp"}: ${watch.product.title}`, body: note || null, metadataJson: { watchId: watch.id, date: input.date } } });
      await tx.taskItem.update({ where: { id }, data: { updatedAt: new Date() } });
    }
    const links = await tx.taskExecution.findMany({ where: { ...watchLinksWhere, taskItemId: id }, select: { targetId: true } });
    return { id, title: item.title, watchCount: new Set(links.map(link => link.targetId)).size, outcome: created ? "CREATED" : !previous ? "ADDED" : changedNote ? "UPDATED" : "ALREADY_LINKED" };
  });
}
