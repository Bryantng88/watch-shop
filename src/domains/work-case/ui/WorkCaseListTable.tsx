"use client";

import { AlertTriangle, Circle, Eye, Flame, ImageIcon } from "lucide-react";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import { WORK_CASE_PRIORITY_LABEL } from "../utils/work-case-labels";

function userLabel(user: { name?: string | null; email?: string | null; id?: string | null } | null | undefined) {
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

  if (anyItem.order) {
    const order = anyItem.order;
    const lines = order.items ?? order.orderItems ?? [];
    const firstLine = lines[0];
    const firstProduct = firstLine?.product ?? firstLine?.watch?.product;
    const count = lines.length;

    return {
      type: "ORDER",
      title: order.refNo || order.orderCode || order.id,
      subtitle: `${count || 0} sản phẩm${order.customerName ? ` · ${order.customerName}` : ""}`,
      meta: count > 1 ? `+${count - 1} watch khác` : null,
      img: productImage(firstProduct),
    };
  }

  if (anyItem.shipment) {
    const shipment = anyItem.shipment;
    const order = shipment.order;
    const lines = order?.items ?? order?.orderItems ?? [];
    const firstLine = lines[0];
    const firstProduct = firstLine?.product ?? firstLine?.watch?.product;
    const count = lines.length;

    return {
      type: "SHIPMENT",
      title: shipment.refNo || shipment.trackingCode || shipment.id,
      subtitle: `${order?.refNo || "Order"}${count ? ` · ${count} sản phẩm` : ""}`,
      meta: shipment.status || null,
      img: productImage(firstProduct),
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

function PrioritySignal({ priority }: { priority: any }) {
  const label = WORK_CASE_PRIORITY_LABEL[priority] || String(priority || "-");

  if (priority === "URGENT") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
        <Flame className="h-3.5 w-3.5" />
        {label}
      </span>
    );
  }

  if (priority === "HIGH") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
        <AlertTriangle className="h-3.5 w-3.5" />
        {label}
      </span>
    );
  }

  if (priority === "MEDIUM") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
        <Circle className="h-3 w-3 fill-current" />
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
      <Circle className="h-3 w-3 fill-current" />
      {label}
    </span>
  );
}

export default function WorkCaseListTable({
  items,
  page,
  totalPages,
  onPage,
  onOpen,
}: {
  items: WorkCaseWithRelations[];
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  onOpen: (item: WorkCaseWithRelations) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Vấn đề</th>
              <th className="px-4 py-3">Liên quan</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3">Output</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="w-[72px] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const related = getRelatedInfo(item);

              return (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4 align-top">
                    <div className="min-w-[300px] max-w-[420px]">
                      {item.description ? (
                        <div className="line-clamp-3 text-sm font-medium leading-6 text-slate-800">
                          {item.description}
                        </div>
                      ) : (
                        <div className="text-sm italic text-slate-400">
                          Chưa có mô tả vấn đề.
                        </div>
                      )}


                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex min-w-[280px] gap-3">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {related.img ? (
                          <img src={related.img} alt={related.title} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {related.type}
                        </div>
                        <div className="mt-0.5 line-clamp-2 font-semibold text-slate-900">{related.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{related.subtitle}</div>
                        {related.meta ? (
                          <div className="mt-1 inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                            {related.meta}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <PrioritySignal priority={item.priority} />
                  </td>

                  <td className="px-4 py-4 align-top text-slate-600">{userLabel(item.raisedByUser)}</td>

                  <td className="px-4 py-4 align-top text-xs text-slate-600">
                    <div>{item.tasks.length} task</div>
                    <div>{item.serviceRequests.length} SR</div>
                  </td>

                  <td className="px-4 py-4 align-top text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-4 py-4 align-top text-right">
                    <RowActions
                      row={item}
                      actions={[
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
              );
            })}

            {!items.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
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