import assert from "node:assert/strict";
import { test } from "node:test";
import {
  personalEventLabel,
  personalEventTiming,
  personalItemScheduleInput,
  personalEventBounds,
} from "./personal-event";
import { personalWorkPlanSchema } from "@/domains/ai-assistant/personal-work-contract";
const plan = {
  kind: "TASK",
  title: "Mang đồng hồ Tissot đưa cho Nam",
  note: null,
  categoryKey: "GENERAL",
  workType: null,
  dueAt: "2026-11-10T08:00:00+07:00",
  scheduledEndAt: "2026-11-10T09:00:00+07:00",
  tags: [],
  shares: [],
  priority: "MEDIUM",
  checklist: [],
  syncGoogle: false,
};
test("scheduled personal review needs no customer or product, rejects code tags and implicit privilege fields", () => {
  assert.equal(personalWorkPlanSchema.parse(plan).title, plan.title);
  assert.equal(personalWorkPlanSchema.safeParse({ ...plan, customerId: "guess" }).success, false);
  assert.equal(personalWorkPlanSchema.safeParse({ ...plan, tags: ["codex"] }).success, false);
  assert.equal(
    personalWorkPlanSchema.safeParse({ ...plan, dueAt: "2026-11-10T08:00:00" }).success,
    false,
  );
  assert.equal(
    personalWorkPlanSchema.safeParse({ ...plan, kind: "EVENT", dueAt: null, scheduledEndAt: null })
      .success,
    false,
  );
  assert.equal(
    personalWorkPlanSchema.safeParse({ ...plan, scheduledEndAt: "2026-11-10T07:00:00+07:00" })
      .success,
    false,
  );
});
test("event occurrence is derived from time, never a completion state", () => {
  assert.equal(
    personalEventLabel(plan.dueAt, plan.scheduledEndAt, new Date("2026-11-10T07:59:00+07:00")),
    "Sắp diễn ra",
  );
  assert.equal(
    personalEventLabel(plan.dueAt, plan.scheduledEndAt, new Date("2026-11-10T08:30:00+07:00")),
    "Đang diễn ra",
  );
  assert.equal(
    personalEventLabel(plan.dueAt, plan.scheduledEndAt, new Date("2026-11-10T09:00:00+07:00")),
    "Đã diễn ra",
  );
});
test("a point event remains timed without fabricating a user-selected end; all-day and 23:59 points differ", () => {
  const item = { workType: "EVENT", dueAt: plan.dueAt, scheduledEndAt: null };
  assert.equal(personalEventTiming(item).point, true);
  assert.equal(personalEventTiming(item).end!.getTime() - Date.parse(plan.dueAt), 60000);
  assert.equal(personalEventTiming({ ...item, dueAt: "2026-11-10T23:59:00+07:00" }).point, true);
  assert.equal(
    personalEventTiming({ ...item, dueAt: "2026-11-10T23:59:59.999+07:00" }).timed,
    false,
  );
  assert.equal(
    personalEventLabel(
      "2026-11-10T23:59:59.999+07:00",
      null,
      new Date("2026-11-10T10:00:00+07:00"),
    ),
    "Đang diễn ra",
  );
  assert.equal(
    personalEventBounds("2026-11-10T23:59:59.999+07:00", null, 2).end,
    Date.parse("2026-11-12T00:00:00+07:00"),
  );
});
test("UI point-event schedules require a date and preserve start-only scheduling", () => {
  const schedule = personalItemScheduleInput("2026-11-10", "08:00", "", 1, true);
  assert.equal(schedule.scheduledEndAt, null);
  assert.equal(schedule.dueAt, "2026-11-10T01:00:00.000Z");
  assert.throws(() => personalItemScheduleInput("", "08:00", "", 1, true));
  assert.throws(() => personalItemScheduleInput("2026-11-10", "08:00", "", 1, false));
});
