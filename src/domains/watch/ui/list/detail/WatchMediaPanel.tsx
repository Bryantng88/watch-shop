"use client";

import { useMemo, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { CollapsibleSection, Field, TinyStat, boolText, fmtDate, fmtMoney, signedImageUrl } from "./shared";

export default function WatchMediaPanel({ detail, images = [], canViewTradeFinancials = false }: { detail: any; images?: any[]; canViewTradeFinancials?: boolean; }) {
  const gallery = useMemo(() => {
    const out: Array<{ key: string; url: string }> = [];
    const seen = new Set<string>();

    const pushImage = (raw?: string | null) => {
      if (!raw) return;
      const key = String(raw);
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ key, url: signedImageUrl(key) });
    };

    if (detail?.primaryImageUrl) pushImage(detail.primaryImageUrl);

    for (const img of images ?? []) {
      if (img?.role && String(img.role).toUpperCase() !== "GALLERY") continue;
      pushImage(img?.url ?? img?.fileKey ?? null);
    }

    if (!out.length) {
      for (const img of images ?? []) pushImage(img?.url ?? img?.fileKey ?? null);
    }

    return out;
  }, [detail?.primaryImageUrl, images]);

  const [activeImage, setActiveImage] = useState<string>(gallery[0]?.url ?? "");

  const contentText = detail?.content?.body || detail?.content?.summary || detail?.content?.hookText || "";
  const bulletSpecs = Array.isArray(detail?.content?.bulletSpecs) ? detail.content.bulletSpecs.filter(Boolean) : [];
  const hasContent = Boolean(contentText.trim() || bulletSpecs.length);
  const hasGallery = gallery.length > 0;
  const hasPrice = Boolean(detail?.price?.salePrice || detail?.price?.listPrice);
  const publishMissing = [hasContent ? null : "content", hasGallery ? null : "images", hasPrice ? null : "price"].filter(Boolean) as string[];

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
            {activeImage ? (
              <img src={activeImage} alt={detail?.title || "watch"} className="h-[480px] w-full object-cover" />
            ) : (
              <div className="flex h-[480px] items-center justify-center text-sm text-slate-400">Chưa có ảnh gallery</div>
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {gallery.map((img) => (
                <button
                  key={img.key}
                  type="button"
                  onClick={() => setActiveImage(img.url)}
                  className={activeImage === img.url ? "overflow-hidden rounded-2xl border border-slate-900 p-1 ring-2 ring-slate-200" : "overflow-hidden rounded-2xl border border-slate-200 p-1 hover:border-slate-300"}
                >
                  <img src={img.url} alt="thumb" className="h-16 w-16 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="p-5">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Giá bán</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{fmtMoney(detail?.price?.salePrice)}</div>
            </div>

            <div className={canViewTradeFinancials ? "grid grid-cols-1 gap-3 sm:grid-cols-3" : "grid grid-cols-1 gap-3 sm:grid-cols-2"}>
              {canViewTradeFinancials ? <TinyStat label="Giá vốn" value={fmtMoney(detail?.price?.costPrice)} hint="watchPrice.costPrice" /> : null}
              <TinyStat label="SKU" value={detail?.sku || "-"} />
              <TinyStat
                label="Độ sẵn sàng"
                value={publishMissing.length === 0 ? "Sẵn sàng" : "Chưa đủ"}
                hint={publishMissing.length ? `Thiếu: ${publishMissing.join(", ")}` : "Đã có content + image + price"}
                emphasize={publishMissing.length === 0}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Brand" value={detail?.brand?.name || "-"} />
            <Field label="Vendor" value={detail?.vendor?.name || "-"} />
            <Field label="Danh mục" value={detail?.category?.name || "-"} />
            <Field label="Slug" value={detail?.slug || "-"} mono />
            <Field label="Tạo lúc" value={fmtDate(detail?.createdAt)} />
            <Field label="Cập nhật" value={fmtDate(detail?.updatedAt)} />
            <Field label="Số ảnh" value={gallery.length} />
            <Field label="Has box / papers" value={`${boolText(detail?.watch?.hasBox ?? detail?.spec?.boxIncluded)} / ${boolText(detail?.watch?.hasPapers ?? detail?.spec?.cardIncluded)}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
