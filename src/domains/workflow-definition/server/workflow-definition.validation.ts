import type {
  WorkflowDefinition,
  WorkflowTriggerType,
  WorkflowTransitionDefinition,
} from "./workflow-definition.types";
import { validateConditionDsl } from "./condition-dsl";

export type WorkflowDefinitionValidationResult = {
  valid: boolean;
  issues: string[];
  warnings: string[];
};

export type WorkflowDefinitionValidationOptions = {
  knownEventKeys?: string[];
  strictTerminalStates?: boolean;
};

const KNOWN_TRIGGER_TYPES = new Set<WorkflowTriggerType>([
  "EVENT",
  "MANUAL",
  "TIME",
  "CONDITION",
  "WEBHOOK",
  "CUSTOM",
]);

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function transitionKey(transition: WorkflowTransitionDefinition) {
  const keyedTransition = transition as WorkflowTransitionDefinition & {
    key?: unknown;
  };

  return clean(keyedTransition.key);
}

export function validateWorkflowDefinition(
  definition: WorkflowDefinition,
  options: WorkflowDefinitionValidationOptions = {},
): WorkflowDefinitionValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const key = clean(definition.key);
  const knownEventKeys = new Set(options.knownEventKeys ?? []);

  if (!key) issues.push("Workflow key is required.");

  const stateKeys = definition.states.map((state) => clean(state.key));
  const stateKeySet = new Set(stateKeys.filter(Boolean));

  if (stateKeys.some((stateKey) => !stateKey)) {
    issues.push("State key is required.");
  }

  const duplicateStates = stateKeys.filter(
    (stateKey, index) => stateKey && stateKeys.indexOf(stateKey) !== index,
  );

  for (const stateKey of Array.from(new Set(duplicateStates))) {
    issues.push(`Duplicate state key "${stateKey}".`);
  }

  if (!stateKeySet.has(clean(definition.initialState))) {
    issues.push(`Initial state "${definition.initialState}" does not exist.`);
  }

  for (const terminalState of definition.terminalStates) {
    if (!stateKeySet.has(clean(terminalState))) {
      issues.push(`Terminal state "${terminalState}" does not exist.`);
    }
  }

  const transitionKeys = definition.transitions
    .map(transitionKey)
    .filter(Boolean);
  const duplicateTransitions = transitionKeys.filter(
    (keyValue, index) => transitionKeys.indexOf(keyValue) !== index,
  );

  for (const keyValue of Array.from(new Set(duplicateTransitions))) {
    issues.push(`Duplicate transition key "${keyValue}".`);
  }

  definition.transitions.forEach((transition, index) => {
    const label = transitionKey(transition) || `transition ${index + 1}`;
    const fromState = clean(transition.fromState);
    const toState = clean(transition.toState);

    if (!stateKeySet.has(fromState)) {
      issues.push(`${label}: fromState "${transition.fromState}" does not exist.`);
    }

    if (!stateKeySet.has(toState)) {
      issues.push(`${label}: toState "${transition.toState}" does not exist.`);
    }

    if (!KNOWN_TRIGGER_TYPES.has(transition.triggerType)) {
      issues.push(`${label}: triggerType "${transition.triggerType}" is unknown.`);
      return;
    }

    if (!fromState) issues.push(`${label}: fromState is required.`);
    if (!toState) issues.push(`${label}: toState is required.`);

    if (transition.triggerType === "MANUAL") {
      if (!clean(transition.triggerValue)) {
        issues.push(`${label}: MANUAL transition needs actionKey/triggerValue.`);
      }
      if (!clean(transition.manualActionLabel)) {
        issues.push(`${label}: MANUAL transition needs manualActionLabel.`);
      }
    }

    if (transition.triggerType === "EVENT") {
      const eventKey = clean(transition.triggerValue);

      if (!eventKey) {
        issues.push(`${label}: EVENT transition needs triggerValue/eventKey.`);
      } else if (knownEventKeys.size > 0 && !knownEventKeys.has(eventKey)) {
        issues.push(`${label}: EVENT trigger "${eventKey}" is not in BusinessEvent Catalog.`);
      }
    }

    if (transition.triggerType === "CONDITION") {
      if (!transition.condition) {
        issues.push(`${label}: CONDITION transition needs condition DSL.`);
      } else {
        const conditionResult = validateConditionDsl(transition.condition);
        for (const issue of conditionResult.issues) {
          issues.push(`${label}: ${issue}`);
        }
      }
    }

    if (
      options.strictTerminalStates &&
      definition.terminalStates.includes(fromState)
    ) {
      issues.push(`${label}: terminal state "${fromState}" cannot transition out.`);
    }

    if (
      transition.triggerType === "TIME" ||
      transition.triggerType === "WEBHOOK" ||
      transition.triggerType === "CUSTOM"
    ) {
      warnings.push(`${label}: ${transition.triggerType} trigger is not runtime-enabled by Sprint 30.`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}
