"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, ChartNoAxesCombined, Eye, MousePointerClick, PackageCheck, ShoppingBag, Users } from "lucide-react";
import type { SalesReportData } from "./sales-report.types";

const number = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
const money = (value: number) => `${number(value)} ₫`;

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Users }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-4 w-4" /></span></div>
    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
    <p className="mt-2 text-xs text-slate-500">{note}</p>
  </article>;
}

export default function SalesReportClient({ data, internalDevice }: { data: SalesReportData; internalDevice: boolean }) {
  const router = useRouter();
  const [savingInternal, setSavingInternal] = useState(false);
  async function toggleInternalDevice() {
    setSavingInternal(true);
    try {
      const response = await fetch("/api/admin/analytics/internal-device", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ enabled: !internalDevice }) });
      if (response.ok) router.refresh();
    } finally {
      setSavingInternal(false);
    }
  }
  return <main className="w-full space-y-4 px-4 py-5 lg:px-6">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
      <div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Báo cáo / Bán hàng</p><h1 className="mt-2 text-2xl font-bold text-slate-950">Hiệu quả bán hàng</h1><p className="mt-1 text-sm text-slate-500">Traffic → yêu cầu mua → đơn hàng, đặt cạnh tồn kho và kết quả tài chính.</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggleInternalDevice} disabled={savingInternal} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${internalDevice ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{savingInternal ? "Đang lưu…" : internalDevice ? "Thiết bị nội bộ · đang bật" : "Đánh dấu thiết bị nội bộ"}</button>
        <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">Tháng hiện tại · {data.period.days} ngày</span>
      </div>
    </header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <Metric label="Phiên truy cập" value={number(data.traffic.sessions)} note={`${number(data.traffic.visitors)} người xem`} icon={Users} />
      <Metric label="Lượt xem sản phẩm" value={number(data.traffic.productViews)} note={`${number(data.traffic.requestPageViews)} lần mở yêu cầu`} icon={Eye} />
      <Metric label="Yêu cầu mua" value={number(data.funnel.purchaseRequests)} note={`${data.traffic.formStarts} bắt đầu form · ${data.funnel.sessionToRequestRate}% từ phiên`} icon={MousePointerClick} />
      <Metric label="Đơn chuyển đổi" value={number(data.funnel.convertedOrders)} note={`${data.funnel.requestToOrderRate}% từ yêu cầu`} icon={ShoppingBag} />
      <Metric label="Tồn khả dụng" value={number(data.inventory.available)} note={`${data.inventory.live} đang hiển thị · ${data.inventory.held} giữ`} icon={PackageCheck} />
      <Metric label={data.inventory.landedValue === null ? "Tồn kho hiện tại" : "Giá trị tồn hiện tại"} value={data.inventory.landedValue === null ? number(data.inventory.total) : money(data.inventory.landedValue)} note={data.inventory.landedValue === null ? `${data.traffic.cartAdds} lượt thêm yêu cầu` : `${data.inventory.total} Watch · snapshot hiện tại`} icon={Boxes} />
    </section>

    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold text-slate-950">Sản phẩm được quan tâm</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-slate-400"><tr><th className="pb-3">Sản phẩm</th><th className="pb-3 text-right">Lượt xem</th><th className="pb-3 text-right">Yêu cầu</th><th className="pb-3 text-right">Trạng thái</th></tr></thead><tbody>{data.products.map((product) => <tr key={product.productId} className="border-t border-slate-100"><td className="py-3 font-semibold text-slate-800">{product.title}</td><td className="py-3 text-right">{product.views}</td><td className="py-3 text-right">{product.requests}</td><td className="py-3 text-right text-slate-500">{product.status}</td></tr>)}</tbody></table>{data.products.length === 0 ? <p className="py-10 text-center text-xs text-slate-400">Chưa có dữ liệu hành vi.</p> : null}</div>
      </article>
      <div className="space-y-4">
        <article className="rounded-2xl bg-slate-950 p-5 text-white"><div className="flex items-center gap-2"><ChartNoAxesCombined className="h-4 w-4 text-emerald-300" /><h2 className="text-sm font-bold">Kết quả tài chính tháng</h2></div>{data.finance ? <div className="mt-5 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">{data.finance.revenue !== null ? <div><p className="text-xs text-white/50">Doanh thu</p><p className="mt-1 text-xl font-bold">{money(data.finance.revenue)}</p></div> : null}{data.finance.collected !== null ? <div><p className="text-xs text-white/50">Đã thực thu</p><p className="mt-1 text-xl font-bold">{money(data.finance.collected)}</p></div> : null}{data.finance.grossProfit !== null ? <div><p className="text-xs text-white/50">Lợi nhuận gộp</p><p className="mt-1 text-xl font-bold text-emerald-300">{money(data.finance.grossProfit)}</p></div> : null}</div> : <p className="mt-5 text-xs text-white/50">Không có dữ liệu tài chính được cấp.</p>}</article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-sm font-bold text-slate-950">Nguồn truy cập</h2><div className="mt-4 space-y-3">{data.sources.map((row) => <div key={row.source} className="flex items-center justify-between gap-4 text-xs"><span className="truncate font-medium text-slate-700">{row.source}</span><span className="shrink-0 text-slate-500">{row.sessions} phiên · {row.requests} yêu cầu</span></div>)}</div></article>
      </div>
    </section>
  </main>;
}
