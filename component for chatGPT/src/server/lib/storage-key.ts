export function normalizeKey(input: string | null | undefined) {
    return String(input ?? "")
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/\/+$/g, "")
        .replace(/\/+/g, "/")
        .trim();
}
