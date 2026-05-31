"use client";

import * as React from "react";
import { ScorePill } from "./primitives";
import { buildTechnicalSummaryForSale } from "./utils";
import { HealthStatus, MachineType } from "./types";

export function CollapsibleDefects({
    title,
    score,
    defects,
}: {
    title: string;
    score: number;
    defects: string[];
}) {
    const [open, setOpen] = React.useState(defects.length > 0);
    const preview = defects.slice(0, 3);
    const moreCount = Math.max(0, defects.length - preview.length);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                        {defects.length > 0 ? `${defects.length} khuyết điểm` : "Không ghi nhận khuyết điểm"}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {preview.length > 0 ? (
                            <>
                                {preview.map((item, index) => (
                                    <span
                                        key={`${item}-${index}`}
                                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                                    >
                                        {item}
                                    </span>
                                ))}
                                {moreCount > 0 ? (
                                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                                        +{moreCount}
                                    </span>
                                ) : null}
                            </>
                        ) : (
                            <span className="text-sm text-slate-500">Không có khuyết điểm được ghi nhận.</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 self-start">
                    <ScorePill score={score} />
                    <span className="text-sm text-slate-400">{open ? "−" : "+"}</span>
                </div>
            </button>

            {open && defects.length > preview.length ? (
                <div className="border-t border-slate-200 px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                        {defects.map((item, index) => (
                            <span
                                key={`${item}-${index}`}
                                className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export function TechnicalFinalSummary({
    machineIssueTitles,
    appearanceScore,
    appearanceDefects,
    machineStatus,
    machineType,
    afterSpecs,
}: {
    machineIssueTitles: string[];
    appearanceScore: number;
    appearanceDefects: string[];
    machineStatus: HealthStatus;
    machineType: MachineType;
    afterSpecs: { rate: string; amp: string; err: string };
}) {
    const summaryText = buildTechnicalSummaryForSale({
        machineStatus,
        machineIssueTitles,
        appearanceScore,
        appearanceDefects,
        afterSpecs,
        machineType,
    });

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Kết quả kỹ thuật gửi sale</div>
                <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {summaryText}
                </div>
            </div>
        </div>
    );
}
