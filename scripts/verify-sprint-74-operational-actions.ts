import {
  operationalBlueprintForWorkType,
  type OperationalBlueprintAction,
  type OperationalBlueprintContract,
} from "@/domains/blueprint/shared/operational-blueprint";

type ExpectedAction = {
  key: string;
  workspaceRole: string;
  targetType: string;
  command: string;
  emits: string[];
};

const expectedActions: ExpectedAction[] = [
  {
    key: "classify_technical_issue",
    workspaceRole: "INSPECT",
    targetType: "TECHNICAL_ISSUE",
    command: "service.confirmTechnicalIssue",
    emits: ["technical_issue.confirmed"],
  },
  {
    key: "start_processing",
    workspaceRole: "PROCESSING",
    targetType: "TECHNICAL_ISSUE",
    command: "service.startTechnicalIssue",
    emits: ["technical_issue.started"],
  },
  {
    key: "complete_processing",
    workspaceRole: "PROCESSING",
    targetType: "TECHNICAL_ISSUE",
    command: "service.completeTechnicalIssue",
    emits: ["technical_issue.completed", "payment.created"],
  },
  {
    key: "raise_follow_up_issue",
    workspaceRole: "PROCESSING",
    targetType: "TECHNICAL_ISSUE",
    command: "service.createTechnicalIssue",
    emits: ["technical_issue.created"],
  },
];

function fail(message: string): never {
  throw new Error(`[sprint-74-verify] ${message}`);
}

function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) fail(`${label}: expected "${expected}", got "${actual}"`);
}

function assertIncludes(values: readonly string[], expected: string, label: string) {
  if (!values.includes(expected)) fail(`${label}: missing "${expected}"`);
}

function findAction(contract: OperationalBlueprintContract, key: string): OperationalBlueprintAction {
  return contract.actions.find((action) => action.key === key) ?? fail(`missing action "${key}"`);
}

function verifyAction(contract: OperationalBlueprintContract, expected: ExpectedAction) {
  const action = findAction(contract, expected.key);

  assertEqual(action.workspaceRole, expected.workspaceRole, `${expected.key}.workspaceRole`);
  assertEqual(action.targetType, expected.targetType, `${expected.key}.targetType`);
  assertEqual(action.command, expected.command, `${expected.key}.command`);

  for (const eventKey of expected.emits) {
    assertIncludes(action.emits, eventKey, `${expected.key}.emits`);
  }
}

function verifyEventRoutes(contract: OperationalBlueprintContract) {
  const routeKeys = new Set(contract.eventRoutes.map((route) => route.eventKey));

  for (const action of expectedActions) {
    for (const eventKey of action.emits) {
      assertIncludes([...routeKeys], eventKey, `eventRoutes`);
    }
  }
}

function verifyWorkflowTransitions(contract: OperationalBlueprintContract) {
  const actionKeys = new Set(contract.actions.map((action) => action.key));

  for (const workflow of contract.workflows) {
    for (const transition of workflow.transitions) {
      assertIncludes([...actionKeys], transition.actionKey, `${workflow.key}.transitions`);
    }
  }
}

function verifyProjectionSubscription(contract: OperationalBlueprintContract) {
  const watchList = contract.projectionSubscriptions.find(
    (subscription) => subscription.projectionKey === "watch-list",
  );

  if (!watchList) fail(`missing watch-list projection subscription`);

  for (const eventKey of ["technical_issue.completed", "payment.created"]) {
    assertIncludes(watchList.eventKeys, eventKey, "watch-list.eventKeys");
  }
}

function main() {
  const contract = operationalBlueprintForWorkType({
    workTypeKey: "service-operation",
    coordinationContext: "TECHNICAL",
  });

  if (!contract) fail("service-operation contract not found");

  for (const expected of expectedActions) verifyAction(contract, expected);
  verifyEventRoutes(contract);
  verifyWorkflowTransitions(contract);
  verifyProjectionSubscription(contract);

  console.log("[sprint-74-verify] ok");
}

main();
