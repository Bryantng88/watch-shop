"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Folder,
  MoreHorizontal,
  Plus,
  XCircle,
} from "lucide-react";
import type { WorkspaceCapabilities } from "@/domains/blueprint/shared/workspace-capabilities";
import type {
  OperationalBlueprintAction,
  OperationalBlueprintActionField,
} from "@/domains/blueprint/shared/operational-blueprint";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import {
  useAppProgress,
  type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { repairVietnameseMojibake } from "@/domains/shared/text/vietnamese-mojibake";
import { targetLabel } from "@/domains/task/ui/execution/execution-ui.utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import {
  applyQueueItemManualTransitionsAction,
  applyQueueItemManualTransitionAction,
  submitOperationalBlueprintActionAction,
} from "@/domains/task/actions/task.actions";
import {
  resolveQueueRowPresentation,
  type QueueRowProgress,
} from "./queue-row-presentation";

export type UserSummary = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  roles?: string[];
  permissions?: string[];
};

export type QueueItemStatus = "WAITING" | "IN_PROGRESS" | "FEEDBACK" | "DONE";

export type TaskItemQueueTransition = {
  actionKey: string;
  label: string;
  fromState: string;
  toState: string;
  manualActionLabel: string;
  enabled: boolean;
  reason: string | null;
  metadata?: unknown;
};

export type TaskItemQueueItem = {
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
  discussionCount: number;
  activityCount: number;
  workflowKey?: string | null;
  currentWorkflowState?: string | null;
  currentWorkflowStateLabel?: string | null;
  isWorkflowDone?: boolean;
  manualTransitions?: TaskItemQueueTransition[];
  intakeNote?: string | null;
  mediaAssetAttachedAt?: string | null;
  mediaWorkProgress?: {
    profile: boolean;
    content: boolean;
    image: boolean;
    completed: number;
    total: number;
    updatedAt?: string | null;
  } | null;
  updatedAt: string;
  href?: string | null;
};

type QueueFilter = "ALL" | QueueItemStatus | `WF:${string}`;

