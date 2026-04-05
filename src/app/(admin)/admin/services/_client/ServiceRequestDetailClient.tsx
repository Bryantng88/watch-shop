"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function AssessmentStatusBadge({ status }: { status?: string | null }) {
    const s = String(status || "DRAFT").toUpperCase();
    const cls =
        s === "COMPLETED"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : s === "IN_PROGRESS"
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-slate-50 text-slate-700";

    return (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>
            {s}
        </span>
    );
}

export default function ServiceRequestDetailClient({ detail }: { detail: any }) {
    const router = useRouter();
    const sr = detail.serviceRequest;
    const assessment = detail.assessment ?? null;
    const issueCount = detail.stats?.issueCount ?? 0;
    const openIssueCount = detail.stats?.openIssueCount ?? 0;

    const imageSrc = sr.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    async function handleOpenAssessment() {
        const res = await fetch(`/api/admin/service-requests/${sr.id}/open-assessment`, {
            method: "POST",
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            alert(json?.error || "Không thể mở phiếu kỹ thuật");
            return;
        }

        const id = json?.data?.id;
        if (!id) {
            router.refresh();
            return;
        }

        router.push(`/admin/technical-assessments/${id}`);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">Service Request Detail</h1>
                    <p className="mt-1 text-sm text-slate-500">{sr.refNo || sr.id}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                        onClick={() => router.push("/admin/services")}
                    >
                        ← Quay lại
                    </button>

                    <button
                        type="button"
                        className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                        onClick={handleOpenAssessment}
                    >
                        {assessment ? "Tiếp tục phiếu kỹ thuật" : "Tạo phiếu kỹ thuật"}
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
                            <div className="text-lg font-semibold text-slate-900">
                                {sr.productTitle || "-"}
                            </div>
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
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">Phiếu kỹ thuật</h2>
                        <div className="mt-1 text-sm text-slate-500">
                            Tại trang này chỉ hiển thị tóm tắt. Thao tác chi tiết nằm trong detail của phiếu kỹ thuật.
                        </div>
                    </div>

                    {assessment ? <AssessmentStatusBadge status={assessment.status} /> : null}
                </div>

                <div className="p-5">
                    {!assessment ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-6">
                            <div className="text-sm font-medium text-slate-900">
                                Chưa có phiếu kỹ thuật nào cho service request này.
                            </div>
                            <div className="mt-2 text-sm text-slate-500">
                                Bấm “Tạo phiếu kỹ thuật” để bắt đầu đánh giá và xử lý nghiệp vụ.
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 p-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 text-sm text-slate-700">
                                    <div>
                                        Movement: <span className="font-medium">{assessment.movementStatus || "-"}</span>
                                    </div>
                                    <div>
                                        Case: <span className="font-medium">{assessment.caseStatus || "-"}</span>
                                    </div>
                                    <div>
                                        Crystal: <span className="font-medium">{assessment.crystalStatus || "-"}</span>
                                    </div>
                                    <div>
                                        Crown: <span className="font-medium">{assessment.crownStatus || "-"}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-700">
                                    <div>
                                        Nghiệp vụ: <span className="font-medium">{issueCount}</span>
                                    </div>
                                    <div>
                                        Đang mở: <span className="font-medium">{openIssueCount}</span>
                                    </div>
                                    <div>
                                        Người đánh giá: <span className="font-medium">{assessment.evaluatedByNameSnap || "-"}</span>
                                    </div>
                                    <div>
                                        Cập nhật: <span className="font-medium">{fmtDT(assessment.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                {assessment.conclusion?.trim()
                                    ? assessment.conclusion
                                    : "Chưa có kết luận kỹ thuật."}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Link
                                    href={`/admin/technical-assessments/${assessment.id}`}
                                    className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                                >
                                    Xem detail phiếu kỹ thuật
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}