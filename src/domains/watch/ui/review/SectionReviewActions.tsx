"use client";

import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    Send,
    Undo2,
    XCircle,
} from "lucide-react";
import { useState } from "react";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import ReviewStatusBadge from "./ReviewStatusBadge";
import RelatedTaskCompleteModal from "@/domains/task/ui/related/RelatedTaskCompleteModal";
import { findOpenRelatedTasksAction } from "@/domains/task/actions/task.actions";
import type { RelatedTaskSuggestion } from "@/domains/task/server/task.types";
type ReviewTarget = "content" | "image";
type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type Props = {
    productId: string;
    target: ReviewTarget;
    status?: string | null;
    reviewNote?: string | null;
    canReviewContent?: boolean;
    onBeforeSubmit?: () => Promise<boolean>;
    isFormDirty?: boolean;
    onStatusChange?: (next: {
        status: ReviewStatus;
        reviewNote?: string | null;
    }) => void;

    watchId?: string | null;
};

function normalizeStatus(status?: string | null): ReviewStatus {
    const value = String(status ?? "DRAFT").toUpperCase();

    if (value === "SUBMITTED" || value === "APPROVED" || value === "REJECTED") {
        return value;
    }

    return "DRAFT";
}

function statusIcon(status?: string | null) {
    const current = normalizeStatus(status);

    if (current === "SUBMITTED") return Clock3;
    if (current === "APPROVED") return CheckCircle2;
    if (current === "REJECTED") return XCircle;
    return FileText;
}

function targetLabel(target: ReviewTarget) {
    return target === "content" ? "nội dung" : "hình ảnh";
}

