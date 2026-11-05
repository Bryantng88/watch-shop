import assert from "node:assert/strict";
import { test } from "node:test";
import { BEN_SCREENS, availableScreens, navigationTarget, isNavigationRequest } from "./navigation";
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
test("mentioning a screen alone is not a navigation request",()=>{
 assert.equal(isNavigationRequest("Danh sách đồng hồ có bao nhiêu chiếc?"),false);
 assert.equal(isNavigationRequest("Ben mở công việc của tôi đi"),true);
});

test("natural Vietnamese navigation requests from staging are recognized",()=>{
 for(const text of ["đưa mình đến màn hình sản phẩm nhé", "ok, đưa mình tới màn hình sản phẩm nhé", "Ben dẫn tôi sang trang đơn hàng", "tới màn hình công việc của tôi", "đưa   mình\nđến màn hình sản phẩm", "đưa mình đến màn hình sản phẩm".normalize("NFD")])assert.equal(isNavigationRequest(text),true,text);
 for(const text of ["màn hình sản phẩm có gì", "đồng hồ này là của mình", "đến hôm nay còn bao nhiêu chiếc", "Ben có hỗ trợ điều này không"])assert.equal(isNavigationRequest(text),false,text);
});
