"use client";

import * as React from "react";
import { ChevronDown, Filter } from "lucide-react";

type Option = { label: string; value: string };

type Filters = {
    q: string;
    sku: string;
    brandId: string;
    vendorId: string;
    hasContent: string;
    hasImages: string;
    saleStage: string;
    opsStage: string;
    sort: string;
};

const yesNoOptions = (label: string): Option[] => [
    { label, value: "" },
    { label: "Có", value: "yes" },
    { label: "Chưa có", value: "no" },
];

const sortOptions: Option[] = [
    { label: "Cập nhật ↓", value: "updatedDesc" },
    { label: "Cập nhật ↑", value: "updatedAsc" },
    { label: "Tạo mới ↓", value: "createdDesc" },
    { label: "Tạo mới ↑", value: "createdAsc" },
    { label: "Giá tăng dần", value: "priceAsc" },
    { label: "Giá giảm dần", value: "priceDesc" },
    { label: "Tên A-Z", value: "titleAsc" },
    { label: "Tên Z-A", value: "titleDesc" },
];

const saleStageOptions: Option[] = [
    { label: "Sale stage: tất cả", value: "" },
    { label: "Ready", value: "READY" },
    { label: "Hold", value: "HOLD" },
    { label: "Sold", value: "SOLD" },
];

const opsStageOptions: Option[] = [
    { label: "Ops stage: tất cả", value: "" },
    { label: "DONE", value: "DONE" },
    { label: "IN_PROGRESS", value: "IN_PROGRESS" },
    { label: "PENDING", value: "PENDING" },
    { label: "NOT_REQUIRED", value: "NOT_REQUIRED" },
];

function Input({ value, placeholder, onChange }: { value: string; placeholder?: string; onChange: (value: string) => void }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />
    );
}

function Select({ value, options, onChange }: { value: string; options: Option[]; onChange: (value: string) => void }) {
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

export default function WatchListFilters({
    filters,
    brandOptions = [],
    vendorOptions,
    onChange,
    onApply,
    onClear,
}: {
    filters: Filters;
    brandOptions?: Option[];
    vendorOptions: Option[];
    onChange: (patch: Partial<Filters>) => void;
    onApply: () => void;
    onClear: () => void;
}) {
    const [advancedOpen, setAdvancedOpen] = React.useState(false);

    const advancedCount =
        Number(Boolean(filters.sku)) +
        Number(Boolean(filters.hasContent)) +
        Number(Boolean(filters.hasImages)) +
        Number(Boolean(filters.saleStage)) +
        Number(Boolean(filters.opsStage));

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[280px] flex-1">
                    <Input
                        value={filters.q}
                        placeholder="Tìm theo title / brand / model / ref..."
                        onChange={(value) => onChange({ q: value })}
                    />
                </div>

                <div className="w-[170px] shrink-0">
                    <Input value={filters.sku} placeholder="SKU" onChange={(value) => onChange({ sku: value })} />
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
                    <Select value={filters.sort} options={sortOptions} onChange={(value) => onChange({ sort: value })} />
                </div>

                <button
                    type="button"
                    onClick={() => setAdvancedOpen((prev) => !prev)}
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                    <Filter className="h-4 w-4" />
                    <span>Nâng cao</span>
                    {advancedCount > 0 ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{advancedCount}</span> : null}
                    <ChevronDown className={["h-4 w-4 transition", advancedOpen ? "rotate-180" : ""].join(" ")} />
                </button>

                <button type="button" onClick={onApply} className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800">
                    Lọc
                </button>

                <button type="button" onClick={onClear} className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                    Xóa lọc
                </button>
            </div>

            {advancedOpen ? (
                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-2 xl:grid-cols-4">
                    <Select value={filters.hasContent} options={yesNoOptions("Content: tất cả")} onChange={(value) => onChange({ hasContent: value })} />
                    <Select value={filters.hasImages} options={yesNoOptions("Image: tất cả")} onChange={(value) => onChange({ hasImages: value })} />
                    <Select value={filters.saleStage} options={saleStageOptions} onChange={(value) => onChange({ saleStage: value })} />
                    <Select value={filters.opsStage} options={opsStageOptions} onChange={(value) => onChange({ opsStage: value })} />
                </div>
            ) : null}
        </div>
    );
}
