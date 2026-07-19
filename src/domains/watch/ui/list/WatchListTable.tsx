"use client";

import type { WatchRow } from "./types";
import WatchListRow from "./WatchListRow";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

type Props = {
    items?: WatchRow[];
    total?: number;
    selectedIds?: string[];
    canViewCost?: boolean;

    onToggleOne?: (id: string, checked: boolean) => void;
    onToggleAll?: (checked: boolean) => void;

    onView?: (row: WatchRow) => void;
    onEdit?: (row: WatchRow) => void;
    onDelete?: (row: WatchRow) => void;
    onService?: (row: WatchRow) => void;
    onMedia?: (row: WatchRow) => void;
    mediaSubmittingId?: string | null;
    onConfirmDuplicate?: (row: WatchRow) => void;
    duplicateSubmittingId?: string | null;
    onRestoreDuplicate?: (row: WatchRow) => void;
    onQuickOrder?: (row: WatchRow) => void;
    onConsign?: (row: WatchRow) => void;
    onBuyBack?: (row: WatchRow) => void;
    onRaiseCase?: (row: WatchRow) => void;
    onCreateTask?: (row: WatchRow) => void;
    onPreview?: (preview: BusinessEntityPreview) => void;
};

export default function WatchListTable({
    items = [],
    total,
    selectedIds = [],
    canViewCost = true,
    onToggleOne,
    onToggleAll,
    onView,
    onEdit,
    onDelete,
    onService,
    onMedia,
    mediaSubmittingId,
    onConfirmDuplicate,
    duplicateSubmittingId,
    onRestoreDuplicate,
    onQuickOrder,
    onConsign,
    onBuyBack,
    onRaiseCase,
    onCreateTask,
    onPreview,
}: Props) {
    const safeItems = Array.isArray(items) ? items : [];
    const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];
    const displayTotal = Number.isFinite(Number(total)) ? Number(total) : safeItems.length;

    const allChecked =
        safeItems.length > 0 &&
        safeItems.every((item) => safeSelectedIds.includes(item.id));

    return (
        <div className="relative overflow-visible rounded-b-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
            <div className="hidden">
                <div>
                    <div className="text-[18px] font-semibold text-slate-900">
                        Danh sách watch
                    </div>
                    <div className="mt-1 text-xs font-medium text-slate-500">
                        Đang hiển thị {safeItems.length} / {displayTotal} watch
                    </div>
                </div>
                <div className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">
                    Tổng {displayTotal} watch
                </div>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full min-w-[1120px] table-fixed text-sm">
                    <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                            <th className="w-[5%] px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => onToggleAll?.(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </th>
                            <th className="w-[35%] px-4 py-3">Watch</th>
                            <th className="w-[12%] px-4 py-3">Media</th>
                            <th className="w-[13%] px-4 py-3">Service</th>
                            <th className="w-[11%] px-4 py-3">Bán hàng</th>
                            <th className="w-[9%] px-4 py-3">Giá bán</th>
                            <th className="w-[9%] px-4 py-3">Cập nhật</th>
                            <th className="w-[6%] px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
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
                                    onMedia={onMedia}
                                    mediaSubmitting={mediaSubmittingId === item.id}
                                    onConfirmDuplicate={onConfirmDuplicate}
                                    duplicateSubmitting={duplicateSubmittingId === item.id}
                                    onRestoreDuplicate={onRestoreDuplicate}
                                    onQuickOrder={onQuickOrder}
                                    onConsign={onConsign}
                                    onBuyBack={onBuyBack}
                                    onRaiseCase={onRaiseCase}
                                    onCreateTask={onCreateTask}
                                    onPreview={onPreview}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
