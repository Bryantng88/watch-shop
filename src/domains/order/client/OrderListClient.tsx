"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import PaymentManageModal from "@/domains/payment/ui/PaymentManageModal";
import { ShipmentManageModal } from "@/domains/shipment/ui";

import {
  OrderListBulkActions,
  OrderListFilters,
  OrderListSubFilters,
  OrderListTable,
  OrderListToolbar,
  OrderListViewTabs,
} from "../ui/list";
import type {
  OrderListCounts,
  OrderListFiltersValue,
  OrderListItem,
  OrderListPageProps,
  OrderProcessingSubFilter,
  OrderViewKey,
} from "../ui/list";
import {
  buildCounts,
  buildHref,
  isOrderSelectable,
  normalizeOrderProcessingSubFilter,
  normalizeOrderSort,
  normalizeOrderView,
} from "../ui/list/helpers";

type Props = OrderListPageProps;

function firstRaw(value: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(value)) return String(value[0] ?? fallback);
  return String(value ?? fallback);
}

function buildInitialFilters(input: { rawSearchParams: Props["rawSearchParams"]; pageSize: number }): OrderListFiltersValue {
  return {
    q: firstRaw(input.rawSearchParams.q),
    sort: normalizeOrderSort(firstRaw(input.rawSearchParams.sort, "updatedDesc")),
    pageSize: firstRaw(input.rawSearchParams.pageSize, String(input.pageSize)),
  };
}

