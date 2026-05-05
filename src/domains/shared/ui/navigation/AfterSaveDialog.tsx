"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft, Eye, PenLine } from "lucide-react";

type Props = {
    open: boolean;
    title?: string;
    message?: string;
    detailHref: string;
    fallbackBackHref?: string;
    onContinue: () => void;
};

export default function AfterSaveDialog({
    open,
    title = "Đã lưu thành công",
    message = "Bạn muốn tiếp tục chỉnh sửa hay điều hướng sang màn hình khác?",
    detailHref,
    fallbackBackHref = "/admin/watches",
    onContinue,
}: Props) {
    const router = useRouter();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-slate-950">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <PenLine className="h-4 w-4" />
                        Chỉnh tiếp
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (window.history.length > 1) {
                                router.back();
                            } else {
                                router.push(fallbackBackHref);
                            }
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(detailHref)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        <Eye className="h-4 w-4" />
                        Xem detail
                    </button>
                </div>
            </div>
        </div>
    );
}