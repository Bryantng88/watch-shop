import assert from "node:assert/strict";
import { test } from "node:test";
import type { DB } from "@/server/db/client";
import { getOrderTradeInForEditRepo } from "./order-detail.repo";

test("Order edit reads its latest linked trade-in through the supplied DB port", async () => {
  let query: unknown;
  const row={notes:"Trade-in fixture",audienceSegment:"MEN",totalAmount:100,acquisitionItem:[]};
  const db={acquisition:{findFirst:async (input:unknown)=>{query=input;return row;}}} as unknown as DB;
  assert.equal(await getOrderTradeInForEditRepo(db,"order-fixture"),row);
  assert.deepEqual(query,{
    where:{type:"TRADE_IN",acquisitionItem:{some:{orderItem:{orderId:"order-fixture"}}}},
    orderBy:{createdAt:"desc"},
    select:{totalAmount:true,notes:true,audienceSegment:true,acquisitionItem:{orderBy:{createdAt:"asc"},take:1,select:{productId:true,productTitle:true,unitCost:true,product:{select:{sku:true}}}}},
  });
});

test("missing trade-in remains null for the existing optional DTO mapping", async () => {
  const db={acquisition:{findFirst:async()=>null}} as unknown as DB;
  assert.equal(await getOrderTradeInForEditRepo(db,"no-trade-in"),null);
});
