import type { DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { getProjectionBuilder, listProjectionBuildersForEvent } from "./projection.registry";
import type {
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionConsumerResult,
  ProjectionScope,
} from "./projection.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function skippedResult(input: {
  builder: ProjectionBuilder;
  reason: string;
  scope?: ProjectionScope | null;
}): ProjectionBuildResult {
  return {
    ok: true,
    status: "skipped",
    projectionKey: input.builder.key,
    projectionVersion: input.builder.version,
    scope: input.scope ?? null,
    applied: 0,
    skipped: 1,
    failed: 0,
    reason: input.reason,
  };
}

function failedResult(input: {
  builder: ProjectionBuilder;
  error: unknown;
  scope?: ProjectionScope | null;
}): ProjectionBuildResult {
  return {
    ok: false,
    status: "failed",
    projectionKey: input.builder.key,
    projectionVersion: input.builder.version,
    scope: input.scope ?? null,
    applied: 0,
    skipped: 0,
    failed: 1,
    error: input.error instanceof Error ? input.error.message : "UNKNOWN_ERROR",
  };
}

export async function runProjectionBuildersForEvent(
  db: DB,
  event: BusinessEventDispatchContext,
): Promise<ProjectionConsumerResult> {
  const builders = listProjectionBuildersForEvent({
    eventKey: event.eventKey,
    targetType: event.targetType,
  });

  if (!builders.length) {
    return {
      ok: true,
      skipped: true,
      reason: "NO_PROJECTION_BUILDER",
      builders: [],
    };
  }

  const results: ProjectionBuildResult[] = [];

  for (const builder of builders) {
    if (!builder.buildFromEvent) {
      results.push(skippedResult({ builder, reason: "NO_EVENT_BUILDER" }));
      continue;
    }

    try {
      results.push(
        await builder.buildFromEvent(db, {
          projectionKey: builder.key,
          projectionVersion: builder.version,
          sourceKind: "BUSINESS_EVENT",
          sourceEvent: event,
          scope: {
            targetType: event.targetType,
            targetId: event.targetId,
          },
        }),
      );
    } catch (error) {
      results.push(failedResult({ builder, error }));
    }
  }

  const failed = results.some((result) => !result.ok || result.status === "failed");
  const applied = results.some((result) => result.status === "applied");

  return {
    ok: !failed,
    skipped: !failed && !applied,
    reason: !failed && !applied ? "NO_PROJECTION_APPLIED" : undefined,
    builders: results,
  };
}

export async function rebuildProjection(
  db: DB,
  input: {
    projectionKey: string;
    scope?: ProjectionScope | null;
  },
): Promise<ProjectionBuildResult> {
  const projectionKey = clean(input.projectionKey);
  const builder = getProjectionBuilder(projectionKey);
  const scope = input.scope ?? {};

  if (!builder) {
    return {
      ok: false,
      status: "failed",
      projectionKey,
      projectionVersion: 0,
      scope,
      applied: 0,
      skipped: 0,
      failed: 1,
      error: "PROJECTION_BUILDER_NOT_FOUND",
    };
  }

  if (!builder.rebuild) {
    return skippedResult({
      builder,
      scope,
      reason: "PROJECTION_REBUILD_NOT_SUPPORTED",
    });
  }

  try {
    return await builder.rebuild(db, {
      projectionKey: builder.key,
      projectionVersion: builder.version,
      sourceKind: "SOURCE_REBUILD",
      sourceEvent: null,
      scope,
    });
  } catch (error) {
    return failedResult({ builder, error, scope });
  }
}
