import type {
  AudienceSegment,
  MediaPipelineKey,
  MediaRole,
} from "../core/media.types";

export type MediaStageKey = "photography" | "media-processing" | "publish";

export type MediaPipelineProfile = {
  key: MediaPipelineKey;
  segment: AudienceSegment;
  stages: readonly MediaStageKey[];
  requiredRoles: readonly MediaRole[];
};

const PROFILES: Record<MediaPipelineKey, MediaPipelineProfile> = {
  MEN_STANDARD: {
    key: "MEN_STANDARD",
    segment: "MEN",
    stages: ["photography", "media-processing", "publish"],
    requiredRoles: ["COVER", "GALLERY", "INLINE"],
  },
  WOMEN_LITE: {
    key: "WOMEN_LITE",
    segment: "WOMEN",
    stages: ["photography", "publish"],
    requiredRoles: ["COVER", "GALLERY"],
  },
  UNISEX_STANDARD: {
    key: "UNISEX_STANDARD",
    segment: "UNISEX",
    stages: ["photography", "media-processing", "publish"],
    requiredRoles: ["COVER", "GALLERY", "INLINE"],
  },
};

export function getMediaPipelineProfile(key: MediaPipelineKey) {
  return PROFILES[key];
}

export function listMediaPipelineProfiles() {
  return Object.values(PROFILES);
}
