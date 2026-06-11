import { prisma, type DB } from "@/server/db/client";
import { createTaskTypeRepo, getTaskTypeByCodeRepo, getTaskTypeByIdRepo, listActiveTaskTypesRepo, listTaskTypesRepo, updateTaskTypeRepo } from "./task-type.repo";
import type { TaskTypeListFilters, UpsertTaskTypeInput } from "./task-type.types";

function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

function assertTaskTypeInput(input: UpsertTaskTypeInput | Partial<UpsertTaskTypeInput>) {
  if (input.code !== undefined && !normalizeCode(input.code)) throw new Error("Vui lòng nhập mã loại task");
  if (input.name !== undefined && !input.name.trim()) throw new Error("Vui lòng nhập tên loại task");
  if (input.completionMode === "BUSINESS_RULE" && !input.completionRuleKey?.trim()) {
    throw new Error("Business rule hiện chưa dùng ở phase này. Vui lòng chọn Manual Confirm hoặc nhập rule key hợp lệ.");
  }
}

export async function getTaskTypeSettingsPageData(db: DB, filters?: TaskTypeListFilters) {
  const items = await listTaskTypesRepo(db, filters);
  return { items };
}

export async function getActiveTaskTypeOptions(db: DB) {
  return listActiveTaskTypesRepo(db);
}

export async function createTaskType(db: DB, input: UpsertTaskTypeInput) {
  assertTaskTypeInput(input);
  const code = normalizeCode(input.code);
  const existing = await getTaskTypeByCodeRepo(db, code);
  if (existing) throw new Error(`Mã task type ${code} đã tồn tại`);
  return createTaskTypeRepo(db, { ...input, code });
}

export async function updateTaskType(db: DB, id: string, input: Partial<UpsertTaskTypeInput>) {
  assertTaskTypeInput(input);
  const existing = await getTaskTypeByIdRepo(db, id);
  if (!existing) throw new Error("Không tìm thấy loại task");

  if (input.code !== undefined) {
    const code = normalizeCode(input.code);
    const duplicated = await getTaskTypeByCodeRepo(db, code);
    if (duplicated && duplicated.id !== id) throw new Error(`Mã task type ${code} đã tồn tại`);
    input = { ...input, code };
  }

  return updateTaskTypeRepo(db, id, input);
}
