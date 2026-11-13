import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { AssistantError } from "@/domains/ai-assistant/server/access";
import { requestQuickNames, readQuickNames } from "@/domains/acquisition/server/quick-name.service";
const idsSchema=z.array(z.string().uuid()).min(1).max(12).refine(ids=>new Set(ids).size===ids.length);
function failure(error:unknown) {
  const status=error instanceof AssistantError?error.status:400;
  return NextResponse.json({error:error instanceof AssistantError?error.message:"Chưa xử lý được yêu cầu nhận diện."},{status});
}
export async function POST(req:NextRequest) {
  const user=await requirePermissionApi(PERMISSIONS.WATCH_ACQUISITION_CREATE);
  if(user instanceof Response)return user;
  try {
    const raw=await req.text();if(raw.length>24000)return NextResponse.json({error:"Yêu cầu quá lớn."},{status:413});
    return NextResponse.json(await requestQuickNames(user.id,JSON.parse(raw)));
  }catch(error){return failure(error);}
}
export async function GET(req:NextRequest) {
  const user=await requirePermissionApi(PERMISSIONS.WATCH_ACQUISITION_CREATE);
  if(user instanceof Response)return user;
  try{return NextResponse.json(await readQuickNames(user.id,idsSchema.parse(req.nextUrl.searchParams.getAll("id"))),{headers:{"Cache-Control":"no-store"}});}
  catch(error){return failure(error);}
}
