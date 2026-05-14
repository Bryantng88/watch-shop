"use client";

import { Search } from "lucide-react";

import { Button, Input, Select } from "@/domains/shared/ui/form/fields";
import type { OrderListFiltersValue } from "./types";
import { ORDER_PAGE_SIZE_OPTIONS, ORDER_SORT_OPTIONS } from "./helpers";

type Props = {
    filters: OrderListFiltersValue;
    onChange: (patch: Partial<OrderListFiltersValue>) => void;
    onApply: () => void;
    onClear: () => void;
};

export default function OrderListFilters({
    filters,
    onChange,
    onApply,
    onClear,
}: Props) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_160px_auto_auto] lg:items-center">
                <label className="relative block">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={filters.q}
                        onChange={(event) => onChange({ q: event.target.value })}
                        placeholder="Tìm RefNo, tên khách, số điện thoại..."
                        className="h-11 rounded-2xl pl-11"
                    />
                </label>

                <Select
                    value={filters.sort}
                    onChange={(event) => onChange({ sort: event.target.value as any })}
                    options={ORDER_SORT_OPTIONS}
                />

                <Select
                    value={filters.pageSize}
                    onChange={(event) => onChange({ pageSize: event.target.value })}
                    options={ORDER_PAGE_SIZE_OPTIONS}
                />

                <Button type="button" onClick={onApply}>
                    Lọc
                </Button>

                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                    Xóa lọc
                </button>
            </div>
        </div>
    );
}
