export default function WatchSpecCard({ detail }: { detail: any }) {
    const spec = detail.spec;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">Spec</h2>

            <div className="space-y-2 text-sm">
                <div>Model: {spec?.model ?? "—"}</div>
                <div>Ref: {spec?.referenceNumber ?? "—"}</div>
                <div>Dial: {spec?.dialColor ?? "—"}</div>
                <div>Case shape: {spec?.caseShape ?? "—"}</div>
                <div>Primary material: {spec?.primaryCaseMaterial ?? "—"}</div>
                <div>Secondary material: {spec?.secondaryCaseMaterial ?? "—"}</div>
                <div>Gold treatment: {spec?.goldTreatment ?? "—"}</div>
            </div>
        </div>
    );
}