function objectValue(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

export function transitionIntent(transition: { metadata?: unknown }) {
  return String(objectValue(transition.metadata).intent ?? "").trim().toUpperCase();
}

export function transitionLabel(transition: {
  label?: string | null;
  manualActionLabel?: string | null;
}) {
  return repairVietnameseMojibake(
    transition.label || transition.manualActionLabel || "Action",
  );
}

export function isOpenTargetTransition(transition: { metadata?: unknown }) {
  return transitionIntent(transition) === "OPEN_TARGET";
}

function isRunnableManualTransition(transition: TaskItemQueueTransition) {
  return transition.enabled !== false && !isOpenTargetTransition(transition);
}

export function effectiveTransitionLabel(
  transition: TaskItemQueueTransition,
  workspaceWorkTypeKey?: string | null,
) {
  if (
    workspaceWorkTypeKey === "photography" &&
    (transition.actionKey === "start-work" || transition.actionKey === "mark-done")
  ) {
    return "Hoàn tất";
  }

  return transitionLabel(transition);
}

function metadataTextValue(
  metadata: Record<string, unknown>,
  key: string,
  fallback = "",
) {
  return String(metadata[key] ?? fallback).trim();
}

function transitionPresentation(transition: { metadata?: unknown }) {
  return metadataTextValue(objectValue(transition.metadata), "presentation")
    .toUpperCase();
}

function workflowStateLabel(value?: string | null) {
  const state = String(value ?? "").trim();
  if (!state) return "-";
  if (state === "IN_PROGRESS") return "In Progress";
  return state
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function workflowStateTone(value?: string | null) {
  const state = String(value ?? "").toUpperCase();
  if (state === "DONE") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (state === "IN_PROGRESS") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (state === "READY") return "bg-indigo-50 text-indigo-700 ring-indigo-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function WorkflowStateBadge({ value, label }: { value?: string | null; label?: string | null }) {
  return (
    <span className={cn(
      "inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-semibold ring-1",
      workflowStateTone(value),
    )}>
      {label || workflowStateLabel(value)}
    </span>
  );
}

function BlueprintActionFieldControl({
  field,
  value,
  disabled,
  onChange,
}: {
  field: OperationalBlueprintActionField;
  value?: string | boolean;
  disabled?: boolean;
  onChange: (value: string | boolean) => void;
}) {
  const baseClass =
    "h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 disabled:bg-slate-50 disabled:text-slate-400";

  if (field.kind === "textarea") {
    return (
      <textarea
        className={`${baseClass} min-h-14 py-2`}
        disabled={disabled}
        placeholder={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.kind === "select") {
    return (
      <select
        className={baseClass}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
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
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }

  return (
    <input
      className={baseClass}
      disabled={disabled}
      type={field.kind === "date" ? "date" : "text"}
      placeholder={field.kind === "money" ? `${field.label} (money)` : field.label}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function openTargetActionLabel(
  transition: { metadata?: unknown; label?: string | null; manualActionLabel?: string | null },
  queueItem?: { currentWorkflowState?: string | null; status?: string | null },
) {
  const metadata = objectValue(transition.metadata);
  if (metadataTextValue(metadata, "targetMode") === "media") {
    if (
      queueItem?.currentWorkflowState === "DONE" ||
      queueItem?.status === "DONE"
    ) {
      return "Xem media";
    }

    return "Xử lý media";
  }

  return transitionLabel(transition);
}

function mediaOpenTargetTransition(
  queueItem: TaskItemQueueItem,
): TaskItemQueueTransition {
  return {
    actionKey: "open-watch-media",
    label: "Xử lý media",
    fromState: queueItem.currentWorkflowState || "NEW",
    toState: queueItem.currentWorkflowState || "NEW",
    manualActionLabel: "Xử lý media",
    enabled: true,
    reason: null,
    metadata: {
      intent: "OPEN_TARGET",
      presentation: "MODAL",
      targetRoute: "watch.edit",
      targetMode: "media",
      focus: "media",
      from: "media-workspace",
      expectedEventKey: "watch.media.asset.attached",
    },
  };
}

function openTargetHref(input: {
  queueItem: {
    id: string;
    href?: string | null;
    currentWorkflowState?: string | null;
    mediaWorkProgress?: TaskItemQueueItem["mediaWorkProgress"];
  };
  taskItemId: string;
  transition?: { metadata?: unknown } | null;
}) {
  const { queueItem, taskItemId, transition } = input;
  if (!queueItem.href) return null;
  const metadata = objectValue(transition?.metadata);
  const targetRoute = metadataTextValue(metadata, "targetRoute");
  const targetMode = metadataTextValue(metadata, "targetMode");
  const focus = metadataTextValue(metadata, "focus");
  const from = metadataTextValue(metadata, "from");
  const baseHref = queueItem.href.replace(/\/$/, "");

  const href = targetRoute === "watch.edit" && !baseHref.endsWith("/edit")
    ? `${baseHref}/edit`
    : baseHref;
  const params = new URLSearchParams();
  if (targetMode) params.set("mode", targetMode);
  if (focus) params.set("focus", focus);
  if (from) params.set("from", from);
  if (queueItem.mediaWorkProgress) {
    params.set("mediaProfileDone", queueItem.mediaWorkProgress.profile ? "1" : "0");
    params.set("mediaContentDone", queueItem.mediaWorkProgress.content ? "1" : "0");
    params.set("mediaImageDone", queueItem.mediaWorkProgress.image ? "1" : "0");
  }
  params.set("workspaceBindingId", queueItem.id);
  if (queueItem.currentWorkflowState) {
    params.set("workspaceState", queueItem.currentWorkflowState);
  }
  if (
    transitionPresentation(transition ?? {}) === "MODAL" ||
    transitionIntent(transition ?? {}) === "OPEN_TARGET"
  ) {
    params.set("embedded", "1");
  }
  params.set("returnTo", `/admin/task-items/${taskItemId}`);

  const query = params.toString();
  if (!query) return href;

  return `${href}${href.includes("?") ? "&" : "?"}${query}`;
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

export function queueStatusLabel(status: QueueItemStatus) {
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

export function QueueStatusBadge({ status }: { status: QueueItemStatus }) {
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

function QueueProgressCell({ progress }: { progress: QueueRowProgress }) {
  if (!progress) {
    return <span className="text-xs font-medium text-slate-400">-</span>;
  }

  const total = progress.total || 3;
  const completed = Math.max(0, Math.min(progress.completed, total));
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const done = completed >= total && total > 0;

  return (
    <div className="min-w-[150px]" title={`${completed}/${total}`}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "text-xs font-semibold",
            done ? "text-emerald-700" : "text-blue-700",
          )}
        >
          {completed}/{total}
        </span>
        <span className="text-[11px] font-medium text-slate-400">
          {percent}%
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            done ? "bg-emerald-500" : "bg-blue-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function QueueIssueDetailCell({ item }: { item: TaskItemQueueItem }) {
  const detail = item.preview.status?.trim();

  if (!detail) {
    return <span className="text-xs font-medium text-slate-400">-</span>;
  }

  return (
    <span className="line-clamp-2 text-xs font-semibold leading-5 text-slate-600">
      {detail}
    </span>
  );
}

export function queueItemTitle(item: TaskItemQueueItem) {
  return item.preview.title || targetLabel(item.targetType);
}

export function queueItemRef(item: TaskItemQueueItem) {
  return item.preview.ref || item.preview.status || targetLabel(item.targetType);
}

function resolveQueuePreviewSrc(value?: string | null) {
  const src = String(value ?? "").trim();
  if (!src) return null;
  if (src.startsWith("/")) return src;

  return resolveMediaPreviewSrc(src);
}

function queueItemToBusinessPreview(item: TaskItemQueueItem): BusinessEntityPreview | null {
  const type = item.targetType === "SERVICE_REQUEST" ? "SERVICE" : item.targetType;
  const supportedTypes = ["WATCH", "ORDER", "SHIPMENT", "SERVICE", "PAYMENT", "ACQUISITION"];

  if (!supportedTypes.includes(type)) return null;

  return {
    type: type as BusinessEntityPreview["type"],
    id: item.targetId,
    refNo: item.preview.ref,
    title: queueItemTitle(item),
    subtitle: item.preview.ref || targetLabel(item.targetType),
    status: item.preview.status,
    imageUrl: item.preview.imageUrl ?? item.preview.imageUrls?.[0] ?? null,
    href: item.href,
  };
}

export function QueueItemThumbnail({ item }: { item: TaskItemQueueItem }) {
  const imageUrls = item.preview.imageUrls?.length
    ? item.preview.imageUrls
    : item.preview.imageUrl
      ? [item.preview.imageUrl]
      : [];
  const src = resolveQueuePreviewSrc(imageUrls[0]);
  const label = queueItemTitle(item);

  if (item.targetType === "ORDER" && imageUrls.length > 1) {
    return (
      <div className="relative h-11 w-14 shrink-0">
        {imageUrls.slice(0, 3).map((url, index) => {
          const stackedSrc = resolveQueuePreviewSrc(url);
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

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {children}
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

function CreateTechnicalIssueModal({
  open,
  serviceRequestId,
  onClose,
  onCreated,
}: {
  open: boolean;
  serviceRequestId: string | null;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [summary, setSummary] = useState("");
  const [area, setArea] = useState("GENERAL");
  const [actionMode, setActionMode] = useState("INTERNAL");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetAndClose() {
    if (isPending) return;
    setSummary("");
    setArea("GENERAL");
    setActionMode("INTERNAL");
    setNote("");
    setError(null);
    onClose();
  }

  function submit() {
    const cleanSummary = summary.trim();
    if (!serviceRequestId) {
      setError("Missing service request for this workspace.");
      return;
    }
    if (!cleanSummary) {
      setError("Nhap mo ta ngan cho TI.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/technical-issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceRequestId,
            summary: cleanSummary,
            area,
            issueType: "CHECK",
            actionMode,
            note: note.trim() || null,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "Create technical issue failed");
        }

        setSummary("");
        setArea("GENERAL");
        setActionMode("INTERNAL");
        setNote("");
        setError(null);
        onCreated();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Create technical issue failed");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-base font-semibold text-slate-950">Tao TI</div>
            <div className="mt-0.5 text-xs text-slate-500">
              Tao technical issue trong SR workspace hien tai.
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            aria-label="Close create technical issue modal"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="text-xs font-semibold uppercase text-slate-500">Mo ta TI</span>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Vi du: Lau dau, kiem tra balance..."
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase text-slate-500">Area</span>
              <select
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="GENERAL">General</option>
                <option value="MOVEMENT">Movement</option>
                <option value="CRYSTAL">Crystal</option>
                <option value="CASE">Case</option>
                <option value="BRACELET">Bracelet</option>
                <option value="DIAL">Dial</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase text-slate-500">Owner hint</span>
              <select
                value={actionMode}
                onChange={(event) => setActionMode(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="INTERNAL">Internal</option>
                <option value="VENDOR">Vendor</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase text-slate-500">Note</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Ghi chu ban dau neu co"
              className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            disabled={isPending}
            onClick={resetAndClose}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Huy
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={submit}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {isPending ? "Dang tao" : "Tao TI"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OpenTargetAction({
  queueItem,
  taskItemId,
  transition,
  className,
  iconClassName = "h-3.5 w-3.5",
  onActivate,
}: {
  queueItem: TaskItemQueueItem;
  taskItemId: string;
  transition: TaskItemQueueTransition;
  className: string;
  iconClassName?: string;
  onActivate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const href = openTargetHref({ queueItem, taskItemId, transition });
  const label = openTargetActionLabel(transition, queueItem);
  const modal =
    transitionPresentation(transition) === "MODAL" ||
    transitionIntent(transition) === "OPEN_TARGET";

  useEffect(() => {
    if (!open) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type !== "workspace-target-modal-close" &&
        event.data?.type !== "workspace-target-modal-refresh"
      ) {
        return;
      }

      if (event.data?.type === "workspace-target-modal-close") {
        setOpen(false);
      }
      router.refresh();
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, router]);

  if (!href) return null;

  if (!modal) {
    return (
      <Link href={href} onClick={onActivate} className={className}>
        <ExternalLink className={iconClassName} />
        {label}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onActivate?.();
          setOpen(true);
        }}
        className={className}
      >
        <ExternalLink className={iconClassName} />
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="flex h-[92vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
            <div className="flex h-12 items-center justify-between border-b border-slate-200 px-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">
                  {label}
                </div>
                <div className="truncate text-xs text-slate-500">
                  {queueItemTitle(queueItem)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={href}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Full page
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.refresh();
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Close modal"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            <iframe
              src={href}
              title={label}
              className="min-h-0 flex-1 border-0 bg-slate-50"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function QueueWorkQueue({
  taskItemId,
  items,
  capabilities,
  itemLabel,
  workspaceWorkTypeKey,
  operationalActions = [],
  serviceRequestId,
  onOpenQueueActivity,
}: {
  taskItemId: string;
  items: TaskItemQueueItem[];
  capabilities: WorkspaceCapabilities;
  itemLabel: string;
  workspaceWorkTypeKey?: string | null;
  operationalActions?: OperationalBlueprintAction[];
  serviceRequestId?: string | null;
  currentUser?: UserSummary | null;
  onOpenQueueActivity?: (queueItemId: string, mode: "activity") => void;
}) {
  const [filter, setFilter] = useState<QueueFilter>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [actionError, setActionError] = useState<{
    itemId: string;
    message: string;
  } | null>(null);
  const [openBlueprintAction, setOpenBlueprintAction] = useState<{
    itemId: string;
    actionKey: string;
  } | null>(null);
  const [blueprintValues, setBlueprintValues] = useState<
    Record<string, Record<string, string | boolean>>
  >({});
  const [isPending, startTransition] = useTransition();
  const previewState = useBusinessEntityPreview();
  const router = useRouter();
  const appProgress = useAppProgress();
  const isServiceOperationWorkspace = workspaceWorkTypeKey === "service-operation";
  const canCreateTechnicalIssue = isServiceOperationWorkspace && Boolean(serviceRequestId);
  const filters: Array<{ key: QueueFilter; label: string }> = isServiceOperationWorkspace
    ? [
      { key: "ALL", label: "All" },
      { key: "WF:INSPECT", label: "Inspect" },
      { key: "WF:READY", label: "Ready" },
      { key: "WF:IN_PROGRESS", label: "In Progress" },
      { key: "WF:DONE", label: "Done" },
    ]
    : [
      { key: "ALL", label: "All" },
      { key: "WAITING", label: "Waiting" },
      { key: "IN_PROGRESS", label: "In Progress" },
      { key: "FEEDBACK", label: "Feedback" },
      { key: "DONE", label: "Done" },
    ];
  const visibleItems = filter === "ALL"
    ? items
    : filter.startsWith("WF:")
      ? items.filter((item) => item.currentWorkflowState === filter.slice(3))
      : items.filter((item) => item.status === filter);
  const isMediaProcessingWorkspace = workspaceWorkTypeKey === "media-processing";
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedItems = visibleItems.filter((item) => selectedIdSet.has(item.id));
  const transitionForItem = (queueItem: TaskItemQueueItem) => {
    const transitions = queueItem.manualTransitions?.filter(isRunnableManualTransition) ?? [];

    if (workspaceWorkTypeKey === "photography") {
      return transitions.find((transition) =>
        transition.actionKey === "start-work" || transition.actionKey === "mark-done"
      ) ?? null;
    }

    return transitions[0] ?? null;
  };
  const workflowActionsForItem = (queueItem: TaskItemQueueItem) => {
    const transitions = queueItem.manualTransitions ?? [];

    if (isMediaProcessingWorkspace && queueItem.targetType === "WATCH") {
      return [
        transitions.find(isOpenTargetTransition) ?? mediaOpenTargetTransition(queueItem),
      ];
    }

    return transitions;
  };
  const blueprintActionsForItem = (queueItem: TaskItemQueueItem) =>
    operationalActions.filter(
      (action) =>
        action.targetType === queueItem.targetType &&
        action.key !== "create_technical_issue",
    );
  const canSubmitBlueprintAction = (action: OperationalBlueprintAction) =>
    action.command === "service.confirmTechnicalIssue" ||
    action.command === "service.startTechnicalIssue" ||
    action.command === "service.completeTechnicalIssue" ||
    action.command === "service.createTechnicalIssue";
  const blueprintValueKey = (queueItem: TaskItemQueueItem, action: OperationalBlueprintAction) =>
    `${queueItem.id}:${action.key}`;
  const updateBlueprintValue = (
    queueItem: TaskItemQueueItem,
    action: OperationalBlueprintAction,
    fieldKey: string,
    value: string | boolean,
  ) => {
    const key = blueprintValueKey(queueItem, action);
    setBlueprintValues((current) => ({
      ...current,
      [key]: {
        ...(current[key] ?? {}),
        [fieldKey]: value,
      },
    }));
  };
  const applyBlueprintAction = (
    queueItem: TaskItemQueueItem,
    action: OperationalBlueprintAction,
  ) => {
    if (!canSubmitBlueprintAction(action) || isPending) return;

    const pendingKey = `${queueItem.id}:${action.key}`;
    setPendingId(pendingKey);
    setActionError(null);
    startTransition(async () => {
      try {
        await submitOperationalBlueprintActionAction({
          taskItemId,
          actionKey: action.key,
          targetType: queueItem.targetType,
          targetId: queueItem.targetId,
          fields: blueprintValues[blueprintValueKey(queueItem, action)] ?? {},
        });
        setOpenBlueprintAction(null);
        setBlueprintValues((current) => ({
          ...current,
          [blueprintValueKey(queueItem, action)]: {},
        }));
        router.refresh();
      } catch (error) {
        setActionError({
          itemId: queueItem.id,
          message: error instanceof Error ? error.message : "Blueprint action failed.",
        });
      } finally {
        setPendingId(null);
      }
    });
  };
  const selectableItems = visibleItems.filter((item) => Boolean(transitionForItem(item)));
  const selectedTransitions = selectedItems
    .map((item) => ({ queueItem: item, transition: transitionForItem(item) }))
    .filter((item): item is { queueItem: TaskItemQueueItem; transition: TaskItemQueueTransition } =>
      Boolean(item.transition),
    );
  const bulkLabel = selectedTransitions[0]?.transition
    ? effectiveTransitionLabel(selectedTransitions[0].transition, workspaceWorkTypeKey)
    : "Áp dụng";
  const allSelectableSelected =
    selectableItems.length > 0 && selectableItems.every((item) => selectedIdSet.has(item.id));
  const gridClass = capabilities.workflow
    ? "grid-cols-[42px_minmax(270px,1.45fr)_120px_180px_160px_96px_108px]"
    : "grid-cols-[42px_minmax(270px,1.45fr)_120px_180px_96px_108px]";
  const detailColumnLabel = isServiceOperationWorkspace ? "Issue detail" : "Progress";
  const applyManualAction = (queueItem: TaskItemQueueItem, actionKey: string) => {
    if (isPending && pendingId) return;

    const pendingKey = `${queueItem.id}:${actionKey}`;
    const isRecallAction = actionKey === "recall-media";
    let recallSteps: AppProgressStep[] = [
      {
        id: "recall",
        label: "Thu hoi khoi Dang bai",
        detail: "Dang chay workflow recall-media cho item Workspace.",
        status: "running",
      },
      {
        id: "workspace",
        label: "Cap nhat Workspace",
        detail: "Dong bo trang thai item ve luong xu ly media.",
        status: "pending",
      },
      {
        id: "refresh",
        label: "Lam moi danh sach",
        detail: "Cap nhat lai bang item sau khi thu hoi.",
        status: "pending",
      },
    ];
    const setRecallStep = (
      stepId: string,
      status: AppProgressStep["status"],
      detail?: string,
    ) => {
      recallSteps = recallSteps.map((step) =>
        step.id === stepId ? { ...step, status, detail: detail ?? step.detail } : step,
      );
      appProgress.update({ steps: recallSteps });
    };

    setOpenActionMenuId(null);
    setPendingId(pendingKey);
    setActionError(null);
    if (isRecallAction) {
      appProgress.show({
        title: "Dang thu hoi media",
        message: "He thong dang dua item ve lai Workspace xu ly media.",
        steps: recallSteps,
      });
    }

    startTransition(async () => {
      let hideProgress = isRecallAction;
      let hideDelay = 2200;
      let elapsedSeconds = 0;
      const heartbeat = isRecallAction
        ? window.setInterval(() => {
          elapsedSeconds += 6;
          appProgress.update({
            message: `Server dang thu hoi media va cap nhat workspace... (${elapsedSeconds}s)`,
            steps: recallSteps,
          });
        }, 6000)
        : null;

      try {
        const result = await applyQueueItemManualTransitionAction({
          bindingId: queueItem.id,
          actionKey,
        });
        if (!result?.result?.applied) {
          throw new Error(result?.result?.reason ?? "WORKFLOW_ACTION_NOT_APPLIED");
        }
        if (isRecallAction) {
          setRecallStep("recall", "done", "Da thu hoi item khoi luong Dang bai.");
          setRecallStep("workspace", "running");
          setRecallStep("workspace", "done", "Workspace da ghi nhan trang thai moi.");
          setRecallStep("refresh", "running", "Dang lam moi danh sach.");
        }
        if (isRecallAction) {
          setRecallStep("refresh", "done", "Danh sach da duoc lam moi.");
          appProgress.update({
            message: "Thu hoi media hoan tat.",
            steps: recallSteps,
          });
        }
        setActionError(null);
        window.setTimeout(() => router.refresh(), isRecallAction ? 350 : 0);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Khong the cap nhat workflow.";
        if (isRecallAction) {
          hideDelay = 5000;
          recallSteps = recallSteps.map((step) =>
            step.status === "running" ? { ...step, status: "error", detail: message } : step,
          );
          appProgress.update({
            title: "Thu hoi media that bai",
            message,
            steps: recallSteps,
          });
          hideProgress = false;
          window.setTimeout(() => appProgress.hide(), hideDelay);
        }
        setActionError({
          itemId: queueItem.id,
          message,
        });
        console.error(error);
      } finally {
        if (heartbeat) window.clearInterval(heartbeat);
        setPendingId(null);
        if (hideProgress) {
          window.setTimeout(() => appProgress.hide(), hideDelay);
        }
      }
    });
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const visibleSelectableIds = selectableItems.map((item) => item.id);
      if (!visibleSelectableIds.length) return prev;

      if (visibleSelectableIds.every((id) => prev.includes(id))) {
        return prev.filter((id) => !visibleSelectableIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleSelectableIds]));
    });
  };
  const applyBulkManualAction = () => {
    if (!selectedTransitions.length) return;

    setPendingId("bulk");
    startTransition(async () => {
      try {
        await applyQueueItemManualTransitionsAction({
          items: selectedTransitions.map(({ queueItem, transition }) => ({
            bindingId: queueItem.id,
            actionKey: transition.actionKey,
          })),
        });
        setSelectedIds([]);
        router.refresh();
      } finally {
        setPendingId(null);
      }
    });
  };

  const isBulkPending = isPending && pendingId === "bulk";

  return (
    <Panel
      icon={<Folder className="h-4 w-4" />}
      title={itemLabel}
      action={
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {items.length} {itemLabel}
          </span>
          {canCreateTechnicalIssue ? (
            <button
              type="button"
              onClick={() => setCreateIssueOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Tao TI
            </button>
          ) : null}
        </div>
      }
    >
      <div className="space-y-3">
        {items.length ? (
          <>
            {actionError ? (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                <XCircle className="mt-0.5 h-4 w-4 flex-none" />
                <div className="min-w-0">
                  <div className="font-semibold">Workflow action failed</div>
                  <div className="mt-0.5 break-words text-xs leading-5">
                    {actionError.message}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActionError(null)}
                  className="ml-auto h-6 rounded-md px-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Dismiss
                </button>
              </div>
            ) : null}
            {selectedTransitions.length ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-700">
                  Đã chọn {selectedTransitions.length} item
                </div>
                <button
                  type="button"
                  disabled={isBulkPending}
                  onClick={applyBulkManualAction}
                  className="inline-flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBulkPending ? "Đang xử lý" : bulkLabel}
                </button>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1">
                {filters.map((item) => {
                  const active = item.key === filter;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setFilter(item.key)}
                      className={cn(
                        "h-7 whitespace-nowrap rounded-md px-2.5 text-xs font-semibold transition",
                        active
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-900",
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {visibleItems.length ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <div className="min-w-[980px]">
                  <div className={cn("grid gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500", gridClass)}>
                    <div>
                      <input
                        type="checkbox"
                        checked={allSelectableSelected}
                        disabled={!selectableItems.length || isPending}
                        onChange={toggleSelectAllVisible}
                        aria-label="Select visible items"
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </div>
                    <div>{itemLabel}</div>
                    <div>Status</div>
                    <div>{detailColumnLabel}</div>
                    {capabilities.workflow ? <div>Next step</div> : null}
                    <div>Activity</div>
                    <div>Updated</div>
                  </div>

                  {visibleItems.map((queueItem) => {
                    const rowPresentation = resolveQueueRowPresentation({
                      queueItem,
                      workflowActions: workflowActionsForItem(queueItem),
                      workspace: {
                        workTypeKey: workspaceWorkTypeKey,
                      },
                      isOpenTargetAction: isOpenTargetTransition,
                    });
                    const nextStepAction = rowPresentation.nextStep.primaryAction;
                    const secondaryNextStepActions = rowPresentation.nextStep.secondaryActions;
                    const displayStatus = rowPresentation.status.value as QueueItemStatus;
                    const businessPreview = queueItemToBusinessPreview(queueItem);
                    const blueprintItemActions = blueprintActionsForItem(queueItem);

                    return (
                      <div
                        key={queueItem.id}
                        className={cn("grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0", gridClass)}
                      >
                        <div className="flex items-center self-center">
                          <input
                            type="checkbox"
                            checked={selectedIdSet.has(queueItem.id)}
                            disabled={!transitionForItem(queueItem) || isPending}
                            onChange={() => toggleSelected(queueItem.id)}
                            aria-label={`Select ${queueItemTitle(queueItem)}`}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                        </div>
                        <div className="flex min-w-0 items-start gap-3">
                          <QueueItemThumbnail item={queueItem} />
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (businessPreview) previewState.openPreview(businessPreview);
                              }}
                              disabled={!businessPreview}
                              className={cn(
                                "block max-w-full truncate text-left text-sm font-semibold text-slate-950",
                                businessPreview ? "hover:text-blue-700" : "cursor-default",
                              )}
                            >
                              {queueItemTitle(queueItem)}
                            </button>
                            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                              <span>{queueItemRef(queueItem)}</span>
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

                        <div className="flex min-w-0 flex-wrap items-center gap-1.5 self-center">
                          {isServiceOperationWorkspace ? (
                            <WorkflowStateBadge
                              value={queueItem.currentWorkflowState}
                              label={queueItem.currentWorkflowStateLabel}
                            />
                          ) : (
                            <QueueStatusBadge status={displayStatus} />
                          )}
                        </div>

                        <div className="min-w-0 self-center">
                          {isServiceOperationWorkspace ? (
                            <QueueIssueDetailCell item={queueItem} />
                          ) : (
                            <QueueProgressCell progress={rowPresentation.progress} />
                          )}
                        </div>

                        {capabilities.workflow ? (
                          <div className="min-w-0 self-center">
                            {nextStepAction ? (
                              <div className="flex items-center gap-1.5">
                                {(() => {
                                  const transition = nextStepAction;
                                  const pendingKey = `${queueItem.id}:${transition.actionKey}`;
                                  const pending = isPending && pendingId === pendingKey;
                                  const disabled = pending || transition.enabled === false;
                                  const isOpenTarget = isOpenTargetTransition(transition);

                                  if (isOpenTarget) {
                                    return (
                                      <OpenTargetAction
                                        key={transition.actionKey}
                                        queueItem={queueItem}
                                        taskItemId={taskItemId}
                                        transition={transition}
                                        className="inline-flex h-7 min-w-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        onActivate={() => setOpenActionMenuId(null)}
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
                                      className="inline-flex h-7 min-w-0 items-center rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {pending
                                        ? "Applying"
                                        : effectiveTransitionLabel(transition, workspaceWorkTypeKey)}
                                    </button>
                                  );
                                })()}

                                {secondaryNextStepActions.length ? (
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenActionMenuId((current) =>
                                          current === queueItem.id ? null : queueItem.id,
                                        )
                                      }
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                                      aria-label="More workflow actions"
                                      aria-expanded={openActionMenuId === queueItem.id}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                    {openActionMenuId === queueItem.id ? (
                                      <div className="absolute right-0 z-20 mt-1 min-w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                                        {secondaryNextStepActions.map((transition) => {
                                          const pendingKey = `${queueItem.id}:${transition.actionKey}`;
                                          const pending = isPending && pendingId === pendingKey;
                                          const disabled = pending || transition.enabled === false;
                                          const isOpenTarget = isOpenTargetTransition(transition);

                                          if (isOpenTarget) {
                                            return (
                                              <OpenTargetAction
                                                key={transition.actionKey}
                                                queueItem={queueItem}
                                                taskItemId={taskItemId}
                                                transition={transition}
                                                className="flex h-8 w-full items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                onActivate={() => setOpenActionMenuId(null)}
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
                                              className="flex h-8 w-full items-center rounded-lg px-2 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                              {pending
                                                ? "Applying"
                                                : effectiveTransitionLabel(transition, workspaceWorkTypeKey)}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                            {blueprintItemActions.length ? (
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                  {blueprintItemActions.map((action) => {
                                    const open =
                                      openBlueprintAction?.itemId === queueItem.id &&
                                      openBlueprintAction.actionKey === action.key;
                                    const submitSupported = canSubmitBlueprintAction(action);

                                    return (
                                      <button
                                        key={action.key}
                                        type="button"
                                        disabled={!submitSupported}
                                        onClick={() =>
                                          setOpenBlueprintAction(open
                                            ? null
                                            : { itemId: queueItem.id, actionKey: action.key })
                                        }
                                        className="inline-flex h-7 min-w-0 items-center rounded-lg border border-blue-100 bg-blue-50 px-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
                                        title={submitSupported ? action.description : `Adapter pending: ${action.command}`}
                                      >
                                        {action.label}
                                      </button>
                                    );
                                  })}
                                </div>
                                {blueprintItemActions.map((action) => {
                                  const open =
                                    openBlueprintAction?.itemId === queueItem.id &&
                                    openBlueprintAction.actionKey === action.key;
                                  if (!open) return null;

                                  const valueKey = blueprintValueKey(queueItem, action);
                                  const pendingKey = `${queueItem.id}:${action.key}`;
                                  const pending = isPending && pendingId === pendingKey;

                                  return (
                                    <form
                                      key={`${action.key}:form`}
                                      className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/50 p-2"
                                      onSubmit={(event) => {
                                        event.preventDefault();
                                        applyBlueprintAction(queueItem, action);
                                      }}
                                    >
                                      {action.fields.map((field) => (
                                        <div key={field.key}>
                                          <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
                                            <span>{field.label}</span>
                                            <span>{field.required ? "required" : field.kind}</span>
                                          </div>
                                          <BlueprintActionFieldControl
                                            field={field}
                                            disabled={pending}
                                            value={blueprintValues[valueKey]?.[field.key]}
                                            onChange={(value) =>
                                              updateBlueprintValue(
                                                queueItem,
                                                action,
                                                field.key,
                                                value,
                                              )
                                            }
                                          />
                                        </div>
                                      ))}
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-[11px] text-slate-500">
                                          {action.command}
                                        </span>
                                        <button
                                          type="submit"
                                          disabled={pending}
                                          className="inline-flex h-7 items-center rounded-md bg-slate-900 px-2.5 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                          {pending ? "Running" : "Run"}
                                        </button>
                                      </div>
                                    </form>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="self-center">
                          <button
                            type="button"
                            disabled={!queueItem.activityCount && !queueItem.discussionCount}
                            onClick={() => onOpenQueueActivity?.(queueItem.id, "activity")}
                            title="Open activity for this item"
                            className={cn(
                              "inline-flex h-8 min-w-[58px] items-center justify-center rounded-lg px-2 text-sm font-semibold tabular-nums transition",
                              queueItem.activityCount || queueItem.discussionCount
                                ? "text-slate-700 hover:bg-slate-100"
                                : "cursor-default text-slate-400",
                            )}
                          >
                            {queueItem.discussionCount ?? 0}/{queueItem.activityCount ?? 0}
                          </button>
                        </div>

                        <div className="self-center text-xs text-slate-500">
                          {formatDateTime(queueItem.updatedAt, "-")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState>No items match this filter.</EmptyState>
            )}
          </>
        ) : (
          <EmptyState>No {itemLabel} in this workspace yet.</EmptyState>
        )}
      </div>
      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
      />
      <CreateTechnicalIssueModal
        open={createIssueOpen}
        serviceRequestId={serviceRequestId ?? null}
        onClose={() => setCreateIssueOpen(false)}
        onCreated={() => {
          setCreateIssueOpen(false);
          router.refresh();
        }}
      />
    </Panel>
  );
}
