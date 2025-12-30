"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DrawerHost from "../components/Drawer";
import ItemsHover from "../components/ItemsHover";
import AcqItemsPopover from "../components/ItemsPopover";
import ChangeToPostedButton from "../components/ChangeToPostedButton";
import ActionMenu from "../components/ActionMenu";
import ItemPopover from "../../__components/GenericPopover";

type AcquisitionItem = {
    id: string;
    refNo: string | null;
    vendorName: string | null;
    type: string;
    status: string;
    cost: number;
    currency: string;
    itemCount: number;
    hasInvoice: boolean;
    notes: string;
    createdAt: string;
    updatedAt: string;
};

type PageProps = {
    items: AcquisitionItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};

// ======================================
// Formatters
// ======================================
function fmtDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + (cur ? ` ${cur}` : "");
}

// ======================================
// MAIN CLIENT COMPONENT
// ======================================
export default function AcquisitionListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams
}: PageProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [rowCounts, setRowCounts] = useState<Record<string, number>>({});
    const [rowTotals, setRowTotals] = useState<Record<string, number>>({});
    // ============================
    // BULK CHECKBOX HANDLING
    // ============================
    useEffect(() => {
        const selectAll = document.getElementById("select-all") as HTMLInputElement;
        const checks = Array.from(document.querySelectorAll<HTMLInputElement>(".row-check"));
        const bar = document.getElementById("bulk-bar")!;
        const countSpan = document.getElementById("selected-count")!;
        const btnApprove = document.getElementById("bulk-approve")!;
        const btnClear = document.getElementById("bulk-clear")!;
        // ========================
        // Bulk Approve Handler
        // ========================
        btnApprove.addEventListener("click", async () => {
            const checked = checks.filter((c) => c.checked);

            if (checked.length === 0) return;

            // tạo payload
            const payload = checked.map((c) => ({
                id: c.dataset.id!,
                vendor: c.dataset.vendorname!,
                type: c.dataset.type!,
                cost: c.dataset.cost!,
            }));

            // gọi API
            const res = await fetch("/api/admin/acquisitions/bulk-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: payload }),
            });

            if (!res.ok) {
                alert("Có lỗi khi duyệt phiếu!");
                return;
            }

            // reload lại trang
            window.location.reload();
        });

        function refresh() {
            const sel = checks.filter((c) => c.checked);
            if (sel.length > 0) {
                bar.classList.remove("hidden");
                countSpan.textContent = `${sel.length} phiếu đã chọn`;
            } else {
                bar.classList.add("hidden");
            }
        }

        if (selectAll)
            selectAll.addEventListener("change", () => {
                checks.forEach((c) => {
                    if (!c.disabled) c.checked = selectAll.checked;
                });
                refresh();
            });

        checks.forEach((c) => c.addEventListener("change", refresh));

        btnClear.addEventListener("click", () => {
            if (selectAll) selectAll.checked = false;
            checks.forEach((c) => (c.checked = false));
            refresh();
        });


    }, []);

    // ============================
    // Utilities
    // ============================
    const url = new URLSearchParams(rawSearchParams as any);

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        return `/admin/acquisitions?${next.toString()}`;
    };

    const spObj = rawSearchParams;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Phiếu nhập hàng</h1>
                <Link
                    href="/admin/acquisitions/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo phiếu nhập
                </Link>
            </div>

            {/* Filters */}
            <form action="/admin/acquisitions" method="get" className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(spObj.q as string) ?? ""}
                        placeholder="RefNo, ghi chú…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Sắp xếp</label>
                    <select
                        name="sort"
                        defaultValue={(spObj.sort as string) ?? "updatedDesc"}
                        className="h-9 rounded border px-2"
                    >
                        <option value="updatedDesc">Cập nhật ↓</option>
                        <option value="updatedAsc">Cập nhật ↑</option>
                        <option value="createdDesc">Tạo ↓</option>
                        <option value="createdAsc">Tạo ↑</option>
                        <option value="acquiredDesc">Ngày nhập ↓</option>
                        <option value="acquiredAsc">Ngày nhập ↑</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3">Lọc</button>
                    <Link href="/admin/acquisitions" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* Bulk Bar */}
            <div className="overflow-x-auto border rounded-lg">
                <div id="bulk-bar" className="hidden mb-2 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span id="selected-count" className="font-medium text-blue-700">0 phiếu đã chọn</span>
                    <button
                        id="bulk-approve"
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                        Duyệt các phiếu đã chọn
                    </button>
                    <button
                        id="bulk-clear"
                        className="px-3 py-1 border rounded text-sm"
                    >
                        Bỏ chọn
                    </button>
                </div>

                {/* TABLE */}
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2">
                                <input type="checkbox" id="select-all" />
                            </th>
                            <th className="px-3 py-2 text-left">RefNo</th>
                            <th className="px-3 py-2 text-left">Vendor</th>
                            <th className="px-3 py-2 text-left">Loại</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-left">Ngày nhập</th>
                            <th className="px-3 py-2 text-left">Tổng tiền</th>
                            <th className="px-3 py-2 text-left">Số dòng</th>
                            <th className="px-3 py-2 text-left">HĐ</th>
                            <th className="px-3 py-2 text-left">Cập nhật</th>
                            <th className="px-3 py-2 text-left">Note</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="py-8 text-center text-gray-500">
                                    Không có phiếu nhập
                                </td>
                            </tr>
                        ) : (
                            items.map((a) => {
                                // NEW: compute values override sau khi update popover
                                const displayCount = rowCounts[a.id] ?? a.itemCount;
                                const displayTotal = rowTotals[a.id] ?? Number(a.cost ?? 0);

                                return (
                                    <tr key={a.id} className="border-b hover:bg-gray-50">

                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                className="row-check"
                                                data-id={a.id}
                                                data-vendorname={a.vendorName || ""}
                                                disabled={a.status === "POSTED"}
                                            />
                                        </td>

                                        <td className="px-3 py-2 font-medium">{a.refNo ?? "-"}</td>
                                        <td className="px-3 py-2">{a.vendorName ?? "-"}</td>

                                        <td className="px-3 py-2">{a.type}</td>

                                        <td className="px-3 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${a.status === "POSTED"
                                                    ? "bg-green-100 text-green-700"
                                                    : a.status === "DRAFT"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {a.status}
                                            </span>
                                        </td>

                                        <td className="px-3 py-2">{fmtDate(a.createdAt)}</td>

                                        {/* Tổng tiền (dùng displayTotal) */}
                                        <td className="px-3 py-2">
                                            {fmtMoney(displayTotal, a.currency)}
                                        </td>

                                        {/* Số dòng (dùng displayCount) */}
                                        <td className="px-3 py-2">
                                            <ItemPopover
                                                parentId={a.id}
                                                type="acquisitions"
                                                count={displayCount}
                                                currency={a.currency}
                                                status={a.status}
                                                onUpdated={({ count, total }) => {
                                                    setRowCounts((prev) => ({ ...prev, [a.id]: count }));
                                                    setRowTotals((prev) => ({ ...prev, [a.id]: total }));
                                                }}
                                            />
                                        </td>

                                        <td className="px-3 py-2">{a.hasInvoice ? "✓" : "-"}</td>

                                        <td className="px-3 py-2">
                                            {(a.updatedAt && a.updatedAt !== a.createdAt)
                                                ? fmtDate(a.updatedAt)
                                                : "-"}
                                        </td>

                                        <td className="px-3 py-2">{a.notes}</td>

                                        <td className="relative px-3 py-2 text-right">
                                            <button
                                                className="p-2 rounded hover:bg-gray-100"
                                                onClick={() =>
                                                    setOpenMenuId(openMenuId === a.id ? null : a.id)
                                                }
                                            ></button>

                                            <ActionMenu
                                                acqId={a.id}
                                                status={a.status}
                                                vendor={a.vendorName || ""}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={`rounded border px-3 py-1 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-1 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>

            <DrawerHost />
        </div>
    );
}
