"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    Send,
    XCircle,
} from "lucide-react";

type Props = {
    productId: string;
    status?: string | null;
    reviewNote?: string | null;
    canReviewContent?: boolean;
};

function normalizeStatus(status?: string | null) {
    return String(status ?? "DRAFT").toUpperCase();
}

function getStatusMeta(status?: string | null) {
    const s = normalizeStatus(status);

    if (s === "SUBMITTED") {
        return {
            label: "Chờ duyệt",
            className: "bg-amber-50 text-amber-700 ring-amber-200",
            icon: <Clock3 className="h-4 w-4" />,
        };
    }

    if (s === "APPROVED") {
        return {
            label: "Đã duyệt",
            className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
            icon: <CheckCircle2 className="h-4 w-4" />,
        };
    }

    if (s === "REJECTED") {
        return {
            label: "Trả về",
            className: "bg-rose-50 text-rose-700 ring-rose-200",
            icon: <XCircle className="h-4 w-4" />,
        };
    }

    return {
        label: "Draft",
        className: "bg-slate-50 text-slate-600 ring-slate-200",
        icon: <FileText className="h-4 w-4" />,
    };
}

export default function WatchContentHeaderActions({
    productId,
    status,
    reviewNote,
    canReviewContent = false,
}: Props) {
    const router = useRouter();
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const currentStatus = normalizeStatus(status);
    const meta = getStatusMeta(currentStatus);

    const isAdmin = canReviewContent;
    const isUser = !canReviewContent;

    async function submitReview() {
        try {
            setPendingAction("submit");

            const res = await fetch(
                `/api/admin/watches/${productId}/content-submit`,
                { method: "POST" }
            );

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể gửi duyệt.");
            }

            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Không thể gửi duyệt.");
        } finally {
            setPendingAction(null);
        }
    }

    async function review(action: "approve" | "reject", note?: string | null) {
        try {
            setPendingAction(action);

            const res = await fetch(
                `/api/admin/watches/${productId}/content-review`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action, note: note ?? null }),
                }
            );

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể duyệt content.");
            }

            router.refresh();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể duyệt content."
            );
        } finally {
            setPendingAction(null);
        }
    }

    async function handleReject() {
        const note = window.prompt("Lý do trả về để sale chỉnh lại:");
        if (!note?.trim()) return;
        await review("reject", note.trim());
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span
                title={reviewNote ? `Note: ${reviewNote}` : undefined}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ring-1 ${meta.className}`}
            >
                {meta.icon}
                {meta.label}
            </span>

            {isUser && ["DRAFT", "REJECTED"].includes(currentStatus) ? (
                <button
                    type="button"
                    onClick={submitReview}
                    disabled={Boolean(pendingAction)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                    {pendingAction === "submit" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    Gửi duyệt
                </button>
            ) : null}

            {isAdmin && currentStatus === "SUBMITTED" ? (
                <>
                    <button
                        type="button"
                        onClick={() => review("approve")}
                        disabled={Boolean(pendingAction)}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {pendingAction === "approve" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        Duyệt
                    </button>

                    <button
                        type="button"
                        onClick={handleReject}
                        disabled={Boolean(pendingAction)}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    >
                        <XCircle className="h-4 w-4" />
                        Trả về
                    </button>
                </>
            ) : null}
        </div>
    );
}