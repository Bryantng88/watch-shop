"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ActionMenu from "../components/ActionMenu";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import StatusBadge from "@/components/badges/StatusBadge";

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

type ViewKey = "all" | "draft" | "posted" | "canceled";

type Counts = {
    all: number;
    draft: number;
    posted: number;
    canceled: number;
};

type PageProps = {
    items: AcquisitionItem[];
    total: number;
    counts?: Partial<Counts>;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(Number(n))} ${cur}`;
}

export default function AcquisitionListClient(props: PageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const items = props.items ?? [];

    const currentView: ViewKey = useMemo(() => {
        const v = (sp.get("view") || "all").toLowerCase();
        if (v === "draft" || v === "posted" || v === "canceled") return v as ViewKey;
        return "all";
    }, [sp]);

    function setView(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.delete("status");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    const q = sp.get("q") ?? "";
    const vendorId = sp.get("vendorId") ?? "";
    const type = sp.get("type") ?? "";
    const sort = sp.get("sort") ?? "updatedDesc";

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = useState(false);

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [currentView, q, vendorId, type, sort, props.page]);

    useEffect(() => {
        setShowBulkBar(selectedIds.length > 0);
    }, [selectedIds.length]);

    const displayItems = items;

    const counts: Counts = useMemo(() => {
        if (props.counts?.all != null) {
            return {
                all: props.counts.all ?? 0,
                draft: props.counts.draft ?? 0,
                posted: props.counts.posted ?? 0,
                canceled: props.counts.canceled ?? 0,
            };
        }
        return {
            all: currentView === "all" ? props.total : 0,
            draft: currentView === "draft" ? props.total : 0,
            posted: currentView === "posted" ? props.total : 0,
            canceled: currentView === "canceled" ? props.total : 0,
        };
    }, [props.counts, props.total, currentView]);

    const selectableIds = useMemo(
        () => displayItems.filter((x) => (x.status || "").toUpperCase() === "DRAFT").map((x) => x.id),
        [displayItems]
    );

    const allChecked =
        selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));
    const someChecked =
        selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

    const [formQ, setFormQ] = useState(q);
    const [formVendorId, setFormVendorId] = useState(vendorId);
    const [formType, setFormType] = useState(type);
    const [formSort, setFormSort] = useState(sort);

    useEffect(() => setFormQ(q), [q]);
    useEffect(() => setFormVendorId(vendorId), [vendorId]);
    useEffect(() => setFormType(type), [type]);
    useEffect(() => setFormSort(sort), [sort]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(form: {
        q: string;
        vendorId: string;
        type: string;
        sort: string;
    }) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", form.q.trim() || null);
        setParam(next, "vendorId", form.vendorId || null);
        setParam(next, "type", form.type || null);
        setParam(next, "sort", form.sort || "updatedDesc");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
        next.delete("vendorId");
        next.delete("type");
        next.delete("sort");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function goPage(p: number) {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        router.push(`${pathname}?${next.toString()}`);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Phiếu nhập hàng</h1>
                <Link
                    href="/admin/acquisitions/new"
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                    + Tạo phiếu nhập
                </Link>
            </div>

            <SegmentTabs
                active={currentView}
                onChange={(v) => setView(v as ViewKey)}
                tabs={[
                    { key: "all", label: "Tất cả", count: counts.all },
                    { key: "draft", label: "DRAFT", count: counts.draft },
                    { key: "posted", label: "POSTED", count: counts.posted },
                    { key: "canceled", label: "CANCELED", count: counts.canceled },
                ]}
            />

            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({
                        q: formQ,
                        vendorId: formVendorId,
                        type: formType,
                        sort: formSort,
                    });
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tìm kiếm</div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder="refNo / notes / vendor..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Vendor ID</div>
                        <input
                            value={formVendorId}
                            onChange={(e) => setFormVendorId(e.target.value)}
                            placeholder="vendorId"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Type</div>
                        <select
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">(All)</option>
                            <option value="PURCHASE">PURCHASE</option>
                            <option value="SALE">SALE</option>
                            <option value="RETURN">RETURN</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Sắp xếp</div>
                        <select
                            value={formSort}
                            onChange={(e) => setFormSort(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="updatedDesc">Cập nhật ↓</option>
                            <option value="updatedAsc">Cập nhật ↑</option>
                            <option value="createdDesc">Tạo ↓</option>
                            <option value="createdAsc">Tạo ↑</option>
                            <option value="acquiredDesc">Acquired ↓</option>
                            <option value="acquiredAsc">Acquired ↑</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        Lọc
                    </button>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    >
                        Clear
                    </button>
                    <div className="ml-auto text-sm text-gray-600">
                        Đã chọn: <b>{selectedIds.length}</b>
                    </div>
                </div>
            </form>

            {showBulkBar && (
                <div className="p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">{selectedIds.length} phiếu đã chọn</span>
                    <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={async () => {
                            const res = await fetch("/api/admin/acquisitions/bulk-post", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ acquisitionIds: selectedIds }),
                            });

                            const data = await res.json().catch(() => null);

                            if (!res.ok || data?.ok === false) {
                                if (Array.isArray(data?.failed) && data.failed.length) {
                                    alert(
                                        data.failed
                                            .map((x: any) => `${x.id}: ${x.error}`)
                                            .join("\n")
                                    );
                                } else {
                                    alert(data?.error || "Có lỗi khi duyệt phiếu!");
                                }
                                return;
                            }

                            if (Array.isArray(data?.failed) && data.failed.length > 0) {
                                alert(
                                    "Một số phiếu duyệt lỗi:\n" +
                                    data.failed.map((x: any) => `- ${x.id}: ${x.error}`).join("\n")
                                );
                                router.refresh();
                                return;
                            }

                            setSelectedIds([]);
                            setShowBulkBar(false);
                            router.refresh();
                        }}
                        type="button"
                    >
                        Duyệt phiếu
                    </button>

                    <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => {
                            setSelectedIds([]);
                            setShowBulkBar(false);
                        }}
                        type="button"
                    >
                        Bỏ chọn
                    </button>
                </div>
            )}

            <div className="border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-700">
                                <th className="w-10 px-3 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someChecked;
                                        }}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const merged = Array.from(new Set([...selectedIds, ...selectableIds]));
                                                setSelectedIds(merged);
                                                setShowBulkBar(merged.length > 0);
                                            } else {
                                                const next = selectedIds.filter((id) => !selectableIds.includes(id));
                                                setSelectedIds(next);
                                                setShowBulkBar(next.length > 0);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-3 py-3">RefNo</th>
                                <th className="px-3 py-3">Amount</th>
                                <th className="px-3 py-3">Note</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Type</th>
                                <th className="px-3 py-3">Ngày tạo</th>
                                <th className="px-3 py-3">Link</th>
                                <th className="px-3 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayItems.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-3 py-10 text-center text-gray-500">
                                        Không có dữ liệu trong tab này
                                    </td>
                                </tr>
                            ) : (
                                displayItems.map((row) => {
                                    const checked = selectedIds.includes(row.id);

                                    return (
                                        <tr key={row.id} className="border-t">
                                            <td className="px-3 py-4 align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    disabled={(row.status || "").toUpperCase() !== "DRAFT"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds((prev) =>
                                                                Array.from(new Set([...prev, row.id]))
                                                            );
                                                        } else {
                                                            setSelectedIds((prev) =>
                                                                prev.filter((id) => id !== row.id)
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-medium text-sm">
                                                    {row.refNo && row.refNo.trim() ? row.refNo : "-"}
                                                </div>
                                                <div className="mt-1 text-[11px] text-gray-400 uppercase tracking-wide">
                                                    {(row.type || "-").toLowerCase()}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-semibold text-base">
                                                    {fmtMoney(Number(row.cost || 0), row.currency)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Items: {row.itemCount}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="text-sm">{row.notes || "-"}</div>
                                                <div className="text-xs text-gray-500 mt-1">ID: {row.id}</div>
                                            </td>

                                            <td className="px-3 py-4 align-middle">
                                                <StatusBadge status={row.status} />
                                            </td>

                                            <td className="px-3 py-4 align-middle">{row.type}</td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="text-sm">{fmtDT(row.createdAt)}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Updated: {fmtDT(row.updatedAt)}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="space-y-1 text-sm">
                                                    {row.vendorName ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Vendor</span>{" "}
                                                            <span className="text-gray-600">{row.vendorName}</span>
                                                        </div>
                                                    ) : null}
                                                    {row.hasInvoice ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Invoice</span>{" "}
                                                            <span className="text-gray-600">Yes</span>
                                                        </div>
                                                    ) : null}
                                                    {!row.vendorName && !row.hasInvoice ? (
                                                        <span className="text-gray-400">-</span>
                                                    ) : null}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-middle text-right">
                                                <ActionMenu
                                                    entityId={row.id}
                                                    entityType="acquisitions"
                                                    status={row.status}
                                                    mode="edit"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-700">
                <div>
                    Tổng: <b>{props.total}</b> • Trang <b>{props.page}</b>/<b>{props.totalPages}</b>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="px-3 py-2 border rounded-lg disabled:opacity-50"
                        disabled={props.page <= 1}
                        onClick={() => goPage(Math.max(1, props.page - 1))}
                    >
                        ← Trước
                    </button>
                    <button
                        type="button"
                        className="px-3 py-2 border rounded-lg disabled:opacity-50"
                        disabled={props.page >= props.totalPages}
                        onClick={() => goPage(Math.min(props.totalPages, props.page + 1))}
                    >
                        Sau →
                    </button>
                </div>
            </div>
        </div>
    );
}