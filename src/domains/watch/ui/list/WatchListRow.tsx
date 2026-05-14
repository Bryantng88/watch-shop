"use client";

import { cn } from "@/lib/utils";
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
    contentStatusTone,
    formatMoney,
    specStatusText,
    specStatusTone,
    formatDateTime
} from "./helpers";
import RowActions from "@/domains/shared/ui/list/RowActions";
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

function Thumb({ src, alt }: { src?: string | null; alt: string }) {
    if (!src) {
        return (
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <ImageIcon className="h-5 w-5 text-slate-400" />
            </div>
        );
    }

    return (
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={src} alt={alt} className="h-full w-full object-cover" />
        </div>
    );
}


function WatchReadinessSummary({ row }: { row: WatchRow }) {
    return (
        <div className="mt-2 flex items-center gap-2.5">
            <span
                title={row.contentReady ? "Đã có content" : "Chưa có content"}
                className={row.contentReady ? "text-emerald-600" : "text-rose-500"}
            >
                <FileText className="h-4 w-4" />
            </span>

            <span
                title={row.imageReady ? "Đã có ảnh" : "Chưa có ảnh"}
                className={row.imageReady ? "text-emerald-600" : "text-rose-500"}
            >
                <ImageIcon className="h-4 w-4" />
            </span>

            <span
                title={row.serviceReady ? "Không cần service / đã xong" : "Đang cần service"}
                className={row.serviceReady ? "text-emerald-600" : "text-rose-500"}
            >
                <Wrench className="h-4 w-4" />
            </span>
        </div>
    );
}


export default function WatchListRow({
    product,
    checked,
    onCheckedChange,
    onView,
    onEdit,
    onDelete,
    onService,
    onQuickOrder,
    onConsign,
}: Props) {
    const isRecent =
        product.updatedAt &&
        Date.now() - new Date(product.updatedAt).getTime() <
        1000 * 60 * 60 * 24;
    return (
        <tr className="border-t border-slate-100 align-middle hover:bg-slate-50/40">
            <td className="px-4 py-4">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                />
            </td>

            <td className="px-4 py-4">
                <div className="flex min-w-[460px] items-start gap-3">
                    <Thumb src={product.imageUrl} alt={product.title} />

                    <div className="min-w-0 flex-1">
                        <Link
                            href={`/admin/watches/${product.productId}/edit`}
                            className="line-clamp-2 text-[15px] font-semibold text-slate-900 hover:text-blue-700"
                        >
                            {product.title}
                        </Link>



                        <div className="mt-1 text-xs text-slate-400">
                            SKU: {product.sku || "-"}
                            <div className="font-mono text-[11px] text-slate-400">
                                PID: {product.productId || "-"}
                            </div>
                        </div>


                        <WatchReadinessSummary row={product} />
                    </div>
                </div>
            </td>

            <td className="px-4 py-4">
                <span
                    className={`inline-flex min-w-[96px] justify-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${contentStatusTone(
                        product
                    )}`}
                >
                    {contentStatusText(product)}
                </span>
            </td>

            <td className="px-4 py-4">
                <div className="min-w-[120px] text-sm font-semibold text-orange-600">
                    {formatMoney(product.salePrice)}
                </div>
            </td>
            <td className="px-4 py-4 align-middle">
                <div className="text-sm text-slate-700">
                    {formatDateTime(product.createdAt)}
                </div>
            </td>

            <td className="px-4 py-4 align-middle">
                <div
                    className={cn(
                        "text-sm",
                        isRecent
                            ? "font-semibold text-emerald-500"
                            : "text-slate-700"
                    )}
                >
                    {formatDateTime(product.updatedAt)}
                </div>
            </td>
            <td className="px-4 py-4 align-middle">
                <div className="text-sm font-medium text-slate-700">
                    {product.lastUpdatedBy?.name ||
                        product.lastUpdatedBy?.email ||
                        "-"}
                </div>
            </td>
            <td className="px-4 py-4 text-right">
                <RowActions
                    row={product}
                    actions={[
                        onView && {
                            key: "view",
                            label: "Xem",
                            icon: <Eye className="h-4 w-4" />,
                            onClick: onView,
                        },
                        onEdit && {
                            key: "edit",
                            label: "Sửa",
                            icon: <Pencil className="h-4 w-4" />,
                            onClick: onEdit,
                        },
                        onQuickOrder && {
                            key: "quick-order",
                            label: "Quick order",
                            icon: <ShoppingCart className="h-4 w-4" />,
                            onClick: onQuickOrder,
                        },
                        onService && {
                            key: "service",
                            label: "Service",
                            icon: <Hammer className="h-4 w-4" />,
                            onClick: onService,
                        },
                        onConsign && {
                            key: "consign",
                            label: "Consign",
                            icon: <HandCoins className="h-4 w-4" />,
                            onClick: onConsign,
                        },
                        onDelete && {
                            key: "delete",
                            label: "Xóa",
                            icon: <Trash2 className="h-4 w-4" />,
                            tone: "danger",
                            separatorBefore: true,
                            onClick: onDelete,
                        },
                    ]}
                />
            </td>
        </tr>
    );
}