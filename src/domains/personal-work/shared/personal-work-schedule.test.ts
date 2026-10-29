import assert from "node:assert/strict";
import test from "node:test";
import { calendarScheduleInput, scheduleDate, scheduleTime, validatePersonalSchedule } from "./personal-work-schedule";

test("timed input uses Bangkok time regardless of machine timezone", () => {
  const schedule = calendarScheduleInput("2026-10-29", "09:30", "10:45", 1);
  assert.equal(schedule.dueAt, "2026-10-29T02:30:00.000Z");
  assert.equal(schedule.scheduledEndAt, "2026-10-29T03:45:00.000Z");
  assert.equal(scheduleTime(schedule.dueAt), "09:30");
  assert.equal(scheduleDate(schedule.dueAt), "2026-10-29");
});
test("all-day and an explicit midnight start remain distinct", () => {
  assert.equal(calendarScheduleInput("2026-10-29", "", "", 1).scheduledEndAt, null);
  const midnight = calendarScheduleInput("2026-10-29", "00:00", "01:00", 1);
  assert.equal(midnight.dueAt, "2026-10-28T17:00:00.000Z");
  assert.ok(midnight.scheduledEndAt);
});
test("multi-day hours preserve the last-day time and reject invalid intervals", () => {
  const schedule = calendarScheduleInput("2026-10-29", "23:00", "01:00", 2);
  assert.equal(schedule.scheduledEndAt, "2026-10-29T18:00:00.000Z");
  assert.equal(validatePersonalSchedule(schedule.dueAt, schedule.scheduledEndAt).estimatedDays, 2);
  assert.throws(() => calendarScheduleInput("2026-10-29", "10:00", "09:00", 1));
  assert.throws(() => calendarScheduleInput("2026-10-29", "", "10:00", 1));
  assert.throws(() => validatePersonalSchedule(null, "2026-10-29T03:00:00Z"));
  assert.throws(() => validatePersonalSchedule("invalid", null));
});
