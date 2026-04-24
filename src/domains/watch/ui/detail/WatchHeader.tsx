"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import InlineImage from "@/domains/shared/ui/image/InlineImage";
import { Button } from "@/domains/shared/ui/form/fields";
import { fmtDate, StatusBadge } from "./shared";

type Props = {
  detail: any;
  inlineImage?: any | null;
};

export default function WatchHeader({ detail, inlineImage }: Props) {
  const title = detail?.title || "Untitled watch";
  const productId = detail?.productId;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <AdminBreadcrumbs
            items={[
              { label: "Watches", href: "/admin/watches" },
              { label: title },
            ]}
          />

          <div className="mt-4 flex items-start gap-4">
            <InlineImage image={inlineImage} title={title} size="xl" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h1>

                <StatusBadge label={detail?.watch?.stockState || detail?.status} />
                <StatusBadge label={detail?.watch?.saleState} />
                <StatusBadge label={detail?.watch?.serviceState} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>
                  SKU:{" "}
                  <span className="font-medium text-slate-700">
                    {detail?.sku || "-"}
                  </span>
                </span>

                <span>
                  Brand:{" "}
                  <span className="font-medium text-slate-700">
                    {detail?.brand?.name || "-"}
                  </span>
                </span>

                <span>
                  Updated:{" "}
                  <span className="font-medium text-slate-700">
                    {fmtDate(detail?.updatedAt)}
                  </span>
                </span>
              </div>

              <div className="mt-3 max-w-3xl text-sm text-slate-600">
                Detail snapshot của watch. Dùng trang edit để cập nhật spec, giá, content và hình ảnh.
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link href="/admin/watches">
            <Button variant="outline">Quay lại</Button>
          </Link>

          {productId ? (
            <Link href={`/admin/watches/${productId}/edit`}>
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}