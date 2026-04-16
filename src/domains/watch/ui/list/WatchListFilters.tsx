"use client";

import { useState } from "react";

type FilterValues = {
    q: string;
    sku: string;
    brandId: string;
    vendorId: string;
    image: string;
    sort: string;
    saleStage: string;
    opsStage: string;
    missing: string;
};

export default function WatchListFilters({
    values,
    vendors,
    onChange,
}: {
    values: FilterValues;
    vendors: Array<{ id: string; name: string }>;
    onChange: (values: FilterValues) => void;
}) {
    const [local, setLocal] = useState(values);

    function setField<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
        setLocal((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
                <input
                    value={local.q}
                    onChange={(e) => setField("q", e.target.value)}
                    placeholder="Tìm title / model / ref"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />

                <input
                    value={local.sku}
                    onChange={(e) => setField("sku", e.target.value)}
                    placeholder="SKU"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />

                <select
                    value={local.vendorId}
                    onChange={(e) => setField("vendorId", e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                    <option value="">Tất cả vendor</option>
                    {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                        </option>
                    ))}
                </select>

                <select
                    value={local.image}
                    onChange={(e) => setField("image", e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                    <option value="">Ảnh: tất cả</option>
                    <option value="yes">Có ảnh</option>
                    <option value="no">Chưa có ảnh</option>
                </select>

                <select
                    value={local.sort}
                    onChange={(e) => setField("sort", e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                    <option value="">Mới cập nhật</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                </select>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(local)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                    Áp dụng
                </button>
                <button
                    type="button"
                    onClick={() =>
                        onChange({
                            q: "",
                            sku: "",
                            brandId: "",
                            vendorId: "",
                            image: "",
                            sort: "",
                            saleStage: "",
                            opsStage: "",
                            missing: "",
                        })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
                >
                    Xóa lọc
                </button>
            </div>
        </div>
    );
}