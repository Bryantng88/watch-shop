"use client";

import {
  ChevronDown,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  VisualStatusSignal,
  type VisualStatusIcon,
  type VisualStatusTone,
} from "@/domains/shared/ui/signals";

type Tone = VisualStatusTone;

const WATCHES = [
  { name: "Rolex vi tính 5 số", sku: "UNK-19072026-003", brand: "Rolex", media: ["Chưa có ảnh", "Bắt đầu photoshoot", "slate"] as const, service: ["Đang service", "Đang xử lý kỹ thuật", "blue"] as const, face: "bg-stone-100", bezel: "border-zinc-700" },
  { name: "Seiko Pepsi", sku: "UNK-17072026-005", brand: "Seiko", media: ["6 ảnh sẵn sàng", "Chờ duyệt media", "blue"] as const, service: ["Đã xong", "Hoàn tất 18/07", "emerald"] as const, face: "bg-sky-950", bezel: "border-red-700" },
  { name: "1980s Grace Fabliau Skeleton Asymétrique", sku: "GFX-16072026-001", brand: "Grace Fabliau", media: ["Cần chụp lại", "Có ghi chú mới", "amber"] as const, service: ["Không cần service", "Đã kiểm tra", "slate"] as const, face: "bg-amber-100", bezel: "border-amber-700" },
  { name: "Seiko KS", sku: "—", brand: "Seiko", media: ["12 ảnh đã duyệt", "Sẵn sàng đăng", "emerald"] as const, service: ["Đang service", "Dự kiến 25/07", "blue"] as const, face: "bg-stone-50", bezel: "border-amber-600" },
  { name: "Seiko 7830-5040 Quartz Black", sku: "PR-2604-0011", brand: "Seiko", media: ["Chưa có ảnh", "Bắt đầu photoshoot", "slate"] as const, service: ["Chờ tiếp nhận", "Có 2 vấn đề", "amber"] as const, face: "bg-zinc-900", bezel: "border-zinc-500" },
];

function WatchThumb({ face, bezel }: { face: string; bezel: string }) {
  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-stone-200 via-white to-stone-400 shadow-sm ring-1 ring-slate-200">
      <div className="absolute left-1/2 top-[-12px] h-20 w-3 -translate-x-1/2 rotate-[-12deg] rounded-full bg-zinc-700" />
      <div className={`absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] shadow-md ${face} ${bezel}`}>
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-full rotate-45 bg-slate-500" />
        <span className="absolute left-1/2 top-1/2 h-2.5 w-px origin-bottom -translate-x-1/2 -translate-y-full rotate-[130deg] bg-slate-500" />
      </div>
    </div>
  );
}

function Signal({
  kind,
  label,
  detail,
  tone,
  roomy,
}: {
  kind: "media" | "service";
  label: string;
  detail: string;
  tone: Tone;
  roomy: boolean;
}) {
  const icon: VisualStatusIcon = kind === "media"
    ? tone === "emerald" ? "success" : tone === "amber" ? "warning" : "image"
    : tone === "emerald" ? "success" : tone === "amber" ? "waiting" : tone === "blue" ? "service" : "neutral";

  return (
    <VisualStatusSignal
      label={label}
      detail={detail}
      tone={tone}
      icon={icon}
      className={roomy ? "[&>span:first-child]:h-11 [&>span:first-child]:w-11" : "[&>span:first-child]:h-9 [&>span:first-child]:w-9"}
      onClick={() => undefined}
    />
  );
}

export default function WatchListSignalsPrototype() {
  const [roomy, setRoomy] = useState(true);

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-5 py-8 text-slate-900">
      <section className="mx-auto max-w-[1440px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">
              <span className="rounded-full bg-blue-100 px-2.5 py-1">UI test</span>
              <span className="text-slate-400">Dữ liệu giả · Không nối hệ thống</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">Watch list — Visual status</h1>
            <p className="mt-1 text-sm text-slate-500">Biểu tượng tạo điểm neo thị giác, text bên cạnh giải thích trạng thái và hành động tiếp theo.</p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold shadow-sm">
            <button onClick={() => setRoomy(false)} className={`rounded-lg px-3 py-2 ${!roomy ? "bg-slate-900 text-white" : "text-slate-500"}`}>Gọn · 64px</button>
            <button onClick={() => setRoomy(true)} className={`rounded-lg px-3 py-2 ${roomy ? "bg-slate-900 text-white" : "text-slate-500"}`}>Rõ · 76px</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-3">
            <label className="flex min-w-[280px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-400 focus-within:border-blue-300">
              <Search className="h-4 w-4" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Tìm theo title / brand / model / ref..." />
            </label>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold">Brand: Tất cả <ChevronDown className="h-3.5 w-3.5" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/80 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <tr><th className="w-14 px-5 py-3"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></th><th className="min-w-[420px] px-4 py-3">Watch</th><th className="min-w-[240px] px-4 py-3">Media</th><th className="min-w-[240px] px-4 py-3">Service</th><th className="px-5 py-3 text-right">Tác vụ</th></tr>
              </thead>
              <tbody>
                {WATCHES.map((watch) => (
                  <tr key={watch.name} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                    <td className={`${roomy ? "py-2.5" : "py-1.5"} px-5`}><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></td>
                    <td className="px-4"><div className="flex items-center gap-3"><WatchThumb face={watch.face} bezel={watch.bezel} /><div className="min-w-0"><div className="truncate text-[14px] font-semibold text-slate-900">{watch.name}</div><div className="mt-1 text-[11px] text-slate-400">SKU: {watch.sku} <span className="mx-1 text-slate-200">•</span> {watch.brand}</div></div></div></td>
                    <td className="px-4"><Signal kind="media" label={watch.media[0]} detail={watch.media[1]} tone={watch.media[2]} roomy={roomy} /></td>
                    <td className="px-4"><Signal kind="service" label={watch.service[0]} detail={watch.service[1]} tone={watch.service[2]} roomy={roomy} /></td>
                    <td className="px-5 text-right"><button className="rounded-lg px-3 py-2 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700">•••</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-400"><span>5 watch mẫu</span><span>Mục tiêu: đọc được trạng thái mà không cần rê mắt tìm chấm màu</span></div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-800">1. Icon là điểm neo</p><p className="mt-1 text-xs leading-5 text-slate-500">36–44px, nền rất nhạt; màu chỉ biểu thị ngữ nghĩa.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-800">2. Hai tầng thông tin</p><p className="mt-1 text-xs leading-5 text-slate-500">Dòng chính là trạng thái; dòng phụ nói việc tiếp theo hoặc thời gian.</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-800">3. Không dùng màu đơn độc</p><p className="mt-1 text-xs leading-5 text-slate-500">Icon + chữ giúp phân biệt kể cả khi màu khó nhận biết.</p></div>
        </div>
      </section>
    </main>
  );
}
