"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import JobSummaryCard from "@/domains/system/ui/jobs/JobSummaryCard";

type JobControl = {
    id?: string;
    key?: string;
    processorKey?: string;
    label?: string | null;
    enabled?: boolean;
    isEnabled?: boolean;
    batchSize: number | null;
    pausedReason?: string | null;
    updatedAt?: string | null;
};

type NormalizedControl = {
    processorKey: string;
    label: string;
    isEnabled: boolean;
    batchSize: number;
    pausedReason?: string | null;
    updatedAt?: string | null;
};

type JobRunLog = {
    id: string;
    processorKey: string;
    triggerSource?: string | null;
    status: string;
    processedCount?: number | null;
    errorCount?: number | null;
    startedAt?: string | null;
    finishedAt?: string | null;
    note?: string | null;
    detail?: unknown;
    createdAt?: string | null;
};

type JobStats = {
    processorCount: number;
    pendingSpecCount: number;
    failedSpecCount: number;
    latestRunStatus?: string | null;
    latestRunAt?: string | null;
};

type Props = {
    initialControls?: JobControl[];
    initialLogs?: JobRunLog[];
    initialStats?: JobStats | null;
};

function fmtDateTime(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function fmtDuration(startedAt?: string | null, finishedAt?: string | null) {
    if (!startedAt || !finishedAt) return "-";

    const start = new Date(startedAt).getTime();
    const end = new Date(finishedAt).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return "-";

    const ms = end - start;
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}m ${rest}s`;
}

function runStatusTone(status?: string | null) {
    const value = String(status ?? "").toUpperCase();

    switch (value) {
        case "DONE":
        case "SUCCESS":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "FAILED":
        case "ERROR":
            return "border-rose-200 bg-rose-50 text-rose-700";
        case "PARTIAL":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "RUNNING":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "SKIPPED":
            return "border-slate-200 bg-slate-50 text-slate-600";
        default:
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
}

function normalizeControl(item: JobControl): NormalizedControl {
    const processorKey = item.processorKey || item.key || item.id || "unknown";

    return {
        processorKey,
        label: item.label || processorKey,
        isEnabled:
            typeof item.isEnabled === "boolean"
                ? item.isEnabled
                : Boolean(item.enabled),
        batchSize:
            typeof item.batchSize === "number" && item.batchSize > 0
                ? item.batchSize
                : 1,
        pausedReason: item.pausedReason ?? null,
        updatedAt: item.updatedAt ?? null,
    };
}


function SystemRunDetailPanel({ log }: { log: JobRunLog | null }) {
    if (!log) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                Chọn một run ở bảng phía trên để xem detail.
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-950">Run Detail</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {log.processorKey} • {log.triggerSource || "manual"} • {fmtDuration(log.startedAt, log.finishedAt)}
                    </p>
                </div>
                <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${runStatusTone(log.status)}`}>
                    {log.status}
                </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-xs text-slate-500">Processed</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{log.processedCount ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-xs text-slate-500">Errors</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{log.errorCount ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-xs text-slate-500">Started</div>
                    <div className="mt-1 text-sm font-medium text-slate-900">{fmtDateTime(log.startedAt)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-xs text-slate-500">Finished</div>
                    <div className="mt-1 text-sm font-medium text-slate-900">{fmtDateTime(log.finishedAt)}</div>
                </div>
            </div>

            {log.note ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {log.note}
                </div>
            ) : null}

            {log.detail ? (
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                    {JSON.stringify(log.detail, null, 2)}
                </pre>
            ) : null}
        </div>
    );
}

