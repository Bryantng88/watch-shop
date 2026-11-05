import {z} from "zod";
import type {DB} from "@/server/db/client";
import {getAdminPagePolicy,isAdminAccessAllowed} from "@/server/auth/admin-api-policy";
import {BEN_SCREENS} from "../navigation";
import {hasAssistantPermission,type AssistantAuthority} from "../capabilities";

// Pathname only. Never accept a URL, query, hash, encoded data or client labels.
export const screenPathSchema=z.string().max(300).regex(/^\/admin(?:\/[A-Za-z0-9_-]+)*\/?$/);
export type ScreenHint={pathname:string;requestKey:string;receivedAt:string};
const families=[...BEN_SCREENS,{key:"dashboard",href:"/admin/dashboard",label:"Tổng quan"},{key:"profile",href:"/admin/profile",label:"Hồ sơ của tôi"},...Object.entries({acquisitions:"Phiếu nhập",payments:"Thanh toán",tasks:"Công việc",'task-items':"Chi tiết công việc",'work-cases':"Hồ sơ xử lý",workflows:"Quy trình",coordination:"Không gian phối hợp",users:"Người dùng",settings:"Cài đặt",reports:"Báo cáo",activity:"Lịch sử hoạt động",system:"Hệ thống",straps:"Phụ kiện",'purchase-requests':"Yêu cầu mua",services:"Kỹ thuật",'media-posts':"Bài đăng media"}).map(([key,label])=>({key,href:`/admin/${key}`,label}))].sort((a,b)=>b.href.length-a.href.length);
export function screenDescriptor(raw:string|undefined|null,actor:AssistantAuthority){
 if(!raw||!screenPathSchema.safeParse(raw).success)return null;
 const pathname=raw.replace(/\/$/,"");const policy=getAdminPagePolicy(pathname);
 if(!policy||(!actor.admin&&!isAdminAccessAllowed(policy,actor.permissions)))return null;
 const family=families.find(s=>pathname===s.href||(s.href!=="/admin"&&pathname.startsWith(s.href+"/")));
 if(!family)return null;
 const permissions=[...(policy.allOf||[]),...policy.anyOf.filter(p=>hasAssistantPermission(actor,p)).slice(0,1)];
 const parts=pathname.split("/").filter(Boolean),tail=parts[2];
 const detail=["orders","watches"].includes(parts[1])&&tail&&!["new","create"].includes(tail)&&(parts.length===3||(parts.length===4&&parts[3]==="edit"))?{kind:parts[1]==="orders"?"ORDER" as const:"WATCH" as const,id:tail}:null;
 if(["orders","watches"].includes(parts[1])&&parts.length>2&&!detail&&!(tail==="new"&&parts.length===3))return null;
 const label=tail==="new"?`Tạo mới · ${family.label}`:detail?`${parts[3]==="edit"?"Chỉnh sửa":"Chi tiết"} · ${family.label}`:family.label;
 return {key:family.key,label,path:detail?`${family.href}/:id${parts[3]==="edit"?"/edit":""}`:family.href,detail,permissions};
}
export async function resolveCurrentScreen(db:DB,actor:AssistantAuthority,hint:ScreenHint|null|undefined,requestKey:string|undefined){
 const empty={screen:null,permissions:[] as string[]};
 if(!hint||hint.requestKey!==requestKey)return empty;
 const descriptor=screenDescriptor(hint.pathname,actor);if(!descriptor)return empty;
 const {detail,permissions,...base}=descriptor;
 let entity:{kind:"ORDER"|"WATCH";id:string;reference:string|null}|null=null;
 if(detail?.kind==="ORDER"){
  if(!hasAssistantPermission(actor,"ORDER_VIEW"))return empty;
  const order=await db.order.findUnique({where:{id:detail.id},select:{id:true,refNo:true}});if(!order)return empty;
  entity={kind:"ORDER",id:order.id,reference:order.refNo};permissions.push("ORDER_VIEW");
 }else if(detail?.kind==="WATCH"){
  if(!hasAssistantPermission(actor,"PRODUCT_VIEW"))return empty;
  const product=await db.product.findFirst({where:{id:detail.id,type:"WATCH"},select:{id:true,sku:true}});if(!product)return empty;
  entity={kind:"WATCH",id:product.id,reference:product.sku};permissions.push("PRODUCT_VIEW");
 }
 return {screen:{...base,entity,capturedAt:hint.receivedAt,source:"BROWSER_ROUTE_SERVER_VERIFIED",usage:"HINT_ONLY"},permissions:[...new Set(permissions)]};
}
