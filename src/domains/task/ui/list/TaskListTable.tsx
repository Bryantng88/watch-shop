"use client";

import { CheckCircle2, CirclePlay, RotateCcw, XCircle } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { TaskWithRelations } from "../../server/task.repo";
import { TASK_KIND_LABEL, formatTaskDomainLabel } from "../../utils/task-labels";
import { TaskPriorityBadge, TaskSourceBadge, TaskStatusBadge } from "../shared/TaskBadges";
import TaskPagination from "./TaskPagination";

function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "—";
}

function domainTitle(row: TaskWithRelations) {
  if (row.watch?.product?.title) return row.watch.product.title;
  if (row.order?.refNo) return row.order.refNo;
  if (row.shipment?.refNo || row.shipment?.orderRefNo) return row.shipment.refNo || row.shipment.orderRefNo;
  if (row.acquisition?.refNo) return row.acquisition.refNo;
  if (row.serviceRequest?.refNo) return row.serviceRequest.refNo;
  if (row.technicalIssue?.area) return row.technicalIssue.area;
  if (row.payment?.refNo) return row.payment.refNo;
  return "—";
}

export default function TaskListTable({ items, page, totalPages, onPage, onStatus, onEdit }: { items: TaskWithRelations[]; page: number; totalPages: number; onPage: (page: number) => void; onStatus: (row: TaskWithRelations, status: TaskStatus) => void; onEdit: (row: TaskWithRelations) => void }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ưu tiên</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3">Người nhận</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">Chưa có task phù hợp.</td></tr>
            ) : items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="max-w-[360px] px-4 py-3">
                  <div className="font-semibold text-slate-950">{row.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <TaskSourceBadge source={row.source} />
                    <span>{formatTaskDomainLabel(row)}: {domainTitle(row)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.taskType ? (
                    <div>
                      <div className="font-medium text-slate-800">{row.taskType.name}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-400">{row.taskType.code}</div>
                    </div>
                  ) : TASK_KIND_LABEL[row.kind]}
                </td>
                <td className="px-4 py-3"><TaskStatusBadge status={row.status} /></td>
                <td className="px-4 py-3"><TaskPriorityBadge priority={row.priority} /></td>
                <td className="px-4 py-3 text-slate-600">{userLabel(row.createdByUser)}</td>
                <td className="px-4 py-3 text-slate-600">{userLabel(row.assignedToUser)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(row.dueAt)}</td>
                <td className="px-4 py-3">
                  <RowActions
                    row={row}
                    actions={[
                      { key: "edit", label: "Sửa task", onClick: onEdit },
                      row.status !== "IN_PROGRESS" && row.status !== "DONE" && row.status !== "CANCELLED" ? { key: "start", label: "Bắt đầu", icon: <CirclePlay className="h-4 w-4" />, onClick: (r) => onStatus(r, TaskStatus.IN_PROGRESS) } : null,
                      row.status !== "DONE" ? { key: "done", label: "Hoàn thành", icon: <CheckCircle2 className="h-4 w-4" />, onClick: (r) => onStatus(r, TaskStatus.DONE) } : null,
                      row.status !== "TODO" ? { key: "reopen", label: "Mở lại", icon: <RotateCcw className="h-4 w-4" />, onClick: (r) => onStatus(r, TaskStatus.TODO) } : null,
                      row.status !== "CANCELLED" ? { key: "cancel", label: "Hủy task", icon: <XCircle className="h-4 w-4" />, tone: "danger", separatorBefore: true, onClick: (r) => onStatus(r, TaskStatus.CANCELLED) } : null,
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TaskPagination page={page} totalPages={totalPages} onPage={onPage} />
    </div>
  );
}
