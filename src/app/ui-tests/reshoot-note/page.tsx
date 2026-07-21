"use client";

import { Camera, Check, ChevronDown, Clock3, ImageIcon, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";

const WATCHES = [
  { id: 1, name: "Seiko Dolce chrono pin", sku: "SEI-18072026-002", tone: "from-stone-300 via-zinc-100 to-stone-400", reshoot: true },
  { id: 2, name: "Omega De Ville Prestige", sku: "OME-17072026-011", tone: "from-slate-300 via-white to-slate-500", reshoot: false },
  { id: 3, name: "Longines Flagship Heritage", sku: "LON-15072026-008", tone: "from-amber-200 via-stone-50 to-amber-500", reshoot: false },
];

function WatchMock({ tone, compact = false }: { tone: string; compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${tone} ${compact ? "h-20 w-20 rounded-2xl" : "h-48 w-full rounded-2xl"}`}>
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[18%] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-full bg-zinc-800/90" />
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-zinc-700 bg-stone-100 shadow-xl ${compact ? "h-12 w-12" : "h-28 w-28"}`}>
        <div className="absolute inset-[7px] rounded-full border border-zinc-300" />
        <div className="absolute left-1/2 top-1/2 h-[34%] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rotate-[28deg] bg-zinc-700" />
        <div className="absolute left-1/2 top-1/2 h-[28%] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rotate-[125deg] bg-zinc-700" />
      </div>
    </div>
  );
}

export default function ReshootNotePrototypePage() {
  const [view, setView] = useState<"request" | "photoshoot">("photoshoot");
  const [note, setNote] = useState("Chụp lại chính diện vì mặt kính bị phản sáng. Bổ sung thêm ảnh khóa dây.");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-700">UI test</span>
              <span className="text-xs text-slate-400">Dữ liệu giả · Không kết nối hệ thống</span>
            </div>
            <h1 className="mt-2 text-xl font-bold">Ghi chú yêu cầu chụp lại</h1>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
            <button onClick={() => setView("request")} className={`rounded-lg px-4 py-2 transition ${view === "request" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>1. Gửi yêu cầu</button>
            <button onClick={() => setView("photoshoot")} className={`rounded-lg px-4 py-2 transition ${view === "photoshoot" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>2. Màn Photoshoot</button>
          </div>
        </div>
      </header>

      {view === "request" ? (
        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_460px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <WatchMock tone="from-stone-300 via-zinc-100 to-stone-400" compact />
              <div>
                <div className="text-xs font-semibold text-slate-400">WATCH / XỬ LÝ MEDIA</div>
                <h2 className="mt-1 text-xl font-bold">Seiko Dolce chrono pin</h2>
                <p className="mt-1 text-sm text-slate-500">SKU: SEI-18072026-002 · Brand: Seiko</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-500">Khu vực gallery của UI thật</p>
              <p className="mt-1 text-sm text-slate-400">Prototype không đụng vào màn hình hoặc dữ liệu hiện tại.</p>
            </div>
          </div>

          <div className="self-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><Camera className="h-5 w-5" /></div>
                <div><h2 className="text-lg font-bold">Yêu cầu chụp lại ảnh</h2><p className="mt-1 text-sm text-slate-500">Mô tả rõ để Photoshoot biết cần xử lý gì.</p></div>
              </div>
              <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <div className="flex items-center justify-between"><label htmlFor="reshoot-note" className="text-sm font-bold">Nội dung cần chụp lại</label><span className="text-xs text-slate-400">{note.length}/300</span></div>
                <textarea id="reshoot-note" value={note} maxLength={300} onChange={(event) => setNote(event.target.value)} rows={5} placeholder="VD: Chụp lại chính diện, mặt kính đang bị phản sáng..." className="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Sparkles className="h-3.5 w-3.5" /> Nội dung này sẽ được ghim nổi bật tại Photoshoot.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600">Hủy</button>
              <button disabled={!note.trim()} onClick={() => { setSubmitted(true); setView("photoshoot"); }} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-40">Xác nhận chụp lại</button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-8">
          {submitted ? <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><Check className="h-5 w-5" /> Yêu cầu mẫu đã được đưa vào danh sách Photoshoot.</div> : null}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="text-sm font-semibold text-indigo-600">WORKSPACE</p><h2 className="mt-1 text-2xl font-bold">Photoshoot</h2><p className="mt-1 text-sm text-slate-500">3 item đang chờ chụp ảnh</p></div>
              <div className="flex gap-2"><div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400"><Search className="h-4 w-4" /> Tìm watch, SKU...</div><button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">Tất cả <ChevronDown className="h-4 w-4" /></button></div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {WATCHES.map((watch) => (
                <article key={watch.id} className={`overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-0.5 hover:shadow-lg ${watch.reshoot ? "border-amber-300 ring-4 ring-amber-50" : "border-slate-200"}`}>
                  <div className="relative p-3"><WatchMock tone={watch.tone} />{watch.reshoot ? <span className="absolute left-6 top-6 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow">Chụp lại</span> : <span className="absolute left-6 top-6 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-bold text-white">Chụp mới</span>}</div>
                  <div className="px-5 pb-5">
                    <h3 className="font-bold">{watch.name}</h3><p className="mt-1 text-xs font-medium text-slate-400">{watch.sku}</p>
                    {watch.reshoot ? (
                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
                        <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-800"><Camera className="h-3.5 w-3.5" /> Cần chụp lại</span><span className="flex items-center gap-1 text-[11px] text-amber-700/70"><Clock3 className="h-3 w-3" /> 14:30 hôm nay</span></div>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-700">{note.trim() || "Chưa có nội dung mô tả."}</p>
                        <button className="mt-2 text-xs font-bold text-amber-800">Xem chi tiết →</button>
                      </div>
                    ) : <div className="mt-4 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">Chụp bộ ảnh tiêu chuẩn</div>}
                    <button className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold ${watch.reshoot ? "bg-amber-500 text-white" : "bg-slate-900 text-white"}`}>Mở item Photoshoot</button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Khi mở item Photoshoot</p>
                  <h3 className="mt-1 text-lg font-bold">Yêu cầu được ghim ngay trên khu vực thao tác</h3>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">Chụp lại</span>
              </div>
              <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[220px_1fr]">
                <WatchMock tone="from-stone-300 via-zinc-100 to-stone-400" />
                <div>
                  <h4 className="text-xl font-bold">Seiko Dolce chrono pin</h4>
                  <p className="mt-1 text-sm text-slate-500">SEI-18072026-002</p>
                  <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-amber-900"><Camera className="h-4 w-4" /> Yêu cầu chụp lại</span>
                      <span className="text-xs text-amber-700">Nguyễn A · 21/07/2026 14:30</span>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-800">{note.trim() || "Chưa có nội dung mô tả."}</p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold">Chọn ảnh mới</button>
                    <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">Hoàn tất Photoshoot</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
