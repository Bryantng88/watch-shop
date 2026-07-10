import {
  listRegistryBlueprints,
  operationalBlueprintForWorkType,
  validateOperationalBlueprintContract,
  type OperationalBlueprintContract,
} from "@/domains/blueprint/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function cloneContract(contract: OperationalBlueprintContract) {
  return JSON.parse(JSON.stringify(contract)) as OperationalBlueprintContract;
}

function issueCodes(contract: OperationalBlueprintContract) {
  return new Set(
    validateOperationalBlueprintContract(contract).errors.map((issue) => issue.code),
  );
}

function assertHasCode(
  contract: OperationalBlueprintContract,
  code: string,
  label: string,
) {
  const codes = issueCodes(contract);
  assert(codes.has(code), `${label} should report ${code}`);
}

const serviceOperation = operationalBlueprintForWorkType({
  workTypeKey: "service-operation",
  coordinationContext: "TECHNICAL",
});

assert(serviceOperation, "Service Operation contract should exist");

const serviceValidation = validateOperationalBlueprintContract(serviceOperation);
assert(serviceValidation.ok, "Service Operation contract should pass validation");
assert(
  serviceValidation.issueCount === 0,
  "Service Operation contract should not report validation issues",
);

const registryItem = listRegistryBlueprints("TECHNICAL").find(
  (blueprint) => blueprint.key === "service-operation",
);

assert(registryItem, "Service Operation registry blueprint should exist");
assert(
  registryItem.operationValidation?.ok,
  "Service Operation registry blueprint should expose passing operation validation",
);

const missingRouteRole = cloneContract(serviceOperation);
missingRouteRole.eventRoutes[0].workspaceRole = "MISSING_ROLE";
assertHasCode(missingRouteRole, "missing_workspace_role", "missing event route role");

const missingCoreFlowRole = cloneContract(serviceOperation);
missingCoreFlowRole.coreFlows[0].steps[0].workspaceRole = "MISSING_ROLE";
assertHasCode(missingCoreFlowRole, "missing_workspace_role", "missing core flow role");

const missingActionRole = cloneContract(serviceOperation);
missingActionRole.actions[0].workspaceRole = "MISSING_ROLE";
assertHasCode(missingActionRole, "missing_workspace_role", "missing action role");

const missingWorkflowAction = cloneContract(serviceOperation);
missingWorkflowAction.workflows[0].transitions[0].actionKey = "missing_action";
assertHasCode(missingWorkflowAction, "missing_action", "missing workflow action");

const emptyProjectionEvents = cloneContract(serviceOperation);
emptyProjectionEvents.projectionSubscriptions[0].eventKeys = [];
assertHasCode(
  emptyProjectionEvents,
  "empty_projection_events",
  "empty projection subscription events",
);

const duplicateRoles = cloneContract(serviceOperation);
duplicateRoles.workspaceRoles.push({ ...duplicateRoles.workspaceRoles[0] });
assertHasCode(duplicateRoles, "duplicate_key", "duplicate workspace roles");

const unrepresentedObject = cloneContract(serviceOperation);
unrepresentedObject.objectTypes.push({
  targetType: "UNREPRESENTED",
  label: "Unrepresented",
  role: "ITEM",
  description: "Validation fixture.",
});
assertHasCode(
  unrepresentedObject,
  "unrepresented_object_target",
  "unrepresented object target",
);

console.log("[sprint-76-verify] ok");
