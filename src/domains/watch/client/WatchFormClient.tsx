"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
};

type Props = {
    detail: any;
    brands?: SimpleOption[];
    vendors?: SimpleOption[];
    categories?: SimpleOption[];
    canViewCost?: boolean;
    canEditPrice?: boolean;
    canReviewContent?: boolean;
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

export default function WatchFormClient({
    detail,
    brands = [],
    vendors = [],
    categories = [],
    canViewCost = false,
    canEditPrice = false,
    canReviewContent = false,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const notify = useNotify();

    const initialValues = useMemo(
        () => mapWatchDetailToFormValues(detail),
        [detail]
    );

    const [values, setValues] = useState<WatchFormValues>(initialValues);
    const [pending, startTransition] = useTransition();

    const [message, setMessage] = useState("");
    const [mediaError] = useState<string | null>(null);
    const [specModalOpen, setSpecModalOpen] = useState(false);
    const [brandOptions, setBrandOptions] = useState<SimpleOption[]>(brands);

    const [afterSaveOpen, setAfterSaveOpen] = useState(false);
    const [afterSaveMode, setAfterSaveMode] =
        useState<AfterSaveMode>("normal");

    const contentRef = useRef<HTMLDivElement | null>(null);
    const pricingRef = useRef<HTMLDivElement | null>(null);

    const focus = searchParams.get("focus");
    const inlineImage = values.media.inlineImage;

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

    const updateBasic = (patch: Partial<WatchFormValues["basic"]>) => {
        setValues((prev) => ({
            ...prev,
            basic: {
                ...prev.basic,
                ...patch,
            },
        }));
    };

    const updateSpec = (patch: Partial<WatchFormValues["spec"]>) => {
        setValues((prev) => ({
            ...prev,
            spec: {
                ...prev.spec,
                ...patch,
            },
        }));
    };

    const replaceSpec = (next: WatchFormValues["spec"]) => {
        setValues((prev) => ({
            ...prev,
            spec: next,
        }));
    };

    const updateContent = (patch: Partial<WatchFormValues["content"]>) => {
        setValues((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                ...patch,
            },
        }));
    };

    const updatePricing = (patch: Partial<WatchFormValues["pricing"]>) => {
        setValues((prev) => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                ...patch,
            },
        }));
    };

    const updateMedia = (patch: Partial<WatchFormValues["media"]>) => {
        setValues((prev) => ({
            ...prev,
            media: {
                ...prev.media,
                ...patch,
            },
        }));
    };

    const handleReviewStatusChange = (
        target: "content" | "image",
        next: ReviewStatusChange
    ) => {
        setValues((prev) => {
            if (target === "content") {
                return {
                    ...prev,
                    contentReviewStatus: next.status,
                    contentReviewNote: next.reviewNote ?? null,
                };
            }

            return {
                ...prev,
                imageReviewStatus: next.status,
                imageReviewNote: next.reviewNote ?? null,
            };
        });
    };

    const submitReviewTarget = async (target: "content" | "image") => {
        const res = await fetch(
            `/api/admin/watches/${values.productId}/${target}-submit`,
            { method: "POST" }
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(json?.error || "Không thể gửi duyệt.");
        }

        setValues((prev): WatchFormValues => {
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
        if (afterSaveMode === "submitContent") {
            await submitReviewTarget("content");
            setMessage("Đã lưu watch và gửi duyệt nội dung.");
        }

        if (afterSaveMode === "submitImage") {
            await submitReviewTarget("image");
            setMessage("Đã lưu watch và gửi duyệt hình ảnh.");
        }

        if (afterSaveMode === "submitBoth") {
            await submitReviewTarget("content");
            await submitReviewTarget("image");
            setMessage("Đã lưu watch và gửi duyệt nội dung + hình ảnh.");
        }

        router.refresh();
    };

    const updateValuesAfterSave = (result: Awaited<ReturnType<typeof submitWatchForm>>) => {
        setValues((prev): WatchFormValues => {
            const serverChosenImages =
                result?.media?.poolImages as
                | WatchFormValues["media"]["poolImages"]
                | undefined;

            const serverGalleryImages =
                result?.media?.galleryImages as
                | WatchFormValues["media"]["galleryImages"]
                | undefined;

            return {
                ...prev,
                contentReviewStatus:
                    (result?.contentReviewStatus as ReviewStatus | undefined) ??
                    prev.contentReviewStatus,
                imageReviewStatus:
                    (result?.imageReviewStatus as ReviewStatus | undefined) ??
                    prev.imageReviewStatus,
                media: {
                    ...prev.media,
                    poolImages:
                        serverChosenImages ?? prev.media.poolImages,
                    galleryImages:
                        serverGalleryImages ?? prev.media.galleryImages,
                    imageCount:
                        serverGalleryImages?.length ?? prev.media.imageCount,
                },
            };
        });
    };

    const onSubmit = () => {
        setMessage("");
        setAfterSaveOpen(false);
        setAfterSaveMode("normal");

        startTransition(async () => {
            try {
                const result = await submitWatchForm(values);

                updateValuesAfterSave(result);
                setMessage(result?.message || "Đã lưu watch.");

                if (result?.askContinueContent) {
                    setAfterSaveMode("continueContent");
                } else if (result?.askSubmitReview) {
                    const targets = result?.reviewSubmitTargets ?? [];

                    if (
                        targets.includes("CONTENT") &&
                        targets.includes("IMAGE")
                    ) {
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
                setMessage(error?.message || "Không thể lưu watch.");
            }
        });
    };
    const saveBeforeSubmitReview = async () => {
        setMessage("");

        try {
            const result = await submitWatchForm(values);

            updateValuesAfterSave(result);

            setMessage(result?.message || "Đã lưu watch trước khi gửi duyệt.");

            return true;
        } catch (error: any) {
            const message =
                error?.message || "Không thể lưu watch trước khi gửi duyệt.";

            setMessage(message);

            notify.error({
                title: "Chưa thể gửi duyệt",
                message,
            });

            return false;
        }
    };
    return (
        <div className="space-y-6">
            <WatchEditHeader
                values={values}
                brands={brandOptions}
                inlineImage={inlineImage}
                pending={pending}
                message={message}
                onSubmit={onSubmit}
                canReviewContent={canReviewContent}
                breadcrumbs={[
                    { label: "Watches", href: "/admin/watches" },
                    { label: values.basic.title || "Edit" },
                ]}
                onChange={(patch) => {
                    setValues((prev) => ({
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
                            onChange={updateContent}
                            onOpenSpecModal={() => setSpecModalOpen(true)}
                            onBeforeSubmitReview={saveBeforeSubmitReview}
                            onReviewStatusChange={(next) =>
                                handleReviewStatusChange("content", next)
                            }
                        />
                    </div>

                    <WatchImageSection
                        watchTitle={values.basic.title}
                        inlineImage={inlineImage}
                        productId={values.productId}
                        poolImages={values.media.poolImages || []}
                        galleryImages={values.media.galleryImages || []}
                        imageReviewStatus={values.imageReviewStatus}
                        imageReviewNote={values.imageReviewNote}
                        canReviewContent={canReviewContent}
                        onBeforeSubmitReview={saveBeforeSubmitReview}
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
                            setValues((prev) => ({
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
                                    Sau khi bổ sung spec cần thiết, bấm để gen
                                    lại title và SKU theo rule hệ thống.
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
                detailHref={`/admin/watches/${values.productId}`}
                fallbackBackHref="/admin/watches"
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