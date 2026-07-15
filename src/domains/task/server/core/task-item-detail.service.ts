import { TaskKind } from "@prisma/client";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import type { DB } from "@/server/db/client";
import { getTaskItemDetailPageRepo } from "./task-item-detail.repo";

const SHARED_TASK_KINDS = new Set<TaskKind>([
  TaskKind.OPERATION,
  TaskKind.BUSINESS,
  TaskKind.SERVICE,
]);

type AuthRecord = Record<string, unknown>;

type TaskItemAccessShape = {
  note?: string | null;
  userId?: string | null;
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
  const roles = authRecord.roles ?? user.roles ?? [];

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
    (Array.isArray(roles) &&
      roles.map((item) => text(item).toUpperCase()).includes("ADMIN")) ||
    (Array.isArray(permissions) &&
      (permissions.includes("TASK_VIEW_ALL") || permissions.includes("ADMIN")))
  );
}

function authRoles(auth: unknown) {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);
  const roles = authRecord.roles ?? user.roles ?? [];
  return Array.isArray(roles)
    ? roles.map((role) => text(role).trim().toUpperCase()).filter(Boolean)
    : [];
}

function shareGroupFromNote(note?: string | null) {
  const match = String(note ?? "").match(/shareGroupKey:\s*([a-z0-9-]+)/i);
  return match ? match[1].trim().toUpperCase() : null;
}

function shareGroupFromBlueprintSnapshot(note?: string | null) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const eventBindings =
    snapshot?.eventBindings ??
    snapshot?.workspaceDefinition?.eventBindings ??
    [];
  const scopeContext = Array.isArray(eventBindings)
    ? eventBindings.find((binding) => binding?.scopeContext)?.scopeContext
    : null;

  return scopeContext ? String(scopeContext).trim().toUpperCase() : null;
}

function workTypeKeyFromNote(note?: string | null) {
  const match = String(note ?? "").match(/workTypeKey:\s*([a-z0-9-]+)/i);
  return match ? match[1].trim() : null;
}

function sharedUserIdsFromNote(note?: string | null) {
  const text = String(note ?? "");
  const ids = text
    .split(/\r?\n/)
    .filter((line) =>
      /^(sharedUserIds|spaceSharedUserIds|coreFlowSharedUserIds:[a-z0-9-]+):\s*/i.test(
        line.trim(),
      ),
    )
    .flatMap((line) => line.split(":").slice(-1)[0].split(","))
    .map((id) => id.trim())
    .filter(Boolean);

  return Array.from(new Set(ids));
}

function defaultShareGroupForTaskKind(kind?: TaskKind | null) {
  if (kind === TaskKind.OPERATION) return "OPERATION";
  if (kind === TaskKind.SERVICE) return "TECHNICAL";
  if (kind === TaskKind.BUSINESS) return "SALES";
  return null;
}

function isSystemOwned(item: TaskItemAccessShape) {
  if (/ownerType:\s*SYSTEM/i.test(String(item.note ?? ""))) return true;
  return Boolean(workTypeKeyFromNote(item.note) && !item.userId);
}

function assertCanAccessTaskItemDetail(item: TaskItemAccessShape, auth: unknown) {
  if (authCanViewAllTasks(auth)) return;

  const userId = authUserId(auth);
  if (!userId) throw new Error("Khong xac dinh duoc user hien tai");

  if (item.userId === userId) return;
  if (sharedUserIdsFromNote(item.note).includes(userId)) return;
  if (item.assignedToUserId === userId) return;
  if (!item.task) throw new Error("Ban khong co quyen xem task item nay");
  if (item.task.createdByUserId === userId) return;
  if (item.task.assignedToUserId === userId) return;

  if (item.task.kind && SHARED_TASK_KINDS.has(item.task.kind) && isSystemOwned(item)) {
    const shareGroupKey =
      shareGroupFromNote(item.note) ??
      shareGroupFromBlueprintSnapshot(item.note) ??
      defaultShareGroupForTaskKind(item.task.kind);
    if (shareGroupKey && authRoles(auth).includes(shareGroupKey)) return;
  }

  throw new Error("Ban khong co quyen xem task item nay");
}

export function authorizeTaskItemDetail<T extends TaskItemAccessShape>(
  item: T,
  auth: unknown,
) {
  assertCanAccessTaskItemDetail(item, auth);
  return omitTaskAccessFields(item);
}

export async function getTaskItemDetailPageData(
  db: DB,
  id: string,
  auth: unknown,
) {
  const item = await getTaskItemDetailPageRepo(db, id);
  if (!item) return null;

  return authorizeTaskItemDetail(item, auth);
}
