import assert from "node:assert/strict";
import { test } from "node:test";
import { pageContext, newConversation, sampleSteps, removeStep, simulateReply, readConversations } from "./simulation";

test("detail context is pinned; list pages never imply a selected business record", () => {
  assert.equal(pageContext("/admin/orders/abc-123").id, "abc-123");
  assert.equal(pageContext("/admin/orders").kind, "list");
  assert.equal(pageContext("/admin/orders/new").id, undefined);
  const conversation = newConversation(pageContext("/admin/orders/one"));
  pageContext("/admin/orders/two");
  assert.equal(conversation.context?.id, "one");
});
test("removing a proposal removes dangling dependencies without mutating other plans", () => {
  const original=sampleSteps(), next=removeStep(original,"s2");
  assert.equal(next.length,2);assert.deepEqual(next[1].dependsOn,[]);assert.deepEqual(original[2].dependsOn,["s2"]);
});
test("clarification, error and denied scenarios produce no actionable proposal", () => {
  const context=pageContext("/admin/orders/demo");
  for(const scenario of ["clarify","error","denied"] as const) assert.equal(simulateReply("Đề xuất việc",scenario,context,false).steps.length,0);
  assert.equal(simulateReply("Bổ sung yêu cầu","clarify",context,true).steps.length,3);
  assert.equal(simulateReply("Tóm tắt tình hình","normal",context,false).steps.length,0);
});
test("history restores edited approvals and rejects corrupt or incompatible local records", () => {
  assert.deepEqual(readConversations("broken"),[]);assert.deepEqual(readConversations('{"messages":[]}'),[]);
  const c=newConversation(pageContext("/admin/orders/demo"));c.steps=sampleSteps();c.steps[0].title="Đã sửa";c.approved=true;c.tasks=c.steps.map(s=>({...s,status:"Chờ tiếp nhận (mẫu)"}));
  assert.equal(readConversations(JSON.stringify([c]))[0].tasks[0].title,"Đã sửa");
  assert.deepEqual(readConversations(JSON.stringify([{...c,steps:[null]}])),[]);
});
