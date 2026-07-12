import { POST } from "@/app/api/admin/system/blueprints/published-versions/[id]/create-space/route";
import {
  createSpaceFromPublishedBlueprintVersion,
  operationalBlueprintTemplateByKey,
} from "@/domains/blueprint/server";
import { buildOperationSpaceCreationPlan } from "@/domains/blueprint/shared/operation-space-plan";
import type { BlueprintWorkspaceDefinition } from "@/domains/blueprint/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

assert(typeof POST === "function", "Create Space API route should export POST");

const template = operationalBlueprintTemplateByKey("service-operation");
assert(template, "Service Operation template should be available");

const workspaceDefinition: BlueprintWorkspaceDefinition = {
  defaultName: "Sprint 87 Operation Space",
  defaultDescription: "Verification operation space.",
  workspaceType: "Sprint 87 Operation Workspace",
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

const creationPlan = buildOperationSpaceCreationPlan({
  blueprintKey: "sprint-87-service-operation",
  blueprintName: "Sprint 87 Service Operation",
  blueprintSource: "DRAFT",
  workspaceDefinition,
  operation: template.contract,
});

assert(creationPlan.ok, "Published version creation plan should be ready");
assert(
  creationPlan.initialWorkspaces.length > 0,
  "Create Space should have initial Workspaces to create",
);
assert(
  creationPlan.deferredWorkspaces.length > 0,
  "Business-object Workspaces should stay deferred for event/runtime creation",
);
assert(
  creationPlan.initialWorkspaces.every((workspace) =>
    workspace.snapshotNote.includes("blueprintSnapshot:"),
  ),
  "Initial Workspace snapshots should carry Blueprint snapshot notes",
);

async function main() {
  const missing = await createSpaceFromPublishedBlueprintVersion({
    publishedVersionId: "missing-published-version",
    store: {
      storePath: `${process.cwd()}\\.tmp\\missing-sprint-87-published-version.json`,
    },
  });

  assert(!missing.ok, "Missing published version should fail safely");
  assert(
    missing.error.includes("not found"),
    "Missing published version should return a clear error",
  );

  console.log("[sprint-87-verify] ok");
}

void main();
