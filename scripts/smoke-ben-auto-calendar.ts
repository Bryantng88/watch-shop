import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/server/db/client";
import { encryptCalendarToken } from "../src/domains/personal-work/server/google-calendar-crypto";
import { syncPersonalTaskToGoogle, listPersonalGoogleCalendarEvents } from "../src/domains/personal-work/server/google-calendar.service";
import { sendAssistant, assistantWorker, listAssistant, approveAssistantPersonalWork } from "../src/domains/ai-assistant/server/service";
import type { PersonalWorkPlan } from "../src/domains/ai-assistant/personal-work-contract";

async function main() {
  const db = new URL(process.env.DATABASE_URL || "");
  assert.equal(db.hostname, "127.0.0.1");
  assert.equal(db.pathname, "/personal_codex_test");
  assert.equal(await prisma.customerAssistantConversation.count({ where: { status: { in: ["QUEUED", "RUNNING"] } } }), 0);
  const suffix = randomUUID();
  for (const code of ["TASK_VIEW", "TASK_MANAGE"])
    await prisma.permission.upsert({ where: { code }, create: { code }, update: {} });
  const role = await prisma.role.create({ data: { name: `calendar-fixture-${suffix}`, permissions: { connect: [{ code: "TASK_VIEW" }, { code: "TASK_MANAGE" }] } } });
  const users = await Promise.all(["owner", "assignee", "viewer"].map(name => prisma.user.create({ data: {
    email: `calendar-${name}-${suffix}@example.invalid`, name: `Synthetic ${name}`, roles: { connect: { id: role.id } },
  } })));
  const [owner, assignee, viewer] = users;
  const oldFetch = globalThis.fetch;
  const events = new Map<string, Record<string, unknown>>();
  let googleCalls = 0;
  const fail = new Set<string>();
  const loseResponse = new Set<string>();
  // No real Google/model request can escape this fixture.
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.origin, "https://www.googleapis.com");
    const match = url.pathname.match(/^\/calendar\/v3\/calendars\/([^/]+)\/events(?:\/([^/]+))?$/);
    assert.ok(match, "Only fixture Google event calls are allowed");
    googleCalls++;
    const calendar = decodeURIComponent(match[1]);
    if (fail.has(calendar)) return new Response(null, { status: 503 });
    const method = init?.method || "GET";
    if (method === "GET" && !match[2]) return Response.json({ items: [...events].filter(([key]) => key.startsWith(calendar + ":")).map(([key, event]) => ({ ...event, id: key.slice(calendar.length + 1) })) });
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    const id = match[2] || body?.id;
    const key = `${calendar}:${id}`;
    if (method === "POST") {
      if (events.has(key)) return new Response(null, { status: 409 });
      events.set(key, body);
      if (loseResponse.delete(calendar)) throw Error("Synthetic lost successful response");
    } else if (method === "PUT") {
      assert.ok(events.has(key)); events.set(key, body);
    } else assert.equal(method, "GET");
    const event = events.get(key);
    return event ? Response.json({ ...event, id, htmlLink: "https://calendar.google.com/calendar/event?eid=synthetic" }) : new Response(null, { status: 404 });
  };
  const connect = async (userId: string) => prisma.googleCalendarConnection.create({ data: {
    userId, calendarId: `fixture-${userId}`, accessTokenCipher: encryptCalendarToken("synthetic-token-not-a-real-google-token"), tokenExpiresAt: new Date(Date.now() + 3600000),
  } });
  const plan: PersonalWorkPlan = { kind: "TASK", title: "Synthetic assignment", note: null, categoryKey: "GENERAL", workType: null,
    dueAt: "2026-11-12T08:00:00+07:00", scheduledEndAt: null, tags: [], shares: [{ userId: viewer.id, accessLevel: "VIEWER" }],
    assigneeUserId: assignee.id, priority: "MEDIUM", checklist: [], syncGoogle: false };
  const prepare = async (changes: Partial<PersonalWorkPlan> = {}) => {
    const chat = await sendAssistant(owner.id, { requestKey: randomUUID(), text: "Synthetic scheduled task assigned to the verified person" });
    const { run } = await assistantWorker("claim", {}) as { run: { id: string; leaseToken: string } };
    assert.equal(run.id, chat.id);
    await assistantWorker("lookup", { ...run, lookup: { tool: "personalWork.categories" } });
    for (const user of [assignee, viewer]) await assistantWorker("lookup", { ...run, lookup: { tool: "personalWork.people", query: user.id } });
    await assistantWorker("finish", { ...run, reply: "Synthetic review", personalWorkPlan: { ...plan, ...changes } });
    return (await listAssistant(owner.id, chat.id)).conversations[0];
  };
  const approve = async (review: Awaited<ReturnType<typeof prepare>>) => {
    await Promise.all([approveAssistantPersonalWork(owner.id, review.id, review.revision!), approveAssistantPersonalWork(owner.id, review.id, review.revision!)]);
    return (await listAssistant(owner.id, review.id)).conversations[0].createdPersonalWork!.at(-1)!;
  };
  try {
    const baseline = { tasks: await prisma.taskItem.count(), orders: await prisma.order.count(), issues: await prisma.technicalIssue.count() };
    const disconnected = await prepare({ syncGoogle: true });
    assert.equal(disconnected.personalWorkDraft!.plan.syncGoogle, false);
    assert.equal((await approve(disconnected)).calendar, "NONE");
    assert.equal(googleCalls, 0);
    assert.equal(await prisma.taskItem.count(), baseline.tasks + 1);
    for (const user of users) await connect(user.id);
    const review = await prepare(); // Model says false; server connected-account policy wins.
    assert.deepEqual(review.personalWorkDraft!.calendarTargets!.map(t => t.userId), [owner.id, assignee.id]);
    assert.equal(review.personalWorkDraft!.plan.syncGoogle, true);
    assert.equal(googleCalls, 0, "No calendar writes before explicit approval");
    const receipt = await approve(review);
    assert.equal(receipt.calendar, "SYNCED");
    assert.equal(receipt.calendarRecipients!.length, 2);
    assert.equal(events.size, 2);
    assert.equal(googleCalls, 2, "Concurrent approval must sync each account only once");
    await assert.rejects(syncPersonalTaskToGoogle(viewer.id, receipt.id));
    await assert.rejects(approveAssistantPersonalWork(viewer.id, review.id, review.revision!));
    assert.equal(googleCalls, 2, "Viewer cannot write a calendar link");
    // Merely loading an unchanged all-day Google export must preserve the task's
    // original 08:00 start, even though Google represents the task as a date.
    await listPersonalGoogleCalendarEvents(owner.id);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: receipt.id } })).dueAt!.toISOString(), "2026-11-12T01:00:00.000Z");
    // A legitimate Google edit may import once. The other participant's older
    // copy must not undo that new canonical schedule.
    const ownedEntry = [...events].find(([key, event]) => key.startsWith(`fixture-${owner.id}:`) && (event.extendedProperties as { private: { watchShopTaskItemId: string } }).private.watchShopTaskItemId === receipt.id)!;
    ownedEntry[1].start = { date: "2026-11-13" };
    ownedEntry[1].end = { date: "2026-11-14" };
    await listPersonalGoogleCalendarEvents(owner.id);
    const moved = (await prisma.taskItem.findUniqueOrThrow({ where: { id: receipt.id } })).dueAt!.toISOString();
    assert.equal(moved, "2026-11-12T17:00:00.000Z");
    await listPersonalGoogleCalendarEvents(assignee.id);
    assert.equal((await prisma.taskItem.findUniqueOrThrow({ where: { id: receipt.id } })).dueAt!.toISOString(), moved);
    const scheduledCount = events.size;
    const undated = await prepare({ dueAt: null });
    assert.deepEqual(undated.personalWorkDraft!.calendarTargets, []);
    assert.equal((await approve(undated)).calendar, "NONE");
    assert.equal(events.size, scheduledCount);
    await prisma.googleCalendarConnection.delete({ where: { userId: owner.id } });
    const onlyAssignee = await prepare();
    assert.deepEqual(onlyAssignee.personalWorkDraft!.calendarTargets!.map(t => t.userId), [assignee.id]);
    assert.equal((await approve(onlyAssignee)).calendar, "SYNCED");
    await connect(owner.id);
    fail.add(`fixture-${assignee.id}`);
    const partial = await approve(await prepare());
    assert.equal(partial.calendar, "FAILED");
    assert.deepEqual(partial.calendarRecipients!.map(t => t.status), ["SYNCED", "FAILED"]);
    assert.ok(await prisma.taskItem.findUnique({ where: { id: partial.id } }));
    fail.clear();
    loseResponse.add(`fixture-${assignee.id}`);
    const uncertain = await approve(await prepare());
    assert.equal(uncertain.calendar, "FAILED");
    const count = events.size;
    await syncPersonalTaskToGoogle(assignee.id, uncertain.id);
    assert.equal(events.size, count, "Retry reconciles an accepted event without duplication");
    const calls = googleCalls;
    await syncPersonalTaskToGoogle(assignee.id, uncertain.id);
    assert.equal(googleCalls, calls, "Unchanged linked event must not be written again");
    const revoked = await prepare();
    await prisma.role.update({ where: { id: role.id }, data: { permissions: { set: [] } } });
    const tasks = await prisma.taskItem.count();
    await assert.rejects(approveAssistantPersonalWork(owner.id, revoked.id, revoked.revision!));
    assert.equal(await prisma.taskItem.count(), tasks);
    assert.equal(await prisma.order.count(), baseline.orders);
    assert.equal(await prisma.technicalIssue.count(), baseline.issues);
    console.log("PASS auto-calendar DB integration: creator/assignee only, disconnected/undated skip, explicit approval, concurrent replay, viewer/cross-owner denial, partial failure, lost-response recovery, revocation, no order/issue writes. Google/model calls are synthetic.");
  } finally {
    globalThis.fetch = oldFetch;
    await prisma.user.updateMany({ where: { id: { in: users.map(u => u.id) } }, data: { isActive: false } });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
