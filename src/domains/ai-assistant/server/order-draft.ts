import type {DB} from "@/server/db/client";
import {executeIntakeLookup} from "@/domains/sales-intake/server/intake-lookups";
import type {Evidence} from "../live-contract";
import {orderHasEvidence,type AssistantOrderPlan,type AssistantOrderDraft} from "../order-contract";
import {AssistantError} from "./access";
export async function prepareOrder(db:DB,raw:AssistantOrderPlan,revision:number,entries:Evidence[]):Promise<AssistantOrderDraft>{
 if(!orderHasEvidence(raw,entries))throw new AssistantError("Chưa xác minh đủ đồng hồ hoặc khách hàng để chuẩn bị đơn.",409);
 const plan=structuredClone(raw),items=[];
 if(plan.customerId){const customer=await db.customer.findUnique({where:{id:plan.customerId},select:{id:true,name:true,updatedAt:true}});const seen=entries.filter(e=>e.request.tool==="customers.search").flatMap(e=>e.result.matches as {id:string;version:string}[]||[]).find(c=>c.id===plan.customerId);if(!customer||seen?.version!==customer.updatedAt.toISOString())throw new AssistantError("Hồ sơ khách đã thay đổi. Hãy tra cứu lại trước khi tạo đơn.",409);plan.customerName=customer.name;}
 else if(plan.phone&&await db.customer.findFirst({where:{phone:plan.phone},select:{id:true}}))throw new AssistantError("Số điện thoại đã có hồ sơ khách. Cần tra cứu và chọn đúng hồ sơ trước khi tạo đơn.",409);
 for(const line of plan.items){
  if(!await db.product.findFirst({where:{id:line.productId,type:"WATCH",contentStatus:{not:"ARCHIVED"}},select:{id:true}}))throw new AssistantError("Đồng hồ không còn khả dụng để tạo đơn.",409);
  const now=await executeIntakeLookup(db,{tool:"watches.detail",productId:line.productId}),seen=entries.find(e=>e.request.tool==="watches.detail"&&e.request.productId===line.productId)?.result;
  if(!seen||["version","watchVersion","status","stockStage","saleStage","activeReservations"].some(k=>seen[k]!==now[k]))throw new AssistantError("Đồng hồ đã thay đổi sau tra cứu. Hãy cập nhật bản đề xuất.",409);
  if(now.stockStage!=="IN_STOCK"||["HOLD","SOLD"].includes(String(now.saleStage))||Number(now.activeReservations)>0)throw new AssistantError("Đồng hồ không còn sẵn để tạo đơn. Cần kiểm tra lại tình trạng.",409);
  items.push({id:line.productId,title:String(now.title),sku:typeof now.sku==="string"?now.sku:null,price:line.unitPriceAgreed});
 }
 return {plan,revision,items,total:items.reduce((n,i)=>n+i.price,0)};
}
