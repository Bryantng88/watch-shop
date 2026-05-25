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
        <div className="mb-6 grid grid-cols-4 gap-4">
            <Metric
                label={direction === "OUT" ? "Tổng phải chi" : "Tổng phải thu"}
                value={formatMoney(totalAmount)}
            />
            <Metric label="Đã ghi nhận" value={formatMoney(paidTotal)} />
            <Metric
                label={direction === "OUT" ? "Còn phải chi" : "Còn phải thu"}
                value={formatMoney(remainingAmount)}
                highlight
            />
            <Metric label="COD đối soát" value={formatMoney(codAmount)} />
        </div>
    );
}

function Metric({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {label}
            </div>
            <div
                className={`mt-1 text-base font-black ${highlight ? "text-rose-600" : "text-slate-950"
                    }`}
            >
                {value}
            </div>
        </div>
    );
}