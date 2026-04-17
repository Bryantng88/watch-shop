"use client";

import Image from "next/image";
import RowActionMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { pickWatchInlineImage } from "../../server/shared/watch-image";
import type { WatchRow } from "./types";

type Props = {
    item: WatchRow;
    checked: boolean;
    canViewCost: boolean;
    onCheckedChange: (checked: boolean) => void;
    onView: (productId: string) => void;
    onEdit: (productId: string) => void;
    onDelete: (productId: string) => void;
    onService: (productId: string) => void;
    onConsign?: (productId: string) => void;
    onQuickOrder?: (productId: string) => void;
};

function fmtMoney(value?: string | number | null) {
    if (value == null || value === "") return "-";
    const num = Number(value);
    if (!Number.isFinite(num)) return String(value);
    return num.toLocaleString("vi-VN");
}

function fmtDT(value?: string | Date | null) {
    if (!value) return "-";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function getReadinessLabel(item: WatchRow) {
    if (item.isReadyToPublish) return "Sẵn sàng bán";
    if (item.hasContent || item.hasImages) return "Đang hoàn thiện";
    return "Chưa bắt đầu";
}

function getServiceMeta(serviceState?: string | null) {
    switch (String(serviceState || "").toUpperCase()) {
        case "DONE":
            return { label: "Đã sửa xong", tone: "success" as const };
        case "IN_PROGRESS":
            return { label: "Đang service", tone: "warning" as const };
        case "PENDING":
            return { label: "Chờ xử lý", tone: "danger" as const };
        default:
            return { label: "Không cần service", tone: "muted" as const };
    }
}

function toneClass(tone?: "success" | "warning" | "danger" | "muted" | "accent") {
    switch (tone) {
        case "success":
            return "text-emerald-700";
        case "warning":
            return "text-amber-700";
        case "danger":
            return "text-rose-600";
        case "accent":
            return "text-orange-600";
        default:
            return "text-slate-700";
    }
}

function MetaRow({
    label,
    value,
    tone = "muted",
}: {
    label: string;
    value: string;
    tone?: "success" | "warning" | "danger" | "muted" | "accent";
}) {
    return (
        <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-2">
            <div className="text-[13px] leading-8 text-slate-400">{label}</div>
            <div className={["min-w-0 truncate text-[14px] font-medium leading-8", toneClass(tone)].join(" ")}>
                {value}
            </div>
        </div>
    );
}

function getWatchRowActions(status?: string | null) {
    const s = String(status || "").toUpperCase();

    if (s === "CONSIGNED_TO") {
        return {
            canQuickOrder: false,
            canConsign: false,
        };
    }

    return {
        canQuickOrder: s !== "SOLD",
        canConsign: s !== "SOLD",
    };
}

export default function WatchListRow({
    item,
    checked,
    canViewCost,
    onCheckedChange,
    onView,
    onEdit,
    onDelete,
    onService,
    onConsign,
    onQuickOrder,
}: Props) {
    const image = pickWatchInlineImage(item.images ?? []);
    const imageSrc = resolveMediaPreviewSrc(image?.fileKey || image?.url || null);
    const serviceMeta = getServiceMeta(item.serviceState);
    const readinessLabel = getReadinessLabel(item);
    const actions = getWatchRowActions(item.status);

    return (
        <tr className="border-t border-slate-100 transition hover:bg-slate-50/40">
            <td className="px-4 py-5 align-middle">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                />
            </td>

            <td className="px-4 py-5 align-middle">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                        {imageSrc ? (
                            <Image
                                src={imageSrc}
                                alt={item.title || "watch"}
                                width={64}
                                height={64}
                                className="h-16 w-16 object-cover"
                            />
                        ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium leading-6 text-slate-900">
                            <span className="line-clamp-2 break-words">{item.title || "-"}</span>
                        </div>

                        <div className="mt-1 truncate text-xs text-slate-500">
                            {`${(item.brand || "-").toLowerCase()} · watch`}
                        </div>

                        {item.sku ? (
                            <div className="mt-1 text-xs text-slate-400">SKU: {item.sku}</div>
                        ) : null}

                        <div className="mt-2 text-xs font-medium text-slate-500">{readinessLabel}</div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-5 align-middle">
                <div className="space-y-0">
                    <MetaRow
                        label="Content"
                        value={item.hasContent ? "Đã có" : "Chưa có"}
                        tone={item.hasContent ? "success" : "danger"}
                    />
                    <MetaRow
                        label="Image"
                        value={item.hasImages ? `Đã có${item.imagesCount ? ` (${item.imagesCount})` : ""}` : "Chưa có"}
                        tone={item.hasImages ? "success" : "danger"}
                    />
                    <MetaRow label="Service" value={serviceMeta.label} tone={serviceMeta.tone} />
                </div>
            </td>

            <td className="px-4 py-5 align-middle">
                <div className="space-y-0">
                    <MetaRow label="Bán" value={fmtMoney(item.minPrice ?? item.salePrice)} tone="accent" />
                    <MetaRow label="Sale" value={fmtMoney(item.salePrice)} tone="muted" />
                    {canViewCost ? <MetaRow label="Mua" value={fmtMoney(item.costPrice)} tone="muted" /> : null}
                </div>
            </td>

            <td className="px-4 py-5 align-middle">
                <div className="space-y-1 text-sm leading-6 text-slate-600">
                    <div>{fmtDT(item.updatedAt)}</div>
                    {item.createdAt ? <div className="text-xs text-slate-400">Tạo: {fmtDT(item.createdAt)}</div> : null}
                    {item.vendorName ? <div className="pt-1 text-xs text-slate-400">Vendor: {item.vendorName}</div> : null}
                </div>
            </td>

            <td className="relative overflow-visible px-4 py-5 text-right align-middle">
                <RowActionMenu
                    align="right"
                    actions={[
                        {
                            key: "view",
                            label: "Xem chi tiết",
                            icon: "view",
                            onClick: () => onView(item.productId),
                        },
                        {
                            key: "edit",
                            label: "Chỉnh sửa",
                            icon: "edit",
                            onClick: () => onEdit(item.productId),
                        },
                        {
                            key: "service",
                            label: "Tạo service request",
                            icon: "service",
                            onClick: () => onService(item.productId),
                        },
                        {
                            key: "quick",
                            label:
                                String(item.status).toUpperCase() === "IN_SERVICE"
                                    ? "Tạo đơn nhanh • ưu tiên kỹ thuật"
                                    : "Tạo đơn nhanh",
                            icon: "product",
                            onClick: () => onQuickOrder?.(item.productId),
                            hidden: !actions.canQuickOrder || !onQuickOrder,
                        },
                        {
                            key: "consign",
                            label: "Consign to",
                            icon: "archive",
                            onClick: () => onConsign?.(item.productId),
                            hidden: !actions.canConsign || !onConsign,
                        },
                        {
                            key: "delete",
                            label: "Xóa sản phẩm",
                            icon: "delete",
                            onClick: () => onDelete(item.productId),
                            danger: true,
                        },
                    ]}
                />
            </td>
        </tr>
    );
}
