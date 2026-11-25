"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
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
        <AdminButton variant="quiet"
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            title="Tạo lại tên theo thông số; chỉ đổi SKU nếu đang trống hoặc là mã UNK/tạm."
        >
            <WandSparkles className="h-4 w-4" />
            Tạo lại tên & SKU
        </AdminButton>
    );
}
