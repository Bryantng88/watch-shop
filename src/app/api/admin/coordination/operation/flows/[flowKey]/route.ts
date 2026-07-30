import { NextRequest, NextResponse } from "next/server";

import { getCoordinationFlowPage } from "@/domains/coordination/server";
import type { CoordinationContext } from "@/domains/coordination/server";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CONTEXTS = new Set<CoordinationContext>([
  "OPERATION",
  "SALES",
  "TECHNICAL",
  "MEDIA",
  "PAYMENT",
  "GENERAL",
]);

function doneRetentionDays(value: string | null) {
  if (value === "ALL") return null;
  return value === "30D" ? 30 : 14;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ flowKey: string }> },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (auth instanceof NextResponse) return auth;

  const requestedContext = request.nextUrl.searchParams.get("context") ?? "OPERATION";
  const coordinationContext = CONTEXTS.has(requestedContext as CoordinationContext)
    ? requestedContext as CoordinationContext
    : "OPERATION";
  const { flowKey } = await context.params;
  const mode = getSpaceViewConfig(coordinationContext).modes.find(
    (item) => item.key === flowKey && item.coreFlowKey,
  );
  if (!mode) {
    return NextResponse.json(
      { ok: false, error: "Flow không được hỗ trợ." },
      { status: 404 },
    );
  }

  try {
    const result = await getCoordinationFlowPage({
      db: prisma,
      context: coordinationContext,
      modeKey: mode.key,
      taskId: request.nextUrl.searchParams.get("taskId"),
      date: request.nextUrl.searchParams.get("date"),
      stage: request.nextUrl.searchParams.get("flowStage"),
      page: Number(request.nextUrl.searchParams.get("flowPage") ?? 1),
      pageSize: Number(request.nextUrl.searchParams.get("flowPageSize") ?? 20),
      query: request.nextUrl.searchParams.get("flowQuery"),
      status: request.nextUrl.searchParams.get("flowStatus"),
      paymentStatus: request.nextUrl.searchParams.get("flowPaymentStatus"),
      paymentType: request.nextUrl.searchParams.get("flowPaymentType"),
      paymentDirection: request.nextUrl.searchParams.get("flowPaymentDirection"),
      sort: request.nextUrl.searchParams.get("flowSort"),
      doneRetentionDays: doneRetentionDays(
        request.nextUrl.searchParams.get("doneRange"),
      ),
      auth,
    });
    return NextResponse.json(
      {
        ok: true,
        flowKey: mode.key,
        flowItems: result.items,
        flowItemsPagination: result.pagination,
        flowStageCounts: result.stageCounts,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Không thể tải flow.",
      },
      { status: 500 },
    );
  }
}
