"use client";

import { useEffect, useState } from "react";
import { useNotify } from "@/components/feedback/AppToastProvider";

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved?: () => void;
    serviceRequestId: string | null;

    productName?: string;
    productSku?: string;
    productImage?: string;
    movementSpecLabel?: string;
};

type MachineStatus = "GOOD" | "NEED_SERVICE";

export default function TechnicalAssessmentModal({
    open,
    onClose,
    onSaved,
    serviceRequestId,
    productName,
    productSku,
    productImage,
    movementSpecLabel,
}: Props) {
    const notify = useNotify();

    const [machineStatus, setMachineStatus] = useState<MachineStatus>("GOOD");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setMachineStatus("GOOD");
    }, [open]);

    if (!open || !serviceRequestId) return null;

    const handleOpenIssue = async () => {
        const confirm = window.confirm("Tạo technical issue cho hạng mục này?");
        if (!confirm) return;

        try {
            const res = await fetch(`/api/admin/technical-issues`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serviceRequestId,
                    type: "GENERAL",
                }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể tạo issue");
            }

            notify.success({
                title: "Đã tạo technical issue",
                message: "Issue đã được thêm vào Issue Board",
            });
        } catch (e: any) {
            notify.error({
                title: "Lỗi tạo issue",
                message: e?.message || "Có lỗi xảy ra",
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/technical-assessment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    machineStatus,
                }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể lưu");
            }

            notify.success({
                title: "Đã lưu đánh giá kỹ thuật",
            });

            onSaved?.();
        } catch (e: any) {
            notify.error({
                title: "Lỗi lưu",
                message: e?.message || "Có lỗi xảy ra",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <div className="text-lg font-semibold">Đánh giá kỹ thuật</div>
                        <div className="text-xs text-gray-500">
                            Service Request: {serviceRequestId}
                        </div>
                    </div>

                    <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
                        Đóng
                    </button>
                </div>

                {/* BODY */}
                <div className="space-y-5 p-5">

                    {/* PRODUCT */}
                    <div className="flex gap-4 rounded-lg border p-4">
                        {productImage ? (
                            <img
                                src={`/api/media/sign?key=${encodeURIComponent(productImage)}`}
                                className="h-16 w-16 rounded-lg border object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border text-xs text-gray-400">
                                No image
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="font-medium">{productName || "-"}</div>
                            <div className="text-sm text-gray-500">SKU: {productSku || "-"}</div>
                            <div className="text-xs text-gray-400">
                                Bộ máy (spec): {movementSpecLabel || "-"}
                            </div>
                        </div>
                    </div>

                    {/* MACHINE */}
                    <div className="rounded-xl border p-4">
                        <div className="mb-3 font-medium">Đánh giá máy</div>

                        <div className="flex gap-3">
                            <button
                                className={`rounded-lg border px-4 py-2 text-sm ${machineStatus === "GOOD" ? "bg-green-50 border-green-400" : ""
                                    }`}
                                onClick={() => setMachineStatus("GOOD")}
                            >
                                Chạy tốt
                            </button>

                            <button
                                className={`rounded-lg border px-4 py-2 text-sm ${machineStatus === "NEED_SERVICE" ? "bg-orange-50 border-orange-400" : ""
                                    }`}
                                onClick={() => setMachineStatus("NEED_SERVICE")}
                            >
                                Cần xử lý
                            </button>
                        </div>

                        {machineStatus === "NEED_SERVICE" && (
                            <div className="mt-4 rounded-lg border border-orange-300 bg-orange-50 p-3 text-sm text-orange-700">
                                Máy cần xử lý kỹ thuật
                            </div>
                        )}

                        {/* ACTION */}
                        {machineStatus === "NEED_SERVICE" && (
                            <div className="mt-4">
                                <button
                                    onClick={handleOpenIssue}
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    + Mở technical issue
                                </button>
                            </div>
                        )}
                    </div>

                    {/* FUTURE BLOCK (điểm đánh giá sẽ đặt ở đây phase sau) */}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 border-t px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-sm"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                    >
                        {loading ? "Đang lưu..." : "Lưu đánh giá"}
                    </button>
                </div>
            </div>
        </div>
    );
}