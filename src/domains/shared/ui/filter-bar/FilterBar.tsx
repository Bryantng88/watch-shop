"use client";

import { useState } from "react";
import { Bookmark, Filter, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import type {
    FilterBarField,
    FilterBarSearch,
    FilterBarValues,
} from "./filter-bar.types";

function valueOf(values: FilterBarValues, key: string) {
    return String(values[key] ?? "");
}

function labelFor(field: FilterBarField, value: string) {
    if (field.type === "text") return value;
    return field.options?.find((option) => option.value === value)?.label ?? value;
}

function activeFieldValue(field: FilterBarField, values: FilterBarValues) {
    const value = valueOf(values, field.key);
    const defaultValue = field.defaultValue ?? "";
    return value && value !== defaultValue ? value : "";
}

function SelectField({
    field,
    value,
    onChange,
}: {
    field: FilterBarField;
    value: string;
    onChange: (value: string) => void;
}) {
    const options = field.options ?? [];

    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
        >
            {options.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function TextField({
    field,
    value,
    onChange,
    onApply,
}: {
    field: FilterBarField;
    value: string;
    onChange: (value: string) => void;
    onApply: () => void;
}) {
    return (
        <input
            value={value}
            inputMode={field.inputMode}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
                if (event.key === "Enter") onApply();
            }}
            placeholder={field.placeholder ?? field.label}
            className="h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />
    );
}

function FilterFieldControl({
    field,
    value,
    onChange,
    onApply,
}: {
    field: FilterBarField;
    value: string;
    onChange: (value: string) => void;
    onApply: () => void;
}) {
    if (field.type === "text") {
        return (
            <TextField
                field={field}
                value={value}
                onChange={onChange}
                onApply={onApply}
            />
        );
    }

    return (
        <SelectField
            field={field}
            value={value}
            onChange={onChange}
        />
    );
}

export default function FilterBar({
    values,
    total,
    visibleCount,
    search,
    primaryFields,
    advancedFields = [],
    sortField,
    onChange,
    onApply,
    onClearField,
    onClearAll,
    onSaveView,
}: {
    values: FilterBarValues;
    total?: number;
    visibleCount?: number;
    search?: FilterBarSearch;
    primaryFields: FilterBarField[];
    advancedFields?: FilterBarField[];
    sortField?: FilterBarField;
    onChange: (patch: FilterBarValues) => void;
    onApply: () => void;
    onClearField: (key: string) => void;
    onClearAll: () => void;
    onSaveView?: () => void;
}) {
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const activeFields = [...primaryFields, ...advancedFields].filter((field) =>
        activeFieldValue(field, values),
    );
    const activeCount = activeFields.length;

    return (
        <div className="rounded-t-xl border border-b-0 border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
            <div className="hidden">
                <div className="text-sm font-semibold text-slate-900">
                    {typeof total === "number" ? (
                        <>
                            Tổng <span className="text-blue-600">{total}</span> watch
                            {typeof visibleCount === "number" ? (
                                <span className="ml-2 text-xs font-medium text-slate-400">
                                    Hiển thị {visibleCount}
                                </span>
                            ) : null}
                        </>
                    ) : (
                        "Bộ lọc"
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(280px,1fr)_repeat(2,minmax(170px,220px))_minmax(190px,240px)_auto_auto_auto] xl:items-center">
                {search ? (
                    <label className="relative block min-w-0">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={valueOf(values, search.key)}
                            onChange={(event) => onChange({ [search.key]: event.target.value })}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") onApply();
                            }}
                            placeholder={search.placeholder}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                        />
                    </label>
                ) : null}

                {primaryFields.map((field) => (
                    <FilterFieldControl
                        key={field.key}
                        field={field}
                        value={valueOf(values, field.key)}
                        onChange={(value) => onChange({ [field.key]: value })}
                        onApply={onApply}
                    />
                ))}

                {sortField ? (
                    <FilterFieldControl
                        field={sortField}
                        value={valueOf(values, sortField.key)}
                        onChange={(value) => onChange({ [sortField.key]: value })}
                        onApply={onApply}
                    />
                ) : null}

                <button
                    type="button"
                    onClick={onApply}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Lọc
                </button>

                <button
                    type="button"
                    onClick={() => setAdvancedOpen((current) => !current)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                    <Filter className="h-4 w-4" />
                    Bộ lọc
                    {activeCount ? (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-[11px] text-white">
                            {activeCount}
                        </span>
                    ) : null}
                </button>

                <button
                    type="button"
                    onClick={onSaveView}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                    <Bookmark className="h-4 w-4" />
                    Lưu view
                </button>
            </div>

            {advancedOpen ? (
                <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 md:grid-cols-2 xl:grid-cols-4">
                    {advancedFields.map((field) => (
                        <label key={field.key} className="flex min-w-0 flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-500">
                                {field.label}
                            </span>
                            <FilterFieldControl
                                field={field}
                                value={valueOf(values, field.key)}
                                onChange={(value) => onChange({ [field.key]: value })}
                                onApply={onApply}
                            />
                        </label>
                    ))}
                    <button
                        type="button"
                        onClick={onApply}
                        className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Áp dụng
                    </button>
                </div>
            ) : null}

            {activeFields.length ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="mr-1 text-slate-500">Bộ lọc đang áp dụng</span>
                    {activeFields.map((field) => {
                        const value = activeFieldValue(field, values);
                        return (
                            <button
                                key={field.key}
                                type="button"
                                onClick={() => onClearField(field.key)}
                                className="inline-flex h-8 items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:border-indigo-200"
                            >
                                {field.label}: {labelFor(field, value)}
                                <X className="h-3.5 w-3.5" />
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="inline-flex h-8 items-center gap-1 rounded-xl px-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Xóa tất cả
                    </button>
                </div>
            ) : null}
        </div>
    );
}
