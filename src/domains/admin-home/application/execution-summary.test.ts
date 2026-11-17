import assert from "node:assert/strict";
import test from "node:test";
import { executionCounts, mediaExecutionState, technicalExecutionState } from "../shared/execution-summary";

test("media uses execution/progress facts, never pipeline membership", () => {
  assert.equal(mediaExecutionState("NEW", null, null), "waiting");
  assert.equal(mediaExecutionState("REVIEW", 1, 4), "inProgress");
  assert.equal(mediaExecutionState("REVIEW", 4, 4), "waiting");
  assert.equal(mediaExecutionState("IN_PROGRESS", null, null), "inProgress");
  assert.equal(mediaExecutionState("ASSETS_DOWNLOADED", null, null), "waiting");
  assert.equal(mediaExecutionState(null, null, null), "unknown");
  assert.equal(mediaExecutionState("MEDIA_PROCESSING", null, null), "unknown");
  assert.equal(mediaExecutionState(null, "bad", "4"), "unknown");
  assert.equal(mediaExecutionState(null, 5, 4), "unknown");
});
test("technical execution differs from a flow-stage label", () => {
  assert.equal(technicalExecutionState("IN_PROGRESS"), "inProgress");
  assert.equal(technicalExecutionState("OPEN"), "waiting");
  assert.equal(technicalExecutionState("CONFIRMED"), "waiting");
  assert.equal(technicalExecutionState("PROCESSING"), "unknown");
  assert.equal(technicalExecutionState("CANCELED"), "unknown");
});
test("coverage is disjoint and reconciles with the open population", () => {
  assert.deepEqual(executionCounts(67, 42, 20), { waiting: 42, inProgress: 20, unknown: 5 });
  assert.deepEqual(executionCounts(127), { waiting: 0, inProgress: 0, unknown: 127 });
  assert.deepEqual(executionCounts(0), { waiting: 0, inProgress: 0, unknown: 0 });
  assert.deepEqual(executionCounts(10, 8, 8), { waiting: 0, inProgress: 0, unknown: 10 });
});
