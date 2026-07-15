import {
  ActivitySourceType,
  PaymentDirection,
  PaymentStatus,
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
  CoordinationTechnicalIssueBoardItemDTO,
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

function uniqueShareIds(userIds: Array<string | null | undefined>) {
  return Array.from(
    new Set(userIds.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );
}

function shareUserIdsFromNoteLine(note: string | null | undefined, key: string) {
  return uniqueShareIds((noteLineValue(note, key) ?? "").split(","));
}

function mediaUrl(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }

  return `/api/media/sign?key=${encodeURIComponent(raw)}`;
}

function imageUrlFromProduct(product?: {
  primaryImageUrl?: string | null;
  storefrontImageKey?: string | null;
  productImage?: Array<{ fileKey?: string | null }> | null;
} | null) {
  const key =
    product?.productImage?.[0]?.fileKey ??
    product?.primaryImageUrl ??
    product?.storefrontImageKey ??
    null;

  return mediaUrl(key);
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

function nullableNumber(value: unknown) {
  if (value == null) return null;
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

type MediaFlowStage = "photography" | "media-processing" | "publish";

function mediaStageFromWorkTypeKey(value?: string | null) {
  const normalized = normalizeWorkTypeKey(value ?? "");
  if (normalized === "photography") return "photography";
  if (normalized === "media processing") return "media-processing";
  if (normalized === "publish") return "publish";
  return null;
}

function mediaStageByTaskItem(taskItems: Array<{ id: string; note: string | null }>) {
  return new Map(
    taskItems
      .map((item) => [
        item.id,
        mediaStageFromWorkTypeKey(ticketWorkTypeKey(item.note)),
      ] as const)
      .filter((entry): entry is [string, MediaFlowStage] => Boolean(entry[1])),
  );
}

function mediaWorkflowKeyForStage(stage: MediaFlowStage) {
  if (stage === "photography") return "watch-photography";
  if (stage === "media-processing") return "watch-media-processing";
  return "watch-publish";
}

function mediaBindingMatchesStage(metadataJson: unknown, stage: MediaFlowStage) {
  const runtime = getQueueItemWorkflowState({ metadataJson });
  const metadata = asRecord(metadataJson);
  const workflowKey = normalizeWorkTypeKey(
    runtime?.workflowKey ?? metadata.workflowKey,
  );

  if (!workflowKey) return true;
  return workflowKey === normalizeWorkTypeKey(mediaWorkflowKeyForStage(stage));
}

function hasFeedbackSignal(metadataJson: unknown) {
  if (!metadataJson || typeof metadataJson !== "object" || Array.isArray(metadataJson)) {
    return false;
  }

  const metadata = metadataJson as Record<string, unknown>;
  const eventKey = normalizeStatus(metadata.eventKey).toLowerCase();
  const feedback = metadata.feedback;

  return (
    eventKey.includes("rejected") ||
    eventKey.includes("feedback") ||
    Boolean(String(metadata.feedbackId ?? "").trim()) ||
    Boolean(String(metadata.feedbackMessage ?? "").trim()) ||
    Boolean(feedback && typeof feedback === "object" && !Array.isArray(feedback))
  );
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

function workspaceRoleFromNote(note?: string | null) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const roleKey =
    snapshot?.operationWorkspaceRole ?? noteLineValue(note, "operationWorkspaceRole");

  return (
    snapshot?.workspaceRole ??
    snapshot?.operation?.workspaceRoles.find((role) => role.key === roleKey) ??
    null
  );
}

function canShowWorkspaceIdentityPreview(note?: string | null) {
  const metadata = workspaceRoleMetadataFromNote(note);
  const workspaceRole = workspaceRoleFromNote(note);

  if (metadata.workspaceKind === "CASE_WORKSPACE") {
    return Boolean(
      normalizeStatus(
        workspaceRole?.identityTargetType ?? noteLineValue(note, "identityTargetType"),
      ),
    );
  }

  if (metadata.workspaceKind !== "STANDALONE_WORKSPACE") return false;

  const itemTargetTypes = workspaceRole?.itemTargetTypes ?? [];
  return itemTargetTypes.some((targetType) => Boolean(normalizeStatus(targetType)));
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
  const ids = String(note ?? "")
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

function emptyQueueSummary(): QueueSummaryDTO {
  return {
    ready: 0,
    review: 0,
    feedback: 0,
    done: 0,
  };
}

type ServiceRequestPaymentSummary = NonNullable<
  CoordinationWorkTicketSummaryDTO["paymentSummary"]
>;

type TechnicalServiceRequestRollup = {
  queueSummary: QueueSummaryDTO;
  paymentSummary: ServiceRequestPaymentSummary;
};

function mediaFlowSummaryBucket(metadataJson: unknown): keyof QueueSummaryDTO {
  const runtime = getQueueItemWorkflowState({ metadataJson });
  const state = normalizeStatus(runtime?.currentState);

  if (state === "DONE" || state === "CANCELLED") return "done";
  if (
    state.includes("RETURN") ||
    state.includes("FEEDBACK") ||
    state.includes("REJECT") ||
    state.includes("RECALL")
  ) {
    return "feedback";
  }
  if (state.includes("REVIEW")) return "review";

  return "ready";
}

async function loadFeedbackCountByTaskItem(db: DB, taskItemIds: string[]) {
  const counts = new Map<string, number>();
  if (!taskItemIds.length) return counts;

  const rows = await db.taskItemActivity.findMany({
    where: {
      taskItemId: { in: taskItemIds },
      sourceType: ActivitySourceType.BUSINESS_EVENT,
    },
    select: {
      taskItemId: true,
      metadataJson: true,
    },
  });

  for (const row of rows) {
    if (!hasFeedbackSignal(row.metadataJson)) continue;
    counts.set(row.taskItemId, (counts.get(row.taskItemId) ?? 0) + 1);
  }

  return counts;
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

async function loadMediaQueueSummaryByTaskItem(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; note: string | null }>;
  terminalStatesByTargetType?: Record<string, string[]>;
}) {
  const summaries = new Map<string, QueueSummaryDTO>();
  if (!input.taskItems.length) return summaries;

  const stageByTaskItem = mediaStageByTaskItem(input.taskItems);
  if (!stageByTaskItem.size) return summaries;

  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: [...stageByTaskItem.keys()] },
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      id: true,
      taskItemId: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
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

  const currentBindingByTarget = new Map<
    string,
    (typeof bindings)[number]
  >();

  for (const binding of bindings) {
    if (!binding.taskItemId) continue;
    const stage = stageByTaskItem.get(binding.taskItemId);
    if (!stage) continue;
    if (!mediaBindingMatchesStage(binding.metadataJson, stage)) continue;
    if (bindingFinished(binding.metadataJson) && stage !== "publish") continue;
    const processing =
      processingByTarget.get(
        targetKey({
          targetType: binding.targetType,
          targetId: binding.targetId,
        }),
      ) ?? true;
    if (!processing && stage !== "publish") continue;

    const key = targetKey({
      targetType: binding.targetType,
      targetId: binding.targetId,
    });
    const current = currentBindingByTarget.get(key);
    if (!current || current.createdAt < binding.createdAt) {
      currentBindingByTarget.set(key, binding);
    }
  }

  for (const binding of currentBindingByTarget.values()) {
    if (!binding.taskItemId) continue;
    const summary = summaries.get(binding.taskItemId) ?? emptyQueueSummary();
    const bucket = mediaFlowSummaryBucket(binding.metadataJson);
    summary[bucket] += 1;
    summaries.set(binding.taskItemId, summary);
  }

  return summaries;
}

async function cleanupMediaFlowStageBindings(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; note: string | null }>;
}) {
  const stageByTaskItem = mediaStageByTaskItem(input.taskItems);
  if (!stageByTaskItem.size) return;

  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: [...stageByTaskItem.keys()] },
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      id: true,
      taskItemId: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const bindingsByWatch = new Map<string, typeof bindings>();

  for (const binding of bindings) {
    if (!binding.taskItemId) continue;
    const stage = stageByTaskItem.get(binding.taskItemId);
    if (!stage) continue;

    const rows = bindingsByWatch.get(binding.targetId) ?? [];
    rows.push(binding);
    bindingsByWatch.set(binding.targetId, rows);
  }

  const staleBindingIds: string[] = [];
  for (const rows of bindingsByWatch.values()) {
    staleBindingIds.push(
      ...rows
        .filter((row) => {
          if (!row.taskItemId) return false;
          const stage = stageByTaskItem.get(row.taskItemId);
          return Boolean(stage && !mediaBindingMatchesStage(row.metadataJson, stage));
        })
        .map((row) => row.id),
    );

    const matchedRows = rows.filter((row) => {
      if (!row.taskItemId) return false;
      const stage = stageByTaskItem.get(row.taskItemId);
      return Boolean(stage && mediaBindingMatchesStage(row.metadataJson, stage));
    });
    if (matchedRows.length <= 1) continue;

    const byStage = new Map<MediaFlowStage, (typeof rows)[number]>();
    for (const row of matchedRows) {
      if (!row.taskItemId) continue;
      const stage = stageByTaskItem.get(row.taskItemId);
      if (!stage) continue;

      const current = byStage.get(stage);
      if (current && current.createdAt >= row.createdAt) continue;
      byStage.set(stage, row);
    }

    const publish = byStage.get("publish");
    const media = byStage.get("media-processing");
    const photography = byStage.get("photography");
    const publishState = publish
      ? normalizeStatus(getQueueItemWorkflowState(publish)?.currentState)
      : null;
    const mediaState = media
      ? normalizeStatus(getQueueItemWorkflowState(media)?.currentState)
      : null;
    const photographyState = photography
      ? normalizeStatus(getQueueItemWorkflowState(photography)?.currentState)
      : null;

    const preferredKeep =
      publish && publishState !== "RECALLED"
        ? publish
        : publish && publishState === "RECALLED" && media
          ? media
          : media && mediaState === "DONE" && publish
            ? publish
            : media && mediaState === "RETURNED" && photography
              ? photography
              : media && mediaState !== "DONE" && mediaState !== "RETURNED"
                ? media
                : photography && photographyState === "DONE" && media
                  ? media
                  : photography ?? media ?? publish ?? rows[0];
    const keepStage = preferredKeep.taskItemId
      ? stageByTaskItem.get(preferredKeep.taskItemId)
      : null;
    const keep =
      keepStage
        ? matchedRows
            .filter((row) => row.taskItemId && stageByTaskItem.get(row.taskItemId) === keepStage)
            .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0] ??
          preferredKeep
        : preferredKeep;

    staleBindingIds.push(...matchedRows.filter((row) => row.id !== keep.id).map((row) => row.id));
  }

  if (!staleBindingIds.length) return;

  await input.db.taskExecution.updateMany({
    where: { id: { in: [...new Set(staleBindingIds)] } },
    data: { taskItemId: null },
  });
}

