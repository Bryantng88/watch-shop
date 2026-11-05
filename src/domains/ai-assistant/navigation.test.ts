import assert from "node:assert/strict";
import { test } from "node:test";
import { BEN_SCREENS, availableScreens, navigationTarget, resolveNavigation, navigationIntentSchema } from "./navigation";
const actor=(...permissions:string[])=>({admin:false,permissions:new Set(permissions)});
test("destinations are canonical existing admin view routes, never model URLs",()=>{
 for(const key of ["https://evil.test","//evil.test","javascript:alert(1)","/admin/watches","watches?delete=1","../orders"])assert.equal(navigationTarget(key,{admin:true,permissions:new Set()}),null);
 assert.equal(navigationTarget("watches",actor("PRODUCT_VIEW"))?.href,"/admin/watches");
 assert.equal(navigationTarget("orders",actor("PRODUCT_VIEW")),null);
 assert.ok(BEN_SCREENS.every(s=>s.href.startsWith("/admin")&&!s.href.endsWith("/new")));
});
test("the server advertises only authorized pages and rechecks revoked permissions",()=>{
 assert.ok(availableScreens(actor()).some(s=>s.key==="personal-work"));
 assert.equal(availableScreens(actor()).some(s=>s.key==="technical"),false);
 assert.ok(navigationTarget("technical",actor("SERVICE_VIEW")));
 assert.equal(navigationTarget("technical",actor()),null);
});
test("semantic intent is current-message bound, independent of wording, and never permission authority",()=>{
 const intent={type:"OPEN_SCREEN" as const,sourceMessageId:"current"};
 assert.equal(resolveNavigation("watches",intent,"current",actor("PRODUCT_VIEW")).code,"READY");
 assert.equal(resolveNavigation("watches",intent,"new",actor("PRODUCT_VIEW")).code,"STALE_INTENT");
 assert.equal(resolveNavigation("orders",intent,"current",actor()).code,"PERMISSION_DENIED");
 assert.equal(resolveNavigation("https://evil.test",intent,"current",actor("ORDER_VIEW")).code,"UNSUPPORTED_TARGET");
 for(const value of [{type:"OPEN_SCREEN",sourceMessageId:""},{type:"DELETE",sourceMessageId:"current"},{...intent,href:"/admin/orders"}])assert.equal(navigationIntentSchema.safeParse(value).success,false);
});
