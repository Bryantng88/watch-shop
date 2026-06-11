import { prisma, type DB } from "@/server/db/client";
import {
  createTaskTypeRepo,
  getTaskTypeByCodeRepo,
  getTaskTypeByIdRepo,
  listActiveTaskTypesRepo,
  listTaskTypesRepo,
  updateTaskTypeRepo,
} from "./task-type.repo";
import type { TaskTypeListFilters, UpsertTaskTypeInput } from "./task-type.types";
import { getTaskCompletionRuleDefinition, normalizeTaskCompletionRuleKey } from "./task-rule-keys";

function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeCompletionRuleKey(value?: string | null) {
  const key = normalizeTaskCompletionRuleKey(value);
  return key || null;
}

function assertTaskTypeInput(input: UpsertTaskTypeInput | Partial<UpsertTaskTypeInput>) {
  if (input.code !== undefined && !normalizeCode(input.code)) throw new Error("Vui lòng nhập mã loại task");
  if (input.name !== undefined && !input.name.trim()) throw new Error("Vui lòng nhập tên loại task");

  if (input.completionMode === "BUSINESS_RULE") {
    const ruleKey = normalizeCompletionRuleKey(input.completionRuleKey);
    if (!ruleKey) throw new Error("Vui lòng chọn business rule cho loại task");

    const rule = getTaskCompletionRuleDefinition(ruleKey);
    if (!rule) throw new Error(`Business rule ${ruleKey} chưa được hỗ trợ`);

    if (input.domain !== undefined && rule.domain !== input.domain) {
      throw new Error(`Rule ${ruleKey} chỉ dùng cho domain ${rule.domain}`);
    }
  }
}

function normalizeTaskTypePayload<T extends UpsertTaskTypeInput | Partial<UpsertTaskTypeInput>>(input: T): T {
  if (input.completionMode !== "BUSINESS_RULE") {
    return { ...input, completionRuleKey: null };
  }

  return {
    ...input,
    completionRuleKey: normalizeCompletionRuleKey(input.completionRuleKey),
  };
}

export async function getTaskTypeSettingsPageData(db: DB, filters?: TaskTypeListFilters) {
  const items = await listTaskTypesRepo(db, filters);
  return { items };
}

export async function getActiveTaskTypeOptions(db: DB = prisma) {
  return listActiveTaskTypesRepo(db);
}

export async function createTaskType(db: DB, input: UpsertTaskTypeInput) {
  const normalizedInput = normalizeTaskTypePayload(input);
  assertTaskTypeInput(normalizedInput);

  const code = normalizeCode(normalizedInput.code);
  const existing = await getTaskTypeByCodeRepo(db, code);
  if (existing) throw new Error(`Mã task type ${code} đã tồn tại`);

  return createTaskTypeRepo(db, { ...normalizedInput, code });
}

export async function updateTaskType(db: DB, id: string, input: Partial<UpsertTaskTypeInput>) {
  const existing = await getTaskTypeByIdRepo(db, id);
  if (!existing) throw new Error("Không tìm thấy loại task");

  let nextInput = normalizeTaskTypePayload(input);

  const nextDomain = nextInput.domain ?? existing.domain;
  const nextCompletionMode = nextInput.completionMode ?? existing.completionMode;
  const nextRuleKey =
    nextInput.completionRuleKey !== undefined
      ? nextInput.completionRuleKey
      : existing.completionRuleKey;

  assertTaskTypeInput({
    ...nextInput,
    domain: nextDomain,
    completionMode: nextCompletionMode,
    completionRuleKey: nextCompletionMode === "BUSINESS_RULE" ? nextRuleKey : null,
  });

  if (nextInput.code !== undefined) {
    const code = normalizeCode(nextInput.code);
    const duplicated = await getTaskTypeByCodeRepo(db, code);
    if (duplicated && duplicated.id !== id) throw new Error(`Mã task type ${code} đã tồn tại`);
    nextInput = { ...nextInput, code };
  }

  if (nextCompletionMode !== "BUSINESS_RULE") {
    nextInput = { ...nextInput, completionRuleKey: null };
  }

  return updateTaskTypeRepo(db, id, nextInput);
}
