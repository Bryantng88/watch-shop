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
  CoordinationMediaBoardItemDTO,
  CoordinationTechnicalIssueBoardItemDTO,
  CoordinationWorkTicketSummaryDTO,
  QueueSummaryDTO,
} from "./coordination-dashboard.types";
import type { CoordinationContext } from "./coordination-cycle.types";
import { getPaymentOwnerSummaryProjections } from "@/domains/projection/server/payment-owner-summary.projection";
import { perfStep } from "@/lib/server-perf";
import { getAuthUserId } from "@/domains/task/server/core/task.service";

function dashboardStep<T>(label: string, run: () => Promise<T>) {
  return perfStep("coordination-dashboard", label, run);
}

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

function paymentCashFlowPeriods(
  payments: Array<{ amount: unknown; direction: PaymentDirection | null; paidAt: Date | null; createdAt: Date }>,
) {
  const now = new Date();
  const week = getWeekRange(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const periods = {
    WEEK: { start: week.startDate, label: `Tuần ${week.weekNumber}/${week.year}` },
    MONTH: { start: monthStart, label: `Tháng ${now.getMonth() + 1}/${now.getFullYear()}` },
    YEAR: { start: yearStart, label: `Năm ${now.getFullYear()}` },
    ALL: { start: null, label: "Toàn thời gian" },
  } as const;

  return Object.fromEntries(Object.entries(periods).map(([key, period]) => {
    const rows = period.start
      ? payments.filter((payment) => (payment.paidAt ?? payment.createdAt) >= period.start)
      : payments;
    const income = rows.reduce((sum, payment) => sum + (payment.direction === PaymentDirection.IN ? Number(payment.amount) : 0), 0);
    const expense = rows.reduce((sum, payment) => sum + (payment.direction === PaymentDirection.OUT ? Number(payment.amount) : 0), 0);
    return [key, {
      periodLabel: period.label,
      income,
      expense,
      net: income - expense,
      transactionCount: rows.length,
    }];
  })) as CoordinationDashboardDTO["paymentCashFlow"];
}

function paymentWorkspaceRole(note?: string | null) {
  return noteLineValue(note, "operationWorkspaceRole")?.toUpperCase() ?? null;
}

export async function reconcilePaymentCollectionBindings(input: {
  db: DB;
  taskId: string;
  taskItems: Array<{ id: string; title: string; note: string | null }>;
}) {
  const inboxItems = input.taskItems.filter((item) => paymentWorkspaceRole(item.note) === "PAYMENT_INBOX");
  const reviewItems = input.taskItems.filter((item) => paymentWorkspaceRole(item.note) === "PAYMENT_REVIEW");
  const settledItems = input.taskItems.filter((item) => paymentWorkspaceRole(item.note) === "PAYMENT_SETTLED");
  const canonicalReview = reviewItems.find((item) => item.title === "Payment Collection - Review") ?? reviewItems[0];
  const canonicalSettled = settledItems.find((item) => item.title === "Payment Collection - Settled / Exception") ?? settledItems[0];
  const reviewId = canonicalReview?.id;
  const settledId = canonicalSettled?.id;
  if (!reviewId || !settledId) return;

  const [payments, existing] = await Promise.all([
    input.db.payment.findMany({ select: { id: true, status: true } }),
    input.db.taskExecution.findMany({
      where: { taskId: input.taskId, targetType: TaskExecutionTargetType.PAYMENT },
      select: { targetId: true, taskItemId: true },
    }),
  ]);
  const existingIds = new Set(existing.map((binding) => binding.targetId));
  const terminalStatuses = new Set(["PAID", "COLLECTED", "CANCELED", "CANCELLED", "FAILED"]);
  const statusById = new Map(payments.map((payment) => [payment.id, String(payment.status).toUpperCase()]));
  const staleReviewIds = existing.filter((binding) => !terminalStatuses.has(statusById.get(binding.targetId) ?? "")).map((binding) => binding.targetId);
  const staleSettledIds = existing.filter((binding) => terminalStatuses.has(statusById.get(binding.targetId) ?? "")).map((binding) => binding.targetId);
  if (staleReviewIds.length) {
    await input.db.taskExecution.updateMany({
      where: { taskId: input.taskId, targetType: TaskExecutionTargetType.PAYMENT, targetId: { in: staleReviewIds } },
      data: { taskItemId: reviewId },
    });
  }
  if (staleSettledIds.length) {
    await input.db.taskExecution.updateMany({
      where: { taskId: input.taskId, targetType: TaskExecutionTargetType.PAYMENT, targetId: { in: staleSettledIds } },
      data: { taskItemId: settledId },
    });
  }
  const obsoleteWorkspaceIds = [
    ...inboxItems.map((item) => item.id),
    ...reviewItems.filter((item) => item.id !== reviewId).map((item) => item.id),
    ...settledItems.filter((item) => item.id !== settledId).map((item) => item.id),
  ];
  if (obsoleteWorkspaceIds.length) {
    await input.db.taskItem.updateMany({ where: { id: { in: obsoleteWorkspaceIds } }, data: { status: TaskStatus.CANCELLED } });
  }
  const missing = payments.filter((payment) => !existingIds.has(payment.id));
  if (!missing.length) return;

  await input.db.taskExecution.createMany({
    data: missing.map((payment) => {
      const status = String(payment.status).toUpperCase();
      const terminal = ["PAID", "COLLECTED", "CANCELED", "CANCELLED", "FAILED"].includes(status);
      return {
        taskId: input.taskId,
        taskItemId: terminal ? settledId : reviewId,
        targetType: TaskExecutionTargetType.PAYMENT,
        targetId: payment.id,
        actionType: TaskExecutionActionType.LINKED,
        metadataJson: {
          source: "PAYMENT_FLOW_RECONCILE",
          paymentStatus: status,
        },
      };
    }),
  });
}

function ticketCreator(item: {
  User?: { name?: string | null; email?: string | null; avatarUrl?: string | null } | null;
  executions?: Array<{
    createdByUser?: { name?: string | null; email?: string | null; avatarUrl?: string | null } | null;
  }>;
}, fallbackUser?: { name?: string | null; email?: string | null; avatarUrl?: string | null } | null) {
  const directCreatorLabel = userLabel(item.User);
  if (directCreatorLabel !== "-") {
    const fallbackAvatar =
      item.User?.email && item.User.email === fallbackUser?.email
        ? fallbackUser.avatarUrl
        : null;

    return {
      label: directCreatorLabel,
      avatarUrl: item.User?.avatarUrl ?? fallbackAvatar ?? null,
      isSystem: false,
    };
  }

  const executionCreator = item.executions?.[0]?.createdByUser ?? null;
  const executionCreatorLabel = userLabel(executionCreator);
  if (executionCreatorLabel !== "-") {
    return {
      label: executionCreatorLabel,
      avatarUrl: executionCreator?.avatarUrl ?? null,
      isSystem: false,
    };
  }

  return {
    label: "Hệ thống",
    avatarUrl: null,
    isSystem: true,
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
  if (normalized === "media-processing") return "media-processing";
  if (normalized === "publish") return "publish";
  return null;
}

function mediaStageFromWorkflowKey(value?: string | null) {
  if (value === "watch-photography") return "photography";
  if (value === "watch-media-processing") return "media-processing";
  if (value === "watch-publish") return "publish";
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
  inheritedSharedUserIds: string[] = [],
) {
  if (authCanViewAll(auth)) return true;

  const userId = authUserId(auth);
  if (userId && (item.userId === userId || item.assignedToUserId === userId)) {
    return true;
  }
  if (userId && sharedUserIdsFromNote(item.note).includes(userId)) return true;
  if (userId && inheritedSharedUserIds.includes(userId)) return true;

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

function buildFlowStageQueueSummary(input: {
  queueCount: number;
  feedbackCount: number;
  flowStageKey?: string | null;
  operationWorkspaceRole?: string | null;
  fallbackStatus: TaskStatus;
}): QueueSummaryDTO {
  const stageKey = normalizeStatus(input.flowStageKey);
  const role = normalizeStatus(input.operationWorkspaceRole);
  const stage = stageKey || role;

  if (
    stage.includes("DONE") ||
    stage.includes("COMPLETED") ||
    stage.includes("SETTLED")
  ) {
    return {
      ready: 0,
      review: 0,
      feedback: input.feedbackCount,
      done: input.queueCount,
    };
  }

  if (
    stage.includes("PROCESS") ||
    stage.includes("REVIEW") ||
    stage.includes("PUBLISH")
  ) {
    return {
      ready: 0,
      review: input.queueCount,
      feedback: input.feedbackCount,
      done: 0,
    };
  }

  return buildQueueSummary({
    queueCount: input.queueCount,
    feedbackCount: input.feedbackCount,
    status: input.fallbackStatus,
  });
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

type RolloverOutSummary = NonNullable<
  CoordinationWorkTicketSummaryDTO["rollover"]
>;

function mediaFlowSummaryBucketForStage(
  metadataJson: unknown,
  stage: MediaFlowStage,
): keyof QueueSummaryDTO {
  const runtime = getQueueItemWorkflowState({ metadataJson });
  const state = normalizeStatus(runtime?.currentState);

  if (
    state.includes("RETURN") ||
    state.includes("FEEDBACK") ||
    state.includes("REJECT") ||
    state.includes("RECALL")
  ) {
    return "feedback";
  }

  if (stage === "media-processing") return "review";
  if (stage === "publish") return state === "DONE" || state === "CANCELLED" ? "done" : "ready";

  return "ready";
}

export async function loadFeedbackCountByTaskItem(db: DB, taskItemIds: string[]) {
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

export async function loadLastActivityMap(db: DB, taskItemIds: string[]) {
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

async function loadActivitySummaryByTaskItem(db: DB, taskItemIds: string[]) {
  const feedbackCounts = new Map<string, number>();
  const lastActivities = new Map<string, { title: string; occurredAt: Date }>();
  if (!taskItemIds.length) return { feedbackCounts, lastActivities };

  const rows = await db.taskItemActivity.findMany({
    where: { taskItemId: { in: taskItemIds } },
    select: {
      taskItemId: true,
      sourceType: true,
      title: true,
      occurredAt: true,
      metadataJson: true,
    },
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
  });

  for (const row of rows) {
    if (!lastActivities.has(row.taskItemId)) {
      lastActivities.set(row.taskItemId, {
        title: row.title,
        occurredAt: row.occurredAt,
      });
    }
    if (
      row.sourceType === ActivitySourceType.BUSINESS_EVENT &&
      hasFeedbackSignal(row.metadataJson)
    ) {
      feedbackCounts.set(
        row.taskItemId,
        (feedbackCounts.get(row.taskItemId) ?? 0) + 1,
      );
    }
  }

  return { feedbackCounts, lastActivities };
}

async function loadRolloverOutByTaskItem(db: DB, input: {
  taskId: string;
  taskItemIds: string[];
}) {
  const result = new Map<string, RolloverOutSummary>();
  if (!input.taskItemIds.length) return result;

  const rows = await db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: input.taskItemIds },
      actionType: TaskExecutionActionType.CANCELLED,
    },
    select: {
      taskItemId: true,
      metadataJson: true,
    },
    orderBy: { createdAt: "desc" },
  });

  for (const row of rows) {
    if (!row.taskItemId) continue;
    const metadata = asRecord(row.metadataJson);
    const rollover = asRecord(metadata.rollover);
    const legacyToTaskId = String(metadata.rolledOverToTaskId ?? "").trim();
    const isRolloverOut =
      (rollover.movementKind === "ACTIVE_OWNERSHIP_MOVE" && rollover.direction === "OUT") ||
      Boolean(legacyToTaskId);
    if (!isRolloverOut) continue;

    const current = result.get(row.taskItemId);
    const movedAt = String(rollover.movedAt ?? metadata.rolledOverAt ?? "").trim() || null;
    if (current) {
      result.set(row.taskItemId, {
        ...current,
        targetCount: current.targetCount + 1,
        movedAt: current.movedAt ?? movedAt,
      });
      continue;
    }

    result.set(row.taskItemId, {
      direction: "OUT",
      movementKind: "ACTIVE_OWNERSHIP_MOVE",
      targetCount: 1,
      toTaskId: String(rollover.toTaskId ?? metadata.rolledOverToTaskId ?? "").trim() || null,
      toTaskItemId: String(rollover.toTaskItemId ?? metadata.rolledOverToTaskItemId ?? "").trim() || null,
      toTaskItemTitle: String(rollover.toTaskItemTitle ?? "").trim() || null,
      movedAt,
    });
  }

  return result;
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

  const taskItemIdByStage = new Map<MediaFlowStage, string>();
  for (const [taskItemId, stage] of stageByTaskItem) {
    taskItemIdByStage.set(stage, taskItemId);
  }

  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      OR: [
        { taskItemId: { in: [...stageByTaskItem.keys()] } },
        { taskItemId: null },
      ],
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
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
  });
  const countedTargetIds = new Set<string>();
  for (const binding of bindings) {
    if (countedTargetIds.has(binding.targetId)) continue;

    const runtime = getQueueItemWorkflowState(binding);
    const stage =
      (binding.taskItemId ? stageByTaskItem.get(binding.taskItemId) : null) ??
      mediaStageFromWorkflowKey(runtime?.workflowKey);
    if (!stage) continue;

    const taskItemId = binding.taskItemId ?? taskItemIdByStage.get(stage);
    if (!taskItemId) continue;

    countedTargetIds.add(binding.targetId);
    const summary = summaries.get(taskItemId) ?? emptyQueueSummary();
    const bucket = mediaFlowSummaryBucketForStage(binding.metadataJson, stage);
    summary[bucket] += 1;
    summaries.set(taskItemId, summary);
  }

  return summaries;
}

