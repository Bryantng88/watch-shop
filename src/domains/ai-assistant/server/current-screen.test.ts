import {test} from "node:test";
import assert from "node:assert/strict";
import {screenDescriptor,screenPathSchema} from "./current-screen";
const actor=(...permissions:string[])=>({admin:false,permissions:new Set(permissions)});
test("screen hints use pathname and canonical page permissions, never client titles/URLs",()=>{
 for(const raw of ["https://evil.test/admin/orders","//evil.test","/admin/orders?id=secret","/admin/orders#phone","/admin/orders/../users","/admin/orders/%2fsecret"])assert.equal(screenPathSchema.safeParse(raw).success,false);
 assert.equal(screenDescriptor("/admin/orders/order-id",actor("PRODUCT_VIEW")),null);
 assert.equal(screenDescriptor("/admin/orders/order-id",actor("ORDER_VIEW"))?.detail?.kind,"ORDER");
 assert.equal(screenDescriptor("/admin/orders/new",actor("ORDER_CREATE"))?.detail,null);
 assert.equal(screenDescriptor("/admin/orders/new",actor("ORDER_VIEW")),null);
 assert.equal(screenDescriptor("/admin/unknown-private-record",{admin:true,permissions:new Set()}),null);
 assert.equal(screenDescriptor("/admin/personal-work",actor())?.label,"Công việc của tôi");
 assert.equal(screenDescriptor("/admin/task-items/private-id",actor("TASK_VIEW"))?.path,"/admin/task-items");
});
