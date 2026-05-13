"use client";

import { ArrowLeft, Loader2 } from "lucide-react";

import RegenerateTitleSkuButton from "@/domains/watch/ui/edit/RegenerateTitleSkuButton";
import type {
    PickedMediaItem,
    WatchFormValues,
} from "@/domains/watch/client/form/watch-form.types";
import AdminBreadcrumbs, {
    type AdminBreadcrumbItem,
} from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";

type SimpleOption = {
    id: string;
    name: string;
    slug?: string | null;
};

type Props = {
    values: WatchFormValues;
    inlineImage?: PickedMediaItem | null;
    brands?: SimpleOption[];
    pending?: boolean;
    message?: string;
    breadcrumbs?: AdminBreadcrumbItem[];
    canReviewContent?: boolean;
    onSubmit: () => void;
    onBack?: () => void;
    onChange?: (patch: Partial<WatchFormValues>) => void;
};

function getOverallReviewStatus(values: WatchFormValues) {
    const content = String(values.contentReviewStatus ?? "DRAFT").toUpperCase();
    const image = String(values.imageReviewStatus ?? "DRAFT").toUpperCase();

    if (content === "REJECTED" || image === "REJECTED") return "Cần chỉnh";
    if (content === "SUBMITTED" || image === "SUBMITTED") return "Chờ duyệt";
    if (content === "APPROVED" && image === "APPROVED") return "Sẵn sàng";
    if (content === "APPROVED" || image === "APPROVED") return "Duyệt một phần";
    return "Draft";
}

function ReviewBadge({ label }: { label: string }) {
    const style =
        label === "Chờ duyệt"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : label === "Sẵn sàng"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : label === "Cần chỉnh"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : label === "Duyệt một phần"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600";

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
        >
            {label}
        </span>
    );
}

function HeaderImage({
    image,
    title,
}: {
    image?: PickedMediaItem | null;
    title: string;
}) {
    const src =
        image?.url || image?.key
            ? image?.url ||
            `/api/media/sign?key=${encodeURIComponent(image?.key ?? "")}`
            : null;

    return (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {src ? (
                <img src={src} alt={title} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No image
                </div>
            )}
        </div>
    );
}

export default function WatchEditHeader({
    values,
    brands = [],
    pending = false,
    message = "",
    breadcrumbs,
    onSubmit,
    onBack,
    onChange,
    inlineImage = null,
}: Props) {
    const brandName =
        brands.find((x) => x.id === values.basic.brandId)?.name || "-";

    const title = values.basic.title || "Untitled watch";
    const sku = values.header.sku || "-";
    const productId = values.productId || "";

    const items: AdminBreadcrumbItem[] = breadcrumbs?.length
        ? breadcrumbs
        : [{ label: "Watches", href: "/admin/watches" }, { label: title }];

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <AdminBreadcrumbs items={items} />

                    <div className="mt-4 flex items-start gap-4">
                        <HeaderImage image={inlineImage} title={title} />

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-950">
                                    {title}
                                </h1>

                                <ReviewBadge label={getOverallReviewStatus(values)} />
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                <span>
                                    SKU: <span className="font-medium text-slate-700">{sku}</span>
                                </span>

                                <span>
                                    Brand:{" "}
                                    <span className="font-medium text-slate-700">
                                        {brandName}
                                    </span>
                                </span>
                                <span>
                                    Product ID:{" "}
                                    <span className="font-mono text-xs font-medium text-slate-700">
                                        {productId}
                                    </span>
                                </span>
                            </div>

                            <div className="mt-3 max-w-3xl text-sm text-slate-600">
                                Sau khi bổ sung spec cần thiết, bấm{" "}
                                <span className="font-medium text-slate-800">
                                    Gen lại title & SKU
                                </span>{" "}
                                để đồng bộ theo rule hệ thống.
                            </div>
                        </div>
                    </div>

                    {message ? (
                        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-inset ring-slate-200">
                            {message}
                        </div>
                    ) : null}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </button>

                    {productId ? (
                        <RegenerateTitleSkuButton
                            values={values}
                            brands={brands}
                            onDone={(res) => {
                                onChange?.({
                                    basic: {
                                        ...values.basic,
                                        title: res.title,
                                    },
                                    header: {
                                        ...values.header,
                                        sku: res.sku,
                                    },
                                });
                            }}
                        />
                    ) : null}

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={pending}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            "Lưu thay đổi"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
