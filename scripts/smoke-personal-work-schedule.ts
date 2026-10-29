import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const url = new URL(process.env.DATABASE_URL ?? "");
if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || !/(local|test|storefront)/i.test(url.pathname)) throw new Error("Schedule smoke requires a loopback test DB");

async function main() {
  const { prisma } = await import("../src/server/db/client");
  const { createPersonalWorkItem, updatePersonalWorkItem, getPersonalWorkPageData } = await import("../src/domains/personal-work/server/personal-work.service");
  const { syncPersonalTaskToGoogle, listPersonalGoogleCalendarEvents } = await import("../src/domains/personal-work/server/google-calendar.service");
  const { encryptCalendarToken } = await import("../src/domains/personal-work/server/google-calendar-crypto");
  const { buildPersonalCalendarEvents } = await import("../src/domains/personal-work/shared/personal-calendar");
  const originalFetch = globalThis.fetch;
  const users: string[] = [];
  const fixtureTasks: string[] = [];
  const fixtureItems: string[] = [];
  let taskId: string | undefined;
  let itemId: string | undefined;
  try {
    const owner = await prisma.user.create({ data: { email: `schedule-${randomUUID()}@system.local` } });
    users.push(owner.id);
    const viewer = await prisma.user.create({ data: { email: `schedule-viewer-${randomUUID()}@system.local` } });
    users.push(viewer.id);
    const created = await createPersonalWorkItem({ title: "Schedule smoke", categoryKey: "WORK", workType: "MEETING", dueAt: "2026-10-29T02:00:00Z", scheduledEndAt: "2026-10-29T03:00:00Z" }, owner);
    taskId = created.taskId;
    itemId = created.id;
    fixtureTasks.push(taskId);
    fixtureItems.push(itemId);
    assert.equal((await prisma.task.findUniqueOrThrow({ where: { id: taskId } })).createdByUserId, owner.id);
    const otherItem = await createPersonalWorkItem({ title: "Schedule owner isolation", categoryKey: "WORK", workType: "MEETING" }, viewer);
    fixtureTasks.push(otherItem.taskId);
    fixtureItems.push(otherItem.id);
    assert.notEqual(otherItem.taskId, taskId);
    assert.equal((await getPersonalWorkPageData(owner)).items.length, 1);
    assert.equal(created.scheduledEndAt?.toISOString(), "2026-10-29T03:00:00.000Z");
    assert.equal(created.workTypeId, "MEETING");
    await updatePersonalWorkItem({ id: itemId, categoryKey: "WORK", workType: "PLANNING", dueAt: "2026-10-29T04:30:00Z", scheduledEndAt: "2026-10-29T05:00:00Z" }, owner);
    const reopened = (await getPersonalWorkPageData(owner)).items[0];
    assert.equal(reopened.workType, "PLANNING");
    assert.equal(reopened.scheduledEndAt, "2026-10-29T05:00:00.000Z");
    await updatePersonalWorkItem({ id: itemId, title: "Schedule renamed" }, owner);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: itemId } })).scheduledEndAt?.toISOString(), reopened.scheduledEndAt);
    await assert.rejects(updatePersonalWorkItem({ id: itemId, scheduledEndAt: "2026-10-29T01:00:00Z" }, owner));
    await prisma.personalTaskShare.create({ data: { taskItemId: itemId, userId: viewer.id, accessLevel: "VIEWER" } });
    await assert.rejects(updatePersonalWorkItem({ id: itemId, scheduledEndAt: "2026-10-29T06:00:00Z" }, viewer));
    await prisma.googleCalendarConnection.create({ data: { userId: owner.id, accessTokenCipher: encryptCalendarToken(randomUUID()), tokenExpiresAt: new Date(Date.now() + 3600000) } });
    let googleEvent: object = { id: "schedule-event", start: { dateTime: "2026-10-30T08:15:00+07:00" }, end: { dateTime: "2026-10-30T09:45:00+07:00" } };
    globalThis.fetch = async (input, init) => {
      assert.equal(new URL(String(input)).hostname, "www.googleapis.com");
      if (init?.method === "POST" || init?.method === "PUT") {
        const payload = JSON.parse(String(init.body));
        assert.equal(payload.start.dateTime, "2026-10-29T04:30:00.000Z");
        assert.equal(payload.end.dateTime, "2026-10-29T05:00:00.000Z");
        assert.equal(payload.start.timeZone, "Asia/Bangkok");
        assert.equal(payload.start.date, undefined);
        return Response.json({ id: "schedule-event" });
      }
      return Response.json({ items: [googleEvent] });
    };
    await syncPersonalTaskToGoogle(owner.id, itemId);
    await listPersonalGoogleCalendarEvents(owner.id);
    const timed = await prisma.taskItem.findUniqueOrThrow({ where: { id: itemId } });
    assert.equal(timed.dueAt?.toISOString(), "2026-10-30T01:15:00.000Z");
    assert.equal(timed.scheduledEndAt?.toISOString(), "2026-10-30T02:45:00.000Z");
    const event = buildPersonalCalendarEvents((await getPersonalWorkPageData(owner)).items, [])[0];
    assert.equal(event.allDay, false);
    assert.equal(event.endAt, timed.scheduledEndAt?.toISOString());
    await listPersonalGoogleCalendarEvents(owner.id);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: itemId } })).updatedAt.toISOString(), timed.updatedAt.toISOString());
    googleEvent = { id: "schedule-event", start: { date: "2026-10-31" }, end: { date: "2026-11-02" } };
    await listPersonalGoogleCalendarEvents(owner.id);
    const allDay = await prisma.taskItem.findUniqueOrThrow({ where: { id: itemId } });
    assert.equal(allDay.scheduledEndAt, null);
    assert.equal(allDay.estimatedDays, 2);
    console.log("PASS: timed create/reopen/edit, work subtype persistence, invalid range and viewer protection, Google timed payload/import, unchanged-row no-op and all-day conversion; Google fully mocked");
  } finally {
    globalThis.fetch = originalFetch;
    await prisma.appTagLink.deleteMany({ where: { targetId: { in: fixtureItems } } });
    await prisma.taskItem.deleteMany({ where: { id: { in: fixtureItems }, assignedToUserId: { in: users } } });
    const emptyFixtureTasks = await prisma.task.findMany({ where: { id: { in: fixtureTasks }, createdByUserId: { in: users }, taskItems: { none: {} } }, select: { id: true } });
    const safeTaskIds = emptyFixtureTasks.map(task => task.id);
    await prisma.task.deleteMany({ where: { id: { in: safeTaskIds }, createdByUserId: { in: users }, taskItems: { none: {} } } });
    await prisma.appTag.deleteMany({ where: { ownerId: { in: safeTaskIds } } });
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Schedule smoke failed"); process.exitCode = 1; });
