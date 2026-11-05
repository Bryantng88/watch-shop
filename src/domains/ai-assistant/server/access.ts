import type { DB } from "@/server/db/client";
import { codexExecutionReadiness } from "@/domains/personal-work/server/codex/codex-config";
import { expandPermissions } from "@/server/auth/permission-implications";
export class AssistantError extends Error { constructor(message:string,public status=400){super(message);} }
export function customerAssistantReady(env:Readonly<Record<string,string|undefined>>=process.env){
 if(env.CUSTOMER_AI_ENABLED!=="1"||!codexExecutionReadiness(env).ready)return false;
 try{const db=new URL(env.DATABASE_URL||"");const local=["127.0.0.1","localhost","[::1]"];
  if(local.includes(db.hostname)&&db.pathname==="/personal_codex_test")return env.NODE_ENV==="test"||local.includes(new URL(env.APP_URL||"").hostname);
  const app=new URL(env.APP_URL||"");return db.hostname==="watch-shop-staging-db"&&db.pathname==="/watch_shop_storefront_staging"&&app.protocol==="https:"&&app.hostname==="admin-staging.vinticwatches.vn";
 }catch{return false;}
}
export async function assistantActor(db:DB,id:string){
 if(!customerAssistantReady())throw new AssistantError("Trợ lý Codex chưa bật cho staging.",503);
 const user=await db.user.findFirst({where:{id,isActive:true},select:{id:true,name:true,roles:{select:{name:true,permissions:{select:{code:true}}}}}});
 const permissions=new Set(expandPermissions(user?.roles.flatMap(r=>r.permissions.map(p=>p.code))||[]));const admin=!!user?.roles.some(r=>r.name==="ADMIN");
 if(!user||(!admin&&!["TASK_VIEW","TASK_MANAGE","PRODUCT_VIEW","CUSTOMER_VIEW"].every(p=>permissions.has(p))))throw new AssistantError("Bạn chưa có quyền dùng trợ lý khách hàng.",403);
 return {...user,permissions,admin};
}
export async function assistantRecipient(db:DB,id:string,technical=false){
 return db.user.findFirst({
  where:{id,isActive:true,roles:{some:{OR:[
   {name:"ADMIN"},
   {permissions:{some:{code:{in:technical?["SERVICE_UPDATE"]:["TASK_VIEW","TASK_MANAGE"]}}}},
  ]}}},
  select:{id:true,name:true,updatedAt:true},
 });
}
