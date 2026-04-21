"use client";

import { Pencil } from "lucide-react";
import { FieldLabel, Input, SectionCard, Select } from "./shared";
import { WatchFormValues } from "../../client/form/watch-form.types";

type SimpleOption = { id: string; name: string; slug?: string | null };

type Props = {
    values: WatchFormValues["basic"];
    brands: SimpleOption[];
    vendors: SimpleOption[];
    categories: SimpleOption[];
    onChange: (patch: Partial<WatchFormValues["basic"]>) => void;
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
    "MANUAL_WIND",
    "AUTOMATIC",
    "QUARTZ",
    "ECO_DRIVE",
    "SOLAR",
].map((x) => ({ value: x, label: x }));

export default function WatchBasicSection({
    values,
    brands,
    vendors,
    categories,
    onChange,
}: Props) {
    const brandOptions = brands.map((x) => ({ value: x.id, label: x.name }));
    const vendorOptions = vendors.map((x) => ({ value: x.id, label: x.name }));
    const categoryOptions = categories.map((x) => ({
        value: x.id,
        label: x.name,
    }));

    return (
        <SectionCard
            icon={<Pencil className="h-5 w-5" />}
            title="Thông tin chính"
            subtitle="Giữ phần thật sự cần thao tác hằng ngày."
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
                    <FieldLabel>Brand</FieldLabel>
                    <Select
                        value={values.brandId}
                        onChange={(e) => onChange({ brandId: e.target.value })}
                        options={brandOptions}
                        placeholder="Chọn brand"
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
                        placeholder="mid-20th century / 1970s / ..."
                    />
                </div>
            </div>
        </SectionCard>
    );
}