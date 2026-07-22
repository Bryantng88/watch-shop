"use client";

import {
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDot,
  Clock3,
  CreditCard,
  ExternalLink,
  Camera,
  Filter,
  FileText,
  Folder,
  GitBranch,
  HeartPulse,
  Info,
  List,
  ListChecks,
  MessageSquare,
  Paperclip,
  Play,
  Plus,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  UserRound,
  Zap,
  XCircle,
} from "lucide-react";
import type { TaskPriority, TaskStatus } from "@prisma/client";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import {
  parseWorkspaceDefinitionSnapshot,
  resolveWorkspaceCapabilities,
  type WorkspaceCapabilities,
  type WorkspaceDefinitionSnapshot,
} from "@/domains/blueprint/shared/workspace-capabilities";
import {
  operationalBlueprintForWorkType,
  selectOperationalActionsForWorkspaceRole,
  selectOperationalCoreFlowForWorkspaceRole,
  type OperationalBlueprintAction,
  type OperationalBlueprintActionField,
  type OperationalBlueprintContract,
  type OperationalBlueprintCoreFlowStep,
  type OperationalBlueprintWorkspaceRole,
} from "@/domains/blueprint/shared/operational-blueprint";
import {
  PrioritySignal,
  TaskStatusSignal,
} from "@/domains/shared/ui/signals/StatePrioritySignal";
import type {
  TimelineActivityBlock,
  TimelineEntryTone,
  TimelineEntryViewModel,
} from "@/domains/shared/timeline/server/timeline-renderer.types";
import type { TaskItemActivityViewModel } from "@/domains/task/server/activity";
import {
  statusTone,
  targetLabel,
} from "@/domains/task/ui/execution/execution-ui.utils";
import {
  OpenTargetAction,
  QueueItemThumbnail,
  queueItemRef,
  queueItemTitle,
  QueueStatusBadge,
  QueueWorkQueue,
  transitionIntent,
  transitionLabel,
} from "@/domains/task/ui/task-work/QueueWorkQueue";
import type {
  QueueItemStatus,
  TaskItemQueueItem,
} from "@/domains/task/ui/task-work/QueueWorkQueue";
import {
  ActivityViewModelFeed,
  type ActivityJumpTarget,
  type ActivityMode,
} from "@/domains/task/ui/task-work/activity/ActivityFeed";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import { repairVietnameseMojibake } from "@/domains/shared/text/vietnamese-mojibake";
import { workspaceFlowOrder } from "@/domains/task/shared/workspace-flow-policy";
import {
  applyQueueItemManualTransitionAction,
  markTaskItemMentionsReadAction,
  submitOperationalBlueprintActionAction,
  updateTaskItemSharingAction,
} from "../actions/task.actions";

type UserSummary = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  roles?: string[];
  permissions?: string[];
};

type VendorOption = {
  id: string;
  name: string;
};

type TechnicalDetailCatalogOption = {
  id: string;
  area?: string | null;
  code?: string | null;
  name?: string | null;
};

type TaskItemChecklist = {
  id: string;
  title: string;
  note?: string | null;
  isDone: boolean;
};

type TaskItemBinding = {
  id: string;
  targetType: string;
  targetId: string;
  actionType: string;
  href?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  preview?: {
    title: string;
    ref: string;
    subtitle?: string | null;
    status?: string | null;
    imageUrl?: string | null;
  } | null;
  stats?: {
    lastActivityTitle?: string | null;
    lastActivityAt?: string | null;
    feedbackCount?: number;
    discussionCount?: number;
    activityCount?: number;
  } | null;
  processingLabel?: string | null;
};

type ParentTask = {
  id: string;
  title: string;
  kind?: string | null;
  status?: string | null;
  priority?: string | null;
  dueAt?: string | null;
  periodKey?: string | null;
  taskItems?: Array<{
    id: string;
    title: string;
    note?: string | null;
    status?: TaskStatus | string | null;
    sortOrder?: number | null;
    updatedAt?: string | null;
  }>;
};

type TaskItemDetail = {
  id: string;
  title: string;
  note?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  userId?: string | null;
  ownerUser?: UserSummary | null;
  sharedUserIds?: string[];
  sharingScopeUserIds?: {
    workspace?: string[];
    coreFlow?: string[];
    space?: string[];
    system?: string[];
  };
  sharedUsers?: UserSummary[];
  assignedToUser?: UserSummary | null;
  task?: ParentTask | null;
  checklists?: TaskItemChecklist[];
  activities?: TaskItemActivityViewModel[];
  businessBindings?: TaskItemBinding[];
  queueItems?: TaskItemQueueItem[];
};

type DetailTab =
  | "overview"
  | "workflow"
  | "activity"
  | "attachments"
  | "checklist"
  | "business"
  | "priority"
  | "info";
type QueueFilter = "ALL" | QueueItemStatus;

type TabItem = {
  key: DetailTab;
  label: string;
  icon: ReactNode;
  badge?: number;
};

type WorkspacePresentation = {
  workspaceType: string;
  itemLabel: string;
  defaultView: string;
  defaultDescription: string | null;
  blueprintName: string | null;
  blueprintSource: string | null;
};

function workspacePresentation(
  snapshot: WorkspaceDefinitionSnapshot | null,
): WorkspacePresentation {
  const definition = snapshot?.workspaceDefinition ?? {};

  return {
    workspaceType: repairVietnameseMojibake(
      definition.workspaceType ?? snapshot?.workspaceType ?? "Workspace",
    ),
    itemLabel: repairVietnameseMojibake(
      definition.itemLabel ?? snapshot?.itemLabel ?? "Items",
    ),
    defaultView: definition.defaultView ?? snapshot?.defaultView ?? "overview",
    defaultDescription: repairVietnameseMojibake(
      definition.defaultDescription ?? null,
    ),
    blueprintName: repairVietnameseMojibake(
      snapshot?.blueprintName ?? snapshot?.blueprintKey ?? null,
    ),
    blueprintSource: repairVietnameseMojibake(snapshot?.blueprintSource ?? null),
  };
}

function defaultTabFromPresentation(
  presentation: WorkspacePresentation,
): DetailTab {
  if (presentation.defaultView === "items") return "business";
  if (presentation.defaultView === "activity") return "activity";
  if (presentation.defaultView === "workflow") return "workflow";
  if (presentation.defaultView === "discussion") return "activity";
  if (presentation.defaultView === "attachments") return "attachments";
  if (presentation.defaultView === "checklist") return "checklist";
  if (presentation.defaultView === "priority") return "priority";
  if (presentation.defaultView === "info") return "info";
  return "overview";
}

function noteTextValue(note: string | null | undefined, key: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(note ?? "").match(new RegExp(`^${escapedKey}:\\s*(.+)$`, "im"))?.[1]?.trim() ?? null;
}

function tabEnabled(tab: DetailTab, capabilities: WorkspaceCapabilities) {
  if (tab === "workflow") return capabilities.workflow;
  if (tab === "activity") return capabilities.activity;
  if (tab === "attachments") return capabilities.attachments;
  if (tab === "checklist") return capabilities.checklist;
  if (tab === "business") return capabilities.items;
  if (tab === "priority") return capabilities.priority;
  return true;
}

function initialWorkspaceTab(note?: string | null): DetailTab {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const capabilities = resolveWorkspaceCapabilities({ note, snapshot });
  const tab = defaultTabFromPresentation(workspacePresentation(snapshot));

  return tabEnabled(tab, capabilities) ? tab : "overview";
}

function formatDate(value?: Date | string | null, fallback = "Chưa có") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("vi-VN");
}

function formatDateTime(value?: Date | string | null, fallback = "-") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatTime(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function compactId(id?: string | null) {
  const value = String(id ?? "").trim();
  if (!value) return "-";
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function taskItemRef(id: string) {
  return `PX-${id.slice(0, 4).toUpperCase()}-${id.slice(-6).toUpperCase()}`;
}

function userLabel(user?: UserSummary | null) {
  return user?.name || user?.email || "Chưa gán";
}

function mergeCurrentUserAvatar(
  user?: UserSummary | null,
  currentUser?: UserSummary | null,
) {
  if (!user) return null;
  if (user.avatarUrl || !currentUser?.avatarUrl) return user;

  const sameUser =
    user.id === currentUser.id ||
    (Boolean(user.email) && user.email === currentUser.email);

  return sameUser ? { ...user, avatarUrl: currentUser.avatarUrl } : user;
}

function displayNote(note?: string | null) {
  return String(note ?? "")
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      return !/^(blueprintKey|blueprintSource|workTypeKey|workflowKey|workspaceType|itemLabel|defaultView|instantiationNotes|ownerType|shareGroupKey|sharedUserIds|spaceSharedUserIds|coreFlowSharedUserIds:[a-z0-9-]+|blueprintSnapshot|serviceOperationWorkspaceRole|operationWorkspaceRole|workspaceKind|identityTargetType|serviceRequestId):/i.test(trimmed);
    })
    .join("\n")
    .trim();
}

function serviceOperationWorkspaceRoleFromNote(note?: string | null) {
  return (
    String(note ?? "")
      .match(/^(?:serviceOperationWorkspaceRole|operationWorkspaceRole):\s*([A-Z_]+)\s*$/im)?.[1]
      ?.trim()
      .toUpperCase() ?? null
  );
}

