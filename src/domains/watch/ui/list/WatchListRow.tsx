"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
    AlertCircle,
    BadgeCheck,
    Eye,
    Hammer,
    HandCoins,
    Handshake,
    ImageIcon,
    ImagePlus,
    CopyX,
    Lock,
    Pencil,
    RotateCcw,
    ShoppingCart,
    Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import RowActions from "@/domains/shared/ui/list/RowActions";

import type { WatchRow } from "./types";
import { formatDateTime, formatMoney } from "./helpers";

type WatchRowAction = {
    key: string;
    label: string;
    icon: ReactNode;
    onClick: (row: WatchRow) => void;
    disabled?: boolean;
    tone?: "danger";
    separatorBefore?: boolean;
};

type Props = {
    product: WatchRow;
    checked: boolean;
    canViewCost?: boolean;
    onCheckedChange: (checked: boolean) => void;

    onView?: (row: WatchRow) => void;
    onEdit?: (row: WatchRow) => void;
    onDelete?: (row: WatchRow) => void;
    onService?: (row: WatchRow) => void;
    onMedia?: (row: WatchRow) => void;
    mediaSubmitting?: boolean;
    onConfirmDuplicate?: (row: WatchRow) => void;
    duplicateSubmitting?: boolean;
    onRestoreDuplicate?: (row: WatchRow) => void;
    onQuickOrder?: (row: WatchRow) => void;
    onConsign?: (row: WatchRow) => void;
    onBuyBack?: (row: WatchRow) => void;
    onRaiseCase?: (row: WatchRow) => void;
    onCreateTask?: (row: WatchRow) => void;
    onPreview?: (preview: BusinessEntityPreview) => void;
};

type BadgeTone = "slate" | "blue" | "emerald" | "amber" | "rose" | "violet";

function Thumb({ src, alt }: { src?: string | null; alt: string }) {
    if (!src) {
        return (
            <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <ImageIcon className="h-6 w-6 text-slate-400" />
            </div>
        );
    }

    return (
        <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
        </div>
    );
}

function upper(value: unknown) {
    return String(value ?? "").trim().toUpperCase();
}

function StatusSignal({
    label,
    onClick,
    tone,
}: {
    label: string;
    onClick?: (() => void) | null;
    tone: BadgeTone;
}) {
    const dotClasses: Record<BadgeTone, string> = {
        slate: "bg-slate-400",
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500",
        violet: "bg-violet-500",
    };

    const content = (
        <>
            <span
                aria-hidden="true"
                className={cn("h-2 w-2 shrink-0 rounded-full", dotClasses[tone])}
            />
            <span className="truncate">{label}</span>
        </>
    );
    const className = cn(
        "inline-flex max-w-[132px] items-center gap-2 text-xs font-medium leading-5",
        tone === "slate" ? "text-slate-600" : "text-slate-700",
        onClick ? "rounded-md hover:text-blue-700 hover:underline" : "",
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={className}
                title={label}
            >
                {content}
            </button>
        );
    }

    return (
        <span
            className={cn(
                "inline-flex max-w-[132px] items-center gap-2 text-xs font-medium leading-5",
                tone === "slate" ? "text-slate-600" : "text-slate-700",
            )}
            title={label}
        >
            {content}
        </span>
    );
}

function SaleStatusBadge({
    label,
    status,
}: {
    label: string;
    status?: string | null;
}) {
    const normalized = upper(status);
    const config = (() => {
        switch (normalized) {
            case "READY":
                return {
                    icon: ShoppingCart,
                    className: "border-blue-200 bg-blue-50 text-blue-700",
                };
            case "HOLD":
                return {
                    icon: Lock,
                    className: "border-amber-200 bg-amber-50 text-amber-700",
                };
            case "SOLD":
                return {
                    icon: BadgeCheck,
                    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
                };
            case "CONSIGNED":
                return {
                    icon: Handshake,
                    className: "border-violet-200 bg-violet-50 text-violet-700",
                };
            default:
                return {
                    icon: AlertCircle,
                    className: "border-slate-200 bg-slate-50 text-slate-600",
                };
        }
    })();
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex max-w-[132px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-5",
                config.className,
            )}
            title={label}
        >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label || "Không rõ"}</span>
        </span>
    );
}

