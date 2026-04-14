import { normalizeKey } from "@/server/lib/storage-key";

export type MediaProfile =
    | "inline"
    | "edit"
    | "sold"
    | "storefront-active"
    | "storefront-chosen";

const PROFILE_ROOTS: Record<MediaProfile, string> = {
    inline: "inline",
    edit: "products/edit/active",
    sold: "product/sold",
    "storefront-active": "product/storefront/active",
    "storefront-chosen": "product/storefront/chosen",
};

export function getProfileRoot(profile: MediaProfile) {
    return PROFILE_ROOTS[profile];
}

export function sanitizeBrowsePrefix(
    input: string | null | undefined,
    profile: MediaProfile
) {
    const root = getProfileRoot(profile);

    if (
        profile === "edit" ||
        profile === "storefront-active" ||
        profile === "storefront-chosen"
    ) {
        return root;
    }

    const raw = normalizeKey(String(input ?? "")).replace(/^\/+|\/+$/g, "");

    if (!raw) return root;
    if (raw === root) return root;
    if (raw.startsWith(`${root}/`)) return raw;

    return root;
}

export { normalizeKey };