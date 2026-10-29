export type GoogleEventEditInput = {
  id: string; etag: string; title: string; description: string; location: string;
  allDay: boolean; startAt: string; endAt: string;
};

export function validateGoogleEventEdit(input: GoogleEventEditInput) {
  if (!input || typeof input.id !== "string" || !/^[a-zA-Z0-9_-]{1,1024}$/.test(input.id) ||
    typeof input.etag !== "string" || !/^"[^"\r\n]{1,250}"$/.test(input.etag)) throw new Error("Sự kiện không hợp lệ. Hãy tải lại lịch");
  if (typeof input.title !== "string" || !input.title.trim() || input.title.length > 240 ||
    typeof input.description !== "string" || input.description.length > 10000 ||
    typeof input.location !== "string" || input.location.length > 500 || typeof input.allDay !== "boolean") throw new Error("Nội dung sự kiện không hợp lệ");
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
  const instant = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
  for (const value of [input.startAt, input.endAt]) {
    if (typeof value !== "string" || !(input.allDay ? dateOnly : instant).test(value) || !Number.isFinite(Date.parse(value))) throw new Error("Ngày giờ không hợp lệ");
    if (new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) !== value.slice(0, 10)) throw new Error("Ngày không hợp lệ");
  }
  const duration = Date.parse(input.endAt) - Date.parse(input.startAt);
  if (duration <= 0 || duration > 365 * 86400000) throw new Error("Thời gian kết thúc phải sau bắt đầu và không quá 365 ngày");
  return {
    summary: input.title.trim(), description: input.description, location: input.location.trim(),
    start: input.allDay ? { date: input.startAt, dateTime: null, timeZone: null } : { date: null, dateTime: new Date(input.startAt).toISOString(), timeZone: "Asia/Bangkok" },
    end: input.allDay ? { date: input.endAt, dateTime: null, timeZone: null } : { date: null, dateTime: new Date(input.endAt).toISOString(), timeZone: "Asia/Bangkok" },
  };
}

export function shiftGoogleEventDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
