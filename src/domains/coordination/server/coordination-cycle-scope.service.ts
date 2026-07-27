import type { CoordinationContext } from "./coordination-cycle.types";
import { dbOrTx, type DB } from "@/server/db/client";

const CACHE_TTL_MS = 5 * 60 * 1000;
const validCycleScopes = new Map<string, number>();

export async function assertCoordinationCycleScope(input: {
  db: DB;
  context: CoordinationContext;
  taskId: string;
}) {
  const taskId = String(input.taskId ?? "").trim();
  if (!taskId) throw new Error("COORDINATION_CYCLE_TASK_ID_REQUIRED");
  const cacheKey = `${input.context}:${taskId}`;
  const cachedUntil = validCycleScopes.get(cacheKey) ?? 0;
  if (cachedUntil > Date.now()) return taskId;

  const task = await dbOrTx(input.db).task.findFirst({
    where: {
      id: taskId,
      description: `Coordination Space ${input.context}`,
      status: { not: "CANCELLED" },
    },
    select: { id: true },
  });
  if (!task) throw new Error("COORDINATION_CYCLE_SCOPE_INVALID");
  validCycleScopes.set(cacheKey, Date.now() + CACHE_TTL_MS);
  return task.id;
}
