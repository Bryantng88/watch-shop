import assert from "node:assert/strict";
import {test} from "node:test";
import {assistantProductCards,productImageSource} from "./product-images";
import type {DB} from "@/server/db/client";
test("only server storage keys become media sources",()=>{
 for(const key of ["https://evil.test/a","//evil.test/a","javascript:alert(1)","/etc/passwd","a/../b",""])assert.equal(productImageSource(key),null);
 assert.equal(productImageSource("watches/a b.jpg"),"/api/media/sign?key=watches%2Fa%20b.jpg");
});
test("cards read only admin images, bound counts, and use real metadata",async()=>{
 let query:unknown;
 const db={product:{findMany:async(q:unknown)=>{query=q;return [{id:"watch",title:"Seiko",sku:null,productImage:[{fileKey:"real.jpg",alt:null},{fileKey:"https://evil.test/a",alt:"bad"}]}];}}} as unknown as DB;
 const cards=await assistantProductCards(db,["watch","watch"]);
 assert.deepEqual(cards,[{id:"watch",title:"Seiko",sku:null,images:[{src:"/api/media/sign?key=real.jpg",alt:"Seiko"}]}]);
 assert.deepEqual((query as {where:unknown}).where,{id:{in:["watch"]},type:"WATCH"});
 assert.deepEqual((query as {select:{productImage:{where:unknown;take:number}}}).select.productImage.where,{isForAdmin:true,role:{in:["INLINE","GALLERY"]}});
 assert.equal((query as {select:{productImage:{take:number}}}).select.productImage.take,4);
});
