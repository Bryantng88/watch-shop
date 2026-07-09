import { ServiceRequestStatus } from "@prisma/client";

export type ServiceRequestStatusIssueInput = {
  executionStatus?: string | null;
};

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export function isTechnicalIssueCanceled(status: unknown) {
  const normalized = normalizeStatus(status);
  return normalized === "CANCELED" || normalized === "CANCELLED";
}

export function isTechnicalIssueDone(status: unknown) {
  const normalized = normalizeStatus(status);
  return normalized === "DONE" || normalized === "COMPLETED";
}

export function deriveServiceRequestStatusFromTechnicalIssues(
  currentStatus: ServiceRequestStatus | string | null | undefined,
  issues: ServiceRequestStatusIssueInput[],
): ServiceRequestStatus {
  const normalizedCurrent = normalizeStatus(currentStatus);

  if (normalizedCurrent === ServiceRequestStatus.CANCELED) {
    return ServiceRequestStatus.CANCELED;
  }

  if (normalizedCurrent === ServiceRequestStatus.DELIVERED) {
    return ServiceRequestStatus.DELIVERED;
  }

  const activeIssues = issues.filter(
    (issue) => !isTechnicalIssueCanceled(issue.executionStatus),
  );

  if (activeIssues.length === 0) {
    return (currentStatus as ServiceRequestStatus) || ServiceRequestStatus.DRAFT;
  }

  const allDone = activeIssues.every((issue) =>
    isTechnicalIssueDone(issue.executionStatus),
  );

  return allDone ? ServiceRequestStatus.COMPLETED : ServiceRequestStatus.IN_PROGRESS;
}