export async function restoreMediaFinalStageDoneBindings(input: {
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

async function loadMediaBoard(input: { db: DB; taskId: string; viewerUserId?: string | null }) {
  const bindings = await input.db.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: {
      id: true,
      targetId: true,
      taskItemId: true,
      metadataJson: true,
      createdAt: true,
      createdByUser: { select: { name: true, email: true, avatarUrl: true } },
      taskItem: { select: { note: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const bindingByWatchId = new Map<string, (typeof bindings)[number]>();
  for (const binding of bindings) {
    const stage = mediaStageFromWorkTypeKey(ticketWorkTypeKey(binding.taskItem?.note));
    if (!stage || bindingByWatchId.has(binding.targetId)) continue;
    bindingByWatchId.set(binding.targetId, binding);
  }
  const watchIds = [...bindingByWatchId.keys()];
  if (!watchIds.length) return { items: [] as CoordinationMediaBoardItemDTO[] };

  const [watches, discussionActivities] = await Promise.all([
    input.db.watch.findMany({
      where: { id: { in: watchIds } },
      select: {
        id: true,
        updatedAt: true,
        product: { select: { title: true, sku: true, primaryImageUrl: true } },
      },
    }),
    input.db.taskItemActivity.findMany({
      where: { taskItemId: { in: bindings.map((binding) => binding.taskItemId).filter((id): id is string => Boolean(id)) } },
      select: { sourceType: true, metadataJson: true, replies: { select: { metadataJson: true } }, _count: { select: { replies: true } } },
    }),
  ]);
  const commentCountByWatchId = new Map<string, number>();
  const mentionCountByWatchId = new Map<string, number>();
  const unreadMentionCountByWatchId = new Map<string, number>();
  for (const activity of discussionActivities) {
    if (!activity.metadataJson || typeof activity.metadataJson !== "object" || Array.isArray(activity.metadataJson)) continue;
    const metadata = activity.metadataJson as { targetType?: unknown; targetId?: unknown; mentionedUserIds?: unknown; mentionReadByUserIds?: unknown };
    if (String(metadata.targetType ?? "") !== "WATCH") continue;
    const targetId = String(metadata.targetId ?? "").trim();
    if (!targetId) continue;
    commentCountByWatchId.set(
      targetId,
      (commentCountByWatchId.get(targetId) ?? 0) +
        (String(activity.sourceType) === "DISCUSSION" ? 1 : 0) + activity._count.replies,
    );
    if (input.viewerUserId) {
      const mentionIds = Array.isArray(metadata.mentionedUserIds) ? metadata.mentionedUserIds.map(String) : [];
      const readIds = Array.isArray((metadata as { mentionReadByUserIds?: unknown }).mentionReadByUserIds)
        ? ((metadata as { mentionReadByUserIds: unknown[] }).mentionReadByUserIds).map(String)
        : [];
      let mentions = mentionIds.includes(input.viewerUserId) ? 1 : 0;
      let unread = mentions && !readIds.includes(input.viewerUserId) ? 1 : 0;
      for (const reply of activity.replies) {
        if (!reply.metadataJson || typeof reply.metadataJson !== "object" || Array.isArray(reply.metadataJson)) continue;
        const replyMetadata = reply.metadataJson as { mentionedUserIds?: unknown; mentionReadByUserIds?: unknown };
        const replyMentionIds = Array.isArray(replyMetadata.mentionedUserIds) ? replyMetadata.mentionedUserIds.map(String) : [];
        const replyReadIds = Array.isArray(replyMetadata.mentionReadByUserIds) ? replyMetadata.mentionReadByUserIds.map(String) : [];
        if (replyMentionIds.includes(input.viewerUserId)) {
          mentions += 1;
          if (!replyReadIds.includes(input.viewerUserId)) unread += 1;
        }
      }
      if (mentions) mentionCountByWatchId.set(targetId, (mentionCountByWatchId.get(targetId) ?? 0) + mentions);
      if (unread) unreadMentionCountByWatchId.set(targetId, (unreadMentionCountByWatchId.get(targetId) ?? 0) + unread);
    }
  }

  const items = watches
    .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
    .map((watch): CoordinationMediaBoardItemDTO => {
    const binding = bindingByWatchId.get(watch.id)!;
    const workType = mediaStageFromWorkTypeKey(ticketWorkTypeKey(binding.taskItem?.note));
    const runtime = getQueueItemWorkflowState({ metadataJson: binding.metadataJson });
    const stage = workType === "photography"
      ? "PHOTOGRAPHY"
      : workType === "media-processing"
        ? "MEDIA_PROCESSING"
        : runtime?.currentState === "DONE" || runtime?.currentState === "CANCELLED"
          ? "DONE"
          : "PUBLISH";
    const actorLabel = userLabel(binding.createdByUser);
    return {
      id: watch.id,
      bindingId: binding.id,
      workspaceTaskItemId: binding.taskItemId!,
      title: watch.product?.title ?? "Watch",
      sku: watch.product?.sku ?? null,
      imageUrl: watch.product?.primaryImageUrl ?? null,
      stage,
      workflowState: runtime?.currentState ?? null,
      commentCount: commentCountByWatchId.get(watch.id) ?? 0,
      mentionedMeCount: mentionCountByWatchId.get(watch.id) ?? 0,
      unreadMentionCount: unreadMentionCountByWatchId.get(watch.id) ?? 0,
      updatedAt: formatDateTime(watch.updatedAt),
      lastUpdatedBy: {
        label: actorLabel === "-" ? "Hệ thống" : actorLabel,
        avatarUrl: binding.createdByUser?.avatarUrl ?? null,
        isSystem: actorLabel === "-",
      },
    };
    });
  return { items };
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
  viewerUserId?: string | null;
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
      createdByUser: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
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
      lastUpdatedBy: {
        label: string;
        avatarUrl: string | null;
        isSystem: boolean;
      };
    }
  >();
  for (const binding of bindings) {
    if (bindingByIssueId.has(binding.targetId)) continue;
    const metadata = workspaceRoleMetadataFromNote(binding.taskItem?.note ?? null);
    bindingByIssueId.set(binding.targetId, {
      taskItemId: binding.taskItemId ?? null,
      flowStageKey: metadata.flowStageKey,
      createdAt: binding.createdAt,
      lastUpdatedBy: (() => {
        const label = userLabel(binding.createdByUser);
        return {
          label: label === "-" ? "Hệ thống" : label,
          avatarUrl: binding.createdByUser?.avatarUrl ?? null,
          isSystem: label === "-",
        };
      })(),
    });
  }

  const issueIds = [...bindingByIssueId.keys()];
  const [vendorOptions, technicalDetailCatalogOptions, serviceRequestBindings] = await Promise.all([
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
    input.db.taskExecution.findMany({
      where: {
        taskId: input.taskId,
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        actionType: { not: TaskExecutionActionType.CANCELLED },
        taskItemId: { not: null },
      },
      select: {
        targetId: true,
        taskItemId: true,
        createdAt: true,
        taskItem: { select: { note: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!issueIds.length) return { items: [], vendorOptions, technicalDetailCatalogOptions };

  const srCaseTaskItemIdByServiceRequestId = new Map<string, string>();
  for (const binding of serviceRequestBindings) {
    if (!binding.taskItemId || srCaseTaskItemIdByServiceRequestId.has(binding.targetId)) continue;
    const metadata = workspaceRoleMetadataFromNote(binding.taskItem?.note ?? null);
    if (metadata.workspaceRole && metadata.workspaceRole !== "SR_CASE") continue;
    srCaseTaskItemIdByServiceRequestId.set(binding.targetId, binding.taskItemId);
  }

  const [issues, startedEvents, discussionActivities] = await Promise.all([input.db.technicalIssue.findMany({
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
      technicalDetailCatalog: {
        select: { code: true, name: true },
      },
      priority: true,
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
  }), input.db.businessEventLog.findMany({
    where: {
      eventKey: "technical_issue.started",
      targetType: "TECHNICAL_ISSUE",
      targetId: { in: issueIds },
    },
    select: { targetId: true, metadataJson: true },
  }), input.db.taskItemActivity.findMany({
    where: {
      taskItemId: { in: bindings.map((binding) => binding.taskItemId).filter((id): id is string => Boolean(id)) },
    },
    select: {
      sourceType: true,
      metadataJson: true,
      replies: { select: { metadataJson: true } },
      _count: { select: { replies: true } },
    },
  })]);
  const startedEventByIssueId = new Map(startedEvents.map((event) => [event.targetId, event.metadataJson]));
  const commentCountByIssueId = new Map<string, number>();
  const mentionedMeCountByIssueId = new Map<string, number>();
  const unreadMentionCountByIssueId = new Map<string, number>();
  for (const activity of discussionActivities) {
    if (!activity.metadataJson || typeof activity.metadataJson !== "object" || Array.isArray(activity.metadataJson)) continue;
    const metadata = activity.metadataJson as { targetType?: unknown; targetId?: unknown; mentionedUserIds?: unknown; mentionReadByUserIds?: unknown };
    if (String(metadata.targetType ?? "") !== "TECHNICAL_ISSUE") continue;
    const targetId = String(metadata.targetId ?? "").trim();
    if (!targetId) continue;
    const directCommentCount = String(activity.sourceType) === "DISCUSSION" ? 1 : 0;
    commentCountByIssueId.set(
      targetId,
      (commentCountByIssueId.get(targetId) ?? 0) + directCommentCount + activity._count.replies,
    );
    if (input.viewerUserId) {
      const directlyMentioned = Array.isArray(metadata.mentionedUserIds) && metadata.mentionedUserIds.map(String).includes(input.viewerUserId);
      const directlyRead = Array.isArray(metadata.mentionReadByUserIds) && metadata.mentionReadByUserIds.map(String).includes(input.viewerUserId);
      const replyMentions = activity.replies.filter((reply) => {
        if (!reply.metadataJson || typeof reply.metadataJson !== "object" || Array.isArray(reply.metadataJson)) return false;
        const ids = (reply.metadataJson as { mentionedUserIds?: unknown }).mentionedUserIds;
        return Array.isArray(ids) && ids.map(String).includes(input.viewerUserId!);
      }).length;
      const unreadReplyMentions = activity.replies.filter((reply) => {
        if (!reply.metadataJson || typeof reply.metadataJson !== "object" || Array.isArray(reply.metadataJson)) return false;
        const replyMetadata = reply.metadataJson as { mentionedUserIds?: unknown; mentionReadByUserIds?: unknown };
        const ids = Array.isArray(replyMetadata.mentionedUserIds) ? replyMetadata.mentionedUserIds.map(String) : [];
        const readIds = Array.isArray(replyMetadata.mentionReadByUserIds) ? replyMetadata.mentionReadByUserIds.map(String) : [];
        return ids.includes(input.viewerUserId!) && !readIds.includes(input.viewerUserId!);
      }).length;
      const mentionCount = (directlyMentioned ? 1 : 0) + replyMentions;
      if (mentionCount) mentionedMeCountByIssueId.set(targetId, (mentionedMeCountByIssueId.get(targetId) ?? 0) + mentionCount);
      const unreadCount = (directlyMentioned && !directlyRead ? 1 : 0) + unreadReplyMentions;
      if (unreadCount) unreadMentionCountByIssueId.set(targetId, (unreadMentionCountByIssueId.get(targetId) ?? 0) + unreadCount);
    }
  }
  const replacementPartLabels: Record<string, string> = {
    MOVEMENT_COMPLETE: "Thay nguyên máy",
    MAINSPRING: "Thay cót",
    GEAR: "Thay bánh răng",
    BALANCE_WHEEL: "Thay vành tóc",
    BALANCE_STAFF: "Thay trụ tóc",
    HAIRSPRING: "Thay cả dây tóc",
  };

  const items = issues
    .map((issue): CoordinationTechnicalIssueBoardItemDTO => {
      const binding = bindingByIssueId.get(issue.id);
      const startedMetadata = startedEventByIssueId.get(issue.id);
      const replacementPartCodes = startedMetadata && typeof startedMetadata === "object" && !Array.isArray(startedMetadata)
        ? (startedMetadata as { replacementPartCodes?: unknown }).replacementPartCodes
        : null;
      const replacementParts = Array.isArray(replacementPartCodes)
        ? replacementPartCodes.map((code) => replacementPartLabels[String(code)]).filter(Boolean)
        : [];
      return {
        id: issue.id,
        serviceRequestId: issue.serviceRequestId,
        summary: issue.summary ?? issue.note ?? "Technical issue",
        note: issue.note ?? null,
        area: issue.area ?? null,
        actionMode: issue.actionMode ?? null,
        vendorId: issue.vendorId ?? null,
        vendorName: issue.vendorNameSnap ?? null,
        estimatedCost: nullableNumber(issue.estimatedCost),
        executionStatus: String(issue.executionStatus ?? "OPEN"),
        isConfirmed: Boolean(issue.isConfirmed),
        priority: issue.priority ?? "NORMAL",
        technicalDetailCatalogId: issue.technicalDetailCatalogId ?? null,
        processingDetails: [issue.technicalDetailCatalog?.name, ...replacementParts].filter((value): value is string => Boolean(value)),
        commentCount: commentCountByIssueId.get(issue.id) ?? 0,
        mentionedMeCount: mentionedMeCountByIssueId.get(issue.id) ?? 0,
        unreadMentionCount: unreadMentionCountByIssueId.get(issue.id) ?? 0,
        stage: technicalIssueBoardStage({
          flowStageKey: binding?.flowStageKey ?? null,
          executionStatus: issue.executionStatus,
          isConfirmed: Boolean(issue.isConfirmed),
        }),
        actualCost: nullableNumber(issue.actualCost),
        updatedAt: formatDateTime(issue.updatedAt),
        lastUpdatedBy: binding?.lastUpdatedBy ?? {
          label: "Hệ thống",
          avatarUrl: null,
          isSystem: true,
        },
        workspaceTaskItemId: binding?.taskItemId ?? null,
        srCaseTaskItemId: srCaseTaskItemIdByServiceRequestId.get(issue.serviceRequestId) ?? null,
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
  const paymentSummaries = await getPaymentOwnerSummaryProjections(input.db, "TECHNICAL_ISSUE", issueIds);

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
  for (const [issueId, summary] of paymentSummaries) {
    const serviceRequestId = issueId ? issueToServiceRequest.get(issueId) : null;
    if (!issueId || !serviceRequestId) continue;
    const current =
      paymentByServiceRequest.get(serviceRequestId) ??
      {
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        paymentCount: 0,
        unpaidIssueIds: new Set<string>(),
      };

    current.totalAmount += summary.paidTotal + summary.collectedTotal + summary.unpaidTotal;
    current.paidAmount += summary.paidTotal + summary.collectedTotal;
    current.unpaidAmount += summary.unpaidTotal;
    if (summary.pendingCount > 0) current.unpaidIssueIds.add(issueId);
    current.paymentCount += summary.paymentCount;
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
  modeKey?: string | null;
  includeDashboardDetails?: boolean;
  includeTechnicalBoard?: boolean;
  includeMediaBoard?: boolean;
  auth?: unknown;
}): Promise<CoordinationDashboardDTO> {
  const db = input?.db ?? prisma;
  const selectedDate = parseDateInput(input?.date);
  const cycle = await dashboardStep("ensureCycle", () => ensureCoordinationCycle(db, {
    context: input.context,
    date: selectedDate,
    provisionWorkTickets: false,
  }));

  const rawTaskItems = await dashboardStep("loadTaskItems", () => db.taskItem.findMany({
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
      executions: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: {
          createdByUser: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  }));
  const workTypeContexts: CoordinationContext[] = input.context === "OPERATION"
    ? ["OPERATION", "SALES", "TECHNICAL", "MEDIA", "PAYMENT", "GENERAL"]
    : [input.context];
  const activeWorkTypeKeys = new Set(
    workTypeContexts.flatMap((context) =>
      listWorkTypes(context).map((workType) => normalizeWorkTypeKey(workType.key)),
    ),
  );
  const accessSpaceSharedUserIds = uniqueShareIds(
    rawTaskItems.flatMap((item) =>
      shareUserIdsFromNoteLine(item.note, "spaceSharedUserIds"),
    ),
  );
  let taskItems = rawTaskItems.filter((item) => {
    if ((input.context === "PAYMENT" || input.context === "OPERATION") && paymentWorkspaceRole(item.note) === "PAYMENT_INBOX") {
      return false;
    }
    const workTypeKey = ticketWorkTypeKey(item.note);
    const blueprintSource = ticketBlueprintSource(item.note);
    if (
      workTypeKey &&
      blueprintSource !== "DRAFT" &&
      !activeWorkTypeKeys.has(workTypeKey)
    ) {
      return false;
    }
    const accessCoreFlowSharedUserIds = workTypeKey
      ? uniqueShareIds(
        rawTaskItems.flatMap((taskItem) =>
          shareUserIdsFromNoteLine(
            taskItem.note,
            `coreFlowSharedUserIds:${workTypeKey}`,
          ),
        ),
      )
      : [];
    return canViewTicket(
      item,
      input?.auth,
      uniqueShareIds([
        ...accessSpaceSharedUserIds,
        ...accessCoreFlowSharedUserIds,
      ]),
    );
  });
  const viewConfig = getSpaceViewConfig(input.context);
  const requestedMode = input.modeKey
    ? viewConfig.modes.find((mode) => mode.key === input.modeKey)
    : null;
  const activeMode = requestedMode ?? viewConfig.modes.find(
    (mode) => mode.key === viewConfig.defaultModeKey,
  );
  const activeFlow = activeMode?.coreFlowKey
    ? viewConfig.coreFlows?.find((flow) => flow.key === activeMode.coreFlowKey)
    : null;

  if (input.context === "OPERATION" && activeFlow) {
    const activeStageKeys = new Set(activeFlow.stages.flatMap((stage) => [
      normalizeWorkTypeKey(stage.key),
      normalizeWorkTypeKey(stage.workspaceKey),
    ]));
    taskItems = taskItems.filter((item) => {
      const metadata = workspaceRoleMetadataFromNote(item.note);
      const stageKey = normalizeWorkTypeKey(
        metadata.flowStageKey ?? ticketWorkTypeKey(item.note) ?? "",
      );
      return activeStageKeys.has(stageKey) && (
        metadata.workspaceKind === "FLOW_STAGE_WORKSPACE" || !metadata.workspaceKind
      );
    });
  }
  const taskItemIds = taskItems.map((item) => item.id);
  const identityPreviewTaskItemIds = taskItems
    .filter((item) => canShowWorkspaceIdentityPreview(item.note))
    .map((item) => item.id);
  const identityPreviewTaskItemIdSet = new Set(identityPreviewTaskItemIds);
  const isTechnicalFlow = input.context === "TECHNICAL" || activeFlow?.key === "technical-issue-flow";
  const isMediaFlow = input.context === "MEDIA" || activeFlow?.key === "media-production-flow";
  const isPaymentFlow = input.context === "PAYMENT" || activeFlow?.key === "payment-collection-core-flow";
  const isServiceRequestCaseMode = activeMode?.key === "sr-cases";

  const [
    queueRows,
    mediaQueueSummaryByTaskItem,
    technicalQueueCountByTaskItem,
    paymentQueueCountByTaskItem,
    activitySummary,
    rolloverOutByTaskItem,
    identityPreviewMap,
    technicalServiceRequestRollupByTaskItem,
    technicalIssueBoard,
    allUsers,
    paymentCashFlow,
    mediaBoard,
  ] = await Promise.all([
    dashboardStep("queueCounts", () => db.taskExecution.groupBy({
      by: ["taskItemId"],
      where: {
        taskId: cycle.task.id,
        taskItemId: { in: taskItemIds },
        actionType: { not: TaskExecutionActionType.CANCELLED },
      },
      _count: { _all: true },
    })),
    isMediaFlow
      ? dashboardStep("mediaQueue", () => loadMediaQueueSummaryByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        }))
      : Promise.resolve(new Map<string, QueueSummaryDTO>()),
    isTechnicalFlow
      ? dashboardStep("technicalQueue", () => loadTechnicalQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        }))
      : Promise.resolve(new Map<string, number>()),
    isPaymentFlow
      ? dashboardStep("paymentQueue", () => loadPaymentQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItemIds,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        }))
      : Promise.resolve(new Map<string, number>()),
    dashboardStep("activitySummary", () => loadActivitySummaryByTaskItem(db, taskItemIds)),
    dashboardStep("rollover", () => loadRolloverOutByTaskItem(db, {
      taskId: cycle.task.id,
      taskItemIds,
    })),
    dashboardStep("identityPreviews", () => loadWorkspaceIdentityPreviewMap({
      db,
      taskId: cycle.task.id,
      taskItems: taskItems.filter((item) => identityPreviewTaskItemIdSet.has(item.id)),
    })),
    isTechnicalFlow || isServiceRequestCaseMode
      ? dashboardStep("technicalRollup", () => loadTechnicalServiceRequestRollupByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
        }))
      : Promise.resolve(new Map<string, TechnicalServiceRequestRollup>()),
    isTechnicalFlow && input.includeTechnicalBoard !== false
      ? dashboardStep("technicalBoard", () => loadTechnicalIssueBoard({
          db,
          taskId: cycle.task.id,
          viewerUserId: getAuthUserId(input.auth),
        }))
      : Promise.resolve(null),
    dashboardStep("users", () => db.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    })),
    isPaymentFlow && input.includeDashboardDetails !== false
      ? dashboardStep("paymentCashFlow", () => db.payment.findMany({
          where: { status: { in: [PaymentStatus.PAID, PaymentStatus.COLLECTED] } },
          select: { amount: true, direction: true, paidAt: true, createdAt: true },
        }).then(paymentCashFlowPeriods))
      : Promise.resolve(null),
    isMediaFlow && input.includeMediaBoard !== false
      ? dashboardStep("mediaBoard", () => loadMediaBoard({ db, taskId: cycle.task.id, viewerUserId: getAuthUserId(input.auth) }))
      : Promise.resolve(null),
  ]);
  const feedbackCountByTaskItem = activitySummary.feedbackCounts;
  const lastActivityMap = activitySummary.lastActivities;

  const queueCountByTaskItem = new Map(
    queueRows
      .filter((row) => row.taskItemId)
      .map((row) => [row.taskItemId as string, row._count._all]),
  );
  for (const [taskItemId, count] of technicalQueueCountByTaskItem) {
    queueCountByTaskItem.set(taskItemId, count);
  }
  for (const [taskItemId, count] of paymentQueueCountByTaskItem) {
    queueCountByTaskItem.set(taskItemId, count);
  }
  const now = new Date();
  const currentUser = authUserSummary(input?.auth);

  const workTickets: CoordinationWorkTicketSummaryDTO[] = taskItems.map((item) => {
    const queueCount = queueCountByTaskItem.get(item.id) ?? 0;
    const feedbackCount = feedbackCountByTaskItem.get(item.id) ?? 0;
    const workspaceRoleMetadata = workspaceRoleMetadataFromNote(item.note);
    const rollover = rolloverOutByTaskItem.get(item.id) ?? null;
    const queueSummary = rollover
      ? emptyQueueSummary()
      :
      input.context === "MEDIA"
        ? mediaQueueSummaryByTaskItem.get(item.id) ?? emptyQueueSummary()
        : technicalServiceRequestRollupByTaskItem.get(item.id)?.queueSummary ??
          (workspaceRoleMetadata.workspaceKind === "FLOW_STAGE_WORKSPACE"
            ? buildFlowStageQueueSummary({
                queueCount,
                feedbackCount,
                flowStageKey: workspaceRoleMetadata.flowStageKey,
                operationWorkspaceRole: workspaceRoleMetadata.operationWorkspaceRole,
                fallbackStatus: item.status,
              })
            : buildQueueSummary({
                queueCount,
                feedbackCount,
                status: item.status,
              }));
    const paymentSummary =
      technicalServiceRequestRollupByTaskItem.get(item.id)?.paymentSummary ?? null;
    const overdue = Boolean(
      item.dueAt && item.dueAt < now && item.status !== TaskStatus.DONE,
    );
    const lastActivity = lastActivityMap.get(item.id);
    const lastActivityAt = lastActivity?.occurredAt ?? null;
    const blueprintIdentity = blueprintIdentityFromNote(item.note);
    return {
      id: item.id,
      title: item.title,
      identityPreview: identityPreviewMap.get(item.id) ?? null,
      creatorLabel: ticketCreator(item, currentUser).label,
      creator: ticketCreator(item, currentUser),
      queueSummary,
      paymentSummary,
      rollover,
      needAttention: rollover ? false : feedbackCount > 0 || overdue,
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
  const currentWeek = getWeekRange(new Date());
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
      currentPeriodKey: currentWeek.periodKey,
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
    paymentCashFlow,
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
    mediaBoard,
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
