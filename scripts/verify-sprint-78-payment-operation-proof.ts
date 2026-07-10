import {
  listRegistryBlueprints,
  operationalBlueprintForWorkType,
  validateOperationalBlueprintContract,
} from "@/domains/blueprint/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const paymentOperation = operationalBlueprintForWorkType({
  workTypeKey: "payment",
  coordinationContext: "PAYMENT",
});

assert(paymentOperation, "Payment operation contract should exist");
assert(
  paymentOperation.key === "payment-collection",
  "Payment operation should use payment-collection contract key",
);

const validation = validateOperationalBlueprintContract(paymentOperation);
assert(validation.ok, "Payment operation contract should pass validation");
assert(validation.issueCount === 0, "Payment operation should not report issues");

const roles = new Set(paymentOperation.workspaceRoles.map((role) => role.key));
for (const expectedRole of ["PAYMENT_INBOX", "PAYMENT_REVIEW", "PAYMENT_SETTLED"]) {
  assert(roles.has(expectedRole), `Payment operation should declare ${expectedRole}`);
}

const routes = new Set(paymentOperation.eventRoutes.map((route) => route.eventKey));
for (const expectedEvent of [
  "payment.created",
  "payment.status_updated",
  "payment.paid",
]) {
  assert(routes.has(expectedEvent), `Payment operation should route ${expectedEvent}`);
}

const actionKeys = new Set(paymentOperation.actions.map((action) => action.key));
for (const expectedAction of [
  "review_payment",
  "mark_payment_paid",
  "mark_payment_exception",
]) {
  assert(actionKeys.has(expectedAction), `Payment operation should declare ${expectedAction}`);
}

const paymentBlueprint = listRegistryBlueprints("PAYMENT").find(
  (blueprint) => blueprint.key === "payment",
);

assert(paymentBlueprint, "Payment registry blueprint should exist");
assert(paymentBlueprint.operation, "Payment registry blueprint should expose operation");
assert(
  paymentBlueprint.operationValidation?.ok,
  "Payment registry blueprint should expose passing operation validation",
);

console.log("[sprint-78-verify] ok");
