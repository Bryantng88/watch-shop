"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Activity,
  MessageCircle,
  PackageSearch,
  Radio,
} from "lucide-react";
import type { CoordinationFlowListItemDTO } from "../server/coordination-dashboard.types";
import { cn } from "@/lib/utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { WorkflowStatusSignal } from "@/domains/shared/ui/signals";
import {
  applyQueueItemManualTransitionsAction,
} from "@/domains/task/actions/task.actions";
import {
  isOpenTargetTransition,
  OpenTargetAction,
  type TaskItemQueueItem,
} from "@/domains/task/ui/task-work/QueueWorkQueue";

type FlowStage = {
  key: string;
  label: string;
  workspaceKey: string;
  sortOrder: number;
};

type Props = {
  items: CoordinationFlowListItemDTO[];
  stages: FlowStage[];
  query: string;
  statusFilter: string;
  paymentFilter: string;
  activeStage: string;
  imageOverrides?: Record<string, string | null>;
  pending?: boolean;
  completedIcon?: "success" | "published";
};

function normalize(value?: string | null) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function itemStatus(item: CoordinationFlowListItemDTO) {
  if (item.isWorkflowDone || item.status === "DONE") return "DONE";
  if (item.status === "FEEDBACK" || item.status === "RETURNED") return "FEEDBACK";
  return "OPEN";
}

function UserAvatar({
  label,
  avatarUrl,
  isSystem = false,
}: {
  label: string;
  avatarUrl?: string | null;
  isSystem?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = avatarUrl
    ? resolveMediaPreviewSrc(avatarUrl) ?? avatarUrl
    : null;
  const fallback = isSystem ? "S" : label.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-[10px] font-bold text-white">
      {imageSrc && !imageFailed ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="28px"
          unoptimized
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : fallback}
    </span>
  );
}

