"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DotLabel from "../../__components/DotLabel";


import SegmentTabs from "@/components/tabs/SegmenTabs";
import StatusBadge from "@/components/badges/StatusBadge";


type PaymentRow = {
    id: string;
    refNo?: string | null;
    amount: number;
    currency: string;
    method: string;
    status: string;
    purpose: string;
    type: string;
    direction?: string | null;
    createdAt: string;
    paidAt?: string | null;
    reference?: string | null;
    note?: string | null;
    order_id?: string | null;
    service_request_id?: string | null;
    vendor_id?: string | null;
    acquisition_id?: string | null;
    shipment_id?: string | null;
};

type ViewKey = "all" | "unpaid" | "paid" | "canceled";

type Counts = {
    all: number;
    unpaid: number;
    paid: number;
    canceled: number;
};

function fmtMoney(n: number) {
    try {
        return n.toLocaleString("vi-VN");
    } catch {
        return String(n);
    }
}

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function directionTone(dir?: string | null): "blue" | "orange" | "green" {
    const d = (dir || "").toUpperCase();
    if (d === "IN") return "blue";
    return "orange";
}

function formatMetaText(s?: string | null) {
    if (!s) return "-";
    return s.replaceAll("_", " ").toLowerCase();
}

export default function PaymentListClient(props: {
    items: PaymentRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: { [key: string]: string | string[] | undefined };
    counts?: Partial<Counts>;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const items = props.items ?? [];

    const currentView: ViewKey = useMemo(() => {
        const v = (sp.get("view") || "all").toLowerCase();
        if (v === "unpaid" || v === "paid" || v === "canceled" || v === "all") {
            return v;
        }
        return "all";
    }, [sp]);

    function setView(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        next.delete("status");
        router.push(`${pathname}?${next.toString()}`);
    }

    const q = sp.get("q") ?? "";
    const purpose = sp.get("purpose") ?? "";
    const direction = sp.get("direction") ?? "";
    const method = sp.get("method") ?? "";
    const sort = sp.get("sort") ?? "createdDesc";

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = useState(false);

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [currentView, q, purpose, direction, method, sort, props.page]);

    useEffect(() => {
        setShowBulkBar(selectedIds.length > 0);
    }, [selectedIds.length]);

    const displayItems = items;

    const pageIds = useMemo(() => displayItems.map((x) => x.id), [displayItems]);
    const allChecked =
        pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    const someChecked =
        pageIds.some((id) => selectedIds.includes(id)) && !allChecked;

    const counts: Counts = useMemo(() => {
        if (props.counts?.all != null) {
            return {
                all: props.counts.all ?? 0,
                unpaid: props.counts.unpaid ?? 0,
                paid: props.counts.paid ?? 0,
                canceled: props.counts.canceled ?? 0,
            };
        }

        return {
            all: currentView === "all" ? props.total : 0,
            unpaid: currentView === "unpaid" ? props.total : 0,
            paid: currentView === "paid" ? props.total : 0,
            canceled: currentView === "canceled" ? props.total : 0,
        };
    }, [props.counts, props.total, currentView]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(form: {
        q: string;
        purpose: string;
        direction: string;
        method: string;
        sort: string;
    }) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", form.q.trim() || null);
        setParam(next, "purpose", form.purpose || null);
        setParam(next, "direction", form.direction || null);
        setParam(next, "method", form.method || null);
        setParam(next, "sort", form.sort || "createdDesc");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
        next.delete("purpose");
        next.delete("direction");
        next.delete("method");
        next.delete("sort");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function goPage(p: number) {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        router.push(`${pathname}?${next.toString()}`);
    }

    const [formQ, setFormQ] = useState(q);
    const [formPurpose, setFormPurpose] = useState(purpose);
    const [formDirection, setFormDirection] = useState(direction);
    const [formMethod, setFormMethod] = useState(method);
    const [formSort, setFormSort] = useState(sort);

    useEffect(() => setFormQ(q), [q]);
    useEffect(() => setFormPurpose(purpose), [purpose]);
    useEffect(() => setFormDirection(direction), [direction]);
    useEffect(() => setFormMethod(method), [method]);
    useEffect(() => setFormSort(sort), [sort]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Payments</h1>
                <button
                    type="button"
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => router.push("/admin")}
                >
                    ← Admin
                </button>
            </div>

            <SegmentTabs
                active={currentView}
                onChange={(v) => setView(v as ViewKey)}
                tabs={[
                    { key: "all", label: "Tất cả", count: counts.all },
                    { key: "unpaid", label: "UNPAID", count: counts.unpaid },
                    { key: "paid", label: "PAID", count: counts.paid },
                    { key: "canceled", label: "CANCELED", count: counts.canceled },
                ]}
            />

            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({
                        q: formQ,
                        purpose: formPurpose,
                        direction: formDirection,
                        method: formMethod,
                        sort: formSort,
                    });
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tìm kiếm</div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder="id / refNo / reference / note / SR..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Purpose</div>
                        <input
                            value={formPurpose}
                            onChange={(e) => setFormPurpose(e.target.value)}
                            placeholder="ORDER_FULL / MAINTENANCE_COST..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Direction</div>
                        <select
                            value={formDirection}
                            onChange={(e) => setFormDirection(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">(All)</option>
                            <option value="IN">IN</option>
                            <option value="OUT">OUT</option>
                        </select>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Method</div>
                        <select
                            value={formMethod}
                            onChange={(e) => setFormMethod(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">(All)</option>
                            <option value="CASH">CASH</option>
                            <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                            <option value="COD">COD</option>
                        </select>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Sắp xếp</div>
                        <select
                            value={formSort}
                            onChange={(e) => setFormSort(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="createdDesc">Tạo ↓</option>
                            <option value="createdAsc">Tạo ↑</option>
                            <option value="paidDesc">Paid ↓</option>
                            <option value="paidAsc">Paid ↑</option>
                            <option value="amountDesc">Amount ↓</option>
                            <option value="amountAsc">Amount ↑</option>
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
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} payment đã chọn
                    </span>
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
                                                setSelectedIds((prev) =>
                                                    Array.from(new Set([...prev, ...pageIds]))
                                                );
                                            } else {
                                                setSelectedIds((prev) =>
                                                    prev.filter((id) => !pageIds.includes(id))
                                                );
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-3 py-3">RefNo</th>
                                <th className="px-3 py-3">Amount</th>
                                <th className="px-3 py-3">Note</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Method</th>
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
                                            <td className="w-10 px-3 py-4 align-top">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
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
                                                <div className="leading-tight">
                                                    <div className="font-medium text-sm">
                                                        {row.refNo?.trim() ? row.refNo : "-"}
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-gray-400 uppercase tracking-wide">
                                                        {formatMetaText(row.purpose)} · {formatMetaText(row.type)}
                                                    </div>
                                                    <div className="mt-1.5">
                                                        <DotLabel
                                                            label={(row.direction || "-").toUpperCase()}
                                                            tone={directionTone(row.direction)}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-semibold text-base">
                                                    {fmtMoney(Number(row.amount || 0))}
                                                </div>
                                                <div className="text-xs text-gray-500">{row.currency}</div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="text-sm">{row.note || "-"}</div>
                                                <div className="text-xs text-gray-500 mt-1">ID: {row.id}</div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <StatusBadge status={row.status} />
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-medium">{row.method}</div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="text-sm">{fmtDT(row.createdAt)}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Paid: {fmtDT(row.paidAt)}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="space-y-1 text-sm">
                                                    {row.order_id ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Order</span>{" "}
                                                            <span className="text-gray-600">{row.order_id}</span>
                                                        </div>
                                                    ) : null}
                                                    {row.service_request_id ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">SR</span>{" "}
                                                            <span className="text-gray-600">{row.service_request_id}</span>
                                                        </div>
                                                    ) : null}
                                                    {row.vendor_id ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Vendor</span>{" "}
                                                            <span className="text-gray-600">{row.vendor_id}</span>
                                                        </div>
                                                    ) : null}
                                                    {row.shipment_id ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Shipment</span>{" "}
                                                            <span className="text-gray-600">{row.shipment_id}</span>
                                                        </div>
                                                    ) : null}
                                                    {row.acquisition_id ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Acq</span>{" "}
                                                            <span className="text-gray-600">{row.acquisition_id}</span>
                                                        </div>
                                                    ) : null}
                                                    {!row.order_id &&
                                                        !row.service_request_id &&
                                                        !row.vendor_id &&
                                                        !row.shipment_id &&
                                                        !row.acquisition_id ? (
                                                        <span className="text-gray-400">-</span>
                                                    ) : null}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top text-right">
                                                <button
                                                    type="button"
                                                    className="px-2 py-1 border rounded-lg text-xs hover:bg-gray-50"
                                                    onClick={() => {
                                                        navigator.clipboard?.writeText(row.id);
                                                    }}
                                                >
                                                    ⋮
                                                </button>
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