import { mkdir, rm } from "fs/promises";
import path from "path";
import {
  getLatestBlueprintPublishedVersion,
  listBlueprintPublishedVersionsForBlueprint,
  operationalBlueprintTemplateByKey,
  publishBlueprintVersionCandidate,
} from "@/domains/blueprint/server";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const storePath = path.join(
  process.cwd(),
  ".tmp",
  `sprint-85-blueprint-publish-store-${Date.now()}.json`,
);

const workspaceDefinition = {
  defaultName: "Published Operation Space",
  defaultDescription: "Verification published operation space.",
  workspaceType: "Published Operation Workspace",
  itemLabel: "Published Operation Items",
  defaultView: "items" as const,
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
  provisioning: { mode: "MANUAL" as const },
  eventBindings: [],
  instantiationNotes: "Verification snapshot.",
};

const workflowDefinition: WorkflowDefinition = {
  key: "verify-published-operation",
  title: "Verify Published Operation",
  description: "Verification workflow for published Blueprint persistence.",
  initialState: "OPEN",
  terminalStates: ["DONE"],
  metadata: null,
  states: [
    {
      key: "OPEN",
      title: "Open",
      description: null,
      color: "blue",
      icon: "circle",
      sortOrder: 10,
    },
    {
      key: "DONE",
      title: "Done",
      description: null,
      color: "green",
      icon: "check-circle",
      sortOrder: 20,
    },
  ],
  transitions: [],
};

async function main() {
  await mkdir(path.dirname(storePath), { recursive: true });

  const template = operationalBlueprintTemplateByKey("service-operation");
  assert(template, "Service Operation template should be available");

  const first = await publishBlueprintVersionCandidate({
    blueprintKey: "verify-service-operation",
    blueprintName: "Verify Service Operation",
    source: "DRAFT",
    sourceDraftId: "draft-verify-service-operation",
    sourceRegistryKey: "service-operation",
    workflowDefinition,
    workspaceDefinition,
    workflowValidation: { valid: true, issues: [], warnings: [] },
    operation: template.contract,
    publishedByUserId: "verify-user",
    store: { storePath },
  });

  assert(first.ok, "First publish should succeed");
  assert(
    first.version.version === template.contract.version + 1,
    "First publish should use the next version after the operation contract",
  );
  assert(
    first.version.operation.version === first.version.version,
    "Stored operation snapshot should carry the published version",
  );
  assert(
    first.version.creationPlan.initialWorkspaces.length > 0,
    "Published version should persist the create-space plan snapshot",
  );
  assert(
    first.version.snapshotMode === "NEW_WORKSPACES_ONLY",
    "Published version should preserve immutable Workspace snapshot semantics",
  );

  const second = await publishBlueprintVersionCandidate({
    blueprintKey: "verify-service-operation",
    blueprintName: "Verify Service Operation",
    source: "DRAFT",
    sourceDraftId: "draft-verify-service-operation",
    sourceRegistryKey: "service-operation",
    workflowDefinition,
    workspaceDefinition,
    workflowValidation: { valid: true, issues: [], warnings: [] },
    operation: template.contract,
    publishedByUserId: "verify-user",
    store: { storePath },
  });

  assert(second.ok, "Second publish should succeed");
  assert(
    second.version.version === first.version.version + 1,
    "Second publish should advance from latest persisted version",
  );

  first.version.operation.key = "mutated-in-memory";
  const published = await listBlueprintPublishedVersionsForBlueprint(
    "verify-service-operation",
    { storePath },
  );
  const firstFromStore = published.find(
    (record) => record.id === first.version.id,
  );

  assert(
    published.length === 2,
    "Published Blueprint versions should be append-only",
  );
  assert(
    firstFromStore?.operation.key === template.contract.key,
    "Returned version mutations should not mutate the persisted store",
  );

  const latest = await getLatestBlueprintPublishedVersion(
    "verify-service-operation",
    { storePath },
  );

  assert(
    latest?.id === second.version.id,
    "Latest published version should resolve by highest Blueprint version",
  );

  const blocked = await publishBlueprintVersionCandidate({
    blueprintKey: "verify-blocked-operation",
    blueprintName: "Verify Blocked Operation",
    source: "DRAFT",
    workflowDefinition,
    workspaceDefinition,
    workflowValidation: { valid: true, issues: [], warnings: [] },
    operation: null,
    store: { storePath },
  });

  assert(!blocked.ok, "Missing operation should block publish persistence");
  assert(
    blocked.publishPlan?.issues.some(
      (issue) => issue.code === "missing_operation",
    ),
    "Blocked publish should expose readiness issues",
  );

  await rm(storePath, { force: true });
  console.log("[sprint-85-verify] ok");
}

main().catch(async (error) => {
  await rm(storePath, { force: true });
  throw error;
});

