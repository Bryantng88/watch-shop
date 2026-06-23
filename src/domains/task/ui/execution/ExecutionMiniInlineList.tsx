"use client";

import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import ExecutionMiniInline from "./ExecutionMiniInline";

export default function ExecutionMiniInlineList({
    items,
    onPreview,
    onMore,
    limit = 3,
}: {
    items: any[];
    onPreview: (preview: BusinessEntityPreview) => void;
    onMore?: () => void;
    limit?: number;
}) {
    const visible = items.slice(0, limit);
    const remain = items.length - visible.length;

    return (
        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
            {visible.map((item) => (
                <ExecutionMiniInline
                    key={`${item.targetType}:${item.targetId}`}
                    item={item}
                    onPreview={onPreview}
                />
            ))}

            {remain > 0 ? (
                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onMore?.();
                    }}
                    className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-200"
                >
                    +{remain}
                </button>
            ) : null}
        </div>
    );
}