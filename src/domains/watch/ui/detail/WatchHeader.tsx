export default function WatchHeader({ detail }: { detail: any }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">{detail.title}</h1>
                <div className="text-sm text-slate-500">
                    {detail.brand?.name ?? "—"} • {detail.sku ?? "No SKU"}
                </div>
            </div>
        </div>
    );
}