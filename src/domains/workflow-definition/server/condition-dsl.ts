export type ConditionDslOperator =
  | "equals"
  | "notEquals"
  | "exists"
  | "notExists";

export type ConditionDslValue = string | number | boolean | null;

export type SimpleConditionDsl = {
  field: string;
  operator: ConditionDslOperator;
  value?: ConditionDslValue;
};

export type GroupConditionDsl =
  | { all: ConditionDsl[] }
  | { any: ConditionDsl[] };

export type ConditionDsl = SimpleConditionDsl | GroupConditionDsl;

export type ConditionDslValidationResult = {
  valid: boolean;
  issues: string[];
};

const OPERATORS = new Set<ConditionDslOperator>([
  "equals",
  "notEquals",
  "exists",
  "notExists",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedFieldPath(value: string) {
  return (
    value.startsWith("workflowRuntime.") ||
    value.startsWith("itemRuntime.") ||
    value.startsWith("item.")
  );
}

function isConditionDslValue(value: unknown): value is ConditionDslValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function validateNode(condition: unknown, path: string, issues: string[]) {
  if (!isRecord(condition)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  const hasAll = Object.prototype.hasOwnProperty.call(condition, "all");
  const hasAny = Object.prototype.hasOwnProperty.call(condition, "any");

  if (hasAll || hasAny) {
    if (hasAll && hasAny) {
      issues.push(`${path} cannot use both all and any.`);
      return;
    }

    const key = hasAll ? "all" : "any";
    const children = condition[key];

    if (!Array.isArray(children) || children.length === 0) {
      issues.push(`${path}.${key} must be a non-empty array.`);
      return;
    }

    children.forEach((child, index) => {
      validateNode(child, `${path}.${key}[${index}]`, issues);
    });
    return;
  }

  const field = condition.field;
  const operator = condition.operator;

  if (typeof field !== "string" || field.trim().length === 0) {
    issues.push(`${path}.field is required.`);
  } else if (!isAllowedFieldPath(field.trim())) {
    issues.push(
      `${path}.field must start with workflowRuntime., itemRuntime., or item.`,
    );
  }

  if (typeof operator !== "string" || !OPERATORS.has(operator as ConditionDslOperator)) {
    issues.push(`${path}.operator is invalid.`);
    return;
  }

  if (
    (operator === "equals" || operator === "notEquals") &&
    !Object.prototype.hasOwnProperty.call(condition, "value")
  ) {
    issues.push(`${path}.value is required for ${operator}.`);
  }

  if (
    Object.prototype.hasOwnProperty.call(condition, "value") &&
    !isConditionDslValue(condition.value)
  ) {
    issues.push(`${path}.value must be a string, number, boolean, or null.`);
  }
}

export function validateConditionDsl(
  condition: unknown,
): ConditionDslValidationResult {
  const issues: string[] = [];
  validateNode(condition, "condition", issues);

  return {
    valid: issues.length === 0,
    issues,
  };
}

function formatValue(value: unknown) {
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

export function describeConditionDsl(condition: unknown): string {
  if (!isRecord(condition)) return "Invalid condition";

  if (Array.isArray(condition.all)) {
    return condition.all.map(describeConditionDsl).join(" AND ");
  }

  if (Array.isArray(condition.any)) {
    return condition.any.map(describeConditionDsl).join(" OR ");
  }

  const field = typeof condition.field === "string" ? condition.field : "field";
  const operator =
    typeof condition.operator === "string" ? condition.operator : "operator";

  if (operator === "exists") return `${field} exists`;
  if (operator === "notExists") return `${field} does not exist`;

  return `${field} ${operator} ${formatValue(condition.value)}`;
}
