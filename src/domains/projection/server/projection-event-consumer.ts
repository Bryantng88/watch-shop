import type { DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { runProjectionBuildersForEvent } from "./projection.runner";
import {
  markProjectionDeliveryFailed,
  markProjectionDeliveryStarted,
  markProjectionDeliverySucceeded,
} from "./projection-delivery.repo";

export async function consumeBusinessEventForProjection(
  db: DB,
  context: BusinessEventDispatchContext,
) {
  const deliveryKey = String(
    context.projectionDeliveryKey ?? context.idempotencyKey ?? "",
  ).trim();
  if (deliveryKey) {
    await markProjectionDeliveryStarted(db, deliveryKey);
  }

  try {
  const metadata =
    context.eventLog && typeof context.eventLog === "object"
      ? (context.eventLog as { metadataJson?: unknown }).metadataJson
      : null;
  const payload =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? (metadata as Record<string, unknown>)
      : {};

  if (payload.skipProjection === true) {
    const result = { ok: true, skipped: true, reason: "PROJECTION_SUPERSEDED_BY_RELATED_EVENT" };
    if (deliveryKey) await markProjectionDeliverySucceeded(db, deliveryKey);
    return result;
  }

  const skipProjectionKeys = Array.isArray(payload.skipProjectionKeys)
    ? payload.skipProjectionKeys.map(String)
    : [];
    const result = await runProjectionBuildersForEvent(db, context, { skipProjectionKeys });
    if (!result.ok) {
      throw new Error(
        result.builders.find((builder) => !builder.ok)?.error ??
        result.reason ??
        "PROJECTION_BUILDERS_FAILED",
      );
    }
    if (deliveryKey) await markProjectionDeliverySucceeded(db, deliveryKey);
    return result;
  } catch (error) {
    if (deliveryKey) await markProjectionDeliveryFailed(db, deliveryKey, error);
    throw error;
  }
}
