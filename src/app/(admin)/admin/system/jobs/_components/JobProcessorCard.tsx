"use client";

type JobControl = {
    key: string;
    label: string;
    enabled: boolean;
    batchSize: number;
    pausedReason?: string | null;
    updatedAt?: string;
    updatedBy?: string | null;
};

type Props = {
    control: JobControl;
    busy?: boolean;
    pendingCount?: number;
    failedCount?: number;
    onToggle: () => void;
    onUpdateBatchSize: (value: number) => void;
    onRunOnce?: () => void;
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

function statusTone(enabled: boolean) {
    return enabled
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

export default function JobProcessorCard({
    control,
    busy,
    pendingCount,
    failedCount,
    onToggle,
    onUpdateBatchSize,
    onRunOnce,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{control.label}</h3>
                        <span
                            className={cx(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                statusTone(control.enabled)
                            )}
                        >
                            {control.enabled ? "Enabled" : "Paused"}
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricMini label="Key" value={control.key} />
                        <MetricMini label="Batch size" value={String(control.batchSize)} />
                        <MetricMini label="Updated" value={formatDateTime(control.updatedAt)} />
                        <MetricMini label="Updated by" value={control.updatedBy || "-"} />
                    </div>

                    {!control.enabled && control.pausedReason ? (
                        <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
                            Lý do pause: {control.pausedReason}
                        </div>
                    ) : null}

                    {pendingCount != null || failedCount != null ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Pending jobs
                                </div>
                                <div className="mt-1 text-lg font-semibold text-slate-900">
                                    {pendingCount ?? 0}
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Failed jobs
                                </div>
                                <div className="mt-1 text-lg font-semibold text-slate-900">
                                    {failedCount ?? 0}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="flex min-w-[250px] flex-col gap-3">
                    <label className="text-sm font-medium text-slate-700">Batch size</label>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={control.batchSize}
                        disabled={busy}
                        onBlur={(e) => onUpdateBatchSize(Number(e.target.value))}
                        className="h-10 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                        <button
                            onClick={onToggle}
                            disabled={busy}
                            className={cx(
                                "rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-60",
                                control.enabled
                                    ? "border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                    : "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            )}
                        >
                            {control.enabled ? "Pause" : "Resume"}
                        </button>

                        {onRunOnce ? (
                            <button
                                onClick={onRunOnce}
                                disabled={busy || !control.enabled}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Run Once
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricMini(props: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {props.label}
            </div>
            <div className="mt-1 break-words text-sm font-semibold text-slate-900">
                {props.value}
            </div>
        </div>
    );
}