import type { DB } from "@/server/db/client";

import type { CoordinationContext } from "./coordination-cycle.types";
import {
  ensureCoordinationCycle,
  resolveCurrentCoordinationCycle,
} from "./coordination-cycle.service";

/**
 * Stable operation workspace API.
 *
 * Operation spaces have no calendar lifecycle: one canonical Task owns each
 * context and its bindings survive week/month boundaries. The legacy cycle
 * service remains temporarily underneath for database compatibility only;
 * callers must not receive or make decisions from its referenceRange.
 */
export async function resolveOperationSpace(
  db: DB,
  input: { context: CoordinationContext },
) {
  const result = await resolveCurrentCoordinationCycle(db, {
    context: input.context,
  });
  if (!result) return null;
  return { task: result.task, context: result.context };
}

export async function ensureOperationSpace(
  db: DB,
  input: {
    context: CoordinationContext;
    provisionWorkTickets?: boolean;
  },
) {
  const result = await ensureCoordinationCycle(db, input);
  return {
    task: result.task,
    context: result.context,
    created: result.created,
    workTickets: result.workTickets,
    workTicketsCreated: result.workTicketsCreated,
  };
}
