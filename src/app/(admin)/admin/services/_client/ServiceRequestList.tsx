"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GenericActionMenu from "../../__components/GenericActionMenu";
import BulkAssignVendorModal from "./BulkAssignVendorModal";
import MaintenanceDrawer from "./MaintenanceDrawer";
import MaintenanceLogModal from "./MaintenaceLogModel";

type ServiceReqItem = {
    id: string;
    refNo: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    scope: string | null;
    customerItemNote: string | null;
    orderRefNo: string | null;
    serviceName: string | null;
    productTitle: string | null;
    vendorName: string | null;
    maintenanceCount: number;
};

type ViewKey = "all" | "draft" | "in_progress" | "done" | "canceled";

type Counts = {
    all: number;
    draft: number;
    in_progress: number;
    done: number;
    canceled: number;
};

type PageProps = {
    items: ServiceReqItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    counts?: Partial<Counts>;
};

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function statusPillClass(status?: string) {
    const s = (status || "").toUpperCase();
    if (s === "DRAFT") return "bg-gray-50 text-gray-700 border-gray-200";
    if (s === "DIAGNOSING" || s === "WAIT_APPROVAL" || s === "IN_PROGRESS") {
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (s === "COMPLETED" || s === "DELIVERED") {
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "CANCELED") return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
}

function pillClassByScope(scope?: string | null) {
    const s = (scope || "").toUpperCase();
    if (s === "INTERNAL") return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (s === "CUSTOMER_ITEM") return "bg-orange-50 text-orange-700 border-orange-200";
    if (s === "PRODUCT_ITEM") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function ServiceRequestListClient(props: PageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const items = props.items ?? [];

    const currentView: ViewKey = useMemo(() => {
        const v = (sp.get("view") || "all").toLowerCase();
        if (v === "draft" || v === "in_progress" || v === "done" || v === "canceled") {
            return v as ViewKey;
        }
        return "all";
    }, [sp]);

    const q = sp.get("q") ?? "";
    const sort = sp.get("sort") ?? "updatedDesc";

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = useState(false);

    const [openBulkAssignVendor, setOpenBulkAssignVendor] = useState(false);
    const [openMaint, setOpenMaint] = useState(false);
    const [maintSrId, setMaintSrId] = useState<string | null>(null);
    const [openLogs, setOpenLogs] = useState(false);
    const [logSrId, setLogSrId] = useState<string>("");
    const [logTitle, setLogTitle] = useState<string>("");

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [currentView, q, sort, props.page]);

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
                draft: props.counts.draft ?? 0,
                in_progress: props.counts.in_progress ?? 0,
                done: props.counts.done ?? 0,
                canceled: props.counts.canceled ?? 0,
            };
        }
        const base: Counts = { all: 0, draft: 0, in_progress: 0, done: 0, canceled: 0 };
        base[currentView] = props.total;
        return base;
    }, [props.counts, props.total, currentView]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function pushWith(next: URLSearchParams) {
        router.push(`${pathname}?${next.toString()}`);
    }

    function setView(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        pushWith(next);
    }

    function applyFilters(form: { q: string; sort: string }) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", form.q.trim() || null);
        setParam(next, "sort", form.sort || "updatedDesc");
        next.set("page", "1");
        pushWith(next);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
        next.delete("sort");
        next.set("page", "1");
        pushWith(next);
    }

    function goPage(p: number) {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        pushWith(next);
    }

    const [formQ, setFormQ] = useState(q);
    const [formSort, setFormSort] = useState(sort);

    useEffect(() => setFormQ(q), [q]);
    useEffect(() => setFormSort(sort), [sort]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Service Requests</h1>
                </div>
                <button
                    type="button"
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => router.push("/admin/orders")}
                >
                    ← Orders
                </button>
            </div>

            <div className="border-b">
                <div className="flex gap-8 items-end">
                    {[
                        ["all", "Tất cả", counts.all],
                        ["draft", "DRAFT", counts.draft],
                        ["in_progress", "IN_PROGRESS", counts.in_progress],
                        ["done", "DONE", counts.done],
                        ["canceled", "CANCELED", counts.canceled],
                    ].map(([key, label, count]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setView(key as ViewKey)}
                            className={`pb-2 text-sm ${currentView === key
                                    ? "border-b-2 border-black font-semibold"
                                    : "text-gray-500"
                                }`}
                        >
                            {label}{" "}
                            <span
                                className={`ml-2 inline-flex items-center justify-center min-w-7 h-6 px-2 rounded-full text-xs ${currentView === key
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {count ?? 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({ q: formQ, sort: formSort });
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tìm kiếm</div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder="refNo / order / service / vendor / notes..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
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
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    >
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
                <div className="mb-3 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} service request đã chọn
                    </span>

                    <button
                        type="button"
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => setOpenBulkAssignVendor(true)}
                    >
                        Gán vendor
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
                                <th className="px-3 py-3">Service</th>
                                <th className="px-3 py-3">Scope / Vendor</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Ngày tạo</th>
                                <th className="px-3 py-3">Link</th>
                                <th className="px-3 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-10 text-center text-gray-500">
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
                                                <div className="font-medium">
                                                    {row.refNo && row.refNo.trim() ? row.refNo : "-"}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ID: {row.id}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-medium">
                                                    {row.serviceName || "-"}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Product: {row.productTitle || "-"}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Note: {row.customerItemNote || "-"}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div>
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 border rounded-full text-xs ${pillClassByScope(
                                                            row.scope
                                                        )}`}
                                                    >
                                                        {(row.scope || "-").toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-sm mt-2">
                                                    {row.vendorName || "-"}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Maintenance: {row.maintenanceCount ?? 0}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 border rounded-full text-xs ${statusPillClass(
                                                        row.status
                                                    )}`}
                                                >
                                                    {(row.status || "-").toUpperCase()}
                                                </span>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="text-sm">{fmtDT(row.createdAt)}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Updated: {fmtDT(row.updatedAt)}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="space-y-1 text-sm">
                                                    {row.orderRefNo ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">
                                                                Order
                                                            </span>{" "}
                                                            <span className="text-gray-600">
                                                                {row.orderRefNo}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top text-right">
                                                <GenericActionMenu
                                                    id={row.id}
                                                    maintenance={{
                                                        onOpen: () => {
                                                            setMaintSrId(row.id);
                                                            setOpenMaint(true);
                                                        },
                                                    }}
                                                    actions={[
                                                        {
                                                            label: "Xem logs",
                                                            onClick: () => {
                                                                setLogSrId(row.id);
                                                                setLogTitle(
                                                                    row.refNo || row.serviceName || row.id
                                                                );
                                                                setOpenLogs(true);
                                                            },
                                                        },
                                                        {
                                                            label: "Copy ID",
                                                            onClick: async () => {
                                                                await navigator.clipboard?.writeText(
                                                                    row.id
                                                                );
                                                            },
                                                        },
                                                    ]}
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

            <BulkAssignVendorModal
                open={openBulkAssignVendor}
                onClose={() => setOpenBulkAssignVendor(false)}
                serviceRequestIds={selectedIds}
                onAssigned={() => {
                    setOpenBulkAssignVendor(false);
                    setSelectedIds([]);
                    setShowBulkBar(false);
                    router.refresh();
                }}
            />

            {maintSrId ? (
                <MaintenanceDrawer
                    open={openMaint}
                    onClose={() => setOpenMaint(false)}
                    serviceRequestId={maintSrId}
                    onChanged={() => router.refresh()}
                />
            ) : null}

            <MaintenanceLogModal
                open={openLogs}
                onClose={() => setOpenLogs(false)}
                serviceRequestId={logSrId}
                title={logTitle}
            />
        </div>
    );
}