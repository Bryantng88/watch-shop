"use client";

import Link from "next/link";
import RegenerateTitleSkuButton from "@/domains/watch/ui/edit/RegenerateTitleSkuButton";
import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";
import AdminBreadcrumbs, {
    type AdminBreadcrumbItem,
} from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import InlineImage from "@/domains/shared/ui/image/InlineImage";

type SimpleOption = {
    id: string;
    name: string;
    slug?: string | null;
};

type Props = {
    values: WatchFormValues;
    inlineImage?: InlineImageItem | null;
    brands?: SimpleOption[];
    pending?: boolean;
    message?: string;
    breadcrumbs?: AdminBreadcrumbItem[];
    onSubmit: () => void;
    onChange?: (patch: Partial<WatchFormValues>) => void;
};

function StatusBadge({ label }: { label?: string | null }) {
    if (!label) return null;

    return (
        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            {label}
        </span>
    );
}

export default function WatchEditHeader({
    values,
    brands = [],
    pending = false,
    message = "",
    breadcrumbs,
    onSubmit,
    onChange,
    inlineImage = null
}: Props) {
    const brandName =
        brands.find((x) => x.id === values.basic.brandId)?.name || "-";

    const title = values.basic.title || "Untitled watch";
    const sku = values.header.sku || "-";
    const productId = values.productId || "";

    const images = [
        ...(values.media.selectedImages || []),
        ...(values.media.chosenImages || []),
    ].map((img) => ({
        fileKey: img.key,
        url: img.url,
        role: img.role,
        sortOrder: img.sortOrder,
    }));

    const items: AdminBreadcrumbItem[] =
        breadcrumbs?.length
            ? breadcrumbs
            : [
                { label: "Watches", href: "/admin/watches" },
                { label: title },
            ];

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <AdminBreadcrumbs items={items} />

                    <div className="mt-4 flex items-start gap-4">
                        <InlineImage
                            image={inlineImage}
                            title={title}
                            size="lg"
                        />

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-950">
                                    {title}
                                </h1>

                                <StatusBadge label={values.basic.stockState || null} />
                                <StatusBadge label={values.basic.saleState || null} />
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                <span>
                                    SKU:{" "}
                                    <span className="font-medium text-slate-700">
                                        {sku}
                                    </span>
                                </span>

                                <span>
                                    Brand:{" "}
                                    <span className="font-medium text-slate-700">
                                        {brandName}
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

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                        href="/admin/watches"
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Quay lại
                    </Link>

                    {productId ? (
                        <RegenerateTitleSkuButton
                            productId={productId}
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
                        className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}