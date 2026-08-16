"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, ImageIcon, Sparkles, Undo2, X } from "lucide-react";
import { TaskKind } from "@prisma/client";
import MediaPickerMulti, {
    type PickedMediaItem,
} from "@/components/media/MediaPickerMulti";
import MediaBrowserDialog from "@/components/media/MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { SectionCard } from "./shared";
import SectionReviewActions from "../review/SectionReviewActions";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import GuardNotice from "@/domains/shared/feedback/GuardNotice";
import { getTaskQuickCreateDataAction } from "@/domains/task/actions/task.actions";
import TaskQuickCreateModal, {
    type TaskQuickCreateContext,
    type TaskUserOption,
} from "@/domains/task/ui/quick-create/TaskQuickCreateModal";
import { TaskSignalIcon } from "@/domains/shared/ui/icons";
import { waitForOperationProjectionDeliveries } from "@/domains/coordination/ui/operation-delivery.client";
import {
    DEFAULT_PHOTOROOM_ADJUSTMENT,
    type PhotoRoomAdjustment,
} from "@/domains/watch/shared/photoroom-adjustment";
import PhotoRoomAdjustmentDialog from "./PhotoRoomAdjustmentDialog";
type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type MediaItemWithAliases = PickedMediaItem & {
    fileKey?: string | null;
    imageUrl?: string | null;
    src?: string | null;
};

