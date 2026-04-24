"use client";

import { useEffect, useMemo, useState } from "react";
import { Gem } from "lucide-react";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import {
    Button,
    Dialog,
    DialogFooter,
    FieldLabel,
    Input,
    Select,
    Toggle,
} from "./shared";

type Props = {
    open: boolean;
    values: WatchFormValues["spec"];
    onClose: () => void;
    onSave: (patch: WatchFormValues["spec"]) => void;
};

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
].map((x) => ({ value: x, label: x }));

const CRYSTAL_OPTIONS = [
    "SAPPHIRE",
    "ACRYLIC",
    "MINERAL",
    "HARDLEX",
    "AR_COATED",
].map((x) => ({ value: x, label: x }));

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
].map((x) => ({ value: x, label: x }));

const GOLD_TREATMENT_OPTIONS = [
    "SOLID_GOLD",
    "CAPPED_GOLD",
    "GOLD_PLATED",
    "GOLD_VERMEIL",
    "GOLD_FILLED",
].map((x) => ({ value: x, label: x }));

const GOLD_COLOR_OPTIONS = ["YELLOW", "WHITE", "ROSE", "MIXED"];

const GOLD_KARAT_OPTIONS = ["8", "9", "10", "14", "18"].map((x) => ({
    value: x,
    label: `${x}K`,
}));

const BRACELET_OPTIONS = [
    "LEATHER",
    "BRACELET",
    "RUBBER",
    "NATO",
    "CANVASS",
    "SPECIAL",
].map((x) => ({ value: x, label: x }));

export function buildWatchSpecSummary(spec: WatchFormValues["spec"]) {
    const parts = [
        spec.model,
        spec.referenceNumber,
        spec.caseShape,
        spec.caseSizeMM ? `${spec.caseSizeMM}mm` : "",
        spec.dialColor,
        spec.materialProfile,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" · ") : "Chưa có spec chi tiết";
}

