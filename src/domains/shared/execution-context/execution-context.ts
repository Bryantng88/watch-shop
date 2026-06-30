export type ExecutionContext = {
  taskItemId?: string | null;
  taskId?: string | null;
  workCaseId?: string | null;
  executionId?: string | null;
};

const EXECUTION_CONTEXT_KEYS = [
  "taskItemId",
  "taskId",
  "workCaseId",
  "executionId",
] as const;

function clean(value: unknown) {
  return String(value ?? "").trim() || null;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function normalizeExecutionContext(value: unknown): ExecutionContext {
  const record = asRecord(value);

  return {
    taskItemId: clean(record.taskItemId),
    taskId: clean(record.taskId),
    workCaseId: clean(record.workCaseId),
    executionId: clean(record.executionId),
  };
}

export function readExecutionContextFromSearchParams(
  searchParams: URLSearchParams,
): ExecutionContext {
  return {
    taskItemId: clean(searchParams.get("taskItemId")),
    taskId: clean(searchParams.get("taskId")),
    workCaseId: clean(searchParams.get("workCaseId")),
    executionId: clean(searchParams.get("executionId")),
  };
}

// Keep this signature loose because API bodies arrive from mixed route parsers.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pickExecutionContextFromBody(body: any): ExecutionContext {
  const record = asRecord(body);
  const nested = normalizeExecutionContext(record.executionContext);
  const fallback = normalizeExecutionContext(record);

  return {
    taskItemId: nested.taskItemId ?? fallback.taskItemId,
    taskId: nested.taskId ?? fallback.taskId,
    workCaseId: nested.workCaseId ?? fallback.workCaseId,
    executionId: nested.executionId ?? fallback.executionId,
  };
}

export function appendExecutionContextToHref(
  href: string,
  context?: ExecutionContext | null,
): string {
  const serialized = serializeExecutionContext(context);
  const params = new URLSearchParams();

  for (const key of EXECUTION_CONTEXT_KEYS) {
    const value = serialized[key];
    if (value) params.set(key, value);
  }

  const query = params.toString();
  if (!query) return href;

  return `${href}${href.includes("?") ? "&" : "?"}${query}`;
}

export function serializeExecutionContext(
  context?: ExecutionContext | null,
): Record<string, string | null> {
  return {
    taskItemId: clean(context?.taskItemId),
    taskId: clean(context?.taskId),
    workCaseId: clean(context?.workCaseId),
    executionId: clean(context?.executionId),
  };
}