function normalizeWorkspaceKey(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function workspaceNavMetadata(
  workspace: { note?: string | null },
  workspaceRoles?: OperationalBlueprintWorkspaceRole[],
) {
  const snapshot = parseWorkspaceDefinitionSnapshot(workspace.note);
  const operationRole =
    noteTextValue(workspace.note, "operationWorkspaceRole") ??
    serviceOperationWorkspaceRoleFromNote(workspace.note) ??
    snapshot?.operationWorkspaceRole ??
    null;
  const roleDefinition = (workspaceRoles ?? []).find(
    (role) => normalizeWorkspaceKey(role.key) === normalizeWorkspaceKey(operationRole),
  );
  const workspaceKind =
    noteTextValue(workspace.note, "workspaceKind") ??
    snapshot?.workspaceKind ??
    roleDefinition?.workspaceKind ??
    null;

  return {
    operationRole: normalizeWorkspaceKey(operationRole),
    workspaceKind: normalizeWorkspaceKey(workspaceKind),
    coreFlowKey: normalizeWorkspaceKey(
      noteTextValue(workspace.note, "coreFlowKey") ?? snapshot?.coreFlowKey,
    ),
    flowStageKey: normalizeWorkspaceKey(
      noteTextValue(workspace.note, "flowStageKey") ?? snapshot?.flowStageKey,
    ),
  };
}

function workspaceStageVisual(input: {
  note?: string | null;
  title?: string | null;
  flowStageKey?: string | null;
  operationRole?: string | null;
}) {
  const snapshot = parseWorkspaceDefinitionSnapshot(input.note);
  const key = [
    input.flowStageKey,
    input.operationRole,
    noteTextValue(input.note, "flowStageKey"),
    snapshot?.flowStageKey,
    snapshot?.workTypeKey,
    noteTextValue(input.note, "workTypeKey"),
    input.title,
  ]
    .map((value) => String(value ?? "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");

  if (key.includes("photo")) {
    return {
      Icon: Camera,
      frame: "bg-violet-50 text-violet-700 ring-violet-100",
    };
  }
  if (key.includes("media-processing")) {
    return {
      Icon: SlidersHorizontal,
      frame: "bg-sky-50 text-sky-700 ring-sky-100",
    };
  }
  if (key.includes("inspect")) {
    return {
      Icon: Filter,
      frame: "bg-violet-50 text-violet-700 ring-violet-100",
    };
  }
  if (key.includes("processing") || key.includes("process")) {
    return {
      Icon: SlidersHorizontal,
      frame: "bg-sky-50 text-sky-700 ring-sky-100",
    };
  }
  if (key.includes("done") || key.includes("follow") || key.includes("publish")) {
    return {
      Icon: key.includes("publish") ? Send : CheckCircle2,
      frame: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    };
  }

  return {
    Icon: List,
    frame: "bg-slate-50 text-slate-700 ring-slate-100",
  };
}

function isStandaloneLikeWorkspaceKind(kind: string) {
  return kind === "CASE_WORKSPACE" || kind === "STANDALONE_WORKSPACE";
}

function effectiveWorkspaceRoleKind(
  role?: OperationalBlueprintWorkspaceRole | null,
  isInCoreFlow = false,
) {
  if (!role) return "";
  if (role.identityTargetType) return "CASE_WORKSPACE";
  const explicitKind = normalizeWorkspaceKey(role.workspaceKind);
  if (explicitKind) return explicitKind;
  if (role.cardinality === "ONE_PER_BUSINESS_OBJECT") return "CASE_WORKSPACE";
  if (isInCoreFlow && role.cardinality === "SINGLE_PER_ACTIVE_CYCLE") {
    return "FLOW_STAGE_WORKSPACE";
  }
  if (role.cardinality === "MULTIPLE_PER_ACTIVE_CYCLE") return "BENCH_WORKSPACE";
  return "STANDALONE_WORKSPACE";
}

function noteHasSystemOwner(note?: string | null) {
  const text = String(note ?? "");
  return /ownerType:\s*SYSTEM/i.test(text) || (/workTypeKey:\s*/i.test(text) && !/userId:\s*/i.test(text));
}

function dateFromIsoWeekPeriod(periodKey?: string | null) {
  const match = String(periodKey ?? "").match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(week)) return null;

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const day = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - day + 1 + (week - 1) * 7);

  return monday.toISOString().slice(0, 10);
}

function coordinationSurfaceFromContext(value?: string | null) {
  const context = String(value ?? "").trim().toUpperCase();
  if (context === "MEDIA") return "media";
  if (context === "PAYMENT") return "operation";
  if (context === "TECHNICAL") return "technical";
  if (context === "SALES") return "sales";
  if (context === "GENERAL") return "general";
  if (context === "OPERATION") return "operation";
  return null;
}

function coordinationSurfaceFromWorkType(value?: string | null) {
  const workTypeKey = String(value ?? "").trim().toLowerCase();
  if (
    workTypeKey === "photography" ||
    workTypeKey === "media-processing" ||
    workTypeKey === "publish"
  ) {
    return "media";
  }
  if (workTypeKey === "payment") return "operation";
  if (workTypeKey === "service-operation") return "technical";
  return null;
}

function coordinationHref(
  parentTask?: ParentTask | null,
  workspaceNote?: string | null,
) {
  if (!parentTask) return "/admin/coordination/operation";

  const snapshot = parseWorkspaceDefinitionSnapshot(workspaceNote);
  const snapshotDefinition = snapshot?.workspaceDefinition as
    | { coordinationContext?: string; workTypeKey?: string }
    | undefined;
  const context =
    snapshot?.coordinationContext ??
    snapshotDefinition?.coordinationContext ??
    noteTextValue(workspaceNote, "coordinationContext");
  const workTypeKey =
    snapshot?.workTypeKey ??
    snapshotDefinition?.workTypeKey ??
    noteTextValue(workspaceNote, "workTypeKey");
  const resolvedWorkspace =
    coordinationSurfaceFromContext(context) ??
    coordinationSurfaceFromWorkType(workTypeKey);

  const kind = String(parentTask.kind ?? "").toUpperCase();
  const title = String(parentTask.title ?? "").toLowerCase();
  let workspace = "operation";

  if (kind === "SERVICE") workspace = "technical";
  if (title.includes("media")) workspace = "media";
  if (title.includes("thanh toán") || title.includes("thanh toán")) {
    workspace = "operation";
  }
  if (kind === "BUSINESS") {
    workspace = title.includes("khác") || title.includes("khac") ? "general" : "sales";
  }

  if (resolvedWorkspace) {
    workspace = resolvedWorkspace;
  }

  const date = dateFromIsoWeekPeriod(parentTask.periodKey);
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (
    workspace === "operation" &&
    (String(context ?? "").toUpperCase() === "PAYMENT" ||
      String(workTypeKey ?? "").toLowerCase() === "payment")
  ) {
    params.set("view", "payment-collection-flow");
  }
  const query = params.toString();
  return `/admin/coordination/${workspace}${query ? `?${query}` : ""}`;
}

function siblingWorkspaceLabel(input: { title: string; note?: string | null }) {
  const snapshot = parseWorkspaceDefinitionSnapshot(input.note);
  const presentation = workspacePresentation(snapshot);
  const title = repairVietnameseMojibake(input.title);

  return title || presentation.workspaceType;
}

function siblingWorkspaceOrder(input: { note?: string | null; title?: string | null }) {
  const snapshot = parseWorkspaceDefinitionSnapshot(input.note);
  const key =
    snapshot?.workTypeKey ??
    snapshot?.blueprintKey ??
    snapshot?.workspaceDefinition?.workspaceType ??
    input.title;

  return workspaceFlowOrder({ key });
}

function initials(label?: string | null) {
  const words = String(label || "Hệ thống")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function UserAvatar({
  label,
  avatarUrl,
  isSystem = false,
  className,
}: {
  label: string;
  avatarUrl?: string | null;
  isSystem?: boolean;
  className?: string;
}) {
  const src = isSystem ? null : resolveMediaPreviewSrc(avatarUrl);

  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-semibold text-slate-600",
        isSystem ? "bg-slate-900 text-white" : "",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="h-full w-full object-cover" />
      ) : isSystem ? (
        <CircleDot className="h-4 w-4" />
      ) : (
        initials(label)
      )}
    </div>
  );
}

function eventTone(block: TimelineActivityBlock): TimelineEntryTone {
  const eventKey = String(block.eventKey || "").toLowerCase();
  const title = `${block.entry.title} ${eventKey}`.toLowerCase();

  if (block.entry.sourceType === "USER_COMMENT") return "slate";
  if (eventKey.includes("rejected") || title.includes("trả về")) return "rose";
  if (
    eventKey.includes("submitted") ||
    eventKey.includes("approved") ||
    title.includes("gửi duyệt")
  ) {
    return "green";
  }
  if (eventKey.includes("updated") || title.includes("cập nhật")) return "blue";
  if (block.entry.sourceType === "BUSINESS_FEEDBACK") return "rose";
  return block.entry.tone;
}

function toneClasses(tone?: TaskItemActivityViewModel["tone"] | TimelineEntryTone) {
  if (tone === "green") {
    return {
      dot: "bg-emerald-50 text-emerald-700 ring-0",
      card: "border-slate-200",
      badge: "bg-emerald-50 text-emerald-700",
      panel: "border-emerald-100 bg-emerald-50 text-emerald-950",
    };
  }

  if (tone === "rose") {
    return {
      dot: "bg-rose-50 text-rose-700 ring-0",
      card: "border-slate-200",
      badge: "bg-rose-50 text-rose-700",
      panel: "border-rose-100 bg-rose-50 text-rose-950",
    };
  }

  if (tone === "blue") {
    return {
      dot: "bg-blue-50 text-blue-700 ring-0",
      card: "border-slate-200",
      badge: "bg-blue-50 text-blue-700",
      panel: "border-blue-100 bg-blue-50 text-blue-950",
    };
  }

  return {
    dot: "bg-slate-100 text-slate-600 ring-0",
    card: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    panel: "border-slate-100 bg-slate-50 text-slate-700",
  };
}

function groupActivityBlocks(
  _entries: TimelineEntryViewModel[],
): TimelineActivityBlock[] {
  void _entries;
  return [];
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

function HeaderMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 border-l border-slate-200 px-4 py-1 first:border-l-0 first:pl-0 last:pr-0">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-1 truncate text-xs font-extrabold text-slate-900">
        {value}
      </div>
    </div>
  );
}

