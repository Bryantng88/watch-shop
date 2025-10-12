'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import CollapsibleSection from './collapsible-section';

type BrandItem = { id: string; name: string; count?: number; productCount?: number };
type CompItem = { id: string; name: string; count?: number };

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
    return useCallback((fn: () => void) => {
        if (t.current) clearTimeout(t.current);
        t.current = setTimeout(fn, ms);
    }, [ms]);
};

export default function FilterSidebar({
    brands,
    complications,
    priceBounds,
}: {
    brands: BrandItem[];
    complications: CompItem[];
    priceBounds: { min: number; max: number };
}) {
    const router = useRouter();
    const params = useSearchParams();

    // active selections
    const activeBrands = parseSet(params, 'brands');
    const activeComps = parseSet(params, 'complications');

    // price state
    const [min, setMin] = useState(Number(params.get('priceMin')) || priceBounds.min);
    const [max, setMax] = useState(Number(params.get('priceMax')) || priceBounds.max);
    const debounced = useDebouncedCallback(350);

    // ----- actions -----
    const pushPatch = (patch: Record<string, string | undefined>, replace = true) => {
        const url = setQS(params, patch);
        replace ? router.replace(url) : router.push(url);
    };

    const toggleToken = (setNow: Set<string>, key: string, id: string) => {
        const s = new Set(setNow);
        s.has(id) ? s.delete(id) : s.add(id);
        pushPatch({ [key]: [...s].join(',') || undefined });
    };

    const clearGroup = (key: 'brands' | 'complications') => pushPatch({ [key]: undefined });
    const clearAll = () => pushPatch({ brands: undefined, complications: undefined, priceMin: undefined, priceMax: undefined });

    const applyPrice = useCallback((mn?: number, mx?: number) => {
        pushPatch({
            priceMin: mn != null ? String(mn) : undefined,
            priceMax: mx != null ? String(mx) : undefined,
        }, false);
    }, [params]);

    // auto-apply price (debounced) khi kéo slider
    useEffect(() => {
        debounced(() => startTransition(() => applyPrice(min, max)));
    }, [min, max, debounced, applyPrice]);

    // ----- UI helpers -----
    const [brandQuery, setBrandQuery] = useState('');
    const [compQuery, setCompQuery] = useState('');
    const [showMoreBrand, setShowMoreBrand] = useState(false);
    const [showMoreComp, setShowMoreComp] = useState(false);
    const VISIBLE = 6;

    const filteredBrands = useMemo(
        () => brands.filter(b => b.name.toLowerCase().includes(brandQuery.toLowerCase())),
        [brands, brandQuery]
    );
    const filteredComps = useMemo(
        () => complications.filter(c => c.name.toLowerCase().includes(compQuery.toLowerCase())),
        [complications, compQuery]
    );

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">

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

                onClear={() => pushPatch({ brands: undefined })} // dùng helper dưới
            >
                {/* search */}
                <input
                    value={brandQuery}
                    onChange={(e) => setBrandQuery(e.target.value)}
                    placeholder="Search brand…"
                    className="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <ul className="space-y-2">
                    {(showMoreBrand ? filteredBrands : filteredBrands.slice(0, 6)).map(b => (
                        <li key={b.id}>
                            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={activeBrands.has(b.id)}
                                        onChange={() => toggleToken(activeBrands, 'brands', b.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                    />
                                    <span>{b.name}</span>
                                </div>

                                {typeof b.productCount === 'number' && (
                                    <span className="text-xs text-gray-400">({b.productCount})</span>
                                )}
                            </label>
                        </li>
                    ))}
                </ul>

                {filteredBrands.length > 6 && (
                    <button
                        onClick={() => setShowMoreBrand(s => !s)}
                        className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline underline-offset-2"
                    >
                        {showMoreBrand ? 'Show less' : `Show more (${filteredBrands.length - 6})`}
                    </button>
                )}
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

                <ul className="space-y-2">
                    {(showMoreComp ? filteredComps : filteredComps.slice(0, 6)).map(c => (
                        <li key={c.id}>
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={activeComps.has(c.id)}
                                    onChange={() => toggleToken(activeComps, 'complications', c.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                <span className="flex-1">{c.name}</span>
                                {typeof c.count === 'number' && <span className="text-xs text-gray-400">(({c.count}))</span>}
                            </label>
                        </li>
                    ))}
                </ul>

                {filteredComps.length > 6 && (
                    <button
                        onClick={() => setShowMoreComp(s => !s)}
                        className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline underline-offset-2"
                    >
                        {showMoreComp ? 'Show less' : `Show more (${filteredComps.length - 6})`}
                    </button>
                )}
            </CollapsibleSection>

        </div>
    );
}
