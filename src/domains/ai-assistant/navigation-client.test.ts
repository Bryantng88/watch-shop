import assert from "node:assert/strict";
import {test} from "node:test";
import {takeNavigation} from "./navigation-client";
import type {Conversation} from "./simulation";
const pending={requestKey:"request",conversationId:"conversation"};
const row={id:"conversation",runStatus:"NEEDS_INFO",messages:[{id:"request",role:"user",text:"Navigate"},{id:"reply",role:"assistant",text:"Ready",navigationResult:{code:"READY"},navigationRequestKey:"request",navigation:{key:"orders",href:"/admin/orders",label:"Orders"}}]} as Conversation;
test("only current browser submission can consume ready navigation; history/reload/cancel cannot replay",()=>{
 assert.equal(takeNavigation(pending,row)?.href,"/admin/orders");
 for(const token of [null,{...pending,requestKey:"old"},{...pending,conversationId:"another"}])assert.equal(takeNavigation(token,row),null);
 for(const runStatus of ["QUEUED","RUNNING","FAILED","CANCELLED"])assert.equal(takeNavigation(pending,{...row,runStatus}),null);
 assert.equal(takeNavigation(pending,{...row,messages:[...row.messages,{id:"new",role:"user",text:"Never mind"}]}),null);
 assert.equal(takeNavigation(pending,{...row,messages:[row.messages[0],{...row.messages[1],navigationResult:{code:"PERMISSION_DENIED"}}]}),null);
 assert.equal(takeNavigation(pending,{...row,permissionRequest:{summary:"Support",revision:1}}),null);
});
