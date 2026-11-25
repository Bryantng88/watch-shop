import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { workMediaService } from "@/domains/work-media/server/work-media.service";
import { authorizeWorkMedia, WorkMediaError } from "@/domains/work-media/server/work-media-access";
import { boundedWorkImageForm, checkWorkMediaOrigin, workMediaFailure } from "@/domains/work-media/server/work-media-http";
export const runtime="nodejs";
export const dynamic="force-dynamic";
function target(request:NextRequest){return {workId:request.nextUrl.searchParams.get("workId")||"",entryId:request.nextUrl.searchParams.get("entryId")||undefined};}
export async function GET(request:NextRequest){
 const auth=await requirePermissionApi(PERMISSIONS.TASK_VIEW);if(auth instanceof Response)return auth;
 try{checkWorkMediaOrigin(request);return NextResponse.json(await workMediaService.list(target(request),auth),{headers:{"Cache-Control":"private, no-store"}});}catch(error){return workMediaFailure(error);}
}
export async function POST(request:NextRequest){
 const auth=await requirePermissionApi(PERMISSIONS.TASK_VIEW);if(auth instanceof Response)return auth;
 try{
  checkWorkMediaOrigin(request);const owner=target(request);await authorizeWorkMedia(owner,auth,true);
  const form=await boundedWorkImageForm(request),file=form.get("file");
  if(!(file instanceof File))throw new WorkMediaError("Chọn ảnh cần đính kèm.");
  const item=await workMediaService.upload(owner,auth,{uploadId:String(form.get("uploadId")||""),bytes:new Uint8Array(await file.arrayBuffer()),mimeType:file.type,name:file.name});
  return NextResponse.json({item},{headers:{"Cache-Control":"private, no-store"}});
 }catch(error){return workMediaFailure(error);}
}
