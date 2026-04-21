"use client";

import { useMemo, useState } from "react";
import { Box, Plus, Save } from "lucide-react";
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

export default function AcquisitionFormClient({ vendors }: Props) {
    const [vendorId, setVendorId] = useState("");
    const [createdAt, setCreatedAt] = useState(() => {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    });
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
            alert("Vui lòng chọn vendor.");
            return;
        }

        if (!watchLines.length) {
            alert("Cần ít nhất một dòng đồng hồ.");
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
            alert("Phiếu nhập chưa có dữ liệu watch hợp lệ.");
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

            alert("Đã lưu phiếu nhập");
        } catch (e: any) {
            alert(e?.message || "Lưu phiếu nhập thất bại");
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
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-800">
                                        Vendor
                                    </label>
                                    <select
                                        value={vendorId}
                                        onChange={(e) => setVendorId(e.target.value)}
                                        className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="">-- Chọn vendor --</option>
                                        {vendors.map((vendor) => (
                                            <option key={vendor.id} value={vendor.id}>
                                                {vendor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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