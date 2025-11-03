// app/(admin)/admin/acquisitions/components/Drawer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type AcqDetail = {
    id: string;
    refNo: string | null;
    acquisitionStt: string;
    acquiredAt: string | null;
    cost: number | null;
    currency: string | null;
    notes: string | null;
    vendor?: { id: string; name: string } | null;
    items: Array<{ id: string; title: string; quantity: number; unitCost: number }>;
};

export default function DrawerHost() {
    const sp = useSearchParams();
    const router = useRouter();
    const id = sp.get("view");             // query param
    const [data, setData] = useState<AcqDetail | null>(null);
    const [loading, setLoading] = useState(false);

    // Build URL w/o 'view'
    const closeHref = useMemo(() => {
        const q = new URLSearchParams(sp.toString());
        q.delete("view");
        return `?${q.toString()}`;
    }, [sp]);

    useEffect(() => {
        if (!id) { setData(null); return; }
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`/admin/acquisitions/api/${id}`, { cache: "no-store" });
                const json = await res.json();
                if (!cancelled) setData(json);
            } finally { if (!cancelled) setLoading(false); }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (!id) return null;

    return (
        <div className="fixed inset-0 z-50">
            <a href={closeHref} className="absolute inset-0 bg-black/40" aria-label="Đóng" />
            <aside className="absolute right-0 top-0 h-full w-full max-w-[720px] bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <div className="text-sm text-gray-500">Phiếu nhập</div>
                        <div className="text-base font-semibold">
                            {loading ? "Đang tải…" : `${data?.refNo ?? "-"} • ${data?.vendor?.name ?? "-"}`}
                        </div>
                    </div>
                    <a href={closeHref} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">Đóng</a>
                </div>

                <div className="flex-1 overflow-auto px-4 py-4 space-y-6">
                    {loading || !data ? (
                        <div className="text-gray-500">Đang tải chi tiết…</div>
                    ) : (
                        <>
                            <section className="grid grid-cols-2 gap-4">
                                <Info label="Trạng thái" value={data.acquisitionStt} />
                                <Info label="Ngày nhập" value={data.acquiredAt ? new Date(data.acquiredAt).toLocaleString("vi-VN") : "-"} />
                                <Info label="Tổng tiền" value={
                                    data.cost == null ? "-" : new Intl.NumberFormat("vi-VN").format(Number(data.cost)) + " " + (data.currency ?? "VND")
                                } />
                                <Info label="Ghi chú" value={data.notes ?? "-"} />
                            </section>

                            <section>
                                <div className="text-sm font-semibold mb-2">Sản phẩm</div>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left">Sản phẩm</th>
                                                <th className="px-3 py-2 text-right">SL</th>
                                                <th className="px-3 py-2 text-right">Đơn giá</th>
                                                <th className="px-3 py-2 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.map((it) => (
                                                <tr key={it.id} className="border-t">
                                                    <td className="px-3 py-2">{it.title}</td>
                                                    <td className="px-3 py-2 text-right">{it.quantity}</td>
                                                    <td className="px-3 py-2 text-right">{fmt(it.unitCost, data.currency)}</td>
                                                    <td className="px-3 py-2 text-right">{fmt(it.unitCost * it.quantity, data.currency)}</td>
                                                </tr>
                                            ))}
                                            {data.items.length === 0 && (
                                                <tr><td className="px-3 py-4 text-center text-gray-500" colSpan={4}>Chưa có dòng nào</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <div className="border-t px-4 py-3 flex justify-end gap-2">
                    {id && (
                        <a href={`/admin/acquisitions/${id}`} className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
                            Xem chi tiết
                        </a>
                    )}
                </div>
            </aside>
        </div>
    );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className="mt-1">{value}</div>
        </div>
    );
}
function fmt(n: number, cur?: string | null) {
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + (cur ? ` ${cur}` : "");
}
