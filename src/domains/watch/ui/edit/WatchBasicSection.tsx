"use client";

import { Pencil } from "lucide-react";
import { FieldLabel, Input, SectionCard, Select, Button } from "./shared";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import { buildWatchSpecSummary } from "./WatchSpecModal";
import WatchBrandField from "./WatchBrandField";
type SimpleOption = { id: string; name: string; slug?: string | null };

type Props = {
    values: WatchFormValues["basic"];
    spec: WatchFormValues["spec"];
    vendors: SimpleOption[];
    categories: SimpleOption[];
    onChange: (patch: Partial<WatchFormValues["basic"]>) => void;
    onOpenSpecModal: () => void;
    brands: SimpleOption[];
    onBrandsChange: (brands: SimpleOption[]) => void;
};

const GENDER_OPTIONS = ["MEN", "WOMEN", "UNISEX"].map((x) => ({
    value: x,
    label: x,
}));

const SITE_CHANNEL_OPTIONS = [
    "AFFORDABLE",
    "CORE",
    "PREMIUM",
    "ARCHIVE",
].map((x) => ({
    value: x,
    label: x,
}));

const MOVEMENT_TYPE_OPTIONS = [
    "AUTOMATIC",
    "HAND_WOUND",
    "QUARTZ",
    "SOLAR",
    "KINETIC",
    "MECHAQUARTZ",
    "SPRING_DRIVE",
    "HYBRID",
].map((x) => ({ value: x, label: x }));

export default function WatchBasicSection({
    values,
    spec,
    brands,
    vendors,
    categories,
    onChange,
    onOpenSpecModal,
    onBrandsChange
}: Props) {
    const brandOptions = brands.map((x) => ({ value: x.id, label: x.name }));
    const vendorOptions = vendors.map((x) => ({ value: x.id, label: x.name }));
    const categoryOptions = categories.map((x) => ({
        value: x.id,
        label: x.name,
    }));

    const specSummary = buildWatchSpecSummary(spec);

    return (
        <SectionCard
            icon={<Pencil className="h-5 w-5" />}
            title="Thông tin chính"
            subtitle="Giữ phần thao tác hằng ngày ở đây. Spec sâu đưa sang modal riêng."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <FieldLabel>Title</FieldLabel>
                    <Input
                        value={values.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        placeholder="Tên watch"
                    />
                </div>

                <div>
                    <FieldLabel>Slug</FieldLabel>
                    <Input
                        value={values.slug}
                        onChange={(e) => onChange({ slug: e.target.value })}
                        placeholder="slug"
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
                    <FieldLabel>Vendor</FieldLabel>
                    <Select
                        value={values.vendorId}
                        onChange={(e) => onChange({ vendorId: e.target.value })}
                        options={vendorOptions}
                        placeholder="Chọn vendor"
                    />
                </div>

                <div>
                    <FieldLabel>Category</FieldLabel>
                    <Select
                        value={values.categoryId}
                        onChange={(e) => onChange({ categoryId: e.target.value })}
                        options={categoryOptions}
                        placeholder="Chọn category"
                    />
                </div>

                <div>
                    <FieldLabel>Gender</FieldLabel>
                    <Select
                        value={values.gender}
                        onChange={(e) => onChange({ gender: e.target.value })}
                        options={GENDER_OPTIONS}
                    />
                </div>

                <div>
                    <FieldLabel>Site channel</FieldLabel>
                    <Select
                        value={values.siteChannel}
                        onChange={(e) => onChange({ siteChannel: e.target.value })}
                        options={SITE_CHANNEL_OPTIONS}
                    />
                </div>

                <div>
                    <FieldLabel>Stock state</FieldLabel>
                    <Input
                        value={values.stockState}
                        onChange={(e) => onChange({ stockState: e.target.value })}
                        placeholder="IN_STOCK / RESERVED / ..."
                    />
                </div>

                <div>
                    <FieldLabel>Sale state</FieldLabel>
                    <Input
                        value={values.saleState}
                        onChange={(e) => onChange({ saleState: e.target.value })}
                        placeholder="DRAFT / LIVE / ..."
                    />
                </div>

                <div>
                    <FieldLabel>Condition grade</FieldLabel>
                    <Input
                        value={values.conditionGrade}
                        onChange={(e) => onChange({ conditionGrade: e.target.value })}
                        placeholder="A / B / NOS / ..."
                    />
                </div>

                <div>
                    <FieldLabel>Movement type</FieldLabel>
                    <Select
                        value={values.movementType}
                        onChange={(e) => onChange({ movementType: e.target.value })}
                        options={MOVEMENT_TYPE_OPTIONS}
                        placeholder="Chọn movement"
                    />
                </div>

                <div>
                    <FieldLabel>Movement calibre</FieldLabel>
                    <Input
                        value={values.movementCalibre}
                        onChange={(e) => onChange({ movementCalibre: e.target.value })}
                        placeholder="L993.1 / 7S26 / ..."
                    />
                </div>

                <div>
                    <FieldLabel>Serial number</FieldLabel>
                    <Input
                        value={values.serialNumber}
                        onChange={(e) => onChange({ serialNumber: e.target.value })}
                        placeholder="Serial"
                    />
                </div>

                <div>
                    <FieldLabel>Year text</FieldLabel>
                    <Input
                        value={values.yearText}
                        onChange={(e) => onChange({ yearText: e.target.value })}
                        placeholder="1970s / 1990s / ..."
                    />
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
                                    Model, reference, case, material... được gom vào modal riêng để form chính gọn hơn.
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={onOpenSpecModal}
                                className="shrink-0 border-indigo-200 bg-white/80 text-indigo-700 hover:bg-white"
                            >
                                Chỉnh spec & vật liệu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}