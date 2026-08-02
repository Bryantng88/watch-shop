import type { BusinessListDashboardData } from "@/domains/shared/ui/business-list";
import type { CoordinationDashboardDTO } from "../server/coordination-dashboard.types";

function money(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

export function mapCoordinationDashboardShell(
  data: CoordinationDashboardDTO,
  input: {
    modeKey?: string | null;
    cashPeriod?: "WEEK" | "MONTH" | "YEAR" | "ALL";
    technicalDailyPerformance?: BusinessListDashboardData["technicalDailyPerformance"];
  } = {},
): BusinessListDashboardData {
  const flow = data.viewConfig.modes.find((mode) => mode.key === input.modeKey);
  const scopeLabel = data.viewConfig.coreFlows?.find(
    (item) => item.key === flow?.coreFlowKey,
  )?.label ?? flow?.label ?? "Vận hành";
  const isTaskItemMode = flow?.rowModel === "TASK_ITEM";
  const scopedWorkTickets = data.workTickets.filter((ticket) => {
    if (flow?.workTypeKeys?.length) {
      return flow.workTypeKeys.includes(ticket.blueprint?.key ?? "");
    }
    if (flow?.allowedWorkspaceKinds?.length) {
      return Boolean(
        ticket.blueprint?.workspaceKind &&
        flow.allowedWorkspaceKinds.includes(ticket.blueprint.workspaceKind),
      );
    }
    return true;
  });
  const totals = scopedWorkTickets.reduce((result, ticket) => {
    if (isTaskItemMode) {
      if (ticket.status === "DONE") result.done += 1;
      else result.ready += 1;
    } else {
      result.ready += ticket.queueSummary.ready;
      result.review += ticket.queueSummary.review;
      result.feedback += ticket.queueSummary.feedback;
      result.done += ticket.queueSummary.done;
    }
    if (ticket.feedbackCount > 0) result.feedbackWorkspaces += 1;
    const paymentStatus = ticket.paymentSummary?.status ?? "NONE";
    if (paymentStatus !== "NONE" && paymentStatus !== "PAID") {
      result.unpaidWorkspaces += 1;
      result.unpaidAmount += Number(
        ticket.paymentSummary?.remainingAmount ??
        ticket.paymentSummary?.unpaidAmount ??
        0,
      );
    }
    return result;
  }, {
    ready: 0,
    review: 0,
    feedback: 0,
    done: 0,
    feedbackWorkspaces: 0,
    unpaidWorkspaces: 0,
    unpaidAmount: 0,
  });
  const items = totals.ready + totals.review + totals.feedback + totals.done;
  const openItems = totals.ready + totals.review + totals.feedback;
  const activeWorkspaces = scopedWorkTickets.filter((ticket) =>
    isTaskItemMode
      ? ticket.status !== "DONE"
      : ticket.queueSummary.ready + ticket.queueSummary.review + ticket.queueSummary.feedback > 0,
  ).length;
  const activities = scopedWorkTickets
    .filter((ticket) => ticket.lastActivityAt)
    .slice()
    .sort((left, right) =>
      String(right.lastActivityAt).localeCompare(String(left.lastActivityAt)))
    .slice(0, 3)
    .map((ticket) => ({
      id: ticket.id,
      title: ticket.lastActivity || ticket.title,
      description: `${isTaskItemMode ? "Công việc" : "Workspace"} ${ticket.title}`,
      occurredAt: ticket.lastActivityAt,
      href: `/admin/task-items/${ticket.id}`,
      kind: "updated" as const,
    }));
  const period = input.cashPeriod ?? "WEEK";
  const cashFlow = data.paymentCashFlow?.[period];

  return {
    generatedAt: new Date().toISOString(),
    periodLabel: `Tuần ${data.timeRange.weekNumber}/${data.timeRange.year}`,
    metrics: [
      {
        key: "workspaces",
        label: isTaskItemMode ? "Công việc" : "Workspace",
        value: scopedWorkTickets.length,
        helper: `${activeWorkspaces}`,
        helperSuffix: "đang mở",
        helperTone: activeWorkspaces ? "positive" : "neutral",
      },
      {
        key: "open-items",
        label: "Item mở",
        value: openItems,
        helper: `${totals.done}`,
        helperSuffix: "đã xong",
        helperTone: totals.done ? "positive" : "neutral",
      },
      {
        key: "feedback",
        label: "Cần phản hồi",
        value: isTaskItemMode ? totals.feedbackWorkspaces : totals.feedback,
        helper: `${totals.feedbackWorkspaces}`,
        helperSuffix: isTaskItemMode ? "công việc" : "workspace",
        helperTone: totals.feedbackWorkspaces ? "negative" : "neutral",
      },
      {
        key: "unpaid",
        label: "Chưa thanh toán",
        value: totals.unpaidWorkspaces,
        helper: money(totals.unpaidAmount),
        helperTone: totals.unpaidWorkspaces ? "negative" : "neutral",
      },
    ],
    inventoryValue: {
      label: `Khối lượng · ${scopeLabel}`,
      value: items,
      currency: "item",
      helper: "Tổng item trong các workspace đang hiển thị.",
      trend: [totals.ready, totals.review, totals.feedback, totals.done, openItems],
    },
    breakdown: {
      label: `Trạng thái · ${scopeLabel}`,
      total: Math.max(items, 1),
      items: isTaskItemMode ? [
        { key: "ready", label: "Chưa làm", value: totals.ready, tone: "violet" },
        { key: "done", label: "Đã xong", value: totals.done, tone: "emerald" },
      ] : [
        { key: "ready", label: "Sẵn sàng", value: totals.ready, tone: "blue" },
        { key: "review", label: "Đang xử lý", value: totals.review, tone: "violet" },
        { key: "feedback", label: "Phản hồi", value: totals.feedback, tone: "amber" },
        { key: "done", label: "Xong", value: totals.done, tone: "emerald" },
      ],
    },
    activities: {
      label: `Hoạt động · ${scopeLabel}`,
      items: activities,
    },
    cashFlow: cashFlow ? { period, ...cashFlow } : undefined,
    technicalDailyPerformance: input.technicalDailyPerformance,
  };
}
