"use client";

import { WandSparkles } from "lucide-react";

import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";
import { buildWatchTitleSkuSuggestion } from "@/domains/watch/shared/watch-title-sku.helpers";

type SimpleOption = {
    id: string;
    name: string;
    slug?: string | null;
};

type Props = {
    values: WatchFormValues;
    brands?: SimpleOption[];
    onDone?: (result: { title: string; sku: string | null }) => void;
};

export default function RegenerateTitleSkuButton({
    values,
    brands = [],
    onDone,
}: Props) {
    function handleClick() {
        const result = buildWatchTitleSkuSuggestion(values, brands);
        onDone?.(result);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            title="Gen từ form state hiện tại, không cần lưu DB trước."
        >
            <WandSparkles className="h-4 w-4" />
            Gen lại title & SKU
        </button>
    );
}
