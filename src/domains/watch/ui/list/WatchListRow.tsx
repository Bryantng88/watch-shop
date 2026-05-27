"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Eye,
    Hammer,
    HandCoins,
    ImageIcon,
    PackageOpen,
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


function formatAcquisitionStatus(status?: string | null) {
    const value = String(status ?? "").toUpperCase();
    const map: Record<string, string> = {
        DRAFT: "Draft",
        POSTED: "Posted",
        CANCELED: "Canceled",
    };

    return map[value] ?? (status || "-");
}

function AcquisitionCell({ row }: { row: WatchRow }) {
    const [open, setOpen] = useState(false);
    const items = row.acquisitionItems ?? [];
    const first = items[0];

    if (!first) {
        return <div className="text-xs font-medium text-slate-300">-</div>;
    }

    const hasMore = items.length > 1;
    const otherItemsCount = Math.max(0, items.length - 1);

    return (
        <div className="relative min-w-[170px]">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="group max-w-[180px] text-left"
            >
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                    <PackageOpen className="h-3.5 w-3.5" />
                    <span className="truncate">{first.refNo || "Phiếu nhập"}</span>
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-400">
                    {first.vendorName || "Không có vendor"}
                    {hasMore ? ` · +${otherItemsCount} item khác` : ""}
                </div>
            </button>

            {open ? (
                <>
                    <button
                        type="button"
                        aria-label="Đóng acquisition preview"
                        className="fixed inset-0 z-30 cursor-default bg-transparent"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute left-0 top-full z-40 mt-3 w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-3">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                    Acquisition
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-900">
                                    {first.refNo || "Phiếu nhập chưa có refNo"}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                    {first.vendorName || "Không có vendor"} · {formatAcquisitionStatus(first.status)}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-xs font-medium text-slate-400 hover:text-slate-700"
                            >
                                Đóng
                            </button>
                        </div>

                        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] font-medium text-slate-500">
                            {items.length} item trong cùng phiếu · item hiện tại được đánh dấu
                        </div>

                        <div className="max-h-[360px] space-y-2 overflow-y-auto p-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "rounded-2xl border p-3",
                                        item.isCurrentProduct
                                            ? "border-blue-200 bg-blue-50/60"
                                            : "border-slate-100 bg-slate-50/70",
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-start gap-2">
                                                <div className="min-w-0">
                                                    <div className="line-clamp-2 text-sm font-semibold text-slate-900">
                                                        {item.productTitle || row.title}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        SL: {item.quantity ?? 1} · Giá nhập: {formatMoney(item.unitCost)} {item.currency || "VND"}
                                                    </div>
                                                    {item.sku ? (
                                                        <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                                                            SKU: {item.sku}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {item.isCurrentProduct ? (
                                                    <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">
                                                        Current
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                            {item.type || "PURCHASE"}
                                        </span>
                                    </div>

                                    {item.notes ? (
                                        <div className="mt-2 line-clamp-2 text-xs text-slate-500">
                                            {item.notes}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : null}
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
    const saleStage = String(product.saleState ?? "").toUpperCase();

    const isLockedForQuickOrder =
        saleStage === "HOLD" ||
        saleStage === "SOLD";

    const quickOrderDisabledReason =
        saleStage === "HOLD"
            ? "Watch đang HOLD, không thể tạo đơn mới."
            : saleStage === "SOLD"
                ? "Watch đã SOLD, không thể tạo đơn mới."
                : "";
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
                <div className="flex min-w-[360px] items-center gap-3">
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

            <td className="px-4 py-4 align-middle">
                <AcquisitionCell row={product} />
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
                            disabled: isLockedForQuickOrder,
                            onClick: (row) => {
                                if (isLockedForQuickOrder) return;
                                onQuickOrder(row);
                            },
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