"use client";

import { PackageCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
    cleanBusinessStatusLabel,
    executionToPreview,
    getBusinessStatus,
    getExecutionTitle,
    statusTextTone,
    targetLabel,
} from "./execution-ui.utils";

export default function ExecutionMiniInline({
    item,
    onPreview,
}: {
    item: any;
    onPreview: (preview: BusinessEntityPreview) => void;
}) {
    const rawStatus = getBusinessStatus(item);
    const statusLabel = cleanBusinessStatusLabel(rawStatus, item.targetType);
    const typeLabel = targetLabel(item.targetType);

    return (
        <div className="flex h-9 min-w-[190px] max-w-[220px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-2">
            <div className="flex min-w-0 items-center gap-1.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    {item.targetType === "SERVICE_REQUEST" || item.targetType === "TECHNICAL_ISSUE" ? (
                        <Wrench className="h-3 w-3" />
                    ) : (
                        <PackageCheck className="h-3 w-3" />
                    )}
                </span>

                <div className="min-w-0">
                    <div className="line-clamp-1 text-[11px] font-semibold leading-4 text-slate-800">
                        {getExecutionTitle(item)}
                    </div>

                    <div className="mt-0.5 flex items-center gap-1 text-[10px] leading-3">
                        <span className="text-slate-400">{typeLabel}</span>
                        <span className="text-slate-300">·</span>
                        <span
                            className={cn(
                                "max-w-[92px] truncate font-semibold",
                                statusTextTone(statusLabel, item.businessStageTone),
                            )}
                        >
                            {statusLabel}
                        </span>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onPreview(executionToPreview(item));
                }}
                className="shrink-0 text-[10px] font-semibold text-blue-600 hover:underline"
            >
                Mở
            </button>
        </div>
    );
}