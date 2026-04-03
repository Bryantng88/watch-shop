"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type TechnicalIssueItem = {
    id: string;
    area: string;
    issueType: string;
    actionMode: string;
    executionStatus: string;
    vendorNameSnap?: string | null;
    note?: string | null;
    estimatedCost?: number | null;
    completedAt?: string | null;
    completedByNameSnap?: string | null;
};

function badge(status: string) {
    switch (status) {
        case "DONE":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "IN_PROGRESS":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "OPEN":
        default:
            return "border-amber-200 bg-amber-50 text-amber-700";
    }
}

function fmtMoney(n?: number | null) {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + "đ";
}

export default function TechnicalIssuesPanel({
    serviceRequestId,
    items,
}: {
    serviceRequestId: string;
    items: TechnicalIssueItem[];
}) {
    const router = useRouter();
    const [loadingId, setLoadingId] = React.useState<string | null>(null);

    async function runAction(issueId: string, action: "start" | "complete") {
        try {
            setLoadingId(issueId + ":" + action);
            const res = await fetch(`/api/admin/technical-issues/${issueId}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Action failed");
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Nghiệp vụ kỹ thuật đang theo dõi
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Theo dõi tiến độ xử lý từng nghiệp vụ phát sinh từ phiếu kỹ thuật.
                    </p>
                </div>

                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {items.length} nghiệp vụ
                </div>
            </div>

            <div className="p-5">
                {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                        Không có nghiệp vụ kỹ thuật nào đang mở. Service request có thể hoàn tất ngay sau khi lưu phiếu kỹ thuật.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const isOpen = item.executionStatus === "OPEN";
                            const isInProgress = item.executionStatus === "IN_PROGRESS";
                            const isDone = item.executionStatus === "DONE";

                            return (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                                >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div className="min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-sm font-semibold text-slate-900">
                                                    #{index + 1} · {item.area || "ISSUE"}
                                                </div>
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badge(
                                                        item.executionStatus
                                                    )}`}
                                                >
                                                    {item.executionStatus}
                                                </span>
                                                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                                                    {item.actionMode}
                                                </span>
                                            </div>

                                            <div className="text-sm text-slate-700">
                                                {item.note || "-"}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span>Vendor: {item.vendorNameSnap || "-"}</span>
                                                <span>Chi phí dự kiến: {fmtMoney(item.estimatedCost)}</span>
                                                {item.completedAt ? (
                                                    <span>
                                                        Hoàn tất:{" "}
                                                        {new Date(item.completedAt).toLocaleString("vi-VN")}
                                                    </span>
                                                ) : null}
                                                {item.completedByNameSnap ? (
                                                    <span>Người hoàn tất: {item.completedByNameSnap}</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isOpen ? (
                                                <button
                                                    type="button"
                                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                                                    disabled={loadingId === item.id + ":start"}
                                                    onClick={() => runAction(item.id, "start")}
                                                >
                                                    {loadingId === item.id + ":start"
                                                        ? "Đang bắt đầu..."
                                                        : "Bắt đầu"}
                                                </button>
                                            ) : null}

                                            {(isOpen || isInProgress) ? (
                                                <button
                                                    type="button"
                                                    className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                                                    disabled={loadingId === item.id + ":complete"}
                                                    onClick={() => runAction(item.id, "complete")}
                                                >
                                                    {loadingId === item.id + ":complete"
                                                        ? "Đang hoàn tất..."
                                                        : "Hoàn tất"}
                                                </button>
                                            ) : null}

                                            {isDone ? (
                                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                                    Đã hoàn tất
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
