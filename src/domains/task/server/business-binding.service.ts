import type { DB } from "@/server/db/client";
import {
  createBusinessBinding,
  findBusinessBindingsByTaskItem,
  findTaskItemIdsByTarget,
} from "./business-binding.repo";
import type {
  BindTaskItemToBusinessObjectInput,
  BusinessBinding,
  BusinessBindingDTO,
  BusinessBindingRole,
  BusinessBindingTargetInput,
} from "./business-binding.types";
import { BusinessBindingRole as BusinessBindingRoleValue } from "./business-binding.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function assertPresent(value: unknown, message: string) {
  if (!clean(value)) throw new Error(message);
}

// TaskExecution remains the database model. This service exposes the
// BusinessBinding abstraction so new server code does not need that legacy name.
export function resolveBusinessBindingRole(
  binding: Pick<BusinessBinding, "targetType">,
): BusinessBindingRole {
  if (binding.targetType === "SERVICE_REQUEST") {
    return BusinessBindingRoleValue.SERVICE;
  }

  if (binding.targetType === "PAYMENT") return BusinessBindingRoleValue.PAYMENT;
  if (binding.targetType === "SHIPMENT") return BusinessBindingRoleValue.SHIPMENT;

  return BusinessBindingRoleValue.GENERAL;
}

export function toBusinessBindingDTO(
  binding: BusinessBinding,
): BusinessBindingDTO {
  return {
    id: binding.id,
    role: resolveBusinessBindingRole(binding),
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

export async function findRelatedTaskItemIdsForBusinessTarget(
  db: DB,
  input: BusinessBindingTargetInput,
) {
  return findTaskItemIdsByTarget(
    db,
    input.targetType,
    input.targetId,
    input.aliasIds ?? [],
  );
}

export async function listTaskItemBusinessBindings(
  db: DB,
  taskItemId: string,
) {
  const bindings = await findBusinessBindingsByTaskItem(db, taskItemId);
  return bindings.map(toBusinessBindingDTO);
}
