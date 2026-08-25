export type PhotoRoomHorizontalAlignment = "left" | "center" | "right";
export type PhotoRoomVerticalAlignment = "top" | "center" | "bottom";
export type PhotoRoomSubjectSize = "small" | "default" | "large" | "xlarge";
export type PhotoRoomShadowMode = "none" | "soft" | "hard" | "floating";
export type PhotoRoomBackgroundMode = "white" | "transparent";
export type PhotoRoomOrientationDegrees = -90 | 0 | 90 | 180;

export type PhotoRoomAdjustment = {
  horizontalAlignment: PhotoRoomHorizontalAlignment;
  verticalAlignment: PhotoRoomVerticalAlignment;
  subjectSize: PhotoRoomSubjectSize;
  zoomPercent: number;
  horizontalOffsetPercent: number;
  verticalOffsetPercent: number;
  shadowMode: PhotoRoomShadowMode;
  backgroundMode: PhotoRoomBackgroundMode;
  enhanceMetal: boolean;
  flipHorizontal: boolean;
  orientationDegrees: PhotoRoomOrientationDegrees;
  rotationDegrees: number;
};

export const DEFAULT_PHOTOROOM_ADJUSTMENT: PhotoRoomAdjustment = {
  horizontalAlignment: "center",
  verticalAlignment: "center",
  subjectSize: "large",
  zoomPercent: 100,
  horizontalOffsetPercent: 0,
  verticalOffsetPercent: 0,
  shadowMode: "soft",
  backgroundMode: "white",
  enhanceMetal: false,
  flipHorizontal: false,
  orientationDegrees: 0,
  rotationDegrees: 0,
};

const REUSABLE_SHARP_VARIANTS = [
  "photoroom-",
  "sharp-light-",
  "cover-edit-",
  "cover-sharp-",
] as const;

export function isReusableSharpCoverKey(storageKey: string | null | undefined) {
  const normalized = String(storageKey ?? "").trim().toLowerCase();
  return Boolean(normalized) && REUSABLE_SHARP_VARIANTS.some((variant) => normalized.includes(variant));
}

export function isTransparentSharpCoverKey(storageKey: string | null | undefined) {
  const normalized = String(storageKey ?? "").trim().toLowerCase();
  return normalized.includes("photoroom-cutout-") || normalized.includes("cover-cutout-");
}

export function isRenderedSharpCoverKey(storageKey: string | null | undefined) {
  const normalized = String(storageKey ?? "").trim().toLowerCase();
  return normalized.includes("cover-sharp-");
}
