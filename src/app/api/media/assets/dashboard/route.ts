import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "Media dashboard đã được chuyển sang mục Báo cáo." },
    { status: 410 },
  );
}
