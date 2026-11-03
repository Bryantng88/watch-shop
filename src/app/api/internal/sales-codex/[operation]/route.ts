import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateCodexWorker } from "@/domains/personal-work/server/codex/codex-config";
import { salesIntakeReady, SalesIntakeError } from "@/domains/sales-intake/server/intake-access";
import { claimSalesIntake, heartbeatSalesIntake, lookupSalesIntake, finishSalesIntake } from "@/domains/sales-intake/server/intake.service";

export async function POST(req: NextRequest, ctx: { params: Promise<{ operation: string }> }) {
  if (!salesIntakeReady()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  if (!authenticateCodexWorker(req.headers.get("authorization"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const text = await req.text();
    if (text.length > 64000) return NextResponse.json({ error: "Too large" }, { status: 413 });
    const body = JSON.parse(text);
    const { operation } = await ctx.params;
    if (operation === "claim") return NextResponse.json({ run: await claimSalesIntake(z.string().regex(/^[\w.-]{1,80}$/).parse(body.workerId)) });
    const { id, leaseToken } = z.object({ id: z.string().uuid(), leaseToken: z.string().uuid() }).parse(body);
    if (operation === "heartbeat") return NextResponse.json({ active: await heartbeatSalesIntake(id, leaseToken) });
    if (operation === "lookup") return NextResponse.json({ evidence: await lookupSalesIntake(id, leaseToken, body.lookup) });
    if (operation === "finish") return NextResponse.json(await finishSalesIntake(id, leaseToken, body.plan, body.failed === true));
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof SalesIntakeError ? error.message : "Invalid worker request" }, { status: error instanceof SalesIntakeError ? error.status : 400 });
  }
}
