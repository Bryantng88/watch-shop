import {
  Prisma,
  TaskExecutionActionType,
  TaskExecutionTargetType,
} from "@prisma/client";

import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import type { CoordinationTechnicalIssueBoardItemDTO } from "@/domains/coordination/server/coordination-dashboard.types";
import { resolveProductDisplayImage } from "@/domains/shared/media/server/display-image";
import { dbOrTx, type DB } from "@/server/db/client";
import { operationBoardDoneCutoff } from "./operation-board-retention.policy";
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

export const TECHNICAL_ISSUE_BOARD_PROJECTION_KEY = "technical-issue-board";
export const TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION = 1;

const TECHNICAL_ISSUE_BOARD_EVENTS = [
  "technical_issue.created",
  "technical_issue.updated",
  "technical_issue.confirmed",
  "technical_issue.started",
  "technical_issue.completed",
  "technical_issue.canceled",
  "service_request.created",
  "service_request.status_changed",
  "task.item.activity.commented",
] as const;

export type TechnicalIssueBoardStage = CoordinationTechnicalIssueBoardItemDTO["stage"];
export type TechnicalIssueBoardProjection = CoordinationTechnicalIssueBoardItemDTO & {
  workspaceId: string;
  source: "DOMAIN_EVENT" | "BACKFILL";
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "-";
}

function noteLineValue(note: string | null | undefined, key: string) {
  const prefix = `${key}:`;
  const line = String(note ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));
  return line ? clean(line.slice(prefix.length)) || null : null;
}

function flowStageFromNote(note: string | null | undefined) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  return clean(snapshot?.flowStageKey ?? noteLineValue(note, "flowStageKey")).toUpperCase() || null;
}

export function technicalIssueBoardStage(input: {
  flowStageKey: string | null;
  executionStatus: unknown;
  isConfirmed: boolean;
}): TechnicalIssueBoardStage {
  const flowStage = clean(input.flowStageKey).toUpperCase();
  if (flowStage === "DONE") return "DONE";
  const status = clean(input.executionStatus).toUpperCase();
  if (status === "DONE" || status === "COMPLETED") return "DONE";
  if (status === "IN_PROGRESS") return "PROCESSING";
  if (flowStage === "PROCESSING" || input.isConfirmed) return "READY";
  return "INSPECT";
}

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function overdueCalendarDays(expected?: Date | null, completed?: Date | null) {
  if (!expected || !completed) return null;
  const expectedDate = new Date(expected);
  const completedDate = new Date(completed);
  expectedDate.setHours(0, 0, 0, 0);
  completedDate.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((completedDate.getTime() - expectedDate.getTime()) / 86_400_000));
}

