import assert from "node:assert/strict";
import {test} from "node:test";
import {archiveApproved,readableMessages,workerHistory,type AssistantState} from "./conversation-state";
import {newConversation} from "../simulation";
const actor={admin:false,permissions:new Set<string>()};
test("long history is retained while worker input stays bounded and clearly separates old notes",()=>{
 const s:AssistantState=newConversation(null);s.messages=Array.from({length:140},(_,i)=>({id:String(i),role:"user",text:"x".repeat(1000)}));
 const input=workerHistory(s,actor);
 assert.equal(input.messages.length,12);assert.equal(input.olderUserNotes.length,6000);assert.equal(s.messages.length,140);
});
test("current permissions redact saved assistant data and photo metadata, including legacy messages",()=>{
 const s:AssistantState=newConversation(null);s.messages=[{id:"u",role:"user",text:"My question"},{id:"a",role:"assistant",text:"private data",requiredPermissions:["CUSTOMER_VIEW"],imageProductIds:["p"]},{id:"b",role:"assistant",text:"legacy"}];
 const rows=readableMessages(s,actor);
 assert.equal(rows[0].text,"My question");assert.ok(!JSON.stringify(rows).includes("private data"));assert.ok(!JSON.stringify(rows).includes('"legacy"'));assert.equal(rows[1].imageProductIds,undefined);
 assert.equal(readableMessages(s,{admin:true,permissions:new Set()})[1].text,"private data");
});
test("approved work is archived once by approval revision and later outcomes replace only that snapshot",()=>{
 const s:AssistantState=newConversation(null);s.customerRequest={id:"r",reference:"YC-1",customer:"Chưa gắn hồ sơ khách",watch:"w",owner:"u",original:"request",status:"TRACKING",conditions:[],decision:"",reviewReady:true};
 const archived=archiveApproved(s,5);assert.equal(archived.approvedRequests?.length,1);assert.equal(s.approvedRequests,undefined);
 archived.customerRequest!.decision="Updated";const again=archiveApproved(archived,5);assert.equal(again.approvedRequests?.length,1);assert.equal(again.approvedRequests?.[0].request.decision,"Updated");
});
