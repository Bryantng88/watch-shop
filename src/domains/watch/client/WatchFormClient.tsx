"use client";

import { useMemo, useState, useTransition } from "react";

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

type SimpleOption = { id: string; name: string; slug?: string | null };

type Props = {
    detail: any;
    brands?: SimpleOption[];
    vendors?: SimpleOption[];
    categories?: SimpleOption[];
    canViewCost?: boolean;
};

export default function WatchFormClient({
    detail,
    brands = [],
    vendors = [],
    categories = [],
    canViewCost = false,
}: Props) {
    const initialValues = useMemo(
        () => mapWatchDetailToFormValues(detail),
        [detail]
    );

    const [values, setValues] = useState<WatchFormValues>(initialValues);
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState("");
    const [mediaError] = useState<string | null>(null);
    const [specModalOpen, setSpecModalOpen] = useState(false);

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

        startTransition(async () => {
            try {
                const result = await submitWatchForm(values);
                setMessage(result?.message || "Đã lưu watch.");
            } catch (error: any) {
                setMessage(error?.message || "Không thể lưu watch.");
            }
        });
    };

    return (
        <div className="space-y-6">
            <WatchEditHeader
                values={values}
                brands={brands}
                pending={pending}
                message={message}
                onSubmit={onSubmit}
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
                    />

                    <WatchContentSection
                        values={values.content}
                        onChange={updateContent}
                    />

                    <WatchImageSection
                        chosenImages={values.media.chosenImages || []}
                        selectedImages={values.media.selectedImages || []}
                        onChosenImagesChange={(items) => {
                            updateMedia({
                                chosenImages: [...items],
                            });
                        }}
                        onSelectedImagesChange={(items) => {
                            updateMedia({
                                selectedImages: [...items],
                                imageCount: items.length,
                            });
                        }}
                        error={mediaError}
                    />
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <WatchPricingSidebar
                        values={values.pricing}
                        canViewCost={canViewCost}
                        onChange={updatePricing}
                    />

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
        </div>
    );
}