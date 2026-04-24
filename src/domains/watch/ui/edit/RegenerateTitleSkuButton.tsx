"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regenerateWatchTitleSku } from "@/domains/watch/client/edit/watch-edit.actions";

type Props = {
    productId: string;
    onDone?: (result: { title: string; sku: string | null }) => void;
};

export default function RegenerateTitleSkuButton({
    productId,
    onDone,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (loading) return;

        try {
            setLoading(true);
            const result = await regenerateWatchTitleSku({ productId });

            onDone?.(result);
            router.refresh();
            alert("Đã gen lại title & SKU");
        } catch (error: any) {
            alert(error?.message || "Không thể gen lại title & SKU");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Đang gen..." : "Gen lại title & SKU"}
        </button>
    );
}