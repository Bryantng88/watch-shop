import {
  ActivitySourceType,
  PaymentType,
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
} from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import {
  ensureCoordinationCycle,
  getWeekRange,
} from "./coordination-cycle.service";
import {
  listWorkTypes,
  normalizeWorkTypeKey,
} from "@/domains/task/server/work-type.service";
import {
  listWorkspaceInstantiationBlueprintOptions,
  type BlueprintSource,
} from "@/domains/blueprint/server";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import { workspaceFlowOrder } from "@/domains/task/shared/workspace-flow-policy";
import type { WorkspaceKind } from "@/domains/space-management/server/space-view.types";
import type {
  CoordinationDashboardDTO,
  CoordinationWorkTicketSummaryDTO,
  QueueSummaryDTO,
} from "./coordination-dashboard.types";
import type { CoordinationContext } from "./coordination-cycle.types";

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value?: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function parseDateInput(value?: string | null) {
  if (!value) return new Date();
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "-";
}

function ticketOwner(item: {
  note?: string | null;
  userId?: string | null;
  User?: { name?: string | null; email?: string | null; avatarUrl?: string | null } | null;
  assignedToUser?: { name?: string | null; email?: string | null; avatarUrl?: string | null } | null;
}, fallbackUser?: { name?: string | null; email?: string | null; avatarUrl?: string | null } | null) {
  if (isSystemTicket(item)) {
    return { label: "System", avatarUrl: null, isSystem: true };
  }

  const ownerLabel = userLabel(item.User);
  if (ownerLabel !== "-") {
    const fallbackAvatar =
      item.User?.email && item.User.email === fallbackUser?.email
        ? fallbackUser.avatarUrl
        : null;

    return {
      label: ownerLabel,
      avatarUrl: item.User?.avatarUrl ?? fallbackAvatar ?? null,
      isSystem: false,
    };
  }

  return {
    label: userLabel(item.assignedToUser) !== "-"
      ? userLabel(item.assignedToUser)
      : userLabel(fallbackUser),
    avatarUrl: item.assignedToUser?.avatarUrl ?? fallbackUser?.avatarUrl ?? null,
    isSystem: false,
  };
}

function ticketWorkTypeKey(note?: string | null) {
  const match = String(note ?? "").match(/workTypeKey:\s*([a-z0-9-]+)/i);
  return match ? normalizeWorkTypeKey(match[1]) : null;
}

function ticketBlueprintSource(note?: string | null) {
  const match = String(note ?? "").match(/blueprintSource:\s*([a-z0-9_-]+)/i);
  return match ? match[1].trim().toUpperCase() : null;
}

function blueprintIdentityFromNote(note?: string | null) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const blueprintKey =
    snapshot?.blueprintKey ??
    String(note ?? "").match(/blueprintKey:\s*([^\r\n]+)/i)?.[1]?.trim();
  const blueprintSource =
    snapshot?.blueprintSource ??
    String(note ?? "").match(/blueprintSource:\s*([^\r\n]+)/i)?.[1]?.trim();

  if (!blueprintKey) return null;

  return {
    key: blueprintKey,
    source: String(blueprintSource || "REGISTRY").toUpperCase(),
  };
}

function noteLineValue(note: string | null | undefined, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(note ?? "").match(new RegExp(`^${escaped}:\\s*([^\\r\\n]+)`, "im"))?.[1]?.trim() ?? null;
}

function workspaceKindValue(value: unknown): WorkspaceKind | null {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (
    normalized === "STANDALONE_WORKSPACE" ||
    normalized === "FLOW_STAGE_WORKSPACE" ||
    normalized === "CASE_WORKSPACE" ||
    normalized === "BENCH_WORKSPACE"
  ) {
    return normalized;
  }

  return null;
}

