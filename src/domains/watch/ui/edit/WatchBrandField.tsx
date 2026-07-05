"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Check, Loader2, Plus, Search, X } from "lucide-react";
import {
    createQuickBrand,
    searchBrandOptions,
} from "../../client/form/watch-brand.actions";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { Button, FieldLabel, Input } from "./shared";

type BrandOption = {
    id: string;
    name: string;
    slug?: string | null;
};

type Props = {
    value: string;
    brands: BrandOption[];
    onBrandsChange: (brands: BrandOption[]) => void;
    onChange: (brandId: string) => void;
};

function mergeBrands(current: BrandOption[], incoming: BrandOption[]) {
    const byId = new Map<string, BrandOption>();

    for (const item of [...current, ...incoming]) {
        if (!item?.id) continue;
        byId.set(item.id, item);
    }

    return Array.from(byId.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

function errorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function WatchBrandField({
    value,
    brands,
    onBrandsChange,
    onChange,
}: Props) {
    const notify = useNotify();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<BrandOption[]>([]);
    const [searchPending, startSearchTransition] = useTransition();
    const [createPending, startCreateTransition] = useTransition();

    const selectedBrand = useMemo(
        () => brands.find((brand) => brand.id === value) ?? null,
        [brands, value],
    );

    const visibleOptions = useMemo(
        () => mergeBrands(brands, results).slice(0, 30),
        [brands, results],
    );

    useEffect(() => {
        if (!open) return;

        const timeoutId = window.setTimeout(() => {
            startSearchTransition(async () => {
                try {
                    const next = await searchBrandOptions(query);
                    setResults(next);
                } catch (error) {
                    notify.error({
                        title: "Không thể tải brand",
                        message: errorMessage(error, "Có lỗi xảy ra khi tìm brand."),
                    });
                }
            });
        }, 180);

        return () => window.clearTimeout(timeoutId);
    }, [notify, open, query]);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (target && wrapperRef.current?.contains(target)) return;
            setOpen(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    const handleSelect = (brand: BrandOption) => {
        onBrandsChange(mergeBrands(brands, [brand]));
        onChange(brand.id);
        setQuery("");
        setOpen(false);
    };

    const handleCreate = () => {
        const cleanName = name.trim();
        if (!cleanName) return;

        startCreateTransition(async () => {
            try {
                const brand = await createQuickBrand(cleanName);
                onBrandsChange(mergeBrands(brands, [brand]));
                onChange(brand.id);
                setResults((prev) => mergeBrands(prev, [brand]));
                setName("");
                setCreating(false);
                setQuery("");
                setOpen(false);
                notify.success({
                    title: "Đã tạo brand",
                    message: `Brand ${brand.name} đã được chọn cho watch này.`,
                });
            } catch (error) {
                notify.error({
                    title: "Không thể tạo brand",
                    message: errorMessage(error, "Có lỗi xảy ra khi tạo brand."),
                });
            }
        });
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="flex items-center justify-between gap-3">
                <FieldLabel>Brand</FieldLabel>

                {!creating ? (
                    <button
                        type="button"
                        onClick={() => {
                            setCreating(true);
                            setOpen(false);
                        }}
                        className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Brand mới
                    </button>
                ) : null}
            </div>

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-10 w-full items-center justify-between gap-2 border-0 border-b border-slate-200 bg-transparent px-0 text-left text-sm text-slate-900 outline-none transition hover:border-slate-400"
            >
                <span className={selectedBrand ? "" : "text-slate-400"}>
                    {selectedBrand?.name ?? "Chọn brand"}
                </span>
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
            </button>

            {open ? (
                <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-2">
                        <Input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Tìm brand..."
                        />
                    </div>

                    <div className="max-h-64 overflow-y-auto py-1">
                        {searchPending ? (
                            <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang tải brand...
                            </div>
                        ) : visibleOptions.length ? (
                            visibleOptions.map((brand) => {
                                const selected = brand.id === value;

                                return (
                                    <button
                                        key={brand.id}
                                        type="button"
                                        onClick={() => handleSelect(brand)}
                                        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <span className="truncate">{brand.name}</span>
                                        {selected ? (
                                            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                        ) : null}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-3 text-sm text-slate-500">
                                Không tìm thấy brand phù hợp.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {creating ? (
                <div className="mt-3 rounded-2xl bg-indigo-50/60 p-3 ring-1 ring-inset ring-indigo-100">
                    <div className="flex items-end gap-2">
                        <div className="min-w-0 flex-1">
                            <FieldLabel>Tên brand mới</FieldLabel>
                            <Input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Ví dụ: Universal Genève"
                            />
                        </div>

                        <Button
                            type="button"
                            disabled={createPending || !name.trim()}
                            onClick={handleCreate}
                        >
                            {createPending ? "Đang thêm" : "Thêm"}
                        </Button>

                        <button
                            type="button"
                            onClick={() => {
                                setName("");
                                setCreating(false);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
