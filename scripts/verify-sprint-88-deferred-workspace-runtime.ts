import { mkdir, rm } from "fs/promises";
import path from "path";
import {
  ensureDeferredWorkspaceFromPublishedBlueprintEvent,
  operationalBlueprintTemplateByKey,
  publishBlueprintVersionCandidate,
} from "@/domains/blueprint/server";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server";
import type { BlueprintWorkspaceDefinition } from "@/domains/blueprint/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const storePath = path.join(
  process.cwd(),
  ".tmp",
  `sprint-88-deferred-workspace-store-${Date.now()}.json`,
);

const workspaceDefinition: BlueprintWorkspaceDefinition = {
  defaultName: "Sprint 88 Operation Space",
  defaultDescription: "Verification operation space.",
  workspaceType: "Sprint 88 Operation Workspace",
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

const workflowDefinition: WorkflowDefinition = {
  key: "sprint-88",
  title: "Sprint 88",
  description: null,
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

  const publish = await publishBlueprintVersionCandidate({
    blueprintKey: "sprint-88-service-operation",
    blueprintName: "Sprint 88 Service Operation",
    source: "DRAFT",
    workflowDefinition,
    workspaceDefinition,
    workflowValidation: { valid: true, issues: [], warnings: [] },
    operation: template.contract,
    store: { storePath },
  });
  assert(publish.ok, "Publish should succeed for deferred runtime verification");

  const calls: string[] = [];
  const fakeDb = {
    task: {
      findFirst: async () => ({ id: "space-88" }),
    },
    taskExecution: {
      findFirst: async () => null,
    },
    taskItem: {
      findFirst: async () => null,
      create: async ({ data }: { data: { title: string; note: string } }) => {
        calls.push(data.note);
        assert(
          data.title.includes("SR Case") ||
            data.note.includes("operationWorkspaceRole: SR_CASE"),
          "Deferred workspace should target the SR_CASE role",
        );
        assert(
          data.note.includes("deferredWorkspaceTargetId: sr-88"),
          "Deferred workspace note should include the business object id",
        );
        return { id: "workspace-88" };
      },
    },
  };

  const result = await ensureDeferredWorkspaceFromPublishedBlueprintEvent({
    db: fakeDb as never,
    eventKey: "service_request.created",
    targetType: "SERVICE_REQUEST",
    targetId: "sr-88",
    workTypeKey: "service-operation",
    store: { storePath },
  });

  assert(result, "Deferred workspace should be created from published version");
  assert(result.created, "Deferred workspace should report created=true");
  assert(result.taskId === "space-88", "Deferred workspace should use the published Space");
  assert(result.taskItemId === "workspace-88", "Deferred workspace should return the created Workspace id");
  assert(result.workspaceRole === "SR_CASE", "Deferred workspace should resolve the operation role");
  assert(calls.length === 1, "Deferred workspace creation should create one TaskItem");

  const ignored = await ensureDeferredWorkspaceFromPublishedBlueprintEvent({
    db: fakeDb as never,
    eventKey: "technical_issue.created",
    targetType: "TECHNICAL_ISSUE",
    targetId: "ti-88",
    workTypeKey: "service-operation",
    store: { storePath },
  });

  assert(
    ignored === null,
    "Initial receiver roles should not be created by deferred workspace runtime",
  );

  await rm(storePath, { force: true });
  console.log("[sprint-88-verify] ok");
}

main().catch(async (error) => {
  await rm(storePath, { force: true });
  throw error;
});

