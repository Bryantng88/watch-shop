"use client";

import { useMemo, useState, useTransition } from "react";
import { Box, Plus, Save, X } from "lucide-react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { createQuickVendor } from "@/domains/vendor/client/vendor.actions";
import AcquisitionBulkImagePicker from "../ui/new/AcquisitionBulkImagePicker";
import {
    applyPreparedImagesTopDown,
    createEmptyWatchLine,
} from "./form/acquisition-form.mapper";
import { submitInlineAcquisition } from "./form/acquisition-form.submit";
import type {
    AcquisitionFormVendor,
    AcquisitionPreparedImage,
    AcquisitionWatchLine,
} from "./form/acquisition-form.types";
import WatchLineCard from "../ui/new/WatchLineCard";

type Props = {
    vendors: AcquisitionFormVendor[];
};

function toLocalDateTimeInputValue(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function mergeVendors(
    current: AcquisitionFormVendor[],
    incoming: AcquisitionFormVendor[],
) {
    const byId = new Map<string, AcquisitionFormVendor>();

    for (const vendor of [...current, ...incoming]) {
        if (!vendor?.id) continue;
        byId.set(vendor.id, vendor);
    }

    return Array.from(byId.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

function VendorQuickField({
    value,
    vendors,
    disabled,
    onChange,
    onVendorsChange,
}: {
    value: string;
    vendors: AcquisitionFormVendor[];
    disabled?: boolean;
    onChange: (vendorId: string) => void;
    onVendorsChange: (vendors: AcquisitionFormVendor[]) => void;
}) {
    const notify = useNotify();
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [pending, startTransition] = useTransition();

    function handleCreate() {
        const cleanName = name.trim();
        if (!cleanName || pending) return;

        startTransition(async () => {
            try {
                const vendor = await createQuickVendor({
                    name: cleanName,
                    phone: phone.trim() || null,
                });
                onVendorsChange(mergeVendors(vendors, [vendor]));
                onChange(vendor.id);
                setName("");
                setPhone("");
                setCreating(false);
                notify.success({
                    title: "Đã tạo vendor",
                    message: `Vendor ${vendor.name} đã được chọn cho phiếu nhập.`,
                });
            } catch (error) {
                notify.error({
                    title: "Không thể tạo vendor",
                    message: getErrorMessage(error, "Có lỗi xảy ra khi tạo vendor."),
                });
            }
        });
    }

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-slate-800">
                    Vendor
                </label>
                {!creating ? (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setCreating(true)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Vendor mới
                    </button>
                ) : null}
            </div>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || pending}
                className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
                <option value="">-- Chọn vendor --</option>
                {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                    </option>
                ))}
            </select>

            {creating ? (
                <div className="mt-3 rounded-2xl bg-indigo-50/60 p-3 ring-1 ring-inset ring-indigo-100">
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto_auto] md:items-end">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Tên vendor mới
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={pending}
                                placeholder="VD: Chợ Nhật"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Điện thoại
                            </label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={pending}
                                placeholder="Tuỳ chọn"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <button
                            type="button"
                            disabled={pending || !name.trim()}
                            onClick={handleCreate}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                            {pending ? "Đang thêm" : "Thêm"}
                        </button>
                        <button
                            type="button"
                            disabled={pending}
                            onClick={() => {
                                setName("");
                                setPhone("");
                                setCreating(false);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Đóng form thêm vendor"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default function AcquisitionFormClient({ vendors: initialVendors }: Props) {
    const notify = useNotify();

    const [vendors, setVendors] = useState<AcquisitionFormVendor[]>(initialVendors);
    const [vendorId, setVendorId] = useState("");
    const [createdAt, setCreatedAt] = useState(() =>
        toLocalDateTimeInputValue(new Date())
    );
    const [currency, setCurrency] = useState("VND");
    const [type, setType] = useState("PURCHASE");
    const [notes, setNotes] = useState("");
    const [watchLines, setWatchLines] = useState<AcquisitionWatchLine[]>([
        createEmptyWatchLine(),
    ]);
    const [submitting, setSubmitting] = useState(false);

    const totalWatchCost = useMemo(() => {
        return watchLines.reduce((sum, line) => {
            const cost = line.cost === "" ? 0 : Number(line.cost || 0);
            return sum + cost;
        }, 0);
    }, [watchLines]);

    function updateLine(id: string, next: AcquisitionWatchLine) {
        setWatchLines((prev) => prev.map((line) => (line.id === id ? next : line)));
    }

    function removeLine(id: string) {
        setWatchLines((prev) => {
            const next = prev.filter((line) => line.id !== id);
            return next.length ? next : [createEmptyWatchLine()];
        });
    }

    function addWatchLine() {
        setWatchLines((prev) => [...prev, createEmptyWatchLine()]);
    }

    function importPreparedImages(images: AcquisitionPreparedImage[]) {
        setWatchLines((prev) => applyPreparedImagesTopDown(prev, images));
    }

    async function submit() {
        if (!vendorId) {
            notify.warning({
                title: "Thiếu vendor",
                message: "Vui lòng chọn vendor trước khi lưu phiếu nhập.",
            });
            return;
        }

        if (!watchLines.length) {
            notify.warning({
                title: "Thiếu dòng watch",
                message: "Cần ít nhất một dòng đồng hồ để tạo phiếu nhập.",
            });
            return;
        }

        const validLines = watchLines.filter(
            (line) =>
                line.imageKey ||
                line.imageUrl ||
                line.quickInput.trim() ||
                line.aiHint.trim() ||
                Number(line.cost || 0) > 0
        );

        if (!validLines.length) {
            notify.warning({
                title: "Phiếu nhập chưa có dữ liệu",
                message: "Vui lòng nhập thông tin watch, giá hoặc chọn ảnh trước khi lưu.",
            });
            return;
        }

        setSubmitting(true);

        try {
            await submitInlineAcquisition({
                vendorId,
                createdAt: new Date(createdAt).toISOString(),
                currency,
                type,
                notes: notes || null,
                items: validLines,
            });

            notify.success({
                title: "Đã lưu phiếu nhập",
                message: "Phiếu nhập đã được lưu ở trạng thái draft.",
            });
        } catch (error) {
            notify.error({
                title: "Lưu phiếu nhập thất bại",
                message: getErrorMessage(error, "Không thể lưu phiếu nhập."),
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Tạo phiếu nhập watch
                        </h1>
                        <p className="text-sm text-slate-500">
                            Chọn nhiều ảnh từ NAS rồi đổ vào các dòng watch đang trống, từ trên xuống dưới.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            ["Trạng thái", "DRAFT"],
                            ["Tổng đồng hồ", String(watchLines.length)],
                            [
                                "Tổng giá trị",
                                `${new Intl.NumberFormat("vi-VN").format(totalWatchCost)} VND`,
                            ],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <div className="text-xs uppercase tracking-wide text-slate-500">
                                    {label}
                                </div>
                                <div className="mt-1 text-base font-semibold text-slate-900">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-6">
                        <section className="rounded-3xl border border-slate-200 bg-white">
                            <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
                                <div className="rounded-2xl border border-slate-200 p-2">
                                    <Box className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">
                                        Thông tin phiếu
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Vendor, thời gian tiếp nhận, loại phiếu và ghi chú chung.
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                                <VendorQuickField
                                    value={vendorId}
                                    vendors={vendors}
                                    disabled={submitting}
                                    onChange={setVendorId}
                                    onVendorsChange={setVendors}
                                />

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-800">
                                        Ngày nhập
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={createdAt}
                                        onChange={(e) => setCreatedAt(e.target.value)}
                                        className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-800">
                                        Tiền tệ
                                    </label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-800">
                                        Loại phiếu
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="PURCHASE">PURCHASE</option>
                                        <option value="BUY_BACK">BUY_BACK</option>
                                        <option value="TRADE_IN">TRADE_IN</option>
                                        <option value="CONSIGNMENT">CONSIGNMENT</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-800">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white">
                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">
                                        Danh sách watch
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Chọn nhiều ảnh từ NAS, hệ thống sẽ đổ vào các dòng đang trống trước rồi mới thêm dòng mới.
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">


                                    <AcquisitionBulkImagePicker
                                        onImport={importPreparedImages}
                                        disabled={submitting}
                                    />


                                    <button
                                        type="button"
                                        onClick={addWatchLine}
                                        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm dòng watch
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 p-5">
                                {watchLines.map((line, index) => (
                                    <WatchLineCard
                                        key={line.id}
                                        line={line}
                                        index={index}
                                        onChange={(next) => updateLine(line.id, next)}
                                        onRemove={() => removeLine(line.id)}
                                        canRemove={watchLines.length > 1}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="text-lg font-semibold text-slate-900">Lưu phiếu</div>
                            <div className="mt-1 text-sm text-slate-500">
                                Phiếu được tạo ở trạng thái draft. Khi post, AI gen spec sẽ chạy sau và không chặn việc post.
                            </div>

                            <button
                                type="button"
                                disabled={submitting}
                                onClick={submit}
                                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {submitting ? "Đang lưu..." : "Lưu phiếu nhập"}
                            </button>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
