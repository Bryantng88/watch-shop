export const BEN_QUEUE_TIMEOUT_MS = 120_000;
export const BEN_TURN_TIMEOUT_MS = 180_000;

export function assistantRunTimeout(row: {
  status: string;
  state: unknown;
  updatedAt: Date;
  leaseExpiresAt: Date | null;
}, now = Date.now()) {
  if (row.status !== "QUEUED" && row.status !== "RUNNING") return null;
  const state = row.state && typeof row.state === "object" ? row.state as { turnTimes?: unknown; purpose?: unknown } : {};
  if (state.purpose === "ACQUISITION_QUICK_NAME") return null;
  const times = Array.isArray(state.turnTimes) ? state.turnTimes : [];
  const last = times.at(-1);
  const parsed = typeof last === "string" ? Date.parse(last) : NaN;
  const started = Number.isFinite(parsed) ? parsed : row.updatedAt.getTime();
  if (row.status === "QUEUED") return now - started >= BEN_QUEUE_TIMEOUT_MS ? "QUEUE_TIMEOUT" : null;
  if (!row.leaseExpiresAt || row.leaseExpiresAt.getTime() <= now) return "LEASE_EXPIRED";
  return now - started >= BEN_TURN_TIMEOUT_MS ? "TURN_TIMEOUT" : null;
}
