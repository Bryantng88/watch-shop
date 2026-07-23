"use client";

import { useState } from "react";
import { ArchiveRestore, Camera, ChevronDown, Images, Watch as WatchIcon } from "lucide-react";
import {
    BusinessListPageHeader,
    DashboardCustomizeButton,
} from "@/domains/shared/ui/business-list";

type Props = {
    audienceSegment?: "MEN" | "WOMEN";
    onAudienceSegmentChange?: (segment: "MEN" | "WOMEN") => void;
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
    audienceSegment = "MEN",
    onAudienceSegmentChange,
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
        <BusinessListPageHeader
            title={
                <span className="flex flex-wrap items-center gap-3">
                    Watch
                    {duplicateView ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Đang xem hàng chờ trùng
                        </span>
                    ) : null}
                </span>
            }
            icon={<WatchIcon className="h-5 w-5" />}
            meta={<span>Danh mục đồng hồ · Nội dung, media và trạng thái sẵn sàng</span>}
            actions={
                <>
                <div
                    className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold"
                    aria-label="Chọn danh sách Watch"
                >
                    {(["MEN", "WOMEN"] as const).map((segment) => (
                        <button
                            key={segment}
                            type="button"
                            onClick={() => onAudienceSegmentChange?.(segment)}
                            aria-pressed={audienceSegment === segment}
                            className={`h-8 rounded-lg px-3 transition ${
                                audienceSegment === segment
                                    ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/70"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {segment === "MEN" ? "Nam" : "Nữ"}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onToggleDuplicateView}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <ArchiveRestore className="h-4 w-4" />
                    {duplicateView ? "Về danh sách Watch" : "Watch trùng"}
                </button>
                <DashboardCustomizeButton onClick={onCustomizeDashboard} />

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
                </>
            }
        />
    );
}
