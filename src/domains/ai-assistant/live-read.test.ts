import assert from "node:assert/strict";
import { test } from "node:test";
import { LiveReadGate, livePollDelay } from "./live-read";

test("slow background reads stay single-flight and user selection supersedes stale results", () => {
  const gate = new LiveReadGate();
  const old = gate.begin()!;
  assert.equal(gate.begin(true), undefined);
  const selected = gate.begin()!;
  assert.equal(old.signal.aborted, true);
  assert.equal(old.isCurrent(), false);
  assert.equal(selected.isCurrent(), true);
  // An old completion must not unlock or abort the newer selection.
  old.finish();
  assert.equal(gate.begin(true), undefined);
  assert.equal(selected.isCurrent(), true);
  selected.finish();
  const next = gate.begin(true)!;
  assert.ok(next);
  next.finish();
});

test("session expiry, unmount and offline cancellation fence old responses", () => {
  const gate = new LiveReadGate();
  const read = gate.begin()!;
  gate.cancel();
  assert.equal(read.signal.aborted, true);
  assert.equal(read.isCurrent(), false);
  assert.equal(read.timedOut(), false);
  read.finish();
});

test("hung GETs time out without blocking future reads or cancelling a newer read", context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const gate = new LiveReadGate();
  const slow = gate.begin()!;
  context.mock.timers.tick(20000);
  assert.equal(slow.signal.aborted, true);
  assert.equal(slow.timedOut(), true);
  assert.equal(slow.isCurrent(), false);
  slow.finish();
  const next = gate.begin()!;
  slow.finish();
  assert.equal(next.isCurrent(), true);
  next.finish();
});

test("pending refresh is faster, idle sends no polls, and repeated failures back off to a bound", () => {
  assert.equal(livePollDelay(true, true, 0), 2000);
  assert.equal(livePollDelay(false, true, 0), 5000);
  assert.equal(livePollDelay(false, false, 0), null);
  assert.deepEqual([1, 2, 3, 4, 100].map(n => livePollDelay(true, false, n)), [5000, 10000, 20000, 30000, 30000]);
});
