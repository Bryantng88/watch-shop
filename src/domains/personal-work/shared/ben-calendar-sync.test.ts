import assert from "node:assert/strict";
import { test } from "node:test";
import { benCalendarCandidates, syncBenCalendars, benCalendarStatus } from "./ben-calendar-sync";

test("self-assignment produces one calendar recipient", () => {
  assert.deepEqual(benCalendarCandidates("owner", "owner"), ["owner"]);
  assert.deepEqual(benCalendarCandidates("owner"), ["owner"]);
});

test("one provider failure cannot lose the other account result or fail task creation", async () => {
  const calls: string[] = [];
  const result = await syncBenCalendars([{ userId: "owner", name: "Long" }, { userId: "assignee", name: "Vi" }], "task", async (user, item) => {
    calls.push(`${user}:${item}`);
    if (user === "assignee") throw Error("Synthetic Google failure");
  });
  assert.deepEqual(calls, ["owner:task", "assignee:task"]);
  assert.deepEqual(result.map(r => r.status), ["SYNCED", "FAILED"]);
  assert.equal(benCalendarStatus(result), "FAILED");
  assert.equal(benCalendarStatus(result.slice(0, 1)), "SYNCED");
  assert.equal(benCalendarStatus([]), "NONE");
});
