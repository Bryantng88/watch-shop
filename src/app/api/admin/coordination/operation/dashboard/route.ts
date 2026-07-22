import { NextRequest, NextResponse } from "next/server";

import { getCoordinationDashboard } from "@/domains/coordination/server/coordination-dashboard.service";
import type { CoordinationContext } from "@/domains/coordination/server/coordination-cycle.types";
import type { BusinessListDashboardData } from "@/domains/shared/ui/business-list";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function money(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
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
    const data = await getCoordinationDashboard({
      context,
      modeKey,
      date,
      auth,
      includeDashboardDetails: true,
      includeTechnicalBoard: modeKey === "technical-issue-flow",
    });
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
        href: `/admin/task-items/${ticket.id}`,
        kind: "updated" as const,
      }));
    const period = ["WEEK", "MONTH", "YEAR", "ALL"].includes(cashPeriod)
      ? cashPeriod as "WEEK" | "MONTH" | "YEAR" | "ALL"
      : "WEEK";
    const cashFlow = data.paymentCashFlow?.[period];
    const dashboard: BusinessListDashboardData = {
      periodLabel: `Tuần ${data.week.weekNumber}/${data.week.year}`,
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
    };

    return NextResponse.json({
      ok: true,
      data: dashboard,
      technicalIssueBoard: data.technicalIssueBoard,
      technicalIssueBoardItemCount: data.technicalIssueBoard?.items.length ?? 0,
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
