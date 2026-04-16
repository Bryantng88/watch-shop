"use client";

import * as React from "react";
import { ChevronDown, Filter } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Filters = {
  q: string;
  brandId: string;
  vendorId: string;
  hasContent: string;
  hasImages: string;
  serviceState: string;
  hasSellPrice: string;
  sort: string;
};

type Props = {
  filters: Filters;
  brandOptions: Option[];
  vendorOptions: Option[];
  onChange: (patch: Partial<Filters>) => void;
  onApply: () => void;
  onClear: () => void;
};

const yesNoOptions = (label: string): Option[] => [
  { label, value: "" },
  { label: "Có", value: "yes" },
  { label: "Chưa có", value: "no" },
];

const serviceOptions: Option[] = [
  { label: "Service: tất cả", value: "" },
  { label: "Đã xong", value: "DONE" },
  { label: "Đang xử lý", value: "IN_PROGRESS" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Không cần", value: "NOT_REQUIRED" },
];

const sortOptions: Option[] = [
  { label: "Cập nhật ↓", value: "updatedDesc" },
  { label: "Cập nhật ↑", value: "updatedAsc" },
  { label: "Tạo mới ↓", value: "createdDesc" },
  { label: "Tạo mới ↑", value: "createdAsc" },
  { label: "Tên A-Z", value: "titleAsc" },
  { label: "Tên Z-A", value: "titleDesc" },
];

function Input({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
    />
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
    >
      {options.map((item, idx) => (
        <option key={`${item.value}-${idx}`} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

export default function ProductListFilters({
  filters,
  brandOptions,
  vendorOptions,
  onChange,
  onApply,
  onClear,
}: Props) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const advancedCount =
    Number(Boolean(filters.hasContent)) +
    Number(Boolean(filters.hasImages)) +
    Number(Boolean(filters.serviceState)) +
    Number(Boolean(filters.hasSellPrice));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[280px] flex-1">
          <Input
            value={filters.q}
            placeholder="Tìm theo tên sản phẩm hoặc brand..."
            onChange={(value) => onChange({ q: value })}
          />
        </div>

        <div className="w-[190px] shrink-0">
          <Select
            value={filters.brandId}
            options={[{ label: "Brand: tất cả", value: "" }, ...brandOptions]}
            onChange={(value) => onChange({ brandId: value })}
          />
        </div>

        <div className="w-[190px] shrink-0">
          <Select
            value={filters.vendorId}
            options={[{ label: "Vendor: tất cả", value: "" }, ...vendorOptions]}
            onChange={(value) => onChange({ vendorId: value })}
          />
        </div>

        <div className="w-[180px] shrink-0">
          <Select
            value={filters.sort}
            options={sortOptions}
            onChange={(value) => onChange({ sort: value })}
          />
        </div>

        <button
          type="button"
          onClick={() => setAdvancedOpen((prev) => !prev)}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Filter className="h-4 w-4" />
          <span>Nâng cao</span>
          {advancedCount > 0 ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              {advancedCount}
            </span>
          ) : null}
          <ChevronDown
            className={[
              "h-4 w-4 transition",
              advancedOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Lọc
        </button>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          Xóa lọc
        </button>
      </div>

      {advancedOpen ? (
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            value={filters.hasContent}
            options={yesNoOptions("Content: tất cả")}
            onChange={(value) => onChange({ hasContent: value })}
          />
          <Select
            value={filters.hasImages}
            options={yesNoOptions("Image: tất cả")}
            onChange={(value) => onChange({ hasImages: value })}
          />
          <Select
            value={filters.serviceState}
            options={serviceOptions}
            onChange={(value) => onChange({ serviceState: value })}
          />
          <Select
            value={filters.hasSellPrice}
            options={yesNoOptions("Giá bán: tất cả")}
            onChange={(value) => onChange({ hasSellPrice: value })}
          />
        </div>
      ) : null}
    </div>
  );
}