export default function SectionReviewActions({
    productId,
    target,
    status,
    reviewNote,
    canReviewContent = false,
    onStatusChange,
    onBeforeSubmit,
    isFormDirty = false,
    watchId,
}: Props) {
    const router = useRouter();
    const dialog = useAppDialog();
    const progress = useAppProgress();
    const notify = useNotify();
    const [relatedTaskOpen, setRelatedTaskOpen] = useState(false);
    const [relatedTaskItems, setRelatedTaskItems] = useState<RelatedTaskSuggestion[]>([]);
    const [approveAfterTaskModal, setApproveAfterTaskModal] = useState(false);
    const [pending, setPending] = useState<string | null>(null);

    const currentStatus = normalizeStatus(status);
    const StatusIcon = statusIcon(currentStatus);

    const isAdmin = Boolean(canReviewContent);

    const canSubmit = !isAdmin && ["DRAFT", "REJECTED"].includes(currentStatus);

    const canApprove =
        isAdmin && ["DRAFT", "REJECTED", "SUBMITTED"].includes(currentStatus);

    const canReject = isAdmin && currentStatus === "SUBMITTED";

    const canResetDraft = isAdmin && currentStatus === "APPROVED";

    async function callSubmitApi() {
        const res = await fetch(
            `/api/admin/watches/${productId}/${target}-submit`,
            { method: "POST" },
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(json?.error || "Không thể gửi duyệt.");
        }

        return json;
    }

    async function callReviewApi(
        action: "approve" | "reject" | "reset",
        note?: string | null,
    ) {
        const res = await fetch(
            `/api/admin/watches/${productId}/${target}-review`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    note: note ?? null,
                }),
            },
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(json?.error || "Không thể cập nhật duyệt.");
        }

        return json;
    }
    function taskTypeCodeForTarget(target: ReviewTarget) {
        return target === "image" ? "WATCH_IMAGE" : "WATCH_CONTENT";
    }
    async function getOpenReviewTasks() {
        if (!watchId) return [];

        const result = await findOpenRelatedTasksAction({
            watchId,
            taskTypeCode: taskTypeCodeForTarget(target),
            limit: 10,
        });

        console.log("TASK RESULT", result);

        return Array.isArray(result?.items) ? result.items : [];
    }

    async function approveNow() {
        await callReviewApi("approve");

        onStatusChange?.({
            status: "APPROVED",
            reviewNote: null,
        });

        notify.success({
            title: "Đã duyệt",
            message:
                target === "content"
                    ? "Đã duyệt nội dung."
                    : "Đã duyệt hình ảnh.",
        });

        router.refresh();
    }
    async function ensureSavedBeforeReview() {
        if (!isFormDirty) return true;

        if (!onBeforeSubmit) {
            await dialog.alert({
                title: "Watch có thay đổi chưa lưu",
                message:
                    "Bạn cần lưu watch trước khi duyệt để đảm bảo ảnh/content đã được gán và xử lý đúng.",
                tone: "warning",
            });

            return false;
        }

        const saved = await onBeforeSubmit();

        if (!saved) {
            await dialog.alert({
                title: "Không thể duyệt",
                message:
                    "Watch chưa được lưu thành công nên hệ thống đã dừng thao tác duyệt.",
                tone: "danger",
            });

            return false;
        }

        return true;
    }

    async function handleSubmit() {
        const label = targetLabel(target);

        const ok = await dialog.confirm({
            title: `Gửi duyệt ${label}?`,
            message: `Hạng mục ${label} sẽ được chuyển sang trạng thái chờ admin duyệt.`,
            confirmText: "Gửi duyệt",
            cancelText: "Hủy",
            tone: "warning",
        });

        if (!ok) return;

        try {
            setPending("submit");
            progress.show({
                title: `Đang gửi duyệt ${label}`,
                message: "Hệ thống đang lưu dữ liệu và chuyển trạng thái review.",
            });

            if (onBeforeSubmit) {
                const saved = await onBeforeSubmit();
                if (!saved) return;
            }

            await callSubmitApi();

            onStatusChange?.({
                status: "SUBMITTED",
                reviewNote: null,
            });

            notify.success({
                title: "Đã gửi duyệt",
                message:
                    target === "content"
                        ? "Đã gửi duyệt nội dung."
                        : "Đã gửi duyệt hình ảnh.",
            });

            router.refresh();
        } catch (error) {
            await dialog.alert({
                title: "Không thể gửi duyệt",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể gửi duyệt.",
                tone: "danger",
            });
        } finally {
            progress.hide();
            setPending(null);
        }
    }
    async function handleApprove() {
        console.log("watchId", watchId);

        const label = targetLabel(target);

        const ok = await dialog.confirm({
            title: isFormDirty ? `Lưu & duyệt ${label}?` : `Duyệt ${label}?`,
            message: isFormDirty
                ? `Watch đang có thay đổi chưa lưu. Hệ thống sẽ lưu watch trước để đảm bảo dữ liệu mới nhất đã được gán, sau đó mới duyệt ${label}.`
                : `Hạng mục ${label} sẽ được đánh dấu là đã duyệt.`,
            confirmText: isFormDirty ? "Lưu & duyệt" : "Duyệt",
            cancelText: "Hủy",
            tone: "success",
        });

        if (!ok) return;

        try {
            setPending("approve");
            progress.show({
                title: isFormDirty
                    ? `Đang lưu & duyệt ${label}`
                    : `Đang duyệt ${label}`,
                message: isFormDirty
                    ? "Hệ thống đang lưu watch trước khi cập nhật trạng thái duyệt."
                    : "Hệ thống đang cập nhật trạng thái duyệt.",
            });

            const saved = await ensureSavedBeforeReview();
            if (!saved) return;
            const openTasks = await getOpenReviewTasks();
            if (openTasks.length > 0 && !approveAfterTaskModal) {
                setRelatedTaskItems(openTasks);
                setApproveAfterTaskModal(true);
                setRelatedTaskOpen(true);
                return;
            }


            await approveNow();

            onStatusChange?.({
                status: "APPROVED",
                reviewNote: null,
            });

            notify.success({
                title: "Đã duyệt",
                message:
                    target === "content"
                        ? "Đã duyệt nội dung."
                        : "Đã duyệt hình ảnh.",
            });

            router.refresh();
        } catch (error) {
            await dialog.alert({
                title: "Không thể duyệt",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể cập nhật duyệt.",
                tone: "danger",
            });
        } finally {
            progress.hide();
            setPending(null);
        }
    }

    async function handleReject() {
        const label = targetLabel(target);

        const ok = await dialog.confirm({
            title: `Trả về ${label}?`,
            message: `Hạng mục ${label} sẽ được chuyển sang trạng thái cần chỉnh.`,
            confirmText: "Trả về",
            cancelText: "Hủy",
            tone: "danger",
        });

        if (!ok) return;

        try {
            setPending("reject");
            progress.show({
                title: `Đang trả về ${label}`,
                message: "Hệ thống đang cập nhật trạng thái review.",
            });

            const rejectNote = reviewNote || "Cần chỉnh lại trước khi duyệt.";

            await callReviewApi("reject", rejectNote);

            onStatusChange?.({
                status: "REJECTED",
                reviewNote: rejectNote,
            });

            notify.warning({
                title: "Đã trả về",
                message:
                    target === "content"
                        ? "Đã trả về nội dung."
                        : "Đã trả về hình ảnh.",
            });

            router.refresh();
        } catch (error) {
            await dialog.alert({
                title: "Không thể trả về",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể cập nhật duyệt.",
                tone: "danger",
            });
        } finally {
            progress.hide();
            setPending(null);
        }
    }

    async function handleResetDraft() {
        const label = targetLabel(target);

        const ok = await dialog.confirm({
            title: `Mở chỉnh sửa ${label}?`,
            message: `Hạng mục ${label} đã được duyệt. Khi mở chỉnh sửa, trạng thái sẽ chuyển về Draft và phải duyệt lại sau khi cập nhật.`,
            confirmText: "Mở chỉnh sửa",
            cancelText: "Hủy",
            tone: "warning",
        });

        if (!ok) return;

        try {
            setPending("reset");
            progress.show({
                title: `Đang mở chỉnh sửa ${label}`,
                message: "Hệ thống đang đưa hạng mục về Draft.",
            });

            await callReviewApi("reset");

            onStatusChange?.({
                status: "DRAFT",
                reviewNote: null,
            });

            notify.success({
                title: "Đã mở chỉnh sửa",
                message:
                    target === "content"
                        ? "Nội dung đã chuyển về Draft."
                        : "Hình ảnh đã chuyển về Draft.",
            });

            router.refresh();
        } catch (error) {
            await dialog.alert({
                title: "Không thể mở chỉnh sửa",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể chuyển về Draft.",
                tone: "danger",
            });
        } finally {
            progress.hide();
            setPending(null);
        }
    }

    const hasPrimaryActions = canSubmit || canResetDraft || canReject || canApprove;

    return (
        <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wide">
                    Trạng thái
                </span>

                <ReviewStatusBadge status={currentStatus} />

                {reviewNote ? (
                    <span
                        title={reviewNote}
                        className="max-w-[160px] truncate text-xs text-slate-400"
                    >
                        {reviewNote}
                    </span>
                ) : null}
            </div>

            {hasPrimaryActions ? (
                <div className="h-5 w-px bg-slate-200" aria-hidden="true" />
            ) : null}

            {hasPrimaryActions ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {canSubmit ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={Boolean(pending)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60"
                        >
                            {pending === "submit" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Send className="h-3.5 w-3.5" />
                            )}
                            Gửi duyệt
                        </button>
                    ) : null}

                    {canResetDraft ? (
                        <button
                            type="button"
                            onClick={handleResetDraft}
                            disabled={Boolean(pending)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            {pending === "reset" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Undo2 className="h-3.5 w-3.5" />
                            )}
                            Mở chỉnh sửa
                        </button>
                    ) : null}

                    {canReject ? (
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={Boolean(pending)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                        >
                            {pending === "reject" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <XCircle className="h-3.5 w-3.5" />
                            )}
                            Trả về
                        </button>
                    ) : null}

                    {canApprove ? (
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={Boolean(pending)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {pending === "approve" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            {isFormDirty ? "Lưu & duyệt" : "Duyệt"}
                        </button>
                    ) : null}
                    <RelatedTaskCompleteModal
                        open={relatedTaskOpen}
                        items={relatedTaskItems}
                        title={target === "image" ? "Có task hình ảnh đang mở" : "Có task content đang mở"}
                        message="Chọn task đã xử lý xong để hoàn thành, sau đó hệ thống sẽ tiếp tục duyệt."
                        onClose={() => setRelatedTaskOpen(false)}
                        onCompleted={async () => {
                            setRelatedTaskOpen(false);
                            setPending("approve");

                            try {
                                progress.show({
                                    title: `Đang duyệt ${targetLabel(target)}`,
                                    message: "Hệ thống đang cập nhật trạng thái duyệt.",
                                });

                                await approveNow();
                            } finally {
                                progress.hide();
                                setPending(null);
                            }
                        }}
                    />
                </div>
            ) : null}

        </div>

    );

}