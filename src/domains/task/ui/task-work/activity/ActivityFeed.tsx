"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileText,
  MessageSquare,
  Plus,
  Send,
  XCircle,
} from "lucide-react";
import type { TaskItemActivityViewModel } from "@/domains/task/server/activity";
import { addTaskItemActivityReplyAction } from "@/domains/task/actions/task.actions";
import { targetLabel } from "@/domains/task/ui/execution/execution-ui.utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import {
  QueueItemThumbnail,
  queueItemRef,
  queueItemTitle,
  queueStatusLabel,
  type TaskItemQueueItem,
} from "../QueueWorkQueue";

export type ActivityMode = "ALL" | "QUEUE";
export type ActivityMentionUser = { id: string; name?: string | null; email?: string | null };

export type ActivityJumpTarget = {
  queueItemId: string;
  mode: "activity" | "discussion";
  nonce: number;
};

type TaskItemBinding = {
  id: string;
  targetType: string;
  targetId: string;
  preview?: {
    ref: string;
  } | null;
};

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
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
  const targetAliasIds = Array.isArray(metadata.targetAliasIds)
    ? metadata.targetAliasIds
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    : [];

  if (targetType === "WATCH" && targetId?.includes(":")) {
    const parts = targetId.split(":").map((part) => part.trim()).filter(Boolean);

    for (const canonicalId of [parts[0], parts[parts.length - 1]]) {
      const canonicalKey = businessQueueKey(targetType, canonicalId);
      if (canonicalKey && !keys.includes(canonicalKey)) keys.push(canonicalKey);
    }
  }

  for (const aliasId of targetAliasIds) {
    const aliasKey = businessQueueKey(targetType, aliasId);
    if (aliasKey && !keys.includes(aliasKey)) keys.push(aliasKey);
  }

  return keys;
}

function activityTimeValue(activity: TaskItemActivityViewModel) {
  const timestamp = new Date(activity.occurredAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
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

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

function toneClasses(tone?: TaskItemActivityViewModel["tone"]) {
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
  mentionUsers = [],
  onCancel,
  onSubmitted,
}: {
  activityId: string;
  mentionUsers?: ActivityMentionUser[];
  onCancel: () => void;
  onSubmitted: () => void;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const mentionMatch = body.match(/(?:^|\s)@([^@\s]*)$/);
  const mentionQuery = String(mentionMatch?.[1] ?? "").toLocaleLowerCase("vi");
  const mentionOptions = mentionMatch
    ? mentionUsers.filter((user) => {
        const label = String(user.name || user.email || "").toLocaleLowerCase("vi");
        return label.includes(mentionQuery) && !mentionedUserIds.includes(user.id);
      }).slice(0, 6)
    : [];
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
        mentionedUserIds,
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

  function selectMention(user: ActivityMentionUser) {
    const label = String(user.name || user.email || "User").trim();
    setBody((current) => current.replace(/(?:^|\s)@([^@\s]*)$/, (match) => `${match.startsWith(" ") ? " " : ""}@${label} `));
    setMentionedUserIds((current) => Array.from(new Set([...current, user.id])));
  }

  function updateBody(nextBody: string) {
    setBody(nextBody);
    setMentionedUserIds((current) => current.filter((userId) => {
      const user = mentionUsers.find((candidate) => candidate.id === userId);
      const label = String(user?.name || user?.email || "").trim();
      return Boolean(label) && nextBody.includes(`@${label}`);
    }));
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
            onChange={(event) => updateBody(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={submitting}
            placeholder="Discuss this activity..."
            className="min-h-[72px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
           />
          {mentionOptions.length ? (
            <div className="mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {mentionOptions.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectMention(user)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-violet-50"
                >
                  <span className="font-semibold text-slate-800">{user.name || user.email}</span>
                  {user.name && user.email ? <span className="truncate text-xs text-slate-400">{user.email}</span> : null}
                </button>
              ))}
            </div>
          ) : null}
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
  mentionUsers,
  open,
  composerOpen,
  onToggleOpen,
  onOpenComposer,
  onCloseComposer,
  onSubmitted,
  replyCount,
  discussionEnabled,
}: {
  activity: TaskItemActivityViewModel;
  mentionUsers: ActivityMentionUser[];
  open: boolean;
  composerOpen: boolean;
  onToggleOpen: () => void;
  onOpenComposer: () => void;
  onCloseComposer: () => void;
  onSubmitted: () => void;
  replyCount: number;
  discussionEnabled: boolean;
}) {
  const summary = replyCount
    ? `${replyCount} discussions`
    : "Add discussion";

  if (!discussionEnabled && replyCount === 0) return null;

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

          {discussionEnabled && composerOpen ? (
            <ActivityReplyComposer
              activityId={activity.id}
              mentionUsers={mentionUsers}
              onCancel={onCloseComposer}
              onSubmitted={onSubmitted}
            />
          ) : discussionEnabled ? (
            <button
              type="button"
              onClick={onOpenComposer}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Plus className="h-4 w-4" />
              Add discussion
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ActivityViewModelCard({
  activity,
  mentionUsers,
  businessContext,
  discussionEnabled,
  onActivityChanged,
}: {
  activity: TaskItemActivityViewModel;
  mentionUsers: ActivityMentionUser[];
  businessContext?: TaskItemBinding | null;
  discussionEnabled: boolean;
  onActivityChanged?: () => void;
}) {
  const classes = toneClasses(activity.tone);
  const actor = activity.actorLabel || "Hệ thống";
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
    onActivityChanged?.();
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
          mentionUsers={mentionUsers}
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
          discussionEnabled={discussionEnabled}
        />
      </article>
    </div>
  );
}

export function ActivityViewModelFeed({
  items,
  mentionUsers = [],
  businessBindings,
  queueItems,
  mode,
  discussionEnabled,
  jumpTarget,
  onActivityChanged,
}: {
  items: TaskItemActivityViewModel[];
  mentionUsers?: ActivityMentionUser[];
  businessBindings: TaskItemBinding[];
  queueItems: TaskItemQueueItem[];
  mode: ActivityMode;
  discussionEnabled: boolean;
  jumpTarget?: ActivityJumpTarget | null;
  onActivityChanged?: () => void;
}) {
  if (!items.length) {
    return <EmptyState>Chưa có hoạt động nào.</EmptyState>;
  }

  if (mode === "QUEUE") {
    return (
      <ActivityGroupedByQueue
        items={items}
        mentionUsers={mentionUsers}
        queueItems={queueItems}
        discussionEnabled={discussionEnabled}
        jumpTarget={jumpTarget}
      />
    );
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
          mentionUsers={mentionUsers}
          businessContext={activityBusinessKeys(activity)
            .map((key) => bindingByTarget.get(key))
            .find(Boolean)}
          discussionEnabled={discussionEnabled}
          onActivityChanged={onActivityChanged}
        />
      ))}
    </div>
  );
}

