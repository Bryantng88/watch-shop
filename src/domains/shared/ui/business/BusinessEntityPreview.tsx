"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ExternalLink,
    AtSign,
    ImageIcon,
    Loader2,
    MessageSquare,
    Pencil,
    Save,
    Send,
    X,
    ZoomIn,
} from "lucide-react";
import type {
    BusinessEntityPreview,
    BusinessEntityType,
} from "@/domains/shared/business/business-entity.types";
import {
    updateTechnicalIssuePreviewAction,
} from "@/domains/shared/business/business-entity-preview.actions";
import { ActivityViewModelFeed } from "@/domains/task/ui/task-work/activity/ActivityFeed";
import { markTaskItemMentionsReadAction } from "@/domains/task/actions/task.actions";
import type { TaskItemActivityViewModel } from "@/domains/task/server/activity";

async function loadBusinessEntityPreview(type: BusinessEntityType, id: string) {
    const query = new URLSearchParams({ type, id, activityMode: "DISCUSSION" });
    const response = await fetch(`/api/admin/business-entity-preview?${query.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.error || "Không thể tải xem nhanh.");
    return (result?.preview ?? null) as BusinessEntityPreview | null;
}

const TECHNICAL_AREAS = [
    ["GENERAL", "Tổng quát"],
    ["MOVEMENT", "Máy"],
    ["CASE", "Vỏ"],
    ["CRYSTAL", "Kính"],
    ["BRACELET", "Dây / bracelet"],
    ["CROWN", "Núm"],
    ["HANDS_MARKERS", "Kim cọc"],
] as const;

function TechnicalIssueEditPanel({ preview }: { preview: BusinessEntityPreview }) {
    const router = useRouter();
    const edit = preview.edit;
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [values, setValues] = useState(edit?.values);

    useEffect(() => {
        setValues(edit?.values);
        setEditing(false);
        setError(null);
    }, [edit, preview.id]);

    if (!edit || !values) return null;
    const inputClass = "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    async function save() {
        const currentValues = values;
        if (!currentValues) return;
        if (!currentValues.summary.trim()) {
            setError("Vui lòng nhập nội dung TI.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await updateTechnicalIssuePreviewAction({
                id: preview.id,
                ...currentValues,
            });
            setEditing(false);
            router.refresh();
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật TI.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-950">Thông tin Technical Issue</div>
                    <div className="mt-0.5 text-xs text-slate-500">Có thể chỉnh sửa khi TI chưa Done.</div>
                </div>
                <button type="button" onClick={() => setEditing((current) => !current)} disabled={saving} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
                    <Pencil className="h-4 w-4" />
                    {editing ? "Đóng chỉnh sửa" : "Chỉnh sửa"}
                </button>
            </div>
            {editing ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                        <span className="mb-1 block text-xs font-semibold text-slate-600">Nội dung TI</span>
                        <input className={inputClass} value={values.summary} onChange={(event) => setValues({ ...values, summary: event.target.value })} />
                    </label>
                    <label>
                        <span className="mb-1 block text-xs font-semibold text-slate-600">Khu vực kỹ thuật</span>
                        <select
                            className={inputClass}
                            value={values.area}
                            onChange={(event) => {
                                const area = event.target.value;
                                setValues({
                                    ...values,
                                    area,
                                    machine: {
                                        ...values.machine,
                                        enabled: area === "MOVEMENT",
                                    },
                                });
                            }}
                        >
                            {TECHNICAL_AREAS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </label>
                    <label>
                        <span className="mb-1 block text-xs font-semibold text-slate-600">Hình thức xử lý</span>
                        <select className={inputClass} value={values.actionMode} onChange={(event) => setValues({ ...values, actionMode: event.target.value, vendorId: event.target.value === "VENDOR" ? values.vendorId : "" })}>
                            <option value="INTERNAL">Nội bộ</option>
                            <option value="VENDOR">Vendor</option>
                        </select>
                    </label>
                    {values.actionMode === "VENDOR" ? (
                        <label>
                            <span className="mb-1 block text-xs font-semibold text-slate-600">Vendor</span>
                            <select className={inputClass} value={values.vendorId} onChange={(event) => setValues({ ...values, vendorId: event.target.value })}>
                                <option value="">Chọn vendor</option>
                                {edit.vendorOptions.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
                            </select>
                        </label>
                    ) : null}
                    <label>
                        <span className="mb-1 block text-xs font-semibold text-slate-600">Chi phí dự kiến</span>
                        <input type="number" min={0} step={1000} className={inputClass} value={values.estimatedCost} onChange={(event) => setValues({ ...values, estimatedCost: event.target.value })} />
                    </label>
                    <label>
                        <span className="mb-1 block text-xs font-semibold text-slate-600">Số ngày dự kiến</span>
                        <input type="number" min={1} max={365} step={1} className={inputClass} value={values.expectedWorkingDays} onChange={(event) => setValues({ ...values, expectedWorkingDays: event.target.value })} />
                    </label>
                    <label className="sm:col-span-2">
                        <span className="mb-1 block text-xs font-semibold text-slate-600">Ghi chú kỹ thuật</span>
                        <textarea rows={3} className={`${inputClass} h-auto py-2`} value={values.note} onChange={(event) => setValues({ ...values, note: event.target.value })} />
                    </label>
                    {values.machine.enabled ? (
                        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Thông số máy</div>
                                    <div className="mt-0.5 text-xs text-slate-500">
                                        Mã máy đồng bộ trực tiếp với Watch.
                                    </div>
                                </div>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    {values.machine.mechanical ? "Máy cơ" : "Máy pin"}
                                </span>
                            </div>
                            <label className="mt-3 block">
                                <span className="mb-1 block text-xs font-semibold text-slate-600">Mã máy</span>
                                <input
                                    className={inputClass}
                                    value={values.machine.movementCalibre}
                                    placeholder="NH35A, 7S26, ETA 2824-2..."
                                    onChange={(event) => setValues({
                                        ...values,
                                        machine: {
                                            ...values.machine,
                                            movementCalibre: event.target.value,
                                        },
                                    })}
                                />
                            </label>
                            {values.machine.mechanical ? (
                                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                    {([
                                        ["before", "Trước xử lý"],
                                        ["after", "Sau xử lý"],
                                    ] as const).map(([phase, label]) => (
                                        <div key={phase} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                                                {label}
                                            </div>
                                            <div className="grid gap-2 sm:grid-cols-3">
                                                {([
                                                    ["rate", "Sai số", "s/day", "1"],
                                                    ["amplitude", "Biên độ", "°", "1"],
                                                    ["beatError", "Lệch nhịp", "ms", "0.1"],
                                                ] as const).map(([field, fieldLabel, unit, step]) => (
                                                    <label key={field}>
                                                        <span className="mb-1 block text-[11px] font-semibold text-slate-600">
                                                            {fieldLabel}
                                                        </span>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                step={step}
                                                                className={`${inputClass} pr-14`}
                                                                value={values.machine[phase][field]}
                                                                onChange={(event) => setValues({
                                                                    ...values,
                                                                    machine: {
                                                                        ...values.machine,
                                                                        [phase]: {
                                                                            ...values.machine[phase],
                                                                            [field]: event.target.value,
                                                                        },
                                                                    },
                                                                })}
                                                            />
                                                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] font-medium text-slate-400">
                                                                {unit}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    {error ? <div className="sm:col-span-2 text-sm font-medium text-rose-600">{error}</div> : null}
                    <div className="flex justify-end sm:col-span-2">
                        <button type="button" disabled={saving} onClick={() => void save()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white disabled:bg-slate-300">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

function BusinessEntityActivityPanel({
    preview,
    onActivityChanged,
}: {
    preview: BusinessEntityPreview;
    onActivityChanged?: (reason?: "COMMENT" | "READ") => void;
}) {
    const router = useRouter();
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
    const [activityTab, setActivityTab] = useState<"DISCUSSION" | "HISTORY">("DISCUSSION");
    const [historyItems, setHistoryItems] = useState<TaskItemActivityViewModel[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyTotalPages, setHistoryTotalPages] = useState(1);
    const markedReadKeyRef = useRef<string | null>(null);
    const activity = preview.activity;
    useEffect(() => {
        setActivityTab("DISCUSSION");
        setHistoryItems([]);
        setHistoryError(null);
        setHistoryPage(1);
        setHistoryTotalPages(1);
    }, [preview.id, preview.type]);
    useEffect(() => {
        if (!activity?.viewerUserId) return;
        const readKey = `${activity.taskItemId}:${preview.type}:${preview.id}`;
        if (markedReadKeyRef.current === readKey) return;
        markedReadKeyRef.current = readKey;
        void markTaskItemMentionsReadAction({
            taskItemId: activity.taskItemId,
            targetType: preview.type,
            targetId: preview.id,
        }).then((result) => {
            if (result.updated) {
                onActivityChanged?.("READ");
                router.refresh();
            }
        });
    }, [activity?.taskItemId, activity?.viewerUserId, onActivityChanged, preview.id, preview.type, router]);
    if (!activity) return null;
    const activityTaskItemId = activity.taskItemId;
    const mentionQuery = body.match(/(?:^|\s)@([^@\s]*)$/)?.[1]?.toLocaleLowerCase("vi") ?? null;
    const mentionMatches = mentionQuery === null ? [] : (activity.mentionableUsers ?? [])
        .filter((user) => !mentionedUserIds.includes(user.id) && user.label.toLocaleLowerCase("vi").includes(mentionQuery))
        .slice(0, 6);

    function addMention(user: { id: string; label: string }) {
        setBody((current) => current.replace(/(?:^|\s)@([^@\s]*)$/, (match) => `${match.startsWith(" ") ? " " : ""}@${user.label} `));
        setMentionedUserIds((current) => [...current, user.id]);
    }

    function updateBody(nextBody: string) {
        setBody(nextBody);
        setMentionedUserIds((current) => current.filter((userId) => {
            const user = activity.mentionableUsers?.find((candidate) => candidate.id === userId);
            return Boolean(user?.label) && nextBody.includes(`@${user?.label}`);
        }));
    }

    async function loadHistory(page = 1) {
        setActivityTab("HISTORY");
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const query = new URLSearchParams({
                type: preview.type,
                id: preview.id,
                page: String(page),
            });
            const response = await fetch(
                `/api/admin/business-entity-preview/activity?${query.toString()}`,
                { headers: { Accept: "application/json" }, cache: "no-store" },
            );
            const result = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(result?.error || "Không thể tải lịch sử activity.");
            }
            setHistoryItems(Array.isArray(result?.items) ? result.items : []);
            setHistoryPage(Number(result?.pagination?.page ?? page));
            setHistoryTotalPages(Number(result?.pagination?.totalPages ?? 1));
        } catch (error) {
            setHistoryError(
                error instanceof Error ? error.message : "Không thể tải lịch sử activity.",
            );
        } finally {
            setHistoryLoading(false);
        }
    }

    async function submitComment() {
        const text = body.trim();
        if (!text || submitting) return;
        setSubmitting(true);
        setCommentError(null);
        try {
            const response = await fetch("/api/admin/business-entity-preview", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    taskItemId: activityTaskItemId,
                    targetType: preview.type,
                    targetId: preview.id,
                    body: text,
                    mentionedUserIds,
                }),
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.error || "Không thể gửi trao đổi.");
            setBody("");
            setMentionedUserIds([]);
            onActivityChanged?.("COMMENT");
        } catch (error) {
            setCommentError(error instanceof Error ? error.message : "Không thể gửi trao đổi.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
            <div>
                <div className="text-sm font-semibold text-slate-950">Trao đổi nghiệp vụ</div>
                <div className="mt-0.5 text-xs text-slate-500">Ưu tiên comment, reply và mention trong đúng ngữ cảnh.</div>
            </div>
            {activity.discussionEnabled ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="mt-2 h-4 w-4 shrink-0 text-slate-400" />
                        <textarea
                            value={body}
                            onChange={(event) => updateBody(event.target.value)}
                            rows={2}
                            disabled={submitting}
                            placeholder="Thêm trao đổi về nghiệp vụ này..."
                            className="min-h-[68px] flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    {mentionMatches.length ? (
                        <div className="ml-6 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                            {mentionMatches.map((user) => (
                                <button key={user.id} type="button" onClick={() => addMention(user)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-violet-50">
                                    <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">{user.label.slice(0, 1).toUpperCase()}</span>
                                    <span className="font-medium text-slate-800">{user.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : null}
                    {mentionedUserIds.length ? (
                        <div className="ml-6 mt-2 flex flex-wrap gap-1.5">
                            {mentionedUserIds.map((userId) => {
                                const user = activity.mentionableUsers?.find((candidate) => candidate.id === userId);
                                if (!user) return null;
                                return <button key={user.id} type="button" onClick={() => setMentionedUserIds((current) => current.filter((id) => id !== user.id))} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700"><AtSign className="h-3 w-3" />{user.label}<X className="h-3 w-3" /></button>;
                            })}
                        </div>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="text-xs font-medium text-slate-400">{commentError ? <span className="text-rose-600">{commentError}</span> : "Gõ @ để giao việc hoặc nhắc đúng người."}</div>
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
            <div className="mt-4 flex items-center gap-2">
                <button type="button" onClick={() => setActivityTab("DISCUSSION")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${activityTab === "DISCUSSION" ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-500"}`}>
                    Trao đổi ({activity.items.length})
                </button>
                <button type="button" onClick={() => void loadHistory(historyPage)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${activityTab === "HISTORY" ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-500"}`}>
                    Lịch sử
                </button>
            </div>
            <div className="mt-4 [&>div]:!space-y-5 [&_article]:border-slate-200/80 [&_article]:shadow-[0_3px_12px_rgba(15,23,42,0.045)]">
                {historyLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải lịch sử...
                    </div>
                ) : historyError ? (
                    <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{historyError}</div>
                ) : (
                <ActivityViewModelFeed
                    items={activityTab === "DISCUSSION" ? activity.items : historyItems}
                    mentionUsers={(activity.mentionableUsers ?? []).map((user) => ({
                        id: user.id,
                        name: user.label,
                    }))}
                    businessBindings={[]}
                    queueItems={[]}
                    mode="ALL"
                    discussionEnabled={activity.discussionEnabled}
                    viewerUserId={activity.viewerUserId}
                    onMarkMentionsRead={async () => {
                        await markTaskItemMentionsReadAction({
                            taskItemId: activity.taskItemId,
                            targetType: preview.type,
                            targetId: preview.id,
                        });
                        onActivityChanged?.("READ");
                        router.refresh();
                    }}
                    onActivityChanged={() => onActivityChanged?.("COMMENT")}
                />
                )}
                {activityTab === "HISTORY" && !historyLoading && historyTotalPages > 1 ? (
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button type="button" disabled={historyPage <= 1} onClick={() => void loadHistory(historyPage - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40">Trước</button>
                        <span className="text-xs text-slate-500">{historyPage}/{historyTotalPages}</span>
                        <button type="button" disabled={historyPage >= historyTotalPages} onClick={() => void loadHistory(historyPage + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40">Sau</button>
                    </div>
                ) : null}
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
    onActivityChanged?: (reason?: "COMMENT" | "READ") => void;
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
                className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ${
                    preview?.type === "TECHNICAL_ISSUE" ? "max-w-4xl" : "max-w-2xl"
                }`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            Xem nhanh
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <h2 className="truncate text-sm font-semibold text-slate-900">
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
                        <div className="space-y-5">
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80">
                              <div className="flex items-center gap-3 p-3">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                            {typeLabel(preview.type)}
                                        </div>
                                        {preview.status ? (
                                            <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                                                {preview.status}
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="mt-1 line-clamp-2 text-base font-bold leading-5 text-slate-950">
                                        {preview.title}
                                    </div>

                                    {preview.subtitle ? (
                                        <div className="mt-1 text-sm text-slate-500">
                                            {preview.subtitle}
                                        </div>
                                    ) : null}

                                </div>
                              </div>

                              {preview.facts?.length ? (
                                <div className="grid grid-cols-2 border-t border-slate-200/80 bg-white/70 sm:grid-cols-3">
                                    {preview.facts.map((fact) => (
                                        <div
                                            key={fact.label}
                                            className="min-w-0 border-b border-r border-slate-100 px-3 py-2 last:border-b-0"
                                        >
                                            <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400">{fact.label}</div>
                                            {fact.href ? (
                                                <Link
                                                    href={fact.href}
                                                    className="mt-0.5 flex min-w-0 items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                                                    title={`Mở ${fact.label}: ${fact.value ?? "-"}`}
                                                >
                                                    <span className="truncate">{fact.value ?? "-"}</span>
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </Link>
                                            ) : (
                                                <div
                                                    className={`mt-0.5 truncate text-xs font-semibold ${String(fact.value).toUpperCase() === "URGENT" ? "text-rose-600" : "text-slate-800"}`}
                                                    title={fact.value ?? "-"}
                                                >
                                                    {fact.value ?? "-"}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                              ) : null}
                            </section>

                            <TechnicalIssueEditPanel preview={preview} />

                            {preview.notes?.length ? (
                                <div className="space-y-3">
                                    {preview.notes.map((note) => (
                                        <section
                                            key={note.label}
                                            className={`${note.tone === "warning"
                                                ? "rounded-2xl border border-amber-200 bg-amber-50 p-3"
                                                : note.tone === "info"
                                                    ? "rounded-2xl border border-blue-100 bg-blue-50"
                                                    : "rounded-2xl border border-slate-200 bg-white"
                                            } ${note.label.toLocaleLowerCase("vi").includes("ghi chú kỹ thuật") ? "px-3 py-2.5" : "p-3"}`}
                                        >
                                            <div className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{note.label}</div>
                                            <div
                                                className={`mt-1 whitespace-pre-wrap text-slate-800 ${
                                                    note.label.toLocaleLowerCase("vi").includes("ghi chú kỹ thuật")
                                                        ? "line-clamp-2 text-xs leading-5"
                                                        : "text-sm leading-6"
                                                }`}
                                                title={note.body}
                                            >
                                                {note.body}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            ) : null}

                            {preview.sections?.length ? (
                                <div className="space-y-4">
                                    {preview.sections.map((section) => (
                                        <section
                                            key={section.title}
                                            className={
                                                section.title.toLocaleLowerCase("vi").includes("technical issue")
                                                    ? "rounded-3xl border border-blue-200 bg-blue-50/55 p-4 shadow-[0_6px_20px_rgba(37,99,235,0.07)]"
                                                    : "rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_18px_rgba(15,23,42,0.035)]"
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className={`text-sm font-semibold ${
                                                        section.title.toLocaleLowerCase("vi").includes("technical issue")
                                                            ? "text-blue-950"
                                                            : "text-slate-950"
                                                    }`}>
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

                                            <div className="mt-3 grid gap-2.5">
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
                                                            className={`block rounded-2xl border px-3 transition ${
                                                                section.title.toLocaleLowerCase("vi").includes("technical issue")
                                                                    ? item.id === preview.id
                                                                        ? "border-blue-300 bg-white shadow-[0_3px_12px_rgba(37,99,235,0.08)] ring-1 ring-blue-100"
                                                                        : "border-blue-100 bg-white/75 hover:border-blue-200 hover:bg-white"
                                                                    : "border-slate-100 bg-slate-50/50 hover:border-blue-100 hover:bg-blue-50"
                                                            }`}
                                                        >
                                                            {content}
                                                        </Link>
                                                    ) : (
                                                        <div
                                                            key={`${item.id ?? section.title}:${index}`}
                                                            className={`rounded-2xl border px-3 ${
                                                                section.title.toLocaleLowerCase("vi").includes("technical issue")
                                                                    ? item.id === preview.id
                                                                        ? "border-blue-300 bg-white shadow-[0_3px_12px_rgba(37,99,235,0.08)] ring-1 ring-blue-100"
                                                                        : "border-blue-100 bg-white/75"
                                                                    : "border-slate-100 bg-slate-50/50"
                                                            }`}
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
                const live = await loadBusinessEntityPreview(seed.type, seed.id);

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
                const live = await loadBusinessEntityPreview(current.type, current.id);
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
