import assert from "node:assert/strict";
import test from "node:test";
import { assistantRunTimeout, BEN_QUEUE_TIMEOUT_MS, BEN_TURN_TIMEOUT_MS } from "./run-timeout";
import { boundedAssistantRequest } from "./live-request";

test("queued runs and heartbeating runs have independent finite budgets; completed runs never expire", () => {
  const start = Date.parse("2026-11-18T00:00:00Z");
  const row = { status: "QUEUED", state: { turnTimes: [new Date(start).toISOString()] }, updatedAt: new Date(start), leaseExpiresAt: new Date(start + 600_000) };
  assert.equal(assistantRunTimeout(row, start + BEN_QUEUE_TIMEOUT_MS - 1), null);
  assert.equal(assistantRunTimeout(row, start + BEN_QUEUE_TIMEOUT_MS), "QUEUE_TIMEOUT");
  row.status = "RUNNING";
  row.updatedAt = new Date(start + BEN_TURN_TIMEOUT_MS); // A heartbeat cannot reset the turn budget.
  assert.equal(assistantRunTimeout(row, start + BEN_TURN_TIMEOUT_MS), "TURN_TIMEOUT");
  assert.equal(assistantRunTimeout({ ...row, leaseExpiresAt: new Date(start) }, start + 1), "LEASE_EXPIRED");
  for (const status of ["APPLIED", "DRAFT", "NEEDS_INFO", "FAILED", "CANCELLED"])
    assert.equal(assistantRunTimeout({ ...row, status }, start + 1_000_000), null);
  assert.equal(assistantRunTimeout({ ...row, status: "QUEUED", state: {}, updatedAt: new Date(start) }, start + BEN_QUEUE_TIMEOUT_MS), "QUEUE_TIMEOUT");
  assert.equal(assistantRunTimeout({ ...row, state: { purpose: "ACQUISITION_QUICK_NAME" } }, start + 1_000_000), null);
});

test("a hung POST or hung response parser stops once without replaying the command", async () => {
  let calls = 0;
  let signal: AbortSignal | undefined;
  await assert.rejects(boundedAssistantRequest(s => { calls++; signal = s; return new Promise(() => {}); }, 5), /kiểm tra trước khi gửi lại/);
  assert.equal(calls, 1);
  assert.equal(signal?.aborted, true);
  assert.equal(await boundedAssistantRequest(async () => "receipt", 100), "receipt");
});
