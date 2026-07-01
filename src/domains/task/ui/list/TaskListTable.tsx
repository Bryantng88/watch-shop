"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { TaskStatus } from "@prisma/client";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { TaskWithRelations } from "../../server/core/task.repo";
import { getTaskWorkPanelAction } from "../../actions/task.actions";
import TaskWorkPanel from "../task-work/TaskWorkPanel";
import TaskPagination from "./TaskPagination";
import TaskListViewTabs from "./TaskListViewTabs";
import type { TaskViewKey } from "../../server/task.types";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import { cn } from "@/lib/utils";
import { TASK_KIND_LABEL } from "../../utils/task-labels";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
type UserOption = {
  id: string;
  name?: string | null;
  email?: string | null;
};

type AddSubtaskInput = {
  taskId: string;
  title: string;
  assignedToUserId?: string | null;
  priority?: string | null;
  dueAt?: string | null;
  tagNames?: string[];
};

function userLabel(
  user?: { name?: string | null; email?: string | null } | null,
) {
  return user?.name || user?.email || "—";
}

function canExpand() {
  return true;
}

function buildPeriodLabel(periodKey?: string | null) {
  if (!periodKey) return null;

  const match = periodKey.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return periodKey;

  const year = Number(match[1]);
  const week = Number(match[2]);

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;

  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Day + 1);

  const start = new Date(week1Monday);
  start.setUTCDate(start.getUTCDate() + (week - 1) * 7);

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  const format = (d: Date) =>
    `${String(d.getUTCDate()).padStart(2, "0")}/${String(
      d.getUTCMonth() + 1,
    ).padStart(2, "0")}/${d.getUTCFullYear()}`;

  return `${format(start)} - ${format(end)}`;
}

function TaskProgressCell({
  progress,
}: {
  progress: { done: number; total: number; percent: number };
}) {
  const isEmpty = progress.total <= 0;
  const isDone = progress.total > 0 && progress.done >= progress.total;

  return (
    <div className="w-[92px]">
      <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
        <span>{progress.done}</span>
        <span className="text-slate-400">/</span>
        <span>{progress.total}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isEmpty
              ? "bg-transparent"
              : isDone
                ? "bg-emerald-500"
                : "bg-slate-950",
          )}
          style={{ width: `${isEmpty ? 0 : progress.percent}%` }}
        />
      </div>
    </div>
  );
}

function isTrackingExecution(execution: any) {
  return execution?.metadataJson?.linkMode === "TRACKING";
}

function isExecutionDone(execution: any) {
  return Boolean(execution?.isBusinessDone);
}

function isTaskItemDone(item: any) {
  const executions = item.executions ?? [];
  const trackingExecutions = executions.filter(isTrackingExecution);

  if (trackingExecutions.length > 0) {
    return trackingExecutions.every(isExecutionDone);
  }

  return (
    Boolean(item.isDone) || String(item.status ?? "").toUpperCase() === "DONE"
  );
}

function taskProgress(row: TaskWithRelations) {
  const summary = (row as any).taskProgressSummary;
  if (summary && typeof summary === "object") {
    const total = Number(summary.total ?? 0);
    const done = Number(summary.done ?? 0);
    const percent =
      typeof summary.percent === "number"
        ? summary.percent
        : total > 0
          ? Math.round((done / total) * 100)
          : 0;

    return { done, total, percent };
  }

  const items = ((row as any).taskItems ?? []) as any[];
  const total = items.length;
  const done = items.filter(isTaskItemDone).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return { done, total, percent };
}

