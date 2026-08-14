export type PhotoRoomHorizontalAlignment = "left" | "center" | "right";
export type PhotoRoomVerticalAlignment = "top" | "center" | "bottom";
export type PhotoRoomSubjectSize = "small" | "default" | "large";
export type PhotoRoomFineOffset = "negative" | "none" | "positive";
export type PhotoRoomShadowMode = "none" | "soft" | "hard" | "floating";
export type PhotoRoomBackgroundMode = "white" | "transparent";

export type PhotoRoomAdjustment = {
  horizontalAlignment: PhotoRoomHorizontalAlignment;
  verticalAlignment: PhotoRoomVerticalAlignment;
  subjectSize: PhotoRoomSubjectSize;
  horizontalOffset: PhotoRoomFineOffset;
  verticalOffset: PhotoRoomFineOffset;
  shadowMode: PhotoRoomShadowMode;
  backgroundMode: PhotoRoomBackgroundMode;
};

export const DEFAULT_PHOTOROOM_ADJUSTMENT: PhotoRoomAdjustment = {
  horizontalAlignment: "center",
  verticalAlignment: "center",
  subjectSize: "default",
  horizontalOffset: "none",
  verticalOffset: "none",
  shadowMode: "soft",
  backgroundMode: "white",
};
