import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runWorkPush } from "@/domains/notification/server/work-push.service";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const expected = process.env.INTERNAL_JOB_SECRET;
  const supplied = req.headers.get("x-internal-job-secret");
  if (!expected || !supplied || Buffer.byteLength(expected) !== Buffer.byteLength(supplied) || !timingSafeEqual(Buffer.from(expected),Buffer.from(supplied))) return NextResponse.json({error:"Unauthorized"},{status:401});
  try { return NextResponse.json(await runWorkPush(),{headers:{"Cache-Control":"no-store"}}); }
  catch { return NextResponse.json({error:"Notification cycle failed"},{status:500}); }
}
