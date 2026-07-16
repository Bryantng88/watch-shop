"use client";

import { Settings2, Sparkles } from "lucide-react";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { Field, inputClass, OperationShell } from "../shared/OperationShell";

const MOVEMENT_OPTIONS = ["QUARTZ", "AUTOMATIC", "MANUAL", "MECA_QUARTZ"];
const CASE_OPTIONS = ["RECTANGLE", "ROUND", "TONNEAU", "SQUARE", "OVAL"];
const CONDITION_OPTIONS = ["GOOD", "VERY_GOOD", "EXCELLENT", "FAIR"];

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

    return (
        <OperationShell
            id="spec"
            number="2"
            title="Spec"
            icon={<Settings2 className="h-4 w-4" />}
            description="Thông số kỹ thuật và thông tin chi tiết của watch."
            actions={
                <>
                    <button type="button" className="h-9 rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700">
                        AI đề xuất spec
                    </button>
                    <button type="button" onClick={onSave} className="h-9 rounded-md bg-slate-950 px-3 text-xs font-bold text-white">
                        Làm gọn
                    </button>
                </>
            }
        >
            <div className="grid gap-3 md:grid-cols-4">
                <Field label="Brand">
                    <input className={inputClass} value={values.spec.specBrand} onChange={(event) => setSpec({ specBrand: event.target.value })} />
                </Field>
                <Field label="Model">
                    <input className={inputClass} value={values.spec.model} onChange={(event) => setSpec({ model: event.target.value })} />
                </Field>
                <Field label="Reference">
                    <input className={inputClass} value={values.spec.referenceNumber} onChange={(event) => setSpec({ referenceNumber: event.target.value })} />
                </Field>
                <Field label="Movement">
                    <select className={inputClass} value={values.basic.movementType} onChange={(event) => setBasic({ movementType: event.target.value })}>
                        <option value="">Chưa có</option>
                        {MOVEMENT_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </Field>
                <Field label="Case shape">
                    <select className={inputClass} value={values.spec.caseShape} onChange={(event) => setSpec({ caseShape: event.target.value })}>
                        <option value="">Chưa có</option>
                        {CASE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </Field>
                <Field label="Case material">
                    <input className={inputClass} value={values.spec.primaryCaseMaterial} onChange={(event) => setSpec({ primaryCaseMaterial: event.target.value })} />
                </Field>
                <Field label="Dial">
                    <input className={inputClass} value={values.spec.dialColor} onChange={(event) => setSpec({ dialColor: event.target.value })} />
                </Field>
                <Field label="Year">
                    <input className={inputClass} value={values.basic.yearText} onChange={(event) => setBasic({ yearText: event.target.value })} />
                </Field>
                <Field label="Gender">
                    <select className={inputClass} value={values.basic.gender} onChange={(event) => setBasic({ gender: event.target.value })}>
                        <option value="MEN">Men</option>
                        <option value="WOMEN">Women</option>
                        <option value="UNISEX">Unisex</option>
                    </select>
                </Field>
                <Field label="Style">
                    <input className={inputClass} value={values.basic.style} onChange={(event) => setBasic({ style: event.target.value })} />
                </Field>
                <Field label="Region">
                    <input className={inputClass} value={values.spec.materialNote} onChange={(event) => setSpec({ materialNote: event.target.value })} placeholder="USA / Japan / Swiss..." />
                </Field>
                <Field label="Condition">
                    <select className={inputClass} value={values.basic.conditionGrade} onChange={(event) => setBasic({ conditionGrade: event.target.value })}>
                        <option value="">Chưa có</option>
                        {CONDITION_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </Field>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <Sparkles className="h-4 w-4" />
                Lưu spec sẽ emit <b>watch.spec.updated</b> nếu có thay đổi để projection/consumer refresh.
            </div>
        </OperationShell>
    );
}
