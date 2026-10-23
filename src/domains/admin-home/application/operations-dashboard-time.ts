export function bangkokDayBounds(now: Date) {
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const start = new Date(`${dateKey}T00:00:00+07:00`);
  return { start, end: new Date(start.getTime() + 86_400_000) };
}

