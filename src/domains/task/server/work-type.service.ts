import {
  listRegisteredWorkTypes,
  listRegisteredWorkTypesByContext,
} from "./work-type.registry";
import { resolveWorkflowDefinition } from "@/domains/workflow-definition/server";
import type {
  WorkTypeCoordinationContext,
  WorkTypeDefinition,
  WorkTypeWithWorkflowDefinition,
} from "./work-type.types";

export function normalizeWorkTypeKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortWorkTypes(items: WorkTypeDefinition[]) {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

function matchesWorkType(workType: WorkTypeDefinition, key: string) {
  const normalized = normalizeWorkTypeKey(key);
  const routingKeys = workType.routingKeys.map(normalizeWorkTypeKey);

  return (
    normalizeWorkTypeKey(workType.key) === normalized ||
    routingKeys.includes(normalized)
  );
}

export function listWorkTypes(context: WorkTypeCoordinationContext) {
  return sortWorkTypes(
    listRegisteredWorkTypesByContext(context).filter((workType) => workType.enabled),
  );
}

export function listAllWorkTypes() {
  return sortWorkTypes(
    listRegisteredWorkTypes().filter((workType) => workType.enabled),
  );
}

export function getWorkTypeDefinition(
  context: WorkTypeCoordinationContext,
  key: string,
) {
  return listWorkTypes(context).find((workType) => matchesWorkType(workType, key)) ??
    null;
}

function resolveWorkTypeByKey(workTypeKey: string) {
  const normalized = normalizeWorkTypeKey(workTypeKey);

  return listAllWorkTypes().find((workType) => matchesWorkType(workType, normalized)) ??
    null;
}

function attachWorkflowDefinition(
  workType: WorkTypeDefinition,
): WorkTypeWithWorkflowDefinition {
  const workflowDefinition = resolveWorkflowDefinition(workType.workflowKey);

  if (workType.workflowKey && !workflowDefinition) {
    throw new Error(
      `Workflow definition "${workType.workflowKey}" is missing for work type "${workType.key}".`,
    );
  }

  return {
    ...workType,
    workflowDefinition,
    workflowMissing: Boolean(workType.workflowKey && !workflowDefinition),
  };
}

export function getWorkTypeWorkflowDefinition(workTypeKey: string) {
  const workType = resolveWorkTypeByKey(workTypeKey);

  if (!workType) {
    throw new Error(`Work type "${workTypeKey}" was not found.`);
  }

  if (!workType.workflowKey) {
    throw new Error(`Work type "${workType.key}" does not define workflowKey.`);
  }

  const workflowDefinition = resolveWorkflowDefinition(workType.workflowKey);

  if (!workflowDefinition) {
    throw new Error(
      `Workflow definition "${workType.workflowKey}" is missing for work type "${workType.key}".`,
    );
  }

  return workflowDefinition;
}

export function listWorkTypesWithWorkflow(
  context?: WorkTypeCoordinationContext,
) {
  const workTypes = context ? listWorkTypes(context) : listAllWorkTypes();

  return workTypes.map(attachWorkflowDefinition);
}
