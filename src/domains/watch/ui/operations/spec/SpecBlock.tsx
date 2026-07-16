"use client";

import { Settings2, Sparkles } from "lucide-react";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { Field, inputClass, OperationShell, operationButtonClass, textareaClass } from "../shared/OperationShell";

const MOVEMENT_OPTIONS = ["QUARTZ", "AUTOMATIC", "MANUAL", "MECA_QUARTZ"];
const CASE_SHAPE_OPTIONS = [
    "ROUND",
    "TANK",
    "SQUARE",
    "SPECIAL",
    "OTHER",
    "TONNEAU",
    "CUSHION",
    "OVAL",
    "ASYMMETRICAL",
    "OCTAGON",
    "POLYGON",
];
const CRYSTAL_OPTIONS = ["SAPPHIRE", "ACRYLIC", "MINERAL", "HARDLEX", "AR_COATED"];
const MATERIAL_PROFILE_OPTIONS = [
    { value: "SINGLE_MATERIAL", label: "Single material" },
    { value: "BIMETAL", label: "Bi-metal / Two tone" },
    { value: "COATED", label: "Coated / Plated" },
];
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
];
const GOLD_TREATMENT_OPTIONS = [
    "SOLID_GOLD",
    "CAPPED_GOLD",
    "GOLD_PLATED",
    "GOLD_VERMEIL",
    "GOLD_FILLED",
];
const GOLD_COLOR_OPTIONS = ["YELLOW", "WHITE", "ROSE", "MIXED"];
const GOLD_KARAT_OPTIONS = ["8", "9", "10", "14", "18"];

function SelectField({
    label,
    value,
    options,
    placeholder = "Chưa có",
    onChange,
}: {
    label: string;
    value: string;
    options: Array<string | { value: string; label: string }>;
    placeholder?: string;
    onChange: (value: string) => void;
}) {
    return (
        <Field label={label}>
            <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
                <option value="">{placeholder}</option>
                {options.map((item) => {
                    const option = typeof item === "string" ? { value: item, label: item } : item;
                    return <option key={option.value} value={option.value}>{option.label}</option>;
                })}
            </select>
        </Field>
    );
}

