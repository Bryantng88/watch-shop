import { NextRequest, NextResponse } from "next/server";

import {
  getCoordinationBoard,
  getCoordinationFlowPage,
} from "@/domains/coordination/server/coordination-dashboard.service";
import { resolveOperationSpace } from "@/domains/coordination/server/operation-space.service";
import type { CoordinationContext } from "@/domains/coordination/server/coordination-cycle.types";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function doneRetentionDays(value: string | null) {
  if (value === "ALL") return null;
  return value === "30D" ? 30 : 14;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePermissionApi("TASK_VIEW");
    if (auth instanceof NextResponse) return auth;
    const modeKey = request.nextUrl.searchParams.get("view");
    const date = request.nextUrl.searchParams.get("date");
    const requestedContext = request.nextUrl.searchParams.get("context") ?? "OPERATION";
    const context = (["OPERATION", "SALES", "TECHNICAL", "MEDIA", "PAYMENT", "GENERAL"] as const)
      .includes(requestedContext as CoordinationContext)
      ? requestedContext as CoordinationContext
      : "OPERATION";
    const flowItemsOnly = request.nextUrl.searchParams.get("includeFlowItems") === "1";
    const flowStageKey = request.nextUrl.searchParams.get("flowStage");
    const flowPage = Number(request.nextUrl.searchParams.get("flowPage") ?? 1);
    const flowPageSize = Number(request.nextUrl.searchParams.get("flowPageSize") ?? 20);
    const flowQuery = request.nextUrl.searchParams.get("flowQuery");
    const flowStatus = request.nextUrl.searchParams.get("flowStatus");
    const flowPaymentStatus = request.nextUrl.searchParams.get("flowPaymentStatus");
    const flowPaymentType = request.nextUrl.searchParams.get("flowPaymentType");
    const flowPaymentDirection = request.nextUrl.searchParams.get("flowPaymentDirection");
    const flowSort = request.nextUrl.searchParams.get("flowSort");
    const doneDays = doneRetentionDays(
      request.nextUrl.searchParams.get("doneRange"),
    );
    const includeBoard = request.nextUrl.searchParams.get("includeBoard") === "1";
    const boardOnly = !flowItemsOnly && includeBoard;
    const boardStage = request.nextUrl.searchParams.get("boardStage");
    const boardPage = Number(request.nextUrl.searchParams.get("boardPage") ?? 1);
    const boardPageSize = Number(
      request.nextUrl.searchParams.get("boardPageSize") ??
      (modeKey === "technical-issue-flow" ? 10 : 20),
    );
    // Rolling-deploy compatibility for browser bundles that still request
    // flow pages through /dashboard. The canonical read boundary is the Flow
    // Query Gateway; keep the legacy route as a thin adapter only.
    if (flowItemsOnly && modeKey) {
      const flow = await getCoordinationFlowPage({
        db: prisma,
        context,
        modeKey,
        taskId: request.nextUrl.searchParams.get("taskId"),
        date,
        stage: flowStageKey,
        page: flowPage,
        pageSize: flowPageSize,
        query: flowQuery,
        status: flowStatus,
        paymentStatus: flowPaymentStatus,
        paymentType: flowPaymentType,
        paymentDirection: flowPaymentDirection,
        sort: flowSort,
        doneRetentionDays: doneDays,
        auth,
      });
      return NextResponse.json(
        {
          ok: true,
          flowKey: modeKey,
          flowItems: flow.items,
          flowItemsPagination: flow.pagination,
          flowStageCounts: flow.stageCounts,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      );
    }

    // Rolling-deploy compatibility: old browser bundles still call the
    // dashboard endpoint for board pagination. Route those requests through
    // the same Board Query Gateway instead of rebuilding the dashboard graph.
    if (boardOnly && (
      modeKey === "technical-issue-flow" ||
      modeKey === "media-production-flow"
    )) {
      const cycle = await resolveOperationSpace(prisma, {
        context,
      });
      if (!cycle) {
        return NextResponse.json(
          { ok: false, error: "Coordination cycle không tồn tại." },
          { status: 404 },
        );
      }
      const boardKey = modeKey === "technical-issue-flow"
        ? "technical-issue"
        : "media-operation";
      const board = await getCoordinationBoard({
        db: prisma,
        context,
        boardKey,
        taskId: cycle.task.id,
        auth,
        stage: boardStage,
        page: boardPage,
        pageSize: boardPageSize,
        doneRetentionDays: doneDays,
      });
      return NextResponse.json({
        ok: true,
        boardKey,
        board,
        technicalIssueBoard: boardKey === "technical-issue" ? board : undefined,
        mediaBoard: boardKey === "media-operation" ? board : undefined,
      }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Dashboard Space đã được chuyển sang mục Báo cáo.",
        href: "/admin/reports/overview",
      },
      { status: 410 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Không thể tải dữ liệu Space" },
      { status: 500 },
    );
  }
}
