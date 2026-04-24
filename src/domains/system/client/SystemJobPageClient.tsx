"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import AcquisitionSpecLogViewer from "@/domains/system/ui/jobs/AcquisitionSpecLogViewer";
import JobProcessorCard from "@/domains/system/ui/jobs/JobProcessorCard";
import JobSummaryCard from "@/domains/system/ui/jobs/JobSummaryCard";

type JobControl = {
    id: string;
    processorKey: string;
    label?: string | null;
    isEnabled: boolean;
    batchSize: number | null;
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
    try {
        return new Date(value).toLocaleString("vi-VN");
    } catch {
        return value;
    }
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
        case "RUNNING":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "SKIPPED":
            return "border-amber-200 bg-amber-50 text-amber-700";
        default:
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
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
                <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50">
                        <tr>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">
                                Processor
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">
                                Trigger
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">
                                Status
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-right font-medium text-slate-500">
                                Processed
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-right font-medium text-slate-500">
                                Errors
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">
                                Started
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">
                                Finished
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-500">
                                Note
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-center font-medium text-slate-500">
                                Xem log
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-8 text-center text-sm text-slate-500"
                                >
                                    Chưa có run log nào.
                                </td>
                            </tr>
                        ) : null}

                        {rows.map((log) => {
                            const selected = selectedRunId === log.id;

                            return (
                                <tr
                                    key={log.id}
                                    className={
                                        selected
                                            ? "bg-slate-50"
                                            : "hover:bg-slate-50/70"
                                    }
                                >
                                    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-900">
                                        <div className="font-medium">
                                            {log.processorKey}
                                        </div>
                                    </td>

                                    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600">
                                        {log.triggerSource || "manual"}
                                    </td>

                                    <td className="border-b border-slate-100 px-4 py-3 align-top">
                                        <span
                                            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${runStatusTone(
                                                log.status
                                            )}`}
                                        >
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

                                    <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600">
                                        <div className="max-w-[260px] truncate">
                                            {log.note || "-"}
                                        </div>
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
    const [controls, setControls] = useState<JobControl[]>(initialControls);
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

            setControls(
                Array.isArray(controlsData.controls) ? controlsData.controls : []
            );

            setLogs(
                Array.isArray(logsData.items)
                    ? logsData.items
                    : Array.isArray(logsData.logs)
                        ? logsData.logs
                        : []
            );

            setStats(
                statsData.item || {
                    processorCount: 0,
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
        setBusyKey(includeFailed ? "retry_failed_spec" : "run_acq_spec");
        setError("");

        try {
            const res = await fetch(
                "/api/admin/system/jobs/system-jobs/run-acquisition-spec",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ includeFailed }),
                }
            );

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

    async function runAllJobs() {
        setBusyKey("run_all_jobs");
        setError("");

        try {
            await runAcquisitionSpec(false);
        } finally {
            setBusyKey("");
        }
    }

    async function toggleProcessor(control: JobControl) {
        setBusyKey(`toggle_${control.processorKey}`);
        setError("");

        try {
            const res = await fetch(
                "/api/admin/system/jobs/system-job-controls/toggle",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        processorKey: control.processorKey,
                        isEnabled: !control.isEnabled,
                    }),
                }
            );

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
        if (
            initialControls.length === 0 &&
            initialLogs.length === 0 &&
            !initialStats
        ) {
            startTransition(() => {
                void loadAll();
            });
        }
    }, [initialControls.length, initialLogs.length, initialStats, startTransition]);

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
                            onClick={runAllJobs}
                            disabled={busyKey === "run_all_jobs"}
                            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {busyKey === "run_all_jobs" ? "Đang chạy..." : "Run All Jobs Now"}
                        </button>

                        <button
                            type="button"
                            onClick={() => runAcquisitionSpec(false)}
                            disabled={busyKey === "run_acq_spec"}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    value={String(stats.processorCount)}
                    description={`Enabled ${controls.filter((x) => x.enabled).length} • Paused ${controls.filter((x) => !x.enabled).length
                        }`}
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
                            <div className="mb-3">
                                <h2 className="text-lg font-semibold text-slate-950">
                                    {acquisitionControl.label || "Acquisition Spec Processor"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {acquisitionControl.processorKey} • {fmtDateTime(acquisitionControl.updatedAt)}
                                </p>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${acquisitionControl.isEnabled
                                            ? "bg-green-50 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {acquisitionControl.isEnabled ? "Enabled" : "Paused"}
                                    </span>

                                    <span className="text-sm text-slate-500">
                                        Batch: {acquisitionControl.batchSize ?? 0}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => runAcquisitionSpec(false)}
                                        className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                                    >
                                        Run now
                                    </button>

                                    <button
                                        onClick={() => runAcquisitionSpec(true)}
                                        className="rounded-xl border px-4 py-2 text-sm"
                                    >
                                        Retry failed
                                    </button>

                                    <button
                                        onClick={() => toggleProcessor(acquisitionControl)}
                                        className="rounded-xl border px-4 py-2 text-sm"
                                    >
                                        {acquisitionControl.isEnabled ? "Pause" : "Resume"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed p-6 text-sm text-slate-500">
                            Chưa có processor nào.
                        </div>
                    )}
                </div>

                <div className="xl:col-span-12">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Recent Runs
                            </h2>
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
                    {selectedRunId ? (
                        <AcquisitionSpecLogViewer jobId={selectedRunId} />
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                            Chọn một run ở bảng phía trên để xem logs chi tiết.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}