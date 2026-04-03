"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TechnicalAssessmentModal from "./TechnicalAssessmentModal";
import TechnicalIssuesPanel from "./TechnicalIssuesPanel";

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function fmtMoney(n?: number | null) {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + "đ";
}

export default function ServiceRequestDetailClient({ detail }: { detail: any }) {
    const router = useRouter();
    const [openTechnical, setOpenTechnical] = React.useState(false);

    const sr = detail.serviceRequest;
    const assessment = detail.technicalAssessment;
    const issues = detail.technicalIssues ?? [];
    const logs = detail.maintenanceLogs ?? [];

    const imageSrc = sr.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">
                        Service Request Detail
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {sr.refNo || sr.id}
                    </p>
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
                        onClick={() => setOpenTechnical(true)}
                    >
                        {assessment ? "Mở lại phiếu kỹ thuật" : "Đánh giá kỹ thuật"}
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
                    <h2 className="text-base font-semibold text-slate-900">Kết luận kỹ thuật</h2>
                </div>
                <div className="p-5">
                    {assessment?.conclusion ? (
                        <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {assessment.conclusion}
                        </pre>
                    ) : (
                        <div className="text-sm text-slate-500">Chưa có kết luận kỹ thuật.</div>
                    )}
                </div>
            </section>

            <TechnicalIssuesPanel
                serviceRequestId={sr.id}
                items={issues}
            />

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">Lịch sử xử lý / Maintenance</h2>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                        {logs.length} dòng
                    </div>
                </div>

                <div className="p-5">
                    {logs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                            Chưa có log bảo trì nào.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log: any, idx: number) => (
                                <div key={log.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold text-slate-900">
                                                #{idx + 1} · {log.ServiceCatalog?.name || log.eventType || "NOTE"}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {fmtDT(log.servicedAt || log.createdAt)}
                                            </div>
                                            <div className="text-sm text-slate-700 whitespace-pre-wrap">
                                                {log.notes || "-"}
                                            </div>
                                            {log.workSummary ? (
                                                <div className="text-sm text-slate-600">
                                                    Xử lý: {log.workSummary}
                                                </div>
                                            ) : null}
                                            {log.vendorName ? (
                                                <div className="text-sm text-slate-600">
                                                    Vendor: {log.vendorName}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="text-sm font-medium text-slate-900">
                                            {fmtMoney(log.totalCost)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <TechnicalAssessmentModal
                key={openTechnical ? sr.id : "technical-detail-modal"}
                open={openTechnical}
                serviceRequestId={sr.id}
                onClose={() => setOpenTechnical(false)}
                onSaved={async () => {
                    setOpenTechnical(false);
                    router.refresh();
                }}
                productName={sr.productTitle ?? undefined}
                productSku={sr.skuSnapshot ?? undefined}
                productImage={sr.primaryImageUrl ?? undefined}
                movementSpecLabel={sr.movement ?? undefined}
            />
        </div>
    );
}
