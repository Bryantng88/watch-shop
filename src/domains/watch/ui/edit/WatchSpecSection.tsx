"use client";

import { Gem } from "lucide-react";
import { FieldLabel, Input, SectionCard, Select, Toggle } from "./shared"
import type { WatchFormValues } from "../../client/form/watch-form.types";

type Props = {
    values: WatchFormValues["spec"];
    onChange: (patch: Partial<WatchFormValues["spec"]>) => void;
};

const CASE_SHAPE_OPTIONS = [
    "ROUND",
    "TANK",
    "RECTANGULAR",
    "SQUARE",
    "TONNEAU",
    "CUSHION",
    "OVAL",
].map((x) => ({ value: x, label: x }));

const CRYSTAL_OPTIONS = ["ACRYLIC", "MINERAL", "SAPPHIRE"].map((x) => ({
    value: x,
    label: x,
}));

const MATERIAL_PROFILE_OPTIONS = [
    { value: "SINGLE_MATERIAL", label: "Single material" },
    { value: "TWO_TONE", label: "Two tone" },
    { value: "GOLD", label: "Gold" },
];

const MATERIAL_OPTIONS = [
    "STAINLESS_STEEL",
    "GOLD_FILLED",
    "SOLID_GOLD",
    "PLAQUE",
    "TITANIUM",
    "SILVER",
    "CERAMIC",
].map((x) => ({ value: x, label: x }));

const GOLD_TREATMENT_OPTIONS = [
    "SOLID",
    "CAPPED",
    "FILLED",
    "PLATED",
].map((x) => ({ value: x, label: x }));

const GOLD_COLOR_OPTIONS = ["YELLOW", "WHITE", "ROSE", "MIXED"];

const GOLD_KARAT_OPTIONS = ["8", "9", "10", "14", "18"].map((x) => ({
    value: x,
    label: `${x}K`,
}));

const BRACELET_OPTIONS = [
    "LEATHER",
    "STEEL",
    "RUBBER",
    "NYLON",
    "TWO_PIECE",
].map((x) => ({ value: x, label: x }));

