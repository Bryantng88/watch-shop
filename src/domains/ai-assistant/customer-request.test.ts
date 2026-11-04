import assert from "node:assert/strict";import { test } from "node:test";
import { draftCustomerRequest, approveCustomerRequest, requestSummary, validateCustomerRequest } from "./customer-request";
import { newConversation, pageContext, readConversations } from "./simulation";
test("approval requires customer/watch/owner, conditions and recipients; no references exist before review",()=>{
 const r=draftCustomerRequest("Yêu cầu mẫu");assert.ok(validateCustomerRequest(r));assert.ok(r.conditions.every(c=>!c.linkedRef));
 r.customer="Khách demo";r.watch="SKU-DEMO";assert.equal(validateCustomerRequest(r),null);
 r.conditions[0].assignee="";assert.ok(validateCustomerRequest(r));assert.throws(()=>approveCustomerRequest(r));
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
