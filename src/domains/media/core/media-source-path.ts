export type MediaAudienceSegment = "MEN" | "WOMEN" | "UNISEX";
export type MediaSourcePurpose = "inline" | "edit";

export function mediaSourceRoot(
  segment: MediaAudienceSegment,
  purpose: MediaSourcePurpose,
) {
  return `media/${segment.toLowerCase()}/${purpose}`;
}