function numericValue(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function targetKey(input: { targetType: string; targetId: string }) {
  return `${normalizeStatus(input.targetType)}:${input.targetId}`;
}

function terminalStatesForTarget(
  terminalStatesByTargetType: Record<string, string[]> | undefined,
  targetType: string,
) {
  return new Set(
    (terminalStatesByTargetType?.[normalizeStatus(targetType)] ?? [])
      .map(normalizeStatus)
      .filter(Boolean),
  );
}

function statusListIsProcessing(
  statuses: unknown[],
  terminalStates: Set<string>,
  fallback = true,
) {
  const normalized = statuses.map(normalizeStatus).filter(Boolean);
  if (!normalized.length) return fallback;
  if (!terminalStates.size) return fallback;

  return !normalized.some((status) => terminalStates.has(status));
}

function bindingFinished(metadataJson: unknown) {
  const runtime = getQueueItemWorkflowState({ metadataJson });
  if (!runtime) return false;
  return runtime.currentState === "DONE" || runtime.currentState === "CANCELLED";
}

function serviceOperationWorkspaceRole(note?: string | null) {
  const role = noteLineValue(note, "serviceOperationWorkspaceRole")?.toUpperCase() ?? null;
  if (
    role === "SR_CASE" ||
    role === "INSPECT" ||
    role === "PROCESSING" ||
    role === "DONE"
  ) {
    return role;
  }

  return null;
}

function serviceOperationWorkspaceKind(role: string | null): WorkspaceKind | null {
  if (role === "SR_CASE") return "CASE_WORKSPACE";
  if (role === "INSPECT" || role === "PROCESSING" || role === "DONE") {
    return "FLOW_STAGE_WORKSPACE";
  }

  return null;
}

function flowStageKeyFromServiceOperationRole(role: string | null) {
  if (role === "INSPECT" || role === "PROCESSING" || role === "DONE") {
    return role.toLowerCase();
  }

  return null;
}

function workspaceRoleMetadataFromNote(note?: string | null) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const legacyServiceOperationRole = serviceOperationWorkspaceRole(note);

  return {
    workspaceKind: workspaceKindValue(
      snapshot?.workspaceKind ??
        noteLineValue(note, "workspaceKind") ??
        serviceOperationWorkspaceKind(legacyServiceOperationRole),
    ),
    operationWorkspaceRole:
      snapshot?.operationWorkspaceRole ??
      noteLineValue(note, "operationWorkspaceRole") ??
      legacyServiceOperationRole,
    coreFlowKey: snapshot?.coreFlowKey ?? noteLineValue(note, "coreFlowKey"),
    flowStageKey:
      snapshot?.flowStageKey ??
      noteLineValue(note, "flowStageKey") ??
      flowStageKeyFromServiceOperationRole(legacyServiceOperationRole),
    flowStageOrder: numericValue(
      snapshot?.flowStageOrder ?? noteLineValue(note, "flowStageOrder"),
    ),
  };
}

function blueprintUsageKey(input: { key: string; source?: string | null }) {
  return `${String(input.source || "REGISTRY").toUpperCase()}:${normalizeWorkTypeKey(input.key)}`;
}

function isAutoBindingReceiverNote(note?: string | null) {
  return /^blueprintAutoBindingReceiver:\s*true\s*$/im.test(String(note ?? ""));
}

function ticketShareGroupKey(note?: string | null) {
  const match = String(note ?? "").match(/shareGroupKey:\s*([a-z0-9-]+)/i);
  return match ? normalizeWorkTypeKey(match[1]) : null;
}

function sharedUserIdsFromNote(note?: string | null) {
  return String(note ?? "")
    .match(/^sharedUserIds:\s*(.+)$/im)?.[1]
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean) ?? [];
}

function isSystemTicket(item: {
  note?: string | null;
  userId?: string | null;
}) {
  if (/ownerType:\s*SYSTEM/i.test(String(item.note ?? ""))) return true;
  return Boolean(ticketWorkTypeKey(item.note) && !item.userId);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function authUserId(auth: unknown) {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);
  return text(user.id) || text(authRecord.id) || text(authRecord.userId) || null;
}

function authUserSummary(auth: unknown) {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);

  return {
    name: text(user.name) || text(authRecord.name) || null,
    email: text(user.email) || text(authRecord.email) || null,
    avatarUrl: text(user.avatarUrl) || text(authRecord.avatarUrl) || null,
  };
}

