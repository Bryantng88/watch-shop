"use client";

import Link from "next/link";
import {
    ArrowDownToLine,
    ArrowUpRight,
    Check,
    ChevronDown,
    CirclePlus,
    Image,
    Pencil,
    Send,
    X,
} from "lucide-react";

import type {
    BusinessListActivityItem,
    BusinessListBreakdownItem,
    BusinessListDashboardData,
    BusinessListDashboardTone,
    BusinessListDashboardView,
} from "./business-list.types";

const toneClass: Record<BusinessListDashboardTone, string> = {
    slate: "bg-slate-500",
    violet: "bg-violet-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value);
}

function formatCurrency(value: number, currency = "VND") {
    return `${formatNumber(value)} ${currency}`;
}

function formatActivityTime(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    }).format(date);
}

function deltaParts(
    value: string,
    tone?: "positive" | "negative" | "neutral",
) {
    const number = value.trim().replace(/^[+-]\s*/, "");
    return {
        arrow: tone === "positive" ? "↑" : tone === "negative" ? "↓" : null,
        number,
    };
}

function DeltaValue({
    value,
    tone,
}: {
    value: string;
    tone?: "positive" | "negative" | "neutral";
}) {
    const delta = deltaParts(value, tone);
    return (
        <>
            {delta.arrow ? (
                <span className="mr-0.5 inline-block text-[12px] font-black leading-none">
                    {delta.arrow}
                </span>
            ) : null}
            <span>{delta.number}</span>
        </>
    );
}

function TrendLine({ values = [] }: { values?: number[] }) {
    if (values.length < 2) return <div className="h-14" />;

    const width = 240;
    const height = 54;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const points = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 10) - 5;
            return `${x},${y}`;
        });
    const path = points.reduce((result, point, index) => {
        const [x, y] = point.split(",").map(Number);
        if (index === 0) return `M ${x} ${y}`;
        const [previousX, previousY] = points[index - 1].split(",").map(Number);
        const midX = (previousX + x) / 2;
        return `${result} C ${midX} ${previousY}, ${midX} ${y}, ${x} ${y}`;
    }, "");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full" aria-hidden="true">
            <defs>
                <linearGradient id="business-list-trend-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#business-list-trend-fill)" />
            <path
                d={path}
                fill="none"
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BreakdownRing({
    items,
    total,
}: {
    items: BusinessListBreakdownItem[];
    total: number;
}) {
    let cursor = 0;
    const segments = items
        .filter((item) => item.value > 0)
        .map((item) => {
            const start = cursor;
            cursor += total > 0 ? (item.value / total) * 100 : 0;
            return `${toneClass[item.tone ?? "slate"].replace("bg-", "")} ${start}% ${cursor}%`;
        });

    const colorValue: Record<string, string> = {
        "slate-500": "#64748b",
        "violet-500": "#8b5cf6",
        "blue-500": "#3b82f6",
        "emerald-500": "#10b981",
        "amber-500": "#f59e0b",
        "rose-500": "#f43f5e",
    };
    const gradient = segments.length
        ? segments
              .map((segment) => {
                  const [color, start, end] = segment.split(" ");
                  return `${colorValue[color] ?? color} ${start} ${end}`;
              })
              .join(", ")
        : "#e2e8f0 0% 100%";

    return (
        <div
            className="h-24 w-24 shrink-0 rounded-full"
            style={{ background: `conic-gradient(${gradient})` }}
            aria-hidden="true"
        >
            <div className="m-[14px] h-[68px] w-[68px] rounded-full bg-white" />
        </div>
    );
}

function ActivityRow({ item }: { item: BusinessListActivityItem }) {
    const activityVisual = {
        created: {
            icon: CirclePlus,
            className: "border-violet-200 bg-white text-violet-500",
        },
        updated: {
            icon: Pencil,
            className: "border-blue-200 bg-white text-blue-500",
        },
        submitted: {
            icon: Send,
            className: "border-sky-200 bg-white text-sky-500",
        },
        approved: {
            icon: Check,
            className: "border-emerald-200 bg-white text-emerald-500",
        },
        rejected: {
            icon: X,
            className: "border-rose-200 bg-white text-rose-500",
        },
        media: {
            icon: Image,
            className: "border-amber-200 bg-white text-amber-500",
        },
        downloaded: {
            icon: ArrowDownToLine,
            className: "border-slate-300 bg-white text-slate-950",
        },
    }[item.kind ?? "updated"];
    const ActivityIcon = activityVisual.icon;
    const content = (
        <>
            <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-white">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full border shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition duration-200 group-hover:scale-110 ${activityVisual.className}`}>
                    <ActivityIcon className="h-[9px] w-[9px]" strokeWidth={2} />
                </span>
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-800">
                    {item.title}
                </span>
                {item.description ? (
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                        {item.description}
                    </span>
                ) : null}
            </span>
            <span className="shrink-0 text-[10px] font-medium text-slate-400">
                {formatActivityTime(item.occurredAt)}
            </span>
        </>
    );

    return item.href ? (
        <Link href={item.href} className="group flex items-start gap-2 rounded-lg py-1.5 transition duration-200 hover:bg-slate-50">
            {content}
        </Link>
    ) : (
        <div className="group flex items-start gap-2 py-1.5">{content}</div>
    );
}

