import {test} from "node:test";
import assert from "node:assert/strict";
import {screenDescriptor,screenPathSchema,screenPathForMessage} from "./current-screen";
const actor=(...permissions:string[])=>({admin:false,permissions:new Set(permissions)});
test("screen hints use pathname and canonical page permissions, never client titles/URLs",()=>{
 for(const raw of ["https://evil.test/admin/orders","//evil.test","/admin/orders?id=secret","/admin/orders#phone","/admin/orders/../users","/admin/orders/%2fsecret"])assert.equal(screenPathSchema.safeParse(raw).success,false);
 assert.equal(screenDescriptor("/admin/orders/order-id",actor("PRODUCT_VIEW")),null);
 assert.equal(screenDescriptor("/admin/orders/order-id",actor("ORDER_VIEW"))?.detail?.kind,"ORDER");
 assert.equal(screenDescriptor("/admin/orders/new",actor("ORDER_CREATE"))?.detail,null);
 assert.equal(screenDescriptor("/admin/orders/new",actor("ORDER_VIEW")),null);
 assert.equal(screenDescriptor("/admin/unknown-private-record",{admin:true,permissions:new Set()}),null);
 assert.equal(screenDescriptor("/admin/personal-work",actor())?.label,"Quản lý công việc");
 assert.equal(screenDescriptor("/admin/task-items/private-id",actor("TASK_VIEW"))?.path,"/admin/task-items");
});
test("dedicated Ben is labeled explicitly and legacy fallback never guesses hardware or other tabs",()=>{
 const origin="https://admin-staging.example.test";
 assert.equal(screenDescriptor("/admin/ben",actor())?.label,"Ben mở riêng");
 assert.equal(screenPathForMessage(undefined,origin+"/admin/ben?private=discard#discard",origin),"/admin/ben");
 for(const ref of [null,"invalid",origin+"/admin/orders/private",origin,origin+".evil.test/admin/ben","https://evil.test/admin/ben","https://user:password@admin-staging.example.test/admin/ben"]){assert.equal(screenPathForMessage(undefined,ref,origin),undefined);}
 assert.equal(screenPathForMessage(null,origin+"/admin/ben",origin),null);
 assert.equal(screenPathForMessage("/admin/watches",origin+"/admin/ben",origin),"/admin/watches");
 assert.equal(screenPathForMessage("invalid",origin+"/admin/ben",origin),"invalid");
});
