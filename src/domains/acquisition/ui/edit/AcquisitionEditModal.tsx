"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import AcquisitionMoneyInput from "../shared/AcquisitionMoneyInput";
import { useEffect, useMemo, useState, useRef } from "react";
import { ImageIcon, Loader2, Plus, Save, Trash2 } from "lucide-react";

import MediaPickerInline from "@/components/media/MediaPickerInline";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { Button, FieldLabel, Input, Textarea } from "@/domains/shared/ui/form/fields";
import AcquisitionBulkImagePicker from "@/domains/acquisition/ui/new/AcquisitionBulkImagePicker";
import type { AcquisitionPreparedImage } from "@/domains/acquisition/client/form/acquisition-form.types";
import { waitForOperationProjectionDeliveries } from "@/domains/coordination/ui/operation-delivery.client";

import AcquisitionDetailClient, { type AcquisitionDetail as Detail, type AcquisitionDetailItem as EditItem } from "@/domains/acquisition/client/AcquisitionDetailClient";
import { AdminDetailSection, ADMIN_DETAIL as detailUi } from "@/domains/shared/ui/admin-design-contract/AdminDetail";

type Props = {
    open: boolean;
    acquisitionId: string | null;
    onClose: () => void;
    onUpdated?: () => void;
    canManage?: boolean;
    canViewFinancials?: boolean;
};

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
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
        quantity: 1,
        productType: "WATCH",
        unitCost: "",
        imageKey: null,
        imageUrl: null,
        aiHint: "",
    };
}

