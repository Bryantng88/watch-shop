import type { WatchWorkbenchValues } from "./types";

export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function moneyText(value: unknown, fallback = "-") {
    const raw = String(value ?? "").replace(/[^\d.-]/g, "");
    const num = Number(raw);

    if (!Number.isFinite(num) || num === 0) return fallback;

    return new Intl.NumberFormat("vi-VN").format(num);
}

export function maskMoney(canView: boolean, value: unknown) {
    return canView ? moneyText(value) : "••••••";
}

export function onlyMoney(value: string) {
    return value.replace(/[^\d]/g, "");
}

export function normalizeDate(value: unknown) {
    if (!value) return "-";
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return "-";

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export function updateValues(
    values: WatchWorkbenchValues,
    patch: Partial<WatchWorkbenchValues>,
): WatchWorkbenchValues {
    return {
        ...values,
        ...patch,
        basic: { ...values.basic, ...(patch.basic ?? {}) },
        spec: { ...values.spec, ...(patch.spec ?? {}) },
        content: { ...values.content, ...(patch.content ?? {}) },
        pricing: { ...values.pricing, ...(patch.pricing ?? {}) },
        media: { ...values.media, ...(patch.media ?? {}) },
    };
}

export function titleForWatch(detail: Record<string, any>, values: WatchWorkbenchValues) {
    return (
        values.basic.title ||
        detail?.title ||
        [detail?.brand?.name, detail?.spec?.model].filter(Boolean).join(" ") ||
        "Watch"
    );
}
