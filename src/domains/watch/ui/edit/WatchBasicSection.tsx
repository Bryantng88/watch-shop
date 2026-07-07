"use client";

import { Pencil } from "lucide-react";
import { buildWatchTitleFromForm } from "../../shared/watch-title-sku.helpers";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import { Button, FieldLabel, Input, SectionCard, Select } from "./shared";
import { buildWatchSpecSummary } from "./WatchSpecModal";
import WatchBrandField from "./WatchBrandField";

type SimpleOption = {
    id: string;
    name: string;
    slug?: string | null;
    platform?: string | null;
};

type Props = {
    values: WatchFormValues["basic"];
    spec: WatchFormValues["spec"];
    vendors: SimpleOption[];
    categories: SimpleOption[];
    postTargets: SimpleOption[];
    onChange: (patch: Partial<WatchFormValues["basic"]>) => void;
    onSpecChange: (patch: Partial<WatchFormValues["spec"]>) => void;
    onOpenSpecModal: () => void;
    brands: SimpleOption[];
    onBrandsChange: (brands: SimpleOption[]) => void;
    defaultOpen?: boolean;
};

const MOVEMENT_TYPE_OPTIONS = [
    "AUTOMATIC",
    "HAND_WOUND",
    "QUARTZ",
    "SOLAR",
    "KINETIC",
    "MECHAQUARTZ",
    "SPRING_DRIVE",
    "HYBRID",
].map((value) => ({ value, label: value }));

const MATERIAL_OPTIONS = [
    "STAINLESS_STEEL",
    "TITANIUM",
    "CERAMIC",
    "CARBON",
    "GOLD",
    "PLATINUM",
    "SILVER",
    "BRASS",
    "OTHER",
].map((value) => ({ value, label: value }));

function normalizeTargetName(value: unknown) {
    return String(value ?? "").trim();
}

function getPostTargetGroupKey(target: SimpleOption) {
    return normalizeTargetName(target.name).toLowerCase();
}

function buildPostTargetGroups(options: SimpleOption[]) {
    const byName = new Map<string, { key: string; name: string; ids: string[] }>();

    for (const option of options) {
        const name = normalizeTargetName(option.name);
        const id = String(option.id ?? "").trim();

        if (!name || !id) continue;

        const key = getPostTargetGroupKey(option);
        const current = byName.get(key);

        if (current) {
            if (!current.ids.includes(id)) current.ids.push(id);
        } else {
            byName.set(key, { key, name, ids: [id] });
        }
    }

    return Array.from(byName.values());
}

