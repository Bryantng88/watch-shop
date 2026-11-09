import assert from "node:assert/strict";
import { test } from "node:test";
import { assistantCapabilities, lookupAllowed, planDeniedReason } from "./capabilities";
import {getAdminApiPolicy,isAdminAccessAllowed} from "@/server/auth/admin-api-policy";
const actor = (...permissions:string[]) => ({admin:false,permissions:new Set(permissions)});
const plan = {customerId:null,productId:"watch",conditions:[{key:"c1",requirement:"Check",expected:"Report",kind:"TASK" as const,assigneeUserId:"u",technicalDetailId:null}]};
test("only the exact authenticated Ben conversation endpoint admits chat without business permissions",()=>{
 for(const method of ["GET","POST"])assert.equal(isAdminAccessAllowed(getAdminApiPolicy("/api/admin/customer-assistant",method),new Set()),true);
 for(const [path,method] of [["/api/admin/customer-assistant/arbitrary","POST"],["/api/admin/customer-assistant","DELETE"],["/api/admin/not-a-route","GET"],["/api/admin/watches","POST"]])assert.equal(isAdminAccessAllowed(getAdminApiPolicy(path,method),new Set()),false);
});
test("chat allows navigation but does not grant business tools or actions",()=>{
 assert.deepEqual(assistantCapabilities(actor()).allowedLookups,["navigation.open"]);
 assert.ok(planDeniedReason(actor(),plan));
 assert.equal(lookupAllowed(actor(),"orders.create"),false);
});
test("read and write capabilities remain distinct and permission implications are honored",()=>{
 const viewer=actor("PRODUCT_VIEW","TASK_VIEW");
 assert.equal(lookupAllowed(viewer,"watches.search"),true);
 assert.equal(lookupAllowed(viewer,"customers.search"),false);
 assert.equal(lookupAllowed(viewer,"technical.catalog"),false);
 assert.equal(assistantCapabilities(viewer).canCreateTasks,false);
 assert.ok(planDeniedReason(viewer,plan));
 assert.equal(planDeniedReason(actor("PRODUCT_UPDATE","TASK_MANAGE"),plan),null);
 assert.ok(planDeniedReason(actor("PRODUCT_VIEW","TASK_MANAGE"),{...plan,customerId:"private-customer"}));
 assert.ok(planDeniedReason(actor("PRODUCT_VIEW","TASK_MANAGE"),{...plan,conditions:[{...plan.conditions[0],kind:"TECHNICAL",technicalDetailId:"catalog"}]}));
 assert.equal(assistantCapabilities(actor("PRODUCT_VIEW","TASK_VIEW","SERVICE_CREATE")).canCreateTechnical,true);
});
test("revocation removes lookup capability; unknown tools fail closed even for admin",()=>{
 assert.equal(lookupAllowed(actor("CUSTOMER_VIEW"),"customers.search"),true);
 assert.equal(lookupAllowed(actor(),"customers.search"),false);
 assert.equal(lookupAllowed({admin:true,permissions:new Set()},"sql"),false);
});

test('daily order and technical lists are independently scoped read capabilities',()=>{
 assert.equal(lookupAllowed(actor('ORDER_VIEW'),'orders.list'),true);
 assert.equal(lookupAllowed(actor('ORDER_VIEW'),'technicalIssues.list'),false);
 assert.equal(lookupAllowed(actor('SERVICE_VIEW'),'technicalIssues.list'),true);
 assert.equal(lookupAllowed(actor('SERVICE_VIEW'),'orders.list'),false);
 assert.equal(lookupAllowed(actor('TASK_VIEW'),'technicalIssues.list'),false);
 assert.equal(lookupAllowed(actor('ORDER_CREATE'),'orders.list'),true);
});
