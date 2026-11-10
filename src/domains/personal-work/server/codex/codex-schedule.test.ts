import assert from "node:assert/strict";
import test from "node:test";
import {
  codexReadyWhere,
  personalCodexFingerprint,
  personalCodexPrompt,
} from "./codex-schedule";
import { personalWorkPlanSchema } from "@/domains/ai-assistant/personal-work-contract";
import { assistantCapabilities } from "@/domains/ai-assistant/capabilities";

const plan = {
  kind: "TASK",
  title: "Bổ sung danh sách vendor",
  note: null,
  categoryKey: "GENERAL",
  workType: null,
  dueAt: "2026-11-11T23:59:59+07:00",
  scheduledEndAt: null,
  tags: [],
  shares: [],
  priority: "MEDIUM",
  checklist: [],
  syncGoogle: false,
};
test("explicit Codex execution time is independent of the task date; legacy tasks remain non-executable", () => {
  assert.equal(personalWorkPlanSchema.parse(plan).codex, undefined);
  const scheduled = personalWorkPlanSchema.parse({
    ...plan,
    codex: { startAt: "2026-11-11T08:00:00+07:00" },
  });
  assert.equal(scheduled.codex?.startAt, "2026-11-11T08:00:00+07:00");
  assert.equal(scheduled.dueAt, plan.dueAt);
  assert.equal(
    personalWorkPlanSchema.safeParse({ ...plan, tags: ["codex"] }).success,
    false,
  );
  assert.equal(
    personalWorkPlanSchema.safeParse({
      ...plan,
      codex: { startAt: null },
      tags: ["CODEX"],
    }).success,
    true,
  );
  for (const extra of [
    { kind: "EVENT" },
    { assigneeUserId: "other" },
    { codex: { startAt: "tomorrow" } },
    { codex: { startAt: "2026-11-11T08:00:00" } },
    { codex: { startAt: null, merge: true } },
  ])
    assert.equal(
      personalWorkPlanSchema.safeParse({
        ...plan,
        codex: { startAt: null },
        ...extra,
      }).success,
      false,
    );
});
test("claim query includes immediate and due runs at the exact server boundary, without a dueAt/deadline gate", () => {
  const now = new Date("2026-11-11T01:00:00Z");
  assert.deepEqual(codexReadyWhere(now), {
    status: "QUEUED",
    OR: [{ notBefore: null }, { notBefore: { lte: now } }],
  });
  assert.equal(new Date("2026-11-11T08:00:00+07:00").getTime(), now.getTime());
});
test("edits to the approved task prompt/checklist change its fingerprint and cannot silently execute an old snapshot", () => {
  const task = {
    title: "Vendor list",
    note: "Add search",
    checklists: [{ title: "Run tests", isDone: false }],
  };
  const hash = personalCodexFingerprint(personalCodexPrompt(task));
  for (const changed of [
    { ...task, title: "Different work" },
    { ...task, note: "Different scope" },
    { ...task, checklists: [{ title: "Run tests", isDone: true }] },
  ])
    assert.notEqual(
      personalCodexFingerprint(personalCodexPrompt(changed)),
      hash,
    );
  assert.equal(
    personalCodexFingerprint(personalCodexPrompt({ ...task })),
    hash,
  );
});
test("worker staging boundary is not bypassed by admin role or a chat capability", () => {
  const old = { ...process.env };
  try {
    process.env.PERSONAL_CODEX_ENABLED = "1";
    process.env.PERSONAL_CODEX_ENVIRONMENT = "production";
    assert.equal(
      assistantCapabilities({ admin: true, permissions: new Set() })
        .canSchedulePersonalCodex,
      false,
    );
    process.env.PERSONAL_CODEX_ENVIRONMENT = "staging";
    process.env.DATABASE_URL = "postgresql://localhost/personal_codex_test";
    process.env.PERSONAL_CODEX_WORKER_TOKEN = "x".repeat(32);
    assert.equal(
      assistantCapabilities({ admin: true, permissions: new Set() })
        .canSchedulePersonalCodex,
      true,
    );
    assert.equal(
      assistantCapabilities({
        admin: false,
        permissions: new Set(["TASK_VIEW"]),
      }).canSchedulePersonalCodex,
      false,
    );
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in old)) delete process.env[key];
    Object.assign(process.env, old);
  }
});
