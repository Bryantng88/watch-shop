import assert from "node:assert/strict";
import {test} from "node:test";
import {assignedRequests} from "./assigned-requests";
import {newConversation} from "./simulation";
import type {CustomerRequest} from "./customer-request";
const request=(reference:string,status:CustomerRequest["status"]="TRACKING"):CustomerRequest=>({id:"chat",reference,status,customer:"Chưa gắn hồ sơ khách",watch:"watch",owner:"user",original:"",conditions:[],decision:""});
test("pending drafts never appear as dispatched work",()=>{const c=newConversation(null);c.customerRequest=request("pending","DRAFT");assert.deepEqual(assignedRequests(c),[]);});
test("current and archived copies share one row, retaining current outcome routing",()=>{const c=newConversation(null);c.customerRequest=request("YC-1");c.approvedRequests=[{revision:4,request:request("YC-1")}];const rows=assignedRequests(c);assert.equal(rows.length,1);assert.equal(rows[0].current,true);assert.equal(rows[0].revision,4);});
test("legacy current work and earlier archives remain available newest first",()=>{const c=newConversation(null);c.revision=8;c.customerRequest=request("YC-2");c.approvedRequests=[{revision:4,request:request("YC-1")}];assert.deepEqual(assignedRequests(c).map(r=>[r.request.reference,r.current]),[["YC-2",true],["YC-1",false]]);assert.equal(c.approvedRequests.length,1);});
