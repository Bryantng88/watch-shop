"use client";

import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
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
import { addTaskItemActivityReplyAction } from "../actions/task.actions";

type UserSummary = {
  id: string;
  name?: string | null;
  email?: string | null;
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
  assignedToUser?: UserSummary | null;
  task?: ParentTask | null;
  checklists?: TaskItemChecklist[];
  activities?: TaskItemActivityViewModel[];
  businessBindings?: TaskItemBinding[];
};

type DetailTab = "overview" | "activity" | "checklist" | "business" | "info";

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
// renders TaskItemActivityViewModel below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActivityFeed({ items }: { items: TimelineEntryViewModel[] }) {
  const blocks = useMemo(() => groupActivityBlocks(items), [items]);

  if (!blocks.length) {
    return <EmptyState>Chưa có activity nào cho phiếu xử lý này.</EmptyState>;
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

function BusinessQueueImage({ binding }: { binding: TaskItemBinding }) {
  const preview = binding.preview;

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
      {preview?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.imageUrl}
          alt={preview.title}
          className="h-full w-full object-cover"
        />
      ) : (
        targetLabel(binding.targetType).slice(0, 1)
      )}
    </div>
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
      setError(errorMessage(err, "Khong gui duoc trao doi."));
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
            placeholder="Trao đổi về hoạt động này..."
            className="min-h-[72px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            {error ? (
              <div className="text-xs font-medium text-rose-600">{error}</div>
            ) : (
              <div className="text-xs text-slate-400">
                Enter để gửi, Shift+Enter xuống dòng.
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => void submitReply()}
                disabled={!canSubmit}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Send className="h-4 w-4" />
                Gửi
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
    ? `${replyCount} trao đổi`
    : "Thêm trao đổi";

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
              Thêm trao đổi
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
}: {
  items: TaskItemActivityViewModel[];
  businessBindings: TaskItemBinding[];
}) {
  if (!items.length) {
    return <EmptyState>Chua co hoat dong nao.</EmptyState>;
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

function BusinessWorkQueue({ items }: { items: TaskItemBinding[] }) {
  return (
    <Panel
      icon={<GitBranch className="h-4 w-4" />}
      title="Business Work Queue"
      action={
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} nghiệp vụ
        </span>
      }
    >
      {items.length ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[minmax(240px,1.4fr)_120px_160px_90px_130px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              <div>Nghiệp vụ</div>
              <div>Trạng thái</div>
              <div>Hoạt động cuối</div>
              <div>Feedback</div>
              <div>Cập nhật</div>
              <div className="text-right">Xử lý</div>
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
                      aria-label="Mở nghiệp vụ"
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
        <EmptyState>Chưa có nghiệp vụ trong hàng đợi.</EmptyState>
      )}
    </Panel>
  );
}

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
    <Panel icon={<Info className="h-4 w-4" />} title="Thông tin chi tiết">
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Mã phiếu</dt>
          <dd className="font-semibold text-slate-950">{taskItemRef(item.id)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Điều phối</dt>
          <dd className="max-w-[220px] truncate text-right font-semibold text-slate-950">
            {parentTask?.title || "-"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Loại task</dt>
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
      <nav className="flex flex-wrap items-center gap-2" aria-label="Phiếu xử lý">
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
  return (
    <div className="space-y-5">
      <Panel icon={<FileText className="h-4 w-4" />} title="Tổng quan">
        {item.note ? (
          <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
            {item.note}
          </div>
        ) : (
          <EmptyState>Chưa có mô tả cho phiếu xử lý này.</EmptyState>
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
            Nghiệp vụ
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {bindingCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">hàng đợi xử lý</div>
        </div>
      </div>
    </div>
  );
}

export default function TaskItemDetailClient({ item }: { item: TaskItemDetail }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("activity");
  const parentTask = item.task;
  const checklists = useMemo(() => item.checklists ?? [], [item.checklists]);
  const activities = useMemo(() => item.activities ?? [], [item.activities]);
  const businessBindings = useMemo(
    () => item.businessBindings ?? [],
    [item.businessBindings],
  );
  const assignee = userLabel(item.assignedToUser);
  const checklistDone = checklists.filter((row) => row.isDone).length;
  const ref = parentTask?.periodKey || compactId(parentTask?.id);
  const tabs: TabItem[] = [
    { key: "overview", label: "Tổng quan", icon: <FileText className="h-4 w-4" /> },
    { key: "activity", label: "Hoạt động", icon: <GitBranch className="h-4 w-4" /> },
    { key: "checklist", label: "Checklist", icon: <ListChecks className="h-4 w-4" /> },
    { key: "business", label: "Nghiệp vụ", icon: <GitBranch className="h-4 w-4" /> },
    { key: "info", label: "Thông tin", icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-[1680px] px-5 py-5 lg:px-8">
        <div className="mb-5">
          <AdminBreadcrumbs
            items={[
              { label: "Điều phối", href: "/admin/tasks" },
              {
                label: parentTask?.title || "Điều phối",
                href: parentTask ? `/admin/tasks/${parentTask.id}` : undefined,
              },
              { label: item.title || "Phiếu xử lý" },
            ]}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              {parentTask ? (
                <Link
                  href={`/admin/tasks/${parentTask.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay về điều phối
                </Link>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  Phiếu xử lý
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
              <div className="text-xs font-medium text-slate-500">Mã phiếu</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {taskItemRef(item.id)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-6">
            <HeaderMetric
              icon={<UserRound className="h-4 w-4" />}
              label="Assignee"
              value={assignee}
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
              label="Điều phối"
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
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {activities.length} activity
                  </span>
                }
              >
                <ActivityViewModelFeed
                  items={activities}
                  businessBindings={businessBindings}
                />
              </Panel>
            ) : null}

            {activeTab === "checklist" ? <ReadonlyChecklist items={checklists} /> : null}
            {activeTab === "business" ? (
              <BusinessWorkQueue items={businessBindings} />
            ) : null}
            {activeTab === "info" ? <DetailInfo item={item} /> : null}
          </div>

          <aside className="space-y-5">
            <DetailInfo item={item} />
            <BusinessQueueSummary items={businessBindings} />
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
                  <dt className="text-slate-500">Assignee</dt>
                  <dd className="font-semibold text-slate-950">{assignee}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Phiếu xử lý id</dt>
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
