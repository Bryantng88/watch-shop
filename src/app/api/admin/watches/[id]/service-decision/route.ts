import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Luồng tạo service trực tiếp đã ngừng sử dụng. Hãy tạo service qua Service Operation.",
      canonicalEndpoint: "/api/admin/service-operation",
    },
    { status: 410 },
  );
}
