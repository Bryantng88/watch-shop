"use client";

import Link from "next/link";
import {
    BadgeDollarSign,
    Camera,
    Check,
    ChevronRight,
    Circle,
    FileText,
    Loader2,
    Wrench,
} from "lucide-react";

import { operationButtonClass } from "@/domains/watch/ui/operations/shared/OperationShell";
import { cx, moneyText, titleForWatch } from "./workbench-utils";
import type { WatchWorkbenchPermissions, WatchWorkbenchValues } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function stringValue(value: unknown) {
    return typeof value === "string" ? value : "";
}

function imageUrl(detail: Record<string, unknown>, values: WatchWorkbenchValues) {
    const images = Array.isArray(detail.images) ? detail.images : [];
    const firstImage = asRecord(images[0]);

    return values.media.inlineImage?.url || stringValue(detail.primaryImageUrl) || stringValue(firstImage.url) || null;
}

function normalizedStatus(value?: string | null) {
    return String(value ?? "").trim().toUpperCase();
}

function isApproved(value?: string | null) {
    return ["APPROVED", "PUBLISHED", "POSTED", "READY"].includes(normalizedStatus(value));
}

function stockLabel(value?: string | null) {
    return {
        IN_STOCK: "Còn hàng",
        OUT_OF_STOCK: "Hết hàng",
        RESERVED: "Đã giữ hàng",
    }[normalizedStatus(value)] ?? value ?? "Chưa xác định";
}

function saleLabel(value?: string | null) {
    return {
        DRAFT: "Bản nháp",
        PROCESSING: "Đang xử lý",
        READY: "Sẵn sàng bán",
        HOLD: "Giữ hàng",
        SOLD: "Đã bán",
        IN_SERVICE: "Đang service",
    }[normalizedStatus(value)] ?? value ?? "Chưa xác định";
}

type ProgressState = "done" | "active" | "idle";

type ProgressItem = {
    label: string;
    detail: string;
    state: ProgressState;
};