export function BusinessListDashboardSkeleton() {
    return (
        <div className="grid animate-pulse grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-[1.65fr_1fr_1fr_1.12fr]">
            {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-[190px] rounded-xl border border-slate-200 bg-white p-5">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="mt-6 h-8 w-32 rounded bg-slate-100" />
                    <div className="mt-5 h-12 rounded bg-slate-50" />
                </div>
            ))}
        </div>
    );
}

export default function BusinessListDashboard({
    data,
    views = [],
    activeView,
    onViewChange,
}: {
    data: BusinessListDashboardData;
    views?: BusinessListDashboardView[];
    activeView?: string;
    onViewChange?: (view: string) => void;
}) {
    return (
        <section aria-label="Tổng quan danh sách" className="space-y-3">
            {views.length > 1 ? (
                <div className="flex justify-end">
                    <select
                        value={activeView}
                        onChange={(event) => onViewChange?.(event.target.value)}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                    >
                        {views.map((view) => (
                            <option key={view.key} value={view.key}>
                                {view.label}
                            </option>
                        ))}
                    </select>
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-[1.65fr_1fr_1fr_1.12fr]">
                <article className="min-h-[190px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-slate-800">Tổng quan</h2>
                        <button
                            type="button"
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            {data.periodLabel ?? "7 ngày qua"}
                            <ChevronDown className="h-3 w-3 text-slate-400" />
                        </button>
                    </div>
                    <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                        {data.metrics.slice(0, 4).map((metric) => (
                            <div key={metric.key} className="flex min-w-0 items-start">
                                <div className="min-w-0">
                                    <div className="whitespace-nowrap text-[10px] font-medium text-slate-500">
                                        {metric.label}
                                    </div>
                                    <div className="mt-2 text-[22px] font-semibold leading-none tracking-[-0.03em] text-slate-950">
                                        {typeof metric.value === "number"
                                            ? formatNumber(metric.value)
                                            : metric.value}
                                    </div>
                                    {metric.helper ? (
                                        <div
                                            className={`mt-3 whitespace-nowrap text-[9px] font-semibold ${
                                                metric.helperTone === "negative"
                                                    ? "text-rose-600"
                                                    : metric.helperTone === "neutral"
                                                      ? "text-slate-400"
                                                      : "text-emerald-600"
                                            }`}
                                        >
                                            <DeltaValue
                                                value={metric.helper}
                                                tone={metric.helperTone}
                                            />
                                            {metric.helperSuffix ? (
                                                <span className="ml-1 font-medium leading-4 text-slate-400">
                                                    {metric.helperSuffix}
                                                </span>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="min-h-[190px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-slate-800">
                            {data.inventoryValue?.label ?? "Giá trị"}
                        </h2>
                    </div>
                    <div className="mt-8 flex items-start justify-between gap-2">
                        <div className="min-w-0 whitespace-nowrap text-[22px] font-semibold tracking-[-0.035em] text-slate-950">
                            {formatCurrency(
                                data.inventoryValue?.value ?? 0,
                                data.inventoryValue?.currency,
                            )}
                        </div>
                        {data.inventoryValue?.change ? (
                            <div className="w-[72px] shrink-0 text-center">
                                <span
                                    className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                                        data.inventoryValue.changeTone === "negative"
                                            ? "bg-rose-50 text-rose-600"
                                            : data.inventoryValue.changeTone === "positive"
                                              ? "bg-emerald-50 text-emerald-600"
                                              : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    <DeltaValue
                                        value={data.inventoryValue.change}
                                        tone={data.inventoryValue.changeTone}
                                    />
                                </span>
                                {data.inventoryValue.changeSuffix ? (
                                    <span className="mt-1 block whitespace-normal text-[9px] leading-3 text-slate-400">
                                        {data.inventoryValue.changeSuffix}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                        {data.inventoryValue?.helper}
                    </div>
                    <div className="mt-2">
                        <TrendLine values={data.inventoryValue?.trend} />
                    </div>
                </article>

                <article className="min-h-[190px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
                    <h2 className="text-xs font-semibold text-slate-800">
                        {data.breakdown?.label ?? "Theo trạng thái"}
                    </h2>
                    <div className="mt-7 flex items-center gap-4">
                        <BreakdownRing
                            items={data.breakdown?.items ?? []}
                            total={data.breakdown?.total ?? 0}
                        />
                        <div className="min-w-0 flex-1 space-y-2">
                            {(data.breakdown?.items ?? []).slice(0, 4).map((item) => (
                                <div key={item.key} className="flex items-center gap-2 text-[11px]">
                                    <span className={`h-2 w-2 rounded-full ${toneClass[item.tone ?? "slate"]}`} />
                                    <span className="min-w-0 flex-1 truncate text-slate-600">{item.label}</span>
                                    <span className="font-semibold text-slate-800">{formatNumber(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>

                <article className="min-h-[190px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-slate-800">
                            {data.activities?.label ?? "Hoạt động gần đây"}
                        </h2>
                    </div>
                    <div className="relative mt-3 space-y-1 before:absolute before:bottom-3 before:left-[9px] before:top-3 before:w-px before:bg-slate-200/80">
                        {(data.activities?.items ?? []).slice(0, 3).map((item) => (
                            <ActivityRow key={item.id} item={item} />
                        ))}
                        {!data.activities?.items.length ? (
                            <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                                Chưa có hoạt động
                            </div>
                        ) : null}
                    </div>
                    <div className="mt-1 flex justify-end">
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                </article>
            </div>
        </section>
    );
}
