import { NextResponse } from "next/server";
import { authenticateCodexWorker, codexExecutionReadiness } from "@/domains/personal-work/server/codex/codex-config";
import { claimPersonalCodexRun, finishPersonalCodexRun, heartbeatPersonalCodexRun } from "@/domains/personal-work/server/codex/personal-codex.service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ operation: string }> }) {
  if (!codexExecutionReadiness().ready) return NextResponse.json({ error: "CODEX_NOT_CONFIGURED" }, { status: 503 });
  if (!authenticateCodexWorker(request.headers.get("authorization"))) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "JSON_REQUIRED" }, { status: 415 });
  try {
    const text = await request.text();
    if (text.length > 32000) return NextResponse.json({ error: "BODY_TOO_LARGE" }, { status: 413 });
    const input = JSON.parse(text);
    const { operation } = await context.params;
    if (operation === "claim") return NextResponse.json({ run: await claimPersonalCodexRun(String(input.workerId ?? "")) });
    if (typeof input.id !== "string" || typeof input.leaseToken !== "string") return NextResponse.json({ error: "INVALID_LEASE" }, { status: 400 });
    if (operation === "heartbeat") {
      const active = await heartbeatPersonalCodexRun(input.id, input.leaseToken);
      return NextResponse.json({ active }, { status: active ? 200 : 409 });
    }
    if (operation === "finish") {
      const accepted = await finishPersonalCodexRun({ id: input.id, leaseToken: input.leaseToken, status: input.status, summary: input.summary, resultUrl: input.resultUrl, commitSha: input.commitSha });
      return NextResponse.json({ accepted }, { status: accepted ? 200 : 409 });
    }
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  } catch { return NextResponse.json({ error: "INVALID_CODEX_REQUEST" }, { status: 400 }); }
}
