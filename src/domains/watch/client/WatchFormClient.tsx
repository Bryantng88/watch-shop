"use client";

import { useMemo, useState, useTransition } from "react";
import { mapWatchDetailToFormValues } from "./watch-form.mapper";
import { submitWatchForm } from "./watch-form.actions";
import type { WatchDetailModel } from "../server/shared/watch.types";
import type { WatchFormValues } from "./watch-form.types";

type Props = {
    detail: WatchDetailModel;
};

export default function WatchFormClient({ detail }: Props) {
    const initialValues = useMemo(
        () => mapWatchDetailToFormValues(detail),
        [detail]
    );

    const [values, setValues] = useState<WatchFormValues>(initialValues);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    function setCore<K extends keyof WatchFormValues["core"]>(
        key: K,
        value: WatchFormValues["core"][K]
    ) {
        setValues((prev) => ({
            ...prev,
            core: {
                ...prev.core,
                [key]: value,
            },
        }));
    }

    function setSpec<K extends keyof WatchFormValues["spec"]>(
        key: K,
        value: WatchFormValues["spec"][K]
    ) {
        setValues((prev) => ({
            ...prev,
            spec: {
                ...prev.spec,
                [key]: value,
            },
        }));
    }

    function setPricing<K extends keyof WatchFormValues["pricing"]>(
        key: K,
        value: WatchFormValues["pricing"][K]
    ) {
        setValues((prev) => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [key]: value,
            },
        }));
    }

    function setContent<K extends keyof WatchFormValues["content"]>(
        key: K,
        value: WatchFormValues["content"][K]
    ) {
        setValues((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                [key]: value,
            },
        }));
    }

    function onSubmit() {
        setMessage("");

        startTransition(async () => {
            try {
                await submitWatchForm(values);
                setMessage("Đã lưu watch");
            } catch (error: any) {
                setMessage(error?.message ?? "Lưu thất bại");
            }
        });
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border p-4 space-y-4">
                <h2 className="text-lg font-semibold">Core</h2>

                <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={values.core.title}
                    onChange={(e) => setCore("title", e.target.value)}
                    placeholder="Title"
                />

                <div className="grid grid-cols-2 gap-3">
                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.core.gender}
                        onChange={(e) => setCore("gender", e.target.value as any)}
                    >
                        <option value="MEN">Male</option>
                        <option value="WOMEN">Female</option>
                        <option value="UNISEX">Unisex</option>
                    </select>

                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.core.siteChannel}
                        onChange={(e) => setCore("siteChannel", e.target.value as any)}
                    >
                        <option value="AFFORDABLE">Affordable</option>
                        <option value="LUXURY">Luxury</option>
                    </select>
                </div>
            </section>

            <section className="rounded-2xl border p-4 space-y-4">
                <h2 className="text-lg font-semibold">Spec</h2>

                <div className="grid grid-cols-2 gap-3">
                    <input
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.model}
                        onChange={(e) => setSpec("model", e.target.value)}
                        placeholder="Model"
                    />
                    <input
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.referenceNumber}
                        onChange={(e) => setSpec("referenceNumber", e.target.value)}
                        placeholder="Reference"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.materialProfile}
                        onChange={(e) => setSpec("materialProfile", e.target.value as any)}
                    >
                        <option value="SINGLE_MATERIAL">Single material</option>
                        <option value="BIMETAL">Bimetal</option>
                        <option value="COATED">Coated</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.primaryCaseMaterial}
                        onChange={(e) =>
                            setSpec("primaryCaseMaterial", e.target.value as any)
                        }
                    >
                        <option value="STAINLESS_STEEL">Stainless steel</option>
                        <option value="TITANIUM">Titanium</option>
                        <option value="CERAMIC">Ceramic</option>
                        <option value="CARBON">Carbon</option>
                        <option value="GOLD">Gold</option>
                        <option value="PLATINUM">Platinum</option>
                        <option value="SILVER">Silver</option>
                        <option value="BRASS">Brass</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.secondaryCaseMaterial}
                        onChange={(e) =>
                            setSpec("secondaryCaseMaterial", e.target.value as any)
                        }
                    >
                        <option value="">No secondary</option>
                        <option value="STAINLESS_STEEL">Stainless steel</option>
                        <option value="TITANIUM">Titanium</option>
                        <option value="CERAMIC">Ceramic</option>
                        <option value="CARBON">Carbon</option>
                        <option value="GOLD">Gold</option>
                        <option value="PLATINUM">Platinum</option>
                        <option value="SILVER">Silver</option>
                        <option value="BRASS">Brass</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.goldTreatment}
                        onChange={(e) => setSpec("goldTreatment", e.target.value as any)}
                    >
                        <option value="">No gold treatment</option>
                        <option value="SOLID_GOLD">Solid gold</option>
                        <option value="CAPPED_GOLD">Capped gold</option>
                        <option value="GOLD_PLATED">Gold plated</option>
                        <option value="GOLD_VERMEIL">Gold vermeil</option>
                        <option value="GOLD_FILLED">Gold filled</option>
                    </select>

                    <select
                        className="rounded-lg border px-3 py-2"
                        value={values.spec.goldKarat}
                        onChange={(e) => setSpec("goldKarat", e.target.value as any)}
                    >
                        <option value="">No karat</option>
                        <option value="10">10K</option>
                        <option value="14">14K</option>
                        <option value="18">18K</option>
                    </select>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {(["YELLOW", "WHITE", "ROSE", "MIXED"] as const).map((color) => {
                        const checked = values.spec.goldColors.includes(color);
                        return (
                            <label
                                key={color}
                                className="flex items-center gap-2 rounded-lg border px-3 py-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                        setSpec(
                                            "goldColors",
                                            e.target.checked
                                                ? [...values.spec.goldColors, color]
                                                : values.spec.goldColors.filter((x) => x !== color)
                                        );
                                    }}
                                />
                                <span>{color}</span>
                            </label>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border p-4 space-y-4">
                <h2 className="text-lg font-semibold">Pricing</h2>
                <div className="grid grid-cols-3 gap-3">
                    <input
                        className="rounded-lg border px-3 py-2"
                        value={values.pricing.costPrice}
                        onChange={(e) => setPricing("costPrice", e.target.value)}
                        placeholder="Cost"
                    />
                    <input
                        className="rounded-lg border px-3 py-2"
                        value={values.pricing.listPrice}
                        onChange={(e) => setPricing("listPrice", e.target.value)}
                        placeholder="List price"
                    />
                    <input
                        className="rounded-lg border px-3 py-2"
                        value={values.pricing.salePrice}
                        onChange={(e) => setPricing("salePrice", e.target.value)}
                        placeholder="Sale price"
                    />
                </div>
            </section>

            <section className="rounded-2xl border p-4 space-y-4">
                <h2 className="text-lg font-semibold">Content</h2>
                <textarea
                    className="min-h-28 w-full rounded-lg border px-3 py-2"
                    value={values.content.summary}
                    onChange={(e) => setContent("summary", e.target.value)}
                    placeholder="Summary"
                />
                <textarea
                    className="min-h-40 w-full rounded-lg border px-3 py-2"
                    value={values.content.body}
                    onChange={(e) => setContent("body", e.target.value)}
                    placeholder="Body"
                />
            </section>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isPending}
                    className="rounded-xl border px-4 py-2"
                >
                    {isPending ? "Đang lưu..." : "Lưu watch"}
                </button>
                {message ? <span>{message}</span> : null}
            </div>
        </div>
    );
}