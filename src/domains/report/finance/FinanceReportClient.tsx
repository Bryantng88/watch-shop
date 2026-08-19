"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  Download,
  Info,
  Landmark,
  LineChart,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import type { FinanceReportProjectionData } from "@/domains/report/finance/finance-report.types";

const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;

function smoothMarginPath(values: Array<{ margin: number }>) {
  const points = values.map((item, index) => ({ x: 10 + index * 96, y: 40 - (item.margin - 20) * 3.5 }));
  if (points.length === 0) return "";

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

const periods = {
  month: {
    label: "Tháng này",
    revenue: 428_600_000,
    collected: 396_200_000,
    cost: 302_900_000,
    profit: 125_700_000,
    previousRevenue: 382_700_000,
  },
  quarter: {
    label: "Quý này",
    revenue: 1_184_300_000,
    collected: 1_092_800_000,
    cost: 841_600_000,
    profit: 342_700_000,
    previousRevenue: 1_096_400_000,
  },
} as const;

type PeriodKey = keyof typeof periods;
type DetailKey = "revenue" | "collected" | "cost" | "profit" | null;
type ChannelKey = "all" | "men" | "women";

const channels: Array<{ key: ChannelKey; label: string; note: string; factor: number }> = [
  { key: "all", label: "Tất cả", note: "Hai kênh", factor: 1 },
  { key: "men", label: "Nam", note: "Watch Nam", factor: 0.58 },
  { key: "women", label: "Nữ", note: "Watch Nữ", factor: 0.42 },
];

const trend = [
  { month: "T3", revenue: 58, profit: 32, margin: 22.4 },
  { month: "T4", revenue: 72, profit: 39, margin: 23.1 },
  { month: "T5", revenue: 66, profit: 35, margin: 21.8 },
  { month: "T6", revenue: 81, profit: 44, margin: 24.2 },
  { month: "T7", revenue: 76, profit: 40, margin: 23.5 },
  { month: "T8", revenue: 94, profit: 51, margin: 25.8 },
];

const detailRows = [
  { code: "ORD-190826-0042", source: "Bán Watch", label: "Cartier Tank Must", amount: 48_500_000, margin: "31,2%" },
  { code: "ORD-180826-0039", source: "Bán Watch", label: "Omega De Ville", amount: 36_800_000, margin: "27,8%" },
  { code: "SR-190826-000001", source: "Dịch vụ", label: "Hư IC, dây đồng", amount: 2_100_000, margin: "42,9%" },
  { code: "ORD-170826-0031", source: "Bán Watch", label: "Longines Flagship", amount: 29_600_000, margin: "24,4%" },
];

function MetricCard({
  label,
  value,
  note,
  delta,
  tone,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: string;
  note: string;
  delta: string;
  tone: "slate" | "emerald" | "blue" | "violet";
  icon: typeof Banknote;
  onClick: () => void;
}) {
  const colors = {
    slate: "bg-slate-950 text-white",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${colors[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${delta === "—" ? "bg-slate-50 text-slate-400" : "bg-emerald-50 text-emerald-700"}`}>
          {delta !== "—" && <ArrowUpRight className="h-3 w-3" />} {delta}
        </span>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-[22px] font-bold tracking-[-0.025em] text-slate-950">{value}</p>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-500">{note}</span>
        <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
    </button>
  );
}

export function FinanceReportClient({ initialProjection }: { initialProjection?: FinanceReportProjectionData | null }) {
  const [periodKey, setPeriodKey] = useState<PeriodKey>("month");
  const [channelKey, setChannelKey] = useState<ChannelKey>("all");
  const [detail, setDetail] = useState<DetailKey>(null);
  const channel = channels.find((item) => item.key === channelKey) ?? channels[0];
  const projectionChannel = initialProjection?.channels.find((item) => item.channel === channelKey.toUpperCase());
  const period = useMemo(() => {
    const projected = projectionChannel?.periods.find((item) => item.key === (periodKey === "month" ? "MONTH" : "QUARTER"));
    if (projected) {
      const previousRevenue = projectionChannel?.trend.at(-2)?.revenue ?? projected.revenue;
      return { ...projected, previousRevenue };
    }
    const source = periods[periodKey];
    const factor = channel.factor;
    const channelAdjustment = channelKey === "women" ? 1.035 : channelKey === "men" ? 0.976 : 1;
    return {
      ...source,
      revenue: Math.round(source.revenue * factor),
      collected: Math.round(source.collected * factor * channelAdjustment),
      cost: Math.round(source.cost * factor * (channelKey === "women" ? 0.94 : 1.04)),
      profit: Math.round(source.profit * factor * (channelKey === "women" ? 1.17 : 0.88)),
      previousRevenue: Math.round(source.previousRevenue * factor * (channelKey === "women" ? 0.93 : 1.05)),
    };
  }, [channel.factor, channelKey, periodKey, projectionChannel]);
  const margin = useMemo(() => period.revenue > 0 ? (period.profit / period.revenue) * 100 : 0, [period]);
  const revenueDelta = period.previousRevenue > 0 ? ((period.revenue - period.previousRevenue) / period.previousRevenue) * 100 : 0;

  const channelTrend = useMemo(() => {
    if (projectionChannel?.trend.length) {
      const maximum = Math.max(1, ...projectionChannel.trend.map((item) => item.revenue));
      return projectionChannel.trend.map((item) => ({
        month: item.label,
        revenue: Math.round((item.revenue / maximum) * 94),
        profit: Math.round((Math.max(0, item.profit) / maximum) * 94),
        margin: Number(item.margin.toFixed(1)),
      }));
    }
    const modifier = channelKey === "women" ? 1.08 : channelKey === "men" ? 0.95 : 1;
    return trend.map((item, index) => ({
      ...item,
      revenue: Math.min(100, Math.round(item.revenue * modifier * (channelKey === "women" ? 0.9 + index * 0.035 : 1))),
      profit: Math.min(100, Math.round(item.profit * modifier * (channelKey === "women" ? 0.94 + index * 0.025 : 1))),
      margin: Number((item.margin * (channelKey === "women" ? 1.08 : channelKey === "men" ? 0.95 : 1)).toFixed(1)),
    }));
  }, [channelKey, projectionChannel]);

  const projectedComposition = "revenueBreakdown" in period
    ? period.revenueBreakdown.map((item, index) => [
        item.label,
        period.revenue > 0 ? Math.round((item.amount / period.revenue) * 100) : 0,
        `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(item.amount / 1_000_000)} triệu`,
        ["bg-blue-500", "bg-violet-500", "bg-cyan-500", "bg-fuchsia-400"][index % 4],
        item.count,
      ] as [string, number, string, string, number])
    : null;
  const composition = projectedComposition ?? (channelKey === "all"
    ? [
        ["Watch Nam", 48, "205,7 triệu", "bg-blue-500", 18],
        ["Watch Nữ", 34, "145,7 triệu", "bg-violet-500", 14],
        ["Dịch vụ Nam", 11, "47,1 triệu", "bg-cyan-500", 9],
        ["Dịch vụ Nữ", 7, "30,1 triệu", "bg-fuchsia-400", 6],
      ]
    : channelKey === "men"
      ? [
          ["Bán Watch Nam", 76, "188,8 triệu", "bg-blue-500", 18],
          ["Dịch vụ Watch Nam", 14, "34,8 triệu", "bg-cyan-500", 9],
          ["Phụ kiện", 7, "17,4 triệu", "bg-slate-500", 5],
          ["Khác", 3, "7,4 triệu", "bg-amber-400", 3],
        ]
      : [
          ["Bán Watch Nữ", 79, "142,2 triệu", "bg-violet-500", 14],
          ["Dịch vụ Watch Nữ", 10, "18,0 triệu", "bg-fuchsia-400", 6],
          ["Trang sức & phụ kiện", 8, "14,4 triệu", "bg-rose-400", 4],
          ["Khác", 3, "5,4 triệu", "bg-amber-400", 2],
        ]);

  const revenueTransactionCount = composition.reduce((total, item) => total + Number(item[4]), 0);

  const projectedCostBreakdown = "costBreakdown" in period ? period.costBreakdown : null;
  const costComposition = projectedCostBreakdown?.length
    ? projectedCostBreakdown.map((item, index) => ({
        label: item.label,
        value: item.amount,
        color: ["bg-slate-700", "bg-amber-500", "bg-blue-500", "bg-violet-500"][index % 4],
        note: item.key,
      }))
    : [
    { label: "Giá vốn Watch", value: Math.round(period.cost * 0.806), color: "bg-slate-700", note: "Acquisition / giá nhập" },
    { label: "TI & Service", value: Math.round(period.cost * 0.105), color: "bg-amber-500", note: "Sửa chữa, linh kiện, vendor" },
    { label: "Vận chuyển", value: Math.round(period.cost * 0.061), color: "bg-blue-500", note: "Giao, hoàn và đóng gói" },
    { label: "Phí thanh toán", value: Math.round(period.cost * 0.028), color: "bg-violet-500", note: "COD, ngân hàng và phí khác" },
    ];

  const pendingPayments = initialProjection && projectionChannel ? {
    in: {
      count: projectionChannel.pendingPayments.in.reduce((sum, item) => sum + item.count, 0),
      amount: projectionChannel.pendingPayments.in.reduce((sum, item) => sum + item.amount, 0),
      overdue: projectionChannel.pendingPayments.in.reduce((sum, item) => sum + item.overdue, 0),
    },
    out: {
      count: projectionChannel.pendingPayments.out.reduce((sum, item) => sum + item.count, 0),
      amount: projectionChannel.pendingPayments.out.reduce((sum, item) => sum + item.amount, 0),
      overdue: projectionChannel.pendingPayments.out.reduce((sum, item) => sum + item.overdue, 0),
    },
  } : {
    in: {
      count: channelKey === "all" ? 8 : channelKey === "men" ? 5 : 4,
      amount: Math.round(32_400_000 * channel.factor),
      overdue: channelKey === "all" ? 2 : 1,
    },
    out: {
      count: channelKey === "all" ? 6 : channelKey === "men" ? 4 : 3,
      amount: Math.round(21_700_000 * channel.factor),
      overdue: channelKey === "all" ? 1 : channelKey === "men" ? 1 : 0,
    },
  };

  const projectedIn = projectionChannel?.pendingPayments.in;
  const projectedOut = projectionChannel?.pendingPayments.out;
  const exceptions = [
    {
      icon: ArrowDownRight,
      count: pendingPayments.in.count,
      title: "Payment IN chưa xử lý",
      note: "Phải thu, COD hoặc khoản thu đang chờ xác nhận",
      amount: money(pendingPayments.in.amount),
      meta: `${pendingPayments.in.overdue} quá hạn · Order / Shipment`,
      tone: "emerald",
      breakdown: initialProjection ? (projectedIn ?? []).map((item) => ({ label: item.label, owner: item.owner, count: item.count, amount: item.amount })) : [
        { label: "Thu tiền bán hàng", owner: "Order", count: channelKey === "all" ? 3 : channelKey === "men" ? 2 : 1, amount: Math.round(14_800_000 * channel.factor) },
        { label: "Thu dịch vụ", owner: "Service", count: channelKey === "all" ? 2 : 1, amount: Math.round(9_200_000 * channel.factor) },
        { label: "COD chờ xác nhận", owner: "Shipment", count: channelKey === "all" ? 3 : channelKey === "men" ? 2 : 2, amount: Math.round(8_400_000 * channel.factor) },
      ],
    },
    {
      icon: ArrowUpRight,
      count: pendingPayments.out.count,
      title: "Payment OUT chưa xử lý",
      note: "Giá vốn, vendor, TI hoặc phí đang chờ thanh toán",
      amount: money(pendingPayments.out.amount),
      meta: `${pendingPayments.out.overdue} quá hạn · Acquisition / Service`,
      tone: "rose",
      breakdown: initialProjection ? (projectedOut ?? []).map((item) => ({ label: item.label, owner: item.owner, count: item.count, amount: item.amount })) : [
        { label: "Thanh toán giá vốn", owner: "Acquisition / Vendor", count: channelKey === "all" ? 2 : channelKey === "men" ? 2 : 1, amount: Math.round(10_500_000 * channel.factor) },
        { label: "Chi phí TI & Service", owner: "Technical Issue", count: channelKey === "all" ? 2 : 1, amount: Math.round(6_800_000 * channel.factor) },
        { label: "Phí giao hàng / hoàn", owner: "Shipment", count: channelKey === "all" ? 2 : 1, amount: Math.round(4_400_000 * channel.factor) },
      ],
    },
  ] as const;

  const detailTitle = {
    revenue: "Doanh thu được cấu thành từ đâu?",
    collected: "Các khoản tiền đã thực thu",
    cost: "Chi phí được ghi nhận trong kỳ",
    profit: "Các giao dịch tạo nên lợi nhuận gộp",
  }[detail ?? "revenue"];
  const visibleDetailRows = initialProjection && detail && "details" in period
    ? period.details[detail].map((row) => ({
        ...row,
        margin: row.margin == null ? "—" : `${row.margin.toFixed(1)}%`,
      }))
    : detailRows.map((row) => ({ ...row, id: row.code, href: "#" }));

  return (
    <main className="mx-auto w-full max-w-[1480px] space-y-4 px-4 py-5 lg:px-6">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5">
        <p className="text-xs text-violet-800">
          {initialProjection
            ? <><b>Finance Report v{initialProjection.formulaVersion}:</b> Dữ liệu thật từ projection local.</>
            : <><b>UI test:</b> Báo cáo tài chính — dữ liệu minh hoạ, chưa tác động dữ liệu thật.</>}
        </p>
        <Link href="/admin/dashboard" className="text-xs font-semibold text-violet-700 hover:text-violet-950">
          Quay lại Dashboard
        </Link>
      </section>

      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <LineChart className="h-3.5 w-3.5" /> Báo cáo / Tài chính
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-slate-950">Hiệu quả tài chính</h1>
          <p className="mt-1 text-sm text-slate-500">Đọc nhanh sức khoẻ kinh doanh và giải trình được từng con số.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={periodKey}
              onChange={(event) => setPeriodKey(event.target.value as PeriodKey)}
              className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-violet-400"
            >
              <option value="month">Tháng này · 01–19/08/2026</option>
              <option value="quarter">Quý này · Q3/2026</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" /> Xuất báo cáo
          </button>
        </div>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_6px_20px_rgba(15,23,42,0.03)]">
        <div className="flex min-w-0 items-center gap-1" role="tablist" aria-label="Kênh kinh doanh">
          {channels.map((item) => {
            const active = item.key === channelKey;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setChannelKey(item.key)}
                className={`min-w-[94px] rounded-xl px-4 py-2 text-left transition ${active ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <span className="block text-xs font-bold">{item.label}</span>
                <span className={`mt-0.5 block text-[9px] ${active ? "text-white/50" : "text-slate-400"}`}>{item.note}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500">
          <span className={`h-2 w-2 rounded-full ${channelKey === "men" ? "bg-blue-500" : channelKey === "women" ? "bg-violet-500" : "bg-emerald-500"}`} />
          Đang xem số liệu {channelKey === "all" ? "hợp nhất hai kênh" : `riêng kênh Watch ${channel.label}`}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Doanh thu ghi nhận" value={money(period.revenue)} note="Từ Order và Service" delta={initialProjection && period.previousRevenue <= 0 ? "—" : `${revenueDelta.toFixed(1)}%`} tone="blue" icon={TrendingUp} onClick={() => setDetail("revenue")} />
        <MetricCard label="Tiền đã thực thu" value={money(period.collected)} note={`${(period.revenue > 0 ? (period.collected / period.revenue) * 100 : 0).toFixed(1)}% doanh thu`} delta={initialProjection ? "—" : "8,4%"} tone="emerald" icon={Banknote} onClick={() => setDetail("collected")} />
        <MetricCard label="Tổng chi phí" value={money(period.cost)} note="Giá vốn và phí vận hành" delta={initialProjection ? "—" : "5,9%"} tone="slate" icon={ReceiptText} onClick={() => setDetail("cost")} />
        <MetricCard label="Lợi nhuận gộp" value={money(period.profit)} note={`Biên lợi nhuận ${margin.toFixed(1)}%`} delta={initialProjection ? "—" : "14,2%"} tone="violet" icon={CircleDollarSign} onClick={() => setDetail("profit")} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950">Doanh thu & lợi nhuận</h2>
              <p className="mt-1 text-xs text-slate-500">Xu hướng 6 tháng gần nhất · triệu đồng</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-500" /> Doanh thu</span>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Lợi nhuận</span>
            </div>
          </div>
          <div className="relative mt-6 flex h-52 items-end gap-3 overflow-hidden border-b border-slate-100 px-1 sm:gap-5">
            <div className="pointer-events-none absolute inset-x-0 bottom-8 top-0 flex flex-col justify-between">
              {[100, 75, 50, 25].map((line) => (
                <div key={line} className="flex items-center gap-2">
                  <span className="w-5 text-[8px] font-medium text-slate-300">{line}</span>
                  <span className="h-px flex-1 bg-slate-100" />
                </div>
              ))}
            </div>
            {channelTrend.map((item) => (
              <div key={item.month} className="relative z-10 flex h-full flex-1 flex-col justify-end gap-2">
                <div className="flex flex-1 items-end justify-center gap-1.5">
                  <div className="w-full max-w-8 rounded-t-md bg-violet-500/90 transition hover:bg-violet-600" style={{ height: `${item.revenue}%` }} title={`Doanh thu ${item.revenue} triệu`} />
                  <div className="w-full max-w-8 rounded-t-md bg-emerald-300 transition hover:bg-emerald-400" style={{ height: `${item.profit}%` }} title={`Lợi nhuận ${item.profit} triệu`} />
                </div>
                <span className="pb-2 text-center text-[10px] font-semibold text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)_72px]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Biên lợi nhuận</p>
              <p className="mt-1 text-[10px] text-slate-500">Xu hướng 6 tháng</p>
            </div>
            <div className="h-12 min-w-0">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 500 48" preserveAspectRatio="none" aria-label="Xu hướng biên lợi nhuận">
                <defs>
                  <linearGradient id="margin-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${smoothMarginPath(channelTrend)} L 490 48 L 10 48 Z`} fill="url(#margin-area)" />
                <path d={smoothMarginPath(channelTrend)} fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <circle cx="490" cy={40 - (channelTrend[channelTrend.length - 1].margin - 20) * 3.5} r="3.5" fill="white" stroke="#d97706" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold tracking-tight text-amber-800">{channelTrend[channelTrend.length - 1].margin}%</p>
              <p className="text-[9px] font-semibold text-emerald-600">+2,3 điểm</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="h-4 w-4 text-violet-500" />
              {initialProjection && period.revenue === 0
                ? "Chưa có dữ liệu tài chính được ghi nhận trong kỳ này."
                : channelKey === "all"
                ? "Tháng 8 tăng trưởng tốt nhờ nhóm Watch Nữ và doanh thu dịch vụ."
                : channelKey === "women"
                  ? "Kênh Nữ tăng nhanh hơn kỳ trước, biên lợi nhuận đang cải thiện."
                  : "Kênh Nam giữ doanh thu ổn định, cần theo dõi tỷ trọng giá vốn."}
            </div>
            <button type="button" className="text-[11px] font-bold text-violet-700">Xem phân tích →</button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold">Cầu nối lợi nhuận</h2>
              <p className="mt-1 text-xs text-white/50">Từ doanh thu đến lợi nhuận gộp</p>
            </div>
            <Info className="h-4 w-4 text-white/30" />
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Doanh thu", period.revenue, "100%", "text-white"],
              ...costComposition.slice(0, 3).map((item, index) => [item.label, -item.value, `${(period.revenue > 0 ? item.value / period.revenue * 100 : 0).toFixed(1)}%`, ["text-rose-300", "text-amber-300", "text-orange-300"][index]]),
            ].map(([label, value, ratio, color]) => (
              <div key={String(label)}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-white/65">{label}</span>
                  <span className={`font-semibold ${color}`}>{Number(value) < 0 ? "−" : ""}{money(Math.abs(Number(value)))}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white/30" style={{ width: String(ratio) }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-emerald-200">Lợi nhuận gộp</span>
              <ArrowUpRight className="h-4 w-4 text-emerald-300" />
            </div>
            <p className="mt-1 text-xl font-bold">{money(period.profit)}</p>
            <p className="mt-1 text-[10px] text-white/45">Biên {margin.toFixed(1)}% · cao hơn kỳ trước 1,8 điểm</p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950">Cơ cấu doanh thu</h2>
              <p className="mt-1 text-xs text-slate-500">Nhóm đóng góp vào tổng doanh thu kỳ này</p>
            </div>
            <Landmark className="h-4 w-4 text-slate-300" />
          </div>
          <div className="mt-5 space-y-4">
            {composition.length === 0 && <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-xs text-slate-400">Chưa có doanh thu trong kỳ.</p>}
            {composition.map(([label, width, value, color, count]) => (
              <div key={String(label)}>
                <div className="mb-1.5 flex justify-between gap-3 text-xs">
                  <span className="font-medium text-slate-600">{label}</span>
                  <span className="text-right">
                    <span className="block font-semibold text-slate-900">{value}</span>
                    <span className="mt-0.5 block text-[9px] font-medium text-slate-400">{count} giao dịch</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-blue-50/70 p-3 ring-1 ring-blue-100">
            <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-2.5">
              <span className="text-[10px] font-semibold text-blue-700">Tổng giao dịch tạo doanh thu</span>
              <span className="text-sm font-bold text-blue-900">{revenueTransactionCount}</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[9px] text-slate-400">Bình quân / giao dịch</span>
                <span className="mt-1 block text-xs font-bold text-slate-800">{revenueTransactionCount > 0 ? money(Math.round(period.revenue / revenueTransactionCount)) : "—"}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-slate-400">Đóng góp lớn nhất</span>
                <span className="mt-1 block text-xs font-bold text-slate-800">{composition[0] ? `${composition[0][0]} · ${composition[0][1]}%` : "—"}</span>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-950">Cơ cấu chi phí</h2>
              <p className="mt-1 text-xs text-slate-500">Chi phí thực tế của kênh {channel.label}</p>
            </div>
            <button type="button" onClick={() => setDetail("cost")} className="text-[10px] font-bold text-violet-700 hover:text-violet-900">Giải trình →</button>
          </div>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
            {costComposition.map((item) => (
              <div key={item.label} className={item.color} style={{ width: `${period.cost > 0 ? (item.value / period.cost) * 100 : 0}%` }} title={`${item.label}: ${money(item.value)}`} />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {costComposition.map((item) => (
              <button key={item.label} type="button" onClick={() => setDetail("cost")} className="group flex w-full items-center gap-3 text-left">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-700">{item.label}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-400">{item.note}</span>
                </span>
                <span className="text-right">
                  <span className="block text-xs font-bold text-slate-900">{money(item.value)}</span>
                  <span className="mt-0.5 block text-[9px] text-slate-400">{(period.revenue > 0 ? (item.value / period.revenue) * 100 : 0).toFixed(1)}% DT</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2.5">
            <span className="text-[11px] font-semibold text-rose-700">Tỷ lệ chi phí / doanh thu</span>
            <span className="text-sm font-bold text-rose-800">{(period.revenue > 0 ? (period.cost / period.revenue) * 100 : 0).toFixed(1)}%</span>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-950">Payment chưa xử lý</h2>
              <p className="mt-1 text-xs text-slate-500">Các khoản thu và chi còn chờ xử lý của kênh {channel.label}</p>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700">{exceptions.reduce((total, item) => total + item.count, 0)} điểm</span>
              <p className="mt-2 text-[10px] text-slate-400">Bấm để xem chứng từ liên quan</p>
            </div>
          </div>
          <div className="mt-4 space-y-5">
            {exceptions.map((item) => {
              const Icon = item.icon;
              const tone = {
                emerald: "bg-emerald-50 text-emerald-600",
                rose: "bg-rose-50 text-rose-600",
                amber: "bg-amber-50 text-amber-600",
                blue: "bg-blue-50 text-blue-600",
                violet: "bg-violet-50 text-violet-600",
              }[item.tone];
              return (
                <div key={item.title}>
                  <div className="flex items-center gap-3">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">{item.title}</span>
                        <span className="text-[10px] font-semibold text-slate-400">{item.meta}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[9px] text-slate-400">{item.note}</p>
                    </div>
                  </div>

                  <div className="mt-2 divide-y divide-slate-100 border-y border-slate-100">
                    {item.breakdown.map((part) => (
                      <button key={part.label} type="button" className="group grid w-full grid-cols-[minmax(0,1fr)_34px_auto_14px] items-center gap-2 py-2.5 text-left">
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold text-slate-700">{part.label}</span>
                          <span className="mt-0.5 block truncate text-[8px] uppercase tracking-wide text-slate-400">{part.owner}</span>
                        </span>
                        <span className="text-center">
                          <span className="block text-xs font-bold text-slate-800">{part.count}</span>
                          <span className="block text-[8px] text-slate-400">phiếu</span>
                        </span>
                        <span className={`text-right text-[10px] font-bold ${item.tone === "emerald" ? "text-emerald-600" : "text-rose-600"}`}>
                          {item.tone === "emerald" ? "+" : "−"}{money(part.amount)}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
                      </button>
                    ))}
                  </div>

                  <div className={`mt-2 flex items-center justify-between rounded-xl px-3 py-2.5 ${item.tone === "emerald" ? "bg-emerald-50" : "bg-rose-50"}`}>
                    <span className={`text-[10px] font-bold ${item.tone === "emerald" ? "text-emerald-700" : "text-rose-700"}`}>Tổng {item.title}</span>
                    <span className="text-right">
                      <span className={`text-xs font-bold ${item.tone === "emerald" ? "text-emerald-700" : "text-rose-700"}`}>
                        {item.tone === "emerald" ? "+" : "−"}{item.amount}
                      </span>
                      <span className="ml-2 text-[9px] text-slate-500">{item.count} phiếu</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-950 px-3 py-3 text-white">
            <span>
              <span className="block text-[10px] font-semibold text-white/50">Tổng Payment đang chờ</span>
              <span className="mt-0.5 block text-xs font-bold">{pendingPayments.in.count + pendingPayments.out.count} chứng từ</span>
            </span>
            <span className="text-right">
              <span className="block text-[10px] text-white/50">Chênh lệch IN − OUT</span>
              <span className={`mt-0.5 block text-sm font-bold ${pendingPayments.in.amount - pendingPayments.out.amount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {pendingPayments.in.amount - pendingPayments.out.amount >= 0 ? "+" : "−"}{money(Math.abs(pendingPayments.in.amount - pendingPayments.out.amount))}
              </span>
            </span>
          </div>
        </article>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 pb-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> {initialProjection ? `Projection lúc ${new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date(initialProjection.generatedAt))}` : "Dữ liệu minh hoạ"} · Công thức Finance v1</span>
        <span>Kỳ báo cáo: {period.label} · Kênh: {channel.label}</span>
      </footer>

      {detail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25 backdrop-blur-[2px]" onMouseDown={() => setDetail(null)}>
          <aside className="h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600">Giải trình chỉ số</p><h2 className="mt-1 text-lg font-bold text-slate-950">{detailTitle}</h2><p className="mt-1 text-xs text-slate-500">Các chứng từ đóng góp lớn nhất trong {period.label.toLowerCase()}.</p></div>
              <button type="button" onClick={() => setDetail(null)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-950 p-4 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">Tổng giá trị</p>
              <p className="mt-1 text-2xl font-bold">{money(period[detail])}</p>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-300"><ArrowUpRight className="h-3.5 w-3.5" /> Tăng so với cùng kỳ trước</p>
            </div>
            <div className="mt-5 space-y-2">
              {visibleDetailRows.map((row) => (
                <Link key={row.id} href={row.href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-violet-200 hover:bg-violet-50/40">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500"><ReceiptText className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold text-slate-400">{row.code} · {row.source}</span><span className="mt-0.5 block truncate text-xs font-semibold text-slate-800">{row.label}</span></span>
                  <span className="text-right"><span className="block text-xs font-bold text-slate-900">{money(row.amount)}</span><span className="mt-0.5 block text-[10px] text-emerald-600">Biên {row.margin}</span></span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-violet-600" />
                </Link>
              ))}
              {initialProjection && visibleDetailRows.length === 0 && <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-xs text-slate-400">Chưa có chứng từ phù hợp trong projection của kỳ này.</div>}
            </div>
            <div className="mt-5 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-800">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Đây là màn giải trình, việc chỉnh sửa vẫn thực hiện tại chứng từ nghiệp vụ gốc.
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default FinanceReportClient;
