"use client";

import type {
    ViewKey,
    WatchListSubCounts,
    WatchListSubFilter,
    WatchRow,
} from "./types";
import WatchListRow from "./WatchListRow";

type Props = {
    items?: WatchRow[];
    selectedIds?: string[];
    canViewCost?: boolean;
    segmentTotal?: number;
    currentView: ViewKey;
    subFilter?: WatchListSubFilter;
    subCounts?: Partial<WatchListSubCounts>;
    total?: number;
    onSubFilterChange?: (key: WatchListSubFilter) => void;

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

function MiniFilters({
    view,
    subFilter,
    subCounts,
    onChange,
}: {
    view: ViewKey;
    subFilter?: WatchListSubFilter;
    subCounts?: Partial<WatchListSubCounts>;
    onChange?: (key: WatchListSubFilter) => void;
}) {
    if (view === "processing") {
        return (
            <>
                <FilterChip
                    active={subFilter === "MISSING_CONTENT"}
                    label="thiếu content"
                    value={Number(subCounts?.missingContent ?? 0)}
                    onClick={() => onChange?.("MISSING_CONTENT")}
                />

                <FilterChip
                    active={subFilter === "MISSING_IMAGE"}
                    label="thiếu image"
                    value={Number(subCounts?.missingImage ?? 0)}
                    onClick={() => onChange?.("MISSING_IMAGE")}
                />
            </>
        );
    }

    if (view === "ready") {
        return (
            <>
                <FilterChip
                    active={subFilter === "REVIEW_DRAFT"}
                    label="Draft"
                    value={Number(subCounts?.reviewDraft ?? 0)}
                    onClick={() => onChange?.("REVIEW_DRAFT")}
                />
                <FilterChip
                    active={subFilter === "REVIEW_SUBMITTED"}
                    label="Chờ duyệt"
                    value={Number(subCounts?.reviewSubmitted ?? 0)}
                    onClick={() => onChange?.("REVIEW_SUBMITTED")}
                />
                <FilterChip
                    active={subFilter === "PARTIAL_APPROVED"}
                    label="Duyệt 1 phần"
                    value={Number(subCounts?.partialApproved ?? 0)}
                    onClick={() => onChange?.("PARTIAL_APPROVED")}
                />

                <FilterChip
                    active={subFilter === "APPROVED"}
                    label="Đã duyệt"
                    value={Number(subCounts?.approved ?? 0)}
                    onClick={() => onChange?.("APPROVED")}
                />

                <FilterChip
                    active={subFilter === "POSTED"}
                    label="Đã đăng"
                    value={Number(subCounts?.posted ?? 0)}
                    onClick={() => onChange?.("POSTED")}
                />
            </>
        );
    }

    return null;
}

export default function WatchListTable({
    items = [],
    selectedIds = [],
    canViewCost = true,
    currentView,
    subFilter = "",
    subCounts,
    total,
    onSubFilterChange,
    onToggleOne,
    onToggleAll,
    onView,
    onEdit,
    onDelete,
    onService,
    onQuickOrder,
    onConsign,
    segmentTotal
}: Props) {
    const safeItems = Array.isArray(items) ? items : [];
    const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

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
                    active={!subFilter}
                    label="mục"
                    value={Number(segmentTotal ?? total ?? safeItems.length)}
                    onClick={() => onSubFilterChange?.("")}
                />

                <MiniFilters
                    view={currentView}
                    subFilter={subFilter}
                    subCounts={subCounts}
                    onChange={onSubFilterChange}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="w-10 px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => onToggleAll?.(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </th>
                            <th className="px-4 py-4">Watch</th>
                            <th className="px-4 py-4">Post readiness</th>
                            <th className="px-4 py-4">Giá bán</th>
                            <th className="px-4 py-4">Tạo lúc</th>
                            <th className="px-4 py-4">Cập nhật</th>
                            <th className="px-4 py-4">Người cập nhật</th>
                            <th className="px-4 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {safeItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
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