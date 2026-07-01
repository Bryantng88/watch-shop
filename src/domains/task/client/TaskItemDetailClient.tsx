"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  ClipboardList,
  Clock3,
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  Info,
  Link2,
  ListChecks,
  MessageSquare,
  PencilLine,
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
  TimelineEntryIcon,
  TimelineEntryTone,
  TimelineEntryViewModel,
} from "@/domains/shared/timeline/server/timeline-renderer.types";
import { targetLabel } from "@/domains/task/ui/execution/execution-ui.utils";
import { cn } from "@/lib/utils";

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
  timeline?: TimelineEntryViewModel[];
  businessBindings?: TaskItemBinding[];
};

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function metadataRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function metadataText(entry: TimelineEntryViewModel, key: string) {
  const text = clean(metadataRecord(entry.metadataJson)[key]);
  return text || null;
}

function toTime(value?: Date | string | null) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function entryTime(entry: TimelineEntryViewModel) {
  if (entry.sourceType === "BUSINESS_FEEDBACK") {
    return toTime(entry.createdAt) || toTime(entry.occurredAt);
  }

  return toTime(entry.occurredAt);
}

function compareTimelineEntries(
  a: TimelineEntryViewModel,
  b: TimelineEntryViewModel,
) {
  const timeDiff = entryTime(a) - entryTime(b);
  if (timeDiff !== 0) return timeDiff;
  return a.id.localeCompare(b.id);
}

function blockKind(entry: TimelineEntryViewModel): TimelineActivityBlock["kind"] {
  if (entry.sourceType === "BUSINESS_EVENT") return "BUSINESS_EVENT";
  if (entry.sourceType === "USER_COMMENT") return "USER_COMMENT";
  return "TIMELINE_ENTRY";
}

function makeActivityBlock(
  entry: TimelineEntryViewModel,
  feedbackEntries: TimelineEntryViewModel[] = [],
): TimelineActivityBlock {
  return {
    id: entry.id,
    kind: blockKind(entry),
    entry,
    feedbackEntries: [...feedbackEntries].sort(compareTimelineEntries),
    eventKey: metadataText(entry, "eventKey"),
    businessEventLogId: metadataText(entry, "businessEventLogId"),
  };
}

function nextBusinessEventTime(
  eventEntries: TimelineEntryViewModel[],
  event: TimelineEntryViewModel,
) {
  const currentTime = entryTime(event);
  const nextEvent = eventEntries.find(
    (candidate) =>
      candidate.id !== event.id && entryTime(candidate) > currentTime,
  );

  return nextEvent ? entryTime(nextEvent) : null;
}

