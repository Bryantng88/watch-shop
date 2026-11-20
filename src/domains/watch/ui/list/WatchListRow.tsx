"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { ReactNode, useState } from "react";
import Link from "next/link";
import {
    Eye,
    Hammer,
    HandCoins,
    ImageIcon,
    ImagePlus,
    CopyX,
    Pencil,
    RotateCcw,
    ShoppingCart,
    Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import RowActions from "@/domains/shared/ui/list/RowActions";
import { useAdHocWorkRowAction } from "@/domains/task/ui/ad-hoc-work/AdHocWorkRowAction";
import {
    VisualStatusSignal,
    type VisualStatusIcon,
    type VisualStatusTone,
} from "@/domains/shared/ui/signals";

import type { WatchRow } from "./types";
import { formatDateTime, formatMoney } from "./helpers";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

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
    onRepairInline?: (row: WatchRow) => void;
};

function initials(label?: string | null) {
    return String(label || "Hệ thống")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}

function LastActionAvatar({
    label,
    avatarUrl,
    isSystem,
}: {
    label: string;
    avatarUrl?: string | null;
    isSystem: boolean;
}) {
    const src = resolveMediaPreviewSrc(avatarUrl);

    return (
        <span
            className={cn(
                "flex h-[18px] w-[18px] shrink-0 items-center justify-center overflow-hidden rounded-full border text-[7px] font-semibold",
                isSystem
                    ? "border-slate-200 bg-slate-100 text-slate-500"
                    : "border-indigo-100 bg-indigo-50 text-indigo-700",
            )}
            title={label}
        >
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={label} className="h-full w-full object-cover" />
            ) : (
                initials(label)
            )}
        </span>
    );
}

type BadgeTone = VisualStatusTone;

function Thumb({ src, alt, onClick }: { src?: string | null; alt: string; onClick?: () => void }) {
    const [failed, setFailed] = useState(false);
    const content = src && !failed
        // Small table thumbnail retains an inline fallback for missing legacy media.
        // eslint-disable-next-line @next/next/no-img-element
        ? <img ref={image => { if (image?.complete && !image.naturalWidth) setFailed(true); }} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        : <ImageIcon aria-hidden="true" className="h-4 w-4 text-slate-400" />;
    const className = "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100";
    return onClick ? <AdminButton variant="contextual" type="button" onClick={onClick} aria-label={`Chọn lại ảnh ${alt}`} title="Chọn lại ảnh" className={className}>{content}</AdminButton> : <span className={className} title={alt}>{content}</span>;
}

function upper(value: unknown) {
    return String(value ?? "").trim().toUpperCase();
}