function legacyMediaStatus(row: WatchRow) {
    if (row.isPosted) return { label: "Đã đăng", tone: "emerald" as BadgeTone };
    if (!row.hasImages && Number(row.imagesCount ?? 0) <= 0) {
        return { label: "Chưa có ảnh", tone: "slate" as BadgeTone };
    }
    return { label: "Đang xử lý media", tone: "blue" as BadgeTone };
}

function mediaTone(status?: string | null): BadgeTone {
    switch (upper(status)) {
        case "POSTED":
            return "emerald";
        case "READY_TO_PUBLISH":
            return "violet";
        case "NEEDS_REWORK":
        case "NO_IMAGE":
            return "amber";
        case "PHOTOSHOOT":
        case "MEDIA_PROCESSING":
            return "blue";
        default:
            return "slate";
    }
}

function legacyServiceStatus(row: WatchRow) {
    const state = upper(row.serviceState);
    if (state === "DONE") return { label: "Đã xong", tone: "emerald" as BadgeTone };
    if (state === "IN_SERVICE") return { label: "Đang service", tone: "blue" as BadgeTone };
    if (state === "PENDING") return { label: "Chờ service", tone: "amber" as BadgeTone };
    if (Number(row.serviceIssuesCount ?? 0) > 0) {
        return { label: "Cần kiểm tra", tone: "rose" as BadgeTone };
    }
    return { label: "Không cần service", tone: "slate" as BadgeTone };
}

function serviceTone(status?: string | null): BadgeTone {
    switch (upper(status)) {
        case "DONE":
            return "emerald";
        case "IN_SERVICE":
            return "blue";
        case "WAITING":
            return "amber";
        case "ISSUE":
            return "rose";
        default:
            return "slate";
    }
}

function legacySaleStatus(row: WatchRow) {
    const state = upper(row.saleState);
    if (state === "SOLD") return { label: "Đã bán", tone: "emerald" as BadgeTone };
    if (state === "HOLD") return { label: "Giữ hàng", tone: "amber" as BadgeTone };
    if (state === "CONSIGNED_TO") return { label: "Consigned", tone: "violet" as BadgeTone };
    return { label: "Sẵn sàng", tone: "blue" as BadgeTone };
}

