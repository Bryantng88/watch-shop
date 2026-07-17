"use client";

import Link from "next/link";
import { Camera, Loader2, MoreVertical, Pencil, Wrench } from "lucide-react";
import { operationButtonClass } from "@/domains/watch/ui/operations/shared/OperationShell";
import { cx, moneyText, titleForWatch } from "./workbench-utils";
import type { WatchWorkbenchPermissions, WatchWorkbenchValues } from "./types";

function statusChip(label: string, tone: "blue" | "green" | "amber" | "slate") {
    const tones = {
        blue: "border-blue-200 bg-blue-50 text-blue-700",
        green: "border-emerald-200 bg-emerald-50 text-emerald-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        slate: "border-slate-200 bg-slate-50 text-slate-700",
    };

    return (
        <span className={cx("inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium", tones[tone])}>
            {label}
        </span>
    );
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function stringValue(value: unknown) {
    return typeof value === "string" ? value : "";
}

function imageUrl(detail: Record<string, unknown>, values: WatchWorkbenchValues) {
    const images = Array.isArray(detail.images) ? detail.images : [];
    const firstImage = asRecord(images[0]);

    return (
        values.media.inlineImage?.url ||
        stringValue(detail.primaryImageUrl) ||
        stringValue(firstImage.url) ||
        null
    );
}

export default function WatchWorkbenchHeader({
    detail,
    values,
    permissions,
    onOpenMediaWorkspace,
    openingMediaWorkspace = false,
}: {
    detail: Record<string, unknown>;
    values: WatchWorkbenchValues;
    permissions: WatchWorkbenchPermissions;
    onOpenMediaWorkspace: () => void;
    openingMediaWorkspace?: boolean;
}) {
    const title = titleForWatch(detail, values);
    const src = imageUrl(detail, values);
    const brand = asRecord(detail.brand);
    const vendor = asRecord(detail.vendor);
    const priceLabel = values.pricing.salePrice || values.pricing.listPrice
        ? `${moneyText(values.pricing.salePrice || values.pricing.listPrice)} VND`
        : permissions.canViewSensitivePrice
            ? `${moneyText(values.pricing.landedCost || values.pricing.costPrice)} VND`
            : "Chưa có giá bán";

    return (
        <header className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex min-w-0 items-center gap-2">
                    <Link href="/admin/watches" className="transition hover:text-slate-900">Watch Management</Link>
                    <span className="text-slate-300">/</span>
                    <Link href="/admin/watches" className="transition hover:text-slate-900">Danh sách watch</Link>
                    <span className="text-slate-300">/</span>
                    <b className="truncate font-medium text-slate-800">{title}</b>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onOpenMediaWorkspace}
                        disabled={openingMediaWorkspace}
                        className={operationButtonClass({ variant: "secondary", size: "sm" })}
                    >
                        {openingMediaWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        {openingMediaWorkspace ? "Đang mở..." : "Mở Media WP"}
                    </button>
                    <Link href="/admin/services/operation" className={operationButtonClass({ variant: "secondary", size: "sm" })}>
                        <Wrench className="h-4 w-4" />
                        Mở Service Board
                    </Link>
                    <button className={operationButtonClass({ variant: "secondary", size: "sm", className: "w-9 px-0 text-slate-500" })}>
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <section className="grid gap-5 rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.045)] xl:grid-cols-[220px_minmax(0,1fr)_520px]">
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={title} className="h-full min-h-[210px] w-full object-cover" />
                    ) : (
                        <div className="grid min-h-[210px] place-items-center text-sm font-medium text-slate-400">
                            Chưa có ảnh
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={onOpenMediaWorkspace}
                        disabled={openingMediaWorkspace}
                        className={operationButtonClass({ variant: "primary", size: "xs", className: "absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur hover:bg-slate-900 disabled:opacity-70" })}
                    >
                        {openingMediaWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        Thêm hình ảnh
                    </button>
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-5 py-2">
                    <div>
                        <div className="mb-2 inline-flex h-7 items-center rounded-full bg-blue-50 px-3 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                            WATCH-{(values.header.sku || values.productId).slice(0, 10).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="truncate text-[30px] font-semibold leading-9 text-slate-950">{title}</h1>
                            <Pencil className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            {values.content.hookText || "Một màn hình duy nhất để xem, sửa và vận hành watch. Review và duyệt vẫn thuộc Workspace."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Meta label="Brand" value={stringValue(brand.name) || values.spec.specBrand || "-"} />
                        <Meta label="Model" value={values.spec.model || "-"} />
                        <Meta label="Reference" value={values.spec.referenceNumber || "-"} />
                        <Meta label="Vendor" value={stringValue(vendor.name) || "-"} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {statusChip(values.basic.saleState || "DRAFT", "blue")}
                        {statusChip(values.basic.stockState || "In stock", "green")}
                        {statusChip(values.contentReviewStatus || "Content draft", "amber")}
                        {statusChip(values.basic.serviceState || "Service", "slate")}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <SummaryCard label="Giá bán" value={priceLabel} icon="₫" />
                    <SummaryCard label="BPC" value="PRICING" icon="↗" />
                    <SummaryCard label="Nội dung" value={values.contentReviewStatus || "Draft"} icon="T" />
                    <SummaryCard label="Hình ảnh" value={values.imageReviewStatus || "Draft"} icon="▣" />
                </div>
            </section>
        </header>
    );
}

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-l border-slate-200 pl-3 first:border-l-0 first:pl-0">
            <div className="text-[10px] font-semibold uppercase text-slate-400">{label}</div>
            <div className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</div>
        </div>
    );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="flex min-h-[92px] items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-4 transition hover:border-slate-300">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-100">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase text-slate-400">{label}</div>
                <div className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</div>
            </div>
        </div>
    );
}