export default function WatchSpecSection({ values, onChange }: Props) {
    const materialProfile = values.materialProfile || "SINGLE_MATERIAL";

    return (
        <SectionCard
            icon={<Gem className="h-5 w-5" />}
            title="Spec & vật liệu"
            subtitle="Group lại gọn và hiển thị thông minh theo material profile."
        >
            <div className="space-y-6">
                <div>
                    <div className="mb-3 text-sm font-semibold text-slate-900">Identity</div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <FieldLabel>Spec brand</FieldLabel>
                            <Input
                                value={values.specBrand}
                                onChange={(e) => onChange({ specBrand: e.target.value })}
                                placeholder="Spec brand"
                            />
                        </div>
                        <div>
                            <FieldLabel>Model</FieldLabel>
                            <Input
                                value={values.model}
                                onChange={(e) => onChange({ model: e.target.value })}
                                placeholder="Model"
                            />
                        </div>
                        <div>
                            <FieldLabel>Reference</FieldLabel>
                            <Input
                                value={values.referenceNumber}
                                onChange={(e) => onChange({ referenceNumber: e.target.value })}
                                placeholder="Reference"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-3 text-sm font-semibold text-slate-900">
                        Case & movement
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel>Case shape</FieldLabel>
                            <Select
                                value={values.caseShape}
                                onChange={(e) => onChange({ caseShape: e.target.value })}
                                options={CASE_SHAPE_OPTIONS}
                                placeholder="Chọn case shape"
                            />
                        </div>

                        <div>
                            <FieldLabel>Dial color</FieldLabel>
                            <Input
                                value={values.dialColor}
                                onChange={(e) => onChange({ dialColor: e.target.value })}
                                placeholder="Dial color"
                            />
                        </div>

                        <div>
                            <FieldLabel>Case size (mm)</FieldLabel>
                            <Input
                                value={values.caseSizeMM}
                                onChange={(e) => onChange({ caseSizeMM: e.target.value })}
                                placeholder="36"
                            />
                        </div>

                        <div>
                            <FieldLabel>Lug to lug (mm)</FieldLabel>
                            <Input
                                value={values.lugToLugMM}
                                onChange={(e) => onChange({ lugToLugMM: e.target.value })}
                                placeholder="44"
                            />
                        </div>

                        <div>
                            <FieldLabel>Thickness (mm)</FieldLabel>
                            <Input
                                value={values.thicknessMM}
                                onChange={(e) => onChange({ thicknessMM: e.target.value })}
                                placeholder="11"
                            />
                        </div>

                        <div>
                            <FieldLabel>Crystal</FieldLabel>
                            <Select
                                value={values.crystal}
                                onChange={(e) => onChange({ crystal: e.target.value })}
                                options={CRYSTAL_OPTIONS}
                                placeholder="Chọn crystal"
                            />
                        </div>

                        <div>
                            <FieldLabel>Calibre</FieldLabel>
                            <Input
                                value={values.calibre}
                                onChange={(e) => onChange({ calibre: e.target.value })}
                                placeholder="7S26 / L993.1 / ..."
                            />
                        </div>

                        <div>
                            <FieldLabel>Nickname</FieldLabel>
                            <Input
                                value={values.nickname}
                                onChange={(e) => onChange({ nickname: e.target.value })}
                                placeholder="Nickname"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-3 text-sm font-semibold text-slate-900">Material</div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel>Material profile</FieldLabel>
                            <Select
                                value={values.materialProfile}
                                onChange={(e) =>
                                    onChange({
                                        materialProfile: e.target.value,
                                        ...(e.target.value === "SINGLE_MATERIAL"
                                            ? {
                                                secondaryCaseMaterial: "",
                                                goldTreatment: "",
                                                goldColors: [],
                                                goldKarat: "",
                                            }
                                            : {}),
                                        ...(e.target.value === "TWO_TONE"
                                            ? {
                                                goldTreatment: "",
                                                goldColors: [],
                                                goldKarat: "",
                                            }
                                            : {}),
                                    })
                                }
                                options={MATERIAL_PROFILE_OPTIONS}
                            />
                        </div>

                        <div>
                            <FieldLabel>Primary material</FieldLabel>
                            <Select
                                value={values.primaryCaseMaterial}
                                onChange={(e) => onChange({ primaryCaseMaterial: e.target.value })}
                                options={MATERIAL_OPTIONS}
                                placeholder="Chọn chất liệu"
                            />
                        </div>

                        {materialProfile === "TWO_TONE" ? (
                            <div>
                                <FieldLabel>Secondary material</FieldLabel>
                                <Select
                                    value={values.secondaryCaseMaterial}
                                    onChange={(e) =>
                                        onChange({ secondaryCaseMaterial: e.target.value })
                                    }
                                    options={MATERIAL_OPTIONS}
                                    placeholder="Chọn chất liệu phụ"
                                />
                            </div>
                        ) : null}

                        {materialProfile === "GOLD" ? (
                            <>
                                <div>
                                    <FieldLabel>Gold treatment</FieldLabel>
                                    <Select
                                        value={values.goldTreatment}
                                        onChange={(e) => onChange({ goldTreatment: e.target.value })}
                                        options={GOLD_TREATMENT_OPTIONS}
                                        placeholder="Chọn gold treatment"
                                    />
                                </div>

                                <div>
                                    <FieldLabel>Gold karat</FieldLabel>
                                    <Select
                                        value={values.goldKarat}
                                        onChange={(e) => onChange({ goldKarat: e.target.value })}
                                        options={GOLD_KARAT_OPTIONS}
                                        placeholder="Chọn gold karat"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel>Gold colors</FieldLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {GOLD_COLOR_OPTIONS.map((color) => {
                                            const checked = values.goldColors.includes(color);
                                            return (
                                                <Toggle
                                                    key={color}
                                                    checked={checked}
                                                    label={color}
                                                    onChange={(next) => {
                                                        const current = values.goldColors || [];
                                                        onChange({
                                                            goldColors: next
                                                                ? [...current, color]
                                                                : current.filter((x) => x !== color),
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <div>
                            <FieldLabel>Bracelet type</FieldLabel>
                            <Select
                                value={values.braceletType}
                                onChange={(e) => onChange({ braceletType: e.target.value })}
                                options={BRACELET_OPTIONS}
                                placeholder="Chọn bracelet type"
                            />
                        </div>

                        <div>
                            <FieldLabel>Strap material text</FieldLabel>
                            <Input
                                value={values.strapMaterialText}
                                onChange={(e) => onChange({ strapMaterialText: e.target.value })}
                                placeholder="Leather / steel / ..."
                            />
                        </div>

                        <div>
                            <FieldLabel>Water resistance</FieldLabel>
                            <Input
                                value={values.waterResistance}
                                onChange={(e) => onChange({ waterResistance: e.target.value })}
                                placeholder="30m / 50m"
                            />
                        </div>

                        <div>
                            <FieldLabel>Power reserve</FieldLabel>
                            <Input
                                value={values.powerReserve}
                                onChange={(e) => onChange({ powerReserve: e.target.value })}
                                placeholder="40h"
                            />
                        </div>

                        <div>
                            <FieldLabel>Dial finish</FieldLabel>
                            <Input
                                value={values.dialFinish}
                                onChange={(e) => onChange({ dialFinish: e.target.value })}
                                placeholder="Sunburst / linen / ..."
                            />
                        </div>

                        <div>
                            <FieldLabel>Buckle type</FieldLabel>
                            <Input
                                value={values.buckleType}
                                onChange={(e) => onChange({ buckleType: e.target.value })}
                                placeholder="Pin buckle / deployant"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <FieldLabel>Material note</FieldLabel>
                            <Textarea
                                rows={4}
                                value={values.materialNote}
                                onChange={(e) => onChange({ materialNote: e.target.value })}
                                placeholder="Ghi chú vật liệu"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

function Textarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
    return (
        <textarea
            {...props}
            className="block min-h-[108px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
        />
    );
}