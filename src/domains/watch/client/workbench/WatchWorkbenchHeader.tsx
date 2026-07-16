"use client";

import Link from "next/link";
import { Camera, MoreVertical, Pencil, Wrench } from "lucide-react";
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
        <span className={cx("inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold", tones[tone])}>
            {label}
        </span>
    );
}

function imageUrl(detail: Record<string, any>, values: WatchWorkbenchValues) {
    return (
        values.media.inlineImage?.url ||
        detail?.primaryImageUrl ||
        detail?.images?.[0]?.url ||
        null
    );
}

export default function WatchWorkbenchHeader({
    detail,
    values,
    permissions,
}: {
    detail: Record<string, any>;
    values: WatchWorkbenchValues;
    permissions: WatchWorkbenchPermissions;
}) {
    const title = titleForWatch(detail, values);
    const src = imageUrl(detail, values);
    const priceLabel = values.pricing.salePrice || values.pricing.listPrice
        ? `${moneyText(values.pricing.salePrice || values.pricing.listPrice)} VND`
        : permissions.canViewSensitivePrice
            ? `${moneyText(values.pricing.landedCost || values.pricing.costPrice)} VND`
            : "Chưa có giá bán";

    return (
        <header className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex min-w-0 items-center gap-2">
                    <Link href="/admin/watches" className="hover:text-slate-900">Watch Management</Link>
                    <span>›</span>
                    <Link href="/admin/watches" className="hover:text-slate-900">Danh sách watch</Link>
                    <span>›</span>
                    <b className="truncate text-slate-900">{title}</b>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/watches/${values.productId}/edit?embedded=1&mode=media`} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                        <Camera className="h-4 w-4" />
                        Mở Media WP
                    </Link>
                    <Link href="/admin/service" className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                        <Wrench className="h-4 w-4" />
                        Mở Service Board
                    </Link>
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] xl:grid-cols-[220px_minmax(0,1fr)_520px]">
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={title} className="h-full min-h-[210px] w-full object-cover" />
                    ) : (
                        <div className="grid min-h-[210px] place-items-center text-sm font-semibold text-slate-400">
                            Chưa có ảnh
                        </div>
                    )}
                    <button className="absolute bottom-3 left-3 inline-flex h-8 items-center gap-2 rounded-md bg-slate-950/80 px-3 text-xs font-semibold text-white backdrop-blur">
                        <Camera className="h-4 w-4" />
                        Thêm hình ảnh
                    </button>
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-5 py-2">
                    <div>
                        <div className="mb-2 inline-flex h-7 items-center rounded-full bg-blue-50 px-3 text-xs font-bold text-blue-700">
                            WATCH-{(values.header.sku || values.productId).slice(0, 10).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="truncate text-3xl font-black tracking-[-0.01em] text-slate-950">{title}</h1>
                            <Pencil className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            {values.content.hookText || "Một màn hình duy nhất để xem, sửa và vận hành watch. Review và duyệt vẫn thuộc Workspace."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Meta label="Brand" value={detail?.brand?.name || values.spec.specBrand || "-"} />
                        <Meta label="Model" value={values.spec.model || "-"} />
                        <Meta label="Reference" value={values.spec.referenceNumber || "-"} />
                        <Meta label="Vendor" value={detail?.vendor?.name || "-"} />
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
            <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
            <div className="mt-1 truncate text-sm font-bold text-slate-950">{value}</div>
        </div>
    );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="flex min-h-[94px] items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-600">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
                <div className="mt-1 truncate text-sm font-black text-slate-950">{value}</div>
            </div>
        </div>
    );
}
