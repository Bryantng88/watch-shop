import assert from "node:assert/strict";
import test from "node:test";
import { concentratedStages, stageMetrics } from "./stage-insights";

function stage(count: number) {
  return { key: "stage", label: "Stage", count, href: "/stage", actionLabel: "Open" };
}

test("high concentration uses the queue total and avoids one/two item alarms", () => {
  assert.equal(concentratedStages({ activeCount: 0, stages: [stage(0)] }).length, 0);
  assert.equal(concentratedStages({ activeCount: 1, stages: [stage(1)] }).length, 0);
  assert.equal(concentratedStages({ activeCount: 2, stages: [stage(2)] }).length, 0);
  assert.equal(concentratedStages({ activeCount: 5, stages: [stage(3)] }).length, 1);
  assert.equal(concentratedStages({ activeCount: 9, stages: [stage(5)] }).length, 0);
  assert.equal(concentratedStages({ activeCount: 9, stages: [stage(7), stage(2)] }).length, 1);
  // Stage groups can overlap: use queue.activeCount, not the sum of stage counts.
  assert.equal(concentratedStages({ activeCount: 5, stages: [stage(3), { ...stage(3), key: "other" }] }).length, 2);
});

test("checklist completion is based on actual steps and reports data coverage", () => {
  const metrics = stageMetrics({ stageKey: "stage", count: BigInt(10), averageIdleHours: 48,
    oldestIdleHours: 240, staleCount: BigInt(4), stepsDone: BigInt(6), stepsTotal: BigInt(12), stepsSampleCount: BigInt(3) });
  assert.equal(metrics[0].value, "2 ngày");
  assert.equal(metrics[1].value, "4/10 việc");
  assert.equal(metrics[2].value, "50%");
  assert.match(metrics[2].detail, /6\/12/);
  assert.match(metrics[2].detail, /3\/10/);
});

test("completion cohort is independent of completed-in-window throughput", () => {
  const metrics = stageMetrics(undefined, { queueKey: "media", stageKey: "stage",
    completedCount: BigInt(12), averageHandlingHours: 6, cohortCount: BigInt(20), cohortCompletedCount: BigInt(5) });
  assert.equal(metrics[0].value, "12 lượt");
  assert.equal(metrics[1].value, "6 giờ");
  assert.equal(metrics[2].value, "25%");
  assert.match(metrics[2].detail, /5\/20/);
});

test("missing timestamps and empty cohorts remain unknown rather than zero percent", () => {
  const metrics = stageMetrics(undefined, { queueKey: "media", stageKey: "stage",
    completedCount: BigInt(0), averageHandlingHours: null, cohortCount: BigInt(0), cohortCompletedCount: BigInt(0) });
  assert.equal(metrics[1].value, "—");
  assert.equal(metrics[2].value, "—");
  assert.deepEqual(stageMetrics(), []);
});
