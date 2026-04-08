"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";
import TechnicalAssessmentInlinePanel from "./TechnicalAssessmentInlinePanel";
import {
    CompletedSummaryCard,
    HeaderActionButton,
    OverviewGrid,
    ReadonlyAlert,
    SectionCard,
    ServiceRequestHeroCompact,
} from "./ServiceRequestDetailUi";

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function normalizeText(value?: string | null) {
    return String(value || "").trim();
}

function buildCompletedSummaryPoints({
    assessment,
    technicalIssues,
    movementStatus,
}: {
    assessment: any;
    technicalIssues: any[];
    movementStatus?: string | null;
}) {
    const points: string[] = [];

    const movementIssues = technicalIssues.filter(
        (x: any) =>
            String(x.area || "").toUpperCase() === "MOVEMENT" &&
            String(x.executionStatus || "").toUpperCase() !== "CANCELED"
    );

    const otherIssues = technicalIssues.filter(
        (x: any) =>
            String(x.area || "").toUpperCase() !== "MOVEMENT" &&
            String(x.executionStatus || "").toUpperCase() !== "CANCELED"
    );

    if (String(movementStatus || "").toUpperCase() === "GOOD" && movementIssues.length === 0) {
        points.push("Bộ máy được đánh giá hoạt động tốt, không phát sinh hạng mục xử lý.");
    } else if (movementIssues.length > 0) {
        const labels = movementIssues
            .map((x: any) => normalizeText(x.summary) || normalizeText(x.note))
            .filter(Boolean)
            .slice(0, 2);

        if (labels.length > 0) {
            points.push(`Bộ máy đã được xử lý: ${labels.join(", ")}.`);
        } else {
            points.push("Bộ máy đã được ghi nhận issue và xử lý theo phiếu kỹ thuật.");
        }
    }

    const groupedByArea = new Map<string, string[]>();
    for (const issue of otherIssues) {
        const area = String(issue.area || "").toUpperCase();
        const label = normalizeText(issue.summary) || normalizeText(issue.note);
        if (!groupedByArea.has(area)) groupedByArea.set(area, []);
        if (label) groupedByArea.get(area)!.push(label);
    }

    const areaMap: Record<string, string> = {
        CASE: "Vỏ",
        CRYSTAL: "Kính",
        DIAL: "Mặt số",
        CROWN: "Núm",
    };

    for (const [area, labels] of groupedByArea.entries()) {
        const title = areaMap[area] || area;
        if (labels.length > 0) {
            points.push(`${title} đã được đánh giá/xử lý: ${labels.slice(0, 2).join(", ")}.`);
        }
    }

    const conclusion = normalizeText(assessment?.conclusion);
    if (!conclusion && points.length === 0) {
        points.push("Phiếu kỹ thuật đã hoàn tất và đang ở chế độ chỉ xem.");
    }

    return points;
}