export default function WatchListRow({
    product,
    checked,
    onCheckedChange,
    onView,
    onEdit,
    onDelete,
    onService,
    onMedia,
    mediaSubmitting = false,
    onConfirmDuplicate,
    duplicateSubmitting = false,
    onRestoreDuplicate,
    onQuickOrder,
    onConsign,
    onBuyBack,
    onPreview,
}: Props) {
    const isRecent =
        product.updatedAt &&
        Date.now() - new Date(product.updatedAt).getTime() < 1000 * 60 * 60 * 24;
    const saleState = upper(product.saleState);

    const isLockedForQuickOrder = saleState === "HOLD" || saleState === "SOLD";
    const isLockedForEdit = saleState === "SOLD";
    const canBuyBack = saleState === "SOLD";

    const media = product.v2Row
        ? {
            label: product.v2Row.mediaStatusLabel,
            tone: mediaTone(product.v2Row.mediaStatus),
            href: product.v2Row.mediaWorkspaceHref,
        }
        : { ...legacyMediaStatus(product), href: null };
    const service = product.v2Row
        ? {
            label: product.v2Row.serviceStatusLabel,
            tone: serviceTone(product.v2Row.serviceStatus),
            serviceRequestId: product.v2Row.serviceRequestId,
            href: product.v2Row.serviceWorkspaceHref,
        }
        : { ...legacyServiceStatus(product), serviceRequestId: null, href: null };
    const sale = product.v2Row
        ? {
            label: product.v2Row.saleStatusLabel,
        }
        : legacySaleStatus(product);
    const mediaPreview: BusinessEntityPreview = {
        type: "WATCH",
        id: product.id,
        title: "Media preview",
        subtitle: product.title,
        status: media.label,
        imageUrl: product.imageUrl,
        href: media.href ?? `/admin/watches/${product.productId}`,
        facts: [
            { label: "Watch", value: product.title },
            { label: "SKU", value: product.sku || "-" },
            { label: "Trang thai media", value: media.label },
        ],
        sections: [
            {
                title: "Media workspace",
                subtitle: "Trang thai media hien tai cua watch",
                items: [
                    {
                        title: media.label,
                        subtitle: product.sku || product.brandName || null,
                        status: product.v2Row?.mediaStatus ?? null,
                        href: media.href,
                        facts: [
                            { label: "Brand", value: product.brandName || "-" },
                        ],
                    },
                ],
            },
        ],
        actions: media.href
            ? [{ label: "Mo workspace media", href: media.href }]
            : [{ label: "Mo watch", href: `/admin/watches/${product.productId}` }],
    };
    const servicePreview: BusinessEntityPreview = service.serviceRequestId
        ? {
            type: "SERVICE",
            id: service.serviceRequestId,
            title: "Service preview",
            subtitle: product.title,
            status: service.label,
            imageUrl: product.imageUrl,
            href: service.href ?? `/admin/watches/${product.productId}`,
            facts: [
                { label: "Watch", value: product.title },
                { label: "SKU", value: product.sku || "-" },
                { label: "Trang thai service", value: service.label },
            ],
            actions: service.href ? [{ label: "Mo workspace SR", href: service.href }] : undefined,
        }
        : {
            type: "WATCH",
            id: product.id,
            title: "Service preview",
            subtitle: product.title,
            status: service.label,
            imageUrl: product.imageUrl,
            href: `/admin/watches/${product.productId}`,
            facts: [
                { label: "Watch", value: product.title },
                { label: "SKU", value: product.sku || "-" },
                { label: "Trang thai service", value: service.label },
            ],
            sections: [
                {
                    title: "Service",
                    subtitle: "Watch chua co SR dang theo doi",
                    items: [
                        {
                            title: service.label,
                            subtitle: product.sku || product.brandName || null,
                            status: product.v2Row?.serviceStatus ?? product.serviceState ?? null,
                            facts: [
                                { label: "Brand", value: product.brandName || "-" },
                                { label: "Service issues", value: product.serviceIssuesCount ?? 0 },
                            ],
                        },
                    ],
                },
            ],
            actions: [{ label: "Mo watch", href: `/admin/watches/${product.productId}` }],
        };

    const actions = [
        onView && {
            key: "view",
            label: "Xem",
            icon: <Eye className="h-4 w-4" />,
            onClick: onView,
        },
        onEdit &&
        !isLockedForEdit && {
            key: "edit",
            label: "Sửa",
            icon: <Pencil className="h-4 w-4" />,
            onClick: onEdit,
        },
        onQuickOrder &&
        !isLockedForQuickOrder && {
            key: "quick-order",
            label: "Quick order",
            icon: <ShoppingCart className="h-4 w-4" />,
            onClick: onQuickOrder,
        },
        onService && {
            key: "service",
            label: "Tao phieu ky thuat",
            icon: <Hammer className="h-4 w-4" />,
            onClick: onService,
        },
        onMedia && {
            key: "media-space",
            label: "Đưa vào Space Media",
            icon: <ImagePlus className="h-4 w-4" />,
            onClick: onMedia,
            disabled: mediaSubmitting,
        },
        onConsign &&
        !isLockedForQuickOrder && {
            key: "consign",
            label: "Consign",
            icon: <HandCoins className="h-4 w-4" />,
            onClick: onConsign,
        },
        onBuyBack &&
        canBuyBack && {
            key: "buy-back",
            label: "Buy back",
            icon: <RotateCcw className="h-4 w-4" />,
            separatorBefore: true,
            onClick: onBuyBack,
        },
        onConfirmDuplicate && {
            key: "confirm-duplicate",
            label: "Xác nhận trùng",
            icon: <CopyX className="h-4 w-4" />,
            onClick: onConfirmDuplicate,
            disabled: duplicateSubmitting,
            separatorBefore: true,
        },
        onRestoreDuplicate && {
            key: "restore-duplicate",
            label: "Đưa lại danh sách Watch",
            icon: <RotateCcw className="h-4 w-4" />,
            onClick: onRestoreDuplicate,
            disabled: duplicateSubmitting,
            separatorBefore: true,
        },
        onDelete && {
            key: "delete",
            label: "Xóa",
            icon: <Trash2 className="h-4 w-4" />,
            tone: "danger",
            separatorBefore: true,
            onClick: onDelete,
        },
    ].filter(Boolean) as WatchRowAction[];

    return (
        <tr className="border-t border-slate-100 align-middle hover:bg-slate-50/40">
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                />
            </td>

            <td className="px-4 py-3">
                <div className="flex min-w-[340px] items-center gap-3">
                    <Thumb src={product.imageUrl} alt={product.title} />

                    <div className="min-w-0 flex-1">
                        <Link
                            href={`/admin/watches/${product.productId}`}
                            className="line-clamp-2 text-[15px] font-semibold text-slate-900 hover:text-blue-700"
                        >
                            {product.title}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                            <span>SKU: {product.sku || "-"}</span>
                            {product.brandName ? <span>{product.brandName}</span> : null}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3 align-middle">
                <StatusSignal
                    label={media.label}
                    tone={media.tone}
                    onClick={onPreview ? () => { onPreview(mediaPreview); /*
                        onPreview({
                            type: "WATCH",
                            id: product.id,
                            title: "Media",
                            subtitle: product.title,
                            status: media.label,
                            imageUrl: product.imageUrl,
                            href: media.href ?? `/admin/watches/${product.productId}`,
                            facts: [
                                { label: "Watch", value: product.title },
                                { label: "SKU", value: product.sku || "-" },
                                { label: "Trạng thái media", value: media.label },
                            ],
                            sections: [
                                {
                                    title: "Media workspace",
                                    subtitle: "Trạng thái media hiện tại của watch",
                                    items: [
                                        {
                                            title: media.label,
                                            subtitle: product.sku || product.brandName || null,
                                            status: product.v2Row?.mediaStatus ?? null,
                                            href: media.href,
                                            facts: [
                                                { label: "Brand", value: product.brandName || "-" },
                                            ],
                                        },
                                    ],
                                },
                            ],
                            actions: media.href ? [{ label: "Mở workspace media", href: media.href }] : undefined,
                        */ } : null}
                />
            </td>

            <td className="px-4 py-3 align-middle">
                <StatusSignal
                    label={service.label}
                    tone={service.tone}
                    onClick={onPreview ? () => { onPreview(servicePreview); /*
                        onPreview({
                            type: service.serviceRequestId ? "SERVICE" : "WATCH",
                            id: service.serviceRequestId ?? product.id,
                            title: "Service preview",
                            subtitle: product.title,
                            status: service.label,
                            imageUrl: product.imageUrl,
                            href: service.href ?? `/admin/watches/${product.productId}`,
                            facts: [
                                { label: "Watch", value: product.title },
                                { label: "SKU", value: product.sku || "-" },
                                { label: "Trạng thái service", value: service.label },
                            ],
                            actions: service.href ? [{ label: "Mở workspace SR", href: service.href }] : undefined,
                        */ } : null}
                />
            </td>

            <td className="px-4 py-3 align-middle">
                <SaleStatusBadge
                    label={sale.label}
                    status={product.v2Row?.saleStatus ?? product.saleState}
                />
            </td>

            <td className="px-4 py-3">
                <div className="min-w-[110px] text-sm font-semibold text-orange-600">
                    {formatMoney(product.salePrice)}
                </div>
            </td>

            <td className="px-4 py-3 align-middle">
                <div
                    className={cn(
                        "text-sm",
                        isRecent ? "font-semibold text-emerald-500" : "text-slate-700",
                    )}
                >
                    {formatDateTime(product.updatedAt)}
                </div>
            </td>

            <td className="px-4 py-3 text-right">
                <RowActions<WatchRow>
                    row={product}
                    actions={actions}
                />
            </td>
        </tr>
    );
}
