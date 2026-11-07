import {z} from "zod";
import {hasUniqueEvidence,type Evidence} from "./live-contract";
import {hasAssistantPermission,type AssistantAuthority} from "./capabilities";
const text=z.string().trim().min(1).max(300);
export const assistantOrderSchema=z.object({
 customerId:z.string().min(1).max(100).nullable(),customerName:text,
 phone:z.string().trim().min(5).max(30).nullable(),
 hasShipment:z.boolean(),address:text.nullable(),city:text.nullable(),district:text.nullable(),ward:text.nullable(),
 paymentMethod:z.enum(["BANK_TRANSFER","CASH","MOMO","CREDIT_CARD","PAYPAL"]),
 notes:z.string().trim().max(1000).nullable(),
 items:z.array(z.object({productId:z.string().min(1).max(100),unitPriceAgreed:z.number().int().positive().max(9_999_999_999)}).strict()).min(1).max(6),
}).strict().superRefine((p,ctx)=>{
 if(new Set(p.items.map(i=>i.productId)).size!==p.items.length)ctx.addIssue({code:"custom",message:"Đồng hồ bị trùng"});
 if(p.hasShipment&&(!p.phone||!p.address||!p.city))ctx.addIssue({code:"custom",message:"Giao hàng cần số điện thoại, địa chỉ và tỉnh/thành"});
 if(!p.hasShipment&&[p.address,p.city,p.district,p.ward].some(Boolean))ctx.addIssue({code:"custom",message:"Nhận tại shop không kèm địa chỉ giao hàng"});
 if(!Number.isSafeInteger(p.items.reduce((n,i)=>n+i.unitPriceAgreed,0))||p.items.reduce((n,i)=>n+i.unitPriceAgreed,0)>9_999_999_999)ctx.addIssue({code:"custom",message:"Tổng tiền không hợp lệ"});
});
export type AssistantOrderPlan=z.infer<typeof assistantOrderSchema>;
export type AssistantOrderDraft={plan:AssistantOrderPlan;revision:number;items:{id:string;title:string;sku:string|null;price:number}[];total:number};
export type CreatedAssistantOrder={revision:number;id:string;reference:string};
export function orderPermissions(p:AssistantOrderPlan){return ["ORDER_CREATE","PRODUCT_VIEW",...(p.customerId||p.phone?["CUSTOMER_VIEW"]:[]),...(!p.customerId&&p.phone?["CUSTOMER_CREATE"]:[])];}
export function orderDeniedPermission(actor:AssistantAuthority,p:AssistantOrderPlan){return orderPermissions(p).find(code=>!hasAssistantPermission(actor,code))||null;}
export function orderHasEvidence(p:AssistantOrderPlan,entries:Evidence[]){return (!p.customerId||hasUniqueEvidence(entries,"customers.search",p.customerId))&&p.items.every(i=>hasUniqueEvidence(entries,"watches.search",i.productId)&&entries.some(e=>e.request.tool==="watches.detail"&&e.request.productId===i.productId&&e.result.id===i.productId));}