async function restoreMediaFinalStageDoneBindings(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; note: string | null }>;
}) {
  const stageByTaskItem = mediaStageByTaskItem(input.taskItems);
  const publishTaskItemId = [...stageByTaskItem.entries()].find(
    ([, stage]) => stage === "publish",
  )?.[0];
  if (!publishTaskItemId) return;

  const linkedBindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: [...stageByTaskItem.keys()] },
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      targetId: true,
    },
  });
  const linkedTargetIds = new Set(linkedBindings.map((binding) => binding.targetId));

  const orphanDoneBindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: null,
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      id: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const restoreIdsByTarget = new Map<string, string>();

  for (const binding of orphanDoneBindings) {
    if (linkedTargetIds.has(binding.targetId) || restoreIdsByTarget.has(binding.targetId)) {
      continue;
    }

    const runtime = getQueueItemWorkflowState(binding);
    if (runtime?.workflowKey !== "watch-publish" || runtime.currentState !== "DONE") {
      continue;
    }

    restoreIdsByTarget.set(binding.targetId, binding.id);
  }

  const restoreIds = [...restoreIdsByTarget.values()];
  if (!restoreIds.length) return;

  await input.db.taskExecution.updateMany({
    where: { id: { in: restoreIds } },
    data: { taskItemId: publishTaskItemId },
  });
}

