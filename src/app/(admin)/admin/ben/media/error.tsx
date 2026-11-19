"use client";
import Link from "next/link";
export default function Error({reset}: {reset: () => void}) {
  return <main className="min-h-screen space-y-4 bg-white p-4"><Link href="/admin/ben" className="inline-flex min-h-11 items-center text-sm text-slate-500">← Ben</Link><p role="alert" className="text-sm text-slate-700">Chưa tải được danh sách media. Bạn có thể thử lại.</p><button type="button" onClick={reset} className="min-h-11 rounded-lg bg-slate-950 px-4 text-sm text-white">Thử lại</button></main>;
}
