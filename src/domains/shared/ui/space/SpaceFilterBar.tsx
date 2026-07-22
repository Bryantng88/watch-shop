"use client";

import type { ReactNode } from "react";
import { CalendarDays, ChevronDown, Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

export type SpaceFilterOption = {
  label: string;
  value: string;
};

export type SpaceViewOption = SpaceFilterOption & {
  icon?: ReactNode;
  disabled?: boolean;
};

export function SpaceViewSwitch({
  activeView,
  options,
  onChange,
}: {
  activeView?: string;
  options: SpaceViewOption[];
  onChange?: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange?.(option.value)}
          disabled={option.disabled}
          className={cn(
            "inline-flex h-8 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition",
            activeView === option.value
              ? "bg-violet-50 text-violet-700"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
            option.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export type SpaceSelectFilter = {
  key: string;
  label: string;
  value: string;
  options: SpaceFilterOption[];
  onChange: (value: string) => void;
};

export default function SpaceFilterBar({
  weekValue,
  weekOptions,
  dateValue,
  activeView,
  searchValue = "",
  searchPlaceholder = "Tìm kiếm Workspace...",
  selectFilters = [],
  viewOptions = [],
  onWeekChange,
  onDateChange,
  onViewChange,
  onSearchChange,
  children,
  frameless = false,
}: {
  weekValue: string;
  weekOptions: SpaceFilterOption[];
  dateValue: string;
  activeView?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  selectFilters?: SpaceSelectFilter[];
  viewOptions?: SpaceViewOption[];
  onWeekChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onViewChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  children?: ReactNode;
  frameless?: boolean;
}) {
  const activeFilterCount = selectFilters.filter(
    (filter) => filter.value !== filter.options[0]?.value,
  ).length;
  const activeWeekLabel =
    weekOptions.find((option) => option.value === weekValue)?.label ?? "Chọn thời gian";

  return (
    <div className={cn(
      "rounded-xl bg-white",
      frameless
        ? "border-0 p-0 shadow-none"
        : "border border-slate-200 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.025)]",
    )}>
      <div className="flex flex-wrap items-center gap-2">
        <details className="group relative shrink-0">
          <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span className="max-w-[130px] truncate">{activeWeekLabel}</span>
            <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
          </summary>
          <div className="absolute left-0 top-full z-40 mt-2 w-[300px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <label className="block text-xs font-semibold text-slate-600">
              Chọn tuần
              <select
                value={weekValue}
                onChange={(event) => onWeekChange(event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-300"
                aria-label="Chọn tuần"
              >
                {weekOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <div className="my-3 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="h-px flex-1 bg-slate-100" />
              hoặc chọn ngày tham chiếu
              <span className="h-px flex-1 bg-slate-100" />
            </div>
            <input
              type="date"
              value={dateValue}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-300"
              aria-label="Chọn ngày"
            />
          </div>
        </details>

        {onSearchChange ? (
          <label className="flex h-11 min-w-[220px] flex-1 basis-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-slate-400">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        ) : null}

        {selectFilters.length ? (
          <details className="group relative shrink-0">
            <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              Bộ lọc
              {activeFilterCount ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-100 px-1 text-[11px] font-bold text-violet-700">
                  {activeFilterCount}
                </span>
              ) : null}
              <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full z-40 mt-2 w-[320px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">Bộ lọc</div>
                {activeFilterCount ? (
                  <button
                    type="button"
                    onClick={() => selectFilters.forEach((filter) => filter.onChange(filter.options[0]?.value ?? ""))}
                    className="text-xs font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Xóa bộ lọc
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3">
                {selectFilters.map((filter) => (
                  <label key={filter.key} className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    {filter.label}
                    <select
                      value={filter.value}
                      onChange={(event) => filter.onChange(event.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-300"
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          </details>
        ) : null}

        {children}

        {viewOptions.length ? (
          <div className="shrink-0 border-l border-slate-200 pl-2">
            <SpaceViewSwitch activeView={activeView} options={viewOptions} onChange={onViewChange} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
