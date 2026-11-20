"use client";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ChevronRight, Images, Loader2, X } from "lucide-react";
import { AdminPageCanvas, AdminPageHeader, AdminFlatToolbar, AdminListFooter, ADMIN_UI } from "@/domains/shared/ui/admin-design-contract";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { mediaStages, mediaStageLabels, mediaListHref, mediaRowHref, type MediaListData, type MediaStage } from "../../shared/ben-media-workspace";

function rememberScroll(key: string) {
  try { sessionStorage.setItem(key, String(window.scrollY)); } catch { /* Browser storage may be disabled. */ }
}
function MediaThumbnail({src}: {src: string | null}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-50 text-slate-400">{src && !failed ? <Image src={src} width={48} height={48} alt="" unoptimized onError={() => setFailed(true)} className="h-full w-full object-cover"/> : <Images size={18} aria-hidden="true"/>}</span>;
}
export default function BenMediaWorkspace({data}: {data: MediaListData}) {
  const router = useRouter();
  const [query, setQuery] = useState(data.q);
  const [pending, startTransition] = useTransition();
  const href = mediaListHref(data);
  const scrollKey = "ben-media-scroll:" + href;
  useEffect(() => setQuery(data.q), [data.q]);
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        let top = 0;
        try { top = Number(sessionStorage.getItem(scrollKey)) || 0; } catch { /* Natural scrolling remains available. */ }
        window.scrollTo({top});
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollKey]);
  function navigate(stage: MediaStage, q = query, page = 1) {
    startTransition(() => router.push(mediaListHref({stage, q: q.trim(), page}), {scroll: false}));
  }
  return <AdminPageCanvas className="mx-auto max-w-3xl !px-4 pb-16">
    <Link href="/admin/ben" className="inline-flex min-h-11 items-center gap-1 text-xs text-slate-500"><ArrowLeft className="h-3.5 w-3.5" />Ben</Link>
    <AdminPageHeader title="Media" meta={<span className="text-xs text-slate-500"><strong className={ADMIN_UI.metricValue}>{data.open.toLocaleString("vi-VN")}</strong> {data.q ? "kết quả đang mở" : "đang mở"}</span>} />
    <AdminFlatToolbar>
      <form role="search" aria-label="Tìm media" onSubmit={event => {event.preventDefault(); navigate(data.stage);}} className="flex min-w-0 items-center gap-1">
        <input aria-label="Tìm theo đồng hồ, SKU hoặc mã bài" value={query} onChange={event => setQuery(event.target.value)} maxLength={120} placeholder="Đồng hồ, SKU, mã bài…" className="min-h-11 min-w-0 flex-1 bg-transparent px-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-blue-200" />
        {query && <AdminButton iconOnly variant="secondary" type="button" disabled={pending} aria-label="Xóa tìm kiếm" onClick={() => {setQuery("");navigate(data.stage, "");}} className="grid h-11 w-9 shrink-0 place-items-center rounded-lg text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-300"><X size={16} /></AdminButton>}
        <AdminButton iconOnly variant="secondary" type="submit" disabled={pending} aria-label="Tìm media" className="grid h-11 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-300">{pending ? <Loader2 size={16} className="animate-spin"/> : <Search size={16}/>}</AdminButton>
        <select aria-label="Giai đoạn media" value={data.stage} disabled={pending} onChange={event => navigate(event.target.value as MediaStage)} className="min-h-11 max-w-[42%] rounded-lg border-0 bg-white px-2 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-300">{mediaStages.map(stage => <option key={stage} value={stage}>{mediaStageLabels[stage]}</option>)}</select>
      </form>
    </AdminFlatToolbar>
    <div aria-live="polite" className="flex items-center justify-between text-xs text-slate-500"><span>{data.total.toLocaleString("vi-VN")} mục · {mediaStageLabels[data.stage]}</span>{pending && <span role="status">Đang tải…</span>}</div>
    <div aria-busy={pending} className={pending ? "opacity-60" : undefined}>
      {!data.items.length && <p className="py-10 text-sm text-slate-500">{data.q ? "Không có media phù hợp. Thử tên hoặc SKU khác." : "Chưa có mục nào ở giai đoạn này."}</p>}
      <ul className="divide-y divide-slate-100">
        {data.items.map(item => {
          const destination = mediaRowHref(item, href, data.canEdit);
          const src = resolveMediaPreviewSrc(item.imageUrl);
          const completed = item.targetType === "WATCH" && item.progress ? Object.values(item.progress).filter(Boolean).length : null;
          const identity = <>
            <MediaThumbnail src={src} />
            <span className="min-w-0 flex-1 space-y-1">
              <span className="line-clamp-2 block text-sm font-semibold leading-5 text-slate-900">{item.title || "Chưa có tên"}</span>
              {item.note && <span className="line-clamp-1 block text-xs text-amber-700">{item.note}</span>}
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                {item.targetType === "MEDIA_POST" && <span>Bài đăng</span>}
                {completed !== null && <span className="tabular-nums text-blue-700">{completed}/4 mục xong</span>}
                {item.sku && <span className="break-all">{item.sku}</span>}
              </span>
            </span>
            {destination && <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-slate-300"/>}
          </>;
          return <li key={item.bindingId} data-media-row={item.id}>{destination ? <Link href={destination} onClick={() => rememberScroll(scrollKey)} aria-label={`Mở ${item.title || item.sku || "media"}`} className="flex min-h-24 items-center gap-3 rounded-lg py-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300">{identity}</Link> : <div className="flex min-h-24 items-center gap-3 py-4">{identity}</div>}</li>;
        })}
      </ul>
    </div>
    <AdminListFooter total={data.total} unit="mục" page={data.page} totalPages={data.totalPages} pending={pending}
      onPrevious={() => navigate(data.stage, data.q, data.page - 1)} onNext={() => navigate(data.stage, data.q, data.page + 1)} />
  </AdminPageCanvas>;
}
