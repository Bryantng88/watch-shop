export type ServiceOperationTechnicalIssueStage =
  | "INSPECT"
  | "READY"
  | "IN_PROGRESS"
  | "DONE";

export type TechnicalIssueStageInput = {
  executionStatus?: string | null;
  isConfirmed?: boolean | null;
};

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export function getTechnicalIssueOperationStage(
  issue: TechnicalIssueStageInput,
): ServiceOperationTechnicalIssueStage {
  const status = normalizeStatus(issue.executionStatus);

  if (status === "DONE" || status === "COMPLETED") return "DONE";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  if (status === "CONFIRMED") return "READY";
  if (status === "OPEN" && issue.isConfirmed) return "READY";

  return "INSPECT";
}

export function getTechnicalIssueBoardColumn(issue: TechnicalIssueStageInput) {
  const stage = getTechnicalIssueOperationStage(issue);

  if (stage === "INSPECT") return "PENDING_CONFIRM";
  if (stage === "READY") return "READY";
  if (stage === "IN_PROGRESS") return "IN_PROGRESS";
  return "DONE";
}

