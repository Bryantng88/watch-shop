import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { workMediaService } from "@/domains/work-media/server/work-media.service";
import { renderNasMediaThumbnail } from "@/domains/media/server/nas-media-thumbnail.service";
import { checkWorkMediaOrigin, workMediaFailure } from "@/domains/work-media/server/work-media-http";
export const runtime="nodejs";
export const dynamic="force-dynamic";
type Context={params:Promise<{id:string}>};
export async function GET(request:NextRequest,context:Context){
 const auth=await requirePermissionApi(PERMISSIONS.TASK_VIEW);if(auth instanceof Response)return auth;
 try{
  checkWorkMediaOrigin(request);const {id}=await context.params;const source=await workMediaService.read(id,auth);
  const bytes=request.nextUrl.searchParams.get("size")==="thumb"?await renderNasMediaThumbnail(source.bytes):source.bytes;
  return new NextResponse(Buffer.from(bytes),{headers:{"Content-Type":"image/webp","Content-Length":String(bytes.length),"Content-Disposition":`${request.nextUrl.searchParams.get("download")==="1"?"attachment":"inline"}; filename="work-image.webp"`,"Cache-Control":"private, no-store","Vary":"Cookie","X-Content-Type-Options":"nosniff","Cross-Origin-Resource-Policy":"same-origin"}});
 }catch(error){return workMediaFailure(error);}
}
export async function DELETE(request:NextRequest,context:Context){
 const auth=await requirePermissionApi(PERMISSIONS.TASK_VIEW);if(auth instanceof Response)return auth;
 try{checkWorkMediaOrigin(request);await workMediaService.remove((await context.params).id,auth);return NextResponse.json({ok:true},{headers:{"Cache-Control":"private, no-store"}});}catch(error){return workMediaFailure(error);}
}
