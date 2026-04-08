"use client";

import * as React from "react";
import { Field } from "./primitives";
import { FormState, MachineType } from "./types";
import TechnicalImagePicker from "@/components/media/TechnicalImagePicker";


export function MeasurementCompact({
    machineType,
    value,
    onChange,
    disabled,
}: {
    machineType: MachineType;
    value: {
        beforeSpecs: { rate: string; amp: string; err: string };
        afterSpecs: { rate: string; amp: string; err: string };
        showBeforeSpecs: boolean;
        beforeImageFileKey?: string;
        afterImageFileKey?: string;
    };
    onChange: (patch: Partial<FormState>) => void;
    disabled?: boolean;
}) {
    if (machineType !== "MECHANICAL") return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">
                    Ảnh máy đo thực tế
                </div>
                <div className="mt-1 text-xs text-slate-500">
                    Lưu ảnh trước và sau xử lý để kỹ thuật đối chiếu thực tế.
                </div>
            </div>

            <div className="grid gap-4 px-4 py-4 md:grid-cols-2">
                <Field label="Trước xử lý">
                    <TechnicalImagePicker
                        value={value.beforeImageFileKey || ""}
                        onChange={(fileKey) =>
                            onChange({
                                beforeImageFileKey: fileKey,
                            } as Partial<FormState>)
                        }
                        disabled={disabled}
                    />
                </Field>

                <Field label="Sau xử lý">
                    <TechnicalImagePicker
                        value={value.afterImageFileKey || ""}
                        onChange={(fileKey) =>
                            onChange({
                                afterImageFileKey: fileKey,
                            } as Partial<FormState>)
                        }
                        disabled={disabled}
                    />
                </Field>
            </div>
        </div>
    );
}