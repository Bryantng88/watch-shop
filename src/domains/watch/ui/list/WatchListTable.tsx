"use client";

import WatchListRow from "./WatchListRow";
import type { Counts, WatchRow } from "./types";

type QuickFilterKey = "hasContent" | "hasImages";

type Props = {
    items: WatchRow[];
    selectedIds: string[];
    canViewCost: boolean;
    counts?: Counts;
    activeQuickFilters?: {
        hasContent?: boolean;
        hasImages?: boolean;
    };
    onQuickFilterClick?: (key: QuickFilterKey) => void;
    onToggleOne: (productId: string, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
    onView: (productId: string) => void;
    onEdit: (productId: string) => void;
    onDelete: (productId: string) => void;
    onService: (productId: string) => void;
    onConsign?: (productId: string) => void;
    onQuickOrder?: (productId: string) => void;
};

function HeaderStatButton({
    value,
    label,
    tone = "default",
    active = false,
    onClick,
}: {
    value: number;
    label: string;
    tone?: "default" | "content" | "image";
    active?: boolean;
    onClick?: () => void;
}) {
    const toneClass =
        tone === "content"
            ? active
                ? "text-emerald-800"
                : "text-emerald-700"
            : tone === "image"
                ? active
                    ? "text-sky-800"
                    : "text-sky-700"
                : active
                    ? "text-slate-800"
                    : "text-slate-500";

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition",
                active ? "bg-slate-100" : "hover:bg-slate-50",
            ].join(" ")}
        >
            <span className={`font-semibold ${toneClass}`}>{value}</span>
            <span className={active ? "text-slate-600" : "text-slate-400"}>{label}</span>
        </button>
    );
}

export default function WatchListTable({
    items,
    selectedIds,
    canViewCost,
    counts,
    activeQuickFilters,
    onQuickFilterClick,
    onToggleOne,
    onToggleAll,
    onView,
    onEdit,
    onDelete,
    onService,
    onConsign,
    onQuickOrder,
}: Props) {
    const allChecked =
        items.length > 0 && items.every((item) => selectedIds.includes(item.productId));

    return (
        <div className="rounded-[24px] border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm font-semibold text-slate-950">Danh sách dữ liệu</div>

                    <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500">
                        {items.length} mục
                    </div>

                    {counts ? (
                        <>
                            <div className="h-3.5 w-px bg-slate-200" />

                            <HeaderStatButton
                                value={counts.hasContent ?? 0}
                                label="có content"
                                tone="content"
                                active={Boolean(activeQuickFilters?.hasContent)}
                                onClick={() => onQuickFilterClick?.("hasContent")}
                            />

                            <HeaderStatButton
                                value={counts.hasImages ?? 0}
                                label="có image"
                                tone="image"
                                active={Boolean(activeQuickFilters?.hasImages)}
                                onClick={() => onQuickFilterClick?.("hasImages")}
                            />
                        </>
                    ) : null}
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-visible">
                <table className="min-w-full table-fixed">
                    <colgroup>
                        <col className="w-12" />
                        <col className="w-[34%]" />
                        <col className="w-[22%]" />
                        <col className="w-[16%]" />
                        <col className="w-[20%]" />
                        <col className="w-[8%]" />
                    </colgroup>

                    <thead>
                        <tr className="bg-slate-50/80">
                            <th className="px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => onToggleAll(e.target.checked)}
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                                Watch
                            </th>
                            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                                Post readiness
                            </th>
                            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                                Pricing
                            </th>
                            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                                Cập nhật
                            </th>
                            <th className="px-4 py-3 text-right text-[12px] font-semibold text-slate-500">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <WatchListRow
                                    key={item.productId}
                                    item={item}
                                    checked={selectedIds.includes(item.productId)}
                                    canViewCost={canViewCost}
                                    onCheckedChange={(checked) => onToggleOne(item.productId, checked)}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onService={onService}
                                    onConsign={onConsign}
                                    onQuickOrder={onQuickOrder}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
