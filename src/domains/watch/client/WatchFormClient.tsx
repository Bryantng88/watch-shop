"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Camera, ClipboardList } from "lucide-react";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import {
    useAppProgress,
    type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import AfterSaveDialog from "@/domains/shared/ui/navigation/AfterSaveDialog";
import { applyQueueItemManualTransitionAction } from "@/domains/task/actions/task.actions";

import { submitWatchForm } from "./form/watch-form.actions";
import {
    markWatchMediaAssetAttachedFromWatchAction,
    requestWatchMediaReshootFromWatchAction,
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

const MEDIA_WORK_PARTS: Array<{ key: MediaWorkPart; label: string }> = [
    { key: "profile", label: "Thông tin/spec" },
    { key: "content", label: "Content" },
    { key: "image", label: "Hình ảnh" },
];

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

function missingMediaWorkPartLabels(doneState: Record<MediaWorkPart, boolean>) {
    return MEDIA_WORK_PARTS
        .filter((part) => !doneState[part.key])
        .map((part) => part.label);
}

function MediaWorkDoneButton({
    label,
    done,
    disabled,
    onClick,
}: {
    label: string;
    done: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={[
                "inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-60",
                done
                    ? "bg-emerald-100 text-emerald-800 ring-emerald-200 hover:bg-emerald-200"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
            title={done ? "Bấm để mở lại và lưu mục này" : "Lưu và xác nhận mục này đã xong"}
        >
            {done ? "Đã lưu & xong" : "Lưu & đánh dấu xong"} {label}
        </button>
    );
}

function setStepStatus(
    steps: AppProgressStep[],
    id: string,
    status: AppProgressStep["status"],
    detail?: string,
) {
    return steps.map((step) =>
        step.id === id
            ? {
                ...step,
                status,
                detail: detail ?? step.detail,
            }
            : step,
    );
}

function recordValue(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function resultItems(value: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => recordValue(item))
        .filter((item) => Object.keys(item).length > 0);
}

function firstText(value: unknown): string {
    if (Array.isArray(value)) {
        return value.map((item) => String(item ?? "").trim()).filter(Boolean).join(", ");
    }

    return String(value ?? "").trim();
}

function mediaApproveNotificationStep(
    mediaProcessingResult: unknown,
): Pick<AppProgressStep, "status" | "detail"> {
    const event = recordValue(recordValue(mediaProcessingResult).event);
    const consumers = recordValue(event.consumers);
    const notification = recordValue(consumers.notification);
    const status = String(notification.status ?? "");
    const reason = String(notification.reason ?? "");
    const error = String(notification.error ?? "");

    if (!Object.keys(notification).length) {
        return {
            status: "skipped",
            detail: "Khong co ket qua notification tu event dispatch.",
        };
    }

    const items = resultItems(notification.result);
    const sentItem = items.find((item) => item.ok === true && item.skipped !== true && item.dispatchId);
    const skippedItem = items.find((item) => item.skipped === true);
    const failedItem = items.find((item) => item.ok === false || item.error);

    if (sentItem) {
        return {
            status: "done",
            detail: "Notification da duoc dispatch.",
        };
    }

    if (failedItem) {
        return {
            status: "error",
            detail: firstText(failedItem.error) || "Notification dispatch failed.",
        };
    }

    if (skippedItem) {
        const skippedReason = firstText(skippedItem.reason);
        const missingKeys = firstText(skippedItem.missingKeys);

        return {
            status: "skipped",
            detail: missingKeys
                ? `Notification skipped: ${skippedReason || "MISSING_TEMPLATE_VALUES"} (${missingKeys})`
                : skippedReason
                    ? `Notification skipped: ${skippedReason}`
                    : "Notification skipped.",
        };
    }

    if (status === "skipped" || notification.skipped === true) {
        return {
            status: "skipped",
            detail: reason ? `Notification skipped: ${reason}` : "Notification skipped.",
        };
    }

    if (status === "success" || notification.ok === true) {
        return {
            status: "skipped",
            detail: "Notification consumer thanh cong nhung khong tao dispatch.",
        };
    }

    return {
        status: "error",
        detail: error || "Notification dispatch failed.",
    };
}

function mediaApproveConsumerResult(
    mediaProcessingResult: unknown,
    consumerKey: string,
) {
    const event = recordValue(recordValue(mediaProcessingResult).event);
    const consumers = recordValue(event.consumers);
    return recordValue(consumers[consumerKey]);
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
    const [reshootNoteOpen, setReshootNoteOpen] = useState(false);
    const [reshootNote, setReshootNote] = useState("");
    const [mediaWorkDone, setMediaWorkDone] = useState<
        Record<MediaWorkPart, boolean>
    >({
        profile: searchParams.get("mediaProfileDone") === "1",
        content: searchParams.get("mediaContentDone") === "1",
        image: searchParams.get("mediaImageDone") === "1",
    });
    const [activeMediaSection, setActiveMediaSection] = useState<
        "basic" | "content" | "image"
    >("basic");

    const [afterSaveOpen, setAfterSaveOpen] = useState(false);
    const [afterSaveMode, setAfterSaveMode] = useState<AfterSaveMode>("normal");

    const basicRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLDivElement | null>(null);
    const pricingRef = useRef<HTMLDivElement | null>(null);

    const focus = searchParams.get("focus");
    const fromMediaWorkspace = searchParams.get("from") === "media-workspace";
    const fromPhotoshootWorkspace = searchParams.get("from") === "photoshoot-workspace";
    const embedded = searchParams.get("embedded") === "1";
    const viewMode = searchParams.get("mode") || "full";
    const isMediaMode = viewMode === "media";
    const returnTo =
        searchParams.get("returnTo") ||
        (isMediaMode
            ? `/admin/watches/${initialValues.productId}`
            : "/admin/watches");
    const workspaceBindingId = searchParams.get("workspaceBindingId") || "";
    const initialWorkspaceState = searchParams.get("workspaceState") || "";
    const [workspaceState, setWorkspaceState] = useState(initialWorkspaceState);
    const isMediaWorkspaceDone = workspaceState === "DONE";
    const isMediaWorkspaceReturned = workspaceState === "RETURNED";
    const canApproveMediaWorkspace =
        fromMediaWorkspace &&
        Boolean(workspaceBindingId) &&
        canReviewContent &&
        (workspaceState === "NEW" || workspaceState === "REVIEW");
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

    const saveMediaWorkspacePart = async (part: MediaWorkPart) => {
        if (!isMediaMode || !fromMediaWorkspace || mediaSubmitPending) return;

        const nextDone = !mediaWorkDone[part];
        const submitValues: WatchFormValues = {
            ...buildSubmitValues(),
            saveIntent: "MEDIA_WORKSPACE",
        };
        const partLabel = MEDIA_WORK_PARTS.find((item) => item.key === part)?.label ?? part;

        setMediaSubmitPending(true);
        progress.show({
            title: `Đang lưu ${partLabel}`,
            message: "Hệ thống đang lưu mục này và cập nhật tiến độ Workspace.",
        });

        try {
            const result = await submitWatchForm(submitValues);
            updateValuesAfterSave(result);

            const progressResult = await saveWatchMediaWorkDraftFromWatchAction({
                productId: submitValues.productId,
                parts: { [part]: nextDone },
                note: `${partLabel} saved from Watch edit workspace modal.`,
            });
            if (progressResult.skipped || !("parts" in progressResult)) {
                throw new Error("Không tìm thấy item Xử lý Media đang mở để lưu tiến độ.");
            }

            setMediaWorkDone({
                profile: Boolean(progressResult.parts?.profile),
                content: Boolean(progressResult.parts?.content),
                image: Boolean(progressResult.parts?.image),
            });

            notify.success({
                title: nextDone ? `Đã lưu ${partLabel}` : `Đã mở lại ${partLabel}`,
                message: nextDone
                    ? "Mục này đã được lưu và đánh dấu hoàn tất."
                    : "Mục này đã được chuyển về trạng thái cần xử lý.",
            });
        } catch (error: unknown) {
            notify.error({
                title: `Không thể lưu ${partLabel}`,
                message: errorMessage(error, "Có lỗi xảy ra khi lưu mục này."),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
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
        setFormValues((prev) => ({
            ...prev,
            basic: {
                ...prev.basic,
                ...patch,
            },
        }));
    };

    const replaceSpec = (next: WatchFormValues["spec"]) => {
        setFormValues((prev) => ({
            ...prev,
            spec: next,
            specStatus: "PARTIAL",
        }));
    };

    const updateSpec = (patch: Partial<WatchFormValues["spec"]>) => {
        setFormValues((prev) => ({
            ...prev,
            spec: {
                ...prev.spec,
                ...patch,
            },
            specStatus: "PARTIAL",
        }));
    };

    const updateContent = (patch: Partial<WatchFormValues["content"]>) => {
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
        setFormValues((prev) => ({
            ...prev,
            media: {
                ...prev.media,
                ...patch,
            },
        }));
    };

    const scrollToMediaSection = (target: "basic" | "content" | "image") => {
        setActiveMediaSection(target);
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
                const missingWorkParts = missingMediaWorkPartLabels(mediaWorkDone);

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


    const saveMediaWorkspaceDraft = async () => {
        if (mediaSubmitPending) return;

        const submitValues: WatchFormValues = {
            ...buildSubmitValues(),
            saveIntent: "MEDIA_WORKSPACE",
        };

        setMediaSubmitPending(true);
        progress.show({
            title: "Đang lưu xử lý dở",
            message: "Hệ thống đang lưu watch và cập nhật tiến độ trong Workspace.",
        });

        try {
            const result = await submitWatchForm(submitValues);
            updateValuesAfterSave(result);

            await saveWatchMediaWorkDraftFromWatchAction({
                productId: submitValues.productId,
                parts: mediaWorkDone,
                note: "Media work draft saved from Watch edit workspace modal.",
            });

            notify.success({
                title: "Đã lưu xử lý dở",
                message: "Watch và tiến độ media đã được lưu.",
            });

            router.refresh();
        } catch (error: unknown) {
            notify.error({
                title: "Không thể lưu xử lý dở",
                message: errorMessage(
                    error,
                    "Có lỗi xảy ra khi lưu watch hoặc cập nhật tiến độ Workspace.",
                ),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
    };

    const requestMediaReshootFromModal = async () => {
        if (mediaSubmitPending || !workspaceBindingId) return;
        const note = reshootNote.trim();
        if (!note) return;

        const submitValues: WatchFormValues = {
            ...buildSubmitValues(),
            saveIntent: "MEDIA_WORKSPACE",
        };
        setMediaSubmitPending(true);
        progress.show({
            title: "Đang yêu cầu chụp lại",
            message: "Hệ thống đang lưu watch, cập nhật activity và chuyển item về Photoshoot.",
        });

        try {
            const result = await submitWatchForm(submitValues);
            updateValuesAfterSave(result);

            const reshootResult = await requestWatchMediaReshootFromWatchAction({
                bindingId: workspaceBindingId,
                productId: submitValues.productId,
                note,
            });

            if (reshootResult?.skipped) {
                await dialog.alert({
                    title: "Chưa thể chuyển về Photoshoot",
                    message:
                        reshootResult.reason === "WATCH_ALREADY_IN_ACTIVE_PHOTOSHOOT"
                            ? "Watch này đã có item Photoshoot đang mở."
                            : "Không tìm thấy item Xử lý Media đang mở để chuyển về Photoshoot.",
                    tone: "warning",
                });
                return;
            }

            setMediaWorkDone((prev) => ({
                ...prev,
                image: false,
            }));
            setWorkspaceState("RETURNED");
            setReshootNoteOpen(false);
            setReshootNote("");

            notify.success({
                title: "Đã yêu cầu chụp lại",
                message: "Item đã được chuyển về Photoshoot và activity đã được cập nhật.",
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
                title: "Không thể yêu cầu chụp lại",
                message: errorMessage(
                    error,
                    "Có lỗi xảy ra khi lưu watch hoặc chuyển item về Photoshoot.",
                ),
            });
        } finally {
            setMediaSubmitPending(false);
            progress.hide();
        }
    };

    const approveMediaWorkspaceFromModal = async () => {
        if (mediaSubmitPending || !workspaceBindingId) return;
        if (isMediaWorkspaceReturned) {
            await dialog.alert({
                title: "Item da tra ve chup lai",
                message: "Can cap nhat anh moi tu Photoshoot truoc khi duyet qua Workspace Dang bai.",
                tone: "warning",
            });
            return;
        }

        const missingWorkParts = missingMediaWorkPartLabels(mediaWorkDone);

        if (missingWorkParts.length > 0) {
            await dialog.alert({
                title: "Chưa xử lý đủ media package",
                message: `Bạn cần thao tác đủ 3 phần trước khi duyệt: ${missingWorkParts.join(", ")}.`,
                tone: "warning",
            });
            return;
        }

        setMediaSubmitPending(true);
        let steps: AppProgressStep[] = [
            {
                id: "approve",
                label: "Duyet content va hinh anh",
                detail: "Dang chay workflow approve-media cho item Workspace.",
                status: "running",
            },
            {
                id: "publish",
                label: "Chuyen sang Dang bai",
                detail: "Tao item Publish workspace tu event ready_for_publish.",
                status: "pending",
            },
            {
                id: "notification",
                label: "Gui notification",
                detail: "Gui Zalo notification theo rule watch.media.ready_for_publish.",
                status: "pending",
            },
            {
                id: "close",
                label: "Hoan tat va lam moi workspace",
                status: "pending",
            },
        ];
        progress.show({
            steps,
            title: "Đang duyệt media",
            message: "He thong dang duyet media va chuyen item sang Dang bai.",
        });
        let elapsedSeconds = 0;
        const heartbeat = window.setInterval(() => {
            elapsedSeconds += 6;
            progress.update({
                message: `Server dang xu ly workflow, event, notification... (${elapsedSeconds}s)`,
                steps,
            });
        }, 6000);
        let hideDelay = 1200;

        try {
            const transitionResult = await applyQueueItemManualTransitionAction({
                bindingId: workspaceBindingId,
                actionKey: "approve-media",
                note: "Approved from Watch media workspace modal.",
            });
            const workflowResult = transitionResult?.result;
            const mediaProcessingResult = transitionResult?.mediaProcessingResult;

            if (!workflowResult?.applied || workflowResult.toState !== "DONE") {
                throw new Error(
                    `Workflow chua hoan tat: ${workflowResult?.reason ?? "UNKNOWN"}`,
                );
            }

            if (
                !mediaProcessingResult ||
                mediaProcessingResult.ok === false ||
                mediaProcessingResult.skipped
            ) {
                throw new Error(
                    `Chua chuyen sang Dang bai: ${mediaProcessingResult?.reason ?? "MEDIA_PROCESSING_NOT_COMPLETED"}`,
                );
            }
            const coordinationResult = mediaApproveConsumerResult(
                mediaProcessingResult,
                "coordination",
            );

            if (
                coordinationResult.status !== "success" &&
                coordinationResult.ok !== true
            ) {
                throw new Error(
                    `Chua tao duoc item Dang bai: ${coordinationResult.reason ?? coordinationResult.error ?? "COORDINATION_NOT_COMPLETED"}`,
                );
            }

            steps = setStepStatus(steps, "approve", "done", "Content/image da duoc duyet.");
            steps = setStepStatus(steps, "publish", "done", "Da chuyen item sang Publish workspace.");
            const notificationStep = mediaApproveNotificationStep(mediaProcessingResult);
            steps = setStepStatus(
                steps,
                "notification",
                notificationStep.status,
                notificationStep.detail,
            );
            steps = setStepStatus(steps, "close", "running");
            progress.update({
                message: "Dang lam moi workspace.",
                steps,
            });

            if (notificationStep.status === "done") {
                notify.success({
                    title: "Đã duyệt media",
                    message: "Item đã được duyệt, chuyển sang Workspace Đăng bài và đã gửi notification.",
                });
            } else {
                notify.warning({
                    title: "Đã duyệt media, notification chưa gửi",
                    message: notificationStep.detail ?? "Notification chưa tạo dispatch thật.",
                    duration: 6000,
                });
            }

            steps = setStepStatus(steps, "close", "done", "Workspace da duoc lam moi.");
            progress.update({
                message:
                    notificationStep.status === "done"
                        ? "Duyet media hoan tat."
                        : "Duyet media hoan tat, notification can kiem tra.",
                steps,
            });
            hideDelay = 2200;

            window.setTimeout(() => {
                if (embedded && window.parent && window.parent !== window) {
                    router.refresh();
                } else {
                    router.push(returnTo);
                    router.refresh();
                }
            }, 350);
        } catch (error: unknown) {
            hideDelay = 5000;
            const message = errorMessage(
                error,
                "Co loi xay ra khi duyet media hoac cap nhat Workspace.",
            );
            steps = steps.map((step) =>
                step.status === "running"
                    ? { ...step, status: "error", detail: message }
                    : step,
            );
            progress.update({
                title: "Duyet media that bai",
                message,
                steps,
            });
            notify.error({
                title: "Không thể duyệt media",
                message,
            });
        } finally {
            window.clearInterval(heartbeat);
            setMediaSubmitPending(false);
            window.setTimeout(() => progress.hide(), hideDelay);
        }
    };

    const returnMediaWorkspaceFromModal = async () => {
        if (mediaSubmitPending || !workspaceBindingId) return;

        const accepted = await dialog.confirm({
            title: "Trả item về xử lý?",
            message:
                "Item se quay ve trang thai Returned trong Workspace Xu ly Media de user bo sung lai.",
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
                message: "Item da quay ve trang thai Returned trong Workspace.",
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

    const reopenMediaWorkspaceFromModal = async () => {
        if (mediaSubmitPending || !workspaceBindingId) return;

        const accepted = await dialog.confirm({
            title: "Má»Ÿ láº¡i xá»­ lÃ½ media?",
            message:
                "Item nay dang bi khoa o trang thai hoan tat. Mo lai se chuyen ve Returned de xu ly va duyet lai.",
            tone: "warning",
            confirmText: "Má»Ÿ láº¡i",
            cancelText: "Há»§y",
        });

        if (!accepted) return;

        setMediaSubmitPending(true);
        progress.show({
            title: "Äang má»Ÿ láº¡i xá»­ lÃ½",
            message: "He thong dang chuyen item media ve trang thai Returned.",
        });

        try {
            const result = await applyQueueItemManualTransitionAction({
                bindingId: workspaceBindingId,
                actionKey: "reopen-media",
                note: "Reopened from Watch media workspace modal.",
            });

            if (!result?.result?.applied || result.result.toState !== "RETURNED") {
                throw new Error(result?.result?.reason ?? "REOPEN_MEDIA_NOT_APPLIED");
            }

            setWorkspaceState("RETURNED");
            notify.success({
                title: "ÄÃ£ má»Ÿ láº¡i xá»­ lÃ½",
                message: "Báº¡n cÃ³ thá»ƒ cáº­p nháº­t media vÃ  duyá»‡t láº¡i item nÃ y.",
            });
            router.refresh();
        } catch (error: unknown) {
            notify.error({
                title: "KhÃ´ng thá»ƒ má»Ÿ láº¡i xá»­ lÃ½",
                message: errorMessage(
                    error,
                    "Co loi xay ra khi chuyen item media ve Returned.",
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

    const mediaDoneAction = (part: MediaWorkPart) =>
        fromMediaWorkspace ? (
            <MediaWorkDoneButton
                label={MEDIA_WORK_PARTS.find((item) => item.key === part)?.label ?? part}
                done={mediaWorkDone[part]}
                disabled={mediaSubmitPending || isMediaWorkspaceDone || isMediaWorkspaceReturned}
                onClick={() => void saveMediaWorkspacePart(part)}
            />
        ) : null;

    const mediaImageActions = fromMediaWorkspace ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {workspaceBindingId && !isMediaWorkspaceDone ? (
                <button
                    type="button"
                    disabled={mediaSubmitPending || isMediaWorkspaceReturned}
                    onClick={() => setReshootNoteOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-amber-200 bg-white px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Yêu cầu chụp lại
                </button>
            ) : null}
            {reshootNoteOpen ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[1px]">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-950">Yêu cầu chụp lại ảnh</h3>
                                <p className="mt-1 text-sm text-slate-500">Ghi rõ phần Photoshoot cần chụp lại.</p>
                            </div>
                            <button
                                type="button"
                                disabled={mediaSubmitPending}
                                onClick={() => setReshootNoteOpen(false)}
                                className="rounded-lg px-2 py-1 text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Đóng"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-5">
                            <label htmlFor="reshoot-note" className="text-sm font-semibold text-slate-800">
                                Nội dung cần chụp lại
                            </label>
                            <textarea
                                id="reshoot-note"
                                autoFocus
                                rows={4}
                                maxLength={500}
                                value={reshootNote}
                                disabled={mediaSubmitPending}
                                onChange={(event) => setReshootNote(event.target.value)}
                                placeholder="Ví dụ: Chụp lại chính diện vì mặt kính bị phản sáng."
                                className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                            />
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
                            <button
                                type="button"
                                disabled={mediaSubmitPending}
                                onClick={() => setReshootNoteOpen(false)}
                                className="h-9 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-200/70"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                disabled={mediaSubmitPending || !reshootNote.trim()}
                                onClick={requestMediaReshootFromModal}
                                className="h-9 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {mediaSubmitPending ? "Đang xử lý" : "Yêu cầu chụp lại"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            {mediaDoneAction("image")}
        </div>
    ) : null;

    const mediaHeaderActions = fromMediaWorkspace ? (
        <>
            {isMediaWorkspaceDone ? (
                <>
                    <span className="inline-flex h-10 items-center rounded-xl bg-emerald-100 px-4 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
                        Đã hoàn tất
                    </span>
                    <button
                        type="button"
                        disabled={mediaSubmitPending}
                        onClick={reopenMediaWorkspaceFromModal}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-amber-200 bg-white px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {mediaSubmitPending ? "Đang xử lý" : "Mở lại xử lý"}
                    </button>
                </>
            ) : (
                <>
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
                        <button
                            type="button"
                            disabled={mediaSubmitPending || !canApproveMediaWorkspace}
                            onClick={approveMediaWorkspaceFromModal}
                            title={isMediaWorkspaceReturned ? "Item dang o trang thai Returned, can xu ly lai anh truoc khi duyet." : undefined}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {mediaSubmitPending ? "Đang duyệt" : "Duyệt xong"}
                        </button>
                </>
            )}
        </>
    ) : null;

    const basicSection = (
        <WatchBasicSection
            values={values.basic}
            spec={values.spec}
            pricing={values.pricing}
            brands={brandOptions}
            categories={categories}
            postTargets={postTargets}
            onChange={updateBasic}
            onSpecChange={updateSpec}
            onPricingChange={updatePricing}
            onBrandsChange={setBrandOptions}
            canViewCost={canViewCost}
            canEditPrice={canEditPrice}
            defaultOpen={isMediaMode}
            actions={mediaDoneAction("profile")}
            collapsible={!isMediaMode}
            surface={isMediaMode ? "flat" : "card"}
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
            completionAction={mediaDoneAction("content")}
            collapsible={!isMediaMode}
            surface={isMediaMode ? "flat" : "card"}
        />
    );

    const imageSection = (
        <>
            <WatchImageSection
                watchTitle={values.basic.title}
                inlineImage={inlineImage}
                watchId={values.watchId}
                productId={values.productId}
                audienceSegment={detail.audienceSegment === "WOMEN" ? "WOMEN" : "MEN"}
                poolImages={values.media.poolImages || []}
                galleryImages={values.media.galleryImages || []}
                imageReviewStatus={values.imageReviewStatus}
                imageReviewNote={values.imageReviewNote}
                canReviewContent={canReviewContent}
                isFormDirty={isDirty}
                openTaskCount={detail.taskSummary?.watchImage ?? 0}
                hideReviewActions={isMediaMode}
                mediaActions={mediaImageActions}
                collapsible={!isMediaMode}
                surface={isMediaMode ? "flat" : "card"}
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
                    onSubmit={fromMediaWorkspace ? saveMediaWorkspaceDraft : onSubmit}
                    onBack={handleBack}
                    canReviewContent={canReviewContent}
                    hideBack={false}
                    hideSubmit={fromMediaWorkspace || fromPhotoshootWorkspace}
                    headerActions={mediaHeaderActions}
                    breadcrumbs={[
                        { label: "Watches", href: returnTo },
                        { label: values.basic.title || "Edit" },
                    ]}
                    onChange={(patch) => {
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
                <div className="min-h-[560px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur">
                        <div className="flex gap-2 overflow-x-auto">
                                {[
                                    {
                                        key: "basic" as const,
                                        title: "Thông tin chính",
                                        subtitle: "Spec, giá và định danh",
                                        done: mediaWorkDone.profile,
                                        icon: ClipboardList,
                                    },
                                    {
                                        key: "content" as const,
                                        title: "Content",
                                        subtitle: "Hook, body và bullet",
                                        done: mediaWorkDone.content,
                                        icon: BookOpen,
                                    },
                                    {
                                        key: "image" as const,
                                        title: "Hình ảnh",
                                        subtitle: "Gallery và chụp lại",
                                        done: mediaWorkDone.image,
                                        icon: Camera,
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const active = activeMediaSection === item.key;

                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => scrollToMediaSection(item.key)}
                                            className={[
                                                "group inline-flex h-11 min-w-max items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                                                active
                                                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                                                    : "border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ring-1",
                                                    active
                                                        ? "bg-white text-blue-700 ring-blue-200"
                                                        : "bg-slate-50 text-slate-500 ring-slate-200 group-hover:text-slate-700",
                                                ].join(" ")}
                                            >
                                                {item.key === "basic" ? "1" : item.key === "content" ? "2" : "3"}
                                            </span>
                                            <Icon className="h-4 w-4" aria-hidden="true" />
                                            <span>{item.title}</span>
                                            <span
                                                className={[
                                                    "h-2 w-2 rounded-full ring-4",
                                                    item.done
                                                        ? "bg-emerald-500 ring-emerald-50"
                                                        : "bg-slate-300 ring-slate-50",
                                                ].join(" ")}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="hidden">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between px-3 py-2 text-left font-medium hover:text-slate-800"
                                >
                                    <span>Thông tin nâng cao</span>
                                    <span className="text-slate-400">⌄</span>
                                </button>
                            </div>
                        </div>

                    <div className="min-w-0 bg-white">
                        {activeMediaSection === "basic" ? (
                            <div ref={basicRef}>{basicSection}</div>
                        ) : null}
                        {activeMediaSection === "content" ? (
                            <div ref={contentRef}>{contentSection}</div>
                        ) : null}
                        {activeMediaSection === "image" ? (
                            <div ref={imageRef}>{imageSection}</div>
                        ) : null}
                    </div>
                </div>
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
                onSubmit={fromMediaWorkspace ? saveMediaWorkspaceDraft : onSubmit}
                onBack={handleBack}
                canReviewContent={canReviewContent}
                hideSubmit={fromMediaWorkspace}
                headerActions={mediaHeaderActions}
                breadcrumbs={[
                    { label: "Watches", href: returnTo },
                    { label: values.basic.title || "Edit" },
                ]}
                onChange={(patch) => {
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
                        audienceSegment={detail.audienceSegment === "WOMEN" ? "WOMEN" : "MEN"}
                        poolImages={values.media.poolImages || []}
                        galleryImages={values.media.galleryImages || []}
                        imageReviewStatus={values.imageReviewStatus}
                        imageReviewNote={values.imageReviewNote}
                        canReviewContent={canReviewContent}
                        isFormDirty={isDirty}
                        openTaskCount={detail.taskSummary?.watchImage ?? 0}
                        hideReviewActions={fromMediaWorkspace}
                        mediaActions={mediaImageActions}
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
