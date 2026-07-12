import { POST } from "@/app/api/admin/system/workflows/drafts/[id]/publish-blueprint/route";
import { operationalBlueprintTemplateByKey } from "@/domains/blueprint/server";
import type {
  BlueprintPublishedVersion,
  BlueprintWorkspaceDefinition,
} from "@/domains/blueprint/server";
import { buildOperationPublishPlan } from "@/domains/blueprint/shared/operation-publish-plan";
import { buildOperationSpaceCreationPlan } from "@/domains/blueprint/shared/operation-space-plan";
import { OperationPublishPlan } from "@/domains/workflow-definition/client/OperationPublishPlan";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const template = operationalBlueprintTemplateByKey("service-operation");
assert(template, "Service Operation template should be available");
assert(typeof POST === "function", "Publish API route should export POST");

const workspaceDefinition: BlueprintWorkspaceDefinition = {
  defaultName: "Sprint 86 Operation Space",
  defaultDescription: "Verification operation space.",
  workspaceType: "Sprint 86 Operation Workspace",
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

const latestPublishedVersion = template.contract.version + 3;
const creationPlan = buildOperationSpaceCreationPlan({
  blueprintKey: "sprint-86-service-operation",
  blueprintName: "Sprint 86 Service Operation",
  blueprintSource: "DRAFT",
  workspaceDefinition,
  operation: template.contract,
});
const publishPlan = buildOperationPublishPlan({
  operation: template.contract,
  creationPlan,
  latestPublishedVersion,
});

assert(
  publishPlan.proposedVersion === latestPublishedVersion + 1,
  "Publish plan should advance from the latest persisted version",
);

const publishedVersions = [
  {
    id: "published-version-verify",
    blueprintKey: "sprint-86-service-operation",
    blueprintName: "Sprint 86 Service Operation",
    source: "DRAFT",
    sourceDraftId: "draft-verify",
    sourceRegistryKey: "service-operation",
    version: latestPublishedVersion,
    operationKey: template.contract.key,
    operationVersion: latestPublishedVersion,
    snapshotMode: "NEW_WORKSPACES_ONLY",
    publishedByUserId: "verify-user",
    publishedAt: new Date().toISOString(),
    workflowDefinition: {
      key: "sprint-86",
      title: "Sprint 86",
      description: null,
      initialState: "OPEN",
      terminalStates: ["DONE"],
      metadata: null,
      states: [],
      transitions: [],
    },
    workspaceDefinition,
    workflowValidation: { valid: true, issues: [], warnings: [] },
    operation: {
      ...template.contract,
      version: latestPublishedVersion,
    },
    operationValidation: {
      ok: true,
      issueCount: 0,
      issues: [],
      warnings: [],
    },
    creationPlan,
    publishPlan,
  } satisfies BlueprintPublishedVersion,
];

assert(
  typeof OperationPublishPlan === "function",
  "OperationPublishPlan should export a client publish panel",
);
assert(
  publishedVersions[0].version === latestPublishedVersion,
  "Published version fixture should satisfy the UI history contract",
);

console.log("[sprint-86-verify] ok");