function authRoles(auth: unknown) {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);
  const roles = authRecord.roles ?? user.roles ?? [];
  return Array.isArray(roles)
    ? roles.map((role) => normalizeWorkTypeKey(role)).filter(Boolean)
    : [];
}

function authCanViewAll(auth: unknown) {
  const authRecord = asRecord(auth);
  const user = asRecord(authRecord.user);
  const permissions = authRecord.permissions ?? user.permissions ?? [];
  return (
    authRoles(auth).includes("admin") ||
    (Array.isArray(permissions) && permissions.includes("TASK_VIEW_ALL"))
  );
}

const SPACE_LABELS: Record<CoordinationContext, {
  label: string;
  spaceLabel: string;
  spacesLabel: string;
}> = {
  OPERATION: {
    label: "Vận hành",
    spaceLabel: "Vận hành",
    spacesLabel: "Vận hành Spaces",
  },
  SALES: {
    label: "Bán hàng",
    spaceLabel: "Bán hàng",
    spacesLabel: "Bán hàng Spaces",
  },
  TECHNICAL: {
    label: "Kỹ thuật",
    spaceLabel: "Kỹ thuật",
    spacesLabel: "Kỹ thuật Spaces",
  },
  MEDIA: {
    label: "Media",
    spaceLabel: "Media",
    spacesLabel: "Media Spaces",
  },
  PAYMENT: {
    label: "Thanh toán",
    spaceLabel: "Thanh toán",
    spacesLabel: "Thanh toán Spaces",
  },
  GENERAL: {
    label: "Tổng quát",
    spaceLabel: "Tổng quát",
    spacesLabel: "Tổng quát Spaces",
  },
};

function canViewTicket(
  item: {
    note?: string | null;
    userId?: string | null;
    assignedToUserId?: string | null;
  },
  auth: unknown,
) {
  if (authCanViewAll(auth)) return true;

  const userId = authUserId(auth);
  if (userId && (item.userId === userId || item.assignedToUserId === userId)) {
    return true;
  }
  if (userId && sharedUserIdsFromNote(item.note).includes(userId)) return true;

  if (!isSystemTicket(item)) return false;

  const shareGroupKey = ticketShareGroupKey(item.note) ?? "operation";

  const roles = authRoles(auth);
  return roles.includes(shareGroupKey);
}

function buildQueueSummary(input: {
  queueCount: number;
  feedbackCount: number;
  status: TaskStatus;
}): QueueSummaryDTO {
  if (input.status === TaskStatus.DONE) {
    return {
      ready: 0,
      review: 0,
      feedback: input.feedbackCount,
      done: input.queueCount,
    };
  }

  if (input.status === TaskStatus.IN_PROGRESS) {
    return {
      ready: 0,
      review: input.queueCount,
      feedback: input.feedbackCount,
      done: 0,
    };
  }

  return {
    ready: input.queueCount,
    review: 0,
    feedback: input.feedbackCount,
    done: 0,
  };
}

function buildWeekOptions(selectedDate: Date) {
  const options: CoordinationDashboardDTO["filters"]["weekOptions"] = [];

  for (let offset = -4; offset <= 4; offset += 1) {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + offset * 7);
    const week = getWeekRange(date);

    options.push({
      label: `Week ${week.weekNumber}/${week.year}`,
      value: week.periodKey,
      date: formatDateInput(week.startDate),
    });
  }

  return options;
}

async function loadLastActivityMap(db: DB, taskItemIds: string[]) {
  if (!taskItemIds.length) return new Map<string, { title: string; occurredAt: Date }>();

  const rows = await db.taskItemActivity.findMany({
    where: {
      taskItemId: { in: taskItemIds },
    },
    select: {
      taskItemId: true,
      title: true,
      occurredAt: true,
    },
    orderBy: [
      { occurredAt: "desc" },
      { id: "desc" },
    ],
  });

  const map = new Map<string, { title: string; occurredAt: Date }>();

  for (const row of rows) {
    if (!map.has(row.taskItemId)) {
      map.set(row.taskItemId, {
        title: row.title,
        occurredAt: row.occurredAt,
      });
    }
  }

  return map;
}

