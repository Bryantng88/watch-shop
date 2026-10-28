import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
const url = new URL(process.env.DATABASE_URL || "");
if (
  !["127.0.0.1", "localhost", "::1"].includes(url.hostname) ||
  !/(test|local)/i.test(url.pathname)
) {
  throw new Error("Category smoke requires a loopback local/test database");
}

async function main() {
  const { prisma } = await import("../src/server/db/client");
  const {
    savePersonalCategory,
    deletePersonalCategory,
    listPersonalCategories,
    resolvePersonalCategory,
  } = await import(
    "../src/domains/personal-work/server/personal-work-categories.service"
  );
  const { getPersonalWorkPageData, updatePersonalWorkItem } = await import(
    "../src/domains/personal-work/server/personal-work.service"
  );
  const id = randomUUID();
  const owner = await prisma.user.create({
    data: { email: `category-smoke-${id}@system.local` },
  });
  const other = await prisma.user.create({
    data: { email: `category-other-${id}@system.local` },
  });
  let taskId: string | undefined;
  let itemId: string | undefined;
  try {
    assert.equal((await listPersonalCategories(owner.id)).length, 7);
    await assert.rejects(
      deletePersonalCategory({ key: "GENERAL", replacementKey: "WORK" }, owner),
    );
    await assert.rejects(
      savePersonalCategory({ label: "Bad color", color: "red" }, owner),
    );
    await savePersonalCategory(
      { key: "GENERAL", label: "Cannot rename default", color: "#123456" },
      owner,
    );
    assert.equal((await listPersonalCategories(owner.id))[0].label, "Cá nhân");
    assert.equal((await listPersonalCategories(owner.id))[0].color, "#123456");
    assert.notEqual(
      (await listPersonalCategories(other.id))[0].color,
      "#123456",
    );
    await savePersonalCategory(
      { label: "Smoke study", color: "#00aa88" },
      owner,
    );
    const custom = (await listPersonalCategories(owner.id)).find(
      (c) => c.label === "Smoke study",
    )!;
    await assert.rejects(
      savePersonalCategory({ label: "smoke STUDY", color: "#00aa88" }, owner),
    );
    await assert.rejects(resolvePersonalCategory(other.id, custom.key));
    await assert.rejects(
      savePersonalCategory(
        { key: custom.key, label: "Stolen", color: "#112233" },
        other,
      ),
    );
    await assert.rejects(
      deletePersonalCategory(
        { key: custom.key, replacementKey: "GENERAL" },
        other,
      ),
    );
    const resolved = await resolvePersonalCategory(owner.id, custom.key);
    const task = await prisma.task.create({
      data: {
        title: "Category smoke",
        kind: "PERSONAL",
        createdByUserId: owner.id,
      },
    });
    taskId = task.id;
    const item = await prisma.taskItem.create({
      data: {
        taskId: task.id,
        title: "Smoke task",
        personalCategoryId: resolved.id,
        note: "Preserve this note",
        progressPercent: 50,
        estimatedDays: 3,
      },
    });
    itemId = item.id;
    assert.equal(
      (await getPersonalWorkPageData(owner)).items[0].category.key,
      custom.key,
    );
    await assert.rejects(
      updatePersonalWorkItem({ id: item.id, categoryKey: custom.key }, other),
    );
    await prisma.personalTaskShare.create({
      data: { taskItemId: item.id, userId: other.id, accessLevel: "VIEWER" },
    });
    await savePersonalCategory(
      { key: custom.key, label: "Smoke renamed", color: "#ffaa11" },
      owner,
    );
    assert.equal(
      (await getPersonalWorkPageData(owner)).items[0].category.color,
      "#ffaa11",
    );
    assert.equal(
      (await getPersonalWorkPageData(other)).items[0].category.color,
      "#ffaa11",
    );
    await assert.rejects(
      updatePersonalWorkItem({ id: item.id, categoryKey: "GENERAL" }, other),
    );
    await assert.rejects(
      deletePersonalCategory(
        { key: custom.key, replacementKey: "MISSING" },
        owner,
      ),
    );
    assert.equal(
      (await prisma.taskItem.findUniqueOrThrow({ where: { id: item.id } }))
        .personalCategoryId,
      resolved.id,
    );
    await savePersonalCategory(
      { label: "Smoke second", color: "#8844aa" },
      owner,
    );
    const second = (await listPersonalCategories(owner.id)).find(
      (c) => c.label === "Smoke second",
    )!;
    await deletePersonalCategory(
      { key: custom.key, replacementKey: second.key },
      owner,
    );
    assert.equal(
      (await getPersonalWorkPageData(owner)).items[0].category.key,
      second.key,
    );
    await deletePersonalCategory(
      { key: second.key, replacementKey: "MEDIA" },
      owner,
    );
    const page = await getPersonalWorkPageData(owner);
    assert.equal(page.items[0].category.key, "MEDIA");
    assert.equal(page.items[0].domain, "MEDIA");
    assert.equal(page.items[0].title, "Smoke task");
    assert.equal(page.items[0].note, "Preserve this note");
    assert.equal(page.items[0].progressPercent, 50);
    assert.equal(page.items[0].estimatedDays, 3);
    assert.equal(
      (await getPersonalWorkPageData(other)).items[0].category.key,
      "MEDIA",
    );
    assert.equal((await listPersonalCategories(owner.id)).length, 7);
    console.log(
      "PASS: category CRUD, persistent colors, protected defaults, tenant isolation, invalid replacement rollback, and task reassignment",
    );
  } finally {
    if (itemId)
      await prisma.appTagLink.deleteMany({ where: { targetId: itemId } });
    if (taskId) {
      await prisma.task.delete({ where: { id: taskId } });
      await prisma.appTag.deleteMany({ where: { ownerId: taskId } });
    }
    await prisma.user.deleteMany({
      where: { id: { in: [owner.id, other.id] } },
    });
    await prisma.$disconnect();
  }
}
main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Category smoke failed",
  );
  process.exitCode = 1;
});
