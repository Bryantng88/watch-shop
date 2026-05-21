"use client";

import Link from "next/link";
import {
    Eye,
    Hammer,
    HandCoins,
    ImageIcon,
    Pencil,
    ShoppingCart,
    Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import RowActions from "@/domains/shared/ui/list/RowActions";
import {
    DomainSignalGroup,
    WatchContentSignalIcon,
    WatchGalleryImageSignalIcon,
    WatchReadinessSignalIcon,
    WatchServiceSignalIcon,
} from "@/domains/shared/ui/icons";

import type { WatchRow } from "./types";
import { contentStatusText, formatDateTime, formatMoney } from "./helpers";

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
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <ImageIcon className="h-6 w-6 text-slate-400" />
            </div>
        );
    }

    return (
        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
        </div>
    );
}

function WatchSignalSummary({ row }: { row: WatchRow }) {
    const hasContent = Boolean(row.hasContent);
    const hasGalleryImage = Number(row.imagesCount ?? 0) > 0 || Boolean(row.hasImages);
    const hasService = Number(row.serviceIssuesCount ?? 0) > 0;

    if (!hasContent && !hasGalleryImage && !hasService) return null;

    return (
        <DomainSignalGroup>
            {hasContent ? <WatchContentSignalIcon /> : null}
            {hasGalleryImage ? <WatchGalleryImageSignalIcon /> : null}
            {hasService ? <WatchServiceSignalIcon /> : null}
        </DomainSignalGroup>
    );
}
function normalizePostReadiness(row: WatchRow) {
    const raw =
        (row as any).reviewStatus ??
        (row as any).postReadiness ??
        (row as any).contentStatus ??
        "";

    const value = String(raw).toUpperCase();

    if (["POSTED", "PUBLISHED"].includes(value)) return "POSTED";
    if (["APPROVED", "READY_TO_POST"].includes(value)) return "APPROVED";
    if (["PARTIAL", "PARTIALLY_APPROVED", "APPROVED_PARTIAL"].includes(value)) return "PARTIAL";
    if (["PENDING", "PENDING_REVIEW", "SUBMITTED", "IN_REVIEW"].includes(value)) return "PENDING";

    const label = contentStatusText(row).toLowerCase();

    if (label.includes("đã đăng")) return "POSTED";
    if (label.includes("duyệt một phần")) return "PARTIAL";
    if (label.includes("đã duyệt")) return "APPROVED";
    if (label.includes("chờ duyệt")) return "PENDING";

    return "NOT_SUBMITTED";
}
function WatchPostReadinessIcon({ row }: { row: WatchRow }) {
    return <WatchReadinessSignalIcon state={normalizePostReadiness(row)} />;
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
                <div className="flex min-w-[460px] items-center gap-3">
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

                        <WatchSignalSummary row={product} />
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
                        isRecent ? "font-semibold text-emerald-500" : "text-slate-700",
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