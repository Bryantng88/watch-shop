"use client";

import { useEffect, useState } from "react";
import { getAcquisitionSpecLogs } from "@/domains/system/client/jobs/system-job.actions";

type Props = {
    jobId?: string;
    itemId?: string;
};

type LogItem = {
    id: string;
    acquisitionSpecJobId: string;
    acquisitionItemId: string;
    acquisitionId?: string | null;
    productId?: string | null;
    stage: string;
    level: string;
    message: string;
    payload?: any;
    createdAt: string;
};

function levelTone(level?: string) {
    switch (String(level ?? "").toUpperCase()) {
        case "ERROR":
            return "border-rose-200 bg-rose-50 text-rose-700";
        case "WARN":
        case "WARNING":
            return "border-amber-200 bg-amber-50 text-amber-700";
        default:
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
}

export default function AcquisitionSpecLogViewer({ jobId, itemId }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [items, setItems] = useState<LogItem[]>([]);

    useEffect(() => {
        let mounted = true;

        async function load() {
            if (!jobId && !itemId) {
                setItems([]);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const rows = await getAcquisitionSpecLogs({
                    jobId,
                    itemId,
                    take: 200,
                });

                if (!mounted) return;
                setItems(rows);
            } catch (error: any) {
                if (!mounted) return;
                setError(error?.message || "Không thể tải logs");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        void load();

        return () => {
            mounted = false;
        };
    }, [jobId, itemId]);

    if (!jobId && !itemId) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3">
                <div className="text-sm font-semibold text-slate-900">
                    Acquisition Spec Logs
                </div>
                <div className="text-xs text-slate-500">
                    Theo dõi chi tiết từng bước prepare input, AI output, build title/SKU và persist spec.
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-slate-500">Đang tải logs...</div>
            ) : error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </div>
            ) : items.length === 0 ? (
                <div className="text-sm text-slate-500">Chưa có log.</div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-slate-200 bg-white p-3"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${levelTone(
                                            item.level
                                        )}`}
                                    >
                                        {item.level}
                                    </span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {item.stage}
                                    </span>
                                </div>

                                <div className="text-xs text-slate-500">
                                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                                </div>
                            </div>

                            <div className="mt-2 text-sm text-slate-700">
                                {item.message}
                            </div>

                            {item.payload ? (
                                <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-950 p-3 text-[11px] text-slate-100">
                                    {JSON.stringify(item.payload, null, 2)}
                                </pre>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}