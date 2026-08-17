"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, FolderSync, ImageIcon, Monitor, Smartphone } from "lucide-react";

import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type HeroRecord = {
  id: string;
  altText: string | null;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  overlayOpacity: number;
  isActive: boolean;
};

type NasHeroImage = {
  storageKey: string;
  fileName: string;
  sizeBytes: number | null;
  lastModified: string | null;
  url: string;
  record: HeroRecord | null;
};

type Adjustment = { altText: string; focalX: number; focalY: number; overlayOpacity: number };
const DEFAULT_ADJUSTMENT: Adjustment = { altText: "", focalX: 50, focalY: 50, overlayOpacity: 55 };

function adjustmentFrom(item: NasHeroImage | null): Adjustment {
  return item?.record ? {
    altText: item.record.altText ?? "",
    focalX: item.record.focalX,
    focalY: item.record.focalY,
    overlayOpacity: item.record.overlayOpacity,
  } : DEFAULT_ADJUSTMENT;
}

export default function StorefrontHeroManager() {
  const notify = useNotify();
  const [items, setItems] = useState<NasHeroImage[]>([]);
  const [root, setRoot] = useState("storefront/hero/");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [adjustment, setAdjustment] = useState<Adjustment>(DEFAULT_ADJUSTMENT);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings/storefront-hero", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "Không thể quét kho Hero trên NAS.");
      const nextItems: NasHeroImage[] = json.items ?? [];
      setItems(nextItems);
      setRoot(json.root ?? "storefront/hero/");
      const current = nextItems.find((item) => item.storageKey === selectedKey)
        ?? nextItems.find((item) => item.record?.isActive)
        ?? nextItems[0]
        ?? null;
      setSelectedKey(current?.storageKey ?? null);
      setAdjustment(adjustmentFrom(current));
      if (json.truncated) notify.warning({ title: "Kho Hero có nhiều ảnh", message: "Đang hiển thị 200 ảnh mới nhất." });
    } catch (error) {
      notify.error({ title: "Không thể đọc NAS", message: error instanceof Error ? error.message : "Có lỗi xảy ra." });
    } finally {
      setLoading(false);
    }
  }, [notify, selectedKey]);

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = useMemo(() => items.find((item) => item.storageKey === selectedKey) ?? null, [items, selectedKey]);
  const active = useMemo(() => items.find((item) => item.record?.isActive) ?? null, [items]);

  function select(item: NasHeroImage) {
    setSelectedKey(item.storageKey);
    setAdjustment(adjustmentFrom(item));
  }

  async function activate() {
    if (!selected) return;
    setPending(true);
    try {
      const response = await fetch("/api/admin/settings/storefront-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storageKey: selected.storageKey, ...adjustment }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "Không thể đặt ảnh Hero.");
      await load();
      notify.success({ title: "Đã cập nhật Hero storefront", message: "Ảnh gốc vẫn được giữ nguyên trên NAS." });
    } catch (error) {
      notify.error({ title: "Không thể chọn ảnh Hero", message: error instanceof Error ? error.message : "Có lỗi xảy ra." });
    } finally {
      setPending(false);
    }
  }

  const previewStyle = selected ? {
    backgroundImage: `url("${selected.url}")`,
    backgroundPosition: `${adjustment.focalX}% ${adjustment.focalY}%`,
  } : undefined;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 lg:px-6">
      <header className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"><ImageIcon className="h-4 w-4" /> Storefront</div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Hero trang đồng hồ</h1>
            <p className="mt-1 text-sm text-slate-500">Chép ảnh vào NAS <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{root}</code>, sau đó quét và chọn ảnh tại đây.</p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading || pending} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><FolderSync className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Quét lại NAS</button>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-slate-950">Mô phỏng storefront</h2>{selected?.record?.isActive ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Đang sử dụng</span> : null}</div>
          <div className="relative min-h-[330px] overflow-hidden rounded-2xl bg-cover bg-center text-white" style={previewStyle}>
            <div className="absolute inset-0 bg-black" style={{ opacity: adjustment.overlayOpacity / 100 }} />
            <div className="relative flex min-h-[330px] max-w-xl flex-col justify-end p-8">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/75">Tuyển chọn bằng cảm xúc</div>
              <div className="mt-2 font-serif text-4xl leading-tight">Nơi bạn thấy chiếc đồng hồ dành cho mình</div>
              <div className="mt-3 text-sm leading-6 text-white/80">Những chiếc đồng hồ được chọn bởi cá tính, câu chuyện và vẻ đẹp vượt thời gian.</div>
            </div>
            {!selected ? <div className="absolute inset-0 grid place-items-center bg-slate-100 text-sm text-slate-400">Chọn một ảnh trong kho NAS để preview.</div> : null}
          </div>
          {selected ? <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <div className="relative h-32 overflow-hidden rounded-xl bg-cover" style={previewStyle}><div className="absolute inset-0 bg-black" style={{ opacity: adjustment.overlayOpacity / 100 }} /><div className="absolute bottom-3 left-4 text-sm font-semibold text-white"><Monitor className="mb-1 h-4 w-4" />Desktop</div></div>
            <div className="relative h-32 overflow-hidden rounded-xl bg-cover" style={previewStyle}><div className="absolute inset-0 bg-black" style={{ opacity: adjustment.overlayOpacity / 100 }} /><div className="absolute bottom-3 left-4 text-sm font-semibold text-white"><Smartphone className="mb-1 h-4 w-4" />Mobile</div></div>
          </div> : null}
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-950">Điều chỉnh hiển thị</h2>
          <p className="mt-1 truncate text-xs text-slate-400">{selected?.fileName ?? "Chưa chọn ảnh"}</p>
          <label className="mt-5 block text-xs font-semibold text-slate-600">Điểm trọng tâm ngang · {adjustment.focalX}%<input type="range" min={0} max={100} value={adjustment.focalX} onChange={(event) => setAdjustment((current) => ({ ...current, focalX: Number(event.target.value) }))} className="mt-2 w-full accent-violet-600" /></label>
          <label className="mt-5 block text-xs font-semibold text-slate-600">Điểm trọng tâm dọc · {adjustment.focalY}%<input type="range" min={0} max={100} value={adjustment.focalY} onChange={(event) => setAdjustment((current) => ({ ...current, focalY: Number(event.target.value) }))} className="mt-2 w-full accent-violet-600" /></label>
          <label className="mt-5 block text-xs font-semibold text-slate-600">Độ tối overlay · {adjustment.overlayOpacity}%<input type="range" min={20} max={85} value={adjustment.overlayOpacity} onChange={(event) => setAdjustment((current) => ({ ...current, overlayOpacity: Number(event.target.value) }))} className="mt-2 w-full accent-violet-600" /></label>
          <label className="mt-5 block text-xs font-semibold text-slate-600">Mô tả ảnh<input value={adjustment.altText} onChange={(event) => setAdjustment((current) => ({ ...current, altText: event.target.value }))} placeholder="Ví dụ: Đồng hồ vintage trong ánh sáng tối" className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-violet-400" /></label>
          <button type="button" onClick={() => void activate()} disabled={!selected || pending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Đang xử lý ảnh..." : selected?.record?.isActive ? "Lưu điều chỉnh" : "Đặt làm Hero"}</button>
          <p className="mt-3 text-[11px] leading-5 text-slate-400">Lần đầu chọn ảnh, hệ thống tạo WebP tối ưu. Ảnh nguồn trên NAS không bị move hoặc chỉnh sửa.</p>
        </aside>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="font-semibold text-slate-950">Kho Hero trên NAS</h2><span className="text-xs text-slate-400">{items.length} ảnh</span></div>
        {loading ? <p className="mt-5 text-sm text-slate-400">Đang quét NAS...</p> : items.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => <button key={item.storageKey} type="button" onClick={() => select(item)} className={`overflow-hidden rounded-2xl border text-left transition ${selectedKey === item.storageKey ? "border-violet-500 ring-2 ring-violet-100" : item.record?.isActive ? "border-emerald-400" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="relative aspect-[16/8] bg-slate-100"><Image src={item.url} alt={item.record?.altText || item.fileName} fill unoptimized className="object-cover" />{item.record?.isActive ? <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white"><Check className="h-3 w-3" />Đang dùng</span> : null}</div>
            <div className="p-3"><div className="truncate text-sm font-semibold text-slate-800">{item.fileName}</div><div className="mt-1 text-xs text-slate-400">{item.sizeBytes ? `${(item.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "Chưa rõ dung lượng"}</div></div>
          </button>)}
        </div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">Chưa có ảnh trong <code>{root}</code>. Hãy chép ảnh vào NAS rồi bấm “Quét lại NAS”.</div>}
      </section>

      {active && active.storageKey !== selectedKey ? <p className="text-xs text-slate-400">Ảnh đang dùng: {active.fileName}</p> : null}
    </div>
  );
}
