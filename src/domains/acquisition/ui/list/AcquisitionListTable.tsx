"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/domains/shared/ui/admin-design-contract/AdminBusinessTable.module.css";
import { ADMIN_OPERATION_LIST_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminOperationList";

import { cn } from "@/lib/utils";

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
    return String(item.approvalStatus).toUpperCase() !== "POSTED";
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
    onOpenEdit?: (id: string) => void;
    canManage?: boolean;
    canViewFinancials?: boolean;
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
    onOpenEdit,
    canManage = false,
    canViewFinancials = false,
}: Props) {
    const selectableIds = canManage ? items.filter(isSelectable).map((item) => item.id) : [];

    const allChecked =
        selectableIds.length > 0 &&
        selectableIds.every((id) => selectedIds.includes(id));

    const someChecked =
        selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

    return (
        <div className={styles.list} style={ADMIN_OPERATION_LIST_STYLE}>
            <div className={styles.scroll}>
                <table className={styles.table}>
                    <caption className="sr-only">Danh sách phiếu nhập</caption>
                    <colgroup><col style={{ width: 40 }} /><col style={{ width: 250 }} /><col style={{ width: 156 }} /><col style={{ width: 128 }} />{canViewFinancials && <col style={{ width: 140 }} />}<col style={{ width: 140 }} />{canViewFinancials && <col style={{ width: 168 }} />}<col style={{ width: 112 }} /><col style={{ width: 44 }} /></colgroup>

                    <thead>
                        <tr>
                            <th className="px-4 py-3">
                                <input
                                    type="checkbox" aria-label="Chọn tất cả dòng có thể xử lý"
                                    checked={allChecked}
                                    ref={(element) => {
                                        if (element) element.indeterminate = someChecked;
                                    }}
                                    disabled={!selectableIds.length}
                                    onChange={(event) => onToggleAll(event.target.checked)}
                                />
                            </th>
                            <th className="px-3 py-3">Sản phẩm</th>
                            <th className="px-4 py-3">Phiếu nhập</th>
                            <th className="px-4 py-3">Trạng thái phiếu</th>
                            <th className={canViewFinancials ? "px-4 py-3" : "hidden"}>Thanh toán</th>
                            <th className="px-4 py-3">Nhà cung cấp</th>
                            <th className={canViewFinancials ? "px-4 py-3 text-right" : "hidden"}>Tổng tiền</th>
                            <th className="px-4 py-3">Cập nhật</th>
                            <th className="sticky right-0 z-10 bg-slate-50 px-3 py-3 text-right"><span className="sr-only">Thao tác</span></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <AcquisitionListRow
                                key={item.id}
                                item={item}
                                checked={selectedIds.includes(item.id)}
                                onCheckedChange={(checked) => onToggleOne(item.id, checked)}
                                onOpenEdit={onOpenEdit}
                                canManage={canManage}
                                canViewFinancials={canViewFinancials}
                            />
                        ))}

                        {!items.length ? (
                            <tr>
                                <td colSpan={canViewFinancials ? 9 : 7} className="px-5 py-12 text-center text-sm text-slate-500">
                                    Không có phiếu nhập phù hợp.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            <div className={styles.footer}>
                <div>
                    Tổng: <b className="text-slate-900">{total}</b> phiếu · Trang {page}/
                    {totalPages}
                </div>

                <div className="flex gap-2">
                    <Link
                        aria-label="Trang trước"
                        aria-disabled={page <= 1}
                        href={buildHref(pathname, searchParams, {
                            page: String(Math.max(1, page - 1)),
                        })}
                        className={cn(
                            styles.pageLink,
                            page <= 1 && "pointer-events-none opacity-40",
                        )}
                    >
                        <ChevronLeft size={16} aria-hidden="true" />
                    </Link>

                    <Link
                        aria-label="Trang sau"
                        aria-disabled={page >= totalPages}
                        href={buildHref(pathname, searchParams, {
                            page: String(Math.min(totalPages, page + 1)),
                        })}
                        className={cn(
                            styles.pageLink,
                            page >= totalPages && "pointer-events-none opacity-40",
                        )}
                    >
                        <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
