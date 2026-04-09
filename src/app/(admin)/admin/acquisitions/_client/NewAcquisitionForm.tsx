"use client";

import { useMemo, useState } from "react";
import { Box, Plus, Save } from "lucide-react";
import WatchLineCard from "./WatchLineCard";
import type { AcquisitionWatchLine } from "../_server/acquisition-line.types";

type Vendor = { id: string; name: string };

type Props = {
    vendors: Vendor[];
};

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

function createEmptyWatchLine(): AcquisitionWatchLine {
    return {
        id: uid(),
        kind: "WATCH",
        quickInput: "",
        aiHint: "",
        quantity: 1,
        cost: "",
        receiveService: true,
        imageKey: null,
        imageUrl: null,
    };
}

export default function NewAcquisitionForm({ vendors }: Props) {
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
            const qty = Number(line.quantity || 1);
            return sum + cost * qty;
        }, 0);
    }, [watchLines]);

    const updateLine = (id: string, next: AcquisitionWatchLine) => {
        setWatchLines((prev) => prev.map((line) => (line.id === id ? next : line)));
    };

    const removeLine = (id: string) => {
        setWatchLines((prev) => prev.filter((line) => line.id !== id));
    };

    const addWatchLine = () => {
        setWatchLines((prev) => [...prev, createEmptyWatchLine()]);
    };

    const submit = async () => {
        if (!vendorId) {
            alert("Vui lòng chọn vendor.");
            return;
        }

        if (!watchLines.length) {
            alert("Cần ít nhất một dòng đồng hồ.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/admin/acquisitions/inline-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendorId,
                    createdAt: new Date(createdAt).toISOString(),
                    currency,
                    type,
                    notes: notes || null,
                    items: watchLines,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Lưu phiếu nhập thất bại");

            alert("Đã lưu phiếu nhập");
        } catch (e: any) {
            alert(e?.message || "Lưu phiếu nhập thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-slate-900">Tạo phiếu nhập</h1>
                        <p className="text-sm text-slate-500">
                            Dòng nhập lưu ảnh + gợi ý AI, còn việc phân tích AI sẽ chỉ chạy khi post phiếu.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {[
                            ["Trạng thái", "DRAFT"],
                            ["Tổng đồng hồ", String(watchLines.length)],
                            ["Tổng dây", "0"],
                            ["Tổng giá trị", `${new Intl.NumberFormat("vi-VN").format(totalWatchCost)} VND`],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                                <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
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
                                    <div className="text-lg font-semibold text-slate-900">Thông tin phiếu</div>
                                    <div className="text-sm text-slate-500">
                                        Vendor, thời gian tiếp nhận, loại phiếu và ghi chú chung.
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-800">Vendor</label>
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
                                    <label className="mb-2 block text-sm font-medium text-slate-800">Ngày nhập</label>
                                    <input
                                        type="datetime-local"
                                        value={createdAt}
                                        onChange={(e) => setCreatedAt(e.target.value)}
                                        className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-800">Ghi chú</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={5}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-800">Tiền tệ</label>
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
                                        <label className="mb-2 block text-sm font-medium text-slate-800">Loại phiếu</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="h-[44px] w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                                        >
                                            <option value="PURCHASE">Purchase</option>
                                            <option value="BUY_BACK">Buy back</option>
                                            <option value="TRADE_IN">Trade-in</option>
                                            <option value="CONSIGNMENT">Consignment</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">Danh sách đồng hồ</div>
                                    <div className="text-sm text-slate-500">
                                        Ảnh chỉ dùng để AI đọc khi bạn post phiếu nhập.
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={addWatchLine}
                                    className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm dòng
                                </button>
                            </div>

                            <div className="space-y-4 p-5">
                                {watchLines.map((line, index) => (
                                    <WatchLineCard
                                        key={line.id}
                                        index={index}
                                        line={line}
                                        canRemove={watchLines.length > 1}
                                        onRemove={() => removeLine(line.id)}
                                        onChange={(next) => updateLine(line.id, next)}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-4">
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">Hành động</div>
                            <div className="mt-4 space-y-3">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={submit}
                                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" />
                                    {submitting ? "Đang lưu..." : "Lưu phiếu nhập"}
                                </button>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>
        </div>
    );
}
