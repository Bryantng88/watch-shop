import { Prisma, TaskStatus } from "@prisma/client";

import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  deleteProjectionRecords,
  upsertProjectionRecord,
} from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY = "coordination-workspace-summary";
export const COORDINATION_WORKSPACE_SUMMARY_PROJECTION_VERSION = 1;

const SOURCE_EVENTS = [
  "task.item.created",
  "task.item.moved",
  "task.item.activity.commented",
] as const;

const taskItemSelect = {
  id: true,
  taskId: true,
  title: true,
  note: true,
  userId: true,
  assignedToUserId: true,
  status: true,
  dueAt: true,
  updatedAt: true,
  sortOrder: true,
  createdAt: true,
  assignedToUser: {
    select: { name: true, email: true, avatarUrl: true },
  },
  User: {
    select: { name: true, email: true, avatarUrl: true },
  },
  executions: {
    orderBy: { createdAt: "asc" as const },
    take: 1,
    select: {
      createdByUser: {
        select: { name: true, email: true, avatarUrl: true },
      },
    },
  },
} as const;

export type CoordinationWorkspaceSourceRow = {
  id: string;
  title: string;
  note: string | null;
  userId: string | null;
  assignedToUserId: string | null;
  status: TaskStatus;
  dueAt: Date | null;
  updatedAt: Date;
  assignedToUser: { name: string | null; email: string; avatarUrl: string | null } | null;
  User: { name: string | null; email: string; avatarUrl: string | null } | null;
  executions: Array<{
    createdByUser: { name: string | null; email: string; avatarUrl: string | null } | null;
  }>;
};

type StoredRow = Omit<CoordinationWorkspaceSourceRow, "dueAt" | "updatedAt"> & {
  taskId: string;
  sortOrder: number;
  dueAt: string | null;
  updatedAt: string;
  createdAt: string;
};

function result(
  context: ProjectionBuildContext,
  scope: ProjectionScope,
  applied: number,
  reason?: string,
): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason,
  };
}