function ReadinessProgress({ items }: { items: ProgressItem[] }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
            <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">Chuẩn bị đăng bán</h2>
                <p className="mt-1 text-xs text-slate-400">Tiến độ hoàn thiện hồ sơ Watch.</p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-y-7 md:grid-cols-4">
                {items.map((item, index) => {
                    const done = item.state === "done";
                    const active = item.state === "active";
                    return (
                        <div key={item.label} className="relative px-4 first:pl-0 last:pr-0">
                            {index < items.length - 1 ? (
                                <div className={cx(
                                    "absolute left-[34px] right-[-18px] top-2 h-px",
                                    done ? "bg-emerald-400" : active ? "bg-amber-300" : "bg-slate-200",
                                )} />
                            ) : null}
                            <div className={cx(
                                "relative z-10 grid h-4 w-4 place-items-center rounded-full",
                                done
                                    ? "bg-emerald-500 text-white"
                                    : active
                                      ? "bg-white text-amber-500 ring-2 ring-amber-400"
                                      : "bg-white text-slate-300 ring-1 ring-slate-300",
                            )}>
                                {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : active ? <Circle className="h-2 w-2 fill-current" /> : null}
                            </div>
                            <div className={cx("mt-3 text-xs font-semibold", done ? "text-emerald-700" : active ? "text-amber-700" : "text-slate-600")}>{item.label}</div>
                            <div className="mt-1 text-[11px] text-slate-500">{item.detail}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default function WatchWorkbenchHeader({
    detail,
    values,
    permissions,
    onOpenMediaWorkspace,
    onOpenPricing,
    pricingDirty = false,
    openingMediaWorkspace = false,
}: {
    detail: Record<string, unknown>;
    values: WatchWorkbenchValues;
    permissions: WatchWorkbenchPermissions;
    onOpenMediaWorkspace: () => void;
    onOpenPricing: () => void;
    pricingDirty?: boolean;
    openingMediaWorkspace?: boolean;
}) {
    const title = titleForWatch(detail, values);
    const src = imageUrl(detail, values);
    const brand = asRecord(detail.brand);
    const vendor = asRecord(detail.vendor);
    const imageCount = Math.max(values.media.imageCount, values.media.galleryImages.length, src ? 1 : 0);
    const hasContent = Boolean(values.content.titleOverride || values.content.hookText || values.content.body);
    const hasPrice = Boolean(values.pricing.salePrice || values.pricing.listPrice);
    const serviceStatus = normalizedStatus(values.basic.serviceState || values.header.serviceState);
    const serviceDone = ["NOT_REQUIRED", "DONE"].includes(serviceStatus);
    const progressItems: ProgressItem[] = [
        {
            label: "Gallery",
            detail: isApproved(values.imageReviewStatus) ? "Hoàn tất" : imageCount ? "Đang duyệt" : "Chưa có ảnh",
            state: isApproved(values.imageReviewStatus) ? "done" : imageCount ? "active" : "idle",
        },
        {
            label: "Content",
            detail: isApproved(values.contentReviewStatus) ? "Hoàn tất" : hasContent ? "Đang xử lý" : "Chưa có nội dung",
            state: isApproved(values.contentReviewStatus) ? "done" : hasContent ? "active" : "idle",
        },
        { label: "Pricing", detail: hasPrice ? "Hoàn tất" : "Chưa có giá", state: hasPrice ? "done" : "idle" },
        {
            label: "Service",
            detail: serviceStatus === "NOT_REQUIRED" ? "Không yêu cầu" : serviceDone ? "Hoàn tất" : serviceStatus ? "Đang xử lý" : "Chưa có",
            state: serviceDone ? "done" : serviceStatus ? "active" : "idle",
        },
    ];
    const completedCount = progressItems.filter((item) => item.state === "done").length;
    const firstBlocker = progressItems.find((item) => item.state !== "done");
    const blockerHref = firstBlocker?.label === "Gallery"
        ? "#images"
        : firstBlocker?.label === "Content"
          ? "#content"
          : firstBlocker?.label === "Pricing"
            ? "#pricing"
            : "/admin/services/operation";
    const priceLabel = hasPrice
        ? `${moneyText(values.pricing.salePrice || values.pricing.listPrice)} VND`
        : permissions.canViewSensitivePrice && (values.pricing.landedCost || values.pricing.costPrice)
          ? `${moneyText(values.pricing.landedCost || values.pricing.costPrice)} VND`
          : "Chưa thiết lập";
    const metadata = [
        { label: "Brand", value: stringValue(brand.name) || values.spec.specBrand || "-" },
        { label: "Model", value: values.spec.model || "-" },
        { label: "Reference", value: values.spec.referenceNumber || "-" },
        { label: "Vendor", value: stringValue(vendor.name) || "-" },
        { label: "Năm SX", value: values.basic.yearText || "-" },
        { label: "Bộ máy", value: values.spec.calibre || values.basic.movementCalibre || "-" },
    ];

    return (
        <header className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <nav className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
                    <Link href="/admin/watches" className="hover:text-slate-900">Danh sách watch</Link>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <span className="truncate font-semibold text-slate-800">{title}</span>
                </nav>
                <Link href="/admin/services/operation" className={operationButtonClass({ variant: "secondary", size: "sm" })}>
                    <Wrench className="h-4 w-4" />Mở Service Board
                </Link>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                <div className="min-w-0 space-y-4">
                    <section className="grid overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:grid-cols-[260px_minmax(0,1fr)]">
                        <div className="relative min-h-[250px] overflow-hidden rounded-lg bg-slate-100">
                            {src ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover" />
                            ) : (
                                <div className="grid h-full min-h-[250px] place-items-center text-sm font-medium text-slate-400">Chưa có ảnh</div>
                            )}
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <button type="button" onClick={onOpenMediaWorkspace} disabled={openingMediaWorkspace} className="inline-flex h-8 items-center gap-2 rounded-lg bg-slate-950/90 px-3 text-[11px] font-semibold text-white backdrop-blur disabled:opacity-70">
                                    {openingMediaWorkspace ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                                    {openingMediaWorkspace ? "Đang mở..." : "Xem gallery"}
                                </button>
                                <span className="rounded-lg bg-slate-950/75 px-2.5 py-2 text-[10px] font-semibold text-white backdrop-blur">{imageCount} ảnh</span>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col justify-between gap-6 p-4 md:p-5">
                            <div>
                                <span className="inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">WATCH-{(values.header.sku || values.productId).slice(0, 10).toUpperCase()}</span>
                                <h1 className="mt-4 text-[25px] font-semibold leading-tight tracking-[-0.025em] text-slate-950">{title}</h1>
                                {values.content.hookText ? <p className="mt-2 text-sm text-slate-500">{values.content.hookText}</p> : null}

                                <div className="mt-7 grid grid-cols-2 border-y border-slate-100 sm:grid-cols-3 xl:grid-cols-6">
                                    {metadata.map((item) => (
                                        <div key={item.label} className="min-w-0 border-r border-slate-100 px-3 py-3 first:pl-0 last:border-r-0">
                                            <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</div>
                                            <div className="mt-1 truncate text-xs font-semibold text-slate-900">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">{stockLabel(values.basic.stockState)}</span>
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">{saleLabel(values.basic.saleState)}</span>
                                <span className="inline-flex rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">SKU: {values.header.sku || "-"}</span>
                            </div>
                        </div>
                    </section>

                    <ReadinessProgress items={progressItems} />
                </div>

                <aside className="grid h-full grid-rows-[auto_1fr] gap-4">
                    <section className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Giá bán hiện tại</div>
                            {pricingDirty ? <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700 ring-1 ring-amber-200">Chưa lưu</span> : null}
                        </div>
                        <div className="mt-4 text-[25px] font-semibold tracking-[-0.04em] text-slate-950">{priceLabel}</div>
                        <button type="button" onClick={onOpenPricing} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-violet-300 text-xs font-semibold text-violet-700 hover:bg-violet-50">
                            <BadgeDollarSign className="h-4 w-4" />{hasPrice ? "Chỉnh sửa giá" : "Thiết lập giá"}
                        </button>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Health sản phẩm</div>
                            <span className={cx("rounded-md px-2 py-1 text-[10px] font-bold", completedCount === 4 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{completedCount === 4 ? "Tốt" : "Cần xử lý"}</span>
                        </div>
                        <div className={cx("mt-5 text-xl font-semibold", completedCount === 4 ? "text-emerald-700" : "text-amber-700")}>{completedCount === 4 ? "Sẵn sàng bán" : "Gần sẵn sàng bán"}</div>
                        <div className="mt-1 text-xs font-medium text-slate-600">{completedCount}/4 nhóm dữ liệu hoàn tất</div>

                        {firstBlocker ? (
                            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                <div className="flex items-start gap-2">
                                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                    <div>
                                        <div className="text-xs font-semibold text-amber-900">Cần xử lý {firstBlocker.label}</div>
                                        <p className="mt-1 text-[11px] leading-5 text-amber-800">{firstBlocker.detail} trước khi hồ sơ Watch hoàn tất.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">Watch đã hoàn tất các nhóm dữ liệu chính.</div>
                        )}

                        <a href={blockerHref} className="mt-auto inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                            {firstBlocker ? `Xử lý ${firstBlocker.label}` : "Xem chi tiết"}
                        </a>
                    </section>
                </aside>
            </div>
        </header>
    );
}
