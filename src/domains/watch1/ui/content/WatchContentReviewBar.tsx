"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    Send,
    Undo2,
    XCircle,
} from "lucide-react";

type ContentStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "ARCHIVED"
    | "PROCESSING"
    | string
    | null
    | undefined;

type Props = {
    productId: string;
    status?: ContentStatus;
    reviewNote?: string | null;
    canReview?: boolean;
    canSubmit?: boolean;
};

function statusMeta(status?: ContentStatus) {
    const s = String(status ?? "DRAFT").toUpperCase();

    if (s === "SUBMITTED") {
        return {
            label: "Chờ admin duyệt",
            icon: <Clock3 className="h-4 w-4" />,
            className: "bg-amber-50 text-amber-700 ring-amber-200",
        };
    }

    if (s === "APPROVED") {
        return {
            label: "Đã duyệt",
            icon: <CheckCircle2 className="h-4 w-4" />,
            className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        };
    }

    if (s === "REJECTED") {
        return {
            label: "Trả về sửa",
            icon: <XCircle className="h-4 w-4" />,
            className: "bg-rose-50 text-rose-700 ring-rose-200",
        };
    }

    if (s === "PUBLISHED") {
        return {
            label: "Đã đăng bài",
            icon: <CheckCircle2 className="h-4 w-4" />,
            className: "bg-blue-50 text-blue-700 ring-blue-200",
        };
    }

    return {
        label: "Draft",
        icon: <FileText className="h-4 w-4" />,
        className: "bg-slate-50 text-slate-600 ring-slate-200",
    };
}

export default function WatchContentReviewBar({
    productId,
    status,
    reviewNote,
    canReview = false,
    canSubmit = true,
}: Props) {
    const router = useRouter();
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [note, setNote] = useState("");

    const currentStatus = String(status ?? "DRAFT").toUpperCase();
    const meta = statusMeta(currentStatus);

    async function submitAction(
        action: "submit" | "approve" | "reject" | "draft"
    ) {
        try {
            setPendingAction(action);

            const res = await fetch(
                `/api/admin/watches/${productId}/content-status`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action,
                        note: action === "reject" ? note : null,
                    }),
                }
            );

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    json?.error || "Không cập nhật được trạng thái content."
                );
            }

            setRejectOpen(false);
            setNote("");
            router.refresh();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Không cập nhật được trạng thái content."
            );
        } finally {
            setPendingAction(null);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Content review
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${meta.className}`}
                        >
                            {meta.icon}
                            {meta.label}
                        </span>

                        {reviewNote ? (
                            <span className="text-sm font-medium text-rose-600">
                                Note: {reviewNote}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {canSubmit &&
                        (currentStatus === "DRAFT" ||
                            currentStatus === "REJECTED") ? (
                        <button
                            type="button"
                            onClick={() => submitAction("submit")}
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

                    {canReview && currentStatus === "SUBMITTED" ? (
                        <>
                            <button
                                type="button"
                                onClick={() => submitAction("approve")}
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
                                onClick={() => setRejectOpen((v) => !v)}
                                disabled={Boolean(pendingAction)}
                                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                            >
                                <XCircle className="h-4 w-4" />
                                Trả về
                            </button>
                        </>
                    ) : null}

                    {canReview &&
                        ["SUBMITTED", "APPROVED", "PUBLISHED"].includes(
                            currentStatus
                        ) ? (
                        <button
                            type="button"
                            onClick={() => submitAction("draft")}
                            disabled={Boolean(pendingAction)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            <Undo2 className="h-4 w-4" />
                            Về draft
                        </button>
                    ) : null}
                </div>
            </div>

            {rejectOpen ? (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-3">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="Ghi lý do trả về để sale chỉnh lại..."
                        className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-rose-100"
                    />

                    <div className="mt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => submitAction("reject")}
                            disabled={Boolean(pendingAction) || !note.trim()}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                        >
                            {pendingAction === "reject" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            Xác nhận trả về
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}