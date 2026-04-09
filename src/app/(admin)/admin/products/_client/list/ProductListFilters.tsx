"use client";

import * as React from "react";
import { ChevronDown, Filter } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Filters = {
  q: string;
  sku: string;
  type: string;
  brandId: string;
  vendorId: string;
  image?: string;
  sort: string;
};

type Props = {
  filters: Filters;
  typeOptions: Option[];
  brandOptions: Option[];
  vendorOptions: Option[];
  onChange: (patch: Partial<Filters>) => void;
  onApply: () => void;
  onClear: () => void;
};

const imageOptions: Option[] = [
  { label: "Tất cả ảnh", value: "" },
  { label: "Có ảnh", value: "yes" },
  { label: "Chưa có ảnh", value: "no" },
];

const sortOptions: Option[] = [
  { label: "Cập nhật ↓", value: "updatedDesc" },
  { label: "Cập nhật ↑", value: "updatedAsc" },
  { label: "Tạo mới ↓", value: "createdDesc" },
  { label: "Tạo mới ↑", value: "createdAsc" },
  { label: "Giá bán ↑", value: "priceAsc" },
  { label: "Giá bán ↓", value: "priceDesc" },
];

function Input({
  value,
  placeholder,
  onChange,
  className = "",
}: {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={[
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400",
        className,
      ].join(" ")}
    />
  );
}

function Select({
  value,
  options,
  onChange,
  className = "",
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400",
        className,
      ].join(" ")}
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
  typeOptions,
  brandOptions,
  vendorOptions,
  onChange,
  onApply,
  onClear,
}: Props) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const hasType = typeOptions.length > 0;
  const hasBrand = brandOptions.length > 0;

  const advancedCount =
    Number(Boolean(filters.sku)) +
    Number(Boolean(filters.type)) +
    Number(Boolean(filters.image));

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

        {hasBrand ? (
          <div className="w-[190px] shrink-0">
            <Select
              value={filters.brandId}
              options={[{ label: "Brand: tất cả", value: "" }, ...brandOptions]}
              onChange={(value) => onChange({ brandId: value })}
            />
          </div>
        ) : null}

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
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                SKU
              </div>
              <Input
                value={filters.sku}
                placeholder="SKU..."
                onChange={(value) => onChange({ sku: value })}
              />
            </div>

            {hasType ? (
              <div>
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Type
                </div>
                <Select
                  value={filters.type}
                  options={[{ label: "Tất cả type", value: "" }, ...typeOptions]}
                  onChange={(value) => onChange({ type: value })}
                />
              </div>
            ) : null}

            <div>
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Ảnh
              </div>
              <Select
                value={filters.image ?? ""}
                options={imageOptions}
                onChange={(value) => onChange({ image: value })}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}