"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useNotify } from "@/components/feedback/AppToastProvider";
import TechnicalAssessmentInlinePanel from "./TechnicalAssessmentInlinePanel";

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function MiniCard({
    label,
    value,
    tone = "slate",
}: {
    label: string;
    value: React.ReactNode;
    tone?: "slate" | "amber" | "sky" | "emerald" | "teal";
}) {
    const tones: Record<string, string> = {
        slate: "border-slate-200 bg-slate-50 text-slate-900",
        amber: "border-amber-200 bg-amber-50 text-amber-900",
        sky: "border-sky-200 bg-sky-50 text-sky-900",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
        teal: "border-teal-200 bg-teal-50 text-teal-900",
    };

    return (
        <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
            <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
            <div className="mt-1 text-lg font-semibold">{value}</div>
        </div>
    );
}

export default function ServiceRequestDetailClient({ detail }: { detail: any }) {
    const router = useRouter();
    const notify = useNotify();

    const [submitting, setSubmitting] = React.useState(false);

    const sr = detail.serviceRequest;
    const technical = detail.technicalSummary ?? {
        issueCount: 0,
        openIssueCount: 0,
        activeAssessment: null,
    };

    const technicalIssues = detail.technicalIssues ?? detail?.technicalPanel?.technicalIssues ?? [];
    const doneIssueCount = Math.max(
        0,
        Number(technical.issueCount ?? 0) - Number(technical.openIssueCount ?? 0)
    );

    const vendorCount = technicalIssues.filter(
        (x: any) => String(x.actionMode || "").toUpperCase() === "VENDOR"
    ).length;

    const readyToClose =
        technical.activeAssessment &&
        Number(technical.issueCount ?? 0) > 0 &&
        Number(technical.openIssueCount ?? 0) === 0;

    const imageSrc = sr.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    async function handleCloseServiceRequest() {
        try {
            setSubmitting(true);

            const res = await fetch(`/api/admin/service-requests/${sr.id}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                notify.error({
                    title: "Không thể đóng service request",
                    message: json?.error || "Service request vẫn chưa đủ điều kiện để chốt.",
                });
                return;
            }

            notify.success({
                title: "Đã đóng service request",
                message: "Service request đã được chốt thành công.",
            });

            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Đóng service request thất bại",
                message: error?.message || "Đã có lỗi xảy ra.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">Service Request Detail</h1>
                    <p className="mt-1 text-sm text-slate-500">{sr.refNo || sr.id}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                        onClick={() => router.push("/admin/services")}
                    >
                        ← Quay lại
                    </button>

                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                        onClick={() => router.push(`/admin/services/issues-board?serviceRequestId=${sr.id}`)}
                    >
                        Đi tới Issue Board
                    </button>
                </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-6 p-5 md:grid-cols-[120px_1fr]">
                    <div className="h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={sr.productTitle || "product"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                No image
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="text-lg font-semibold text-slate-900">{sr.productTitle || "-"}</div>
                            <div className="text-sm text-slate-500">SKU: {sr.skuSnapshot || "-"}</div>
                            <div className="text-sm text-slate-500">Bộ máy: {sr.movement || "-"}</div>
                            <div className="text-sm text-slate-500">Model: {sr.model || "-"}</div>
                            <div className="text-sm text-slate-500">Ref: {sr.ref || "-"}</div>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-700">
                            <div>Trạng thái: <span className="font-medium">{sr.status}</span></div>
                            <div>Scope: <span className="font-medium">{sr.scope || "-"}</span></div>
                            <div>Kỹ thuật viên: <span className="font-medium">{sr.technicianNameSnap || "-"}</span></div>
                            <div>Vendor: <span className="font-medium">{sr.vendorNameSnap || "-"}</span></div>
                            <div>Tạo lúc: <span className="font-medium">{fmtDT(sr.createdAt)}</span></div>
                            <div>Cập nhật: <span className="font-medium">{fmtDT(sr.updatedAt)}</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="text-base font-semibold text-slate-900">Tổng quan service</div>
                </div>

                <div className="p-5">
                    <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
                        <MiniCard label="Tổng issue" value={technical.issueCount ?? 0} tone="amber" />
                        <MiniCard label="Issue đang mở" value={technical.openIssueCount ?? 0} tone="sky" />
                        <MiniCard label="Issue đã xong" value={doneIssueCount} tone="emerald" />
                        <MiniCard label="Số lần thuê vendor" value={vendorCount} tone="teal" />
                    </div>

                    {readyToClose ? (
                        <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-4">
                            <div className="text-sm font-semibold text-teal-900">
                                Service Request sẵn sàng đóng
                            </div>
                            <div className="mt-1 text-sm text-teal-800">
                                Tất cả issue đã hoàn tất. Bạn có thể chốt service request ngay tại đây.
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm text-teal-800 hover:bg-teal-100 disabled:opacity-60"
                                    onClick={handleCloseServiceRequest}
                                    disabled={submitting}
                                >
                                    Đóng service request
                                </button>

                                <button
                                    type="button"
                                    className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm text-teal-800 hover:bg-teal-100"
                                    onClick={() => router.push(`/admin/services/issues-board?serviceRequestId=${sr.id}`)}
                                >
                                    Đi tới Issue Board
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            <TechnicalAssessmentInlinePanel
                serviceRequestId={sr.id}
                panel={detail}
                onSaved={async () => {
                    router.refresh();
                }}
            />
        </div>
    );
}