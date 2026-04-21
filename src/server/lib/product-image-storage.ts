import { normalizeKey } from "@/server/lib/storage-key";

export type MediaProfile =
    | "inline"
    | "edit"
    | "sold"
    | "storefront-active"
    | "storefront-chosen";

const PROFILE_ROOTS: Record<MediaProfile, string> = {
    inline: "products/inline/active",
    edit: "products/edit/active",
    sold: "products/sold",
    "storefront-active": "products/storefront/active",
    "storefront-chosen": "products/storefront/chosen",
};

export function getProfileRoot(profile: MediaProfile) {
    return PROFILE_ROOTS[profile];
}

export function sanitizeBrowsePrefix(
    input: string | null | undefined,
    profile: MediaProfile
) {
    const root = normalizeKey(getProfileRoot(profile)).replace(/^\/+|\/+$/g, "");
    const raw = normalizeKey(String(input ?? "")).replace(/^\/+|\/+$/g, "");

    if (!raw) return root;
    if (raw === root) return root;
    if (raw.startsWith(`${root}/`)) return raw;

    return root;
}

export { normalizeKey };