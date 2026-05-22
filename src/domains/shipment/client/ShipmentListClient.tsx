"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  buildHref,
  isCodShipment,
  normalizeShipmentView,
  ShipmentEditModal,
  ShipmentFeeModal,
  ShipmentListFilters,
  ShipmentListTable,
  ShipmentListToolbar,
  ShipmentListViewTabs,
  ShipmentReturnFeeModal,
  type ShipmentListFiltersValue,
  type ShipmentListItem,
  type ShipmentListPageProps,
  type ShipmentViewKey,
} from "../ui";

function firstRaw(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return String(value[0] ?? fallback);
  return String(value ?? fallback);
}

function buildInitialFilters(rawSearchParams: ShipmentListPageProps["rawSearchParams"], pageSize: number): ShipmentListFiltersValue {
  return {
    q: firstRaw(rawSearchParams.q),
    pageSize: firstRaw(rawSearchParams.pageSize, String(pageSize)),
  };
}

export default function ShipmentListClient({ items, total, page, pageSize, totalPages, rawSearchParams, counts }: ShipmentListPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();

  const currentView = normalizeShipmentView(sp.get("view") || rawSearchParams.view as any);
  const [filters, setFilters] = useState<ShipmentListFiltersValue>(() => buildInitialFilters(rawSearchParams, pageSize));
  const [editShipment, setEditShipment] = useState<ShipmentListItem | null>(null);
  const [feeShipment, setFeeShipment] = useState<ShipmentListItem | null>(null);
  const [receiveReturnShipment, setReceiveReturnShipment] = useState<ShipmentListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const codCount = useMemo(() => items.filter(isCodShipment).length, [items]);

  function navigateWithLoading(patch: Record<string, string | null | undefined>) {
    progress.show({ title: "Đang tải shipment", message: "Hệ thống đang cập nhật danh sách giao hàng." });
    router.push(buildHref(pathname, sp, patch));
    window.setTimeout(() => progress.hide(), 700);
  }

  function setView(view: ShipmentViewKey) {
    navigateWithLoading({ view: view === "all" ? null : view, status: null, page: "1", pageSize: String(pageSize) });
  }

  function applyFilters() {
    navigateWithLoading({ q: filters.q.trim() || null, pageSize: filters.pageSize, page: "1" });
  }

  function clearFilters() {
    setFilters({ q: "", pageSize: String(pageSize) });
    navigateWithLoading({ q: null, pageSize: null, page: "1" });
  }

  async function mutate(input: {
    url: string;
    method?: "POST" | "PATCH";
    body?: unknown;
    progressTitle: string;
    successTitle: string;
    successMessage?: string;
    errorTitle: string;
    after?: () => void;
  }) {
    setSubmitting(true);
    progress.show({ title: input.progressTitle, message: "Hệ thống đang xử lý shipment." });

    try {
      const res = await fetch(input.url, {
        method: input.method ?? "POST",
        headers: { "Content-Type": "application/json" },
        body: input.body ? JSON.stringify(input.body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Không thể cập nhật shipment.");

      notify.success({ title: input.successTitle, message: input.successMessage || json?.message || "Thao tác đã hoàn tất." });
      input.after?.();
      router.refresh();
    } catch (error: any) {
      notify.error({ title: input.errorTitle, message: error?.message || "Có lỗi xảy ra." });
    } finally {
      setSubmitting(false);
      progress.hide();
    }
  }

  async function submitEdit(payload: unknown) {
    if (!editShipment) return;
    await mutate({
      url: `/api/admin/shipments/${editShipment.id}`,
      method: "PATCH",
      body: payload,
      progressTitle: "Đang lưu shipment",
      successTitle: "Đã lưu shipment",
      errorTitle: "Không thể lưu shipment",
      after: () => setEditShipment(null),
    });
  }

  async function submitFee(payload: unknown) {
    if (!feeShipment) return;
    await mutate({
      url: `/api/admin/shipments/${feeShipment.id}/fee`,
      body: payload,
      progressTitle: "Đang cập nhật vận chuyển",
      successTitle: "Đã cập nhật vận chuyển",
      successMessage: "Shipment đã chuyển sang Đang giao. Nếu doanh nghiệp chịu phí ship, payment OUT đã được ghi nhận.",
      errorTitle: "Không thể cập nhật vận chuyển",
      after: () => setFeeShipment(null),
    });
  }

  async function submitReceiveReturn(payload: unknown) {
    if (!receiveReturnShipment) return;
    await mutate({
      url: `/api/admin/shipments/${receiveReturnShipment.id}/receive-return`,
      body: payload,
      progressTitle: "Đang nhận hàng hoàn",
      successTitle: "Đã nhận hàng hoàn",
      successMessage: "Shipment đã kết thúc vòng đời hoàn trả. Order đã chuyển sang nhóm Đã hoàn.",
      errorTitle: "Không thể nhận hàng hoàn",
      after: () => setReceiveReturnShipment(null),
    });
  }

  async function markDelivered(row: ShipmentListItem) {
    const ok = await dialog.confirm({
      tone: "success",
      title: isCodShipment(row) ? "Xác nhận đã giao shipment COD?" : "Xác nhận đã giao hàng?",
      message: isCodShipment(row)
        ? "Đây là shipment COD. Khi hoàn tất, order sẽ nằm ở nhóm Đã giao / còn phải thu. Chỉ bấm Hoàn tất payment COD khi shop thật sự nhận tiền từ đơn vị vận chuyển."
        : "Shipment sẽ chuyển sang Đã giao. Nếu order không còn payment phải thu, đơn hàng có thể hoàn tất.",
      confirmText: isCodShipment(row) ? "Đã giao COD" : "Đã giao",
      cancelText: "Hủy",
    });
    if (!ok) return;

    await mutate({
      url: `/api/admin/shipments/${row.id}/deliver`,
      progressTitle: "Đang xác nhận giao hàng",
      successTitle: "Đã cập nhật giao hàng",
      errorTitle: "Không thể xác nhận giao hàng",
    });
  }

  async function markReturning(row: ShipmentListItem) {
    const ok = await dialog.confirm({
      tone: "danger",
      title: "Xác nhận shipment đang hoàn?",
      message: "Shipment sẽ chuyển sang Đang hoàn. Order chuyển sang nhóm Đang hoàn, watch vẫn được giữ cho order này cho đến khi sale nhận lại hàng và quyết định xử lý tiếp.",
      confirmText: "Chuyển đang hoàn",
      cancelText: "Hủy",
    });
    if (!ok) return;

    await mutate({
      url: `/api/admin/shipments/${row.id}/return`,
      progressTitle: "Đang cập nhật shipment đang hoàn",
      successTitle: "Đã chuyển shipment sang đang hoàn",
      errorTitle: "Không thể chuyển shipment sang đang hoàn",
    });
  }

  return (
    <div className="space-y-5">
      <ShipmentListToolbar total={total} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <ShipmentListViewTabs value={currentView} counts={counts} onChange={setView} />
          </div>
          {codCount > 0 ? (
            <div className="mt-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              {codCount} COD trong trang này
            </div>
          ) : null}
        </div>
        <ShipmentListFilters
          filters={filters}
          onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </div>

      <ShipmentListTable
        items={items}
        total={total}
        page={page}
        totalPages={totalPages}
        pathname={pathname}
        searchParams={sp}
        onEdit={setEditShipment}
        onCreateFee={setFeeShipment}
        onDelivered={markDelivered}
        onReturned={markReturning}
        onReceiveReturn={setReceiveReturnShipment}
      />

      <ShipmentEditModal shipment={editShipment} submitting={submitting} onClose={() => setEditShipment(null)} onSubmit={submitEdit} />
      <ShipmentFeeModal shipment={feeShipment} submitting={submitting} onClose={() => setFeeShipment(null)} onSubmit={submitFee} />
      <ShipmentReturnFeeModal
        shipment={receiveReturnShipment}
        submitting={submitting}
        onClose={() => setReceiveReturnShipment(null)}
        onSubmit={submitReceiveReturn}
      />
    </div>
  );
}
