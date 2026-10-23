"use client";

import Image from "next/image";

import type { WatchRow } from "./types";

type Props = {
  open: boolean;
  rows: WatchRow[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export default function WatchSelectionPanel({ open, rows, onClose, onRemove, onClear }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-slate-950/25" role="dialog" aria-modal="true" aria-label="Watch đã chọn">
      <button type="button" aria-label="Đóng danh sách" className="min-w-0 flex-1 cursor-default" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Watch đã chọn</h2>
            <p className="mt-1 text-xs text-slate-500">{rows.length} watch được giữ khi đổi trang hoặc bộ lọc.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {row.imageUrl ? <Image src={row.imageUrl} alt="" fill sizes="48px" className="object-cover" unoptimized /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{row.title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{row.sku || "Chưa có SKU"}{row.brandName ? ` · ${row.brandName}` : ""}</p>
              </div>
              <button type="button" onClick={() => onRemove(row.id)} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600">Bỏ</button>
            </div>
          ))}
        </div>
        <footer className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClear} className="text-sm font-semibold text-rose-600 hover:text-rose-700">Bỏ chọn tất cả</button>
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Xong</button>
        </footer>
      </aside>
    </div>
  );
}
