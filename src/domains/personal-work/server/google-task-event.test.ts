import assert from "node:assert/strict";
import { test } from "node:test";
import { googleTaskEventId, writeGoogleTaskEvent, googleTaskScheduleHash, shouldImportGoogleTaskSchedule } from "./google-task-event";

const payload = { summary: "Synthetic task", extendedProperties: { private: { watchShopTaskItemId: "task", source: "WATCH_SHOP_PERSONAL_WORK" } } };

test("unchanged exports and another account's stale schedule cannot overwrite task dates", () => {
  const version = new Date("2026-11-10T08:00:00Z");
  const schedule = { start: { dateTime: "2026-11-12T08:00:00+07:00" }, end: { dateTime: "2026-11-12T09:00:00+07:00" } };
  const event = { ...schedule, extendedProperties: { private: { watchShopTaskVersion: version.toISOString(), watchShopScheduleHash: googleTaskScheduleHash(schedule) } } };
  assert.equal(shouldImportGoogleTaskSchedule(event, version), false);
  assert.equal(shouldImportGoogleTaskSchedule({ ...event, start: { dateTime: "2026-11-12T01:00:00Z" } }, version), false);
  const edited = { ...event, start: { dateTime: "2026-11-12T07:00:00+07:00" } };
  assert.equal(shouldImportGoogleTaskSchedule(edited, version), true);
  assert.equal(shouldImportGoogleTaskSchedule(edited, new Date("2026-11-10T08:00:01Z")), false);
  assert.equal(shouldImportGoogleTaskSchedule(schedule, version), true);
  const allDay = { start: { date: "2026-11-12" }, end: { date: "2026-11-13" } };
  assert.equal(shouldImportGoogleTaskSchedule({ ...allDay, extendedProperties: { private: { watchShopTaskVersion: version.toISOString(), watchShopScheduleHash: googleTaskScheduleHash(allDay) } } }, version), false);
});

test("event identity is stable, account-scoped and valid Google base32hex", () => {
  const id = googleTaskEventId("connection", "task");
  assert.match(id, /^[0-9a-v]{64}$/);
  assert.equal(id, googleTaskEventId("connection", "task"));
  assert.notEqual(id, googleTaskEventId("another-connection", "task"));
  assert.notEqual(id, googleTaskEventId("connection", "another-task"));
  assert.notEqual(id, googleTaskEventId("connection", "task", "another-calendar"));
});

test("a lost successful create response is reconciled without creating a duplicate event", async () => {
  const stored = new Map<string, unknown>();
  let loseResponse = true, updates = 0;
  const stableId = googleTaskEventId("connection", "task");
  const request = async (suffix: string, init: RequestInit) => {
    if (init.method === "POST") {
      const body = JSON.parse(String(init.body));
      if (stored.has(body.id)) return new Response(null, { status: 409 });
      stored.set(body.id, body);
      if (loseResponse) { loseResponse = false; throw Error("Response lost"); }
    }
    if (init.method === "PUT") updates++;
    return Response.json({ id: stableId, ...payload });
  };
  const input = { stableId, taskItemId: "task", payload, request };
  await assert.rejects(writeGoogleTaskEvent(input), /Response lost/);
  assert.equal((await writeGoogleTaskEvent(input)).ok, true);
  assert.equal(stored.size, 1);
  assert.equal(updates, 1);
});

test("an identity conflict never overwrites another task's event", async () => {
  const calls: string[] = [];
  await assert.rejects(writeGoogleTaskEvent({ stableId: "event", taskItemId: "task", payload, request: async (_suffix, init) => {
    calls.push(init.method!);
    return init.method === "POST" ? new Response(null, { status: 409 }) : Response.json({ extendedProperties: { private: { watchShopTaskItemId: "other-task" } } });
  } }), /identity/);
  assert.deepEqual(calls, ["POST", "GET"]);
});

test("existing event links retain their original ID; provider errors are not hidden", async () => {
  const calls: string[] = [];
  const result = await writeGoogleTaskEvent({ existingId: "legacy-event", stableId: "new-event", taskItemId: "task", payload, request: async (suffix, init) => {
    calls.push(`${init.method} ${suffix}`); return new Response(null, { status: 503 });
  } });
  assert.equal(result.status, 503);
  assert.deepEqual(calls, ["PUT /legacy-event"]);
});
