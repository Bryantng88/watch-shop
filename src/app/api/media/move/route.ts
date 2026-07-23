import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      code: "LEGACY_MEDIA_WRITE_RETIRED",
      error: "Media move theo business state đã ngừng. Hãy dùng Media Core binding.",
    },
    { status: 410 },
  );
}