async function loadPaymentQueueCountByTaskItem(input: {
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
      targetType: TaskExecutionTargetType.PAYMENT,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      id: true,
      taskItemId: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
    },
  });
  const paymentIds = [...new Set(bindings.map((binding) => binding.targetId))];
  const terminalStates = terminalStatesForTarget(
    input.terminalStatesByTargetType,
    TaskExecutionTargetType.PAYMENT,
  );
  const payments = paymentIds.length
    ? await input.db.payment.findMany({
        where: { id: { in: paymentIds } },
        select: {
          id: true,
          status: true,
        },
      })
    : [];
  const processingByTarget = new Map(
    payments.map((payment) => [
      targetKey({
        targetType: TaskExecutionTargetType.PAYMENT,
        targetId: payment.id,
      }),
      statusListIsProcessing([payment.status], terminalStates),
    ]),
  );
  const currentBindingByTarget = new Map<
    string,
    (typeof bindings)[number]
  >();

  for (const binding of bindings) {
    if (!binding.taskItemId || bindingFinished(binding.metadataJson)) continue;
    const key = targetKey({
      targetType: binding.targetType,
      targetId: binding.targetId,
    });
    const processing = processingByTarget.get(key) ?? true;
    if (!processing) continue;

    const current = currentBindingByTarget.get(key);
    if (!current || current.createdAt < binding.createdAt) {
      currentBindingByTarget.set(key, binding);
    }
  }

  for (const binding of currentBindingByTarget.values()) {
    if (!binding.taskItemId) continue;
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

function technicalIssueSummaryBucket(status: unknown): keyof QueueSummaryDTO | null {
  const key = normalizeStatus(status);
  if (key === "CANCELED" || key === "CANCELLED") return null;
  if (key === "DONE" || key === "COMPLETED") return "done";
  if (key === "IN_PROGRESS") return "review";
  return "ready";
}

function serviceRequestPaymentStatus(input: {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paymentCount: number;
}): ServiceRequestPaymentSummary["status"] {
  if (input.paymentCount === 0 || input.totalAmount <= 0) return "NONE";
  if (input.unpaidAmount <= 0 && input.paidAmount >= input.totalAmount) return "PAID";
  if (input.paidAmount > 0) return "PARTIAL";
  return "UNPAID";
}

function technicalIssueBoardStage(input: {
  flowStageKey: string | null;
  executionStatus: unknown;
  isConfirmed: boolean;
}): CoordinationTechnicalIssueBoardItemDTO["stage"] {
  const flowStage = normalizeStatus(input.flowStageKey);
  if (flowStage === "DONE") return "DONE";

  const status = normalizeStatus(input.executionStatus);
  if (status === "DONE" || status === "COMPLETED") return "DONE";
  if (status === "IN_PROGRESS") return "PROCESSING";
  if (flowStage === "PROCESSING" || input.isConfirmed) return "READY";
  if (flowStage === "INSPECT") return "INSPECT";
  return "INSPECT";
}

async function loadTechnicalIssueBoard(input: {
  db: DB;
  taskId: string;
}) {
  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: {
      targetId: true,
      taskItemId: true,
      createdAt: true,
      taskItem: {
        select: {
          id: true,
          note: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const bindingByIssueId = new Map<
    string,
    {
      taskItemId: string | null;
      flowStageKey: string | null;
      createdAt: Date;
    }
  >();
  for (const binding of bindings) {
    if (bindingByIssueId.has(binding.targetId)) continue;
    const metadata = workspaceRoleMetadataFromNote(binding.taskItem?.note ?? null);
    bindingByIssueId.set(binding.targetId, {
      taskItemId: binding.taskItemId ?? null,
      flowStageKey: metadata.flowStageKey,
      createdAt: binding.createdAt,
    });
  }

  const issueIds = [...bindingByIssueId.keys()];
  const [vendorOptions, technicalDetailCatalogOptions] = await Promise.all([
    input.db.vendor.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    input.db.technicalDetailCatalog.findMany({
      where: { isActive: true },
      select: { id: true, area: true, code: true, name: true },
      orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!issueIds.length) return { items: [], vendorOptions, technicalDetailCatalogOptions };

  const issues = await input.db.technicalIssue.findMany({
    where: { id: { in: issueIds } },
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
      actualCost: true,
      technicalDetailCatalogId: true,
      updatedAt: true,
      serviceRequest: {
        select: {
          refNo: true,
          skuSnapshot: true,
          primaryImageUrlSnapshot: true,
          product: {
            select: {
              title: true,
              sku: true,
              primaryImageUrl: true,
            },
          },
        },
      },
    },
  });

  const items = issues
    .map((issue): CoordinationTechnicalIssueBoardItemDTO => {
      const binding = bindingByIssueId.get(issue.id);
      return {
        id: issue.id,
        serviceRequestId: issue.serviceRequestId,
        summary: issue.summary ?? issue.note ?? "Technical issue",
        area: issue.area ?? null,
        actionMode: issue.actionMode ?? null,
        vendorId: issue.vendorId ?? null,
        vendorName: issue.vendorNameSnap ?? null,
        estimatedCost: nullableNumber(issue.estimatedCost),
        executionStatus: String(issue.executionStatus ?? "OPEN"),
        isConfirmed: Boolean(issue.isConfirmed),
        technicalDetailCatalogId: issue.technicalDetailCatalogId ?? null,
        stage: technicalIssueBoardStage({
          flowStageKey: binding?.flowStageKey ?? null,
          executionStatus: issue.executionStatus,
          isConfirmed: Boolean(issue.isConfirmed),
        }),
        actualCost: nullableNumber(issue.actualCost),
        updatedAt: formatDateTime(issue.updatedAt),
        workspaceTaskItemId: binding?.taskItemId ?? null,
        serviceRequest: {
          refNo: issue.serviceRequest?.refNo ?? null,
          productTitle: issue.serviceRequest?.product?.title ?? null,
          sku:
            issue.serviceRequest?.skuSnapshot ??
            issue.serviceRequest?.product?.sku ??
            null,
          imageUrl:
            issue.serviceRequest?.primaryImageUrlSnapshot ??
            issue.serviceRequest?.product?.primaryImageUrl ??
            null,
        },
      };
    })
    .sort((left, right) => {
      const stageOrder = { INSPECT: 0, READY: 1, PROCESSING: 2, DONE: 3 };
      const stageDiff = stageOrder[left.stage] - stageOrder[right.stage];
      if (stageDiff !== 0) return stageDiff;
      return String(right.updatedAt ?? "").localeCompare(String(left.updatedAt ?? ""));
    });

  return { items, vendorOptions, technicalDetailCatalogOptions };
}

async function loadTechnicalServiceRequestRollupByTaskItem(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; note: string | null }>;
}) {
  const result = new Map<string, TechnicalServiceRequestRollup>();
  if (!input.taskItems.length) return result;

  const metadataByTaskItem = new Map(
    input.taskItems.map((item) => [item.id, workspaceRoleMetadataFromNote(item.note)]),
  );
  const serviceRequestIdsByTaskItem = new Map<string, Set<string>>();

  for (const item of input.taskItems) {
    const metadata = metadataByTaskItem.get(item.id);
    if (metadata?.workspaceKind !== "CASE_WORKSPACE") continue;

    const serviceRequestId = noteLineValue(item.note, "serviceRequestId");
    if (serviceRequestId) {
      serviceRequestIdsByTaskItem.set(item.id, new Set([serviceRequestId]));
    }
  }

  const caseTaskItemIds = [...serviceRequestIdsByTaskItem.keys()];
  if (!caseTaskItemIds.length) return result;

  const serviceRequestBindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: caseTaskItemIds },
      targetType: TaskExecutionTargetType.SERVICE_REQUEST,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      taskItemId: true,
      targetId: true,
    },
  });

  for (const binding of serviceRequestBindings) {
    if (!binding.taskItemId) continue;
    const ids = serviceRequestIdsByTaskItem.get(binding.taskItemId) ?? new Set<string>();
    ids.add(binding.targetId);
    serviceRequestIdsByTaskItem.set(binding.taskItemId, ids);
  }

  const serviceRequestIds = [
    ...new Set([...serviceRequestIdsByTaskItem.values()].flatMap((ids) => [...ids])),
  ];
  if (!serviceRequestIds.length) return result;

  const technicalIssues = await input.db.technicalIssue.findMany({
    where: { serviceRequestId: { in: serviceRequestIds } },
    select: {
      id: true,
      serviceRequestId: true,
      executionStatus: true,
    },
  });
  const issueToServiceRequest = new Map(
    technicalIssues.map((issue) => [issue.id, issue.serviceRequestId]),
  );
  const issueIds = technicalIssues.map((issue) => issue.id);
  const payments = issueIds.length
    ? await input.db.payment.findMany({
        where: {
          technical_issue_id: { in: issueIds },
          type: PaymentType.SERVICE,
          direction: PaymentDirection.OUT,
        },
        select: {
          technical_issue_id: true,
          status: true,
          amount: true,
        },
      })
    : [];

  const queueByServiceRequest = new Map<string, QueueSummaryDTO>();
  for (const issue of technicalIssues) {
    const bucket = technicalIssueSummaryBucket(issue.executionStatus);
    if (!bucket) continue;

    const summary = queueByServiceRequest.get(issue.serviceRequestId) ?? emptyQueueSummary();
    queueByServiceRequest.set(issue.serviceRequestId, {
      ...summary,
      [bucket]: summary[bucket] + 1,
    });
  }

  const paymentByServiceRequest = new Map<
    string,
    {
      totalAmount: number;
      paidAmount: number;
      unpaidAmount: number;
      paymentCount: number;
      unpaidIssueIds: Set<string>;
    }
  >();
  for (const payment of payments) {
    const issueId = payment.technical_issue_id;
    const serviceRequestId = issueId ? issueToServiceRequest.get(issueId) : null;
    if (!issueId || !serviceRequestId) continue;

    const amount = Number(payment.amount ?? 0);
    const status = String(payment.status ?? "").toUpperCase();
    const current =
      paymentByServiceRequest.get(serviceRequestId) ??
      {
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        paymentCount: 0,
        unpaidIssueIds: new Set<string>(),
      };

    if (Number.isFinite(amount) && amount > 0) {
      current.totalAmount += amount;
      if (status === PaymentStatus.PAID || status === "COLLECTED") {
        current.paidAmount += amount;
      } else if (status === PaymentStatus.UNPAID) {
        current.unpaidAmount += amount;
        current.unpaidIssueIds.add(issueId);
      }
    }
    current.paymentCount += 1;
    paymentByServiceRequest.set(serviceRequestId, current);
  }

  for (const [taskItemId, serviceRequestIdsForTaskItem] of serviceRequestIdsByTaskItem.entries()) {
    const queueSummary = [...serviceRequestIdsForTaskItem].reduce((acc, serviceRequestId) => {
      const current = queueByServiceRequest.get(serviceRequestId) ?? emptyQueueSummary();
      return {
        ready: acc.ready + current.ready,
        review: acc.review + current.review,
        feedback: acc.feedback + current.feedback,
        done: acc.done + current.done,
      };
    }, emptyQueueSummary());

    const payment = [...serviceRequestIdsForTaskItem].reduce(
      (acc, serviceRequestId) => {
        const current = paymentByServiceRequest.get(serviceRequestId);
        if (!current) return acc;

        for (const issueId of current.unpaidIssueIds) acc.unpaidIssueIds.add(issueId);
        return {
          totalAmount: acc.totalAmount + current.totalAmount,
          paidAmount: acc.paidAmount + current.paidAmount,
          unpaidAmount: acc.unpaidAmount + current.unpaidAmount,
          paymentCount: acc.paymentCount + current.paymentCount,
          unpaidIssueIds: acc.unpaidIssueIds,
        };
      },
      {
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        paymentCount: 0,
        unpaidIssueIds: new Set<string>(),
      },
    );
    const remainingAmount = Math.max(0, payment.totalAmount - payment.paidAmount);

    result.set(taskItemId, {
      queueSummary,
      paymentSummary: {
        scope: "TECHNICAL_ISSUE_ROLLUP",
        direction: "OUT",
        status: serviceRequestPaymentStatus({
          totalAmount: payment.totalAmount,
          paidAmount: payment.paidAmount,
          unpaidAmount: payment.unpaidAmount,
          paymentCount: payment.paymentCount,
        }),
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        unpaidAmount: payment.unpaidAmount,
        remainingAmount,
        paymentCount: payment.paymentCount,
        unpaidIssueCount: payment.unpaidIssueIds.size,
      },
    });
  }

  return result;
}

