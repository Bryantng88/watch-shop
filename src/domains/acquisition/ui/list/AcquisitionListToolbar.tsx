"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AcquisitionVendorOption } from "./types";

export default function AcquisitionListToolbar({
    vendors,
}: {
    vendors: AcquisitionVendorOption[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const q = sp.get("q") ?? "";
    const vendorId = sp.get("vendorId") ?? "";
    const type = sp.get("type") ?? "";
    const sort = sp.get("sort") ?? "updatedDesc";

    const [formQ, setFormQ] = React.useState(q);
    const [formVendorId, setFormVendorId] = React.useState(vendorId);
    const [formType, setFormType] = React.useState(type);
    const [formSort, setFormSort] = React.useState(sort);

    React.useEffect(() => setFormQ(q), [q]);
    React.useEffect(() => setFormVendorId(vendorId), [vendorId]);
    React.useEffect(() => setFormType(type), [type]);
    React.useEffect(() => setFormSort(sort), [sort]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(e: React.FormEvent) {
        e.preventDefault();

        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", formQ.trim() || null);
        setParam(next, "vendorId", formVendorId || null);
        setParam(next, "type", formType || null);
        setParam(next, "sort", formSort || "updatedDesc");
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

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-medium text-slate-900">Bộ lọc</div>
                    <div className="text-xs text-slate-500">
                        Tìm nhanh phiếu nhập, vendor và kiểu phiếu.
                    </div>
                </div>

                <Link
                    href="/admin/acquisitions/new"
                    className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Tạo phiếu nhập
                </Link>
            </div>

            <form onSubmit={applyFilters} className="space-y-3 border-b border-slate-200 pb-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder="Tìm theo refNo / notes / vendor / item..."
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <select
                            value={formVendorId}
                            onChange={(e) => setFormVendorId(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option value="">Vendor: tất cả</option>
                            {vendors.map((vendor) => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <select
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option value="">Type: tất cả</option>
                            <option value="PURCHASE">PURCHASE</option>
                            <option value="SALE">SALE</option>
                            <option value="RETURN">RETURN</option>
                            <option value="BUY_BACK">BUY_BACK</option>
                            <option value="TRADE_IN">TRADE_IN</option>
                            <option value="CONSIGNMENT">CONSIGNMENT</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={formSort}
                            onChange={(e) => setFormSort(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
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
                    <button
                        type="submit"
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                    >
                        Lọc
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}