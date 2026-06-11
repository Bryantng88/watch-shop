import { WorkCaseStatus } from "@prisma/client";
import { getActiveTaskTypeOptions } from "@/domains/task/server/task-type.service";
import type { DB } from "@/server/db/client";
import {
  countWorkCaseViewsRepo,
  createWorkCaseCategoryRepo,
  createWorkCaseRepo,
  getWorkCaseByIdRepo,
  listAssignableUsersRepo,
  listWorkCaseCategoriesRepo,
  listWorkCasesRepo,
  updateWorkCaseCategoryRepo,
  updateWorkCaseRepo,
} from "./work-case.repo";
import type {
  CreateWorkCaseCategoryInput,
  CreateWorkCaseInput,
  UpdateWorkCaseCategoryInput,
  UpdateWorkCaseInput,
  WorkCaseListFilters,
} from "./work-case.types";

export function getAuthUserId(auth: any): string | null {
  return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export function authCanManageWorkCases(auth: any): boolean {
  const roleName = String(auth?.user?.role?.name ?? auth?.role?.name ?? auth?.roleName ?? "").toUpperCase();
  const permissions = auth?.permissions ?? auth?.user?.permissions ?? auth?.role?.permissions ?? [];
  return roleName === "ADMIN" || (Array.isArray(permissions) && (
    permissions.includes("WORK_CASE_MANAGE") ||
    permissions.includes("WORK_CASE_VIEW_ALL") ||
    permissions.includes("TASK_VIEW_ALL")
  ));
}

function assertUser(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("Không xác định được user hiện tại");
}

async function assertCanAccessWorkCase(db: DB, id: string, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const item = await getWorkCaseByIdRepo(db, id);
  if (!item) throw new Error("Không tìm thấy phiếu xử lý");

  if (authCanManageWorkCases(auth)) return item;

  if (item.raisedByUserId !== userId && item.assignedToUserId !== userId) {
    throw new Error("Bạn không có quyền xem phiếu xử lý này");
  }

  return item;
}

export async function getWorkCaseListPageData(db: DB, input: { auth: any; filters: WorkCaseListFilters }) {
  const userId = getAuthUserId(input.auth);
  assertUser(userId);

  const canViewAll = authCanManageWorkCases(input.auth);
  const [list, counts, users, categories] = await Promise.all([
    listWorkCasesRepo(db, { userId, canViewAll, filters: input.filters }),
    countWorkCaseViewsRepo(db, { userId, canViewAll }),
    listAssignableUsersRepo(db),
    listWorkCaseCategoriesRepo(db, true),
  ]);

  return { ...list, counts, users, categories, currentUserId: userId, canManage: canViewAll };
}

export async function getWorkCaseDetail(db: DB, id: string, auth: any) {
  return assertCanAccessWorkCase(db, id, auth);
}

export async function createWorkCase(db: DB, input: CreateWorkCaseInput, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  if (!input.title?.trim()) throw new Error("Vui lòng nhập tiêu đề phiếu xử lý");
  if (!input.watchId?.trim()) throw new Error("Phiếu xử lý phải gắn với watch");

  return createWorkCaseRepo(db, {
    ...input,
    raisedByUserId: userId,
  });
}

export async function updateWorkCase(db: DB, id: string, input: UpdateWorkCaseInput, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const current = await assertCanAccessWorkCase(db, id, auth);
  const canManage = authCanManageWorkCases(auth);

  if (!canManage) {
    throw new Error("Bạn chỉ có quyền xem phiếu xử lý, không thể chỉnh sửa.");
  }

  if (input.title !== undefined && !input.title.trim()) throw new Error("Vui lòng nhập tiêu đề phiếu xử lý");

  const next = await updateWorkCaseRepo(db, current.id, { ...input, actorUserId: userId });

  // If manager starts triage without explicitly setting IN_PROGRESS later, keep lifecycle simple.
  if (input.status === WorkCaseStatus.TRIAGED && current.status === WorkCaseStatus.NEW) {
    return next;
  }

  return next;
}

export async function getWorkCaseDetailPageData(db: DB, id: string, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const [item, users, categories, taskTypes] = await Promise.all([
    getWorkCaseDetail(db, id, auth),
    listAssignableUsersRepo(db),
    listWorkCaseCategoriesRepo(db, true),
    getActiveTaskTypeOptions(db),
  ]);

  return {
    item,
    users,
    categories,
    taskTypes,

    currentUserId: userId,
    canManage: authCanManageWorkCases(auth),
  };
}

export async function getWorkCaseSettingsPageData(db: DB) {
  return { categories: await listWorkCaseCategoriesRepo(db, false) };
}

export async function createWorkCaseCategory(db: DB, input: CreateWorkCaseCategoryInput) {
  if (!input.code?.trim()) throw new Error("Vui lòng nhập code");
  if (!input.name?.trim()) throw new Error("Vui lòng nhập tên nhóm phiếu xử lý");
  return createWorkCaseCategoryRepo(db, input);
}

export async function updateWorkCaseCategory(db: DB, id: string, input: UpdateWorkCaseCategoryInput) {
  return updateWorkCaseCategoryRepo(db, id, input);
}
