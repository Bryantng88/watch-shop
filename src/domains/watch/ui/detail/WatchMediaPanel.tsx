"use client";

import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import {
  CollapsibleSection,
  Field,
  TinyStat,
  boolText,
  fmtDate,
  fmtMoney,
  signedImageUrl,
} from "./shared";

type MediaImage = {
  id?: string;
  url?: string | null;
  fileKey?: string | null;
  key?: string | null;
  path?: string | null;
  role?: string | null;
  sortOrder?: number | null;
};

function sortImages(items: MediaImage[]) {
  return [...items].sort(
    (a, b) =>
      Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
  );
}

function toDisplayImage(raw: MediaImage | null | undefined) {
  if (!raw) return null;

  const source =
    raw.url ??
    raw.fileKey ??
    raw.key ??
    raw.path ??
    null;

  if (!source) return null;

  const normalized = String(source);
  const resolvedUrl =
    normalized.startsWith("http://") || normalized.startsWith("https://")
      ? normalized
      : signedImageUrl(normalized);

  return {
    id: raw.id ?? normalized,
    key: normalized,
    url: resolvedUrl,
  };
}

function dedupeDisplayImages(items: Array<ReturnType<typeof toDisplayImage>>) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item) return false;
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  }) as Array<NonNullable<ReturnType<typeof toDisplayImage>>>;
}

export default function WatchMediaPanel({
  detail,
  inlineImages = [],
  galleryImages = [],
  canViewTradeFinancials = false,
}: {
  detail: any;
  inlineImages?: MediaImage[];
  galleryImages?: MediaImage[];
  canViewTradeFinancials?: boolean;
}) {
  const inlineDisplayImages = useMemo(() => {
    return dedupeDisplayImages(
      sortImages(inlineImages ?? []).map(toDisplayImage)
    );
  }, [inlineImages]);

  const galleryDisplayImages = useMemo(() => {
    return dedupeDisplayImages(
      sortImages(galleryImages ?? []).map(toDisplayImage)
    );
  }, [galleryImages]);

  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    setActiveImage(inlineDisplayImages[0]?.url ?? "");
  }, [inlineDisplayImages]);

  const contentText =
    detail?.content?.body ||
    detail?.content?.summary ||
    detail?.content?.hookText ||
    "";

  const bulletSpecs = Array.isArray(detail?.content?.bulletSpecs)
    ? detail.content.bulletSpecs.filter(Boolean)
    : [];

  const hasContent = Boolean(contentText.trim() || bulletSpecs.length);
  const hasGallery = galleryDisplayImages.length > 0;
  const hasPrice = Boolean(detail?.price?.salePrice || detail?.price?.listPrice);

  const publishMissing = [
    hasContent ? null : "content",
    hasGallery ? null : "images",
    hasPrice ? null : "price",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={detail?.title || "watch"}
                  className="h-[480px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[480px] items-center justify-center text-sm text-slate-400">
                  Chưa có ảnh inline
                </div>
              )}
            </div>

            {inlineDisplayImages.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {inlineDisplayImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(img.url)}
                    className={
                      activeImage === img.url
                        ? "overflow-hidden rounded-2xl border border-slate-900 p-1 ring-2 ring-slate-200"
                        : "overflow-hidden rounded-2xl border border-slate-200 p-1 hover:border-slate-300"
                    }
                  >
                    <img
                      src={img.url}
                      alt="inline-thumb"
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="p-5">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Giá bán
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {fmtMoney(detail?.price?.salePrice)}
                </div>
              </div>

              <div
                className={
                  canViewTradeFinancials
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-3"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2"
                }
              >
                {canViewTradeFinancials ? (
                  <TinyStat
                    label="Giá vốn"
                    value={fmtMoney(detail?.price?.costPrice)}
                    hint="watchPrice.costPrice"
                  />
                ) : null}

                <TinyStat label="SKU" value={detail?.sku || "-"} />
                <TinyStat
                  label="Độ sẵn sàng"
                  value={publishMissing.length === 0 ? "Sẵn sàng" : "Chưa đủ"}
                  hint={
                    publishMissing.length
                      ? `Thiếu: ${publishMissing.join(", ")}`
                      : "Đã có content + gallery + price"
                  }
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
              <Field label="Số ảnh" value={galleryDisplayImages.length} />
              <Field
                label="Has box / papers"
                value={`${boolText(
                  detail?.watch?.hasBox ?? detail?.spec?.boxIncluded
                )} / ${boolText(
                  detail?.watch?.hasPapers ?? detail?.spec?.cardIncluded
                )}`}
              />
            </div>
          </div>
        </div>
      </section>

      <CollapsibleSection
        title="Hình ảnh & phụ kiện"
        desc="Theo dõi nhanh media và phụ kiện đi kèm."
        icon={<ImageIcon className="h-5 w-5" />}
        defaultOpen
      >
        <div className="grid grid-cols-1 gap-3">
          <TinyStat label="Số ảnh" value={galleryDisplayImages.length} />
          <TinyStat
            label="Has box"
            value={boolText(detail?.watch?.hasBox ?? detail?.spec?.boxIncluded)}
          />
          <TinyStat
            label="Has papers"
            value={boolText(detail?.watch?.hasPapers ?? detail?.spec?.cardIncluded)}
          />
          <TinyStat
            label="Booklet"
            value={boolText(detail?.spec?.bookletIncluded)}
          />
          <TinyStat
            label="Card"
            value={boolText(detail?.spec?.cardIncluded)}
          />
        </div>

        {galleryDisplayImages.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryDisplayImages.map((img) => (
              <a
                key={img.id}
                href={img.url}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 hover:border-slate-300"
              >
                <img
                  src={img.url}
                  alt="gallery"
                  className="h-32 w-full object-cover"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Chưa có ảnh gallery.
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}