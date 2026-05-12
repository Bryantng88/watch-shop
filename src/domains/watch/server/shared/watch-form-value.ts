export type WatchFormMediaItem = {
    key?: string | null;
    fileKey?: string | null;
    url?: string | null;
    name?: string | null;
};

export function textOrUndefined(value?: string | null) {
    const text = String(value ?? "").trim();
    return text || undefined;
}

export function normalizeText(value?: string | null) {
    return String(value ?? "").trim();
}

export function normalizeArray(value?: unknown[]) {
    return (value ?? []).map((x) => String(x ?? "").trim()).filter(Boolean);
}

export function normalizeImageKeys(
    items?: { key?: string | null; fileKey?: string | null }[]
) {
    return (items ?? [])
        .map((x) => String(x.key ?? x.fileKey ?? "").trim())
        .filter(Boolean);
}

export function sameJson(a: unknown, b: unknown) {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

export function fileNameFromKey(key: string) {
    return key.split("/").pop() ?? key;
}

export function mediaKey(item: WatchFormMediaItem) {
    return String(item?.key ?? item?.fileKey ?? "").trim();
}

export function dedupeMediaItems(items: WatchFormMediaItem[]) {
    const map = new Map<string, WatchFormMediaItem>();

    for (const item of items ?? []) {
        const key = mediaKey(item);
        if (!key) continue;

        map.set(key, {
            ...item,
            key,
            fileKey: key,
            name: item.name ?? fileNameFromKey(key),
        });
    }

    return Array.from(map.values());
}
