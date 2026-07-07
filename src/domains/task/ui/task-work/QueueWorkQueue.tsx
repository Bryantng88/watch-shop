"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  GitBranch,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import type { WorkspaceCapabilities } from "@/domains/blueprint/shared/workspace-capabilities";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import { repairVietnameseMojibake } from "@/domains/shared/text/vietnamese-mojibake";
import { targetLabel } from "@/domains/task/ui/execution/execution-ui.utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import {
  applyQueueItemManualTransitionsAction,
  applyQueueItemManualTransitionAction,
} from "@/domains/task/actions/task.actions";
import { resolveQueueRowPresentation } from "./queue-row-presentation";

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

type QueueFilter = "ALL" | QueueItemStatus;

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

function userHasAdminRole(user?: UserSummary | null) {
  const roles = user?.roles ?? [];
  const permissions = user?.permissions ?? [];

  return (
    roles.map((role) => role.toUpperCase()).includes("ADMIN") ||
    permissions.map((permission) => permission.toUpperCase()).includes("ADMIN")
  );
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

export function OpenTargetAction({
  queueItem,
  taskItemId,
  transition,
  className,
  iconClassName = "h-3.5 w-3.5",
}: {
  queueItem: TaskItemQueueItem;
  taskItemId: string;
  transition: TaskItemQueueTransition;
  className: string;
  iconClassName?: string;
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
      if (event.data?.type !== "workspace-target-modal-close") return;

      setOpen(false);
      router.refresh();
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, router]);

  if (!href) return null;

  if (!modal) {
    return (
      <Link href={href} className={className}>
        <ExternalLink className={iconClassName} />
        {label}
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <ExternalLink className={iconClassName} />
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
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
  currentUser,
  onOpenQueueActivity,
}: {
  taskItemId: string;
  items: TaskItemQueueItem[];
  capabilities: WorkspaceCapabilities;
  itemLabel: string;
  workspaceWorkTypeKey?: string | null;
  currentUser?: UserSummary | null;
  onOpenQueueActivity?: (queueItemId: string, mode: "activity" | "discussion") => void;
}) {
  const [filter, setFilter] = useState<QueueFilter>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewState = useBusinessEntityPreview();
  const router = useRouter();
  const canReviewMedia = userHasAdminRole(currentUser);
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

    if (workspaceWorkTypeKey === "publish" && !canReviewMedia) {
      return transitions.filter((transition) => transition.actionKey !== "recall-media");
    }

    return transitions;
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
    ? "grid-cols-[42px_minmax(270px,1.35fr)_190px_minmax(150px,0.9fr)_160px_72px_72px_108px]"
    : "grid-cols-[42px_minmax(270px,1.35fr)_190px_minmax(150px,0.9fr)_72px_72px_108px]";
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
      icon={<GitBranch className="h-4 w-4" />}
      title={itemLabel}
      action={
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} {itemLabel}
        </span>
      }
    >
      <div className="space-y-3">
        {items.length ? (
          <>
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
                    <div>Latest Activity</div>
                    {capabilities.workflow ? <div>Next step</div> : null}
                    <div>Discussion</div>
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
                          <QueueStatusBadge status={displayStatus} />
                          {rowPresentation.progressBadge ? (
                            <span
                              title={rowPresentation.progressBadge.title ?? undefined}
                              className="inline-flex h-6 items-center rounded-full bg-blue-50 px-2 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
                            >
                              {rowPresentation.progressBadge.label}
                            </span>
                          ) : null}
                        </div>

                        <div className="min-w-0 self-center">
                          <div className="truncate text-xs font-medium text-slate-700">
                            {rowPresentation.latestActivityLabel}
                          </div>
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
                                  <details className="group relative">
                                    <summary
                                      className="inline-flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                                      aria-label="More workflow actions"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </summary>
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
                                  </details>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="self-center">
                          <button
                            type="button"
                            disabled={!queueItem.discussionCount}
                            onClick={() => onOpenQueueActivity?.(queueItem.id, "discussion")}
                            title="Open discussions for this item"
                            className={cn(
                              "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition",
                              queueItem.discussionCount
                                ? "text-blue-700 hover:bg-blue-50"
                                : "cursor-default text-slate-400",
                            )}
                          >
                            {queueItem.discussionCount ?? 0}
                          </button>
                        </div>

                        <div className="self-center">
                          <button
                            type="button"
                            disabled={!queueItem.activityCount}
                            onClick={() => onOpenQueueActivity?.(queueItem.id, "activity")}
                            title="Open activities for this item"
                            className={cn(
                              "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition",
                              queueItem.activityCount
                                ? "text-slate-700 hover:bg-slate-100"
                                : "cursor-default text-slate-400",
                            )}
                          >
                            {queueItem.activityCount}
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
    </Panel>
  );
}
