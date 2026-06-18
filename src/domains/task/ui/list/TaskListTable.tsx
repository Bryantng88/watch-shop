"use client";

import { Fragment } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  CirclePlay,
  Eye,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { TaskStatus } from "@prisma/client";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { TaskWithRelations } from "../../server/task.repo";
import {
  TaskStatusSignal,
  PrioritySignal,
} from "@/domains/shared/ui/signals/StatePrioritySignal";
import { TASK_DOMAIN_LABEL, TASK_MODE_LABEL } from "../../utils/task-labels";
import TaskExecutionPanel from "../detail/TaskExecutionPanel";
import TaskPagination from "./TaskPagination";

function formatDate(value?: Date | string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function userLabel(
  user?: { name?: string | null; email?: string | null } | null,
) {
  return user?.name || user?.email || "—";
}

function userInitial(
  user?: { name?: string | null; email?: string | null } | null,
) {
  const label = userLabel(user);
  if (!label || label === "—") return "?";
  return label.trim().slice(0, 1).toUpperCase();
}

function taskText(row: TaskWithRelations) {
  return row.description?.trim() || row.title?.trim() || "Không có mô tả";
}

export default function TaskListTable({
  items,
  page,
  totalPages,
  onPage,
  onStatus,
  onEdit,
  onOpen,
  expandedTaskId,
  onToggleExpand,
}: {
  items: TaskWithRelations[];
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  onStatus: (row: TaskWithRelations, status: TaskStatus) => void;
  onEdit: (row: TaskWithRelations) => void;
  onOpen: (row: TaskWithRelations) => void;
  expandedTaskId?: string | null;
  onToggleExpand?: (row: TaskWithRelations) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Ưu tiên</th>
              <th className="px-4 py-3">Người nhận</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Chưa có task phù hợp.
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const expanded = expandedTaskId === row.id;

                return (
                  <Fragment key={row.id}>
                    <tr
                      onClick={() => onToggleExpand?.(row)}
                      className="cursor-pointer hover:bg-slate-50/70"
                    >
                      <td className="max-w-[460px] px-4 py-3">
                        <div className="flex items-start gap-2">
                          {(row.executions?.length ?? 0) > 0 ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                onToggleExpand?.(row);
                              }}
                              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              aria-label={expanded ? "Thu gọn task" : "Mở rộng task"}
                            >
                              {expanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          ) : (
                            <span className="mt-0.5 h-5 w-5 shrink-0" />
                          )}

                          <div className="min-w-0">
                            <div className="line-clamp-2 font-semibold leading-5 text-slate-950">
                              {taskText(row)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="font-medium text-slate-800">
                          {row.taskType?.name ?? TASK_DOMAIN_LABEL[row.domain]}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {row.taskType?.code ? `${row.taskType.code} · ` : ""}
                          {TASK_MODE_LABEL[row.mode]}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <TaskStatusSignal status={row.status} />
                      </td>

                      <td className="px-4 py-3 text-center">
                        <PrioritySignal priority={row.priority} />
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                            {userInitial(row.assignedToUser)}
                          </span>
                          <span className="font-medium text-slate-700">
                            {userLabel(row.assignedToUser)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(row.dueAt)}
                      </td>

                      <td
                        className="px-4 py-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <RowActions
                          row={row}
                          actions={[
                            {
                              key: "toggle",
                              label: expanded ? "Thu gọn xử lý" : "Xem xử lý",
                              icon: <Eye className="h-4 w-4" />,
                              onClick: (r) => onToggleExpand?.(r) ?? onOpen(r),
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
                                onClick: (r) =>
                                  onStatus(r, TaskStatus.DONE),
                              }
                              : null,
                            row.status !== "TODO"
                              ? {
                                key: "reopen",
                                label: "Mở lại",
                                icon: <RotateCcw className="h-4 w-4" />,
                                onClick: (r) =>
                                  onStatus(r, TaskStatus.TODO),
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

                    {expanded && (row.executions?.length ?? 0) > 0 ? (
                      <tr>
                        <td colSpan={7} className="bg-slate-50 px-4 py-0">
                          <TaskExecutionPanel
                            task={row}
                            executions={row.executions ?? []}
                          />
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
    </div>
  );
}