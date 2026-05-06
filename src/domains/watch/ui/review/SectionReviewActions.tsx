"use client";

import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    XCircle,
} from "lucide-react";
import { useState } from "react";

type ReviewTarget = "content" | "image";

type Props = {
    productId: string;
    target: ReviewTarget;
    status?: string | null;
    reviewNote?: string | null;
    canReviewContent?: boolean;
    onReviewed?: (status: string, note?: string | null) => void;
};

function normalizeStatus(status?: string | null) {
    return String(status ?? "DRAFT").toUpperCase();
}

function getStatusMeta(status?: string | null) {
    const current = normalizeStatus(status);

    if (current === "SUBMITTED") {
        return {
            label: "Chờ duyệt",
            Icon: Clock3,
            className: "border-amber-200 bg-amber-50 text-amber-700",
        };
    }

    if (current === "APPROVED") {
        return {
            label: "Đã duyệt",
            Icon: CheckCircle2,
            className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        };
    }

    if (current === "REJECTED") {
        return {
            label: "Trả về",
            Icon: XCircle,
            className: "border-rose-200 bg-rose-50 text-rose-700",
        };
    }

    return {
        label: "Draft",
        Icon: FileText,
        className: "border-slate-200 bg-slate-50 text-slate-600",
    };
}

export default function SectionReviewActions({
    productId,
    target,
    status,
    reviewNote,
    canReviewContent = false,
    onReviewed,
}: Props) {
    const router = useRouter();
    const [pending, setPending] = useState<"approve" | "reject" | null>(null);

    const currentStatus = normalizeStatus(status);
    const canReview = canReviewContent && currentStatus === "SUBMITTED";
    const meta = getStatusMeta(currentStatus);
    const Icon = meta.Icon;

    async function review(action: "approve" | "reject", note?: string | null) {
        try {
            setPending(action);

            const res = await fetch(
                `/api/admin/watches/${productId}/${target}-review`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action, note: note ?? null }),
                }
            );

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể cập nhật trạng thái duyệt.");
            }

            const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
            onReviewed?.(nextStatus, note ?? null);
            router.refresh();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật trạng thái duyệt."
            );
        } finally {
            setPending(null);
        }
    }

    async function handleReject() {
        const note = window.prompt("Lý do trả về để sale chỉnh lại:");
        if (!note?.trim()) return;
        await review("reject", note.trim());
    }

    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <span
                title={reviewNote ? `Note: ${reviewNote}` : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}
            >
                <Icon className="h-3.5 w-3.5" />
                {meta.label}
            </span>

            {canReview ? (
                <>
                    <button
                        type="button"
                        onClick={() => review("approve")}
                        disabled={Boolean(pending)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {pending === "approve" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Duyệt
                    </button>

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
                </>
            ) : null}
        </div>
    );
}
