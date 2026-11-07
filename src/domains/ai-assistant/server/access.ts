import { createHash, timingSafeEqual } from "node:crypto";
import type { DB } from "@/server/db/client";
import { codexExecutionReadiness } from "@/domains/personal-work/server/codex/codex-config";
import { expandPermissions } from "@/server/auth/permission-implications";
export class AssistantError extends Error { constructor(message:string,public status=400){super(message);} }
export function productionBenReady(env: Readonly<Record<string, string | undefined>> = process.env) {
  if (
    env.CUSTOMER_AI_ENABLED !== "1" ||
    env.BEN_CUSTOMER_ENVIRONMENT !== "production" ||
    !env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID ||
    !env.BEN_PRODUCTION_DATABASE_USER ||
    (env.BEN_CUSTOMER_WORKER_TOKEN?.length ?? 0) < 32 ||
    env.BEN_CUSTOMER_WORKER_TOKEN === env.PERSONAL_CODEX_WORKER_TOKEN ||
    env.BEN_CUSTOMER_WORKER_TOKEN === env.BEN_CODE_WORKER_TOKEN ||
    env.BEN_CUSTOMER_WORKER_TOKEN === env.BEN_CODE_RELEASE_TOKEN
  ) return false;

  try {
    const db = new URL(env.DATABASE_URL || "");
    return env.APP_URL === "https://admin.vinticwatches.vn" &&
      ["postgresql:", "postgres:"].includes(db.protocol) &&
      db.hostname === "aws-1-ap-southeast-1.pooler.supabase.com" &&
      db.pathname === "/postgres" &&
      decodeURIComponent(db.username) === env.BEN_PRODUCTION_DATABASE_USER;
  } catch {
    return false;
  }
}

export function customerAssistantVisible(actor: { id: string; roles: string[] }) {
  return customerAssistantReady() &&
    (process.env.BEN_CUSTOMER_ENVIRONMENT !== "production" ||
      (actor.id === process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID && actor.roles.includes("ADMIN")));
}

export function authenticateProductionBenWorker(authorization: string | null) {
  if (!productionBenReady() || !authorization?.startsWith("Bearer ")) return false;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(authorization.slice(7)), hash(process.env.BEN_CUSTOMER_WORKER_TOKEN!));
}

export function customerAssistantReady(env:Readonly<Record<string,string|undefined>>=process.env){
 if(env.BEN_CUSTOMER_ENVIRONMENT==="production")return productionBenReady(env);
 if(env.CUSTOMER_AI_ENABLED!=="1"||!codexExecutionReadiness(env).ready)return false;
 try{const db=new URL(env.DATABASE_URL||"");const local=["127.0.0.1","localhost","[::1]"];
  if(local.includes(db.hostname)&&db.pathname==="/personal_codex_test")return env.NODE_ENV==="test"||local.includes(new URL(env.APP_URL||"").hostname);
  const app=new URL(env.APP_URL||"");return db.hostname==="watch-shop-staging-db"&&db.pathname==="/watch_shop_storefront_staging"&&app.protocol==="https:"&&app.hostname==="admin-staging.vinticwatches.vn";
 }catch{return false;}
}
export async function assistantActor(db:DB,id:string){
 if(!customerAssistantReady())throw new AssistantError("Ben chưa được cấu hình cho môi trường này.",503);
 const user=await db.user.findFirst({where:{id,isActive:true},select:{id:true,name:true,roles:{select:{name:true,permissions:{select:{code:true}}}}}});
 const permissions=new Set(expandPermissions(user?.roles.flatMap(r=>r.permissions.map(p=>p.code))||[]));const admin=!!user?.roles.some(r=>r.name==="ADMIN");
 if(!user)throw new AssistantError("Tài khoản không còn hoạt động hoặc không thể sử dụng Ben.",403);
 if(process.env.BEN_CUSTOMER_ENVIRONMENT==="production"&&(!admin||id!==process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID))
  throw new AssistantError("Ben production chỉ dành cho Long có ADMIN.",403);
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
