export type DashboardExecutionCounts = { waiting: number; inProgress: number; unknown: number };
export type DashboardExecutionState = keyof DashboardExecutionCounts;

/** Pipeline membership is deliberately not an execution signal. */
export function mediaExecutionState(state: string | null, completed: string | number | null, total: string | number | null): DashboardExecutionState {
  const done = completed === null ? NaN : Number(completed);
  const size = total === null ? NaN : Number(total);
  if (Number.isInteger(done) && Number.isInteger(size) && size > 0 && done >= 0 && done <= size) {
    if (done > 0 && done < size) return "inProgress";
    if (done === size) return "waiting"; // Parts complete, still awaiting a transition/approval.
  }
  if (state === "IN_PROGRESS") return "inProgress";
  if (["NEW", "RETURNED", "REVIEW", "ASSETS_DOWNLOADED"].includes(state ?? "")) return "waiting";
  return "unknown";
}

export function technicalExecutionState(status: string | null): DashboardExecutionState {
  if (status === "IN_PROGRESS") return "inProgress";
  if (status === "OPEN" || status === "CONFIRMED") return "waiting";
  return "unknown";
}

/** Keep disjoint classified counts within the same population as the queue total. */
export function executionCounts(total: number, waiting = 0, inProgress = 0): DashboardExecutionCounts {
  if (![total, waiting, inProgress].every(value => Number.isSafeInteger(value) && value >= 0) || waiting + inProgress > total) {
    return { waiting: 0, inProgress: 0, unknown: Number.isSafeInteger(total) && total >= 0 ? total : 0 };
  }
  return { waiting, inProgress, unknown: total - waiting - inProgress };
}
