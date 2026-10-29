import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const database = new URL(process.env.DATABASE_URL || "");
if (!["localhost", "127.0.0.1", "[::1]"].includes(database.hostname) || !/(local|test)/i.test(database.pathname)) throw new Error("Standalone smoke requires a loopback test DB");

async function main() {
  const { prisma } = await import("../src/server/db/client");
  const work = await import("../src/domains/personal-work/server/personal-work.service");
  const categories = await import("../src/domains/personal-work/server/personal-work-categories.service");
  const { personalWorkScopeWhere } = await import("../src/domains/personal-work/server/personal-work-access");
  const { requireWorkspaceTaskItem } = await import("../src/domains/task/server/workspace-task-item");
  const { createTask } = await import("../src/domains/task/server/core/task.service");
  const { listTasksRepo } = await import("../src/domains/task/server/core/task-query.repo");
  const { listTaskRowsRepo } = await import("../src/domains/task/server/core/task-list.repo");
  const { countTaskViewsRepo, countTaskKindsRepo } = await import("../src/domains/task/server/core/task-count.repo");
  const users: string[] = [], items: string[] = [], tasks: string[] = [];
  const originalFetch = globalThis.fetch;
  const baseline = await prisma.taskItem.findMany({ where: personalWorkScopeWhere, orderBy: { id: "asc" } });
  const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  try {
    globalThis.fetch = async () => { throw new Error("No external requests permitted in standalone smoke"); };
    for (let i = 0; i < 3; i++) users.push((await prisma.user.create({ data: { email: `standalone-${randomUUID()}@system.local` } })).id);
    const [owner, editor, viewer] = users.map(id => ({ id }));
    for (const date of ["2026-10-29", "2026-11-02", "2027-01-01"]) {
      const item = await work.createPersonalWorkItem({ title: "Standalone smoke", domain: "WORK", workType: "MEETING", dueAt: `${date}T09:00:00+07:00`, scheduledEndAt: `${date}T10:00:00+07:00` }, owner);
      items.push(item.id);
      assert.equal(item.taskId, null);
      assert.equal(item.personalOwnerUserId, owner.id);
    }
    assert.equal(await prisma.task.count({ where: { createdByUserId: { in: users } } }), 0);
    await assert.rejects(createTask(prisma, { kind: "PERSONAL" }, owner));
    const id = items[0];
    await prisma.taskItem.update({ where: { id }, data: { assignedToUserId: viewer.id } });
    assert.equal((await work.getPersonalWorkPageData(viewer)).items.length, 0);
    await assert.rejects(work.updatePersonalWorkItem({ id, title: "Unauthorized" }, viewer));
    await assert.rejects(requireWorkspaceTaskItem(prisma, id));
    await work.replacePersonalWorkShares(id, [{ userId: editor.id, accessLevel: "EDITOR" }, { userId: viewer.id, accessLevel: "VIEWER" }], owner);
    assert.equal((await work.getPersonalWorkPageData(editor)).items[0].access, "EDITOR");
    assert.equal((await work.getPersonalWorkPageData(viewer)).items[0].access, "VIEWER");
    await assert.rejects(work.replacePersonalWorkShares(id, [], editor));
    await assert.rejects(work.updatePersonalWorkItem({ id, title: "Unauthorized" }, viewer));
    await work.updatePersonalWorkItem({ id, title: "Editor update", tags: ["fixture-tag"], categoryKey: "WORK" }, editor);
    assert.equal((await work.getPersonalWorkPageData(owner)).items.find(i => i.id === id)?.title, "Editor update");
    await work.updatePersonalWorkItem({ id, tags: ["updated-tag"] }, editor);
    await work.updatePersonalWorkItem({ id, workType: "PLANNING" }, editor);
    const retained = (await work.getPersonalWorkPageData(owner)).items.find(i => i.id === id)!;
    assert.equal(retained.domain, "WORK");
    assert.equal(retained.workType, "PLANNING");
    assert.deepEqual(retained.tags, ["updated-tag"]);
    await assert.rejects(work.updatePersonalWorkItem({ id, title: " " }, editor));
    await work.updatePersonalWorkItem({ id: items[2], status: "IN_PROGRESS" }, owner);
    const started = (await prisma.taskItem.findUniqueOrThrow({ where: { id: items[2] } })).startedAt;
    await work.updatePersonalWorkItem({ id: items[2], status: "IN_PROGRESS" }, owner);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: items[2] } })).startedAt?.toISOString(), started?.toISOString());
    await work.updatePersonalWorkItem({ id: items[2], status: "DONE" }, owner);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: items[2] } })).isDone, true);
    await work.updatePersonalWorkItem({ id: items[2], status: "TODO" }, owner);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: items[2] } })).isDone, false);
    const entry = await work.addPersonalWorkChecklistItem(id, "Take photo", editor);
    await assert.rejects(work.finalizePersonalWorkChecklist(id, owner));
    await work.setPersonalWorkChecklistItemDone(id, entry.id, true, editor);
    await work.finalizePersonalWorkChecklist(id, owner);
    await assert.rejects(work.addPersonalWorkChecklistItem(id, "Locked", owner));
    assert.equal((await work.getPersonalWorkPageData(owner)).items.find(i => i.id === id)?.progressPercent, 100);
    const watch = await prisma.watch.findFirst({ select: { id: true } });
    if (watch) {
      await work.updatePersonalWorkItem({ id: items[1], domain: "MEDIA", workType: "IMAGE_PROCESSING", targets: [{ type: "WATCH", id: watch.id, label: "ignored", secondary: null, href: "ignored" }] }, owner);
      const binding = await prisma.taskExecution.findFirstOrThrow({ where: { taskItemId: items[1] } });
      assert.equal(binding.taskId, null);
      assert.equal(binding.targetId, watch.id);
      await work.updatePersonalWorkItem({ id: items[1], domain: "MEDIA", targets: [] }, owner);
      assert.equal((await prisma.taskExecution.findUniqueOrThrow({ where: { id: binding.id } })).actionType, "CANCELLED");
    }
    await categories.savePersonalCategory({ label: "Fixture", color: "#123456" }, owner);
    const category = await prisma.personalWorkCategory.findFirstOrThrow({ where: { userId: owner.id, label: "Fixture" } });
    const custom = await work.createPersonalWorkItem({ title: "Custom fixture", categoryKey: category.key }, owner);
    items.push(custom.id);
    await categories.deletePersonalCategory({ key: category.key, replacementKey: "WORK" }, owner);
    assert.equal((await work.getPersonalWorkPageData(owner)).items.find(i => i.id === custom.id)?.category.key, "WORK");
    // Legacy creator/assignee ownership remains unchanged; item assignee is not an owner.
    const parent = await prisma.task.create({ data: { title: "Legacy fixture", kind: "PERSONAL", createdByUserId: owner.id, assignedToUserId: editor.id, periodType: "WEEKLY", periodKey: "2026-W44" } });
    tasks.push(parent.id);
    const legacy = await prisma.taskItem.create({ data: { title: "Legacy fixture", taskId: parent.id, assignedToUserId: viewer.id } });
    items.push(legacy.id);
    assert.equal((await work.assertPersonalWorkAccess(legacy.id, owner)).access, "OWNER");
    assert.equal((await work.assertPersonalWorkAccess(legacy.id, editor)).access, "OWNER");
    await assert.rejects(work.assertPersonalWorkAccess(legacy.id, viewer));
    await assert.rejects(requireWorkspaceTaskItem(prisma, legacy.id));
    assert.equal(await prisma.task.count({ where: { createdByUserId: { in: users } } }), 1);
    const beforeCounts = await countTaskViewsRepo(prisma, { userId: owner.id });
    const prefix = `task-scope-${randomUUID()}`;
    const free = await prisma.task.create({ data: { title: `${prefix}-mine`, kind: "FREE", createdByUserId: owner.id } });
    tasks.push(free.id);
    const privateTask = await prisma.task.create({ data: { title: `${prefix}-private`, kind: "FREE", createdByUserId: editor.id } });
    tasks.push(privateTask.id);
    const business = await prisma.task.create({ data: { title: `${prefix}-shared`, kind: "BUSINESS", createdByUserId: editor.id } });
    tasks.push(business.id);
    const workspace = await prisma.taskItem.create({ data: { title: "Business fixture", taskId: business.id } });
    items.push(workspace.id);
    assert.equal((await requireWorkspaceTaskItem(prisma, workspace.id)).taskId, business.id);
    const afterCounts = await countTaskViewsRepo(prisma, { userId: owner.id });
    assert.equal(afterCounts.all - beforeCounts.all, 2);
    assert.equal((await countTaskKindsRepo(prisma, { userId: owner.id })).kind_PERSONAL, 0);
    for (const list of [listTasksRepo, listTaskRowsRepo]) {
      const result = await list(prisma, { userId: owner.id, filters: { q: prefix } });
      assert.deepEqual(result.items.map(i => i.id).sort(), [free.id, business.id].sort());
    }
    console.log("PASS: independent work across weeks, no new parent tasks, owner isolation, editor/viewer permissions, checklist lock, watch links, custom-category reassignment, legacy co-owners and workspace endpoint isolation; no external requests");
  } finally {
    globalThis.fetch = originalFetch;
    // Exact fixture IDs only. Never delete a parent returned by a shared lookup.
    await prisma.taskExecution.deleteMany({ where: { taskItemId: { in: items } } });
    await prisma.appTagLink.deleteMany({ where: { targetType: "TASK_ITEM", targetId: { in: items } } });
    await prisma.taskItem.deleteMany({ where: { id: { in: items }, OR: [{ personalOwnerUserId: { in: users } }, { taskId: { in: tasks } }] } });
    await prisma.task.deleteMany({ where: { id: { in: tasks }, createdByUserId: { in: users }, taskItems: { none: {} } } });
    await prisma.appTag.deleteMany({ where: { ownerType: "GENERAL", ownerId: { in: users } } });
    await prisma.personalWorkCategory.deleteMany({ where: { userId: { in: users } } });
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    assert.equal(digest(await prisma.taskItem.findMany({ where: personalWorkScopeWhere, orderBy: { id: "asc" } })), digest(baseline), "Existing personal work changed during fixture smoke");
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Standalone smoke failed"); process.exitCode = 1; });
