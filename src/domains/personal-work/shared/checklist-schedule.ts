export type ChecklistSchedule = {startAt?: string | Date | null; deadlineAt?: string | Date | null};
export function validateChecklistSchedule(start: string | null, deadline: string | null) {
  const startAt = start ? new Date(start) : null, deadlineAt = deadline ? new Date(deadline) : null;
  if ((startAt && !Number.isFinite(+startAt)) || (deadlineAt && !Number.isFinite(+deadlineAt))) throw new Error("Ngày giờ đầu việc không hợp lệ");
  if (startAt && !deadlineAt) throw new Error("Vui lòng chọn hạn chót cho đầu việc");
  if (startAt && deadlineAt && deadlineAt < startAt) throw new Error("Hạn chót phải từ ngày bắt đầu trở đi");
  return {startAt, deadlineAt};
}
/** Completed entries remain in the range. Unscheduled entries do not invent dates. */
export function checklistScheduleRange(entries: ChecklistSchedule[]) {
  const starts = entries.flatMap(e => e.startAt || e.deadlineAt ? [+new Date(e.startAt || e.deadlineAt!)] : []);
  const ends = entries.flatMap(e => e.deadlineAt || e.startAt ? [+new Date(e.deadlineAt || e.startAt!)] : []);
  return {dueAt: starts.length ? new Date(Math.min(...starts)).toISOString() : null,
    scheduledEndAt: ends.length && Math.max(...ends)>Math.min(...starts) ? new Date(Math.max(...ends)).toISOString() : null};
}

export function checklistMomentLabel(value: string | Date | null | undefined) {
  return value?new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Bangkok",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(value)):"Chưa có lịch";
}
