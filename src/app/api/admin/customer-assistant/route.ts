import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { approveAssistant, cancelAssistant, listAssistant, recordConditionOutcome, sendAssistant } from "@/domains/ai-assistant/server/service";
import { AssistantError } from "@/domains/ai-assistant/server/access";
const uuid=z.string().uuid();
const command=z.discriminatedUnion("action",[
 z.object({action:z.literal("send"),id:uuid.optional(),requestKey:uuid,text:z.string().trim().min(1).max(4000),productId:z.string().min(1).max(100).nullable().optional()}).strict(),
 z.object({action:z.literal("cancel"),id:uuid}).strict(),
 z.object({action:z.literal("approve"),id:uuid,revision:z.number().int().min(1)}).strict(),
 z.object({action:z.literal("outcome"),id:uuid,conditionId:z.string().min(1).max(30),requestRevision:z.number().int().min(1).optional(),outcome:z.enum(["Chưa xác minh","Đạt","Không đạt","Cần khách xác nhận"]),result:z.string().max(1500)}).strict(),
]);
async function handle(req:NextRequest){try{
 const {user}=await getCurrentUserPermissions();if(!user)return NextResponse.json({error:"Cần đăng nhập."},{status:401});
 if(req.method==="GET")return NextResponse.json(await listAssistant(user.id,req.nextUrl.searchParams.has("id")?uuid.parse(req.nextUrl.searchParams.get("id")):undefined),{headers:{"Cache-Control":"no-store"}});
 if(!process.env.APP_URL||req.headers.get("origin")!==new URL(process.env.APP_URL).origin)throw new AssistantError("Origin không hợp lệ.",403);
 const raw=await req.text();if(raw.length>20000)throw new AssistantError("Yêu cầu quá dài.",413);const c=command.parse(JSON.parse(raw));
 if(c.action==="send")return NextResponse.json(await sendAssistant(user.id,c));
 if(c.action==="cancel")return NextResponse.json(await cancelAssistant(user.id,c.id));
 if(c.action==="approve")return NextResponse.json(await approveAssistant(user.id,c.id,c.revision,work=>after(work)));
 return NextResponse.json(await recordConditionOutcome(user.id,c.id,c.conditionId,c.outcome,c.result,c.requestRevision));
 }catch(e){return NextResponse.json({error:e instanceof AssistantError?e.message:"Chưa xác nhận được kết quả. Hãy tải lại cuộc trao đổi để kiểm tra trước khi thử lại."},{status:e instanceof AssistantError?e.status:e instanceof z.ZodError||e instanceof SyntaxError?400:500});}}
export async function GET(req:NextRequest){return handle(req);}
export async function POST(req:NextRequest){return handle(req);}
