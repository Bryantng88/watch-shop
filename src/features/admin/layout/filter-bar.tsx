"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/features/common/use-debounce";
const STATUSES = ["ACTIVE", "HOLD", "SOLD", "CONSIGNED", "HIDDEN"] as const;
type Status = (typeof STATUSES)[number];

type Brand = { id: string; name: string };

export default function AdminProductFilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    // state từ URL (giữ đồng bộ khi back/forward)
    const [q, setQ] = useState(sp.get("q") ?? "");
    const [status, setStatus] = useState<Status | "">((sp.get("status") as Status) ?? "");
    const [brandId, setBrandId] = useState(sp.get("brandId") ?? "");
    const [sort, setSort] = useState(sp.get("sort") ?? "updatedDesc");

    const dq = useDebounce(q, 400);

    // load brand danh mục
    const [brands, setBrands] = useState<Brand[]>([]);
    useEffect(() => {
        (async () => {
            try {
                // có thể dùng /api/admin/brands hoặc /api/catalog/brands tuỳ bạn đã làm
                const res = await fetch("/api/admin/brands?withCount=0");
                const data = await res.json();
                setBrands((data.items ?? data) as Brand[]);
            } catch { /* noop */ }
        })();
    }, []);

    // cập nhật URL query mỗi khi filter đổi
    useEffect(() => {
        const next = new URLSearchParams(sp.toString());
        dq ? next.set("q", dq) : next.delete("q");
        status ? next.set("status", status) : next.delete("status");
        brandId ? next.set("brandId", brandId) : next.delete("brandId");
        sort ? next.set("sort", sort) : next.delete("sort");
        next.set("page", "1"); // reset page khi đổi filter
        router.replace(`${pathname}?${next.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dq, status, brandId, sort]);

    // count filter đang bật
    const activeCount = useMemo(
        () => Number(Boolean(dq)) + Number(Boolean(status)) + Number(Boolean(brandId)) + Number(Boolean(sort && sort !== "updatedDesc")),
        [dq, status, brandId, sort]
    );

    function clearAll() {
        setQ("");
        setStatus("");
        setBrandId("");
        setSort("updatedDesc");
        router.replace(pathname);
    }

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div>
                <label className="block text-xs text-gray-500 mb-1">Search</label>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tên / slug…"
                    className="h-9 w-56 rounded border px-3 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                />
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                    className="h-9 rounded border px-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                >
                    <option value="">Tất cả</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1">Brand</label>
                <select
                    className="h-9 rounded border px-2 text-sm min-w-[10rem]"
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1">Sort</label>
                <select
                    className="h-9 rounded border px-2 text-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="updatedDesc">Updated ↓</option>
                    <option value="updatedAsc">Updated ↑</option>
                    <option value="createdDesc">Created ↓</option>
                    <option value="createdAsc">Created ↑</option>
                    <option value="titleAsc">Title A→Z</option>
                    <option value="titleDesc">Title Z→A</option>
                </select>
            </div>

            <button
                onClick={clearAll}
                className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
                Clear {activeCount ? `(${activeCount})` : ""}
            </button>
        </div>
    );

}
