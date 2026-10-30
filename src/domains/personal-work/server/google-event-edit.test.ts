import assert from "node:assert/strict";
import test from "node:test";
import { encryptCalendarToken } from "./google-calendar-crypto";
import { validateGoogleEventEdit, type GoogleEventEditInput } from "../shared/google-event-edit";

const input: GoogleEventEditInput = { id: "event_123", etag: '"v1"', title: "Meeting", description: "Notes", location: "Office", allDay: false, startAt: "2026-10-29T09:00:00+07:00", endAt: "2026-10-29T10:00:00+07:00" };

test("validate timed/all-day edits and reject malformed, reversed and excessive ranges", () => {
  assert.equal(validateGoogleEventEdit(input).start.dateTime, "2026-10-29T02:00:00.000Z");
  assert.equal(validateGoogleEventEdit({ ...input, allDay: true, startAt: "2026-10-29", endAt: "2026-10-30" }).end.date, "2026-10-30");
  for (const change of [{ id: "../other" }, { etag: "*" }, { title: " " }, { endAt: input.startAt }, { endAt: "2028-01-01T10:00:00Z" }, { allDay: true, startAt: "2026-02-30", endAt: "2026-03-04" }, { startAt: "2026-10-29T09:00" }]) {
    assert.throws(() => validateGoogleEventEdit({ ...input, ...change }));
  }
});

test("external edits use only the user's calendar, preserve other Google fields, and protect access/version", async t => {
  let linked = false;
  let event = { id: input.id, etag: input.etag, organizer: { self: true }, guestsCanModify: false, summary: "Old", status: "confirmed", locked: false, eventType: "default", extendedProperties: { private: {} }, start: { dateTime: input.startAt }, end: { dateTime: input.endAt } };
  let patchStatus = 200;
  const requests: Array<{ url: string; init: RequestInit }> = [];
  // Every database and network boundary used here is mocked. No DB queries or Google requests.
  const holder = globalThis as typeof globalThis & { __prisma?: unknown };
  const previousClient = holder.__prisma;
  holder.__prisma = {
    googleCalendarConnection: { findUnique: async ({ where }: { where: { userId: string } }) => where.userId === "alice" ? { id: "conn", calendarId: "alice/calendar", accessTokenCipher: encryptCalendarToken("fixture-token"), tokenExpiresAt: new Date(Date.now() + 3600000) } : null },
    personalTaskCalendarLink: { findFirst: async () => linked ? { id: "linked" } : null },
  };
  t.after(() => { holder.__prisma = previousClient; });
  const { updatePersonalGoogleCalendarEvent } = await import("./google-calendar.service");
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    requests.push({ url: String(url), init });
    return Response.json(init.method === "PATCH" ? { ...event, ...JSON.parse(String(init.body)), etag: '"v2"' } : event, { status: init.method === "PATCH" ? patchStatus : 200 });
  });
  const updated = await updatePersonalGoogleCalendarEvent("alice", input);
  assert.equal(updated.title, input.title);
  assert.equal(updated.etag, '"v2"');
  assert.equal(updated.canEdit, true);
  assert.ok(requests.every(r => r.url.includes("/calendars/alice%2Fcalendar/events/event_123")));
  const patch = requests.find(r => r.init.method === "PATCH")!;
  assert.equal(new Headers(patch.init.headers).get("If-Match"), input.etag);
  const body = JSON.parse(String(patch.init.body));
  assert.deepEqual(Object.keys(body).sort(), ["description", "end", "location", "start", "summary"]);
  for (const [name, run] of [
    ["other user cannot use Alice connection", () => updatePersonalGoogleCalendarEvent("bob", input)],
    ["stale editor", () => updatePersonalGoogleCalendarEvent("alice", { ...input, etag: '"old"' })],
  ] as const) { const count = requests.filter(r => r.init.method === "PATCH").length; await assert.rejects(run, Error, name); assert.equal(requests.filter(r => r.init.method === "PATCH").length, count); }
  linked = true;
  await assert.rejects(updatePersonalGoogleCalendarEvent("alice", input), /liên kết/);
  linked = false;
  for (const change of [{ organizer: { self: false } }, { locked: true }, { status: "cancelled" }, { eventType: "birthday" }, { extendedProperties: { private: { watchShopTaskItemId: "private-task" } } }]) {
    const previous = event;
    event = { ...event, ...change };
    const count = requests.filter(r => r.init.method === "PATCH").length;
    await assert.rejects(updatePersonalGoogleCalendarEvent("alice", input));
    assert.equal(requests.filter(r => r.init.method === "PATCH").length, count);
    event = previous;
  }
  event = { ...event, organizer: { self: false }, guestsCanModify: true };
  assert.equal((await updatePersonalGoogleCalendarEvent("alice", input)).canEdit, true);
  const allDay = await updatePersonalGoogleCalendarEvent("alice", { ...input, allDay: true, startAt: "2026-10-29", endAt: "2026-10-31" });
  assert.equal(allDay.allDay, true);
  assert.equal(allDay.endAt, "2026-10-31");
  patchStatus = 412;
  await assert.rejects(updatePersonalGoogleCalendarEvent("alice", input), /vừa được thay đổi/);
  patchStatus = 403;
  await assert.rejects(updatePersonalGoogleCalendarEvent("alice", input), /không cho phép/);
});
