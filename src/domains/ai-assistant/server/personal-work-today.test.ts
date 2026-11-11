import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import { personalDayBucket, personalWorkToday } from "./personal-work-today";
const now = new Date("2026-11-11T02:00:00Z"),
  start = Date.parse("2026-11-11T00:00:00+07:00"),
  end = start + 86400000;
const item = (
  id: string,
  date: string | null,
  kind: string | null = null,
  days = 1,
) => ({
  id,
  title: "Việc " + id,
  status: "TODO",
  dueAt: date ? new Date(date) : null,
  scheduledEndAt: null as Date | null,
  workTypeId: kind,
  estimatedDays: days,
});
test("today buckets respect Vietnam boundaries and multi-day overlap, not the size of the overdue backlog", () => {
  assert.equal(
    personalDayBucket(item("a", "2026-11-11T16:00:00+07:00"), start, end),
    "TODAY",
  );
  assert.equal(
    personalDayBucket(item("b", "2026-11-10T23:59:59+07:00"), start, end),
    "OVERDUE",
  );
  assert.equal(
    personalDayBucket(item("c", "2026-11-12T00:00:00+07:00"), start, end),
    "OTHER",
  );
  assert.equal(personalDayBucket(item("d", null), start, end), "UNSCHEDULED");
  assert.equal(
    personalDayBucket(
      item("e", "2026-11-10T10:00:00+07:00", "EVENT"),
      start,
      end,
    ),
    "OTHER",
  );
  assert.equal(
    personalDayBucket(
      item("f", "2026-11-10T23:59:59.999+07:00", null, 3),
      start,
      end,
    ),
    "TODAY",
  );
  assert.equal(
    personalDayBucket(
      {
        ...item("g", "2026-11-10T23:00:00+07:00", "EVENT"),
        scheduledEndAt: new Date(start),
      },
      start,
      end,
    ),
    "OTHER",
  );
  assert.equal(
    personalDayBucket(
      {
        ...item("h", "2026-11-10T23:00:00+07:00", "EVENT"),
        scheduledEndAt: new Date(start + 3600000),
      },
      start,
      end,
    ),
    "TODAY",
  );
});
test("today returns only today's titles, with full overdue count and no backlog displacement across metadata pages", async () => {
  const rows = [
    ...Array.from({ length: 520 }, (_, i) =>
      item("old-" + String(i).padStart(3, "0"), "2026-11-10T09:00:00+07:00"),
    ),
    item("today-2", "2026-11-11T16:00:00+07:00"),
    item("today-1", "2026-11-11T09:00:00+07:00"),
    item("unscheduled", null),
  ];
  type Query = {
    select: { title?: boolean };
    where: { AND?: [unknown, { id: { in: string[] } }] };
    cursor?: { id: string };
    take?: number;
  };
  const calls: Query[] = [];
  const db = {
    taskItem: {
      findMany: async (args: Query) => {
        calls.push(args);
        if (args.select.title) {
          const ids = args.where.AND![1].id.in;
          return rows.filter((r) => ids.includes(r.id));
        }
        const cursorId = args.cursor?.id;
        const index = cursorId
          ? rows.findIndex((r) => r.id === cursorId) + 1
          : 0;
        return rows.slice(index, index + (args.take ?? 501)).map((r) => ({
          id: r.id,
          dueAt: r.dueAt,
          scheduledEndAt: r.scheduledEndAt,
          workTypeId: r.workTypeId,
          estimatedDays: r.estimatedDays,
        }));
      },
    },
  } as unknown as DB;
  const result = await personalWorkToday(db, "owner", now);
  assert.deepEqual(
    result.items.map((r) => r.id),
    ["today-1", "today-2"],
  );
  assert.equal(result.overdueCount, 520);
  assert.equal(result.unscheduledCount, 1);
  assert.equal(result.todayCount, 2);
  assert.equal(result.countsExact, true);
  assert.equal(result.truncated, false);
  assert.equal(result.date, "2026-11-11");
  assert.equal(JSON.stringify(result).includes("old-"), false);
  assert.deepEqual(calls.at(-1)!.where.AND![1].id.in, ["today-1", "today-2"]);
  const overdue = await personalWorkToday(db, "owner", now, "OVERDUE");
  assert.equal(overdue.items.length, 12);
  assert.equal(overdue.focus, "OVERDUE");
  assert.equal(overdue.truncated, true);
});
test("a bounded scan cannot claim there is no work or an exact count when metadata coverage is partial", async () => {
  let cursor = 0;
  const db = {
    taskItem: {
      findMany: async () =>
        Array.from({ length: 501 }, () =>
          item("old-" + cursor++, "2026-11-10T09:00:00+07:00"),
        ),
    },
  } as unknown as DB;
  const result = await personalWorkToday(db, "owner", now);
  assert.equal(result.scanned, 10000);
  assert.equal(result.countsExact, false);
  assert.equal(result.truncated, true);
  assert.deepEqual(result.items, []);
});
