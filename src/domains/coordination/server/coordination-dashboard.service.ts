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
import {
  getQueueItemWorkflowState,
  listAvailableManualTransitionsForQueueItem,
  resolveBindingWorkflowDefinition,
} from "@/domains/task/server/business-binding-workflow.service";
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
import { resolveProductDisplayImage } from "@/domains/shared/media/server/display-image";
import { getBusinessEventDefinition } from "@/domains/event/registry/business-event-registry";
import { getAuthUserId } from "@/domains/task/server/core/task.service";
import {
  isPaymentCollectionSettledStatus,
  listPaymentCollectionQueueItems,
  listTaskItemQueueItems,
  mapProductPostTargets,
  resolveMediaWorkProgressFromMetadata,
} from "@/domains/task/server/business-binding.service";
import type { CoordinationFlowListItemDTO } from "./coordination-dashboard.types";
import {
  listShipmentOperationQueueProjection,
  type ShipmentOperationStage,
} from "@/domains/projection/server/shipment-operation-queue.projection";
import {
  listTechnicalIssueBoardWorkspaceProjection,
  type TechnicalIssueBoardStage,
} from "@/domains/projection/server/technical-issue-board.projection";
import {
  hasPaymentListProjectionRows,
  listSettledPaymentCashFlowProjection,
} from "@/domains/projection/server/payment-list.projection";
import {
  queryMediaOperationBoardProjection,
  type MediaOperationBoardStage,
} from "@/domains/projection/server/media-operation-board.projection";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import {
  buildCoordinationWorkspaceSummaryRow,
  queryCoordinationWorkspaceSummary,
} from "@/domains/projection/server/coordination-workspace-summary.projection";
import {
  operationalBlueprintForWorkType,
  selectOperationalActionsForWorkspaceRole,
} from "@/domains/blueprint/shared/operational-blueprint";
import { assertCoordinationCycleScope } from "./coordination-cycle-scope.service";

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

function imageUrlFromServiceRequest(serviceRequest?: {
  primaryImageUrlSnapshot?: string | null;
  product?: {
    primaryImageUrl?: string | null;
    storefrontImageKey?: string | null;
    productImage?: Array<{ fileKey?: string | null }> | null;
  } | null;
} | null) {
  return resolveProductDisplayImage(
    serviceRequest?.product,
    serviceRequest?.primaryImageUrlSnapshot,
  );
}

async function loadLatestFlowEventSignals(
  db: DB,
  items: CoordinationFlowListItemDTO[],
) {
  const targets = Array.from(
    new Map(
      items.map((item) => [
        `${String(item.targetType).toUpperCase()}:${item.targetId}`,
        {
          targetType: String(item.targetType).toUpperCase(),
          targetId: item.targetId,
        },
      ]),
    ).values(),
  );
  if (!targets.length) return new Map<string, {
    title: string;
    occurredAt: string;
    actor: { label: string; avatarUrl: string | null; isSystem: boolean };
  }>();

  const [events, activities] = await Promise.all([
    db.businessEventLog.findMany({
      where: { OR: targets },
      orderBy: { createdAt: "desc" },
      select: {
        eventKey: true,
        targetType: true,
        targetId: true,
        actorUserId: true,
        createdAt: true,
      },
    }),
    db.taskItemActivity.findMany({
      where: {
        taskItemId: {
          in: Array.from(new Set(items.map((item) => item.taskItemId).filter(Boolean))),
        },
      },
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      take: Math.max(100, items.length * 10),
      select: {
        title: true,
        occurredAt: true,
        metadataJson: true,
        actorUser: {
          select: { name: true, email: true, avatarUrl: true },
        },
      },
    }),
  ]);
  const latestByTarget = new Map<string, (typeof events)[number]>();
  for (const event of events) {
    const key = `${event.targetType.toUpperCase()}:${event.targetId}`;
    if (!latestByTarget.has(key)) latestByTarget.set(key, event);
  }
  const actorIds = Array.from(
    new Set(
      [...latestByTarget.values()]
        .map((event) => event.actorUserId)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const actors = actorIds.length
    ? await db.user.findMany({
        where: { id: { in: actorIds } },
        select: { id: true, name: true, email: true, avatarUrl: true },
      })
    : [];
  const actorById = new Map(actors.map((actor) => [actor.id, actor]));
  const activityByTarget = new Map<string, (typeof activities)[number]>();
  for (const activity of activities) {
    const metadata = activity.metadataJson;
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) continue;
    const target = metadata as { targetType?: unknown; targetId?: unknown };
    const key = `${String(target.targetType ?? "").toUpperCase()}:${String(target.targetId ?? "")}`;
    if (!activityByTarget.has(key)) activityByTarget.set(key, activity);
  }

  return new Map(
    [...latestByTarget.entries()].map(([key, event]) => {
      const activity = activityByTarget.get(key);
      const eventActor = event.actorUserId ? actorById.get(event.actorUserId) : null;
      const actor = activity?.actorUser ?? eventActor ?? null;
      const definition = getBusinessEventDefinition(event.eventKey);
      return [
        key,
        {
          title: activity?.title ?? definition?.label ?? event.eventKey,
          occurredAt: (activity?.occurredAt ?? event.createdAt).toISOString(),
          actor: {
            label: actor?.name ?? actor?.email ?? "Hệ thống",
            avatarUrl: actor?.avatarUrl ?? null,
            isSystem: !actor,
          },
        },
      ];
    }),
  );
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

function overdueCalendarDays(
  expectedCompletionAt?: Date | string | null,
  completedAt?: Date | string | null,
) {
  if (!expectedCompletionAt || !completedAt) return null;
  const expected = new Date(expectedCompletionAt);
  const completed = new Date(completedAt);
  if (Number.isNaN(expected.getTime()) || Number.isNaN(completed.getTime())) return null;
  expected.setHours(0, 0, 0, 0);
  completed.setHours(0, 0, 0, 0);
  return Math.max(
    0,
    Math.round((completed.getTime() - expected.getTime()) / 86_400_000),
  );
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
  taskItems: Array<{ id: string; note: string | null }>;
}) {
  const counts = new Map<string, number>();
  const reviewTaskItemId = input.taskItems.find(
    (item) => paymentWorkspaceRole(item.note) === "PAYMENT_REVIEW",
  )?.id;
  const settledTaskItemId = input.taskItems.find(
    (item) => paymentWorkspaceRole(item.note) === "PAYMENT_SETTLED",
  )?.id;
  if (!reviewTaskItemId || !settledTaskItemId) return counts;

  const paymentCounts = await input.db.payment.groupBy({
    by: ["status"],
    where: { amount: { gt: 0 } },
    _count: { _all: true },
  });
  for (const row of paymentCounts) {
    const taskItemId = isPaymentCollectionSettledStatus(row.status)
      ? settledTaskItemId
      : reviewTaskItemId;
    counts.set(taskItemId, (counts.get(taskItemId) ?? 0) + row._count._all);
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

async function loadMediaBoardFromProjection(input: {
  db: DB;
  taskId: string;
  viewerUserId?: string | null;
  stage?: string | null;
  page?: number;
  pageSize?: number;
  doneRetentionDays?: number | null;
}) {
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.trunc(input.pageSize ?? 20)));
  const stages: MediaOperationBoardStage[] = ["PHOTOGRAPHY", "MEDIA_PROCESSING", "PUBLISH", "DONE"];
  const requestedStage = stages.find((stage) => stage === normalizeStatus(input.stage));
  const projection = await queryMediaOperationBoardProjection(input.db, {
    requestedStage,
    page,
    pageSize,
    doneRetentionDays: input.doneRetentionDays,
  });
  const total = stages.reduce((sum, stage) => sum + (projection.totals.get(stage) ?? 0), 0);
  if (!total) return null;
  const taskItemIds = projection.rows.map((row) => row.workspaceTaskItemId).filter(Boolean);
  const activities = input.viewerUserId && taskItemIds.length
    ? await input.db.taskItemActivity.findMany({
        where: { taskItemId: { in: taskItemIds } },
        select: {
          metadataJson: true,
          replies: { select: { metadataJson: true } },
        },
      })
    : [];
  const mentions = new Map<string, number>();
  const unread = new Map<string, number>();
  for (const activity of activities) {
    const metadata = activity.metadataJson;
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata) || !input.viewerUserId) continue;
    const target = metadata as {
      targetType?: unknown;
      targetId?: unknown;
      mentionedUserIds?: unknown;
      mentionReadByUserIds?: unknown;
    };
    if (String(target.targetType ?? "").trim() !== "WATCH") continue;
    const watchId = String(target.targetId ?? "").trim();
    if (!watchId) continue;
    const directMentionIds = Array.isArray(target.mentionedUserIds) ? target.mentionedUserIds.map(String) : [];
    const directReadIds = Array.isArray(target.mentionReadByUserIds) ? target.mentionReadByUserIds.map(String) : [];
    let mentionCount = directMentionIds.includes(input.viewerUserId) ? 1 : 0;
    let unreadCount = mentionCount && !directReadIds.includes(input.viewerUserId) ? 1 : 0;
    for (const reply of activity.replies) {
      const replyMetadata = reply.metadataJson;
      if (!replyMetadata || typeof replyMetadata !== "object" || Array.isArray(replyMetadata)) continue;
      const value = replyMetadata as { mentionedUserIds?: unknown; mentionReadByUserIds?: unknown };
      const mentionIds = Array.isArray(value.mentionedUserIds) ? value.mentionedUserIds.map(String) : [];
      const readIds = Array.isArray(value.mentionReadByUserIds) ? value.mentionReadByUserIds.map(String) : [];
      if (mentionIds.includes(input.viewerUserId)) {
        mentionCount += 1;
        if (!readIds.includes(input.viewerUserId)) unreadCount += 1;
      }
    }
    mentions.set(watchId, (mentions.get(watchId) ?? 0) + mentionCount);
    unread.set(watchId, (unread.get(watchId) ?? 0) + unreadCount);
  }
  const items: CoordinationMediaBoardItemDTO[] = projection.rows.map((row) => ({
    ...row,
    mentionedMeCount: mentions.get(row.id) ?? 0,
    unreadMentionCount: unread.get(row.id) ?? 0,
  }));
  const columnPagination = Object.fromEntries(stages.map((stage) => {
    const stageTotal = projection.totals.get(stage) ?? 0;
    const loaded = requestedStage === stage
      ? Math.min(stageTotal, page * pageSize)
      : Math.min(stageTotal, pageSize);
    return [stage, {
      loaded,
      total: stageTotal,
      hasMore: loaded < stageTotal,
      nextPage: loaded < stageTotal ? Math.floor(loaded / pageSize) + 1 : null,
    }];
  }));
  return { items, columnPagination };
}

