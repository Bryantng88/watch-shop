function fmtMoney(v?: string | number | null) {
    if (v == null || v === "") return "—";
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    return new Intl.NumberFormat("vi-VN").format(n);
}

export default function WatchPricingCard({
    pricing,
    canViewTradeFinancials,
}: {
    pricing: any;
    canViewTradeFinancials: boolean;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">Pricing</h2>

            <div className="space-y-2 text-sm">
                {canViewTradeFinancials ? (
                    <div>Cost: {fmtMoney(pricing?.price?.costPrice)}</div>
                ) : null}
                <div>List: {fmtMoney(pricing?.price?.listPrice)}</div>
                <div className="font-medium text-orange-600">
                    Sale: {fmtMoney(pricing?.price?.salePrice)}
                </div>
            </div>
        </div>
    );
}