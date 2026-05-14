"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, ShieldCheck, X } from "lucide-react";

import GuardNotice from "@/domains/shared/feedback/GuardNotice";
import InlineNotice from "@/domains/shared/feedback/InlineNotice";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import OrderInventoryNotice from "@/domains/order/shared/OrderInventoryNotice";
import { Button, Input, Select } from "@/domains/shared/ui/form/fields";
import OrderPageHeader from "@/domains/order/ui/OrderPageHeader";
import OrderStatusBadge from "@/domains/order/ui/OrderStatusBadge";
import { cx, fmtDate, fmtMoney, sourceLabel, verificationLabel } from "@/domains/order/ui/order-ui.helpers";

export type OrderListItem = {
  id: string;
  refNo: string | null;
  customerName: string | null;
  shipPhone: string | null;
  reserveType: string | null;
  depositRequired: number;
  status: string;
  subtotal: number;
  currency: string;
  itemCount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  source: string;
  verificationStatus: string;
  hasShipment: boolean | null;
};

type ViewKey = "all" | "web_pending" | "need_action" | "processing" | "delivered" | "completed" | "cancelled";
type Counts = Record<ViewKey, number>;

type Props = {
  items: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rawSearchParams: Record<string, string | string[] | undefined>;
  counts?: Partial<Counts>;
};

const views: Array<{ key: ViewKey; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "web_pending", label: "Chờ xác minh" },
  { key: "need_action", label: "Cần xử lý" },
  { key: "processing", label: "Đang xử lý" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã hủy" },
];

function buildHref(pathname: string, sp: URLSearchParams, patch: Record<string, string | null>) {
  const next = new URLSearchParams(sp.toString());
  Object.entries(patch).forEach(([key, value]) => {
    if (value == null || value === "") next.delete(key);
    else next.set(key, value);
  });
  return `${pathname}?${next.toString()}`;
}