function UserIdentity({
  user,
  fallback,
  isSystem = false,
}: {
  user?: UserSummary | null;
  fallback?: string;
  isSystem?: boolean;
}) {
  const label = isSystem ? "System" : userLabel(user) || fallback || "Chưa gán";

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <UserAvatar
        label={label}
        avatarUrl={user?.avatarUrl}
        isSystem={isSystem}
        className="h-7 w-7"
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

function SharingEditor({
  taskItemId,
  users,
  sharedUsers,
  sharedUserIds,
  currentUser,
  compact = false,
}: {
  taskItemId: string;
  users: UserSummary[];
  sharedUsers: UserSummary[];
  sharedUserIds: string[];
  currentUser?: UserSummary | null;
  compact?: boolean;
}) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [localSharedIds, setLocalSharedIds] = useState(sharedUserIds);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const sharedIdSet = new Set(localSharedIds);
  const visibleSharedUsers = localSharedIds
    .map((id) => sharedUsers.find((user) => user.id === id) ?? users.find((user) => user.id === id))
    .map((user) => mergeCurrentUserAvatar(user, currentUser))
    .filter(Boolean) as UserSummary[];
  const availableUsers = users
    .map((user) => mergeCurrentUserAvatar(user, currentUser) ?? user)
    .filter((user) => !sharedIdSet.has(user.id));

  function updateSharedUsers(nextSharedIds: string[]) {
    setLocalSharedIds(nextSharedIds);
    startTransition(async () => {
      await updateTaskItemSharingAction({
        taskItemId,
        sharedUserIds: nextSharedIds,
      });
      router.refresh();
    });
  }

  function addSelected() {
    if (!selectedUserId) return;
    updateSharedUsers(Array.from(new Set([...localSharedIds, selectedUserId])));
    setSelectedUserId("");
  }

  function removeUser(userId: string) {
    updateSharedUsers(localSharedIds.filter((id) => id !== userId));
  }

  return (
    <div className={cn(compact ? "min-w-0 px-1 py-1" : "rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm")}>
      <div className={cn("flex items-center gap-3", compact ? "justify-end" : "justify-between gap-4")}>
        <h3 className="shrink-0 text-xs font-semibold text-slate-500">Shared with</h3>
        {compact ? (
          <div className="flex min-w-0 flex-wrap items-center gap-0">
            {visibleSharedUsers.length ? visibleSharedUsers.slice(0, 3).map((user) => (
              <UserAvatar key={user.id} label={userLabel(user)} avatarUrl={user.avatarUrl} className="-ml-2 h-7 w-7 border-2 border-slate-50 first:ml-0" />
            )) : <span className="text-xs text-slate-400">Chưa chia sẻ</span>}
            {visibleSharedUsers.length > 3 ? (
              <span className="-ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-slate-50 bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-600">+{visibleSharedUsers.length - 3}</span>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-lg font-semibold text-violet-700 hover:bg-violet-50", compact ? "h-8 px-2.5 text-xs ring-1 ring-violet-200" : "h-9 border border-violet-200 bg-white px-3 text-sm shadow-sm")}
        >
          <Plus className="h-4 w-4" />
          Thêm
        </button>
      </div>

      {!compact ? (
      <div className="mt-2 flex flex-wrap items-center gap-0">
        {visibleSharedUsers.length ? (
          <>
            {(isExpanded ? visibleSharedUsers : visibleSharedUsers.slice(0, 3)).map((user) => (
          <span
            key={user.id}
            className="inline-flex max-w-full items-center gap-2 rounded-full text-sm font-medium text-slate-700 -ml-2 first:ml-0"
          >
            <UserAvatar
              label={userLabel(user)}
              avatarUrl={user.avatarUrl}
              className="h-7 w-7 border-2 border-white"
            />
            {isExpanded ? (
              <>
                <span className="max-w-[160px] truncate">{userLabel(user)}</span>
                <button
                  type="button"
                  onClick={() => removeUser(user.id)}
                  disabled={isPending}
                  className="rounded-full p-0.5 text-slate-400 hover:bg-white hover:text-rose-600"
                  aria-label={`Remove shared access for ${userLabel(user)}`}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </>
            ) : null}
          </span>
            ))}
            {visibleSharedUsers.length > 3 && !isExpanded ? (
              <span className="-ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 px-2 text-xs font-semibold text-slate-500">
                +{visibleSharedUsers.length - 3}
              </span>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Not shared with anyone yet.
          </div>
        )}
      </div>
      ) : null}

      {isExpanded ? (
      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
        <select
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value)}
          disabled={isPending || !availableUsers.length}
          className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="">Add participant</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {userLabel(user)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addSelected}
          disabled={isPending || !selectedUserId}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Plus className="h-4 w-4" />
          Thêm
        </button>
      </div>
      ) : null}
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          {icon ? <span className="text-blue-600">{icon}</span> : null}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ActivityBlockCard({ block }: { block: TimelineActivityBlock }) {
  const entry = block.entry;
  const tone = eventTone(block);
  const classes = toneClasses(tone);
  const actor = entry.actorLabel || "Hệ thống";
  const eventKey = block.eventKey;
  const isComment = entry.sourceType === "USER_COMMENT";
  const standaloneFeedback = entry.sourceType === "BUSINESS_FEEDBACK";
  const feedbackEntries =
    standaloneFeedback && !block.feedbackEntries.length
      ? [entry]
      : block.feedbackEntries;
  const bodyLabel = isComment
    ? "Trao đổi"
    : standaloneFeedback
      ? "Lý do / Feedback"
      : "Nội dung";

  return (
    <div className="grid grid-cols-[58px_34px_minmax(0,1fr)] gap-3 sm:grid-cols-[82px_42px_minmax(0,1fr)] sm:gap-4">
      <div className="pt-4 text-right text-xs leading-5 text-slate-500">
        <div className="font-semibold text-slate-700">
          {formatTime(activityValue(entry))}
        </div>
        <div>{formatDate(activityValue(entry), "")}</div>
      </div>

      <div className="relative flex justify-center">
        <div className="absolute top-0 h-full w-px bg-slate-200" />
        <div className="absolute top-[33px] h-1.5 w-1.5 rounded-full bg-slate-300" />
        <div
          className={cn(
            "relative mt-4 flex h-9 w-9 items-center justify-center rounded-full ring-4 shadow-sm",
            classes.dot,
          )}
        >
          {isComment ? (
            <MessageSquare className="h-4 w-4" />
          ) : tone === "rose" ? (
            <XCircle className="h-4 w-4" />
          ) : tone === "green" ? (
            <Send className="h-4 w-4" />
          ) : (
            <CircleDot className="h-4 w-4" />
          )}
        </div>
      </div>

      <article
        className={cn(
          "min-w-0 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
          classes.card,
        )}
      >
        <div className="flex min-w-0 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initials(actor)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-sm font-semibold text-slate-950">
                {isComment ? "Trao đổi nội bộ" : entry.title}
              </h3>
              {eventKey ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase",
                    classes.badge,
                  )}
                >
                  {eventKey}
                </span>
              ) : null}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>{actor}</span>
              <span>·</span>
              <span>{formatDateTime(activityValue(entry), "")}</span>
            </div>
          </div>
        </div>

        {entry.body && !standaloneFeedback ? (
          <div
            className={cn(
              "mt-4 rounded-xl border px-4 py-3 text-sm",
              classes.panel,
            )}
          >
            <div className="mb-1 text-xs font-semibold">{bodyLabel}</div>
            <div className="whitespace-pre-wrap leading-6">{entry.body}</div>
          </div>
        ) : null}

        {feedbackEntries.length ? (
          <div className="mt-4 space-y-3">
            {feedbackEntries.map((feedback) => (
              <div
                key={feedback.id}
                className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-rose-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Lý do / Feedback</span>
                  {formatDateTime(activityValue(feedback), "") ? (
                    <span className="font-medium text-rose-600/80">
                      {formatDateTime(activityValue(feedback), "")}
                    </span>
                  ) : null}
                </div>

                {feedback.body ? (
                  <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-rose-950">
                    {feedback.body}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </article>
    </div>
  );
}

// Legacy TimelineEntry feed kept for backward compatibility while the detail UI
  // renders WorkspaceActivity view models below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActivityFeed({ items }: { items: TimelineEntryViewModel[] }) {
  const blocks = useMemo(() => groupActivityBlocks(items), [items]);

  if (!blocks.length) {
    return <EmptyState>No activity for this workspace yet.</EmptyState>;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <ActivityBlockCard key={block.id} block={block} />
      ))}
    </div>
  );
}


function ReadonlyChecklist({ items }: { items: TaskItemChecklist[] }) {
  const done = items.filter((row) => row.isDone).length;

  return (
    <Panel
      icon={<ListChecks className="h-4 w-4" />}
      title="Checklist"
      action={
        <span className="text-sm font-semibold text-slate-500">
          {done}/{items.length}
        </span>
      }
    >
      {items.length ? (
        <div className="space-y-3">
          {items.map((row) => (
            <div key={row.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                {row.isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-slate-300" />
                )}
              </span>
              <div className="min-w-0">
                <div
                  className={cn(
                    "text-sm font-medium",
                    row.isDone
                      ? "text-slate-400 line-through"
                      : "text-slate-800",
                  )}
                >
                  {row.title}
                </div>
                {row.note ? (
                  <div className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-500">
                    {row.note}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>Chưa có checklist.</EmptyState>
        )}
    </Panel>
  );
}

function BusinessQueueImage({ binding }: { binding: TaskItemBinding }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
      {targetLabel(binding.targetType).slice(0, 1)}
    </div>
  );
}

function WorkflowTabPanel({
  taskItemId,
  items,
  snapshot,
}: {
  taskItemId: string;
  items: TaskItemQueueItem[];
  snapshot: WorkspaceDefinitionSnapshot | null;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const workflowDefinition = snapshot?.appliedWorkflowSnapshot ?? null;

  const applyManualAction = (queueItem: TaskItemQueueItem, actionKey: string) => {
    setPendingId(`${queueItem.id}:${actionKey}`);
    startTransition(async () => {
      try {
        await applyQueueItemManualTransitionAction({
          bindingId: queueItem.id,
          actionKey,
        });
        router.refresh();
      } finally {
        setPendingId(null);
      }
    });
  };
  return (
    <Panel
      icon={<GitBranch className="h-4 w-4" />}
      title="Workflow"
      action={
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} items
        </span>
      }
    >
      <div className="space-y-4">
        {workflowDefinition ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {workflowDefinition.title}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {workflowDefinition.key}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
                  Initial: {workflowDefinition.initialState}
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
                  {workflowDefinition.states.length} states
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
                  {workflowDefinition.transitions.length} transitions
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  States
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {workflowDefinition.states.map((state) => (
                    <span
                      key={state.key}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                    >
                      {state.title || state.key}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  Transitions
                </div>
                <div className="mt-2 space-y-1.5">
                  {workflowDefinition.transitions.map((transition, index) => (
                    <div
                      key={`${transition.fromState}:${transition.toState}:${transition.triggerType}:${index}`}
                      className="text-xs text-slate-600"
                    >
                      <span className="font-semibold text-slate-800">
                        {transition.fromState}
                      </span>
                      {" -> "}
                      <span className="font-semibold text-slate-800">
                        {transition.toState}
                      </span>
                      <span className="ml-2 text-slate-500">
                        {transition.triggerType}
                        {transition.triggerValue ? `:${transition.triggerValue}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState>No applied workflow snapshot on this workspace.</EmptyState>
        )}

        {items.length ? (
          <div className="space-y-3">
          {items.map((queueItem) => (
            <div
              key={queueItem.id}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-950">
                    {queueItemTitle(queueItem)}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{queueItemRef(queueItem)}</span>
                    <span>-</span>
                    <span>{targetLabel(queueItem.targetType)}</span>
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  {queueItem.currentWorkflowStateLabel ||
                    queueItem.currentWorkflowState ||
                    "No state"}
                </div>
              </div>

              {queueItem.manualTransitions?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {queueItem.manualTransitions.map((transition) => {
                    const pendingKey = `${queueItem.id}:${transition.actionKey}`;
                    const pending = isPending && pendingId === pendingKey;
                    const disabled = pending || transition.enabled === false;
                    const isOpenTarget = transitionIntent(transition) === "OPEN_TARGET";

                    if (isOpenTarget) {
                      return (
                        <OpenTargetAction
                          key={transition.actionKey}
                          queueItem={queueItem}
                          taskItemId={taskItemId}
                          transition={transition}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          iconClassName="h-4 w-4"
                        />
                      );
                    }

                    return (
                      <button
                        key={transition.actionKey}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          applyManualAction(queueItem, transition.actionKey)
                        }
                        title={transition.reason ?? undefined}
                        className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pending
                          ? "Applying"
                          : transitionLabel(transition)}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
          </div>
        ) : (
          <EmptyState>No workflow runtime items yet.</EmptyState>
        )}
      </div>
    </Panel>
  );
}

function AttachmentsTabPanel() {
  return (
    <Panel title="Attachments" icon={<Paperclip className="h-4 w-4" />}>
      <EmptyState>No attachments yet.</EmptyState>
    </Panel>
  );
}

function PriorityTabPanel({
  priority,
  status,
}: {
  priority: TaskPriority;
  status: TaskStatus;
}) {
  return (
    <Panel title="Priority" icon={<Tag className="h-4 w-4" />}>
      <div className="grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs font-medium text-slate-500">Priority</div>
          <div className="mt-2">
            <PrioritySignal priority={priority} showLabel />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs font-medium text-slate-500">Status</div>
          <div className="mt-2">
            <TaskStatusSignal status={status} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function QueueSummary({
  items,
  itemLabel,
}: {
  items: TaskItemQueueItem[];
  itemLabel: string;
}) {
  return (
    <Panel icon={<Folder className="h-4 w-4" />} title={itemLabel}>
      {items.length ? (
        <div className="space-y-3">
          {items.slice(0, 5).map((queueItem) => (
            <div key={queueItem.id} className="flex items-center gap-3">
              <QueueItemThumbnail item={queueItem} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {queueItemTitle(queueItem)}
                </div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {targetLabel(queueItem.targetType)} - {queueItemRef(queueItem)}
                </div>
              </div>
              <QueueStatusBadge status={queueItem.status} />
            </div>
          ))}
          {items.length > 5 ? (
            <div className="text-xs text-slate-500">
              +{items.length - 5} more {itemLabel}
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState>No {itemLabel} in this workspace yet.</EmptyState>
      )}
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BusinessWorkQueue({ items }: { items: TaskItemBinding[] }) {
  const [filter, setFilter] = useState<QueueFilter>("ALL");
  const filters: Array<{ key: QueueFilter; label: string }> = [
    { key: "ALL", label: "Tất cả" },
    { key: "WAITING", label: "Cần xử lý" },
    { key: "IN_PROGRESS", label: "Đang xử lý" },
    { key: "FEEDBACK", label: "Feedback" },
    { key: "DONE", label: "Hoàn tất" },
  ];
  const visibleItems = filter === "ALL"
    ? items
    : items.filter((item) => item.actionType === filter);
  void setFilter;
  void filters;
  void visibleItems;

  return (
    <Panel
      icon={<Folder className="h-4 w-4" />}
      title="Items"
      action={
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} items
        </span>
      }
    >
      {items.length ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[minmax(240px,1.4fr)_120px_160px_90px_130px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              <div>Item</div>
              <div>Trạng thái</div>
              <div>Hoạt động cuối</div>
              <div>Activity</div>
              <div>Cập nhật</div>
              <div className="text-right">Open</div>
            </div>

            {items.map((binding) => (
              <div
                key={binding.id}
                className="grid grid-cols-[minmax(240px,1.4fr)_120px_160px_90px_130px_110px] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <BusinessQueueImage binding={binding} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-950">
                      {binding.preview?.title || targetLabel(binding.targetType)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono">
                        {binding.preview?.ref || compactId(binding.targetId)}
                      </span>
                      <span>-</span>
                      <span>{targetLabel(binding.targetType)}</span>
                    </div>
                    {binding.preview?.subtitle ? (
                      <div className="mt-1 truncate text-xs text-slate-400">
                        {binding.preview.subtitle}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      statusTone(binding.preview?.status || binding.actionType),
                    )}
                  >
                    {binding.preview?.status || "-"}
                  </span>
                </div>

                <div className="min-w-0 self-center">
                  <div className="truncate text-xs font-medium text-slate-700">
                    {binding.stats?.lastActivityTitle || "-"}
                  </div>
                  {binding.stats?.lastActivityAt ? (
                    <div className="mt-1 text-[11px] text-slate-400">
                      {formatDateTime(binding.stats.lastActivityAt, "")}
                    </div>
                  ) : null}
                </div>

                <div className="self-center text-sm font-semibold tabular-nums text-slate-700">
                  {binding.stats?.discussionCount ?? 0}/{binding.stats?.activityCount ?? 0}
                </div>

                <div className="self-center text-xs text-slate-500">
                  {formatDateTime(binding.updatedAt || binding.createdAt, "-")}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                    {binding.processingLabel || binding.actionType}
                  </span>
                  {binding.href ? (
                    <Link
                      href={binding.href}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                      aria-label="Open item"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState>No items in this workspace yet.</EmptyState>
      )}
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BusinessQueueSummary({ items }: { items: TaskItemBinding[] }) {
  return (
    <Panel icon={<Folder className="h-4 w-4" />} title="Nghiệp vụ">
      {items.length ? (
        <div className="space-y-3">
          {items.slice(0, 5).map((binding) => (
            <div key={binding.id} className="flex items-center gap-3">
              <BusinessQueueImage binding={binding} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {binding.preview?.title || targetLabel(binding.targetType)}
                </div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {binding.preview?.ref || compactId(binding.targetId)}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ring-1",
                  statusTone(binding.preview?.status || binding.actionType),
                )}
              >
                {binding.preview?.status || binding.actionType}
              </span>
            </div>
          ))}
          {items.length > 5 ? (
            <div className="text-xs text-slate-500">
              +{items.length - 5} nghiệp vụ khác
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState>Chưa có nghiệp vụ.</EmptyState>
      )}
    </Panel>
  );
}

function DetailInfo({
  item,
  presentation,
}: {
  item: TaskItemDetail;
  presentation: WorkspacePresentation;
}) {
  const parentTask = item.task;

  return (
    <Panel icon={<Info className="h-4 w-4" />} title="Details">
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Workspace ref</dt>
          <dd className="font-semibold text-slate-950">{taskItemRef(item.id)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Space</dt>
          <dd className="max-w-[220px] truncate text-right font-semibold text-slate-950">
            {parentTask?.title || "-"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Workspace type</dt>
          <dd className="font-semibold text-slate-950">{presentation.workspaceType}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Item label</dt>
          <dd className="font-semibold text-slate-950">{presentation.itemLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Default view</dt>
          <dd className="font-semibold text-slate-950">{presentation.defaultView}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Tạo lúc</dt>
          <dd className="text-right font-semibold text-slate-950">
            {formatDateTime(item.createdAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Cập nhật</dt>
          <dd className="text-right font-semibold text-slate-950">
            {formatDateTime(item.updatedAt)}
          </dd>
        </div>
      </dl>
    </Panel>
  );
}

function SectionTabs({
  items,
  activeTab,
  onChange,
}: {
  items: TabItem[];
  activeTab: DetailTab;
  onChange: (tab: DetailTab) => void;
}) {
  return (
    <div className="max-w-full overflow-x-auto border-b border-slate-200">
      <nav className="flex w-max items-center gap-6 px-1" aria-label="Workspace">
        {items.map((item) => {
          const active = item.key === activeTab;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "inline-flex h-11 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition",
                active
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              )}
            >
              {item.icon}
              {item.label}
              {item.badge ? (
                <span
                  className={cn(
                    "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-extrabold",
                    active
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function snapshotCapabilityLabels(snapshot: WorkspaceDefinitionSnapshot) {
  const capabilities =
    snapshot.workspaceDefinition?.enabledCapabilities ??
    snapshot.enabledCapabilities ??
    {};

  return Object.entries(capabilities)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)
    .join(", ");
}

function WorkspaceDefinitionSnapshotPanel({
  snapshot,
}: {
  snapshot: WorkspaceDefinitionSnapshot;
}) {
  const definition = snapshot.workspaceDefinition ?? {};
  const workspaceType = repairVietnameseMojibake(
    definition.workspaceType ?? snapshot.workspaceType ?? "-",
  );
  const itemLabel = repairVietnameseMojibake(
    definition.itemLabel ?? snapshot.itemLabel ?? "-",
  );
  const defaultView = definition.defaultView ?? snapshot.defaultView ?? "-";
  const notes =
    repairVietnameseMojibake(
      definition.instantiationNotes ?? snapshot.instantiationNotes ?? null,
    );
  const capabilities = snapshotCapabilityLabels(snapshot);

  return (
    <Panel icon={<Info className="h-4 w-4" />} title="Workspace Definition Snapshot">
      <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className="text-xs font-medium text-slate-500">Blueprint</div>
          <div className="mt-1 font-semibold text-slate-950">
            {snapshot.blueprintName ?? snapshot.blueprintKey ?? "-"}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            {snapshot.blueprintSource ?? "UNKNOWN"}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">Loại Workspace</div>
          <div className="mt-1 font-semibold text-slate-950">{workspaceType}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">Tên gọi Item</div>
          <div className="mt-1 font-semibold text-slate-950">{itemLabel}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">View mặc định</div>
          <div className="mt-1 font-semibold text-slate-950">{defaultView}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <div className="text-xs font-medium uppercase text-slate-500">
          Capability dang bat
        </div>
        <div className="sr-only">
          Capability đang bật
        </div>
        <div className="mt-1">{capabilities || "-"}</div>
        {notes ? <div className="mt-2 text-slate-600">{notes}</div> : null}
      </div>
    </Panel>
  );
}

function OverviewPanel({
  item,
  activities,
  checklists,
  businessBindings,
  queueItems,
  capabilities,
  presentation,
  parentTask,
  serviceRequestId,
  onTabChange,
}: {
  item: TaskItemDetail;
  activities: TaskItemActivityViewModel[];
  checklists: TaskItemChecklist[];
  businessBindings: TaskItemBinding[];
  queueItems: TaskItemQueueItem[];
  capabilities: WorkspaceCapabilities;
  presentation: WorkspacePresentation;
  parentTask?: ParentTask | null;
  serviceRequestId?: string | null;
  onTabChange: (tab: DetailTab) => void;
}) {
  const workspaceSnapshot = parseWorkspaceDefinitionSnapshot(item.note);
  const description = displayNote(item.note) || presentation.defaultDescription;
  const role = serviceOperationWorkspaceRoleFromNote(item.note);
  const serviceRequestBinding =
    businessBindings.find((binding) => binding.targetType === "SERVICE_REQUEST") ?? null;
  const technicalIssueBindings = businessBindings.filter(
    (binding) => binding.targetType === "TECHNICAL_ISSUE",
  );
  const paymentBindings = businessBindings.filter((binding) => binding.targetType === "PAYMENT");
  const orderBindings = businessBindings.filter((binding) => binding.targetType === "ORDER");
  const shipmentBindings = businessBindings.filter((binding) => binding.targetType === "SHIPMENT");
  const checklistDone = checklists.filter((row) => row.isDone).length;
  const checklistPending = Math.max(0, checklists.length - checklistDone);
  const waitingItems = queueItems.filter((queueItem) =>
    ["WAITING", "READY", "OPEN"].includes(
      String(queueItem.currentWorkflowState ?? queueItem.status).toUpperCase(),
    ),
  ).length;
  const doneItems = queueItems.filter((queueItem) =>
    ["DONE", "COMPLETED"].includes(
      String(queueItem.currentWorkflowState ?? queueItem.status).toUpperCase(),
    ),
  ).length;
  const todayActivity = activities.filter((activity) => {
    const date = new Date(activity.occurredAt);
    const now = new Date();
    return !Number.isNaN(date.getTime()) && date.toDateString() === now.toDateString();
  }).length;
  const commentCount = activities.reduce(
    (count, activity) =>
      count + activity.replies.length + (activity.sourceType === "USER_COMMENT" ? 1 : 0),
    0,
  );
  const latestActivities = activities.slice(0, 3);
  const issueCount = technicalIssueBindings.length || queueItems.length;

  return (
    <WorkspaceSummaryDashboard
      activities={activities}
      businessBindings={businessBindings}
      capabilities={capabilities}
      checklistDone={checklistDone}
      checklistPending={checklistPending}
      checklists={checklists}
      commentCount={commentCount}
      description={description}
      doneItems={doneItems}
      issueCount={issueCount}
      item={item}
      latestActivities={latestActivities}
      onTabChange={onTabChange}
      orderBindings={orderBindings}
      parentTask={parentTask}
      paymentBindings={paymentBindings}
      presentation={presentation}
      role={role}
      serviceRequestBinding={serviceRequestBinding}
      serviceRequestId={serviceRequestId}
      shipmentBindings={shipmentBindings}
      todayActivity={todayActivity}
      waitingItems={waitingItems}
      workspaceSnapshot={workspaceSnapshot}
    />
  );

  /*
  return (
    <div className="space-y-5">
      {workspaceSnapshot ? (
        <WorkspaceDefinitionSnapshotPanel snapshot={workspaceSnapshot} />
      ) : null}

      <Panel icon={<FileText className="h-4 w-4" />} title="Tổng quan">
        {description ? (
          <div className="whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
            {description}
          </div>
        ) : (
          <EmptyState>No description for this workspace yet.</EmptyState>
        )}
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        {capabilities.activity ? (
        <div className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="text-sm font-semibold text-slate-950">Hoạt động</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {activityCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">sự kiện và trao đổi</div>
        </div>
        ) : null}
        {capabilities.checklist ? (
        <div className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="text-sm font-semibold text-slate-950">Checklist</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {checklistDone}/{checklistTotal}
          </div>
          <div className="mt-1 text-xs text-slate-500">tiêu chí hoàn thành</div>
        </div>
        ) : null}
        {capabilities.items ? (
        <div className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="text-sm font-semibold text-slate-950">
            {presentation.itemLabel}
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {bindingCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">runtime {presentation.itemLabel}</div>
        </div>
        ) : null}
      </div>
    </div>
  );
  */
}

function WorkspaceSummaryDashboard({
  activities,
  businessBindings,
  capabilities,
  checklistDone,
  checklistPending,
  checklists,
  commentCount,
  description,
  doneItems,
  issueCount,
  item,
  latestActivities,
  onTabChange,
  orderBindings,
  parentTask,
  paymentBindings,
  presentation,
  role,
  serviceRequestBinding,
  serviceRequestId,
  shipmentBindings,
  todayActivity,
  waitingItems,
  workspaceSnapshot,
}: {
  activities: TaskItemActivityViewModel[];
  businessBindings: TaskItemBinding[];
  capabilities: WorkspaceCapabilities;
  checklistDone: number;
  checklistPending: number;
  checklists: TaskItemChecklist[];
  commentCount: number;
  description: string | null;
  doneItems: number;
  issueCount: number;
  item: TaskItemDetail;
  latestActivities: TaskItemActivityViewModel[];
  onTabChange: (tab: DetailTab) => void;
  orderBindings: TaskItemBinding[];
  parentTask?: ParentTask | null;
  paymentBindings: TaskItemBinding[];
  presentation: WorkspacePresentation;
  role?: string | null;
  serviceRequestBinding?: TaskItemBinding | null;
  serviceRequestId?: string | null;
  shipmentBindings: TaskItemBinding[];
  todayActivity: number;
  waitingItems: number;
  workspaceSnapshot: WorkspaceDefinitionSnapshot | null;
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-slate-950">Workspace Summary</h2>
        {workspaceSnapshot ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-100">
            {presentation.workspaceType}
          </span>
        ) : null}
      </div>
      {false && workspaceSnapshot ? (
        <WorkspaceDefinitionSnapshotPanel snapshot={workspaceSnapshot} />
      ) : null}

      <div className="grid gap-3 lg:grid-cols-4">
        <OverviewCard icon={<FileText className="h-4 w-4" />} title="Context" tone="emerald">
          <OverviewFact
            label="Service Request"
            value={serviceRequestId ? `SR ${compactId(serviceRequestId)}` : "-"}
            href={serviceRequestBinding?.href ?? undefined}
          />
          <OverviewFact label="Khach hang" value="-" />
          <OverviewFact label="Dong ho" value={parentTask?.title || "-"} />
          <OverviewFact label="Technical Issue" value={`${issueCount} issue`} />
          <OverviewFact label="Payment" value={`${paymentBindings.length} payment`} />
          {serviceRequestBinding?.href ? (
            <OverviewLink href={serviceRequestBinding.href}>
              Xem chi tiet Service Request
            </OverviewLink>
          ) : null}
        </OverviewCard>

        <OverviewCard icon={<HeartPulse className="h-4 w-4" />} title="Health" tone="emerald">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            Healthy
          </div>
          <HealthLine ok text="Khong co item qua han" />
          <HealthLine ok text="Khong co checklist qua han" />
          <HealthLine ok text={`${issueCount} Technical Issue dang xu ly`} />
          <HealthLine ok={activityCountIsQuiet(activities)} text="Chua co hoat dong can chu y" />
        </OverviewCard>

        <OverviewCard icon={<GitBranch className="h-4 w-4" />} title="Runtime" tone="blue">
          <OverviewFact label="Workflow" value={presentation.blueprintName || "Service Operation"} />
          <OverviewFact label="Giai doan hien tai" value={role ? `${role} (1 / 3)` : "-"} />
          <OverviewFact label="Last Event" value={latestActivities[0]?.title || "-"} />
          <OverviewFact label="Cap nhat lan cuoi" value={formatDateTime(item.updatedAt)} />
          <button
            type="button"
            onClick={() => onTabChange("workflow")}
            className="mt-auto inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            Xem chi tiet workflow
            <ChevronRight className="h-4 w-4" />
          </button>
        </OverviewCard>

        <OverviewCard icon={<Folder className="h-4 w-4" />} title="Related" tone="violet">
          <OverviewFact
            label="Service Request"
            value={serviceRequestId ? compactId(serviceRequestId) : "-"}
            href={serviceRequestBinding?.href ?? undefined}
          />
          <OverviewFact label="Technical Issue" value={`${issueCount}`} />
          <OverviewFact label="Payment" value={`${paymentBindings.length}`} />
          <OverviewFact label="Order" value={orderBindings.length ? `${orderBindings.length}` : "-"} />
          <OverviewFact label="Shipment" value={shipmentBindings.length ? `${shipmentBindings.length}` : "-"} />
          <button
            type="button"
            onClick={() => onTabChange("business")}
            className="mt-auto inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            Xem tat ca lien ket
            <ChevronRight className="h-4 w-4" />
          </button>
        </OverviewCard>
      </div>

      {description ? (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2.5 text-xs leading-5 text-slate-600">
          {description}
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(260px,2.15fr)]">
        <OverviewStatCard
          icon={<Folder className="h-4 w-4" />}
          title="Items"
          value={String(businessBindings.length)}
          caption="Active"
          leftLabel="Waiting"
          leftValue={String(waitingItems)}
          rightLabel="Done"
          rightValue={String(doneItems)}
        />
        <OverviewStatCard
          icon={<ListChecks className="h-4 w-4" />}
          title="Checklist"
          value={`${checklistDone} / ${checklists.length}`}
          caption="Completed"
          leftLabel="Overdue"
          leftValue="0"
          rightLabel="Pending"
          rightValue={String(checklistPending)}
        />
        <OverviewStatCard
          icon={<Zap className="h-4 w-4" />}
          title="Activity"
          value={String(todayActivity)}
          caption="Hom nay"
          leftLabel="Events"
          leftValue={String(activities.length)}
          rightLabel="Comments"
          rightValue={String(commentCount)}
        />

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5">
          <div className="mb-3 text-sm font-extrabold text-slate-950">Recent Activity</div>
          {latestActivities.length ? (
            <div className="space-y-3">
              {latestActivities.map((activity) => (
                <div key={activity.id} className="grid grid-cols-[18px_minmax(0,1fr)_92px] gap-3">
                  <div className="relative flex justify-center">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-800">{activity.title}</div>
                    <div className="mt-0.5 truncate text-[11px] text-slate-500">{activity.actorLabel}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    {formatDateTime(activity.occurredAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
              Chua co hoat dong.
            </div>
          )}
          <button
            type="button"
            onClick={() => onTabChange("activity")}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
          >
            Xem toan bo hoat dong
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50/35 px-3 py-2.5">
        <div className="mr-auto flex items-center gap-2 text-sm font-extrabold text-slate-800">
          <Zap className="h-4 w-4 text-violet-600" />
          Thao tac nhanh
        </div>
        {capabilities.items ? (
          <OverviewQuickAction icon={<Plus className="h-4 w-4" />} onClick={() => onTabChange("business")}>
            Them Technical Issue
          </OverviewQuickAction>
        ) : null}
        {capabilities.items ? (
          <OverviewQuickAction icon={<Plus className="h-4 w-4" />} onClick={() => onTabChange("business")}>
            Them Item
          </OverviewQuickAction>
        ) : null}
        {capabilities.workflow ? (
          <OverviewQuickAction icon={<Play className="h-4 w-4" />} onClick={() => onTabChange("workflow")}>
            Bat dau xu ly
          </OverviewQuickAction>
        ) : null}
        {capabilities.workflow ? (
          <OverviewQuickAction icon={<GitBranch className="h-4 w-4" />} onClick={() => onTabChange("workflow")}>
            Chuyen giai doan
          </OverviewQuickAction>
        ) : null}
        <OverviewQuickAction icon={<CreditCard className="h-4 w-4" />} onClick={() => onTabChange("business")}>
          Tao Payment
        </OverviewQuickAction>
      </div>
      {workspaceSnapshot ? <div className="sr-only">{snapshotCapabilityLabels(workspaceSnapshot)}</div> : null}
    </section>
  );
}

function activityCountIsQuiet(activities: TaskItemActivityViewModel[]) {
  return !activities.some((activity) => activity.tone === "rose");
}

function OverviewCard({
  icon,
  title,
  tone,
  children,
}: {
  icon: ReactNode;
  title: string;
  tone: "emerald" | "blue" | "violet";
  children: ReactNode;
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
      : tone === "blue"
        ? "bg-blue-50 text-blue-600 ring-blue-100"
        : "bg-violet-50 text-violet-600 ring-violet-100";

  return (
    <div className="flex min-h-[178px] flex-col rounded-xl border border-slate-200/80 bg-white p-3.5">
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("grid h-7 w-7 place-items-center rounded-lg ring-1", toneClass)}>
          {icon}
        </span>
        <div className="text-sm font-bold text-slate-900">{title}</div>
      </div>
      <div className="flex flex-1 flex-col space-y-2.5">{children}</div>
    </div>
  );
}

function OverviewFact({
  label,
  value,
  href,
}: {
  label: string;
  value: ReactNode;
  href?: string;
}) {
  return (
    <div className="flex min-h-5 items-center justify-between gap-3 text-xs">
      <span className="shrink-0 text-slate-500">{label}</span>
      {href ? (
        <Link href={href} className="min-w-0 truncate text-right text-xs font-bold text-blue-700 hover:text-blue-800">
          {value}
        </Link>
      ) : (
        <span className="min-w-0 truncate text-right text-xs font-bold text-slate-950">
          {value}
        </span>
      )}
    </div>
  );
}

function HealthLine({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex min-h-5 items-center gap-2 text-xs text-slate-600">
      <CheckCircle2 className={cn("h-3.5 w-3.5", ok ? "text-emerald-500" : "text-amber-500")} />
      <span>{text}</span>
    </div>
  );
}

function OverviewLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-auto inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}

function OverviewStatCard({
  icon,
  title,
  value,
  caption,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  caption: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          {icon}
        </span>
        <div className="text-sm font-bold text-slate-900">{title}</div>
      </div>
      <div className="text-3xl font-bold text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{caption}</div>
      <div className="mt-4 grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-100 pt-3">
        <div>
          <div className="text-sm font-bold text-slate-950">{leftValue}</div>
          <div className="mt-0.5 text-xs text-slate-500">{leftLabel}</div>
        </div>
        <div className="pl-4">
          <div className="text-sm font-bold text-slate-950">{rightValue}</div>
          <div className="mt-0.5 text-xs text-slate-500">{rightLabel}</div>
        </div>
      </div>
    </div>
  );
}

function OverviewQuickAction({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center gap-2 rounded-lg border border-violet-100 bg-white px-3 text-xs font-bold text-violet-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
    >
      {icon}
      {children}
    </button>
  );
}

function GenericFlowWorkspaceNav({
  currentItemId,
  parentTask,
  itemCount,
  itemLabel,
}: {
  currentItemId: string;
  parentTask?: ParentTask | null;
  itemCount: number;
  itemLabel: string;
}) {
  const workspaces = (parentTask?.taskItems ?? [])
    .filter((workspace) => workspace.id)
    .map((workspace, index) => ({ workspace, index }))
    .sort((left, right) => {
      const leftOrder = siblingWorkspaceOrder(left.workspace);
      const rightOrder = siblingWorkspaceOrder(right.workspace);

      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.index - right.index;
    })
    .map((item) => item.workspace);

  if (workspaces.length <= 1) return null;

  return (
    <nav
      aria-label="Workspace trong space"
      className="mt-4 flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-2 py-3 lg:flex-row lg:items-stretch"
    >
      {workspaces.slice(0, 3).map((workspace, index) => {
        const active = workspace.id === currentItemId;
        const snapshot = parseWorkspaceDefinitionSnapshot(workspace.note);
        const workspaceType = repairVietnameseMojibake(
          snapshot?.workspaceType ?? workspace.title,
        );
        const description = repairVietnameseMojibake(
          snapshot?.defaultDescription ?? workspaceType,
        );
        const content = (
          <div
            className={cn(
              "flex min-h-[60px] items-center gap-3 rounded-xl px-3 py-2.5 transition",
              active
                ? "bg-gradient-to-br from-white to-violet-50 shadow-[0_8px_24px_rgba(91,67,241,0.08)] ring-1 ring-violet-200"
                : "bg-white hover:bg-slate-50",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white",
                active
                  ? "bg-gradient-to-br from-blue-600 to-violet-600"
                  : "bg-slate-300",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "truncate text-sm font-extrabold",
                    active ? "text-blue-700" : "text-slate-700",
                  )}
                >
                  {siblingWorkspaceLabel(workspace)}
                </span>
                {active ? (
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-extrabold text-violet-700">
                    Current
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block truncate text-xs font-medium text-slate-500">
                {description}
              </span>
            </span>
          </div>
        );

        return (
          <div
            key={workspace.id}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <Link
              href={`/admin/task-items/${workspace.id}`}
              aria-current={active ? "page" : undefined}
              className="block min-w-0 flex-1"
            >
              {content}
            </Link>
            {index < Math.min(workspaces.length, 3) - 1 ? (
              <div className="hidden w-5 shrink-0 place-items-center text-slate-300 lg:grid">
                <ChevronRight className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="flex min-h-[60px] shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 lg:w-[210px]">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-slate-950">
              {itemCount}
            </span>
            <span className="truncate text-sm font-extrabold text-slate-800">
              {itemLabel}
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            trong Workspace này
          </div>
        </div>
      </div>
    </nav>
  );
}

function CoreFlowWorkspaceNav({
  currentItemId,
  currentWorkspaceRole,
  currentCoreFlowKey,
  steps,
  workspaceRoles,
  parentTask,
  itemCount,
  itemLabel,
}: {
  currentItemId: string;
  currentWorkspaceRole?: string | null;
  currentCoreFlowKey?: string | null;
  steps: OperationalBlueprintCoreFlowStep[];
  workspaceRoles?: OperationalBlueprintWorkspaceRole[];
  parentTask?: ParentTask | null;
  itemCount: number;
  itemLabel: string;
}) {
  if (!steps.length) return null;

  const workspaces = parentTask?.taskItems ?? [];
  const roleByKey = new Map(
    (workspaceRoles ?? []).map((role) => [role.key.toUpperCase(), role]),
  );
  const flowStageSteps = steps.filter((step) => {
    const roleDefinition = roleByKey.get(step.workspaceRole.toUpperCase());
    return effectiveWorkspaceRoleKind(roleDefinition, true) === "FLOW_STAGE_WORKSPACE";
  });
  const allowedFlowRoles = new Set(
    flowStageSteps.map((step) => normalizeWorkspaceKey(step.workspaceRole)),
  );
  const normalizedCurrentFlowKey = normalizeWorkspaceKey(currentCoreFlowKey);
  const workspaceByRole = new Map<
    string,
    NonNullable<ParentTask["taskItems"]>[number]
  >();
  for (const workspace of workspaces) {
    const metadata = workspaceNavMetadata(workspace, workspaceRoles);
    if (!metadata.operationRole || !allowedFlowRoles.has(metadata.operationRole)) {
      continue;
    }
    if (isStandaloneLikeWorkspaceKind(metadata.workspaceKind)) {
      continue;
    }
    if (
      metadata.workspaceKind &&
      metadata.workspaceKind !== "FLOW_STAGE_WORKSPACE"
    ) {
      continue;
    }
    if (
      normalizedCurrentFlowKey &&
      metadata.coreFlowKey &&
      metadata.coreFlowKey !== normalizedCurrentFlowKey
    ) {
      continue;
    }
    if (workspaceByRole.has(metadata.operationRole)) continue;
    workspaceByRole.set(metadata.operationRole, workspace);
  }

  return (
    <nav
      aria-label="Core flow workspaces"
      className="mt-4 flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-3 py-3 lg:flex-row lg:items-stretch"
    >
      {flowStageSteps.slice(0, 3).map((step, index) => {
        const stepRole = step.workspaceRole.toUpperCase();
        const roleDefinition = roleByKey.get(stepRole);
        const active = stepRole === currentWorkspaceRole?.toUpperCase();
        const shouldLinkSibling =
          active || roleDefinition?.cardinality !== "ONE_PER_BUSINESS_OBJECT";
        const workspace =
          active
            ? workspaces.find((candidate) => candidate.id === currentItemId)
            : shouldLinkSibling
              ? workspaceByRole.get(stepRole)
              : null;
        const content = (
          <div
            className={cn(
              "flex min-h-[60px] items-center gap-3 rounded-xl px-3 py-2.5 transition",
              active
                ? "bg-gradient-to-br from-white to-violet-50 shadow-[0_8px_24px_rgba(91,67,241,0.08)] ring-1 ring-violet-200"
                : "bg-white hover:bg-slate-50",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white",
                active
                  ? "bg-gradient-to-br from-blue-600 to-violet-600"
                  : "bg-slate-300",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "truncate text-sm font-extrabold",
                    active ? "text-blue-700" : "text-slate-700",
                  )}
                >
                  {step.label}
                </span>
                {active ? (
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-extrabold text-violet-700">
                    Current
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block truncate text-xs font-medium text-slate-500">
                {step.description}
              </span>
            </span>
          </div>
        );

        return (
          <div
            key={`${step.workspaceRole}:${index}`}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            {workspace?.id ? (
              <Link
                href={`/admin/task-items/${workspace.id}`}
                aria-current={active ? "page" : undefined}
                className="block min-w-0 flex-1"
              >
                {content}
              </Link>
            ) : (
              <div className="min-w-0 flex-1">
                {content}
              </div>
            )}
            {index < Math.min(flowStageSteps.length, 3) - 1 ? (
              <div className="hidden w-5 shrink-0 place-items-center text-slate-300 lg:grid">
                <ChevronRight className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="flex min-h-[60px] shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 lg:w-[210px]">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-slate-950">
              {itemCount}
            </span>
            <span className="truncate text-sm font-extrabold text-slate-800">
              {itemLabel}
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-500">trong Workspace này</div>
        </div>
      </div>
    </nav>
  );
}

function BlueprintActionFieldPreview({
  field,
  disabled = true,
  value,
  onChange,
}: {
  field: OperationalBlueprintActionField;
  disabled?: boolean;
  value?: string | boolean;
  onChange?: (value: string | boolean) => void;
}) {
  const baseClass =
    "h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700 disabled:text-slate-500";

  if (field.kind === "textarea") {
    return (
      <textarea
        className={`${baseClass} min-h-16 py-2`}
        placeholder={field.label}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange?.(event.target.value)}
      />
    );
  }

  if (field.kind === "select") {
    return (
      <select
        className={baseClass}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange?.(event.target.value)}
      >
        <option value="">{field.label}</option>
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.kind === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
        <input
          type="checkbox"
          disabled={disabled}
          checked={value === true}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }

  return (
    <input
      className={baseClass}
      type={field.kind === "date" ? "date" : "text"}
      placeholder={field.kind === "money" ? `${field.label} (money)` : field.label}
      disabled={disabled}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

function canSubmitBlueprintAction(action: OperationalBlueprintAction) {
  return action.key === "create_technical_issue" &&
    action.command === "service.createTechnicalIssue";
}

function BlueprintActionDiscoveryPanel({
  taskItemId,
  workspaceRole,
  actions,
}: {
  taskItemId: string;
  workspaceRole?: string | null;
  actions: OperationalBlueprintAction[];
}) {
  const router = useRouter();
  const [valuesByAction, setValuesByAction] = useState<
    Record<string, Record<string, string | boolean>>
  >({});
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  if (!workspaceRole) return null;

  function updateField(
    actionKey: string,
    fieldKey: string,
    value: string | boolean,
  ) {
    setValuesByAction((current) => ({
      ...current,
      [actionKey]: {
        ...(current[actionKey] ?? {}),
        [fieldKey]: value,
      },
    }));
  }

  function submitAction(action: OperationalBlueprintAction) {
    if (!canSubmitBlueprintAction(action) || isPending) return;
    setPendingActionKey(action.key);
    setMessage(null);

    startTransition(async () => {
      try {
        await submitOperationalBlueprintActionAction({
          taskItemId,
          actionKey: action.key,
          fields: valuesByAction[action.key] ?? {},
        });
        setValuesByAction((current) => ({
          ...current,
          [action.key]: {},
        }));
        setMessage({
          tone: "success",
          text: `${action.label} completed.`,
        });
        router.refresh();
      } catch (error) {
        setMessage({
          tone: "error",
          text: error instanceof Error ? error.message : "Blueprint action failed.",
        });
      } finally {
        setPendingActionKey(null);
      }
    });
  }

  return (
    <Panel
      icon={<GitBranch className="h-4 w-4" />}
      title="Blueprint actions"
      action={
        <span className="rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
          {workspaceRole}
        </span>
      }
    >
      {message ? (
        <div
          className={cn(
            "mb-3 rounded-xl px-3 py-2 text-xs font-medium ring-1",
            message.tone === "success"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : "bg-rose-50 text-rose-700 ring-rose-100",
          )}
        >
          {message.text}
        </div>
      ) : null}
      {actions.length ? (
        <div className="space-y-3">
          {actions.map((action) => (
            <form
              key={action.key}
              className="rounded-xl border border-slate-200 bg-white p-3"
              onSubmit={(event) => {
                event.preventDefault();
                submitAction(action);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-950">
                    {action.label}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                  {action.targetType}
                </span>
              </div>
              {action.fields.length ? (
                <div className="mt-3 space-y-2">
                  {action.fields.map((field) => (
                    <div key={field.key}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
                        <span>{field.label}</span>
                        <span>{field.required ? "required" : field.kind}</span>
                      </div>
                      <BlueprintActionFieldPreview
                        field={field}
                        disabled={!canSubmitBlueprintAction(action) || isPending}
                        value={valuesByAction[action.key]?.[field.key]}
                        onChange={(value) =>
                          updateField(action.key, field.key, value)
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <span>
                  {canSubmitBlueprintAction(action)
                    ? `Adapter: ${action.command}`
                    : `Adapter pending: ${action.command}`}
                </span>
                <button
                  type="submit"
                  disabled={!canSubmitBlueprintAction(action) || isPending}
                  className="inline-flex h-7 items-center rounded-md bg-slate-900 px-2.5 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {pendingActionKey === action.key ? "Running" : "Run"}
                </button>
              </div>
            </form>
          ))}
        </div>
      ) : (
        <EmptyState>No Blueprint actions for this workspace role.</EmptyState>
      )}
    </Panel>
  );
}

function WorkspaceDetailHeader({
  item,
  parentTask,
  presentation,
  capabilities,
  displayTitle,
  owner,
  isSystemOwner,
  checklistDone,
  checklistTotal,
  refLabel,
  operationalCoreFlow,
  currentWorkspaceNavMetadata,
  currentWorkspaceRole,
  operationContract,
  businessItemCount,
}: {
  item: TaskItemDetail;
  parentTask?: ParentTask | null;
  presentation: ReturnType<typeof workspacePresentation>;
  capabilities: WorkspaceCapabilities;
  displayTitle: string;
  owner?: UserSummary | null;
  isSystemOwner: boolean;
  checklistDone: number;
  checklistTotal: number;
  refLabel: string;
  operationalCoreFlow: ReturnType<typeof selectOperationalCoreFlowForWorkspaceRole>;
  currentWorkspaceNavMetadata: ReturnType<typeof workspaceNavMetadata>;
  currentWorkspaceRole?: string | null;
  operationContract?: OperationalBlueprintContract | null;
  businessItemCount: number;
}) {
  const stageVisual = workspaceStageVisual({
    note: item.note,
    title: item.title,
    flowStageKey: currentWorkspaceNavMetadata.flowStageKey,
    operationRole: currentWorkspaceRole,
  });
  const HeaderIcon = stageVisual.Icon;

  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-gradient-to-br from-white via-white to-indigo-50/35 shadow-[0_14px_40px_rgba(30,41,59,0.07)]">
      <div className="grid gap-5 px-5 py-5 xl:grid-cols-[350px_minmax(0,1fr)_220px] xl:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ring-1 ${stageVisual.frame}`}>
            <HeaderIcon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-blue-700">
              <GitBranch className="h-3.5 w-3.5" />
              <span className="truncate">{presentation.workspaceType}</span>
            </div>
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-black tracking-tight text-slate-950">
                {displayTitle}
              </h1>
              <TaskStatusSignal status={item.status} />
              {capabilities.priority ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700">
                  <PrioritySignal priority={item.priority} showLabel />
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
          {capabilities.assignee ? (
            <HeaderMetric
              icon={<UserRound className="h-3.5 w-3.5" />}
              label="Owner"
              value={<UserIdentity user={owner} isSystem={isSystemOwner} />}
            />
          ) : null}
          {capabilities.dueDate ? (
            <HeaderMetric
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Due date"
              value={formatDate(item.dueAt)}
            />
          ) : null}
          {capabilities.checklist ? (
            <HeaderMetric
              icon={<ListChecks className="h-3.5 w-3.5" />}
              label="Checklist"
              value={`${checklistDone}/${checklistTotal}`}
            />
          ) : null}
          <HeaderMetric
            icon={<Folder className="h-3.5 w-3.5" />}
            label="Space"
            value={parentTask?.title || "-"}
          />
        </div>

        <div className="border-l border-slate-200 py-1 pl-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace ref
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="min-w-0 truncate font-mono text-sm font-extrabold text-slate-950">
              {taskItemRef(item.id)}
            </div>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-violet-600 hover:bg-violet-50">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1 truncate text-[10px] font-semibold text-slate-400">
            {refLabel} · {formatDateTime(item.createdAt)}
          </div>
        </div>
      </div>

      {operationalCoreFlow ? (
        <CoreFlowWorkspaceNav
          currentItemId={item.id}
          currentWorkspaceRole={currentWorkspaceRole}
          currentCoreFlowKey={
            operationalCoreFlow.key || currentWorkspaceNavMetadata.coreFlowKey
          }
          steps={operationalCoreFlow.steps}
          workspaceRoles={operationContract?.workspaceRoles ?? []}
          parentTask={parentTask}
          itemCount={businessItemCount}
          itemLabel={presentation.itemLabel}
        />
      ) : (
        <GenericFlowWorkspaceNav
          currentItemId={item.id}
          parentTask={parentTask}
          itemCount={businessItemCount}
          itemLabel={presentation.itemLabel}
        />
      )}
    </section>
  );
}

export default function TaskItemDetailClient({
  item,
  users,
  vendors,
  technicalDetailCatalogOptions,
  currentUser,
}: {
  item: TaskItemDetail;
  users: UserSummary[];
  vendors?: VendorOption[];
  technicalDetailCatalogOptions?: TechnicalDetailCatalogOption[];
  currentUser?: UserSummary | null;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>(() =>
    initialWorkspaceTab(item.note),
  );
  const [activityMode, setActivityMode] = useState<ActivityMode>("QUEUE");
  const [activityJumpTarget, setActivityJumpTarget] = useState<ActivityJumpTarget | null>(null);
  const parentTask = item.task;
  const checklists = useMemo(() => item.checklists ?? [], [item.checklists]);
  const activities = useMemo(() => item.activities ?? [], [item.activities]);
  const businessBindings = useMemo(
    () => item.businessBindings ?? [],
    [item.businessBindings],
  );
  const queueItems = useMemo(() => item.queueItems ?? [], [item.queueItems]);
  const workspaceSnapshot = useMemo(
    () => parseWorkspaceDefinitionSnapshot(item.note),
    [item.note],
  );
  const capabilities = useMemo(
    () => resolveWorkspaceCapabilities({
      note: item.note,
      snapshot: workspaceSnapshot,
    }),
    [item.note, workspaceSnapshot],
  );
  const presentation = useMemo(
    () => workspacePresentation(workspaceSnapshot),
    [workspaceSnapshot],
  );
  const workspaceWorkTypeKey =
    workspaceSnapshot?.workTypeKey ?? noteTextValue(item.note, "workTypeKey");
  const isServiceOperationWorkspace = workspaceWorkTypeKey === "service-operation";
  const serviceOperationWorkspaceRole = useMemo(
    () => serviceOperationWorkspaceRoleFromNote(item.note),
    [item.note],
  );
  const isPaymentOperation = serviceOperationWorkspaceRole
    ?.toUpperCase()
    .startsWith("PAYMENT_");
  const currentOperationContract = workspaceWorkTypeKey
    ? operationalBlueprintForWorkType({
        workTypeKey: workspaceWorkTypeKey,
        coordinationContext: isPaymentOperation ? "PAYMENT" : "TECHNICAL",
      })
    : null;
  const operationContract =
    (isPaymentOperation ? currentOperationContract : null) ??
    workspaceSnapshot?.operation ??
    currentOperationContract;
  const currentWorkspaceNavMetadata = useMemo(
    () => workspaceNavMetadata({ note: item.note }, operationContract?.workspaceRoles ?? []),
    [item.note, operationContract],
  );
  const operationalCoreFlow = useMemo(
    () =>
      selectOperationalCoreFlowForWorkspaceRole({
        contract: operationContract,
        workspaceRole: serviceOperationWorkspaceRole,
      }),
    [operationContract, serviceOperationWorkspaceRole],
  );
  const operationWorkspaceRoleDefinition = useMemo(
    () =>
      operationContract?.workspaceRoles.find(
        (item) =>
          item.key.toUpperCase() === serviceOperationWorkspaceRole?.toUpperCase(),
      ) ?? null,
    [operationContract, serviceOperationWorkspaceRole],
  );
  const operationWorkspaceRoleTargetTypes = useMemo(() => {
    const role = operationWorkspaceRoleDefinition;
    if (!role) return [];

    return [
      role.identityTargetType,
      ...role.itemTargetTypes,
    ].filter((targetType): targetType is string => Boolean(targetType));
  }, [operationWorkspaceRoleDefinition]);
  const operationalActions = useMemo(
    () =>
      selectOperationalActionsForWorkspaceRole({
        contract: operationContract,
        workspaceRole: serviceOperationWorkspaceRole,
        targetTypes: [
          ...new Set([
            ...operationWorkspaceRoleTargetTypes,
            ...queueItems.map((queueItem) => queueItem.targetType),
            ...businessBindings.map((binding) => binding.targetType),
          ]),
        ],
      }),
    [
      businessBindings,
      operationContract,
      operationWorkspaceRoleTargetTypes,
      queueItems,
      serviceOperationWorkspaceRole,
    ],
  );
  const serviceRequestId =
    noteTextValue(item.note, "serviceRequestId") ??
    businessBindings.find((binding) => binding.targetType === "SERVICE_REQUEST")?.targetId ??
    null;
  const canCreateServiceOperationTechnicalIssue =
    isServiceOperationWorkspace &&
    Boolean(serviceRequestId);
  const itemTabLabel = isServiceOperationWorkspace
    ? "Technical Issue Operation"
    : presentation.itemLabel;
  const businessTabLabel = isServiceOperationWorkspace
    ? "Technical Issue"
    : presentation.itemLabel;
  const displayTitle = repairVietnameseMojibake(item.title || "Workspace");
  const backHref = coordinationHref(parentTask, item.note);
  const isSystemOwner = noteHasSystemOwner(item.note);
  const owner = isSystemOwner
    ? null
    : mergeCurrentUserAvatar(
      item.ownerUser ?? item.assignedToUser ?? currentUser ?? null,
      currentUser,
    );
  const checklistDone = checklists.filter((row) => row.isDone).length;
  const ref = parentTask?.periodKey || compactId(parentTask?.id);
  const tabs: TabItem[] = [
    { key: "overview", label: "Tổng quan", icon: <FileText className="h-4 w-4" /> },
    { key: "activity", label: "Hoạt động", icon: <Clock3 className="h-4 w-4" /> },
    { key: "checklist", label: "Checklist", icon: <ListChecks className="h-4 w-4" /> },
    {
      key: "business",
      label: businessTabLabel,
      icon: <Folder className="h-4 w-4" />,
      badge: businessBindings.length || undefined,
    },
    { key: "info", label: "Thông tin", icon: <Info className="h-4 w-4" /> },
  ];
  const tabByKey = new Map(tabs.map((tab) => [tab.key, tab]));
  const capabilityTabs = [
    tabByKey.get("overview"),
    capabilities.workflow
      ? { key: "workflow" as const, label: "Workflow", icon: <GitBranch className="h-4 w-4" /> }
      : null,
    capabilities.activity ? tabByKey.get("activity") : null,
    capabilities.attachments
      ? { key: "attachments" as const, label: "Attachments", icon: <Paperclip className="h-4 w-4" /> }
      : null,
    capabilities.checklist ? tabByKey.get("checklist") : null,
    capabilities.items ? tabByKey.get("business") : null,
    capabilities.priority
      ? { key: "priority" as const, label: "Priority", icon: <Tag className="h-4 w-4" /> }
      : null,
    tabByKey.get("info"),
  ].filter((tab): tab is TabItem => Boolean(tab));

  function openQueueActivity(queueItemId: string, mode: ActivityJumpTarget["mode"]) {
    setActiveTab("activity");
    setActivityMode("QUEUE");
    setActivityJumpTarget({
      queueItemId,
      mode,
      nonce: Date.now(),
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-[1680px] px-5 py-5 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <AdminBreadcrumbs
            items={[
              { label: "Space Management", href: backHref },
              {
                label: parentTask?.title || "Space",
                href: backHref,
              },
              { label: displayTitle },
            ]}
          />
          {capabilities.assignee ? (
            <SharingEditor
              taskItemId={item.id}
              users={users}
              sharedUsers={item.sharedUsers ?? []}
              sharedUserIds={item.sharedUserIds ?? []}
              currentUser={currentUser}
              compact
            />
          ) : null}
        </div>

        <WorkspaceDetailHeader
          item={item}
          parentTask={parentTask}
          presentation={presentation}
          capabilities={capabilities}
          displayTitle={displayTitle}
          owner={owner}
          isSystemOwner={isSystemOwner}
          checklistDone={checklistDone}
          checklistTotal={checklists.length}
          refLabel={ref}
          operationalCoreFlow={operationalCoreFlow}
          currentWorkspaceNavMetadata={currentWorkspaceNavMetadata}
          currentWorkspaceRole={serviceOperationWorkspaceRole}
          operationContract={operationContract}
          businessItemCount={businessBindings.length}
        />

        <div className="mt-4">
          <div className="min-w-0">
            <SectionTabs
              items={capabilityTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="mt-4">
            {activeTab === "overview" ? (
              <div className="space-y-4">
                <OverviewPanel
                  item={item}
                  activities={activities}
                  checklists={checklists}
                  businessBindings={businessBindings}
                  queueItems={queueItems}
                  capabilities={capabilities}
                  presentation={presentation}
                  parentTask={parentTask}
                  serviceRequestId={serviceRequestId}
                  onTabChange={setActiveTab}
                />
                {!isServiceOperationWorkspace && operationalActions.length ? (
                  <BlueprintActionDiscoveryPanel
                    taskItemId={item.id}
                    workspaceRole={serviceOperationWorkspaceRole}
                    actions={operationalActions}
                  />
                ) : null}
              </div>
            ) : null}

            {activeTab === "workflow" ? (
              <WorkflowTabPanel
                taskItemId={item.id}
                items={queueItems}
                snapshot={workspaceSnapshot}
              />
            ) : null}

            {activeTab === "activity" ? (
              <Panel
                title="Hoạt động"
                icon={<Clock3 className="h-4 w-4" />}
                action={
                  <div className="flex items-center gap-2">
                    {(["QUEUE", "ALL"] as ActivityMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setActivityMode(mode)}
                        className={cn(
                          "h-8 rounded-lg px-3 text-xs font-semibold ring-1 transition",
                          activityMode === mode
                            ? "bg-slate-900 text-white ring-slate-900"
                            : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
                        )}
                      >
                        {mode === "ALL" ? "All activity" : "By item"}
                      </button>
                    ))}
                  </div>
                }
              >
                <ActivityViewModelFeed
                  items={activities}
                  mentionUsers={users}
                  businessBindings={businessBindings}
                  queueItems={queueItems}
                  mode={activityMode}
                  discussionEnabled={capabilities.discussion}
                  viewerUserId={currentUser?.id}
                  onMarkMentionsRead={async () => {
                    await markTaskItemMentionsReadAction({ taskItemId: item.id });
                    router.refresh();
                  }}
                  jumpTarget={activityJumpTarget}
                />
              </Panel>
            ) : null}

            {activeTab === "attachments" ? <AttachmentsTabPanel /> : null}
            {activeTab === "checklist" ? <ReadonlyChecklist items={checklists} /> : null}
            {activeTab === "business" ? (
              <QueueWorkQueue
                taskItemId={item.id}
                items={queueItems}
                capabilities={capabilities}
                itemLabel={itemTabLabel}
                workspaceWorkTypeKey={workspaceSnapshot?.workTypeKey ?? null}
                operationalActions={operationalActions}
                serviceRequestId={canCreateServiceOperationTechnicalIssue ? serviceRequestId : null}
                vendorOptions={vendors ?? []}
                technicalDetailCatalogOptions={technicalDetailCatalogOptions ?? []}
                currentUser={currentUser}
                onOpenQueueActivity={openQueueActivity}
              />
            ) : null}
            {activeTab === "priority" ? (
              <PriorityTabPanel priority={item.priority} status={item.status} />
            ) : null}
            {activeTab === "info" ? (
              <DetailInfo item={item} presentation={presentation} />
            ) : null}
            </div>
          </div>

          <aside className="hidden">
            <DetailInfo item={item} presentation={presentation} />
            {!isServiceOperationWorkspace && operationalActions.length ? (
              <BlueprintActionDiscoveryPanel
                taskItemId={item.id}
                workspaceRole={serviceOperationWorkspaceRole}
                actions={operationalActions}
              />
            ) : null}
            {capabilities.items ? (
              <QueueSummary items={queueItems} itemLabel={presentation.itemLabel} />
            ) : null}
            <Panel icon={<Tag className="h-4 w-4" />} title="Thông tin mở rộng">
              <dl className="space-y-3 text-sm">
                {capabilities.activity ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Hoạt động</dt>
                  <dd className="font-semibold text-slate-950">
                    {activities.length}
                  </dd>
                </div>
                ) : null}
                {capabilities.priority ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Priority</dt>
                  <dd>
                    <PrioritySignal priority={item.priority} showLabel />
                  </dd>
                </div>
                ) : null}
                {capabilities.assignee ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Owner</dt>
                  <dd className="min-w-0 font-semibold text-slate-950">
                    <UserIdentity user={owner} isSystem={isSystemOwner} />
                  </dd>
                </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Workspace id</dt>
                  <dd className="font-mono text-xs text-slate-500">
                    {compactId(item.id)}
                  </dd>
                </div>
              </dl>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}
