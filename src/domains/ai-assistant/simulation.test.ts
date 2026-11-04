import assert from "node:assert/strict";
import { test } from "node:test";
import { isProductContext, followScreenWhileEmpty, pageContext, newConversation, sampleSteps, removeStep, simulateReply, readConversations } from "./simulation";

test("empty chats follow navigation; a sent message pins context and explicit free chat stays free", () => {
  const empty=newConversation(pageContext("/admin/products")), watch=pageContext("/admin/watches");
  assert.equal(followScreenWhileEmpty(empty,watch).context?.href,"/admin/watches");
  const sent={...empty,messages:[{id:"m1",role:"user" as const,text:"Tóm tắt"}]};
  assert.equal(followScreenWhileEmpty(sent,watch).context?.href,"/admin/products");
  assert.equal(followScreenWhileEmpty(newConversation(null),watch).context,null);
});

test("detail context is pinned; list pages never imply a selected business record", () => {
  assert.equal(pageContext("/admin/watches/abc-123").id, "abc-123");
  assert.equal(pageContext("/admin/watches").kind, "list");
  assert.equal(pageContext("/admin/watches/new").id, undefined);
  const conversation = newConversation(pageContext("/admin/watches/one"));
  pageContext("/admin/watches/two");
  assert.equal(conversation.context?.id, "one");
});
test("removing a proposal removes dangling dependencies without mutating other plans", () => {
  const original=sampleSteps(), next=removeStep(original,"s2");
  assert.equal(next.length,2);assert.deepEqual(next[1].dependsOn,[]);assert.deepEqual(original[2].dependsOn,["s2"]);
});
test("clarification, error and denied scenarios produce no actionable proposal", () => {
  const context=pageContext("/admin/watches/demo");
  for(const scenario of ["clarify","error","denied"] as const) assert.equal(simulateReply("Đề xuất việc",scenario,context,false).steps.length,0);
  assert.equal(simulateReply("Bổ sung yêu cầu","clarify",context,true).steps.length,3);
  assert.equal(simulateReply("Tóm tắt tình hình","normal",context,false).steps.length,0);
});
test("history restores edited approvals and rejects corrupt or incompatible local records", () => {
  assert.deepEqual(readConversations("broken"),[]);assert.deepEqual(readConversations('{"messages":[]}'),[]);
  const c=newConversation(pageContext("/admin/watches/demo"));c.steps=sampleSteps();c.steps[0].title="Đã sửa";c.approved=true;c.tasks=c.steps.map(s=>({...s,status:"Chờ tiếp nhận (mẫu)"}));
  assert.equal(readConversations(JSON.stringify([c]))[0].tasks[0].title,"Đã sửa");
  assert.deepEqual(readConversations(JSON.stringify([{...c,steps:[null]}])),[]);
});

test("only product pages provide business context",()=>{for(const path of ["/admin/dashboard","/admin/orders/123","/admin/customers/123","/admin/coordination/sales"]){const c=pageContext(path);assert.equal(c.kind,"unsupported");assert.equal(c.id,undefined);assert.equal(isProductContext(c),false);}assert.equal(isProductContext(pageContext("/admin/watches/123")),true);});
