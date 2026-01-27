"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ApiRes = {
    rows: any[];
    total: number;
    page: number;
    pageSize: number;
};

export default function ServiceRequestsClient({ initial }: { initial: ApiRes }) {
    const router = useRouter();
    const sp = useSearchParams();

    const q0 = sp.get("q") ?? "";
    const status0 = sp.get("status") ?? "";
    const page0 = Number(sp.get("page") ?? initial.page ?? 1);

    const totalPages = useMemo(() => {
        const ps = initial.pageSize || 20;
        return Math.max(1, Math.ceil((initial.total || 0) / ps));
    }, [initial.total, initial.pageSize]);

    function nav(next: Record<string, string | number | null | undefined>) {
        const p = new URLSearchParams(sp.toString());
        Object.entries(next).forEach(([k, v]) => {
            if (v == null || v === "" || Number.isNaN(v as any)) p.delete(k);
            else p.set(k, String(v));
        });
        router.push(`/admin/service-requests?${p.toString()}`);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Service Requests</h1>
                    <div className="text-sm text-gray-600">
                        Tổng: <b>{initial.total}</b>
                    </div>
                </div>

                <Link className="rounded border px-3 py-2 text-sm hover:bg-gray-50" href="/admin/orders">
                    ← Orders
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-lg border bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-2 flex gap-2">
                        <input
                            defaultValue={q0}
                            placeholder="Tìm theo ID / notes / ref / serial..."
                            className="h-9 w-full rounded border px-3"
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                nav({ q: (e.currentTarget as HTMLInputElement).value, page: 1 });
                            }}
                        />
                        <select
                            defaultValue={status0}
                            className="h-9 rounded border px-2"
                            onChange={(e) => nav({ status: e.target.value, page: 1 })}
                        >
                            <option value="">All status</option>
                            <option value="PENDING">PENDING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DONE">DONE</option>
                            <option value="CANCELED">CANCELED</option>
                        </select>

                        <button
                            className="h-9 rounded bg-black px-3 text-white text-sm"
                            onClick={() => nav({ page: 1 })}
                            type="button"
                        >
                            Lọc
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-2 text-sm">
                        <button
                            className="h-9 rounded border px-3 hover:bg-gray-50 disabled:opacity-60"
                            disabled={page0 <= 1}
                            onClick={() => nav({ page: page0 - 1 })}
                            type="button"
                        >
                            ←
                        </button>
                        <span className="text-gray-600">
                            Page <b>{page0}</b> / <b>{totalPages}</b>
                        </span>
                        <button
                            className="h-9 rounded border px-3 hover:bg-gray-50 disabled:opacity-60"
                            disabled={page0 >= totalPages}
                            onClick={() => nav({ page: page0 + 1 })}
                            type="button"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">ID</th>
                            <th className="px-3 py-2 text-left">Dịch vụ</th>
                            <th className="px-3 py-2 text-left">Order</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-left">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initial.rows.map((r: any) => (
                            <tr key={r.id} className="border-b hover:bg-gray-50">
                                <td className="px-3 py-2">
                                    <Link className="text-blue-600 hover:underline" href={`/admin/service-requests/${r.id}`}>
                                        {r.id}
                                    </Link>
                                </td>
                                <td className="px-3 py-2">
                                    {r.ServiceCatalog?.name ?? r.orderItem?.title ?? "-"}
                                </td>
                                <td className="px-3 py-2">
                                    {r.orderItem?.order?.id ? (
                                        <Link className="hover:underline" href={`/admin/orders/${r.orderItem.order.id}`}>
                                            {r.orderItem.order.id}
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-3 py-2">{r.status}</td>
                                <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                            </tr>
                        ))}
                        {!initial.rows.length && (
                            <tr>
                                <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
