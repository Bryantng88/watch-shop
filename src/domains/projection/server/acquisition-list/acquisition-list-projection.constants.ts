export const ACQUISITION_LIST_PROJECTION_KEY = "acquisition-list";
export const ACQUISITION_LIST_PROJECTION_VERSION = 1;

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
] as const;
