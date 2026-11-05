import assert from "node:assert/strict";import { test } from "node:test";
import { collectCustomerRequest, customerRequestQuestion, draftCustomerRequest, approveCustomerRequest, requestSummary, validateCustomerRequest } from "./customer-request";
import { newConversation, pageContext, readConversations } from "./simulation";
test("contract: missing customer is asked in chat; stale ready flags never authorize a blank review",()=>{
 const starter=collectCustomerRequest("Ghi nhận yêu cầu khách hàng có điều kiện","");assert.equal(starter.request.customer,"");assert.match(starter.question,/chưa cung cấp thông tin khách hàng/);
 for(const ready of [undefined,true,false]){
  const legacy={...draftCustomerRequest("Cũ","SKU-DEMO"),customer:"   ",reviewReady:ready};
  assert.match(customerRequestQuestion(legacy),/khách hàng/);assert.throws(()=>approveCustomerRequest(legacy));
  const resumed=collectCustomerRequest("Khách Bình","",legacy);assert.equal(resumed.question,"");assert.equal(resumed.request.watch,"SKU-DEMO");assert.equal(resumed.request.conditions.length,2);
 }
});
test("complete sample chat becomes one review summary without entering form fields",()=>{
 const {request:r,question}=collectCustomerRequest("Khách Anh muốn mua watch SKU DEMO-001 nếu chống nước ổn và có thêm hai mắt dây. Minh kiểm tra, An tìm mắt dây.","");
 assert.equal(question,"");assert.equal(r.customer,"Anh");assert.equal(r.watch,"DEMO-001");assert.equal(r.reviewReady,true);assert.equal(r.conditions.length,2);
 assert.equal(r.conditions[0].kind,"TECHNICAL");assert.match(r.conditions[0].assignee,/Minh/);assert.equal(r.conditions[1].kind,"TASK");assert.match(r.conditions[1].assignee,/An/);assert.equal(r.status,"DRAFT");
});
test("missing facts are collected through successive messages without inventing recipients or unrelated conditions",()=>{
 const first=collectCustomerRequest("Khách Bình muốn mua nếu chống nước đạt.","");assert.equal(first.request.reviewReady,false);assert.match(first.question,/SKU/);assert.equal(first.request.conditions.length,1);assert.equal(first.request.conditions[0].assignee,"");
 const second=collectCustomerRequest("SKU ABC-123. Quang kiểm tra.","",first.request);assert.equal(second.request.watch,"ABC-123");assert.ok(second.question);assert.equal(second.request.conditions[0].assignee,"");
 const third=collectCustomerRequest("Minh kiểm tra chống nước.","",second.request);assert.equal(third.question,"");assert.equal(third.request.reviewReady,true);assert.equal(third.request.customer,"Bình");assert.equal(third.request.conditions.length,1);
});
test("approval requires customer/watch/owner, conditions and recipients; no references exist before review",()=>{
 const r=draftCustomerRequest("Yêu cầu mẫu");assert.ok(validateCustomerRequest(r));assert.ok(r.conditions.every(c=>!c.linkedRef));
 r.customer="Khách demo";r.watch="SKU-DEMO";assert.equal(validateCustomerRequest(r),null);
 r.conditions[0].assignee="";assert.ok(validateCustomerRequest(r));assert.throws(()=>approveCustomerRequest(r));
});
test("draft assignments and conditions can be changed through chat without form entry",()=>{
 const first=collectCustomerRequest("Khách Anh muốn mua SKU DEMO-001 nếu chống nước ổn và có mắt dây. Minh kiểm tra, An tìm mắt dây.","").request;
 const edited=collectCustomerRequest("Giao mắt dây cho Minh", "",first).request;
 assert.ok(edited.conditions.every(c=>c.assignee.startsWith("Minh")));
 const removed=collectCustomerRequest("Bỏ chống nước", "",edited).request;
 assert.equal(removed.conditions.length,1);assert.match(removed.conditions[0].requirement,/mắt dây/);
 const both=collectCustomerRequest("Giao cả hai cho Hà", "",first).request;
 assert.ok(both.conditions.every(c=>c.assignee.startsWith("Hà")));
 assert.equal(first.conditions.length,2);assert.match(first.conditions[1].assignee,/An/);
});
test("approval creates stable mock references per condition and is idempotent",()=>{
 const r=draftCustomerRequest("Mẫu","SKU");r.customer="Khách mẫu";const approved=approveCustomerRequest(r);
 assert.match(approved.reference,/^YC-MAU-/);assert.match(approved.conditions[0].linkedRef!,/^KT-MAU-/);assert.match(approved.conditions[1].linkedRef!,/^TASK-MAU-/);
 assert.deepEqual(approveCustomerRequest(approved),approved);assert.equal(r.status,"DRAFT");
});
test("completed work does not imply a satisfied purchase condition or create an order",()=>{
 const r=draftCustomerRequest("Mẫu","SKU");r.customer="Khách mẫu";const approved=approveCustomerRequest(r);
 approved.conditions.forEach(c=>c.progress="Hoàn tất");assert.ok(requestSummary(approved).includes("Chưa đủ"));
 approved.conditions[0].outcome="Không đạt";assert.ok(requestSummary(approved).includes("không đạt"));
 approved.conditions.forEach(c=>c.outcome="Đạt");assert.ok(requestSummary(approved).includes("chờ Sales"));assert.equal(approved.decision,"Chưa quyết định");
});
test("history retains the request, linked references and condition outcomes; malformed requests are rejected",()=>{
 const r=draftCustomerRequest("Mẫu","SKU");r.customer="Khách mẫu";const c=newConversation(pageContext("/admin/watches/demo"));c.customerRequest=approveCustomerRequest(r);
 assert.deepEqual(readConversations(JSON.stringify([c]))[0].customerRequest,c.customerRequest);
 assert.deepEqual(readConversations(JSON.stringify([{...c,customerRequest:{...r,conditions:[null]}}])),[]);
});
