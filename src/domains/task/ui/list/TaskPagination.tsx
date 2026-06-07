"use client";

export default function TaskPagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Trước</button>
      <span className="text-sm text-slate-500">Trang {page}/{totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Sau</button>
    </div>
  );
}
