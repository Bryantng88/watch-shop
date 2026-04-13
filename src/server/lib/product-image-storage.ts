import { normalizeKey } from "@/server/lib/storage-key";
import { moveMediaObject } from "@/server/lib/media-storage";

export type MediaProfile = "inline" | "edit" | "sold";

export const PRODUCT_INLINE_PREFIX = "products/inline/active";
export const PRODUCT_INLINE_CHOSEN_PREFIX = "products/inline/chosen";
export const PRODUCT_EDIT_PREFIX = "products/edit";
export const PRODUCT_SOLD_PREFIX = "products/sold";

export function getProfileRoot(profile: MediaProfile) {
    switch (profile) {
        case "edit":
            return PRODUCT_EDIT_PREFIX;
        case "sold":
            return PRODUCT_SOLD_PREFIX;
        case "inline":
        default:
            return PRODUCT_INLINE_PREFIX;
    }
}

export function sanitizeBrowsePrefix(input: string | null | undefined, profile: MediaProfile) {
    const root = getProfileRoot(profile);
    const normalized = normalizeKey(input);
    if (!normalized) return root;
    if (normalized === root || normalized.startsWith(`${root}/`)) return normalized;
    return root;
}

export function isWithinPrefix(key: string, prefix: string) {
    const normalizedKey = normalizeKey(key);
    const normalizedPrefix = normalizeKey(prefix);
    return normalizedKey === normalizedPrefix || normalizedKey.startsWith(`${normalizedPrefix}/`);
}

export function buildInlineChosenKey(productId: string, sourceKey: string) {
    const fileName = normalizeKey(sourceKey).split("/").pop() || "file";
    return normalizeKey(`${PRODUCT_INLINE_CHOSEN_PREFIX}/${productId}/${fileName}`);
}

export function buildInlineActiveKeyFromChosen(chosenKey: string) {
    const fileName = normalizeKey(chosenKey).split("/").pop() || "file";
    return normalizeKey(`${PRODUCT_INLINE_PREFIX}/${fileName}`);
}

export async function archiveProductImagesForSold(
    productId: string,
    options?: { deleteSource?: boolean }
) {
    return {
        productId,
        archived: false,
        note: "Giữ nguyên hàm business cũ ở đây; chỉ chuyển generic storage ra media-storage.",
        deleteSource: options?.deleteSource !== false,
    };
}

export { moveMediaObject, normalizeKey };
