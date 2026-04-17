"use client";

import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import { DotLabel, fmtDate, toneForStatus } from "./shared";

export default function WatchHeader({ detail }: { detail: any }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/admin/watches" className="hover:text-slate-700">
              Watch
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="truncate">{detail?.title || "-"}</span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {detail?.title || "-"}
              </h1>

              <DotLabel label={detail?.status || "-"} tone={toneForStatus(detail?.status)} />

              {detail?.watch?.saleState ? (
                <DotLabel label={detail.watch.saleState} tone={toneForStatus(detail.watch.saleState)} />
              ) : null}

              {detail?.watch?.serviceState ? (
                <DotLabel label={`Service ${detail.watch.serviceState}`} tone={toneForStatus(detail.watch.serviceState)} />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>
                Product ID: <span className="font-mono text-slate-700">{detail?.productId || "-"}</span>
              </span>
              <span>
                SKU: <span className="font-medium text-slate-700">{detail?.sku || "-"}</span>
              </span>
              <span>
                Brand: <span className="font-medium text-slate-700">{detail?.brand?.name || "-"}</span>
              </span>
              <span>
                Category: <span className="font-medium text-slate-700">{detail?.category?.name || "-"}</span>
              </span>
              <span>
                Updated: <span className="font-medium text-slate-700">{fmtDate(detail?.updatedAt)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/watches"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Quay lại
          </Link>

          <Link
            href={`/admin/watches/${detail?.productId}/edit`}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Pencil className="h-4 w-4" />
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
}
