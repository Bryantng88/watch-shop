"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TechnicalAssessmentModal from "./TechnicalAssessmentModal";

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
    tone?: "slate" | "amber" | "sky" | "emerald";
}) {
    const tones: Record<string, string> = {
        slate: "border-slate-200 bg-slate-50 text-slate-900",
        amber: "border-amber-200 bg-amber-50 text-amber-900",
        sky: "border-sky-200 bg-sky-50 text-sky-900",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
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
    const [openTechnical, setOpenTechnical] = React.useState(false);

    const sr = detail.serviceRequest;
    const technical = detail.technicalSummary ?? {
        assessmentCount: 0,
        issueCount: 0,
        openIssueCount: 0,
        activeAssessment: null,
    };

    const imageSrc = sr.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">
                        Service Request Detail
                    </h1>
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
                        onClick={() => router.push("/admin/services/issues-board")}
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
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="text-base font-semibold text-slate-900">
                        Phiếu đánh giá kỹ thuật
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                        Trang này chỉ tập trung vào vòng đời phiếu kỹ thuật. Việc điều phối issue được quản lý ở Issue Board.
                    </div>
                </div>

                <div className="p-5">
                    <div className="grid gap-3 md:grid-cols-4">
                        <MiniCard
                            label="Tổng phiếu"
                            value={technical.assessmentCount ?? 0}
                        />
                        <MiniCard
                            label="Tổng issue"
                            value={technical.issueCount ?? 0}
                            tone="amber"
                        />
                        <MiniCard
                            label="Issue đang mở"
                            value={technical.openIssueCount ?? 0}
                            tone="sky"
                        />
                        <MiniCard
                            label="Phiếu active"
                            value={technical.activeAssessment?.status || "Chưa có"}
                            tone="emerald"
                        />
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        {technical.activeAssessment ? (
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">
                                    <div className="text-base font-semibold text-slate-900">
                                        Phiếu hiện tại: {technical.activeAssessment.status}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {technical.activeAssessment.issueCount} issue • cập nhật{" "}
                                        {fmtDT(technical.activeAssessment.updatedAt)}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Nếu nghiệp vụ đặc biệt phát sinh sau khi phiếu đã hoàn tất, hệ thống có thể mở một phiếu mới để tiếp tục vòng xử lý.
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                                        onClick={() => router.push("/admin/services/issues-board")}
                                    >
                                        Điều phối tại Issue Board
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                                        onClick={() => setOpenTechnical(true)}
                                    >
                                        Tiếp tục phiếu kỹ thuật
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">
                                    <div className="text-base font-semibold text-slate-900">
                                        Chưa có phiếu kỹ thuật nào
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Tạo phiếu để kỹ thuật đánh giá. Nếu sau này phát sinh nghiệp vụ đặc biệt, có thể mở phiếu mới tiếp theo.
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                                        onClick={() => router.push("/admin/services/issues-board")}
                                    >
                                        Đi tới Issue Board
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                                        onClick={async () => {
                                            const res = await fetch(
                                                `/api/admin/service-requests/${sr.id}/open-assessment`,
                                                { method: "POST" }
                                            );
                                            const json = await res.json().catch(() => ({}));
                                            if (!res.ok) {
                                                alert(json?.error || "Không thể mở phiếu kỹ thuật");
                                                return;
                                            }
                                            setOpenTechnical(true);
                                            router.refresh();
                                        }}
                                    >
                                        Tạo phiếu kỹ thuật
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <TechnicalAssessmentModal
                open={openTechnical}
                serviceRequestId={sr.id}
                onClose={() => setOpenTechnical(false)}
                onSaved={async () => {
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