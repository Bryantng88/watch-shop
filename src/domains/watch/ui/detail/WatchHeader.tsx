"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ImageIcon, Pencil } from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import { Button } from "@/domains/shared/ui/form/fields";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { fmtDate, StatusBadge } from "./shared";

type Props = {
  detail: any;
  inlineImage?: any | null;
};

function getImageSrc(image: any) {
  return image?.src ?? image?.url ?? image?.imageUrl ?? null;
}

export default function WatchHeader({ detail, inlineImage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const progress = useAppProgress();
  const returnTo = searchParams.get("returnTo") || "/admin/watches";
  const title = detail?.title || "Untitled watch";
  const productId = detail?.productId;
  const imageSrc = getImageSrc(inlineImage);

  function navigateWithProgress(href: string, title = "Đang chuyển trang") {
    progress.show({
      title,
      message: "Hệ thống đang mở màn hình mới.",
    });

    router.push(href);
    window.setTimeout(() => progress.hide(), 1200);
  }

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
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h1>

                <StatusBadge
                  label={detail?.watch?.stockState || detail?.status}
                />
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
                  Product ID:{" "}
                  <span className="font-mono text-xs font-medium text-slate-700">
                    {detail?.productId || detail?.id || "-"}
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
                Detail snapshot của watch. Dùng trang edit để cập nhật spec,
                giá, content và hình ảnh.
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigateWithProgress(returnTo, "Đang quay lại")}
          >
            Quay lại
          </Button>

          {productId ? (
            <Button
              onClick={() =>
                navigateWithProgress(
                  `/admin/watches/${productId}/edit?returnTo=${encodeURIComponent(returnTo)}`,
                  "Đang mở form chỉnh sửa",
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
