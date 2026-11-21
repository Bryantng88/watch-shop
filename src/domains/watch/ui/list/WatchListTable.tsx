"use client";

import { useEffect, useRef } from "react";
import type { WatchRow } from "./types";
import WatchListRow from "./WatchListRow";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

import { ADMIN_OPERATION_LIST as surface, ADMIN_OPERATION_LIST_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminOperationList";

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
    onRepairInline?: (row: WatchRow) => void;
};

export default function WatchListTable({
    items = [],
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
    onRepairInline,
}: Props) {
    const safeItems = Array.isArray(items) ? items : [];
    const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];


    const allChecked =
        safeItems.length > 0 &&
        safeItems.every((item) => safeSelectedIds.includes(item.id));
    const someChecked = safeItems.some((item) => safeSelectedIds.includes(item.id));
    const selectPageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectPageRef.current) selectPageRef.current.indeterminate = someChecked && !allChecked;
    }, [allChecked, someChecked]);

    return (
        <div className="relative min-w-0 max-w-full bg-white border-t border-slate-100">
            <div className="relative overflow-x-auto overscroll-x-contain">
                <table className={`w-full min-w-[1040px] table-fixed text-sm ${surface.tableSurface}`} style={ADMIN_OPERATION_LIST_STYLE}>
                    <colgroup>
                        <col className="w-10" /><col /><col className="w-[230px]" /><col className="w-[120px]" /><col className="w-[160px]" /><col className="w-[180px]" /><col className="w-11" />
                    </colgroup>
                    <thead className="text-left text-xs font-medium text-slate-500">
                        <tr>
                            <th className="px-4 py-3">
                                <input
                                    ref={selectPageRef}
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => onToggleAll?.(e.target.checked)}
                                    aria-label="Chọn toàn bộ watch ở trang hiện tại"
                                    title="Chọn toàn bộ watch ở trang hiện tại"
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                            </th>
                            <th className="px-3 py-3">Đồng hồ</th>
                            <th className="px-3 py-3">Tình trạng</th>
                            <th className="px-3 py-3">Giá bán</th>
                            <th className="px-3 py-3">Cập nhật / Tạo</th>
                            <th className="px-3 py-3">Hoạt động gần nhất</th>
                            <th className="sticky right-0 z-10 bg-white px-1 py-3 text-right"><span className="sr-only">Thao tác</span></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {safeItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
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
                                    onRepairInline={onRepairInline}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
