import {
  operationalBlueprintTemplateByKey,
} from "@/domains/blueprint/server";
import { buildOperationSpaceCreationPlan } from "@/domains/blueprint/shared/operation-space-plan";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const workspaceDefinition = {
  defaultName: "Operation Space",
  defaultDescription: "Verification operation space.",
  workspaceType: "Operation Workspace",
  itemLabel: "Operation Items",
  defaultView: "items",
  enabledCapabilities: {
    workflow: true,
    items: true,
    activity: true,
    discussion: true,
    attachments: false,
    checklist: false,
    dueDate: false,
    assignee: false,
    priority: true,
  },
  provisioning: { mode: "MANUAL" },
  eventBindings: [],
  instantiationNotes: "Verification snapshot.",
};

const serviceTemplate = operationalBlueprintTemplateByKey("service-operation");
assert(serviceTemplate, "Service Operation template should be available");

const servicePlan = buildOperationSpaceCreationPlan({
  blueprintKey: "service-operation",
  blueprintName: "Service Operation",
  blueprintSource: "REGISTRY",
  workspaceDefinition,
  operation: serviceTemplate.contract,
});

assert(servicePlan.ok, "Service Operation plan should be ready");
assert(
  servicePlan.initialWorkspaces.map((item) => item.workspaceRole).join(",") ===
    "INSPECT,PROCESSING,DONE",
  "Service Operation should create only active-cycle receiver workspaces",
);
assert(
  servicePlan.deferredWorkspaces.some((item) => item.workspaceRole === "SR_CASE"),
  "SR_CASE should be deferred until a ServiceRequest exists",
);
assert(
  servicePlan.initialWorkspaces.every((item) =>
    item.snapshotNote.includes("blueprintSnapshot:"),
  ),
  "Initial workspace plan items should include snapshot notes",
);

const paymentTemplate = operationalBlueprintTemplateByKey("payment-collection");
assert(paymentTemplate, "Payment Collection template should be available");

const paymentPlan = buildOperationSpaceCreationPlan({
  blueprintKey: "payment",
  blueprintName: "Payment Collection",
  blueprintSource: "REGISTRY",
  workspaceDefinition,
  operation: paymentTemplate.contract,
});

assert(paymentPlan.ok, "Payment Collection plan should be ready");
assert(
  paymentPlan.initialWorkspaces.length === 3,
  "Payment Collection should create all three receiver workspaces",
);
assert(
  paymentPlan.deferredWorkspaces.length === 0,
  "Payment Collection should not defer business-object workspaces",
);

const blockedPlan = buildOperationSpaceCreationPlan({
  blueprintKey: "empty",
  blueprintName: "Empty",
  blueprintSource: "DRAFT",
  workspaceDefinition,
  operation: null,
});

assert(!blockedPlan.ok, "Plan without operation should be blocked");
assert(blockedPlan.itemCount === 0, "Blocked plan should not include workspaces");

console.log("[sprint-82-verify] ok");
