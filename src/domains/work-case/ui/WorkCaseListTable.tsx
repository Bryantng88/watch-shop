"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  ImageIcon,
} from "lucide-react";
import RowActions from "@/domains/shared/ui/list/RowActions";
import { PrioritySignal } from "@/domains/shared/ui/signals/StatePrioritySignal";
import { TaskStatusSignal } from "@/domains/shared/ui/signals/StatePrioritySignal";
import type { WorkCaseWithRelations } from "../server/work-case.repo";

function userLabel(
  user:
    | { name?: string | null; email?: string | null; id?: string | null }
    | null
    | undefined,
) {
  return user?.name || user?.email || user?.id || "-";
}

function productImage(product: any) {
  const inline = product?.productImage?.[0] ?? product?.productImages?.[0];
  return inline?.imageUrl || inline?.fileKey || product?.primaryImageUrl || null;
}

function watchImage(item: WorkCaseWithRelations) {
  return productImage((item.watch as any)?.product);
}

function getRelatedInfo(item: WorkCaseWithRelations) {
  const anyItem = item as any;

  if (anyItem.orderId || anyItem.order) {
    const order = anyItem.order;

    return {
      type: "ORDER",
      title: order?.refNo || anyItem.orderId,
      subtitle: order?.customerName
        ? `Khách: ${order.customerName}`
        : "Phiếu phát sinh từ đơn hàng",
      meta: order?.orderItem?.length ? `${order.orderItem.length} sản phẩm` : null,
      img: null,
    };
  }

  if (anyItem.shipmentId || anyItem.shipment) {
    const shipment = anyItem.shipment;

    return {
      type: "SHIPMENT",
      title: shipment?.refNo || shipment?.trackingCode || anyItem.shipmentId,
      subtitle: shipment?.orderRefNo
        ? `Order: ${shipment.orderRefNo}`
        : "Phiếu phát sinh từ vận đơn",
      meta: shipment?.status || null,
      img: null,
    };
  }

  const title = item.watch?.product?.title || "Untitled watch";

  return {
    type: "WATCH",
    title,
    subtitle: `SKU: ${item.watch?.product?.sku || "-"}`,
    meta: null,
    img: watchImage(item),
  };
}

function WorkCaseTaskPanel({ tasks }: { tasks: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? tasks : tasks.slice(0, 4);
  const remaining = tasks.length - 4;

  return (
    <section className="border-y border-slate-100 bg-slate-50 px-3 py-4">
      <div className="space-y-3">
        {visibleTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {task.taskType?.name || task.domain || "Task"}
                  </span>

                  {task.taskAction?.name ? (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                      {task.taskAction.name}
                    </span>
                  ) : null}

                  <TaskStatusSignal status={task.status} />
                </div>

                <div className="mt-3 line-clamp-2 font-semibold text-slate-950">
                  {task.description?.trim() || task.title}
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Người nhận:{" "}
                  <span className="font-semibold text-slate-700">
                    {userLabel(task.assignedToUser)}
                  </span>
                  {" · "}
                  Kiểu:{" "}
                  <span className="font-semibold text-slate-700">
                    {task.mode || "-"}
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/tasks/${task.id}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                onClick={(e) => e.stopPropagation()}
              >
                Mở
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}

        {tasks.length > 4 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAll((v) => !v);
            }}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            {showAll ? "Thu gọn" : `+${remaining} task nữa`}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default function WorkCaseListTable({
  items,
  page,
  totalPages,
  onPage,
  onOpen,
  expandedId,
  onToggleExpand,
}: {
  items: WorkCaseWithRelations[];
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  onOpen: (item: WorkCaseWithRelations) => void;
  expandedId?: string | null;
  onToggleExpand?: (item: WorkCaseWithRelations) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Vấn đề</th>
              <th className="px-4 py-3">Liên quan</th>
              <th className="px-4 py-3 text-center">Ưu tiên</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3">Output</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="w-[72px] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const related = getRelatedInfo(item);
              const expanded = expandedId === item.id;
              const hasTasks = (item.tasks?.length ?? 0) > 0;

              return (
                <Fragment key={item.id}>
                  <tr
                    onClick={() => {
                      if (hasTasks) onToggleExpand?.(item);
                    }}
                    className={hasTasks ? "cursor-pointer hover:bg-slate-50/70" : "hover:bg-slate-50/70"}
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-[300px] max-w-[420px] items-start gap-2">
                        {hasTasks ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleExpand?.(item);
                            }}
                            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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
                          {item.description ? (
                            <div className="line-clamp-3 text-sm font-semibold leading-6 text-slate-950">
                              {item.description}
                            </div>
                          ) : (
                            <div className="text-sm italic text-slate-400">
                              Chưa có mô tả vấn đề.
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-[280px] gap-3">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                          {related.img ? (
                            <img
                              src={related.img}
                              alt={related.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            {related.type}
                          </div>
                          <div className="mt-0.5 line-clamp-2 font-semibold text-slate-900">
                            {related.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {related.subtitle}
                          </div>

                          {related.meta ? (
                            <div className="mt-1 inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                              {related.meta}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center align-top">
                      <PrioritySignal priority={item.priority as any} />
                    </td>

                    <td className="px-4 py-4 align-top text-slate-600">
                      {userLabel(item.raisedByUser)}
                    </td>

                    <td className="px-4 py-4 align-top text-xs text-slate-600">
                      <div>{item.tasks.length} task</div>
                      <div>{item.serviceRequests.length} SR</div>
                    </td>

                    <td className="px-4 py-4 align-top text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    <td
                      className="px-4 py-4 align-top text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RowActions
                        row={item}
                        actions={[
                          {
                            key: "view",
                            label: "Xem chi tiết",
                            icon: <Eye className="h-4 w-4" />,
                            onClick: onOpen,
                          },
                          hasTasks
                            ? {
                              key: "tasks",
                              label: expanded ? "Thu gọn task" : "Xem task",
                              onClick: (row) => onToggleExpand?.(row),
                            }
                            : null,
                        ]}
                      />
                    </td>
                  </tr>

                  {expanded && hasTasks ? (
                    <tr>
                      <td colSpan={7} className="bg-slate-50 px-4 py-0">
                        <WorkCaseTaskPanel tasks={item.tasks ?? []} />
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
    </div>
  );
}