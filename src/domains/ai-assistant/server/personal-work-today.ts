import { personalWorkCode } from "@/domains/personal-work/shared/personal-work-code";
import type { DB } from "@/server/db/client";
import { personalWorkViewAccessWhere } from "@/domains/personal-work/server/personal-work-access";
import {
  isPersonalEvent,
  personalEventLabel,
} from "@/domains/personal-work/shared/personal-event";
import { personalDayBucket, type PersonalWorkSchedule } from "@/domains/personal-work/shared/personal-work-day";
import { businessDay } from "../business-day";

export { personalDayBucket };
type Schedule = PersonalWorkSchedule & { id: string };

export async function personalWorkToday(
  db: DB,
  userId: string,
  now = new Date(),
  mode: "TODAY" | "OVERDUE" = "TODAY",
) {
  const day = businessDay(null, now),
    today: Schedule[] = [],
    overdue: Schedule[] = [];
  let overdueCount = 0,
    unscheduledCount = 0,
    scanned = 0,
    cursor: string | undefined,
    partial = false;
  // Scan schedule metadata only. Old task titles never enter this lookup's result
  // and cannot displace today's rows in the displayed limit.
  for (let page = 0; page < 20; page++) {
    const rows = await db.taskItem.findMany({
      where: {
        ...personalWorkViewAccessWhere(userId),
        status: { notIn: ["DONE", "CANCELLED"] },
      },
      orderBy: { id: "asc" },
      take: 501,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        dueAt: true,
        scheduledEndAt: true,
        workTypeId: true,
        estimatedDays: true,
      },
    });
    const batch = rows.slice(0, 500);
    scanned += batch.length;
    for (const row of batch) {
      const bucket = personalDayBucket(
        row,
        day.start.getTime(),
        day.end.getTime(),
      );
      if (bucket === "TODAY") today.push(row);
      else if (bucket === "OVERDUE") {
        overdueCount++;
        overdue.push(row);
      } else if (bucket === "UNSCHEDULED") unscheduledCount++;
    }
    partial = rows.length > 500;
    if (!partial) break;
    cursor = batch[batch.length - 1].id;
  }
  const selected = mode === "OVERDUE" ? overdue : today;
  selected.sort(
    (a, b) =>
      a.dueAt!.getTime() - b.dueAt!.getTime() || a.id.localeCompare(b.id),
  );
  const ids = selected.slice(0, 12).map((r) => r.id);
  const rows = ids.length
    ? await db.taskItem.findMany({
        where: {
          AND: [
            personalWorkViewAccessWhere(userId),
            { id: { in: ids }, status: { notIn: ["DONE", "CANCELLED"] } },
          ],
        },
        select: {
          id: true,
          title: true,
          personalWorkNumber: true,
          status: true,
          dueAt: true,
          scheduledEndAt: true,
          workTypeId: true,
          estimatedDays: true,
        },
      })
    : [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  return {
    focus: mode,
    date: day.date,
    timeZone: day.timeZone,
    observedAt: now.toISOString(),
    todayCount: today.length,
    overdueCount,
    unscheduledCount,
    countsExact: !partial,
    scanned,
    truncated: partial || selected.length > 12,
    items: ids.flatMap((id) => {
      const row = byId.get(id);
      if (
        !row ||
        personalDayBucket(row, day.start.getTime(), day.end.getTime()) !== mode
      )
        return [];
      return [
        {
          ...row,
          code: personalWorkCode(row.id,row.personalWorkNumber),
          title: row.title.slice(0, 180),
          dueAt: row.dueAt?.toISOString() ?? null,
          scheduledEndAt: row.scheduledEndAt?.toISOString() ?? null,
          kind: isPersonalEvent(row.workTypeId) ? "EVENT" : "TASK",
          eventState: isPersonalEvent(row.workTypeId)
            ? personalEventLabel(
                row.dueAt,
                row.scheduledEndAt,
                now,
                row.estimatedDays,
              )
            : null,
        },
      ];
    }),
    meaning:
      mode === "OVERDUE"
        ? "Danh sách quá hạn được yêu cầu rõ ràng; không phải danh sách hôm nay."
        : "Chỉ liệt kê lịch/việc hôm nay và mục nhiều ngày còn diễn ra hôm nay. Việc quá hạn hoặc chưa có lịch chỉ nhắc tổng số, không liệt kê tiêu đề. Khi countsExact=false, số lượng là ít nhất trong phần đã quét; không khẳng định danh sách đầy đủ.",
  };
}