type Props = {
    sectionMode?: "combined" | "gallery" | "cover";
    poolImages: PickedMediaItem[];
    galleryImages: PickedMediaItem[];
    onPoolImagesChange: (items: PickedMediaItem[]) => void;
    onGalleryImagesChange: (items: PickedMediaItem[]) => void;
    error?: string | null;
    productId: string;
    watchId: string;
    imageReviewStatus?: string | null;
    imageReviewNote?: string | null;
    canReviewContent?: boolean;
    onBeforeSubmitReview?: (target: "content" | "image") => Promise<boolean>;
    onReviewStatusChange?: (next: {
        status: ReviewStatus;
        reviewNote?: string | null;
    }) => void;
    inlineImage?: PickedMediaItem | null;
    coverImage?: PickedMediaItem | null;
    onCoverImageChange?: (item: PickedMediaItem | null) => void;
    watchTitle?: string | null;
    storefrontSlug?: string | null;
    contentReviewStatus?: string | null;
    productStatus?: string | null;
    saleStage?: string | null;
    serviceStage?: string | null;
    salePrice?: string | null;
    showPrice?: boolean;
    storefrontVisible?: boolean | null;
    onStorefrontSlugChange?: (slug: string) => void;
    isFormDirty?: boolean;
    openTaskCount?: number;
    hideReviewActions?: boolean;
    mediaActions?: React.ReactNode;
    collapsible?: boolean;
    surface?: "card" | "flat";
    audienceSegment?: "MEN" | "WOMEN" | "UNISEX";
    entryPoint?: "WATCH_LIST_QUICK" | null;
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

function getMediaKey(item: PickedMediaItem) {
    const media = item as MediaItemWithAliases;

    return String(
        media.key ??
        media.fileKey ??
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
    sectionMode = "combined",
    poolImages,
    galleryImages,
    onPoolImagesChange,
    onGalleryImagesChange,
    error,
    productId,
    watchId,
    inlineImage,
    coverImage,
    onCoverImageChange,
    watchTitle,
    storefrontSlug,
    contentReviewStatus,
    productStatus,
    saleStage,
    serviceStage,
    salePrice,
    showPrice = true,
    storefrontVisible,
    onStorefrontSlugChange,
    imageReviewStatus,
    imageReviewNote,
    canReviewContent = false,
    onReviewStatusChange,
    onBeforeSubmitReview,
    isFormDirty,
    openTaskCount = 0,
    hideReviewActions = false,
    mediaActions,
    collapsible = true,
    surface = "card",
    audienceSegment = "MEN",
    entryPoint = null,
}: Props) {
    const showGallery = sectionMode !== "cover";
    const showCover = sectionMode !== "gallery";
    const initiallyVisibleByStandardFlow =
        Boolean(getMediaKey(coverImage ?? ({} as PickedMediaItem))) &&
        Boolean(storefrontSlug?.trim()) &&
        ["AVAILABLE", "HOLD", "SOLD"].includes(String(productStatus ?? "").toUpperCase()) &&
        ["READY", "HOLD", "SOLD"].includes(String(saleStage ?? "").toUpperCase()) &&
        ["NOT_REQUIRED", "DONE"].includes(String(serviceStage ?? "").toUpperCase()) &&
        String(contentReviewStatus ?? "").toUpperCase() === "APPROVED" &&
        String(imageReviewStatus ?? "").toUpperCase() === "APPROVED" &&
        (!showPrice || Number(salePrice ?? 0) > 0);
    const dialog = useAppDialog();
    const notify = useNotify();
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [coverPickerOpen, setCoverPickerOpen] = useState(false);
    const [coverPreviewOpen, setCoverPreviewOpen] = useState(false);
    const [coverPickerVersion, setCoverPickerVersion] = useState(0);
    const [pendingCoverKey, setPendingCoverKey] = useState<string | null>(null);
    const [coverPending, setCoverPending] = useState(false);
    const [publishPending, setPublishPending] = useState(false);
    const [quickPublished, setQuickPublished] = useState(
        storefrontVisible === true || (storefrontVisible == null && initiallyVisibleByStandardFlow),
    );
    const [photoRoomPending, setPhotoRoomPending] = useState(false);
    const [photoRoomAdjustmentOpen, setPhotoRoomAdjustmentOpen] = useState(false);
    const [photoRoomSourceKey, setPhotoRoomSourceKey] = useState<string | null>(null);
    const [hasPhotoRoomResult, setHasPhotoRoomResult] = useState(() =>
        getMediaKey(coverImage ?? ({} as PickedMediaItem)).includes("photoroom-"),
    );
    const [photoRoomAdjustment, setPhotoRoomAdjustment] = useState<PhotoRoomAdjustment>(DEFAULT_PHOTOROOM_ADJUSTMENT);
    const [sharpPending, setSharpPending] = useState(false);
    const [sharpCutoutKey, setSharpCutoutKey] = useState<string | null>(null);
    const [localLayoutBaseKey, setLocalLayoutBaseKey] = useState<string | null>(null);
    const [localLayoutBaseAdjustment, setLocalLayoutBaseAdjustment] = useState<PhotoRoomAdjustment | null>(null);
    const [taskUsers, setTaskUsers] = useState<TaskUserOption[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [taskContext, setTaskContext] = useState<TaskQuickCreateContext | null>(null);
    const storefrontChecks = [
        { label: "Cover storefront", ok: Boolean(getMediaKey(coverImage ?? ({} as PickedMediaItem))) },
        { label: "Đường dẫn storefront", ok: Boolean(storefrontSlug?.trim()) },
        { label: "Trạng thái sản phẩm", ok: ["AVAILABLE", "HOLD", "SOLD"].includes(String(productStatus ?? "").toUpperCase()) },
        { label: "Trạng thái bán", ok: ["READY", "HOLD", "SOLD"].includes(String(saleStage ?? "").toUpperCase()) },
        { label: "Service hoàn tất/không cần", ok: ["NOT_REQUIRED", "DONE"].includes(String(serviceStage ?? "").toUpperCase()) },
        { label: "Content đã duyệt", ok: String(contentReviewStatus ?? "").toUpperCase() === "APPROVED" },
        { label: "Hình ảnh đã duyệt", ok: String(imageReviewStatus ?? "").toUpperCase() === "APPROVED" },
        { label: "Giá bán hợp lệ", ok: Number(salePrice ?? 0) > 0 },
    ];
    const storefrontReady = storefrontChecks.every((item) => item.ok);
    const [taskPending, startTaskTransition] = useTransition();

    const currentReviewStatus = normalizeStatus(imageReviewStatus);
    const currentCoverKey = coverImage ? getMediaKey(coverImage) : "";
    const coverPreviewSrc = resolveMediaPreviewSrc(pendingCoverKey ?? currentCoverKey);
    const locked =
        currentReviewStatus === "APPROVED" ||
        (currentReviewStatus === "SUBMITTED" && !canReviewContent);

    useEffect(() => {
        if (!coverPreviewOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setCoverPreviewOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [coverPreviewOpen]);

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

    const handleCoverConfirm = async () => {
        const storageKey = pendingCoverKey?.trim();
        if (!storageKey || coverPending) return;

        setCoverPending(true);
        try {
            const res = await fetch(`/api/admin/watches/${productId}/storefront-image`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ storageKey, entryPoint }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                notify.error({
                    title: "Không thể cập nhật Cover",
                    message: json?.error || "Có lỗi khi chọn ảnh Cover.",
                });
                return;
            }
            await waitForOperationProjectionDeliveries(json?.data ?? json);
            const key = String(json?.data?.storageKey ?? storageKey).trim();
            const nextSlug = String(json?.data?.storefrontSlug ?? "").trim();
            onCoverImageChange?.({
                key,
                fileKey: key,
                url: `/api/media/sign?key=${encodeURIComponent(key)}`,
                name: key.split("/").pop() ?? key,
            });
            setPendingCoverKey(null);
            if (nextSlug) onStorefrontSlugChange?.(nextSlug);
            notify.success({ title: "Đã chọn ảnh Cover", message: "Cover đã được lưu và đồng bộ storefront." });
        } catch (error) {
            notify.error({
                title: "Không thể cập nhật Cover",
                message: error instanceof Error ? error.message : "Có lỗi khi xử lý ảnh Cover.",
            });
        } finally {
            setCoverPending(false);
        }
    };

    const handleQuickPublish = async (nextPublished: boolean) => {
        if (publishPending || isFormDirty) return;
        const confirmed = await dialog.confirm({
            title: nextPublished ? "Đưa Watch lên storefront?" : "Ẩn Watch khỏi storefront?",
            message: nextPublished
                ? `Watch sẽ hiển thị ngay với title, spec và Cover hiện tại. Giá: ${showPrice ? "hiển thị" : "Liên hệ"}. Content và gallery có thể bổ sung sau.`
                : "Watch sẽ được ẩn khỏi storefront. Dữ liệu title, spec, content và gallery vẫn được giữ nguyên.",
            confirmText: nextPublished ? "Đưa lên storefront" : "Ẩn khỏi storefront",
            cancelText: "Hủy",
        });
        if (!confirmed) return;

        setPublishPending(true);
        try {
            const res = await fetch(`/api/admin/watches/${productId}/storefront-publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ showPrice, published: nextPublished }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) throw new Error(json?.error || "Không thể đưa Watch lên storefront.");
            setQuickPublished(nextPublished);
            notify.success({
                title: nextPublished ? "Đã đưa lên storefront" : "Đã ẩn khỏi storefront",
                message: nextPublished
                    ? (showPrice ? "Storefront đang hiển thị giá." : "Storefront đang hiển thị Liên hệ.")
                    : "Watch không còn hiển thị trên storefront.",
            });
        } catch (error) {
            notify.error({
                title: "Chưa thể đưa lên storefront",
                message: error instanceof Error ? error.message : "Có lỗi xảy ra.",
            });
        } finally {
            setPublishPending(false);
        }
    };

    const handlePhotoRoomProcess = async (adjustment?: PhotoRoomAdjustment) => {
        const storageKey = (
            adjustment
                ? photoRoomSourceKey || pendingCoverKey || currentCoverKey
                : pendingCoverKey || currentCoverKey
        ).trim();
        if (!storageKey || coverPending || photoRoomPending) return;

        setPhotoRoomPending(true);
        try {
            const res = await fetch(`/api/admin/watches/${productId}/storefront-image/photoroom`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storageKey,
                    adjustment: adjustment ?? null,
                    processingKind: hasPhotoRoomResult ? "REPROCESS" : "INITIAL",
                }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                notify.error({
                    title: "PhotoRoom xử lý thất bại",
                    message: json?.error || "Không nhận được ảnh hoàn chỉnh từ PhotoRoom.",
                });
                return;
            }

            const outputKey = String(json?.data?.storageKey ?? "").trim();
            if (!outputKey) throw new Error("PhotoRoom không trả về khóa ảnh kết quả.");
            setPhotoRoomSourceKey(String(json?.data?.sourceStorageKey ?? storageKey).trim());
            setHasPhotoRoomResult(true);
            const cutoutStorageKey = String(json?.data?.cutoutStorageKey ?? "").trim();
            setSharpCutoutKey(cutoutStorageKey || null);
            setPendingCoverKey(outputKey);
            if (adjustment) {
                setPhotoRoomAdjustment(adjustment);
                setLocalLayoutBaseKey(cutoutStorageKey || outputKey);
                setLocalLayoutBaseAdjustment(adjustment);
                setPhotoRoomAdjustmentOpen(false);
            }
            setCoverPickerVersion((version) => version + 1);
            notify.success({
                title: "PhotoRoom đã xử lý xong",
                message: "Hãy kiểm tra ảnh mới, sau đó bấm Xác nhận Cover để đưa lên storefront.",
            });
        } catch (error) {
            notify.error({
                title: "PhotoRoom xử lý thất bại",
                message: error instanceof Error ? error.message : "Có lỗi khi gửi ảnh sang PhotoRoom.",
            });
        } finally {
            setPhotoRoomPending(false);
        }
    };

    const handleLocalAdjustment = async (adjustment: PhotoRoomAdjustment) => {
        if (!localLayoutBaseKey || !localLayoutBaseAdjustment || sharpPending || photoRoomPending) return;
        setSharpPending(true);
        try {
            const res = await fetch(`/api/admin/watches/${productId}/storefront-image/sharp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storageKey: localLayoutBaseKey,
                    adjustment,
                    baseAdjustment: localLayoutBaseAdjustment,
                }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) throw new Error(json?.error || "Không dựng lại được bố cục local.");
            const outputKey = String(json?.data?.storageKey ?? "").trim();
            if (!outputKey) throw new Error("Sharp không trả về khóa ảnh kết quả.");
            setPendingCoverKey(outputKey);
            setPhotoRoomAdjustment(adjustment);
            setPhotoRoomAdjustmentOpen(false);
            setCoverPickerVersion((version) => version + 1);
            notify.success({
                title: "Đã dựng preview local",
                message: "Kích thước, xoay, vị trí và nền được dựng bằng Sharp, không sử dụng quota PhotoRoom.",
            });
        } catch (error) {
            notify.error({
                title: "Xử lý local thất bại",
                message: error instanceof Error ? error.message : "Có lỗi khi dựng lại bố cục local.",
            });
        } finally {
            setSharpPending(false);
        }
    };

    const handleSharpRecreate = async () => {
        const selectedKey = (pendingCoverKey || currentCoverKey).trim();
        const storageKey = sharpCutoutKey || (selectedKey.includes("photoroom-cutout-") ? selectedKey : "");
        if (!storageKey || coverPending || photoRoomPending || sharpPending) return;

        setSharpPending(true);
        try {
            const res = await fetch(`/api/admin/watches/${productId}/storefront-image/sharp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ storageKey }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                notify.error({
                    title: "Sharp xử lý thất bại",
                    message: json?.error || "Không tạo lại được ảnh bằng Sharp.",
                });
                return;
            }

            const outputKey = String(json?.data?.storageKey ?? "").trim();
            if (!outputKey) throw new Error("Sharp không trả về khóa ảnh kết quả.");
            setPendingCoverKey(outputKey);
            setCoverPickerVersion((version) => version + 1);
            notify.success({
                title: "Sharp đã tạo lại ảnh",
                message: "Không sử dụng quota PhotoRoom. Hãy preview rồi xác nhận Cover nếu đã ổn.",
            });
        } catch (error) {
            notify.error({
                title: "Sharp xử lý thất bại",
                message: error instanceof Error ? error.message : "Có lỗi khi tạo lại ảnh bằng Sharp.",
            });
        } finally {
            setSharpPending(false);
        }
    };

    const handleCoverReturn = async () => {
        if (!currentCoverKey || coverPending) return;
        const confirmed = await dialog.confirm({
            title: "Trả ảnh về kho Cover?",
            message: "Ảnh sẽ bị gỡ khỏi storefront và được chuyển từ kho objects về đúng thư mục Cover ban đầu.",
            confirmText: "Trả ảnh",
            cancelText: "Hủy",
            tone: "warning",
        });
        if (!confirmed) return;

        setCoverPending(true);
        try {
            const res = await fetch(`/api/admin/watches/${productId}/storefront-image`, {
                method: "DELETE",
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                notify.error({
                    title: "Không thể trả ảnh Cover",
                    message: json?.error || "Có lỗi khi trả ảnh về kho Cover.",
                });
                return;
            }
            await waitForOperationProjectionDeliveries(json?.data ?? json);
            setPendingCoverKey(null);
            onCoverImageChange?.(null);
            setCoverPickerVersion((version) => version + 1);
            notify.success({
                title: "Đã trả ảnh Cover",
                message: "Ảnh đã được gỡ khỏi storefront và trả về kho Cover ban đầu.",
            });
        } catch (error) {
            notify.error({
                title: "Không thể trả ảnh Cover",
                message: error instanceof Error ? error.message : "Có lỗi khi trả ảnh về kho Cover.",
            });
        } finally {
            setCoverPending(false);
        }
    };

    const openImageTaskModal = () => {
        startTaskTransition(async () => {
            try {
                const data = await getTaskQuickCreateDataAction();
                setTaskUsers(data.users);
                setCurrentUserId(data.currentUserId);
                setTaskContext({
                    watchId,
                    kind: TaskKind.OPERATION,
                    titlePreset: watchTitle
                        ? `Bổ sung hình ảnh cho ${watchTitle}`
                        : "Bổ sung hình ảnh cho watch",
                    descriptionPreset: "",
                });
                setTaskModalOpen(true);
            } catch (err: unknown) {
                notify.error({
                    title: "Không thể mở tạo task",
                    message: err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu task.",
                });
            }
        });
    };

    return (
        <>
            <SectionCard
                icon={<ImageIcon className="h-5 w-5" />}
                title={sectionMode === "cover" ? "Cover storefront" : "Hình ảnh"}
                subtitle={sectionMode === "cover"
                    ? "Chọn ảnh đại diện storefront và kiểm tra điều kiện sẵn sàng hiển thị."
                    : "Chỉ quản lý ảnh gallery của watch. Ảnh đại diện dùng role INLINE riêng."}
                collapsible={collapsible}
                surface={surface}
                actions={
                    !showGallery ? null : hideReviewActions ? mediaActions :
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <TaskSignalIcon
                            title={taskPending ? "Đang tải task..." : "Giao task hình ảnh"}
                            onClick={openImageTaskModal}
                            disabled={taskPending}
                        />
                        {openTaskCount ? (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                                {openTaskCount} task
                            </span>
                        ) : null}
                        <SectionReviewActions
                            productId={productId}
                            target="image"
                            status={imageReviewStatus}
                            watchId={watchId}
                            reviewNote={imageReviewNote}
                            canReviewContent={canReviewContent}
                            isFormDirty={isFormDirty}
                            onBeforeSubmit={() => onBeforeSubmitReview?.("image") ?? Promise.resolve(true)}
                            onStatusChange={(next) => {
                                onReviewStatusChange?.(next);
                            }}
                        />
                    </div>
                }
            >
                <div className="space-y-4">
                    {showGallery && locked ? (
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

                    {showCover ? <div className={[
                        "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm",
                        "",
                    ].join(" ")}>
                        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                            <div className="text-sm font-semibold text-slate-900">Ảnh Cover storefront</div>
                            <div className="text-sm text-slate-500">Chọn đúng một ảnh từ kho Cover của phân khúc Watch.</div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[168px_minmax(0,1fr)] md:items-stretch">
                            <button
                                type="button"
                                onClick={() => coverPreviewSrc
                                    ? setCoverPreviewOpen(true)
                                    : setCoverPickerOpen(true)}
                                disabled={coverPending || photoRoomPending || sharpPending}
                                aria-label={coverPreviewSrc ? "Xem trước ảnh Cover trên storefront" : "Chọn ảnh Cover"}
                                className="aspect-[3/4] w-full max-w-[168px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {coverPreviewSrc ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={coverPreviewSrc}
                                        alt="Cover storefront"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-slate-500">Chọn ảnh</span>
                                )}
                            </button>
                            <div className="flex min-w-0 flex-wrap content-start items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                                <div className="mb-1 basis-full">
                                    <div className="text-sm font-semibold text-slate-900">
                                        {pendingCoverKey ? "Preview đang chờ xác nhận" : hasPhotoRoomResult ? "Cover đã qua PhotoRoom" : "Cover hiện tại"}
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-500">
                                        {pendingCoverKey ? "Kiểm tra preview trước khi xác nhận đưa lên storefront." : "Bạn có thể đổi ảnh hoặc tiếp tục xử lý trước khi xác nhận bản mới."}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCoverPickerOpen(true)}
                                    disabled={coverPending || photoRoomPending || sharpPending}
                                    className="order-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    {currentCoverKey ? "Đổi ảnh Cover" : "Chọn ảnh Cover"}
                                </button>
                                {pendingCoverKey ? (
                                    <span className="text-xs font-medium text-emerald-700">Ảnh mới đang chờ xác nhận</span>
                                ) : null}
                                {!hasPhotoRoomResult && (pendingCoverKey || currentCoverKey) ? (
                                    <button
                                        type="button"
                                        onClick={() => setPhotoRoomAdjustmentOpen(true)}
                                        disabled={coverPending || photoRoomPending}
                                        className="order-1 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        {photoRoomPending ? "PhotoRoom đang xử lý..." : "Thiết lập & xử lý PhotoRoom"}
                                    </button>
                                ) : null}
                                {hasPhotoRoomResult && (pendingCoverKey || currentCoverKey) ? (
                                    <button
                                        type="button"
                                        onClick={() => setPhotoRoomAdjustmentOpen(true)}
                                        disabled={coverPending || photoRoomPending || sharpPending}
                                        className="order-1 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Xử lý lại / điều chỉnh PhotoRoom
                                    </button>
                                ) : null}
                                {sharpCutoutKey && (pendingCoverKey || currentCoverKey) ? (
                                    <button
                                        type="button"
                                        onClick={() => void handleSharpRecreate()}
                                        disabled={coverPending || photoRoomPending || sharpPending || !sharpCutoutKey}
                                        title={sharpCutoutKey ? "Tạo lại shadow từ cutout trong suốt" : "Ảnh cũ chưa có file cutout trong suốt"}
                                        className="order-4 inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        {sharpPending ? "Sharp đang xử lý..." : "Tạo lại bằng Sharp"}
                                    </button>
                                ) : null}
                                {pendingCoverKey ? (
                                    <button
                                        type="button"
                                        onClick={() => void handleCoverConfirm()}
                                        disabled={coverPending || photoRoomPending || sharpPending}
                                        className="order-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                        {coverPending ? "Đang xử lý..." : "Xác nhận Cover"}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div> : null}

                    {showCover ? <div className={`mt-3 rounded-2xl border px-4 py-3 ${storefrontReady ? "border-emerald-200 bg-white" : "border-amber-200 bg-amber-50/60"}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-slate-900">Điều kiện hiển thị storefront</div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${storefrontReady ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                                {storefrontReady ? "Đã sẵn sàng" : `Còn thiếu ${storefrontChecks.filter((item) => !item.ok).length}`}
                            </span>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {storefrontChecks.map((item) => (
                                <div key={item.label} className={`flex items-center gap-2 text-xs ${item.ok ? "text-emerald-700" : "font-medium text-amber-800"}`}>
                                    <span className={`grid h-4 w-4 place-items-center rounded-full border ${item.ok ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-white"}`}>
                                        {item.ok ? <Check className="h-3 w-3" /> : "!"}
                                    </span>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-amber-200/70 pt-3">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={quickPublished}
                                onClick={() => void handleQuickPublish(!quickPublished)}
                                disabled={publishPending || isFormDirty || (!quickPublished && !currentCoverKey)}
                                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${quickPublished ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                            >
                                <span className={`relative h-5 w-9 rounded-full transition ${quickPublished ? "bg-white/30" : "bg-slate-400"}`}>
                                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${quickPublished ? "left-[18px]" : "left-0.5"}`} />
                                </span>
                                {publishPending ? "Đang cập nhật..." : quickPublished ? "Đang hiển thị storefront" : "Đang ẩn storefront"}
                            </button>
                            <span className="text-xs text-slate-600">
                                {isFormDirty ? "Hãy lưu title, spec và lựa chọn hiển thị giá trước." : "Không yêu cầu content hoặc đủ gallery; cần title, spec và Cover."}
                            </span>
                        </div>
                    </div> : null}

                    {showGallery ? <div
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
                            audienceSegment={audienceSegment}
                            title="Ảnh gallery"
                            description="Chỉ chọn ảnh gallery. Ảnh đại diện INLINE được quản lý riêng cho header/list thumbnail."
                            contextImage={{
                                src:
                                    inlineImage?.url ??
                                    (inlineImage as MediaItemWithAliases | null)?.imageUrl ??
                                    (inlineImage as MediaItemWithAliases | null)?.src ??
                                    null,
                                title: watchTitle || "Watch đang chỉnh",
                                subtitle: "Ảnh đại diện INLINE của watch hiện tại",
                            }}
                        />
                    </div> : null}

                    {showGallery && error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {error}
                        </div>
                    ) : null}
                </div>
            </SectionCard>

            {showCover ? <MediaBrowserDialog
                key={`cover-picker-${coverPickerVersion}`}
                open={coverPickerOpen}
                onClose={() => setCoverPickerOpen(false)}
                profile="cover"
                audienceSegment={audienceSegment}
                selectedKeys={pendingCoverKey ? [pendingCoverKey] : []}
                selectionMode="multiple"
                maxSelection={1}
                title="Chọn ảnh Cover storefront"
                description="Chọn một ảnh từ kho Cover. Ảnh chỉ được xử lý sau khi xác nhận tại màn hình Media."
                submitLabel="Chọn ảnh này"
                enableRecycle={false}
                footerHint="Chọn một ảnh Cover để đưa về màn hình Media trước khi xác nhận."
                footerLeadingAction={currentCoverKey ? (
                    <button
                        type="button"
                        onClick={() => void handleCoverReturn()}
                        disabled={coverPending}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Undo2 className="h-4 w-4" />
                        {coverPending ? "Đang trả ảnh..." : "Trả ảnh hiện tại về kho Cover"}
                    </button>
                ) : null}
                onSubmit={(keys) => {
                    if (!keys[0]) return;
                    setPendingCoverKey(keys[0]);
                    setPhotoRoomSourceKey(null);
                    setHasPhotoRoomResult(false);
                    setPhotoRoomAdjustment(DEFAULT_PHOTOROOM_ADJUSTMENT);
                    setSharpCutoutKey(null);
                    setLocalLayoutBaseKey(null);
                    setLocalLayoutBaseAdjustment(null);
                    setCoverPickerOpen(false);
                }}
            /> : null}

            {showCover ? <PhotoRoomAdjustmentDialog
                open={photoRoomAdjustmentOpen}
                pending={photoRoomPending}
                localPending={sharpPending}
                previewSrc={resolveMediaPreviewSrc(localLayoutBaseKey ?? pendingCoverKey ?? currentCoverKey)}
                canProcessLocally={Boolean(localLayoutBaseKey && localLayoutBaseAdjustment)}
                localBaseEnhanceMetal={localLayoutBaseAdjustment?.enhanceMetal}
                localBaseShadowMode={localLayoutBaseAdjustment?.shadowMode}
                localDisabledReason="Cần tạo ít nhất một preview PhotoRoom trong phiên này"
                initialValue={photoRoomAdjustment}
                onClose={() => setPhotoRoomAdjustmentOpen(false)}
                onSubmit={(value) => void handlePhotoRoomProcess(value)}
                onSubmitLocal={(value) => void handleLocalAdjustment(value)}
            /> : null}

            {showCover && coverPreviewOpen && coverPreviewSrc ? (
                <div
                    className="fixed inset-0 z-[200] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Xem trước ảnh Cover trên storefront"
                    onMouseDown={(event) => {
                        if (event.currentTarget === event.target) setCoverPreviewOpen(false);
                    }}
                >
                    <div className="relative flex max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] flex-col items-center gap-3">
                        <div className="relative h-[min(82vh,960px)] aspect-[3/4] overflow-hidden rounded-xl bg-[#efede8] shadow-2xl ring-1 ring-white/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={coverPreviewSrc}
                                alt={watchTitle ? `Cover storefront của ${watchTitle}` : "Cover storefront"}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white">
                            Preview storefront · khung 3:4 · object-cover
                        </div>
                        <button
                            type="button"
                            onClick={() => setCoverPreviewOpen(false)}
                            className="absolute -right-2 -top-2 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-slate-950/80 text-white shadow-lg hover:bg-slate-900"
                            aria-label="Đóng preview Cover"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            ) : null}

            <TaskQuickCreateModal
                open={taskModalOpen}
                users={taskUsers}
                currentUserId={currentUserId}
                context={taskContext}
                onClose={() => setTaskModalOpen(false)}
                onSaved={() => {
                    notify.success({
                        title: "Đã tạo task hình ảnh",
                        message: "Task đã được gắn với watch hiện tại.",
                    });
                }}
            />
        </>
    );
}
