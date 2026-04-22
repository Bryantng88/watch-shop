"use client";

import { useEffect, useMemo, useState } from "react";
import JobSummaryCard from "@/domains/system/ui/jobs/JobSummaryCard";
import JobProcessorCard from "@/domains/system/ui/jobs/JobProcessorCard";
import JobRunLogCard from "@/domains/system/ui/jobs/JobRunLogCard";
import { useNotify } from "@/components/feedback/AppToastProvider";
import { useAppDialog } from "@/components/feedback/AppDialogProvider";
import { useAppProgress } from "@/components/feedback/AppProgressProvider";

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

function getRunMessage(processed: number, failed: number) {
    if (failed > 0 && processed > 0) {
        return `Đã xử lý ${processed} job, có ${failed} job lỗi`;
    }
    if (failed > 0) {
        return `Có ${failed} job lỗi`;
    }
    return `Đã xử lý ${processed} job`;
}

export default function SystemJobsPageClient() {
    const notify = useNotify();
    const dialog = useAppDialog();
    const progress = useAppProgress();

    const [controls, setControls] = useState<JobControl[]>([]);
    const [stats, setStats] = useState<SystemJobStats | null>(null);
    const [logs, setLogs] = useState<JobLog[]>([]);
    const [busyKey, setBusyKey] = useState<string | null>(null);

    async function loadControls() {
        const res = await fetch("/api/admin/jobs/system-job-controls", {
            cache: "no-store",
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(data?.error || "Không tải được job controls");
        }

        setControls(data?.controls || []);
        setStats(data?.stats || null);
    }

    async function loadLogs() {
        const res = await fetch("/api/admin/jobs/system-job-logs", {
            cache: "no-store",
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(data?.error || "Không tải được job logs");
        }

        setLogs(data?.logs || []);
    }

    async function loadAll(silent = false) {
        if (!silent) {
            progress.show({
                title: "Đang tải system jobs",
                message: "Vui lòng chờ trong giây lát",
            });
        }

        try {
            await Promise.all([loadControls(), loadLogs()]);
        } catch (error: any) {
            notify.error({
                title: "Không tải được dữ liệu jobs",
                message: error?.message || "Đã có lỗi xảy ra",
            });
        } finally {
            if (!silent) progress.hide();
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    const acquisitionControl = useMemo(
        () => controls.find((x) => x.key === "acquisition_spec") ?? null,
        [controls]
    );

    async function toggleProcessor(control: JobControl) {
        setBusyKey(control.key);

        try {
            const res = await fetch(`/api/admin/jobs/system-job-controls/${control.key}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled: !control.enabled,
                    pausedReason: control.enabled ? "Tạm pause bởi admin" : null,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Không thể cập nhật processor");
            }

            notify.success({
                title: "Cập nhật thành công",
                message: control.enabled
                    ? "Đã tạm dừng processor"
                    : "Đã bật lại processor",
            });

            await loadAll(true);
        } catch (error: any) {
            notify.error({
                title: "Cập nhật thất bại",
                message: error?.message || "Không thể cập nhật processor",
            });
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

            if (!res.ok) {
                throw new Error(data?.error || "Không thể cập nhật batch size");
            }

            notify.success({
                title: "Cập nhật thành công",
                message: "Đã cập nhật batch size",
            });

            await loadAll(true);
        } catch (error: any) {
            notify.error({
                title: "Cập nhật thất bại",
                message: error?.message || "Không thể cập nhật batch size",
            });
        } finally {
            setBusyKey(null);
        }
    }

    async function runAllJobsNow() {
        progress.show({
            title: "Đang chạy tất cả jobs",
            message: "Hệ thống đang xử lý queue nền",
        });

        try {
            const res = await fetch("/api/admin/jobs/system-jobs/run-now", {
                method: "POST",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Run system jobs failed");
            }

            notify.success({
                title: "Đã chạy jobs",
                message: "Hệ thống đã xử lý xong đợt chạy hiện tại",
            });

            await loadAll(true);
        } catch (error: any) {
            notify.error({
                title: "Chạy jobs thất bại",
                message: error?.message || "Run system jobs failed",
            });
        } finally {
            progress.hide();
        }
    }

    async function runAcquisitionSpec(includeFailed = false) {
        progress.show({
            title: includeFailed
                ? "Đang retry failed spec"
                : "Đang chạy acquisition spec",
            message: "Hệ thống đang quét queue item watch để sinh spec",
        });

        try {
            const res = await fetch("/api/admin/jobs/system-jobs/run-acquisition-spec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    includeFailed,
                    limit: acquisitionControl?.batchSize || 3,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Run acquisition spec failed");
            }

            const processed = Number(data?.result?.processed ?? 0);
            const failed = Number(data?.result?.failed ?? 0);

            if (failed > 0) {
                notify.warning({
                    title: includeFailed
                        ? "Retry spec chưa hoàn tất"
                        : "Chạy spec chưa hoàn tất",
                    message: getRunMessage(processed, failed),
                });
            } else {
                notify.success({
                    title: includeFailed
                        ? "Retry spec thành công"
                        : "Chạy spec thành công",
                    message: getRunMessage(processed, failed),
                });
            }

            await loadAll(true);
        } catch (error: any) {
            notify.error({
                title: includeFailed
                    ? "Retry spec thất bại"
                    : "Chạy spec thất bại",
                message: error?.message || "Run acquisition spec failed",
            });
        } finally {
            progress.hide();
        }
    }

    async function confirmRunAcquisitionSpec(includeFailed = false) {
        const ok = await dialog.confirm({
            title: includeFailed ? "Retry failed spec" : "Run acquisition spec",
            message: includeFailed
                ? "Hệ thống sẽ thử chạy lại các spec job đang failed. Tiếp tục?"
                : "Hệ thống sẽ quét queue item watch để sinh spec. Tiếp tục?",
            confirmText: "Tiếp tục",
            cancelText: "Hủy",
            tone: "warning",
        });

        if (!ok) return;
        await runAcquisitionSpec(includeFailed);
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            System Jobs
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Quản lý processor chạy nền, backlog và lịch sử vận hành.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={runAllJobsNow}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                        >
                            Run All Jobs Now
                        </button>

                        <button
                            onClick={() => confirmRunAcquisitionSpec(false)}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                        >
                            Run Acquisition Spec
                        </button>

                        <button
                            onClick={() => confirmRunAcquisitionSpec(true)}
                            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700"
                        >
                            Retry Failed Spec
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <JobSummaryCard
                    label="Processors"
                    value={String(controls.length)}
                    sub={`Enabled ${controls.filter((x) => x.enabled).length} · Paused ${controls.filter((x) => !x.enabled).length}`}
                />
                <JobSummaryCard
                    label="Spec Pending"
                    value={String(stats?.acquisitionSpec?.pending ?? 0)}
                    sub="Đang chờ run hoặc trigger sau post"
                />
                <JobSummaryCard
                    label="Spec Failed"
                    value={String(stats?.acquisitionSpec?.failed ?? 0)}
                    sub="Nên retry hoặc kiểm tra input AI"
                />
                <JobSummaryCard
                    label="Latest Run"
                    value={logs[0]?.status ?? "-"}
                    sub={
                        logs[0]?.startedAt
                            ? new Date(logs[0].startedAt).toLocaleString()
                            : "Chưa có log"
                    }
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">Processors</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Bật / tắt từng processor và theo dõi queue hiện tại.
                        </p>
                    </div>

                    {acquisitionControl ? (
                        <JobProcessorCard
                            control={acquisitionControl}
                            busy={busyKey === acquisitionControl.key}
                            pendingCount={stats?.acquisitionSpec?.pending ?? 0}
                            failedCount={stats?.acquisitionSpec?.failed ?? 0}
                            onToggle={() => toggleProcessor(acquisitionControl)}
                            onUpdateBatchSize={(value) =>
                                updateBatchSize(acquisitionControl, value)
                            }
                            onRunOnce={() => confirmRunAcquisitionSpec(false)}
                            onRetryFailed={() => confirmRunAcquisitionSpec(true)}
                        />
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                            Chưa có processor nào.
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">Recent Runs</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Nhật ký các lần run hoặc trigger thủ công.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {logs.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                                Chưa có log nào.
                            </div>
                        ) : (
                            logs.map((log) => <JobRunLogCard key={log.id} log={log} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}