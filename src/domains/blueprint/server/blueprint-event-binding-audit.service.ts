import {
  eventBindingConflictKey,
  normalizeEventKey,
  normalizeTargetType,
  type WorkspaceEventBinding,
} from "@/domains/blueprint/shared/event-bindings";
import { listCoordinationRoutes } from "@/domains/coordination/server/coordination-router.registry";
import { listBlueprintLibraryItems } from "./blueprint-library.service";

export type BlueprintEventBindingAuditSource =
  | "BLUEPRINT"
  | "LEGACY_COORDINATION_ROUTE";

export type BlueprintEventBindingAuditItem = {
  eventKey: string;
  targetType: string;
  consumer: string;
  scopeType: string;
  scopeContext: string;
  workTypeKey: string;
  mode: string;
  effects: string[];
  status: string;
  source: BlueprintEventBindingAuditSource;
  sourceBlueprint: string | null;
  conflictKey: string;
  conflictCount: number;
  hasConflict: boolean;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function auditItemFromBinding(input: {
  binding: WorkspaceEventBinding;
  sourceBlueprint: string;
}): BlueprintEventBindingAuditItem {
  const conflictKey = eventBindingConflictKey(input.binding);

  return {
    eventKey: normalizeEventKey(input.binding.eventKey),
    targetType: normalizeTargetType(input.binding.targetType),
    consumer: input.binding.consumer,
    scopeType: input.binding.scopeType,
    scopeContext: input.binding.scopeContext,
    workTypeKey: input.binding.workTypeKey,
    mode: input.binding.mode,
    effects: input.binding.effects,
    status: input.binding.status,
    source: "BLUEPRINT",
    sourceBlueprint: input.sourceBlueprint,
    conflictKey,
    conflictCount: 0,
    hasConflict: false,
  };
}

function auditItemsFromLegacyRoutes(): BlueprintEventBindingAuditItem[] {
  return listCoordinationRoutes().map((route) => {
    const metadata = asRecord(route.metadata);
    const scopeType = clean(metadata.scopeType) || "CURRENT_ACTIVE_WEEKLY_SPACE";
    const scopeContext = clean(metadata.scopeContext) || clean(route.coordinationType).toUpperCase();
    const conflictKey = [
      normalizeEventKey(route.eventKey),
      normalizeTargetType(route.targetType),
      "coordination",
      scopeType,
      scopeContext,
    ].join("::");

    return {
      eventKey: normalizeEventKey(route.eventKey),
      targetType: normalizeTargetType(route.targetType),
      consumer: "coordination",
      scopeType,
      scopeContext,
      workTypeKey: route.workTypeKey,
      mode: "ROUTE",
      effects: ["AUTO_BIND"],
      status: route.enabled ? "ACTIVE" : "DISABLED",
      source: "LEGACY_COORDINATION_ROUTE",
      sourceBlueprint: null,
      conflictKey,
      conflictCount: 0,
      hasConflict: false,
    };
  });
}

export async function listBlueprintEventBindingAudit(): Promise<
  BlueprintEventBindingAuditItem[]
> {
  const blueprints = await listBlueprintLibraryItems();
  const blueprintItems = blueprints.flatMap((blueprint) =>
    (blueprint.workspaceDefinition.eventBindings ?? []).map((binding) =>
      auditItemFromBinding({
        binding,
        sourceBlueprint: `${blueprint.source}:${blueprint.key}`,
      }),
    ),
  );
  const items = [...blueprintItems, ...auditItemsFromLegacyRoutes()];
  const conflictCounts = new Map<string, number>();

  for (const item of items.filter(
    (entry) => entry.source === "BLUEPRINT" && entry.status === "ACTIVE",
  )) {
    conflictCounts.set(
      item.conflictKey,
      (conflictCounts.get(item.conflictKey) ?? 0) + 1,
    );
  }

  return items.map((item) => {
    const conflictCount = conflictCounts.get(item.conflictKey) ?? 0;

    return {
      ...item,
      conflictCount,
      hasConflict: conflictCount > 1,
    };
  });
}
