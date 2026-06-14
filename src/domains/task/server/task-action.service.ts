import type { DB } from "@/server/db/client";
import {
  createTaskActionRepo,
  getTaskActionByCodeRepo,
  getTaskActionByIdRepo,
  listTaskActionsRepo,
  updateTaskActionRepo,
} from "./task-action.repo";
import type { TaskActionListFilters, UpsertTaskActionInput } from "./task-action.types";

function assertInput(input: UpsertTaskActionInput | Partial<UpsertTaskActionInput>) {
  if (input.taskTypeId !== undefined && !String(input.taskTypeId ?? "").trim()) throw new Error("Vui lòng chọn loại task");
  if (input.code !== undefined && !String(input.code ?? "").trim()) throw new Error("Vui lòng nhập mã action");
  if (input.name !== undefined && !String(input.name ?? "").trim()) throw new Error("Vui lòng nhập tên action");
}

export async function getTaskActionSettingsPageData(db: DB, filters?: TaskActionListFilters) {
  const items = await listTaskActionsRepo(db, filters);
  return { items };
}

export async function createTaskAction(db: DB, input: UpsertTaskActionInput) {
  assertInput(input);
  const duplicated = await getTaskActionByCodeRepo(db, input.taskTypeId, input.code);
  if (duplicated) throw new Error(`Action ${input.code} đã tồn tại trong loại task này`);
  return createTaskActionRepo(db, input);
}

export async function updateTaskAction(db: DB, id: string, input: Partial<UpsertTaskActionInput>) {
  assertInput(input);
  const existing = await getTaskActionByIdRepo(db, id);
  if (!existing) throw new Error("Không tìm thấy action");

  const nextTaskTypeId = input.taskTypeId ?? existing.taskTypeId;
  const nextCode = input.code ?? existing.code;
  const duplicated = await getTaskActionByCodeRepo(db, nextTaskTypeId, nextCode);
  if (duplicated && duplicated.id !== id) throw new Error(`Action ${nextCode} đã tồn tại trong loại task này`);

  return updateTaskActionRepo(db, id, input);
}
