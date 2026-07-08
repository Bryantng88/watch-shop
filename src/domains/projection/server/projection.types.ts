import type { DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";

export type ProjectionBuildStatus = "applied" | "skipped" | "failed";

export type ProjectionSourceKind = "BUSINESS_EVENT" | "SOURCE_REBUILD";

export type ProjectionScope = {
  targetType?: string | null;
  targetId?: string | null;
  workspaceId?: string | null;
  spaceId?: string | null;
  filters?: Record<string, unknown> | null;
  since?: Date | string | null;
  until?: Date | string | null;
  limit?: number | null;
};

export type ProjectionBuildContext = {
  projectionKey: string;
  projectionVersion: number;
  sourceKind: ProjectionSourceKind;
  sourceEvent?: BusinessEventDispatchContext | null;
  scope?: ProjectionScope | null;
};

export type ProjectionBuildResult = {
  ok: boolean;
  status: ProjectionBuildStatus;
  projectionKey: string;
  projectionVersion: number;
  scope?: ProjectionScope | null;
  applied: number;
  skipped: number;
  failed: number;
  reason?: string;
  error?: string;
  metadata?: Record<string, unknown>;
};

export type ProjectionBuilder = {
  key: string;
  version: number;
  description?: string;
  sourceEvents?: string[];
  targetTypes?: string[];
  buildFromEvent?: (
    db: DB,
    context: ProjectionBuildContext & {
      sourceEvent: BusinessEventDispatchContext;
    },
  ) => Promise<ProjectionBuildResult>;
  rebuild?: (
    db: DB,
    context: ProjectionBuildContext & {
      scope: ProjectionScope;
    },
  ) => Promise<ProjectionBuildResult>;
};

export type ProjectionConsumerResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  builders: ProjectionBuildResult[];
};
