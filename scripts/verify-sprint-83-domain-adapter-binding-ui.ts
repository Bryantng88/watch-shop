import { operationalBlueprintTemplateByKey } from "@/domains/blueprint/server";
import {
  listOperationAdapterBindings,
  summarizeOperationAdapterBindings,
} from "@/domains/blueprint/shared/operation-adapter-bindings";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const serviceTemplate = operationalBlueprintTemplateByKey("service-operation");
assert(serviceTemplate, "Service Operation template should be available");

const serviceSummary = summarizeOperationAdapterBindings(serviceTemplate.contract);
assert(serviceSummary.total === 6, "Service Operation should declare six actions");
assert(
  serviceSummary.executable === 5,
  "Service Operation should expose five executable workspace adapter actions",
);
assert(
  serviceSummary.externalEntrypoints === 1,
  "Service Operation should expose one external Watch intake entrypoint",
);
assert(
  serviceSummary.declaredOnly === 0,
  "Service Operation should not have declared-only actions",
);

const serviceBindings = listOperationAdapterBindings(serviceTemplate.contract);
for (const expectedCommand of [
  "service.createTechnicalIssue",
  "service.confirmTechnicalIssue",
  "service.startTechnicalIssue",
  "service.completeTechnicalIssue",
]) {
  assert(
    serviceBindings.some(
      (binding) =>
        binding.command === expectedCommand && binding.status === "EXECUTABLE",
    ),
    `${expectedCommand} should be executable`,
  );
}

const paymentTemplate = operationalBlueprintTemplateByKey("payment-collection");
assert(paymentTemplate, "Payment Collection template should be available");

const paymentSummary = summarizeOperationAdapterBindings(paymentTemplate.contract);
assert(paymentSummary.total === 3, "Payment Collection should declare three actions");
assert(
  paymentSummary.executable === 0,
  "Payment Collection should not expose executable adapters yet",
);
assert(
  paymentSummary.declaredOnly === 3,
  "Payment Collection actions should be declared-only until adapter work",
);

console.log("[sprint-83-verify] ok");
