// app/api/admin/customers/search/route.ts
import { NextResponse } from "next/server";
import { searchCustomerService } from "@/app/(admin)/admin/customers/_server/customer.service";
<<<<<<< HEAD

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") ?? "";

  const items = await searchCustomerService(phone);
=======
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") ?? "";
  console.log('in ra test khach hang tu phone : ' + JSON.stringify(phone))

  const items = await searchCustomerService(phone);


>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
  return NextResponse.json(items);
}