function isCancelledOrder(status?: string | null) {
  const normalized = String(status ?? "").toUpperCase();
  return normalized === "CANCELLED" || normalized === "CANCELED";
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function toPaymentManageOrder(order: OrderListItem | null) {
  if (!order) return null;

  return {
    ...order,
    totalAmount: toNumber(order.totalAmount),
    remainingAmount: toNumber(order.remainingAmount),
    paidAmount: toNumber(order.paidAmount),
    collectedAmount: toNumber(order.collectedAmount),
    unpaidPaymentAmount: toNumber(order.unpaidPaymentAmount),
  };
}

export default function OrderListClient({
  items,
  total,
  page,
  pageSize,
  totalPages,
  rawSearchParams,
  counts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const currentView = normalizeOrderView(sp.get("view"));
  const currentSubFilter = normalizeOrderProcessingSubFilter(sp.get("subFilter"));

  const [filters, setFilters] = useState<OrderListFiltersValue>(() => buildInitialFilters({ rawSearchParams, pageSize }));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paymentManageOrder, setPaymentManageOrder] = useState<OrderListItem | null>(null);
  const [shipmentManageOrder, setShipmentManageOrder] = useState<OrderListItem | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const paymentManageOrderForModal = useMemo(
    () => toPaymentManageOrder(paymentManageOrder),
    [paymentManageOrder],
  );

  const countsByView: OrderListCounts = useMemo(
    () => buildCounts({ counts, currentView, total }),
    [counts, currentView, total],
  );

  const selectableIds = useMemo(() => items.filter(isOrderSelectable).map((item) => item.id), [items]);

  function navigateWithLoading(patch: Record<string, string | null | undefined>) {
    progress.show({ title: "Đang tải đơn hàng", message: "Hệ thống đang cập nhật danh sách." });
    router.push(buildHref(pathname, sp, patch));
    window.setTimeout(() => progress.hide(), 700);
  }

  function setView(view: OrderViewKey) {
    setSelectedIds([]);
    navigateWithLoading({
      view: view === "all" ? null : view,
      subFilter: null,
      page: "1",
      pageSize: String(pageSize),
    });
  }

  function setSubFilter(subFilter: OrderProcessingSubFilter) {
    setSelectedIds([]);
    navigateWithLoading({
      view: "processing",
      subFilter: subFilter || null,
      page: "1",
      pageSize: String(pageSize),
    });
  }

  function applyFilters() {
    setSelectedIds([]);
    navigateWithLoading({
      q: filters.q.trim() || null,
      sort: filters.sort,
      pageSize: filters.pageSize,
      page: "1",
    });
  }

  function clearFilters() {
    setSelectedIds([]);
    setFilters({ q: "", sort: "updatedDesc", pageSize: String(pageSize) });
    navigateWithLoading({ q: null, sort: null, pageSize: null, page: "1" });
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id)));
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? selectableIds : []);
  }

  async function runOrderAction(input: {
    row: OrderListItem;
    action: "post" | "mark-shipment-delivered" | "cancel" | "finalize-by-paid";
    title: string;
    message: string;
    confirmText: string;
    tone?: "warning" | "danger" | "success";
  }) {
    const ok = await dialog.confirm({
      title: input.title,
      message: input.message,
      confirmText: input.confirmText,
      cancelText: "Hủy",
      tone: input.tone ?? "warning",
    });

    if (!ok) return;

    progress.show({
      title: input.title,
      message: "Hệ thống đang cập nhật đơn hàng.",
    });

    try {
      const res = await fetch(`/api/admin/orders/${input.row.id}/${input.action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Không thể cập nhật đơn hàng.");

      notify.success({
        title: "Đã cập nhật đơn hàng",
        message: json?.message || "Thao tác đã hoàn tất.",
      });

      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể cập nhật đơn hàng",
        message: error?.message || "Có lỗi xảy ra.",
      });
    } finally {
      progress.hide();
    }
  }

  function handlePost(row: OrderListItem) {
    return runOrderAction({
      row,
      action: "post",
      title: "Post đơn hàng?",
      message: "Đơn hàng sẽ bắt đầu vận hành. Hệ thống sẽ tạo payment, shipment và chuyển watch sang HOLD nếu có.",
      confirmText: "Post đơn",
      tone: "success",
    });
  }

  async function cancelPayment(payload: { paymentId: string; note?: string | null }) {
    if (isCancelledOrder(paymentManageOrder?.status)) {
      notify.error({
        title: "Đơn hàng đã hủy",
        message: "Không thể thao tác payment trên đơn hàng đã hủy.",
      });
      return;
    }

    setPaymentSubmitting(true);
    progress.show({
      title: "Đang hủy payment",
      message: "Payment domain đang hủy khoản thanh toán đang mở.",
    });

    try {
      const res = await fetch(`/api/admin/payments/${payload.paymentId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Hủy payment thất bại.");

      notify.success({
        title: "Đã hủy payment",
        message: "Order đã được tính lại trạng thái thanh toán.",
      });

      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể hủy payment",
        message: error?.message || "Thao tác thất bại.",
      });
      throw error;
    } finally {
      progress.hide();
      setPaymentSubmitting(false);
    }
  }

  function handleMarkPaymentPaid(row: OrderListItem) {
    if (isCancelledOrder(row.status)) return;
    setPaymentManageOrder(row);
  }

  function handleMarkShipmentDelivered(row: OrderListItem) {
    return runOrderAction({
      row,
      action: "mark-shipment-delivered",
      title: "Đánh dấu đã giao hàng?",
      message:
        "Shipment sẽ được đánh dấu đã giao. Nếu đơn có COD, payment COD sẽ chuyển sang trạng thái đã thu bởi đơn vị vận chuyển / chờ đối soát. Shop vẫn cần bấm Hoàn tất payment khi thật sự nhận tiền.",
      confirmText: "Đã giao",
      tone: "success",
    });
  }

  function handleCancel(row: OrderListItem) {
    return runOrderAction({
      row,
      action: "cancel",
      title: "Hủy đơn hàng?",
      message: "Đơn hàng sẽ bị hủy. Nếu watch đang HOLD bởi đơn này, hệ thống sẽ trả watch về trạng thái trước đó.",
      confirmText: "Hủy đơn",
      tone: "danger",
    });
  }
  async function postOrders(orderIds: string[]) {
    if (!orderIds.length) return;

    const ok = await dialog.confirm({
      tone: "warning",
      title: orderIds.length > 1 ? "Post các đơn đã chọn?" : "Post đơn hàng?",
      message: "Khi post, hệ thống sẽ tạo payment/shipment vận hành và chuyển watch liên quan sang HOLD.",
      confirmText: "Post đơn",
    });

    if (!ok) return;

    progress.show({ title: "Đang post đơn", message: "Đang tạo payment/shipment và đồng bộ watch." });

    try {
      const res = await fetch(orderIds.length > 1 ? "/api/admin/orders/bulk-post" : `/api/admin/orders/${orderIds[0]}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: orderIds.length > 1 ? JSON.stringify({ orderIds }) : undefined,
      });

      if (!res.ok) throw new Error(await res.text().catch(() => "Post đơn thất bại"));

      notify.success({ title: "Đã post đơn", message: "Order đã vào luồng vận hành." });
      setSelectedIds([]);
      router.refresh();
    } catch (error: any) {
      notify.error({ title: "Không thể post đơn", message: error?.message || "Thao tác thất bại" });
    } finally {
      progress.hide();
    }
  }

  async function createPayment(payload: {
    ownerType: "ORDER";
    ownerId: string;
    amount: number;
    method: string;
    note?: string | null;
    markPaidNow: boolean;
  }) {
    if (isCancelledOrder(paymentManageOrder?.status)) {
      notify.error({
        title: "Đơn hàng đã hủy",
        message: "Không thể tạo payment cho đơn hàng đã hủy.",
      });
      return;
    }

    setPaymentSubmitting(true);
    progress.show({ title: "Đang tạo payment", message: "Payment domain đang ghi nhận khoản cần thu." });

    try {
      const res = await fetch(`/api/admin/orders/${payload.ownerId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Tạo payment thất bại.");

      notify.success({
        title: payload.markPaidNow ? "Đã tạo và hoàn tất payment" : "Đã tạo payment",
        message: "Danh sách đơn hàng sẽ được cập nhật.",
      });

      // Keep the manage modal open so user can continue tracking/finishing other payments.
      router.refresh();
    } catch (error: any) {
      notify.error({ title: "Không thể tạo payment", message: error?.message || "Thao tác thất bại." });
      throw error;
    } finally {
      progress.hide();
      setPaymentSubmitting(false);
    }
  }

  async function finalizeOrderByPaidAmount(payload: { orderId: string; note?: string | null }) {
    if (isCancelledOrder(paymentManageOrder?.status)) {
      notify.error({
        title: "Đơn hàng đã hủy",
        message: "Không thể chốt đơn hàng đã hủy.",
      });
      return;
    }

    const ok = await dialog.confirm({
      title: "Chốt đơn theo tiền đã nhận?",
      message:
        "Hệ thống sẽ cập nhật tổng order bằng tổng payment ORDER đã nhận, hủy các payment ORDER còn mở và hoàn tất order. Chỉ dùng khi giá chốt nhập sai nhưng tiền đã nhận là đúng.",
      confirmText: "Chốt đơn",
      cancelText: "Hủy",
      tone: "warning",
    });

    if (!ok) return;

    setPaymentSubmitting(true);
    progress.show({
      title: "Đang chốt order",
      message: "Hệ thống đang đồng bộ tổng tiền, payment và trạng thái order.",
    });

    try {
      const res = await fetch(`/api/admin/orders/${payload.orderId}/finalize-by-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Chốt order thất bại.");

      notify.success({
        title: "Đã chốt order",
        message: "Order đã được hoàn tất theo số tiền đã nhận.",
      });

      setPaymentManageOrder(null);
      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể chốt order",
        message: error?.message || "Thao tác thất bại.",
      });
      throw error;
    } finally {
      progress.hide();
      setPaymentSubmitting(false);
    }
  }

  async function completePayment(payload: { paymentId: string; reference?: string | null; note?: string | null }) {
    if (isCancelledOrder(paymentManageOrder?.status)) {
      notify.error({
        title: "Đơn hàng đã hủy",
        message: "Không thể hoàn tất payment trên đơn hàng đã hủy.",
      });
      return;
    }

    setPaymentSubmitting(true);
    progress.show({ title: "Đang hoàn tất payment", message: "Payment domain đang xác nhận shop đã nhận tiền." });

    try {
      const res = await fetch(`/api/admin/payments/${payload.paymentId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Hoàn tất payment thất bại.");

      notify.success({ title: "Đã hoàn tất payment", message: "Order đã được tính lại trạng thái thanh toán." });
      // Keep the manage modal open so user can continue tracking/finishing other payments.
      router.refresh();
    } catch (error: any) {
      notify.error({ title: "Không thể hoàn tất payment", message: error?.message || "Thao tác thất bại." });
      throw error;
    } finally {
      progress.hide();
      setPaymentSubmitting(false);
    }
  }

  function handleView(row: OrderListItem) {
    router.push(`/admin/orders/${row.id}`);
  }

  function handleEdit(row: OrderListItem) {
    if (isCancelledOrder(row.status)) {
      notify.error({
        title: "Đơn hàng đã hủy",
        message: "Không thể chỉnh sửa đơn hàng đã hủy.",
      });
      return;
    }

    router.push(`/admin/orders/${row.id}/edit`);
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <OrderListToolbar selectedCount={selectedIds.length} />

      <OrderListViewTabs currentView={currentView} counts={countsByView} onViewChange={setView} />

      <OrderListSubFilters
        currentView={currentView}
        currentSubFilter={currentSubFilter}
        counts={countsByView}
        onChange={setSubFilter}
      />

      <OrderListFilters
        filters={filters}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <OrderListBulkActions selectedCount={selectedIds.length} onBulkPost={() => postOrders(selectedIds)} onClearSelection={() => setSelectedIds([])} />

      <OrderListTable
        items={items}
        total={total}
        page={page}
        totalPages={totalPages}
        pathname={pathname}
        searchParams={sp}
        selectedIds={selectedIds}
        onToggleOne={toggleOne}
        onToggleAll={toggleAll}
        onView={handleView}
        onEdit={handleEdit}
        onPost={handlePost}
        onMarkShipmentDelivered={handleMarkShipmentDelivered}
        onCancel={handleCancel}
        onManagePayments={(row) => {
          if (isCancelledOrder(row.status)) return;
          setPaymentManageOrder(row);
        }}
        onManageShipment={(row) => {
          if (isCancelledOrder(row.status)) return;
          setShipmentManageOrder(row);
        }}
        isCancelledOrder={isCancelledOrder}
      />

      <ShipmentManageModal
        open={!!shipmentManageOrder}
        order={shipmentManageOrder}
        onClose={() => setShipmentManageOrder(null)}
        onUpdated={() => router.refresh()}
      />

      <PaymentManageModal
        open={!!paymentManageOrder}
        order={paymentManageOrderForModal}
        submitting={paymentSubmitting}
        onClose={() => setPaymentManageOrder(null)}
        onCreatePayment={createPayment}
        onCompletePayment={completePayment}
        onCancelPayment={cancelPayment}
        onFinalizeByPaidAmount={finalizeOrderByPaidAmount}
        onUpdated={() => router.refresh()}
      />
    </div>
  );
}
