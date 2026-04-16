// app/api/admin/customers/search/route.ts
import { NextResponse } from "next/server";
import { searchCustomerService } from "@/app/(admin)/admin/customers/_server/customer.service";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") ?? "";

  const items = await searchCustomerService(phone);

  console.log('in ra test khach hang tu phone : ' + JSON.stringify(items))


  return NextResponse.json(items);
}