export default function AcquisitionEditModal({ open, acquisitionId, onClose, onUpdated, canManage = false, canViewFinancials = false }: Props) {
    const notify = useNotify();
    const dialog = useAppDialog();
    const progress = useAppProgress();

    const dialogRef = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState(false);
    const [detail, setDetail] = useState<Detail | null>(null);
    const [items, setItems] = useState<EditItem[]>([]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const posted = String(detail?.status ?? "").toUpperCase() === "POSTED";
    const draft = String(detail?.status ?? "").toUpperCase() === "DRAFT";
    const currency = detail?.currency ?? "VND";

    const total = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitCost || 0), 0),
        [items],
    );

    useEffect(() => {
        if (!open || !acquisitionId) return;
        let mounted = true;

        async function load() {
            setLoading(true);
            setDetail(null);
            setEditing(false);
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
            } catch (error: unknown) {
                if (!mounted) return;
                notify.error({
                    title: "Không thể tải phiếu nhập",
                    message: error instanceof Error ? error.message : "Có lỗi xảy ra.",
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

    useEffect(() => {
        if (!open) return;
        const previous = document.activeElement as HTMLElement | null;
        const frame = requestAnimationFrame(() => dialogRef.current?.focus());
        return () => { cancelAnimationFrame(frame); previous?.focus(); };
    }, [open]);

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
        if (!detail || !acquisitionId || submitting || !canManage || !canViewFinancials || (!draft && !posted)) return;

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
                        quantity: Number(item.quantity || 1),
                        productType: item.productType,
                        unitCost: Number(item.unitCost || 0),
                        aiMeta: {
                            aiHint: item.aiHint || null,
                            images: item.imageKey || item.imageUrl ? [{ key: item.imageKey, url: item.imageUrl }] : [],
                        },
                    })),
                }),
            });

            const json = await res.json().catch(() => null);
            if (res.ok) await waitForOperationProjectionDeliveries(json);
            if (!res.ok) throw new Error(json?.error || "Không thể lưu acquisition.");

            notify.success({
                title: "Đã lưu acquisition",
                message: posted ? "Giá nhập và payment đã được đồng bộ." : "Phiếu DRAFT đã được cập nhật.",
            });

            onUpdated?.();
            onClose();
        } catch (error: unknown) {
            notify.error({
                title: "Lưu thất bại",
                message: error instanceof Error ? error.message : "Có lỗi xảy ra.",
            });
        } finally {
            setSubmitting(false);
            progress.hide();
        }
    }

    return (
        <div className="fixed inset-0 z-[90] bg-slate-950/40 p-0 sm:p-4">
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="acquisition-detail-title" tabIndex={-1} onKeyDown={event => {
                if (!event.currentTarget.contains(event.target as Node)) return;
                if (event.key === "Escape" && !submitting) { event.stopPropagation(); onClose(); }
                if (event.key !== "Tab") return;
                const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),summary,[tabindex="0"]')).filter(node => node.getClientRects().length > 0);
                const first = nodes[0], last = nodes[nodes.length - 1];
                if (!first) { event.preventDefault(); return; }
                if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }} className="mx-auto h-full w-full max-w-[1440px] overflow-y-auto bg-white outline-none sm:rounded-xl">
                {loading || !detail ? <div role="status" className="flex min-h-[300px] items-center justify-center gap-3"><h1 id="acquisition-detail-title" className="sr-only">Phiếu nhập</h1><Loader2 className="h-5 w-5 animate-spin"/>Đang tải phiếu nhập...</div> :
                    <AcquisitionDetailClient detail={detail} canManage={canManage} canViewFinancials={canViewFinancials} editing={editing} pending={submitting} onEdit={() => setEditing(true)} onClose={onClose}
                        actions={<><AdminButton variant="secondary" disabled={submitting} onClick={() => setEditing(false)}>Xem phiếu</AdminButton><AdminButton disabled={submitting} onClick={submit}>{submitting ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>}Lưu thay đổi</AdminButton></>}>
                        <AdminDetailSection id="acquisition-items" title="Sản phẩm" description={posted ? "Phiếu đã nhập kho: chỉ có thể chỉnh giá nhập." : "Có thể thêm, xóa sản phẩm và đổi ảnh khi còn nháp."}>
                            <div className="mb-4 flex flex-wrap justify-end gap-3">

                                {draft ? (
                                    <div className="flex items-center gap-2">
                                        <AcquisitionBulkImagePicker
                                            onImport={importImages}
                                            disabled={submitting}
                                            audienceSegment={detail?.audienceSegment ?? "MEN"}
                                        />
                                        <Button type="button" variant="outline" onClick={addItem} disabled={submitting}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm watch
                                        </Button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="divide-y divide-slate-100">
                                {items.map((item, index) => {
                                    const src = previewSrc(item);
                                    return (
                                        <div key={item.id} className="py-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                        #{index + 1}
                                                    </span>
                                                    {item.linkedWatchSku ? (
                                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                            {item.linkedWatchSku}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {draft ? (
                                                    <AdminButton variant="danger"
                                                        type="button"
                                                        disabled={submitting}
                                                        onClick={() => removeItem(item.id)}
                                                        className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Xóa
                                                    </AdminButton>
                                                ) : null}
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[64px_minmax(0,1fr)_80px_160px] 2xl:items-start">
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
                                                            pending={submitting}
                                                            disabled={submitting}
                                                            profile="inline"
                                                            compact
                                                            className="h-16 w-16 rounded-xl"
                                                        />
                                                    ) : src ? (
                                                        <img src={src} alt="watch" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
                                                    ) : (
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300">
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
                                                    <FieldLabel>Số lượng</FieldLabel>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        value={item.quantity}
                                                        disabled={posted || submitting || item.productType === "WATCH"}
                                                        onChange={(event) => updateItem(item.id, {
                                                            quantity: Math.max(1, Math.trunc(Number(event.target.value) || 1)),
                                                        })}
                                                        className="text-right font-semibold tabular-nums"
                                                    />
                                                    {item.productType === "WATCH" ? (
                                                        <div className="mt-1 text-right text-xs text-slate-400">Mỗi Watch là một dòng riêng.</div>
                                                    ) : null}
                                                </div>

                                                <div>
                                                    <FieldLabel>Giá nhập</FieldLabel>
                                                    <AcquisitionMoneyInput label={`Giá nhập ${item.title || "sản phẩm"}`} value={item.unitCost ?? ""} currency={currency}
                                                        onChange={value => updateItem(item.id, { unitCost: value })} disabled={submitting} />
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AdminDetailSection>

                        {draft ? (
                            <div id="acquisition-notes" className={detailUi.section}>
                                <FieldLabel>Ghi chú</FieldLabel>
                                <Textarea disabled={submitting} value={notes} onChange={(event) => setNotes(event.target.value)} />
                            </div>
                        ) : null}

                        <p className={detailUi.metadata}>Tổng sau chỉnh sửa: <b>{fmtMoney(total, currency)}</b></p>
                    </AcquisitionDetailClient>
                }
            </div>
        </div>
    );
}
