"use client";

import SectionCard from "@/components/_shared/SectionCard";

type Option = { label: string; value: string };

type FilterState = {
  q: string;
  sku: string;
  type: string;
  brandId: string;
  vendorId: string;
  image: string;
  sort: string;
};

export default function ProductListFilters({
  filters,
  typeOptions,
  brandOptions,
  vendorOptions,
  onChange,
  onApply,
  onClear,
}: {
  filters: FilterState;
  typeOptions: Option[];
  brandOptions: Option[];
  vendorOptions: Option[];
  onChange: (patch: Partial<FilterState>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <SectionCard title="Bộ lọc" contentClassName="p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Field label="Tìm kiếm">
          <input value={filters.q} onChange={(e) => onChange({ q: e.target.value })} placeholder="Tên / brand..." className={inputCls} />
        </Field>
        <Field label="SKU">
          <input value={filters.sku} onChange={(e) => onChange({ sku: e.target.value })} placeholder="SKU..." className={inputCls} />
        </Field>
        <Field label="Type">
          <select value={filters.type} onChange={(e) => onChange({ type: e.target.value })} className={inputCls}>
            <option value="">(All)</option>
            {typeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Brand">
          <select value={filters.brandId} onChange={(e) => onChange({ brandId: e.target.value })} className={inputCls}>
            <option value="">(All)</option>
            {brandOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Vendor">
          <select value={filters.vendorId} onChange={(e) => onChange({ vendorId: e.target.value })} className={inputCls}>
            <option value="">(All)</option>
            {vendorOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Sắp xếp">
          <select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} className={inputCls}>
            <option value="updated_desc">Cập nhật ↓</option>
            <option value="updated_asc">Cập nhật ↑</option>
            <option value="created_desc">Tạo mới ↓</option>
            <option value="created_asc">Tạo mới ↑</option>
          </select>
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={onApply} className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">Lọc</button>
        <button type="button" onClick={onClear} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear</button>
      </div>
    </SectionCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      {children}
    </label>
  );
}

const inputCls = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400";
