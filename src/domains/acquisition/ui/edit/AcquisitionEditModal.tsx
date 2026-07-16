"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, ImageIcon, Loader2, Plus, Save, Trash2, X } from "lucide-react";

import MediaPickerInline from "@/components/media/MediaPickerInline";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { Button, FieldLabel, Input, Textarea, moneyPreview } from "@/domains/shared/ui/form/fields";
import AcquisitionBulkImagePicker from "@/domains/acquisition/ui/new/AcquisitionBulkImagePicker";
import type { AcquisitionPreparedImage } from "@/domains/acquisition/client/form/acquisition-form.types";

type EditItem = {
    id: string;
    productId?: string | null;
    linkedWatchSku?: string | null;
    linkedWatchTitle?: string | null;
    title: string;
    unitCost: number | "";
    imageKey: string | null;
    imageUrl: string | null;
    aiHint: string;
};

type Detail = {
    id: string;
    refNo?: string | null;
    status: string;
    vendorName?: string | null;
    currency: string;
    notes: string;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    items: EditItem[];
};

type Props = {
    open: boolean;
    acquisitionId: string | null;
    onClose: () => void;
    onUpdated?: () => void;
};

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function parseMoney(raw: string) {
    const digits = String(raw ?? "").replace(/[^\d]/g, "");
    if (!digits) return "";
    const n = Number(digits);
    return Number.isFinite(n) ? n : "";
}

function fmtMoney(value: unknown, currency = "VND") {
    const n = Number(value ?? 0);
    return `${new Intl.NumberFormat("vi-VN").format(Number.isFinite(n) ? n : 0)} ${currency}`;
}

function previewSrc(item: EditItem) {
    if (item.imageUrl) return item.imageUrl;
    if (item.imageKey) return `/api/media/sign?key=${encodeURIComponent(item.imageKey)}`;
    return "";
}

function createEmptyItem(): EditItem {
    return {
        id: `tmp-${uid()}`,
        title: "",
        unitCost: "",
        imageKey: null,
        imageUrl: null,
        aiHint: "",
    };
}

