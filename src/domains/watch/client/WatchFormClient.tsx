"use client";

import { useMemo, useState, useTransition } from "react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useNotify } from "@/components/feedback/AppToastProvider";
import { submitWatchForm } from "./form/watch-form.actions";
import { mapWatchDetailToFormValues } from "./form/watch-form.mapper";
import type { WatchFormValues } from "./form/watch-form.types";
import RegenerateTitleSkuButton from "@/domains/watch/ui/edit/RegenerateTitleSkuButton";
import WatchEditHeader from "../ui/edit/WatchEditHeader";
import WatchBasicSection from "../ui/edit/WatchBasicSection";
import WatchSpecModal from "../ui/edit/WatchSpecModal";
import WatchContentSection from "../ui/edit/WatchContentSection";
import WatchPricingSidebar from "../ui/edit/WatchPricingSidebar";
import WatchImageSection from "../ui/edit/WatchImageSection";
import WatchMediaSidebar from "../ui/edit/WatchMediaSidebar";
import AfterSaveDialog from "@/domains/shared/ui/navigation/AfterSaveDialog";

type SimpleOption = { id: string; name: string; slug?: string | null };

type Props = {
    detail: any;
    brands?: SimpleOption[];
    vendors?: SimpleOption[];
    categories?: SimpleOption[];
    canViewCost?: boolean;
    canEditPrice?: boolean;
};

export default function WatchFormClient({
    detail,
    brands = [],
    vendors = [],
    categories = [],
    canViewCost = false,
    canEditPrice = false,
}: Props) {
    const initialValues = useMemo(
        () => mapWatchDetailToFormValues(detail),
        [detail]
    );
    const [afterSaveOpen, setAfterSaveOpen] = useState(false);
    const [values, setValues] = useState<WatchFormValues>(initialValues);
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState("");
    const [mediaError] = useState<string | null>(null);
    const [specModalOpen, setSpecModalOpen] = useState(false);
    const [brandOptions, setBrandOptions] = useState<SimpleOption[]>(brands);
    const updateBasic = (patch: Partial<WatchFormValues["basic"]>) => {
        setValues((prev) => ({
            ...prev,
            basic: { ...prev.basic, ...patch },
        }));
    };

    const updateSpec = (patch: Partial<WatchFormValues["spec"]>) => {
        setValues((prev) => ({ ...prev, spec: { ...prev.spec, ...patch } }));
    };

    const replaceSpec = (next: WatchFormValues["spec"]) => {
        setValues((prev) => ({ ...prev, spec: next }));
    };

    const updateContent = (patch: Partial<WatchFormValues["content"]>) => {
        setValues((prev) => ({
            ...prev,
            content: { ...prev.content, ...patch },
        }));
    };

    const updatePricing = (patch: Partial<WatchFormValues["pricing"]>) => {
        setValues((prev) => ({
            ...prev,
            pricing: { ...prev.pricing, ...patch },
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

    const onSubmit = () => {
        setMessage("");
        setAfterSaveOpen(false);

        startTransition(async () => {
            try {
                const result = await submitWatchForm(values);
                setMessage(result?.message || "Đã lưu watch.");
                setAfterSaveOpen(true);
            } catch (error: any) {
                setMessage(error?.message || "Không thể lưu watch.");
            }
        });
    };

    const searchParams = useSearchParams();
    const notify = useNotify();
    const pricingRef = useRef<HTMLDivElement | null>(null);

    const focus = searchParams.get("focus");

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
    const inlineImage = values.media.inlineImage;
    return (
        <div className="space-y-6">
            <WatchEditHeader
                values={values}
                brands={brandOptions}
                inlineImage={inlineImage}
                pending={pending}
                message={message}
                onSubmit={onSubmit}
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
                        brands={brands}
                        vendors={vendors}
                        categories={categories}
                        onChange={updateBasic}
                        onOpenSpecModal={() => setSpecModalOpen(true)}
                        onBrandsChange={setBrandOptions}

                    />

                    <WatchContentSection
                        values={values.content}
                        watchValues={values}
                        onChange={updateContent}
                        onOpenSpecModal={() => setSpecModalOpen(true)}
                    />
                    <WatchImageSection
                        chosenImages={values.media.chosenImages || []}
                        galleryImages={values.media.galleryImages || []}
                        onChosenImagesChange={(items) => {
                            updateMedia({
                                chosenImages: [...items],
                            });
                        }}
                        onGalleryImagesChange={(items) => {
                            updateMedia({
                                galleryImages: [...items],
                                imageCount: items.length,
                            });
                        }}
                        error={mediaError}
                    />
                </div>

                <div className="space-y-6 xl:col-span-4">
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
                            notificationDiff={focus === "pricing" ? searchParams.get("notificationId") : null}
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
                                    Sau khi bổ sung spec cần thiết, bấm để gen lại title và SKU theo rule hệ thống.
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
                onContinue={() => setAfterSaveOpen(false)}
            />
        </div>
    );
}