function ActivityCompactRow({
  activity,
  mentionUsers,
  discussionEnabled,
}: {
  activity: TaskItemActivityViewModel;
  mentionUsers: ActivityMentionUser[];
  discussionEnabled: boolean;
}) {
  const classes = toneClasses(activity.tone);
  const actor = activity.actorLabel || "System";
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [optimisticReplyCount, setOptimisticReplyCount] = useState(
    activity.replies.length,
  );
  const body = String(activity.body ?? "").replace(/\s+/g, " ").trim();
  const latestReply = activity.replies[activity.replies.length - 1] ?? null;

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
    setRepliesOpen(true);
  }

  return (
    <div className="relative min-w-0">
      <span
        className={cn(
          "absolute -left-[31px] top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ring-4 ring-white",
          classes.dot,
        )}
      >
        <ActivityViewModelIcon activity={activity} />
      </span>
      <div className="flex min-w-0 items-center gap-2 py-1.5 text-sm leading-6">
        <span className="min-w-0 shrink truncate font-semibold text-slate-900">
          {activity.title}
        </span>
        {body ? (
          <span className="min-w-0 flex-1 truncate text-slate-500">
            - {body}
          </span>
        ) : (
          <span className="min-w-0 flex-1" />
        )}
        <span className="hidden shrink-0 text-xs text-slate-400 md:inline">
          {actor} - {formatDateTime(activity.occurredAt, "")}
        </span>
        {discussionEnabled || optimisticReplyCount ? (
          <button
            type="button"
            onClick={toggleReplies}
            className={cn(
              "inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-semibold transition hover:bg-slate-100",
              optimisticReplyCount
                ? "text-blue-700 hover:text-blue-800"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {optimisticReplyCount ? optimisticReplyCount : "Comment"}
          </button>
        ) : null}
      </div>

      {latestReply && !repliesOpen ? (
        <button
          type="button"
          onClick={() => setRepliesOpen(true)}
          className="mb-1 ml-1 flex max-w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <span className="shrink-0 text-slate-300">↳</span>
          <UserAvatar
            label={latestReply.actorLabel}
            avatarUrl={latestReply.actorAvatarUrl}
            isSystem={!latestReply.actorUserId}
            className="h-5 w-5 text-[10px]"
          />
          <span className="shrink-0 font-semibold text-slate-700">
            {latestReply.actorLabel}
          </span>
          <span className="min-w-0 truncate">{latestReply.body}</span>
          {optimisticReplyCount > 1 ? (
            <span className="shrink-0 text-slate-400">
              +{optimisticReplyCount - 1}
            </span>
          ) : null}
        </button>
      ) : null}

      {repliesOpen ? (
        <div className="mb-2 ml-1 rounded-lg bg-slate-50 px-3 py-2">
          {activity.replies.length ? (
            <div className="space-y-1.5">
              {activity.replies.map((reply) => (
                <div key={reply.id} className="flex min-w-0 items-start gap-2 text-xs">
                  <UserAvatar
                    label={reply.actorLabel}
                    avatarUrl={reply.actorAvatarUrl}
                    isSystem={!reply.actorUserId}
                    className="h-6 w-6 text-[10px]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="shrink-0 font-semibold text-slate-700">
                        {reply.actorLabel}
                      </span>
                      <span className="min-w-0 flex-1 whitespace-pre-wrap text-slate-600">
                        {reply.body}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-slate-400">
                    {formatDateTime(reply.createdAt, "")}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {discussionEnabled && composerOpen ? (
            <ActivityReplyComposer
              activityId={activity.id}
              mentionUsers={mentionUsers}
              onCancel={() => {
                setComposerOpen(false);
                if (!optimisticReplyCount) setRepliesOpen(false);
              }}
              onSubmitted={handleSubmitted}
            />
          ) : discussionEnabled ? (
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="mt-2 inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"
            >
              <Plus className="h-3.5 w-3.5" />
              Add comment
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ActivityGroupedByQueue({
  items,
  mentionUsers,
  queueItems,
  discussionEnabled,
  jumpTarget,
}: {
  items: TaskItemActivityViewModel[];
  mentionUsers: ActivityMentionUser[];
  queueItems: TaskItemQueueItem[];
  discussionEnabled: boolean;
  jumpTarget?: ActivityJumpTarget | null;
}) {
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);
  const [showCommentedOnly, setShowCommentedOnly] = useState(false);
  const lastJumpNonceRef = useRef<number | null>(null);
  const queueByTarget = new Map(
    queueItems
      .map((item) => [businessQueueKey(item.targetType, item.targetId), item] as const)
      .filter((entry): entry is readonly [string, TaskItemQueueItem] => Boolean(entry[0])),
  );
  const queueOrder = new Map(queueItems.map((item, index) => [item.id, index]));
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
    .map(([id, group]) => ({
      id,
      queueItem: group.queueItem,
      activities: showCommentedOnly
        ? group.activities.filter((activity) => activity.replies.length > 0)
        : group.activities,
    }))
    .filter((group) => group.activities.length || (!showCommentedOnly && group.queueItem))
    .sort((left, right) => {
      const leftLatest = left.activities[0]
        ? activityTimeValue(left.activities[0])
        : 0;
      const rightLatest = right.activities[0]
        ? activityTimeValue(right.activities[0])
        : 0;

      if (leftLatest !== rightLatest) return rightLatest - leftLatest;

      return (
        (queueOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
        (queueOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
      );
    });

  useEffect(() => {
    if (!jumpTarget || lastJumpNonceRef.current === jumpTarget.nonce) return;

    lastJumpNonceRef.current = jumpTarget.nonce;
    setExpandedGroupIds((prev) =>
      prev.includes(jumpTarget.queueItemId)
        ? prev
        : [...prev, jumpTarget.queueItemId],
    );
    setShowCommentedOnly(jumpTarget.mode === "discussion");

    window.setTimeout(() => {
      document
        .getElementById(`activity-group-${jumpTarget.queueItemId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }, [jumpTarget]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowCommentedOnly((value) => !value)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold ring-1 transition",
            showCommentedOnly
              ? "bg-slate-900 text-white ring-slate-900"
              : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Has comments
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {visibleGroups.length ? visibleGroups.map((group) => {
        const expanded = expandedGroupIds.includes(group.id);
        const visibleActivities = expanded ? group.activities : group.activities.slice(0, 3);
        const hiddenCount = Math.max(0, group.activities.length - visibleActivities.length);

        return (
          <div
            key={group.id}
            id={`activity-group-${group.id}`}
            className={cn(
              "scroll-mt-28 py-3 transition-colors",
              jumpTarget?.queueItemId === group.id ? "bg-blue-50/40" : "",
            )}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
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
                      Hoạt động không gắn với item cụ thể
                    </div>
                  )}
                </div>
              </div>

              {group.activities.length ? (
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  {group.activities.length}
                </span>
              ) : null}
            </div>

            <div className="ml-5 mt-2 min-w-0 border-l border-slate-200 pl-5">
              {group.activities.length ? (
                <div className="min-w-0">
                  {visibleActivities.map((activity) => (
                    <ActivityCompactRow
                      key={activity.id}
                      activity={activity}
                      mentionUsers={mentionUsers}
                      discussionEnabled={discussionEnabled}
                    />
                  ))}
                  {hiddenCount ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroupIds((prev) =>
                          expanded
                            ? prev.filter((id) => id !== group.id)
                            : [...prev, group.id],
                        )
                      }
                      className="mt-1 inline-flex h-7 items-center rounded-md px-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {expanded ? "Thu gọn" : `Xem thêm ${hiddenCount} hoạt động`}
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="py-1.5 text-sm text-slate-400">
                  Chưa có hoạt động.
                </div>
              )}
            </div>
          </div>
        );
        }) : (
          <div className="py-8 text-center text-sm text-slate-400">
            No commented activity yet.
          </div>
        )}
      </div>
    </div>
  );
}