async function loadMediaQueueCountByTaskItem(input: {
  db: DB;
  taskId: string;
  taskItemIds: string[];
  terminalStatesByTargetType?: Record<string, string[]>;
}) {
  const counts = new Map<string, number>();
  if (!input.taskItemIds.length) return counts;

  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: input.taskItemIds },
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      taskItemId: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
    },
  });
  const watchIds = [...new Set(bindings.map((binding) => binding.targetId))];
  const terminalStates = terminalStatesForTarget(
    input.terminalStatesByTargetType,
    TaskExecutionTargetType.WATCH,
  );
  const watches = watchIds.length
    ? await input.db.watch.findMany({
        where: { id: { in: watchIds } },
        select: {
          id: true,
          saleStage: true,
          isContentDownloaded: true,
          isImageDownloaded: true,
        },
      })
    : [];
  const processingByTarget = new Map(
    watches.map((watch) => [
      targetKey({
        targetType: TaskExecutionTargetType.WATCH,
        targetId: watch.id,
      }),
      statusListIsProcessing(
        [
          watch.saleStage,
          watch.isContentDownloaded && watch.isImageDownloaded ? "POSTED" : null,
        ],
        terminalStates,
      ),
    ]),
  );

  for (const binding of bindings) {
    if (!binding.taskItemId || bindingFinished(binding.metadataJson)) continue;
    const processing =
      processingByTarget.get(
        targetKey({
          targetType: binding.targetType,
          targetId: binding.targetId,
        }),
      ) ?? true;
    if (!processing) continue;

    counts.set(binding.taskItemId, (counts.get(binding.taskItemId) ?? 0) + 1);
  }

  return counts;
}

