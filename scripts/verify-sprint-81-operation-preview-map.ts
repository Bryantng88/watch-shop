import {
  operationalBlueprintTemplateByKey,
  type OperationalBlueprintContract,
} from "@/domains/blueprint/server";
import { generateOperationPreviewMap } from "@/domains/blueprint/shared/operation-preview";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const template = operationalBlueprintTemplateByKey("service-operation");
assert(template, "Service Operation template should be available");

const preview = generateOperationPreviewMap(template.contract);
assert(preview, "Preview map should be generated for Service Operation");
assert(preview.workspaceNodes.length === 4, "Service Operation should preview four roles");

const coreFlow = preview.flows.find(
  (flow) => flow.key === "service-operation-core-flow",
);
assert(coreFlow, "Service Operation core flow should be present");
assert(coreFlow.steps.length === 4, "Service Operation core flow should have four steps");
assert(coreFlow.steps[0].isEntry, "First core flow step should be entry");
assert(coreFlow.steps[3].isTerminal, "Last core flow step should be terminal");

const srCase = preview.workspaceNodes.find((node) => node.roleKey === "SR_CASE");
assert(srCase, "SR_CASE node should be present");
assert(
  srCase.identityTargetType === "SERVICE_REQUEST",
  "SR_CASE should identify SERVICE_REQUEST",
);
assert(
  srCase.incomingRoutes.some((route) => route.eventKey === "service_request.created"),
  "SR_CASE should show service_request.created inbound route",
);

const processing = preview.workspaceNodes.find(
  (node) => node.roleKey === "PROCESSING",
);
assert(processing, "PROCESSING node should be present");
assert(
  processing.actions.some((action) => action.key === "start_processing"),
  "PROCESSING should show start_processing action",
);
assert(
  processing.workflows.some(
    (workflow) => workflow.key === "service-operation-technical-bench",
  ),
  "PROCESSING should show technical bench workflow ownership",
);

const withMissingReferences: OperationalBlueprintContract = {
  ...template.contract,
  eventRoutes: [
    ...template.contract.eventRoutes,
    {
      eventKey: "missing.event",
      targetType: "TECHNICAL_ISSUE",
      workspaceRole: "MISSING_ROLE",
      effect: "BIND_ITEM",
      description: "Verification route.",
    },
  ],
  actions: [
    ...template.contract.actions,
    {
      key: "missing_action",
      label: "Missing action",
      workspaceRole: "MISSING_ROLE",
      targetType: "TECHNICAL_ISSUE",
      command: "domain.missing",
      fields: [],
      emits: [],
      description: "Verification action.",
    },
  ],
};

const warningPreview = generateOperationPreviewMap(withMissingReferences);
assert(warningPreview, "Preview map should still generate with missing references");
assert(
  warningPreview.unplacedRoutes.length === 1,
  "Preview should expose unplaced event routes",
);
assert(
  warningPreview.unplacedActions.length === 1,
  "Preview should expose unplaced actions",
);

console.log("[sprint-81-verify] ok");
