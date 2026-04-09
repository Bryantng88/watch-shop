"use client";

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
  { label: "Ảnh: tất cả", value: "" },
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
  const hasType = typeOptions.length > 0;
  const hasBrand = brandOptions.length > 0;

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-end gap-3">
        <div className="w-[260px]">
          <Input
            value={filters.q}
            placeholder="Tên / brand..."
            onChange={(value) => onChange({ q: value })}
          />
        </div>

        <div className="w-[180px]">
          <Input
            value={filters.sku}
            placeholder="SKU..."
            onChange={(value) => onChange({ sku: value })}
          />
        </div>

        {hasType ? (
          <div className="w-[180px]">
            <Select
              value={filters.type}
              options={[{ label: "Type: tất cả", value: "" }, ...typeOptions]}
              onChange={(value) => onChange({ type: value })}
            />
          </div>
        ) : null}

        {hasBrand ? (
          <div className="w-[220px]">
            <Select
              value={filters.brandId}
              options={[{ label: "Brand: tất cả", value: "" }, ...brandOptions]}
              onChange={(value) => onChange({ brandId: value })}
            />
          </div>
        ) : null}

        <div className="w-[220px]">
          <Select
            value={filters.vendorId}
            options={[{ label: "Vendor: tất cả", value: "" }, ...vendorOptions]}
            onChange={(value) => onChange({ vendorId: value })}
          />
        </div>

        <div className="w-[170px]">
          <Select
            value={filters.image ?? ""}
            options={imageOptions}
            onChange={(value) => onChange({ image: value })}
          />
        </div>

        <div className="w-[180px]">
          <Select
            value={filters.sort}
            options={sortOptions}
            onChange={(value) => onChange({ sort: value })}
          />
        </div>

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
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Clear
        </button>
      </div>
    </div>
  );
}