"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
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
        <form onSubmit={applyFilters} className="space-y-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={formQ}
                        onChange={(e) => setFormQ(e.target.value)}
                        placeholder="Tìm refNo, vendor, item..."
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-slate-400"
                    />
                </div>

                <select
                    value={formVendorId}
                    onChange={(e) => setFormVendorId(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400 xl:w-[220px]"
                >
                    <option value="">Vendor: tất cả</option>
                    {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                        </option>
                    ))}
                </select>

                <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400 xl:w-[190px]"
                >
                    <option value="">Type: tất cả</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="SALE">Sale</option>
                    <option value="RETURN">Return</option>
                    <option value="BUY_BACK">Buy back</option>
                    <option value="TRADE_IN">Trade in</option>
                    <option value="CONSIGNMENT">Consignment</option>
                </select>

                <select
                    value={formSort}
                    onChange={(e) => setFormSort(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400 xl:w-[170px]"
                >
                    <option value="updatedDesc">Cập nhật ↓</option>
                    <option value="updatedAsc">Cập nhật ↑</option>
                    <option value="createdDesc">Tạo ↓</option>
                    <option value="createdAsc">Tạo ↑</option>
                    <option value="acquiredDesc">Acquired ↓</option>
                    <option value="acquiredAsc">Acquired ↑</option>
                </select>

                <button
                    type="submit"
                    className="h-12 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Lọc
                </button>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="h-12 rounded-2xl px-4 text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                    Xóa lọc
                </button>

                <Link
                    href="/admin/acquisitions/new"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Tạo phiếu nhập
                </Link>
            </div>
        </form>
    );
}