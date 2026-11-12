const zone = "Asia/Ho_Chi_Minh";
const day = new Intl.DateTimeFormat("en-CA", {
  timeZone: zone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const date = new Intl.DateTimeFormat("vi-VN", {
  timeZone: zone,
  dateStyle: "short",
  timeStyle: "short",
});
const clock = new Intl.DateTimeFormat("vi-VN", {
  timeZone: zone,
  hour: "2-digit",
  minute: "2-digit",
});
export function reviewDate(value: string) {
  return date.format(new Date(value));
}
export function reviewSchedule(start: string | null, end: string | null) {
  if (!start) return "Chưa đặt lịch";
  if (!end) return reviewDate(start);
  return (
    reviewDate(start) +
    " – " +
    (day.format(new Date(start)) === day.format(new Date(end))
      ? clock.format(new Date(end))
      : reviewDate(end))
  );
}
