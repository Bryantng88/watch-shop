import type {
  PersonalCalendarEvent,
  PersonalWorkItem,
} from "./personal-work.types";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function calendarDayKey(value: string, allDay = false) {
  return allDay ? value.slice(0, 10) : dayFormatter.format(new Date(value));
}
export function buildPersonalCalendarEvents(
  items: PersonalWorkItem[],
  googleEvents: PersonalCalendarEvent[],
): PersonalCalendarEvent[] {
  const linked = new Map(
    googleEvents
      .filter((e) => e.linkedTaskItemId)
      .map((e) => [e.linkedTaskItemId!, e]),
  );
  const external = googleEvents.filter((e) => !e.linkedTaskItemId);
  return [
    ...external,
    ...items
      .filter((item) => item.dueAt && item.status !== "CANCELLED")
      .map((item) => {
        const original = linked.get(item.id);
        const startAt = calendarDayKey(item.dueAt!);
        const end = new Date(`${startAt}T00:00:00Z`);
        end.setUTCDate(end.getUTCDate() + Math.max(1, item.estimatedDays));
        return {
          id: original?.id || `local-task:${item.id}`,
          title: item.title,
          description: item.note,
          startAt,
          endAt: end.toISOString().slice(0, 10),
          allDay: true,
          htmlLink: item.calendar.htmlLink || original?.htmlLink || null,
          location: original?.location || null,
          linkedTaskItemId: item.id,
        };
      }),
  ];
}
export function groupCalendarEvents(
  events: PersonalCalendarEvent[],
  visibleDays: string[],
) {
  const grouped = new Map<string, PersonalCalendarEvent[]>();
  for (const event of events) {
    const start = calendarDayKey(event.startAt, event.allDay);
    for (const day of visibleDays) {
      if (
        day < start ||
        (!event.allDay && day !== start) ||
        (event.allDay && event.endAt
          ? day >= event.endAt.slice(0, 10)
          : day !== start)
      )
        continue;
      const entries = grouped.get(day) || [];
      entries.push(event);
      grouped.set(day, entries);
    }
  }
  return grouped;
}
export function calendarShareLabel(item: PersonalWorkItem) {
  if (item.access !== "OWNER")
    return `${item.owner.name || item.owner.email} chia sẻ · ${item.access === "EDITOR" ? "Có thể sửa" : "Chỉ xem"}`;
  return item.sharedWith.length
    ? `Chia sẻ với ${item.sharedWith.map((share) => share.user.name || share.user.email).join(", ")}`
    : null;
}
