"use client";

import type { WatchRow, WatchListCounts } from "./types";
import WatchListRow from "./WatchListRow";

type QuickFilterKey = "all" | "hasContent" | "hasImages";
type LegacyQuickFilters = {
    hasContent?: boolean;
    hasImages?: boolean;
};

type Props = {
    items?: WatchRow[];
    selectedIds?: string[];
    canViewCost?: boolean;

    counts?: Partial<WatchListCounts> & {
        all?: number;
        hasContent?: number;
        hasImages?: number;
    };

    activeQuickFilters?: QuickFilterKey[] | LegacyQuickFilters;
    onQuickFilterClick?: (key: QuickFilterKey) => void;

    onToggleOne?: (id: string, checked: boolean) => void;
    onToggleAll?: (checked: boolean) => void;

    onView?: (row: WatchRow) => void;
    onEdit?: (row: WatchRow) => void;
    onDelete?: (row: WatchRow) => void;
    onService?: (row: WatchRow) => void;
    onQuickOrder?: (row: WatchRow) => void;
    onConsign?: (row: WatchRow) => void;
};

function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function deriveSummary(
    items: WatchRow[],
    counts?: Partial<WatchListCounts> & {
        all?: number;
        hasContent?: number;
        hasImages?: number;
    }
) {
    return {
        items: Number(counts?.all ?? items.length),
        hasContent: Number(
            counts?.hasContent ?? items.filter((item) => item?.hasContent).length
        ),
        hasImages: Number(
            counts?.hasImages ?? items.filter((item) => item?.hasImages).length
        ),
    };
}

function isQuickFilterActive(
    activeQuickFilters: QuickFilterKey[] | LegacyQuickFilters | undefined,
    key: QuickFilterKey
) {
    if (!activeQuickFilters) return false;

    if (Array.isArray(activeQuickFilters)) {
        return activeQuickFilters.includes(key);
    }

    if (key === "all") {
        return !activeQuickFilters.hasContent && !activeQuickFilters.hasImages;
    }

    return Boolean(activeQuickFilters[key]);
}

function FilterChip({
    active,
    label,
    value,
    onClick,
}: {
    active: boolean;
    label: string;
    value: number;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition",
                active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
        >
            <span>{label}</span>
            <span>{value}</span>
        </button>
    );
}

export default function WatchListTable({
    items = [],
    selectedIds = [],
    canViewCost = true,
    counts,
    activeQuickFilters,
    onQuickFilterClick,
    onToggleOne,
    onToggleAll,
    onView,
    onEdit,
    onDelete,
    onService,
    onQuickOrder,
    onConsign,
}: Props) {
    const safeItems = Array.isArray(items) ? items : [];
    const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

    const summary = deriveSummary(safeItems, counts);

    const allChecked =
        safeItems.length > 0 &&
        safeItems.every((item) => safeSelectedIds.includes(item.id));

    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-4">
                <div className="text-[18px] font-semibold text-slate-900">
                    Danh sách dữ liệu
                </div>

                <FilterChip
                    active={isQuickFilterActive(activeQuickFilters, "all")}
                    label="mục"
                    value={summary.items}
                    onClick={() => onQuickFilterClick?.("all")}
                />

                <div className="text-xs text-slate-500">
                    <button
                        type="button"
                        onClick={() => onQuickFilterClick?.("hasContent")}
                        className={cn(
                            "transition hover:text-slate-700",
                            isQuickFilterActive(activeQuickFilters, "hasContent") &&
                            "font-medium text-emerald-600"
                        )}
                    >
                        <span className="font-medium text-emerald-600">
                            {summary.hasContent}
                        </span>{" "}
                        có content
                    </button>
                </div>

                <div className="text-xs text-slate-500">
                    <button
                        type="button"
                        onClick={() => onQuickFilterClick?.("hasImages")}
                        className={cn(
                            "transition hover:text-slate-700",
                            isQuickFilterActive(activeQuickFilters, "hasImages") &&
                            "font-medium text-blue-600"
                        )}
                    >
                        <span className="font-medium text-blue-600">
                            {summary.hasImages}
                        </span>{" "}
                        có image
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="w-10 px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) =>
                                        onToggleAll?.(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </th>
                            <th className="px-4 py-4">Watch</th>
                            <th className="px-4 py-4">Post readiness</th>
                            <th className="px-4 py-4">Pricing</th>
                            <th className="px-4 py-4">Cập nhật</th>
                            <th className="px-4 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {safeItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center text-sm text-slate-500"
                                >
                                    Chưa có watch nào khớp bộ lọc hiện tại.
                                </td>
                            </tr>
                        ) : (
                            safeItems.map((item) => (
                                <WatchListRow
                                    key={item.id}
                                    product={item}
                                    checked={safeSelectedIds.includes(item.id)}
                                    canViewCost={canViewCost}
                                    onCheckedChange={(checked) =>
                                        onToggleOne?.(item.id, checked)
                                    }
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onService={onService}
                                    onQuickOrder={onQuickOrder}
                                    onConsign={onConsign}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}