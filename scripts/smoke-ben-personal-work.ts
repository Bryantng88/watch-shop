import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma as p } from "../src/server/db/client";
import {
  sendAssistant,
  assistantWorker,
  approveAssistantPersonalWork,
  listAssistant,
} from "../src/domains/ai-assistant/server/service";
import {
  createPersonalWorkItem,
  updatePersonalWorkItem,
  addPersonalWorkChecklistItem,
  finalizePersonalWorkChecklist,
} from "../src/domains/personal-work/server/personal-work.service";
import type { PersonalWorkPlan } from "../src/domains/ai-assistant/personal-work-contract";
async function main() {
  const db = new URL(process.env.DATABASE_URL || "");
  assert.equal(db.hostname, "127.0.0.1");
  assert.equal(db.pathname, "/personal_codex_test");
  assert.equal(
    await p.customerAssistantConversation.count({
      where: { status: { in: ["QUEUED", "RUNNING"] } },
    }),
    0,
    "Use an idle synthetic DB",
  );
  await p.permission.upsert({
    where: { code: "TASK_VIEW" },
    create: { code: "TASK_VIEW" },
    update: {},
  });
  const suffix = randomUUID(),
    role = await p.role.create({
      data: { name: "personal-ben-" + suffix, permissions: { connect: { code: "TASK_VIEW" } } },
    });
  const owner = await p.user.create({
    data: {
      email: `personal-${suffix}@example.invalid`,
      name: "Personal Owner",
      roles: { connect: { id: role.id } },
    },
  });
  const other = await p.user.create({
    data: {
      email: `personal-other-${suffix}@example.invalid`,
      name: "Share Recipient " + suffix,
      roles: { connect: { id: role.id } },
    },
  });
  try {
    const category = await p.personalWorkCategory.create({
      data: { userId: owner.id, key: "events-" + suffix, label: "Lịch cá nhân", color: "#334455" },
    });
    await assert.rejects(
      createPersonalWorkItem({ title: "Missing date", workType: "EVENT" }, owner),
      /cần ngày/,
    );
    const event = await createPersonalWorkItem(
      {
        title: "Synthetic appointment",
        workType: "EVENT",
        categoryKey: category.key,
        dueAt: "2026-11-10T08:00:00+07:00",
      },
      owner,
    );
    assert.equal(event.workTypeId, "EVENT");
    assert.equal(event.personalCategoryId, category.id);
    assert.equal(event.completedAt, null);
    for (const input of [
      { status: "DONE" },
      { status: "IN_PROGRESS" },
      { progressPercent: 100 },
      { progressMode: "CHECKLIST" },
      { dueAt: null },
      { workType: "REMINDER" },
    ])
      await assert.rejects(
        updatePersonalWorkItem(
          { id: event.id, ...input } as Parameters<typeof updatePersonalWorkItem>[0],
          owner,
        ),
      );
    await assert.rejects(
      addPersonalWorkChecklistItem(event.id, "Not an event action", owner),
      /Sự kiện/,
    );
    await assert.rejects(finalizePersonalWorkChecklist(event.id, owner), /Sự kiện/);
    await updatePersonalWorkItem(
      { id: event.id, title: "Edited appointment", categoryKey: "WORK", workType: "EVENT" },
      owner,
    );
    assert.equal(
      (await p.taskItem.findUniqueOrThrow({ where: { id: event.id } })).workTypeId,
      "EVENT",
    );
    const plan: PersonalWorkPlan = {
      kind: "TASK",
      title: "Mang đồng hồ Tissot đưa cho Nam",
      note: "Việc cá nhân, chưa phát sinh đơn hàng.",
      categoryKey: "GENERAL",
      workType: null,
      dueAt: "2026-11-10T08:00:00+07:00",
      scheduledEndAt: "2026-11-10T09:00:00+07:00",
      tags: ["giao-nhan"],
      shares: [{ userId: other.id, accessLevel: "VIEWER" }],
      priority: "HIGH",
      checklist: ["Mang đồng hồ", "Giao cho Nam"],
      syncGoogle: false,
    };
    const chat = await sendAssistant(owner.id, {
      requestKey: randomUUID(),
      text: "Mai 8-9h mang đồng hồ Tissot đưa cho Nam, chia sẻ chỉ xem với người đã chọn.",
    });
    const run = (
      (await assistantWorker("claim", {})) as { run: { id: string; leaseToken: string } }
    ).run;
    assert.equal(run.id, chat.id);
    await assert.rejects(
      assistantWorker("finish", { ...run, reply: "Review", personalWorkPlan: plan }),
    );
    await assistantWorker("lookup", { ...run, lookup: { tool: "personalWork.categories" } });
    await assistantWorker("lookup", {
      ...run,
      lookup: { tool: "personalWork.people", query: other.id },
    });
    const before = {
      items: await p.taskItem.count(),
      orders: await p.order.count(),
      issues: await p.technicalIssue.count(),
    };
    await assistantWorker("finish", { ...run, reply: "Review", personalWorkPlan: plan });
    assert.equal(await p.taskItem.count(), before.items);
    const review = (await listAssistant(owner.id, chat.id)).conversations[0];
    assert.equal(review.personalWorkDraft!.plan.title, plan.title);
    const created = await Promise.all([
      approveAssistantPersonalWork(owner.id, chat.id, review.revision!),
      approveAssistantPersonalWork(owner.id, chat.id, review.revision!),
    ]);
    assert.equal(await p.taskItem.count(), before.items + 1);
    const receipt = created[0].createdPersonalWork![0];
    assert.equal(created[1].createdPersonalWork![0].id, receipt.id);
    const item = await p.taskItem.findUniqueOrThrow({ where: { id: receipt.id } });
    assert.equal(item.personalOwnerUserId, owner.id);
    assert.equal(item.assignedToUserId, owner.id);
    assert.equal(item.dueAt!.toISOString(), "2026-11-10T01:00:00.000Z");
    assert.equal(item.scheduledEndAt!.toISOString(), "2026-11-10T02:00:00.000Z");
    assert.equal(item.progressMode, "CHECKLIST");
    assert.equal(await p.taskItemChecklist.count({ where: { taskItemId: item.id } }), 2);
    assert.equal(
      await p.personalTaskShare.count({
        where: { taskItemId: item.id, userId: other.id, accessLevel: "VIEWER" },
      }),
      1,
    );
    await assert.rejects(approveAssistantPersonalWork(other.id, chat.id, review.revision!));
    assert.equal(await p.order.count(), before.orders);
    assert.equal(await p.technicalIssue.count(), before.issues);
    // Google is deliberately unconfigured: task creation must survive a sync error and replay.
    await p.googleCalendarConnection.create({
      data: { userId: owner.id, accessTokenCipher: "synthetic-unusable-cipher" },
    });
    await sendAssistant(owner.id, {
      id: chat.id,
      requestKey: randomUUID(),
      text: "Tạo sự kiện họp lúc 10h, đồng bộ Google.",
    });
    const eventRun = (
      (await assistantWorker("claim", {})) as { run: { id: string; leaseToken: string } }
    ).run;
    await assistantWorker("lookup", { ...eventRun, lookup: { tool: "personalWork.categories" } });
    const eventPlan = {
      ...plan,
      kind: "EVENT" as const,
      title: "Synthetic meeting",
      dueAt: "2026-11-10T10:00:00+07:00",
      scheduledEndAt: null,
      shares: [],
      checklist: [],
      tags: [],
      syncGoogle: true,
    };
    await assistantWorker("finish", {
      ...eventRun,
      reply: "Event review",
      personalWorkPlan: eventPlan,
    });
    const eventReview = (await listAssistant(owner.id, chat.id)).conversations[0];
    const approved = await approveAssistantPersonalWork(owner.id, chat.id, eventReview.revision!);
    const last = approved.createdPersonalWork!.at(-1)!;
    assert.equal(last.kind, "EVENT");
    assert.equal(last.calendar, "FAILED");
    assert.equal(
      (await p.taskItem.findUniqueOrThrow({ where: { id: last.id } })).workTypeId,
      "EVENT",
    );
    const after = await p.taskItem.count();
    await approveAssistantPersonalWork(owner.id, chat.id, eventReview.revision!);
    assert.equal(await p.taskItem.count(), after);
    await sendAssistant(owner.id, {
      id: chat.id,
      requestKey: randomUUID(),
      text: "Chuẩn bị thêm một việc để kiểm tra thu hồi quyền.",
    });
    const revokeRun = (
      (await assistantWorker("claim", {})) as { run: { id: string; leaseToken: string } }
    ).run;
    await assistantWorker("lookup", { ...revokeRun, lookup: { tool: "personalWork.categories" } });
    await assistantWorker("finish", {
      ...revokeRun,
      reply: "Review",
      personalWorkPlan: { ...plan, shares: [] },
    });
    const revokedRevision = (await listAssistant(owner.id, chat.id)).conversations[0].revision!;
    await p.role.update({ where: { id: role.id }, data: { permissions: { set: [] } } });
    await assert.rejects(approveAssistantPersonalWork(owner.id, chat.id, revokedRevision));
    const hidden = (await listAssistant(owner.id, chat.id)).conversations[0];
    assert.equal(hidden.personalWorkDraft, undefined);
    assert.deepEqual(hidden.createdPersonalWork, []);
    console.log(
      "PASS personal events/Ben: no completion/checklist, custom groups, fresh directory evidence, no writes before approval, concurrent idempotency, owner/share/date/checklist fields, cross-owner denial, Google failure preserves creation, revocation, no orders/issues. Model and Google not exercised.",
    );
  } finally {
    await p.user.updateMany({
      where: { id: { in: [owner.id, other.id] } },
      data: { isActive: false },
    });
  }
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
