"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StrapListProjectionRow } from "@/domains/projection/server/strap-list";

const materialLabels: Record<string, string> = {
  LEATHER: "Dây da",
  BRACELET: "Dây thép",
  RUBBER: "Cao su",
  NATO: "NATO",
  CANVASS: "Vải / Canvas",
  SPECIAL: "Khác",
};

const leatherLabels: Record<string, string> = {
  COW: "Da bò",
  CROCODILE: "Da cá sấu",
  OSTRICH: "Da đà điểu",
  LIZARD: "Da kỳ đà",
  GOAT: "Da dê",
  OTHER: "Da khác",
};

function optionValues(rows: StrapListProjectionRow[], pick: (row: StrapListProjectionRow) => string | null) {
  return [...new Set(rows.map(pick).filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b, "vi"),
  );
}

export default function StrapInventoryTable({ rows }: { rows: StrapListProjectionRow[] }) {
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState("");
  const [origin, setOrigin] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [leatherType, setLeatherType] = useState("");
  const [status, setStatus] = useState("");

  const materials = optionValues(rows, (row) => row.material);
  const colors = optionValues(rows, (row) => row.color);
  const leatherTypes = optionValues(rows, (row) => row.leatherType);
  const sizes = optionValues(rows, (row) => `${row.lugWidthMM}–${row.buckleWidthMM ?? "—"}`);

  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi");
    return rows.filter((row) => {
      const rowStatus = row.attachedWatch ? "ATTACHED" : row.lowStock ? "LOW_STOCK" : "AVAILABLE";
      const haystack = [
        row.title,
        row.sku,
        row.color,
        row.material,
        row.leatherType,
        row.brandName,
        `${row.lugWidthMM}-${row.buckleWidthMM ?? ""}`,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("vi");
      return (
        (!keyword || haystack.includes(keyword)) &&
        (!material || row.material === material) &&
        (!origin || row.originType === origin) &&
        (!size || `${row.lugWidthMM}–${row.buckleWidthMM ?? "—"}` === size) &&
        (!color || row.color === color) &&
        (!leatherType || row.leatherType === leatherType) &&
        (!status || rowStatus === status)
      );
    });
  }, [color, leatherType, material, origin, query, rows, size, status]);

  const selectClass = "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-violet-300";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-2 border-b border-slate-100 p-4 md:grid-cols-2 xl:grid-cols-8">
        <input
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-300 md:col-span-2"
          placeholder="Tìm SKU, kích thước, màu, hãng..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className={selectClass} value={material} onChange={(event) => setMaterial(event.target.value)}>
          <option value="">Loại dây</option>
          {materials.map((value) => <option key={value} value={value}>{materialLabels[value] ?? value}</option>)}
        </select>
        <select className={selectClass} value={leatherType} onChange={(event) => setLeatherType(event.target.value)}>
          <option value="">Loại da</option>
          {leatherTypes.map((value) => <option key={value} value={value}>{leatherLabels[value] ?? value}</option>)}
        </select>
        <select className={selectClass} value={origin} onChange={(event) => setOrigin(event.target.value)}>
          <option value="">Nguồn gốc</option>
          <option value="OEM">Chính hãng</option>
          <option value="AFTERMARKET">Linh kiện</option>
        </select>
        <select className={selectClass} value={size} onChange={(event) => setSize(event.target.value)}>
          <option value="">Kích thước</option>
          {sizes.map((value) => <option key={value} value={value}>{value} mm</option>)}
        </select>
        <select className={selectClass} value={color} onChange={(event) => setColor(event.target.value)}>
          <option value="">Màu</option>
          {colors.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select className={selectClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Trạng thái</option>
          <option value="AVAILABLE">Sẵn sàng</option>
          <option value="LOW_STOCK">Sắp hết</option>
          <option value="ATTACHED">Đang gắn Watch</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Dây</th>
              <th className="px-5 py-3">Kích thước</th>
              <th className="px-5 py-3">Chất liệu</th>
              <th className="px-5 py-3">Loại da</th>
              <th className="px-5 py-3">Màu</th>
              <th className="px-5 py-3">Nguồn</th>
              <th className="px-5 py-3 text-right">Tồn</th>
              <th className="px-5 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row) => (
              <tr key={row.variantId} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <Link href={`/admin/straps/${row.variantId}`} className="font-semibold text-slate-950 hover:text-violet-700">{row.title}</Link>
                  <div className="mt-1 text-xs text-slate-400">{row.sku || "Chưa có SKU"}</div>
                </td>
                <td className="px-5 py-4 font-medium text-slate-800">{row.lugWidthMM} → {row.buckleWidthMM ?? "—"} mm</td>
                <td className="px-5 py-4 text-slate-600">{materialLabels[row.material] ?? row.material}</td>
                <td className="px-5 py-4 text-slate-600">{row.material === "LEATHER" ? leatherLabels[row.leatherType ?? ""] ?? row.leatherType ?? "—" : "—"}</td>
                <td className="px-5 py-4 text-slate-700">{row.color || "—"}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.originType === "OEM" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"}`}>{row.originType === "OEM" ? "Chính hãng" : "Linh kiện"}</span></td>
                <td className="px-5 py-4 text-right font-semibold">{row.inventoryPolicy === "NON_STOCK" ? "—" : row.stockQty}</td>
                <td className="px-5 py-4">{row.attachedWatch ? <Link href={`/admin/watches/${row.attachedWatch.productId}`} className="text-blue-700">Gắn: {row.attachedWatch.title}</Link> : row.lowStock ? <span className="text-amber-700">Sắp hết</span> : <span className="text-emerald-700">Sẵn sàng</span>}</td>
              </tr>
            ))}
            {!filteredRows.length ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">Không có dây phù hợp bộ lọc.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
