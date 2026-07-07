import type { BusinessEventInput } from "@/domains/event/server/business-event.service";
import {
  validateBusinessEventInput,
  type BusinessEventValidationIssue,
} from "@/domains/event/validator/business-event-validator";

export type BusinessEventEmitCommand = BusinessEventInput;

function formatValidationIssues(issues: BusinessEventValidationIssue[]) {
  return issues.map((issue) => issue.message).join(" ");
}

export function buildBusinessEventEmitCommand(
  input: BusinessEventEmitCommand,
): BusinessEventEmitCommand {
  const result = validateBusinessEventInput(input);

  if (!result.ok) {
    throw new Error(formatValidationIssues(result.issues));
  }

  return input;
}

