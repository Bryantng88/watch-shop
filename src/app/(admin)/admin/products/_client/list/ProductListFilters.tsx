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
  { label: "(All)", value: "" },
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
      {children}
    </label>
  );
}

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
      {options.map((item) => (
        <option key={item.value || "__empty"} value={item.value}>
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
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div>
          <FieldLabel>Tìm kiếm</FieldLabel>
          <Input
            value={filters.q}
            placeholder="Tên / brand..."
            onChange={(value) => onChange({ q: value })}
          />
        </div>

        <div>
          <FieldLabel>SKU</FieldLabel>
          <Input
            value={filters.sku}
            placeholder="SKU..."
            onChange={(value) => onChange({ sku: value })}
          />
        </div>

        {hasType ? (
          <div>
            <FieldLabel>Type</FieldLabel>
            <Select
              value={filters.type}
              options={[{ label: "(All)", value: "" }, ...typeOptions]}
              onChange={(value) => onChange({ type: value })}
            />
          </div>
        ) : null}

        {hasBrand ? (
          <div>
            <FieldLabel>Brand</FieldLabel>
            <Select
              value={filters.brandId}
              options={[{ label: "(All)", value: "" }, ...brandOptions]}
              onChange={(value) => onChange({ brandId: value })}
            />
          </div>
        ) : null}

        <div>
          <FieldLabel>Vendor</FieldLabel>
          <Select
            value={filters.vendorId}
            options={[{ label: "(All)", value: "" }, ...vendorOptions]}
            onChange={(value) => onChange({ vendorId: value })}
          />
        </div>

        <div>
          <FieldLabel>Sắp xếp</FieldLabel>
          <Select
            value={filters.sort}
            options={sortOptions}
            onChange={(value) => onChange({ sort: value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <div className="md:col-span-1 xl:col-span-1">
          <FieldLabel>Image</FieldLabel>
          <Select
            value={filters.image ?? ""}
            options={imageOptions}
            onChange={(value) => onChange({ image: value })}
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-2">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Lọc
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}