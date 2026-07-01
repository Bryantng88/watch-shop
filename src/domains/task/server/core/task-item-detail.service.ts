import { TaskKind } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { getTaskItemDetailPageRepo } from "./task-item-detail.repo";

const SHARED_TASK_KINDS = new Set<TaskKind>([
  TaskKind.OPERATION,
  TaskKind.BUSINESS,
  TaskKind.SERVICE,
]);

type AuthRecord = Record<string, unknown>;

type TaskItemAccessShape = {
  assignedToUserId?: string | null;
  task?: {
    kind?: TaskKind | null;
    createdByUserId?: string | null;
    assignedToUserId?: string | null;
  } | null;
};

function asRecord(value: unknown): AuthRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as AuthRecord)
    : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function omitTaskAccessFields<T extends TaskItemAccessShape>(item: T) {
  if (!item.task) return item;

  const task = { ...item.task };
  delete task.createdByUserId;
  delete task.assignedToUserId;

  return {
    ...item,
    task,
  };
}

function authUserId(auth: unknown): string | null {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);

  return (
    text(user.id) ||
    text(authRecord.id) ||
    text(authRecord.userId) ||
    null
  );
}

function authCanViewAllTasks(auth: unknown): boolean {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);
  const role = asRecord(authRecord.role);
  const userRole = asRecord(user.role);

  const roleName = (
    text(user.role) ||
    text(authRecord.role) ||
    text(userRole.name) ||
    text(role.name) ||
    text(authRecord.roleName)
  ).toUpperCase();

  const permissions =
    authRecord.permissions ?? user.permissions ?? role.permissions ?? [];

  return (
    roleName === "ADMIN" ||
    (Array.isArray(permissions) && permissions.includes("TASK_VIEW_ALL"))
  );
}

function assertCanAccessTaskItemDetail(item: TaskItemAccessShape, auth: unknown) {
  if (authCanViewAllTasks(auth)) return;

  const userId = authUserId(auth);
  if (!userId) throw new Error("Khong xac dinh duoc user hien tai");

  if (item.assignedToUserId === userId) return;
  if (!item.task) throw new Error("Ban khong co quyen xem task item nay");
  if (item.task.kind && SHARED_TASK_KINDS.has(item.task.kind)) return;
  if (item.task.createdByUserId === userId) return;
  if (item.task.assignedToUserId === userId) return;

  throw new Error("Ban khong co quyen xem task item nay");
}

export async function getTaskItemDetailPageData(
  db: DB,
  id: string,
  auth: unknown,
) {
  const item = await getTaskItemDetailPageRepo(db, id);
  if (!item) return null;

  assertCanAccessTaskItemDetail(item, auth);

  return omitTaskAccessFields(item);
}
