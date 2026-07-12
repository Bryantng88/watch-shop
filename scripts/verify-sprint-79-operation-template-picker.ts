import {
  listOperationalBlueprintTemplates,
  operationalBlueprintTemplateByKey,
  validateOperationalBlueprintContract,
} from "@/domains/blueprint/server";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const templates = listOperationalBlueprintTemplates();
const templateKeys = new Set(templates.map((template) => template.key));

assert(templateKeys.has("service-operation"), "Service Operation template should exist");
assert(templateKeys.has("payment-collection"), "Payment Collection template should exist");
assert(templateKeys.has("blank-operation"), "Blank Operation template should exist");
assert(templates.length === templateKeys.size, "Template keys should be unique");

for (const template of templates) {
  const validation = validateOperationalBlueprintContract(template.contract);
  assert(
    validation.ok,
    `${template.label} template should pass operation validation`,
  );
}

const serviceTemplate = operationalBlueprintTemplateByKey("service-operation");
assert(serviceTemplate, "Service Operation template should be resolvable by key");
assert(
  serviceTemplate.contract.workspaceRoles.some((role) => role.key === "SR_CASE"),
  "Service Operation template should include SR_CASE role",
);

const paymentTemplate = operationalBlueprintTemplateByKey("payment-collection");
assert(paymentTemplate, "Payment Collection template should be resolvable by key");
assert(
  paymentTemplate.contract.workspaceRoles.some(
    (role) => role.key === "PAYMENT_REVIEW",
  ),
  "Payment Collection template should include PAYMENT_REVIEW role",
);

const blankTemplate = operationalBlueprintTemplateByKey("blank-operation");
assert(blankTemplate, "Blank Operation template should be resolvable by key");
assert(
  blankTemplate.contract.objectTypes.length === 0 &&
    blankTemplate.contract.workspaceRoles.length === 0,
  "Blank Operation template should start as an editable empty shell",
);

const firstRead = listOperationalBlueprintTemplates()[0];
firstRead.contract.workspaceRoles.push({
  key: "MUTATION_CHECK",
  label: "Mutation check",
  cardinality: "SINGLE_PER_ACTIVE_CYCLE",
  identityTargetType: null,
  itemTargetTypes: [],
  description: "This mutation should not leak to future template reads.",
});

const secondRead = listOperationalBlueprintTemplates()[0];
assert(
  !secondRead.contract.workspaceRoles.some((role) => role.key === "MUTATION_CHECK"),
  "Template reads should return isolated contract clones",
);

console.log("[sprint-79-verify] ok");
