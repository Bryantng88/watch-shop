import { NextResponse } from "next/server";
import { WORK_IMAGE_MAX_BYTES } from "../shared/work-media";
import { WorkMediaError } from "../shared/work-media-error";
export function checkWorkMediaOrigin(request: Request) {
 const origin=request.headers.get("origin");
 let foreign=false;
 if(origin){try{const parsed=new URL(origin);foreign=!['http:','https:'].includes(parsed.protocol)||parsed.host!==(request.headers.get("host")||new URL(request.url).host);}catch{foreign=true;}}
 if(request.headers.get("sec-fetch-site")==="cross-site"||foreign)throw new WorkMediaError("Nguồn yêu cầu không hợp lệ.",403);
}
export async function boundedWorkImageForm(request:Request) {
 const limit=WORK_IMAGE_MAX_BYTES+1024*1024;
 if(Number(request.headers.get("content-length")||0)>limit)throw new WorkMediaError("Ảnh tối đa 10 MB.",413);
 if(!request.body)throw new WorkMediaError("Thiếu ảnh.");
 const reader=request.body.getReader(),chunks:Uint8Array[]=[];let size=0;
 try{while(true){const next=await reader.read();if(next.done)break;size+=next.value.byteLength;if(size>limit){await reader.cancel();throw new WorkMediaError("Ảnh tối đa 10 MB.",413);}chunks.push(next.value);}}finally{reader.releaseLock();}
 const bytes=Buffer.concat(chunks);
 return new Response(bytes,{headers:{"content-type":request.headers.get("content-type")||""}}).formData();
}
export function workMediaFailure(error:unknown) {
 const status=error&&typeof error==="object"&&"status" in error?Number(error.status):500;
 return NextResponse.json({error:error instanceof WorkMediaError?error.message:status===403?"Bạn không có quyền truy cập ảnh của công việc này.":"Không thể xử lý ảnh công việc. Vui lòng thử lại."},{status:[400,401,403,404,409,413,503].includes(status)?status:500,headers:{"Cache-Control":"private, no-store"}});
}
