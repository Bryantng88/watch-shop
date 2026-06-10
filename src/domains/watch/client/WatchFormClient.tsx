"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import AfterSaveDialog from "@/domains/shared/ui/navigation/AfterSaveDialog";

import { submitWatchForm } from "./form/watch-form.actions";
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
    detail: any;
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

    const [afterSaveOpen, setAfterSaveOpen] = useState(false);
    const [afterSaveMode, setAfterSaveMode] = useState<AfterSaveMode>("normal");
    const [relatedTaskOpen, setRelatedTaskOpen] = useState(false);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const pricingRef = useRef<HTMLDivElement | null>(null);

    const focus = searchParams.get("focus");
    const returnTo = searchParams.get("returnTo") || "/admin/watches";
    const inlineImage = values.media.inlineImage;
    const isDirty = stableStringify(values) !== stableStringify(savedValues);

    const setFormValues = (updater: (prev: WatchFormValues) => WatchFormValues) => {
        setValues((prev) => {
            const next = updater(prev);
            valuesRef.current = next;
            return next;
        });
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

    const updateSpec = (patch: Partial<WatchFormValues["spec"]>) => {
        setFormValues((prev) => ({
            ...prev,
            spec: {
                ...prev.spec,
                ...patch,
            },
        }));
    };

    const replaceSpec = (next: WatchFormValues["spec"]) => {
        setFormValues((prev) => ({
            ...prev,
            spec: next,
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
            } catch (error: any) {
                notify.error({
                    title: "Không thể lưu watch",
                    message: error?.message || "Có lỗi xảy ra khi lưu watch.",
                });
            } finally {
                progress.hide();
            }
        });
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
        } catch (error: any) {
            notify.error({
                title: "Không thể duyệt",
                message: error?.message || "Không thể lưu watch trước khi duyệt.",
            });

            return false;
        } finally {
            progress.hide();
        }
    };
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
                    />

                    <div ref={contentRef}>
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
                        />
                    </div>

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