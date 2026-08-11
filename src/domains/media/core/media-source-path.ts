export type MediaAudienceSegment = "MEN" | "WOMEN" | "UNISEX";
export type MediaSourcePurpose = "inline" | "edit" | "cover";

export function mediaSourceRoot(
  segment: MediaAudienceSegment,
  purpose: MediaSourcePurpose,
) {
  return `media/${segment.toLowerCase()}/${purpose}`;
}