export default function AcquisitionEditModal({ open, acquisitionId, onClose, onUpdated }: Props) {
    const notify = useNotify();
    const dialog = useAppDialog();
    const progress = useAppProgress();

    const [detail, setDetail] = useState<Detail | null>(null);
    const [items, setItems] = useState<EditItem[]>([]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const posted = String(detail?.status ?? "").toUpperCase() === "POSTED";
    const draft = String(detail?.status ?? "").toUpperCase() === "DRAFT";
    const currency = detail?.currency ?? "VND";

    const total = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.unitCost || 0), 0),
        [items],
    );

    useEffect(() => {
        if (!open || !acquisitionId) return;
        let mounted = true;

        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/acquisitions/${acquisitionId}/edit`, {
                    cache: "no-store",
                });
                const json = await res.json().catch(() => null);
                if (!res.ok) throw new Error(json?.error || "Không thể tải phiếu nhập.");
                if (!mounted) return;
                setDetail(json);
                setItems(Array.isArray(json?.items) ? json.items : []);
                setNotes(String(json?.notes ?? ""));
            } catch (error: any) {
                if (!mounted) return;
                notify.error({
                    title: "Không thể tải phiếu nhập",
                    message: error?.message || "Có lỗi xảy ra.",
                });
                onClose();
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [open, acquisitionId]);

    if (!open) return null;

    function updateItem(id: string, patch: Partial<EditItem>) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    }

    function addItem() {
        if (!draft) return;
        setItems((prev) => [...prev, createEmptyItem()]);
    }

    async function removeItem(id: string) {
        if (!draft) return;
        if (items.length <= 1) {
            notify.warning({ title: "Không thể xóa", message: "Phiếu cần ít nhất một dòng watch." });
            return;
        }
        setItems((prev) => prev.filter((item) => item.id !== id));
    }

    function importImages(images: AcquisitionPreparedImage[]) {
        if (!draft || !images.length) return;

        setItems((prev) => {
            const next = [...prev];
            let cursor = 0;

            for (let i = 0; i < next.length && cursor < images.length; i += 1) {
                if (next[i].imageKey || next[i].imageUrl) continue;
                next[i] = {
                    ...next[i],
                    imageKey: images[cursor].key ?? null,
                    imageUrl: images[cursor].url ?? null,
                };
                cursor += 1;
            }

            while (cursor < images.length) {
                next.push({
                    ...createEmptyItem(),
                    imageKey: images[cursor].key ?? null,
                    imageUrl: images[cursor].url ?? null,
                });
                cursor += 1;
            }

            return next;
        });
    }

    async function submit() {
        if (!detail || !acquisitionId) return;

        const validItems = items.filter(
            (item) =>
                item.id &&
                (posted || item.title.trim() || item.imageKey || item.imageUrl || Number(item.unitCost || 0) > 0),
        );

        if (!validItems.length) {
            notify.warning({
                title: "Phiếu chưa có dòng watch",
                message: "Cần ít nhất một dòng watch trước khi lưu.",
            });
            return;
        }

        if (posted && total < Number(detail.paidAmount || 0)) {
            notify.error({
                title: "Không thể lưu",
                message: "Tổng giá trị mới nhỏ hơn số payment đã PAID. Cần xử lý payment trước.",
            });
            return;
        }

        const accepted = await dialog.confirm({
            title: posted ? "Lưu giá nhập phiếu POSTED?" : "Lưu chỉnh sửa phiếu nhập?",
            message: posted
                ? "Phiếu đã POSTED chỉ cập nhật giá nhập. Payment UNPAID sẽ được đồng bộ để tổng PAID/UNPAID khớp tổng phiếu mới."
                : "Phiếu DRAFT sẽ được cập nhật danh sách watch, ảnh, giá nhập và ghi chú.",
            confirmText: "Lưu thay đổi",
            cancelText: "Hủy",
            tone: posted ? "warning" : "default",
        });

        if (!accepted) return;

        setSubmitting(true);
        progress.show({ title: "Đang lưu acquisition", message: detail.refNo || detail.id });

        try {
            const res = await fetch(`/api/admin/acquisitions/${acquisitionId}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notes,
                    items: validItems.map((item) => ({
                        id: item.id,
                        title: item.title,
                        productTitle: item.title,
                        unitCost: Number(item.unitCost || 0),
                        aiMeta: {
                            aiHint: item.aiHint || null,
                            images: item.imageKey || item.imageUrl ? [{ key: item.imageKey, url: item.imageUrl }] : [],
                        },
                    })),
                }),
            });

            const json = await res.json().catch(() => null);
            if (!res.ok) throw new Error(json?.error || "Không thể lưu acquisition.");

            notify.success({
                title: "Đã lưu acquisition",
                message: posted ? "Giá nhập và payment đã được đồng bộ." : "Phiếu DRAFT đã được cập nhật.",
            });

            onUpdated?.();
            onClose();
        } catch (error: any) {
            notify.error({
                title: "Lưu thất bại",
                message: error?.message || "Có lỗi xảy ra.",
            });
        } finally {
            setSubmitting(false);
            progress.hide();
        }
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4">
            <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                <Box className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Chỉnh sửa phiếu nhập {detail?.refNo || ""}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {posted
                                        ? "POSTED: chỉ chỉnh giá nhập, payment được đồng bộ tự động."
                                        : "DRAFT: thêm/xóa watch, đổi ảnh, chỉnh giá nhập và ghi chú."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex min-h-[420px] items-center justify-center gap-3 text-sm text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang tải dữ liệu...
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {[
                                ["Trạng thái", detail?.status || "-"],
                                ["Vendor", detail?.vendorName || "-"],
                                ["Tổng mới", fmtMoney(total, currency)],
                                ["Payment", `${fmtMoney(detail?.paidAmount, currency)} paid · ${fmtMoney(detail?.unpaidAmount, currency)} unpaid`],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</div>
                                    <div className="mt-1 truncate text-sm font-semibold text-slate-900">{value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-3xl border border-slate-200 bg-white">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                                <div>
                                    <div className="text-base font-semibold text-slate-950">Danh sách watch</div>
                                    <div className="text-sm text-slate-500">
                                        {posted ? "Khóa ảnh/tên/số dòng vì phiếu đã POSTED." : "Có thể thêm/bớt watch và đổi ảnh khi còn DRAFT."}
                                    </div>
                                </div>

                                {draft ? (
                                    <div className="flex items-center gap-2">
                                        <AcquisitionBulkImagePicker onImport={importImages} disabled={submitting} />
                                        <Button type="button" variant="outline" onClick={addItem}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm watch
                                        </Button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="space-y-3 p-5">
                                {items.map((item, index) => {
                                    const src = previewSrc(item);
                                    return (
                                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                        #{index + 1}
                                                    </span>
                                                    {item.linkedWatchSku ? (
                                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                            Linked {item.linkedWatchSku}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {draft ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Xóa
                                                    </button>
                                                ) : null}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[92px_minmax(0,1fr)_180px] lg:items-start">
                                                <div>
                                                    <FieldLabel>Ảnh</FieldLabel>
                                                    {draft ? (
                                                        <MediaPickerInline
                                                            value={item.imageKey ?? ""}
                                                            onChange={(key) =>
                                                                updateItem(item.id, {
                                                                    imageKey: key,
                                                                    imageUrl: key ? `/api/media/sign?key=${encodeURIComponent(key)}` : null,
                                                                })
                                                            }
                                                            pending={false}
                                                            disabled={submitting}
                                                            profile="inline"
                                                            compact
                                                            className="h-[72px] w-[72px] rounded-xl"
                                                        />
                                                    ) : src ? (
                                                        <img src={src} alt="watch" className="h-[72px] w-[72px] rounded-xl border border-slate-200 object-cover" />
                                                    ) : (
                                                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300">
                                                            <ImageIcon className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <FieldLabel>Tên / mô tả nhanh</FieldLabel>
                                                    <Input
                                                        value={item.title}
                                                        disabled={posted || submitting}
                                                        onChange={(event) => updateItem(item.id, { title: event.target.value })}
                                                        placeholder="VD: Seiko automatic mặt trắng"
                                                    />
                                                    {draft ? (
                                                        <div className="mt-3">
                                                            <FieldLabel>Gợi ý AI</FieldLabel>
                                                            <Input
                                                                value={item.aiHint}
                                                                disabled={submitting}
                                                                onChange={(event) => updateItem(item.id, { aiHint: event.target.value })}
                                                                placeholder="VD: niềng vàng, kính cong..."
                                                            />
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div>
                                                    <FieldLabel>Giá nhập</FieldLabel>
                                                    <Input
                                                        value={item.unitCost === "" ? "" : new Intl.NumberFormat("vi-VN").format(Number(item.unitCost || 0))}
                                                        onChange={(event) => updateItem(item.id, { unitCost: parseMoney(event.target.value) })}
                                                        disabled={submitting}
                                                        inputMode="numeric"
                                                        className="text-right font-semibold tabular-nums"
                                                    />
                                                    <div className="mt-1 text-right text-xs text-slate-400">
                                                        {moneyPreview(String(item.unitCost || ""))}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {draft ? (
                            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
                                <FieldLabel>Ghi chú</FieldLabel>
                                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
                            </div>
                        ) : null}
                    </div>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
                    <div className="text-sm text-slate-500">
                        Tổng sau chỉnh sửa: <b className="text-slate-950">{fmtMoney(total, currency)}</b>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                            Đóng
                        </Button>
                        <Button type="button" onClick={submit} disabled={loading || submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