async function loadMediaBoardLive(input: {
  db: DB;
  taskId: string;
  viewerUserId?: string | null;
  stage?: string | null;
  page?: number;
  pageSize?: number;
}) {
  const bindings = await input.db.taskExecution.findMany({
    where: {
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
  if (!watchIds.length) return {
    items: [] as CoordinationMediaBoardItemDTO[],
    columnPagination: {},
  };

  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.trunc(input.pageSize ?? 20)));
  const stages = ["PHOTOGRAPHY", "MEDIA_PROCESSING", "PUBLISH", "DONE"] as const;
  const requestedStage = stages.find((stage) => stage === normalizeStatus(input.stage));
  const stageForBinding = (
    binding: (typeof bindings)[number],
    watch?: {
      saleStage: unknown;
      isContentDownloaded: boolean;
      isImageDownloaded: boolean;
    },
  ) => {
    const workType = mediaStageFromWorkTypeKey(ticketWorkTypeKey(binding.taskItem?.note));
    const runtime = getQueueItemWorkflowState({ metadataJson: binding.metadataJson });
    const saleStage = normalizeStatus(watch?.saleStage);
    const businessDone =
      ["DONE", "POSTED", "SOLD", "CONSIGNED_TO", "CANCELED", "CANCELLED"].includes(saleStage);
    if (workType === "photography") {
      return runtime?.currentState === "DONE"
        ? "MEDIA_PROCESSING" as const
        : "PHOTOGRAPHY" as const;
    }
    if (workType === "media-processing") {
      return runtime?.currentState === "DONE"
        ? "PUBLISH" as const
        : "MEDIA_PROCESSING" as const;
    }
    return businessDone ||
        runtime?.currentState === "DONE" ||
        runtime?.currentState === "CANCELLED"
      ? "DONE" as const
      : "PUBLISH" as const;
  };
  const watchOrderRows = await input.db.watch.findMany({
    where: { id: { in: watchIds } },
    select: {
      id: true,
      productId: true,
      updatedAt: true,
      saleStage: true,
      isContentDownloaded: true,
      isImageDownloaded: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  const watchStateById = new Map(watchOrderRows.map((watch) => [watch.id, watch]));
  const watchIdsByStage = new Map(stages.map((stage) => [stage, [] as string[]]));
  for (const watch of watchOrderRows) {
    const binding = bindingByWatchId.get(watch.id);
    if (binding) watchIdsByStage.get(stageForBinding(binding, watch))?.push(watch.id);
  }
  const columnPagination = Object.fromEntries(stages.map((stage) => {
    const total = watchIdsByStage.get(stage)?.length ?? 0;
    const loaded = requestedStage === stage
      ? Math.min(total, page * pageSize)
      : Math.min(total, pageSize);
    return [stage, {
      loaded,
      total,
      hasMore: loaded < total,
      nextPage: loaded < total ? Math.floor(loaded / pageSize) + 1 : null,
    }];
  }));
  const selectedWatchIds = requestedStage
    ? (watchIdsByStage.get(requestedStage) ?? [])
        .slice((page - 1) * pageSize, page * pageSize)
    : stages.flatMap((stage) =>
        (watchIdsByStage.get(stage) ?? []).slice(0, pageSize)
      );
  const selectedBindings = selectedWatchIds
    .map((id) => bindingByWatchId.get(id))
    .filter((binding): binding is (typeof bindings)[number] => Boolean(binding));
  const [watches, discussionActivities] = await Promise.all([
    input.db.watch.findMany({
      where: { id: { in: selectedWatchIds } },
      select: {
        id: true,
        productId: true,
        updatedAt: true,
        product: {
          select: {
            title: true,
            sku: true,
            primaryImageUrl: true,
            postTargets: {
              select: {
                postTarget: {
                  select: { id: true, name: true, platform: true },
                },
              },
            },
          },
        },
      },
    }),
    input.db.taskItemActivity.findMany({
      where: { taskItemId: { in: selectedBindings.map((binding) => binding.taskItemId).filter((id): id is string => Boolean(id)) } },
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
    const runtime = getQueueItemWorkflowState({ metadataJson: binding.metadataJson });
    const workflowDefinition = resolveBindingWorkflowDefinition(binding.metadataJson);
    const stage = stageForBinding(binding, watchStateById.get(watch.id));
    const bindingStage = mediaStageFromWorkTypeKey(
      ticketWorkTypeKey(binding.taskItem?.note),
    );
    const transitionedToNextStage =
      Boolean(bindingStage) &&
      normalizeStatus(bindingStage) !== normalizeStatus(stage);
    const publishState =
      watchStateById.get(watch.id)?.isContentDownloaded ||
      watchStateById.get(watch.id)?.isImageDownloaded
        ? "ASSETS_DOWNLOADED"
        : "NEW";
    const visibleWorkflowState =
      stage === "DONE"
        ? "DONE"
        : stage === "PUBLISH"
          ? publishState
          : transitionedToNextStage
            ? "NEW"
            : runtime?.currentState ?? null;
    const actorLabel = userLabel(binding.createdByUser);
    const bindingMetadata = asRecord(binding.metadataJson);
    return {
      id: watch.id,
      productId: watch.productId,
      bindingId: binding.id,
      workspaceTaskItemId: binding.taskItemId!,
      title: watch.product?.title ?? "Watch",
      sku: watch.product?.sku ?? null,
      imageUrl: watch.product?.primaryImageUrl ?? null,
      stage,
      workflowKey: transitionedToNextStage ? null : runtime?.workflowKey ?? null,
      workflowState: visibleWorkflowState,
      reshootNote: String(bindingMetadata.reshootNote ?? "").trim() || null,
      mediaWorkProgress: transitionedToNextStage || stage === "PUBLISH"
        ? null
        : resolveMediaWorkProgressFromMetadata(bindingMetadata),
      postTargets: mapProductPostTargets(watch.product),
      manualTransitions: transitionedToNextStage
        ? []
        : listAvailableManualTransitionsForQueueItem({
            workflowDefinition,
            currentState: runtime?.currentState ?? null,
          }),
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
  return { items, columnPagination };
}

async function loadMediaBoard(input: {
  db: DB;
  taskId: string;
  viewerUserId?: string | null;
  stage?: string | null;
  page?: number;
  pageSize?: number;
  doneRetentionDays?: number | null;
}) {
  try {
    const projection = await loadMediaBoardFromProjection(input);
    if (projection) return projection;
  } catch (error) {
    console.warn("[coordination-dashboard] media board projection unavailable; using live fallback", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
  return loadMediaBoardLive(input);
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

async function loadTechnicalIssueBoardFromProjection(input: {
  db: DB;
  taskId: string;
  viewerUserId?: string | null;
  stage?: string | null;
  page?: number;
  pageSize?: number;
  includeOptions?: boolean;
  doneRetentionDays?: number | null;
}) {
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.trunc(input.pageSize ?? 10)));
  const stages: TechnicalIssueBoardStage[] = ["INSPECT", "READY", "PROCESSING", "DONE"];
  const requestedStage = stages.find((stage) => stage === normalizeStatus(input.stage));
  const projectionResult = await listTechnicalIssueBoardWorkspaceProjection(input.db, {
    requestedStage,
    page,
    pageSize,
    doneRetentionDays: input.doneRetentionDays,
  });
  const projectionTotal = stages.reduce(
    (sum, stage) => sum + (projectionResult.totals.get(stage) ?? 0),
    0,
  );
  if (!projectionTotal) return null;

  const selectedRows = projectionResult.rows;
  const taskItemIds = selectedRows
    .map((row) => row.workspaceTaskItemId)
    .filter((id): id is string => Boolean(id));
  const activities = input.viewerUserId && taskItemIds.length
    ? await input.db.taskItemActivity.findMany({
        where: { taskItemId: { in: taskItemIds } },
        select: {
          metadataJson: true,
          replies: { select: { metadataJson: true } },
        },
      })
    : [];
  const mentionedByIssueId = new Map<string, number>();
  const unreadByIssueId = new Map<string, number>();
  for (const activity of activities) {
    if (!activity.metadataJson || typeof activity.metadataJson !== "object" || Array.isArray(activity.metadataJson)) continue;
    const metadata = activity.metadataJson as {
      targetType?: unknown;
      targetId?: unknown;
      mentionedUserIds?: unknown;
      mentionReadByUserIds?: unknown;
    };
    if (String(metadata.targetType ?? "") !== "TECHNICAL_ISSUE") continue;
    const issueId = String(metadata.targetId ?? "").trim();
    if (!issueId || !input.viewerUserId) continue;
    const mentionedIds = Array.isArray(metadata.mentionedUserIds) ? metadata.mentionedUserIds.map(String) : [];
    const readIds = Array.isArray(metadata.mentionReadByUserIds) ? metadata.mentionReadByUserIds.map(String) : [];
    let mentioned = mentionedIds.includes(input.viewerUserId) ? 1 : 0;
    let unread = mentioned && !readIds.includes(input.viewerUserId) ? 1 : 0;
    for (const reply of activity.replies) {
      if (!reply.metadataJson || typeof reply.metadataJson !== "object" || Array.isArray(reply.metadataJson)) continue;
      const replyMetadata = reply.metadataJson as {
        mentionedUserIds?: unknown;
        mentionReadByUserIds?: unknown;
      };
      const replyMentionedIds = Array.isArray(replyMetadata.mentionedUserIds)
        ? replyMetadata.mentionedUserIds.map(String)
        : [];
      const replyReadIds = Array.isArray(replyMetadata.mentionReadByUserIds)
        ? replyMetadata.mentionReadByUserIds.map(String)
        : [];
      if (replyMentionedIds.includes(input.viewerUserId)) {
        mentioned += 1;
        if (!replyReadIds.includes(input.viewerUserId)) unread += 1;
      }
    }
    mentionedByIssueId.set(issueId, (mentionedByIssueId.get(issueId) ?? 0) + mentioned);
    unreadByIssueId.set(issueId, (unreadByIssueId.get(issueId) ?? 0) + unread);
  }

  const [vendorOptions, technicalDetailCatalogOptions] = input.includeOptions === false
    ? [[], []]
    : await Promise.all([
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
  const items: CoordinationTechnicalIssueBoardItemDTO[] = selectedRows.map((row) => ({
    ...row,
    mentionedMeCount: mentionedByIssueId.get(row.id) ?? 0,
    unreadMentionCount: unreadByIssueId.get(row.id) ?? 0,
  }));
  const columnPagination = Object.fromEntries(stages.map((stage) => {
    const total = projectionResult.totals.get(stage) ?? 0;
    const loaded = requestedStage === stage
      ? Math.min(total, page * pageSize)
      : Math.min(total, pageSize);
    return [stage, {
      loaded,
      total,
      hasMore: loaded < total,
      nextPage: loaded < total ? Math.floor(loaded / pageSize) + 1 : null,
    }];
  }));
  return { items, vendorOptions, technicalDetailCatalogOptions, columnPagination };
}

async function loadTechnicalIssueBoardLive(input: {
  db: DB;
  taskId: string;
  viewerUserId?: string | null;
  stage?: string | null;
  page?: number;
  pageSize?: number;
}) {
  const bindings = await input.db.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
      taskItemId: { not: null },
    },
    select: {
      targetId: true,
      taskItemId: true,
      actionType: true,
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
    if (binding.actionType === TaskExecutionActionType.CANCELLED) continue;
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
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
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
        taskItem: { select: { note: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!issueIds.length) return {
    items: [],
    vendorOptions,
    technicalDetailCatalogOptions,
    columnPagination: {},
  };

  const srCaseTaskItemIdByServiceRequestId = new Map<string, string>();
  const serviceRequestActorById = new Map<string, {
    label: string;
    avatarUrl: string | null;
    isSystem: boolean;
  }>();
  for (const binding of serviceRequestBindings) {
    if (!serviceRequestActorById.has(binding.targetId)) {
      const label = userLabel(binding.createdByUser);
      if (label !== "-") {
        serviceRequestActorById.set(binding.targetId, {
          label,
          avatarUrl: binding.createdByUser?.avatarUrl ?? null,
          isSystem: false,
        });
      }
    }
    if (!binding.taskItemId || srCaseTaskItemIdByServiceRequestId.has(binding.targetId)) continue;
    const metadata = workspaceRoleMetadataFromNote(binding.taskItem?.note ?? null);
    if (metadata.workspaceRole && metadata.workspaceRole !== "SR_CASE") continue;
    srCaseTaskItemIdByServiceRequestId.set(binding.targetId, binding.taskItemId);
  }

  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.trunc(input.pageSize ?? 10)));
  const stages = ["INSPECT", "READY", "PROCESSING", "DONE"] as const;
  const requestedStage = stages.find((stage) => stage === normalizeStatus(input.stage));
  const issueStageRows = await input.db.technicalIssue.findMany({
    where: { id: { in: issueIds } },
    select: {
      id: true,
      executionStatus: true,
      isConfirmed: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  const issueIdsByStage = new Map(stages.map((stage) => [stage, [] as string[]]));
  for (const issue of issueStageRows) {
    const binding = bindingByIssueId.get(issue.id);
    const stage = technicalIssueBoardStage({
      flowStageKey: binding?.flowStageKey ?? null,
      executionStatus: issue.executionStatus,
      isConfirmed: issue.isConfirmed,
    });
    issueIdsByStage.get(stage)?.push(issue.id);
  }
  const columnPagination = Object.fromEntries(stages.map((stage) => {
    const total = issueIdsByStage.get(stage)?.length ?? 0;
    const loaded = requestedStage === stage
      ? Math.min(total, page * pageSize)
      : Math.min(total, pageSize);
    return [stage, {
      loaded,
      total,
      hasMore: loaded < total,
      nextPage: loaded < total ? Math.floor(loaded / pageSize) + 1 : null,
    }];
  }));
  const selectedIssueIds = requestedStage
    ? (issueIdsByStage.get(requestedStage) ?? [])
        .slice((page - 1) * pageSize, page * pageSize)
    : stages.flatMap((stage) =>
        (issueIdsByStage.get(stage) ?? []).slice(0, pageSize)
      );
  const selectedTaskItemIds = selectedIssueIds
    .map((id) => bindingByIssueId.get(id)?.taskItemId)
    .filter((id): id is string => Boolean(id));
  const [issues, startedEvents, discussionActivities] = await Promise.all([input.db.technicalIssue.findMany({
    where: { id: { in: selectedIssueIds } },
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
      targetId: { in: selectedIssueIds },
    },
    select: { targetId: true, metadataJson: true },
  }), input.db.taskItemActivity.findMany({
    where: {
      taskItemId: { in: selectedTaskItemIds },
    },
    select: {
      sourceType: true,
      occurredAt: true,
      metadataJson: true,
      actorUser: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      replies: { select: { metadataJson: true } },
      _count: { select: { replies: true } },
    },
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
  })]);
  const unresolvedServiceRequestIds = Array.from(
    new Set(
      issues
        .map((issue) => issue.serviceRequestId)
        .filter((id) => !serviceRequestActorById.has(id)),
    ),
  );
  if (unresolvedServiceRequestIds.length) {
    const serviceRequestEvents = await input.db.businessEventLog.findMany({
      where: {
        eventKey: "service_request.created",
        targetType: "SERVICE_REQUEST",
        targetId: { in: unresolvedServiceRequestIds },
        actorUserId: { not: null },
      },
      select: {
        targetId: true,
        actorUserId: true,
      },
    });
    const actorIds = Array.from(
      new Set(
        serviceRequestEvents
          .map((event) => event.actorUserId)
          .filter((id): id is string => Boolean(id)),
      ),
    );
    const actors = actorIds.length
      ? await input.db.user.findMany({
          where: { id: { in: actorIds } },
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        })
      : [];
    const actorById = new Map(actors.map((actor) => [actor.id, actor]));

    for (const event of serviceRequestEvents) {
      if (!event.actorUserId) continue;
      const actor = actorById.get(event.actorUserId);
      const label = userLabel(actor);
      if (label === "-") continue;
      serviceRequestActorById.set(event.targetId, {
        label,
        avatarUrl: actor?.avatarUrl ?? null,
        isSystem: false,
      });
    }
  }
  const startedEventByIssueId = new Map(startedEvents.map((event) => [event.targetId, event.metadataJson]));
  const commentCountByIssueId = new Map<string, number>();
  const mentionedMeCountByIssueId = new Map<string, number>();
  const unreadMentionCountByIssueId = new Map<string, number>();
  const lastUpdateByIssueId = new Map<string, {
    label: string;
    avatarUrl: string | null;
    isSystem: boolean;
    occurredAt: Date;
  }>();
  for (const activity of discussionActivities) {
    if (!activity.metadataJson || typeof activity.metadataJson !== "object" || Array.isArray(activity.metadataJson)) continue;
    const metadata = activity.metadataJson as { targetType?: unknown; targetId?: unknown; mentionedUserIds?: unknown; mentionReadByUserIds?: unknown };
    if (String(metadata.targetType ?? "") !== "TECHNICAL_ISSUE") continue;
    const targetId = String(metadata.targetId ?? "").trim();
    if (!targetId) continue;
    if (
      String(activity.sourceType) !== "DISCUSSION" &&
      !lastUpdateByIssueId.has(targetId)
    ) {
      const label = userLabel(activity.actorUser);
      lastUpdateByIssueId.set(targetId, {
        label: label === "-" ? "Hệ thống" : label,
        avatarUrl: activity.actorUser?.avatarUrl ?? null,
        isSystem: label === "-",
        occurredAt: activity.occurredAt,
      });
    }
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
      const lastUpdate = lastUpdateByIssueId.get(issue.id);
      const bindingActor = binding?.lastUpdatedBy;
      const serviceRequestActor = serviceRequestActorById.get(issue.serviceRequestId);
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
        expectedWorkingDays: issue.expectedWorkingDays ?? null,
        expectedCompletionAt: formatDateTime(issue.expectedCompletionAt),
        completedAt: formatDateTime(issue.completedAt),
        overdueDays: overdueCalendarDays(
          issue.expectedCompletionAt,
          issue.completedAt,
        ),
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
        updatedAt: formatDateTime(lastUpdate?.occurredAt ?? issue.updatedAt),
        lastUpdatedBy: lastUpdate && !lastUpdate.isSystem
          ? {
              label: lastUpdate.label,
              avatarUrl: lastUpdate.avatarUrl,
              isSystem: lastUpdate.isSystem,
            }
          : bindingActor && !bindingActor.isSystem
            ? bindingActor
            : serviceRequestActor ?? bindingActor ?? (lastUpdate ? {
                label: lastUpdate.label,
                avatarUrl: lastUpdate.avatarUrl,
                isSystem: lastUpdate.isSystem,
              } : {
                label: "Hệ thống",
                avatarUrl: null,
                isSystem: true,
              }),
        workspaceTaskItemId: binding?.taskItemId ?? null,
        srCaseTaskItemId: srCaseTaskItemIdByServiceRequestId.get(issue.serviceRequestId) ?? null,
        serviceRequest: {
          refNo: issue.serviceRequest?.refNo ?? null,
          productTitle: issue.serviceRequest?.product?.title ?? null,
          sku:
            issue.serviceRequest?.skuSnapshot ??
            issue.serviceRequest?.product?.sku ??
            null,
          imageUrl: imageUrlFromServiceRequest(issue.serviceRequest),
        },
      };
    })
    .sort((left, right) => {
      const stageOrder = { INSPECT: 0, READY: 1, PROCESSING: 2, DONE: 3 };
      const stageDiff = stageOrder[left.stage] - stageOrder[right.stage];
      if (stageDiff !== 0) return stageDiff;
      return String(right.updatedAt ?? "").localeCompare(String(left.updatedAt ?? ""));
    });

  return {
    items,
    vendorOptions,
    technicalDetailCatalogOptions,
    columnPagination,
  };
}

async function loadTechnicalIssueBoard(input: {
  db: DB;
  taskId: string;
  viewerUserId?: string | null;
  stage?: string | null;
  page?: number;
  pageSize?: number;
  includeOptions?: boolean;
  doneRetentionDays?: number | null;
}) {
  try {
    const projection = await loadTechnicalIssueBoardFromProjection(input);
    if (projection) return projection;
  } catch (error) {
    console.warn("[coordination-dashboard] technical issue projection unavailable; using live fallback", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
  return loadTechnicalIssueBoardLive(input);
}

export type CoordinationBoardKey = "technical-issue" | "media-operation";

export async function getCoordinationBoard(input: {
  db?: DB;
  boardKey: CoordinationBoardKey;
  taskId: string;
  auth?: unknown;
  stage?: string | null;
  page?: number;
  pageSize?: number;
  doneRetentionDays?: number | null;
}) {
  const db = input.db ?? prisma;
  const taskId = String(input.taskId ?? "").trim();
  if (!taskId) throw new Error("COORDINATION_BOARD_TASK_ID_REQUIRED");
  await dashboardStep("boardCycleScope", () =>
    assertCoordinationCycleScope({
      db,
      context: "OPERATION",
      taskId,
    }));

  const query = {
    db,
    taskId,
    viewerUserId: getAuthUserId(input.auth),
    stage: input.stage,
    page: input.page,
    pageSize: input.pageSize,
    doneRetentionDays: input.doneRetentionDays,
  };

  if (input.boardKey === "technical-issue") {
    await dashboardStep("technicalBoardProjectionReady", () =>
      ensureProjectionReady(db, "technical-issue-board"));
    return dashboardStep("technicalBoardQuery", () =>
      loadTechnicalIssueBoard(query));
  }
  if (input.boardKey === "media-operation") {
    await dashboardStep("mediaBoardProjectionReady", () =>
      ensureProjectionReady(db, "media-operation-board"));
    return dashboardStep("mediaBoardQuery", () =>
      loadMediaBoard(query));
  }
  throw new Error("COORDINATION_BOARD_NOT_SUPPORTED");
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
        imageUrl: imageUrlFromServiceRequest(row),
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
  boardStage?: string | null;
  boardPage?: number | null;
  boardPageSize?: number | null;
  includeFlowItems?: boolean;
  flowStageKey?: string | null;
  flowPage?: number | null;
  flowPageSize?: number | null;
  flowQuery?: string | null;
  flowStatus?: string | null;
  flowPaymentStatus?: string | null;
  flowPaymentType?: string | null;
  flowPaymentDirection?: string | null;
  flowSort?: string | null;
  doneRetentionDays?: number | null;
  includeManagementDetails?: boolean;
  includeWorkspaceSummaries?: boolean;
  cycleTaskId?: string | null;
  auth?: unknown;
}): Promise<CoordinationDashboardDTO> {
  const db = input?.db ?? prisma;
  const flowPage = Math.max(1, Math.trunc(input.flowPage ?? 1));
  const flowPageSize = Math.min(100, Math.max(10, Math.trunc(input.flowPageSize ?? 20)));
  const flowQuery = String(input.flowQuery ?? "").trim().toLocaleLowerCase("vi");
  const flowStatus = normalizeStatus(input.flowStatus);
  const flowPaymentStatus = normalizeStatus(input.flowPaymentStatus);
  const flowPaymentType = normalizeStatus(input.flowPaymentType);
  const flowPaymentDirection = normalizeStatus(input.flowPaymentDirection);
  const flowSort = normalizeStatus(input.flowSort) || "UPDATED_DESC";
  const hasFlowFilters = Boolean(
    flowQuery ||
    (flowStatus && flowStatus !== "ALL") ||
    (flowPaymentStatus && flowPaymentStatus !== "ALL") ||
    (flowPaymentType && flowPaymentType !== "ALL") ||
    (flowPaymentDirection && flowPaymentDirection !== "ALL") ||
    flowSort !== "UPDATED_DESC"
  );
  const selectedDate = parseDateInput(input?.date);
  const trustedCycleTaskId = String(input.cycleTaskId ?? "").trim();
  const cycle = trustedCycleTaskId
    ? {
        task: {
          id: trustedCycleTaskId,
          title: "",
          description: `Coordination Space ${input.context}`,
          source: "SYSTEM",
          kind: "COORDINATION",
          periodType: "WEEK",
          periodKey: getWeekRange(selectedDate).periodKey,
          status: "IN_PROGRESS",
        },
        referenceRange: getWeekRange(selectedDate),
        context: input.context,
        created: false,
        workTickets: [],
        workTicketsCreated: 0,
      }
    : await dashboardStep("ensureCycle", () => ensureCoordinationCycle(db, {
        context: input.context,
        date: selectedDate,
        provisionWorkTickets: false,
      }));

  const earlyViewConfig = getSpaceViewConfig(input.context);
  const earlyMode = earlyViewConfig.modes.find((mode) => mode.key === input.modeKey);
  const earlyFlow = earlyMode?.coreFlowKey
    ? earlyViewConfig.coreFlows?.find((flow) => flow.key === earlyMode.coreFlowKey)
    : null;
  const projectionFlowNeedsNoWorkspaceShell =
    input.includeFlowItems !== false &&
    input.includeWorkspaceSummaries === false &&
    input.includeDashboardDetails === false &&
    (
      earlyFlow?.key === "technical-issue-flow" ||
      earlyFlow?.key === "media-production-flow"
    );
  const needsTaskItems =
    !projectionFlowNeedsNoWorkspaceShell && (
      input.includeWorkspaceSummaries !== false ||
      input.includeFlowItems !== false ||
      input.includeManagementDetails !== false
    );
  let rawTaskItems = needsTaskItems
    ? await dashboardStep("loadTaskItemsProjection", () =>
      queryCoordinationWorkspaceSummary(db, cycle.task.id))
    : [];
  if (needsTaskItems && rawTaskItems.length === 0) {
    rawTaskItems = await dashboardStep("loadTaskItemsSource", () => db.taskItem.findMany({
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
    await dashboardStep("seedTaskItemsProjection", async () => {
      for (let index = 0; index < rawTaskItems.length; index += 20) {
        await Promise.all(
          rawTaskItems.slice(index, index + 20).map((item) =>
            buildCoordinationWorkspaceSummaryRow(db, item.id),
          ),
        );
      }
    });
  }
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
  const isShipmentFlow = activeFlow?.key === "shipment-operation-core-flow";
  const usesGenericFlowItemReader =
    input.includeFlowItems !== false &&
    !isTechnicalFlow &&
    !isMediaFlow &&
    !isPaymentFlow &&
    !isShipmentFlow;
  const isServiceRequestCaseMode = activeMode?.key === "sr-cases";
  const requestedFlowStage =
    activeFlow?.key === "media-production-flow" &&
    normalizeWorkTypeKey(input.flowStageKey ?? "") === "done"
      ? activeFlow.stages.find((stage) =>
          normalizeWorkTypeKey(stage.key).includes("publish") ||
          normalizeWorkTypeKey(stage.workspaceKey).includes("publish")
        ) ?? null
      : activeFlow?.stages.find(
    (stage) =>
      normalizeWorkTypeKey(stage.key) === normalizeWorkTypeKey(input.flowStageKey ?? "") ||
      normalizeWorkTypeKey(stage.workspaceKey) === normalizeWorkTypeKey(input.flowStageKey ?? ""),
  ) ?? activeFlow?.stages[0] ?? null;
  const flowLoadTaskItems = requestedFlowStage
    ? taskItems.filter((item) => {
        const metadata = workspaceRoleMetadataFromNote(item.note);
        const stageKey = normalizeWorkTypeKey(
          metadata.flowStageKey ?? metadata.operationWorkspaceRole ?? ticketWorkTypeKey(item.note) ?? "",
        );
        return (
          stageKey === normalizeWorkTypeKey(requestedFlowStage.key) ||
          stageKey === normalizeWorkTypeKey(requestedFlowStage.workspaceKey)
        );
      })
    : taskItems;
  const shipmentStage: ShipmentOperationStage =
    normalizeStatus(requestedFlowStage?.key).includes("PROCESSING")
      ? "SHIPMENT_PROCESSING"
      : normalizeStatus(requestedFlowStage?.key).includes("DONE")
        ? "SHIPMENT_DONE"
        : "SHIPMENT_WAITING";
  if (input.includeFlowItems !== false && isShipmentFlow) {
    await dashboardStep("shipmentProjectionReady", () =>
      ensureProjectionReady(db, "shipment-operation-queue"));
  }
  if (input.includeFlowItems !== false && isMediaFlow) {
    await dashboardStep("mediaFlowProjectionReady", () =>
      ensureProjectionReady(db, "media-operation-board"));
  }
  if (input.includeFlowItems !== false && isTechnicalFlow) {
    await dashboardStep("technicalFlowProjectionReady", () =>
      ensureProjectionReady(db, "technical-issue-board"));
  }
  const shipmentProjectionPromise =
    input.includeFlowItems !== false && isShipmentFlow
      ? listShipmentOperationQueueProjection(db, {
          stage: shipmentStage,
          page: flowPage,
          pageSize: flowPageSize,
          query: input.flowQuery,
        })
      : null;
  const requestedMediaBoardStage =
    normalizeWorkTypeKey(input.flowStageKey ?? "") === "done"
      ? "DONE"
      : normalizeWorkTypeKey(input.flowStageKey ?? "").includes("publish")
        ? "PUBLISH"
        : normalizeWorkTypeKey(input.flowStageKey ?? "").includes("media")
          ? "MEDIA_PROCESSING"
          : "PHOTOGRAPHY";
  const mediaFlowBoardPromise =
    input.includeFlowItems !== false && isMediaFlow
      ? loadMediaBoard({
          db,
          taskId: cycle.task.id,
          viewerUserId: getAuthUserId(input.auth),
          stage: requestedMediaBoardStage,
          page: flowPage,
          pageSize: flowPageSize,
          doneRetentionDays: input.doneRetentionDays,
        })
      : null;
  const requestedTechnicalBoardStage: TechnicalIssueBoardStage =
    normalizeWorkTypeKey(input.flowStageKey ?? "").includes("done")
      ? "DONE"
      : normalizeWorkTypeKey(input.flowStageKey ?? "").includes("processing")
        ? "PROCESSING"
        : normalizeWorkTypeKey(input.flowStageKey ?? "").includes("ready")
          ? "READY"
          : "INSPECT";
  const technicalFlowBoardPromise =
    input.includeFlowItems !== false && isTechnicalFlow
      ? loadTechnicalIssueBoard({
          db,
          taskId: cycle.task.id,
          viewerUserId: getAuthUserId(input.auth),
          stage: requestedTechnicalBoardStage,
          page: flowPage,
          pageSize: flowPageSize,
          includeOptions: false,
          doneRetentionDays: input.doneRetentionDays,
        })
      : null;
  const unfilteredFlowItemsTotalPromise =
    input.includeFlowItems === false || hasFlowFilters
      ? Promise.resolve(0)
      : dashboardStep("flowItemsTotal", () =>
          isMediaFlow && mediaFlowBoardPromise
            ? mediaFlowBoardPromise.then(
                (board) => board.columnPagination[requestedMediaBoardStage]?.total ?? 0,
              )
            : isShipmentFlow && shipmentProjectionPromise
            ? shipmentProjectionPromise.then((result) => result.total)
            : isTechnicalFlow && technicalFlowBoardPromise
            ? technicalFlowBoardPromise.then(
                (board) => board.columnPagination[requestedTechnicalBoardStage]?.total ?? 0,
              )
            : isPaymentFlow
            ? db.payment.count({
                where: {
                  amount: { gt: 0 },
                  status: normalizeStatus(input.flowStageKey).includes("SETTLED")
                    ? { not: PaymentStatus.UNPAID }
                    : PaymentStatus.UNPAID,
                },
              })
            : db.taskExecution.count({
                where: {
                  taskId: cycle.task.id,
                  taskItemId: { in: flowLoadTaskItems.map((item) => item.id) },
                  actionType: { not: TaskExecutionActionType.CANCELLED },
                },
              }),
        );

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
    flowItemGroups,
  ] = await Promise.all([
    input.includeWorkspaceSummaries !== false
      ? dashboardStep("queueCounts", () => db.taskExecution.groupBy({
      by: ["taskItemId"],
      where: {
        taskId: cycle.task.id,
        taskItemId: { in: taskItemIds },
        actionType: { not: TaskExecutionActionType.CANCELLED },
      },
      _count: { _all: true },
        }))
      : Promise.resolve([]),
    input.includeWorkspaceSummaries !== false &&
      input.includeDashboardDetails !== false &&
      isMediaFlow
      ? dashboardStep("mediaQueue", () => loadMediaQueueSummaryByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        }))
      : Promise.resolve(new Map<string, QueueSummaryDTO>()),
    input.includeWorkspaceSummaries !== false &&
      input.includeDashboardDetails !== false &&
      isTechnicalFlow
      ? dashboardStep("technicalQueue", () => loadTechnicalQueueCountByTaskItem({
          db,
          taskId: cycle.task.id,
          taskItems,
          terminalStatesByTargetType: viewConfig.carryover.terminalStatesByTargetType,
        }))
      : Promise.resolve(new Map<string, number>()),
    input.includeWorkspaceSummaries !== false && isPaymentFlow
      ? dashboardStep("paymentQueue", () => loadPaymentQueueCountByTaskItem({
          db,
          taskItems,
        }))
      : Promise.resolve(new Map<string, number>()),
    input.includeWorkspaceSummaries !== false &&
      input.includeDashboardDetails !== false
      ? dashboardStep("activitySummary", () => loadActivitySummaryByTaskItem(db, taskItemIds))
      : Promise.resolve({ feedbackCounts: new Map<string, number>(), lastActivities: new Map() }),
    input.includeWorkspaceSummaries !== false &&
      input.includeDashboardDetails !== false
      ? dashboardStep("rollover", () => loadRolloverOutByTaskItem(db, {
          taskId: cycle.task.id,
          taskItemIds,
        }))
      : Promise.resolve(new Map()),
    input.includeWorkspaceSummaries !== false &&
      input.includeDashboardDetails !== false
      ? dashboardStep("identityPreviews", () => loadWorkspaceIdentityPreviewMap({
          db,
          taskId: cycle.task.id,
          taskItems: taskItems.filter((item) => identityPreviewTaskItemIdSet.has(item.id)),
        }))
      : Promise.resolve(new Map()),
    input.includeWorkspaceSummaries !== false &&
      input.includeDashboardDetails !== false &&
      (isTechnicalFlow || isServiceRequestCaseMode)
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
          stage: input.boardStage,
          page: input.boardPage ?? undefined,
          pageSize: input.boardPageSize ?? undefined,
          doneRetentionDays: input.doneRetentionDays,
        }))
      : Promise.resolve(null),
    input.includeManagementDetails !== false
      ? dashboardStep("users", () => db.user.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
          orderBy: [{ name: "asc" }, { email: "asc" }],
        }))
      : Promise.resolve([]),
    isPaymentFlow && input.includeDashboardDetails !== false
      ? dashboardStep("paymentCashFlow", () =>
          hasPaymentListProjectionRows(db).then((ready) =>
            ready
              ? listSettledPaymentCashFlowProjection(db)
              : db.payment.findMany({
                  where: { status: { in: [PaymentStatus.PAID, PaymentStatus.COLLECTED] } },
                  select: {
                    amount: true,
                    direction: true,
                    paidAt: true,
                    createdAt: true,
                    updatedAt: true,
                    id: true,
                    refNo: true,
                    method: true,
                    currency: true,
                    reference: true,
                    note: true,
                    status: true,
                    purpose: true,
                    type: true,
                    order_id: true,
                    service_request_id: true,
                    technical_issue_id: true,
                    vendor_id: true,
                    acquisition_id: true,
                    shipment_id: true,
                  },
                }).then((rows) => rows.map((row) => ({
                  ...row,
                  amount: Number(row.amount),
                  method: String(row.method),
                  direction: String(row.direction),
                  status: String(row.status),
                  purpose: String(row.purpose),
                  type: String(row.type),
                  paidAt: row.paidAt?.toISOString() ?? null,
                  createdAt: row.createdAt.toISOString(),
                  updatedAt: row.updatedAt.toISOString(),
                })))
          ).then((rows) =>
            paymentCashFlowPeriods(rows.map((row) => ({
              amount: row.amount,
              direction: row.direction as PaymentDirection,
              paidAt: row.paidAt ? new Date(row.paidAt) : null,
              createdAt: new Date(row.createdAt),
            }))),
          ))
      : Promise.resolve(null),
    isMediaFlow && input.includeMediaBoard !== false
      ? dashboardStep("mediaBoard", () => loadMediaBoard({
          db,
          taskId: cycle.task.id,
          viewerUserId: getAuthUserId(input.auth),
          stage: input.boardStage,
          page: input.boardPage ?? undefined,
          pageSize: input.boardPageSize ?? undefined,
          doneRetentionDays: input.doneRetentionDays,
        }))
      : Promise.resolve(null),
    input.includeFlowItems !== false
      ? dashboardStep("flowItems", () =>
          isMediaFlow && mediaFlowBoardPromise
            ? mediaFlowBoardPromise.then((board) => [
                board.items.map((item): CoordinationFlowListItemDTO => ({
                  id: item.bindingId,
                  taskItemId: item.workspaceTaskItemId,
                  targetType: TaskExecutionTargetType.WATCH,
                  targetId: item.id,
                  source: "AUTO",
                  status: item.stage === "DONE" ? "DONE" : "IN_PROGRESS",
                  preview: {
                    title: item.title,
                    ref: item.sku,
                    status: item.workflowState,
                    imageUrl: item.imageUrl,
                    postTargets: item.postTargets,
                  },
                  latestActivityTitle: null,
                  feedbackCount: 0,
                  discussionCount: item.commentCount,
                  activityCount: item.commentCount,
                  lastUpdatedBy: item.lastUpdatedBy,
                  workflowKey: item.workflowKey,
                  currentWorkflowState: item.workflowState,
                  currentWorkflowStateLabel: item.workflowState,
                  isWorkflowDone: item.stage === "DONE",
                  manualTransitions: item.manualTransitions,
                  intakeNote: null,
                  reshootNote: item.reshootNote,
                  mediaWorkProgress: item.mediaWorkProgress,
                  technicalIssue: null,
                  payment: null,
                  href: `/admin/watches/${item.productId}`,
                  updatedAt: item.updatedAt ?? "",
                  workspaceTitle:
                    item.stage === "PHOTOGRAPHY"
                      ? "Photography"
                      : item.stage === "MEDIA_PROCESSING"
                        ? "Media Processing"
                        : item.stage === "PUBLISH"
                          ? "Publish"
                          : "Done",
                  flowStageKey: normalizeWorkTypeKey(item.stage),
                  flowStageOrder:
                    item.stage === "PHOTOGRAPHY"
                      ? 10
                      : item.stage === "MEDIA_PROCESSING"
                        ? 20
                        : item.stage === "PUBLISH"
                          ? 30
                          : 40,
                })),
              ])
            : isShipmentFlow && shipmentProjectionPromise
              ? shipmentProjectionPromise.then((result) => {
                 const workspace = flowLoadTaskItems[0] ?? null;
                 const metadata = workspaceRoleMetadataFromNote(workspace?.note);
                 const shipmentContract = operationalBlueprintForWorkType({
                   workTypeKey: "shipment",
                   coordinationContext: "OPERATION",
                 });
                 const shipmentActions = selectOperationalActionsForWorkspaceRole({
                   contract: shipmentContract,
                   workspaceRole:
                     metadata.operationWorkspaceRole ??
                     (shipmentStage === "SHIPMENT_DONE"
                       ? "SHIPMENT_DONE"
                       : shipmentStage === "SHIPMENT_PROCESSING"
                         ? "SHIPMENT_PROCESSING"
                         : "SHIPMENT_WAITING"),
                   targetTypes: ["SHIPMENT"],
                 });
                 return [
                  result.rows.map((row): CoordinationFlowListItemDTO => ({
                    id: `shipment:${row.shipmentId}`,
                    taskItemId: workspace?.id ?? "",
                    targetType: TaskExecutionTargetType.SHIPMENT,
                    targetId: row.shipmentId,
                    source: "AUTO",
                    status:
                      row.flowStage === "SHIPMENT_DONE"
                        ? "DONE"
                        : row.flowStage === "SHIPMENT_PROCESSING"
                          ? "IN_PROGRESS"
                          : "WAITING",
                    preview: {
                      title: row.shipmentRefNo
                        ? `Vận chuyển ${row.shipmentRefNo}`
                        : "Vận chuyển đơn hàng",
                      ref: [row.orderRefNo, row.trackingCode].filter(Boolean).join(" / ") || row.shipmentId,
                      status: row.shipmentStatus,
                      imageUrl: row.imageUrl,
                      imageUrls: row.imageUrls,
                      postTargets: [],
                    },
                    latestActivityTitle: null,
                    feedbackCount: 0,
                    discussionCount: 0,
                    activityCount: 0,
                    lastUpdatedBy: {
                      label: "Hệ thống",
                      avatarUrl: null,
                      isSystem: true,
                    },
                    workflowKey: "shipment-operation-workflow",
                    currentWorkflowState: row.shipmentStatus,
                    currentWorkflowStateLabel: row.shipmentStatus,
                    isWorkflowDone: row.flowStage === "SHIPMENT_DONE",
                    manualTransitions: shipmentActions
                    .filter((action) => {
                      const status = normalizeStatus(row.shipmentStatus);
                      if (status === "RETURNING") {
                        return action.key === "receive_shipment_return";
                      }
                      if (row.flowStage === "SHIPMENT_PROCESSING") {
                        return [
                          "mark_shipment_delivered",
                          "mark_shipment_returning",
                        ].includes(action.key);
                      }
                      return row.flowStage === "SHIPMENT_WAITING";
                    })
                    .map((action) => ({
                      actionKey: action.key,
                      label: action.label,
                      manualActionLabel: action.label,
                      fromState: row.shipmentStatus,
                      toState: action.emits[0] ?? row.shipmentStatus,
                      enabled: true,
                      reason: null,
                      metadata: {
                        operationalBlueprintAction: action,
                        operationalInitialFields: {
                          amount: String(row.shippingAmount ?? 0),
                          payer: row.shippingFeePayer ?? "BUSINESS",
                          carrier: row.carrier ?? "",
                          trackingCode: row.trackingCode ?? "",
                        },
                      },
                    })),
                    intakeNote: row.shipAddressLabel,
                    reshootNote: null,
                    mediaWorkProgress: null,
                    technicalIssue: null,
                    payment: null,
                    href: "/admin/shipments",
                    updatedAt: row.updatedAt,
                    workspaceTitle: workspace?.title ?? "",
                    flowStageKey: metadata.flowStageKey ?? requestedFlowStage?.key ?? null,
                    flowStageOrder: metadata.flowStageOrder ?? requestedFlowStage?.sortOrder ?? null,
                  })),
                ];
              })
            : isTechnicalFlow && technicalFlowBoardPromise
            ? technicalFlowBoardPromise.then((board) => [
                board.items.map((item): CoordinationFlowListItemDTO => ({
                  id: `technical-issue:${item.id}`,
                  taskItemId: item.workspaceTaskItemId ?? "",
                  targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
                  targetId: item.id,
                  source: "AUTO",
                  status: item.stage === "DONE"
                    ? "DONE"
                    : item.stage === "INSPECT"
                      ? "WAITING"
                      : "IN_PROGRESS",
                  preview: {
                    title: item.summary,
                    ref: item.serviceRequest.refNo,
                    status: item.executionStatus,
                    imageUrl: item.serviceRequest.imageUrl,
                    imageUrls: item.serviceRequest.imageUrl ? [item.serviceRequest.imageUrl] : [],
                    postTargets: [],
                  },
                  latestActivityTitle: null,
                  feedbackCount: 0,
                  discussionCount: item.commentCount,
                  activityCount: item.commentCount,
                  lastUpdatedBy: item.lastUpdatedBy,
                  workflowKey: null,
                  currentWorkflowState: item.executionStatus,
                  currentWorkflowStateLabel: item.executionStatus,
                  isWorkflowDone: item.stage === "DONE",
                  manualTransitions: [],
                  intakeNote: item.note,
                  reshootNote: null,
                  mediaWorkProgress: null,
                  technicalIssue: {
                    id: item.id,
                    summary: item.summary,
                    note: item.note,
                    area: item.area,
                    actionMode: item.actionMode,
                    executionStatus: item.executionStatus,
                    vendorId: item.vendorId,
                    vendorNameSnap: item.vendorName,
                    estimatedCost: item.estimatedCost,
                    actualCost: item.actualCost,
                    technicalDetailCatalogId: item.technicalDetailCatalogId,
                    technicalDetailCatalog: null,
                    supplyCatalog: null,
                    mechanicalPartCatalog: null,
                  },
                  payment: null,
                  href: null,
                  updatedAt: item.updatedAt ?? "",
                  workspaceTitle: item.stage,
                  flowStageKey: normalizeWorkTypeKey(item.stage),
                  flowStageOrder:
                    item.stage === "INSPECT"
                      ? 10
                      : item.stage === "READY"
                        ? 20
                        : item.stage === "PROCESSING"
                          ? 30
                          : 40,
                })),
              ])
            : isPaymentFlow
            ? (() => {
                const reviewItem = taskItems.find(
                  (item) => paymentWorkspaceRole(item.note) === "PAYMENT_REVIEW",
                );
                const settledItem = taskItems.find(
                  (item) => paymentWorkspaceRole(item.note) === "PAYMENT_SETTLED",
                );
                if (!reviewItem || !settledItem) return Promise.resolve([]);
                const metadataByTaskItemId = new Map(
                  [reviewItem, settledItem].map((item) => [
                    item.id,
                    workspaceRoleMetadataFromNote(item.note),
                  ]),
                );
                const titleByTaskItemId = new Map([
                  [reviewItem.id, reviewItem.title],
                  [settledItem.id, settledItem.title],
                ]);
                return listPaymentCollectionQueueItems(db, {
                  taskId: cycle.task.id,
                  reviewTaskItemId: reviewItem.id,
                  settledTaskItemId: settledItem.id,
                  stage: normalizeStatus(input.flowStageKey).includes("SETTLED")
                    ? "SETTLED"
                    : "REVIEW",
                  page: flowPage,
                  pageSize: flowPageSize,
                  paginate: !hasFlowFilters,
                }).then((items) => [
                  items.map((queueItem) => {
                    const metadata = metadataByTaskItemId.get(queueItem.taskItemId);
                    return {
                      ...queueItem,
                      workspaceTitle: titleByTaskItemId.get(queueItem.taskItemId) ?? "",
                      flowStageKey: metadata?.flowStageKey ??
                        metadata?.operationWorkspaceRole ??
                        null,
                      flowStageOrder: metadata?.flowStageOrder ?? null,
                    };
                  }),
                ]);
              })()
            : Promise.all(flowLoadTaskItems.map(async (item) => {
                const metadata = workspaceRoleMetadataFromNote(item.note);
                const items = await listTaskItemQueueItems(db, item.id, {
                    taskId: cycle.task.id,
                    note: item.note,
                    page: flowPage,
                    pageSize: flowPageSize,
                    // Multiple Workspaces can belong to one stage. Per-Workspace
                    // pagination would produce N × pageSize rows and invalid
                    // global pages, so the generic reader paginates only after
                    // the Workspace results have been merged and sorted.
                    paginate: false,
                  });
                const mediaDoneRequested =
                  isMediaFlow &&
                  normalizeWorkTypeKey(input.flowStageKey ?? "") === "done";
                const mediaPublishRequested =
                  isMediaFlow &&
                  normalizeWorkTypeKey(input.flowStageKey ?? "").includes("publish");
                return items
                  .filter((queueItem) =>
                    mediaDoneRequested
                      ? queueItem.isWorkflowDone || queueItem.status === "DONE"
                      : mediaPublishRequested
                        ? !queueItem.isWorkflowDone && queueItem.status !== "DONE"
                        : true
                  )
                  .map((queueItem) => ({
                  ...queueItem,
                  workspaceTitle: item.title,
                  flowStageKey: mediaDoneRequested
                    ? "done"
                    : metadata.flowStageKey ?? ticketWorkTypeKey(item.note),
                  flowStageOrder: mediaDoneRequested ? 40 : metadata.flowStageOrder,
                }));
              })),
        )
      : Promise.resolve([]),
  ]);
  const feedbackCountByTaskItem = activitySummary.feedbackCounts;
  const lastActivityMap = activitySummary.lastActivities;
  const flowStageCounts: Record<string, number> = {};
  if (isMediaFlow && mediaFlowBoardPromise) {
    const board = await mediaFlowBoardPromise;
    flowStageCounts.photography = board.columnPagination.PHOTOGRAPHY?.total ?? 0;
    flowStageCounts["media-processing"] =
      board.columnPagination.MEDIA_PROCESSING?.total ?? 0;
    flowStageCounts.publish = board.columnPagination.PUBLISH?.total ?? 0;
    flowStageCounts.done = board.columnPagination.DONE?.total ?? 0;
  } else if (isTechnicalFlow && technicalFlowBoardPromise) {
    const board = await technicalFlowBoardPromise;
    flowStageCounts.inspect = board.columnPagination.INSPECT?.total ?? 0;
    flowStageCounts.ready = board.columnPagination.READY?.total ?? 0;
    flowStageCounts.processing = board.columnPagination.PROCESSING?.total ?? 0;
    flowStageCounts.done = board.columnPagination.DONE?.total ?? 0;
  }

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
  const baseFlowItems: CoordinationFlowListItemDTO[] = flowItemGroups.flat();
  const latestFlowEventSignals =
    input.includeFlowItems === false
      ? new Map()
      : await dashboardStep("flowItemLastEvents", () =>
          loadLatestFlowEventSignals(db, baseFlowItems));
  const unfilteredFlowItems: CoordinationFlowListItemDTO[] = baseFlowItems.map((item) => {
    const signal = latestFlowEventSignals.get(
      `${String(item.targetType).toUpperCase()}:${item.targetId}`,
    );
    if (!signal) return item;
    return {
      ...item,
      latestActivityTitle: signal.title,
      lastUpdatedBy: signal.actor,
      updatedAt: signal.occurredAt,
    };
  });
  const filteredFlowItems = unfilteredFlowItems.filter((item) => {
    const status = item.isWorkflowDone || item.status === "DONE"
      ? "DONE"
      : item.status === "FEEDBACK" || item.status === "RETURNED"
        ? "FEEDBACK"
        : "OPEN";
    if (flowStatus && flowStatus !== "ALL" && status !== flowStatus) return false;
    const paymentStatus = normalizeStatus(item.payment?.status) || "NONE";
    if (
      flowPaymentStatus === "UNPAID" &&
      !["UNPAID", "PARTIAL"].includes(paymentStatus)
    ) return false;
    if (flowPaymentStatus === "PAID" && paymentStatus !== "PAID") return false;
    if (flowPaymentStatus === "NONE" && item.payment) return false;
    const paymentType = normalizeStatus(item.payment?.type) || "NONE";
    if (
      flowPaymentType &&
      flowPaymentType !== "ALL" &&
      paymentType !== flowPaymentType
    ) return false;
    const paymentDirection = normalizeStatus(item.payment?.direction) || "NONE";
    if (
      flowPaymentDirection &&
      flowPaymentDirection !== "ALL" &&
      paymentDirection !== flowPaymentDirection
    ) return false;
    if (!flowQuery) return true;
    return [
      item.preview.title,
      item.preview.ref,
      item.preview.status,
      item.currentWorkflowStateLabel,
      item.payment?.counterparty,
      item.payment?.ownerRef,
      item.payment?.direction,
      item.payment?.purpose,
    ].filter(Boolean).join(" ").toLocaleLowerCase("vi").includes(flowQuery);
  }).sort((left, right) => {
    if (flowSort === "UPDATED_ASC") {
      return left.updatedAt.localeCompare(right.updatedAt);
    }
    if (flowSort === "TITLE_ASC") {
      return String(left.preview.title ?? "").localeCompare(
        String(right.preview.title ?? ""),
        "vi",
      );
    }
    if (flowSort === "TITLE_DESC") {
      return String(right.preview.title ?? "").localeCompare(
        String(left.preview.title ?? ""),
        "vi",
      );
    }
    const stageOrder = (left.flowStageOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.flowStageOrder ?? Number.MAX_SAFE_INTEGER);
    if (stageOrder !== 0) return stageOrder;
    return right.updatedAt.localeCompare(left.updatedAt);
  });
  const flowItemsTotal = input.includeFlowItems === false
    ? 0
    : hasFlowFilters || usesGenericFlowItemReader
      ? filteredFlowItems.length
      : await unfilteredFlowItemsTotalPromise;
  const flowItems = hasFlowFilters || usesGenericFlowItemReader
    ? filteredFlowItems.slice((flowPage - 1) * flowPageSize, flowPage * flowPageSize)
    : filteredFlowItems;

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
    timeRange: {
      label: cycle.referenceRange.weekLabel,
      periodKey: cycle.referenceRange.periodKey,
      startDate: formatDateInput(cycle.referenceRange.startDate),
      endDate: formatDateInput(cycle.referenceRange.endDate),
      weekNumber: cycle.referenceRange.weekNumber,
      year: cycle.referenceRange.year,
    },
    cycle: {
      id: cycle.task.id,
      title: cycle.task.title,
      created: cycle.created,
    },
    viewConfig,
    filters: {
      selectedDate: formatDateInput(cycle.referenceRange.startDate),
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
    blueprints: (input.includeManagementDetails === false
      ? []
      : await listWorkspaceInstantiationBlueprintOptions(input.context)).map((blueprint) => {
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
    flowItems,
    flowItemsPagination: {
      page: flowPage,
      pageSize: flowPageSize,
      total: flowItemsTotal,
      totalPages: Math.max(1, Math.ceil(flowItemsTotal / flowPageSize)),
    },
    flowStageCounts,
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

export async function getCoordinationFlowPage(input: {
  db?: DB;
  context: CoordinationContext;
  modeKey: string;
  taskId?: string | null;
  date?: string | null;
  stage?: string | null;
  page?: number | null;
  pageSize?: number | null;
  query?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  paymentType?: string | null;
  paymentDirection?: string | null;
  sort?: string | null;
  doneRetentionDays?: number | null;
  auth?: unknown;
}) {
  return perfStep("coordination-flow-query", input.modeKey, async () => {
    const db = input.db ?? prisma;
    const taskId = input.taskId
      ? await perfStep("coordination-flow-query", "cycleScope", () =>
          assertCoordinationCycleScope({
            db,
            context: input.context,
            taskId: input.taskId!,
          }))
      : null;
    const dashboard = await getCoordinationDashboard({
      db,
      context: input.context,
      modeKey: input.modeKey,
      cycleTaskId: taskId,
      date: input.date,
      flowStageKey: input.stage,
      flowPage: input.page,
      flowPageSize: input.pageSize,
      flowQuery: input.query,
      flowStatus: input.status,
      flowPaymentStatus: input.paymentStatus,
      flowPaymentType: input.paymentType,
      flowPaymentDirection: input.paymentDirection,
      flowSort: input.sort,
      doneRetentionDays: input.doneRetentionDays,
      includeFlowItems: true,
      includeTechnicalBoard: false,
      includeMediaBoard: false,
      includeDashboardDetails: false,
      includeWorkspaceSummaries: false,
      includeManagementDetails: false,
      auth: input.auth,
    });
    return {
      items: dashboard.flowItems,
      pagination: dashboard.flowItemsPagination,
      stageCounts: dashboard.flowStageCounts,
    };
  });
}
