"use client";

import { AdminButton, AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useRef, type ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { AdminRefreshAction, AdminIconViewSwitch } from "@/domains/shared/ui/admin-design-contract/AdminToolbarControls";
import { AdminViewTabs } from "@/domains/shared/ui/admin-design-contract";
import { cn } from "@/lib/utils";
import { useDismissibleDetails } from "@/domains/shared/ui/popover/useDismissibleDetails";

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
  if (options.every(option => option.icon)) return <AdminIconViewSwitch value={activeView} items={options.map(option => ({ ...option, icon: option.icon! }))} onChange={value => onChange?.(value)} />;
  return (
    <AdminViewTabs
      label="Cách hiển thị"
      value={activeView ?? ""}
      items={options.map((option) => ({ value: option.value, label: option.label, disabled: option.disabled }))}
      onValueChange={(value) => onChange?.(value)}
    />
  );
}

export type SpaceSelectFilter = {
  key: string;
  label: string;
  value: string;
  options: SpaceFilterOption[];
  onChange: (value: string) => void;
};

export function SpaceDataRefreshButton({
  loading = false,
  refreshedAt,
  onRefresh,
}: {
  loading?: boolean;
  refreshedAt?: Date | null;
  onRefresh: () => void;
}) {
  return <AdminRefreshAction loading={loading} refreshedAt={refreshedAt} onRefresh={onRefresh} />;
}

export default function SpaceFilterBar({
  activeView,
  searchValue = "",
  searchPlaceholder = "Tìm kiếm Workspace...",
  selectFilters = [],
  viewOptions = [],
  onViewChange,
  onSearchChange,
  children,
  frameless = false,
  filterBadgeCount = 0,
}: {
  activeView?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  selectFilters?: SpaceSelectFilter[];
  viewOptions?: SpaceViewOption[];
  onViewChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  children?: ReactNode;
  frameless?: boolean;
  filterBadgeCount?: number;
}) {
  const filterBarRef = useRef<HTMLDivElement>(null);
  useDismissibleDetails(filterBarRef);
  const activeFilterCount = selectFilters.filter(
    (filter) => filter.value !== filter.options[0]?.value,
  ).length;

  return (
    <div ref={filterBarRef} className={cn(
      "rounded-xl bg-white",
      frameless
        ? "border-0 p-0 shadow-none"
        : "border border-slate-200 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.025)]",
    )}>
      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange ? (
          <label className="flex h-11 min-w-0 basis-full items-center sm:basis-0 sm:flex-1 gap-2 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-slate-400">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              aria-label={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        ) : null}

        {selectFilters.length ? (
          <details data-dismissible-popover className="group relative shrink-0">
            <AdminDisclosureSummary
              aria-label={`Bộ lọc${activeFilterCount ? ` · ${activeFilterCount} đang áp dụng` : ""}${filterBadgeCount ? ` · ${filterBadgeCount} nhắc đến bạn chưa đọc` : ""}`}
              title={`Bộ lọc${activeFilterCount ? ` · ${activeFilterCount} đang áp dụng` : ""}${filterBadgeCount ? ` · ${filterBadgeCount} nhắc đến bạn chưa đọc` : ""}`}
              className="relative flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 group-open:bg-blue-50 group-open:text-blue-700 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11 [&::-webkit-details-marker]:hidden"
            >
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              {activeFilterCount > 0 || filterBadgeCount > 0 ? <span aria-hidden="true" className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${filterBadgeCount > 0 ? "bg-rose-500" : "bg-blue-600"}`} /> : null}
            </AdminDisclosureSummary>
            <div className="absolute left-0 top-full z-40 mt-2 w-[min(320px,calc(100vw-32px))] sm:left-auto sm:right-0 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">Bộ lọc</div>
                {activeFilterCount ? (
                  <AdminButton variant="secondary" density="compact"
                    type="button"
                    onClick={() => selectFilters.forEach((filter) => filter.onChange(filter.options[0]?.value ?? ""))}
                    className="text-xs font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Xóa bộ lọc
                  </AdminButton>
                ) : null}
              </div>
              <div className="grid gap-3">
                {selectFilters.map((filter) => (
                  <label key={filter.key} className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    {filter.label}
                    <select
                      aria-label={filter.label}
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
        {viewOptions.filter((option) => !option.disabled).length > 1 ? (
          <SpaceViewSwitch activeView={activeView} options={viewOptions} onChange={onViewChange} />
        ) : null}
      </div>
    </div>
  );
}