function PostTargetMultiSelect({
    value,
    options,
    onChange,
}: {
    value: string[];
    options: SimpleOption[];
    onChange: (next: string[]) => void;
}) {
    const selected = Array.isArray(value)
        ? value.map((id) => String(id ?? "").trim()).filter(Boolean)
        : [];

    const groups = buildPostTargetGroups(options);
    const selectedSet = new Set(selected);
    const groupById = new Map<string, (typeof groups)[number]>();

    for (const group of groups) {
        for (const id of group.ids) groupById.set(id, group);
    }

    const selectedGroups = selected.reduce<(typeof groups)[number][]>((acc, id) => {
        const group = groupById.get(id);
        if (!group || acc.some((item) => item.key === group.key)) return acc;
        acc.push(group);
        return acc;
    }, []);

    const toggleGroup = (groupKey: string) => {
        const group = groups.find((item) => item.key === groupKey);
        if (!group) return;

        const hasGroup = group.ids.some((id) => selectedSet.has(id));
        const groupIds = new Set(group.ids);

        if (hasGroup) {
            onChange(selected.filter((id) => !groupIds.has(id)));
            return;
        }

        onChange(Array.from(new Set([...selected, ...group.ids])));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {selectedGroups.length ? (
                    selectedGroups.map((group) => (
                        <button
                            key={group.key}
                            type="button"
                            onClick={() => toggleGroup(group.key)}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white"
                            title="Bo chon"
                        >
                            {group.name}
                            <span className="text-slate-300">x</span>
                        </button>
                    ))
                ) : (
                    <div className="text-sm text-slate-400">Chua chon page/kenh dang</div>
                )}
            </div>

            <select
                value=""
                onChange={(event) => {
                    toggleGroup(event.target.value);
                    event.currentTarget.value = "";
                }}
                className="block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-0"
            >
                <option value="">Them page/kenh dang</option>
                {groups.map((group) => {
                    const selectedGroup = group.ids.some((id) => selectedSet.has(id));

                    return (
                        <option key={group.key} value={group.key}>
                            {selectedGroup ? "- " : ""}
                            {group.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

function buildTitlePreviewValues(
    values: WatchFormValues["basic"],
    spec: WatchFormValues["spec"],
): WatchFormValues {
    return {
        watchId: "",
        productId: "",
        header: { sku: "", status: "", serviceState: "" },
        basic: values,
        spec,
        content: {
            titleOverride: "",
            hookText: "",
            body: "",
            bulletSpecs: [],
            hashTags: "",
        },
        pricing: {
            salePrice: "",
            listPrice: "",
            minPrice: "",
            costPrice: "",
            serviceCost: "",
            landedCost: "",
            pricingNote: "",
        },
        media: {
            inlineImage: null,
            poolImages: [],
            galleryImages: [],
            imageCount: 0,
            hasBox: false,
            hasPapers: false,
            bookletIncluded: false,
            cardIncluded: false,
        },
    };
}

export default function WatchBasicSection({
    values,
    spec,
    brands,
    vendors,
    categories,
    postTargets,
    onChange,
    onSpecChange,
    onOpenSpecModal,
    onBrandsChange,
    defaultOpen = false,
}: Props) {
    void categories;

    const vendorOptions = vendors.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const specSummary = buildWatchSpecSummary(spec);
    const generatedTitle = buildWatchTitleFromForm(
        buildTitlePreviewValues(values, spec),
        brands,
    );

    return (
        <SectionCard
            defaultOpen={defaultOpen}
            icon={<Pencil className="h-5 w-5" />}
            title="Thong tin chinh"
            subtitle="Giu cac field van hanh va spec tao title/content trong cung mot block."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <FieldLabel>Title</FieldLabel>
                    <Input
                        value={values.title}
                        onChange={(event) => onChange({ title: event.target.value })}
                        placeholder="Ten watch"
                    />
                </div>

                <div>
                    <WatchBrandField
                        value={values.brandId}
                        brands={brands}
                        onBrandsChange={onBrandsChange}
                        onChange={(brandId) => onChange({ brandId })}
                    />
                </div>

                <div>
                    <FieldLabel>Year text</FieldLabel>
                    <Input
                        value={values.yearText}
                        onChange={(event) => onChange({ yearText: event.target.value })}
                        placeholder="1970s / 1990s / ..."
                    />
                </div>

                <div>
                    <FieldLabel>Model</FieldLabel>
                    <Input
                        value={spec.model}
                        onChange={(event) => onSpecChange({ model: event.target.value })}
                        placeholder="Seamaster / Datejust / Tank..."
                    />
                </div>

                <div>
                    <FieldLabel>Reference</FieldLabel>
                    <Input
                        value={spec.referenceNumber}
                        onChange={(event) =>
                            onSpecChange({ referenceNumber: event.target.value })
                        }
                        placeholder="Reference"
                    />
                </div>

                <div>
                    <FieldLabel>Nick name</FieldLabel>
                    <Input
                        value={spec.nickname}
                        onChange={(event) => onSpecChange({ nickname: event.target.value })}
                        placeholder="Jumbo / Ghost / Linen dial..."
                    />
                </div>

                <div>
                    <FieldLabel>Movement type</FieldLabel>
                    <Select
                        value={values.movementType}
                        onChange={(event) => onChange({ movementType: event.target.value })}
                        options={MOVEMENT_TYPE_OPTIONS}
                        placeholder="Chon movement"
                    />
                </div>

                <div>
                    <FieldLabel>Movement calibre</FieldLabel>
                    <Input
                        value={values.movementCalibre}
                        onChange={(event) =>
                            onChange({ movementCalibre: event.target.value })
                        }
                        placeholder="L993.1 / 7S26 / ..."
                    />
                </div>

                <div>
                    <FieldLabel>Case size (mm)</FieldLabel>
                    <Input
                        value={spec.caseSizeMM}
                        onChange={(event) => onSpecChange({ caseSizeMM: event.target.value })}
                        placeholder="35"
                    />
                </div>

                <div>
                    <FieldLabel>Lug to lug (mm)</FieldLabel>
                    <Input
                        value={spec.lugToLugMM}
                        onChange={(event) => onSpecChange({ lugToLugMM: event.target.value })}
                        placeholder="44"
                    />
                </div>

                <div>
                    <FieldLabel>Dial color</FieldLabel>
                    <Input
                        value={spec.dialColor}
                        onChange={(event) => onSpecChange({ dialColor: event.target.value })}
                        placeholder="Silver / Black / Champagne"
                    />
                </div>

                <div>
                    <FieldLabel>Primary material</FieldLabel>
                    <Select
                        value={spec.primaryCaseMaterial}
                        onChange={(event) =>
                            onSpecChange({ primaryCaseMaterial: event.target.value })
                        }
                        options={MATERIAL_OPTIONS}
                        placeholder="Chon material"
                    />
                </div>

                <div>
                    <FieldLabel>Page dang de xuat</FieldLabel>
                    <PostTargetMultiSelect
                        value={values.postTargetIds}
                        options={postTargets}
                        onChange={(postTargetIds) => onChange({ postTargetIds })}
                    />
                </div>

                <div>
                    <FieldLabel>Vendor</FieldLabel>
                    <Select
                        value={values.vendorId}
                        onChange={(event) => onChange({ vendorId: event.target.value })}
                        options={vendorOptions}
                        placeholder="Chon vendor"
                    />
                </div>

                <div className="md:col-span-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                    Title preview
                                </div>
                                <div className="mt-1 text-sm font-medium text-slate-900">
                                    {generatedTitle}
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Rule: year text + brand + model + reference + nick name + movement.
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onChange({ title: generatedTitle })}
                                className="shrink-0"
                            >
                                Apply title
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="rounded-2xl bg-indigo-50/60 p-4 ring-1 ring-inset ring-indigo-100">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                    Spec snapshot
                                </div>
                                <div className="mt-1 text-sm font-medium text-slate-900">
                                    {specSummary}
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Field sau va it dung van nam trong modal spec.
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={onOpenSpecModal}
                                className="shrink-0 border-indigo-200 bg-white/80 text-indigo-700 hover:bg-white"
                            >
                                More specs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
