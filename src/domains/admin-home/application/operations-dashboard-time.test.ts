import assert from "node:assert/strict";
import test from "node:test";
import { bangkokDayBounds } from "./operations-dashboard-time";

test("Bangkok day bounds do not depend on the server timezone", () => {
  const bounds = bangkokDayBounds(new Date("2026-10-23T18:30:00.000Z"));

  assert.equal(bounds.start.toISOString(), "2026-10-23T17:00:00.000Z");
  assert.equal(bounds.end.toISOString(), "2026-10-24T17:00:00.000Z");
});

