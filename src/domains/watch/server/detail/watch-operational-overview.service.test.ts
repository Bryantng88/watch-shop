import test from "node:test";
import assert from "node:assert/strict";
import { TaskKind, TaskStatus } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { getWatchOperationalOverview } from "./watch-operational-overview.service";
import type { WatchServiceProjection } from "../../shared/watch-detail.projection";
const viewer = { id: "viewer", roles: [] as string[], permissions: ["TASK_VIEW"] };
const request = (id: string, status: string) => ({id,status,refNo:id,note:null,vendorName:null,issueCount:0,activeIssueCount:0,workspaceTaskItemId:null,workspaceHref:null,updatedAt:"2026-11-23T00:00:00Z",issues:[]});
const service: WatchServiceProjection = { requestCount:4,activeRequestCount:1,issueCount:0,activeIssueCount:0,requests:[request("done","COMPLETED"),request("delivered","DELIVERED"),request("open","OPEN"),request("cancelled","CANCELED")] };
const row = (id: string, owner: string, status: TaskStatus = TaskStatus.TODO) => ({ id,title:id,status,updatedAt:new Date("2026-11-23T00:00:00Z"),completedAt:status === "DONE" ? new Date("2026-11-22T00:00:00Z") : null,note:"private server-only access note",userId:owner,assignedToUserId:owner,assignedToUser:{name:owner},task:{kind:TaskKind.BUSINESS,createdByUserId:owner,assignedToUserId:owner} });
function fixture(saleStage="READY",productStatus="ACTIVE") {
 const calls: unknown[]=[];let count=0;
 const db = {watch:{findUnique:async()=>({id:"watch-id",saleStage,stockStage:"IN_STOCK",product:{status:productStatus}})},taskItem:{findMany:async(input:unknown)=>{calls.push(input);return count++ === 0 ? [row("active","viewer"),row("done","viewer",TaskStatus.DONE),row("hidden","other"),row("cancelled","viewer",TaskStatus.CANCELLED)] : [row("personal","viewer")] }},task:{findMany:async()=>[row("legacy","viewer",TaskStatus.DONE)]}} as unknown as DB;
 return {db,calls};
}
test("overview uses current sale/consignment and completed requests, excluding canceled service",async()=>{
 const {db}=fixture("CONSIGNED_TO","ACTIVE");const result=await getWatchOperationalOverview(db,"product-id",viewer,service);
 assert.equal(result?.sale,"CONSIGNED_TO");assert.equal(result?.consignment,"CONSIGNED_TO");assert.equal(result?.serviceCompleted,2);assert.equal(result?.serviceOpen,1);
 const sold=await getWatchOperationalOverview(fixture("SOLD","CONSIGNED_FROM").db,"product-id",viewer,service);assert.equal(sold?.sale,"SOLD");assert.equal(sold?.consignment,"NONE");
});
test("work reuses visibility rules and never exposes private notes or hidden/canceled work",async()=>{
 const {db,calls}=fixture();const result=await getWatchOperationalOverview(db,"product-id",viewer,service);
 assert.deepEqual(result?.active.map(item=>item.id),["active","personal"]);assert.deepEqual(result?.completed.map(item=>item.id),["done","legacy"]);
 assert.doesNotMatch(JSON.stringify(result),/hidden|private server-only|createdByUserId/);
 const where=JSON.stringify(calls);assert.match(where,/watch-id/);assert.match(where,/product-id/);assert.match(where,/SERVICE_REQUEST/);assert.match(where,/personalOwnerUserId/);assert.match(where,/personalShares/);
});
test("product-only viewers do not query or receive related task data",async()=>{
 const {db,calls}=fixture();const result=await getWatchOperationalOverview(db,"product-id",{...viewer,permissions:[]},service);
 assert.equal(result?.workVisible,false);assert.deepEqual(result?.active,[]);assert.deepEqual(result?.completed,[]);assert.equal(calls.length,0);
});

test("missing records and read errors never become fake empty success",async()=>{
 const missing={watch:{findUnique:async()=>null}} as unknown as DB;
 assert.equal(await getWatchOperationalOverview(missing,"missing",viewer,service),null);
 const broken={watch:{findUnique:async()=>{throw new Error("read failed")}}} as unknown as DB;
 await assert.rejects(getWatchOperationalOverview(broken,"broken",viewer,service),/read failed/);
 const sold=await getWatchOperationalOverview(fixture("READY","SOLD").db,"product-id",viewer,service);assert.equal(sold?.sale,"SOLD");
});
