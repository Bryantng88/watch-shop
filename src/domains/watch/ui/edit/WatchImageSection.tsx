"use client";

import { ImageIcon } from "lucide-react";
import MediaPickerMulti, {
    type PickedMediaItem,
} from "@/components/media/MediaPickerMulti";
import { SectionCard } from "./shared";
import SectionReviewActions from "../review/SectionReviewActions";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import GuardNotice from "@/domains/shared/feedback/GuardNotice";
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
    isFormDirty?: boolean;
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
function getMediaKey(item: PickedMediaItem) {
    return String(
        (item as any)?.key ??
        (item as any)?.fileKey ??
        ""
    ).trim();
}

function dedupeMediaItems(items: PickedMediaItem[]) {
    const map = new Map<string, PickedMediaItem>();

    for (const item of items) {
        const key = getMediaKey(item);
        if (!key) continue;
        map.set(key, item);
    }

    return Array.from(map.values());
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
    isFormDirty
}: Props) {
    const dialog = useAppDialog();
    const notify = useNotify();

    const currentReviewStatus = normalizeStatus(imageReviewStatus);
    const locked =
        currentReviewStatus === "APPROVED" ||
        (currentReviewStatus === "SUBMITTED" && !canReviewContent);

    const ensureEditable = async () => {
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

    const handlePoolImagesChange = async (items: PickedMediaItem[]) => {
        if (locked) return;

        const ok = await ensureEditable();
        if (!ok) return;

        onPoolImagesChange(items);
    };

    const handleGalleryImagesChange = async (items: PickedMediaItem[]) => {
        if (locked) return;

        const ok = await ensureEditable();
        if (!ok) return;

        const nextGalleryKeys = new Set(items.map(getMediaKey).filter(Boolean));

        const removedFromGallery = galleryImages.filter((item) => {
            const key = getMediaKey(item);
            return key && !nextGalleryKeys.has(key);
        });

        const nextPoolImages = dedupeMediaItems([
            ...poolImages.filter((item) => {
                const key = getMediaKey(item);
                return key && !nextGalleryKeys.has(key);
            }),
            ...removedFromGallery,
        ]);

        onGalleryImagesChange(items);
        onPoolImagesChange(nextPoolImages);
    };

    return (
        <SectionCard
            icon={<ImageIcon className="h-5 w-5" />}
            title="Hình ảnh"
            subtitle="Chỉ quản lý ảnh gallery của watch. Ảnh đại diện dùng role INLINE riêng."
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
                    <GuardNotice
                        tone={currentReviewStatus === "APPROVED" ? "warning" : "locked"}
                        icon={currentReviewStatus === "APPROVED" ? "warning" : "lock"}
                        title={
                            currentReviewStatus === "APPROVED"
                                ? "Hình ảnh đã được duyệt"
                                : "Hình ảnh đang chờ duyệt"
                        }
                        message={
                            currentReviewStatus === "APPROVED"
                                ? "Muốn chỉnh sửa gallery, cần mở lại trạng thái Draft."
                                : "Hình ảnh đang chờ admin duyệt nên tạm thời không thể chỉnh sửa."
                        }
                        action={
                            currentReviewStatus === "APPROVED" && canReviewContent ? (
                                <button
                                    type="button"
                                    onClick={ensureEditable}
                                    className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Mở chỉnh sửa
                                </button>
                            ) : null
                        }
                    />
                ) : null}

                <div
                    className={[
                        "rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/80 to-white p-4",
                        locked ? "pointer-events-none opacity-60" : "",
                    ].join(" ")}
                >
                    <MediaPickerMulti
                        chosenValue={poolImages}
                        selectedValue={galleryImages}
                        onChosenChange={handlePoolImagesChange}
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