import type { DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { runProjectionBuildersForEvent } from "./projection.runner";

export async function consumeBusinessEventForProjection(
  db: DB,
  context: BusinessEventDispatchContext,
) {
  return runProjectionBuildersForEvent(db, context);
}
