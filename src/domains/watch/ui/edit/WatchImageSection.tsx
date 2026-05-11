"use client";

import { ImageIcon } from "lucide-react";
import MediaPickerMulti, {
    type PickedMediaItem,
} from "@/components/media/MediaPickerMulti";
import { SectionCard } from "./shared";
import SectionReviewActions from "../review/SectionReviewActions";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type Props = {
    poolImages: PickedMediaItem[];
    galleryImages: PickedMediaItem[];
    onPoolImagesChange: (items: PickedMediaItem[]) => void;
    onGalleryImagesChange: (items: PickedMediaItem[]) => void;
    error?: string | null;
    productId: string;
    imageReviewStatus?: string | null;
    imageReviewNote?: string | null;
    canReviewContent?: boolean;
    onBeforeSubmitReview?: () => Promise<boolean>;
    onReviewStatusChange?: (next: {
        status: ReviewStatus;
        reviewNote?: string | null;
    }) => void;
    inlineImage?: PickedMediaItem | null;
    watchTitle?: string | null;
};

function normalizeStatus(status?: string | null): ReviewStatus {
    const value = String(status ?? "DRAFT").toUpperCase();

    if (
        value === "SUBMITTED" ||
        value === "APPROVED" ||
        value === "REJECTED"
    ) {
        return value;
    }

    return "DRAFT";
}

function InfoChip({
    label,
    value,
    tone = "default",
}: {
    label: string;
    value: string;
    tone?: "default" | "primary";
}) {
    const cls =
        tone === "primary"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <div
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
        >
            {label}: {value}
        </div>
    );
}

export default function WatchImageSection({
    poolImages,
    galleryImages,
    onPoolImagesChange,
    onGalleryImagesChange,
    error,
    productId,
    inlineImage,
    watchTitle,
    imageReviewStatus,
    imageReviewNote,
    canReviewContent = false,
    onReviewStatusChange,
    onBeforeSubmitReview,
}: Props) {
    const dialog = useAppDialog();
    const notify = useNotify();

    const currentReviewStatus = normalizeStatus(imageReviewStatus);
    const locked =
        currentReviewStatus === "APPROVED" ||
        (currentReviewStatus === "SUBMITTED" && !canReviewContent);

    const handleBeforeOpen = async () => {
        if (currentReviewStatus !== "APPROVED") return true;

        if (!canReviewContent) {
            await dialog.alert({
                title: "Hình ảnh đã được duyệt",
                message:
                    "Chỉ admin mới có quyền mở lại để chỉnh sửa hình ảnh đã duyệt.",
                tone: "warning",
            });
            return false;
        }

        const ok = await dialog.confirm({
            title: "Mở chỉnh sửa hình ảnh?",
            message:
                "Hình ảnh đã được duyệt. Nếu chỉnh sửa lại, trạng thái sẽ chuyển về Draft và cần duyệt lại.",
            confirmText: "Mở chỉnh sửa",
            cancelText: "Hủy",
            tone: "warning",
        });

        if (!ok) return false;

        const res = await fetch(`/api/admin/watches/${productId}/image-draft`, {
            method: "POST",
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            await dialog.alert({
                title: "Không thể mở chỉnh sửa",
                message: json?.error || "Không thể chuyển hình ảnh về Draft.",
                tone: "danger",
            });
            return false;
        }

        onReviewStatusChange?.({
            status: "DRAFT",
            reviewNote: null,
        });

        notify.success({
            title: "Đã mở chỉnh sửa",
            message: "Hình ảnh đã chuyển về Draft.",
        });

        return true;
    };

    const handleChosenImagesChange = (items: PickedMediaItem[]) => {
        if (locked) return;
        onPoolImagesChange(items);
    };

    const handleGalleryImagesChange = (items: PickedMediaItem[]) => {
        if (locked) return;
        onGalleryImagesChange(items);
    };

    return (
        <SectionCard
            icon={<ImageIcon className="h-5 w-5" />}
            title="Hình ảnh"
            subtitle="Chỉ quản lý ảnh gallery của watch. Ảnh đại diện dùng role INLINE riêng."
            onBeforeOpen={handleBeforeOpen}
            actions={
                <SectionReviewActions
                    productId={productId}
                    target="image"
                    status={imageReviewStatus}
                    reviewNote={imageReviewNote}
                    canReviewContent={canReviewContent}
                    onBeforeSubmit={onBeforeSubmitReview}
                    onStatusChange={(next) => {
                        onReviewStatusChange?.(next);
                    }}
                />
            }
        >
            <div className="space-y-4">
                {locked ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {currentReviewStatus === "APPROVED"
                            ? "Hình ảnh đã được duyệt. Muốn chỉnh sửa lại cần admin mở về Draft."
                            : "Hình ảnh đang chờ duyệt nên tạm khóa chỉnh sửa."}
                    </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                    <InfoChip
                        label="Trong chosen"
                        value={String(poolImages.length)}
                    />
                    <InfoChip
                        label="Gallery sẽ lưu"
                        value={`${galleryImages.length}/10`}
                        tone="primary"
                    />
                </div>

                <div
                    className={[
                        "rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/80 to-white p-4",
                        locked ? "pointer-events-none opacity-60" : "",
                    ].join(" ")}
                >
                    <MediaPickerMulti
                        chosenValue={poolImages}
                        selectedValue={galleryImages}
                        onChosenChange={handleChosenImagesChange}
                        onSelectedChange={handleGalleryImagesChange}
                        maxFinalSelection={10}
                        profile="edit"
                        title="Ảnh gallery"
                        description="Chỉ chọn ảnh gallery. Ảnh đại diện INLINE được quản lý riêng cho header/list thumbnail."
                        contextImage={{
                            src:
                                inlineImage?.url ??
                                (inlineImage as any)?.imageUrl ??
                                (inlineImage as any)?.src ??
                                null,
                            title: watchTitle || "Watch đang chỉnh",
                            subtitle: "Ảnh đại diện INLINE của watch hiện tại",
                        }}
                    />
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {error}
                    </div>
                ) : null}
            </div>
        </SectionCard>
    );
}