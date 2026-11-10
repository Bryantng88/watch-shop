import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { approveAssistantPersonalWorkUpdate, approveAssistantPersonalWork, approveAssistantOrder, approvePermissionSupport, approveAssistant, cancelAssistant, listAssistant, recordConditionOutcome, sendAssistant } from "@/domains/ai-assistant/server/service";
import { benPushPublicKey, saveBenPush, hasBenPush, removeBenPush, pushEndpoint, pushSubscription } from "@/domains/ai-assistant/server/ben-push";
import { AssistantError } from "@/domains/ai-assistant/server/access";
import {screenPathForMessage} from "@/domains/ai-assistant/server/current-screen";
import { MAX_BEN_IMAGE_BASE64 } from "@/domains/ai-assistant/image-search";
const uuid=z.string().uuid();
const command=z.discriminatedUnion("action",[
 z.object({action:z.literal("push-status"),endpoint:pushEndpoint}).strict(),
 z.object({action:z.literal("subscribe-push"),subscription:pushSubscription}).strict(),
 z.object({action:z.literal("unsubscribe-push"),endpoint:pushEndpoint}).strict(),
 z.object({action:z.literal("send"),id:uuid.optional(),requestKey:uuid,imageBase64:z.string().max(MAX_BEN_IMAGE_BASE64).optional(),text:z.string().trim().min(1).max(4000),productId:z.string().min(1).max(100).nullable().optional(),screenPath:z.string().max(2048).nullable().optional()}).strict(),
 z.object({action:z.literal("cancel"),id:uuid}).strict(),
 z.object({action:z.literal("permission-support"),id:uuid,revision:z.number().int().min(1)}).strict(),
 z.object({action:z.literal("update-personal-work"),id:uuid,revision:z.number().int().min(1)}).strict(),
 z.object({action:z.literal("approve-personal-work"),id:uuid,revision:z.number().int().min(1)}).strict(),
 z.object({action:z.literal("approve-order"),id:uuid,revision:z.number().int().min(1)}).strict(),
 z.object({action:z.literal("approve"),id:uuid,revision:z.number().int().min(1)}).strict(),
 z.object({action:z.literal("outcome"),id:uuid,conditionId:z.string().min(1).max(30),requestRevision:z.number().int().min(1).optional(),outcome:z.enum(["Chưa xác minh","Đạt","Không đạt","Cần khách xác nhận"]),result:z.string().max(1500)}).strict(),
]);
async function readBody(req: NextRequest, limit: number) {
 const reader=req.body?.getReader();
 if(!reader)return "";
 const chunks: Uint8Array[]=[];
 let bytes=0;
 try {
  for(;;){
   const {done,value}=await reader.read();
   if(done)break;
   bytes+=value.byteLength;
   if(bytes>limit)throw new AssistantError("Yêu cầu quá dài.",413);
   chunks.push(value);
  }
 }finally{await reader.cancel();}
 return Buffer.concat(chunks).toString("utf8");
}
async function handle(req:NextRequest){try{
 const {user}=await getCurrentUserPermissions();if(!user)return NextResponse.json({error:"Cần đăng nhập."},{status:401});
 if(req.method==="GET"&&req.nextUrl.searchParams.has("push"))return NextResponse.json({publicKey:benPushPublicKey()},{headers:{"Cache-Control":"no-store"}});
 if(req.method==="GET")return NextResponse.json(await listAssistant(user.id,req.nextUrl.searchParams.has("id")?uuid.parse(req.nextUrl.searchParams.get("id")):undefined),{headers:{"Cache-Control":"no-store"}});
 if(!process.env.APP_URL||req.headers.get("origin")!==new URL(process.env.APP_URL).origin)throw new AssistantError("Origin không hợp lệ.",403);
 const imageEnabled=process.env.BEN_IMAGE_SEARCH_ENABLED==="1";
 const raw=await readBody(req,imageEnabled?MAX_BEN_IMAGE_BASE64+20000:20000);
 const c=command.parse(JSON.parse(raw));
 if(raw.length>20000 && !(c.action==="send"&&c.imageBase64))throw new AssistantError("Yêu cầu quá dài.",413);
 if(c.action==="push-status")return NextResponse.json({enabled:await hasBenPush(user.id,c.endpoint)},{headers:{"Cache-Control":"no-store"}});
 if(c.action==="subscribe-push"){await saveBenPush(user.id,c.subscription);return NextResponse.json({ok:true});}
 if(c.action==="unsubscribe-push"){await removeBenPush(user.id,c.endpoint);return NextResponse.json({ok:true});}
 if(c.action==="send")return NextResponse.json(await sendAssistant(user.id,{...c,screenPath:screenPathForMessage(c.screenPath,req.headers.get("referer"),process.env.APP_URL)}));
 if(c.action==="cancel")return NextResponse.json(await cancelAssistant(user.id,c.id));
 if(c.action==="permission-support")return NextResponse.json(await approvePermissionSupport(user.id,c.id,c.revision,work=>after(work)));
 if(c.action==="update-personal-work")return NextResponse.json(await approveAssistantPersonalWorkUpdate(user.id,c.id,c.revision));
 if(c.action==="approve-personal-work")return NextResponse.json(await approveAssistantPersonalWork(user.id,c.id,c.revision,work=>after(work)));
 if(c.action==="approve-order")return NextResponse.json(await approveAssistantOrder(user.id,c.id,c.revision,work=>after(work)));
 if(c.action==="approve")return NextResponse.json(await approveAssistant(user.id,c.id,c.revision,work=>after(work)));
 return NextResponse.json(await recordConditionOutcome(user.id,c.id,c.conditionId,c.outcome,c.result,c.requestRevision));
 }catch(e){return NextResponse.json({error:e instanceof AssistantError?e.message:"Chưa xác nhận được kết quả. Hãy tải lại cuộc trao đổi để kiểm tra trước khi thử lại."},{status:e instanceof AssistantError?e.status:e instanceof z.ZodError||e instanceof SyntaxError?400:500});}}
export async function GET(req:NextRequest){return handle(req);}
export async function POST(req:NextRequest){return handle(req);}
