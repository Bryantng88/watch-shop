import { NextResponse } from "next/server";

import { listPostTargets } from "@/domains/watch/server";

export async function GET() {
  const items = await listPostTargets();
  return NextResponse.json({ items });
}
