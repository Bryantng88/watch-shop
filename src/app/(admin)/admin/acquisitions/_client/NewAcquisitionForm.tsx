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
        aiDraft: null,
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

    const vendorName = useMemo(
        () => vendors.find((v) => v.id === vendorId)?.name || null,
        [vendorId, vendors]
    );

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
                            Giữ nguyên logic hiện tại, thêm inline image picker và AI draft cho từng dòng đồng hồ.
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
                                            <option value="PURCHASE">PURCHASE</option>
                                            <option value="CONSIGNMENT">CONSIGNMENT</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white">
                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                                <div className="space-y-1">
                                    <div className="text-lg font-semibold text-slate-900">Danh sách đồng hồ</div>
                                    <div className="text-sm text-slate-500">
                                        Mỗi dòng có inline image picker riêng để AI draft title/spec chính xác hơn.
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={addWatchLine}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm đồng hồ
                                </button>
                            </div>

                            <div className="space-y-5 p-5">
                                {watchLines.map((line, idx) => (
                                    <WatchLineCard
                                        key={line.id}
                                        line={line}
                                        index={idx}
                                        vendorName={vendorName}
                                        onChange={(next) => updateLine(line.id, next)}
                                        onRemove={() => removeLine(line.id)}
                                    />
                                ))}

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={addWatchLine}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm đồng hồ
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-slate-200 bg-white">
                            <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
                                <div className="rounded-2xl border border-slate-200 p-2">
                                    <Box className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">Tổng quan phiếu</div>
                                    <div className="text-sm text-slate-500">
                                        Tóm tắt nhanh để đối chiếu trước khi lưu.
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 p-5">
                                {[
                                    ["Tổng đồng hồ", `${new Intl.NumberFormat("vi-VN").format(totalWatchCost)} VND`],
                                    ["Tổng dây", "0 VND"],
                                    ["Tổng giá trị phiếu", `${new Intl.NumberFormat("vi-VN").format(totalWatchCost)} VND`],
                                ].map(([label, value], idx) => (
                                    <div
                                        key={label}
                                        className={idx === 2
                                            ? "rounded-2xl bg-slate-950 px-4 py-4 text-white"
                                            : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"}
                                    >
                                        <div className={idx === 2 ? "text-sm text-slate-200" : "text-sm text-slate-500"}>
                                            {label}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="text-lg font-semibold text-slate-900">Hướng dẫn nhập nhanh</div>
                                <div className="text-sm text-slate-500">
                                    Dùng hint riêng từng dòng nếu có thông tin mắt thường biết mà AI khó nhìn ra.
                                </div>
                            </div>

                            <div className="space-y-5 p-5 text-sm text-slate-700">
                                <div>
                                    <div className="mb-2 font-medium text-slate-900">Ví dụ hint tốt</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "niềng 18K gold",
                                            "case 18K gold",
                                            "máy pin",
                                            "mặt champagne",
                                            "dây da thay ngoài",
                                        ].map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                                    Ref và năm sản xuất chỉ nên coi là candidate/estimate nếu chưa có ảnh caseback hoặc macro text.
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>

            <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Tổng giá trị phiếu{" "}
                        <span className="ml-2 text-xl font-semibold text-slate-900">
                            {new Intl.NumberFormat("vi-VN").format(totalWatchCost)} VND
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={submit}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        {submitting ? "Đang lưu..." : "Lưu phiếu nhập"}
                    </button>
                </div>
            </div>
        </div>
    );
}