async function loadWorkspaceIdentityPreviewMap(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; note: string | null }>;
}) {
  const result = new Map<
    string,
    {
      targetType: string;
      targetId: string;
      title: string | null;
      ref: string | null;
      imageUrl: string | null;
    }
  >();
  if (!input.taskItems.length) return result;

  const taskItemIds = input.taskItems.map((item) => item.id);
  const priority: Record<string, number> = {
    SERVICE_REQUEST: 0,
    WATCH: 1,
    ORDER: 2,
  };
  const chosen = new Map<string, { targetType: string; targetId: string }>();

  for (const item of input.taskItems) {
    if (workspaceRoleMetadataFromNote(item.note).workspaceKind !== "CASE_WORKSPACE") {
      continue;
    }

    const identityTargetType = normalizeStatus(
      workspaceRoleFromNote(item.note)?.identityTargetType ??
        noteLineValue(item.note, "identityTargetType"),
    );
    const serviceRequestId = noteLineValue(item.note, "serviceRequestId");
    if (identityTargetType === TaskExecutionTargetType.SERVICE_REQUEST && serviceRequestId) {
      chosen.set(item.id, {
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        targetId: serviceRequestId,
      });
    }
  }

  const identityBindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: taskItemIds },
      targetType: {
        in: [
          TaskExecutionTargetType.SERVICE_REQUEST,
          TaskExecutionTargetType.WATCH,
          TaskExecutionTargetType.ORDER,
        ],
      },
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      taskItemId: true,
      targetType: true,
      targetId: true,
    },
    orderBy: { createdAt: "asc" },
  });

  for (const binding of identityBindings) {
    if (!binding.taskItemId) continue;
    const current = chosen.get(binding.taskItemId);
    if (
      current &&
      (priority[current.targetType] ?? 99) <= (priority[binding.targetType] ?? 99)
    ) {
      continue;
    }
    chosen.set(binding.taskItemId, {
      targetType: binding.targetType,
      targetId: binding.targetId,
    });
  }

  const serviceRequestIds = [...chosen.values()]
    .filter((item) => item.targetType === TaskExecutionTargetType.SERVICE_REQUEST)
    .map((item) => item.targetId);
  const watchIds = [...chosen.values()]
    .filter((item) => item.targetType === TaskExecutionTargetType.WATCH)
    .map((item) => item.targetId);
  const orderIds = [...chosen.values()]
    .filter((item) => item.targetType === TaskExecutionTargetType.ORDER)
    .map((item) => item.targetId);
  const [serviceRequests, watches, orders] = await Promise.all([
    serviceRequestIds.length
      ? input.db.serviceRequest.findMany({
          where: { id: { in: serviceRequestIds } },
          select: {
            id: true,
            refNo: true,
            skuSnapshot: true,
            modelSnapshot: true,
            primaryImageUrlSnapshot: true,
            product: {
              select: {
                title: true,
                sku: true,
                primaryImageUrl: true,
                storefrontImageKey: true,
                productImage: {
                  where: { role: "INLINE" },
                  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                  take: 1,
                  select: { fileKey: true },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
    watchIds.length
      ? input.db.watch.findMany({
          where: { id: { in: watchIds } },
          select: {
            id: true,
            product: {
              select: {
                title: true,
                sku: true,
                primaryImageUrl: true,
                storefrontImageKey: true,
                productImage: {
                  where: { role: "INLINE" },
                  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                  take: 1,
                  select: { fileKey: true },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
    orderIds.length
      ? input.db.order.findMany({
          where: { id: { in: orderIds } },
          select: {
            id: true,
            refNo: true,
            orderItem: {
              take: 1,
              select: {
                product: {
                  select: {
                    title: true,
                    sku: true,
                    primaryImageUrl: true,
                    storefrontImageKey: true,
                    productImage: {
                      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                      take: 1,
                      select: { fileKey: true },
                    },
                  },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);
  const srById = new Map(serviceRequests.map((item) => [item.id, item]));
  const watchById = new Map(watches.map((item) => [item.id, item]));
  const orderById = new Map(orders.map((item) => [item.id, item]));

  for (const [taskItemId, identity] of chosen.entries()) {
    if (identity.targetType === TaskExecutionTargetType.SERVICE_REQUEST) {
      const row = srById.get(identity.targetId);
      if (!row) continue;
      result.set(taskItemId, {
        targetType: identity.targetType,
        targetId: identity.targetId,
        title: row.modelSnapshot ?? row.product?.title ?? row.refNo ?? "Service Request",
        ref: row.refNo ?? row.skuSnapshot ?? row.product?.sku ?? null,
        imageUrl: mediaUrl(row.primaryImageUrlSnapshot) ?? imageUrlFromProduct(row.product),
      });
    } else if (identity.targetType === TaskExecutionTargetType.WATCH) {
      const row = watchById.get(identity.targetId);
      if (!row) continue;
      result.set(taskItemId, {
        targetType: identity.targetType,
        targetId: identity.targetId,
        title: row.product?.title ?? "Watch",
        ref: row.product?.sku ?? null,
        imageUrl: imageUrlFromProduct(row.product),
      });
    } else if (identity.targetType === TaskExecutionTargetType.ORDER) {
      const row = orderById.get(identity.targetId);
      if (!row) continue;
      const product = row.orderItem[0]?.product ?? null;
      result.set(taskItemId, {
        targetType: identity.targetType,
        targetId: identity.targetId,
        title: row.refNo ?? product?.title ?? "Order",
        ref: product?.sku ?? null,
        imageUrl: imageUrlFromProduct(product),
      });
    }
  }

  return result;
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
  if (input.context === "MEDIA") {
    await restoreMediaFinalStageDoneBindings({
      db,
      taskId: cycle.task.id,
      taskItems,
    });
    await cleanupMediaFlowStageBindings({
      db,
      taskId: cycle.task.id,
      taskItems,
    });
  }
  const taskItemIds = taskItems.map((item) => item.id);
  const identityPreviewTaskItemIds = taskItems
    .filter((item) => canShowWorkspaceIdentityPreview(item.note))
    .map((item) => item.id);
  const identityPreviewTaskItemIdSet = new Set(identityPreviewTaskItemIds);
  const viewConfig = getSpaceViewConfig(input.context);

  const [
    queueRows,
    mediaQueueSummaryByTaskItem,
    technicalQueueCountByTaskItem,
    paymentQueueCountByTaskItem,
    feedbackCountByTaskItem,
    activityRows,
    lastActivityMap,
    identityPreviewMap,
    technicalServiceRequestRollupByTaskItem,
    technicalIssueBoard,
    allUsers,
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
      ? loadMediaQueueSummaryByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        })
      : Promise.resolve(new Map<string, QueueSummaryDTO>()),
    input.context === "TECHNICAL"
      ? loadTechnicalQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        })
      : Promise.resolve(new Map<string, number>()),
    input.context === "PAYMENT"
      ? loadPaymentQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItemIds,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        })
      : Promise.resolve(new Map<string, number>()),
    loadFeedbackCountByTaskItem(db, taskItemIds),
    db.taskItemActivity.groupBy({
      by: ["taskItemId"],
      where: {
        taskItemId: { in: taskItemIds },
      },
      _max: { occurredAt: true },
    }),
    loadLastActivityMap(db, taskItemIds),
    loadWorkspaceIdentityPreviewMap({
      db,
      taskId: cycle.task.id,
      taskItems: taskItems.filter((item) => identityPreviewTaskItemIdSet.has(item.id)),
    }),
    input.context === "TECHNICAL"
      ? loadTechnicalServiceRequestRollupByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
        })
      : Promise.resolve(new Map<string, TechnicalServiceRequestRollup>()),
    input.context === "TECHNICAL"
      ? loadTechnicalIssueBoard({
          db,
          taskId: cycle.task.id,
        })
      : Promise.resolve(null),
    db.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
  ]);

  const queueCountByTaskItem = new Map(
    input.context === "TECHNICAL"
        ? technicalQueueCountByTaskItem
        : input.context === "PAYMENT"
          ? paymentQueueCountByTaskItem
          : queueRows
              .filter((row) => row.taskItemId)
              .map((row) => [row.taskItemId as string, row._count._all]),
  );
  const lastActivityAtByTaskItem = new Map(
    activityRows.map((row) => [row.taskItemId, row._max.occurredAt ?? null]),
  );
  const now = new Date();
  const currentUser = authUserSummary(input?.auth);

  const workTickets: CoordinationWorkTicketSummaryDTO[] = taskItems.map((item) => {
    const queueCount = queueCountByTaskItem.get(item.id) ?? 0;
    const feedbackCount = feedbackCountByTaskItem.get(item.id) ?? 0;
    const queueSummary =
      input.context === "MEDIA"
        ? mediaQueueSummaryByTaskItem.get(item.id) ?? emptyQueueSummary()
        : technicalServiceRequestRollupByTaskItem.get(item.id)?.queueSummary ??
          buildQueueSummary({
            queueCount,
            feedbackCount,
            status: item.status,
          });
    const paymentSummary =
      technicalServiceRequestRollupByTaskItem.get(item.id)?.paymentSummary ?? null;
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
      identityPreview: identityPreviewMap.get(item.id) ?? null,
      ownerLabel: ticketOwner(item, currentUser).label,
      owner: ticketOwner(item, currentUser),
      queueSummary,
      paymentSummary,
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

  const taskScopeNotes = rawTaskItems.map((item) => item.note);
  const spaceSharedUserIds = uniqueShareIds(
    taskScopeNotes.flatMap((note) => shareUserIdsFromNoteLine(note, "spaceSharedUserIds")),
  );
  const coreFlowSharedUserIds = Object.fromEntries(
    (viewConfig.coreFlows ?? []).map((flow) => [
      flow.key,
      uniqueShareIds(
        taskScopeNotes.flatMap((note) =>
          shareUserIdsFromNoteLine(note, `coreFlowSharedUserIds:${flow.key}`),
        ),
      ),
    ]),
  );
  const allSharedUserIds = new Set([
    ...spaceSharedUserIds,
    ...Object.values(coreFlowSharedUserIds).flat(),
  ]);
  const sharedUsers = allUsers.filter((user) => allSharedUserIds.has(user.id));

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
    spaceSharing: {
      users: allUsers,
      sharedUsers,
      scopeUserIds: {
        space: spaceSharedUserIds,
        coreFlows: coreFlowSharedUserIds,
      },
    },
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
    technicalIssueBoard,
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
