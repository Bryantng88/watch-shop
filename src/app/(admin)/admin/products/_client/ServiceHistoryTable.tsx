"use client";

import Link from "next/link";
import DotLabel from "../../__components/DotLabel";

export type ServiceHistoryLog = {
    id: string;
    eventType?: string | null;
    vendorName?: string | null;
    notes?: string | null;
    totalCost?: number | null;
    currency?: string | null;
    servicedAt?: string | null;
    createdAt?: string | null;
};

export type ServiceHistoryRow = {
    id: string;
    refNo?: string | null;
    status?: string | null;
    scope?: string | null;
    notes?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    vendorName?: string | null;
    serviceCatalog?: { id: string; code?: string | null; name: string } | null;
    order?: { id: string; refNo?: string | null } | null;
    maintenanceCount?: number;
    latestLogs?: ServiceHistoryLog[];
    detailHref?: string | null;
};

function fmtDT(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function fmtMoney(value?: number | null, currency = "VND") {
    if (value == null) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(Number(value))} ${currency}`;
}

export default function ServiceHistoryTable({ rows }: { rows: ServiceHistoryRow[] }) {
    if (!rows.length) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
                Chưa có lịch sử service cho sản phẩm này.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-700">
                    <tr>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3">Vendor</th>
                        <th className="px-4 py-3">Order</th>
                        <th className="px-4 py-3">Chi tiết</th>
                        <th className="px-4 py-3">Cập nhật</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        const detailHref = row.detailHref || `/admin/services?focus=${row.id}`;
                        return (
                            <tr key={row.id} className="align-top border-t">
                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">
                                        {row.serviceCatalog?.name || row.refNo || row.id}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {row.serviceCatalog?.code ? `${row.serviceCatalog.code} · ` : ""}
                                        {row.refNo || row.id}
                                    </div>
                                    {row.notes ? <div className="mt-2 text-xs text-gray-600">{row.notes}</div> : null}
                                    {row.latestLogs?.length ? (
                                        <div className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3">
                                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                Log gần nhất ({row.maintenanceCount ?? row.latestLogs.length})
                                            </div>
                                            {row.latestLogs.map((log) => (
                                                <div key={log.id} className="rounded border bg-white p-2 text-xs text-gray-700">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-medium text-gray-900">{log.eventType || "NOTE"}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span>{fmtDT(log.servicedAt || log.createdAt)}</span>
                                                        {log.vendorName ? (
                                                            <>
                                                                <span className="text-gray-400">•</span>
                                                                <span>{log.vendorName}</span>
                                                            </>
                                                        ) : null}
                                                        {log.totalCost != null ? (
                                                            <>
                                                                <span className="text-gray-400">•</span>
                                                                <span>{fmtMoney(log.totalCost, log.currency || "VND")}</span>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                    {log.notes ? <div className="mt-1 whitespace-pre-wrap">{log.notes}</div> : null}
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </td>
                                <td className="px-4 py-4">
                                    <DotLabel label={row.status || "-"} tone={row.status === "COMPLETED" || row.status === "DELIVERED" ? "green" : row.status === "CANCELED" ? "gray" : "blue"} />
                                </td>
                                <td className="px-4 py-4">{row.vendorName || "-"}</td>
                                <td className="px-4 py-4">{row.order?.refNo || "-"}</td>
                                <td className="px-4 py-4">
                                    {detailHref ? (
                                        <Link
                                            href={detailHref}
                                            className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                        >
                                            Mở chi tiết
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{fmtDT(row.updatedAt || row.createdAt)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
