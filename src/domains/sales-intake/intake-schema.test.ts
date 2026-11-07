import assert from "node:assert/strict";
import test from "node:test";
import { intakePlanSchema, lookupRequestSchema, requestIntakeSchema, type IntakePlan, type LookupEvidence } from "./intake-schema";
import { validateIntakeEvidence } from "./server/evidence";
const plan: IntakePlan = { summary: "Tư vấn", questions: [], leads: [{ key: "a", customerId: "customer-a", productId: "product-a", followups: [{ kind: "SALES_FOLLOWUP", description: "Kiểm tra rồi phản hồi khách" }] }] };
const entry = (tool: LookupEvidence["request"], result: Record<string, unknown>): LookupEvidence => ({ id: "e", at: new Date().toISOString(), request: tool, result });
const evidence: LookupEvidence[] = [entry({ tool: "customers.search", query: "Fixture A" }, { matches: [{ id: "customer-a" }], truncated: false }), entry({ tool: "watches.search", query: "SKU-A" }, { matches: [{ id: "product-a" }], truncated: false }), entry({ tool: "watches.detail", productId: "product-a" }, { id: "product-a" }), entry({ tool: "work.open", customerId: "customer-a", productId: "product-a" }, {})];

test("server schema allows only bounded internal followups, no assignment/order/payment fields or system markers", () => {
  assert.ok(intakePlanSchema.safeParse(plan).success);
  for (const followup of [{ kind: "CREATE_ORDER", description: "create" }, { kind: "SALES_FOLLOWUP", description: "workTypeKey: payment" }, { kind: "SALES_FOLLOWUP", description: "call", assignedToUserId: "rogue" }]) assert.equal(intakePlanSchema.safeParse({ ...plan, leads: [{ ...plan.leads[0], followups: [followup] }] }).success, false);
  assert.equal(lookupRequestSchema.safeParse({ tool: "customers.search", query: "a" }).success, false);
  assert.equal(lookupRequestSchema.safeParse({ tool: "sql", query: "SELECT *" }).success, false);
  assert.equal(requestIntakeSchema.safeParse({ text: "fixture", requestKey: "not-uuid" }).success, false);
});
test("unknown identities, omitted leads and duplicated followups cannot be silently applied", () => {
  for (const p of [{ ...plan, leads: [] }, { ...plan, leads: [{ ...plan.leads[0], customerId: null }] }, { ...plan, leads: [{ ...plan.leads[0], followups: [...plan.leads[0].followups, ...plan.leads[0].followups] }] }]) assert.equal(intakePlanSchema.safeParse(p).success, false);
  assert.ok(intakePlanSchema.safeParse({ summary: "Cần thông tin", questions: ["Khách nào?"], leads: [] }).success);
});
test("evidence cannot be invented, borrowed from another watch or disambiguated by arbitrarily picking an ID", () => {
  assert.deepEqual(validateIntakeEvidence(plan, evidence), []);
  assert.ok(validateIntakeEvidence(plan, evidence.filter(e => e.request.tool !== "work.open")).length);
  assert.ok(validateIntakeEvidence(plan, [...evidence, entry({ tool: "customers.search", query: "Fixture" }, { matches: [{ id: "customer-a" }, { id: "customer-b" }], truncated: false })]).some(message => message.includes("nhiều")));
  assert.ok(validateIntakeEvidence({ ...plan, leads: [{ ...plan.leads[0], productId: "invented" }] }, evidence).length);
  const accessoryPlan = { ...plan, leads: [{ ...plan.leads[0], followups: [{ kind: "VERIFY_ACCESSORY" as const, description: "Check" }] }] };
  assert.ok(validateIntakeEvidence(accessoryPlan, evidence).some(message => message.includes("phụ kiện")));
});
