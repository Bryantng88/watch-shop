import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      code: "LEGACY_MEDIA_WRITE_RETIRED",
      error: "Organize active legacy đã ngừng; Media Core không move file theo trạng thái.",
    },
    { status: 410 },
  );
}
