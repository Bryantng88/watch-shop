"use client";

import { useMemo, useState, useTransition } from "react";

import { submitWatchForm } from "./watch-form.actions";
import { mapWatchDetailToFormValues } from "./watch-form.mapper";
import type { WatchFormValues } from "./watch-form.types";

import WatchEditHeader from "../ui/edit/WatchEditHeader";
import WatchSpecSection from "../ui/edit/WatchSpecSection";
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

    const updateSpec = (patch: Partial<WatchFormValues["spec"]>) => {
        setValues((prev) => ({ ...prev, spec: { ...prev.spec, ...patch } }));
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
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
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

                    <WatchSpecSection
                        values={values.spec}
                        onChange={updateSpec}
                    />
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <WatchPricingSidebar
                        values={values.pricing}
                        canViewCost={canViewCost}
                        onChange={updatePricing}
                    />

                    <WatchMediaSidebar values={values.media} />
                </div>
            </div>
        </div>
    );
}