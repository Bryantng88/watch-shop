import { Prisma, TaskDomain } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskTypeListFilters, UpsertTaskTypeInput } from "./task-type.types";

export const TASK_TYPE_SELECT = {
  id: true,
  code: true,
  name: true,
  description: true,
  domain: true,
  legacyKind: true,
  defaultPriority: true,
  completionMode: true,
  completionRuleKey: true,
  isActive: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskTypeSelect;

function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

function buildWhere(filters?: TaskTypeListFilters): Prisma.TaskTypeWhereInput {
  const where: Prisma.TaskTypeWhereInput = {};
  const q = filters?.q?.trim();

  if (q) {
    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters?.domain && filters.domain !== "ALL") where.domain = filters.domain;
  if (filters?.isActive === "ACTIVE") where.isActive = true;
  if (filters?.isActive === "INACTIVE") where.isActive = false;

  return where;
}

export async function listTaskTypesRepo(db: DB, filters?: TaskTypeListFilters) {
  const client = dbOrTx(db);
  return client.taskType.findMany({
    where: buildWhere(filters),
    select: TASK_TYPE_SELECT,
    orderBy: [{ domain: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function listActiveTaskTypesRepo(db: DB) {
  const client = dbOrTx(db);
  return client.taskType.findMany({
    where: { isActive: true },
    select: TASK_TYPE_SELECT,
    orderBy: [{ domain: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getTaskTypeByIdRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  return client.taskType.findUnique({ where: { id }, select: TASK_TYPE_SELECT });
}

export async function getTaskTypeByCodeRepo(db: DB, code: string) {
  const client = dbOrTx(db);
  return client.taskType.findUnique({ where: { code: normalizeCode(code) }, select: TASK_TYPE_SELECT });
}

export async function createTaskTypeRepo(db: DB, input: UpsertTaskTypeInput) {
  const client = dbOrTx(db);
  return client.taskType.create({
    data: {
      code: normalizeCode(input.code),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      domain: input.domain ?? TaskDomain.GENERAL,
      legacyKind: input.legacyKind ?? "OTHER",
      defaultPriority: input.defaultPriority ?? "MEDIUM",
      completionMode: input.completionMode ?? "MANUAL_CONFIRM",
      completionRuleKey: input.completionRuleKey?.trim() || null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
    select: TASK_TYPE_SELECT,
  });
}

export async function updateTaskTypeRepo(db: DB, id: string, input: Partial<UpsertTaskTypeInput>) {
  const client = dbOrTx(db);
  return client.taskType.update({
    where: { id },
    data: {
      ...(input.code !== undefined ? { code: normalizeCode(input.code) } : {}),
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.domain !== undefined ? { domain: input.domain } : {}),
      ...(input.legacyKind !== undefined ? { legacyKind: input.legacyKind } : {}),
      ...(input.defaultPriority !== undefined ? { defaultPriority: input.defaultPriority } : {}),
      ...(input.completionMode !== undefined ? { completionMode: input.completionMode } : {}),
      ...(input.completionRuleKey !== undefined ? { completionRuleKey: input.completionRuleKey?.trim() || null } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
    select: TASK_TYPE_SELECT,
  });
}
