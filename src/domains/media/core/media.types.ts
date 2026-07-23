export const AUDIENCE_SEGMENTS = ["MEN", "WOMEN", "UNISEX"] as const;
export type AudienceSegment = (typeof AUDIENCE_SEGMENTS)[number];

export const MEDIA_PIPELINE_KEYS = [
  "MEN_STANDARD",
  "WOMEN_LITE",
  "UNISEX_STANDARD",
] as const;
export type MediaPipelineKey = (typeof MEDIA_PIPELINE_KEYS)[number];

export const MEDIA_ROLES = [
  "COVER",
  "GALLERY",
  "INLINE",
  "SOCIAL",
  "THUMBNAIL",
] as const;
export type MediaRole = (typeof MEDIA_ROLES)[number];

export type MediaOwnerType = "WATCH" | "ACQUISITION" | "PRODUCT" | "LISTING";
export type MediaBindingLifecycle =
  | "DRAFT"
  | "SELECTED"
  | "ATTACHED"
  | "APPROVED"
  | "PUBLISHED"
  | "REMOVED";

export function pipelineKeyForSegment(segment: AudienceSegment): MediaPipelineKey {
  if (segment === "WOMEN") return "WOMEN_LITE";
  if (segment === "UNISEX") return "UNISEX_STANDARD";
  return "MEN_STANDARD";
}

export function normalizeAudienceSegment(value: unknown): AudienceSegment {
  const normalized = String(value ?? "").trim().toUpperCase();
  return AUDIENCE_SEGMENTS.includes(normalized as AudienceSegment)
    ? (normalized as AudienceSegment)
    : "MEN";
}
