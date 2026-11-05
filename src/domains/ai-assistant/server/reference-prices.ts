import type {Prisma} from "@prisma/client";
import type {DB} from "@/server/db/client";
import {hasAssistantPermission,type AssistantAuthority} from "../capabilities";
import type {AssistantLookup} from "../live-contract";
import {AssistantError} from "./access";
type PriceRow={salePrice:Prisma.Decimal|null;listPrice:Prisma.Decimal|null;updatedAt:Date};
export function referencePrice(row:PriceRow|undefined){
 const positive=(value:Prisma.Decimal|null|undefined)=>value?.gt(0)?value.toString():null;
 const salePrice=positive(row?.salePrice);
 return {salePrice,listPrice:positive(row?.listPrice),currency:"VND",status:salePrice===null?"NOT_SET":"AVAILABLE",updatedAt:row?.updatedAt.toISOString()??null,usage:"REFERENCE_ONLY"};
}
// Ben-only projection: even ADMIN never receives costs/minimums/internal notes.
export async function withWatchReferencePrices(db:DB,request:Extract<AssistantLookup,{tool:"watches.search"|"watches.detail"}>,result:Record<string,unknown>,actor:AssistantAuthority){
 if(!hasAssistantPermission(actor,"PRODUCT_VIEW"))throw new AssistantError("Bạn chưa có quyền xem sản phẩm.",403);
 const matches=request.tool==="watches.search"&&Array.isArray(result.matches)?result.matches as {id:string}[]:[];
 const ids=request.tool==="watches.search"?matches.slice(0,6).map(m=>m.id):result.id===request.productId?[request.productId]:[];
 if(!ids.length)return result;
 const rows=await db.watchPrice.findMany({where:{watch:{productId:{in:ids}}},select:{salePrice:true,listPrice:true,updatedAt:true,watch:{select:{productId:true}}}});
 const prices=new Map(rows.map(row=>[row.watch.productId,referencePrice(row)]));
 const priceFor=(id:string)=>prices.get(id)??referencePrice(undefined);
 return request.tool==="watches.search"?{...result,matches:matches.map(m=>({...m,pricing:priceFor(m.id)}))}:{...result,pricing:priceFor(request.productId)};
}