function buildResult(
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

const replacementPartLabels: Record<string, string> = {
  MOVEMENT_COMPLETE: "Thay nguyên máy",
  MAINSPRING: "Thay cót",
  GEAR: "Thay bánh răng",
  BALANCE_WHEEL: "Thay vành tóc",
  BALANCE_STAFF: "Thay trụ tóc",
  HAIRSPRING: "Thay cả dây tóc",
};

export async function buildTechnicalIssueBoardRow(
  db: DB,
  issueId: string,
  source: "DOMAIN_EVENT" | "BACKFILL" = "DOMAIN_EVENT",
) {
  const client = dbOrTx(db);
  const issue = await client.technicalIssue.findUnique({
    where: { id: issueId },
    select: {
      id: true,
      serviceRequestId: true,
      executionStatus: true,
      isConfirmed: true,
      summary: true,
      note: true,
      area: true,
      actionMode: true,
      vendorId: true,
      vendorNameSnap: true,
      estimatedCost: true,
      expectedWorkingDays: true,
      expectedCompletionAt: true,
      completedAt: true,
      actualCost: true,
      technicalDetailCatalogId: true,
      technicalDetailCatalog: { select: { name: true } },
      priority: true,
      updatedAt: true,
      serviceRequest: {
        select: {
          refNo: true,
          skuSnapshot: true,
          primaryImageUrlSnapshot: true,
          product: {
            select: { title: true, sku: true, primaryImageUrl: true },
          },
        },
      },
    },
  });
  if (!issue) return null;

  const binding = await client.taskExecution.findFirst({
    where: {
      targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
      targetId: issue.id,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      taskId: true,
      taskItemId: true,
      createdAt: true,
      createdByUser: { select: { name: true, email: true, avatarUrl: true } },
      taskItem: { select: { note: true } },
    },
  });
  if (!binding) return null;

  const [srBinding, startedEvent, activities, createdEvent, latestIssueEvent] = await Promise.all([
    client.taskExecution.findFirst({
      where: {
        taskId: binding.taskId,
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        targetId: issue.serviceRequestId,
        actionType: { not: TaskExecutionActionType.CANCELLED },
        taskItemId: { not: null },
      },
      orderBy: { createdAt: "desc" },
      select: {
        taskItemId: true,
        createdByUser: { select: { name: true, email: true, avatarUrl: true } },
      },
    }),
    client.businessEventLog.findFirst({
      where: {
        eventKey: "technical_issue.started",
        targetType: "TECHNICAL_ISSUE",
        targetId: issue.id,
      },
      orderBy: { createdAt: "desc" },
      select: { metadataJson: true },
    }),
    client.taskItemActivity.findMany({
      where: { taskItemId: binding.taskItemId! },
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      select: {
        sourceType: true,
        occurredAt: true,
        metadataJson: true,
        actorUser: { select: { name: true, email: true, avatarUrl: true } },
        _count: { select: { replies: true } },
      },
    }),
    client.businessEventLog.findFirst({
      where: {
        eventKey: "service_request.created",
        targetType: "SERVICE_REQUEST",
        targetId: issue.serviceRequestId,
        actorUserId: { not: null },
      },
      orderBy: { createdAt: "asc" },
      select: { actorUserId: true },
    }),
    client.businessEventLog.findFirst({
      where: {
        targetType: "TECHNICAL_ISSUE",
        targetId: issue.id,
      },
      orderBy: { createdAt: "desc" },
      select: { actorUserId: true, createdAt: true },
    }),
  ]);
  const createdEventActor = createdEvent?.actorUserId
    ? await client.user.findUnique({
        where: { id: createdEvent.actorUserId },
        select: { name: true, email: true, avatarUrl: true },
      })
    : null;
  const latestIssueEventActor = latestIssueEvent?.actorUserId
    ? await client.user.findUnique({
        where: { id: latestIssueEvent.actorUserId },
        select: { name: true, email: true, avatarUrl: true },
      })
    : null;

  let commentCount = 0;
  let lastActivity: (typeof activities)[number] | null = null;
  for (const activity of activities) {
    const metadata = activity.metadataJson;
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) continue;
    const target = metadata as { targetType?: unknown; targetId?: unknown };
    if (clean(target.targetType) !== "TECHNICAL_ISSUE" || clean(target.targetId) !== issue.id) continue;
    commentCount += (String(activity.sourceType) === "DISCUSSION" ? 1 : 0) + activity._count.replies;
    if (!lastActivity && String(activity.sourceType) !== "DISCUSSION") lastActivity = activity;
  }

  const actor = latestIssueEvent
    ? latestIssueEventActor
    : (
        (lastActivity && userLabel(lastActivity.actorUser) !== "-" ? lastActivity.actorUser : null) ??
        (userLabel(binding.createdByUser) !== "-" ? binding.createdByUser : null) ??
        (userLabel(srBinding?.createdByUser) !== "-" ? srBinding?.createdByUser : null) ??
        createdEventActor ??
        null
      );
  const actorName = userLabel(actor);
  const startedMetadata = startedEvent?.metadataJson;
  const replacementPartCodes =
    startedMetadata && typeof startedMetadata === "object" && !Array.isArray(startedMetadata)
      ? (startedMetadata as { replacementPartCodes?: unknown }).replacementPartCodes
      : null;
  const replacementParts = Array.isArray(replacementPartCodes)
    ? replacementPartCodes.map((code) => replacementPartLabels[String(code)]).filter(Boolean)
    : [];
  const stage = technicalIssueBoardStage({
    flowStageKey: flowStageFromNote(binding.taskItem?.note),
    executionStatus: issue.executionStatus,
    isConfirmed: issue.isConfirmed,
  });
  const data: TechnicalIssueBoardProjection = {
    id: issue.id,
    serviceRequestId: issue.serviceRequestId,
    summary: issue.summary ?? issue.note ?? "Technical issue",
    note: issue.note,
    area: issue.area,
    actionMode: issue.actionMode ? String(issue.actionMode) : null,
    vendorId: issue.vendorId,
    vendorName: issue.vendorNameSnap,
    estimatedCost: nullableNumber(issue.estimatedCost),
    expectedWorkingDays: issue.expectedWorkingDays,
    expectedCompletionAt: issue.expectedCompletionAt?.toISOString() ?? null,
    completedAt: issue.completedAt?.toISOString() ?? null,
    overdueDays: overdueCalendarDays(issue.expectedCompletionAt, issue.completedAt),
    executionStatus: String(issue.executionStatus),
    isConfirmed: issue.isConfirmed,
    priority: issue.priority ?? "NORMAL",
    technicalDetailCatalogId: issue.technicalDetailCatalogId,
    processingDetails: [issue.technicalDetailCatalog?.name, ...replacementParts].filter(
      (value): value is string => Boolean(value),
    ),
    commentCount,
    mentionedMeCount: 0,
    unreadMentionCount: 0,
    stage,
    actualCost: nullableNumber(issue.actualCost),
    updatedAt:
      (latestIssueEvent?.createdAt ?? lastActivity?.occurredAt ?? issue.updatedAt).toISOString(),
    lastUpdatedBy: {
      label: actorName === "-" ? "Hệ thống" : actorName,
      avatarUrl: actor?.avatarUrl ?? null,
      isSystem: actorName === "-",
    },
    workspaceTaskItemId: binding.taskItemId,
    srCaseTaskItemId: srBinding?.taskItemId ?? null,
    serviceRequest: {
      refNo: issue.serviceRequest.refNo,
      productTitle: issue.serviceRequest.product?.title ?? null,
      sku: issue.serviceRequest.skuSnapshot ?? issue.serviceRequest.product?.sku ?? null,
      imageUrl: resolveProductDisplayImage(
        issue.serviceRequest.product,
        issue.serviceRequest.primaryImageUrlSnapshot,
      ),
    },
    workspaceId: binding.taskId,
    source,
  };

  await upsertProjectionRecord(db, {
    projectionKey: TECHNICAL_ISSUE_BOARD_PROJECTION_KEY,
    projectionVersion: TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION,
    rowKey: issue.id,
    workspaceId: binding.taskId,
    spaceId: issue.serviceRequestId,
    entityType: "TECHNICAL_ISSUE",
    entityId: issue.id,
    status: stage,
    searchText: [
      data.summary,
      data.note,
      data.serviceRequest.refNo,
      data.serviceRequest.productTitle,
      data.serviceRequest.sku,
      data.vendorName,
    ].filter(Boolean).join(" "),
    sortAt: lastActivity?.occurredAt ?? issue.updatedAt,
    sourceUpdatedAt: issue.updatedAt,
    dataJson: data,
  });
  return data;
}

