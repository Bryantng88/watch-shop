export default function WatchStateCard({ detail }: { detail: any }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">State</h2>

            <div className="space-y-2 text-sm">
                <div>Product status: {detail.status ?? "—"}</div>
                <div>Sale state: {detail.watch?.saleState ?? "—"}</div>
                <div>Service state: {detail.watch?.serviceState ?? "—"}</div>
                <div>Stock state: {detail.watch?.stockState ?? "—"}</div>
                <div>Gender: {detail.watch?.gender ?? "—"}</div>
                <div>Site: {detail.watch?.siteChannel ?? "—"}</div>
            </div>
        </div>
    );
}