export default function ServiceRequestDetailClient({ detail }: { detail: any }) {
    const router = useRouter();
    const notify = useNotify();
    const [submitting, setSubmitting] = React.useState(false);
    const [showCompletedDetails, setShowCompletedDetails] = React.useState(false);
    const detailRef = React.useRef<HTMLDivElement | null>(null);

    const sr = detail.serviceRequest;
    const technical = detail.technicalSummary ?? {
        issueCount: 0,
        openIssueCount: 0,
        activeAssessment: null,
    };

    const technicalIssues = detail.technicalIssues ?? [];
    const assessment = detail.technicalAssessment ?? detail.assessment ?? null;

    const doneIssueCount = Math.max(
        0,
        Number(technical.issueCount ?? 0) - Number(technical.openIssueCount ?? 0)
    );

    const vendorCount = technicalIssues.filter(
        (x: any) =>
            String(x.actionMode || "").toUpperCase() === "VENDOR" &&
            String(x.executionStatus || "").toUpperCase() !== "CANCELED"
    ).length;

    const readyToClose =
        technical.activeAssessment &&
        Number(technical.issueCount ?? 0) > 0 &&
        Number(technical.openIssueCount ?? 0) === 0;

    const imageSrc = sr.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    const appearanceScore = Number(detail?.appearanceSummary?.score ?? 100);
    const totalCost = Number(detail?.financialSummary?.totalCost ?? 0);
    const isCompleted = String(sr?.status || "").toUpperCase() === "COMPLETED";

    const completedSummaryPoints = React.useMemo(
        () =>
            buildCompletedSummaryPoints({
                assessment,
                technicalIssues,
                movementStatus: assessment?.movementStatus,
            }),
        [assessment, technicalIssues]
    );

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

    function openCompletedDetails() {
        setShowCompletedDetails(true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                detailRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        });
    }

    function closeCompletedDetails() {
        setShowCompletedDetails(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Service Request Detail
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">{sr.refNo || sr.id}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => router.push("/admin/services")}
                    >
                        ← Quay lại
                    </button>

                    {!isCompleted ? (
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => router.push(`/admin/services/issues-board?serviceRequestId=${sr.id}`)}
                        >
                            Đi tới Issue Board
                        </button>
                    ) : null}
                </div>
            </div>

            <ServiceRequestHeroCompact
                imageSrc={imageSrc}
                title={sr.productTitle || "-"}
                sku={sr.skuSnapshot || "-"}
                refValue={sr.ref || "-"}
                movement={sr.movement || "-"}
                model={sr.model || "-"}
                status={sr.status}
                scope={sr.scope || "-"}
                technician={sr.technicianNameSnap || "-"}
                updatedAt={fmtDT(sr.updatedAt)}
                appearanceScore={appearanceScore}
                totalCost={totalCost}
                onEditSpec={
                    sr.productId
                        ? () => router.push(`/admin/products/${sr.productId}/edit`)
                        : undefined
                }
                onOpenIssueBoard={
                    !isCompleted
                        ? () => router.push(`/admin/services/issues-board?serviceRequestId=${sr.id}`)
                        : undefined
                }
                hideIssueBoardAction={isCompleted}
            />

            <SectionCard
                title="Tổng quan service"
                subtitle="Các chỉ số vận hành chính của phiếu service."
            >
                <OverviewGrid
                    totalIssue={Number(technical.issueCount ?? 0)}
                    openIssue={Number(technical.openIssueCount ?? 0)}
                    doneIssue={doneIssueCount}
                    vendorCount={vendorCount}
                />

                {!isCompleted && readyToClose ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="text-sm font-semibold text-emerald-900">
                            Service Request sẵn sàng đóng
                        </div>
                        <div className="mt-1 text-sm text-emerald-800">
                            Tất cả issue đã hoàn tất. Bạn có thể chốt service request ngay tại đây.
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                                onClick={handleCloseServiceRequest}
                                disabled={submitting}
                            >
                                Đóng service request
                            </button>
                        </div>
                    </div>
                ) : null}
            </SectionCard>

            {isCompleted ? (
                <>
                    <ReadonlyAlert
                        message="Phiếu kỹ thuật đã hoàn tất. Giao diện mặc định chỉ hiển thị bản kết luận để dễ xem nhanh."
                        action={
                            !showCompletedDetails ? (
                                <HeaderActionButton
                                    onClick={openCompletedDetails}
                                    icon={<ChevronDown className="h-4 w-4" />}
                                >
                                    Mở phiếu chi tiết
                                </HeaderActionButton>
                            ) : undefined
                        }
                    />

                    <CompletedSummaryCard
                        conclusion={assessment?.conclusion}
                        points={completedSummaryPoints}
                        totalCost={totalCost}
                        score={appearanceScore}
                    />

                    {showCompletedDetails ? (
                        <div ref={detailRef}>
                            <SectionCard
                                title="Phiếu kỹ thuật chi tiết"
                                subtitle="Bản đầy đủ của phiếu đánh giá kỹ thuật, ở chế độ chỉ xem."
                                actions={
                                    <HeaderActionButton
                                        onClick={closeCompletedDetails}
                                        icon={<ChevronUp className="h-4 w-4" />}
                                    >
                                        Ẩn phiếu chi tiết
                                    </HeaderActionButton>
                                }
                            >
                                <TechnicalAssessmentInlinePanel
                                    serviceRequestId={sr.id}
                                    panel={detail}
                                    readOnly
                                    onSaved={async () => {
                                        router.refresh();
                                    }}
                                />
                            </SectionCard>
                        </div>
                    ) : null}
                </>
            ) : (
                <TechnicalAssessmentInlinePanel
                    serviceRequestId={sr.id}
                    panel={detail}
                    readOnly={false}
                    onSaved={async () => {
                        router.refresh();
                    }}
                />
            )}
        </div>
    );
}