"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TechnicalAssessmentModal from "./TechnicalAssessmentModal";
import { useNotify } from "@/components/feedback/AppToastProvider";
import { useAppDialog } from "@/components/feedback/AppDialogProvider";

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
    const dialog = useAppDialog();

    const [openTechnical, setOpenTechnical] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const sr = detail.serviceRequest;
    const technical = detail.technicalSummary ?? {
        assessmentCount: 0,
        issueCount: 0,
        openIssueCount: 0,
        activeAssessment: null,
    };

    const readyToClose =
        technical.activeAssessment &&
        Number(technical.issueCount ?? 0) > 0 &&
        Number(technical.openIssueCount ?? 0) === 0;

    const imageSrc = sr.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    async function handleOpenAssessment() {
        try {
            setSubmitting(true);

            const res = await fetch(`/api/admin/service-requests/${sr.id}/open-assessment`, {
                method: "POST",
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                notify.error({
                    title: "Không thể mở phiếu kỹ thuật",
                    message: json?.error || "Đã có lỗi xảy ra khi mở phiếu kỹ thuật.",
                });
                return;
            }

            notify.success({
                title: "Đã sẵn sàng phiếu kỹ thuật",
                message: "Bạn có thể tiếp tục thao tác đánh giá kỹ thuật cho service request này.",
            });

            setOpenTechnical(true);
            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Không thể mở phiếu kỹ thuật",
                message: error?.message || "Đã có lỗi xảy ra.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCloseServiceRequest() {
        const confirmed = await dialog.confirm({
            title: "Đóng service request",
            message:
                "Tất cả issue đã hoàn tất. Bạn có chắc muốn chốt service request này không?",
            confirmText: "Đóng SR",
            cancelText: "Quay lại",
            tone: "success",
        });

        if (!confirmed) return;

        try {
            setSubmitting(true);

            const res = await fetch(`/api/admin/service-requests/${sr.id}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                await dialog.alert({
                    title: "Chưa thể đóng service request",
                    message:
                        json?.error ||
                        "Service request vẫn còn điều kiện chưa đạt để chốt.",
                    confirmText: "Đã hiểu",
                    tone: "warning",
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
                    <div className="grid gap-3 md:grid-cols-5">
                        <MiniCard label="Tổng phiếu" value={technical.assessmentCount ?? 0} />
                        <MiniCard label="Tổng issue" value={technical.issueCount ?? 0} tone="amber" />
                        <MiniCard label="Issue đang mở" value={technical.openIssueCount ?? 0} tone="sky" />
                        <MiniCard
                            label="Phiếu active"
                            value={technical.activeAssessment?.status || "Chưa có"}
                            tone="emerald"
                        />
                        <MiniCard
                            label="SR sẵn sàng đóng"
                            value={readyToClose ? "Có" : "Chưa"}
                            tone="teal"
                        />
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        {technical.activeAssessment ? (
                            <div className="space-y-4">
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
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                                            onClick={() => setOpenTechnical(true)}
                                            disabled={submitting}
                                        >
                                            Tiếp tục phiếu kỹ thuật
                                        </button>
                                    </div>
                                </div>

                                {readyToClose ? (
                                    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
                                        <div className="text-sm font-semibold text-teal-900">
                                            Service Request sẵn sàng đóng
                                        </div>
                                        <div className="mt-1 text-sm text-teal-800">
                                            Tất cả issue trong phiếu hiện tại đã hoàn tất. Bạn có thể chốt SR, hoặc mở một phiếu kỹ thuật mới nếu phát sinh vòng xử lý tiếp theo.
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
                                                className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm text-teal-800 hover:bg-teal-100 disabled:opacity-60"
                                                onClick={handleOpenAssessment}
                                                disabled={submitting}
                                            >
                                                Mở phiếu kỹ thuật mới
                                            </button>
                                        </div>
                                    </div>
                                ) : null}

                                {Array.isArray(technical.assessments) && technical.assessments.length > 0 ? (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="text-sm font-semibold text-slate-900">Lịch sử phiếu kỹ thuật</div>
                                        <div className="mt-3 space-y-3">
                                            {technical.assessments.map((a: any, idx: number) => (
                                                <div
                                                    key={a.id}
                                                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
                                                >
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            Phiếu #{technical.assessments.length - idx}
                                                        </div>
                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {a.status} • {a.issueCount} issue • {a.openIssueCount} issue mở
                                                        </div>
                                                    </div>

                                                    <div className="text-xs text-slate-500">
                                                        Cập nhật: {fmtDT(a.updatedAt)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : Number(technical.assessmentCount ?? 0) > 0 ? (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div className="space-y-2">
                                        <div className="text-base font-semibold text-slate-900">
                                            Không còn phiếu kỹ thuật active
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Service request này đã có phiếu kỹ thuật trước đó, nhưng hiện tất cả phiếu đang ở trạng thái đã hoàn tất.
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Bạn có thể mở một phiếu kỹ thuật mới nếu phát sinh vòng xử lý tiếp theo.
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
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                                            onClick={handleOpenAssessment}
                                            disabled={submitting}
                                        >
                                            Tạo phiếu kỹ thuật mới
                                        </button>
                                    </div>
                                </div>

                                {Array.isArray(technical.assessments) && technical.assessments.length > 0 ? (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="text-sm font-semibold text-slate-900">Lịch sử phiếu kỹ thuật</div>
                                        <div className="mt-3 space-y-3">
                                            {technical.assessments.map((a: any, idx: number) => (
                                                <div
                                                    key={a.id}
                                                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
                                                >
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            Phiếu #{technical.assessments.length - idx}
                                                        </div>
                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {a.status} • {a.issueCount} issue • {a.openIssueCount} issue mở
                                                        </div>
                                                    </div>

                                                    <div className="text-xs text-slate-500">
                                                        Cập nhật: {fmtDT(a.updatedAt)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
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
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                                        onClick={handleOpenAssessment}
                                        disabled={submitting}
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
                    notify.success({
                        title: "Đã lưu phiếu kỹ thuật",
                        message: "Dữ liệu đánh giá kỹ thuật đã được cập nhật.",
                    });
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