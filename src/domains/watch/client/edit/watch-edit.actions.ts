export async function regenerateWatchTitleSku(input: { productId: string }) {
    const res = await fetch("/api/admin/watches/regenerate-title-sku", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Không thể gen lại title & SKU");
    }

    return data.item as {
        title: string;
        sku: string | null;
    };
}