function RecentRunsMonitorTable({
    rows,
    selectedRunId,
    onSelect,
}: {
    rows: JobRunLog[];
    selectedRunId: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="max-h-[520px] overflow-auto">
                <table className="min-w-[1080px] border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50">
                        <tr>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">Processor</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">Trigger</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">Status</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-right font-medium text-slate-500">Processed</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-right font-medium text-slate-500">Errors</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">Started</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">Finished</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-right font-medium text-slate-500">Duration</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">Note</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-center font-medium text-slate-500">Xem log</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-500">
                                    Chưa có run log nào.
                                </td>
                            </tr>
                        ) : null}

                        {rows.map((log) => {
                            const selected = selectedRunId === log.id;

                            return (
                                <tr key={log.id} className={selected ? "bg-slate-50" : "hover:bg-slate-50/70"}>
                                    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-900">
                                        <div className="font-medium">{log.processorKey}</div>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600">
                                        {log.triggerSource || "manual"}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 align-top">
                                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${runStatusTone(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 text-right align-top text-slate-900">
                                        {log.processedCount ?? 0}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 text-right align-top text-slate-900">
                                        {log.errorCount ?? 0}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 align-top whitespace-nowrap text-slate-600">
                                        {fmtDateTime(log.startedAt)}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 align-top whitespace-nowrap text-slate-600">
                                        {fmtDateTime(log.finishedAt)}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 text-right align-top whitespace-nowrap text-slate-600">
                                        {fmtDuration(log.startedAt, log.finishedAt)}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600">
                                        <div className="max-w-[280px] truncate">{log.note || "-"}</div>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 text-center align-top">
                                        <button
                                            type="button"
                                            onClick={() => onSelect(log.id)}
                                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${selected
                                                ? "border-slate-900 bg-slate-900 text-white"
                                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            {selected ? "Đang xem" : "Xem log"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function SystemJobPageClient({
    initialControls = [],
    initialLogs = [],
    initialStats = null,
}: Props) {
    const [controls, setControls] = useState<NormalizedControl[]>(
        initialControls.map(normalizeControl)
    );
    const [logs, setLogs] = useState<JobRunLog[]>(initialLogs);
    const [stats, setStats] = useState<JobStats>({
        processorCount: initialStats?.processorCount ?? initialControls.length ?? 0,
        pendingSpecCount: initialStats?.pendingSpecCount ?? 0,
        failedSpecCount: initialStats?.failedSpecCount ?? 0,
        latestRunStatus: initialStats?.latestRunStatus ?? null,
        latestRunAt: initialStats?.latestRunAt ?? null,
    });

    const [busyKey, setBusyKey] = useState("");
    const [error, setError] = useState("");
    const [selectedRunId, setSelectedRunId] = useState("");
    const [, startTransition] = useTransition();

    const acquisitionControl = useMemo(
        () => controls.find((x) => x.processorKey === "acquisition_spec") || null,
        [controls]
    );

    const acquisitionRuns = useMemo(
        () => logs.filter((x) => x.processorKey === "acquisition_spec"),
        [logs]
    );

    const selectedRun = useMemo(
        () => acquisitionRuns.find((x) => x.id === selectedRunId) || null,
        [acquisitionRuns, selectedRunId]
    );

    useEffect(() => {
        if (!selectedRunId && acquisitionRuns.length > 0) {
            setSelectedRunId(acquisitionRuns[0].id);
        }
    }, [acquisitionRuns, selectedRunId]);

    async function loadAll(showBusy = false) {
        if (showBusy) setBusyKey("reload");

        try {
            setError("");

            const [controlsRes, logsRes, statsRes] = await Promise.all([
                fetch("/api/admin/system/jobs/system-job-controls", {
                    method: "GET",
                    cache: "no-store",
                }),
                fetch("/api/admin/system/jobs/system-job-logs", {
                    method: "GET",
                    cache: "no-store",
                }),
                fetch("/api/admin/system/jobs/system-job-stats", {
                    method: "GET",
                    cache: "no-store",
                }),
            ]);

            const [controlsData, logsData, statsData] = await Promise.all([
                controlsRes.json().catch(() => ({})),
                logsRes.json().catch(() => ({})),
                statsRes.json().catch(() => ({})),
            ]);

            if (!controlsRes.ok || !controlsData?.ok) {
                throw new Error(controlsData?.error || "Không thể tải job controls");
            }
            if (!logsRes.ok || !logsData?.ok) {
                throw new Error(logsData?.error || "Không thể tải job logs");
            }
            if (!statsRes.ok || !statsData?.ok) {
                throw new Error(statsData?.error || "Không thể tải job stats");
            }

            const nextControls = Array.isArray(controlsData.controls)
                ? controlsData.controls
                : Array.isArray(controlsData.items)
                    ? controlsData.items
                    : [];

            setControls(nextControls.map(normalizeControl));
            setLogs(
                Array.isArray(logsData.items)
                    ? logsData.items
                    : Array.isArray(logsData.logs)
                        ? logsData.logs
                        : []
            );
            setStats(
                statsData.item || statsData.stats || {
                    processorCount: nextControls.length,
                    pendingSpecCount: 0,
                    failedSpecCount: 0,
                    latestRunStatus: null,
                    latestRunAt: null,
                }
            );
        } catch (error: any) {
            setError(error?.message || "Không thể tải dữ liệu jobs");
        } finally {
            if (showBusy) setBusyKey("");
        }
    }

    async function runAcquisitionSpec(includeFailed = false) {
        const key = includeFailed ? "retry_failed_spec" : "run_acq_spec";
        setBusyKey(key);
        setError("");

        try {
            const res = await fetch("/api/admin/system/jobs/system-jobs/run-acquisition-spec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ includeFailed }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok) {
                throw new Error(data?.error || "Không thể chạy acquisition spec");
            }

            await loadAll();
        } catch (error: any) {
            setError(error?.message || "Không thể chạy acquisition spec");
        } finally {
            setBusyKey("");
        }
    }

    async function toggleProcessor(control: NormalizedControl) {
        setBusyKey(`toggle_${control.processorKey}`);
        setError("");

        try {
            const res = await fetch("/api/admin/system/jobs/system-job-controls/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    processorKey: control.processorKey,
                    isEnabled: !control.isEnabled,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok) {
                throw new Error(data?.error || "Không thể cập nhật processor");
            }

            await loadAll();
        } catch (error: any) {
            setError(error?.message || "Không thể cập nhật processor");
        } finally {
            setBusyKey("");
        }
    }

    useEffect(() => {
        if (initialControls.length === 0 && initialLogs.length === 0 && !initialStats) {
            startTransition(() => {
                void loadAll();
            });
        }
    }, [initialControls.length, initialLogs.length, initialStats, startTransition]);

    const enabledCount = controls.filter((x) => x.isEnabled).length;
    const pausedCount = controls.length - enabledCount;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                            System Jobs
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Quản lý processor chạy nền, backlog và lịch sử vận hành.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => runAcquisitionSpec(false)}
                            disabled={busyKey === "run_acq_spec"}
                            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {busyKey === "run_acq_spec" ? "Đang chạy..." : "Run Acquisition Spec"}
                        </button>

                        <button
                            type="button"
                            onClick={() => runAcquisitionSpec(true)}
                            disabled={busyKey === "retry_failed_spec"}
                            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {busyKey === "retry_failed_spec" ? "Đang retry..." : "Retry Failed Spec"}
                        </button>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <JobSummaryCard
                    title="Processors"
                    value={String(stats.processorCount || controls.length)}
                    description={`Enabled ${enabledCount} • Paused ${pausedCount}`}
                />
                <JobSummaryCard
                    title="Spec Pending"
                    value={String(stats.pendingSpecCount)}
                    description="Đang chờ run hoặc trigger sau post"
                />
                <JobSummaryCard
                    title="Spec Failed"
                    value={String(stats.failedSpecCount)}
                    description="Nên retry hoặc kiểm tra input AI"
                />
                <JobSummaryCard
                    title="Latest Run"
                    value={String(stats.latestRunStatus || "-")}
                    description={fmtDateTime(stats.latestRunAt)}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-12">
                    {acquisitionControl ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-950">
                                        {acquisitionControl.label || "Acquisition Spec Processor"}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {acquisitionControl.processorKey} • cập nhật {fmtDateTime(acquisitionControl.updatedAt)}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${acquisitionControl.isEnabled
                                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                                            }`}
                                    >
                                        {acquisitionControl.isEnabled ? "Enabled" : "Paused"}
                                    </span>
                                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                        Batch {acquisitionControl.batchSize}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleProcessor(acquisitionControl)}
                                        disabled={busyKey === `toggle_${acquisitionControl.processorKey}`}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        {acquisitionControl.isEnabled ? "Pause" : "Resume"}
                                    </button>
                                </div>
                            </div>

                            {!acquisitionControl.isEnabled && acquisitionControl.pausedReason ? (
                                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                    {acquisitionControl.pausedReason}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                            Chưa có processor nào.
                        </div>
                    )}
                </div>

                <div className="xl:col-span-12">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-slate-950">Recent Runs</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Monitor lịch sử run theo dạng bảng, chọn một dòng để xem log chi tiết.
                            </p>
                        </div>

                        <RecentRunsMonitorTable
                            rows={acquisitionRuns}
                            selectedRunId={selectedRunId}
                            onSelect={setSelectedRunId}
                        />
                    </div>
                </div>

                <div className="xl:col-span-12">
                    <SystemRunDetailPanel log={selectedRun} />
                </div>
            </div>
        </div>
    );
}