function groupActivityBlocks(entries: TimelineEntryViewModel[]) {
  const sortedEntries = [...entries].sort(compareTimelineEntries);
  const eventEntries = sortedEntries.filter(
    (entry) => entry.sourceType === "BUSINESS_EVENT",
  );
  const eventByBusinessLogId = new Map<string, TimelineEntryViewModel>();

  for (const entry of eventEntries) {
    const businessEventLogId = metadataText(entry, "businessEventLogId");
    if (businessEventLogId) eventByBusinessLogId.set(businessEventLogId, entry);
  }

  const feedbackByEventId = new Map<string, TimelineEntryViewModel[]>();
  const groupedFeedbackIds = new Set<string>();

  for (const entry of sortedEntries) {
    if (entry.sourceType !== "BUSINESS_FEEDBACK") continue;

    const businessEventLogId = metadataText(entry, "businessEventLogId");
    const eventEntry = businessEventLogId
      ? eventByBusinessLogId.get(businessEventLogId)
      : null;

    if (!businessEventLogId || !eventEntry) continue;

    const nextEventTime = nextBusinessEventTime(eventEntries, eventEntry);
    if (nextEventTime && entryTime(entry) > nextEventTime) continue;

    const group = feedbackByEventId.get(businessEventLogId) ?? [];
    group.push(entry);
    feedbackByEventId.set(businessEventLogId, group);
    groupedFeedbackIds.add(entry.id);
  }

  return sortedEntries
    .filter((entry) => !groupedFeedbackIds.has(entry.id))
    .map((entry) => {
      if (entry.sourceType !== "BUSINESS_EVENT") return makeActivityBlock(entry);

      const businessEventLogId = metadataText(entry, "businessEventLogId");
      const feedbackEntries = businessEventLogId
        ? feedbackByEventId.get(businessEventLogId) ?? []
        : [];

      return makeActivityBlock(entry, feedbackEntries);
    });
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

function activityValue(entry: TimelineEntryViewModel) {
  return entry.sourceType === "BUSINESS_FEEDBACK"
    ? entry.createdAt ?? entry.occurredAt
    : entry.occurredAt;
}

function activityDateTime(entry: TimelineEntryViewModel) {
  return formatDateTime(activityValue(entry), "");
}

function activityDate(entry: TimelineEntryViewModel) {
  return formatDate(activityValue(entry), "");
}

function activityTime(entry: TimelineEntryViewModel) {
  return formatTime(activityValue(entry));
}

function compactId(id?: string | null) {
  const value = String(id ?? "").trim();
  if (!value) return "-";
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function ticketRef(id: string) {
  return `TI-${id.slice(0, 4).toUpperCase()}-${id.slice(-6).toUpperCase()}`;
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

function eventVisual(block: TimelineActivityBlock) {
  const eventKey = String(block.eventKey || "").toLowerCase();
  const title = `${block.entry.title} ${eventKey}`.toLowerCase();

  if (eventKey.includes("rejected") || title.includes("trả về")) {
    return {
      tone: "rose" as TimelineEntryTone,
      icon: "rejected",
      panelTitle: "Lý do trả về",
    };
  }

  if (eventKey.includes("submitted") || title.includes("gửi duyệt")) {
    return {
      tone: "green" as TimelineEntryTone,
      icon: "submitted",
      panelTitle: "Nội dung",
    };
  }

  if (eventKey.includes("updated") || title.includes("cập nhật")) {
    return {
      tone: "blue" as TimelineEntryTone,
      icon: "updated",
      panelTitle: "Cập nhật",
    };
  }

  return {
    tone: block.entry.sourceType === "BUSINESS_FEEDBACK"
      ? ("rose" as TimelineEntryTone)
      : block.entry.tone,
    icon: block.entry.icon,
    panelTitle:
      block.entry.sourceType === "BUSINESS_FEEDBACK" ? "Lý do trả về" : "Nội dung",
  };
}

function toneClasses(tone?: TimelineEntryTone) {
  if (tone === "green") {
    return {
      dot: "bg-emerald-500 text-white ring-emerald-100",
      card: "border-emerald-100",
      badge: "bg-emerald-50 text-emerald-700",
      panel: "border-emerald-100 bg-emerald-50 text-emerald-950",
    };
  }

  if (tone === "amber") {
    return {
      dot: "bg-amber-400 text-white ring-amber-100",
      card: "border-amber-100",
      badge: "bg-amber-50 text-amber-700",
      panel: "border-amber-100 bg-amber-50 text-amber-950",
    };
  }

  if (tone === "rose") {
    return {
      dot: "bg-rose-500 text-white ring-rose-100",
      card: "border-rose-100",
      badge: "bg-rose-50 text-rose-700",
      panel: "border-rose-100 bg-rose-50 text-rose-950",
    };
  }

  if (tone === "blue") {
    return {
      dot: "bg-blue-600 text-white ring-blue-100",
      card: "border-blue-100",
      badge: "bg-blue-50 text-blue-700",
      panel: "border-blue-100 bg-blue-50 text-blue-950",
    };
  }

  return {
    dot: "bg-slate-500 text-white ring-slate-100",
    card: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    panel: "border-slate-100 bg-slate-50 text-slate-700",
  };
}

function TimelineIcon({
  icon,
}: {
  icon?: TimelineEntryIcon | "rejected" | "submitted" | "updated";
}) {
  const className = "h-4 w-4";

  if (icon === "rejected") return <XCircle className={className} />;
  if (icon === "submitted") return <Send className={className} />;
  if (icon === "updated") return <PencilLine className={className} />;
  if (icon === "message" || icon === "feedback") {
    return <MessageSquare className={className} />;
  }
  if (icon === "workflow") return <GitBranch className={className} />;
  if (icon === "notification") return <Bell className={className} />;
  if (icon === "system") return <Info className={className} />;

  return <CircleDot className={className} />;
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
  subValue,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
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
      {subValue ? <div className="text-xs text-slate-500">{subValue}</div> : null}
    </div>
  );
}

function SideSection({
  id,
  icon,
  title,
  action,
  children,
}: {
  id?: string;
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
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
  const standaloneFeedback = entry.sourceType === "BUSINESS_FEEDBACK";
  const feedbackEntries =
    standaloneFeedback && !block.feedbackEntries.length
      ? [entry]
      : block.feedbackEntries;
  const visual = eventVisual(block);
  const classes = toneClasses(visual.tone);
  const actor = entry.actorLabel || "Hệ thống";

  return (
    <div className="grid grid-cols-[58px_34px_minmax(0,1fr)] gap-3 sm:grid-cols-[82px_42px_minmax(0,1fr)] sm:gap-4">
      <div className="pt-4 text-right text-xs leading-5 text-slate-500">
        <div className="font-semibold text-slate-700">{activityTime(entry)}</div>
        <div>{activityDate(entry)}</div>
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
          <TimelineIcon icon={visual.icon} />
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
                {entry.title}
              </h3>
              {block.eventKey ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase",
                    classes.badge,
                  )}
                >
                  {block.eventKey}
                </span>
              ) : null}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>bởi {actor}</span>
              <span>·</span>
              <span>qua Hệ thống</span>
            </div>
          </div>
        </div>

        {entry.body && !standaloneFeedback ? (
          <div className={cn("mt-4 rounded-xl border px-4 py-3 text-sm", classes.panel)}>
            <div className="mb-1 text-xs font-semibold">{visual.panelTitle}</div>
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
                  <span>{visual.panelTitle}</span>
                  {activityDateTime(feedback) ? (
                    <span className="font-medium text-rose-600/80">
                      {activityDateTime(feedback)}
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

function ActivityFeed({ items }: { items: TimelineEntryViewModel[] }) {
  const blocks = groupActivityBlocks(items);

  if (!blocks.length) {
    return <EmptyState>Chưa có activity nào cho ticket này.</EmptyState>;
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
    <SideSection
      id="checklist"
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
        <EmptyState>
          <div className="flex flex-col items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-400" />
            <span>Chưa có checklist.</span>
          </div>
        </EmptyState>
      )}
    </SideSection>
  );
}

function BusinessBindings({ items }: { items: TaskItemBinding[] }) {
  return (
    <SideSection
      id="business"
      icon={<Link2 className="h-4 w-4" />}
      title="Liên kết nghiệp vụ"
    >
      {items.length ? (
        <div className="space-y-3">
          {items.map((binding) => (
            <div
              key={binding.id}
              className="rounded-2xl border border-slate-200 px-3 py-3"
            >
              <div className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500">
                  {targetLabel(binding.targetType).slice(0, 1)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">
                        {targetLabel(binding.targetType)}
                      </div>
                      <div className="mt-0.5 break-all text-xs text-slate-500">
                        {binding.targetType} · {compactId(binding.targetId)}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      {binding.actionType}
                    </span>
                  </div>

                  {binding.href ? (
                    <Link
                      href={binding.href}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Mở nghiệp vụ
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>Chưa có business binding.</EmptyState>
      )}
    </SideSection>
  );
}

function TicketInfo({ item }: { item: TaskItemDetail }) {
  const parentTask = item.task;

  return (
    <SideSection
      id="info"
      icon={<Info className="h-4 w-4" />}
      title="Thông tin Ticket"
    >
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">ID</dt>
          <dd className="font-semibold text-slate-950">{ticketRef(item.id)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Kind</dt>
          <dd className="font-semibold text-slate-950">
            {parentTask?.kind || "-"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Tạo lúc</dt>
          <dd className="text-right font-semibold text-slate-950">
            {formatDateTime(item.createdAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Cập nhật lần cuối</dt>
          <dd className="text-right font-semibold text-slate-950">
            {formatDateTime(item.updatedAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Mô tả</dt>
          <dd className="max-w-[220px] text-right text-slate-500">
            {item.note ? item.note : "Không có mô tả"}
          </dd>
        </div>
      </dl>
    </SideSection>
  );
}

function SectionNav({ items }: { items: NavItem[] }) {
  return (
    <div className="mt-4 border-b border-slate-200">
      <nav className="flex flex-wrap items-center gap-2" aria-label="Ticket sections">
        {items.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold",
              index === 0
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900",
            )}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function TaskItemDetailClient({ item }: { item: TaskItemDetail }) {
  const parentTask = item.task;
  const checklists = item.checklists ?? [];
  const timeline = item.timeline ?? [];
  const businessBindings = item.businessBindings ?? [];
  const assignee = userLabel(item.assignedToUser);
  const checklistDone = checklists.filter((row) => row.isDone).length;
  const ref = parentTask?.periodKey || compactId(parentTask?.id);
  const sectionItems: NavItem[] = [
    {
      label: "Tổng quan",
      href: "#overview",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Activity",
      href: "#activity",
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      label: "Checklist",
      href: "#checklist",
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      label: "Liên kết nghiệp vụ",
      href: "#business",
      icon: <Link2 className="h-4 w-4" />,
    },
    {
      label: "Thông tin",
      href: "#info",
      icon: <Info className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-[1680px] px-5 py-5 lg:px-8">
        <div className="mb-5">
          <AdminBreadcrumbs
            items={[
              { label: "Tasks", href: "/admin/tasks" },
              {
                label: parentTask?.title || "Task",
                href: parentTask ? `/admin/tasks/${parentTask.id}` : undefined,
              },
              { label: item.title || "Ticket" },
              { label: `Ticket #${ticketRef(item.id)}` },
            ]}
          />
        </div>

        <section
          id="overview"
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              {parentTask ? (
                <Link
                  href={`/admin/tasks/${parentTask.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay về Task
                </Link>
              ) : null}

              <div className="mt-5 flex min-w-0 flex-wrap items-center gap-3">
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
              <div className="text-xs font-medium text-slate-500">Ticket</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {ticketRef(item.id)}
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
              label="Task cha"
              value={parentTask?.title || "-"}
            />
            <HeaderMetric
              icon={<Tag className="h-4 w-4" />}
              label="Ref"
              value={ref}
            />
            <HeaderMetric
              icon={<Clock3 className="h-4 w-4" />}
              label="Tạo lúc"
              value={formatDateTime(item.createdAt)}
            />
          </div>
        </section>

        <SectionNav items={sectionItems} />

        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section
            id="activity"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Activity feed
                  </h2>
                  <Info className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {groupActivityBlocks(timeline).length} activity
              </span>
            </div>
            <ActivityFeed items={timeline} />
          </section>

          <aside className="space-y-5">
            <TicketInfo item={item} />
            <ReadonlyChecklist items={checklists} />
            <BusinessBindings items={businessBindings} />
            <SideSection
              icon={<Tag className="h-4 w-4" />}
              title="Thông tin mở rộng"
            >
              <dl className="space-y-3 text-sm">
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
                  <dt className="text-slate-500">Task item id</dt>
                  <dd className="font-mono text-xs text-slate-500">
                    {compactId(item.id)}
                  </dd>
                </div>
              </dl>
            </SideSection>
          </aside>
        </div>
      </div>
    </div>
  );
}
