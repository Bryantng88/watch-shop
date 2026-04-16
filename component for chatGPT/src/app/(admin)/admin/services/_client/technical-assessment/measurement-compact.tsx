"use client";

import { ImagePlus } from "lucide-react";
import TechnicalImagePicker from "@/components/media/TechnicalImagePicker";
import { cx } from "./utils";

type MeasurementCompactValue = {
    beforeImageFileKey?: string | null;
    afterImageFileKey?: string | null;
};

type MeasurementCompactProps = {
    value: MeasurementCompactValue;
    onChange: (patch: Partial<MeasurementCompactValue>) => void;
    disabled?: boolean;
    className?: string;
};

export function MeasurementCompact({
    value,
    onChange,
    disabled,
    className,
}: MeasurementCompactProps) {
    return (
        <section
            className={cx(
                "rounded-[24px] border border-slate-200 bg-white shadow-sm",
                className
            )}
        >
            <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                        <ImagePlus className="h-5 w-5 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900">
                            Ảnh máy đo thực tế
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Lưu ảnh trước và sau xử lý để kỹ thuật đối chiếu thực tế.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                <div className="min-w-0">
                    <div className="mb-2 text-sm font-medium text-slate-800">Trước xử lý</div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <TechnicalImagePicker
                            value={value.beforeImageFileKey || null}
                            onChange={(fileKey) => onChange({ beforeImageFileKey: fileKey || undefined })}
                            disabled={disabled}
                            compact={false}
                        />
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="mb-2 text-sm font-medium text-slate-800">Sau xử lý</div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <TechnicalImagePicker
                            value={value.afterImageFileKey || null}
                            onChange={(fileKey) => onChange({ afterImageFileKey: fileKey || undefined })}
                            disabled={disabled}
                            compact={false}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MeasurementCompact;