export default function FlowItemListView({
  items,
  stages,
  query,
  statusFilter,
  paymentFilter,
  activeStage,
  imageOverrides = {},
  pending = false,
  completedIcon,
}: Props) {
  const router = useRouter();
  const [isActionPending, startActionTransition] = useTransition();
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [optimisticallyMovedIds, setOptimisticallyMovedIds] = useState<string[]>([]);
  const stageByKey = useMemo(() => new Map(
    stages.flatMap((stage) => [
      [normalize(stage.key), stage],
      [normalize(stage.workspaceKey), stage],
    ]),
  ), [stages]);
  const showStatusColumn = !normalize(activeStage).includes("photography");
  const showProgressColumn = normalize(activeStage).includes("media-processing");
  const showPublishChannels = normalize(activeStage).includes("publish");
  const visibleItems = useMemo(() => {
    const cleanQuery = query.trim().toLocaleLowerCase("vi");
    return items.filter((item) => {
      if (optimisticallyMovedIds.includes(item.id)) return false;
      const stage = stageByKey.get(normalize(item.flowStageKey));
      if (activeStage !== "ALL" && stage?.key !== activeStage) return false;
      if (statusFilter !== "ALL" && itemStatus(item) !== statusFilter) return false;
      const paymentStatus = item.payment?.status ?? "NONE";
      if (paymentFilter === "UNPAID" && !["UNPAID", "PARTIAL"].includes(paymentStatus)) return false;
      if (paymentFilter === "PAID" && paymentStatus !== "PAID") return false;
      if (paymentFilter === "NONE" && item.payment) return false;
      if (!cleanQuery) return true;
      return [
        item.preview.title,
        item.preview.ref,
        item.preview.status,
        item.currentWorkflowStateLabel,
        item.payment?.counterparty,
        item.payment?.ownerRef,
      ].filter(Boolean).join(" ").toLocaleLowerCase("vi").includes(cleanQuery);
    });
  }, [activeStage, items, optimisticallyMovedIds, paymentFilter, query, stageByKey, statusFilter]);
  const visibleIds = visibleItems.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const commonActions = selectedItems.length
    ? selectedItems[0].manualTransitions.filter(
        (transition) =>
          transition.enabled &&
          !isOpenTargetTransition(transition) &&
          selectedItems.every((item) =>
            item.manualTransitions.some(
              (candidate) =>
                candidate.enabled &&
                !isOpenTargetTransition(candidate) &&
                candidate.actionKey === transition.actionKey,
            ),
          ),
      )
    : [];

  function runAction(item: CoordinationFlowListItemDTO, actionKey: string) {
    setActionError(null);
    setPendingActionId(item.id);
    const shouldMoveOptimistically = normalize(item.flowStageKey).includes("photography");
    if (shouldMoveOptimistically) {
      setOptimisticallyMovedIds((current) => [...current, item.id]);
    }
    startActionTransition(async () => {
      try {
        const response = await fetch("/api/admin/task-items/manual-transition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bindingId: item.id, actionKey }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(result?.error ?? "Không thể thực hiện action.");
        }
        if (!result?.result?.applied) {
          throw new Error(result?.result?.reason ?? "Không thể thực hiện action.");
        }
        window.setTimeout(() => router.refresh(), 6000);
      } catch (error) {
        if (shouldMoveOptimistically) {
          setOptimisticallyMovedIds((current) => current.filter((id) => id !== item.id));
        }
        setActionError(error instanceof Error ? error.message : "Không thể cập nhật workflow.");
      } finally {
        setPendingActionId(null);
      }
    });
  }

  function runBulkAction(actionKey: string) {
    setActionError(null);
    setPendingActionId("BULK");
    startActionTransition(async () => {
      try {
        const result = await applyQueueItemManualTransitionsAction({
          items: selectedItems.map((item) => ({
            bindingId: item.id,
            actionKey,
          })),
        });
        if (!result.ok) {
          throw new Error(`${result.failed} item không thể thực hiện action.`);
        }
        setSelectedIds([]);
        router.refresh();
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Không thể cập nhật các item.");
      } finally {
        setPendingActionId(null);
      }
    });
  }

  return (
    <div className="bg-white">
      {selectedIds.length ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-violet-100 bg-violet-50 px-5 py-3">
          <span className="text-sm font-semibold text-violet-900">Đã chọn {selectedIds.length} item</span>
          {commonActions.slice(0, 2).map((transition) => (
            <button
              key={transition.actionKey}
              type="button"
              disabled={isActionPending}
              onClick={() => runBulkAction(transition.actionKey)}
              className="h-8 rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60"
            >
              {pendingActionId === "BULK" ? "Đang xử lý..." : transition.manualActionLabel || transition.label}
            </button>
          ))}
          {!commonActions.length ? <span className="text-xs text-violet-600">Các item đã chọn không có action chung.</span> : null}
          <button type="button" onClick={() => setSelectedIds([])} className="ml-auto text-xs font-semibold text-violet-700 hover:text-violet-900">Bỏ chọn</button>
        </div>
      ) : null}
      {actionError ? (
        <div className="border-b border-rose-100 bg-rose-50 px-5 py-2 text-xs font-medium text-rose-700">
          {actionError}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className={cn("w-full border-collapse", showPublishChannels ? "min-w-[1120px]" : "min-w-[980px]")}>
          <thead>
            <tr className="border-b border-slate-200 bg-[#fbfcfe] text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">
              <th className="w-12 px-5 py-3">
                <input type="checkbox" aria-label="Chọn tất cả item đang hiển thị" checked={allVisibleSelected} onChange={(event) => setSelectedIds(event.target.checked ? Array.from(new Set([...selectedIds, ...visibleIds])) : selectedIds.filter((id) => !visibleIds.includes(id)))} />
              </th>
              <th className="px-2 py-3">Item</th>
              {showStatusColumn ? <th className="px-4 py-3">Trạng thái</th> : null}
              {showProgressColumn ? <th className="w-40 px-4 py-3">Progress</th> : null}
              {showPublishChannels ? <th className="w-56 px-4 py-3">Kênh đăng</th> : null}
              <th className="w-44 px-4 py-3">Thao tác</th>
              <th className="px-4 py-3">Người thao tác</th>
              <th className="px-4 py-3 text-center">Cập nhật</th>
              <th className="px-4 py-3 text-center">Activity</th>
              <th className="px-4 py-3 text-center">Comment</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!pending && visibleItems.map((item) => {
              const stage = stageByKey.get(normalize(item.flowStageKey));
              const href = item.href || `/admin/task-items/${item.taskItemId}`;
              const checked = selectedIds.includes(item.id);
              const imageUrl = imageOverrides[item.targetId] || item.preview.imageUrl;
              const imageSrc = resolveMediaPreviewSrc(imageUrl) ?? imageUrl;
              const enabledActions = item.manualTransitions.filter((transition) => transition.enabled);
              const mediaOpenTransition = item.targetType === "WATCH" && stage?.key === "media-processing"
                ? {
                    actionKey: "open-watch-media",
                    label: "Xử lý media",
                    fromState: item.currentWorkflowState || "NEW",
                    toState: item.currentWorkflowState || "NEW",
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
                  }
                : null;
              const primaryAction = mediaOpenTransition ?? enabledActions[0] ?? null;
              return (
                <tr key={item.id} className={cn("group transition hover:bg-slate-50", checked && "bg-violet-50/50")}>
                  <td className="px-5 py-3">
                    <input type="checkbox" aria-label={`Chọn ${item.preview.title ?? "item"}`} checked={checked} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />
                  </td>
                  <td className="px-2 py-3">
                    <Link href={href} className="flex min-w-0 items-center gap-3">
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                        {imageSrc ? <Image src={imageSrc} alt="" fill sizes="44px" unoptimized className="object-cover" /> : <PackageSearch className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block max-w-[340px] truncate text-sm font-semibold text-slate-950">{item.preview.title || "Item chưa đặt tên"}</span>
                        <span className="mt-1 block truncate text-xs text-slate-500">{item.preview.ref || item.targetType}</span>
                      </span>
                    </Link>
                  </td>
                  {showStatusColumn ? (
                    <td className="px-4 py-3">
                      <WorkflowStatusSignal
                        status={item.currentWorkflowState || item.status}
                        label={item.currentWorkflowStateLabel || item.preview.status}
                        completedIcon={completedIcon}
                      />
                    </td>
                  ) : null}
                  {showProgressColumn ? <td className="px-4 py-3">
                    {item.mediaWorkProgress?.total ? (
                      <div className="w-36">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                          <span className={item.mediaWorkProgress.completed >= item.mediaWorkProgress.total ? "text-emerald-700" : "text-blue-700"}>
                            {item.mediaWorkProgress.completed}/{item.mediaWorkProgress.total}
                          </span>
                          <span className="text-slate-400">
                            {Math.round((item.mediaWorkProgress.completed / item.mediaWorkProgress.total) * 100)}%
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-[width]",
                              item.mediaWorkProgress.completed >= item.mediaWorkProgress.total
                                ? "bg-emerald-500"
                                : "bg-blue-500",
                            )}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  (item.mediaWorkProgress.completed /
                                    item.mediaWorkProgress.total) *
                                    100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : <span className="text-xs text-slate-400">-</span>}
                  </td> : null}
                  {showPublishChannels ? (
                    <td className="px-4 py-3">
                      {item.preview.postTargets?.length ? (
                        <div className="flex max-w-52 flex-wrap items-center gap-1.5">
                          {item.preview.postTargets.slice(0, 2).map((target) => (
                            <span
                              key={target.id}
                              title={target.platform ? `${target.name} · ${target.platform}` : target.name}
                              className="inline-flex max-w-36 items-center gap-1.5 rounded-md border border-violet-100 bg-violet-50/70 px-2 py-1 text-[11px] font-semibold text-violet-700"
                            >
                              <Radio className="h-3 w-3 shrink-0" />
                              <span className="truncate">{target.name}</span>
                            </span>
                          ))}
                          {item.preview.postTargets.length > 2 ? (
                            <span
                              title={item.preview.postTargets.slice(2).map((target) => target.name).join(", ")}
                              className="text-[11px] font-semibold text-slate-400"
                            >
                              +{item.preview.postTargets.length - 2}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Chưa chọn kênh</span>
                      )}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    {primaryAction && isOpenTargetTransition(primaryAction) ? (
                      <OpenTargetAction
                        queueItem={item as TaskItemQueueItem}
                        taskItemId={item.taskItemId}
                        transition={primaryAction}
                        className="inline-flex h-8 max-w-40 items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-slate-50 hover:text-violet-700"
                      />
                    ) : primaryAction ? (
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={() => runAction(item, primaryAction.actionKey)}
                        title={primaryAction.manualActionLabel}
                        className="h-8 max-w-36 truncate rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                      >
                        {pendingActionId === item.id ? "Đang xử lý..." : primaryAction.manualActionLabel || primaryAction.label}
                      </button>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {item.lastUpdatedBy ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          label={item.lastUpdatedBy.label}
                          avatarUrl={item.lastUpdatedBy.avatarUrl}
                          isSystem={item.lastUpdatedBy.isSystem}
                        />
                        <span className="max-w-36 truncate text-xs font-medium text-slate-700">{item.lastUpdatedBy.label}</span>
                      </div>
                    ) : <span className="text-xs text-slate-400">Hệ thống</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">{formatTime(item.updatedAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600"><Activity className="h-3.5 w-3.5 text-slate-400" />{item.activityCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600"><MessageCircle className="h-3.5 w-3.5 text-slate-400" />{item.discussionCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={href} aria-label="Mở item" className="text-slate-400 transition group-hover:text-violet-600"><ChevronRight className="h-4 w-4" /></Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pending ? <div className="px-5 py-12 text-center text-sm text-slate-500">Đang tải danh sách item...</div> : null}
      {!pending && !visibleItems.length ? (
        <div className="flex flex-col items-center px-5 py-14 text-center">
          <CheckCircle2 className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">Không có item phù hợp</p>
          <p className="mt-1 text-xs text-slate-500">Thử chọn bước khác hoặc xóa bớt bộ lọc.</p>
        </div>
      ) : null}
      <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">Hiển thị {visibleItems.length} / {items.length} item</div>
    </div>
  );
}
