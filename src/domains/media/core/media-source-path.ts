export type MediaAudienceSegment = "MEN" | "WOMEN" | "UNISEX";
export type MediaSourcePurpose = "inline" | "edit" | "cover";

export function mediaSourceRoot(
  segment: MediaAudienceSegment,
  purpose: MediaSourcePurpose,
) {
  return `media/${segment.toLowerCase()}/${purpose}`;
}

export function isLegacyWatchMediaSource(key: string) {
  const normalized = key.replaceAll("\\", "/").replace(/^\/+/, "");
  return [
    "products/edit/active/",
    "products/inline/active/",
    "products/cover/active/",
    "products/edit/chosen/",
    "products/inline/chosen/",
  ].some((prefix) => normalized.startsWith(prefix));
}
