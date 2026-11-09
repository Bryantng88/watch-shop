import {
  calendarScheduleInput,
  validatePersonalSchedule,
  scheduleTime,
} from "./personal-work-schedule";
export const PERSONAL_EVENT_TYPE = "EVENT";
export function isPersonalEvent(type: unknown) {
  return typeof type === "string" && type.trim().toUpperCase() === PERSONAL_EVENT_TYPE;
}
function allDayDate(value: string | Date) {
  const d = new Date(value);
  return scheduleTime(d) === "23:59" && d.getUTCSeconds() === 59 && d.getUTCMilliseconds() === 999;
}
export function personalEventBounds(start: string | Date, end?: string | Date | null, days = 1) {
  const at = new Date(start).getTime();
  return !end && allDayDate(start)
    ? { start: at - 86399999, end: at - 86399999 + 86400000 * Math.max(1, days) }
    : { start: at, end: end ? new Date(end).getTime() : at + 60000 };
}
export function personalEventLabel(
  start: string | Date | null,
  end?: string | Date | null,
  now = new Date(),
  days = 1,
) {
  if (!start) return "Chưa đặt lịch";
  const bounds = personalEventBounds(start, end, days);
  return now.getTime() < bounds.start
    ? "Sắp diễn ra"
    : now.getTime() < bounds.end
      ? "Đang diễn ra"
      : "Đã diễn ra";
}
export function personalItemScheduleInput(
  date: string,
  start: string,
  end: string,
  days: number,
  event: boolean,
) {
  if (event && !date) throw Error("Sự kiện cần ngày diễn ra");
  if (event && start && !end) {
    const dueAt = new Date(`${date}T${start}:00+07:00`).toISOString();
    validatePersonalSchedule(dueAt, null);
    return { dueAt, scheduledEndAt: null };
  }
  return calendarScheduleInput(date, start, end, days);
}
export function personalEventTiming(item: {
  workType?: string | null;
  workTypeId?: string | null;
  dueAt: string | Date | null;
  scheduledEndAt?: string | Date | null;
}) {
  const event = isPersonalEvent(item.workType ?? item.workTypeId);
  const point = event && !!item.dueAt && !item.scheduledEndAt && !allDayDate(item.dueAt);
  return {
    event,
    point,
    timed: !!item.scheduledEndAt || point,
    end: item.scheduledEndAt
      ? new Date(item.scheduledEndAt)
      : point
        ? new Date(new Date(item.dueAt!).getTime() + 60000)
        : null,
  };
}
