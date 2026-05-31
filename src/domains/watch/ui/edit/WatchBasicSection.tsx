"use client";

import { Pencil } from "lucide-react";
import { FieldLabel, Input, SectionCard, Select, Button } from "./shared";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import { buildWatchSpecSummary } from "./WatchSpecModal";
import WatchBrandField from "./WatchBrandField";
type SimpleOption = { id: string; name: string; slug?: string | null; platform?: string | null };

type Props = {
    values: WatchFormValues["basic"];
    spec: WatchFormValues["spec"];
    vendors: SimpleOption[];
    categories: SimpleOption[];
    postTargets: SimpleOption[];
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
const WATCH_STYLE_OPTIONS = [
    "MILITARY",
    "DRESS",
    "SPORT",
    "TOOL",
    "CASUAL",
    "CLASSIC",
    "MINIMALIST",
    "LUXURY",
    "RETRO",
    "FUTURISTIC",
].map((x) => ({ value: x, label: x }));
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
function normalizeTargetName(value: unknown) {
    return String(value ?? "").trim();
}

function getPostTargetGroupKey(target: SimpleOption) {
    return normalizeTargetName(target.name).toLowerCase();
}

function buildPostTargetGroups(options: SimpleOption[]) {
    const byName = new Map<
        string,
        {
            key: string;
            name: string;
            ids: string[];
        }
    >();

    for (const option of options) {
        const name = normalizeTargetName(option.name);
        const id = String(option.id ?? "").trim();

        if (!name || !id) continue;

        const key = getPostTargetGroupKey(option);
        const current = byName.get(key);

        if (current) {
            if (!current.ids.includes(id)) current.ids.push(id);
        } else {
            byName.set(key, {
                key,
                name,
                ids: [id],
            });
        }
    }

    return Array.from(byName.values()).sort((a, b) =>
        a.name.localeCompare(b.name, "vi"),
    );
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

    const selectedGroups = groups.filter((group) =>
        group.ids.some((id) => selectedSet.has(id)),
    );

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
                            title="Bấm để bỏ chọn"
                        >
                            {group.name}
                            <span className="text-slate-300">×</span>
                        </button>
                    ))
                ) : (
                    <div className="text-sm text-slate-400">Chưa chọn page/kênh đăng</div>
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
                <option value="">Thêm page/kênh đăng</option>
                {groups.map((group) => {
                    const selectedGroup = group.ids.some((id) => selectedSet.has(id));

                    return (
                        <option key={group.key} value={group.key}>
                            {selectedGroup ? "✓ " : ""}
                            {group.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}


export default function WatchBasicSection({
    values,
    spec,
    brands,
    vendors,
    categories,
    postTargets,
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
                    <FieldLabel>Page đăng đề xuất</FieldLabel>
                    <PostTargetMultiSelect
                        value={values.postTargetIds}
                        options={postTargets}
                        onChange={(postTargetIds) => onChange({ postTargetIds })}
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
                    <FieldLabel>Style</FieldLabel>
                    <Select
                        value={values.style}
                        onChange={(e) => onChange({ style: e.target.value })}
                        options={WATCH_STYLE_OPTIONS}
                        placeholder="Chọn phong cách"
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