function WatchStatusSignal({
    kind,
    label,
    onClick,
    status,
    tone,
    detail: detailOverride,
    detailClassName,
}: {
    kind: "media" | "service";
    label: string;
    onClick?: (() => void) | null;
    status?: string | null;
    tone: BadgeTone;
    detail?: string | null;
    detailClassName?: string;
}) {
    const normalized = upper(status);
    const icon: VisualStatusIcon = kind === "media"
        ? normalized === "POSTED" ? "published"
            : normalized === "READY_TO_PUBLISH" || normalized === "MEDIA_READY" ? "neutral"
                : tone === "emerald" ? "success"
                    : tone === "amber" || tone === "rose" ? "warning"
                        : "image"
        : tone === "emerald" ? "success" : tone === "amber" || tone === "rose" ? "waiting" : tone === "blue" ? "service" : "neutral";
    const detail = detailOverride || (kind === "media"
        ? normalized === "POSTED" ? "Đã hoàn tất"
            : normalized === "READY_TO_PUBLISH" ? "Chưa xử lý"
                : normalized === "MEDIA_READY" ? "Chờ xử lý media"
                : normalized === "NEEDS_REWORK" ? "Cần xử lý lại"
                    : normalized === "PHOTOSHOOT" ? "Đang chụp ảnh"
                        : normalized === "MEDIA_PROCESSING" ? "Đang xử lý"
                            : "Bắt đầu photoshoot"
        : normalized === "DONE" ? "Đã hoàn tất kỹ thuật"
            : normalized === "IN_SERVICE" ? "Đang xử lý kỹ thuật"
                : normalized === "WAITING" || normalized === "PENDING" ? "Chờ tiếp nhận"
                    : normalized === "ISSUE" ? "Cần kiểm tra"
                        : "Đã kiểm tra");
    const displayLabel = kind === "service" ? ({
        IN_SERVICE: "Đang service", DONE: "Đã service", WAITING: "Chưa service",
        PENDING: "Chưa service", NOT_REQUIRED: "Không cần service", ISSUE: "Service cần kiểm tra",
    } as Record<string, string>)[normalized] ?? label : ({
        POSTED: "Đã hoàn tất media", READY_TO_PUBLISH: "Sẵn sàng đăng", MEDIA_READY: "Đã chụp xong",
        PHOTOSHOOT: "Đang chụp ảnh", MEDIA_PROCESSING: "Đang xử lý media", NEEDS_REWORK: "Media cần xử lý lại",
        NO_IMAGE: "Chưa vào luồng media",
    } as Record<string, string>)[normalized] ?? label;
    return <VisualStatusSignal
        variant="inline"
        label={displayLabel}
        detail={detail}
        detailClassName={detailClassName}
        tone={tone}
        icon={icon}
        onClick={onClick ?? undefined}
        singleLine={!detailOverride}
    />;
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
                    icon: "sale" as VisualStatusIcon,
                    tone: "blue" as BadgeTone,
                    detail: "Sẵn sàng bán",
                };
            case "HOLD":
                return {
                    icon: "reserved" as VisualStatusIcon,
                    tone: "amber" as BadgeTone,
                    detail: "Đang giữ hàng",
                };
            case "SOLD":
                return {
                    icon: "success" as VisualStatusIcon,
                    tone: "emerald" as BadgeTone,
                    detail: "Đã hoàn tất bán",
                };
            case "CONSIGNED":
            case "CONSIGNED_TO":
                return {
                    icon: "consignment" as VisualStatusIcon,
                    tone: "violet" as BadgeTone,
                    detail: "Đang ký gửi",
                };
            case "PROCESSING":
                return {
                    icon: "waiting" as VisualStatusIcon,
                    tone: "blue" as BadgeTone,
                    detail: "Đang chuẩn bị bán",
                };
            default:
                return {
                    icon: "neutral" as VisualStatusIcon,
                    tone: "slate" as BadgeTone,
                    detail: "Chưa sẵn sàng bán",
                };
        }
    })();

    return (
        <VisualStatusSignal
            variant="inline"
            label={({ READY: "Chưa bán", SOLD: "Đã bán", HOLD: "Giữ hàng", PROCESSING: "Chưa bán · Đang chuẩn bị", CONSIGNED: "Đang ký gửi", CONSIGNED_TO: "Đang ký gửi" } as Record<string, string>)[normalized] ?? (label || "Chưa rõ trạng thái bán")}
            detail={config.detail}
            tone={config.tone}
            icon={config.icon}
            singleLine
        />
    );
}

function legacyMediaStatus(row: WatchRow) {
    if (row.isPosted) return { label: "Đã đăng", tone: "emerald" as BadgeTone };
    return { label: "Chưa vào luồng Media", tone: "slate" as BadgeTone };
}

function mediaStatusLabel(status: string | null | undefined, fallback: string) {
    switch (upper(status)) {
        case "NO_IMAGE":
            return "Chưa vào luồng Media";
        case "MEDIA_READY":
            return "Đã chụp xong";
        default:
            return fallback;
    }
}

