"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ProductType } from "@prisma/client";

type ProductResult = {
    id: string;
    title: string;
    primaryImage?: string | null;
    productType: ProductType;
    sellPrice: number | null;
};

export default function ProductSearchInput({
    value,
    onSelect,
}: {
    value: string;
    onSelect: (p: ProductResult) => void;
}) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<ProductResult[]>([]);
    const [open, setOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            const res = await fetch(`/api/admin/products/search?q=${query}`);
            const data = await res.json();
            setResults(data.items);
            setOpen(true);
        }, 250);

        return () => clearTimeout(t);
    }, [query]);

    return (
        <div className="relative">
            <input
                className="w-full rounded border px-2 py-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setOpen(true)}
            />

            {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 bg-white border shadow-md rounded-md max-h-72 overflow-auto">
                    {results.map((p) => (
                        <div
                            key={p.id}
                            className={clsx(
                                "flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                            )}
                            onClick={() => {
                                onSelect(p);
                                setQuery(p.title);
                                setOpen(false);
                            }}
                        >
                            <Image
                                src={p.primaryImage || "/no-image.png"}
                                width={40}
                                height={40}
                                alt={p.title}
                                className="rounded border"
                            />

                            <div className="flex-1">
                                <div className="font-medium">{p.title}</div>
                                <div className="text-xs text-gray-500">
                                    {p.productType} • {p.sellPrice?.toLocaleString("vi-VN")}₫
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