async function issueIdsFromEvent(db: DB, event: BusinessEventDispatchContext) {
  const client = dbOrTx(db);
  const targetType = clean(event.targetType).toUpperCase();
  if (targetType === "TECHNICAL_ISSUE") return [event.targetId];
  if (targetType === "SERVICE_REQUEST") {
    const rows = await client.technicalIssue.findMany({
      where: { serviceRequestId: event.targetId },
      select: { id: true },
    });
    return rows.map((row) => row.id);
  }
  if (event.eventKey === "task.item.activity.commented") {
    const activity = await client.taskItemActivity.findFirst({
      where: {
        OR: [
          { id: event.targetId },
          { replies: { some: { id: event.targetId } } },
        ],
      },
      select: { metadataJson: true },
    });
    const metadata = activity?.metadataJson;
    if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
      const target = metadata as { targetType?: unknown; targetId?: unknown };
      if (clean(target.targetType) === "TECHNICAL_ISSUE" && clean(target.targetId)) {
        return [clean(target.targetId)];
      }
    }
  }
  return [];
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  const issueIds = await issueIdsFromEvent(db, context.sourceEvent);
  let applied = 0;
  for (const issueId of issueIds) {
    if (await buildTechnicalIssueBoardRow(db, issueId)) applied += 1;
  }
  return buildResult(
    context,
    { targetType: "TECHNICAL_ISSUE", targetId: issueIds[0] ?? context.sourceEvent.targetId },
    applied,
    applied ? undefined : "TECHNICAL_ISSUE_NOT_FOUND",
  );
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const targetId = clean(context.scope.targetId);
  if (!targetId) {
    await deleteProjectionRecords(db, {
      projectionKey: TECHNICAL_ISSUE_BOARD_PROJECTION_KEY,
    });
  }
  const rows = await dbOrTx(db).technicalIssue.findMany({
    where: targetId ? { id: targetId } : undefined,
    select: { id: true },
    orderBy: { updatedAt: "desc" },
    take: context.scope.limit ? Math.max(1, Math.min(5000, context.scope.limit)) : undefined,
  });
  let applied = 0;
  for (let index = 0; index < rows.length; index += 10) {
    const built = await Promise.all(
      rows.slice(index, index + 10).map((row) =>
        buildTechnicalIssueBoardRow(db, row.id, "BACKFILL"),
      ),
    );
    applied += built.filter(Boolean).length;
  }
  return buildResult(context, context.scope, applied, applied ? undefined : "NO_TECHNICAL_ISSUES");
}

