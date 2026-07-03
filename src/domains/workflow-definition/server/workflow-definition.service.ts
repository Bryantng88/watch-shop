import { listRegisteredWorkflowDefinitions } from "./workflow-definition.registry";
import { validateWorkflowDefinition } from "./workflow-definition.validation";

export function normalizeWorkflowDefinitionKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function listWorkflowDefinitions() {
  return listRegisteredWorkflowDefinitions();
}

export function listWorkflowDefinitionsWithValidation() {
  return listWorkflowDefinitions().map((definition) => ({
    definition,
    validation: validateWorkflowDefinition(definition),
    source: "STATIC_REGISTRY" as const,
  }));
}

export function getWorkflowDefinition(key: string) {
  const normalized = normalizeWorkflowDefinitionKey(key);

  return (
    listRegisteredWorkflowDefinitions().find(
      (definition) => normalizeWorkflowDefinitionKey(definition.key) === normalized,
    ) ?? null
  );
}

export function resolveWorkflowDefinition(workflowKey: string | null | undefined) {
  if (!workflowKey) return null;

  return getWorkflowDefinition(workflowKey);
}

export { validateWorkflowDefinition };
