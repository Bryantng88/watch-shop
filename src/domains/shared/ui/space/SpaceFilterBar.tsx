"use client";

import type { ReactNode } from "react";
import { CalendarDays, Search } from "lucide-react";

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
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5">
        <label className="flex h-11 w-[170px] shrink-0 items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-slate-400">
          <CalendarDays className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={weekValue}
            onChange={(event) => onWeekChange(event.target.value)}
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-2.5 text-sm font-semibold text-slate-700 outline-none"
            aria-label="Chọn tuần"
          >
            {weekOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <input
          type="date"
          value={dateValue}
          onChange={(event) => onDateChange(event.target.value)}
          className="h-11 w-[160px] shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
          aria-label="Chọn ngày"
        />

        {onSearchChange ? (
          <label className="flex h-11 min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-slate-400">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        ) : null}

        {selectFilters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
            className={cn(
              "h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400",
              filter.key === "page-size" ? "w-[112px]" : "w-[176px]",
            )}
            aria-label={filter.label}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ))}

        {children}

        {viewOptions.length ? (
          <div className="ml-auto shrink-0 border-l border-slate-200 pl-2">
            <SpaceViewSwitch activeView={activeView} options={viewOptions} onChange={onViewChange} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
