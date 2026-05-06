"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Send, Undo2, XCircle } from "lucide-react";
import { useState } from "react";

import ReviewStatusBadge from "./ReviewStatusBadge";

type ReviewTarget = "CONTENT" | "IMAGE";

type Props = {
    productId: string;
    targetType: ReviewTarget;
    title: string;
    status?: string | null;
    reviewNote?: string | null;
    canReview?: boolean;
    canSubmit?: boolean;
    compact?: boolean;
    onSubmitted?: (status: string) => void;
    onReviewed?: (status: string, note?: string | null) => void;
};

function normalizeStatus(status?: string | null) {
    return String(status ?? "DRAFT").toUpperCase();
}

function endpointTarget(targetType: ReviewTarget) {
    return targetType === "CONTENT" ? "content" : "image";
}

function targetLabel(targetType: ReviewTarget) {
    return targetType === "CONTENT" ? "nội dung" : "hình ảnh";
}

export default function ReviewInlineBar({
    productId,
    targetType,
    title,
    status,
    reviewNote,
    canReview = false,
    canSubmit = false,
    compact = false,
    onSubmitted,
    onReviewed,
}: Props) {
    const router = useRouter();
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const currentStatus = normalizeStatus(status);
    const target = endpointTarget(targetType);

    const showSubmit = canSubmit && ["DRAFT", "REJECTED"].includes(currentStatus);
    const showReview = canReview && currentStatus === "SUBMITTED";
    const showReset = canReview && currentStatus === "APPROVED";

    async function submitReview() {
        try {
            setPendingAction("submit");

            const res = await fetch(`/api/admin/watches/${productId}/${target}-submit`, {
                method: "POST",
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || `Không thể gửi duyệt ${targetLabel(targetType)}.`);

            onSubmitted?.("SUBMITTED");
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : `Không thể gửi duyệt ${targetLabel(targetType)}.`);
        } finally {
            setPendingAction(null);
        }
    }

    async function review(action: "approve" | "reject", note?: string | null) {
        try {
            setPendingAction(action);

            const res = await fetch(`/api/admin/watches/${productId}/${target}-review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, note: note ?? null }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || `Không thể duyệt ${targetLabel(targetType)}.`);

            onReviewed?.(action === "approve" ? "APPROVED" : "REJECTED", note ?? null);
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : `Không thể duyệt ${targetLabel(targetType)}.`);
        } finally {
            setPendingAction(null);
        }
    }

    async function handleReject() {
        const note = window.prompt(`Lý do trả về ${targetLabel(targetType)}:`);
        if (!note?.trim()) return;
        await review("reject", note.trim());
    }

    return (
        <div
            className={[
                "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3",
                compact ? "" : "shadow-sm",
            ].join(" ")}
        >
            <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {title}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                    <ReviewStatusBadge status={currentStatus} />
                    {reviewNote ? (
                        <span className="max-w-[520px] truncate text-xs text-rose-600">
                            {reviewNote}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {showSubmit ? (
                    <button
                        type="button"
                        onClick={submitReview}
                        disabled={Boolean(pendingAction)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                        {pendingAction === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Gửi duyệt
                    </button>
                ) : null}

                {showReview ? (
                    <>
                        <button
                            type="button"
                            onClick={() => review("approve")}
                            disabled={Boolean(pendingAction)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {pendingAction === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Duyệt
                        </button>

                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={Boolean(pendingAction)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                        >
                            <XCircle className="h-4 w-4" />
                            Trả về
                        </button>
                    </>
                ) : null}

                {showReset ? (
                    <button
                        type="button"
                        onClick={async () => {
                            // Optional: wire later if you need admin to force reset approved item.
                            alert("Nếu cần tính năng Về draft, nên làm API riêng để tránh reset nhầm workflow đã duyệt.");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <Undo2 className="h-4 w-4" />
                        Về draft
                    </button>
                ) : null}
            </div>
        </div>
    );
}
