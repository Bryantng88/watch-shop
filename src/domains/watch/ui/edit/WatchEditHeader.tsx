"use client";

import Link from "next/link";
import { Save } from "lucide-react";
import { Badge } from "./shared";
import type { WatchFormValues } from "../../client/watch-form.types";

type SimpleOption = { id: string; name: string; slug?: string | null };

type Props = {
    values: WatchFormValues;
    brands: SimpleOption[];
    pending: boolean;
    message: string;
    onSubmit: () => void;
};

export default function WatchEditHeader({
    values,
    brands,
    pending,
    message,
    onSubmit,
}: Props) {
    return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/admin/watches" className="hover:text-slate-700">
                            Watch
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/admin/watches/${values.productId}`}
                            className="hover:text-slate-700"
                        >
                            Detail
                        </Link>
                        <span>/</span>
                        <span>Edit</span>
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Chỉnh sửa watch
                            </h1>
                            <Badge label={values.header.status || "DRAFT"} />
                            <Badge label={values.header.serviceState || "DRAFT"} />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span>
                                SKU:{" "}
                                <span className="font-medium text-slate-700">
                                    {values.header.sku || "-"}
                                </span>
                            </span>
                            <span>
                                Brand:{" "}
                                <span className="font-medium text-slate-700">
                                    {brands.find((x) => x.id === values.basic.brandId)?.name || "-"}
                                </span>
                            </span>
                            <span>
                                Updated: <span className="font-medium text-slate-700">-</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={`/admin/watches/${values.productId}`}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Quay lại
                    </Link>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={pending}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        {pending ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <ReadonlyStat label="SKU" value={values.header.sku || "-"} />
                    <ReadonlyStat label="Product status" value={values.header.status || "-"} />
                    <ReadonlyStat label="Service state" value={values.header.serviceState || "-"} />
                </div>
            </div>

            {message ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {message}
                </div>
            ) : null}
        </div>
    );
}

function ReadonlyStat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {label}
            </div>
            <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
        </div>
    );
}