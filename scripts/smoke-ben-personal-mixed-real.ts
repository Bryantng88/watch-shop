import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/server/db/client";
import { assistantActor } from "../src/domains/ai-assistant/server/access";
import {
  sendAssistant,
  listAssistant,
  cancelAssistant,
} from "../src/domains/ai-assistant/server/service";
import { createPersonalWorkItem } from "../src/domains/personal-work/server/personal-work.service";
import { personalWorkDraftItems } from "../src/domains/ai-assistant/personal-work-contract";
let userId = "",
  pending = "";
async function main() {
  const database = new URL(process.env.DATABASE_URL || "");
  assert.equal(database.hostname, "127.0.0.1");
  assert.equal(database.pathname, "/personal_codex_test");
  assert.equal(process.env.BEN_REAL_PERSONAL_MIXED_EVAL, "1");
  const suffix = randomUUID();
  await prisma.permission.upsert({
    where: { code: "TASK_VIEW" },
    create: { code: "TASK_VIEW" },
    update: {},
  });
  const role = await prisma.role.create({
    data: {
      name: `mixed-real-${suffix}`,
      permissions: { connect: { code: "TASK_VIEW" } },
    },
  });
  const user = await prisma.user.create({
    data: {
      email: `mixed-real-${suffix}@example.invalid`,
      name: "Synthetic mixed-intent acceptance",
      roles: { connect: { id: role.id } },
    },
  });
  userId = user.id;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const tomorrow = new Date(today + "T00:00:00Z");
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const next = tomorrow.toISOString().slice(0, 10);
  const item = await createPersonalWorkItem(
    {
      title: "BCPA: Bảo trì website",
      categoryKey: "WORK",
      dueAt: today + "T13:30:00+07:00",
      scheduledEndAt: today + "T16:30:00+07:00",
    },
    await assistantActor(prisma, userId),
  );
  const original = await prisma.taskItem.findUniqueOrThrow({
    where: { id: item.id },
  });
  assert.ok(original.personalWorkNumber,"Apply the checked-in personal work numbering migration before real-model evaluation.");
  const before = await prisma.taskItem.count();
  const cases = JSON.parse(
    readFileSync("tests/fixtures/ben-personal-mixed-intents.json", "utf8"),
  ) as { text: string; expected: string }[];
  let conversationId: string | undefined, approvalRevision: number | undefined;
  for (const step of cases) {
    const text = step.text.replaceAll(
      "{{number}}",
      String(original.personalWorkNumber),
    );
    let row = await sendAssistant(userId, {
      id: conversationId,
      requestKey: randomUUID(),
      text,
      personalWorkApprovalRevision: approvalRevision,
    });
    conversationId = row.id;
    pending = row.id;
    for (
      let n = 0;
      n < 90 && ["QUEUED", "RUNNING"].includes(row.runStatus || "");
      n++
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      row = (await listAssistant(userId, row.id)).conversations[0];
    }
    assert.ok(
      ["NEEDS_INFO", "DRAFT"].includes(row.runStatus || ""),
      "Real worker must finish the turn",
    );
    if (
      step.expected === "mixed" ||
      (step.expected === "complete-or-clarify" && row.personalWorkDraft)
    ) {
      assert.ok(
        row.personalWorkDraft?.updates,
        "Clarification must preserve both operations",
      );
      assert.equal(row.personalWorkDraft.updates.plan.itemId, item.id);
      assert.equal(personalWorkDraftItems(row.personalWorkDraft).length, 1);
      const create = personalWorkDraftItems(row.personalWorkDraft)[0].plan;
      assert.equal(create.categoryKey, "WATCHSHOP");
      assert.equal(
        new Date(create.dueAt!).toISOString(),
        new Date(next + "T09:00:00+07:00").toISOString(),
      );
      if (step.expected === "mixed")
        assert.equal(
          new Date(
            row.personalWorkDraft.updates.plan.changes.dueAt!,
          ).toISOString(),
          new Date(next + "T13:30:00+07:00").toISOString(),
        );
      assert.equal(row.personalWorkUpdateDraft, undefined);
    } else if (step.expected === "update-only") {
      assert.ok(row.personalWorkUpdateDraft);
      assert.equal(row.personalWorkDraft, undefined);
    } else {
      assert.equal(
        row.personalWorkUpdateDraft,
        undefined,
        "No partial actionable update while the creation is unresolved",
      );
    }
    assert.equal(await prisma.taskItem.count(), before);
    const unchanged = await prisma.taskItem.findUniqueOrThrow({
      where: { id: item.id },
    });
    assert.equal(unchanged.dueAt!.toISOString(), original.dueAt!.toISOString());
    assert.equal(row.createdPersonalWork?.length || 0, 0);
    assert.equal(row.updatedPersonalWork?.length || 0, 0);
    approvalRevision = row.personalWorkDraft?.revision;
    pending = "";
    console.log(
      JSON.stringify({
        text: step.text,
        expected: step.expected,
        result: "PASS",
      }),
    );
  }
  console.log(
    "PASS real mixed personal intent acceptance: unhyphenated code, retained creation across clarification/acknowledgment, explicit removal, no partial business writes.",
  );
}
main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Real mixed evaluation failed",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    if (pending && userId)
      await cancelAssistant(userId, pending).catch(() => {});
    if (userId)
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
    await prisma.$disconnect();
  });
