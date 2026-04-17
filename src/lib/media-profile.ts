export type MediaProfile =
    | "inline"
    | "edit"
    | "sold"
    | "storefront-active"
    | "storefront-chosen"
    | "technical-inline";

const PROFILE_ROOTS: Record<MediaProfile, string> = {
    inline: "products/inline/active",
    edit: "products/edit/active",
    sold: "products/sold",
    "storefront-active": "products/storefront/active",
    "storefront-chosen": "products/storefront/chosen",
    "technical-inline": "inline/product/technical/active",
};

export function getMediaProfileRoot(profile: MediaProfile) {
    return PROFILE_ROOTS[profile];
}

export function resolveMediaPreviewSrc(value?: string | null) {
    if (!value) return null;
    if (value.startsWith("http")) return value;
    return `/api/media/sign?key=${encodeURIComponent(value)}`;
}