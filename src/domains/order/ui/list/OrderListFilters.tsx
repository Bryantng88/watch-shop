"use client";

import { BusinessListFilterBar } from "@/domains/shared/ui/business-list";
import type { FilterBarField } from "@/domains/shared/ui/filter-bar";
import type {
  OrderListCounts,
  OrderListFiltersValue,
  OrderProcessingSubFilter,
} from "./types";
import { ORDER_PAGE_SIZE_OPTIONS, ORDER_SORT_OPTIONS } from "./helpers";

export default function OrderListFilters({
  filters,
  counts,
  total,
  visibleCount,
  onChange,
  onApply,
  onClear,
}: {
  filters: OrderListFiltersValue;
  counts: OrderListCounts;
  total: number;
  visibleCount: number;
  onChange: (patch: Partial<OrderListFiltersValue>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const viewField: FilterBarField = {
    key: "view",
    label: "Trạng thái",
    type: "select",
    defaultValue: "all",
    options: [
      { value: "all", label: `Tất cả · ${counts.all ?? 0}` },
      { value: "pending", label: `Chờ xác minh · ${counts.pending ?? 0}` },
      { value: "need_action", label: `Cần xử lý · ${counts.need_action ?? 0}` },
      { value: "processing", label: `Đang xử lý · ${counts.processing ?? 0}` },
      { value: "returning", label: `Đang hoàn · ${counts.returning ?? 0}` },
      { value: "completed", label: `Hoàn tất · ${counts.completed ?? 0}` },
      { value: "returned", label: `Đã hoàn · ${counts.returned ?? 0}` },
      { value: "cancelled", label: `Đã hủy · ${counts.cancelled ?? 0}` },
    ],
  };
  const subFilterField: FilterBarField = {
    key: "subFilter",
    label: "Tiến độ xử lý",
    type: "select",
    defaultValue: "",
    options: [
      { value: "", label: "Tiến độ: Tất cả" },
      { value: "awaiting_payment", label: `Chờ thanh toán · ${counts.processingSub?.awaiting_payment ?? 0}` },
      { value: "remaining_payment", label: `Còn phải thu · ${counts.processingSub?.remaining_payment ?? 0}` },
      { value: "awaiting_shipment", label: `Chờ giao · ${counts.processingSub?.awaiting_shipment ?? 0}` },
      { value: "shipping", label: `Đang giao · ${counts.processingSub?.shipping ?? 0}` },
      { value: "delivered_remaining", label: `Đã giao, còn phải thu · ${counts.processingSub?.delivered_remaining ?? 0}` },
    ],
  };
  const sortField: FilterBarField = {
    key: "sort",
    label: "Sắp xếp",
    type: "select",
    defaultValue: "updatedDesc",
    options: ORDER_SORT_OPTIONS.map((option) => ({
      value: String(option.value),
      label: String(option.label),
    })),
  };
  const advancedFields: FilterBarField[] = [{
    key: "pageSize",
    label: "Số dòng mỗi trang",
    type: "select",
    defaultValue: "20",
    options: ORDER_PAGE_SIZE_OPTIONS.map((option) => ({
      value: String(option.value),
      label: String(option.label),
    })),
  }];

  return (
    <BusinessListFilterBar
      values={filters}
      total={total}
      visibleCount={visibleCount}
      search={{ key: "q", placeholder: "Tìm mã đơn, khách hàng, số điện thoại..." }}
      primaryFields={[viewField, subFilterField]}
      advancedFields={advancedFields}
      sortField={sortField}
      onChange={(patch) => {
        const next = patch as Partial<OrderListFiltersValue>;
        if (next.view && next.view !== "processing") next.subFilter = "";
        onChange(next);
      }}
      onApply={onApply}
      onClearField={(key) => {
        if (key === "view") onChange({ view: "all", subFilter: "" });
        else if (key === "subFilter") onChange({ subFilter: "" as OrderProcessingSubFilter });
        else if (key === "sort") onChange({ sort: "updatedDesc" });
        else if (key === "pageSize") onChange({ pageSize: "20" });
        else onChange({ [key]: "" } as Partial<OrderListFiltersValue>);
      }}
      onClearAll={onClear}
    />
  );
}