async function loadTechnicalQueueCountByTaskItem(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; note: string | null }>;
  terminalStatesByTargetType?: Record<string, string[]>;
}) {
  const counts = new Map<string, number>();
  if (!input.taskItems.length) return counts;

  const metadataByTaskItem = new Map(
    input.taskItems.map((item) => [item.id, workspaceRoleMetadataFromNote(item.note)]),
  );
  const taskItemIds = input.taskItems.map((item) => item.id);
  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: taskItemIds },
      targetType: {
        in: [
          TaskExecutionTargetType.SERVICE_REQUEST,
          TaskExecutionTargetType.TECHNICAL_ISSUE,
        ],
      },
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      taskItemId: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
    },
  });
  const serviceRequestIdsByTaskItem = new Map<string, Set<string>>();
  const technicalIssueBindings = bindings.filter(
    (binding) => binding.targetType === TaskExecutionTargetType.TECHNICAL_ISSUE,
  );

  for (const item of input.taskItems) {
    const metadata = metadataByTaskItem.get(item.id);
    if (metadata?.workspaceKind !== "CASE_WORKSPACE") continue;

    const serviceRequestId = noteLineValue(item.note, "serviceRequestId");
    if (serviceRequestId) {
      serviceRequestIdsByTaskItem.set(item.id, new Set([serviceRequestId]));
    }
  }

  for (const binding of bindings) {
    if (
      !binding.taskItemId ||
      binding.targetType !== TaskExecutionTargetType.SERVICE_REQUEST
    ) {
      continue;
    }

    const metadata = metadataByTaskItem.get(binding.taskItemId);
    if (metadata?.workspaceKind !== "CASE_WORKSPACE") continue;

    const serviceRequestIds =
      serviceRequestIdsByTaskItem.get(binding.taskItemId) ?? new Set<string>();
    serviceRequestIds.add(binding.targetId);
    serviceRequestIdsByTaskItem.set(binding.taskItemId, serviceRequestIds);
  }

  const technicalIssueIds = [
    ...new Set(technicalIssueBindings.map((binding) => binding.targetId)),
  ];
  const serviceRequestIds = [
    ...new Set(
      [...serviceRequestIdsByTaskItem.values()].flatMap((ids) => [...ids]),
    ),
  ];
  const technicalIssueWhere: Array<
    { id: { in: string[] } } | { serviceRequestId: { in: string[] } }
  > = [];
  if (technicalIssueIds.length) technicalIssueWhere.push({ id: { in: technicalIssueIds } });
  if (serviceRequestIds.length) {
    technicalIssueWhere.push({ serviceRequestId: { in: serviceRequestIds } });
  }
  const technicalIssues = technicalIssueWhere.length
    ? await input.db.technicalIssue.findMany({
        where: { OR: technicalIssueWhere },
        select: {
          id: true,
          serviceRequestId: true,
          executionStatus: true,
        },
      })
    : [];
  const terminalTechnicalIssueStates = terminalStatesForTarget(
    input.terminalStatesByTargetType,
    TaskExecutionTargetType.TECHNICAL_ISSUE,
  );
  const technicalIssueById = new Map(technicalIssues.map((issue) => [issue.id, issue]));
  const activeTechnicalIssueIds = new Set(
    technicalIssues
      .filter((issue) =>
        statusListIsProcessing([issue.executionStatus], terminalTechnicalIssueStates),
      )
      .map((issue) => issue.id),
  );

  for (const binding of technicalIssueBindings) {
    if (!binding.taskItemId || bindingFinished(binding.metadataJson)) continue;

    const metadata = metadataByTaskItem.get(binding.taskItemId);
    if (metadata?.workspaceKind !== "FLOW_STAGE_WORKSPACE") continue;
    if (!activeTechnicalIssueIds.has(binding.targetId)) continue;

    counts.set(binding.taskItemId, (counts.get(binding.taskItemId) ?? 0) + 1);
  }

  const issueIdsForServiceRequests = technicalIssues
    .filter((issue) => serviceRequestIds.includes(issue.serviceRequestId))
    .map((issue) => issue.id);
  const paymentRows = issueIdsForServiceRequests.length
    ? await input.db.payment.findMany({
        where: {
          technical_issue_id: { in: issueIdsForServiceRequests },
          type: PaymentType.SERVICE,
        },
        select: {
          technical_issue_id: true,
        },
      })
    : [];
  const paymentCountByServiceRequest = new Map<string, number>();

  for (const payment of paymentRows) {
    if (!payment.technical_issue_id) continue;
    const issue = technicalIssueById.get(payment.technical_issue_id);
    if (!issue) continue;

    paymentCountByServiceRequest.set(
      issue.serviceRequestId,
      (paymentCountByServiceRequest.get(issue.serviceRequestId) ?? 0) + 1,
    );
  }

  const activeIssueCountByServiceRequest = new Map<string, number>();
  for (const issue of technicalIssues) {
    if (!serviceRequestIds.includes(issue.serviceRequestId)) continue;
    if (!activeTechnicalIssueIds.has(issue.id)) continue;

    activeIssueCountByServiceRequest.set(
      issue.serviceRequestId,
      (activeIssueCountByServiceRequest.get(issue.serviceRequestId) ?? 0) + 1,
    );
  }

  for (const [taskItemId, ids] of serviceRequestIdsByTaskItem.entries()) {
    const count = [...ids].reduce(
      (sum, serviceRequestId) =>
        sum +
        (activeIssueCountByServiceRequest.get(serviceRequestId) ?? 0) +
        (paymentCountByServiceRequest.get(serviceRequestId) ?? 0),
      0,
    );

    counts.set(taskItemId, count);
  }

  return counts;
}

