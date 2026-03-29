"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GenericActionMenu from "../../__components/GenericActionMenu";
import BulkAssignTechnicianModal from "./BulkAssignTechnicianModal";
import MaintenanceDrawer from "./MaintenanceDrawer";
import MaintenanceLogModal from "./MaintenaceLogModel";
import DotLabel from "../../__components/DotLabel";

import StatusBadge from "@/components/badges/StatusBadge";
import SegmentTabs from "@/components/tabs/SegmenTabs";

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
    technicianName: string | null;
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

function scopeTone(scope?: string | null): "blue" | "orange" | "green" {
    const s = (scope || "").toUpperCase();
    if (s === "WITH_PURCHASE" || s === "INTERNAL") return "blue";
    if (s === "CUSTOMER_OWNED") return "orange";
    return "green";
}

function formatScope(scope?: string | null) {
    const s = (scope || "-").toUpperCase();
    if (s === "WITH_PURCHASE") return "hàng shop";
    if (s === "CUSTOMER_OWNED") return "hàng khách";
    return s.replaceAll("_", " ").toLowerCase();
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

    function setView(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    const q = sp.get("q") ?? "";
    const sort = sp.get("sort") ?? "updatedDesc";

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = useState(false);

    const [openBulkAssignTechnician, setOpenBulkAssignTechnician] = useState(false);
    const [openMaint, setOpenMaint] = useState(false);
    const [maintSrId, setMaintSrId] = useState<string | null>(null);
    const [openLogs, setOpenLogs] = useState(false);
    const [logSrId, setLogSrId] = useState<string>("");
    const [logTitle, setLogTitle] = useState<string>("");

    const completeOne = async (id: string) => {
        const res = await fetch(`/api/admin/service-requests/${id}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error(await res.text());
        router.refresh();
    };

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [currentView, q, sort, props.page]);

    useEffect(() => {
        setShowBulkBar(selectedIds.length > 0);
    }, [selectedIds.length]);

    const displayItems = items;
    const pageIds = useMemo(() => displayItems.map((x) => x.id), [displayItems]);
    const allChecked = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    const someChecked = pageIds.some((id) => selectedIds.includes(id)) && !allChecked;

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
        return {
            all: currentView === "all" ? props.total : 0,
            draft: currentView === "draft" ? props.total : 0,
            in_progress: currentView === "in_progress" ? props.total : 0,
            done: currentView === "done" ? props.total : 0,
            canceled: currentView === "canceled" ? props.total : 0,
        };
    }, [props.counts, props.total, currentView]);

    const [formQ, setFormQ] = useState(q);
    const [formSort, setFormSort] = useState(sort);

    useEffect(() => setFormQ(q), [q]);
    useEffect(() => setFormSort(sort), [sort]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(form: { q: string; sort: string }) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", form.q.trim() || null);
        setParam(next, "sort", form.sort || "updatedDesc");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
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
                <h1 className="text-2xl font-semibold">Service Requests</h1>
                <button
                    type="button"
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => router.push("/admin/orders")}
                >
                    ← Orders
                </button>
            </div>

            <SegmentTabs
                active={currentView}
                onChange={(v) => setView(v as ViewKey)}
                tabs={[
                    { key: "all", label: "Tất cả", count: counts.all },
                    { key: "draft", label: "DRAFT", count: counts.draft },
                    { key: "in_progress", label: "IN_PROGRESS", count: counts.in_progress },
                    { key: "done", label: "DONE", count: counts.done },
                    { key: "canceled", label: "CANCELED", count: counts.canceled },
                ]}
            />

            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({ q: formQ, sort: formSort });
                }}
            >
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div>
                        <div className="mb-1 text-xs text-gray-500">Tìm kiếm</div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder="refNo / order / service / thợ / vendor / notes..."
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <div className="mb-1 text-xs text-gray-500">Sắp xếp</div>
                        <select
                            value={formSort}
                            onChange={(e) => setFormSort(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="updatedDesc">Cập nhật ↓</option>
                            <option value="updatedAsc">Cập nhật ↑</option>
                            <option value="createdDesc">Tạo ↓</option>
                            <option value="createdAsc">Tạo ↑</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                        Lọc
                    </button>
                    <button type="button" onClick={clearFilters} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                        Clear
                    </button>
                    <div className="ml-auto text-sm text-gray-600">
                        Đã chọn: <b>{selectedIds.length}</b>
                    </div>
                </div>
            </form>

            {showBulkBar && (
                <div className="flex items-center gap-4 rounded border bg-blue-50 p-3">
                    <span className="font-medium text-blue-700">{selectedIds.length} service request đã chọn</span>
                    <button
                        type="button"
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => setOpenBulkAssignTechnician(true)}
                    >
                        Gán thợ
                    </button>
                    <button
                        className="rounded border px-3 py-1 text-sm"
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

            <div className="overflow-hidden rounded-xl border">
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
                                                setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
                                            } else {
                                                setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-3 py-3">RefNo</th>
                                <th className="px-3 py-3">Service</th>
                                <th className="px-3 py-3">Nguồn / xử lý</th>
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
                                            <td className="align-middle px-3 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds((prev) => Array.from(new Set([...prev, row.id])));
                                                        } else {
                                                            setSelectedIds((prev) => prev.filter((id) => id !== row.id));
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td className="align-top px-3 py-4">
                                                <div className="text-sm font-medium">{row.refNo || "-"}</div>
                                                <div className="mt-1 text-xs text-gray-500">ID: {row.id}</div>
                                            </td>

                                            <td className="align-top px-3 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-14 w-14 overflow-hidden rounded border bg-gray-50">
                                                        {row.primaryImageUrlSnapshot ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={row.primaryImageUrlSnapshot} alt={row.productTitle || row.serviceName || "product"} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">No image</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{row.serviceName || "-"}</div>
                                                        <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">product · {row.productTitle || "-"}</div>
                                                        <div className="mt-1 text-xs text-gray-500">SKU: {row.skuSnapshot || "-"}</div>
                                                        <div className="mt-1 text-xs text-gray-500">Note: {row.customerItemNote || "-"}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="align-top px-3 py-4">
                                                <DotLabel label={formatScope(row.scope)} tone={scopeTone(row.scope)} />
                                                <div className="mt-2 text-sm">
                                                    <div>Thợ: <span className="font-medium">{row.technicianName || "Chưa gán"}</span></div>
                                                    <div className="mt-1">Vendor: <span className="font-medium">{row.vendorName || "-"}</span></div>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">Maintenance: {row.maintenanceCount ?? 0}</div>
                                            </td>

                                            <td className="align-middle px-3 py-4">
                                                <StatusBadge status={row.status} />
                                            </td>

                                            <td className="align-top px-3 py-4">
                                                <div className="text-sm">{fmtDT(row.createdAt)}</div>
                                                <div className="mt-1 text-xs text-gray-500">Updated: {fmtDT(row.updatedAt)}</div>
                                            </td>

                                            <td className="align-middle px-3 py-4">
                                                {row.orderRefNo ? (
                                                    <div className="text-sm">
                                                        <span className="font-medium text-blue-600">Order</span>{" "}
                                                        <span className="text-gray-600">{row.orderRefNo}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>

                                            <td className="px-3 py-4 text-right align-middle">
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
                                                                setLogTitle(row.refNo || row.serviceName || row.id);
                                                                setOpenLogs(true);
                                                            },
                                                        },
                                                        {
                                                            label: "Kết thúc / DONE",
                                                            hidden:
                                                                row.status === "COMPLETED" || row.status === "DELIVERED" || row.status === "CANCELED",
                                                            onClick: async () => {
                                                                await completeOne(row.id);
                                                            },
                                                        },
                                                        {
                                                            label: "Copy ID",
                                                            onClick: async () => {
                                                                await navigator.clipboard?.writeText(row.id);
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
                        className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        disabled={props.page <= 1}
                        onClick={() => goPage(Math.max(1, props.page - 1))}
                    >
                        ← Trước
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        disabled={props.page >= props.totalPages}
                        onClick={() => goPage(Math.min(props.totalPages, props.page + 1))}
                    >
                        Sau →
                    </button>
                </div>
            </div>

            <BulkAssignTechnicianModal
                open={openBulkAssignTechnician}
                onClose={() => setOpenBulkAssignTechnician(false)}
                serviceRequestIds={selectedIds}
                onAssigned={() => {
                    setOpenBulkAssignTechnician(false);
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
