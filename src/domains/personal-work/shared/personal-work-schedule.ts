const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" });
const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export function scheduleDate(value: string | Date) { return day.format(new Date(value)); }
export function scheduleTime(value: string | Date) { return time.format(new Date(value)); }

export function scheduleDayCount(start: Date, end: Date) {
  return Math.round((Date.parse(`${scheduleDate(new Date(end.getTime() - 1))}T00:00:00Z`) - Date.parse(`${scheduleDate(start)}T00:00:00Z`)) / 86400000) + 1;
}

export function validatePersonalSchedule(start: string | Date | null | undefined, end: string | Date | null | undefined) {
  const dueAt = start ? new Date(start) : null;
  const scheduledEndAt = end ? new Date(end) : null;
  if (dueAt && !Number.isFinite(dueAt.getTime())) throw new Error("Ngày bắt đầu không hợp lệ");
  if (scheduledEndAt && (!Number.isFinite(scheduledEndAt.getTime()) || !dueAt || scheduledEndAt <= dueAt)) {
    throw new Error("Thời gian kết thúc phải sau thời gian bắt đầu");
  }
  const estimatedDays = dueAt && scheduledEndAt ? scheduleDayCount(dueAt, scheduledEndAt) : undefined;
  if (estimatedDays !== undefined && estimatedDays > 365) throw new Error("Thời gian công việc không được vượt quá 365 ngày");
  return { dueAt, scheduledEndAt, estimatedDays };
}

export function calendarScheduleInput(date: string, startTime: string, endTime: string, estimatedDays: number) {
  if (!startTime && endTime) throw new Error("Vui lòng chọn giờ bắt đầu và kết thúc");
  if (!startTime) return { dueAt: new Date(`${date}T23:59:59.999+07:00`).toISOString(), scheduledEndAt: null };
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) throw new Error("Vui lòng chọn giờ bắt đầu và kết thúc");
  const lastDay = new Date(`${date}T00:00:00Z`);
  lastDay.setUTCDate(lastDay.getUTCDate() + Math.max(1, estimatedDays) - 1);
  const start = new Date(`${date}T${startTime}:00+07:00`);
  const end = new Date(`${lastDay.toISOString().slice(0, 10)}T${endTime}:00+07:00`);
  validatePersonalSchedule(start, end);
  return { dueAt: start.toISOString(), scheduledEndAt: end.toISOString() };
}
