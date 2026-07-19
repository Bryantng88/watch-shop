"use client";

import { useState } from "react";
import { ArchiveRestore, Camera, ChevronDown, Images, Settings2 } from "lucide-react";

type Props = {
    selectedCount: number;
    photoshootEligibleCount?: number;
    mediaReviewEligibleCount?: number;
    submittingPhotoshoot?: boolean;
    submittingMediaReview?: boolean;
    onRequestPhotoshoot?: () => void;
    onRequestMediaReview?: () => void;
    onCustomizeDashboard?: () => void;
    showSelectionActions?: boolean;
    duplicateView?: boolean;
    onToggleDuplicateView?: () => void;
};

export default function WatchListToolbar({
    selectedCount,
    photoshootEligibleCount = 0,
    mediaReviewEligibleCount = 0,
    submittingPhotoshoot = false,
    submittingMediaReview = false,
    onRequestPhotoshoot,
    onRequestMediaReview,
    onCustomizeDashboard,
    showSelectionActions = true,
    duplicateView = false,
    onToggleDuplicateView,
}: Props) {
    const canRequestPhotoshoot = selectedCount > 0 && photoshootEligibleCount > 0;
    const canRequestMediaReview = selectedCount > 0 && mediaReviewEligibleCount > 0;
    const submitting = submittingPhotoshoot || submittingMediaReview;
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    function runPhotoshootRequest() {
        setIsActionMenuOpen(false);
        onRequestPhotoshoot?.();
    }

    function runMediaReviewRequest() {
        setIsActionMenuOpen(false);
        onRequestMediaReview?.();
    }

    return (
        <div className="flex flex-col gap-4 px-1 py-1 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[26px] font-semibold tracking-[-0.035em] text-slate-950">
                        Danh sách watch
                    </h1>
                    {duplicateView ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Đang xem hàng chờ trùng
                        </span>
                    ) : null}
                </div>

                <p className="mt-1.5 text-[13px] text-slate-500">
                    Quản lý domain watch riêng, nhưng giữ đúng cảm giác thao tác nhanh như list sản phẩm cũ.
                </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3 self-start">
                <button
                    type="button"
                    onClick={onToggleDuplicateView}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <ArchiveRestore className="h-4 w-4" />
                    {duplicateView ? "Về danh sách Watch" : "Watch trùng"}
                </button>
                <button
                    type="button"
                    onClick={onCustomizeDashboard}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <Settings2 className="h-4 w-4" />
                    Tùy chỉnh dashboard
                </button>

                {showSelectionActions && selectedCount > 0 ? <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsActionMenuOpen((value) => !value)}
                        disabled={selectedCount <= 0 || submitting}
                        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                    >
                        {submitting ? "Đang gửi..." : "Thao tác"}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {isActionMenuOpen ? (
                        <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-xl">
                            <button
                                type="button"
                                onClick={runPhotoshootRequest}
                                disabled={!canRequestPhotoshoot || submitting}
                                className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title={
                                    selectedCount > 0 && photoshootEligibleCount === 0
                                        ? "Watch đã chọn đều đã có ảnh"
                                        : "Gửi Watch chưa có ảnh sang Photoshoot Workspace"
                                }
                            >
                                <Camera className="mt-0.5 h-4 w-4 text-slate-500" />
                                <span>
                                    <span className="block font-semibold text-slate-900">
                                        Gửi sang WP Photoshoot
                                    </span>
                                    <span className="mt-0.5 block text-xs text-slate-500">
                                        {photoshootEligibleCount} watch chưa có ảnh trong {selectedCount} watch đã chọn
                                    </span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={runMediaReviewRequest}
                                disabled={!canRequestMediaReview || submitting}
                                className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title={
                                    selectedCount > 0 && mediaReviewEligibleCount === 0
                                        ? "Watch đã chọn chưa có ảnh để xử lý media"
                                        : "Gửi Watch đã có ảnh sang Workspace Xử lý Media"
                                }
                            >
                                <Images className="mt-0.5 h-4 w-4 text-slate-500" />
                                <span>
                                    <span className="block font-semibold text-slate-900">
                                        Gửi sang WP Xử lý Media
                                    </span>
                                    <span className="mt-0.5 block text-xs text-slate-500">
                                        {mediaReviewEligibleCount} watch đã có ảnh trong {selectedCount} watch đã chọn
                                    </span>
                                </span>
                            </button>
                        </div>
                    ) : null}
                </div> : null}
                {showSelectionActions && selectedCount > 0 ? <div className="inline-flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4">
                    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                        Đã chọn
                    </div>
                    <div className="text-xl font-semibold leading-none text-slate-950">
                        {selectedCount}
                    </div>
                </div> : null}
            </div>
        </div>
    );
}
