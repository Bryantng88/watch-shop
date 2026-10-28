import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPersonalCalendarEvents,
  groupCalendarEvents,
  calendarShareLabel,
  calendarDayKey,
} from "./personal-calendar";
import type {
  PersonalWorkItem,
  PersonalCalendarEvent,
} from "./personal-work.types";

const user = {
  id: "owner",
  name: "Owner",
  email: "owner@example.test",
  avatarUrl: null,
};
function item(overrides: Partial<PersonalWorkItem> = {}): PersonalWorkItem {
  return {
    id: "task",
    title: "Updated task",
    note: "Local note",
    status: "TODO",
    priority: "MEDIUM",
    dueAt: "2026-10-21T17:00:00.000Z",
    estimatedDays: 3,
    completedAt: null,
    domain: "GENERAL",
    category: {
      key: "GENERAL",
      label: "Cá nhân",
      color: "#64748b",
      domain: "GENERAL",
      isDefault: true,
    },
    workType: null,
    targets: [],
    progressPercent: 0,
    progressMode: "MANUAL",
    checklistLockedAt: null,
    activities: [],
    checklist: [],
    tags: [],
    calendar: { synced: false, htmlLink: null, lastSyncedAt: null },
    access: "OWNER",
    owner: user,
    sharedWith: [],
    ...overrides,
  };
}
const event: PersonalCalendarEvent = {
  id: "google",
  title: "Old title",
  description: null,
  startAt: "2026-10-20",
  endAt: "2026-10-21",
  allDay: true,
  htmlLink: null,
  location: null,
  linkedTaskItemId: "task",
};
test("linked Google event uses current task title/date once, with Bangkok midnight preserved", () => {
  const events = buildPersonalCalendarEvents([item()], [event]);
  assert.equal(events.length, 1);
  assert.equal(events[0].title, "Updated task");
  assert.equal(events[0].startAt, "2026-10-22");
  assert.equal(events[0].endAt, "2026-10-25");
});
test("removed/revoked/cancelled tasks do not survive as stale Google events", () => {
  assert.deepEqual(buildPersonalCalendarEvents([], [event]), []);
  assert.deepEqual(
    buildPersonalCalendarEvents([item({ status: "CANCELLED" })], [event]),
    [],
  );
});
test("external events remain available without becoming editable tasks", () => {
  const external = { ...event, linkedTaskItemId: null };
  assert.deepEqual(buildPersonalCalendarEvents([], [external]), [external]);
});
test("grouping clips multi-day events to the visible window and respects exclusive ends", () => {
  const events = buildPersonalCalendarEvents([item()], []);
  const grouped = groupCalendarEvents(events, [
    "2026-10-21",
    "2026-10-22",
    "2026-10-23",
    "2026-10-24",
    "2026-10-25",
  ]);
  assert.deepEqual(
    [...grouped.keys()],
    ["2026-10-22", "2026-10-23", "2026-10-24"],
  );
  assert.equal(groupCalendarEvents(events, ["2026-11-01"]).size, 0);
});
test("timed external events are grouped by Bangkok date", () => {
  assert.equal(calendarDayKey("2026-10-21T18:30:00Z"), "2026-10-22");
  assert.equal(
    groupCalendarEvents(
      [{ ...event, allDay: false, startAt: "2026-10-21T18:30:00Z" }],
      ["2026-10-21", "2026-10-22"],
    ).get("2026-10-22")?.length,
    1,
  );
});
test("overflow lists preserve all tasks and distinguish share roles", () => {
  const items = Array.from({ length: 8 }, (_, i) => item({ id: `task-${i}` }));
  assert.equal(
    groupCalendarEvents(buildPersonalCalendarEvents(items, []), [
      "2026-10-22",
    ]).get("2026-10-22")?.length,
    8,
  );
  assert.equal(calendarShareLabel(item()), null);
  assert.match(calendarShareLabel(item({ access: "VIEWER" }))!, /Chỉ xem/);
  assert.match(calendarShareLabel(item({ access: "EDITOR" }))!, /Có thể sửa/);
  assert.match(
    calendarShareLabel(
      item({
        sharedWith: [
          {
            user: { ...user, id: "recipient", name: "Recipient" },
            accessLevel: "VIEWER",
          },
        ],
      }),
    )!,
    /Recipient/,
  );
});
