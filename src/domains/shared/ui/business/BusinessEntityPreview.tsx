"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
    ExternalLink,
    ImageIcon,
    Loader2,
    MessageSquare,
    Send,
    X,
    ZoomIn,
} from "lucide-react";
import type {
    BusinessEntityPreview,
    BusinessEntityType,
} from "@/domains/shared/business/business-entity.types";
import { getBusinessEntityPreviewAction } from "@/domains/shared/business/business-entity-preview.actions";
import { ActivityViewModelFeed } from "@/domains/task/ui/task-work/activity/ActivityFeed";
import { addTaskItemDiscussionAction } from "@/domains/task/actions/task.actions";

function BusinessEntityActivityPanel({
    preview,
    onActivityChanged,
}: {
    preview: BusinessEntityPreview;
    onActivityChanged?: () => void;
}) {
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const activity = preview.activity;
    if (!activity) return null;

    async function submitComment() {
        const text = body.trim();
        if (!text || submitting) return;
        setSubmitting(true);
        setCommentError(null);
        try {
            await addTaskItemDiscussionAction({
                taskItemId: activity.taskItemId,
                targetType: preview.type,
                targetId: preview.id,
                body: text,
            });
            setBody("");
            onActivityChanged?.();
        } catch (error) {
            setCommentError(error instanceof Error ? error.message : "Không thể gửi trao đổi.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4">
            <div>
                <div className="text-sm font-semibold text-slate-950">Activity & trao đổi</div>
                <div className="mt-0.5 text-xs text-slate-500">Lịch sử nghiệp vụ trong đúng ngữ cảnh đang xem.</div>
            </div>
            {activity.discussionEnabled ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="mt-2 h-4 w-4 shrink-0 text-slate-400" />
                        <textarea
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            rows={2}
                            disabled={submitting}
                            placeholder="Thêm trao đổi về nghiệp vụ này..."
                            className="min-h-[68px] flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="text-xs font-medium text-rose-600">{commentError}</div>
                        <button
                            type="button"
                            disabled={!body.trim() || submitting}
                            onClick={() => void submitComment()}
                            className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white disabled:bg-slate-300"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Gửi
                        </button>
                    </div>
                </div>
            ) : null}
            <div className="mt-4">
                <ActivityViewModelFeed
                    items={activity.items}
                    businessBindings={[]}
                    queueItems={[]}
                    mode="ALL"
                    discussionEnabled={activity.discussionEnabled}
                    onActivityChanged={onActivityChanged}
                />
            </div>
        </section>
    );
}

function typeLabel(type: BusinessEntityType) {
    if (type === "WATCH") return "Watch";
    if (type === "ORDER") return "Đơn hàng";
    if (type === "SHIPMENT") return "Vận đơn";
    if (type === "SERVICE") return "Service";
    if (type === "TECHNICAL_ISSUE") return "Technical Issue";
    if (type === "PAYMENT") return "Payment";
    if (type === "ACQUISITION") return "Phiếu nhập";
    return type;
}

function compactId(id: string) {
    if (!id) return "-";
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
}

export function BusinessEntityMiniCard({
    preview,
    onPreview,
}: {
    preview: BusinessEntityPreview;
    onPreview?: (preview: BusinessEntityPreview) => void;
}) {
    return (
        <div className="group/link rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 transition hover:border-slate-200 hover:bg-white">
            <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {typeLabel(preview.type)}
                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onPreview?.(preview);
                    }}
                    className="rounded-full p-1 text-slate-300 hover:bg-blue-50 hover:text-blue-600"
                    aria-label="Xem nhanh"
                >
                    <ExternalLink className="h-3 w-3" />
                </button>
            </div>

            <div className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-800">
                {preview.title}
            </div>

            {preview.subtitle ? (
                <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                    {preview.subtitle}
                </div>
            ) : null}
        </div>
    );
}

