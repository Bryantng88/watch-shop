"use client";

import { WandSparkles } from "lucide-react";

import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";
import {
    buildWatchSkuSuggestionFromForm,
    buildWatchTitleFromForm,
    shouldRegenerateWatchSku,
} from "@/domains/watch/shared/watch-title-sku.helpers";

type SimpleOption = {
    id: string;
    name: string;
    slug?: string | null;
};

type Props = {
    values: WatchFormValues;
    brands?: SimpleOption[];
    onDone?: (result: { title: string; sku?: string | null }) => void;
};

export default function RegenerateTitleSkuButton({
    values,
    brands = [],
    onDone,
}: Props) {
    function handleClick() {
        const title = buildWatchTitleFromForm(values, brands);
        const sku = shouldRegenerateWatchSku(values.header.sku)
            ? buildWatchSkuSuggestionFromForm(values, brands)
            : undefined;

        onDone?.({ title, sku });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            title="Tao title tu spec va chi cap nhat SKU neu SKU dang trong hoac la UNK/tam."
        >
            <WandSparkles className="h-4 w-4" />
            Tao title & SKU
        </button>
    );
}
