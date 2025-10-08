// features/catalog/components/FilterSidebar.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

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
    const priceMin = Number(params.get('priceMin') ?? priceBounds.min);
    const priceMax = Number(params.get('priceMax') ?? priceBounds.max);

    const toggleBrand = (id: string) => {
        const set = new Set(activeBrands);
        set.has(id) ? set.delete(id) : set.add(id);
        const next = new URLSearchParams(params.toString());
        const v = [...set].join(',');
        v ? next.set('brands', v) : next.delete('brands');
        next.delete('page');
        router.push(`/products?${next.toString()}`);
    };

    const applyPrice = (min?: number, max?: number) => {
        const next = new URLSearchParams(params.toString());
        min != null ? next.set('priceMin', String(min)) : next.delete('priceMin');
        max != null ? next.set('priceMax', String(max)) : next.delete('priceMax');
        next.delete('page');
        router.push(`/products?${next.toString()}`);
    };

    return (
        <nav className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-6">
            {/* Price */}
            <section>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Price Range</span>
                    <span className="text-xs text-gray-500">
                        {priceMin.toLocaleString('vi-VN')} – {priceMax.toLocaleString('vi-VN')} VND
                    </span>
                </div>
                {/* bạn có thể thay bằng slider lib; tạm dùng 2 input number */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        className="h-9 w-24 rounded-md border border-gray-300 px-2 text-sm"
                        defaultValue={priceMin}
                        min={priceBounds.min}
                        max={priceMax}
                        onBlur={(e) => applyPrice(Number(e.target.value), priceMax)}
                    />
                    <span className="text-gray-400">–</span>
                    <input
                        type="number"
                        className="h-9 w-24 rounded-md border border-gray-300 px-2 text-sm"
                        defaultValue={priceMax}
                        min={priceMin}
                        max={priceBounds.max}
                        onBlur={(e) => applyPrice(priceMin, Number(e.target.value))}
                    />
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
        </nav>
    );
}