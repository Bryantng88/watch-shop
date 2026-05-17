"use client";

import { ImageIcon, Search } from "lucide-react";

import { Button, Input } from "@/domains/shared/ui/form/fields";
import { fmtMoney } from "@/old_files/orderOLD/ui/order-ui.helpers";

import type { ProductSearchItem } from "./types";

type Props = {
    query: string;
    results: ProductSearchItem[];
    searching?: boolean;
    disabled?: boolean;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
    onAddProduct: (product: ProductSearchItem) => void;
};

export default function OrderProductSearchPanel({
    query,
    results,
    searching,
    disabled,
    onQueryChange,
    onSearch,
    onAddProduct,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                <Input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Tìm sản phẩm theo SKU / title"
                    disabled={disabled}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            onSearch();
                        }
                    }}
                />

                <Button
                    type="button"
                    variant="outline"
                    onClick={onSearch}
                    disabled={searching || disabled}
                >
                    <Search className="mr-2 h-4 w-4" />
                    {searching ? "Đang tìm..." : "Tìm"}
                </Button>
            </div>

            {results.length ? (
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {results.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => onAddProduct(product)}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
                        >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                {product.primaryImageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={product.primaryImageUrl}
                                        alt={product.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-900">
                                    {product.title}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    SKU: {product.sku || "-"} · {fmtMoney(product.price)}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
