import type { DB } from "@/server/db/client";
import {
  createBusinessBinding,
  findBusinessBindingByTaskItemTarget,
  findBusinessBindingsByTaskItem,
  findTaskItemIdsByTarget,
} from "./business-binding.repo";
import type {
  BindTaskItemToBusinessObjectInput,
  BusinessBinding,
  BusinessBindingDTO,
  BusinessBindingTargetInput,
} from "./business-binding.types";
import { findTaskItemIdsByTargetIds } from "./business-binding.repo";
import type { BusinessBindingTargetType } from "./business-binding.types";
function clean(value: unknown) {
  return String(value ?? "").trim();
}
export async function findRelatedTaskItemIdsForBusinessTargets(
  db: DB,
  input: {
    targetType: BusinessBindingTargetType;
    targetIds: string[];
  },
) {
  return findTaskItemIdsByTargetIds(db, input);
}
function assertPresent(value: unknown, message: string) {
  if (!clean(value)) throw new Error(message);
}

// TaskExecution remains the database model. This service exposes the
// BusinessBinding abstraction so new server code does not need that legacy name.
export function toBusinessBindingDTO(
  binding: BusinessBinding,
): BusinessBindingDTO {
  return {
    id: binding.id,
    targetType: binding.targetType,
    targetId: binding.targetId,
    taskItemId: binding.taskItemId,
    actionType: binding.actionType,
    metadata: binding.metadataJson,
  };
}

export async function bindTaskItemToBusinessObject(
  db: DB,
  input: BindTaskItemToBusinessObjectInput,
) {
  assertPresent(input.taskItemId, "Missing taskItemId");

  const binding = await createBusinessBinding(db, {
    ...input,
    taskId: clean(input.taskId),
    taskItemId: clean(input.taskItemId),
    targetId: clean(input.targetId),
  });

  return toBusinessBindingDTO(binding);
}

export async function ensureTaskItemBusinessBinding(
  db: DB,
  input: BindTaskItemToBusinessObjectInput,
) {
  assertPresent(input.taskItemId, "Missing taskItemId");

  const cleanInput = {
    ...input,
    taskId: clean(input.taskId),
    taskItemId: clean(input.taskItemId),
    targetId: clean(input.targetId),
  };

  const existing = await findBusinessBindingByTaskItemTarget(db, cleanInput);

  if (existing) {
    return {
      binding: toBusinessBindingDTO(existing),
      created: false,
    };
  }

  const binding = await createBusinessBinding(db, cleanInput);

  return {
    binding: toBusinessBindingDTO(binding),
    created: true,
  };
}

export async function findRelatedTaskItemIdsForBusinessTarget(
  db: DB,
  input: BusinessBindingTargetInput,
) {
  return findTaskItemIdsByTarget(db, input.targetType, input.targetId);
}

export async function listTaskItemBusinessBindings(
  db: DB,
  taskItemId: string,
) {
  const bindings = await findBusinessBindingsByTaskItem(db, taskItemId);
  return bindings.map(toBusinessBindingDTO);
}
