import {
  listRegistryBlueprints,
  validateOperationalBlueprintContract,
} from "@/domains/blueprint/server";
import type {
  WorkflowDefinitionDraftBlueprintJson,
} from "@/domains/workflow-definition/server/workflow-definition-draft.types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const serviceOperation = listRegistryBlueprints("TECHNICAL").find(
  (blueprint) => blueprint.key === "service-operation",
);

assert(serviceOperation, "Service Operation blueprint should exist");
assert(serviceOperation.operation, "Service Operation should expose operation model");
assert(
  serviceOperation.operationValidation?.ok,
  "Service Operation operation model should expose passing validation",
);

const serialized = JSON.stringify(serviceOperation.operation);
const parsed = JSON.parse(serialized);
const validation = validateOperationalBlueprintContract(parsed);

assert(validation.ok, "Serialized operation JSON should validate after parse");

const draftBlueprintJson: WorkflowDefinitionDraftBlueprintJson = {
  purpose: serviceOperation.experience.purpose,
  businessContext: "DRAFT",
  typicalUsage: serviceOperation.experience.typicalUsage,
  expectedResult: serviceOperation.experience.expectedResult,
  ownerLabel: serviceOperation.experience.ownerLabel,
  workspaceDefinition: serviceOperation.workspaceDefinition,
  operation: parsed,
};

assert(
  draftBlueprintJson.operation?.projectionSubscriptions?.[0]?.projectionKey === "watch-list",
  "Draft blueprint JSON should be able to carry operation projection subscriptions",
);

console.log("[sprint-77-verify] ok");