function mediaTone(status?: string | null): BadgeTone {
    switch (upper(status)) {
        case "POSTED":
            return "emerald";
        case "READY_TO_PUBLISH":
            return "violet";
        case "MEDIA_READY":
            return "slate";
        case "NEEDS_REWORK":
            return "amber";
        case "NO_IMAGE":
            return "slate";
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
    onRepairInline,
}: Props) {
    const adHocWork = useAdHocWorkRowAction<WatchRow>((row) => ({
        targetType: "WATCH",
        targetId: row.id,
        title: row.title,
        ref: row.sku,
        imageUrl: row.imageUrl,
        href: `/admin/watches/${row.productId}`,
    }));
    const saleState = upper(product.saleState);

    const isLockedForQuickOrder = saleState === "HOLD" || saleState === "SOLD";
    const isLockedForEdit = saleState === "SOLD";
    const canBuyBack = saleState === "SOLD";

    const media = product.v2Row
        ? {
            label: mediaStatusLabel(
                product.v2Row.mediaStatus,
                product.v2Row.mediaStatusLabel,
            ),
            status: product.v2Row.mediaStatus,
            tone: mediaTone(product.v2Row.mediaStatus),
            href: product.v2Row.mediaWorkspaceHref,
        }
        : {
            ...legacyMediaStatus(product),
            status: product.isPosted ? "POSTED" : "NO_IMAGE",
            href: null,
        };
    const storefrontPublished = product.v2Row
        ? product.v2Row.storefrontStatus === "PUBLISHED"
        : Boolean(product.storefrontPublished);
    const storefrontLabel = storefrontPublished ? "Đang hiển thị storefront" : "Đang ẩn storefront";
    const service = product.v2Row
        ? {
            label: product.v2Row.serviceStatusLabel,
            status: product.v2Row.serviceStatus,
            tone: serviceTone(product.v2Row.serviceStatus),
            serviceRequestId: product.v2Row.serviceRequestId,
            href: product.v2Row.serviceWorkspaceHref,
            expectedCompletionAt: product.v2Row.serviceExpectedCompletionAt,
        }
        : {
            ...legacyServiceStatus(product),
            status: product.serviceState,
            serviceRequestId: null,
            href: null,
            expectedCompletionAt: product.serviceExpectedCompletionAt
                ? new Date(product.serviceExpectedCompletionAt).toISOString()
                : null,
        };
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
            label: "Xử lý nhanh Media",
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
        adHocWork.action,
    ].filter(Boolean) as WatchRowAction[];

    return (
        <>
        <tr className="border-t border-slate-100 align-middle hover:bg-slate-50/40">
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                    aria-label={`Chọn ${product.title}`}
                />
            </td>

            <td className="px-3 py-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Thumb key={product.imageUrl || "missing"} src={product.imageUrl} alt={product.title} onClick={onRepairInline ? () => onRepairInline(product) : undefined} />

                    <div className="min-w-0 flex-1">
                        <Link
                            href={`/admin/watches/${product.productId}`}
                            className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-blue-700"
                        >
                            {product.title}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                            <span>SKU: {product.sku || "-"}</span>
                            {product.brandName ? <span>{product.brandName}</span> : null}
                        </div>
                        <span className="mt-0.5 block text-xs text-slate-500">{storefrontLabel}</span>
                    </div>
                </div>
            </td>

            <td className="px-3 py-3 align-middle">
                <div className="flex min-w-0 flex-col gap-0.5" aria-label="Tình trạng đồng hồ">
                    <SaleStatusBadge label={sale.label} status={product.v2Row?.saleStatus ?? product.saleState} />
                    <WatchStatusSignal kind="media" label={media.label} status={media.status} tone={media.tone} detail={storefrontLabel} onClick={onPreview ? () => onPreview(mediaPreview) : null} />
                    <WatchStatusSignal kind="service" label={service.label} status={service.status} tone={service.tone} detail={service.expectedCompletionAt ? `Dự kiến ${formatDateTime(service.expectedCompletionAt)}` : null} onClick={onPreview ? () => onPreview(servicePreview) : null} />
                </div>
            </td>

            <td className="px-4 py-3">
                <div className="min-w-[110px] text-sm font-semibold text-slate-950 tabular-nums">
                    {product.salePrice == null ? <span className="text-xs font-normal text-slate-500">Chưa có giá</span> : <>{formatMoney(product.salePrice)} <span className="text-xs font-normal text-slate-500">₫</span></>}
                </div>
            </td>

            <td className="px-3 py-3 align-middle text-xs leading-5 text-slate-500 tabular-nums">
                <div title="Thời điểm cập nhật"><span className="sr-only">Cập nhật </span>{formatDateTime(product.updatedAt)}</div>
                <div title="Thời điểm tạo đồng hồ">Tạo {formatDateTime(product.createdAt)}</div>
            </td>

            <td className="px-3 py-3 align-middle">
                {product.v2Row?.lastAction ? (
                    <div
                        className="min-w-0"
                        title={[
                            product.v2Row.lastAction.label,
                            product.v2Row.lastAction.note,
                            product.v2Row.lastAction.actorLabel,
                            formatDateTime(product.v2Row.lastAction.at),
                        ].filter(Boolean).join(" · ")}
                    >
                        <div className="truncate text-sm font-medium text-slate-800">
                            {product.v2Row.lastAction.label}
                        </div>
                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                            <LastActionAvatar
                                label={product.v2Row.lastAction.actorLabel || "Hệ thống"}
                                avatarUrl={product.v2Row.lastAction.actorAvatarUrl}
                                isSystem={!product.v2Row.lastAction.actorUserId}
                            />
                            <div className="truncate">
                                {product.v2Row.lastAction.actorLabel || "Hệ thống"}
                                {" · "}
                                {formatDateTime(product.v2Row.lastAction.at)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">Chưa có thao tác</span>
                )}
            </td>

            <td className="sticky right-0 z-[1] bg-white px-1 py-3 text-right">
                <RowActions<WatchRow>
                    row={product}
                    actions={actions}
                />
            </td>
        </tr>
        {adHocWork.modal}
        </>
    );
}