export function BusinessEntityPreviewModal({
    open,
    preview,
    loading,
    error,
    onClose,
    onActivityChanged,
}: {
    open: boolean;
    preview?: BusinessEntityPreview | null;
    loading?: boolean;
    error?: string | null;
    onClose: () => void;
    onActivityChanged?: () => void;
}) {
    const [imageOpen, setImageOpen] = useState(false);

    useEffect(() => {
        if (!open || !imageOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setImageOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [imageOpen, open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"
            onClick={onClose}
        >
            <div
                className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            Xem nhanh nghiệp vụ
                        </div>
                        <h2 className="mt-1 text-lg font-semibold text-slate-950">
                            {preview ? typeLabel(preview.type) : "Đang tải"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-4">
                    {loading ? (
                        <div className="flex h-40 items-center justify-center text-slate-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tải thông tin...
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : preview ? (
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    {preview.imageUrl ? (
                                        <button type="button" onClick={() => setImageOpen(true)} className="group/image relative h-full w-full cursor-zoom-in" aria-label="Phóng lớn ảnh">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={preview.imageUrl} alt={preview.title} className="h-full w-full object-cover transition group-hover/image:scale-105" />
                                            <span className="absolute inset-0 grid place-items-center bg-slate-950/0 text-white opacity-0 transition group-hover/image:bg-slate-950/30 group-hover/image:opacity-100"><ZoomIn className="h-5 w-5" /></span>
                                        </button>
                                    ) : (
                                        <ImageIcon className="h-5 w-5 text-slate-400" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                        {typeLabel(preview.type)}
                                    </div>

                                    <div className="mt-1 line-clamp-2 text-base font-semibold text-slate-950">
                                        {preview.title}
                                    </div>

                                    {preview.subtitle ? (
                                        <div className="mt-1 text-sm text-slate-500">
                                            {preview.subtitle}
                                        </div>
                                    ) : null}

                                    <div className="mt-1 font-mono text-[11px] text-slate-400">
                                        ID: {compactId(preview.id)}
                                    </div>

                                    {preview.status ? (
                                        <div className="mt-2 inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                            {preview.status}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {preview.facts?.length ? (
                                <div className="grid gap-2 rounded-3xl bg-slate-50 p-3">
                                    {preview.facts.map((fact) => (
                                        <div
                                            key={fact.label}
                                            className="flex items-center justify-between gap-3 text-sm"
                                        >
                                            <span className="text-slate-500">{fact.label}</span>
                                            <span className="text-right font-semibold text-slate-800">
                                                {fact.value ?? "-"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {preview.notes?.length ? (
                                <div className="space-y-2">
                                    {preview.notes.map((note) => (
                                        <section
                                            key={note.label}
                                            className={note.tone === "warning"
                                                ? "rounded-2xl border border-amber-200 bg-amber-50 p-3"
                                                : note.tone === "info"
                                                    ? "rounded-2xl border border-blue-100 bg-blue-50 p-3"
                                                    : "rounded-2xl border border-slate-200 bg-white p-3"}
                                        >
                                            <div className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{note.label}</div>
                                            <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-800">{note.body}</div>
                                        </section>
                                    ))}
                                </div>
                            ) : null}

                            {preview.sections?.length ? (
                                <div className="space-y-3">
                                    {preview.sections.map((section) => (
                                        <section
                                            key={section.title}
                                            className="rounded-3xl border border-slate-200 bg-white p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-950">
                                                        {section.title}
                                                    </div>
                                                    {section.subtitle ? (
                                                        <div className="mt-0.5 text-xs text-slate-500">
                                                            {section.subtitle}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                                    {section.items.length}
                                                </div>
                                            </div>

                                            <div className="mt-3 divide-y divide-slate-100">
                                                {section.items.map((item, index) => {
                                                    const content = (
                                                        <div className="flex items-start justify-between gap-3 py-2">
                                                            <div className="min-w-0">
                                                                <div className="line-clamp-1 text-sm font-semibold text-slate-800">
                                                                    {item.title}
                                                                </div>
                                                                {item.subtitle ? (
                                                                    <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                                                                        {item.subtitle}
                                                                    </div>
                                                                ) : null}
                                                                {item.facts?.length ? (
                                                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                                                        {item.facts.map((fact) => (
                                                                            <span key={fact.label}>
                                                                                {fact.label}:{" "}
                                                                                <span className="font-medium text-slate-700">
                                                                                    {fact.value ?? "-"}
                                                                                </span>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            {item.status ? (
                                                                <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                                                    {item.status}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    );

                                                    return item.href ? (
                                                        <Link
                                                            key={`${item.id ?? section.title}:${index}`}
                                                            href={item.href}
                                                            className="block rounded-2xl px-2 transition hover:bg-blue-50"
                                                        >
                                                            {content}
                                                        </Link>
                                                    ) : (
                                                        <div
                                                            key={`${item.id ?? section.title}:${index}`}
                                                            className="px-2"
                                                        >
                                                            {content}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            ) : null}

                            <BusinessEntityActivityPanel
                                preview={preview}
                                onActivityChanged={onActivityChanged}
                            />

                            {preview.actions?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {preview.actions.map((action) => (
                                        <Link
                                            key={`${action.label}:${action.href}`}
                                            href={action.href}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            {action.label}
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    ))}
                                </div>
                            ) : null}

                            {preview.href ? (
                                <Link
                                    href={preview.href}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    Mở trang chi tiết
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
                            Không có dữ liệu.
                        </div>
                    )}
                </div>
            </div>
            {imageOpen && preview?.imageUrl ? (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8" onClick={(event) => { event.stopPropagation(); setImageOpen(false); }}>
                    <button type="button" onClick={() => setImageOpen(false)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20" aria-label="Đóng ảnh phóng lớn"><X className="h-6 w-6" /></button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview.imageUrl} alt={preview.title} onClick={(event) => event.stopPropagation()} className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
                </div>
            ) : null}
        </div>
    );
}

export function useBusinessEntityPreview() {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<BusinessEntityPreview | null>(null);
    const [loading, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function openPreview(seed: BusinessEntityPreview) {
        setOpen(true);
        setPreview(seed);
        setError(null);

        startTransition(async () => {
            try {
                const live = await getBusinessEntityPreviewAction({
                    type: seed.type,
                    id: seed.id,
                });

                if (live) {
                    setPreview({
                        ...live,
                        href: live.href ?? seed.href,
                        sections: live.sections?.length ? live.sections : seed.sections,
                        actions: live.actions?.length ? live.actions : seed.actions,
                    });
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Không thể tải preview.");
            }
        });
    }

    function closePreview() {
        setOpen(false);
        setError(null);
    }

    function refreshPreview() {
        if (!preview) return;
        const current = preview;

        startTransition(async () => {
            try {
                const live = await getBusinessEntityPreviewAction({
                    type: current.type,
                    id: current.id,
                });
                if (live) setPreview(live);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Không thể tải lại preview.");
            }
        });
    }

    return {
        open,
        preview,
        loading,
        error,
        openPreview,
        refreshPreview,
        closePreview,
    };
}
