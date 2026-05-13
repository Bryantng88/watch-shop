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

};

function normalizeStatus(status?: string | null): ReviewStatus {
    const value = String(status ?? "DRAFT").toUpperCase();

    if (value === "SUBMITTED" || value === "APPROVED" || value === "REJECTED") {
        return value;
    }

    return "DRAFT";
}

function statusLabel(status?: string | null) {
    const current = normalizeStatus(status);

    if (current === "SUBMITTED") return "Chờ duyệt";
    if (current === "APPROVED") return "Đã duyệt";
    if (current === "REJECTED") return "Trả về";
    return "Draft";
}

function statusIcon(status?: string | null) {
    const current = normalizeStatus(status);

    if (current === "SUBMITTED") return Clock3;
    if (current === "APPROVED") return CheckCircle2;
    if (current === "REJECTED") return XCircle;
    return FileText;
}

function statusClass(status?: string | null) {
    const current = normalizeStatus(status);

    if (current === "SUBMITTED") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }

    if (current === "APPROVED") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (current === "REJECTED") {
        return "border-rose-200 bg-rose-50 text-rose-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
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
}: Props) {
    const router = useRouter();
    const dialog = useAppDialog();
    const progress = useAppProgress();
    const notify = useNotify();

    const [pending, setPending] = useState<string | null>(null);

    const currentStatus = normalizeStatus(status);
    const StatusIcon = statusIcon(currentStatus);

    const isAdmin = Boolean(canReviewContent);

    const canSubmit =
        !isAdmin &&
        ["DRAFT", "REJECTED"].includes(currentStatus);

    const canApprove =
        isAdmin &&
        ["DRAFT", "REJECTED", "SUBMITTED"].includes(
            currentStatus,
        );

    const canReject =
        isAdmin && currentStatus === "SUBMITTED";

    const canResetDraft =
        isAdmin && currentStatus === "APPROVED";

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
                message: "Hệ thống đang chuyển trạng thái review.",
            });

            if (onBeforeSubmit) {
                const saved = await onBeforeSubmit();

                if (!saved) {
                    return;
                }
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
                    error instanceof Error ? error.message : "Không thể gửi duyệt.",
                tone: "danger",
            });
        } finally {
            progress.hide();
            setPending(null);
        }
    }

    async function handleApprove() {
        if (isFormDirty) {
            await dialog.alert({
                title: "Watch có thay đổi chưa lưu",
                message: "Bạn cần lưu watch trước khi duyệt để tránh duyệt dữ liệu cũ.",
                tone: "warning",
            });
            return;
        }
        const label = targetLabel(target);

        const ok = await dialog.confirm({
            title: `Duyệt ${label}?`,
            message: `Hạng mục ${label} sẽ được đánh dấu là đã duyệt.`,
            confirmText: "Duyệt",
            cancelText: "Hủy",
            tone: "success",
        });

        if (!ok) return;

        try {
            setPending("approve");
            progress.show({
                title: `Đang duyệt ${label}`,
                message: "Hệ thống đang cập nhật trạng thái duyệt.",
            });

            await callReviewApi("approve");

            onStatusChange?.({
                status: "APPROVED",
                reviewNote: null,
            });

            notify.success({
                title: "Đã duyệt",
                message:
                    target === "content" ? "Đã duyệt nội dung." : "Đã duyệt hình ảnh.",
            });

            router.refresh();
        } catch (error) {
            await dialog.alert({
                title: "Không thể duyệt",
                message:
                    error instanceof Error ? error.message : "Không thể cập nhật duyệt.",
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
                    error instanceof Error ? error.message : "Không thể chuyển về Draft.",
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

            const rejectNote = "Cần chỉnh lại trước khi duyệt.";
            await callReviewApi("reject", rejectNote);

            onStatusChange?.({
                status: "REJECTED",
                reviewNote: rejectNote,
            });

            notify.warning({
                title: "Đã trả về",
                message:
                    target === "content" ? "Đã trả về nội dung." : "Đã trả về hình ảnh.",
            });

            router.refresh();
        } catch (error) {
            await dialog.alert({
                title: "Không thể trả về",
                message:
                    error instanceof Error ? error.message : "Không thể cập nhật duyệt.",
                tone: "danger",
            });
        } finally {
            progress.hide();
            setPending(null);
        }
    }

    const hasPrimaryActions = canSubmit || canResetDraft || canApprove || canReject;

    return (
        <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wide">
                    Trạng thái
                </span>

                <ReviewStatusBadge status={currentStatus} />
            </div>

            {hasPrimaryActions ? (
                <div className="h-6 w-px bg-slate-200" aria-hidden="true" />
            ) : null}

            {hasPrimaryActions ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {canSubmit ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={Boolean(pending)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60"
                            title="Chuyển hạng mục sang trạng thái chờ admin duyệt."
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
                            title="Đưa hạng mục đã duyệt về Draft để chỉnh sửa lại."
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
                            title="Trả hạng mục về để editor chỉnh sửa lại."
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
                            title="Duyệt hạng mục và khóa chỉnh sửa cho đến khi admin mở lại."
                        >
                            {pending === "approve" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Duyệt
                        </button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
