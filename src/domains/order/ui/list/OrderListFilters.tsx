"use client";

import { BusinessListFilterBar } from "@/domains/shared/ui/business-list";
import type { FilterBarField } from "@/domains/shared/ui/filter-bar";
import type {
  OrderListCounts,
  OrderListFiltersValue,
  OrderProcessingSubFilter,
  OrderPaymentTypeFilter,
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
  const paymentTypeField: FilterBarField = {
    key: "paymentType",
    label: "Hình thức thanh toán",
    type: "select",
    defaultValue: "",
    options: [
      { value: "", label: "Hình thức: Tất cả" },
      { value: "full", label: `Thanh toán full · ${counts.paymentType?.full ?? 0}` },
      { value: "cod", label: `COD · ${counts.paymentType?.cod ?? 0}` },
      { value: "deposit", label: `Đặt cọc · ${counts.paymentType?.deposit ?? 0}` },
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
  const advancedFields: FilterBarField[] = [subFilterField, {
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
      primaryFields={[paymentTypeField]}
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
        else if (key === "paymentType") onChange({ paymentType: "" as OrderPaymentTypeFilter });
        else if (key === "sort") onChange({ sort: "updatedDesc" });
        else if (key === "pageSize") onChange({ pageSize: "20" });
        else onChange({ [key]: "" } as Partial<OrderListFiltersValue>);
      }}
      onClearAll={onClear}
    />
  );
}