export default function SpecBlock({
    values,
    onChange,
    onSave,
}: {
    values: WatchWorkbenchValues;
    onChange: (next: WatchWorkbenchValues) => void;
    onSave: () => void;
}) {
    const setSpec = (patch: Partial<WatchWorkbenchValues["spec"]>) =>
        onChange(updateValues(values, { spec: patch }));
    const setBasic = (patch: Partial<WatchWorkbenchValues["basic"]>) =>
        onChange(updateValues(values, { basic: patch }));
    const materialProfile = values.spec.materialProfile || "SINGLE_MATERIAL";

    return (
        <OperationShell
            id="spec"
            number="2"
            title="Spec"
            icon={<Settings2 className="h-4 w-4" />}
            description="Subset nhanh theo đúng field của Watch spec modal. Field đầy đủ vẫn xử lý trong modal/workspace."
            actions={
                <>
                    <button type="button" className={operationButtonClass({ variant: "softAmber", size: "sm" })}>
                        AI đề xuất spec
                    </button>
                    <button type="button" onClick={onSave} className={operationButtonClass({ variant: "primary", size: "sm" })}>
                        Lưu thay đổi
                    </button>
                </>
            }
        >
            <div className="space-y-5">
                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">Identity</div>
                    <div className="grid gap-3 md:grid-cols-4">
                        <Field label="Brand">
                            <input className={inputClass} value={values.spec.specBrand} onChange={(event) => setSpec({ specBrand: event.target.value })} />
                        </Field>
                        <Field label="Model">
                            <input className={inputClass} value={values.spec.model} onChange={(event) => setSpec({ model: event.target.value })} placeholder="De Ville / Datejust / Tank..." />
                        </Field>
                        <Field label="Reference">
                            <input className={inputClass} value={values.spec.referenceNumber} onChange={(event) => setSpec({ referenceNumber: event.target.value })} />
                        </Field>
                        <Field label="Nickname">
                            <input className={inputClass} value={values.spec.nickname} onChange={(event) => setSpec({ nickname: event.target.value })} />
                        </Field>
                    </div>
                </section>

                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">Movement & Case</div>
                    <div className="grid gap-3 md:grid-cols-4">
                        <SelectField label="Movement type" value={values.basic.movementType} options={MOVEMENT_OPTIONS} onChange={(value) => setBasic({ movementType: value })} />
                        <Field label="Movement calibre">
                            <input className={inputClass} value={values.basic.movementCalibre} onChange={(event) => setBasic({ movementCalibre: event.target.value })} placeholder="L993.1 / 7S26 / ..." />
                        </Field>
                        <Field label="Case size (mm)">
                            <input className={inputClass} value={values.spec.caseSizeMM} onChange={(event) => setSpec({ caseSizeMM: event.target.value })} placeholder="35" />
                        </Field>
                        <Field label="Lug to lug (mm)">
                            <input className={inputClass} value={values.spec.lugToLugMM} onChange={(event) => setSpec({ lugToLugMM: event.target.value })} placeholder="44" />
                        </Field>
                        <Field label="Thickness (mm)">
                            <input className={inputClass} value={values.spec.thicknessMM} onChange={(event) => setSpec({ thicknessMM: event.target.value })} placeholder="11" />
                        </Field>
                        <SelectField label="Case form" value={values.spec.caseShape} options={CASE_SHAPE_OPTIONS} onChange={(value) => setSpec({ caseShape: value })} />
                        <SelectField label="Crystal" value={values.spec.crystal} options={CRYSTAL_OPTIONS} onChange={(value) => setSpec({ crystal: value })} />
                        <Field label="Year text">
                            <input className={inputClass} value={values.basic.yearText} onChange={(event) => setBasic({ yearText: event.target.value })} placeholder="1970s / 1990s / ..." />
                        </Field>
                    </div>
                </section>

                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">Appearance</div>
                    <div className="grid gap-3 md:grid-cols-4">
                        <Field label="Dial color">
                            <input className={inputClass} value={values.spec.dialColor} onChange={(event) => setSpec({ dialColor: event.target.value })} placeholder="Silver / Black / Champagne" />
                        </Field>
                        <Field label="Dial finish">
                            <input className={inputClass} value={values.spec.dialFinish} onChange={(event) => setSpec({ dialFinish: event.target.value })} placeholder="Sunburst / linen / brushed / ..." />
                        </Field>
                        <Field label="Condition">
                            <input className={inputClass} value={values.basic.conditionGrade} onChange={(event) => setBasic({ conditionGrade: event.target.value })} placeholder="GOOD / EXCELLENT..." />
                        </Field>
                    </div>
                </section>

                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">Material</div>
                    <div className="grid gap-3 md:grid-cols-4">
                        <SelectField label="Material profile" value={materialProfile} options={MATERIAL_PROFILE_OPTIONS} onChange={(value) => setSpec({ materialProfile: value })} />
                        <SelectField label="Primary material" value={values.spec.primaryCaseMaterial} options={MATERIAL_OPTIONS} onChange={(value) => setSpec({ primaryCaseMaterial: value })} />
                        {materialProfile === "BIMETAL" ? (
                            <SelectField label="Secondary material" value={values.spec.secondaryCaseMaterial} options={MATERIAL_OPTIONS} onChange={(value) => setSpec({ secondaryCaseMaterial: value })} />
                        ) : null}
                        {materialProfile === "COATED" ? (
                            <>
                                <SelectField label="Gold treatment" value={values.spec.goldTreatment} options={GOLD_TREATMENT_OPTIONS} onChange={(value) => setSpec({ goldTreatment: value })} />
                                <SelectField label="Gold karat" value={values.spec.goldKarat} options={GOLD_KARAT_OPTIONS.map((value) => ({ value, label: `${value}K` }))} onChange={(value) => setSpec({ goldKarat: value })} />
                                <div className="md:col-span-2">
                                    <span className="mb-1.5 block text-[11px] font-semibold uppercase text-slate-500">Gold colors</span>
                                    <div className="flex flex-wrap gap-2">
                                        {GOLD_COLOR_OPTIONS.map((color) => {
                                            const checked = values.spec.goldColors.includes(color);
                                            return (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = values.spec.goldColors || [];
                                                        setSpec({
                                                            goldColors: checked
                                                                ? current.filter((item) => item !== color)
                                                                : [...current, color],
                                                        });
                                                    }}
                                                    className={operationButtonClass({
                                                        variant: checked ? "softAmber" : "secondary",
                                                        size: "xs",
                                                    })}
                                                >
                                                    {color}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : null}
                        <div className="md:col-span-4">
                            <Field label="Material note">
                                <textarea className={textareaClass} value={values.spec.materialNote} onChange={(event) => setSpec({ materialNote: event.target.value })} placeholder="Ghi chú vật liệu" />
                            </Field>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <Sparkles className="h-4 w-4" />
                Lưu spec sẽ emit <b>watch.spec.updated</b> nếu có thay đổi để projection/consumer refresh.
            </div>
        </OperationShell>
    );
}
