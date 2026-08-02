"use client";

import { useMemo, useState } from "react";
import type { StrapListProjectionRow } from "@/domains/projection/server/strap-list";

export default function StrapReplenishmentTable({ rows }: { rows: StrapListProjectionRow[] }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => rows.map((row) => ({
    ...row,
    requiredQty: Math.max(0, row.targetStockQty - row.stockQty),
  })).filter((row) => row.requiredQty > 0), [rows]);

  async function copy() {
    const text = lines.map((row) => `${row.lugWidthMM}-${row.buckleWidthMM ?? ""}\t${row.requiredQty}\t${String(row.color ?? "").toLowerCase()}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-950">Danh sách gửi đối tác</h2><p className="mt-1 text-xs text-slate-500">Chỉ gồm dây STOCKED; OEM/NON_STOCK được loại trừ.</p></div><button onClick={copy} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">{copied ? "Đã copy" : "Copy bảng"}</button></div>
    <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-5 py-3">Kích thước</th><th className="px-5 py-3">Chất liệu</th><th className="px-5 py-3">Màu</th><th className="px-5 py-3 text-right">Hiện có</th><th className="px-5 py-3 text-right">Cần đặt</th></tr></thead><tbody className="divide-y divide-slate-100">{lines.map((row)=><tr key={row.variantId}><td className="px-5 py-3 font-semibold">{row.lugWidthMM}-{row.buckleWidthMM ?? ""}</td><td className="px-5 py-3">{row.material}</td><td className="px-5 py-3 lowercase">{row.color}</td><td className="px-5 py-3 text-right">{row.stockQty}</td><td className="px-5 py-3 text-right font-semibold text-violet-700">{row.requiredQty}</td></tr>)}</tbody></table>
  </section>;
}
