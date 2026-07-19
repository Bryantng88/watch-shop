"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  CreditCard,
  Filter,
  Grid2X2,
  GripVertical,
  Info,
  Inbox,
  List,
  Monitor,
  Plus,
  Receipt,
  RotateCcw,
  Send,
  SlidersHorizontal,
  XCircle,
  Zap,
} from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import {
  rolloverPreviousCycleItemsAction,
} from "@/domains/coordination/actions/coordination.actions";
import {
  createTaskItemAction,
  submitOperationalBlueprintActionAction,
} from "@/domains/task/actions/task.actions";
import type {
  OperationalBlueprintAction,
  OperationalBlueprintActionField,
} from "@/domains/blueprint/shared/operational-blueprint";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import {
  useAppProgress,
  type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { repairVietnameseMojibake } from "@/domains/shared/text/vietnamese-mojibake";
import BusinessListDashboard from "@/domains/shared/ui/business-list/BusinessListDashboard";
import type { BusinessListDashboardData, BusinessListDashboardWidgetKey } from "@/domains/shared/ui/business-list";
import {
  SpaceViewFooterTip,
  SpaceViewPage,
} from "@/domains/shared/ui/space/SpaceViewShell";
import SpaceFilterBar, { SpaceViewSwitch } from "@/domains/shared/ui/space/SpaceFilterBar";
import type { CoordinationDashboardDTO } from "../server/coordination-dashboard.types";
import { isCoreWorkspaceBlueprint } from "@/domains/task/shared/workspace-flow-policy";

type Props = {
  data: CoordinationDashboardDTO;
};

const SPACE_DASHBOARD_WIDGETS: BusinessListDashboardWidgetKey[] = ["overview", "value-trend", "status-breakdown", "recent-activity"];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function initials(label: string) {
  return label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "U";
}

function contextPath(context: CoordinationDashboardDTO["context"]) {
  if (context === "SALES") return "sales";
  if (context === "TECHNICAL") return "technical";
  if (context === "MEDIA") return "media";
  if (context === "PAYMENT") return "payment";
  if (context === "GENERAL") return "general";
  return "operation";
}

function prefixedLabel(prefix: "Space" | "Workspace", value: string) {
  const cleanValue = repairVietnameseMojibake(value).trim();
  if (!cleanValue) return prefix;
  if (cleanValue.toLowerCase().startsWith(`${prefix.toLowerCase()} `)) {
    return cleanValue;
  }

  return `${prefix} ${cleanValue}`;
}

function displayText(value: string | null | undefined) {
  return repairVietnameseMojibake(value ?? "").trim();
}

function resolveIdentityImageSrc(value?: string | null) {
  const src = String(value ?? "").trim();
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return resolveMediaPreviewSrc(src);
}

function actionLabel(value: string) {
  const cleanValue = displayText(value);
  if (
    cleanValue === "Nhận item tồn tuần trước" ||
    cleanValue.toLowerCase() === "nhan item ton tuan truoc"
  ) {
    return "Nhận item tồn từ tuần trước";
  }

  return cleanValue;
}

function modeLabel(mode: CoordinationDashboardDTO["viewConfig"]["modes"][number]) {
  if (mode.key === "media-production-flow") return "Luồng sản xuất Media";
  if (mode.key === "sr-cases") return "Hồ sơ yêu cầu dịch vụ";
  if (mode.key === "technical-issue-flow") return "Bàn xử lý kỹ thuật";
  if (mode.key === "workspace-index") return "Danh sách Workspace";
  return displayText(mode.label);
}

type SpaceCoreFlow = NonNullable<CoordinationDashboardDTO["viewConfig"]["coreFlows"]>[number];

function coreFlowLabel(flow: SpaceCoreFlow) {
  if (flow.key === "media-production-flow") return "Sản xuất Media";
  if (flow.key === "technical-issue-flow") return "Xử lý lỗi kỹ thuật";
  return displayText(flow.label);
}

function coreFlowDescription(flow: SpaceCoreFlow) {
  if (flow.key === "media-production-flow") {
    return "Hiển thị đường vận hành Media theo thứ tự stage.";
  }
  if (flow.key === "technical-issue-flow") {
    return "Hiển thị đường xử lý lỗi kỹ thuật theo thứ tự stage.";
  }

  return displayText(flow.description);
}

function stageLabel(value: string) {
  const labels: Record<string, string> = {
    Photography: "Chụp ảnh",
    "Media Processing": "Xử lý Media",
    Publish: "Đăng bài",
    Inspect: "Kiểm tra",
    Processing: "Xử lý",
    "Done / Follow-up": "Hoàn tất / Theo dõi",
  };

  return labels[value] ?? displayText(value);
}

function targetTypeLabel(value: string) {
  const labels: Record<string, string> = {
    WATCH: "Đồng hồ",
    SERVICE_REQUEST: "Yêu cầu dịch vụ",
    TECHNICAL_ISSUE: "Lỗi kỹ thuật",
  };

  return labels[value] ?? value;
}

function emptyStateText(value: string, modeKey?: string) {
  if (modeKey === "WORKSPACE") return "Chưa có Workspace thủ công trong chế độ xem này.";

  const cleanValue = displayText(value);
  if (cleanValue.toLowerCase().includes("technical space")) {
    return "Chưa có Workspace trong Không gian kỹ thuật này.";
  }
  if (cleanValue.toLowerCase().includes("media production flow")) {
    return "Chưa có Workspace trong Luồng sản xuất Media tuần này.";
  }

  return cleanValue;
}

function ticketFlowStageKey(
  ticket: CoordinationDashboardDTO["workTickets"][number],
) {
  return ticket.blueprint?.flowStageKey ?? ticket.blueprint?.key ?? null;
}

function normalizeStageKey(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

function stageVisual(stageKey: string | null | undefined) {
  const normalized = normalizeStageKey(stageKey);
  if (normalized.includes("photo")) {
    return {
      Icon: Camera,
      frame: "bg-violet-50 text-violet-700 ring-violet-100",
      description: "Chuẩn bị và chụp ảnh sản phẩm",
    };
  }
  if (normalized.includes("media-processing")) {
    return {
      Icon: SlidersHorizontal,
      frame: "bg-sky-50 text-sky-700 ring-sky-100",
      description: "Chỉnh sửa và xử lý hình ảnh",
    };
  }
  if (normalized.includes("inspect")) {
    return {
      Icon: Filter,
      frame: "bg-violet-50 text-violet-700 ring-violet-100",
      description: "Tiếp nhận và kiểm tra lỗi kỹ thuật",
    };
  }
  if (normalized.includes("processing") || normalized.includes("process")) {
    return {
      Icon: SlidersHorizontal,
      frame: "bg-sky-50 text-sky-700 ring-sky-100",
      description: "Đang xử lý kỹ thuật",
    };
  }
  if (normalized.includes("done") || normalized.includes("follow")) {
    return {
      Icon: CheckCircle2,
      frame: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      description: "Hoàn tất và theo dõi sau xử lý",
    };
  }
  if (normalized.includes("publish")) {
    return {
      Icon: Send,
      frame: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      description: "Xuất bản và phân phối",
    };
  }

  return {
    Icon: List,
    frame: "bg-slate-50 text-slate-700 ring-slate-100",
    description: "Workspace vận hành",
  };
}

function enabledCapabilityLabels(
  capabilities: CoordinationDashboardDTO["blueprints"][number]["workspaceDefinition"]["enabledCapabilities"],
) {
  return [
    capabilities.workflow ? "Quy trình" : null,
    capabilities.items ? "Item" : null,
    capabilities.activity ? "Hoạt động" : null,
    capabilities.discussion ? "Trao đổi" : null,
    capabilities.attachments ? "Tệp đính kèm" : null,
    capabilities.checklist ? "Checklist" : null,
    capabilities.dueDate ? "Hạn xử lý" : null,
    capabilities.assignee ? "Người phụ trách" : null,
    capabilities.priority ? "Độ ưu tiên" : null,
  ].filter(Boolean) as string[];
}

function blueprintSourceLabel(
  blueprint: CoordinationDashboardDTO["blueprints"][number],
) {
  if (blueprint.source === "DRAFT") {
    return blueprint.status ? `Draft (${blueprint.status})` : "Draft";
  }

  return "Registry";
}

function blueprintSelectLabel(
  blueprint: CoordinationDashboardDTO["blueprints"][number],
) {
  const identity =
    blueprint.source === "DRAFT"
      ? ` #${blueprint.selectionKey.replace(/^DRAFT:/, "").slice(0, 8)}`
      : "";

  return `${blueprint.name}${identity} - ${blueprintSourceLabel(blueprint)}`;
}

function StageIconFrame({ stageKey }: { stageKey: string | null | undefined }) {
  const visual = stageVisual(stageKey);
  const Icon = visual.Icon;

  return (
    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md ring-1 ${visual.frame}`}>
      <Icon className="h-6 w-6" />
    </span>
  );
}

function WorkspaceIdentityFrame({
  ticket,
}: {
  ticket: CoordinationDashboardDTO["workTickets"][number];
}) {
  const src = resolveIdentityImageSrc(ticket.identityPreview?.imageUrl);

  if (src) {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={ticket.identityPreview?.title ?? ticket.title}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return <StageIconFrame stageKey={ticketFlowStageKey(ticket)} />;
}

function formatMoneyCompact(value?: number | null) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) return "0đ";
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`;
}

function CreatorCell({
  creator,
}: {
  creator: CoordinationDashboardDTO["workTickets"][number]["creator"];
}) {
  const src = resolveMediaPreviewSrc(creator.avatarUrl);

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500 lg:hidden">Người tạo</div>
      <div className="mt-1 inline-flex min-w-0 items-center gap-2 lg:mt-0">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${creator.isSystem ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={creator.label} className="h-full w-full object-cover" />
          ) : creator.isSystem ? (
            "S"
          ) : (
            initials(creator.label)
          )}
        </span>
        <span className="truncate font-medium text-slate-800">{creator.label}</span>
      </div>
    </div>
  );
}

export default function OperationCoordinationWorkspace({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const [blueprintKey, setBlueprintKey] = useState(
    data.blueprints[0]?.selectionKey ?? "",
  );
  const [activeViewModeKey, setActiveViewModeKey] = useState(
    data.viewConfig.defaultModeKey,
  );
  const initialTitle = data.blueprints[0]?.workspaceDefinition.defaultName ?? "";
  const [title, setTitle] = useState(initialTitle);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workTicketView, setWorkTicketView] = useState<"LIST" | "TI_BOARD">("LIST");
  const [dashboardCustomizationRequest, setDashboardCustomizationRequest] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCreator, setFilterCreator] = useState("ALL");
  const [filterWorkStatus, setFilterWorkStatus] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [workspacePage, setWorkspacePage] = useState(1);
  const [workspacePageSize, setWorkspacePageSize] = useState(10);
  const [isPending, startTransition] = useTransition();
  const selectedBlueprint = useMemo(
    () =>
      data.blueprints.find((blueprint) => blueprint.selectionKey === blueprintKey) ??
      data.blueprints[0] ??
      null,
    [blueprintKey, data.blueprints],
  );
  const capabilityLabels = selectedBlueprint
    ? enabledCapabilityLabels(
        selectedBlueprint.workspaceDefinition.enabledCapabilities,
      )
    : [];
  const activeViewMode =
    data.viewConfig.modes.find(
      (mode) => mode.key === activeViewModeKey,
    ) ?? data.viewConfig.modes[0];
  const activeCoreFlow = activeViewMode?.coreFlowKey
    ? data.viewConfig.coreFlows?.find(
        (flow) => flow.key === activeViewMode.coreFlowKey,
      ) ?? null
    : null;
  const activeStageByWorkspaceKey = useMemo(() => {
    const entries =
      activeCoreFlow?.stages.flatMap((stage) => [
        [normalizeStageKey(stage.workspaceKey), stage] as const,
        [normalizeStageKey(stage.key), stage] as const,
      ]) ?? [];

    return new Map(entries);
  }, [activeCoreFlow]);
  const flowStageKeys = useMemo(
    () =>
      new Set(
        data.viewConfig.coreFlows?.flatMap((flow) =>
          flow.stages.flatMap((stage) => [
            normalizeStageKey(stage.workspaceKey),
            normalizeStageKey(stage.key),
          ]),
        ) ?? [],
      ),
    [data.viewConfig.coreFlows],
  );
  const displayedWorkTickets = useMemo(() => {
    if (!activeCoreFlow || activeViewMode?.rowModel !== "FLOW_STAGE_WORKSPACE") {
      const allowedKinds = activeViewMode?.allowedWorkspaceKinds ?? [];
      if (!allowedKinds.length) return data.workTickets;

      return data.workTickets.filter((ticket) => {
        const inferredWorkspaceKind =
          ticket.blueprint?.workspaceKind ??
          (flowStageKeys.has(normalizeStageKey(ticketFlowStageKey(ticket)))
            ? "FLOW_STAGE_WORKSPACE"
            : null);

        if (!inferredWorkspaceKind) return activeViewMode?.rowModel === "WORKSPACE";
        return allowedKinds.includes(inferredWorkspaceKind);
      });
    }

    const stageOrderByWorkspaceKey = new Map(
      activeCoreFlow.stages.flatMap((stage) => [
        [normalizeStageKey(stage.workspaceKey), stage.sortOrder] as const,
        [normalizeStageKey(stage.key), stage.sortOrder] as const,
      ]),
    );

    return data.workTickets
      .filter((ticket) => {
        if (
          ticket.blueprint?.workspaceKind &&
          ticket.blueprint.workspaceKind !== "FLOW_STAGE_WORKSPACE"
        ) {
          return false;
        }

        const stageKey = normalizeStageKey(ticketFlowStageKey(ticket));
        return stageKey ? stageOrderByWorkspaceKey.has(stageKey) : false;
      })
      .slice()
      .sort((left, right) => {
        const leftStageKey = normalizeStageKey(ticketFlowStageKey(left));
        const rightStageKey = normalizeStageKey(ticketFlowStageKey(right));
        const leftOrder = leftStageKey
          ? stageOrderByWorkspaceKey.get(leftStageKey) ?? Number.MAX_SAFE_INTEGER
          : Number.MAX_SAFE_INTEGER;
        const rightOrder = rightStageKey
          ? stageOrderByWorkspaceKey.get(rightStageKey) ?? Number.MAX_SAFE_INTEGER
          : Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return left.title.localeCompare(right.title);
      });
  }, [activeCoreFlow, activeViewMode, data.workTickets, flowStageKeys]);
  const filterFacets = useMemo(() => {
    const creators = new Map<string, number>();
    const result = { open: 0, feedback: 0, done: 0, unpaid: 0, paid: 0, none: 0 };
    displayedWorkTickets.forEach((ticket) => {
      creators.set(ticket.creator.label, (creators.get(ticket.creator.label) ?? 0) + 1);
      const openItems = ticket.queueSummary.ready + ticket.queueSummary.review + ticket.queueSummary.feedback;
      if (openItems > 0) result.open += 1;
      if (ticket.queueSummary.feedback > 0) result.feedback += 1;
      if (openItems === 0 && ticket.queueSummary.done > 0) result.done += 1;
      const paymentStatus = ticket.paymentSummary?.status ?? "NONE";
      if (["UNPAID", "PARTIAL"].includes(paymentStatus)) result.unpaid += 1;
      else if (paymentStatus === "PAID") result.paid += 1;
      else result.none += 1;
    });
    return { ...result, creators };
  }, [displayedWorkTickets]);
  const creatorFilterOptions = useMemo(() => [
    { label: `Tất cả người tạo (${displayedWorkTickets.length})`, value: "ALL" },
    ...Array.from(filterFacets.creators.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([creator, count]) => ({ label: `${creator} (${count})`, value: creator })),
  ], [displayedWorkTickets.length, filterFacets.creators]);
  const filteredWorkTickets = useMemo(() => {
    const query = filterQuery.trim().toLocaleLowerCase("vi");
    return displayedWorkTickets.filter((ticket) => {
      const openItems = ticket.queueSummary.ready + ticket.queueSummary.review + ticket.queueSummary.feedback;
      const searchable = [ticket.title, ticket.creator.label, ticket.lastActivity, ticket.identityPreview?.title, ticket.identityPreview?.ref]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("vi");
      if (query && !searchable.includes(query)) return false;
      if (filterCreator !== "ALL" && ticket.creator.label !== filterCreator) return false;
      if (filterWorkStatus === "OPEN" && openItems <= 0) return false;
      if (filterWorkStatus === "DONE" && (openItems > 0 || ticket.queueSummary.done <= 0)) return false;
      if (filterWorkStatus === "FEEDBACK" && ticket.queueSummary.feedback <= 0) return false;
      const paymentStatus = ticket.paymentSummary?.status ?? "NONE";
      if (filterPayment === "UNPAID" && !["UNPAID", "PARTIAL"].includes(paymentStatus)) return false;
      if (filterPayment === "PAID" && paymentStatus !== "PAID") return false;
      if (filterPayment === "NONE" && paymentStatus !== "NONE") return false;
      return true;
    });
  }, [displayedWorkTickets, filterCreator, filterPayment, filterQuery, filterWorkStatus]);
  const workspacePageCount = Math.max(1, Math.ceil(filteredWorkTickets.length / workspacePageSize));
  const safeWorkspacePage = Math.min(workspacePage, workspacePageCount);
  const workspacePageStart = (safeWorkspacePage - 1) * workspacePageSize;
  const pagedWorkTickets = filteredWorkTickets.slice(workspacePageStart, workspacePageStart + workspacePageSize);
  useEffect(() => {
    setWorkspacePage(1);
  }, [activeViewModeKey, filterCreator, filterPayment, filterQuery, filterWorkStatus, workspacePageSize]);
  const spaceDashboardData = useMemo<BusinessListDashboardData>(() => {
    const totals = filteredWorkTickets.reduce((result, ticket) => {
      result.ready += ticket.queueSummary.ready;
      result.review += ticket.queueSummary.review;
      result.feedback += ticket.queueSummary.feedback;
      result.done += ticket.queueSummary.done;
      if (ticket.feedbackCount > 0) result.feedbackWorkspaces += 1;
      const paymentStatus = ticket.paymentSummary?.status ?? "NONE";
      if (paymentStatus !== "NONE" && paymentStatus !== "PAID") {
        result.unpaidWorkspaces += 1;
        result.unpaidAmount += Number(ticket.paymentSummary?.remainingAmount ?? ticket.paymentSummary?.unpaidAmount ?? 0);
      }
      return result;
    }, { ready: 0, review: 0, feedback: 0, done: 0, feedbackWorkspaces: 0, unpaidWorkspaces: 0, unpaidAmount: 0 });
    const items = totals.ready + totals.review + totals.feedback + totals.done;
    const openItems = totals.ready + totals.review + totals.feedback;
    const activeWorkspaces = filteredWorkTickets.filter((ticket) =>
      ticket.queueSummary.ready + ticket.queueSummary.review + ticket.queueSummary.feedback > 0,
    ).length;
    const activities = filteredWorkTickets
      .filter((ticket) => ticket.lastActivityAt)
      .slice()
      .sort((left, right) => String(right.lastActivityAt).localeCompare(String(left.lastActivityAt)))
      .slice(0, 3)
      .map((ticket) => ({ id: ticket.id, title: ticket.lastActivity || ticket.title, description: prefixedLabel("Workspace", ticket.title), occurredAt: ticket.lastActivityAt, href: `/admin/task-items/${ticket.id}`, kind: "updated" as const }));

    return {
      periodLabel: `Tuần ${data.week.weekNumber}/${data.week.year}`,
      metrics: [
        { key: "workspaces", label: "Workspace", value: filteredWorkTickets.length, helper: `${activeWorkspaces}`, helperSuffix: "đang mở", helperTone: activeWorkspaces ? "positive" : "neutral" },
        { key: "open-items", label: "Item mở", value: openItems, helper: `${totals.done}`, helperSuffix: "đã xong", helperTone: totals.done ? "positive" : "neutral" },
        { key: "feedback", label: "Cần phản hồi", value: totals.feedback, helper: `${totals.feedbackWorkspaces}`, helperSuffix: "workspace", helperTone: totals.feedback ? "negative" : "neutral" },
        { key: "unpaid", label: "Chưa thanh toán", value: totals.unpaidWorkspaces, helper: formatMoneyCompact(totals.unpaidAmount), helperTone: totals.unpaidWorkspaces ? "negative" : "neutral" },
      ],
      inventoryValue: { label: "Khối lượng xử lý", value: items, currency: "item", helper: "Tổng item trong các workspace đang hiển thị.", trend: [totals.ready, totals.review, totals.feedback, totals.done, openItems] },
      breakdown: { label: "Theo trạng thái item", total: Math.max(items, 1), items: [
        { key: "ready", label: "Sẵn sàng", value: totals.ready, tone: "blue" },
        { key: "review", label: "Đang xử lý", value: totals.review, tone: "violet" },
        { key: "feedback", label: "Phản hồi", value: totals.feedback, tone: "amber" },
        { key: "done", label: "Xong", value: totals.done, tone: "emerald" },
      ] },
      activities: { label: "Hoạt động gần đây", items: activities },
    };
  }, [data.week.weekNumber, data.week.year, filteredWorkTickets]);
  const isTechnicalIssueFlowMode = activeViewMode?.key === "technical-issue-flow";
  const canShowTechnicalIssueBoard =
    isTechnicalIssueFlowMode && Boolean(data.technicalIssueBoard?.items.length);
  const isTechnicalIssueBoardView =
    workTicketView === "TI_BOARD" && canShowTechnicalIssueBoard;
  useEffect(() => {
    if (!isTechnicalIssueFlowMode && workTicketView === "TI_BOARD") {
      setWorkTicketView("LIST");
    }
  }, [isTechnicalIssueFlowMode, workTicketView]);
  const showPaymentColumn = displayedWorkTickets.some((ticket) => ticket.paymentSummary);
  const workTicketGridClass = showPaymentColumn
    ? "lg:grid-cols-[1.85fr_0.85fr_1.05fr_1.08fr_0.6fr_0.8fr_1.2fr_auto]"
    : "lg:grid-cols-[2fr_1fr_1.1fr_0.7fr_0.9fr_1.5fr_auto]";
  const activeEmptyState =
    activeViewMode?.rowModel === "WORKSPACE"
      ? emptyStateText(data.viewConfig.emptyState, "WORKSPACE")
      : emptyStateText(data.viewConfig.emptyState, activeViewMode?.rowModel);

  function updateDate(date: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("date", date);
    router.push(`/admin/coordination/${contextPath(data.context)}?${next.toString()}`);
  }

  async function createWorkTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const blueprint = data.blueprints.find(
      (item) => item.selectionKey === blueprintKey,
    );
    if (blueprint?.usage.active && isCoreWorkspaceBlueprint(blueprint)) {
      await dialog.alert({
        title: "Blueprint core đã có Workspace",
        message:
          "Blueprint này chỉ được có một Workspace đang hoạt động trong Space hiện tại. Hãy dùng Workspace hiện có hoặc đóng Workspace cũ trước khi tạo mới.",
        tone: "warning",
      });
      return;
    }

    const duplicateBlueprintConfirmed =
      !blueprint?.usage.active ||
      (await dialog.confirm({
        title: "Xác nhận tạo Workspace",
        message: `Blueprint này hiện có ${blueprint.usage.active} Workspace đang hoạt động trong Space này. Bạn có chắc muốn tạo thêm Workspace mới từ Blueprint này không?`,
        confirmText: "Tạo thêm",
        cancelText: "Hủy",
        tone: "warning",
      }));

    if (!duplicateBlueprintConfirmed) return;

    setError(null);
    startTransition(async () => {
      try {
        await createTaskItemAction({
          taskId: data.cycle.id,
          title: cleanTitle,
          note: blueprint?.snapshotNote ?? null,
          priority: "MEDIUM",
          allowDuplicateBlueprint: Boolean(blueprint?.usage.active),
        });
        setIsCreateFormOpen(false);
        setBlueprintKey(data.blueprints[0]?.selectionKey ?? "");
        setTitle(data.blueprints[0]?.workspaceDefinition.defaultName ?? "");
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Không thể tạo Workspace.");
      }
    });
  }

  async function rolloverPreviousCycle() {
    const ok = await dialog.confirm({
      title: "Nhận item tồn từ tuần trước?",
      message:
        "Hệ thống sẽ chuyển các item chưa xử lý xong từ Space tuần trước sang Workspace chính tương ứng trong Space tuần này. Item cũ sẽ được đánh dấu đã chuyển để không còn hiện như đang hoạt động.",
      confirmText: "Nhận item tồn",
      cancelText: "Hủy",
      tone: "warning",
    });

    if (!ok) return;

    setError(null);
    progress.show({
      title: "Đang nhận item tồn",
      message: "Hệ thống đang chuyển item sang các Workspace core của tuần hiện tại.",
    });

    try {
      const result = await rolloverPreviousCycleItemsAction({
        taskId: data.cycle.id,
        context: data.context,
      });
      const steps: AppProgressStep[] = result.items.map((item, index) => {
        const target = `${item.targetType}:${item.targetId.slice(0, 8)}`;
        const from = repairVietnameseMojibake(item.fromWorkspaceTitle);
        const to = repairVietnameseMojibake(item.toWorkspaceTitle ?? "không có workspace nhận");
        const status =
          item.status === "MOVED"
            ? "done"
            : item.status === "FAILED"
              ? "error"
              : "skipped";

        return {
          id: `${item.targetType}:${item.targetId}:${index}`,
          label: `${target} - ${from} -> ${to}`,
          detail: item.reason ? `${item.status} (${item.reason})` : item.status,
          status,
        };
      });
      progress.update({
        title: "Đã xử lý item tồn",
        message: `Moved: ${result.moved} · Skipped: ${result.skipped} · Failed: ${result.failed}`,
        steps,
      });
      await sleep(result.items.length ? 1800 : 700);

      const lines = result.items
        .slice(0, 12)
        .map((item) => {
          const target = `${item.targetType}:${item.targetId.slice(0, 8)}`;
          const to = item.toWorkspaceTitle ?? "không có workspace nhận";
          return `${item.status} - ${target} - ${item.fromWorkspaceTitle} -> ${to}${item.reason ? ` (${item.reason})` : ""}`;
        });
      const more = result.items.length > lines.length
        ? `\n... và ${result.items.length - lines.length} item khác`
        : "";

      progress.hide();
      await dialog.alert({
        title: "Đã xử lý item tồn",
        message: [
          `Moved: ${result.moved}`,
          `Skipped: ${result.skipped}`,
          `Failed: ${result.failed}`,
          lines.length ? `\n${lines.join("\n")}${more}` : "\nKhông có item cần chuyển.",
        ].join("\n"),
        tone: result.failed ? "warning" : "success",
      });
      router.refresh();
    } catch (caught) {
      progress.hide();
      setError(caught instanceof Error ? caught.message : "Không thể nhận item tồn từ tuần trước.");
    }
  }

  return (
    <SpaceViewPage
      breadcrumbs={
        <AdminBreadcrumbs
          items={[
            { label: "Quản lý Space" },
            { label: data.spacesLabel },
          ]}
        />
      }
      title={prefixedLabel("Space", data.cycle.title)}
      status={
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          Đang hoạt động
        </span>
      }
      actions={
        <button
          type="button"
          onClick={() => setDashboardCustomizationRequest((request) => request + 1)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Tùy chỉnh dashboard
        </button>
      }
    >
        <BusinessListDashboard
          data={spaceDashboardData}
          widgets={SPACE_DASHBOARD_WIDGETS}
          storageKey="admin-dashboard:technical-space"
          customizationRequest={dashboardCustomizationRequest}
          showCustomizationTrigger={false}
        />
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
          <div className="border-b border-slate-200 px-5 py-4">
            {activeViewMode ? (
              <div className="rounded-xl border border-sky-100 bg-gradient-to-b from-sky-50/80 to-[#f3f8ff] p-4 text-xs text-slate-700 shadow-[0_8px_24px_rgba(30,43,79,0.04)]">
                <div className="grid gap-4 xl:grid-cols-[minmax(320px,1fr)_auto] xl:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="m-0 text-lg font-extrabold text-[#07113d]">
                        {activeCoreFlow ? coreFlowLabel(activeCoreFlow) : modeLabel(activeViewMode)}
                      </h2>
                      <span className="rounded-full border border-violet-200 bg-white/80 px-2.5 py-0.5 font-semibold text-violet-700">
                        {activeViewMode.key === data.viewConfig.defaultModeKey ? "Mặc định" : "View"}
                      </span>
                      {data.viewConfig.modes.length > 1 ? (
                        <select
                          value={activeViewMode.key}
                          onChange={(event) => setActiveViewModeKey(event.target.value)}
                          className="ml-1 h-8 min-w-48 rounded-md border border-violet-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-violet-300"
                          aria-label="Chế độ xem Space"
                        >
                          {data.viewConfig.modes.map((mode) => (
                            <option key={mode.key} value={mode.key}>
                              {modeLabel(mode)}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-[#6f7a96]">
                      {activeCoreFlow ? coreFlowDescription(activeCoreFlow) : displayText(activeViewMode.description)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <SpaceViewSwitch
                      activeView={isTechnicalIssueBoardView ? "TI_BOARD" : "LIST"}
                      onChange={(value) => setWorkTicketView(value === "TI_BOARD" ? "TI_BOARD" : "LIST")}
                      options={[
                        { value: "TI_BOARD", label: "Board TI", icon: <Grid2X2 className="h-4 w-4" />, disabled: !canShowTechnicalIssueBoard },
                        { value: "LIST", label: "List", icon: <List className="h-4 w-4" /> },
                      ]}
                    />
                    <button
                        type="button"
                        disabled={isPending || !data.viewConfig.carryover.enabled}
                        onClick={() => void rolloverPreviousCycle()}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-violet-200 bg-white px-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-slate-400"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="hidden 2xl:inline">{actionLabel(data.viewConfig.carryover.actionLabel)}</span>
                        <span className="2xl:hidden">Nhận tồn</span>
                      </button>
                    <button
                        type="button"
                        disabled={!data.blueprints.length || !data.viewConfig.createWorkspace.enabled}
                        onClick={() => {
                          setError(null);
                          setBlueprintKey(data.blueprints[0]?.selectionKey ?? "");
                          setTitle(data.blueprints[0]?.workspaceDefinition.defaultName ?? "");
                          setIsCreateFormOpen(true);
                        }}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Workspace</span>
                      </button>
                  </div>
                </div>

                <form
                  className={`${isCreateFormOpen ? "flex" : "hidden"} mt-4 min-w-0 flex-col gap-2 border-t border-sky-100 pt-4 sm:flex-row sm:items-center`}
                  onSubmit={createWorkTicket}
                >
                  <select
                    value={blueprintKey}
                    onChange={(event) => {
                      const nextKey = event.target.value;
                      const nextBlueprint = data.blueprints.find(
                        (blueprint) => blueprint.selectionKey === nextKey,
                      );
                      setBlueprintKey(nextKey);
                      setTitle(nextBlueprint?.workspaceDefinition.defaultName ?? "");
                    }}
                    className="h-9 min-w-0 rounded-md border border-sky-100 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-violet-300 sm:w-56"
                  >
                    {data.blueprints.map((blueprint) => (
                      <option key={blueprint.selectionKey} value={blueprint.selectionKey}>
                        {blueprintSelectLabel(blueprint)}
                      </option>
                    ))}
                  </select>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Tên Workspace"
                    className="h-9 min-w-0 rounded-md border border-sky-100 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-violet-300 sm:w-64"
                  />
                  <button
                    type="submit"
                    disabled={isPending || !title.trim()}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Plus className="h-4 w-4" />
                    Xác nhận tạo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setIsCreateFormOpen(false);
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-sky-100 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                </form>
                {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
              </div>
            ) : null}
            <div className="mt-3">
              <SpaceFilterBar
                weekValue={data.week.periodKey}
                weekOptions={data.filters.weekOptions}
                dateValue={data.filters.selectedDate}
                searchValue={filterQuery}
                searchPlaceholder="Tìm Workspace, phụ trách, hoạt động..."
                onSearchChange={setFilterQuery}
                selectFilters={[
                  {
                    key: "creator",
                    label: "Người tạo",
                    value: filterCreator,
                    options: creatorFilterOptions,
                    onChange: setFilterCreator,
                  },
                  {
                    key: "work-status",
                    label: "Trạng thái công việc",
                    value: filterWorkStatus,
                    options: [
                      { label: `Tất cả công việc (${displayedWorkTickets.length})`, value: "ALL" },
                      { label: `Đang mở (${filterFacets.open})`, value: "OPEN" },
                      { label: `Cần phản hồi (${filterFacets.feedback})`, value: "FEEDBACK" },
                      { label: `Đã hoàn tất (${filterFacets.done})`, value: "DONE" },
                    ],
                    onChange: setFilterWorkStatus,
                  },
                  ...(showPaymentColumn ? [{
                    key: "payment",
                    label: "Thanh toán",
                    value: filterPayment,
                    options: [
                      { label: `Tất cả thanh toán (${displayedWorkTickets.length})`, value: "ALL" },
                      { label: `Chưa thanh toán (${filterFacets.unpaid})`, value: "UNPAID" },
                      { label: `Đã thanh toán (${filterFacets.paid})`, value: "PAID" },
                      { label: `Chưa phát sinh (${filterFacets.none})`, value: "NONE" },
                    ],
                    onChange: setFilterPayment,
                  }] : []),
                  {
                    key: "page-size",
                    label: "Số dòng hiển thị",
                    value: String(workspacePageSize),
                    options: [10, 20, 50].map((size) => ({ label: `${size} dòng`, value: String(size) })),
                    onChange: (value) => setWorkspacePageSize(Number(value)),
                  },
                ]}
                onWeekChange={(value) => {
                  const option = data.filters.weekOptions.find((item) => item.value === value);
                  if (option) updateDate(option.date);
                }}
                onDateChange={updateDate}
              >
                <span className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-xl bg-slate-50 px-3 text-xs font-semibold text-slate-500">
                  {filteredWorkTickets.length
                    ? `${workspacePageStart + 1}–${Math.min(workspacePageStart + workspacePageSize, filteredWorkTickets.length)} / ${filteredWorkTickets.length}`
                    : "0 / 0"}
                </span>
                {filterQuery || filterCreator !== "ALL" || filterWorkStatus !== "ALL" || filterPayment !== "ALL" ? <button type="button" onClick={() => { setFilterQuery(""); setFilterCreator("ALL"); setFilterWorkStatus("ALL"); setFilterPayment("ALL"); }} className="inline-flex h-11 shrink-0 items-center rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">Xóa lọc</button> : null}
              </SpaceFilterBar>
            </div>
            {isCreateFormOpen && selectedBlueprint ? (
              <div className="mt-3 grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-3 xl:grid-cols-6">
                <div>
                  <div className="font-medium text-slate-500">Nguồn Blueprint</div>
                  <div className="mt-1 text-slate-900">
                    {blueprintSourceLabel(selectedBlueprint)}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Loại Workspace</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.workspaceType}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Tên gọi Item</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.itemLabel}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">View mặc định</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.defaultView}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Đang bật</div>
                  <div className="mt-1 text-slate-900">
                    {capabilityLabels.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Đã dùng Blueprint</div>
                  <div className={`mt-1 font-semibold ${selectedBlueprint.usage.active ? "text-amber-700" : "text-slate-900"}`}>
                    {selectedBlueprint.usage.active} đang hoạt động / {selectedBlueprint.usage.total} tổng
                  </div>
                </div>
                <div className="md:col-span-3 xl:col-span-6">
                  <div className="font-medium text-slate-500">Mô tả khi tạo</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.defaultDescription ||
                      selectedBlueprint.description ||
                      "-"}
                  </div>
                  {selectedBlueprint.workspaceDefinition.instantiationNotes ? (
                    <div className="mt-1 text-slate-600">
                      {selectedBlueprint.workspaceDefinition.instantiationNotes}
                    </div>
                  ) : null}
                </div>
                {selectedBlueprint.operation ? (
                  <div className="md:col-span-3 xl:col-span-6">
                    <div className="font-medium text-slate-500">Mô hình vận hành</div>
                    <div className="mt-1 text-slate-900">
                      {selectedBlueprint.operation.summary}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                          selectedBlueprint.operationValidation?.ok
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-amber-100 bg-amber-50 text-amber-700"
                        }`}
                      >
                        Kiểm tra hợp đồng:{" "}
                        {selectedBlueprint.operationValidation?.ok
                          ? "đạt"
                          : `${selectedBlueprint.operationValidation?.errors.length ?? 0} lỗi`}
                      </span>
                      {selectedBlueprint.operationValidation?.warnings.length ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {selectedBlueprint.operationValidation.warnings.length} cảnh báo
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 grid gap-2 md:grid-cols-5">
                      <div className="rounded-md border border-slate-200 bg-white p-2">
                        <div className="font-medium text-slate-500">Vai trò Workspace</div>
                        <div className="mt-1 text-slate-900">
                          {selectedBlueprint.operation.workspaceRoles
                            .map((role) => role.label)
                            .join(", ")}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-2">
                        <div className="font-medium text-slate-500">Hành động</div>
                        <div className="mt-1 text-slate-900">
                          {selectedBlueprint.operation.actions.length}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-2">
                        <div className="font-medium text-slate-500">Luồng chính</div>
                        <div className="mt-1 text-slate-900">
                          {selectedBlueprint.operation.coreFlows.length}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-2">
                        <div className="font-medium text-slate-500">Tuyến sự kiện</div>
                        <div className="mt-1 text-slate-900">
                          {selectedBlueprint.operation.eventRoutes.length}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-2">
                        <div className="font-medium text-slate-500">Projection</div>
                        <div className="mt-1 text-slate-900">
                          {selectedBlueprint.operation.projectionSubscriptions
                            .map((projection) => projection.projectionKey)
                            .join(", ") || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 grid gap-2">
                      {selectedBlueprint.operation.coreFlows.map((flow) => (
                        <div
                          key={flow.key}
                          className="rounded-md border border-slate-200 bg-white p-2"
                        >
                          <div className="font-medium text-slate-500">{flow.label}</div>
                          <div className="mt-1 text-slate-700">{flow.description}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-700">
                            {flow.steps.map((step, index) => (
                              <span key={`${flow.key}:${step.workspaceRole}`} className="inline-flex items-center gap-1">
                                {index > 0 ? (
                                  <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                                ) : null}
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                                  {step.label}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedBlueprint.operation.projectionSubscriptions.length ? (
                      <div className="mt-2 grid gap-2">
                        {selectedBlueprint.operation.projectionSubscriptions.map((subscription) => (
                          <div
                            key={subscription.projectionKey}
                            className="rounded-md border border-slate-200 bg-white p-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <div className="font-medium text-slate-500">Đăng ký projection</div>
                                <div className="mt-1 font-semibold text-slate-900">
                                  {subscription.projectionKey}
                                </div>
                              </div>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                Đích: {targetTypeLabel(subscription.resolvesToTargetType)}
                              </span>
                            </div>
                            <div className="mt-1 text-slate-700">{subscription.description}</div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {subscription.eventKeys.map((eventKey) => (
                                <span
                                  key={`${subscription.projectionKey}:${eventKey}`}
                                  className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                                >
                                  {eventKey}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedBlueprint.operation.actions.slice(0, 8).map((action) => (
                        <span
                          key={action.key}
                          className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {action.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {isTechnicalIssueBoardView ? (
            <TechnicalIssueBoardView
              items={data.technicalIssueBoard?.items ?? []}
              actions={selectedBlueprint?.operation?.actions ?? []}
              vendorOptions={data.technicalIssueBoard?.vendorOptions ?? []}
              technicalDetailCatalogOptions={data.technicalIssueBoard?.technicalDetailCatalogOptions ?? []}
            />
          ) : (
            <>
          <div className={cn("hidden border-y border-slate-100 bg-[#fbfcfe] px-5 py-3 text-xs font-bold uppercase tracking-[0.05em] text-slate-500 lg:grid", workTicketGridClass)}>
            <div>Workspace</div>
            <div>Người tạo</div>
            <div>Item / Trạng thái</div>
            {showPaymentColumn ? (
              <div className="flex items-center gap-1 lg:pl-3">
                <span>Thanh toán</span>
                <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </div>
            ) : null}
            <div className="text-center">Phản hồi</div>
            <div className="text-center">Cập nhật</div>
            <div>Hoạt động gần nhất</div>
            <div />
          </div>

          <div className="divide-y divide-slate-200 bg-white">
            {pagedWorkTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/task-items/${ticket.id}`}
                className={cn("grid gap-4 px-5 py-4 transition hover:bg-slate-50 lg:items-center", workTicketGridClass)}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <WorkspaceIdentityFrame ticket={ticket} />
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center">
                      <span className="truncate text-sm font-semibold text-slate-950">
                        {prefixedLabel("Workspace", ticket.title)}
                      </span>
                    </div>
                    {ticketFlowStageKey(ticket) &&
                    activeStageByWorkspaceKey.has(
                      normalizeStageKey(ticketFlowStageKey(ticket)),
                    ) ? (
                      <div className="mt-2">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                          {stageLabel(
                            activeStageByWorkspaceKey.get(
                              normalizeStageKey(ticketFlowStageKey(ticket)),
                            )?.label ?? "",
                          )}
                        </span>
                      </div>
                    ) : null}
                    <div className="mt-2 truncate text-xs text-slate-500">
                      {stageVisual(ticketFlowStageKey(ticket)).description}
                    </div>
                  </div>
                </div>

                <CreatorCell creator={ticket.creator} />
                <QueueSummaryCell summary={ticket.queueSummary} />
                {showPaymentColumn ? (
                  <PaymentSummaryCell summary={ticket.paymentSummary ?? null} />
                ) : null}
                <div className="text-sm lg:flex lg:items-center lg:justify-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    Phản hồi
                  </div>
                  <div className="mt-2 font-semibold text-slate-900 lg:mt-0">
                    {ticket.feedbackCount}
                  </div>
                </div>
                <div className="text-sm lg:flex lg:items-center lg:justify-center lg:text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    Cập nhật
                  </div>
                  <div className="mt-2 text-slate-800 lg:mt-0">
                    {formatDateTime(ticket.updatedAt)}
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 text-sm lg:items-center">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600">
                    <Zap className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs font-medium text-slate-500 lg:hidden">
                      Hoạt động gần nhất
                    </div>
                    <div className="truncate font-medium text-slate-800">
                      {ticket.lastActivity || "-"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatDateTime(ticket.lastActivityAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}

            {!filteredWorkTickets.length ? (
              <div className="flex items-center gap-3 px-4 py-10 text-sm text-slate-500">
                <Inbox className="h-5 w-5" />
                {activeEmptyState}
              </div>
            ) : null}
          </div>
          {!isTechnicalIssueBoardView && filteredWorkTickets.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4">
              <div className="text-xs font-medium text-slate-500">
                Hiển thị {workspacePageStart + 1}–{Math.min(workspacePageStart + workspacePageSize, filteredWorkTickets.length)} trong {filteredWorkTickets.length} Workspace
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setWorkspacePage((page) => Math.max(1, page - 1))} disabled={safeWorkspacePage <= 1} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Trước</button>
                {Array.from({ length: workspacePageCount }, (_, index) => index + 1)
                  .filter((page) => page === 1 || page === workspacePageCount || Math.abs(page - safeWorkspacePage) <= 1)
                  .map((page, index, pages) => (
                    <span key={page} className="contents">
                      {index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-xs text-slate-400">…</span> : null}
                      <button type="button" onClick={() => setWorkspacePage(page)} className={cn("h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold", page === safeWorkspacePage ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>{page}</button>
                    </span>
                  ))}
                <button type="button" onClick={() => setWorkspacePage((page) => Math.min(workspacePageCount, page + 1))} disabled={safeWorkspacePage >= workspacePageCount} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Sau</button>
              </div>
            </div>
          ) : null}
            </>
          )}

          <SpaceViewFooterTip
            icon={<Info className="h-4 w-4" />}
            action={
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-violet-200 bg-white px-3 text-sm font-semibold text-violet-700"
              >
                <BookOpen className="h-4 w-4" />
                Xem hướng dẫn
              </button>
            }
          >
            Gợi ý: kéo thả để đổi thứ tự stage. Nhấp vào Workspace để xem chi tiết item và hoạt động.
          </SpaceViewFooterTip>
        </section>
    </SpaceViewPage>
  );
}

function TechnicalIssueBoardView({
  items,
  actions,
  vendorOptions,
  technicalDetailCatalogOptions,
}: {
  items: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["items"];
  actions: OperationalBlueprintAction[];
  vendorOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["vendorOptions"];
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"];
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<TechnicalIssueBoardStage | null>(null);
  const [moveRequest, setMoveRequest] = useState<TechnicalIssueBoardMoveRequest | null>(null);
  const [moveValues, setMoveValues] = useState<Record<string, string | boolean>>({});
  const [moveError, setMoveError] = useState<string | null>(null);
  const [isMovePending, startMoveTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );
  const columns: Array<{
    key: TechnicalIssueBoardStage;
    label: string;
    hint: string;
  }> = [
    { key: "INSPECT", label: "Kiểm tra", hint: "TI cần xác nhận hoặc phân loại." },
    { key: "READY", label: "Chờ xử lý", hint: "TI đã phân loại, chờ bắt đầu xử lý." },
    { key: "PROCESSING", label: "Xử lý", hint: "TI đang được kỹ thuật/vendor xử lý." },
    { key: "DONE", label: "Done", hint: "TI đã xong kỹ thuật hoặc theo dõi." },
  ];
  const activeItem = activeId ? items.find((item) => item.id === activeId) ?? null : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const issueId = String(event.active.id);
    const targetStage = technicalBoardStageValue(event.over?.id);
    const item = items.find((candidate) => candidate.id === issueId) ?? null;
    setActiveId(null);
    setOverStage(null);

    if (!item || !targetStage || item.stage === targetStage) return;

    const action = technicalBoardActionForMove({
      from: item.stage,
      to: targetStage,
      actions,
    });
    if (!action) {
      setMoveRequest({
        item,
        targetStage,
        action: null,
        unavailableReason: "Chưa có action hợp lệ cho hướng di chuyển này.",
      });
      setMoveValues({});
      setMoveError(null);
      return;
    }

    setMoveRequest({ item, targetStage, action, unavailableReason: null });
    setMoveValues(defaultTechnicalBoardMoveValues(item, action));
    setMoveError(null);
  }

  function submitMove() {
    if (!moveRequest?.action) return;
    const { item, action } = moveRequest;
    if (!item.workspaceTaskItemId) {
      setMoveError("TI này chưa có Workspace stage hiện tại nên không thể đồng bộ workflow.");
      return;
    }

    const visibleFields = action.fields.filter((field) =>
      shouldShowTechnicalBoardField(field, moveValues),
    );
    const missingField = visibleFields.find((field) => {
      if (!field.required) return false;
      const value = moveValues[field.key];
      return typeof value === "boolean" ? !value : !String(value ?? "").trim();
    });
    if (missingField) {
      setMoveError(`Vui lòng nhập ${missingField.label}.`);
      return;
    }
    const assigneeMode = String(
      moveValues.assigneeMode ?? moveValues.actionMode ?? "",
    ).toUpperCase();
    if (assigneeMode === "VENDOR" && !String(moveValues.vendorId ?? "").trim()) {
      setMoveError("Vui lòng chọn vendor.");
      return;
    }

    setMoveError(null);
    startMoveTransition(async () => {
      try {
        await submitOperationalBlueprintActionAction({
          taskItemId: item.workspaceTaskItemId as string,
          actionKey: action.key,
          targetType: "TECHNICAL_ISSUE",
          targetId: item.id,
          fields: moveValues,
        });
        setMoveRequest(null);
        setMoveValues({});
        router.refresh();
      } catch (error) {
        setMoveError(
          error instanceof Error ? error.message : "Không thể chuyển trạng thái TI.",
        );
      }
    });
  }

  return (
    <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-5">
      <div className="overflow-x-auto pb-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={(event) => setOverStage(technicalBoardStageValue(event.over?.id))}
          onDragEnd={handleDragEnd}
        >
          <div className="grid min-w-[1320px] grid-cols-4 gap-5">
            {columns.map((column) => {
              const columnItems = items.filter((item) => item.stage === column.key);
              return (
                <TechnicalIssueBoardColumn
                  key={column.key}
                  column={column}
                  items={columnItems}
                  isOver={overStage === column.key}
                />
              );
            })}
          </div>
          <DragOverlay dropAnimation={{ duration: 160, easing: "ease-out" }}>
            {activeItem ? (
              <div className="w-[260px]">
                <TechnicalIssueBoardCard item={activeItem} dragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        </div>
      <TechnicalIssueBoardMoveModal
        request={moveRequest}
        values={moveValues}
        error={moveError}
        pending={isMovePending}
        vendorOptions={vendorOptions}
        technicalDetailCatalogOptions={technicalDetailCatalogOptions}
        onChange={(key, value) => {
          setMoveValues((current) => ({
            ...current,
            [key]: value,
            ...((key === "assigneeMode" || key === "actionMode") &&
            String(value).toUpperCase() !== "VENDOR"
              ? { vendorId: "" }
              : {}),
          }));
        }}
        onSubmit={submitMove}
        onClose={() => {
          if (isMovePending) return;
          setMoveRequest(null);
          setMoveValues({});
          setMoveError(null);
        }}
      />
    </div>
  );
}

type TechnicalIssueBoardStage =
  NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["items"][number]["stage"];
type TechnicalIssueBoardItem =
  NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["items"][number];
type TechnicalIssueBoardMoveRequest = {
  item: TechnicalIssueBoardItem;
  targetStage: TechnicalIssueBoardStage;
  action: OperationalBlueprintAction | null;
  unavailableReason: string | null;
};

function technicalBoardStageValue(value: unknown): TechnicalIssueBoardStage | null {
  const stage = String(value ?? "").toUpperCase();
  if (stage === "INSPECT" || stage === "READY" || stage === "PROCESSING" || stage === "DONE") {
    return stage;
  }
  return null;
}

function technicalBoardActionForMove(input: {
  from: TechnicalIssueBoardStage;
  to: TechnicalIssueBoardStage;
  actions: OperationalBlueprintAction[];
}) {
  const actionKey =
    input.from === "INSPECT" && input.to === "READY"
      ? "classify_technical_issue"
      : input.from === "INSPECT" && input.to === "DONE"
        ? "close_no_issue"
        : input.from === "READY" && input.to === "PROCESSING"
          ? "start_processing"
          : input.from === "PROCESSING" && input.to === "DONE"
            ? "complete_processing"
            : null;
  if (!actionKey) return null;
  return input.actions.find((action) => action.key === actionKey) ?? null;
}

function defaultTechnicalBoardMoveValues(
  item: TechnicalIssueBoardItem,
  action: OperationalBlueprintAction,
): Record<string, string | boolean> {
  if (action.command === "service.confirmTechnicalIssue") {
    return {
      technicalArea: item.area ?? "GENERAL",
      assigneeMode: item.actionMode && item.actionMode !== "NONE" ? item.actionMode : "INTERNAL",
      vendorId: item.vendorId ?? "",
      estimatedCost: item.estimatedCost == null ? "" : String(item.estimatedCost),
    };
  }
  if (action.command === "service.startTechnicalIssue") {
    return {
      technicalDetailCatalogId: item.technicalDetailCatalogId ?? "",
      actionMode: item.actionMode && item.actionMode !== "NONE" ? item.actionMode : "INTERNAL",
      vendorId: item.vendorId ?? "",
      estimatedCost: item.estimatedCost == null ? "" : String(item.estimatedCost),
      startedNote: "",
      vendorChangeNote: "",
    };
  }
  if (action.command === "service.completeTechnicalIssue") {
    return {
      actualCost:
        item.actualCost == null
          ? item.estimatedCost == null
            ? ""
            : String(item.estimatedCost)
          : String(item.actualCost),
      resolutionNote: "",
      createPayment: true,
    };
  }
  if (action.command === "service.closeTechnicalIssueNoIssue") {
    return { resolutionNote: "" };
  }
  return {};
}

function shouldShowTechnicalBoardField(
  field: OperationalBlueprintActionField,
  values: Record<string, string | boolean>,
) {
  if (field.key !== "vendorId") return true;
  const mode = String(values.assigneeMode ?? values.actionMode ?? "").toUpperCase();
  return mode === "VENDOR";
}

function technicalBoardSubmitLabel(action: OperationalBlueprintAction) {
  if (action.command === "service.confirmTechnicalIssue") return "Xác nhận lỗi";
  if (action.command === "service.closeTechnicalIssueNoIssue") return "Chuyển Done";
  if (action.command === "service.startTechnicalIssue") return "Bắt đầu xử lý";
  if (action.command === "service.completeTechnicalIssue") return "Hoàn tất xử lý";
  return "Xác nhận";
}

function fieldKindLabel(kind: OperationalBlueprintActionField["kind"]) {
  if (kind === "textarea") return "Ghi chú";
  if (kind === "select") return "Chọn";
  if (kind === "money") return "Số tiền";
  if (kind === "boolean") return "Có / không";
  if (kind === "date") return "Ngày";
  return "Nội dung";
}

function TechnicalIssueBoardColumn({
  column,
  items,
  isOver,
}: {
  column: { key: TechnicalIssueBoardStage; label: string; hint: string };
  items: TechnicalIssueBoardItem[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: column.key });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition",
        isOver && "border-violet-300 ring-2 ring-violet-100",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-950">{column.label}</div>
          <div className="mt-1 line-clamp-2 text-xs text-slate-500">{column.hint}</div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {items.length}
        </span>
      </div>
      <div className="grid min-h-[340px] content-start gap-3 p-4">
        {items.map((item) => (
          <DraggableTechnicalIssueBoardCard key={item.id} item={item} />
        ))}
        {!items.length ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
            Kéo TI vào đây.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DraggableTechnicalIssueBoardCard({ item }: { item: TechnicalIssueBoardItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div ref={setNodeRef} style={style} className="min-w-0 max-w-full">
      <TechnicalIssueBoardCard
        item={item}
        dragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

function TechnicalIssueBoardCard({
  item,
  dragging,
  dragHandleProps,
}: {
  item: TechnicalIssueBoardItem;
  dragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}) {
  const href = item.workspaceTaskItemId
    ? `/admin/task-items/${item.workspaceTaskItemId}`
    : `/admin/services/${item.serviceRequestId}`;
  const imageSrc = resolveMediaPreviewSrc(item.serviceRequest.imageUrl);

  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/30",
        dragging && "opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Monitor className="m-3 h-6 w-6 text-slate-400" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={href} className="line-clamp-2 text-sm font-semibold text-slate-950 hover:text-violet-700">
            {item.summary}
          </Link>
          <div className="mt-1 truncate text-xs text-slate-500">
            {item.serviceRequest.refNo ?? "SR"} · {item.serviceRequest.productTitle ?? item.serviceRequest.sku ?? "Watch"}
          </div>
        </div>
        {dragHandleProps ? (
          <button
            type="button"
            {...dragHandleProps}
            className="inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 active:cursor-grabbing"
            aria-label="Kéo TI"
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {technicalAreaLabel(item.area)}
        </span>
        <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
          {technicalStatusLabel(item.executionStatus)}
        </span>
        {item.actionMode ? (
          <span className="max-w-full truncate rounded-full border border-violet-100 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
            {technicalOwnerLabel(item.actionMode, item.vendorName)}
          </span>
        ) : null}
      </div>
      <div className="mt-3 grid min-w-0 grid-cols-1 gap-1 text-xs text-slate-500">
        <span className="min-w-0 truncate">{formatDateTime(item.updatedAt)}</span>
        <span className="min-w-0 truncate font-semibold text-slate-800">
          {item.actualCost ? formatMoneyCompact(item.actualCost) : "Chưa có chi phí"}
        </span>
      </div>
    </div>
  );
}

function TechnicalIssueBoardMoveModal({
  request,
  values,
  error,
  pending,
  vendorOptions,
  technicalDetailCatalogOptions,
  onChange,
  onSubmit,
  onClose,
}: {
  request: TechnicalIssueBoardMoveRequest | null;
  values: Record<string, string | boolean>;
  error: string | null;
  pending: boolean;
  vendorOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["vendorOptions"];
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"];
  onChange: (key: string, value: string | boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  if (!request) return null;
  const action = request.action;
  const visibleFields = action?.fields.filter((field) =>
    shouldShowTechnicalBoardField(field, values),
  ) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-950">
              {action?.label ?? "Không thể chuyển trạng thái"}
            </div>
            <div className="mt-1 truncate text-xs text-slate-500">
              {request.item.summary} · Sang {technicalBoardStageLabel(request.targetStage)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Đóng modal"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <form
          className="space-y-4 px-5 py-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
            {request.unavailableReason ?? action?.description}
          </div>
          {visibleFields.map((field) => (
            <div key={field.key}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span>{field.label}</span>
                <span>{field.required ? "Bắt buộc" : fieldKindLabel(field.kind)}</span>
              </div>
              <TechnicalBoardFieldControl
                field={field}
                value={values[field.key]}
                disabled={pending}
                vendorOptions={vendorOptions}
                technicalDetailCatalogOptions={technicalDetailCatalogOptions}
                area={request.item.area}
                onChange={(value) => onChange(field.key, value)}
              />
            </div>
          ))}
          {error ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              {error}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={pending || !action}
              className="inline-flex h-9 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {pending ? "Đang xử lý" : action ? technicalBoardSubmitLabel(action) : "Không khả dụng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TechnicalBoardFieldControl({
  field,
  value,
  disabled,
  vendorOptions,
  technicalDetailCatalogOptions,
  area,
  onChange,
}: {
  field: OperationalBlueprintActionField;
  value?: string | boolean;
  disabled?: boolean;
  vendorOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["vendorOptions"];
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"];
  area?: string | null;
  onChange: (value: string | boolean) => void;
}) {
  const baseClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 disabled:bg-slate-50 disabled:text-slate-400";
  if (field.kind === "textarea") {
    return (
      <textarea
        className={`${baseClass} min-h-20 py-2`}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        placeholder={field.label}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  if (field.kind === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          disabled={disabled}
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }
  if (field.key === "vendorId") {
    return (
      <select
        className={baseClass}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Chọn vendor</option>
        {vendorOptions.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.name}
          </option>
        ))}
      </select>
    );
  }
  if (field.key === "technicalDetailCatalogId") {
    const normalizedArea = normalizeTechnicalArea(area);
    const options = normalizedArea
      ? technicalDetailCatalogOptions.filter(
          (item) => normalizeTechnicalArea(item.area) === normalizedArea,
        )
      : technicalDetailCatalogOptions;
    return (
      <select
        className={baseClass}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Chọn chi tiết kỹ thuật</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {[item.code, item.name].filter(Boolean).join(" - ") || item.id}
          </option>
        ))}
      </select>
    );
  }
  if (field.kind === "select") {
    return (
      <select
        className={baseClass}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{field.label}</option>
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      className={baseClass}
      disabled={disabled}
      type={field.kind === "date" ? "date" : field.kind === "money" ? "number" : "text"}
      min={field.kind === "money" ? 0 : undefined}
      step={field.kind === "money" ? "1000" : undefined}
      value={typeof value === "string" ? value : ""}
      placeholder={field.kind === "money" ? `${field.label} (số tiền)` : field.label}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function technicalBoardStageLabel(stage: TechnicalIssueBoardStage) {
  if (stage === "INSPECT") return "Kiểm tra";
  if (stage === "READY") return "Chờ xử lý";
  if (stage === "PROCESSING") return "Xử lý";
  return "Done";
}

function normalizeTechnicalArea(value?: string | null) {
  const area = String(value ?? "").trim().toUpperCase();
  if (area === "HANDS" || area === "HAND_MARKERS") return "HANDS_MARKERS";
  if (area === "STRAP") return "BRACELET";
  return area;
}

function technicalAreaLabel(value?: string | null) {
  const raw = normalizeTechnicalArea(value);
  const labels: Record<string, string> = {
    GENERAL: "Tổng quát",
    MOVEMENT: "Máy",
    CASE: "Vỏ",
    CRYSTAL: "Kính",
    DIAL: "Mặt số",
    HANDS_MARKERS: "Kim cọc",
    CROWN: "Núm",
    BRACELET: "Dây",
  };
  return labels[raw] ?? (raw || "Tổng quát");
}

function technicalStatusLabel(value?: string | null) {
  const raw = String(value ?? "").trim().toUpperCase();
  if (raw === "DONE" || raw === "COMPLETED") return "Done";
  if (raw === "IN_PROGRESS") return "Đang xử lý";
  if (raw === "CONFIRMED" || raw === "READY") return "Ready";
  return "Inspect";
}

function technicalOwnerLabel(actionMode?: string | null, vendorName?: string | null) {
  const mode = String(actionMode ?? "").trim().toUpperCase();
  if (mode === "VENDOR") return vendorName ? `Vendor: ${vendorName}` : "Vendor";
  if (mode === "INTERNAL") return "Nội bộ";
  return mode || "Chưa chọn";
}

function QueueSummaryCell({
  summary,
}: {
  summary: CoordinationDashboardDTO["workTickets"][number]["queueSummary"];
}) {
  const total = summary.ready + summary.review + summary.feedback + summary.done;
  const items = [
    { label: "Sẵn sàng", value: summary.ready, color: "bg-blue-400" },
    { label: "Đang xử lý", value: summary.review, color: "bg-violet-500" },
    { label: "Phản hồi", value: summary.feedback, color: "bg-amber-400" },
    { label: "Xong", value: summary.done, color: "bg-emerald-500" },
  ];
  const activeItems = items.filter((item) => item.value > 0);

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-violet-700">
        <span>{total} item</span>
        <span>{total ? (summary.done ? `${summary.done} xong` : "Đang mở") : "Trống"}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        {total ? (
          <div className="flex h-full">
            {activeItems.map((item) => (
              <div
                key={item.label}
                className={item.color}
                style={{ width: `${Math.max((item.value / total) * 100, 4)}%` }}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
        {items.map((item) => (
          <span key={item.label} className="flex items-center justify-between gap-2">
            <span>{item.label}</span>
            <span className="font-medium text-slate-900">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PaymentSummaryCell({
  summary,
}: {
  summary: CoordinationDashboardDTO["workTickets"][number]["paymentSummary"];
}) {
  const isOut = summary?.direction === "OUT";
  if (!summary || summary.status === "NONE") {
    return (
      <div className="text-sm lg:pl-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
          Thanh toán
        </div>
        <div className="mt-2 flex min-w-[150px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-600 lg:mt-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <Receipt className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold">Chưa phát sinh</span>
            <span className="mt-0.5 block text-sm font-bold text-slate-950">0đ</span>
          </span>
        </div>
      </div>
    );
  }

  const frameTone =
    summary.status === "PAID"
      ? "border-emerald-100 bg-emerald-50/70 text-emerald-800"
      : summary.status === "PARTIAL"
        ? "border-amber-100 bg-amber-50/70 text-amber-800"
        : "border-rose-100 bg-rose-50/70 text-rose-800";
  const iconTone =
    summary.status === "PAID"
      ? "bg-emerald-100 text-emerald-700"
      : summary.status === "PARTIAL"
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";
  const label =
    summary.status === "PAID"
      ? isOut
        ? "Đã trả"
        : "Đã thu"
      : summary.status === "PARTIAL"
        ? isOut
          ? "Trả một phần"
          : "Thu một phần"
        : isOut
          ? "Chưa trả"
          : "Chưa thu";
  const amount =
    summary.status === "PAID"
      ? summary.paidAmount || summary.totalAmount
      : summary.remainingAmount || summary.unpaidAmount;
  const subText =
    summary.status === "PAID"
      ? `${summary.paymentCount} payment`
      : `${summary.paymentCount} TI · còn ${summary.unpaidIssueCount}`;
  const Icon = summary.status === "PAID" ? CheckCircle2 : CreditCard;

  return (
    <div className="text-sm lg:pl-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
        Thanh toán
      </div>
      <div className={cn("mt-2 flex min-w-[150px] items-center gap-3 rounded-lg border px-3 py-2.5 lg:mt-0", frameTone)}>
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", iconTone)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold">{label}</span>
          <span className="mt-0.5 block text-sm font-bold text-slate-950">
            {formatMoneyCompact(amount)}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-slate-600">{subText}</span>
        </span>
      </div>
    </div>
  );
}
