import { NextRequest, NextResponse } from "next/server";
export async function POST(_request:NextRequest){
 return NextResponse.json({error:"Lập hồ sơ tại Mua bán → Ký gửi và xác nhận gửi đối tác trong hồ sơ.",href:"/admin/consignments"},{status:409,headers:{"Cache-Control":"no-store"}});
}
