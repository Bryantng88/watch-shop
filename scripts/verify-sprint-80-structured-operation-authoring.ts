import {
  operationalBlueprintTemplateByKey,
  validateOperationalBlueprintContract,
} from "@/domains/blueprint/server";
import {
  appendOperationActionField,
  appendOperationListItem,
  cloneOperationalBlueprintContract,
  patchOperationActionField,
  patchOperationListItem,
  patchOperationRoot,
  removeOperationActionField,
  removeOperationListItem,
} from "@/domains/blueprint/shared/operation-authoring";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const template = operationalBlueprintTemplateByKey("service-operation");
assert(template, "Service Operation template should be available");

const original = template.contract;
const cloned = cloneOperationalBlueprintContract(original);
const renamed = patchOperationRoot(cloned, {
  key: "service-operation-edited",
  summary: "Edited in structured authoring verification.",
});

assert(renamed.key === "service-operation-edited", "Root key should update");
assert(
  original.key === "service-operation",
  "Root patch should not mutate the original template",
);

const withObject = appendOperationListItem(renamed, "objectTypes", {
  targetType: "FOLLOW_UP",
  label: "Follow up",
  role: "ITEM",
  description: "Verification object type.",
});

const withRole = appendOperationListItem(withObject, "workspaceRoles", {
  key: "FOLLOW_UP",
  label: "Follow up",
  cardinality: "SINGLE_PER_ACTIVE_CYCLE",
  identityTargetType: null,
  itemTargetTypes: ["FOLLOW_UP"],
  description: "Verification workspace role.",
});

const updatedRole = patchOperationListItem(
  withRole,
  "workspaceRoles",
  withRole.workspaceRoles.length - 1,
  { label: "Follow-up Review" },
);

assert(
  updatedRole.workspaceRoles.some((role) => role.label === "Follow-up Review"),
  "Workspace role label should update",
);

const withAction = appendOperationListItem(updatedRole, "actions", {
  key: "review_follow_up",
  label: "Review follow-up",
  workspaceRole: "FOLLOW_UP",
  targetType: "FOLLOW_UP",
  command: "service.reviewFollowUp",
  fields: [],
  emits: ["follow_up.reviewed"],
  description: "Verification action.",
});
const actionIndex = withAction.actions.length - 1;

const withFlow = appendOperationListItem(withAction, "coreFlows", {
  key: "follow-up-flow",
  label: "Follow-up Flow",
  description: "Verification flow.",
  steps: [
    {
      workspaceRole: "FOLLOW_UP",
      label: "Follow up",
      description: "Verification flow step.",
      isEntry: true,
      isTerminal: true,
    },
  ],
});

const withWorkflow = appendOperationListItem(withFlow, "workflows", {
  key: "follow-up-workflow",
  workspaceRole: "FOLLOW_UP",
  states: ["READY", "DONE"],
  transitions: [
    {
      from: "READY",
      to: "DONE",
      actionKey: "review_follow_up",
      eventKey: "follow_up.reviewed",
    },
  ],
});

const withField = appendOperationActionField(withWorkflow, actionIndex, {
  key: "note",
  label: "Note",
  kind: "textarea",
  required: false,
});
const updatedField = patchOperationActionField(withField, actionIndex, 0, {
  required: true,
});

assert(
  updatedField.actions[actionIndex].fields[0]?.required,
  "Action field should update",
);

const removedField = removeOperationActionField(updatedField, actionIndex, 0);
assert(
  removedField.actions[actionIndex].fields.length === 0,
  "Action field should be removable",
);

const withProjection = appendOperationListItem(
  removedField,
  "projectionSubscriptions",
  {
    projectionKey: "follow-up-list",
    eventKeys: ["follow_up.reviewed"],
    resolvesToTargetType: "FOLLOW_UP",
    description: "Verification projection.",
  },
);

assert(
  validateOperationalBlueprintContract(withProjection).ok,
  "Structured edits should keep the operation valid",
);

const withoutProjection = removeOperationListItem(
  withProjection,
  "projectionSubscriptions",
  withProjection.projectionSubscriptions.length - 1,
);

assert(
  withoutProjection.projectionSubscriptions.every(
    (subscription) => subscription.projectionKey !== "follow-up-list",
  ),
  "Projection subscription should be removable",
);

console.log("[sprint-80-verify] ok");
