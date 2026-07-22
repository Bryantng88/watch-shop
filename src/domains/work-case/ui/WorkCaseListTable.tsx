"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  Link2,
  Plus,
} from "lucide-react";
import { TaskPriority } from "@prisma/client";
import RowActions from "@/domains/shared/ui/list/RowActions";
import {
  PrioritySignal,
  TaskStatusSignal,
} from "@/domains/shared/ui/signals/StatePrioritySignal";
import { createTaskAction } from "@/domains/task/actions/task.actions";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import {
  BusinessEntityMiniCard,
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

export type WorkCaseTaskUserOption = {
  id: string;
  name?: string | null;
  email?: string | null;
};

function userLabel(
  user:
    | { name?: string | null; email?: string | null; id?: string | null }
    | null
    | undefined,
) {
  return user?.name || user?.email || user?.id || "-";
}

function userInitial(user?: { name?: string | null; email?: string | null } | null) {
  const label = userLabel(user);
  if (!label || label === "-") return "?";
  return label.trim().slice(0, 1).toUpperCase();
}

function getWorkCaseLinks(item: WorkCaseWithRelations): BusinessEntityPreview[] {
  const anyItem = item as any;
  const links: BusinessEntityPreview[] = [];

  if (anyItem.watchId || anyItem.watch) {
    const watch = anyItem.watch;
    const product = watch?.product as any;

    links.push({
      type: "WATCH",
      id: anyItem.watchId || watch?.id,
      title: product?.title || product?.sku || anyItem.watchId || "Watch",
      subtitle: product?.sku ? `SKU: ${product.sku}` : null,
      status: watch?.saleStage || null,
      href: anyItem.watchId ? `/admin/watches/${anyItem.watchId}` : null,
    });
  }

  if (anyItem.orderId || anyItem.order) {
    const order = anyItem.order;

    links.push({
      type: "ORDER",
      id: anyItem.orderId || order?.id,
      refNo: order?.refNo || null,
      title: order?.refNo || anyItem.orderId || "Order",
      subtitle: order?.customerName ? `Khách: ${order.customerName}` : null,
      status: order?.status || null,
      href: anyItem.orderId ? `/admin/orders/${anyItem.orderId}` : null,
    });
  }

  if (anyItem.shipmentId || anyItem.shipment) {
    const shipment = anyItem.shipment;

    links.push({
      type: "SHIPMENT",
      id: anyItem.shipmentId || shipment?.id,
      title: shipment?.trackingCode || anyItem.shipmentId || "Shipment",
      subtitle: shipment?.status || null,
      status: shipment?.status || null,
      href: anyItem.shipmentId ? `/admin/shipments/${anyItem.shipmentId}` : null,
    });
  }

  if (anyItem.serviceRequestId || anyItem.serviceRequest) {
    const serviceRequest = anyItem.serviceRequest;

    links.push({
      type: "SERVICE",
      id: anyItem.serviceRequestId || serviceRequest?.id,
      refNo: serviceRequest?.refNo || null,
      title: serviceRequest?.refNo || anyItem.serviceRequestId || "Service",
      subtitle: serviceRequest?.status || null,
      status: serviceRequest?.status || null,
      href: anyItem.serviceRequestId
        ? `/admin/service/${anyItem.serviceRequestId}`
        : null,
    });
  }

  return links.filter((link) => Boolean(link.id));
}

function RelatedLinksCell({
  item,
  onPreview,
}: {
  item: WorkCaseWithRelations;
  onPreview: (preview: BusinessEntityPreview) => void;
}) {
  const links = useMemo(() => getWorkCaseLinks(item), [item]);

  if (!links.length) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
        <Link2 className="h-3.5 w-3.5" />
        Phiếu tự do
      </div>
    );
  }

  return (
    <div className="min-w-[220px] space-y-1.5">
      {links.map((link) => (
        <BusinessEntityMiniCard
          key={`${link.type}-${link.id}`}
          preview={link}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}

function WorkCaseTaskPanel({
  item,
  tasks,
  users,
  currentUserId,
  onCreated,
}: {
  item: WorkCaseWithRelations;
  tasks: any[];
  users: WorkCaseTaskUserOption[];
  currentUserId: string;
  onCreated?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [assignedToUserId, setAssignedToUserId] = useState(
    item.assignedToUserId || currentUserId || users[0]?.id || "",
  );
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Nhập nội dung task trước đã bạn.");
      return;
    }

    startTransition(async () => {
      try {
        setError(null);

        await createTaskAction({
          title: cleanTitle,
          description: cleanTitle,
          priority: (item.priority as TaskPriority) || TaskPriority.MEDIUM,
          assignedToUserId: assignedToUserId || currentUserId || null,
          workCaseId: item.id,
          watchId: item.watchId ?? null,
          orderId: (item as any).orderId ?? null,
          shipmentId: (item as any).shipmentId ?? null,
          serviceRequestId: (item as any).serviceRequestId ?? null,
        });

        setTitle("");
        onCreated?.();
      } catch (err: any) {
        setError(err?.message || "Không thể tạo task từ phiếu xử lý.");
      }
    });
  }

  return (
    <section className="bg-slate-50/80 px-5 py-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl bg-white p-2 ring-1 ring-slate-200">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            className="h-10 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Nhập nội dung task cần giao..."
          />

          <select
            value={assignedToUserId}
            onChange={(event) => setAssignedToUserId(event.target.value)}
            className="h-10 w-[190px] shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none"
          >
            {users.length ? null : (
              <option value={currentUserId}>User hiện tại</option>
            )}

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {userLabel(user)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="h-10 shrink-0 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "..." : "Tạo"}
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-2">
          {(tasks ?? []).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100"
            >
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-sm font-semibold text-slate-950">
                  {task.description?.trim() || task.title}
                </div>

                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <TaskStatusSignal status={task.status} />

                  <span>•</span>

                  <span>
                    Giao cho{" "}
                    <b className="font-semibold text-slate-500">
                      {userLabel(task.assignedToUser)}
                    </b>
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/tasks/${task.id}`}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                onClick={(event) => event.stopPropagation()}
              >
                Mở
              </Link>
            </div>
          ))}

          {!tasks?.length ? (
            <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-400 ring-1 ring-slate-100">
              Chưa có task nào.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
export default function WorkCaseListTable({
  items,
  page,
  totalPages,
  users,
  currentUserId,
  onPage,
  onOpen,
  expandedId,
  onToggleExpand,
  onTaskCreated,
}: {
  items: WorkCaseWithRelations[];
  page: number;
  totalPages: number;
  users: WorkCaseTaskUserOption[];
  currentUserId: string;
  onPage: (page: number) => void;
  onOpen: (item: WorkCaseWithRelations) => void;
  expandedId?: string | null;
  onToggleExpand?: (item: WorkCaseWithRelations) => void;
  onTaskCreated?: () => void;
}) {
  const previewState = useBusinessEntityPreview();

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Vấn đề</th>
              <th className="px-4 py-3">Liên quan</th>
              <th className="px-4 py-3">Ưu tiên</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="w-[110px] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const expanded = expandedId === item.id;
              const taskCount = item.tasks?.length ?? 0;

              return (
                <Fragment key={item.id}>
                  <tr
                    onClick={() => onToggleExpand?.(item)}
                    className="cursor-pointer hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-[300px] max-w-[420px] items-start gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleExpand?.(item);
                          }}
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label={
                            expanded
                              ? "Thu gọn phiếu xử lý"
                              : "Mở task của phiếu xử lý"
                          }
                        >
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="line-clamp-1 text-xs font-semibold text-slate-400">
                            {item.refNo || "Phiếu xử lý"}
                          </div>

                          {item.description ? (
                            <div className="mt-1 line-clamp-3 text-sm font-semibold leading-6 text-slate-950">
                              {item.description}
                            </div>
                          ) : (
                            <div className="mt-1 text-sm italic text-slate-400">
                              Chưa có mô tả vấn đề.
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <RelatedLinksCell
                        item={item}
                        onPreview={previewState.openPreview}
                      />
                    </td>

                    <td className="px-4 py-4 align-top">
                      <PrioritySignal priority={item.priority} showLabel />
                    </td>

                    <td className="px-4 py-4 align-top text-slate-600">
                      {userLabel(item.raisedByUser)}
                    </td>

                    <td className="px-4 py-4 align-top text-xs text-slate-600">
                      <div className="font-semibold text-slate-900">
                        {taskCount} task
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        Mở rộng để giao việc
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    <td
                      className="px-4 py-4 align-top text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <RowActions
                        row={item}
                        actions={[
                          {
                            key: "tasks",
                            label: expanded ? "Thu gọn task" : "Mở task",
                            icon: expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            ),
                            onClick: (row) => onToggleExpand?.(row),
                          },
                          {
                            key: "view",
                            label: "Xem chi tiết",
                            icon: <Eye className="h-4 w-4" />,
                            onClick: onOpen,
                          },
                        ]}
                      />
                    </td>
                  </tr>

                  {expanded ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="bg-slate-50 px-4 py-0"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <WorkCaseTaskPanel
                          item={item}
                          tasks={item.tasks ?? []}
                          users={users}
                          currentUserId={currentUserId}
                          onCreated={onTaskCreated}
                        />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}

            {!items.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Chưa có phiếu xử lý.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
        <div>
          Trang <span className="font-semibold text-slate-900">{page}</span>/
          <span className="font-semibold text-slate-900">{totalPages}</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-50"
          >
            Trước
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPage(page + 1)}
            className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
        onActivityChanged={previewState.refreshPreview}
      />
    </div>
  );
}
