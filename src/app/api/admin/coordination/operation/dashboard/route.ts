import { NextRequest, NextResponse } from "next/server";

import {
  getCoordinationBoard,
  getCoordinationDashboard,
  getCoordinationFlowPage,
} from "@/domains/coordination/server/coordination-dashboard.service";
import { resolveOperationSpace } from "@/domains/coordination/server/operation-space.service";
import type { CoordinationContext } from "@/domains/coordination/server/coordination-cycle.types";
import type { BusinessListDashboardData } from "@/domains/shared/ui/business-list";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function doneRetentionDays(value: string | null) {
  if (value === "ALL") return null;
  return value === "30D" ? 30 : 14;
}

function money(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function bangkokTodayRange(now = new Date()) {
  const bangkokOffsetMs = 7 * 60 * 60 * 1000;
  const bangkokNow = new Date(now.getTime() + bangkokOffsetMs);
  const start = new Date(
    Date.UTC(
      bangkokNow.getUTCFullYear(),
      bangkokNow.getUTCMonth(),
      bangkokNow.getUTCDate(),
    ) - bangkokOffsetMs,
  );
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

async function loadTechnicalDailyPerformance() {
  const { start, end } = bangkokTodayRange();
  const [eventCounts, completedWithDeadline, onTime] = await Promise.all([
    prisma.businessEventLog.groupBy({
      by: ["eventKey"],
      where: {
        eventKey: {
          in: [
            "technical_issue.created",
            "technical_issue.started",
            "technical_issue.completed",
          ],
        },
        createdAt: { gte: start, lt: end },
      },
      _count: { _all: true },
    }),
    prisma.technicalIssue.count({
      where: {
        completedAt: { gte: start, lt: end },
        expectedCompletionAt: { not: null },
      },
    }),
    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) AS "count"
      FROM "TechnicalIssue"
      WHERE "completedAt" >= ${start}
        AND "completedAt" < ${end}
        AND "expectedCompletionAt" IS NOT NULL
        AND "completedAt" <= "expectedCompletionAt"
    `,
  ]);
  const count = (eventKey: string) =>
    eventCounts.find((row) => row.eventKey === eventKey)?._count._all ?? 0;

  return {
    label: "Hiệu suất TI hôm nay",
    onTime: Number(onTime[0]?.count ?? 0),
    completedWithDeadline,
    created: count("technical_issue.created"),
    started: count("technical_issue.started"),
    completed: count("technical_issue.completed"),
  };
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
    const cashPeriod = request.nextUrl.searchParams.get("cashPeriod") ?? "WEEK";
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
    const technicalDailyPerformancePromise =
      !flowItemsOnly &&
      !includeBoard &&
      modeKey === "technical-issue-flow"
        ? loadTechnicalDailyPerformance()
        : Promise.resolve(undefined);

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

    const data = await getCoordinationDashboard({
      context,
      modeKey,
      date,
      auth,
      includeDashboardDetails: !flowItemsOnly && !boardOnly,
      includeTechnicalBoard: !flowItemsOnly && includeBoard && modeKey === "technical-issue-flow",
      includeMediaBoard: !flowItemsOnly && includeBoard && modeKey === "media-production-flow",
      boardStage,
      boardPage,
      boardPageSize,
      includeFlowItems: flowItemsOnly,
      flowStageKey,
      flowPage,
      flowPageSize,
      flowQuery,
      flowStatus,
      flowPaymentStatus,
      flowPaymentType,
      flowPaymentDirection,
      flowSort,
      doneRetentionDays: doneDays,
      includeManagementDetails: false,
      includeWorkspaceSummaries: !flowItemsOnly && !boardOnly,
    });
    const technicalDailyPerformance = await technicalDailyPerformancePromise;
    const flow = data.viewConfig.modes.find((mode) => mode.key === modeKey);
    const scopeLabel = data.viewConfig.coreFlows?.find(
      (item) => item.key === flow?.coreFlowKey,
    )?.label ?? flow?.label ?? "Vận hành";
    const totals = data.workTickets.reduce((result, ticket) => {
      result.ready += ticket.queueSummary.ready;
      result.review += ticket.queueSummary.review;
      result.feedback += ticket.queueSummary.feedback;
      result.done += ticket.queueSummary.done;
      if (ticket.feedbackCount > 0) result.feedbackWorkspaces += 1;
      const paymentStatus = ticket.paymentSummary?.status ?? "NONE";
      if (paymentStatus !== "NONE" && paymentStatus !== "PAID") {
        result.unpaidWorkspaces += 1;
        result.unpaidAmount += Number(
          ticket.paymentSummary?.remainingAmount ?? ticket.paymentSummary?.unpaidAmount ?? 0,
        );
      }
      return result;
    }, { ready: 0, review: 0, feedback: 0, done: 0, feedbackWorkspaces: 0, unpaidWorkspaces: 0, unpaidAmount: 0 });
    const items = totals.ready + totals.review + totals.feedback + totals.done;
    const openItems = totals.ready + totals.review + totals.feedback;
    const activeWorkspaces = data.workTickets.filter((ticket) =>
      ticket.queueSummary.ready + ticket.queueSummary.review + ticket.queueSummary.feedback > 0,
    ).length;
    const activities = data.workTickets
      .filter((ticket) => ticket.lastActivityAt)
      .slice()
      .sort((left, right) => String(right.lastActivityAt).localeCompare(String(left.lastActivityAt)))
      .slice(0, 3)
      .map((ticket) => ({
        id: ticket.id,
        title: ticket.lastActivity || ticket.title,
        description: `Workspace ${ticket.title}`,
        occurredAt: ticket.lastActivityAt,
        href: "/admin/coordination/operation",
        kind: "updated" as const,
      }));
    const period = ["WEEK", "MONTH", "YEAR", "ALL"].includes(cashPeriod)
      ? cashPeriod as "WEEK" | "MONTH" | "YEAR" | "ALL"
      : "WEEK";
    const cashFlow = data.paymentCashFlow?.[period];
    const dashboard: BusinessListDashboardData = {
      periodLabel: `Tuần ${data.timeRange.weekNumber}/${data.timeRange.year}`,
      metrics: [
        { key: "workspaces", label: "Workspace", value: data.workTickets.length, helper: `${activeWorkspaces}`, helperSuffix: "đang mở", helperTone: activeWorkspaces ? "positive" : "neutral" },
        { key: "open-items", label: "Item mở", value: openItems, helper: `${totals.done}`, helperSuffix: "đã xong", helperTone: totals.done ? "positive" : "neutral" },
        { key: "feedback", label: "Cần phản hồi", value: totals.feedback, helper: `${totals.feedbackWorkspaces}`, helperSuffix: "workspace", helperTone: totals.feedback ? "negative" : "neutral" },
        { key: "unpaid", label: "Chưa thanh toán", value: totals.unpaidWorkspaces, helper: money(totals.unpaidAmount), helperTone: totals.unpaidWorkspaces ? "negative" : "neutral" },
      ],
      inventoryValue: { label: `Khối lượng · ${scopeLabel}`, value: items, currency: "item", helper: "Tổng item trong các workspace đang hiển thị.", trend: [totals.ready, totals.review, totals.feedback, totals.done, openItems] },
      breakdown: { label: `Trạng thái · ${scopeLabel}`, total: Math.max(items, 1), items: [
        { key: "ready", label: "Sẵn sàng", value: totals.ready, tone: "blue" },
        { key: "review", label: "Đang xử lý", value: totals.review, tone: "violet" },
        { key: "feedback", label: "Phản hồi", value: totals.feedback, tone: "amber" },
        { key: "done", label: "Xong", value: totals.done, tone: "emerald" },
      ] },
      activities: { label: `Hoạt động · ${scopeLabel}`, items: activities },
      cashFlow: cashFlow ? { period, ...cashFlow } : undefined,
      technicalDailyPerformance,
    };

    return NextResponse.json({
      ok: true,
      data: dashboard,
      technicalIssueBoard: data.technicalIssueBoard,
      technicalIssueBoardItemCount: data.technicalIssueBoard?.items.length ?? 0,
      mediaBoard: data.mediaBoard,
      mediaBoardItemCount: data.mediaBoard?.items.length ?? 0,
      flowItems: flowItemsOnly ? data.flowItems : undefined,
      flowItemsPagination: flowItemsOnly ? data.flowItemsPagination : undefined,
      flowStageCounts: flowItemsOnly ? data.flowStageCounts : undefined,
    }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Không thể tải dashboard" },
      { status: 500 },
    );
  }
}
