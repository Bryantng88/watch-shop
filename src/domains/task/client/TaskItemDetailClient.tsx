"use client";

import {
  useMemo,
  useState,
  useTransition,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Clock3,
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  Info,
  ListChecks,
  MessageSquare,
  Plus,
  Send,
  Tag,
  UserRound,
  XCircle,
} from "lucide-react";
import type { TaskPriority, TaskStatus } from "@prisma/client";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
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
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import {
  addTaskItemActivityReplyAction,
  addManualQueueItemAction,
  applyQueueItemManualTransitionAction,
  searchManualQueueTargetsAction,
  updateTaskItemSharingAction,
} from "../actions/task.actions";

type UserSummary = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
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
  } | null;
  processingLabel?: string | null;
};

type QueueItemStatus = "WAITING" | "IN_PROGRESS" | "FEEDBACK" | "DONE";

type TaskItemQueueItem = {
  id: string;
  taskItemId: string;
  targetType: string;
  targetId: string;
  source: "AUTO" | "MANUAL";
  status: QueueItemStatus;
  preview: {
    title: string | null;
    ref: string | null;
    status: string | null;
    imageUrl?: string | null;
    imageUrls?: string[];
  };
  latestActivityTitle: string | null;
  feedbackCount: number;
  activityCount: number;
  workflowKey?: string | null;
  currentWorkflowState?: string | null;
  currentWorkflowStateLabel?: string | null;
  isWorkflowDone?: boolean;
  manualTransitions?: Array<{
    actionKey: string;
    label: string;
    fromState: string;
    toState: string;
    manualActionLabel: string;
    enabled: boolean;
    reason: string | null;
    metadata?: unknown;
  }>;
  intakeNote?: string | null;
  updatedAt: string;
  href?: string | null;
};

type ManualQueueTargetPreview = {
  targetType: string;
  targetId: string;
  title: string;
  ref: string | null;
  status: string | null;
  imageUrl: string | null;
  href: string | null;
};

type ParentTask = {
  id: string;
  title: string;
  kind?: string | null;
  status?: string | null;
  priority?: string | null;
  dueAt?: string | null;
  periodKey?: string | null;
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
  sharedUsers?: UserSummary[];
  assignedToUser?: UserSummary | null;
  task?: ParentTask | null;
  checklists?: TaskItemChecklist[];
  activities?: TaskItemActivityViewModel[];
  businessBindings?: TaskItemBinding[];
  queueItems?: TaskItemQueueItem[];
};

type DetailTab = "overview" | "activity" | "checklist" | "business" | "info";
type QueueFilter = "ALL" | QueueItemStatus;
type ActivityMode = "ALL" | "QUEUE";

type TabItem = {
  key: DetailTab;
  label: string;
  icon: ReactNode;
};

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

function metadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function businessQueueKey(targetType?: string | null, targetId?: string | null) {
  const type = String(targetType ?? "").trim();
  const id = String(targetId ?? "").trim();
  return type && id ? `${type}:${id}` : null;
}

function activityBusinessKeys(activity: TaskItemActivityViewModel) {
  const metadata = metadataRecord(activity.metadataJson);
  const targetType = typeof metadata.targetType === "string" ? metadata.targetType : null;
  const targetId = typeof metadata.targetId === "string" ? metadata.targetId : null;
  const keys = [businessQueueKey(targetType, targetId)].filter(Boolean) as string[];

  if (targetType === "WATCH" && targetId?.includes(":")) {
    const watchId = targetId.split(":")[0]?.trim();
    const canonicalKey = businessQueueKey(targetType, watchId);
    if (canonicalKey && !keys.includes(canonicalKey)) keys.push(canonicalKey);
  }

  return keys;
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
      return !/^(workTypeKey|workflowKey|ownerType|shareGroupKey|sharedUserIds):/i.test(trimmed);
    })
    .join("\n")
    .trim();
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

