"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileText, Loader2, Sparkles } from "lucide-react";
import { buildPostText } from "@/domains/watch/application/generate-watch-content";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
    Field,
    inputClass,
    OperationShell,
    operationButtonClass,
    textareaClass,
} from "../shared/OperationShell";

type UsageDetail = {
    review?: {
        isContentDownloaded?: boolean | null;
        isImageDownloaded?: boolean | null;
        isPosted?: boolean | null;
    } | null;
    watch?: {
        isContentDownloaded?: boolean | null;
        isImageDownloaded?: boolean | null;
        isPosted?: boolean | null;
    } | null;
};

const META_POST_CHARACTER_LIMIT = 2000;
const META_POST_WARNING_THRESHOLD = 1800;

async function markContentCopied(productId: string) {
    const res = await fetch(`/api/admin/watches/${productId}/post-usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONTENT_COPIED" }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Không thể đánh dấu đã copy content.");
    }

    return json as {
        isContentDownloaded: boolean;
        isImageDownloaded: boolean;
        isPosted: boolean;
    };
}

export default function ContentBlock({
    values,
    detail,
    onChange,
    onSave,
    saving = false,
    onOpenMediaWorkspace,
    openingMediaWorkspace = false,
}: {
    values: WatchWorkbenchValues;
    detail?: UsageDetail;
    onChange: (next: WatchWorkbenchValues) => void;
    onSave: () => void;
    saving?: boolean;
    onOpenMediaWorkspace: () => void;
    openingMediaWorkspace?: boolean;
}) {
    const progress = useAppProgress();
    const notify = useNotify();
    const [copied, setCopied] = useState(false);
    const [copying, setCopying] = useState(false);
    const [usage, setUsage] = useState({
        isContentDownloaded: Boolean(
            detail?.review?.isContentDownloaded ?? detail?.watch?.isContentDownloaded,
        ),
        isImageDownloaded: Boolean(
            detail?.review?.isImageDownloaded ?? detail?.watch?.isImageDownloaded,
        ),
        isPosted: Boolean(detail?.review?.isPosted ?? detail?.watch?.isPosted),
    });
    const bulletSpecs = useMemo(
        () => values.content.bulletSpecs ?? [],
        [values.content.bulletSpecs],
    );
    const contentStatus = String(values.contentReviewStatus ?? "DRAFT").toUpperCase();
    const canCopy = contentStatus === "APPROVED";

    const fullPost = useMemo(
        () =>
            buildPostText({
                title: values.content.titleOverride || values.basic.title || "Vintage Watch",
                body: values.content.body,
                bulletSpecs,
                hookText: values.content.hookText,
                hashTags: values.content.hashTags,
            }),
        [
            bulletSpecs,
            values.basic.title,
            values.content.body,
            values.content.hashTags,
            values.content.hookText,
            values.content.titleOverride,
        ],
    );
    const [postTitle, ...postRest] = fullPost.split("\n\n");
    const postCharacterCount = Array.from(fullPost).length;
    // Meta's composer can report a larger count for Vietnamese/emoji than a
    // Unicode code-point count. Use the UTF-8 payload size as a conservative
    // estimate while still showing the human-readable character count.
    const metaEstimatedCount = new TextEncoder().encode(
        fullPost.replace(/\n/g, "\r\n"),
    ).length;
    const charactersOverLimit = Math.max(
        0,
        metaEstimatedCount - META_POST_CHARACTER_LIMIT,
    );
    const isNearMetaLimit = metaEstimatedCount >= META_POST_WARNING_THRESHOLD;
    const isOverMetaLimit = charactersOverLimit > 0;

    const setContent = (patch: Partial<WatchWorkbenchValues["content"]>) =>
        onChange(updateValues(values, { content: patch }));

    async function handleCopyPost() {
        if (!canCopy || !values.productId || !fullPost.trim() || copying) return;

        setCopying(true);
        progress.show({
            title: "Đang copy content",
            message: "Hệ thống đang copy bài đăng và ghi nhận trạng thái publish assets.",
        });
        try {
            await navigator.clipboard.writeText(fullPost);
            setCopied(true);

            const next = await markContentCopied(values.productId);
            setUsage(next);

            notify.success({
                title: "Đã copy content",
                message: next.isPosted
                    ? "Content và gallery đã được ghi nhận cho luồng Đăng bài."
                    : "Content da duoc copy va emit event publish assets downloaded.",
            });
        } catch (error) {
            notify.error({
                title: "Không thể copy content",
                message: error instanceof Error ? error.message : "Co loi khi copy content.",
            });
        } finally {
            progress.hide();
            setCopying(false);
            window.setTimeout(() => setCopied(false), 1400);
        }
    }

    return (
        <OperationShell
            id="content"
            number="3"
            title="Noi dung"
            icon={<FileText className="h-4 w-4" />}
            description="Mô tả, story và bản đăng hoàn chỉnh cho luồng Đăng bài."
            actions={
                <>
                    <button type="button" disabled title="AI content generation chua duoc noi voi service." className={operationButtonClass({ variant: "softBlue", size: "sm", className: "disabled:opacity-60" })}>
                        <Sparkles className="h-4 w-4" />
                        Sinh content tu AI
                    </button>
                    <button type="button" onClick={onSave} disabled={saving} className={operationButtonClass({ variant: "primary", size: "sm", className: "disabled:opacity-70" })}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </>
            }
        >
            <div className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="grid gap-3">
                    <Field label="Title override">
                        <input className={inputClass} value={values.content.titleOverride} onChange={(event) => setContent({ titleOverride: event.target.value })} />
                    </Field>
                    <Field label="Mô tả (VI)">
                        <textarea className={textareaClass} value={values.content.hookText} onChange={(event) => setContent({ hookText: event.target.value })} />
                    </Field>
                    <Field label="Domain context">
                        <input className={inputClass} value={values.content.hashTags} onChange={(event) => setContent({ hashTags: event.target.value })} placeholder="retro, LED, dress, diver..." />
                    </Field>
                </div>

                <div className="grid gap-3">
                    <Field label="Summary">
                        <textarea className={textareaClass} value={values.content.body} onChange={(event) => setContent({ body: event.target.value })} />
                    </Field>
                    <Field label="Bullet points">
                        <textarea
                            className={textareaClass}
                            value={bulletSpecs.join("\n")}
                            onChange={(event) => setContent({ bulletSpecs: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })}
                        />
                    </Field>
                </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/40 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-violet-100/80 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-semibold text-slate-950">Bản đăng để Publish</div>
                            <span className={[
                                "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold",
                                canCopy
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 bg-white text-slate-500",
                            ].join(" ")}>
                                Content: {contentStatus}
                            </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span>{usage.isContentDownloaded ? "Đã copy content" : "Chưa copy content"}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{usage.isImageDownloaded ? "Đã tải ảnh" : "Chưa tải ảnh"}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span
                                className={[
                                    "rounded-full px-2 py-0.5 font-semibold",
                                    isOverMetaLimit
                                        ? "bg-rose-100 text-rose-700"
                                        : isNearMetaLimit
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-slate-100 text-slate-600",
                                ].join(" ")}
                            >
                                Meta ~{metaEstimatedCount.toLocaleString("vi-VN")}/{META_POST_CHARACTER_LIMIT.toLocaleString("vi-VN")}
                            </span>
                            <span title="Số ký tự Unicode thực của đúng nội dung được copy">
                                {postCharacterCount.toLocaleString("vi-VN")} ký tự thực
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopyPost}
                        disabled={!canCopy || !fullPost.trim() || copying}
                        title={
                            !canCopy
                                ? "Content cần được duyệt trước khi copy"
                                : isOverMetaLimit
                                    ? `Nội dung đang vượt giới hạn Meta-safe khoảng ${charactersOverLimit} đơn vị`
                                    : "Copy nội dung đăng bài"
                        }
                        className={operationButtonClass({
                            variant: canCopy ? "softViolet" : "secondary",
                            size: "sm",
                            className: "disabled:opacity-60",
                        })}
                    >
                        {copying ? <Loader2 className="h-4 w-4 animate-spin" /> : copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copying ? "Đang copy..." : copied ? "Đã copy" : usage.isContentDownloaded ? "Copy lại" : "Copy content"}
                    </button>
                </div>
                {isNearMetaLimit ? (
                    <div
                        className={[
                            "border-b px-4 py-2 text-xs font-medium",
                            isOverMetaLimit
                                ? "border-rose-200 bg-rose-50 text-rose-700"
                                : "border-amber-200 bg-amber-50 text-amber-700",
                        ].join(" ")}
                    >
                        {isOverMetaLimit
                            ? `Đang vượt giới hạn Meta-safe khoảng ${charactersOverLimit.toLocaleString("vi-VN")} đơn vị. Hãy rút gọn trước khi đăng.`
                            : `Còn khoảng ${(META_POST_CHARACTER_LIMIT - metaEstimatedCount).toLocaleString("vi-VN")} đơn vị theo bộ đếm Meta-safe.`}
                    </div>
                ) : null}
                <div
                    className={[
                        "max-h-[280px] overflow-auto px-4 py-4 text-sm leading-7 text-slate-800",
                        canCopy ? "select-text" : "select-none",
                    ].join(" ")}
                    onCopy={(event) => {
                        if (!canCopy) event.preventDefault();
                    }}
                    onCut={(event) => {
                        if (!canCopy) event.preventDefault();
                    }}
                    onContextMenu={(event) => {
                        if (!canCopy) event.preventDefault();
                    }}
                >
                    {fullPost.trim() ? (
                        <div className="space-y-4">
                            <div className="font-semibold uppercase tracking-wide text-slate-950">{postTitle}</div>
                            <div className="whitespace-pre-wrap">{postRest.join("\n\n")}</div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-white/80 px-3 py-6 text-center text-sm text-slate-500">
                            Chưa có nội dung để đăng bài.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 md:flex-row md:items-center md:justify-between">
                <span>Copy content ở đây sẽ phát event publish downloaded cho Workspace Đăng bài; sửa draft vẫn lưu bằng Watch Workbench.</span>
                <button
                    type="button"
                    onClick={onOpenMediaWorkspace}
                    disabled={openingMediaWorkspace}
                    className={operationButtonClass({ variant: "softEmerald", size: "xs" })}
                >
                    {openingMediaWorkspace ? "Đang mở..." : "Mở Media WP"}
                </button>
            </div>
        </OperationShell>
    );
}
