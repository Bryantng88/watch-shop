"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import AfterSaveDialog from "@/domains/shared/ui/navigation/AfterSaveDialog";
import { applyQueueItemManualTransitionAction } from "@/domains/task/actions/task.actions";

import { submitWatchForm } from "./form/watch-form.actions";
import {
    markWatchMediaAssetAttachedFromWatchAction,
    saveWatchMediaWorkDraftFromWatchAction,
} from "./media-work/watch-media-work.actions";
import { mapWatchDetailToFormValues } from "./form/watch-form.mapper";
import type { WatchFormValues } from "./form/watch-form.types";

import WatchEditHeader from "../ui/edit/WatchEditHeader";
import WatchBasicSection from "../ui/edit/WatchBasicSection";
import WatchSpecModal from "../ui/edit/WatchSpecModal";
import WatchContentSection from "../ui/edit/WatchContentSection";
import WatchPricingSidebar from "../ui/edit/WatchPricingSidebar";
import WatchImageSection from "../ui/edit/WatchImageSection";
import WatchMediaSidebar from "../ui/edit/WatchMediaSidebar";
import WatchStateSection from "../ui/edit/WatchStateSection";

type SimpleOption = {
    id: string;
    name: string;
    slug?: string | null;
    platform?: string | null;
};

type Props = {
    detail: {
        taskSummary?: {
            watchImage?: number | null;
        } | null;
        [key: string]: unknown;
    };
    brands?: SimpleOption[];
    vendors?: SimpleOption[];
    categories?: SimpleOption[];

    canViewCost?: boolean;
    canEditPrice?: boolean;
    canReviewContent?: boolean;
    postTargets?: Array<{
        id: string;
        name: string;
        platform?: string | null;
    }>;
};

type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type ReviewStatusChange = {
    status: ReviewStatus;
    reviewNote?: string | null;
};

type AfterSaveMode =
    | "normal"
    | "submitContent"
    | "submitImage"
    | "submitBoth"
    | "continueContent";

type MediaWorkPart = "profile" | "content" | "image";

function stableStringify(value: unknown) {
    return JSON.stringify(value, (_key, v) => {
        if (Array.isArray(v)) return v;

        if (v && typeof v === "object") {
            return Object.keys(v as Record<string, unknown>)
                .sort()
                .reduce((acc: Record<string, unknown>, key) => {
                    acc[key] = (v as Record<string, unknown>)[key];
                    return acc;
                }, {});
        }

        return v ?? null;
    });
}

function errorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function hasMediaWorkContent(values: WatchFormValues) {
    const content = values.content;
    return Boolean(
        content.titleOverride.trim() ||
        content.hookText.trim() ||
        content.body.trim() ||
        content.hashTags.trim() ||
        (content.bulletSpecs ?? []).some((item) => item.trim()),
    );
}

function missingMediaWorkPartLabels(touched: Record<MediaWorkPart, boolean>) {
    return [
        touched.profile ? null : "Thông tin/spec",
        touched.content ? null : "Content",
        touched.image ? null : "Hình ảnh",
    ].filter(Boolean) as string[];
}

