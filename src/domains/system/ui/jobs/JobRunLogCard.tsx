function formatDateTime(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
}

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function runStatusTone(status?: string | null) {
    const value = String(status ?? "").toUpperCase();

    if (value === "DONE") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    if (value === "FAILED") return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    if (value === "PARTIAL") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    if (value === "SKIPPED") return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

    return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
}

export default function JobRunLogCard({
    log,
}: {
    log: {
        id: string;
        processorKey: string;
        triggerSource: string;
        status: string;
        processedCount: number;
        errorCount: number;
        note?: string | null;
        detail?: any;
        startedAt: string;
        finishedAt?: string | null;
    };
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">
                        {log.processorKey}
                    </div>
                    <div className="text-xs text-slate-500">{log.triggerSource}</div>
                </div>

                <span
                    className={cx(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        runStatusTone(log.status)
                    )}
                >
                    {log.status}
                </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                    <span className="text-slate-400">Processed:</span> {log.processedCount}
                </div>
                <div>
                    <span className="text-slate-400">Errors:</span> {log.errorCount}
                </div>
                <div>
                    <span className="text-slate-400">Started:</span> {formatDateTime(log.startedAt)}
                </div>
                <div>
                    <span className="text-slate-400">Finished:</span> {formatDateTime(log.finishedAt)}
                </div>
            </div>

            {log.note ? (
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200 whitespace-pre-line">
                    {log.note}
                </div>
            ) : null}
        </div>
    );
}