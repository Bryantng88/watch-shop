export type PhotoRoomHorizontalAlignment = "left" | "center" | "right";
export type PhotoRoomVerticalAlignment = "top" | "center" | "bottom";
export type PhotoRoomSubjectSize = "small" | "default" | "large" | "xlarge";
export type PhotoRoomFineOffset = "negative" | "none" | "positive";
export type PhotoRoomShadowMode = "none" | "soft" | "hard" | "floating";
export type PhotoRoomBackgroundMode = "white" | "transparent";
export type PhotoRoomOrientationDegrees = -90 | 0 | 90 | 180;

export type PhotoRoomAdjustment = {
  horizontalAlignment: PhotoRoomHorizontalAlignment;
  verticalAlignment: PhotoRoomVerticalAlignment;
  subjectSize: PhotoRoomSubjectSize;
  horizontalOffset: PhotoRoomFineOffset;
  verticalOffset: PhotoRoomFineOffset;
  shadowMode: PhotoRoomShadowMode;
  backgroundMode: PhotoRoomBackgroundMode;
  enhanceMetal: boolean;
  orientationDegrees: PhotoRoomOrientationDegrees;
  rotationDegrees: number;
};

export const DEFAULT_PHOTOROOM_ADJUSTMENT: PhotoRoomAdjustment = {
  horizontalAlignment: "center",
  verticalAlignment: "center",
  subjectSize: "large",
  horizontalOffset: "none",
  verticalOffset: "none",
  shadowMode: "soft",
  backgroundMode: "white",
  enhanceMetal: false,
  orientationDegrees: 0,
  rotationDegrees: 0,
};
