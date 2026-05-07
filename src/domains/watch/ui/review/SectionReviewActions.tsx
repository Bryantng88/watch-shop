"use client";

import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    Send,
    XCircle,
} from "lucide-react";
import { useState } from "react";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type ReviewTarget = "content" | "image";
type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type Props = {
    productId: string;
    target: ReviewTarget;
    status?: string | null;
    reviewNote?: string | null;
    canReviewContent?: boolean;
    onStatusChange?: (next: {
        status: ReviewStatus;
        reviewNote?: string | null;
    }) => void;
};

function normalizeStatus(status?: string | null): ReviewStatus {
    const value = String(status ?? "DRAFT").toUpperCase();

    if (
        value === "SUBMITTED" ||
        value === "APPROVED" ||
        value === "REJECTED"
    ) {
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
}: Props) {
    const router = useRouter();
    const dialog = useAppDialog();
    const notify = useNotify();

    const [pending, setPending] = useState<string | null>(null);

    const currentStatus = normalizeStatus(status);
    const StatusIcon = statusIcon(currentStatus);

    const isAdmin = canReviewContent;
    const isUser = !canReviewContent;

    const canSubmit =
        isUser && ["DRAFT", "REJECTED"].includes(currentStatus);

    const canApprove =
        isAdmin && ["DRAFT", "SUBMITTED", "REJECTED"].includes(currentStatus);

    const canReject = isAdmin && currentStatus === "SUBMITTED";

    async function callSubmitApi() {
        const res = await fetch(
            `/api/admin/watches/${productId}/${target}-submit`,
            { method: "POST" }
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(json?.error || "Không thể gửi duyệt.");
        }

        return json;
    }

    async function callReviewApi(
        action: "approve" | "reject",
        note?: string | null
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
            }
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
            setPending(null);
        }
    }

    async function handleApprove() {
        const label = targetLabel(target);

        const ok = await dialog.confirm({
            title: `Duyệt ${label}?`,
            message:
                currentStatus === "DRAFT"
                    ? `Hạng mục ${label} đang ở Draft. Admin vẫn có thể duyệt manual sau khi tự chỉnh sửa.`
                    : `Hạng mục ${label} sẽ được đánh dấu là đã duyệt.`,
            confirmText: "Duyệt",
            cancelText: "Hủy",
            tone: "success",
        });

        if (!ok) return;

        try {
            setPending("approve");

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

            const rejectNote = "Cần chỉnh lại trước khi duyệt.";
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
            setPending(null);
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <span
                title={reviewNote ? `Note: ${reviewNote}` : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                    currentStatus
                )}`}
            >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusLabel(currentStatus)}
            </span>

            {canSubmit ? (
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={Boolean(pending)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60"                >
                    {pending === "submit" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Send className="h-3.5 w-3.5" />
                    )}
                    Gửi duyệt
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
                    Duyệt
                </button>
            ) : null}

            {canReject ? (
                <button
                    type="button"
                    onClick={handleReject}
                    disabled={Boolean(pending)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                    <XCircle className="h-3.5 w-3.5" />
                    Trả về
                </button>
            ) : null}
        </div>
    );
}