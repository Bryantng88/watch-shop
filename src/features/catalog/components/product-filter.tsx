'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import CollapsibleSection from './collapsible-section';
import FilterList from './filter-list';


type BrandItem = { id: string; name: string; count?: number; productCount?: number };
type CompItem = { id: string; name: string; count?: number };
type SizeItem = { id: string; name: string; count?: number; productCount?: number }

function parseSet(params: URLSearchParams, key: string) {
    return new Set((params.get(key)?.split(',') ?? []).filter(Boolean));
}
function setQS(params: URLSearchParams, patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k);
    next.delete('page');
    return `/products?${next.toString()}`;
}
const useDebouncedCallback = (ms = 300) => {
    const t = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
    return useCallback((fn: () => void) => {
        if (t.current) clearTimeout(t.current);
        t.current = setTimeout(fn, ms);
    }, [ms]);
};

export default function FilterSidebar({
    brands,
    complications,
    priceBounds,
    sizes,
}: {
    brands: BrandItem[];
    complications: CompItem[];
    priceBounds: { min: number; max: number };
    sizes: SizeItem[];

}) {
    const router = useRouter();
    const params = useSearchParams();

    // active selections
    const activeBrands = parseSet(params, 'brands');
    const activeComps = parseSet(params, 'complications');
    const activeSizes = parseSet(params, 'sizes');
    // price state
    const [min, setMin] = useState(Number(params.get('priceMin')) || priceBounds.min);
    const [max, setMax] = useState(Number(params.get('priceMax')) || priceBounds.max);
    const debounced = useDebouncedCallback(350);

    // ----- actions -----
    const pushPatch = useCallback((patch: Record<string, string | undefined>, replace = true) => {
        const url = setQS(params, patch);
        replace ? router.replace(url) : router.push(url);
    }, [params, router]);

    const toggleToken = useCallback((setNow: Set<string>, key: string, id: string) => {
        const s = new Set(setNow);
        s.has(id) ? s.delete(id) : s.add(id);
        pushPatch({ [key]: [...s].join(',') || undefined });
    }, [pushPatch]);

    const clearGroup = (key: 'brands' | 'complications' | 'sizes') => pushPatch({ [key]: undefined });
    const clearAll = useCallback(() => {
        pushPatch({
            brands: undefined,
            complications: undefined,
            sizes: undefined,         // fixed: đúng key
            priceMin: undefined,
            priceMax: undefined,
        });
    }, [pushPatch]);
    const applyPrice = useCallback((mn?: number, mx?: number) => {
        pushPatch(
            {
                priceMin: mn != null ? String(mn) : undefined,
                priceMax: mx != null ? String(mx) : undefined,
            },
            false // push vào history
        );
    }, [pushPatch]);

    // auto-apply price (debounced) khi kéo slider
    useEffect(() => {
        debounced(() => startTransition(() => applyPrice(min, max)));
    }, [min, max, debounced, applyPrice]);

    // ----- UI helpers -----
    const VISIBLE = 6;
    const [brandQuery, setBrandQuery] = useState('');
    const [compQuery, setCompQuery] = useState('');

    const filteredBrands = useMemo(
        () => brands.filter(b => b.name.toLowerCase().includes(brandQuery.toLowerCase())),
        [brands, brandQuery]
    );
    const filteredComps = useMemo(
        () => complications.filter(c => c.name.toLowerCase().includes(compQuery.toLowerCase())),
        [complications, compQuery]
    );
    const filteredSizes = sizes;

    return (
        <div className="rounded-xl border-none border-gray-200 bg-white p-4 space-y-2">
            {/* Header + Clear all */}
            <div className="flex items-center justify-between">
                <h3 className="sr-only">Filters</h3>
                {(activeBrands.size || activeComps.size || min !== priceBounds.min || max !== priceBounds.max) && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
                    >
                        Clear all
                    </button>
                )}
            </div>
            {/* Price */}
            <section className="space-y-2">
                <h4 className="font-semibold">Price Range</h4>
                <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={500000}
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                    className="price-slider w-full appearance-none cursor-pointer"
                    aria-label="Maximum price"
                />
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">
                        {min.toLocaleString('vi-VN')} VND — {max.toLocaleString('vi-VN')} VND
                    </span>
                    {/* nút reset price */}
                    {(min !== priceBounds.min || max !== priceBounds.max) && (
                        <button
                            onClick={() => { setMin(priceBounds.min); setMax(priceBounds.max); startTransition(() => applyPrice(priceBounds.min, priceBounds.max)); }}
                            className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </section>

            {/* Brand */}
            {/* BRAND */}
            <CollapsibleSection
                title="Brand"
                countSelected={activeBrands.size}
                totalCount={brands.length}
                onClear={() => pushPatch({ brands: undefined })}
            >
                {/* Search + list */}
                <input
                    value={brandQuery}
                    onChange={(e) => setBrandQuery(e.target.value)}
                    placeholder="Search brand…"
                    className="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <FilterList
                    items={filteredBrands}
                    active={activeBrands}
                    onToggle={(id) => toggleToken(activeBrands, 'brands', id)}
                    countKey="productCount"
                    withSearch={false}       // đã có ô search riêng ở trên
                    visible={VISIBLE}
                />
            </CollapsibleSection>

            {/* COMPLICATION */}
            <CollapsibleSection
                title="Complication"
                countSelected={activeComps.size}
                totalCount={complications.length}
                onClear={() => pushPatch({ complications: undefined })}
            >
                <input
                    value={compQuery}
                    onChange={(e) => setCompQuery(e.target.value)}
                    placeholder="Search complication…"
                    className="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <FilterList
                    items={filteredComps}
                    active={activeComps}
                    onToggle={(id) => toggleToken(activeComps, 'complications', id)}
                    countKey="count"
                    withSearch={false}       /* ô search đã tách riêng */
                    visible={VISIBLE}
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Size"
                countSelected={activeSizes.size}
                totalCount={sizes.length}
                onClear={() => pushPatch({ sizes: undefined })}
            >
                <FilterList
                    items={filteredSizes}
                    active={activeSizes}
                    onToggle={(id) => toggleToken(activeSizes, 'sizes', id)}
                    countKey="productCount"
                    withSearch={false}       // yêu cầu: Size không có search input
                    visible={VISIBLE}
                />
            </CollapsibleSection>

        </div>
    );
}