export async function getCoordinationDashboard(input: {
  context: CoordinationContext;
  db?: DB;
  date?: string | null;
  auth?: unknown;
}): Promise<CoordinationDashboardDTO> {
  const db = input?.db ?? prisma;
  const selectedDate = parseDateInput(input?.date);
  const cycle = await ensureCoordinationCycle(db, {
    context: input.context,
    date: selectedDate,
  });

  const rawTaskItems = await db.taskItem.findMany({
    where: {
      taskId: cycle.task.id,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      id: true,
      title: true,
      note: true,
      userId: true,
      assignedToUserId: true,
      status: true,
      dueAt: true,
      updatedAt: true,
      assignedToUser: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      User: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });
  const activeWorkTypeKeys = new Set(
    listWorkTypes(input.context).map((workType) => normalizeWorkTypeKey(workType.key)),
  );
  const taskItems = rawTaskItems.filter((item) => {
    const workTypeKey = ticketWorkTypeKey(item.note);
    const blueprintSource = ticketBlueprintSource(item.note);
    if (
      workTypeKey &&
      blueprintSource !== "DRAFT" &&
      !activeWorkTypeKeys.has(workTypeKey)
    ) {
      return false;
    }
    return canViewTicket(item, input?.auth);
  });
  const taskItemIds = taskItems.map((item) => item.id);
  const viewConfig = getSpaceViewConfig(input.context);

  const [
    queueRows,
    mediaQueueCountByTaskItem,
    technicalQueueCountByTaskItem,
    feedbackRows,
    activityRows,
    lastActivityMap,
  ] = await Promise.all([
    db.taskExecution.groupBy({
      by: ["taskItemId"],
      where: {
        taskId: cycle.task.id,
        taskItemId: { in: taskItemIds },
      },
      _count: { _all: true },
    }),
    input.context === "MEDIA"
      ? loadMediaQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItemIds,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        })
      : Promise.resolve(new Map<string, number>()),
    input.context === "TECHNICAL"
      ? loadTechnicalQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        })
      : Promise.resolve(new Map<string, number>()),
    db.taskItemActivity.groupBy({
      by: ["taskItemId"],
      where: {
        taskItemId: { in: taskItemIds },
        sourceType: ActivitySourceType.BUSINESS_EVENT,
      },
      _count: { _all: true },
    }),
    db.taskItemActivity.groupBy({
      by: ["taskItemId"],
      where: {
        taskItemId: { in: taskItemIds },
      },
      _max: { occurredAt: true },
    }),
    loadLastActivityMap(db, taskItemIds),
  ]);

  const queueCountByTaskItem = new Map(
    input.context === "MEDIA"
      ? mediaQueueCountByTaskItem
      : input.context === "TECHNICAL"
        ? technicalQueueCountByTaskItem
        : queueRows
            .filter((row) => row.taskItemId)
            .map((row) => [row.taskItemId as string, row._count._all]),
  );
  const feedbackCountByTaskItem = new Map(
    feedbackRows.map((row) => [row.taskItemId, row._count._all]),
  );
  const lastActivityAtByTaskItem = new Map(
    activityRows.map((row) => [row.taskItemId, row._max.occurredAt ?? null]),
  );
  const now = new Date();
  const currentUser = authUserSummary(input?.auth);

  const workTickets: CoordinationWorkTicketSummaryDTO[] = taskItems.map((item) => {
    const queueCount = queueCountByTaskItem.get(item.id) ?? 0;
    const feedbackCount = feedbackCountByTaskItem.get(item.id) ?? 0;
    const overdue = Boolean(
      item.dueAt && item.dueAt < now && item.status !== TaskStatus.DONE,
    );
    const lastActivity = lastActivityMap.get(item.id);
    const lastActivityAt = lastActivity?.occurredAt ??
      lastActivityAtByTaskItem.get(item.id) ??
      null;
    const blueprintIdentity = blueprintIdentityFromNote(item.note);
    const workspaceRoleMetadata = workspaceRoleMetadataFromNote(item.note);

    return {
      id: item.id,
      title: item.title,
      ownerLabel: ticketOwner(item, currentUser).label,
      owner: ticketOwner(item, currentUser),
      queueSummary: buildQueueSummary({
        queueCount,
        feedbackCount,
        status: item.status,
      }),
      needAttention: feedbackCount > 0 || overdue,
      feedbackCount,
      lastActivity: lastActivity?.title ?? null,
      lastActivityAt: formatDateTime(lastActivityAt),
      updatedAt: formatDateTime(item.updatedAt),
      blueprint: blueprintIdentity
        ? {
            key: blueprintIdentity.key,
            source: blueprintIdentity.source as BlueprintSource,
            isAutoBindingReceiver: isAutoBindingReceiverNote(item.note),
            ...workspaceRoleMetadata,
          }
        : null,
    };
  }).sort((left, right) => {
    const leftOrder = workspaceFlowOrder({ key: left.blueprint?.key });
    const rightOrder = workspaceFlowOrder({ key: right.blueprint?.key });

    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.title.localeCompare(right.title);
  });

  const reportValues = {
    workTickets: workTickets.length,
    queue: workTickets.reduce(
      (sum, item) =>
        sum +
        item.queueSummary.ready +
        item.queueSummary.review +
        item.queueSummary.done,
      0,
    ),
    inProgress: taskItems.filter((item) => item.status === TaskStatus.IN_PROGRESS).length,
    feedback: workTickets.reduce((sum, item) => sum + item.feedbackCount, 0),
    done: taskItems.filter((item) => item.status === TaskStatus.DONE).length,
    overdue: taskItems.filter((item) =>
      Boolean(item.dueAt && item.dueAt < now && item.status !== TaskStatus.DONE),
    ).length,
  };
  const blueprintUsage = new Map<
    string,
    {
      total: number;
      active: number;
      receiverId: string | null;
      activeWorkspaces: Array<{
        id: string;
        title: string;
        isAutoBindingReceiver: boolean;
      }>;
    }
  >();

  for (const item of rawTaskItems) {
    if (item.status === TaskStatus.CANCELLED) continue;

    const identity = blueprintIdentityFromNote(item.note);
    if (!identity) continue;

    const key = blueprintUsageKey(identity);
    const current = blueprintUsage.get(key) ?? {
      total: 0,
      active: 0,
      receiverId: null,
      activeWorkspaces: [],
    };
    const isReceiver = isAutoBindingReceiverNote(item.note);

    current.total += 1;
    if (item.status !== TaskStatus.DONE) {
      current.active += 1;
      current.activeWorkspaces.push({
        id: item.id,
        title: item.title,
        isAutoBindingReceiver: isReceiver,
      });
      if (isReceiver) current.receiverId = item.id;
    }
    blueprintUsage.set(key, current);
  }

  return {
    context: input.context,
    contextLabel: SPACE_LABELS[input.context].label,
    spaceLabel: SPACE_LABELS[input.context].spaceLabel,
    spacesLabel: SPACE_LABELS[input.context].spacesLabel,
    title: cycle.task.title,
    week: {
      label: cycle.week.weekLabel,
      periodKey: cycle.week.periodKey,
      startDate: formatDateInput(cycle.week.startDate),
      endDate: formatDateInput(cycle.week.endDate),
      weekNumber: cycle.week.weekNumber,
      year: cycle.week.year,
    },
    cycle: {
      id: cycle.task.id,
      title: cycle.task.title,
      created: cycle.created,
    },
    viewConfig,
    filters: {
      selectedDate: formatDateInput(cycle.week.startDate),
      weekOptions: buildWeekOptions(selectedDate),
    },
    report: [
      { key: "workspaces", label: "Workspaces", value: reportValues.workTickets },
      { key: "items", label: "Items", value: reportValues.queue },
      { key: "inProgress", label: "In Progress", value: reportValues.inProgress },
      { key: "feedback", label: "Feedback", value: reportValues.feedback },
      { key: "done", label: "Done", value: reportValues.done },
      { key: "overdue", label: "Overdue", value: reportValues.overdue },
    ],
    blueprints: (await listWorkspaceInstantiationBlueprintOptions(input.context)).map((blueprint) => {
      const usage = blueprintUsage.get(
        blueprintUsageKey({ key: blueprint.key, source: blueprint.source }),
      ) ?? {
        total: 0,
        active: 0,
        receiverId: null,
        activeWorkspaces: [],
      };

      return {
        selectionKey: blueprint.selectionKey,
        key: blueprint.key,
        name: blueprint.name,
        description: blueprint.description,
        workflowKey: blueprint.workflowKey,
        businessContext: blueprint.businessContext,
        source: blueprint.source,
        status: blueprint.status,
        workspaceDefinition: blueprint.workspaceDefinition,
        operation: blueprint.operation,
        operationValidation: blueprint.operationValidation,
        snapshotNote: blueprint.snapshotNote,
        usage,
      };
    }),
    workTickets,
  };
}

export async function getOperationCoordinationDashboard(input?: {
  db?: DB;
  date?: string | null;
  auth?: unknown;
}): Promise<CoordinationDashboardDTO> {
  return getCoordinationDashboard({
    ...input,
    context: "OPERATION",
  });
}