export default function TaskListTable({
  items,
  users = [],
  page,
  totalPages,
  onPage,
  onStatus,
  onEdit,
  expandedTaskId,
  onToggleExpand,
  onAddTaskItem,
  onCreateRelatedTask,
  onToggleTaskItem,
  onDeleteTaskItem,
  onUpdateTaskItem,
  onAddTaskItemChecklist,
  onToggleTaskItemChecklist,
  onUpdateTaskItemChecklistTitle,
  currentView,
  counts,
  canViewAll,
  onViewChange,

}: {
  items: TaskWithRelations[];
  users?: UserOption[];
  page: number;
  totalPages: number;
  currentView: TaskViewKey;
  counts: Record<string, number>;
  canViewAll?: boolean;
  onViewChange: (value: TaskViewKey) => void;
  onPage: (page: number) => void;
  onStatus: (row: TaskWithRelations, status: TaskStatus) => void;
  onEdit: (row: TaskWithRelations) => void;
  expandedTaskId?: string | null;
  onToggleExpand?: (row: TaskWithRelations) => void;
  onToggleTaskItem?: (
    itemId: string,
    isDone: boolean,
  ) => Promise<void> | void;
  onDeleteTaskItem?: (itemId: string) => Promise<void> | void;
  onAddTaskItem?: (input: AddSubtaskInput) => Promise<void> | void;
  onCreateRelatedTask?: (row: TaskWithRelations) => void;
  onUpdateTaskItem?: (input: {
    itemId: string;
    title: string;
    assignedToUserId?: string | null;
    priority?: string | null;
    dueAt?: string | null;
    tagNames?: string[];
  }) => Promise<any> | any;
  onAddTaskItemChecklist?: (
    taskItemId: string,
    title: string,
  ) => Promise<any> | any;
  onToggleTaskItemChecklist?: (
    checklistId: string,
    isDone: boolean,
  ) => Promise<void> | void;
  onUpdateTaskItemChecklistTitle?: (
    checklistId: string,
    title: string,
  ) => Promise<void> | void;
  onDeleteTaskItemChecklist?: (checklistId: string) => Promise<void> | void;
}) {
  const previewState = useBusinessEntityPreview();
  const appProgress = useAppProgress();
  const [localItems, setLocalItems] = useState(items);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const detailCacheRef = useRef(new Map<string, TaskWithRelations>());
  const inFlightRef = useRef(new Map<string, Promise<TaskWithRelations>>());
  const requestedExpandTaskIdRef = useRef<string | null>(null);

  async function loadTaskDetail(row: TaskWithRelations) {
    if ((row as any)._detailLoaded) return row;

    const cachedTask = detailCacheRef.current.get(row.id);
    if (cachedTask) return cachedTask;

    const currentRequest = inFlightRef.current.get(row.id);
    if (currentRequest) return currentRequest;

    setLoadingTaskId(row.id);
    appProgress.show({
      title: "Đang mở task",
      message: "Đang tải danh sách task item và checklist.",
    });

    const request = (async () => {
      const result = await getTaskWorkPanelAction(row.id);
      const nextTask = result?.task
        ? { ...result.task, _detailLoaded: true }
        : { ...row, _detailLoaded: true };

      detailCacheRef.current.set(row.id, nextTask as TaskWithRelations);

      setLocalItems((prev) =>
        prev.map((task) => (task.id === row.id ? (nextTask as any) : task)),
      );

      return nextTask as TaskWithRelations;
    })();

    inFlightRef.current.set(row.id, request);

    try {
      return await request;
    } finally {
      inFlightRef.current.delete(row.id);

      if (requestedExpandTaskIdRef.current === row.id) {
        setLoadingTaskId(null);
        appProgress.hide();
      }
    }
  }

  async function handleToggleExpand(row: TaskWithRelations) {
    if (expandedTaskId === row.id) {
      requestedExpandTaskIdRef.current = null;
      onToggleExpand?.(row);
      return;
    }

    requestedExpandTaskIdRef.current = row.id;
    let nextRow: TaskWithRelations;

    try {
      nextRow = await loadTaskDetail(row);
    } catch (error) {
      if (requestedExpandTaskIdRef.current === row.id) {
        setLoadingTaskId(null);
        appProgress.hide();
      }

      console.error("[task-list] failed to expand task", error);
      return;
    }

    if (requestedExpandTaskIdRef.current === row.id) {
      onToggleExpand?.(nextRow);
    }
  }

  function handleTaskItemsChange(taskId: string, nextTaskItems: any[]) {
    setLocalItems((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
            ...task,
            taskItems: nextTaskItems,
          }
          : task,
      ),
    );
  }
  useEffect(() => {
    setLocalItems(
      items.map((item) => detailCacheRef.current.get(item.id) ?? item),
    );
  }, [items]);
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-950">Danh sách task</div>
            <div className="mt-1 text-xs text-slate-500">
              Lọc theo góc nhìn xử lý task.
            </div>
          </div>

          <TaskListViewTabs
            value={currentView}
            counts={counts}
            canViewAll={canViewAll}
            onChange={onViewChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Nhóm</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3">Tiến độ</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Chưa có task phù hợp.
                </td>
              </tr>
            ) : (
              localItems.map((row) => {
                const expanded = expandedTaskId === row.id;
                const expandable = canExpand(row);
                const progress = taskProgress(row);
                const rowAccess = String((row as any).rowAccess || "OWNER");
                const visibleTaskItemIds = (row as any).visibleTaskItemIds ?? null;
                const taskItems = ((row as any).taskItems ?? []) as any[];
                const isLoadingTask = loadingTaskId === row.id;

                const visibleTaskItems = Array.isArray(visibleTaskItemIds)
                  ? taskItems.filter((item) => visibleTaskItemIds.includes(item.id))
                  : taskItems;

                const isSubtaskAssignee = rowAccess === "SUBTASK_ASSIGNEE";
                const periodLabel = buildPeriodLabel((row as any).periodKey);

                return (
                  <Fragment key={row.id}>
                    <tr
                      onClick={() => {
                        if (expandable) void handleToggleExpand(row);
                      }}
                      className={
                        expandable
                          ? cn(
                            "cursor-pointer hover:bg-slate-50/70",
                            isLoadingTask && "bg-slate-50/80",
                          )
                          : "hover:bg-slate-50/70"
                      }
                    >
                      <td className="max-w-[520px] px-4 py-3">
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleToggleExpand(row);
                            }}
                            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            aria-label={expanded ? "Thu gọn task" : "Mở rộng task"}
                          >
                            {isLoadingTask ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="line-clamp-1 font-semibold leading-5 text-slate-950">
                              {row.title}
                            </div>

                            {periodLabel ? (
                              <div className="mt-0.5 text-xs font-medium text-slate-400">
                                {periodLabel}
                              </div>
                            ) : null}

                            {row.description ? (
                              <div className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                                {row.description}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {TASK_KIND_LABEL[
                            (row as any).kind as keyof typeof TASK_KIND_LABEL
                          ] ?? "Công việc"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-slate-600">
                        {userLabel((row as any).createdByUser)}
                      </td>

                      <td className="px-4 py-3">
                        <TaskProgressCell progress={progress} />
                      </td>

                      <td
                        className="px-4 py-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <RowActions
                          row={row}
                          actions={[
                            {
                              key: "create-related-task",
                              label: "Tạo task liên quan",
                              onClick: (r) => onCreateRelatedTask?.(r),
                            },
                            {
                              key: "toggle",
                              label: expanded ? "Thu gọn xử lý" : "Xem xử lý",
                              onClick: (r) => void handleToggleExpand(r),
                            },
                            {
                              key: "edit",
                              label: "Sửa task",
                              onClick: onEdit,
                            },
                            row.status !== "IN_PROGRESS" &&
                              row.status !== "DONE" &&
                              row.status !== "CANCELLED"
                              ? {
                                key: "start",
                                label: "Bắt đầu",
                                icon: <CirclePlay className="h-4 w-4" />,
                                onClick: (r) =>
                                  onStatus(r, TaskStatus.IN_PROGRESS),
                              }
                              : null,
                            row.status !== "DONE"
                              ? {
                                key: "done",
                                label: "Hoàn thành",
                                icon: <CheckCircle2 className="h-4 w-4" />,
                                onClick: (r) => onStatus(r, TaskStatus.DONE),
                              }
                              : null,
                            row.status !== "TODO"
                              ? {
                                key: "reopen",
                                label: "Mở lại",
                                icon: <RotateCcw className="h-4 w-4" />,
                                onClick: (r) => onStatus(r, TaskStatus.TODO),
                              }
                              : null,
                            row.status !== "CANCELLED"
                              ? {
                                key: "cancel",
                                label: "Hủy task",
                                icon: <XCircle className="h-4 w-4" />,
                                tone: "danger",
                                separatorBefore: true,
                                onClick: (r) =>
                                  onStatus(r, TaskStatus.CANCELLED),
                              }
                              : null,
                          ]}
                        />
                      </td>
                    </tr>

                    {expanded ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="bg-slate-50 px-4 py-0"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <TaskWorkPanel
                            task={row}
                            users={users}
                            taskItems={visibleTaskItems}
                            executions={(row as any).executions ?? []}
                            canAddTaskItem={!isSubtaskAssignee}
                            canCancelTaskItem={!isSubtaskAssignee}
                            onAddTaskItem={onAddTaskItem}
                            onToggleTaskItem={onToggleTaskItem}
                            onDeleteTaskItem={onDeleteTaskItem}
                            onUpdateTaskItem={onUpdateTaskItem}
                            onAddTaskItemChecklist={onAddTaskItemChecklist}
                            onToggleTaskItemChecklist={onToggleTaskItemChecklist}
                            onUpdateTaskItemChecklistTitle={
                              onUpdateTaskItemChecklistTitle
                            }
                            onTaskItemsChange={handleTaskItemsChange}
                          />
                          {loadingTaskId === row.id ? (
                            <div className="px-4 py-3 text-sm text-slate-500">
                              Đang tải task item...
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ) : isLoadingTask ? (
                      <tr>
                        <td colSpan={5} className="bg-slate-50 px-4 py-3">
                          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
                            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            Đang tải task item...
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TaskPagination page={page} totalPages={totalPages} onPage={onPage} />

      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
      />
    </div>
  );
}
