import assert from "node:assert/strict";
import { test } from "node:test";
import { applyQuickName, isQuickNameImageKey, quickNameResultSchema, quickNameTitle, quickNameRequestSchema } from "./quick-name";
import { buildWatchTitleFromForm } from "@/domains/watch/shared/watch-title-sku.helpers";
import { createEmptyWatchLine } from "../client/form/acquisition-form.mapper";
import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";
const facts={brandName:"Seiko",model:"5",referenceNumber:"7009",nickname:null,movementType:"AUTOMATIC" as const,notes:[]};
test("quick title shares full watch editor order, with no made-up year or unknown placeholders",()=>{
 const title=quickNameTitle(facts);
 assert.equal(title,"Seiko 5 7009 Automatic");
 const values={basic:{brandId:"",yearText:"",movementType:"AUTOMATIC"},spec:{specBrand:"Seiko",model:"5",referenceNumber:"7009",nickname:""}} as WatchFormValues;
 assert.equal(buildWatchTitleFromForm(values),title);
 assert.equal(quickNameTitle({...facts,model:null,referenceNumber:null,movementType:null}),"Seiko");
 assert.equal(quickNameTitle({...facts,brandName:null,model:null}),"");
 assert.throws(()=>quickNameResultSchema.parse({...facts,yearText:"1970"}));
 assert.throws(()=>quickNameResultSchema.parse({...facts,model:"x".repeat(121)}));
});
test("background result changes only the unchanged originating draft name",()=>{
 const line={...createEmptyWatchLine(),imageKey:"media/men/inline/a.jpg",quickInput:"Seiko",aiHint:"Mặt trắng",cost:1200000,salePrice:2000000};
 const source={id:line.id,imageKey:line.imageKey,audienceSegment:line.audienceSegment,quickInput:line.quickInput,aiHint:line.aiHint};
 assert.deepEqual(applyQuickName(line,source,"Seiko 5"),{...line,quickInput:"Seiko 5"});
 assert.equal(applyQuickName(line,source,null),line);
 for(const changed of [{quickInput:"Sửa tay"},{aiHint:"Sửa gợi ý"},{imageKey:"media/men/inline/b.jpg"},{audienceSegment:"WOMEN" as const},{tradeInSource:"CUSTOMER_PURCHASE" as const},{id:"other"}]){
 const next={...line,...changed};assert.equal(applyQuickName(next,source,"Seiko 5"),next);
 }
 const priced={...line,cost:1500000};assert.equal(applyQuickName(priced,source,"Seiko 5").cost,1500000);
});
test("only bounded NAS inline keys and non-duplicate batches are accepted",()=>{
 assert.equal(isQuickNameImageKey("media/men/inline/Nam 01.jpg","MEN"),true);
 for(const key of ["media/women/inline/a.jpg","media/men/inline/../secret.jpg","media/men/inline/%2e%2e/a.jpg","https://evil.invalid/a.jpg","media/men/inline/a.svg","media/men/inline/\\a.jpg"])assert.equal(isQuickNameImageKey(key,"MEN"),false);
 const source={id:"one",imageKey:"media/men/inline/a.jpg",audienceSegment:"MEN",quickInput:"",aiHint:""};
 assert.throws(()=>quickNameRequestSchema.parse({requestKey:"dc2148cf-52c7-4a53-9f6d-d10b96815bf7",lines:[source,source]}));
});
