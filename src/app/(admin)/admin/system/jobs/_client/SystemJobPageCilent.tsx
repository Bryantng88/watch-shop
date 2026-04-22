"use client";

import { useEffect, useMemo, useState } from "react";
import JobSummaryCard from "../_components/JobSummaryCard"
import JobProcessorCard from "../_components/JobProcessorCard";
import JobRunLogCard from "../_components/JobRunLogCard";

type JobControl = {
    key: string;
    label: string;
    enabled: boolean;
    batchSize: number;
    pausedReason?: string | null;
    updatedAt?: string;
    updatedBy?: string | null;
};

type SystemJobStats = {
    acquisitionSpec?: {
        pending: number;
        failed: number;
    };
};

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

function formatDateTime(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
}

export default function SystemJobsPageClient() {
    const [controls, setControls] = useState<JobControl[]>([]);
    const [stats, setStats] = useState<SystemJobStats | null>(null);
    const [logs, setLogs] = useState<JobLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [busyKey, setBusyKey] = useState<string | null>(null);

    async function loadControls() {
        const res = await fetch("/api/admin/jobs/system-job-controls", { cache: "no-store" });
        const data = await res.json();
        setControls(data.controls || []);
        setStats(data.stats || null);
    }

    async function loadLogs() {
        const res = await fetch("/api/admin/jobs/system-job-logs", { cache: "no-store" });
        const data = await res.json();
        setLogs(data.logs || []);
    }

    async function loadAll() {
        await Promise.all([loadControls(), loadLogs()]);
    }

    useEffect(() => {
        loadAll();
    }, []);

    async function toggleProcessor(control: JobControl) {
        const nextEnabled = !control.enabled;
        setBusyKey(control.key);

        try {
            const res = await fetch(`/api/admin/jobs/system-job-controls/${control.key}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled: nextEnabled,
                    pausedReason: nextEnabled ? null : "Tạm pause bởi admin",
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Không thể cập nhật processor.");

            await loadAll();
        } catch (error: any) {
            alert(error?.message || "Không thể cập nhật processor.");
        } finally {
            setBusyKey(null);
        }
    }

    async function updateBatchSize(control: JobControl, value: number) {
        if (!Number.isFinite(value) || value < 1) return;

        setBusyKey(control.key);
        try {
            const res = await fetch(`/api/admin/jobs/system-job-controls/${control.key}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    batchSize: Math.max(1, Math.min(10, Math.round(value))),
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Không thể cập nhật batch size.");

            await loadAll();
        } catch (error: any) {
            alert(error?.message || "Không thể cập nhật batch size.");
        } finally {
            setBusyKey(null);
        }
    }

    async function runAllJobsNow() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/jobs/system-jobs/run-now", {
                method: "POST",
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Không thể chạy jobs.");

            await loadAll();
        } catch (error: any) {
            alert(error?.message || "Không thể chạy jobs.");
        } finally {
            setLoading(false);
        }
    }

    async function runAcquisitionSpecNow(limit = 6, includeFailed = false) {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/jobs/system-jobs/run-acquisition-spec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit, includeFailed }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || "Không thể chạy acquisition spec.");
            }

            await loadAll();
        } catch (error: any) {
            alert(error?.message || "Không thể chạy acquisition spec.");
        } finally {
            setLoading(false);
        }
    }

    async function retryFailedSpec() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/acquisitions/spec-jobs/retry-failed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit: 2 }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Không thể retry failed spec.");

            await loadAll();
        } catch (error: any) {
            alert(error?.message || "Không thể retry failed spec.");
        } finally {
            setLoading(false);
        }
    }

    const acquisitionControl = controls.find((x) => x.key === "acquisition_spec");
    const pendingCount = stats?.acquisitionSpec?.pending ?? 0;
    const failedCount = stats?.acquisitionSpec?.failed ?? 0;

    const latestRun = useMemo(
        () => logs.find((x) => x.processorKey === "acquisition_spec") ?? null,
        [logs]
    );

    const totalProcessors = controls.length;
    const enabledProcessors = controls.filter((x) => x.enabled).length;
    const pausedProcessors = totalProcessors - enabledProcessors;

    return (
        <div className="w-full px-6 py-6 lg:px-8">
            <div className="mx-auto max-w-[1400px] space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            System Jobs
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Quản lý processor chạy nền, backlog và lịch sử vận hành.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={runAllJobsNow}
                            disabled={loading}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            Run All Jobs Now
                        </button>

                        <button
                            onClick={() => runAcquisitionSpecNow(acquisitionControl?.batchSize ?? 6, false)}
                            disabled={loading || !acquisitionControl?.enabled}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                            Run Acquisition Spec
                        </button>

                        <button
                            onClick={retryFailedSpec}
                            disabled={loading}
                            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
                        >
                            Retry Failed Spec
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <JobSummaryCard
                        label="Processors"
                        value={String(totalProcessors)}
                        sub={`Enabled ${enabledProcessors} · Paused ${pausedProcessors}`}
                    />
                    <JobSummaryCard
                        label="Spec Pending"
                        value={String(pendingCount)}
                        sub="Đang chờ cron hoặc trigger sau post"
                    />
                    <JobSummaryCard
                        label="Spec Failed"
                        value={String(failedCount)}
                        sub="Nên retry hoặc kiểm tra input AI"
                    />
                    <JobSummaryCard
                        label="Latest Run"
                        value={latestRun ? latestRun.status : "-"}
                        sub={latestRun ? formatDateTime(latestRun.startedAt) : "Chưa có log"}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Processors</h2>
                            <p className="text-sm text-slate-500">
                                Bật / tắt từng processor mà không cần dừng cron tổng.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {controls.map((control) => (
                                <JobProcessorCard
                                    key={control.key}
                                    control={control}
                                    busy={busyKey === control.key}
                                    pendingCount={control.key === "acquisition_spec" ? pendingCount : undefined}
                                    failedCount={control.key === "acquisition_spec" ? failedCount : undefined}
                                    onToggle={() => toggleProcessor(control)}
                                    onUpdateBatchSize={(value) => updateBatchSize(control, value)}
                                    onRunOnce={
                                        control.key === "acquisition_spec"
                                            ? () => runAcquisitionSpecNow(control.batchSize, false)
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Runs</h2>
                            <p className="text-sm text-slate-500">
                                Nhật ký các lần cron hoặc trigger thủ công.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {logs.map((log) => (
                                <JobRunLogCard key={log.id} log={log} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}