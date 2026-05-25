"use client";

type Props = {
    direction: "IN" | "OUT";
    totalAmount: number;
    paidTotal: number;
    remainingAmount: number;
    codAmount?: number | null;
};

function formatMoney(value: unknown, currency = "VND") {
    const n = Number(value ?? 0);
    return `${Math.round(Number.isFinite(n) ? n : 0).toLocaleString("vi-VN")} ${currency}`;
}

export default function PaymentSummaryMetrics({
    direction,
    totalAmount,
    paidTotal,
    remainingAmount,
    codAmount = 0,
}: Props) {
    return (
        <div className="mb-5 flex items-end justify-between rounded-2xl bg-slate-50/70 px-5 py-4 ring-1 ring-slate-100">
            <Metric
                label={direction === "OUT" ? "Phải chi" : "Phải thu"}
                value={formatMoney(totalAmount)}
            />
            <Metric label="Đã ghi nhận" value={formatMoney(paidTotal)} />
            <Metric
                label={direction === "OUT" ? "Còn chi" : "Còn thu"}
                value={formatMoney(remainingAmount)}
                highlight
            />
            <Metric label="COD" value={formatMoney(codAmount)} muted />
        </div>
    );
}

function Metric({
    label,
    value,
    highlight = false,
    muted = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
    muted?: boolean;
}) {
    return (
        <div className="min-w-[120px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {label}
            </div>
            <div
                className={[
                    "mt-1 text-[15px] font-black",
                    highlight ? "text-rose-600" : muted ? "text-slate-500" : "text-slate-950",
                ].join(" ")}
            >
                {value}
            </div>
        </div>
    );
}