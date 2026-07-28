import type { DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { getProjectionBuilder, listProjectionBuildersForEvent } from "./projection.registry";
import type {
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionConsumerResult,
  ProjectionScope,
} from "./projection.types";
import { perfStep } from "@/lib/server-perf";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new Error("PROJECTION_CONSUMER_ABORTED");
  }
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
  options?: { skipProjectionKeys?: string[] },
): Promise<ProjectionConsumerResult> {
  const skipKeys = new Set(
    (options?.skipProjectionKeys ?? [])
      .map((key) => clean(key).toLowerCase())
      .filter(Boolean),
  );
  const builders = listProjectionBuildersForEvent({
    eventKey: event.eventKey,
    targetType: event.targetType,
  }).filter((builder) => !skipKeys.has(clean(builder.key).toLowerCase()));

  if (!builders.length) {
    return {
      ok: true,
      skipped: true,
      reason: "NO_PROJECTION_BUILDER",
      builders: [],
    };
  }

  const results: ProjectionBuildResult[] = [];
  const selectedKeys = new Set(builders.map((builder) => clean(builder.key).toLowerCase()));
  const completedKeys = new Set<string>();
  const pending = [...builders];

  while (pending.length) {
    throwIfAborted(event.abortSignal);
    let ready = pending.filter((builder) =>
      (builder.dependsOnProjectionKeys ?? []).every((key) => {
        const dependency = clean(key).toLowerCase();
        return !selectedKeys.has(dependency) || completedKeys.has(dependency);
      }),
    );
    if (!ready.length) ready = [...pending];

    const batchResults: ProjectionBuildResult[] = [];
    // These builders are database-heavy read models. Keep bounded concurrency
    // inside one delivery so a single event cannot exhaust the connection pool.
    for (let index = 0; index < ready.length; index += 2) {
      batchResults.push(...await Promise.all(
        ready.slice(index, index + 2).map(async (builder) => {
          if (!builder.buildFromEvent) {
            return skippedResult({ builder, reason: "NO_EVENT_BUILDER" });
          }
          try {
            return await perfStep("projection", `${event.eventKey}:${builder.key}`, () =>
              builder.buildFromEvent!(db, {
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
            return failedResult({ builder, error });
          }
        }),
      ));
    }
    results.push(...batchResults);
    for (const builder of ready) {
      completedKeys.add(clean(builder.key).toLowerCase());
      const index = pending.indexOf(builder);
      if (index >= 0) pending.splice(index, 1);
    }
    throwIfAborted(event.abortSignal);
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
