"use client";

import type {
    ViewKey,
    WatchListCounts,
    WatchListSubCounts,
    WatchListSubFilter,
    WatchRow,
} from "./types";
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

    currentView?: ViewKey;
    subFilter?: WatchListSubFilter;
    subCounts?: Partial<WatchListSubCounts> | null;
    total?: number;
    segmentTotal?: number;
    onSubFilterChange?: (key: WatchListSubFilter) => void;

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
    onBuyBack?: (row: WatchRow) => void;
    onRaiseCase?: (row: WatchRow) => void;
    onCreateTask?: (row: WatchRow) => void;
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
    },
    segmentTotal?: number
) {
    return {
        items: Number(segmentTotal ?? counts?.all ?? items.length),
        hasContent: Number(
            counts?.hasContent ?? items.filter((item) => item?.hasContent).length
        ),
        hasImages: Number(
            counts?.hasImages ?? items.filter((item) => item?.hasImages).length
        ),
    };
}
function subFilterClass(active: boolean) {
    return active
        ? "rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white"
        : "rounded-full px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100";
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

type MiniTone = "emerald" | "blue" | "amber" | "violet" | "slate";

function InlineCountButton({
    active,
    label,
    value,
    tone,
    onClick,
}: {
    active: boolean;
    label: string;
    value: number;
    tone: MiniTone;
    onClick?: () => void;
}) {
    const activeClass: Record<MiniTone, string> = {
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        blue: "border-blue-200 bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        amber: "border-amber-200 bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        violet: "border-violet-200 bg-violet-50 text-violet-700 ring-1 ring-violet-200",
        slate: "border-slate-300 bg-slate-900 text-white ring-1 ring-slate-900",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium transition",
                active
                    ? activeClass[tone]
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
        >
            <span>{value}</span>
            <span>{label}</span>
        </button>
    );
}

function MiniFilters({
    view,
    summary,
    subFilter,
    subCounts,
    activeQuickFilters,
    onQuickFilterClick,
    onSubFilterChange,
}: {
    view?: ViewKey;
    summary: ReturnType<typeof deriveSummary>;
    subFilter?: WatchListSubFilter;
    subCounts?: Partial<WatchListSubCounts> | null;
    activeQuickFilters?: QuickFilterKey[] | LegacyQuickFilters;
    onQuickFilterClick?: (key: QuickFilterKey) => void;
    onSubFilterChange?: (key: WatchListSubFilter) => void;
}) {
    if (view === "processing") {
        return (
            <>
                <FilterChip
                    active={!subFilter}
                    label="mục"
                    value={summary.items}
                    onClick={() => onSubFilterChange?.("")}
                />
                <InlineCountButton
                    active={subFilter === "MISSING_CONTENT"}
                    label="thiếu content"
                    value={Number(subCounts?.missingContent ?? 0)}
                    tone="emerald"
                    onClick={() => onSubFilterChange?.("MISSING_CONTENT")}
                />
                <InlineCountButton
                    active={subFilter === "MISSING_IMAGE"}
                    label="thiếu image"
                    value={Number(subCounts?.missingImage ?? 0)}
                    tone="blue"
                    onClick={() => onSubFilterChange?.("MISSING_IMAGE")}
                />
            </>
        );
    }

    if (view === "ready") {
        return (
            <>
                <FilterChip
                    active={!subFilter}
                    label="mục"
                    value={summary.items}
                    onClick={() => onSubFilterChange?.("")}
                />
                <InlineCountButton
                    active={subFilter === "REVIEW_DRAFT"}
                    label="draft"
                    value={Number(subCounts?.reviewDraft ?? 0)}
                    tone="slate"
                    onClick={() => onSubFilterChange?.("REVIEW_DRAFT")}
                />
                <InlineCountButton
                    active={subFilter === "REVIEW_SUBMITTED"}
                    label="chờ duyệt"
                    value={Number(subCounts?.reviewSubmitted ?? 0)}
                    tone="amber"
                    onClick={() => onSubFilterChange?.("REVIEW_SUBMITTED")}
                />
                <InlineCountButton
                    active={subFilter === "PARTIAL_APPROVED"}
                    label="duyệt một phần"
                    value={Number(subCounts?.partialApproved ?? 0)}
                    tone="blue"
                    onClick={() => onSubFilterChange?.("PARTIAL_APPROVED")}
                />
                <InlineCountButton
                    active={subFilter === "APPROVED"}
                    label="đã duyệt"
                    value={Number(subCounts?.approved ?? 0)}
                    tone="emerald"
                    onClick={() => onSubFilterChange?.("APPROVED")}
                />
                <InlineCountButton
                    active={subFilter === "POSTED"}
                    label="đã đăng"
                    value={Number(subCounts?.posted ?? 0)}
                    tone="violet"
                    onClick={() => onSubFilterChange?.("POSTED")}
                />
            </>
        );
    }

    return (
        <>
            <FilterChip
                active={isQuickFilterActive(activeQuickFilters, "all")}
                label="mục"
                value={summary.items}
                onClick={() => onQuickFilterClick?.("all")}
            />
            <InlineCountButton
                active={isQuickFilterActive(activeQuickFilters, "hasContent")}
                label="có content"
                value={summary.hasContent}
                tone="emerald"
                onClick={() => onQuickFilterClick?.("hasContent")}
            />
            <InlineCountButton
                active={isQuickFilterActive(activeQuickFilters, "hasImages")}
                label="có image"
                value={summary.hasImages}
                tone="blue"
                onClick={() => onQuickFilterClick?.("hasImages")}
            />
        </>
    );
}

export default function WatchListTable({
    items = [],
    selectedIds = [],
    canViewCost = true,
    counts,
    currentView,
    subFilter,
    subCounts,
    segmentTotal,
    activeQuickFilters,
    onQuickFilterClick,
    onSubFilterChange,
    onToggleOne,
    onToggleAll,
    onView,
    onEdit,
    onDelete,
    onService,
    onQuickOrder,
    onConsign,
    onBuyBack,
    onRaiseCase,
    onCreateTask,
}: Props) {
    const safeItems = Array.isArray(items) ? items : [];
    const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

    const summary = deriveSummary(safeItems, counts, segmentTotal);

    const allChecked =
        safeItems.length > 0 &&
        safeItems.every((item) => safeSelectedIds.includes(item.id));

    return (
        <div className="relative overflow-visible rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-4">
                <div className="text-[18px] font-semibold text-slate-900">
                    Danh sách dữ liệu
                </div>

                <MiniFilters
                    view={currentView}
                    summary={summary}
                    subFilter={subFilter}
                    subCounts={subCounts}
                    activeQuickFilters={activeQuickFilters}
                    onQuickFilterClick={onQuickFilterClick}
                    onSubFilterChange={onSubFilterChange}
                />
            </div>


            <div className="relative overflow-visible">
                <table className="w-full table-fixed text-sm">
                    <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                            <th className="w-[5%] px-5 py-4">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => onToggleAll?.(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </th>
                            <th className="w-[31%] px-5 py-4">Watch</th>
                            <th className="w-[9%] px-5 py-4">Post readiness</th>
                            <th className="w-[12%] px-5 py-4">Page đăng</th>
                            <th className="w-[8%] px-5 py-4">Giá bán</th>
                            <th className="w-[7%] px-5 py-4">Tạo lúc</th>
                            <th className="w-[7%] px-5 py-4">Cập nhật</th>
                            <th className="w-[7%] px-5 py-4">Người cập nhật</th>
                            <th className="w-[7%] px-5 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {safeItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
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
                                    onBuyBack={onBuyBack}
                                    onRaiseCase={onRaiseCase}
                                    onCreateTask={onCreateTask}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
