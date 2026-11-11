import { isPersonalEvent, personalEventBounds } from "./personal-event";

const DAY = 86400000,
  OFFSET = 7 * 3600000;
export type PersonalWorkSchedule = {
  dueAt: Date | null;
  scheduledEndAt: Date | null;
  workTypeId: string | null;
  estimatedDays: number;
};
export function personalDayBucket(
  item: PersonalWorkSchedule,
  start: number,
  end: number,
): "TODAY" | "OVERDUE" | "UNSCHEDULED" | "OTHER" {
  const event = isPersonalEvent(item.workTypeId);
  if (!item.dueAt) return event ? "OTHER" : "UNSCHEDULED";
  const bounds = event
    ? personalEventBounds(item.dueAt, item.scheduledEndAt, item.estimatedDays)
    : item.scheduledEndAt
      ? { start: item.dueAt.getTime(), end: item.scheduledEndAt.getTime() }
      : {
          start:
            Math.floor((item.dueAt.getTime() + OFFSET) / DAY) * DAY - OFFSET,
          end:
            (Math.floor((item.dueAt.getTime() + OFFSET) / DAY) +
              Math.max(1, item.estimatedDays)) *
              DAY -
            OFFSET,
        };
  if (bounds.start < end && bounds.end > start) return "TODAY";
  return !event && bounds.start < start && bounds.end <= start ? "OVERDUE" : "OTHER";
}
