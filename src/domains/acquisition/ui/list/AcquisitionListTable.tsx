"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { PaymentOwner } from "@/domains/payment/ui/PaymentWorkspace";

import AcquisitionListRow from "./AcquisitionListRow";
import type { AcquisitionListItem } from "./types";

function buildHref(
    pathname: string,
    searchParams: URLSearchParams,
    patch: Record<string, string | null | undefined>,
) {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(patch).forEach(([key, value]) => {
        if (value == null || value === "") next.delete(key);
        else next.set(key, value);
    });

    return `${pathname}?${next.toString()}`;
}

function isSelectable(item: AcquisitionListItem) {
    return String(item.status).toUpperCase() !== "POSTED";
}

type Props = {
    items: AcquisitionListItem[];
    total: number;
    page: number;
    totalPages: number;
    pathname: string;
    searchParams: URLSearchParams;
    selectedIds: string[];
    onToggleOne: (id: string, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
    onOpenPayment?: (owner: PaymentOwner) => void;
};

export default function AcquisitionListTable({
    items,
    total,
    page,
    totalPages,
    pathname,
    searchParams,
    selectedIds,
    onToggleOne,
    onToggleAll,
    onOpenPayment,
}: Props) {
    const selectableIds = items.filter(isSelectable).map((item) => item.id);

    const allChecked =
        selectableIds.length > 0 &&
        selectableIds.every((id) => selectedIds.includes(id));

    const someChecked =
        selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-950">
                        Danh sách dữ liệu
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        {total} phiếu
                    </span>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1180px] table-fixed text-sm">
                    <colgroup>
                        <col className="w-[44px]" />
                        <col className="w-[220px]" />
                        <col className="w-[130px]" />
                        <col className="w-[180px]" />
                        <col />
                        <col className="w-[160px]" />
                        <col className="w-[130px]" />
                        <col className="w-[70px]" />
                    </colgroup>

                    <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                            <th className="px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    ref={(element) => {
                                        if (element) element.indeterminate = someChecked;
                                    }}
                                    disabled={!selectableIds.length}
                                    onChange={(event) => onToggleAll(event.target.checked)}
                                />
                            </th>
                            <th className="px-4 py-4">Phiếu nhập</th>
                            <th className="px-4 py-4">Trạng thái</th>
                            <th className="px-4 py-4">Vendor</th>
                            <th className="px-4 py-4">Item</th>
                            <th className="px-4 py-4 text-right">Tổng tiền</th>
                            <th className="px-4 py-4">Cập nhật</th>
                            <th className="px-3 py-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <AcquisitionListRow
                                key={item.id}
                                item={item}
                                checked={selectedIds.includes(item.id)}
                                onCheckedChange={(checked) => onToggleOne(item.id, checked)}
                                onOpenPayment={onOpenPayment}
                            />
                        ))}

                        {!items.length ? (
                            <tr>
                                <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500">
                                    Không có phiếu nhập phù hợp.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
                <div>
                    Tổng: <b className="text-slate-900">{total}</b> phiếu · Trang {page}/
                    {totalPages}
                </div>

                <div className="flex gap-2">
                    <Link
                        aria-disabled={page <= 1}
                        href={buildHref(pathname, searchParams, {
                            page: String(Math.max(1, page - 1)),
                        })}
                        className={cn(
                            "rounded-xl border border-slate-200 px-3 py-2",
                            page <= 1 && "pointer-events-none opacity-40",
                        )}
                    >
                        Trước
                    </Link>

                    <Link
                        aria-disabled={page >= totalPages}
                        href={buildHref(pathname, searchParams, {
                            page: String(Math.min(totalPages, page + 1)),
                        })}
                        className={cn(
                            "rounded-xl border border-slate-200 px-3 py-2",
                            page >= totalPages && "pointer-events-none opacity-40",
                        )}
                    >
                        Sau
                    </Link>
                </div>
            </div>
        </div>
    );
}