import { Prisma, TaskCompletionMode } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskActionListFilters, UpsertTaskActionInput } from "./task-action.types";

export const TASK_ACTION_SELECT = {
  id: true,
  taskTypeId: true,
  code: true,
  name: true,
  description: true,
  completionMode: true,
  completionRuleKey: true,
  targetType: true,
  serviceCatalogId: true,
  technicalDetailCatalogId: true,
  supplyCatalogId: true,
  mechanicalPartCatalogId: true,
  technicalActionMode: true,
  defaultTitleTemplate: true,
  defaultDescriptionTemplate: true,
  metadataJson: true,
  isActive: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskActionSelect;

export const TASK_ACTION_WITH_TYPE_SELECT = {
  ...TASK_ACTION_SELECT,
  taskType: { select: { id: true, code: true, name: true, domain: true } },
} satisfies Prisma.TaskActionSelect;

export function normalizeTaskActionCode(code: string) {
  return String(code ?? "").trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

function cleanNullable(value: unknown) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function buildWhere(filters?: TaskActionListFilters): Prisma.TaskActionWhereInput {
  const where: Prisma.TaskActionWhereInput = {};
  const q = filters?.q?.trim();

  if (q) {
    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { completionRuleKey: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters?.taskTypeId && filters.taskTypeId !== "ALL") where.taskTypeId = filters.taskTypeId;
  if (filters?.domain && filters.domain !== "ALL") where.taskType = { domain: filters.domain };
  if (filters?.isActive === "ACTIVE") where.isActive = true;
  if (filters?.isActive === "INACTIVE") where.isActive = false;

  return where;
}

export async function listTaskActionsRepo(db: DB, filters?: TaskActionListFilters) {
  const client = dbOrTx(db);
  return client.taskAction.findMany({
    where: buildWhere(filters),
    select: TASK_ACTION_WITH_TYPE_SELECT,
    orderBy: [{ taskType: { domain: "asc" } }, { taskType: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function listActiveTaskActionsRepo(db: DB) {
  const client = dbOrTx(db);
  return client.taskAction.findMany({
    where: { isActive: true, taskType: { isActive: true } },
    select: TASK_ACTION_SELECT,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getTaskActionByIdRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  return client.taskAction.findUnique({ where: { id }, select: TASK_ACTION_WITH_TYPE_SELECT });
}

export async function getTaskActionByCodeRepo(db: DB, taskTypeId: string, code: string) {
  const client = dbOrTx(db);
  return client.taskAction.findUnique({
    where: { taskTypeId_code: { taskTypeId, code: normalizeTaskActionCode(code) } },
    select: TASK_ACTION_WITH_TYPE_SELECT,
  });
}

export async function createTaskActionRepo(db: DB, input: UpsertTaskActionInput) {
  const client = dbOrTx(db);
  return client.taskAction.create({
    data: {
      taskTypeId: input.taskTypeId,
      code: normalizeTaskActionCode(input.code),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      completionMode: input.completionMode ?? TaskCompletionMode.MANUAL_CONFIRM,
      completionRuleKey: cleanNullable(input.completionRuleKey),
      targetType: input.targetType ?? null,
      serviceCatalogId: cleanNullable(input.serviceCatalogId),
      technicalDetailCatalogId: cleanNullable(input.technicalDetailCatalogId),
      supplyCatalogId: cleanNullable(input.supplyCatalogId),
      mechanicalPartCatalogId: cleanNullable(input.mechanicalPartCatalogId),
      technicalActionMode: input.technicalActionMode ?? null,
      defaultTitleTemplate: input.defaultTitleTemplate?.trim() || null,
      defaultDescriptionTemplate: input.defaultDescriptionTemplate?.trim() || null,
      metadataJson: input.metadataJson ?? Prisma.JsonNull,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
    select: TASK_ACTION_WITH_TYPE_SELECT,
  });
}

export async function updateTaskActionRepo(db: DB, id: string, input: Partial<UpsertTaskActionInput>) {
  const client = dbOrTx(db);
  return client.taskAction.update({
    where: { id },
    data: {
      ...(input.taskTypeId !== undefined ? { taskTypeId: input.taskTypeId } : {}),
      ...(input.code !== undefined ? { code: normalizeTaskActionCode(input.code) } : {}),
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.completionMode !== undefined ? { completionMode: input.completionMode } : {}),
      ...(input.completionRuleKey !== undefined ? { completionRuleKey: cleanNullable(input.completionRuleKey) } : {}),
      ...(input.targetType !== undefined ? { targetType: input.targetType } : {}),
      ...(input.serviceCatalogId !== undefined ? { serviceCatalogId: cleanNullable(input.serviceCatalogId) } : {}),
      ...(input.technicalDetailCatalogId !== undefined ? { technicalDetailCatalogId: cleanNullable(input.technicalDetailCatalogId) } : {}),
      ...(input.supplyCatalogId !== undefined ? { supplyCatalogId: cleanNullable(input.supplyCatalogId) } : {}),
      ...(input.mechanicalPartCatalogId !== undefined ? { mechanicalPartCatalogId: cleanNullable(input.mechanicalPartCatalogId) } : {}),
      ...(input.technicalActionMode !== undefined ? { technicalActionMode: input.technicalActionMode } : {}),
      ...(input.defaultTitleTemplate !== undefined ? { defaultTitleTemplate: input.defaultTitleTemplate?.trim() || null } : {}),
      ...(input.defaultDescriptionTemplate !== undefined ? { defaultDescriptionTemplate: input.defaultDescriptionTemplate?.trim() || null } : {}),
      ...(input.metadataJson !== undefined ? { metadataJson: input.metadataJson ?? Prisma.JsonNull } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
    select: TASK_ACTION_WITH_TYPE_SELECT,
  });
}