function coordinationHref(parentTask?: ParentTask | null) {
  if (!parentTask) return "/admin/coordination/operation";

  const kind = String(parentTask.kind ?? "").toUpperCase();
  const title = String(parentTask.title ?? "").toLowerCase();
  let workspace = "operation";

  if (kind === "SERVICE") workspace = "technical";
  if (kind === "BUSINESS") {
    workspace = title.includes("khác") || title.includes("khac") ? "general" : "sales";
  }

  const date = dateFromIsoWeekPeriod(parentTask.periodKey);
  return date
    ? `/admin/coordination/${workspace}?date=${date}`
    : `/admin/coordination/${workspace}`;
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
  const src = resolveMediaPreviewSrc(avatarUrl);

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
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-slate-950">
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
}: {
  taskItemId: string;
  users: UserSummary[];
  sharedUsers: UserSummary[];
  sharedUserIds: string[];
  currentUser?: UserSummary | null;
}) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [localSharedIds, setLocalSharedIds] = useState(sharedUserIds);
  const [isPending, startTransition] = useTransition();
  const sharedIdSet = new Set(localSharedIds);
  const visibleSharedUsers = localSharedIds
    .map((id) => sharedUsers.find((user) => user.id === id) ?? users.find((user) => user.id === id))
    .map((user) => mergeCurrentUserAvatar(user, currentUser))
    .filter(Boolean) as UserSummary[];
  const availableUsers = users
    .map((user) => mergeCurrentUserAvatar(user, currentUser) ?? user)
    .filter((user) => !sharedIdSet.has(user.id));

  function update(nextIds: string[]) {
    setLocalSharedIds(nextIds);
    startTransition(async () => {
      await updateTaskItemSharingAction({
        taskItemId,
        sharedUserIds: nextIds,
      });
      router.refresh();
    });
  }

  function addSelected() {
    if (!selectedUserId) return;
    update([...localSharedIds, selectedUserId]);
    setSelectedUserId("");
  }

  function removeUser(userId: string) {
    update(localSharedIds.filter((id) => id !== userId));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Shared with</h3>
          <p className="mt-1 text-xs text-slate-500">People who can participate in this workspace.</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {visibleSharedUsers.length ? visibleSharedUsers.map((user) => (
          <span
            key={user.id}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-2 text-sm font-medium text-slate-700"
          >
            <UserAvatar
              label={userLabel(user)}
              avatarUrl={user.avatarUrl}
              className="h-7 w-7"
            />
            <span className="max-w-[160px] truncate">{userLabel(user)}</span>
            <button
              type="button"
              onClick={() => removeUser(user.id)}
              disabled={isPending}
              className="rounded-full p-0.5 text-slate-400 hover:bg-white hover:text-rose-600"
              aria-label={`Bỏ chia sẻ ${userLabel(user)}`}
            >
              <XCircle className="h-4 w-4" />
            </button>
          </span>
        )) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Not shared with anyone yet.
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
          {icon ? <span className="text-slate-500">{icon}</span> : null}
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

function ActivityViewModelIcon({ activity }: { activity: TaskItemActivityViewModel }) {
  if (activity.icon === "message") return <MessageSquare className="h-4 w-4" />;
  if (activity.icon === "system") return <CircleDot className="h-4 w-4" />;
  if (activity.tone === "rose") return <XCircle className="h-4 w-4" />;
  if (activity.tone === "green") return <Send className="h-4 w-4" />;
  return <CircleDot className="h-4 w-4" />;
}

function ActivityBody({ body }: { body: string | null }) {
  const [expanded, setExpanded] = useState(false);
  if (!body) return null;

  const isLong = body.length > 220 || body.includes("\n");
  const shouldClamp = isLong && !expanded;

  return (
    <div className="mt-3 text-sm leading-6 text-slate-700">
      <div
        className={cn(
          "whitespace-pre-wrap",
          shouldClamp ? "max-h-16 overflow-hidden" : "",
        )}
      >
        {body}
      </div>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          {expanded ? "Thu gọn nội dung" : "Xem nội dung"}
        </button>
      ) : null}
    </div>
  );
}

function ActivityFeedback({
  feedback,
}: {
  feedback: TaskItemActivityViewModel["feedback"];
}) {
  if (!feedback) return null;

  return (
    <div className="mt-3 border-l-2 border-rose-300 bg-rose-50/50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
        <FileText className="h-3.5 w-3.5" />
        Lý do / Feedback
      </div>
      <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {feedback.message}
      </div>
    </div>
  );
}