export default function WatchSpecModal({
    open,
    values,
    onClose,
    onSave,
}: Props) {
    const [draft, setDraft] = useState<WatchFormValues["spec"]>(values);

    useEffect(() => {
        if (open) {
            setDraft(values);
        }
    }, [open, values]);

    const materialProfile = draft.materialProfile || "SINGLE_MATERIAL";

    const missingCount = useMemo(() => {
        const required = [
            draft.model,
            draft.referenceNumber,
            draft.caseShape,
            draft.caseSizeMM,
            draft.dialColor,
            draft.primaryCaseMaterial,
        ];
        return required.filter((x) => !String(x ?? "").trim()).length;
    }, [
        draft.model,
        draft.referenceNumber,
        draft.caseShape,
        draft.caseSizeMM,
        draft.dialColor,
        draft.primaryCaseMaterial,
    ]);

    const patch = (next: Partial<WatchFormValues["spec"]>) => {
        setDraft((prev) => ({ ...prev, ...next }));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title="Spec & vật liệu"
            description="Giữ phần này riêng để màn hình edit chính gọn hơn, dễ thao tác hơn."
            maxWidthClass="max-w-6xl"
        >
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Gem className="h-4 w-4" />
                    Snapshot spec
                </div>
                <div className="mt-1 text-sm text-slate-600">
                    {buildWatchSpecSummary(draft)}
                </div>
                <div className="mt-2 text-xs font-medium text-amber-700">
                    {missingCount > 0
                        ? `Còn thiếu ${missingCount} trường spec quan trọng`
                        : "Spec cơ bản đã đủ"}
                </div>
            </div>

            <div className="space-y-8">
                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">
                        Identity
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <FieldLabel>Model</FieldLabel>
                            <Input
                                value={draft.model}
                                onChange={(e) => patch({ model: e.target.value })}
                                placeholder="Model"
                            />
                        </div>

                        <div>
                            <FieldLabel>Reference</FieldLabel>
                            <Input
                                value={draft.referenceNumber}
                                onChange={(e) =>
                                    patch({ referenceNumber: e.target.value })
                                }
                                placeholder="Reference"
                            />
                        </div>

                        <div>
                            <FieldLabel>Nickname</FieldLabel>
                            <Input
                                value={draft.nickname}
                                onChange={(e) => patch({ nickname: e.target.value })}
                                placeholder="Nickname"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">
                        Case & movement
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel>Case shape</FieldLabel>
                            <Select
                                value={draft.caseShape}
                                onChange={(e) => patch({ caseShape: e.target.value })}
                                options={CASE_SHAPE_OPTIONS}
                                placeholder="Chọn case shape"
                            />
                        </div>

                        <div>
                            <FieldLabel>Dial color</FieldLabel>
                            <Input
                                value={draft.dialColor}
                                onChange={(e) => patch({ dialColor: e.target.value })}
                                placeholder="Dial color"
                            />
                        </div>

                        <div>
                            <FieldLabel>Case size (mm)</FieldLabel>
                            <Input
                                value={draft.caseSizeMM}
                                onChange={(e) => patch({ caseSizeMM: e.target.value })}
                                placeholder="34"
                            />
                        </div>

                        <div>
                            <FieldLabel>Lug to lug (mm)</FieldLabel>
                            <Input
                                value={draft.lugToLugMM}
                                onChange={(e) => patch({ lugToLugMM: e.target.value })}
                                placeholder="44"
                            />
                        </div>

                        <div>
                            <FieldLabel>Thickness (mm)</FieldLabel>
                            <Input
                                value={draft.thicknessMM}
                                onChange={(e) => patch({ thicknessMM: e.target.value })}
                                placeholder="11"
                            />
                        </div>

                        <div>
                            <FieldLabel>Crystal</FieldLabel>
                            <Select
                                value={draft.crystal}
                                onChange={(e) => patch({ crystal: e.target.value })}
                                options={CRYSTAL_OPTIONS}
                                placeholder="Chọn crystal"
                            />
                        </div>

                        <div>
                            <FieldLabel>Calibre</FieldLabel>
                            <Input
                                value={draft.calibre}
                                onChange={(e) => patch({ calibre: e.target.value })}
                                placeholder="7S26 / L993.1 / ..."
                            />
                        </div>

                        <div>
                            <FieldLabel>Power reserve</FieldLabel>
                            <Input
                                value={draft.powerReserve}
                                onChange={(e) => patch({ powerReserve: e.target.value })}
                                placeholder="40h"
                            />
                        </div>

                        <div>
                            <FieldLabel>Water resistance</FieldLabel>
                            <Input
                                value={draft.waterResistance}
                                onChange={(e) =>
                                    patch({ waterResistance: e.target.value })
                                }
                                placeholder="30m / 50m"
                            />
                        </div>

                        <div>
                            <FieldLabel>Dial finish</FieldLabel>
                            <Input
                                value={draft.dialFinish}
                                onChange={(e) => patch({ dialFinish: e.target.value })}
                                placeholder="Sunburst / linen / brushed / ..."
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-3 text-sm font-semibold text-slate-900">
                        Material
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel>Material profile</FieldLabel>
                            <Select
                                value={draft.materialProfile}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    patch({
                                        materialProfile: next,
                                        ...(next === "SINGLE_MATERIAL"
                                            ? {
                                                secondaryCaseMaterial: "",
                                                goldTreatment: "",
                                                goldColors: [],
                                                goldKarat: "",
                                            }
                                            : {}),
                                        ...(next === "BIMETAL"
                                            ? {
                                                goldTreatment: "",
                                                goldColors: [],
                                                goldKarat: "",
                                            }
                                            : {}),
                                    });
                                }}
                                options={MATERIAL_PROFILE_OPTIONS}
                            />
                        </div>

                        <div>
                            <FieldLabel>Primary material</FieldLabel>
                            <Select
                                value={draft.primaryCaseMaterial}
                                onChange={(e) =>
                                    patch({ primaryCaseMaterial: e.target.value })
                                }
                                options={MATERIAL_OPTIONS}
                                placeholder="Chọn chất liệu"
                            />
                        </div>

                        {materialProfile === "BIMETAL" ? (
                            <div>
                                <FieldLabel>Secondary material</FieldLabel>
                                <Select
                                    value={draft.secondaryCaseMaterial}
                                    onChange={(e) =>
                                        patch({
                                            secondaryCaseMaterial: e.target.value,
                                        })
                                    }
                                    options={MATERIAL_OPTIONS}
                                    placeholder="Chọn chất liệu phụ"
                                />
                            </div>
                        ) : null}

                        {materialProfile === "COATED" ? (
                            <>
                                <div>
                                    <FieldLabel>Gold treatment</FieldLabel>
                                    <Select
                                        value={draft.goldTreatment}
                                        onChange={(e) =>
                                            patch({ goldTreatment: e.target.value })
                                        }
                                        options={GOLD_TREATMENT_OPTIONS}
                                        placeholder="Chọn gold treatment"
                                    />
                                </div>

                                <div>
                                    <FieldLabel>Gold karat</FieldLabel>
                                    <Select
                                        value={draft.goldKarat}
                                        onChange={(e) =>
                                            patch({ goldKarat: e.target.value })
                                        }
                                        options={GOLD_KARAT_OPTIONS}
                                        placeholder="Chọn gold karat"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel>Gold colors</FieldLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {GOLD_COLOR_OPTIONS.map((color) => {
                                            const checked = draft.goldColors.includes(color);
                                            return (
                                                <Toggle
                                                    key={color}
                                                    checked={checked}
                                                    label={color}
                                                    onChange={(next) => {
                                                        const current =
                                                            draft.goldColors || [];
                                                        patch({
                                                            goldColors: next
                                                                ? [...current, color]
                                                                : current.filter(
                                                                    (x) => x !== color
                                                                ),
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
                                value={draft.braceletType}
                                onChange={(e) =>
                                    patch({ braceletType: e.target.value })
                                }
                                options={BRACELET_OPTIONS}
                                placeholder="Chọn bracelet type"
                            />
                        </div>

                        <div>
                            <FieldLabel>Strap material text</FieldLabel>
                            <Input
                                value={draft.strapMaterialText}
                                onChange={(e) =>
                                    patch({ strapMaterialText: e.target.value })
                                }
                                placeholder="Leather / steel / beads of rice / ..."
                            />
                        </div>

                        <div>
                            <FieldLabel>Buckle type</FieldLabel>
                            <Input
                                value={draft.buckleType}
                                onChange={(e) => patch({ buckleType: e.target.value })}
                                placeholder="Pin buckle / deployant / ..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <FieldLabel>Material note</FieldLabel>
                            <textarea
                                value={draft.materialNote}
                                onChange={(e) =>
                                    patch({ materialNote: e.target.value })
                                }
                                placeholder="Ghi chú vật liệu"
                                className="block min-h-[108px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>
                </section>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button
                    onClick={() => {
                        onSave(draft);
                        onClose();
                    }}
                >
                    Lưu spec
                </Button>
            </DialogFooter>
        </Dialog>
    );
}