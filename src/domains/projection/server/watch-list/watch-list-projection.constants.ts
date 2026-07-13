export const WATCH_LIST_PROJECTION_KEY = "watch-list";
export const WATCH_LIST_PROJECTION_VERSION = 1;

export const WATCH_LIST_PROJECTION_SOURCE_EVENTS = [
  "watch.content.modified",
  "watch.price.updated",
  "watch.content.submitted",
  "watch.content.approved",
  "watch.content.rejected",
  "watch.content.unapproved",
  "watch.image.submitted",
  "watch.image.approved",
  "watch.image.rejected",
  "watch.image.unapproved",
  "watch.media.asset.attached",
  "watch.media.ready_for_publish",
  "watch.media.recalled",
  "watch.saleStage.posted",
] as const;
