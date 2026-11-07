import { NextRequest, NextResponse } from "next/server";
import { authenticateCodexWorker } from "@/domains/personal-work/server/codex/codex-config";
import { assistantWorker } from "@/domains/ai-assistant/server/service";
import { AssistantError, customerAssistantReady } from "@/domains/ai-assistant/server/access";
export async function POST(req:NextRequest,ctx:{params:Promise<{operation:string}>}){
 if(!customerAssistantReady())return NextResponse.json({error:"Unavailable"},{status:503});
 if(!authenticateCodexWorker(req.headers.get("authorization")))return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const {operation}=await ctx.params;if(!["claim","heartbeat","lookup","finish"].includes(operation))return NextResponse.json({error:"Not found"},{status:404});const raw=await req.text();if(raw.length>64000)return NextResponse.json({error:"Too large"},{status:413});return NextResponse.json(await assistantWorker(operation,JSON.parse(raw)));}
 catch(e){return NextResponse.json({error:"Worker request rejected"},{status:e instanceof AssistantError?e.status:400});}
}