export default function OrderListClient({ items, total, page, pageSize, totalPages, rawSearchParams, counts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();

  const currentView = ((sp.get("view") || "all") as ViewKey);
  const q = String(rawSearchParams.q ?? "");
  const sort = String(rawSearchParams.sort ?? "updatedDesc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const countsByView: Counts = useMemo(() => ({
    all: counts?.all ?? (currentView === "all" ? total : 0),
    web_pending: counts?.web_pending ?? (currentView === "web_pending" ? total : 0),
    need_action: counts?.need_action ?? (currentView === "need_action" ? total : 0),
    processing: counts?.processing ?? (currentView === "processing" ? total : 0),
    delivered: counts?.delivered ?? (currentView === "delivered" ? total : 0),
    completed: counts?.completed ?? (currentView === "completed" ? total : 0),
    cancelled: counts?.cancelled ?? (currentView === "cancelled" ? total : 0),
  }), [counts, currentView, total]);

  const selectableIds = useMemo(() => items.filter((item) => item.status === "DRAFT" || item.status === "RESERVED").map((item) => item.id), [items]);
  const allChecked = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));
  const someChecked = selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

  function setView(view: ViewKey) {
    setSelectedIds([]);
    router.push(buildHref(pathname, sp, { view: view === "all" ? null : view, page: "1", pageSize: String(pageSize) }));
  }

  async function bulkPost() {
    if (!selectedIds.length) return;
    const ok = await dialog.confirm({
      tone: "warning",
      title: "Duyệt các đơn đã chọn?",
      message: <>Sau khi duyệt, sản phẩm watch trong các đơn này sẽ được sync sang trạng thái <b>SOLD</b>.</>,
      confirmText: "Duyệt đơn",
    });
    if (!ok) return;

    progress.show({ title: "Đang duyệt đơn", message: "Đang sync Order → Watch HOLD/SOLD" });
    try {
      const res = await fetch("/api/admin/orders/bulk-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedIds }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Duyệt đơn thất bại"));
      notify.success({ title: "Đã duyệt đơn", message: "Order đã được xử lý và đồng bộ tồn kho watch." });
      router.refresh();
      setSelectedIds([]);
    } catch (error: any) {
      notify.error({ title: "Không thể duyệt đơn", message: error?.message || "Thao tác thất bại" });
    } finally {
      progress.hide();
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 pt-6 lg:px-6">
      <OrderPageHeader
        title="Đơn hàng"
        description="Order là nguồn dữ liệu vận hành cho Watch: đơn nháp/giữ cọc tạo HOLD, đơn đã chốt tạo SOLD."
        actions={
          <Link href="/admin/orders/new" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Tạo đơn hàng
          </Link>
        }
      />

      <OrderInventoryNotice status={currentView === "cancelled" ? "CANCELLED" : currentView === "all" ? undefined : "DRAFT"} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {views.map((view) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setView(view.key)}
              className={cx(
                "rounded-2xl px-3.5 py-2 text-sm font-medium transition",
                currentView === view.key ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {view.label} <span className="ml-1 opacity-70">{countsByView[view.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <form action={pathname} method="get" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        {currentView !== "all" ? <input type="hidden" name="view" value={currentView} /> : null}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_160px_auto] lg:items-end">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Tìm kiếm</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-0 top-2.5 h-4 w-4 text-slate-400" />
              <Input name="q" defaultValue={q} placeholder="RefNo, tên khách, số điện thoại..." className="pl-6" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Sắp xếp</span>
            <Select name="sort" defaultValue={sort} options={[
              { value: "updatedDesc", label: "Cập nhật mới nhất" },
              { value: "updatedAsc", label: "Cập nhật cũ nhất" },
              { value: "createdDesc", label: "Tạo mới nhất" },
              { value: "createdAsc", label: "Tạo cũ nhất" },
            ]} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Page size</span>
            <Select name="pageSize" defaultValue={String(pageSize)} options={["10", "20", "50"].map((n) => ({ value: n, label: n }))} />
          </label>
          <div className="flex gap-2">
            <Button type="submit">Lọc</Button>
            <Link href={pathname} className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Clear</Link>
          </div>
        </div>
      </form>

      {selectedIds.length ? (
        <GuardNotice
          title={`${selectedIds.length} đơn đang được chọn`}
          message="Chỉ đơn DRAFT/RESERVED được duyệt hàng loạt. Khi duyệt, watch liên quan sẽ được chuyển sang SOLD."
          tone="warning"
          icon="shield"
          action={
            <div className="flex gap-2">
              <Button type="button" onClick={bulkPost}>Duyệt các đơn đã chọn</Button>
              <Button type="button" variant="outline" onClick={() => setSelectedIds([])}>Bỏ chọn</Button>
            </div>
          }
        />
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="w-10 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    disabled={!selectableIds.length}
                    onChange={(e) => setSelectedIds(e.target.checked ? selectableIds : [])}
                  />
                </th>
                <th className="px-4 py-4">Đơn hàng</th>
                <th className="px-4 py-4">Khách hàng</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Nguồn</th>
                <th className="px-4 py-4 text-right">Tổng tiền</th>
                <th className="px-4 py-4">Cập nhật</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {!items.length ? (
                <tr><td colSpan={8} className="px-4 py-10"><InlineNotice title="Không có đơn hàng trong bộ lọc này" description="Thử đổi tab hoặc clear bộ lọc tìm kiếm." /></td></tr>
              ) : items.map((order) => {
                const selectable = selectableIds.includes(order.id);
                return (
                  <tr key={order.id} className="border-t border-slate-100 align-top transition hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <input type="checkbox" disabled={!selectable} checked={selectedIds.includes(order.id)} onChange={(e) => setSelectedIds((prev) => e.target.checked ? [...prev, order.id] : prev.filter((id) => id !== order.id))} />
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold text-slate-950 hover:underline">{order.refNo || "Chưa có mã"}</Link>
                      <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-slate-500">
                        <span>{order.itemCount} dòng</span>
                        {order.hasShipment ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Shipment</span> : null}
                        {order.reserveType ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">{order.reserveType}</span> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{order.customerName || "-"}</div>
                      <div className="mt-1 text-xs text-slate-500">{order.shipPhone || "-"}</div>
                    </td>
                    <td className="px-4 py-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-4 py-4">
                      <div className="text-slate-700">{sourceLabel(order.source)}</div>
                      <div className="mt-1 text-xs text-slate-500">{verificationLabel(order.verificationStatus)}</div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-950">{fmtMoney(order.subtotal, order.currency)}</td>
                    <td className="px-4 py-4 text-slate-500">{fmtDate(order.updatedAt)}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">Chi tiết</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
          <div>Tổng: <b className="text-slate-900">{total}</b> đơn · Trang {page}/{totalPages}</div>
          <div className="flex gap-2">
            <Link aria-disabled={page <= 1} href={buildHref(pathname, sp, { page: String(Math.max(1, page - 1)) })} className={cx("rounded-xl border border-slate-200 px-3 py-2", page <= 1 && "pointer-events-none opacity-40")}>Trước</Link>
            <Link aria-disabled={page >= totalPages} href={buildHref(pathname, sp, { page: String(Math.min(totalPages, page + 1)) })} className={cx("rounded-xl border border-slate-200 px-3 py-2", page >= totalPages && "pointer-events-none opacity-40")}>Sau</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
