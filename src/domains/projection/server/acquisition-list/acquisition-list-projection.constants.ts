export const ACQUISITION_LIST_PROJECTION_KEY = "acquisition-list";
// v4 refreshes quantity-aware totals and multi-source trade-in rows.
export const ACQUISITION_LIST_PROJECTION_VERSION = 4;

export const ACQUISITION_LIST_PROJECTION_SOURCE_EVENTS = [
  "acquisition.created",
  "acquisition.updated",
  "acquisition.items.updated",
  "acquisition.posted",
  "acquisition.canceled",
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
  "payment.exception_marked",
  "watch.media.photoshoot.completed",
  "watch.inline.image.updated",
  "watch.cover.updated",
  "watch.media.asset.attached",
  "watch.media.ready_for_publish",
  "watch.media.recalled",
] as const;
