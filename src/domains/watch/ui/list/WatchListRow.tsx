"use client";

import type { WatchRow } from "./types";

type Props = {
    product: WatchRow;
    checked: boolean;
    canViewCost: boolean;
    canEditPrice: boolean;
    onCheckedChange: (checked: boolean) => void;
    onOpenReadiness: (product: WatchRow) => void;
    onPriceSaved: (productId: string, patch: Partial<WatchRow>) => void;
    onPriceCommit: (
        productId: string,
        field: "minPrice" | "salePrice" | "purchasePrice",
        value: number | null
    ) => Promise<void>;
    onView: (productId: string) => void;
    onEdit: (productId: string) => void;
    onDelete: (productId: string) => void;
    onService: (productId: string) => void;
};

function fmt(v?: number | string | null) {
    if (v == null || v === "") return "—";
    const n = Number(v);
    return Number.isFinite(n) ? new Intl.NumberFormat("vi-VN").format(n) : String(v);
}

export default function WatchListRow({
    product,
    checked,
    canViewCost,
    canEditPrice,
    onCheckedChange,
    onOpenReadiness,
    onPriceSaved,
    onPriceCommit,
    onView,
    onEdit,
    onDelete,
    onService,
}: Props) {
    return (
        <tr className="border-t border-slate-100 align-top">
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                />
            </td>

            <td className="px-4 py-3">
                <div className="flex gap-3">
                    <img
                        src={product.primaryImageUrl || "/placeholder.png"}
                        className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                    />
                    <div className="min-w-0 space-y-1">
                        <div className="line-clamp-2 text-sm font-medium text-slate-950">
                            {product.title ?? "Untitled"}
                        </div>
                        <div className="text-xs text-slate-500">
                            {product.brand ?? "—"} • {product.sku ?? "No SKU"}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <button
                    type="button"
                    onClick={() => onOpenReadiness(product)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50"
                >
                    {product.isReadyToPublish ? "Sẵn sàng" : "Xem readiness"}
                </button>
            </td>

            <td className="px-4 py-3">
                <div className="space-y-2 text-xs">
                    {canViewCost ? <div>Cost: {fmt(product.costPrice)}</div> : null}
                    <div className="flex items-center gap-2">
                        <span>Sale:</span>

                        <span>{fmt(product.salePrice)}</span>

                    </div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="space-y-1 text-xs">
                    <div>{product.status ?? "—"}</div>
                    <div className="text-slate-500">{product.saleState ?? "—"}</div>
                    <div className="text-slate-400">{product.serviceState ?? "—"}</div>
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onView(product.productId)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                        Xem
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(product.productId)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                        Sửa
                    </button>
                    <button
                        type="button"
                        onClick={() => onService(product.productId)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                        Service
                    </button>
                </div>
            </td>
        </tr>
    );
}