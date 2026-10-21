import { AppTagOwnerType, AppTagTargetType, TaskKind, TaskStatus, type TaskPriority } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { createTask, getAuthUserId } from "@/domains/task/server/core/task.service";
import { createTaskItemRepo, setTargetTagsRepo } from "@/domains/task/server/core/task.repo";
import { hydrateTaskItemsWithTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import { isGoogleCalendarConfigured } from "./google-calendar.service";
import { PERSONAL_WORK_DOMAINS, type PersonalWorkDomain, type PersonalWorkPageData } from "../shared/personal-work.types";

const domainKeys = new Set<string>(PERSONAL_WORK_DOMAINS.map((item) => item.key));

export function normalizePersonalDomain(value: unknown): PersonalWorkDomain {
  const domain = String(value || "GENERAL").trim().toUpperCase() as PersonalWorkDomain;
  return domainKeys.has(domain) ? domain : "GENERAL";
}

export async function getPersonalWorkPageData(auth: unknown): Promise<PersonalWorkPageData> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const [items, connection] = await Promise.all([
    prisma.taskItem.findMany({
      where: {
        task: { kind: TaskKind.PERSONAL, OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] },
        status: { not: TaskStatus.CANCELLED },
      },
      include: { calendarLinks: { where: { userId }, take: 1 } },
      orderBy: [{ isDone: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
    }),
    prisma.googleCalendarConnection.findUnique({ where: { userId } }),
  ]);
  const tagged = await hydrateTaskItemsWithTagsRepo(prisma, items);
  return {
    items: tagged.map((item) => {
      const names = item.tags.map((tag) => tag.name);
      const domain = normalizePersonalDomain(names.find((name) => domainKeys.has(name.toUpperCase())));
      const calendar = item.calendarLinks[0];
      return {
        id: item.id,
        title: item.title,
        note: item.note,
        status: item.status,
        priority: item.priority,
        dueAt: item.dueAt?.toISOString() ?? null,
        completedAt: item.completedAt?.toISOString() ?? null,
        domain,
        tags: names.filter((name) => name.toUpperCase() !== domain),
        calendar: { synced: Boolean(calendar), htmlLink: calendar?.eventHtmlLink ?? null, lastSyncedAt: calendar?.lastSyncedAt.toISOString() ?? null },
      };
    }),
    calendar: {
      configured: isGoogleCalendarConfigured(),
      connected: Boolean(connection),
      accountEmail: connection?.googleAccountEmail ?? null,
      lastSyncedAt: connection?.lastSyncedAt?.toISOString() ?? null,
    },
  };
}

export async function createPersonalWorkItem(input: { title: string; note?: string | null; dueAt?: string | null; priority?: TaskPriority; domain?: PersonalWorkDomain; tags?: string[] }, auth: unknown) {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const title = input.title.trim();
  if (!title) throw new Error("Vui lòng nhập nội dung công việc");
  const taskResult = await createTask(prisma, { kind: TaskKind.PERSONAL }, auth);
  const item = await createTaskItemRepo(prisma, {
    taskId: taskResult.task.id,
    title,
    note: input.note?.trim() || null,
    ownerUserId: userId,
    assignedToUserId: userId,
    priority: input.priority || "MEDIUM",
    dueAt: input.dueAt || null,
  });
  const domain = normalizePersonalDomain(input.domain);
  await setTargetTagsRepo(prisma, {
    ownerType: AppTagOwnerType.TASK,
    ownerId: taskResult.task.id,
    targetType: AppTagTargetType.TASK_ITEM,
    targetId: item.id,
    names: [domain, ...(input.tags || [])],
  });
  return item;
}

export async function updatePersonalWorkItem(input: { id: string; title?: string; note?: string | null; dueAt?: string | null; priority?: TaskPriority; status?: TaskStatus; domain?: PersonalWorkDomain; tags?: string[] }, auth: unknown) {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const current = await prisma.taskItem.findFirst({ where: { id: input.id, task: { kind: TaskKind.PERSONAL, OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] } }, select: { id: true, taskId: true } });
  if (!current) throw new Error("Không tìm thấy công việc cá nhân");
  const status = input.status;
  await prisma.taskItem.update({
    where: { id: input.id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(input.dueAt !== undefined ? { dueAt: input.dueAt ? new Date(input.dueAt) : null } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(status ? { status, isDone: status === TaskStatus.DONE, completedAt: status === TaskStatus.DONE ? new Date() : null, startedAt: status === TaskStatus.IN_PROGRESS ? new Date() : undefined } : {}),
    },
  });
  if (input.domain || input.tags) {
    await setTargetTagsRepo(prisma, {
      ownerType: AppTagOwnerType.TASK,
      ownerId: current.taskId,
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: current.id,
      names: [normalizePersonalDomain(input.domain), ...(input.tags || [])],
    });
  }
}
