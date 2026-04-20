"use client";

import Link from "next/link";
import {
    MoreHorizontal,
    ImageIcon,
    FileText,
    Wrench,
    Eye,
    Pencil,
    ShoppingCart,
    Hammer,
    HandCoins,
    Trash2,
} from "lucide-react";
import type { WatchRow } from "./types";
import {
    contentStatusText,
    formatMoney,
    formatRelativeStatus,
    imageStatusText,
    serviceStatusText,
} from "./helpers";

type Props = {
    product: WatchRow;
    checked: boolean;
    canViewCost?: boolean;
    onCheckedChange: (checked: boolean) => void;

    onView?: (row: WatchRow) => void;
    onEdit?: (row: WatchRow) => void;
    onDelete?: (row: WatchRow) => void;
    onService?: (row: WatchRow) => void;
    onQuickOrder?: (row: WatchRow) => void;
    onConsign?: (row: WatchRow) => void;
};

function ReadinessLine({
    icon,
    label,
    value,
    ok,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    ok: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}
                <span>{label}</span>
            </div>
            <div
                className={`font-medium ${ok ? "text-emerald-600" : "text-rose-500"
                    }`}
            >
                {value}
            </div>
        </div>
    );
}

function Thumb({ src, alt }: { src?: string | null; alt: string }) {
    if (!src) {
        return (
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <ImageIcon className="h-5 w-5 text-slate-400" />
            </div>
        );
    }

    return (
        <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
            />
        </div>
    );
}

function RowActions({
    row,
    onView,
    onEdit,
    onDelete,
    onService,
    onQuickOrder,
    onConsign,
}: {
    row: WatchRow;
    onView?: (row: WatchRow) => void;
    onEdit?: (row: WatchRow) => void;
    onDelete?: (row: WatchRow) => void;
    onService?: (row: WatchRow) => void;
    onQuickOrder?: (row: WatchRow) => void;
    onConsign?: (row: WatchRow) => void;
}) {
    const actions = [
        onView
            ? {
                key: "view",
                label: "Xem",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => onView(row),
            }
            : null,
        onEdit
            ? {
                key: "edit",
                label: "Sửa",
                icon: <Pencil className="h-4 w-4" />,
                onClick: () => onEdit(row),
            }
            : null,
        onQuickOrder
            ? {
                key: "quick-order",
                label: "Quick order",
                icon: <ShoppingCart className="h-4 w-4" />,
                onClick: () => onQuickOrder(row),
            }
            : null,
        onService
            ? {
                key: "service",
                label: "Service",
                icon: <Hammer className="h-4 w-4" />,
                onClick: () => onService(row),
            }
            : null,
        onConsign
            ? {
                key: "consign",
                label: "Consign",
                icon: <HandCoins className="h-4 w-4" />,
                onClick: () => onConsign(row),
            }
            : null,
        onDelete
            ? {
                key: "delete",
                label: "Xóa",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => onDelete(row),
            }
            : null,
    ].filter(Boolean) as Array<{
        key: string;
        label: string;
        icon: React.ReactNode;
        onClick: () => void;
    }>;

    if (actions.length === 0) {
        return (
            <button
                type="button"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>
        );
    }

    return (
        <div className="flex justify-end">
            <details className="relative">
                <summary className="list-none cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                    <MoreHorizontal className="h-5 w-5" />
                </summary>

                <div className="absolute right-0 z-20 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    {actions.map((action) => (
                        <button
                            key={action.key}
                            type="button"
                            onClick={action.onClick}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            </details>
        </div>
    );
}

export default function WatchListRow({
    product,
    checked,
    canViewCost = true,
    onCheckedChange,
    onView,
    onEdit,
    onDelete,
    onService,
    onQuickOrder,
    onConsign,
}: Props) {
    return (
        <tr className="border-t border-slate-100 align-top hover:bg-slate-50/40">
            <td className="px-4 py-5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                />
            </td>

            <td className="px-4 py-5">
                <div className="flex min-w-[340px] items-start gap-3">
                    <Thumb src={product.imageUrl} alt={product.title} />

                    <div className="min-w-0 flex-1 space-y-1">
                        <Link
                            href={`/admin/watches/${product.productId}/edit`}
                            className="line-clamp-2 text-[15px] font-semibold text-slate-900 hover:text-blue-700"
                        >
                            {product.title}
                        </Link>

                        <div className="text-xs text-slate-500">
                            {(product.brandName || "-").toLowerCase()} · watch
                        </div>

                        <div className="text-xs text-slate-400">
                            SKU: {product.sku || "-"}
                        </div>

                        <div className="pt-1 text-sm text-slate-600">
                            {formatRelativeStatus(product)}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-5">
                <div className="min-w-[220px] space-y-2">
                    <ReadinessLine
                        icon={<FileText className="h-4 w-4" />}
                        label="Content"
                        value={contentStatusText(product)}
                        ok={product.contentReady}
                    />
                    <ReadinessLine
                        icon={<ImageIcon className="h-4 w-4" />}
                        label="Image"
                        value={imageStatusText(product)}
                        ok={product.imageReady}
                    />
                    <ReadinessLine
                        icon={<Wrench className="h-4 w-4" />}
                        label="Service"
                        value={serviceStatusText(product)}
                        ok={product.serviceReady}
                    />
                </div>
            </td>

            <td className="px-4 py-5">
                <div className="min-w-[160px] space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Bán</span>
                        <span className="font-medium text-orange-600">
                            {formatMoney(product.salePrice)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Sale</span>
                        <span className="font-medium text-slate-700">
                            {formatMoney(product.listPrice)}
                        </span>
                    </div>

                    {canViewCost ? (
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Mua</span>
                            <span className="font-medium text-slate-700">
                                {formatMoney(product.costPrice)}
                            </span>
                        </div>
                    ) : null}
                </div>
            </td>

            <td className="px-4 py-5">
                <div className="min-w-[120px] text-sm text-slate-600">
                    {product.updatedAt
                        ? new Date(product.updatedAt).toLocaleString("vi-VN")
                        : "-"}
                </div>
            </td>

            <td className="px-4 py-5 text-right">
                <RowActions
                    row={product}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onService={onService}
                    onQuickOrder={onQuickOrder}
                    onConsign={onConsign}
                />
            </td>
        </tr>
    );
}