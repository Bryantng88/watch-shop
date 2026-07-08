import type { ProjectionBuildResult, ProjectionScope } from "./projection.types";

export type ProjectionStatusSummary = {
  projectionKey: string;
  projectionVersion: number;
  description?: string;
  registered: boolean;
  rebuildSupported: boolean;
  eventBuildSupported: boolean;
  storageReady: boolean;
  storageReason?: string;
  rowCount: number;
  statusCounts: Record<string, number>;
  latestProjectedAt: Date | null;
  latestSourceUpdatedAt: Date | null;
  oldestProjectedAt: Date | null;
  staleVersion: boolean;
};

export type ProjectionCompareResult = {
  ok: boolean;
  projectionKey: string;
  skipped?: boolean;
  reason?: string;
  details?: unknown;
};

export type ProjectionRepairInput = {
  projectionKey: string;
  scope?: ProjectionScope | null;
  compare?: boolean;
};

export type ProjectionRepairResult = {
  ok: boolean;
  projectionKey: string;
  scope: ProjectionScope;
  before: ProjectionStatusSummary | null;
  build: ProjectionBuildResult;
  after: ProjectionStatusSummary | null;
  compare?: ProjectionCompareResult;
};
