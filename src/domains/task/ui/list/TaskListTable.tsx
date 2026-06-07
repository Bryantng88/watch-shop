"use client";

import { CheckCircle2, CirclePlay, RotateCcw, XCircle } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { TaskWithRelations } from "../../server/task.repo";
import { TASK_KIND_LABEL, formatTaskDomainLabel } from "../../utils/task-labels";
import { TaskDueBadge, TaskPriorityBadge, TaskSourceBadge, TaskStatusBadge } from "../shared/TaskBadges";
import TaskPagination from "./TaskPagination";

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

function paymentSubLabel(row: TaskWithRelations) {
  if (!row.payment) return null;
  return `${Number(row.payment.amount ?? 0).toLocaleString("vi-VN")} ${row.payment.currency || "VND"} • ${row.payment.status}`;
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
              <th className="px-4 py-3">Người nhận</th>
              <th className="px-4 py-3">Due / SLA</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">Chưa có task phù hợp.</td></tr>
            ) : items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="max-w-[420px] px-4 py-3">
                  <div className="font-semibold text-slate-950">{row.title}</div>
                  {row.description ? <div className="mt-1 line-clamp-1 text-xs text-slate-500">{row.description}</div> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <TaskSourceBadge source={row.source} />
                    <span>{formatTaskDomainLabel(row)}: {domainTitle(row)}</span>
                    {paymentSubLabel(row) ? <span className="text-slate-400">• {paymentSubLabel(row)}</span> : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{TASK_KIND_LABEL[row.kind]}</td>
                <td className="px-4 py-3"><TaskStatusBadge status={row.status} /></td>
                <td className="px-4 py-3"><TaskPriorityBadge priority={row.priority} /></td>
                <td className="px-4 py-3 text-slate-600">{userLabel(row.assignedToUser)}</td>
                <td className="px-4 py-3"><TaskDueBadge dueAt={row.dueAt} status={row.status} /></td>
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