function ActivityBusinessContextChip({
  binding,
}: {
  binding?: TaskItemBinding | null;
}) {
  if (!binding?.preview) return null;
  const preview = binding.preview;
  const typeLabel = targetLabel(binding.targetType);

  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
      <span className="shrink-0 font-semibold text-slate-600">{typeLabel}</span>
      {preview.ref ? (
        <>
          <span className="text-slate-300">·</span>
          <span className="shrink-0 font-mono text-[10px] text-slate-400">
            {preview.ref}
          </span>
        </>
      ) : null}
    </span>
  );
}

function ActivityReplyComposer({
  activityId,
  onCancel,
  onSubmitted,
}: {
  activityId: string;
  onCancel: () => void;
  onSubmitted: () => void;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = body.trim().length > 0 && !submitting;

  async function submitReply() {
    const text = body.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await addTaskItemActivityReplyAction({
        activityId,
        body: text,
      });
      setBody("");
      onSubmitted();
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "Could not add discussion."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    void submitReply();
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={submitting}
            placeholder="Discuss this activity..."
            className="min-h-[72px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            {error ? (
              <div className="text-xs font-medium text-rose-600">{error}</div>
            ) : (
              <div className="text-xs text-slate-400">
                Enter to send, Shift+Enter for a new line.
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitReply()}
                disabled={!canSubmit}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityReplies({
  activity,
  open,
  composerOpen,
  onToggleOpen,
  onOpenComposer,
  onCloseComposer,
  onSubmitted,
  replyCount,
}: {
  activity: TaskItemActivityViewModel;
  open: boolean;
  composerOpen: boolean;
  onToggleOpen: () => void;
  onOpenComposer: () => void;
  onCloseComposer: () => void;
  onSubmitted: () => void;
  replyCount: number;
}) {
  const summary = replyCount
    ? `${replyCount} discussions`
    : "Add discussion";

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onToggleOpen}
        className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <MessageSquare className="h-4 w-4" />
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
        {summary}
      </button>

      {open ? (
        <div className="mt-3 space-y-3 border-l border-slate-200 pl-4">
          {activity.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <UserAvatar
                label={reply.actorLabel}
                avatarUrl={reply.actorAvatarUrl}
                isSystem={!reply.actorUserId}
                className="h-8 w-8"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-800">
                    {reply.actorLabel}
                  </span>
                  <span className="text-slate-400">
                    {formatDateTime(reply.createdAt, "")}
                  </span>
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {reply.body}
                </div>
              </div>
            </div>
          ))}

          {composerOpen ? (
            <ActivityReplyComposer
              activityId={activity.id}
              onCancel={onCloseComposer}
              onSubmitted={onSubmitted}
            />
          ) : (
            <button
              type="button"
              onClick={onOpenComposer}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Plus className="h-4 w-4" />
              Add discussion
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ActivityViewModelCard({
  activity,
  businessContext,
}: {
  activity: TaskItemActivityViewModel;
  businessContext?: TaskItemBinding | null;
}) {
  const classes = toneClasses(activity.tone);
  const actor = activity.actorLabel || "He thong";
  const isSystemActor = !activity.actorUserId;
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [optimisticReplyCount, setOptimisticReplyCount] = useState(
    activity.replies.length,
  );

  function toggleReplies() {
    if (optimisticReplyCount === 0 && !repliesOpen) {
      setRepliesOpen(true);
      setComposerOpen(true);
      return;
    }
    setRepliesOpen((value) => !value);
  }

  function handleSubmitted() {
    setOptimisticReplyCount((count) => count + 1);
    setComposerOpen(false);
    setRepliesOpen(false);
  }

  return (
    <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4">
      <div className="pt-3 text-right text-xs leading-5 text-slate-500">
        <div className="font-semibold text-slate-700">
          {formatTime(activity.occurredAt)}
        </div>
        <div>{formatDate(activity.occurredAt, "")}</div>
      </div>

      <article
        className={cn(
          "min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md",
          classes.card,
        )}
      >
        <div className="flex min-w-0 gap-3">
          <div className="relative shrink-0">
            <UserAvatar
              label={actor}
              avatarUrl={activity.actorAvatarUrl}
              isSystem={isSystemActor}
              className="h-10 w-10"
            />
            <span
              className={cn(
                "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px]",
                classes.dot,
              )}
            >
              <ActivityViewModelIcon activity={activity} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-sm font-semibold text-slate-950">
                {activity.title}
              </h3>
              <ActivityBusinessContextChip binding={businessContext} />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>{actor}</span>
              <span>-</span>
              <span>{formatDateTime(activity.occurredAt, "")}</span>
            </div>
          </div>
        </div>

        <ActivityBody body={activity.body} />
        <ActivityFeedback feedback={activity.feedback} />
        <ActivityReplies
          activity={activity}
          open={repliesOpen}
          composerOpen={composerOpen}
          onToggleOpen={toggleReplies}
          onOpenComposer={() => {
            setRepliesOpen(true);
            setComposerOpen(true);
          }}
          onCloseComposer={() => setComposerOpen(false)}
          onSubmitted={handleSubmitted}
          replyCount={optimisticReplyCount}
        />
      </article>
    </div>
  );
}

function ActivityViewModelFeed({
  items,
  businessBindings,
  queueItems,
  mode,
}: {
  items: TaskItemActivityViewModel[];
  businessBindings: TaskItemBinding[];
  queueItems: TaskItemQueueItem[];
  mode: ActivityMode;
}) {
  if (!items.length) {
    return <EmptyState>Chua co hoat dong nao.</EmptyState>;
  }

  if (mode === "QUEUE") {
    return <ActivityGroupedByQueue items={items} queueItems={queueItems} />;
  }

  const bindingByTarget = new Map(
    businessBindings
      .map((binding) => [businessQueueKey(binding.targetType, binding.targetId), binding] as const)
      .filter((entry): entry is readonly [string, TaskItemBinding] => Boolean(entry[0])),
  );

  return (
    <div className="space-y-4">
      {items.map((activity) => (
        <ActivityViewModelCard
          key={activity.id}
          activity={activity}
          businessContext={activityBusinessKeys(activity)
            .map((key) => bindingByTarget.get(key))
            .find(Boolean)}
        />
      ))}
    </div>
  );
}

function ActivityGroupedByQueue({
  items,
  queueItems,
}: {
  items: TaskItemActivityViewModel[];
  queueItems: TaskItemQueueItem[];
}) {
  const queueByTarget = new Map(
    queueItems
      .map((item) => [businessQueueKey(item.targetType, item.targetId), item] as const)
      .filter((entry): entry is readonly [string, TaskItemQueueItem] => Boolean(entry[0])),
  );
  const groups = new Map<string, {
    queueItem: TaskItemQueueItem | null;
    activities: TaskItemActivityViewModel[];
  }>();

  for (const queueItem of queueItems) {
    groups.set(queueItem.id, { queueItem, activities: [] });
  }
  groups.set("general", { queueItem: null, activities: [] });

  for (const activity of items) {
    const queueItem = activityBusinessKeys(activity)
      .map((key) => queueByTarget.get(key))
      .find(Boolean);
    const groupKey = queueItem?.id ?? "general";
    const group = groups.get(groupKey) ?? {
      queueItem: queueItem ?? null,
      activities: [],
    };
    group.activities.push(activity);
    groups.set(groupKey, group);
  }

  const visibleGroups = Array.from(groups.entries())
    .map(([id, group]) => ({ id, ...group }))
    .filter((group) => group.activities.length || group.queueItem);

  return (
    <div className="space-y-6">
      {visibleGroups.map((group) => (
        <div key={group.id}>
          <div className="mb-3 flex items-center gap-3">
            {group.queueItem ? <QueueItemThumbnail item={group.queueItem} /> : null}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-950">
                {group.queueItem ? queueItemTitle(group.queueItem) : "Hoạt động chung"}
              </div>
              {group.queueItem ? (
                <div className="mt-0.5 truncate text-xs text-slate-500">
                  {queueItemRef(group.queueItem)} - {queueStatusLabel(group.queueItem.status)}
                </div>
              ) : (
                <div className="mt-0.5 text-xs text-slate-500">
                  Hoạt động không gắn với nghiệp vụ cụ thể
                </div>
              )}
            </div>
          </div>

          {group.activities.length ? (
            <div className="space-y-3 border-l border-slate-200 pl-4">
              {group.activities.map((activity) => (
                <div key={activity.id} className="relative">
                  <span className="absolute -left-[21px] top-2 h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0 truncate text-sm font-medium text-slate-900">
                      {activity.title}
                    </div>
                    <div className="shrink-0 text-xs text-slate-400">
                      {formatDateTime(activity.occurredAt, "")}
                    </div>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {activity.actorLabel}
                  </div>
                  {activity.body ? (
                    <div className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                      {activity.body}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="border-l border-slate-200 pl-4 text-sm text-slate-400">
              Chưa có hoạt động.
            </div>
          )}
        </div>
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

function queueStatusLabel(status: QueueItemStatus) {
  if (status === "WAITING") return "Cần xử lý";
  if (status === "IN_PROGRESS") return "Đang xử lý";
  if (status === "FEEDBACK") return "Feedback";
  return "Hoàn tất";
}

function queueStatusTone(status: QueueItemStatus) {
  if (status === "FEEDBACK") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (status === "DONE") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "IN_PROGRESS") return "bg-blue-50 text-blue-700 ring-blue-100";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function QueueStatusBadge({ status }: { status: QueueItemStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        queueStatusTone(status),
      )}
    >
      {queueStatusLabel(status)}
    </span>
  );
}

function queueItemTitle(item: TaskItemQueueItem) {
  return item.preview.title || targetLabel(item.targetType);
}

function queueItemRef(item: TaskItemQueueItem) {
  return item.preview.ref || item.preview.status || targetLabel(item.targetType);
}

function QueueItemThumbnail({ item }: { item: TaskItemQueueItem }) {
  const imageUrls = item.preview.imageUrls?.length
    ? item.preview.imageUrls
    : item.preview.imageUrl
      ? [item.preview.imageUrl]
      : [];
  const src = resolveMediaPreviewSrc(imageUrls[0]);
  const label = queueItemTitle(item);

  if (item.targetType === "ORDER" && imageUrls.length > 1) {
    return (
      <div className="relative h-11 w-14 shrink-0">
        {imageUrls.slice(0, 3).map((url, index) => {
          const stackedSrc = resolveMediaPreviewSrc(url);
          return (
            <div
              key={`${url}:${index}`}
              className="absolute top-0 flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-slate-200"
              style={{ left: index * 6, zIndex: 3 - index }}
            >
              {stackedSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={stackedSrc} alt={label} className="h-full w-full object-cover" />
              ) : (
                targetLabel(item.targetType).slice(0, 1)
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="h-full w-full object-cover" />
      ) : (
        targetLabel(item.targetType).slice(0, 1)
      )}
    </div>
  );
}

function BusinessQueueImage({ binding }: { binding: TaskItemBinding }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
      {targetLabel(binding.targetType).slice(0, 1)}
    </div>
  );
}

function ManualQueueIntake({ taskItemId }: { taskItemId: string }) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [intakeNote, setIntakeNote] = useState("");
  const [results, setResults] = useState<ManualQueueTargetPreview[]>([]);
  const [selected, setSelected] = useState<ManualQueueTargetPreview | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const search = () => {
    startTransition(async () => {
      const result = await searchManualQueueTargetsAction({
        targetType: "WATCH",
        keyword,
        limit: 10,
      });
      setResults(result.items);
      setSelected(null);
    });
  };

  const add = () => {
    if (!selected) return;
    startTransition(async () => {
      await addManualQueueItemAction({
        taskItemId,
        targetType: selected.targetType,
        targetId: selected.targetId,
        intakeNote,
      });
      setKeyword("");
      setIntakeNote("");
      setResults([]);
      setSelected(null);
      setOpen(false);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="grid gap-3 lg:grid-cols-[150px_minmax(0,1fr)_auto]">
        <select
          value="WATCH"
          disabled
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
        >
          <option value="WATCH">Watch</option>
        </select>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") search();
          }}
          placeholder="Tìm theo tên hoặc SKU"
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
        />
        <button
          type="button"
          onClick={search}
          disabled={isPending}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
        >
          Tìm
        </button>
      </div>

      {results.length ? (
        <div className="mt-3 max-h-64 divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200 bg-white">
          {results.map((item) => {
            const active = selected?.targetId === item.targetId;
            const src = resolveMediaPreviewSrc(item.imageUrl);

            return (
              <button
                key={item.targetId}
                type="button"
                onClick={() => setSelected(item)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left transition",
                  active ? "bg-slate-100" : "hover:bg-slate-50",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    "W"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>{item.ref || "Watch"}</span>
                    {item.status ? <span>{item.status}</span> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      <label className="mt-3 block">
        <span className="text-xs font-semibold text-slate-600">Yêu cầu xử lý</span>
        <textarea
          value={intakeNote}
          onChange={(event) => setIntakeNote(event.target.value)}
          rows={2}
          placeholder="Ví dụ: Chụp thêm hình mặt số và dây."
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
        />
      </label>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={add}
          disabled={!selected || isPending}
          className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}

function QueueWorkQueue({
  taskItemId,
  items,
}: {
  taskItemId: string;
  items: TaskItemQueueItem[];
}) {
  const [filter, setFilter] = useState<QueueFilter>("ALL");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const filters: Array<{ key: QueueFilter; label: string }> = [
    { key: "ALL", label: "All" },
    { key: "WAITING", label: "Waiting" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "FEEDBACK", label: "Feedback" },
    { key: "DONE", label: "Done" },
  ];
  const visibleItems = filter === "ALL"
    ? items
    : items.filter((item) => item.status === filter);
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
      title="Items"
      action={
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} items
        </span>
      }
    >
      <div className="space-y-3">
        <ManualQueueIntake taskItemId={taskItemId} />
        {items.length ? (
          <>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = item.key === filter;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "h-8 rounded-lg px-3 text-xs font-semibold ring-1 transition",
                    active
                      ? "bg-slate-900 text-white ring-slate-900"
                      : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {visibleItems.length ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <div className="min-w-[920px]">
                <div className="grid grid-cols-[minmax(250px,1.3fr)_130px_150px_170px_80px_80px_120px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                  <div>Item</div>
                  <div>Status</div>
                  <div>Latest Activity</div>
                  <div>Workflow</div>
                  <div>Feedback</div>
                  <div>Activity</div>
                  <div>Updated</div>
                  <div className="text-right">Open</div>
                </div>

                {visibleItems.map((queueItem) => (
                  <div
                    key={queueItem.id}
                    className="grid grid-cols-[minmax(250px,1.3fr)_130px_150px_170px_80px_80px_120px_110px] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <QueueItemThumbnail item={queueItem} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-950">
                          {queueItemTitle(queueItem)}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{queueItemRef(queueItem)}</span>
                          <span>-</span>
                          <span>{targetLabel(queueItem.targetType)}</span>
                          <span>-</span>
                          <span>{queueItem.source === "MANUAL" ? "Manual" : "Auto"}</span>
                        </div>
                        {queueItem.intakeNote ? (
                          <div className="mt-2 max-w-[360px]">
                            <div className="text-[11px] font-semibold uppercase text-slate-400">
                              Intake note
                            </div>
                            <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600">
                              {queueItem.intakeNote}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <QueueStatusBadge status={queueItem.status} />
                    </div>

                    <div className="min-w-0 self-center">
                      <div className="truncate text-xs font-medium text-slate-700">
                        {queueItem.latestActivityTitle || "-"}
                      </div>
                    </div>

                    <div className="min-w-0 self-center">
                      <div className="truncate text-xs font-semibold text-slate-700">
                        {queueItem.currentWorkflowStateLabel ||
                          queueItem.currentWorkflowState ||
                          "-"}
                      </div>
                      {queueItem.manualTransitions?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {queueItem.manualTransitions.map((transition) => {
                            const pendingKey = `${queueItem.id}:${transition.actionKey}`;
                            const pending = isPending && pendingId === pendingKey;
                            const disabled = pending || transition.enabled === false;

                            return (
                              <button
                                key={transition.actionKey}
                                type="button"
                                disabled={disabled}
                                onClick={() =>
                                  applyManualAction(queueItem, transition.actionKey)
                                }
                                title={transition.reason ?? undefined}
                                className="inline-flex h-7 items-center rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {pending ? "Applying" : transition.label || transition.manualActionLabel}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    <div className="self-center text-sm font-semibold text-slate-700">
                      {queueItem.feedbackCount}
                    </div>

                    <div className="self-center text-sm font-semibold text-slate-700">
                      {queueItem.activityCount}
                    </div>

                    <div className="self-center text-xs text-slate-500">
                      {formatDateTime(queueItem.updatedAt, "-")}
                    </div>

                    <div className="flex items-center justify-end">
                      {queueItem.href ? (
                        <Link
                          href={queueItem.href}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                           aria-label="Open item"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <EmptyState>No items match this filter.</EmptyState>
          )}
          </>
      ) : (
        <EmptyState>No items in this workspace yet.</EmptyState>
        )}
      </div>
    </Panel>
  );
}

function QueueSummary({ items }: { items: TaskItemQueueItem[] }) {
  return (
    <Panel icon={<GitBranch className="h-4 w-4" />} title="Items">
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
              +{items.length - 5} more items
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState>No items in this workspace yet.</EmptyState>
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
      icon={<GitBranch className="h-4 w-4" />}
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
              <div>Feedback</div>
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

                <div className="self-center text-sm font-semibold text-slate-700">
                  {binding.stats?.feedbackCount ?? 0}
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
    <Panel icon={<GitBranch className="h-4 w-4" />} title="Nghiệp vụ">
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

function DetailInfo({ item }: { item: TaskItemDetail }) {
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
          <dt className="text-slate-500">Space type</dt>
          <dd className="font-semibold text-slate-950">{parentTask?.kind || "-"}</dd>
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
    <div className="mt-4 border-b border-slate-200">
      <nav className="flex flex-wrap items-center gap-2" aria-label="Workspace">
        {items.map((item) => {
          const active = item.key === activeTab;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "inline-flex h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold",
                active
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function OverviewPanel({
  item,
  activityCount,
  checklistDone,
  checklistTotal,
  bindingCount,
}: {
  item: TaskItemDetail;
  activityCount: number;
  checklistDone: number;
  checklistTotal: number;
  bindingCount: number;
}) {
  const note = displayNote(item.note);

  return (
    <div className="space-y-5">
      <Panel icon={<FileText className="h-4 w-4" />} title="Tổng quan">
        {note ? (
          <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
            {note}
          </div>
        ) : (
          <EmptyState>No description for this workspace yet.</EmptyState>
        )}
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-950">Hoạt động</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {activityCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">sự kiện và trao đổi</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-950">Checklist</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {checklistDone}/{checklistTotal}
          </div>
          <div className="mt-1 text-xs text-slate-500">tiêu chí hoàn thành</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-950">
            Items
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {bindingCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">runtime items</div>
        </div>
      </div>
    </div>
  );
}

export default function TaskItemDetailClient({
  item,
  users,
  currentUser,
}: {
  item: TaskItemDetail;
  users: UserSummary[];
  currentUser?: UserSummary | null;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("activity");
  const [activityMode, setActivityMode] = useState<ActivityMode>("ALL");
  const parentTask = item.task;
  const checklists = useMemo(() => item.checklists ?? [], [item.checklists]);
  const activities = useMemo(() => item.activities ?? [], [item.activities]);
  const businessBindings = useMemo(
    () => item.businessBindings ?? [],
    [item.businessBindings],
  );
  const queueItems = useMemo(() => item.queueItems ?? [], [item.queueItems]);
  const backHref = coordinationHref(parentTask);
  const isSystemOwner = noteHasSystemOwner(item.note) && !item.ownerUser;
  const owner = mergeCurrentUserAvatar(
    item.ownerUser ?? item.assignedToUser ?? currentUser ?? null,
    currentUser,
  );
  const checklistDone = checklists.filter((row) => row.isDone).length;
  const ref = parentTask?.periodKey || compactId(parentTask?.id);
  const tabs: TabItem[] = [
    { key: "overview", label: "Tổng quan", icon: <FileText className="h-4 w-4" /> },
    { key: "activity", label: "Hoạt động", icon: <GitBranch className="h-4 w-4" /> },
    { key: "checklist", label: "Checklist", icon: <ListChecks className="h-4 w-4" /> },
    { key: "business", label: "Items", icon: <GitBranch className="h-4 w-4" /> },
    { key: "info", label: "Thông tin", icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-[1680px] px-5 py-5 lg:px-8">
        <div className="mb-5">
          <AdminBreadcrumbs
            items={[
              { label: "Space Management", href: backHref },
              {
                label: parentTask?.title || "Space",
                href: backHref,
              },
              { label: item.title || "Workspace" },
            ]}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              {parentTask ? (
                <Link
                  href={backHref}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to space
                </Link>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  Workspace
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  {taskItemRef(item.id)}
                </span>
              </div>

              <div className="mt-4 flex min-w-0 flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h1>
                <TaskStatusSignal status={item.status} />
                <span className="rounded-xl bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                  <PrioritySignal priority={item.priority} showLabel />
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100">
              <div className="text-xs font-medium text-slate-500">Workspace ref</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {taskItemRef(item.id)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-6">
            <HeaderMetric
              icon={<UserRound className="h-4 w-4" />}
              label="Owner"
              value={<UserIdentity user={owner} isSystem={isSystemOwner} />}
            />
            <HeaderMetric
              icon={<CalendarDays className="h-4 w-4" />}
              label="Due date"
              value={formatDate(item.dueAt)}
            />
            <HeaderMetric
              icon={<ListChecks className="h-4 w-4" />}
              label="Checklist"
              value={`${checklistDone}/${checklists.length}`}
            />
            <HeaderMetric
              icon={<Folder className="h-4 w-4" />}
              label="Space"
              value={parentTask?.title || "-"}
            />
            <HeaderMetric icon={<Tag className="h-4 w-4" />} label="Ref" value={ref} />
            <HeaderMetric
              icon={<Clock3 className="h-4 w-4" />}
              label="Tạo lúc"
              value={formatDateTime(item.createdAt)}
            />
          </div>
        </section>

        <SectionTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0">
            {activeTab === "overview" ? (
              <OverviewPanel
                item={item}
                activityCount={activities.length}
                checklistDone={checklistDone}
                checklistTotal={checklists.length}
                bindingCount={businessBindings.length}
              />
            ) : null}

            {activeTab === "activity" ? (
              <Panel
                title="Hoạt động"
                icon={<GitBranch className="h-4 w-4" />}
                action={
                  <div className="flex items-center gap-2">
                    {(["ALL", "QUEUE"] as ActivityMode[]).map((mode) => (
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
                  businessBindings={businessBindings}
                  queueItems={queueItems}
                  mode={activityMode}
                />
              </Panel>
            ) : null}

            {activeTab === "checklist" ? <ReadonlyChecklist items={checklists} /> : null}
            {activeTab === "business" ? (
              <QueueWorkQueue taskItemId={item.id} items={queueItems} />
            ) : null}
            {activeTab === "info" ? <DetailInfo item={item} /> : null}
          </div>

          <aside className="space-y-5">
            <SharingEditor
              taskItemId={item.id}
              users={users}
              sharedUsers={item.sharedUsers ?? []}
              sharedUserIds={item.sharedUserIds ?? []}
              currentUser={currentUser}
            />

            <DetailInfo item={item} />
            <QueueSummary items={queueItems} />
            <Panel icon={<Tag className="h-4 w-4" />} title="Thông tin mở rộng">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Hoạt động</dt>
                  <dd className="font-semibold text-slate-950">
                    {activities.length}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Priority</dt>
                  <dd>
                    <PrioritySignal priority={item.priority} showLabel />
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Owner</dt>
                  <dd className="min-w-0 font-semibold text-slate-950">
                    <UserIdentity user={owner} isSystem={isSystemOwner} />
                  </dd>
                </div>
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