function useUnsavedChangesGuard({
    enabled,
    message,
    onConfirmLeave,
    onNavigate,
}: {
    enabled: boolean;
    message: string;
    onConfirmLeave: () => Promise<boolean>;
    onNavigate: (href: string) => void;
}) {
    useEffect(() => {
        if (!enabled) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [enabled, message]);

    useEffect(() => {
        if (!enabled) return;

        const handleDocumentClick = async (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            if (event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const target = event.target as HTMLElement | null;
            const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;

            if (!anchor) return;
            if (anchor.target && anchor.target !== "_self") return;
            if (anchor.hasAttribute("download")) return;

            const nextUrl = new URL(anchor.href, window.location.href);
            const currentUrl = new URL(window.location.href);

            if (nextUrl.href === currentUrl.href) return;
            if (nextUrl.origin !== currentUrl.origin) return;

            event.preventDefault();
            event.stopPropagation();

            const ok = await onConfirmLeave();

            if (ok) {
                onNavigate(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
            }
        };

        document.addEventListener("click", handleDocumentClick, true);
        return () => document.removeEventListener("click", handleDocumentClick, true);
    }, [enabled, onConfirmLeave, onNavigate]);
}

export default function WatchFormClient({
    detail,
    brands = [],
    vendors = [],
    categories = [],
    postTargets = [],
    canViewCost = false,
    canEditPrice = false,
    canReviewContent = false,

}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dialog = useAppDialog();
    const progress = useAppProgress();
    const notify = useNotify();

    const initialValues = useMemo(
        () => mapWatchDetailToFormValues(detail),
        [detail],
    );

    const [values, setValues] = useState<WatchFormValues>(initialValues);
    const [savedValues, setSavedValues] =
        useState<WatchFormValues>(initialValues);

    const valuesRef = useRef<WatchFormValues>(initialValues);

    const [pending, startTransition] = useTransition();
    const [mediaError] = useState<string | null>(null);
    const [specModalOpen, setSpecModalOpen] = useState(false);
    const [brandOptions, setBrandOptions] = useState<SimpleOption[]>(brands);
    const [mediaSubmitPending, setMediaSubmitPending] = useState(false);
    const [mediaWorkTouched, setMediaWorkTouched] = useState<
        Record<MediaWorkPart, boolean>
    >({
        profile: searchParams.get("mediaProfileDone") === "1",
        content: searchParams.get("mediaContentDone") === "1",
        image: searchParams.get("mediaImageDone") === "1",
    });

    const [afterSaveOpen, setAfterSaveOpen] = useState(false);
    const [afterSaveMode, setAfterSaveMode] = useState<AfterSaveMode>("normal");

    const contentRef = useRef<HTMLDivElement | null>(null);
    const pricingRef = useRef<HTMLDivElement | null>(null);

    const focus = searchParams.get("focus");
    const fromMediaWorkspace = searchParams.get("from") === "media-workspace";
    const embedded = searchParams.get("embedded") === "1";
    const viewMode = searchParams.get("mode") || "full";
    const isMediaMode = viewMode === "media";
    const returnTo = searchParams.get("returnTo") || "/admin/watches";
    const workspaceBindingId = searchParams.get("workspaceBindingId") || "";
    const workspaceState = searchParams.get("workspaceState") || "";
    const isMediaWorkspaceDone = workspaceState === "DONE";
    const canApproveMediaWorkspace =
        fromMediaWorkspace &&
        Boolean(workspaceBindingId) &&
        canReviewContent &&
        !isMediaWorkspaceDone;
    const canReturnMediaWorkspace =
        canApproveMediaWorkspace && workspaceState === "REVIEW";
    const inlineImage = values.media.inlineImage;
    const isDirty = stableStringify(values) !== stableStringify(savedValues);
    const setFormValues = (updater: (prev: WatchFormValues) => WatchFormValues) => {
        setValues((prev) => {
            const next = updater(prev);
            valuesRef.current = next;
            return next;
        });
    };

    const markMediaWorkTouched = (part: MediaWorkPart) => {
        if (!isMediaMode || !fromMediaWorkspace) return;

        setMediaWorkTouched((prev) =>
            prev[part]
                ? prev
                : {
                    ...prev,
                    [part]: true,
                },
        );
    };

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    useEffect(() => {
        if (focus !== "pricing") return;

        window.setTimeout(() => {
            pricingRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            notify.info({
                title: "Đang xem thay đổi giá",
                message: "Pricing block đã được focus từ thông báo.",
            });
        }, 250);
    }, [focus, notify]);

    const unsavedChangesMessage =
        "Bạn có thay đổi chưa lưu. Thoát khỏi trang này sẽ mất các chỉnh sửa hiện tại. Bạn vẫn muốn thoát?";

    const confirmLeaveIfDirty = async () => {
        if (!isDirty) return true;

        return dialog.confirm({
            title: "Bạn có thay đổi chưa lưu",
            message: unsavedChangesMessage,
            confirmText: "Thoát khỏi trang",
            cancelText: "Ở lại chỉnh tiếp",
            tone: "warning",
        });
    };

    useUnsavedChangesGuard({
        enabled: isDirty,
        message: unsavedChangesMessage,
        onConfirmLeave: confirmLeaveIfDirty,
        onNavigate: (href) => {
            progress.show({
                title: "Đang chuyển trang",
                message: "Hệ thống đang điều hướng sang màn hình mới.",
            });

            router.push(href);
            window.setTimeout(() => progress.hide(), 1200);
        },
    });

    const handleBack = async () => {
        if (!(await confirmLeaveIfDirty())) return;

        progress.show({
            title: "Đang quay lại",
            message: "Hệ thống đang đưa bạn về danh sách trước đó.",
        });

        router.push(returnTo);
        router.refresh();
        window.setTimeout(() => progress.hide(), 1200);
    };

    const buildSubmitValues = (): WatchFormValues => {
        const current = valuesRef.current;

        return {
            ...current,
            productId: current.productId || initialValues.productId,
        };
    };

    const updateBasic = (patch: Partial<WatchFormValues["basic"]>) => {
        markMediaWorkTouched("profile");
        setFormValues((prev) => ({
            ...prev,
            basic: {
                ...prev.basic,
                ...patch,
            },
        }));
    };

    const replaceSpec = (next: WatchFormValues["spec"]) => {
        markMediaWorkTouched("profile");
        setFormValues((prev) => ({
            ...prev,
            spec: next,
            specStatus: "PARTIAL",
        }));
    };

    const updateContent = (patch: Partial<WatchFormValues["content"]>) => {
        markMediaWorkTouched("content");
        setFormValues((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                ...patch,
            },
        }));
    };

    const updatePricing = (patch: Partial<WatchFormValues["pricing"]>) => {
        setFormValues((prev) => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                ...patch,
            },
        }));
    };

    const updateMedia = (patch: Partial<WatchFormValues["media"]>) => {
        markMediaWorkTouched("image");
        setFormValues((prev) => ({
            ...prev,
            media: {
                ...prev.media,
                ...patch,
            },
        }));
    };

    const patchReviewState = (
        current: WatchFormValues,
        target: "content" | "image",
        next: ReviewStatusChange,
    ): WatchFormValues =>
        target === "content"
            ? {
                ...current,
                contentReviewStatus: next.status,
                contentReviewNote: next.reviewNote ?? null,
            }
            : {
                ...current,
                imageReviewStatus: next.status,
                imageReviewNote: next.reviewNote ?? null,
            };

    const handleReviewStatusChange = (
        target: "content" | "image",
        next: ReviewStatusChange,
    ) => {
        setFormValues((prev) => patchReviewState(prev, target, next));

        setSavedValues((prev) => {
            const nextSaved = patchReviewState(prev, target, next);
            return nextSaved;
        });
    };

    const submitReviewTarget = async (target: "content" | "image") => {
        const productId = valuesRef.current.productId || initialValues.productId;

        const res = await fetch(
            `/api/admin/watches/${productId}/${target}-submit`,
            { method: "POST" },
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(json?.error || "Không thể gửi duyệt.");
        }

        setFormValues((prev): WatchFormValues => {
            if (target === "content") {
                return {
                    ...prev,
                    contentReviewStatus: "SUBMITTED",
                    contentReviewNote: null,
                };
            }

            return {
                ...prev,
                imageReviewStatus: "SUBMITTED",
                imageReviewNote: null,
            };
        });
    };

    const submitReviewByMode = async () => {
        progress.show({
            title: "Đang gửi duyệt",
            message: "Hệ thống đang chuyển hạng mục sang trạng thái chờ duyệt.",
        });

        try {
            if (afterSaveMode === "submitContent") {
                await submitReviewTarget("content");

                notify.success({
                    title: "Đã gửi duyệt",
                    message: "Đã lưu watch và gửi duyệt nội dung.",
                });
            }

            if (afterSaveMode === "submitImage") {
                await submitReviewTarget("image");

                notify.success({
                    title: "Đã gửi duyệt",
                    message: "Đã lưu watch và gửi duyệt hình ảnh.",
                });
            }

            if (afterSaveMode === "submitBoth") {
                await submitReviewTarget("content");
                await submitReviewTarget("image");

                notify.success({
                    title: "Đã gửi duyệt",
                    message: "Đã lưu watch và gửi duyệt nội dung + hình ảnh.",
                });
            }

            router.refresh();
        } finally {
            progress.hide();
        }
    };

    const updateValuesAfterSave = (
        result: Awaited<ReturnType<typeof submitWatchForm>>,
    ) => {
        setValues((prev): WatchFormValues => {
            const serverChosenImages = result?.media?.poolImages as
                | WatchFormValues["media"]["poolImages"]
                | undefined;

            const serverGalleryImages = result?.media?.galleryImages as
                | WatchFormValues["media"]["galleryImages"]
                | undefined;

            const next: WatchFormValues = {
                ...prev,
                contentReviewStatus:
                    (result?.contentReviewStatus as ReviewStatus | undefined) ??
                    prev.contentReviewStatus,
                imageReviewStatus:
                    (result?.imageReviewStatus as ReviewStatus | undefined) ??
                    prev.imageReviewStatus,
                media: {
                    ...prev.media,
                    poolImages: serverChosenImages ?? prev.media.poolImages,
                    galleryImages: serverGalleryImages ?? prev.media.galleryImages,
                    imageCount: serverGalleryImages?.length ?? prev.media.imageCount,
                },
            };

            valuesRef.current = next;
            setSavedValues(next);

            return next;
        });
    };



    const onSubmit = () => {
        setAfterSaveOpen(false);
        setAfterSaveMode("normal");

        startTransition(async () => {
            progress.show({
                title: "Đang lưu watch",
                message: "Hệ thống đang cập nhật dữ liệu watch.",
            });

            try {
                const result = await submitWatchForm(buildSubmitValues());

                updateValuesAfterSave(result);

                notify.success({
                    title: "Đã lưu watch",
                    message: result?.message || "Thông tin watch đã được cập nhật.",
                });

                if (result?.askContinueContent) {
                    setAfterSaveMode("continueContent");
                } else if (!canReviewContent && result?.askSubmitReview) {
                    const targets: Array<"CONTENT" | "IMAGE"> =
                        (result?.reviewSubmitTargets ?? []) as Array<"CONTENT" | "IMAGE">;

                    if (targets.includes("CONTENT") && targets.includes("IMAGE")) {
                        setAfterSaveMode("submitBoth");
                    } else if (targets.includes("CONTENT")) {
                        setAfterSaveMode("submitContent");
                    } else if (targets.includes("IMAGE")) {
                        setAfterSaveMode("submitImage");
                    } else {
                        setAfterSaveMode("normal");
                    }
                } else {
                    setAfterSaveMode("normal");
                }

                setAfterSaveOpen(true);
            } catch (error: unknown) {
                notify.error({
                    title: "Không thể lưu watch",
                    message: errorMessage(error, "Có lỗi xảy ra khi lưu watch."),
                });
            } finally {
                progress.hide();
            }
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const completeMediaWorkspaceStep = () => {
        if (pending) return;

        startTransition(async () => {
            progress.show({
                title: "Đang gửi về Workspace",
                message: "Hệ thống đang lưu hình ảnh và cập nhật workflow xử lý media.",
            });

            try {
                const submitValues: WatchFormValues = {
                    ...buildSubmitValues(),
                    saveIntent: "MEDIA_WORKSPACE",
                };
                const missingWorkParts = missingMediaWorkPartLabels(mediaWorkTouched);

                if (fromMediaWorkspace && missingWorkParts.length > 0) {
                    await dialog.alert({
                        title: "Chưa xử lý đủ media package",
                        message: `Bạn cần thao tác đủ 3 phần trước khi gửi về Workspace chờ duyệt: ${missingWorkParts.join(", ")}.`,
                        tone: "warning",
                    });
                    return;
                }

                if (!hasMediaWorkContent(submitValues)) {
                    await dialog.alert({
                        title: "Chưa có content",
                        message:
                            "Bạn cần nhập hoặc generate content trước khi gửi item về Workspace chờ duyệt.",
                        tone: "warning",
                    });
                    return;
                }

                const localGalleryCount = submitValues.media.galleryImages?.length ?? 0;

                if (localGalleryCount <= 0) {
                    await dialog.alert({
                        title: "Chưa có ảnh gallery",
                        message:
                            "Bạn cần chọn ít nhất một ảnh gallery trước khi gửi item về Workspace chờ duyệt.",
                        tone: "warning",
                    });
                    return;
                }

                const result = await submitWatchForm(submitValues);

                updateValuesAfterSave(result);

                const nextGalleryImages = result?.media?.galleryImages as
                    | WatchFormValues["media"]["galleryImages"]
                    | undefined;
                const galleryCount =
                    nextGalleryImages?.length ??
                    submitValues.media.galleryImages?.length ??
                    0;

                if (galleryCount <= 0) {
                    await dialog.alert({
                        title: "Chưa có ảnh gallery",
                        message: "Bạn cần chọn ít nhất một ảnh gallery trước khi gửi về Workspace.",
                        tone: "warning",
                    });
                    return;
                }

                const workspaceResult =
                    await markWatchMediaAssetAttachedFromWatchAction({
                        productId: submitValues.productId,
                        note: "Spec, content, and media submitted from Watch edit workspace modal.",
                    });

                if (workspaceResult?.skipped) {
                    notify.info({
                        title: "Đã lưu ảnh",
                        message:
                            "Không tìm thấy item Xử lý Media đang mở trong Workspace để cập nhật workflow.",
                    });
                } else {
                    notify.success({
                        title: "Đã gửi về Workspace",
                        message: "Ảnh đã được lưu và item đã chuyển sang trạng thái chờ duyệt trong Workspace.",
                    });
                }

                router.refresh();
            } catch (error: unknown) {
                notify.error({
                    title: "Không thể gửi về Workspace",
                    message: errorMessage(
                        error,
                        "Có lỗi xảy ra khi lưu ảnh hoặc cập nhật workflow.",
                    ),
                });
            } finally {
                progress.hide();
            }
        });
    };

    const completeMediaWorkspaceStepSafe = async () => {
        if (mediaSubmitPending) return;

        const submitValues: WatchFormValues = {
            ...buildSubmitValues(),
            saveIntent: "MEDIA_WORKSPACE",
        };
        const missingWorkParts = missingMediaWorkPartLabels(mediaWorkTouched);

        if (fromMediaWorkspace && missingWorkParts.length > 0) {
            await dialog.alert({
                title: "Chưa xử lý đủ media package",
                message: `Bạn cần thao tác đủ 3 phần trước khi gửi về Workspace chờ duyệt: ${missingWorkParts.join(", ")}.`,
                tone: "warning",
            });
            return;
        }

        if (!hasMediaWorkContent(submitValues)) {
            await dialog.alert({
                title: "Chưa có content",
                message:
                    "Bạn cần nhập hoặc generate content trước khi gửi item về Workspace chờ duyệt.",
                tone: "warning",
            });
            return;
        }

        const localGalleryCount = submitValues.media.galleryImages?.length ?? 0;

        if (localGalleryCount <= 0) {
            await dialog.alert({
                title: "Chưa có ảnh gallery",
                message:
                    "Bạn cần chọn ít nhất một ảnh gallery trước khi gửi item về Workspace chờ duyệt.",
                tone: "warning",
            });
            return;
        }

        setMediaSubmitPending(true);
        progress.show({
            title: "Đang gửi về Workspace",
            message: "Hệ thống đang lưu dữ liệu và cập nhật workflow xử lý media.",
        });

        try {
            const result = await submitWatchForm(submitValues);

            updateValuesAfterSave(result);

            const nextGalleryImages = result?.media?.galleryImages as
                | WatchFormValues["media"]["galleryImages"]
                | undefined;
            const galleryCount =
                nextGalleryImages?.length ??
                submitValues.media.galleryImages?.length ??
                0;

            if (galleryCount <= 0) {
                await dialog.alert({
                    title: "Chưa có ảnh gallery",
                    message:
                        "Bạn cần chọn ít nhất một ảnh gallery trước khi gửi về Workspace.",
                    tone: "warning",
                });
                return;
            }

            const workspaceResult =
                await markWatchMediaAssetAttachedFromWatchAction({
                    productId: submitValues.productId,
                    note: "Spec, content, and media submitted from Watch edit workspace modal.",
                });

            if (workspaceResult?.skipped) {
                notify.info({
                    title: "Đã lưu media",
                    message:
                        "Không tìm thấy item Xử lý Media đang mở trong Workspace để cập nhật workflow.",
                });
            } else {
                notify.success({
                    title: "Đã gửi về Workspace",
                    message:
                        "Media đã được lưu và item đã chuyển sang trạng thái chờ duyệt trong Workspace.",
                });
            }

            if (embedded && window.parent && window.parent !== window) {
                window.parent.postMessage(
                    { type: "workspace-target-modal-close" },
                    window.location.origin,
                );
            } else {
                router.push(returnTo);
                router.refresh();
            }
        } catch (error: unknown) {
            notify.error({
                title: "Không thể gửi về Workspace",
                message: errorMessage(
                    error,
                    "Có lỗi xảy ra khi lưu media hoặc cập nhật workflow.",
                ),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
    };

    const saveMediaWorkspaceDraft = async () => {
        if (mediaSubmitPending) return;

        const submitValues: WatchFormValues = {
            ...buildSubmitValues(),
            saveIntent: "MEDIA_WORKSPACE",
        };

        if (!Object.values(mediaWorkTouched).some(Boolean)) {
            await dialog.alert({
                title: "Chưa có phần nào được xử lý",
                message:
                    "Bạn hãy thao tác ít nhất một phần trước khi lưu xử lý dở.",
                tone: "warning",
            });
            return;
        }

        setMediaSubmitPending(true);
        progress.show({
            title: "Đang lưu xử lý dở",
            message: "Hệ thống đang lưu dữ liệu watch và cập nhật tiến độ trong Workspace.",
        });

        try {
            const result = await submitWatchForm(submitValues);
            updateValuesAfterSave(result);

            await saveWatchMediaWorkDraftFromWatchAction({
                productId: submitValues.productId,
                parts: mediaWorkTouched,
                note: "Media work draft saved from Watch edit workspace modal.",
            });

            notify.success({
                title: "Đã lưu xử lý dở",
                message: "Tiến độ media đã được lưu trên item trong Workspace.",
            });

            router.refresh();
        } catch (error: unknown) {
            notify.error({
                title: "Không thể lưu xử lý dở",
                message: errorMessage(
                    error,
                    "Có lỗi xảy ra khi lưu dữ liệu hoặc cập nhật tiến độ Workspace.",
                ),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
    };

    const approveMediaWorkspaceFromModal = async () => {
        if (mediaSubmitPending || !workspaceBindingId) return;

        const missingWorkParts = missingMediaWorkPartLabels(mediaWorkTouched);

        if (missingWorkParts.length > 0) {
            await dialog.alert({
                title: "Chưa xử lý đủ media package",
                message: `Bạn cần thao tác đủ 3 phần trước khi duyệt: ${missingWorkParts.join(", ")}.`,
                tone: "warning",
            });
            return;
        }

        const submitValues: WatchFormValues = {
            ...buildSubmitValues(),
            saveIntent: "MEDIA_WORKSPACE",
        };

        if (!hasMediaWorkContent(submitValues)) {
            await dialog.alert({
                title: "Chưa có content",
                message:
                    "Bạn cần nhập hoặc generate content trước khi duyệt media.",
                tone: "warning",
            });
            return;
        }

        const localGalleryCount = submitValues.media.galleryImages?.length ?? 0;

        if (localGalleryCount <= 0) {
            await dialog.alert({
                title: "Chưa có ảnh gallery",
                message:
                    "Bạn cần chọn ít nhất một ảnh gallery trước khi duyệt media.",
                tone: "warning",
            });
            return;
        }

        setMediaSubmitPending(true);
        progress.show({
            title: "Đang duyệt media",
            message: "Hệ thống đang lưu watch, duyệt media và chuyển item sang Đăng bài.",
        });

        try {
            const result = await submitWatchForm(submitValues);
            updateValuesAfterSave(result);

            await markWatchMediaAssetAttachedFromWatchAction({
                productId: submitValues.productId,
                note: "Spec, content, and media approved from Watch edit workspace modal.",
            });

            await applyQueueItemManualTransitionAction({
                bindingId: workspaceBindingId,
                actionKey: "approve-media",
                note: "Approved from Watch media workspace modal.",
            });

            notify.success({
                title: "Đã duyệt media",
                message: "Item đã được duyệt và chuyển sang Workspace Đăng bài.",
            });

            if (embedded && window.parent && window.parent !== window) {
                window.parent.postMessage(
                    { type: "workspace-target-modal-close" },
                    window.location.origin,
                );
            } else {
                router.push(returnTo);
                router.refresh();
            }
        } catch (error: unknown) {
            notify.error({
                title: "Không thể duyệt media",
                message: errorMessage(
                    error,
                    "Có lỗi xảy ra khi lưu hoặc duyệt media trong Workspace.",
                ),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
    };

    const returnMediaWorkspaceFromModal = async () => {
        if (mediaSubmitPending || !workspaceBindingId) return;

        const accepted = await dialog.confirm({
            title: "Trả item về xử lý?",
            message:
                "Item sẽ quay về trạng thái Feedback trong Workspace Xử lý Media để user bổ sung lại.",
            tone: "warning",
            confirmText: "Trả về",
            cancelText: "Hủy",
        });

        if (!accepted) return;

        setMediaSubmitPending(true);
        progress.show({
            title: "Đang trả về",
            message: "Hệ thống đang cập nhật workflow xử lý media.",
        });

        try {
            await applyQueueItemManualTransitionAction({
                bindingId: workspaceBindingId,
                actionKey: "request-changes",
                note: "Returned from Watch media workspace modal.",
            });

            notify.success({
                title: "Đã trả về",
                message: "Item đã quay về trạng thái Feedback trong Workspace.",
            });

            if (embedded && window.parent && window.parent !== window) {
                window.parent.postMessage(
                    { type: "workspace-target-modal-close" },
                    window.location.origin,
                );
            } else {
                router.push(returnTo);
                router.refresh();
            }
        } catch (error: unknown) {
            notify.error({
                title: "Không thể trả về",
                message: errorMessage(
                    error,
                    "Có lỗi xảy ra khi cập nhật workflow xử lý media.",
                ),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
    };

    const saveBeforeReview = async (target?: "content" | "image") => {
        progress.show({
            title: "Đang lưu watch",
            message: "Hệ thống đang lưu thay đổi mới nhất trước khi duyệt.",
        });

        try {
            const submitValues = buildSubmitValues();

            submitValues.saveIntent =
                target === "image"
                    ? "SUBMIT_IMAGE"
                    : target === "content"
                        ? "SUBMIT_CONTENT"
                        : "NORMAL";

            const result = await submitWatchForm(submitValues);

            updateValuesAfterSave(result);

            notify.success({
                title: "Đã lưu watch",
                message:
                    result?.message ||
                    "Dữ liệu mới nhất đã được lưu trước khi duyệt.",
            });

            return true;
        } catch (error: unknown) {
            notify.error({
                title: "Không thể duyệt",
                message: errorMessage(error, "Không thể lưu watch trước khi duyệt."),
            });

            return false;
        } finally {
            progress.hide();
        }
    };

    const basicSection = (
        <WatchBasicSection
            values={values.basic}
            spec={values.spec}
            brands={brandOptions}
            vendors={vendors}
            categories={categories}
            postTargets={postTargets}
            onChange={updateBasic}
            onOpenSpecModal={() => setSpecModalOpen(true)}
            onBrandsChange={setBrandOptions}
            defaultOpen={isMediaMode}
        />
    );

    const contentSection = (
        <WatchContentSection
            productId={values.productId}
            values={values.content}
            watchValues={values}
            contentReviewStatus={values.contentReviewStatus}
            contentReviewNote={values.contentReviewNote}
            canReviewContent={canReviewContent}
            isFormDirty={isDirty}
            onChange={updateContent}
            onOpenSpecModal={() => setSpecModalOpen(true)}
            onBeforeSubmitReview={saveBeforeReview}
            onReviewStatusChange={(next) =>
                handleReviewStatusChange("content", next)
            }
            watchId={values.watchId}
            defaultOpen={isMediaMode}
            hideReviewActions={isMediaMode}
        />
    );

    const imageSection = (
        <>
            <WatchImageSection
                watchTitle={values.basic.title}
                inlineImage={inlineImage}
                watchId={values.watchId}
                productId={values.productId}
                poolImages={values.media.poolImages || []}
                galleryImages={values.media.galleryImages || []}
                imageReviewStatus={values.imageReviewStatus}
                imageReviewNote={values.imageReviewNote}
                canReviewContent={canReviewContent}
                isFormDirty={isDirty}
                openTaskCount={detail.taskSummary?.watchImage ?? 0}
                hideReviewActions={isMediaMode}
                onBeforeSubmitReview={saveBeforeReview}
                onPoolImagesChange={(items) => {
                    updateMedia({
                        poolImages: [...items],
                    });
                }}
                onGalleryImagesChange={(items) => {
                    updateMedia({
                        galleryImages: [...items],
                        imageCount: items.length,
                    });
                }}
                onReviewStatusChange={(next) =>
                    handleReviewStatusChange("image", next)
                }
                error={mediaError}
            />
            {fromMediaWorkspace ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="text-sm font-semibold text-emerald-950">
                                Xử lý Media Workspace
                            </div>
                            <p className="mt-1 text-sm text-emerald-800">
                                Chọn ảnh từ NAS, sau đó bấm xong để gửi item về Workspace chờ duyệt.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {[
                                    ["Thông tin/spec", mediaWorkTouched.profile],
                                    ["Content", mediaWorkTouched.content],
                                    ["Hình ảnh", mediaWorkTouched.image],
                                ].map(([label, done]) => (
                                    <span
                                        key={String(label)}
                                        className={[
                                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                            done
                                                ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                                                : "bg-white/70 text-amber-700 ring-amber-200",
                                        ].join(" ")}
                                    >
                                        {done ? "Đã xử lý" : "Chưa xử lý"} {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {isMediaWorkspaceDone ? (
                            <div className="inline-flex h-10 items-center rounded-xl bg-emerald-100 px-4 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
                                Đã hoàn tất
                            </div>
                        ) : (
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                disabled={mediaSubmitPending}
                                onClick={saveMediaWorkspaceDraft}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {mediaSubmitPending ? "Đang lưu" : "Lưu xử lý dở"}
                            </button>
                            {!canApproveMediaWorkspace ? (
                        <button
                            type="button"
                            disabled={mediaSubmitPending}
                            onClick={completeMediaWorkspaceStepSafe}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {mediaSubmitPending ? "Đang xử lý" : "Gửi duyệt"}
                        </button>
                            ) : null}
                            {canReturnMediaWorkspace ? (
                                <button
                                    type="button"
                                    disabled={mediaSubmitPending}
                                    onClick={returnMediaWorkspaceFromModal}
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {mediaSubmitPending ? "Đang xử lý" : "Trả về"}
                                </button>
                            ) : null}
                            {canApproveMediaWorkspace ? (
                                <button
                                    type="button"
                                    disabled={mediaSubmitPending}
                                    onClick={approveMediaWorkspaceFromModal}
                                    className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {mediaSubmitPending ? "Đang duyệt" : "Duyệt xong"}
                                </button>
                            ) : null}
                        </div>
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );

    if (isMediaMode) {
        return (
            <div className={embedded ? "space-y-4 p-4" : "space-y-6"}>
                <WatchEditHeader
                    values={values}
                    brands={brandOptions}
                    inlineImage={inlineImage}
                    pending={pending}
                    message=""
                    onSubmit={onSubmit}
                    onBack={handleBack}
                    canReviewContent={canReviewContent}
                    breadcrumbs={[
                        { label: "Watches", href: returnTo },
                        { label: values.basic.title || "Edit" },
                    ]}
                    onChange={(patch) => {
                        markMediaWorkTouched("profile");
                        setFormValues((prev) => ({
                            ...prev,
                            ...patch,
                            header: {
                                ...prev.header,
                                ...(patch.header ?? {}),
                            },
                            basic: {
                                ...prev.basic,
                                ...(patch.basic ?? {}),
                            },
                        }));
                    }}
                />
                {basicSection}
                {contentSection}
                {imageSection}
                <WatchSpecModal
                    open={specModalOpen}
                    values={values.spec}
                    onClose={() => setSpecModalOpen(false)}
                    onSave={replaceSpec}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <WatchEditHeader
                values={values}
                brands={brandOptions}
                inlineImage={inlineImage}
                pending={pending}
                message=""
                onSubmit={onSubmit}
                onBack={handleBack}
                canReviewContent={canReviewContent}
                breadcrumbs={[
                    { label: "Watches", href: returnTo },
                    { label: values.basic.title || "Edit" },
                ]}
                onChange={(patch) => {
                    markMediaWorkTouched("profile");
                    setFormValues((prev) => ({
                        ...prev,
                        ...patch,
                        header: {
                            ...prev.header,
                            ...(patch.header ?? {}),
                        },
                        basic: {
                            ...prev.basic,
                            ...(patch.basic ?? {}),
                        },
                    }));
                }}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    {basicSection}

                    <div ref={contentRef}>{contentSection}</div>

                    <WatchImageSection
                        watchTitle={values.basic.title}
                        inlineImage={inlineImage}
                        watchId={values.watchId}
                        productId={values.productId}
                        poolImages={values.media.poolImages || []}
                        galleryImages={values.media.galleryImages || []}
                        imageReviewStatus={values.imageReviewStatus}
                        imageReviewNote={values.imageReviewNote}
                        canReviewContent={canReviewContent}
                        isFormDirty={isDirty}
                        openTaskCount={detail.taskSummary?.watchImage ?? 0}
                        onBeforeSubmitReview={saveBeforeReview}
                        onPoolImagesChange={(items) => {
                            updateMedia({
                                poolImages: [...items],
                            });
                        }}
                        onGalleryImagesChange={(items) => {
                            updateMedia({
                                galleryImages: [...items],
                                imageCount: items.length,
                            });
                        }}
                        onReviewStatusChange={(next) =>
                            handleReviewStatusChange("image", next)
                        }
                        error={mediaError}
                    />
                    {fromMediaWorkspace ? (
                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-emerald-950">
                                        Xử lý Media Workspace
                                    </div>
                                    <p className="mt-1 text-sm text-emerald-800">
                                        Xử lý thông tin, content và hình ảnh. Có thể lưu dở, gửi duyệt hoặc duyệt ngay nếu bạn có quyền.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={mediaSubmitPending}
                                        onClick={saveMediaWorkspaceDraft}
                                        className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {mediaSubmitPending ? "Đang lưu" : "Lưu xử lý dở"}
                                    </button>
                                    {!canApproveMediaWorkspace ? (
                                <button
                                    type="button"
                                    disabled={mediaSubmitPending}
                                    onClick={completeMediaWorkspaceStepSafe}
                                    className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {mediaSubmitPending ? "Đang xử lý" : "Gửi duyệt"}
                                </button>
                                    ) : null}
                                    {canReturnMediaWorkspace ? (
                                        <button
                                            type="button"
                                            disabled={mediaSubmitPending}
                                            onClick={returnMediaWorkspaceFromModal}
                                            className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {mediaSubmitPending ? "Đang xử lý" : "Trả về"}
                                        </button>
                                    ) : null}
                                    {canApproveMediaWorkspace ? (
                                        <button
                                            type="button"
                                            disabled={mediaSubmitPending}
                                            onClick={approveMediaWorkspaceFromModal}
                                            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {mediaSubmitPending ? "Đang duyệt" : "Duyệt xong"}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <WatchStateSection
                        productId={values.productId}
                        saleState={values.basic.saleState}
                        serviceState={values.basic.serviceState}
                        stockState={values.basic.stockState}
                        productStatus={values.header.status}
                        onChange={(patch) => {
                            setFormValues((prev) => ({
                                ...prev,
                                header: {
                                    ...prev.header,
                                    ...(patch.header ?? {}),
                                },
                                basic: {
                                    ...prev.basic,
                                    ...(patch.basic ?? {}),
                                },
                            }));
                        }}
                    />

                    <div
                        ref={pricingRef}
                        className={
                            focus === "pricing"
                                ? "rounded-[32px] ring-2 ring-amber-300 ring-offset-4 ring-offset-slate-50"
                                : ""
                        }
                    >
                        <WatchPricingSidebar
                            values={values.pricing}
                            canViewCost={canViewCost}
                            canEditPrice={canEditPrice}
                            notificationDiff={
                                focus === "pricing"
                                    ? searchParams.get("notificationId")
                                    : null
                            }
                            onChange={updatePricing}
                        />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                    Title & SKU
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                    Sau khi bổ sung spec cần thiết, bấm để gen lại title
                                    và SKU theo rule hệ thống.
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Title hiện tại
                                        </div>
                                        <div className="mt-1 break-words text-sm text-slate-800">
                                            {values.basic.title || "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            SKU hiện tại
                                        </div>
                                        <div className="mt-1 text-sm text-slate-800">
                                            {values.header.sku || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <WatchMediaSidebar values={values.media} />
                </div>
            </div>

            <WatchSpecModal
                open={specModalOpen}
                values={values.spec}
                onClose={() => setSpecModalOpen(false)}
                onSave={replaceSpec}
            />

            <AfterSaveDialog
                open={afterSaveOpen}
                detailHref={`/admin/watches/${values.productId}?returnTo=${encodeURIComponent(
                    returnTo,
                )}`}
                fallbackBackHref={returnTo}
                title={
                    afterSaveMode === "submitImage"
                        ? "Đã lưu hình ảnh"
                        : afterSaveMode === "submitBoth"
                            ? "Đã lưu nội dung và hình ảnh"
                            : afterSaveMode === "submitContent"
                                ? "Đã lưu nội dung"
                                : afterSaveMode === "continueContent"
                                    ? "Đã lưu hình ảnh"
                                    : "Đã lưu thành công"
                }
                message={
                    afterSaveMode === "submitImage"
                        ? "Hình ảnh đã được cập nhật. Bạn có muốn gửi duyệt hình ảnh luôn không?"
                        : afterSaveMode === "submitBoth"
                            ? "Nội dung và hình ảnh đã sẵn sàng. Bạn có muốn gửi duyệt cả hai luôn không?"
                            : afterSaveMode === "submitContent"
                                ? "Nội dung đã sẵn sàng. Bạn có muốn gửi duyệt nội dung luôn không?"
                                : afterSaveMode === "continueContent"
                                    ? "Bạn mới cập nhật hình ảnh nhưng chưa có nội dung bán hàng. Bạn có muốn thao tác tiếp phần content không?"
                                    : "Bạn muốn tiếp tục chỉnh sửa hay điều hướng sang màn hình khác?"
                }
                continueLabel={
                    afterSaveMode === "submitBoth"
                        ? "Gửi duyệt cả hai"
                        : afterSaveMode === "submitContent" ||
                            afterSaveMode === "submitImage"
                            ? "Gửi duyệt"
                            : afterSaveMode === "continueContent"
                                ? "Soạn content"
                                : "Chỉnh tiếp"
                }
                continueIcon={
                    afterSaveMode === "submitContent" ||
                        afterSaveMode === "submitImage" ||
                        afterSaveMode === "submitBoth"
                        ? "send"
                        : "edit"
                }
                onContinue={async () => {
                    if (
                        afterSaveMode === "submitContent" ||
                        afterSaveMode === "submitImage" ||
                        afterSaveMode === "submitBoth"
                    ) {
                        await submitReviewByMode();
                        setAfterSaveOpen(false);
                        return;
                    }

                    if (afterSaveMode === "continueContent") {
                        setAfterSaveOpen(false);

                        window.setTimeout(() => {
                            contentRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }, 120);

                        return;
                    }

                    setAfterSaveOpen(false);
                }}
            />

        </div>
    );
}
