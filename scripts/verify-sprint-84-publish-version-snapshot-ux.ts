import { operationalBlueprintTemplateByKey } from "@/domains/blueprint/server";
import { buildOperationPublishPlan } from "@/domains/blueprint/shared/operation-publish-plan";
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

const serviceCreationPlan = buildOperationSpaceCreationPlan({
  blueprintKey: "service-operation",
  blueprintName: "Service Operation",
  blueprintSource: "REGISTRY",
  workspaceDefinition,
  operation: serviceTemplate.contract,
});
const servicePublishPlan = buildOperationPublishPlan({
  operation: serviceTemplate.contract,
  creationPlan: serviceCreationPlan,
});

assert(servicePublishPlan.ok, "Service Operation publish candidate should be ready");
assert(
  servicePublishPlan.proposedVersion === serviceTemplate.contract.version + 1,
  "Publish candidate should propose the next operation version",
);
assert(
  servicePublishPlan.snapshotMode === "NEW_WORKSPACES_ONLY",
  "Publish plan should preserve existing Workspace snapshots",
);

const paymentTemplate = operationalBlueprintTemplateByKey("payment-collection");
assert(paymentTemplate, "Payment Collection template should be available");

const paymentCreationPlan = buildOperationSpaceCreationPlan({
  blueprintKey: "payment",
  blueprintName: "Payment Collection",
  blueprintSource: "REGISTRY",
  workspaceDefinition,
  operation: paymentTemplate.contract,
});
const paymentPublishPlan = buildOperationPublishPlan({
  operation: paymentTemplate.contract,
  creationPlan: paymentCreationPlan,
});

assert(paymentPublishPlan.ok, "Declared-only adapters should warn but not block publish readiness");
assert(
  paymentPublishPlan.issues.some((issue) => issue.code === "declared_only_adapters"),
  "Payment publish plan should warn about pending adapters",
);

const blockedPublishPlan = buildOperationPublishPlan({
  operation: null,
  creationPlan: null,
});

assert(!blockedPublishPlan.ok, "Missing operation should block publish readiness");
assert(
  blockedPublishPlan.issues.some((issue) => issue.code === "missing_operation"),
  "Missing operation issue should be reported",
);

console.log("[sprint-84-verify] ok");
