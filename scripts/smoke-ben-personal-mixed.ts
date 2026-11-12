import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { prisma } from "../src/server/db/client";
import { assistantActor } from "../src/domains/ai-assistant/server/access";
import {
  sendAssistant,
  assistantWorker,
  listAssistant,
  cancelAssistant,
  approveAssistantPersonalWork,
} from "../src/domains/ai-assistant/server/service";
import { createPersonalWorkItem } from "../src/domains/personal-work/server/personal-work.service";
import { encryptCalendarToken } from "../src/domains/personal-work/server/google-calendar-crypto";
import type { PersonalWorkPlan } from "../src/domains/ai-assistant/personal-work-contract";

async function main() {
  const db = new URL(process.env.DATABASE_URL || "");
  assert.equal(db.hostname, "127.0.0.1");
  assert.equal(db.pathname, "/personal_codex_test");
  assert.equal(
    await prisma.customerAssistantConversation.count({
      where: { status: { in: ["QUEUED", "RUNNING"] } },
    }),
    0,
  );
  // db push creates columns but not migration-owned SQL triggers. Install the
  // checked-in numbering trigger in this isolated fixture, preserving production logic.
  const numbering = readFileSync(
    "prisma/migrations/20261111180000_personal_work_number/migration.sql",
    "utf8",
  );
  await prisma.$executeRawUnsafe(
    'CREATE SEQUENCE IF NOT EXISTS "personal_work_number_seq" AS INTEGER',
  );
  await prisma.$queryRawUnsafe(
    `SELECT setval('"personal_work_number_seq"', GREATEST(COALESCE(MAX("personalWorkNumber"), 0), 24), true) FROM "TaskItem"`,
  );
  await prisma.$executeRawUnsafe(
    numbering
      .slice(
        numbering.indexOf("CREATE FUNCTION"),
        numbering.indexOf("CREATE TRIGGER"),
      )
      .trim()
      .replace("CREATE FUNCTION", "CREATE OR REPLACE FUNCTION"),
  );
  const triggers = await prisma.$queryRaw<
    { exists: boolean }[]
  >`SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='assign_personal_work_number') AS "exists"`;
  if (!triggers[0].exists)
    await prisma.$executeRawUnsafe(
      numbering
        .slice(
          numbering.indexOf("CREATE TRIGGER"),
          numbering.indexOf("COMMIT;"),
        )
        .trim(),
    );
  const suffix = randomUUID();
  await prisma.permission.upsert({
    where: { code: "TASK_VIEW" },
    create: { code: "TASK_VIEW" },
    update: {},
  });
  const role = await prisma.role.create({
    data: {
      name: `mixed-${suffix}`,
      permissions: { connect: { code: "TASK_VIEW" } },
    },
  });
  const users = await Promise.all(
    ["owner", "other"].map((name) =>
      prisma.user.create({
        data: {
          email: `mixed-${name}-${suffix}@example.invalid`,
          name: `Synthetic ${name}`,
          roles: { connect: { id: role.id } },
        },
      }),
    ),
  );
  const [owner, other] = users,
    actor = await assistantActor(prisma, owner.id),
    otherActor = await assistantActor(prisma, other.id);
  const oldFetch = globalThis.fetch;
  let googleCalls = 0,
    failGoogle = false;
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.origin, "https://www.googleapis.com");
    googleCalls++;
    if (failGoogle) return new Response(null, { status: 503 });
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    return Response.json({
      ...body,
      id: body.id || "synthetic-mixed-event",
      htmlLink: "https://calendar.google.com/calendar/event?eid=synthetic",
    });
  };
  await prisma.googleCalendarConnection.create({
    data: {
      userId: owner.id,
      calendarId: `fixture-mixed-${owner.id}`,
      accessTokenCipher: encryptCalendarToken("synthetic-not-a-real-token"),
      tokenExpiresAt: new Date(Date.now() + 3600000),
    },
  });
  const baseline = {
    orders: await prisma.order.count(),
    issues: await prisma.technicalIssue.count(),
  };
  const makeExisting = async (asOther = false) => {
    const created = await createPersonalWorkItem(
      {
        title: "BCPA: Bảo trì website",
        categoryKey: "WORK",
        dueAt: "2026-11-12T13:30:00+07:00",
        scheduledEndAt: "2026-11-12T16:30:00+07:00",
      },
      asOther ? otherActor : actor,
    );
    return prisma.taskItem.findUniqueOrThrow({ where: { id: created.id } });
  };
  const newPlan: PersonalWorkPlan = {
    kind: "TASK",
    title: "Thêm trang quản lý khách hàng + vendor",
    note: null,
    categoryKey: "WATCHSHOP",
    workType: null,
    dueAt: "2026-11-13T09:00:00+07:00",
    scheduledEndAt: null,
    tags: [],
    shares: [],
    priority: "MEDIUM",
    checklist: [],
    syncGoogle: false,
  };
  const prepare = async (
    targets: Awaited<ReturnType<typeof makeExisting>>[],
    creates: PersonalWorkPlan[] = [newPlan],
  ) => {
    const chat = await sendAssistant(owner.id, {
      requestKey: randomUUID(),
      text: `Dời CV${targets[0].personalWorkNumber} sang mai 13:30-16:30; thêm việc mới nhóm WatchShop sáng mai 9h. Synthetic mixed fixture.`,
    });
    const { run } = (await assistantWorker("claim", {})) as {
      run: { id: string; leaseToken: string };
    };
    assert.equal(run.id, chat.id);
    await assistantWorker("lookup", {
      ...run,
      lookup: { tool: "personalWork.categories" },
    });
    const updates = [];
    for (const target of targets) {
      const search = (await assistantWorker("lookup", {
        ...run,
        lookup: {
          tool: "personalWork.search",
          query: `CV${target.personalWorkNumber}`,
        },
      })) as unknown as {
        evidence: { result: { matches: { id: string; code: string }[] } };
      };
      assert.equal(
        search.evidence.result.matches[0].id,
        target.id,
        "No hyphen must still resolve the numbered task",
      );
      const detail = (await assistantWorker("lookup", {
        ...run,
        lookup: { tool: "personalWork.detail", query: target.id },
      })) as unknown as {
        evidence: { result: { item: { updatedAt: string } } };
      };
      updates.push({
        itemId: target.id,
        expectedUpdatedAt: detail.evidence.result.item.updatedAt,
        fields: ["dueAt", "scheduledEndAt"],
        changes: {
          title: null,
          note: null,
          status: null,
          dueAt: "2026-11-13T13:30:00+07:00",
          scheduledEndAt: "2026-11-13T16:30:00+07:00",
        },
      });
    }
    const before = await prisma.taskItem.count();
    try {
      await assistantWorker("finish", {
        ...run,
        reply: "Đã tạo công việc mới (synthetic untrusted model claim)",
        personalWorkUpdatePlan: updates.length === 1 ? updates[0] : updates,
        ...(creates.length === 1
          ? { personalWorkPlan: creates[0] }
          : { personalWorkPlans: creates }),
      });
    } catch (error) {
      await cancelAssistant(owner.id, chat.id);
      throw error;
    }
    assert.equal(
      await prisma.taskItem.count(),
      before,
      "Draft generation must create nothing",
    );
    const review = (await listAssistant(owner.id, chat.id)).conversations[0];
    assert.ok(review.personalWorkDraft?.updates);
    assert.equal(review.personalWorkUpdateDraft, undefined);
    assert.ok(
      !review.messages.at(-1)!.text.startsWith("Đã tạo"),
      "Server must describe a review, not trust model claims of writes",
    );
    return review;
  };
  const approve = (review: Awaited<ReturnType<typeof prepare>>) =>
    approveAssistantPersonalWork(
      owner.id,
      review.id,
      review.revision!,
      () => {},
      true,
    );
  const checkUnchanged = async (
    target: Awaited<ReturnType<typeof makeExisting>>,
  ) => {
    const current = await prisma.taskItem.findUniqueOrThrow({
      where: { id: target.id },
    });
    assert.equal(current.dueAt?.toISOString(), target.dueAt?.toISOString());
    assert.equal(
      current.scheduledEndAt?.toISOString(),
      target.scheduledEndAt?.toISOString(),
    );
  };
  try {
    const target = await makeExisting(),
      before = await prisma.taskItem.count(),
      review = await prepare([target]);
    await checkUnchanged(target);
    assert.equal(googleCalls, 0);
    // Chat acknowledgment must not execute just the creation side of a mixed draft.
    await assert.rejects(
      sendAssistant(owner.id, {
        id: review.id,
        requestKey: randomUUID(),
        text: "ok",
        personalWorkApprovalRevision: review.revision,
      }),
      /Bản đề xuất/,
    );
    assert.equal(await prisma.taskItem.count(), before);
    await checkUnchanged(target);
    assert.equal(googleCalls, 0);
    await assert.rejects(
      approveAssistantPersonalWork(
        other.id,
        review.id,
        review.revision!,
        () => {},
      ),
    );
    await assert.rejects(
      approveAssistantPersonalWork(
        owner.id,
        review.id,
        review.revision!,
        () => {},
      ),
      /duyệt đầy đủ/,
    );
    assert.equal(await prisma.taskItem.count(), before);
    await checkUnchanged(target);
    const clicks = await Promise.allSettled([approve(review), approve(review)]);
    for (const click of clicks)
      assert.equal(
        click.status,
        "fulfilled",
        click.status === "rejected" ? String(click.reason) : "",
      );
    await approve(review);
    const done = (await listAssistant(owner.id, review.id)).conversations[0];
    assert.equal(done.createdPersonalWork?.length, 1);
    assert.equal(done.updatedPersonalWork?.length, 1);
    assert.equal(await prisma.taskItem.count(), before + 1);
    assert.equal(googleCalls, 1, "Only the single new item syncs once");
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: target.id } })
      ).dueAt!.toISOString(),
      "2026-11-13T06:30:00.000Z",
    );
    const created = await prisma.taskItem.findUniqueOrThrow({
      where: { id: done.createdPersonalWork![0].id },
    });
    assert.equal(created.title, newPlan.title);
    assert.equal(created.dueAt!.toISOString(), "2026-11-13T02:00:00.000Z");
    assert.notEqual(created.personalWorkNumber, target.personalWorkNumber);
    assert.ok(
      done.messages.at(-1)!.text.includes(`CV-${target.personalWorkNumber}`) &&
        done.messages.at(-1)!.text.includes(`CV-${created.personalWorkNumber}`),
    );
    const afterReplayDate = new Date("2026-11-14T07:00:00Z");
    await prisma.taskItem.update({
      where: { id: target.id },
      data: { dueAt: afterReplayDate, scheduledEndAt: null },
    });
    await approve(review);
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: target.id } })
      ).dueAt!.toISOString(),
      afterReplayDate.toISOString(),
    );
    const multiTargets = [await makeExisting(), await makeExisting()],
      multiBefore = await prisma.taskItem.count(),
      multi = await prepare(multiTargets, [
        newPlan,
        { ...newPlan, title: "Second independent new task" },
      ]);
    await approve(multi);
    const multiDone = (await listAssistant(owner.id, multi.id))
      .conversations[0];
    assert.equal(multiDone.createdPersonalWork?.length, 2);
    assert.equal(multiDone.updatedPersonalWork?.length, 2);
    assert.equal(await prisma.taskItem.count(), multiBefore + 2);
    const stale = await makeExisting(),
      staleReview = await prepare([stale]),
      staleBefore = await prisma.taskItem.count();
    await prisma.taskItem.update({
      where: { id: stale.id },
      data: { title: "Changed outside Ben" },
    });
    await assert.rejects(approve(staleReview));
    assert.equal(await prisma.taskItem.count(), staleBefore);
    await checkUnchanged(stale);
    const revokedShare = await makeExisting(true);
    await prisma.personalTaskShare.create({
      data: {
        taskItemId: revokedShare.id,
        userId: owner.id,
        accessLevel: "EDITOR",
        sharedByUserId: other.id,
      },
    });
    const shareReview = await prepare([revokedShare]),
      shareBefore = await prisma.taskItem.count();
    await prisma.personalTaskShare.updateMany({
      where: { taskItemId: revokedShare.id, userId: owner.id },
      data: { accessLevel: "VIEWER" },
    });
    await assert.rejects(approve(shareReview));
    assert.equal(await prisma.taskItem.count(), shareBefore);
    await checkUnchanged(revokedShare);
    assert.equal(
      (await listAssistant(owner.id, shareReview.id)).conversations[0]
        .personalWorkDraft,
      undefined,
    );
    const superseded = await makeExisting(),
      oldReview = await prepare([superseded]),
      oldBefore = await prisma.taskItem.count();
    await sendAssistant(owner.id, {
      id: oldReview.id,
      requestKey: randomUUID(),
      text: "Hủy toàn bộ bản đề xuất",
    });
    await assert.rejects(approve(oldReview));
    await cancelAssistant(owner.id, oldReview.id);
    assert.equal(await prisma.taskItem.count(), oldBefore);
    await checkUnchanged(superseded);
    const invalid = await makeExisting(),
      invalidBefore = await prisma.taskItem.count();
    await assert.rejects(
      prepare([invalid], [{ ...newPlan, categoryKey: "MISSING" }]),
    );
    assert.equal(await prisma.taskItem.count(), invalidBefore);
    await checkUnchanged(invalid);
    await assert.rejects(
      prepare(
        [invalid],
        Array.from({ length: 8 }, (_, i) => ({
          ...newPlan,
          title: `Too many ${i}`,
        })),
      ),
    );
    await checkUnchanged(invalid);
    // A failure creating the new task must also roll back the preceding update,
    // its activity/notifications, and both sets of durable receipts.
    const rollback = await makeExisting(),
      rollbackReview = await prepare(
        [rollback],
        [{ ...newPlan, title: "Mixed rollback fixture" }],
      ),
      rollbackBefore = await prisma.taskItem.count(),
      activityBefore = await prisma.taskItemActivity.count({
        where: { taskItemId: rollback.id },
      });
    await prisma.$executeRawUnsafe(
      `CREATE FUNCTION ben_mixed_fixture_reject() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."title" = 'Mixed rollback fixture' THEN RAISE EXCEPTION 'synthetic mixed create failure'; END IF; RETURN NEW; END $$`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE TRIGGER ben_mixed_fixture_reject BEFORE INSERT ON "TaskItem" FOR EACH ROW EXECUTE FUNCTION ben_mixed_fixture_reject()`,
    );
    try {
      await assert.rejects(approve(rollbackReview));
      assert.equal(await prisma.taskItem.count(), rollbackBefore);
      await checkUnchanged(rollback);
      assert.equal(
        await prisma.taskItemActivity.count({
          where: { taskItemId: rollback.id },
        }),
        activityBefore,
      );
      const rolled = (await listAssistant(owner.id, rollbackReview.id))
        .conversations[0];
      assert.equal(rolled.createdPersonalWork?.length || 0, 0);
      assert.equal(rolled.updatedPersonalWork?.length || 0, 0);
    } finally {
      await prisma.$executeRawUnsafe(
        `DROP TRIGGER ben_mixed_fixture_reject ON "TaskItem"`,
      );
      await prisma.$executeRawUnsafe(
        `DROP FUNCTION ben_mixed_fixture_reject()`,
      );
    }
    const googleFailure = await makeExisting(),
      googleReview = await prepare([googleFailure]);
    failGoogle = true;
    await approve(googleReview);
    const failedSync = (await listAssistant(owner.id, googleReview.id))
      .conversations[0];
    assert.equal(failedSync.createdPersonalWork?.length, 1);
    assert.equal(failedSync.updatedPersonalWork?.length, 1);
    assert.equal(failedSync.createdPersonalWork![0].calendar, "FAILED");
    const calls = googleCalls;
    await approve(googleReview);
    assert.equal(googleCalls, calls);
    failGoogle = false;
    const denied = await makeExisting(),
      deniedReview = await prepare([denied]),
      deniedBefore = await prisma.taskItem.count();
    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { set: [] } },
    });
    await assert.rejects(approve(deniedReview));
    assert.equal(await prisma.taskItem.count(), deniedBefore);
    await checkUnchanged(denied);
    assert.equal(
      (await listAssistant(owner.id, deniedReview.id)).conversations[0]
        .personalWorkDraft,
      undefined,
    );
    assert.equal(await prisma.order.count(), baseline.orders);
    assert.equal(await prisma.technicalIssue.count(), baseline.issues);
    console.log(
      "PASS mixed personal work integration: code variants, complete two-sided review, no partial/chat writes, atomic update+create and both receipts, concurrent/replayed approval, multiple operations, current permissions/edit scope/version/revision, whole-transaction rollback, connected-only post-commit Google sync/failure. Model/Google are synthetic.",
    );
  } finally {
    globalThis.fetch = oldFetch;
    await prisma.user.updateMany({
      where: { id: { in: users.map((u) => u.id) } },
      data: { isActive: false },
    });
  }
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
