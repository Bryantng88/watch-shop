type JobLog = {
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

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function formatDateTime(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
}

function runStatusTone(status: string) {
    switch (String(status).toUpperCase()) {
        case "DONE":
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
        case "FAILED":
            return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
        case "RUNNING":
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
        default:
            return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
}

export default function JobRunLogCard({ log }: { log: JobLog }) {
    return (
        <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">{log.processorKey}</div>
                <span
                    className={cx(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                        runStatusTone(log.status)
                    )}
                >
                    {log.status}
                </span>
            </div>

            <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                    <span className="text-slate-400">Trigger:</span> {log.triggerSource}
                </div>
                <div>
                    <span className="text-slate-400">Processed:</span> {log.processedCount}
                </div>
                <div>
                    <span className="text-slate-400">Errors:</span> {log.errorCount}
                </div>
                <div>
                    <span className="text-slate-400">Started:</span> {formatDateTime(log.startedAt)}
                </div>
                <div className="sm:col-span-2">
                    <span className="text-slate-400">Finished:</span> {formatDateTime(log.finishedAt)}
                </div>
            </div>

            {log.note ? (
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
                    {log.note}
                </div>
            ) : null}
        </div>
    );
}