export async function buildCoordinationWorkspaceSummaryRow(db: DB, taskItemId: string) {
  const client = dbOrTx(db);
  const row = await client.taskItem.findUnique({
    where: { id: taskItemId },
    select: taskItemSelect,
  });

  if (!row || row.status === TaskStatus.CANCELLED) {
    await deleteProjectionRecords(db, {
      projectionKey: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY,
      rowKeys: [taskItemId],
    });
    return null;
  }

  const data: StoredRow = {
    ...row,
    dueAt: row.dueAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
  await upsertProjectionRecord(db, {
    projectionKey: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY,
    projectionVersion: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_VERSION,
    rowKey: row.id,
    workspaceId: row.taskId,
    entityType: "TASK_ITEM",
    entityId: row.id,
    status: String(row.status),
    searchText: [row.title, row.note, row.assignedToUser?.name, row.User?.name]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("vi"),
    sortAt: row.updatedAt,
    sourceUpdatedAt: row.updatedAt,
    dataJson: data,
  });
  return data;
}

export async function queryCoordinationWorkspaceSummary(
  db: DB,
  taskId: string,
): Promise<CoordinationWorkspaceSourceRow[]> {
  const client = dbOrTx(db);
  const loadRecords = () => client.$queryRaw<Array<{
    rowKey: string;
    sourceUpdatedAt: Date | null;
    dataJson: Prisma.JsonValue;
  }>>(
    Prisma.sql`
      SELECT "rowKey", "sourceUpdatedAt", "dataJson"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY}
        AND "workspaceId" = ${taskId}
        AND "projectionVersion" = ${COORDINATION_WORKSPACE_SUMMARY_PROJECTION_VERSION}
      LIMIT 500
    `,
  );
  let records = await loadRecords();
  const sourceRows = await client.taskItem.findMany({
    where: { taskId, status: { not: TaskStatus.CANCELLED } },
    select: { id: true, updatedAt: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: 500,
  });
  const sourceById = new Map(sourceRows.map((row) => [row.id, row.updatedAt]));
  const projectionById = new Map(records.map((record) => [record.rowKey, record]));
  const staleIds = sourceRows
    .filter((row) => {
      const projectedAt = projectionById.get(row.id)?.sourceUpdatedAt;
      return !projectedAt || projectedAt.getTime() < row.updatedAt.getTime();
    })
    .map((row) => row.id);
  const removedIds = records
    .filter((record) => !sourceById.has(record.rowKey))
    .map((record) => record.rowKey);

  if (removedIds.length) {
    await deleteProjectionRecords(db, {
      projectionKey: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY,
      rowKeys: removedIds,
    });
  }
  for (let index = 0; index < staleIds.length; index += 20) {
    await Promise.all(
      staleIds.slice(index, index + 20).map((id) =>
        buildCoordinationWorkspaceSummaryRow(db, id),
      ),
    );
  }
  if (staleIds.length || removedIds.length) records = await loadRecords();
  const stored = records
    .map((record) => record.dataJson as StoredRow)
    .sort((left, right) =>
      left.sortOrder - right.sortOrder ||
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );
  return stored.map((row) => {
      return {
        id: row.id,
        title: row.title,
        note: row.note,
        userId: row.userId,
        assignedToUserId: row.assignedToUserId,
        status: row.status,
        dueAt: row.dueAt ? new Date(row.dueAt) : null,
        updatedAt: new Date(row.updatedAt),
        assignedToUser: row.assignedToUser,
        User: row.User,
        executions: row.executions,
      };
    });
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  const eventLog = context.sourceEvent.eventLog &&
    typeof context.sourceEvent.eventLog === "object"
    ? context.sourceEvent.eventLog as Record<string, unknown>
    : {};
  const payload = eventLog.metadataJson &&
    typeof eventLog.metadataJson === "object" &&
    !Array.isArray(eventLog.metadataJson)
    ? eventLog.metadataJson as Record<string, unknown>
    : {};
  const payloadTaskItemId = String(
    payload.targetTaskItemId ?? payload.taskItemId ?? "",
  ).trim();
  const taskItemId = payloadTaskItemId || context.sourceEvent.targetId;
  const row = await buildCoordinationWorkspaceSummaryRow(db, taskItemId);
  return result(
    context,
    { targetType: "TASK_ITEM", targetId: taskItemId },
    row ? 1 : 0,
    row ? undefined : "TASK_ITEM_NOT_FOUND_OR_CANCELLED",
  );
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const targetId = String(context.scope.targetId ?? "").trim();
  if (!targetId) {
    await deleteProjectionRecords(db, {
      projectionKey: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY,
    });
  }
  const rows = await dbOrTx(db).taskItem.findMany({
    where: {
      ...(targetId ? { id: targetId } : {}),
      status: { not: TaskStatus.CANCELLED },
    },
    select: { id: true },
    orderBy: [{ taskId: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    take: context.scope.limit
      ? Math.max(1, Math.min(10_000, context.scope.limit))
      : undefined,
  });
  for (let index = 0; index < rows.length; index += 20) {
    await Promise.all(
      rows.slice(index, index + 20).map((row) =>
        buildCoordinationWorkspaceSummaryRow(db, row.id),
      ),
    );
  }
  return result(context, context.scope, rows.length, rows.length ? undefined : "NO_TASK_ITEMS");
}

export const coordinationWorkspaceSummaryProjectionBuilder: ProjectionBuilder = {
  key: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_KEY,
  version: COORDINATION_WORKSPACE_SUMMARY_PROJECTION_VERSION,
  description: "Task workspace source rows used by the coordination dashboard.",
  sourceEvents: [...SOURCE_EVENTS],
  targetTypes: ["TASK_ITEM"],
  buildFromEvent,
  rebuild,
};
