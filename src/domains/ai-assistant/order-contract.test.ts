import assert from "node:assert/strict";import {test} from "node:test";
import {assistantOrderSchema,orderDeniedPermission,orderHasEvidence,type AssistantOrderPlan} from "./order-contract";
const plan:AssistantOrderPlan={customerId:null,customerName:"Khách mẫu",phone:null,hasShipment:false,address:null,city:null,district:null,ward:null,paymentMethod:"CASH",notes:null,items:[{productId:"watch",unitPriceAgreed:2_000_000}]};
test("order plans accept only explicit watch prices and complete delivery facts",()=>{
 assert.ok(assistantOrderSchema.safeParse(plan).success);
 for(const invalid of [{...plan,status:"POSTED"},{...plan,items:[{productId:"watch",unitPriceAgreed:10_000_000_000}]},{...plan,items:[{productId:"watch",unitPriceAgreed:0}]},{...plan,items:[...plan.items,...plan.items]},{...plan,hasShipment:true},{...plan,paymentMethod:"COD"},{...plan,address:"unexpected address"}])assert.equal(assistantOrderSchema.safeParse(invalid).success,false);
});
test("order and customer creation permissions remain independent of task management",()=>{
 const actor={admin:false,permissions:new Set(["ORDER_CREATE","PRODUCT_VIEW"])};assert.equal(orderDeniedPermission(actor,plan),null);
 assert.equal(orderDeniedPermission(actor,{...plan,customerId:"customer"}),"CUSTOMER_VIEW");
 assert.ok(orderDeniedPermission(actor,{...plan,phone:"0900000000"}));assert.equal(orderDeniedPermission({...actor,permissions:new Set(["TASK_MANAGE","PRODUCT_VIEW"])},plan),"ORDER_CREATE");
 assert.equal(orderHasEvidence(plan,[]),false);
});
