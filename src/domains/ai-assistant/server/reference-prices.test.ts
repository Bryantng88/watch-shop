import {test} from "node:test";
import assert from "node:assert/strict";
import {Prisma} from "@prisma/client";
import {referencePrice} from "./reference-prices";
test("reference pricing preserves decimal precision; missing/zero prices never mean free",()=>{
 const updatedAt=new Date("2026-11-05T00:00:00Z");
 assert.equal(referencePrice({salePrice:new Prisma.Decimal("1234567890123456.78"),listPrice:null,updatedAt}).salePrice,"1234567890123456.78");
 for(const salePrice of [null,new Prisma.Decimal(0),new Prisma.Decimal(-1)]){const missing=referencePrice({salePrice,listPrice:new Prisma.Decimal(3000000),updatedAt});assert.equal(missing.status,"NOT_SET");assert.equal(missing.salePrice,null);assert.equal(missing.listPrice,"3000000");assert.equal(missing.usage,"REFERENCE_ONLY");}
 assert.equal(referencePrice(undefined).updatedAt,null);
});
