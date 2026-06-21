"use client";

import { Fragment, useMemo } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Link2,
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
import TaskWorkPanel from "./TaskWorkPanel";
import TaskPagination from "./TaskPagination";
import {
  BusinessEntityMiniCard,
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

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
};

function formatDate(value?: Date | string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "—";
}

function userInitial(user?: { name?: string | null; email?: string | null } | null) {
  const label = userLabel(user);
  if (!label || label === "—") return "?";
  return label.trim().slice(0, 1).toUpperCase();
}

function taskText(row: TaskWithRelations) {
  return row.description?.trim() || row.title?.trim() || "Không có mô tả";
}

function canExpand(_row: any) {
  return true;
}

function compactId(id?: string | null) {
  const clean = String(id ?? "").trim();
  if (!clean) return "-";
  if (clean.length <= 16) return clean;
  return `${clean.slice(0, 8)}...${clean.slice(-6)}`;
}

function getBusinessLinksFromOwner(row: TaskWithRelations): BusinessEntityPreview[] {
  const anyRow = row as any;
  const owner = anyRow.workCase || anyRow;

  const links: BusinessEntityPreview[] = [];

  if (owner.watchId || owner.watch) {
    const watch = owner.watch;
    const product = watch?.product;

    links.push({
      type: "WATCH",
      id: owner.watchId || watch?.id,
      title: product?.title || product?.sku || owner.watchId || "Watch",
      subtitle: product?.sku ? `SKU: ${product.sku}` : compactId(owner.watchId || watch?.id),
      status: watch?.saleStage || null,
      href: owner.watchId ? `/admin/watches/${owner.watchId}` : null,
    });
  }

  if (owner.orderId || owner.order) {
    const order = owner.order;

    links.push({
      type: "ORDER",
      id: owner.orderId || order?.id,
      refNo: order?.refNo || null,
      title: order?.refNo || owner.orderId || "Order",
      subtitle: order?.customerName
        ? `Khách: ${order.customerName}`
        : compactId(owner.orderId || order?.id),
      status: order?.status || null,
      href: owner.orderId ? `/admin/orders/${owner.orderId}` : null,
    });
  }

  if (owner.shipmentId || owner.shipment) {
    const shipment = owner.shipment;

    links.push({
      type: "SHIPMENT",
      id: owner.shipmentId || shipment?.id,
      refNo: shipment?.refNo || shipment?.trackingCode || null,
      title: shipment?.refNo || shipment?.trackingCode || owner.shipmentId || "Shipment",
      subtitle: shipment?.status || compactId(owner.shipmentId || shipment?.id),
      status: shipment?.status || null,
      href: owner.shipmentId ? `/admin/shipments/${owner.shipmentId}` : null,
    });
  }

  if (owner.serviceRequestId || owner.serviceRequest) {
    const serviceRequest = owner.serviceRequest;

    links.push({
      type: "SERVICE",
      id: owner.serviceRequestId || serviceRequest?.id,
      refNo: serviceRequest?.refNo || null,
      title: serviceRequest?.refNo || owner.serviceRequestId || "Service",
      subtitle: serviceRequest?.status || compactId(owner.serviceRequestId || serviceRequest?.id),
      status: serviceRequest?.status || null,
      href: owner.serviceRequestId
        ? `/admin/service/${owner.serviceRequestId}`
        : null,
    });
  }

  return links.filter((item) => Boolean(item.id));
}

function TaskContextCell({ row }: { row: TaskWithRelations }) {
  const workCase = (row as any).workCase;

  if (!workCase) {
    return (
      <span className="text-xs text-slate-400">
        —
      </span>
    );
  }

  return (
    <div className="min-w-[160px] max-w-[220px]">
      <div className="line-clamp-1 text-xs font-semibold text-slate-700">
        {workCase.refNo || "Phiếu xử lý"}
      </div>

      <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
        {workCase.title || workCase.description || "WorkCase"}
      </div>
    </div>
  );
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
  onAddChecklistItem,
  onCreateRelatedTask,
  onToggleChecklistItem,
  onDeleteChecklistItem,
}: {
  items: TaskWithRelations[];
  users?: UserOption[];
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  onStatus: (row: TaskWithRelations, status: TaskStatus) => void;
  onEdit: (row: TaskWithRelations) => void;
  expandedTaskId?: string | null;
  onToggleExpand?: (row: TaskWithRelations) => void;
  onToggleChecklistItem?: (itemId: string, isDone: boolean) => Promise<void> | void;
  onDeleteChecklistItem?: (itemId: string) => Promise<void> | void;
  onAddChecklistItem?: (input: AddSubtaskInput) => Promise<void> | void;
  onCreateRelatedTask?: (row: TaskWithRelations) => void;
}) {
  const previewState = useBusinessEntityPreview();

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Ngữ cảnh</th>
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
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                  Chưa có task phù hợp.
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const expanded = expandedTaskId === row.id;
                const expandable = canExpand(row);

                return (
                  <Fragment key={row.id}>
                    <tr
                      onClick={() => {
                        if (expandable) onToggleExpand?.(row);
                      }}
                      className={
                        expandable
                          ? "cursor-pointer hover:bg-slate-50/70"
                          : "hover:bg-slate-50/70"
                      }
                    >
                      <td className="max-w-[380px] px-4 py-3">
                        <div className="flex items-start gap-2">
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

                          <div className="min-w-0">
                            <div className="line-clamp-2 font-semibold leading-5 text-slate-950">
                              {taskText(row)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        className="px-4 py-3 align-top"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <TaskContextCell row={row} />
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        <div className="font-medium text-slate-800">
                          {String((row as any).kind ?? "BUSINESS") === "PERSONAL"
                            ? "Personal"
                            : "Business"}
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
                              key: "create-related-task",
                              label: "Tạo task liên quan",
                              onClick: (r) => onCreateRelatedTask?.(r),
                            },
                            {
                              key: "toggle",
                              label: expanded ? "Thu gọn xử lý" : "Xem xử lý",
                              onClick: (r) => onToggleExpand?.(r),
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
                                onClick: (r) => onStatus(r, TaskStatus.IN_PROGRESS),
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
                                onClick: (r) => onStatus(r, TaskStatus.CANCELLED),
                              }
                              : null,
                          ]}
                        />
                      </td>
                    </tr>

                    {expanded ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="bg-slate-50 px-4 py-0"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <TaskWorkPanel
                            task={row}
                            users={users}
                            checklistItems={(row as any).checklistItems ?? []}
                            executions={(row as any).executions ?? []}
                            onAddChecklistItem={onAddChecklistItem}
                            onToggleChecklistItem={onToggleChecklistItem}
                            onDeleteChecklistItem={onDeleteChecklistItem}
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