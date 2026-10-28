import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
const url = new URL(process.env.DATABASE_URL || "");
if (
  !["localhost", "127.0.0.1", "::1"].includes(url.hostname) ||
  !/(test|local)/i.test(url.pathname)
)
  throw new Error("Calendar smoke requires a loopback local/test DB");
async function main() {
  const { prisma } = await import("../src/server/db/client");
  const { encryptCalendarToken } = await import(
    "../src/domains/personal-work/server/google-calendar-crypto"
  );
  const { listPersonalGoogleCalendarEvents } = await import(
    "../src/domains/personal-work/server/google-calendar.service"
  );
  const { getPersonalWorkPageData } = await import(
    "../src/domains/personal-work/server/personal-work.service"
  );
  const originalFetch = globalThis.fetch;
  const users: string[] = [];
  let taskId: string | undefined;
  try {
    const owner = await prisma.user.create({
      data: { email: `calendar-smoke-${randomUUID()}@system.local` },
    });
    users.push(owner.id);
    const viewer = await prisma.user.create({
      data: { email: `calendar-smoke-${randomUUID()}@system.local` },
    });
    users.push(viewer.id);
    const task = await prisma.task.create({
      data: {
        title: "Calendar smoke",
        kind: "PERSONAL",
        createdByUserId: owner.id,
      },
    });
    taskId = task.id;
    const item = await prisma.taskItem.create({
      data: {
        taskId: task.id,
        title: "Calendar smoke task",
        dueAt: new Date("2026-10-20T17:00:00Z"),
        estimatedDays: 2,
      },
    });
    const connection = await prisma.googleCalendarConnection.create({
      data: {
        userId: owner.id,
        accessTokenCipher: encryptCalendarToken(randomUUID()),
        tokenExpiresAt: new Date(Date.now() + 3600000),
      },
    });
    await prisma.personalTaskCalendarLink.create({
      data: {
        userId: owner.id,
        taskItemId: item.id,
        connectionId: connection.id,
        eventId: "smoke-event",
      },
    });
    globalThis.fetch = async () => {
      throw new Error("Page loading must not contact Google");
    };
    assert.equal((await getPersonalWorkPageData(owner)).items[0].id, item.id);
    const googleEvent = {
      id: "smoke-event",
      summary: "Google smoke",
      start: { date: "2026-10-22" },
      end: { date: "2026-10-25" },
    };
    const reply = () => Response.json({ items: [googleEvent] });
    globalThis.fetch = async (input) => {
      assert.equal(new URL(String(input)).hostname, "www.googleapis.com");
      return reply();
    };
    await listPersonalGoogleCalendarEvents(owner.id);
    const imported = await prisma.taskItem.findUniqueOrThrow({
      where: { id: item.id },
    });
    assert.equal(imported.dueAt?.toISOString(), "2026-10-21T17:00:00.000Z");
    assert.equal(imported.estimatedDays, 3);
    await listPersonalGoogleCalendarEvents(owner.id);
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: item.id } })
      ).updatedAt.toISOString(),
      imported.updatedAt.toISOString(),
    );
    let release!: () => void;
    let started!: () => void;
    const held = new Promise<void>((r) => (release = r)),
      fetched = new Promise<void>((r) => (started = r));
    globalThis.fetch = async () => {
      started();
      await held;
      return reply();
    };
    const sync = listPersonalGoogleCalendarEvents(owner.id);
    await fetched;
    const editedDate = new Date("2026-10-27T17:00:00Z");
    await prisma.taskItem.update({
      where: { id: item.id },
      data: { dueAt: editedDate, estimatedDays: 1 },
    });
    release();
    await sync;
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: item.id } })
      ).dueAt?.toISOString(),
      editedDate.toISOString(),
    );
    const viewerConnection = await prisma.googleCalendarConnection.create({
      data: {
        userId: viewer.id,
        accessTokenCipher: encryptCalendarToken(randomUUID()),
        tokenExpiresAt: new Date(Date.now() + 3600000),
      },
    });
    await prisma.personalTaskShare.create({
      data: { taskItemId: item.id, userId: viewer.id, accessLevel: "VIEWER" },
    });
    await prisma.personalTaskCalendarLink.create({
      data: {
        userId: viewer.id,
        taskItemId: item.id,
        connectionId: viewerConnection.id,
        eventId: "smoke-event",
      },
    });
    globalThis.fetch = async () => reply();
    assert.equal(
      (await listPersonalGoogleCalendarEvents(viewer.id))[0].linkedTaskItemId,
      null,
    );
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: item.id } })
      ).dueAt?.toISOString(),
      editedDate.toISOString(),
    );
    await prisma.taskItem.update({
      where: { id: item.id },
      data: { status: "CANCELLED" },
    });
    await listPersonalGoogleCalendarEvents(owner.id);
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: item.id } })
      ).dueAt?.toISOString(),
      editedDate.toISOString(),
    );
    console.log(
      "PASS: DB-only page loader, Google date import, unchanged-row no-op, concurrent edit protection, read-only share protection, cancelled-task protection; no external requests sent",
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (taskId) await prisma.task.delete({ where: { id: taskId } });
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    await prisma.$disconnect();
  }
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : "Calendar smoke failed");
  process.exitCode = 1;
});
