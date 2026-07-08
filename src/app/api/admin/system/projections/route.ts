import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";
import {
  compareProjection,
  listProjectionStatus,
  repairProjection,
} from "@/domains/projection/server";

function isApiResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function GET(request: Request) {
  const auth = await requirePermissionApi("SYSTEM_JOB_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const url = new URL(request.url);
    const projectionKey = clean(url.searchParams.get("projectionKey"));
    const workspaceId = clean(url.searchParams.get("workspaceId"));
    const targetType = clean(url.searchParams.get("targetType"));
    const targetId = clean(url.searchParams.get("targetId"));

    const projections = await listProjectionStatus(prisma, {
      projectionKey: projectionKey || null,
      scope: {
        workspaceId: workspaceId || null,
        targetType: targetType || null,
        targetId: targetId || null,
      },
    });

    return NextResponse.json({ ok: true, projections });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: errorMessage(error, "Cannot load projection status") },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requirePermissionApi("SYSTEM_JOB_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const action = clean(body?.action);
    const projectionKey = clean(body?.projectionKey);
    const scope = body?.scope && typeof body.scope === "object" ? body.scope : {};

    if (!projectionKey) {
      return NextResponse.json(
        { ok: false, error: "projectionKey is required" },
        { status: 400 },
      );
    }

    if (action === "compare") {
      return NextResponse.json({
        ok: true,
        result: await compareProjection(prisma, { projectionKey, scope }),
      });
    }

    if (action === "repair" || action === "rebuild") {
      return NextResponse.json({
        ok: true,
        result: await repairProjection(prisma, {
          projectionKey,
          scope,
          compare: Boolean(body?.compare),
        }),
      });
    }

    return NextResponse.json(
      { ok: false, error: "Unsupported projection action" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: errorMessage(error, "Cannot run projection action") },
      { status: 400 },
    );
  }
}
