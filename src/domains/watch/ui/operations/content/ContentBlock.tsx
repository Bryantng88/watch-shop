"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileText, Sparkles } from "lucide-react";
import { buildPostText } from "@/domains/watch/application/generate-watch-content";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { updateValues } from "@/domains/watch/client/workbench/workbench-utils";
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

async function markContentCopied(productId: string) {
    const res = await fetch(`/api/admin/watches/${productId}/post-usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONTENT_COPIED" }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Khong the danh dau da copy content.");
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
    onOpenMediaWorkspace,
    openingMediaWorkspace = false,
}: {
    values: WatchWorkbenchValues;
    detail?: UsageDetail;
    onChange: (next: WatchWorkbenchValues) => void;
    onSave: () => void;
    onOpenMediaWorkspace: () => void;
    openingMediaWorkspace?: boolean;
}) {
    const notify = useNotify();
    const [copied, setCopied] = useState(false);
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

    const setContent = (patch: Partial<WatchWorkbenchValues["content"]>) =>
        onChange(updateValues(values, { content: patch }));

    async function handleCopyPost() {
        if (!canCopy || !values.productId || !fullPost.trim()) return;

        try {
            await navigator.clipboard.writeText(fullPost);
            setCopied(true);

            const next = await markContentCopied(values.productId);
            setUsage(next);

            notify.success({
                title: "Da copy content",
                message: next.isPosted
                    ? "Content va gallery da duoc ghi nhan cho luong Dang bai."
                    : "Content da duoc copy va emit event publish assets downloaded.",
            });
        } catch (error) {
            notify.error({
                title: "Khong the copy content",
                message: error instanceof Error ? error.message : "Co loi khi copy content.",
            });
        } finally {
            window.setTimeout(() => setCopied(false), 1400);
        }
    }

    return (
        <OperationShell
            id="content"
            number="3"
            title="Noi dung"
            icon={<FileText className="h-4 w-4" />}
            description="Mo ta, story va ban dang hoan chinh cho luong Dang bai."
            actions={
                <>
                    <button type="button" className={operationButtonClass({ variant: "softBlue", size: "sm" })}>
                        <Sparkles className="h-4 w-4" />
                        Sinh content tu AI
                    </button>
                    <button type="button" onClick={onSave} className={operationButtonClass({ variant: "primary", size: "sm" })}>
                        Luu thay doi
                    </button>
                </>
            }
        >
            <div className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="grid gap-3">
                    <Field label="Title override">
                        <input className={inputClass} value={values.content.titleOverride} onChange={(event) => setContent({ titleOverride: event.target.value })} />
                    </Field>
                    <Field label="Mo ta (VI)">
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
                            <div className="text-sm font-semibold text-slate-950">Ban dang de Publish</div>
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
                            <span>{usage.isContentDownloaded ? "Da copy content" : "Chua copy content"}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{usage.isImageDownloaded ? "Da tai anh" : "Chua tai anh"}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopyPost}
                        disabled={!canCopy || !fullPost.trim()}
                        title={canCopy ? "Copy noi dung dang bai" : "Content can duoc duyet truoc khi copy"}
                        className={operationButtonClass({
                            variant: canCopy ? "softViolet" : "secondary",
                            size: "sm",
                            className: "disabled:opacity-60",
                        })}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Da copy" : usage.isContentDownloaded ? "Copy lai" : "Copy content"}
                    </button>
                </div>
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
                            Chua co noi dung de dang bai.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 md:flex-row md:items-center md:justify-between">
                <span>Copy content o day se emit event publish downloaded cho Workspace Dang bai; sua draft van luu bang Watch Workbench.</span>
                <button
                    type="button"
                    onClick={onOpenMediaWorkspace}
                    disabled={openingMediaWorkspace}
                    className={operationButtonClass({ variant: "softEmerald", size: "xs" })}
                >
                    {openingMediaWorkspace ? "Dang mo..." : "Mo Media WP"}
                </button>
            </div>
        </OperationShell>
    );
}
