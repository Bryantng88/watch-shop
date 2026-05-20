"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    ImageIcon,
    FileText,
    Wrench,
    Eye,
    Pencil,
    ShoppingCart,
    Hammer,
    HandCoins,
    Trash2,
    CircleDashed,
    Clock3,
    FileWarning,
    CheckCircle2,
    Send,
} from "lucide-react";
import type { WatchRow } from "./types";
import {
    contentStatusText,
    contentStatusTone,
    formatMoney,
    formatDateTime,
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

function normalizePostReadiness(row: WatchRow) {
    const label = contentStatusText(row).toLowerCase();

    if (label.includes("đã đăng")) return "POSTED";
    if (label.includes("đã duyệt")) return "APPROVED";
    if (label.includes("duyệt một phần")) return "PARTIAL";
    if (label.includes("chờ duyệt")) return "PENDING";

    return "NOT_SUBMITTED";
}

function WatchPostReadinessIcon({ row }: { row: WatchRow }) {
    const state = normalizePostReadiness(row);

    const config = {
        NOT_SUBMITTED: {
            title: "Chưa gửi duyệt",
            icon: CircleDashed,
            className: "bg-slate-50 text-slate-400 ring-slate-200",
        },
        PENDING: {
            title: "Chờ duyệt",
            icon: Clock3,
            className: "bg-amber-50 text-amber-600 ring-amber-100",
        },
        PARTIAL: {
            title: "Duyệt một phần",
            icon: FileWarning,
            className: "bg-orange-50 text-orange-600 ring-orange-100",
        },
        APPROVED: {
            title: "Đã duyệt",
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        },
        POSTED: {
            title: "Đã đăng",
            icon: Send,
            className: "bg-violet-50 text-violet-600 ring-violet-100",
        },
    }[state];

    const Icon = config.icon;

    return (
        <span
            title={config.title}
            className={cn(
                "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1",
                config.className
            )}
        >
            <Icon className="h-4 w-4" />
        </span>
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
        Date.now() - new Date(product.updatedAt).getTime() < 1000 * 60 * 60 * 24;

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
                <div className="flex min-w-[150px] items-center gap-2">
                    <WatchPostReadinessIcon row={product} />


                </div>
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
                        isRecent ? "font-semibold text-emerald-500" : "text-slate-700"
                    )}
                >
                    {formatDateTime(product.updatedAt)}
                </div>
            </td>

            <td className="px-4 py-4 align-middle">
                <div className="text-sm font-medium text-slate-700">
                    {product.lastUpdatedBy?.name || product.lastUpdatedBy?.email || "-"}
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