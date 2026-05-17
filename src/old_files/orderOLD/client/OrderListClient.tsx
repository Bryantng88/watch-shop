// src/domains/order/client/OrderListClient.tsx
"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  OrderListBulkActions,
  OrderListFilters,
  OrderListTable,
  OrderListToolbar,
  OrderListViewTabs,
} from "../ui/list";
import type {
  OrderListCounts,
  OrderListFiltersValue,
  OrderListItem,
  OrderListPageProps,
  OrderViewKey,
} from "../ui/list";
import {
  buildCounts,
  buildHref,
  isOrderSelectable,
  normalizeOrderSort,
  normalizeOrderView,
} from "../ui/list/helpers";

type Props = OrderListPageProps;

function firstRaw(
  value: string | string[] | undefined,
  fallback = "",
): string {
  if (Array.isArray(value)) return String(value[0] ?? fallback);
  return String(value ?? fallback);
}

function buildInitialFilters(input: {
  rawSearchParams: Props["rawSearchParams"];
  pageSize: number;
}): OrderListFiltersValue {
  return {
    q: firstRaw(input.rawSearchParams.q),
    sort: normalizeOrderSort(firstRaw(input.rawSearchParams.sort, "updatedDesc")),
    pageSize: firstRaw(input.rawSearchParams.pageSize, String(input.pageSize)),
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

  const [filters, setFilters] = useState<OrderListFiltersValue>(() =>
    buildInitialFilters({ rawSearchParams, pageSize }),
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const countsByView: OrderListCounts = useMemo(
    () => buildCounts({ counts, currentView, total }),
    [counts, currentView, total],
  );

  const selectableIds = useMemo(
    () => items.filter(isOrderSelectable).map((item) => item.id),
    [items],
  );

  function setView(view: OrderViewKey) {
    setSelectedIds([]);

    progress.show({
      title: "Đang lọc đơn hàng",
      message: "Hệ thống đang tải danh sách theo trạng thái.",
    });

    router.push(
      buildHref(pathname, sp, {
        view: view === "all" ? null : view,
        page: "1",
        pageSize: String(pageSize),
      }),
    );

    window.setTimeout(() => progress.hide(), 700);
  }

  function applyFilters() {
    setSelectedIds([]);

    progress.show({
      title: "Đang lọc đơn hàng",
      message: "Hệ thống đang áp dụng bộ lọc.",
    });

    router.push(
      buildHref(pathname, sp, {
        q: filters.q.trim() || null,
        sort: filters.sort,
        pageSize: filters.pageSize,
        page: "1",
      }),
    );

    window.setTimeout(() => progress.hide(), 700);
  }

  function clearFilters() {
    setSelectedIds([]);
    setFilters({ q: "", sort: "updatedDesc", pageSize: String(pageSize) });

    progress.show({
      title: "Đang xóa lọc",
      message: "Hệ thống đang tải lại danh sách đơn hàng.",
    });

    router.push(
      buildHref(pathname, sp, {
        q: null,
        sort: null,
        pageSize: null,
        page: "1",
      }),
    );

    window.setTimeout(() => progress.hide(), 700);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
    );
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? selectableIds : []);
  }

  async function bulkPost() {
    if (!selectedIds.length) return;

    const ok = await dialog.confirm({
      tone: "warning",
      title: "Duyệt các đơn đã chọn?",
      message: (
        <>
          Sau khi duyệt, watch trong các đơn này sẽ được sync sang trạng thái{" "}
          <b>SOLD</b>.
        </>
      ),
      confirmText: "Duyệt đơn",
    });

    if (!ok) return;

    progress.show({
      title: "Đang duyệt đơn",
      message: "Đang đồng bộ Order → Watch.",
    });

    try {
      const res = await fetch("/api/admin/orders/bulk-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedIds }),
      });

      if (!res.ok) {
        throw new Error(await res.text().catch(() => "Duyệt đơn thất bại"));
      }

      notify.success({
        title: "Đã duyệt đơn",
        message: "Order đã được xử lý và đồng bộ tồn kho watch.",
      });

      setSelectedIds([]);
      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể duyệt đơn",
        message: error?.message || "Thao tác thất bại",
      });
    } finally {
      progress.hide();
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 pt-6 lg:px-6">
      <OrderListToolbar selectedCount={selectedIds.length} />

      <OrderListViewTabs
        currentView={currentView}
        counts={countsByView}
        onViewChange={setView}
      />

      <OrderListFilters
        filters={filters}
        onChange={(patch) =>
          setFilters((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <OrderListBulkActions
        selectedCount={selectedIds.length}
        onBulkPost={bulkPost}
        onClearSelection={() => setSelectedIds([])}
      />

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
        onView={(row: OrderListItem) => {
          progress.show({
            title: "Đang mở đơn hàng",
            message: "Hệ thống đang tải chi tiết đơn.",
          });
          router.push(`/admin/orders/${row.id}`);
          window.setTimeout(() => progress.hide(), 1000);
        }}
        onEdit={(row: OrderListItem) => {
          progress.show({
            title: "Đang mở chỉnh sửa",
            message: "Hệ thống đang tải form đơn hàng.",
          });
          router.push(`/admin/orders/${row.id}/edit`);
          window.setTimeout(() => progress.hide(), 1000);
        }}
      />
    </div>
  );
}
