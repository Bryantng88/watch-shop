"use client";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function statusTone(enabled: boolean) {
    return enabled
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

function MiniMetric({
    label,
    value,
    tone = "default",
}: {
    label: string;
    value: string;
    tone?: "default" | "danger";
}) {
    return (
        <div
            className={cx(
                "rounded-xl px-3 py-3 ring-1",
                tone === "danger"
                    ? "bg-rose-50 text-rose-700 ring-rose-200"
                    : "bg-slate-50 text-slate-900 ring-slate-200"
            )}
        >
            <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-semibold">{value}</div>
        </div>
    );
}

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
    onRetryFailed?: () => void;
};

export default function JobProcessorCard({
    control,
    busy,
    pendingCount = 0,
    failedCount = 0,
    onToggle,
    onUpdateBatchSize,
    onRunOnce,
    onRetryFailed,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 space-y-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                            {control.label}
                        </h3>
                        <span
                            className={cx(
                                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                                statusTone(control.enabled)
                            )}
                        >
                            {control.enabled ? "Đang bật" : "Đã tạm dừng"}
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <MiniMetric label="Pending" value={String(pendingCount)} />
                        <MiniMetric
                            label="Failed"
                            value={String(failedCount)}
                            tone={failedCount > 0 ? "danger" : "default"}
                        />
                        <MiniMetric label="Batch" value={String(control.batchSize || 1)} />
                    </div>

                    {!control.enabled && control.pausedReason ? (
                        <div className="text-sm text-rose-600">{control.pausedReason}</div>
                    ) : null}

                    <div className="text-xs text-slate-400">
                        {control.key}
                        {control.updatedAt
                            ? ` • cập nhật ${new Date(control.updatedAt).toLocaleString()}`
                            : ""}
                        {control.updatedBy ? ` • bởi ${control.updatedBy}` : ""}
                    </div>
                </div>

                <div className="flex min-w-[280px] flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Batch size</span>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            defaultValue={control.batchSize || 1}
                            disabled={busy}
                            onBlur={(e) => onUpdateBatchSize(Number(e.target.value))}
                            className="h-10 w-24 rounded-xl border border-slate-300 px-3 text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {onRunOnce ? (
                            <button
                                onClick={onRunOnce}
                                disabled={busy || !control.enabled}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                            >
                                Run now
                            </button>
                        ) : null}

                        {failedCount > 0 && onRetryFailed ? (
                            <button
                                onClick={onRetryFailed}
                                disabled={busy}
                                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 disabled:opacity-60"
                            >
                                Retry failed
                            </button>
                        ) : null}

                        <button
                            onClick={onToggle}
                            disabled={busy}
                            className={cx(
                                "rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60",
                                control.enabled
                                    ? "border border-rose-300 bg-rose-50 text-rose-700"
                                    : "border border-emerald-300 bg-emerald-50 text-emerald-700"
                            )}
                        >
                            {control.enabled ? "Pause" : "Resume"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}