function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeId(value: unknown) {
  return String(value ?? "").trim();
}

export function requiresTechnicalIssueVendorChangeNote(input: {
  executionStatus?: unknown;
  currentVendorId?: unknown;
  nextVendorId?: unknown;
}) {
  const executionStatus = normalizeStatus(input.executionStatus);
  const isAlreadyProcessing =
    executionStatus === "IN_PROGRESS" || executionStatus === "PROCESSING";

  if (!isAlreadyProcessing) return false;

  return normalizeId(input.currentVendorId) !== normalizeId(input.nextVendorId);
}
