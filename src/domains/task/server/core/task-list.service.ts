import { authCanViewAllTasks } from "../task-auth";
import { getAuthUserId } from "@/server/auth/auth-user-id";
import type { DB } from "@/server/db/client";
import type { TaskListFilters } from "../task.types";
import {
  getTaskForWorkPanelRepo,
  listTaskRowsRepo,
} from "./task-list.repo";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

function assertUser(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("Khong xac dinh duoc user hien tai");
}

export async function getTaskListPageData(
  db: DB,
  input: { auth: unknown; filters: TaskListFilters },
) {
  const totalStartedAt = perfNow();
  const userId = getAuthUserId(input.auth);
  assertUser(userId);

  const canViewAll = authCanViewAllTasks(input.auth);

  const list = await perfStep("task-list-service", "listRows", () =>
    listTaskRowsRepo(db, { userId, canViewAll, filters: input.filters }),
  );
  perfLog("task-list-service", "total", totalStartedAt);

  return {
    ...list,
    counts: {},
    users: [],
    currentUserId: userId,
    canViewAll,
  };
}

export async function getTaskWorkPanelData(
  db: DB,
  input: { id: string; auth: unknown },
) {
  const userId = getAuthUserId(input.auth);
  assertUser(userId);

  const canViewAll = authCanViewAllTasks(input.auth);
  const task = await getTaskForWorkPanelRepo(db, {
    id: input.id,
    userId,
    canViewAll,
  });

  if (!task) return null;

  const rowAccess = String((task as { rowAccess?: string }).rowAccess || "OWNER");

  if (canViewAll || rowAccess === "OWNER" || rowAccess === "TASK_ITEM_ASSIGNEE") {
    return task;
  }

  throw new Error("Ban khong co quyen xem task nay");
}
