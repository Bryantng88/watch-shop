import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";

const DEFAULT_TIMEOUT_MS = 5_000;

function readinessTimeoutMs() {
  const configured = Number(process.env.DB_READINESS_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_TIMEOUT_MS;
}

export async function GET() {
  const startedAt = Date.now();
  const timeoutMs = readinessTimeoutMs();
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Database readiness check timed out")),
          timeoutMs,
        );
      }),
    ]);

    return NextResponse.json(
      {
        status: "ready",
        database: "reachable",
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        status: "not_ready",
        database: "unreachable",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