export const technicalIssueBoardProjectionBuilder: ProjectionBuilder = {
  key: TECHNICAL_ISSUE_BOARD_PROJECTION_KEY,
  version: TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION,
  description:
    "Technical Issue operational board read model for stage counters, cards and pagination.",
  sourceEvents: [...TECHNICAL_ISSUE_BOARD_EVENTS],
  targetTypes: ["TECHNICAL_ISSUE", "SERVICE_REQUEST", "TASK_ITEM"],
  buildFromEvent,
  rebuild,
};

export async function listTechnicalIssueBoardProjection(
  db: DB,
  input: {
    workspaceId?: string | null;
    stage: TechnicalIssueBoardStage;
    page: number;
    pageSize: number;
    doneRetentionDays?: number | null;
  },
) {
  const client = dbOrTx(db);
  const offset = (input.page - 1) * input.pageSize;
  const doneCutoff = operationBoardDoneCutoff(input.doneRetentionDays);
  const [rows, totals] = await Promise.all([
    client.$queryRaw<Array<{ dataJson: unknown }>>(Prisma.sql`
      SELECT "dataJson"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY}
        AND "projectionVersion" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION}
        AND (
          "status" <> 'DONE'
          OR ${doneCutoff}::timestamptz IS NULL
          OR COALESCE("sortAt", "updatedAt") >= ${doneCutoff}
        )
        AND (
          ${input.workspaceId ?? null}::text IS NULL
          OR "workspaceId" = ${input.workspaceId ?? null}
        )
        AND "status" = ${input.stage}
      ORDER BY "sortAt" DESC NULLS LAST, "updatedAt" DESC
      LIMIT ${input.pageSize}
      OFFSET ${offset}
    `),
    client.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
      SELECT COUNT(*) AS "count"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY}
        AND "projectionVersion" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION}
        AND (
          "status" <> 'DONE'
          OR ${doneCutoff}::timestamptz IS NULL
          OR COALESCE("sortAt", "updatedAt") >= ${doneCutoff}
        )
        AND (
          ${input.workspaceId ?? null}::text IS NULL
          OR "workspaceId" = ${input.workspaceId ?? null}
        )
        AND "status" = ${input.stage}
    `),
  ]);
  return {
    rows: rows.map((row) => row.dataJson as TechnicalIssueBoardProjection),
    total: Number(totals[0]?.count ?? 0),
  };
}

export async function listTechnicalIssueBoardWorkspaceProjection(
  db: DB,
  input: {
    requestedStage?: TechnicalIssueBoardStage | null;
    page: number;
    pageSize: number;
    doneRetentionDays?: number | null;
  },
) {
  const client = dbOrTx(db);
  const offset = (input.page - 1) * input.pageSize;
  const doneCutoff = operationBoardDoneCutoff(input.doneRetentionDays);
  const rows = await client.$queryRaw<Array<{
    kind: "ROW" | "TOTAL";
    status: TechnicalIssueBoardStage;
    dataJson: unknown;
    total: bigint;
  }>>(Prisma.sql`
    WITH ranked AS (
      SELECT
        "status",
        "dataJson",
        ROW_NUMBER() OVER (
          PARTITION BY "status"
          ORDER BY "sortAt" DESC NULLS LAST, "updatedAt" DESC
        ) AS "rowNumber"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY}
        AND "projectionVersion" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION}
        AND (
          "status" <> 'DONE'
          OR ${doneCutoff}::timestamptz IS NULL
          OR COALESCE("sortAt", "updatedAt") >= ${doneCutoff}
        )
    ),
    totals AS (
      SELECT "status", COUNT(*) AS "total"
      FROM ranked
      GROUP BY "status"
    ),
    selected AS (
      SELECT "status", "dataJson"
      FROM ranked
      WHERE (
        ${input.requestedStage ?? null}::text IS NULL
        AND "rowNumber" <= ${input.pageSize}
      ) OR (
        "status" = ${input.requestedStage ?? null}
        AND "rowNumber" > ${offset}
        AND "rowNumber" <= ${offset + input.pageSize}
      )
    )
    SELECT
      'ROW'::text AS "kind",
      selected."status",
      selected."dataJson",
      0::bigint AS "total"
    FROM selected
    UNION ALL
    SELECT
      'TOTAL'::text AS "kind",
      totals."status",
      NULL::jsonb AS "dataJson",
      totals."total"
    FROM totals
  `);
  const totals = new Map<TechnicalIssueBoardStage, number>();
  const data: TechnicalIssueBoardProjection[] = [];
  for (const row of rows) {
    if (row.kind === "TOTAL") totals.set(row.status, Number(row.total));
    else data.push(row.dataJson as TechnicalIssueBoardProjection);
  }
  return { rows: data, totals };
}
