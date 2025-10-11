// features/catalog/components/FilterSidebar.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";

function setQS(params: URLSearchParams, key: string, val?: string) {
    const next = new URLSearchParams(params.toString());
    val ? next.set(key, val) : next.delete(key);
    next.delete('page');
    return `/products?${next.toString()}`;
}

export default function FilterSidebar({
    brands,
    priceBounds,
}: {
    brands: { id: string; name: string }[];
    priceBounds: { min: number; max: number };
}) {
    const params = useSearchParams();
    const router = useRouter();

    const activeBrands = new Set((params.get('brands') ?? '').split(',').filter(Boolean));
    const [min, setMin] = useState(Number(params.get("priceMin")) || priceBounds.min);
    const [max, setMax] = useState(Number(params.get("priceMax")) || priceBounds.max);

    const toggleBrand = (id: string) => {
        const set = new Set(activeBrands);
        set.has(id) ? set.delete(id) : set.add(id);
        const next = new URLSearchParams(params.toString());
        const v = [...set].join(',');
        v ? next.set('brands', v) : next.delete('brands');
        next.delete('page');
        router.replace(`/products?${next.toString()}`);
    };

    const applyPrice = (min?: number, max?: number) => {
        const next = new URLSearchParams(params.toString());
        min != null ? next.set('priceMin', String(min)) : next.delete('priceMin');
        max != null ? next.set('priceMax', String(max)) : next.delete('priceMax');
        next.delete('page');
        router.push(`/products?${next.toString()}`);
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-6">
            {/* Price */}
            <section className="space-y-2">
                <h4 className="font-semibold mb-2">Price Range</h4>

                <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={500000}
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                    className="price-slider w-full appearance-none cursor-pointer"
                />

                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={() => applyPrice(min, max)}
                        className="px-4 py-1.5 rounded-full bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700"
                    >
                        Filter
                    </button>
                    <span className="text-xs text-gray-500">
                        {min.toLocaleString('vi-VN')} VND — {max.toLocaleString('vi-VN')} VND
                    </span>
                </div>
            </section>

            {/* Brand */}
            <details open className="group">
                <summary className="cursor-pointer text-sm font-semibold">Brand</summary>
                <ul className="mt-3 space-y-2">
                    {brands.map(b => (
                        <li key={b.id}>
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={activeBrands.has(b.id)}
                                    onChange={() => toggleBrand(b.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                {b.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </details>

            {/* Các nhóm khác — bạn map tương tự khi đã có cột/quan hệ trong DB */}
            {/* Style / Case size / Dial Color / Material / Complication / Category */}
        </div>
    );
}