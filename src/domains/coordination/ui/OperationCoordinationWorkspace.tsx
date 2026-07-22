"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
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
  AtSign,
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
  LoaderCircle,
  MessageCircle,
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
  previewRolloverPreviousCycleItemsAction,
  rolloverPreviousCycleItemsAction,
  updateSpaceSharingAction,
  updateTechnicalIssuePriorityAction,
} from "@/domains/coordination/actions/coordination.actions";
import {
  applyQueueItemManualTransitionAction,
  createTaskItemAction,
  submitOperationalBlueprintActionAction,
} from "@/domains/task/actions/task.actions";
import type {
  OperationalBlueprintAction,
  OperationalBlueprintActionField,
} from "@/domains/blueprint/shared/operational-blueprint";
import { operationalBlueprintTemplateByKey } from "@/domains/blueprint/shared/operational-blueprint";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import {
  useAppProgress,
  type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { repairVietnameseMojibake } from "@/domains/shared/text/vietnamese-mojibake";
import { AsyncBusinessListDashboard } from "@/domains/shared/ui/business-list";
import type { BusinessListDashboardWidgetKey } from "@/domains/shared/ui/business-list";
import {
  SpaceViewFooterTip,
  SpaceViewPage,
} from "@/domains/shared/ui/space/SpaceViewShell";
import SpaceFilterBar from "@/domains/shared/ui/space/SpaceFilterBar";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import type { CoordinationDashboardDTO } from "../server/coordination-dashboard.types";
import { isCoreWorkspaceBlueprint } from "@/domains/task/shared/workspace-flow-policy";
import WatchSearchPicker, { type WatchSearchResult } from "@/domains/watch/ui/search/WatchSearchPicker";

type Props = {
  data: CoordinationDashboardDTO;
};

type TechnicalIssuePriorityFilter = "ALL" | "URGENT" | "NORMAL";
type TechnicalIssueCommentFilter = "ALL" | "COMMENTED" | "MENTIONED_ME" | "UNREAD_MENTION";
type TechnicalBoardFieldValue = string | boolean | string[];
type TechnicalBoardAdditionalIssue = { summary: string; note: string };

const SPACE_DASHBOARD_WIDGETS: BusinessListDashboardWidgetKey[] = ["overview", "value-trend", "status-breakdown", "recent-activity"];
const PAYMENT_DASHBOARD_WIDGETS: BusinessListDashboardWidgetKey[] = ["overview", "cash-flow", "status-breakdown", "recent-activity"];

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
  if (mode.key === "technical-issue-flow") return "Xử lý lỗi kỹ thuật";
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

type SpaceShareScope = "SPACE" | "CORE_FLOW";

function shareUserLabel(user?: CoordinationDashboardDTO["spaceSharing"]["users"][number] | null) {
  return user?.name || user?.email || "Thành viên";
}

function SpaceShareAvatar({
  user,
}: {
  user: CoordinationDashboardDTO["spaceSharing"]["users"][number];
}) {
  const label = shareUserLabel(user);
  const src = resolveMediaPreviewSrc(user.avatarUrl);

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-violet-100 text-[10px] font-bold text-violet-700">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="h-full w-full object-cover" />
      ) : (
        initials(label)
      )}
    </span>
  );
}

function SpaceSharingEditor({
  taskId,
  context,
  activeCoreFlow,
  sharing,
}: {
  taskId: string;
  context: CoordinationDashboardDTO["context"];
  activeCoreFlow: SpaceCoreFlow | null;
  sharing: CoordinationDashboardDTO["spaceSharing"];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [sharingScope, setSharingScope] = useState<SpaceShareScope>("SPACE");
  const [localScopeIds, setLocalScopeIds] = useState(sharing.scopeUserIds);
  const [isPending, startTransition] = useTransition();
  const activeScope = sharingScope === "CORE_FLOW" && activeCoreFlow ? "CORE_FLOW" : "SPACE";
  const activeCoreFlowKey = activeCoreFlow?.key ?? null;
  const activeSharedIds = activeScope === "CORE_FLOW" && activeCoreFlowKey
    ? localScopeIds.coreFlows[activeCoreFlowKey] ?? []
    : localScopeIds.space;
  const sharedIdSet = new Set(activeSharedIds);
  const visibleSharedUsers = activeSharedIds
    .map((id) => sharing.sharedUsers.find((user) => user.id === id) ?? sharing.users.find((user) => user.id === id))
    .filter(Boolean) as CoordinationDashboardDTO["spaceSharing"]["users"];
  const availableUsers = sharing.users.filter((user) => !sharedIdSet.has(user.id));

  useEffect(() => {
    setLocalScopeIds(sharing.scopeUserIds);
  }, [sharing.scopeUserIds]);

  useEffect(() => {
    if (!activeCoreFlow && sharingScope === "CORE_FLOW") setSharingScope("SPACE");
  }, [activeCoreFlow, sharingScope]);

  function updateSharedUsers(nextSharedIds: string[]) {
    setLocalScopeIds((current) => activeScope === "CORE_FLOW" && activeCoreFlowKey
      ? { ...current, coreFlows: { ...current.coreFlows, [activeCoreFlowKey]: nextSharedIds } }
      : { ...current, space: nextSharedIds });

    startTransition(async () => {
      await updateSpaceSharingAction({
        taskId,
        context,
        sharingScope: activeScope,
        coreFlowKey: activeCoreFlowKey,
        sharedUserIds: nextSharedIds,
      });
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-9 items-center rounded-md border border-violet-200 bg-white px-2.5 text-xs font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
        aria-expanded={isOpen}
        aria-label="Quản lý chia sẻ Space"
      >
        <span className="mr-2 flex items-center">
          {visibleSharedUsers.slice(0, 3).map((user, index) => (
            <span key={user.id} className={cn(index > 0 && "-ml-2")}>
              <SpaceShareAvatar user={user} />
            </span>
          ))}
          {visibleSharedUsers.length > 3 ? (
            <span className="-ml-2 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 px-1 text-[10px] text-slate-600">
              +{visibleSharedUsers.length - 3}
            </span>
          ) : null}
          {!visibleSharedUsers.length ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50">
              <Plus className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </span>
        Chia sẻ
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-xl">
          <div className="font-semibold text-slate-950">Thành viên Space</div>
          <div className="mt-1 text-[11px] text-slate-500">
            {activeScope === "CORE_FLOW" && activeCoreFlow ? coreFlowLabel(activeCoreFlow) : "Toàn bộ Space"}
          </div>

          <div className="mt-3 space-y-2">
            {visibleSharedUsers.length ? visibleSharedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5">
                <SpaceShareAvatar user={user} />
                <span className="min-w-0 flex-1 truncate font-medium">{shareUserLabel(user)}</span>
                <button
                  type="button"
                  onClick={() => updateSharedUsers(activeSharedIds.filter((id) => id !== user.id))}
                  disabled={isPending}
                  className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-rose-600"
                  aria-label={`Xóa quyền chia sẻ của ${shareUserLabel(user)}`}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )) : <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-500">Chưa chia sẻ với ai.</div>}
          </div>

          <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
            <select
              value={activeScope}
              onChange={(event) => setSharingScope(event.target.value as SpaceShareScope)}
              disabled={isPending}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
            >
              <option value="SPACE">Chia sẻ toàn bộ Space</option>
              {activeCoreFlow ? <option value="CORE_FLOW">Chỉ core flow này</option> : null}
            </select>
            <div className="flex gap-2">
              <select
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                disabled={isPending || !availableUsers.length}
                className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
              >
                <option value="">Thêm thành viên</option>
                {availableUsers.map((user) => <option key={user.id} value={user.id}>{shareUserLabel(user)}</option>)}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!selectedUserId) return;
                  updateSharedUsers(Array.from(new Set([...activeSharedIds, selectedUserId])));
                  setSelectedUserId("");
                }}
                disabled={isPending || !selectedUserId}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-950 px-3 font-semibold text-white disabled:bg-slate-300"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
  const [activeViewModeKey, setActiveViewModeKey] = useState(() => {
    const requestedView = searchParams.get("view");
    return data.viewConfig.modes.some((mode) => mode.key === requestedView)
      ? requestedView as string
      : data.viewConfig.defaultModeKey;
  });
  const initialTitle = data.blueprints[0]?.workspaceDefinition.defaultName ?? "";
  const [title, setTitle] = useState(initialTitle);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workTicketView, setWorkTicketView] = useState<"LIST" | "TI_BOARD" | "MEDIA_BOARD">(() =>
    data.viewConfig.defaultModeKey === "technical-issue-flow"
      ? "TI_BOARD"
      : data.viewConfig.defaultModeKey === "media-production-flow"
        ? "MEDIA_BOARD"
      : "LIST",
  );
  const [isTechnicalIntakeOpen, setIsTechnicalIntakeOpen] = useState(false);
  const [focusedTechnicalIssueId, setFocusedTechnicalIssueId] = useState<string | null>(null);
  const [dashboardCustomizationRequest, setDashboardCustomizationRequest] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCreator, setFilterCreator] = useState("ALL");
  const [filterWorkStatus, setFilterWorkStatus] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [technicalIssuePriorityFilter, setTechnicalIssuePriorityFilter] =
    useState<TechnicalIssuePriorityFilter>("ALL");
  const [technicalIssueCommentFilter, setTechnicalIssueCommentFilter] =
    useState<TechnicalIssueCommentFilter>("ALL");
  const [asyncTechnicalIssueBoard, setAsyncTechnicalIssueBoard] = useState(
    data.technicalIssueBoard,
  );
  const [asyncMediaBoard, setAsyncMediaBoard] = useState(data.mediaBoard);
  const [isBoardRefreshing, setIsBoardRefreshing] = useState(false);
  const [boardRefreshedAt, setBoardRefreshedAt] = useState<Date | null>(null);
  const [workspacePage, setWorkspacePage] = useState(1);
  const [workspacePageSize, setWorkspacePageSize] = useState(10);
  const [isRolloverMenuOpen, setIsRolloverMenuOpen] = useState(false);
  const [isMovedItemsOpen, setIsMovedItemsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isViewPending, startViewTransition] = useTransition();
  function changeActiveViewMode(nextModeKey: string) {
    startViewTransition(() => {
      setActiveViewModeKey(nextModeKey);
      setWorkTicketView(nextModeKey === "technical-issue-flow"
        ? "TI_BOARD"
        : nextModeKey === "media-production-flow"
          ? "MEDIA_BOARD"
          : "LIST");
      const params = new URLSearchParams(searchParams.toString());
      params.set("context", data.context);
      params.set("dashboardVersion", "2");
      params.set("view", nextModeKey);
      router.replace(`/admin/coordination/${contextPath(data.context)}?${params.toString()}`);
    });
  }
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
  const isPaymentCollectionFlow =
    activeCoreFlow?.key === "payment-collection-core-flow";
  const dashboardEndpoint = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("context", data.context);
    if (activeViewMode?.key) params.set("view", activeViewMode.key);
    return `/api/admin/coordination/operation/dashboard?${params.toString()}`;
  }, [activeViewMode?.key, data.context, searchParams]);
  const handleDashboardResult = useCallback((result: unknown) => {
    if (!result || typeof result !== "object") return;
    const nested = "data" in result && result.data && typeof result.data === "object"
      ? result.data
      : null;
    const source = { ...(nested ?? {}), ...result };
    const board = (source as {
      technicalIssueBoard?: CoordinationDashboardDTO["technicalIssueBoard"];
    }).technicalIssueBoard;
    if (board) setAsyncTechnicalIssueBoard(board);
    const mediaBoard = (source as {
      mediaBoard?: CoordinationDashboardDTO["mediaBoard"];
    }).mediaBoard;
    if (mediaBoard) setAsyncMediaBoard(mediaBoard);
  }, []);
  const refreshTechnicalIssueBoard = useCallback(async () => {
    if (isBoardRefreshing) return;
    setError(null);
    setIsBoardRefreshing(true);
    try {
      const response = await fetch(dashboardEndpoint, { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error("Không thể tải lại board.");
      handleDashboardResult(result);
      setBoardRefreshedAt(new Date());
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Không thể tải lại board.");
    } finally {
      setIsBoardRefreshing(false);
    }
  }, [dashboardEndpoint, handleDashboardResult, isBoardRefreshing]);
  const handleTechnicalIntakeCompleted = useCallback(async (technicalIssueId: string | null) => {
    setActiveViewModeKey("technical-issue-flow");
    setWorkTicketView("TI_BOARD");
    setTechnicalIssuePriorityFilter("ALL");
    setTechnicalIssueCommentFilter("ALL");
    setFocusedTechnicalIssueId(technicalIssueId);

    const params = new URLSearchParams(searchParams.toString());
    params.set("context", data.context);
    params.set("dashboardVersion", "2");
    params.set("view", "technical-issue-flow");
    const technicalDashboardEndpoint = `/api/admin/coordination/operation/dashboard?${params.toString()}`;
    router.replace(`/admin/coordination/${contextPath(data.context)}?${params.toString()}`);

    try {
      const response = await fetch(technicalDashboardEndpoint, { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (response.ok) handleDashboardResult(result);
    } finally {
      router.refresh();
    }
  }, [data.context, handleDashboardResult, router, searchParams]);
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
  const movedWorkTickets = useMemo(
    () => displayedWorkTickets.filter((ticket) => ticket.rollover?.direction === "OUT"),
    [displayedWorkTickets],
  );
  const activeDisplayedWorkTickets = useMemo(
    () => displayedWorkTickets.filter((ticket) => ticket.rollover?.direction !== "OUT"),
    [displayedWorkTickets],
  );
  const isCurrentCycle = data.week.periodKey === data.filters.currentPeriodKey;
  const filterFacets = useMemo(() => {
    const creators = new Map<string, number>();
    const result = { open: 0, feedback: 0, done: 0, unpaid: 0, paid: 0, none: 0 };
    activeDisplayedWorkTickets.forEach((ticket) => {
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
  }, [activeDisplayedWorkTickets]);
  const creatorFilterOptions = useMemo(() => [
    { label: `Tất cả người tạo (${activeDisplayedWorkTickets.length})`, value: "ALL" },
    ...Array.from(filterFacets.creators.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([creator, count]) => ({ label: `${creator} (${count})`, value: creator })),
  ], [activeDisplayedWorkTickets.length, filterFacets.creators]);
  const filteredWorkTickets = useMemo(() => {
    const query = filterQuery.trim().toLocaleLowerCase("vi");
    return activeDisplayedWorkTickets.filter((ticket) => {
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
  }, [activeDisplayedWorkTickets, filterCreator, filterPayment, filterQuery, filterWorkStatus]);
  const workspacePageCount = Math.max(1, Math.ceil(filteredWorkTickets.length / workspacePageSize));
  const safeWorkspacePage = Math.min(workspacePage, workspacePageCount);
  const workspacePageStart = (safeWorkspacePage - 1) * workspacePageSize;
  const pagedWorkTickets = filteredWorkTickets.slice(workspacePageStart, workspacePageStart + workspacePageSize);
  useEffect(() => {
    setWorkspacePage(1);
  }, [activeViewModeKey, filterCreator, filterPayment, filterQuery, filterWorkStatus, workspacePageSize]);
  const isTechnicalIssueFlowMode = activeViewMode?.key === "technical-issue-flow";
  const isMediaFlowMode = activeViewMode?.key === "media-production-flow";
  const technicalIssueBoardActions = useMemo(() => {
    const actionsByKey = new Map<string, OperationalBlueprintAction>();
    const defaultActions =
      operationalBlueprintTemplateByKey("service-operation")?.contract.actions ?? [];

    defaultActions.forEach((action) => actionsByKey.set(action.key, action));
    data.blueprints.forEach((blueprint) => {
      blueprint.operation?.actions?.forEach((action) => actionsByKey.set(action.key, action));
    });

    return Array.from(actionsByKey.values());
  }, [data.blueprints]);
  const canShowTechnicalIssueBoard =
    isTechnicalIssueFlowMode && Boolean(asyncTechnicalIssueBoard);
  const isTechnicalIssueBoardView =
    workTicketView === "TI_BOARD" && canShowTechnicalIssueBoard;
  const canShowMediaBoard = isMediaFlowMode && Boolean(asyncMediaBoard);
  const isMediaBoardView = workTicketView === "MEDIA_BOARD" && canShowMediaBoard;
  const isOperationalBoardView = isTechnicalIssueBoardView || isMediaBoardView;
  const technicalIssueBoardItems = useMemo(
    () => asyncTechnicalIssueBoard?.items ?? [],
    [asyncTechnicalIssueBoard?.items],
  );
  const technicalIssueBoardSummary = useMemo(
    () => technicalBoardSummary(technicalIssueBoardItems),
    [technicalIssueBoardItems],
  );
  const mediaBoardItems = useMemo(() => asyncMediaBoard?.items ?? [], [asyncMediaBoard?.items]);
  const unreadMentionBadgeCount = useMemo(() => {
    const items = isTechnicalIssueBoardView ? technicalIssueBoardItems : isMediaBoardView ? mediaBoardItems : [];
    return items.reduce((total, item) => total + item.unreadMentionCount, 0);
  }, [isMediaBoardView, isTechnicalIssueBoardView, mediaBoardItems, technicalIssueBoardItems]);
  const mediaBoardCommentSummary = useMemo(() => ({
    total: mediaBoardItems.length,
    commented: mediaBoardItems.filter((item) => item.commentCount > 0).length,
    mentionedMe: mediaBoardItems.filter((item) => item.mentionedMeCount > 0).length,
    unreadMentionedMe: mediaBoardItems.filter((item) => item.unreadMentionCount > 0).length,
  }), [mediaBoardItems]);
  const visibleMediaBoardItems = useMemo(() => {
    const filtered = technicalIssueCommentFilter === "COMMENTED"
      ? mediaBoardItems.filter((item) => item.commentCount > 0)
      : technicalIssueCommentFilter === "MENTIONED_ME"
        ? mediaBoardItems.filter((item) => item.mentionedMeCount > 0)
        : technicalIssueCommentFilter === "UNREAD_MENTION"
          ? mediaBoardItems.filter((item) => item.unreadMentionCount > 0)
          : mediaBoardItems;
    return [...filtered].sort((left, right) => Number(right.unreadMentionCount > 0) - Number(left.unreadMentionCount > 0));
  }, [mediaBoardItems, technicalIssueCommentFilter]);
  const visibleTechnicalIssueBoardSummary = useMemo(() => {
    const visibleItems =
      technicalIssuePriorityFilter === "ALL"
        ? technicalIssueBoardItems
        : technicalIssueBoardItems.filter(
          (item) => technicalIssuePriorityValue(item.priority) === technicalIssuePriorityFilter,
        );
    return technicalBoardSummary(
      technicalIssueCommentFilter === "COMMENTED"
        ? visibleItems.filter((item) => item.commentCount > 0)
        : technicalIssueCommentFilter === "MENTIONED_ME"
          ? visibleItems.filter((item) => item.mentionedMeCount > 0)
          : technicalIssueCommentFilter === "UNREAD_MENTION"
            ? visibleItems.filter((item) => item.unreadMentionCount > 0)
          : visibleItems,
    );
  }, [technicalIssueBoardItems, technicalIssueCommentFilter, technicalIssuePriorityFilter]);
  useEffect(() => {
    if (activeViewMode?.key !== "technical-issue-flow" && workTicketView === "TI_BOARD") {
      setWorkTicketView("LIST");
    }
    if (activeViewMode?.key !== "media-production-flow" && workTicketView === "MEDIA_BOARD") {
      setWorkTicketView("LIST");
    }
  }, [activeViewMode?.key, workTicketView]);
  const showPaymentColumn = activeDisplayedWorkTickets.some((ticket) => ticket.paymentSummary);
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
      progress.update({
        percent: 10,
        steps: [
          { id: "scan", label: "Quét Space tuần trước", status: "running" },
          { id: "move", label: "Chuyển item sang tuần hiện tại", status: "pending" },
        ],
      });

      const preview = await previewRolloverPreviousCycleItemsAction({
        taskId: data.cycle.id,
        context: data.context,
      });
      const previewTotal = preview.items.length;
      const previewMovable = preview.moved;
      const previewSteps: AppProgressStep[] = preview.items
        .slice(0, 40)
        .map((item, index) => {
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
            id: `preview:${item.targetType}:${item.targetId}:${index}`,
            label: `${target} - ${from} -> ${to}`,
            detail: item.reason === "READY_TO_MOVE"
              ? "Sẵn sàng chuyển"
              : item.reason
                ? `${item.status} (${item.reason})`
                : item.status,
            status,
          };
        });

      if (previewTotal > previewSteps.length) {
        previewSteps.push({
          id: "preview-more",
          label: `Còn ${previewTotal - previewSteps.length} item khác`,
          detail: "Danh sách đầy đủ sẽ hiển thị sau khi xử lý xong.",
          status: "pending",
        });
      }

      progress.update({
        message: `Tìm thấy ${previewTotal} item: ${previewMovable} có thể chuyển, ${preview.skipped} bỏ qua, ${preview.failed} lỗi rule. Đang chạy server action...`,
        percent: previewTotal ? 35 : 100,
        steps: [
          {
            id: "scan",
            label: "Quét Space tuần trước",
            status: "done",
            detail: `${previewTotal} item được đánh giá`,
          },
          {
            id: "move",
            label: "Chuyển item sang tuần hiện tại",
            status: previewTotal ? "running" : "skipped",
            detail: previewTotal ? `${previewMovable} item có thể chuyển` : "Không có item cần chuyển",
          },
          ...previewSteps,
        ],
      });

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
        percent: 100,
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
        <AsyncBusinessListDashboard
          endpoint={dashboardEndpoint}
          widgets={isPaymentCollectionFlow ? PAYMENT_DASHBOARD_WIDGETS : SPACE_DASHBOARD_WIDGETS}
          storageKey={`admin-dashboard:${data.context.toLowerCase()}-space:${activeCoreFlow?.key ?? activeViewMode?.key ?? "default"}`}
          customizationRequest={dashboardCustomizationRequest}
          showCustomizationTrigger={false}
          cashFlowPeriods={isPaymentCollectionFlow}
          onResult={handleDashboardResult}
        />
        <section className="min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
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
                          onChange={(event) => changeActiveViewMode(event.target.value)}
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
                    <SpaceSharingEditor
                      taskId={data.cycle.id}
                      context={data.context}
                      activeCoreFlow={activeCoreFlow}
                      sharing={data.spaceSharing}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        disabled={isPending || !data.viewConfig.carryover.enabled}
                        onClick={() => setIsRolloverMenuOpen((open) => !open)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-violet-200 bg-white px-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-slate-400"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Xử lý tồn</span>
                        <ChevronRight className={cn("h-4 w-4 transition", isRolloverMenuOpen && "rotate-90")} />
                      </button>
                      {isRolloverMenuOpen ? (
                        <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
                          <button
                            type="button"
                            disabled={!isCurrentCycle}
                            onClick={() => {
                              setIsRolloverMenuOpen(false);
                              void rolloverPreviousCycle();
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium text-slate-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-white"
                            title={isCurrentCycle ? undefined : "Chỉ nhận item tồn ở tuần hiện tại"}
                          >
                            <RotateCcw className="h-4 w-4 text-violet-600" />
                            <span>{actionLabel(data.viewConfig.carryover.actionLabel)}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsRolloverMenuOpen(false);
                              setIsMovedItemsOpen(true);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <List className="h-4 w-4 text-slate-500" />
                            <span>Xem item đã chuyển ({movedWorkTickets.length})</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                    {isTechnicalIssueFlowMode ? (
                      <button
                        type="button"
                        onClick={() => setIsTechnicalIntakeOpen(true)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Tiếp nhận kỹ thuật</span>
                      </button>
                    ) : null}
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
                    placeholder="Workspace"
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
                frameless
                filterBadgeCount={unreadMentionBadgeCount}
                weekValue={data.week.periodKey}
                weekOptions={data.filters.weekOptions}
                dateValue={data.filters.selectedDate}
                searchValue={filterQuery}
                searchPlaceholder="Tìm Workspace, phụ trách, hoạt động..."
                onSearchChange={setFilterQuery}
                activeView={isTechnicalIssueBoardView ? "TI_BOARD" : isMediaBoardView ? "MEDIA_BOARD" : "LIST"}
                onViewChange={(value) => setWorkTicketView(value === "TI_BOARD" ? "TI_BOARD" : value === "MEDIA_BOARD" ? "MEDIA_BOARD" : "LIST")}
                viewOptions={[
                  ...(isMediaFlowMode
                    ? [{ value: "MEDIA_BOARD", label: "Board Media", icon: <Grid2X2 className="h-4 w-4" />, disabled: !canShowMediaBoard }]
                    : [{ value: "TI_BOARD", label: "Board TI", icon: <Grid2X2 className="h-4 w-4" />, disabled: !canShowTechnicalIssueBoard }]),
                  { value: "LIST", label: "List", icon: <List className="h-4 w-4" /> },
                ]}
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
                      { label: `Tất cả công việc (${activeDisplayedWorkTickets.length})`, value: "ALL" },
                      { label: `Đang mở (${filterFacets.open})`, value: "OPEN" },
                      { label: `Cần phản hồi (${filterFacets.feedback})`, value: "FEEDBACK" },
                      { label: `Đã hoàn tất (${filterFacets.done})`, value: "DONE" },
                    ],
                    onChange: setFilterWorkStatus,
                  },
                  ...(isTechnicalIssueBoardView ? [{
                    key: "ti-priority",
                    label: "Độ ưu tiên",
                    value: technicalIssuePriorityFilter,
                    options: [
                      { label: `Tất cả ưu tiên (${technicalIssueBoardSummary.total})`, value: "ALL" },
                      { label: `Gấp (${technicalIssueBoardSummary.urgent})`, value: "URGENT" },
                      { label: `Không ưu tiên (${technicalIssueBoardSummary.total - technicalIssueBoardSummary.urgent})`, value: "NORMAL" },
                    ],
                    onChange: (value: string) => setTechnicalIssuePriorityFilter(value as TechnicalIssuePriorityFilter),
                  }, {
                    key: "ti-comment",
                    label: "Trao đổi",
                    value: technicalIssueCommentFilter,
                    options: [
                      { label: `Tất cả TI (${technicalIssueBoardSummary.total})`, value: "ALL" },
                      { label: `Có comment (${technicalIssueBoardSummary.commented})`, value: "COMMENTED" },
                      { label: `Nhắc đến tôi (${technicalIssueBoardSummary.mentionedMe})`, value: "MENTIONED_ME" },
                      { label: `Chưa đọc (${technicalIssueBoardSummary.unreadMentionedMe})`, value: "UNREAD_MENTION" },
                    ],
                    onChange: (value: string) => setTechnicalIssueCommentFilter(value as TechnicalIssueCommentFilter),
                  }] : isMediaBoardView ? [{
                    key: "media-comment",
                    label: "Trao đổi",
                    value: technicalIssueCommentFilter,
                    options: [
                      { label: `Tất cả Watch (${mediaBoardCommentSummary.total})`, value: "ALL" },
                      { label: `Có comment (${mediaBoardCommentSummary.commented})`, value: "COMMENTED" },
                      { label: `Nhắc đến tôi (${mediaBoardCommentSummary.mentionedMe})`, value: "MENTIONED_ME" },
                      { label: `Chưa đọc (${mediaBoardCommentSummary.unreadMentionedMe})`, value: "UNREAD_MENTION" },
                    ],
                    onChange: (value: string) => setTechnicalIssueCommentFilter(value as TechnicalIssueCommentFilter),
                  }] : []),
                  ...(showPaymentColumn && !isOperationalBoardView ? [{
                    key: "payment",
                    label: "Thanh toán",
                    value: filterPayment,
                    options: [
                      { label: `Tất cả thanh toán (${activeDisplayedWorkTickets.length})`, value: "ALL" },
                      { label: `Chưa thanh toán (${filterFacets.unpaid})`, value: "UNPAID" },
                      { label: `Đã thanh toán (${filterFacets.paid})`, value: "PAID" },
                      { label: `Chưa phát sinh (${filterFacets.none})`, value: "NONE" },
                    ],
                    onChange: setFilterPayment,
                  }] : []),
                  ...(!isOperationalBoardView ? [{
                    key: "page-size",
                    label: "Số dòng hiển thị",
                    value: String(workspacePageSize),
                    options: [10, 20, 50].map((size) => ({ label: `${size} dòng`, value: String(size) })),
                    onChange: (value: string) => setWorkspacePageSize(Number(value)),
                  }] : []),
                ]}
                onWeekChange={(value) => {
                  const option = data.filters.weekOptions.find((item) => item.value === value);
                  if (option) updateDate(option.date);
                }}
                onDateChange={updateDate}
              >
                {isTechnicalIssueBoardView ? (
                  <TechnicalIssueBoardControlStrip
                    summary={technicalIssueBoardSummary}
                    visibleSummary={visibleTechnicalIssueBoardSummary}
                  />
                ) : isMediaBoardView ? (
                  <span className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-xl bg-slate-50 px-3 text-xs font-semibold text-slate-600">
                    {asyncMediaBoard?.items.length ?? 0} Watch
                  </span>
                ) : (
                  <span className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-xl bg-slate-50 px-3 text-xs font-semibold text-slate-500">
                    {isViewPending
                      ? "Đang tải..."
                      : filteredWorkTickets.length
                      ? `${workspacePageStart + 1}-${Math.min(workspacePageStart + workspacePageSize, filteredWorkTickets.length)} / ${filteredWorkTickets.length}`
                      : "0 / 0"}
                  </span>
                )}
                {filterQuery || filterCreator !== "ALL" || filterWorkStatus !== "ALL" || filterPayment !== "ALL" || technicalIssuePriorityFilter !== "ALL" || technicalIssueCommentFilter !== "ALL" ? <button type="button" onClick={() => { setFilterQuery(""); setFilterCreator("ALL"); setFilterWorkStatus("ALL"); setFilterPayment("ALL"); setTechnicalIssuePriorityFilter("ALL"); setTechnicalIssueCommentFilter("ALL"); }} className="inline-flex h-11 shrink-0 items-center rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">Xóa lọc</button> : null}
                {isOperationalBoardView ? (
                  <button
                    type="button"
                    onClick={() => void refreshTechnicalIssueBoard()}
                    disabled={isBoardRefreshing}
                    title={boardRefreshedAt
                      ? `Tải lại board · Cập nhật lúc ${boardRefreshedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                      : "Tải lại board"}
                    aria-label="Tải lại board"
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-wait disabled:text-slate-400"
                  >
                    <RotateCcw className={`h-4 w-4 ${isBoardRefreshing ? "animate-spin" : ""}`} />
                    <span className="hidden 2xl:inline">
                      {isBoardRefreshing
                        ? "Đang tải..."
                        : boardRefreshedAt
                          ? boardRefreshedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                          : "Tải lại"}
                    </span>
                  </button>
                ) : null}
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
                  <div className="font-medium text-slate-500">Đang bật</div>
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
              items={asyncTechnicalIssueBoard?.items ?? []}
              actions={technicalIssueBoardActions}
              vendorOptions={asyncTechnicalIssueBoard?.vendorOptions ?? []}
              technicalDetailCatalogOptions={asyncTechnicalIssueBoard?.technicalDetailCatalogOptions ?? []}
              priorityFilter={technicalIssuePriorityFilter}
              commentFilter={technicalIssueCommentFilter}
              focusedIssueId={focusedTechnicalIssueId}
            />
          ) : isMediaBoardView ? (
            <MediaProductionBoardView
              items={visibleMediaBoardItems}
              onChanged={(items) => setAsyncMediaBoard((current) => current ? {
                ...current,
                items: current.items.map((item) => items.find((updated) => updated.id === item.id) ?? item),
              } : current)}
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
            {!isViewPending ? pagedWorkTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/task-items/${ticket.id}`}
                className={cn(
                  "grid gap-4 px-5 py-4 transition hover:bg-slate-50 lg:items-center",
                  workTicketGridClass,
                )}
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
            )) : null}

            {isViewPending ? (
              <div className="flex items-center gap-3 px-4 py-10 text-sm font-medium text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin text-violet-500" />
                Đang tải dữ liệu Workspace...
              </div>
            ) : !filteredWorkTickets.length ? (
              <div className="flex items-center gap-3 px-4 py-10 text-sm text-slate-500">
                <Inbox className="h-5 w-5" />
                {activeEmptyState}
              </div>
            ) : null}
          </div>
          {!isOperationalBoardView && filteredWorkTickets.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4">
              <div className="text-xs font-medium text-slate-500">
                Hiển thị {workspacePageStart + 1}-{Math.min(workspacePageStart + workspacePageSize, filteredWorkTickets.length)} trong {filteredWorkTickets.length} Workspace
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setWorkspacePage((page) => Math.max(1, page - 1))} disabled={safeWorkspacePage <= 1} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Trước</button>
                {Array.from({ length: workspacePageCount }, (_, index) => index + 1)
                  .filter((page) => page === 1 || page === workspacePageCount || Math.abs(page - safeWorkspacePage) <= 1)
                  .map((page, index, pages) => (
                    <span key={page} className="contents">
                      {index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-xs text-slate-400">...</span> : null}
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
        {isMovedItemsOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6">
            <div className="max-h-[82vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div>
                  <h3 className="text-base font-bold text-slate-950">Item đã chuyển</h3>
                  <p className="mt-1 text-sm text-slate-500">{movedWorkTickets.length} workspace đã được chuyển khỏi tuần này.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMovedItemsOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Đóng danh sách item đã chuyển"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[62vh] overflow-auto p-4">
                {movedWorkTickets.length ? (
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {movedWorkTickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        href={`/admin/task-items/${ticket.id}`}
                        onClick={() => setIsMovedItemsOpen(false)}
                        className="grid gap-3 px-4 py-3 transition hover:bg-slate-50 md:grid-cols-[1.4fr_1fr_0.8fr] md:items-center"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-950">{prefixedLabel("Workspace", ticket.title)}</div>
                          <div className="mt-1 truncate text-xs text-slate-500">{ticket.identityPreview?.ref ?? ticket.identityPreview?.title ?? "-"}</div>
                        </div>
                        <div className="min-w-0 text-sm text-slate-600">
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Chuyển sang</div>
                          <div className="mt-1 truncate font-medium text-slate-800">{ticket.rollover?.toTaskItemTitle ?? "Tuần sau"}</div>
                        </div>
                        <div className="text-sm text-slate-600 md:text-right">
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Thời điểm</div>
                          <div className="mt-1 font-medium text-slate-800">{formatDateTime(ticket.rollover?.movedAt)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 px-4 py-10 text-sm text-slate-500">
                    <Inbox className="h-5 w-5" />
                    Chưa có item nào đã chuyển khỏi tuần này.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        {isTechnicalIntakeOpen ? (
          <TechnicalIntakeModal
            onClose={() => setIsTechnicalIntakeOpen(false)}
            onCompleted={handleTechnicalIntakeCompleted}
          />
        ) : null}
    </SpaceViewPage>
  );
}

function TechnicalIntakeModal({
  onClose,
  onCompleted,
}: {
  onClose: () => void;
  onCompleted: (technicalIssueId: string | null) => void | Promise<void>;
}) {
  const [step, setStep] = useState(1);
  const [selectedWatch, setSelectedWatch] = useState<WatchSearchResult | null>(null);
  const [activeServiceRequest, setActiveServiceRequest] = useState<{ id: string; refNo?: string | null; status?: string | null } | null>(null);
  const [summary, setSummary] = useState("");
  const [note, setNote] = useState("");
  const [area, setArea] = useState("GENERAL");
  const [priority, setPriority] = useState("NORMAL");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{ serviceRequestRef?: string | null; technicalIssueId?: string | null } | null>(null);

  const steps = ["Tìm Watch", "Xác nhận", "Thông tin SR + TI", "Hoàn tất"];

  async function selectWatch(item: WatchSearchResult) {
    setSelectedWatch(item);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/service-requests/watch-active?productId=${encodeURIComponent(item.productId)}`, { cache: "no-store" });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) throw new Error(json?.error || "Không thể kiểm tra SR đang mở.");
      setActiveServiceRequest(json.data?.serviceRequest ?? null);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : "Không thể kiểm tra SR đang mở.");
    } finally {
      setLoading(false);
    }
  }

  async function submitIntake() {
    if (!selectedWatch || !summary.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = activeServiceRequest
        ? await fetch("/api/admin/service-requests/watch-active", {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ productId: selectedWatch.productId, serviceRequestId: activeServiceRequest.id, area, summary, note, issueType: "CHECK", priority }),
          })
        : await fetch("/api/admin/service-operation", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ action: "watch_intake_with_suspicion", productId: selectedWatch.productId, suspicion: summary, area, note, priority, createIssueIfExisting: true }),
          });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) throw new Error(json?.error || "Không thể tạo phiếu kỹ thuật.");
      const data = json.data ?? {};
      setCreatedResult({
        serviceRequestRef: data.refNo ?? data.serviceRequest?.refNo ?? activeServiceRequest?.refNo ?? null,
        technicalIssueId: data.technicalIssueId ?? data.createdTechnicalIssueId ?? null,
      });
      setStep(4);
      await onCompleted(data.technicalIssueId ?? data.createdTechnicalIssueId ?? null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể tạo phiếu kỹ thuật.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[1px]">
      <div role="dialog" aria-modal="true" aria-label="Tiếp nhận kỹ thuật" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-950">Tiếp nhận kỹ thuật</h3>
                <p className="text-sm text-slate-500">Tạo nhanh Service Request và Technical Issue cho Watch.</p>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Đóng">
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((label, index) => {
              const number = index + 1;
              const active = number === step;
              const done = number < step;
              return (
                <div key={label} className="min-w-0">
                  <div className={cn("mb-2 h-1 rounded-full", done || active ? "bg-violet-500" : "bg-slate-200")} />
                  <div className={cn("truncate text-xs font-semibold", active ? "text-violet-700" : done ? "text-slate-700" : "text-slate-400")}>
                    {number}. {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <div>
              <h4 className="text-base font-bold text-slate-950">Tìm đồng hồ cần tiếp nhận</h4>
              <p className="mt-1 text-sm text-slate-500">Tìm theo mã Watch, serial, tên sản phẩm, khách hàng hoặc số điện thoại.</p>
              <div className="mt-4"><WatchSearchPicker selectedProductId={selectedWatch?.productId} onSelect={selectWatch} placeholder="Ví dụ: W-10241, Rolex Datejust, Raymond..." /></div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
              <div>
                <h4 className="text-base font-bold text-slate-950">Xác nhận Watch và khách hàng</h4>
                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <div className="text-sm font-bold text-slate-950">{selectedWatch?.title}</div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-xs text-slate-400">Mã Watch</dt><dd className="mt-1 font-semibold text-slate-700">{selectedWatch?.sku || selectedWatch?.productId}</dd></div>
                    <div><dt className="text-xs text-slate-400">Thương hiệu</dt><dd className="mt-1 font-semibold text-slate-700">{selectedWatch?.brandName || "-"}</dd></div>
                    <div className="col-span-2"><dt className="text-xs text-slate-400">Trạng thái service</dt><dd className="mt-1 font-semibold text-slate-700">{selectedWatch?.serviceState || "Chưa tiếp nhận"}</dd></div>
                  </dl>
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 font-bold text-amber-900"><Info className="h-4 w-4" /> Kiểm tra phiếu hiện tại</div>
                {activeServiceRequest ? <><p className="mt-2 text-sm leading-6 text-amber-800">Watch đang có SR <strong>{activeServiceRequest.refNo || activeServiceRequest.id}</strong>. TI mới sẽ được thêm vào phiếu này để tránh tạo SR trùng.</p><div className="mt-4 rounded-lg bg-white/70 p-3 text-xs text-amber-800">Trạng thái hiện tại: {activeServiceRequest.status || "Đang xử lý"}</div></> : <p className="mt-2 text-sm leading-6 text-amber-800">Watch chưa có Service Request đang mở. Hệ thống sẽ tạo SR mới cùng TI đầu tiên.</p>}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h4 className="text-base font-bold text-slate-950">Thông tin tiếp nhận</h4>
              <p className="mt-1 text-sm text-slate-500">Một lần xác nhận sẽ tạo đồng thời SR và TI ở cột Kiểm tra.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600 md:col-span-2">Yêu cầu của khách hàng<textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Mô tả lỗi hoặc yêu cầu cần kiểm tra..." rows={3} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-violet-300" /></label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">Nhóm lỗi<select value={area} onChange={(event) => setArea(event.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-300"><option value="GENERAL">Tổng quát</option><option value="MOVEMENT">Máy</option><option value="CASE">Vỏ</option><option value="CRYSTAL">Kính</option><option value="BRACELET">Dây</option></select></label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">Mức ưu tiên<select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-300"><option value="NORMAL">Bình thường</option><option value="URGENT">Gấp</option></select></label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600 md:col-span-2">Ghi chú kỹ thuật<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tình trạng khi nhận, phụ kiện đi kèm..." rows={2} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-violet-300" /></label>
                <div className="flex h-20 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-400 md:col-span-2"><Camera className="h-5 w-5" /> Ảnh tiếp nhận sẽ bổ sung ở phiên bản tiếp theo</div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></span>
              <h4 className="mt-4 text-xl font-bold text-slate-950">Đã tiếp nhận kỹ thuật</h4>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Technical Issue đã được tạo và đang được đồng bộ vào cột Kiểm tra trên board.</p>
              <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3 text-left text-sm">
                <div className="rounded-xl border border-slate-200 p-3"><div className="text-xs text-slate-400">Service Request</div><div className="mt-1 truncate font-bold text-slate-800">{createdResult?.serviceRequestRef || "Đã tạo"}</div></div>
                <div className="rounded-xl border border-slate-200 p-3"><div className="text-xs text-slate-400">Technical Issue</div><div className="mt-1 truncate font-bold text-slate-800">{createdResult?.technicalIssueId || "Đã tạo"}</div></div>
              </div>
            </div>
          ) : null}
        </div>

        {error ? <div className="border-t border-rose-100 bg-rose-50 px-6 py-2.5 text-sm font-medium text-rose-700">{error}</div> : null}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button type="button" onClick={() => step === 1 ? onClose() : setStep((current) => current - 1)} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            {step === 1 ? "Hủy" : "Quay lại"}
          </button>
          {step < 4 ? (
            <button type="button" disabled={loading || submitting || (step === 1 && !selectedWatch) || (step === 3 && !summary.trim())} onClick={() => step === 3 ? void submitIntake() : setStep((current) => current + 1)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">
              {submitting ? "Đang tạo..." : step === 3 ? activeServiceRequest ? "Thêm TI vào SR" : "Tạo SR + TI" : "Tiếp tục"}<ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={onClose} className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">Đóng</button>
          )}
        </div>
      </div>
    </div>
  );
}

type PaymentBoardItem = {
  id: string; refNo: string | null; status: string; stage: "INBOX" | "REVIEW" | "SETTLED";
  amount: number; currency: string; method: string | null; workspaceTaskItemId: string;
  owner: { label: string; sublabel: string | null; imageUrl: string | null };
};

export function PaymentCollectionBoard({ items }: { items: PaymentBoardItem[] }) {
  const router = useRouter();
  const progress = useAppProgress();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [boardItems, setBoardItems] = useState(items);
  useEffect(() => setBoardItems(items), [items]);
  const columns = [
    { key: "INBOX", label: "Chờ thu", hint: "Payment mới, cần kiểm tra thông tin." },
    { key: "REVIEW", label: "Đang đối soát", hint: "Đã kiểm tra, chờ xác nhận tiền về." },
    { key: "SETTLED", label: "Hoàn tất / Ngoại lệ", hint: "Đã thu, đã ghi nhận hoặc đã hủy." },
  ] as const;

  async function runAction(item: PaymentBoardItem) {
    const reviewing = item.stage === "INBOX";
    const nextStage = reviewing ? "REVIEW" : "SETTLED";
    setPendingId(item.id);
    progress.show({
      title: reviewing ? "Đang đưa Payment sang đối soát" : "Đang xác nhận đã thu tiền",
      message: `${item.owner.label} · ${new Intl.NumberFormat("vi-VN").format(item.amount)} ${item.currency}`,
      percent: 25,
    });
    try {
      await submitOperationalBlueprintActionAction({
        taskItemId: item.workspaceTaskItemId,
        actionKey: reviewing ? "review_payment" : "mark_payment_paid",
        targetType: "PAYMENT",
        targetId: item.id,
        fields: reviewing ? {} : { paidAt: new Date().toISOString(), method: item.method ?? "BANK_TRANSFER" },
      });
      setBoardItems((current) => current.map((candidate) => candidate.id === item.id
        ? { ...candidate, stage: nextStage, status: reviewing ? candidate.status : "PAID" }
        : candidate));
      progress.update({ percent: 90, message: "Đã cập nhật Payment, đang đồng bộ dashboard." });
      window.setTimeout(() => router.refresh(), 100);
      window.setTimeout(() => progress.hide(), 900);
    } catch (error) {
      progress.update({ message: error instanceof Error ? error.message : "Không thể cập nhật Payment." });
      window.setTimeout(() => progress.hide(), 1500);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="font-bold text-slate-900">Payment Collection</h3><p className="text-xs text-slate-500">{boardItems.length} payment trong flow</p></div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
          Chưa thu: {new Intl.NumberFormat("vi-VN").format(boardItems.filter((item) => item.stage !== "SETTLED").reduce((sum, item) => sum + item.amount, 0))}đ
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const columnItems = boardItems.filter((item) => item.stage === column.key);
          return <section key={column.key} className="min-h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 px-4 py-3"><div className="flex items-center justify-between"><h4 className="font-bold text-slate-900">{column.label}</h4><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{columnItems.length}</span></div><p className="mt-1 text-xs text-slate-500">{column.hint}</p></header>
            <div className="space-y-3 p-3">
              {columnItems.slice(0, 30).map((item) => <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.owner.imageUrl ? <Image src={resolveMediaPreviewSrc(item.owner.imageUrl) ?? item.owner.imageUrl} alt="" fill sizes="48px" unoptimized className="object-cover" /> : <CreditCard className="m-3 h-6 w-6 text-slate-400" />}</div>
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold text-slate-900">{item.owner.label}</div><div className="truncate text-xs text-slate-500">{item.owner.sublabel ?? item.refNo ?? item.id}</div></div>
                </div>
                <div className="mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-3"><div><div className="text-base font-black text-slate-950">{new Intl.NumberFormat("vi-VN").format(item.amount)} {item.currency === "VND" ? "đ" : item.currency}</div><div className="mt-0.5 text-[11px] text-slate-500">{item.method ?? "Chưa có phương thức"}</div></div>{item.stage !== "SETTLED" ? <button type="button" disabled={pendingId === item.id} onClick={() => void runAction(item)} className="h-9 rounded-lg bg-slate-950 px-3 text-xs font-bold text-white hover:bg-slate-800 disabled:bg-slate-300">{pendingId === item.id ? "Đang xử lý" : item.stage === "INBOX" ? "Đối soát" : "Xác nhận đã thu"}</button> : <span className={cn("rounded-full px-2 py-1 text-[11px] font-bold", item.status === "PAID" || item.status === "COLLECTED" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{item.status}</span>}</div>
              </article>)}
              {!columnItems.length ? <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">Chưa có payment</div> : null}
              {columnItems.length > 30 ? <div className="text-center text-xs font-medium text-slate-500">Đang hiển thị 30/{columnItems.length} payment</div> : null}
            </div>
          </section>;
        })}
      </div>
    </div>
  );
}

type MediaBoardItem = NonNullable<CoordinationDashboardDTO["mediaBoard"]>["items"][number];
type MediaBoardStage = MediaBoardItem["stage"];

function MediaProductionBoardView({
  items,
  onChanged,
}: {
  items: MediaBoardItem[];
  onChanged: (items: MediaBoardItem[]) => void;
}) {
  const router = useRouter();
  const previewState = useBusinessEntityPreview();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const columns: Array<{ key: MediaBoardStage; label: string; hint: string }> = [
    { key: "PHOTOGRAPHY", label: "Chụp ảnh", hint: "Watch đang chờ hoặc thực hiện chụp ảnh." },
    { key: "MEDIA_PROCESSING", label: "Xử lý media", hint: "Gắn media, kiểm tra và duyệt nội dung/hình ảnh." },
    { key: "PUBLISH", label: "Đăng bài", hint: "Media đã duyệt, chờ đăng lên các kênh." },
    { key: "DONE", label: "Done", hint: "Watch đã hoàn tất đăng bài." },
  ];
  const stageOrder: MediaBoardStage[] = ["PHOTOGRAPHY", "MEDIA_PROCESSING", "PUBLISH", "DONE"];

  async function moveItem(item: MediaBoardItem, targetStage: MediaBoardStage) {
    const currentIndex = stageOrder.indexOf(item.stage);
    const targetIndex = stageOrder.indexOf(targetStage);
    if (targetIndex !== currentIndex + 1) {
      setError("Media chỉ được chuyển lần lượt: Chụp ảnh → Xử lý media → Đăng bài → Done.");
      return;
    }
    const actionKey = item.stage === "PHOTOGRAPHY"
      ? "start-work"
      : item.stage === "MEDIA_PROCESSING"
        ? "approve-media"
        : item.stage === "PUBLISH"
          ? "mark-posted"
          : null;
    if (!actionKey) return;
    setError(null);
    setPendingId(item.id);
    try {
      await applyQueueItemManualTransitionAction({ bindingId: item.bindingId, actionKey });
      onChanged(items.map((candidate) => candidate.id === item.id
        ? { ...candidate, stage: targetStage }
        : candidate));
      window.setTimeout(() => router.refresh(), 100);
    } catch (moveError) {
      setError(moveError instanceof Error ? moveError.message : "Không thể chuyển Media sang stage tiếp theo.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="min-w-0 max-w-full border-t border-slate-100 bg-slate-50/70 px-3 py-4 sm:px-4">
      {error ? <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div> : null}
      <div className="max-w-full overflow-x-auto overscroll-x-contain pb-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(event) => setActiveId(String(event.active.id))}
          onDragEnd={(event) => {
            const item = items.find((candidate) => candidate.id === String(event.active.id));
            const targetStage = String(event.over?.id ?? "") as MediaBoardStage;
            setActiveId(null);
            if (item && stageOrder.includes(targetStage) && item.stage !== targetStage) void moveItem(item, targetStage);
          }}
        >
          <div className="grid w-full min-w-[960px] grid-cols-4 gap-3">
            {columns.map((column) => (
              <MediaBoardColumn
                key={column.key}
                column={column}
                items={items.filter((item) => item.stage === column.key)}
                pendingId={pendingId}
                onPreview={(item) => previewState.openPreview({
                  type: "WATCH",
                  id: item.id,
                  title: item.title,
                  subtitle: item.sku ? `SKU: ${item.sku}` : null,
                  imageUrl: item.imageUrl,
                })}
              />
            ))}
          </div>
          <DragOverlay>{activeId && items.find((item) => item.id === activeId) ? (
            <div className="w-72 opacity-90">
              <MediaBoardCard item={items.find((item) => item.id === activeId)!} />
            </div>
          ) : null}</DragOverlay>
        </DndContext>
      </div>
      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
        onActivityChanged={previewState.refreshPreview}
      />
    </div>
  );
}

function MediaBoardColumn({
  column,
  items,
  pendingId,
  onPreview,
}: {
  column: { key: MediaBoardStage; label: string; hint: string };
  items: MediaBoardItem[];
  pendingId: string | null;
  onPreview: (item: MediaBoardItem) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });
  const appearance = mediaStageAppearance(column.key);
  const StageIcon = appearance.icon;
  return (
    <section ref={setNodeRef} className={cn("min-h-[480px] overflow-hidden rounded-2xl border bg-white/90 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.45)] transition", appearance.columnBorder, isOver && "scale-[1.005] ring-2 ring-violet-200")}>
      <header className={cn("border-b px-4 py-3.5", appearance.header)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-2.5">
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm", appearance.iconColor)}><StageIcon className="h-4.5 w-4.5" /></span>
            <div><div className="text-sm font-bold text-slate-950">{column.label}</div><div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-500">{column.hint}</div></div>
          </div>
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white px-2 text-xs font-bold text-slate-700 shadow-sm">{items.length}</span>
        </div>
      </header>
      <div className="grid content-start gap-4 p-3.5">
        {items.map((item) => <DraggableMediaBoardCard key={item.id} item={item} pending={pendingId === item.id} onPreview={() => onPreview(item)} />)}
        {!items.length ? <div className={cn("grid min-h-32 place-items-center rounded-2xl border border-dashed text-xs", appearance.empty)}><div className="text-center"><StageIcon className="mx-auto mb-2 h-5 w-5 opacity-50" />Kéo Watch vào đây</div></div> : null}
      </div>
    </section>
  );
}

function mediaStageAppearance(stage: MediaBoardStage) {
  if (stage === "PHOTOGRAPHY") return { icon: Camera, header: "border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/60", columnBorder: "border-amber-100", iconColor: "text-amber-600", accent: "bg-amber-400", badge: "bg-amber-50 text-amber-700 ring-amber-200", empty: "border-amber-200 bg-amber-50/30 text-amber-500" };
  if (stage === "MEDIA_PROCESSING") return { icon: Monitor, header: "border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50/50", columnBorder: "border-violet-100", iconColor: "text-violet-600", accent: "bg-violet-500", badge: "bg-violet-50 text-violet-700 ring-violet-200", empty: "border-violet-200 bg-violet-50/30 text-violet-500" };
  if (stage === "PUBLISH") return { icon: Send, header: "border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50/50", columnBorder: "border-sky-100", iconColor: "text-sky-600", accent: "bg-sky-500", badge: "bg-sky-50 text-sky-700 ring-sky-200", empty: "border-sky-200 bg-sky-50/30 text-sky-500" };
  return { icon: CheckCircle2, header: "border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/50", columnBorder: "border-emerald-100", iconColor: "text-emerald-600", accent: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", empty: "border-emerald-200 bg-emerald-50/30 text-emerald-500" };
}

function DraggableMediaBoardCard({ item, pending, onPreview }: { item: MediaBoardItem; pending: boolean; onPreview: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id, disabled: pending });
  return <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }} {...listeners} {...attributes} className={cn(isDragging && "opacity-30")}><MediaBoardCard item={item} pending={pending} onPreview={onPreview} /></div>;
}

function MediaBoardCard({ item, pending = false, onPreview }: { item: MediaBoardItem; pending?: boolean; onPreview?: () => void }) {
  const appearance = mediaStageAppearance(item.stage);
  const StageIcon = appearance.icon;
  return (
    <article onDoubleClick={onPreview} className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_7px_18px_-14px_rgba(15,23,42,0.7)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]">
      <span className={cn("absolute inset-x-0 top-0 z-10 h-1", appearance.accent)} />
      <div className="flex gap-3 p-3 pt-4">
        <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
          {item.imageUrl ? <Image src={resolveMediaPreviewSrc(item.imageUrl) ?? item.imageUrl} alt={item.title} fill sizes="68px" unoptimized className="object-cover transition duration-300 group-hover:scale-105" /> : <Camera className="m-[22px] h-6 w-6 text-slate-400" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <div className="line-clamp-2 text-sm font-bold leading-5 text-slate-950">{item.title}</div>
            {pending ? <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-violet-500" /> : <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />}
          </div>
          <div className="mt-1 truncate text-[11px] font-medium text-slate-500">{item.sku ?? "Chưa có SKU"}</div>
          <span className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ring-1 ring-inset", appearance.badge)}><StageIcon className="h-3 w-3" />{item.workflowState ?? "Sẵn sàng"}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/55 px-3 py-2.5 text-[11px] text-slate-500">
        <div className="flex min-w-0 items-center gap-2">
          {item.lastUpdatedBy.avatarUrl ? <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-white"><Image src={resolveMediaPreviewSrc(item.lastUpdatedBy.avatarUrl) ?? item.lastUpdatedBy.avatarUrl} alt="" fill sizes="20px" unoptimized className="object-cover" /></span> : <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-[8px] font-bold text-slate-600">{item.lastUpdatedBy.label.slice(0, 1)}</span>}
          <span className="truncate">{item.lastUpdatedBy.label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {item.unreadMentionCount ? <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-100 px-1.5 py-1 font-bold text-violet-700 ring-1 ring-violet-200"><AtSign className="h-3 w-3" />{item.unreadMentionCount}</span> : null}
          {item.commentCount ? <span className="inline-flex items-center gap-1 font-bold text-slate-600"><MessageCircle className="h-3.5 w-3.5 fill-slate-500 text-slate-500" />{item.commentCount}</span> : null}
          {onPreview ? <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onPreview} className="rounded-lg bg-white px-2 py-1 font-semibold text-violet-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-violet-50">Xem</button> : null}
        </div>
      </div>
    </article>
  );
}

function TechnicalIssueBoardView({
  items,
  actions,
  vendorOptions,
  technicalDetailCatalogOptions,
  priorityFilter,
  commentFilter,
  focusedIssueId,
}: {
  items: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["items"];
  actions: OperationalBlueprintAction[];
  vendorOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["vendorOptions"];
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"];
  priorityFilter: TechnicalIssuePriorityFilter;
  commentFilter: TechnicalIssueCommentFilter;
  focusedIssueId: string | null;
}) {
  const router = useRouter();
  const progress = useAppProgress();
  const previewState = useBusinessEntityPreview();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<TechnicalIssueBoardStage | null>(null);
  const [moveRequest, setMoveRequest] = useState<TechnicalIssueBoardMoveRequest | null>(null);
  const [moveValues, setMoveValues] = useState<Record<string, TechnicalBoardFieldValue>>({});
  const [additionalIssues, setAdditionalIssues] = useState<TechnicalBoardAdditionalIssue[]>([]);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [priorityIssueId, setPriorityIssueId] = useState<string | null>(null);
  const [boardItems, setBoardItems] = useState(items);
  const [isMovePending, startMoveTransition] = useTransition();
  const [isCostApprovalPending, startCostApprovalTransition] = useTransition();
  const [isPriorityPending, startPriorityTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );
  useEffect(() => {
    setBoardItems(items);
  }, [items]);
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
  const visibleItems = useMemo(() => {
    const filtered =
      priorityFilter === "ALL"
        ? boardItems
        : boardItems.filter((item) => technicalIssuePriorityValue(item.priority) === priorityFilter);
    return sortTechnicalBoardItems(
      commentFilter === "COMMENTED"
        ? filtered.filter((item) => item.commentCount > 0)
        : commentFilter === "MENTIONED_ME"
          ? filtered.filter((item) => item.mentionedMeCount > 0)
          : commentFilter === "UNREAD_MENTION"
            ? filtered.filter((item) => item.unreadMentionCount > 0)
          : filtered,
    );
  }, [boardItems, commentFilter, priorityFilter]);
  const activeItem = activeId ? visibleItems.find((item) => item.id === activeId) ?? null : null;
  useEffect(() => {
    if (!focusedIssueId || !visibleItems.some((item) => item.id === focusedIssueId)) return;

    const card = Array.from(document.querySelectorAll<HTMLElement>("[data-technical-issue-id]"))
      .find((element) => element.dataset.technicalIssueId === focusedIssueId);
    card?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [focusedIssueId, visibleItems]);

  function togglePriority(item: TechnicalIssueBoardItem) {
    const nextPriority = technicalIssuePriorityValue(item.priority) === "URGENT" ? "NORMAL" : "URGENT";
    setPriorityIssueId(item.id);
    startPriorityTransition(async () => {
      try {
        await updateTechnicalIssuePriorityAction({
          issueId: item.id,
          priority: nextPriority,
          context: "TECHNICAL",
        });
        router.refresh();
      } finally {
        setPriorityIssueId(null);
      }
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const issueId = String(event.active.id);
    const droppedStage = technicalBoardStageValue(event.over?.id);
    const item = visibleItems.find((candidate) => candidate.id === issueId) ?? null;
    setActiveId(null);
    setOverStage(null);

    if (!item || !droppedStage || item.stage === droppedStage) return;

    const requiresClassificationBeforeProcessing =
      item.stage === "INSPECT" && droppedStage === "PROCESSING";
    const targetStage = requiresClassificationBeforeProcessing ? "READY" : droppedStage;

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
      setAdditionalIssues([]);
      setMoveError(null);
      return;
    }

    setMoveRequest({
      item,
      targetStage,
      action,
      unavailableReason: requiresClassificationBeforeProcessing
        ? "TI cần được phân loại và nhập đủ thông tin trước. Sau khi xác nhận, TI sẽ được đưa vào Chờ xử lý."
        : null,
    });
    setMoveValues(defaultTechnicalBoardMoveValues(item, action));
    setAdditionalIssues([]);
    setMoveError(null);
  }

  function submitMove() {
    if (!moveRequest?.action) return;
    const { item, action, targetStage } = moveRequest;
    if (!item.workspaceTaskItemId) {
      setMoveError("TI này chưa có Workspace stage hiện tại nên không thể đóng bộ workflow.");
      return;
    }

    const visibleFields = action.fields.filter((field) =>
      shouldShowTechnicalBoardField(field, moveValues, technicalDetailCatalogOptions),
    );
    const missingField = visibleFields.find((field) => {
      if (!field.required) return false;
      const value = moveValues[field.key];
      if (Array.isArray(value)) return value.length === 0;
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
    const normalizedAdditionalIssues = additionalIssues.map((issue) => ({
      summary: issue.summary.trim(),
      note: issue.note.trim(),
    }));
    const incompleteAdditionalIssueIndex = normalizedAdditionalIssues.findIndex((issue) => !issue.summary);
    if (incompleteAdditionalIssueIndex >= 0) {
      setMoveError(`Vui lòng mô tả Technical Issue bổ sung số ${incompleteAdditionalIssueIndex + 1}.`);
      return;
    }
    if (normalizedAdditionalIssues.length > 0 && !item.srCaseTaskItemId) {
      setMoveError("Không tìm thấy SR Case Workspace để tạo thêm Technical Issue.");
      return;
    }

    const actionFields = { ...moveValues };

    let moveProgressSteps: AppProgressStep[] = [
      { id: "validate", label: "Kiểm tra thông tin xử lý", detail: `${item.summary} · ${technicalBoardStageLabel(moveRequest.targetStage)}`, status: "done" },
      { id: "move", label: "Cập nhật TI và Workspace", detail: "Đang ghi nhận action và chuyển stage.", status: "running" },
      { id: "additional", label: "Tạo Technical Issue bổ sung", detail: normalizedAdditionalIssues.length ? `${normalizedAdditionalIssues.length} TI mới` : "Không có TI bổ sung.", status: normalizedAdditionalIssues.length ? "pending" : "skipped" },
      { id: "sync", label: "Đồng bộ board và số liệu", detail: "Cập nhật projection, timeline và dashboard.", status: "pending" },
    ];
    progress.show({
      title: "Đang chuyển trạng thái TI",
      message: `${item.summary} · Sang ${technicalBoardStageLabel(moveRequest.targetStage)}`,
      percent: 20,
      steps: moveProgressSteps,
    });

    setMoveError(null);
    startMoveTransition(async () => {
      try {
        await submitOperationalBlueprintActionAction({
          taskItemId: item.workspaceTaskItemId as string,
          actionKey: action.key,
          targetType: "TECHNICAL_ISSUE",
          targetId: item.id,
          fields: actionFields,
        });
        moveProgressSteps = moveProgressSteps.map((step) => step.id === "move" ? { ...step, status: "done" } : step);
        moveProgressSteps = moveProgressSteps.map((step) => step.id === "additional" && normalizedAdditionalIssues.length ? { ...step, status: "running" } : step);
        progress.update({ message: "Đã chuyển stage, đang xử lý dữ liệu liên quan.", percent: normalizedAdditionalIssues.length ? 55 : 75, steps: moveProgressSteps });
        if (normalizedAdditionalIssues.length && item.srCaseTaskItemId) {
          for (const additionalIssue of normalizedAdditionalIssues) {
            await submitOperationalBlueprintActionAction({
              taskItemId: item.srCaseTaskItemId,
              actionKey: "create_technical_issue",
              fields: additionalIssue,
            });
          }
          moveProgressSteps = moveProgressSteps.map((step) => step.id === "additional" ? { ...step, status: "done" } : step);
        }
        setBoardItems((current) => current.map((candidate) =>
          candidate.id === item.id
            ? {
                ...candidate,
                stage: targetStage,
                estimatedCost: moveValues.estimatedCost === "" || moveValues.estimatedCost == null
                  ? candidate.estimatedCost
                  : Number(moveValues.estimatedCost),
                technicalDetailCatalogId: typeof moveValues.technicalDetailCatalogId === "string"
                  ? moveValues.technicalDetailCatalogId
                  : candidate.technicalDetailCatalogId,
                processingDetails: (() => {
                  const detail = technicalDetailCatalogOptions.find(
                    (option) => option.id === moveValues.technicalDetailCatalogId,
                  );
                  const partLabels: Record<string, string> = {
                    MOVEMENT_COMPLETE: "Thay nguyên máy",
                    MAINSPRING: "Thay cót",
                    GEAR: "Thay bánh răng",
                    BALANCE_WHEEL: "Thay vành tóc",
                    BALANCE_STAFF: "Thay trụ tóc",
                    HAIRSPRING: "Thay cả dây tóc",
                  };
                  const selectedParts = Array.isArray(moveValues.replacementPartCodes)
                    ? moveValues.replacementPartCodes.map((code) => partLabels[code]).filter(Boolean)
                    : [];
                  return [detail?.name, ...selectedParts].filter((value): value is string => Boolean(value));
                })(),
              }
            : candidate,
        ));
        setMoveRequest(null);
        setMoveValues({});
        setAdditionalIssues([]);
        moveProgressSteps = moveProgressSteps.map((step) => step.id === "sync" ? { ...step, status: "running" } : step);
        progress.update({ message: "Đã cập nhật card. Dashboard đang đồng bộ nền.", percent: 90, steps: moveProgressSteps });
        window.setTimeout(() => router.refresh(), 100);
        window.setTimeout(() => progress.hide(), 1000);
      } catch (error) {
        moveProgressSteps = moveProgressSteps.map((step) => step.status === "running" ? { ...step, status: "error" } : step);
        progress.update({ message: error instanceof Error ? error.message : "Không thể chuyển trạng thái TI.", steps: moveProgressSteps });
        window.setTimeout(() => progress.hide(), 1400);
        setMoveError(
          error instanceof Error ? error.message : "Không thể chuyển trạng thái TI.",
        );
      }
    });
  }

  function submitCostApproval() {
    if (!moveRequest?.action || moveRequest.action.command !== "service.completeTechnicalIssue") return;
    const actualCost = Number(moveValues.actualCost);
    if (!Number.isFinite(actualCost) || actualCost < 0) {
      setMoveError("Vui lòng nhập chi phí thực tế hợp lệ trước khi gửi duyệt.");
      return;
    }

    setMoveError(null);
    startCostApprovalTransition(async () => {
      try {
        const response = await fetch(`/api/admin/technical-issues/${encodeURIComponent(moveRequest.item.id)}/maintenance-log`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            eventType: "COST",
            totalCost: actualCost,
            notes: String(moveValues.resolutionNote ?? "").trim() || "Gửi duyệt chi phí hoàn tất xử lý.",
            needApproval: true,
          }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok) {
          throw new Error(result?.error || "Không thể gửi duyệt chi phí.");
        }
        setMoveRequest(null);
        setMoveValues({});
        setAdditionalIssues([]);
        router.refresh();
      } catch (error) {
        setMoveError(error instanceof Error ? error.message : "Không thể gửi duyệt chi phí.");
      }
    });
  }

  return (
    <div className="min-w-0 max-w-full border-t border-slate-100 bg-slate-50/70 px-3 py-4 sm:px-4">
      <div className="max-w-full overflow-x-auto overscroll-x-contain pb-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={(event) => setOverStage(technicalBoardStageValue(event.over?.id))}
          onDragEnd={handleDragEnd}
        >
          <div className="grid w-full min-w-[960px] grid-cols-4 gap-3">
            {columns.map((column) => {
              const columnItems = visibleItems.filter((item) => item.stage === column.key);
              return (
                <TechnicalIssueBoardColumn
                  key={column.key}
                  column={column}
                  items={columnItems}
                  isOver={overStage === column.key}
                  onTogglePriority={togglePriority}
                  priorityPendingIssueId={isPriorityPending ? priorityIssueId : null}
                  focusedIssueId={focusedIssueId}
                  onPreview={(item) => previewState.openPreview({
                    type: "TECHNICAL_ISSUE",
                    id: item.id,
                    refNo: item.serviceRequest.refNo,
                    title: item.summary,
                    subtitle: item.serviceRequest.refNo ? `SR: ${item.serviceRequest.refNo}` : null,
                    status: item.executionStatus,
                    imageUrl: item.serviceRequest.imageUrl,
                  })}
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
        additionalIssues={additionalIssues}
        error={moveError}
        pending={isMovePending || isCostApprovalPending}
        costApprovalPending={isCostApprovalPending}
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
        onAdditionalIssuesChange={setAdditionalIssues}
        onRequestCostApproval={submitCostApproval}
        onSubmit={submitMove}
        onClose={() => {
          if (isMovePending || isCostApprovalPending) return;
          setMoveRequest(null);
          setMoveValues({});
          setAdditionalIssues([]);
          setMoveError(null);
        }}
      />
      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
        onActivityChanged={() => {
          const issueId = previewState.preview?.type === "TECHNICAL_ISSUE"
            ? previewState.preview.id
            : null;
          if (issueId) {
            setBoardItems((current) => current.map((item) => item.id === issueId
              ? { ...item, commentCount: item.commentCount + 1 }
              : item));
          }
          previewState.refreshPreview();
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
        : input.from === "READY" && input.to === "DONE"
          ? "cancel_processing"
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
): Record<string, TechnicalBoardFieldValue> {
  if (action.command === "service.confirmTechnicalIssue") {
    return {
      summary: item.summary,
      note: item.note ?? "",
      technicalArea: item.area ?? "GENERAL",
      assigneeMode: item.actionMode && item.actionMode !== "NONE" ? item.actionMode : "INTERNAL",
      vendorId: item.vendorId ?? "",
      estimatedCost: item.estimatedCost == null ? "" : String(item.estimatedCost),
    };
  }
  if (action.command === "service.startTechnicalIssue") {
    return {
      technicalDetailCatalogId: item.technicalDetailCatalogId ?? "",
      replacementPartCodes: [],
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
  if (action.command === "service.cancelTechnicalIssue") {
    return { cancelReason: "" };
  }
  return {};
}

function technicalIssuePriorityValue(value?: string | null) {
  return String(value ?? "NORMAL").toUpperCase() === "URGENT" ? "URGENT" : "NORMAL";
}

function technicalIssuePriorityWeight(value?: string | null) {
  return technicalIssuePriorityValue(value) === "URGENT" ? 0 : 1;
}

function technicalBoardAreaAccent(area?: string | null) {
  const normalized = String(area ?? "").toUpperCase();

  if (normalized === "MOVEMENT") {
    return {
      bar: "bg-blue-500",
      headerBg: "bg-blue-50",
      headerBorder: "border-blue-100",
      chip: "border-blue-100 bg-blue-50 text-blue-700",
    };
  }
  if (normalized === "CASE") {
    return {
      bar: "bg-amber-500",
      headerBg: "bg-amber-50",
      headerBorder: "border-amber-100",
      chip: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (normalized === "CRYSTAL") {
    return {
      bar: "bg-indigo-500",
      headerBg: "bg-indigo-50",
      headerBorder: "border-indigo-100",
      chip: "border-indigo-100 bg-indigo-50 text-indigo-700",
    };
  }
  if (normalized === "BRACELET" || normalized === "STRAP") {
    return {
      bar: "bg-teal-500",
      headerBg: "bg-teal-50",
      headerBorder: "border-teal-100",
      chip: "border-teal-100 bg-teal-50 text-teal-700",
    };
  }

  return {
    bar: "bg-slate-400",
    headerBg: "bg-slate-50",
    headerBorder: "border-slate-100",
    chip: "border-slate-200 bg-slate-50 text-slate-700",
  };
}

function technicalBoardItemTimeValue(item: TechnicalIssueBoardItem) {
  const raw = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
  return Number.isFinite(raw) ? raw : 0;
}

function sortTechnicalBoardItems(items: TechnicalIssueBoardItem[]) {
  return [...items].sort((left, right) => {
    const priorityDiff =
      technicalIssuePriorityWeight(left.priority) - technicalIssuePriorityWeight(right.priority);
    if (priorityDiff !== 0) return priorityDiff;

    const unreadMentionDiff = Number(right.unreadMentionCount > 0) - Number(left.unreadMentionCount > 0);
    if (unreadMentionDiff !== 0) return unreadMentionDiff;

    const commentDiff = Number(right.commentCount > 0) - Number(left.commentCount > 0);
    if (commentDiff !== 0) return commentDiff;

    const timeDiff = technicalBoardItemTimeValue(right) - technicalBoardItemTimeValue(left);
    if (timeDiff !== 0) return timeDiff;

    return left.summary.localeCompare(right.summary, "vi");
  });
}

function technicalBoardSummary(items: TechnicalIssueBoardItem[]) {
  const total = items.length;
  const done = items.filter((item) => item.stage === "DONE").length;
  const urgent = items.filter((item) => technicalIssuePriorityValue(item.priority) === "URGENT").length;
  const commented = items.filter((item) => item.commentCount > 0).length;
  const mentionedMe = items.filter((item) => item.mentionedMeCount > 0).length;
  const unreadMentionedMe = items.filter((item) => item.unreadMentionCount > 0).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const stageCounts = {
    INSPECT: items.filter((item) => item.stage === "INSPECT").length,
    READY: items.filter((item) => item.stage === "READY").length,
    PROCESSING: items.filter((item) => item.stage === "PROCESSING").length,
    DONE: done,
  };

  return { total, done, urgent, commented, mentionedMe, unreadMentionedMe, percent, stageCounts };
}

function shouldShowTechnicalBoardField(
  field: OperationalBlueprintActionField,
  values: Record<string, TechnicalBoardFieldValue>,
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"],
) {
  if (field.key === "replacementPartCodes") {
    const selectedDetailId = typeof values.technicalDetailCatalogId === "string" ? values.technicalDetailCatalogId : "";
    return technicalDetailCatalogOptions.some(
      (item) => item.id === selectedDetailId && item.code === "MOVEMENT_REPLACE_PARTS",
    );
  }
  if (field.key !== "vendorId") return true;
  const mode = String(values.assigneeMode ?? values.actionMode ?? "").toUpperCase();
  return mode === "VENDOR";
}

function technicalBoardSubmitLabel(action: OperationalBlueprintAction) {
  if (action.command === "service.confirmTechnicalIssue") return "Xác nhận lỗi";
  if (action.command === "service.closeTechnicalIssueNoIssue") return "Xác nhận không có lỗi";
  if (action.command === "service.startTechnicalIssue") return "Bắt đầu xử lý";
  if (action.command === "service.completeTechnicalIssue") return "Hoàn tất xử lý";
  if (action.command === "service.cancelTechnicalIssue") return "Xác nhận không xử lý nữa";
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

function TechnicalIssueBoardControlStrip({
  summary,
  visibleSummary,
}: {
  summary: ReturnType<typeof technicalBoardSummary>;
  visibleSummary: ReturnType<typeof technicalBoardSummary>;
}) {
  const segments = [
    { key: "INSPECT", label: "Kiểm tra", value: visibleSummary.stageCounts.INSPECT, className: "bg-blue-500" },
    { key: "READY", label: "Chờ xử lý", value: visibleSummary.stageCounts.READY, className: "bg-violet-500" },
    { key: "PROCESSING", label: "Xử lý", value: visibleSummary.stageCounts.PROCESSING, className: "bg-amber-500" },
    { key: "DONE", label: "Done", value: visibleSummary.stageCounts.DONE, className: "bg-emerald-500" },
  ];
  return (
    <div className="flex h-11 min-w-[420px] shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="shrink-0 text-xs font-bold text-slate-950">Tiến độ</span>
        <span className="shrink-0 text-xs font-extrabold text-slate-950">{visibleSummary.percent}%</span>
        <div className="h-2 min-w-[120px] flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className="flex h-full w-full">
            {segments.map((segment) => {
              const width = visibleSummary.total ? Math.max(2, (segment.value / visibleSummary.total) * 100) : 0;
              return segment.value ? (
                <div
                  key={segment.key}
                  className={segment.className}
                  style={{ width: `${width}%` }}
                  title={`${segment.label}: ${segment.value}`}
                />
              ) : null;
            })}
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-slate-500">
          {visibleSummary.done}/{visibleSummary.total} xong
        </span>
        <span className="shrink-0 text-[11px] font-semibold text-rose-600">{summary.urgent} gấp</span>
      </div>
    </div>
  );
}
const TECHNICAL_BOARD_COLUMN_PAGE_SIZE = 10;

function TechnicalIssueBoardColumn({
  column,
  items,
  isOver,
  onTogglePriority,
  priorityPendingIssueId,
  focusedIssueId,
  onPreview,
}: {
  column: { key: TechnicalIssueBoardStage; label: string; hint: string };
  items: TechnicalIssueBoardItem[];
  isOver: boolean;
  onTogglePriority: (item: TechnicalIssueBoardItem) => void;
  priorityPendingIssueId: string | null;
  focusedIssueId: string | null;
  onPreview: (item: TechnicalIssueBoardItem) => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.key });
  const [visibleCount, setVisibleCount] = useState(TECHNICAL_BOARD_COLUMN_PAGE_SIZE);
  const visibleItems = items.slice(0, visibleCount);
  const remainingCount = Math.max(0, items.length - visibleItems.length);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[480px] min-w-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition",
        isOver && "border-violet-300 ring-2 ring-violet-100",
      )}
    >
      <div className="sticky top-0 z-10 shrink-0 rounded-t-xl border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-950">{column.label}</div>
          <div className="mt-1 line-clamp-2 text-xs text-slate-500">{column.hint}</div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {items.length}
        </span>
        </div>
      </div>
      <div className="grid flex-1 content-start gap-3 p-3 sm:p-4">
        {visibleItems.map((item) => (
          <DraggableTechnicalIssueBoardCard
            key={item.id}
            item={item}
            onTogglePriority={onTogglePriority}
            priorityPending={priorityPendingIssueId === item.id}
            focused={focusedIssueId === item.id}
            onPreview={onPreview}
          />
        ))}
        {!items.length ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
            Kéo TI vào đây.
          </div>
        ) : null}
        {remainingCount > 0 ? (
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + TECHNICAL_BOARD_COLUMN_PAGE_SIZE)}
            className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            Xem thêm {Math.min(TECHNICAL_BOARD_COLUMN_PAGE_SIZE, remainingCount)} · Còn {remainingCount} TI
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DraggableTechnicalIssueBoardCard({
  item,
  onTogglePriority,
  priorityPending,
  focused,
  onPreview,
}: {
  item: TechnicalIssueBoardItem;
  onTogglePriority: (item: TechnicalIssueBoardItem) => void;
  priorityPending: boolean;
  focused: boolean;
  onPreview: (item: TechnicalIssueBoardItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = {
    opacity: isDragging ? 0 : 1,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-technical-issue-id={item.id}
      className={cn(
        "min-w-0 max-w-full rounded-xl transition",
        focused && "ring-4 ring-violet-300 ring-offset-2",
      )}
    >
      <TechnicalIssueBoardCard
        item={item}
        dragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onTogglePriority={onTogglePriority}
        priorityPending={priorityPending}
        onPreview={onPreview}
      />
    </div>
  );
}

function TechnicalIssueBoardCard({
  item,
  dragging,
  dragHandleProps,
  onTogglePriority,
  priorityPending,
  onPreview,
}: {
  item: TechnicalIssueBoardItem;
  dragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onTogglePriority?: (item: TechnicalIssueBoardItem) => void;
  priorityPending?: boolean;
  onPreview?: (item: TechnicalIssueBoardItem) => void;
}) {
  const imageSrc = resolveMediaPreviewSrc(item.serviceRequest.imageUrl);
  const isUrgent = technicalIssuePriorityValue(item.priority) === "URGENT";
  const accent = technicalBoardAreaAccent(item.area);
  const lastUpdatedBy = item.lastUpdatedBy;
  const lastUpdatedAvatarSrc = resolveMediaPreviewSrc(lastUpdatedBy.avatarUrl);

  return (
    <div
      className={cn(
        "relative w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md",
        isUrgent && "border-rose-200 ring-1 ring-rose-100",
        dragging && "rotate-[1.5deg] shadow-xl ring-2 ring-violet-200",
      )}
    >
      <button
        type="button"
        onClick={() => onPreview?.(item)}
        className="absolute inset-0 z-10 rounded-xl"
        aria-label={`Xem nhanh TI ${item.summary}`}
      />
      <div className={cn("h-1", accent.bar)} />
      {isUrgent ? (
        <div className="pointer-events-none absolute -left-8 top-3 z-10 w-24 -rotate-45 bg-rose-500/70 py-0.5 text-center text-[9px] font-black uppercase tracking-wide text-white/85 shadow-sm">
          Gấp
        </div>
      ) : null}
      <div className={cn("flex items-start gap-2 border-b px-2.5 py-2.5", accent.headerBg, accent.headerBorder)}>
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-100">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Monitor className="m-2.5 h-5 w-5 text-slate-400" aria-hidden="true" />
          )}
        </div>
        <div className={cn("min-w-0 flex-1", isUrgent && "pl-4")}>
          <div className="flex min-w-0 flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold text-slate-950">
              {item.summary}
            </div>
          </div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {item.serviceRequest.refNo ?? "SR"} · {item.serviceRequest.productTitle ?? item.serviceRequest.sku ?? "Watch"}
          </div>
        </div>
        <div className="relative z-20 flex shrink-0 items-center gap-1">
          {item.unreadMentionCount > 0 ? (
            <span title={`${item.unreadMentionCount} lượt nhắc bạn chưa đọc`} className="inline-flex h-6 items-center gap-0.5 rounded-full bg-violet-100 px-1.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
              <AtSign className="h-3.5 w-3.5" aria-hidden="true" />
              {item.unreadMentionCount > 99 ? "99+" : item.unreadMentionCount}
            </span>
          ) : null}
          {item.commentCount > 0 ? (
            <span
              title={`${item.commentCount} comment`}
              aria-label={`${item.commentCount} comment`}
              className="inline-flex h-6 items-center gap-1 px-1 text-[11px] font-semibold text-slate-500"
            >
              <span>{item.commentCount > 999 ? "999+" : item.commentCount}</span>
              <MessageCircle className="h-3.5 w-3.5 fill-slate-500 text-slate-500" aria-hidden="true" />
            </span>
          ) : null}
          {onTogglePriority ? (
            <button
              type="button"
              disabled={priorityPending}
              onClick={() => onTogglePriority(item)}
              title={isUrgent ? "Bỏ gấp" : "Đánh dấu gấp"}
              aria-label={isUrgent ? "Bỏ gấp" : "Đánh dấu gấp"}
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-md border bg-white transition disabled:cursor-wait disabled:opacity-60",
                isUrgent
                  ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                  : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-rose-600",
              )}
            >
              <Zap className="h-3 w-3" aria-hidden="true" />
            </button>
          ) : null}
          {dragHandleProps ? (
            <button
              type="button"
              {...dragHandleProps}
              className="inline-flex h-6 w-6 cursor-grab items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 active:cursor-grabbing"
              aria-label="Kéo TI"
            >
              <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 px-2.5 pt-2">
        <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", accent.chip)}>
          {technicalAreaLabel(item.area)}
        </span>
        {item.actionMode ? (
          <span className="max-w-full truncate rounded-full border border-violet-100 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
            {technicalOwnerLabel(item.actionMode, item.vendorName)}
          </span>
        ) : null}
      </div>
      {item.processingDetails.length ? (
        <div className="px-2.5 pt-2 text-xs leading-5 text-slate-600">
          <span className="font-semibold text-slate-800">Xử lý:</span>{" "}
          {item.processingDetails.join(" · ")}
        </div>
      ) : null}
      <div className="flex min-w-0 items-center justify-between gap-2 px-2.5 py-2 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full text-[9px] font-semibold",
              lastUpdatedBy.isSystem ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600",
            )}
          >
            {lastUpdatedAvatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lastUpdatedAvatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(lastUpdatedBy.label)
            )}
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-semibold text-slate-800">{lastUpdatedBy.label}</div>
            <div className="truncate text-[11px] text-slate-400">{formatDateTime(item.updatedAt)}</div>
          </div>
        </div>
        <div className="max-w-[42%] truncate text-right font-semibold text-slate-800">
          {item.actualCost != null
            ? formatMoneyCompact(item.actualCost)
            : item.estimatedCost != null
              ? `Dự kiến ${formatMoneyCompact(item.estimatedCost)}`
              : "Chưa có chi phí"}
        </div>
      </div>
    </div>
  );
}

function TechnicalIssueBoardMoveModal({
  request,
  values,
  additionalIssues,
  error,
  pending,
  costApprovalPending,
  vendorOptions,
  technicalDetailCatalogOptions,
  onChange,
  onAdditionalIssuesChange,
  onRequestCostApproval,
  onSubmit,
  onClose,
}: {
  request: TechnicalIssueBoardMoveRequest | null;
  values: Record<string, TechnicalBoardFieldValue>;
  additionalIssues: TechnicalBoardAdditionalIssue[];
  error: string | null;
  pending: boolean;
  costApprovalPending: boolean;
  vendorOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["vendorOptions"];
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"];
  onChange: (key: string, value: TechnicalBoardFieldValue) => void;
  onAdditionalIssuesChange: (issues: TechnicalBoardAdditionalIssue[]) => void;
  onRequestCostApproval: () => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  if (!request) return null;
  const action = request.action;
  const visibleFields = action?.fields.filter((field) =>
    shouldShowTechnicalBoardField(field, values, technicalDetailCatalogOptions),
  ) ?? [];
  const canOfferAdditionalIssue =
    request.item.stage === "INSPECT" &&
    (request.targetStage === "READY" || request.targetStage === "PROCESSING") &&
    Boolean(action);

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
          {canOfferAdditionalIssue ? (
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Tách thêm Technical Issue</div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">
                    Mỗi TI mới thuộc cùng SR Case và được đưa vào Inspect để xử lý độc lập.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onAdditionalIssuesChange([...additionalIssues, { summary: "", note: "" }])}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm TI
                </button>
              </div>
              {additionalIssues.length ? (
                <div className="mt-3 space-y-3 border-t border-violet-100 pt-3">
                  {additionalIssues.map((issue, index) => (
                    <div key={index} className="rounded-xl border border-violet-200 bg-white p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-violet-700">TI bổ sung #{index + 1}</span>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => onAdditionalIssuesChange(additionalIssues.filter((_, issueIndex) => issueIndex !== index))}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
                          aria-label={`Xóa TI bổ sung ${index + 1}`}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-2">
                        <input
                          value={issue.summary}
                          onChange={(event) => onAdditionalIssuesChange(additionalIssues.map((candidate, issueIndex) => issueIndex === index ? { ...candidate, summary: event.target.value } : candidate))}
                          disabled={pending}
                          placeholder="Mô tả ngắn vấn đề cần xử lý thêm *"
                          className="h-10 rounded-lg border border-violet-200 px-3 text-sm text-slate-800 outline-none focus:border-violet-400"
                          autoFocus={index === additionalIssues.length - 1}
                        />
                        <textarea
                          value={issue.note}
                          onChange={(event) => onAdditionalIssuesChange(additionalIssues.map((candidate, issueIndex) => issueIndex === index ? { ...candidate, note: event.target.value } : candidate))}
                          disabled={pending}
                          placeholder="Ghi chú thêm (không bắt buộc)"
                          rows={2}
                          className="resize-none rounded-lg border border-violet-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
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
            <div className="flex flex-wrap items-center justify-end gap-2">
              {action?.command === "service.completeTechnicalIssue" ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={onRequestCostApproval}
                  className="inline-flex h-9 items-center rounded-lg border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {costApprovalPending ? "Đang gửi duyệt..." : "Gửi duyệt chi phí"}
                </button>
              ) : null}
              <button
                type="submit"
                disabled={pending || !action}
                className="inline-flex h-9 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {pending && !costApprovalPending ? "Đang xử lý" : action ? technicalBoardSubmitLabel(action) : "Không khả dụng"}
              </button>
            </div>
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
  value?: TechnicalBoardFieldValue;
  disabled?: boolean;
  vendorOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["vendorOptions"];
  technicalDetailCatalogOptions: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["technicalDetailCatalogOptions"];
  area?: string | null;
  onChange: (value: TechnicalBoardFieldValue) => void;
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
      <select className={baseClass} disabled={disabled} value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)}>
        <option value="">Chọn chi tiết kỹ thuật</option>
        {options.map((item) => <option key={item.id} value={item.id}>{[item.code, item.name].filter(Boolean).join(" - ") || item.id}</option>)}
      </select>
    );
  }
  if (field.kind === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2">
        {(field.options ?? []).map((option) => {
          const checked = selectedValues.includes(option.value);
          return <label key={option.value} className={cn("flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition", checked ? "bg-amber-50 text-amber-900" : "text-slate-700 hover:bg-slate-50")}><input type="checkbox" disabled={disabled} checked={checked} onChange={(event) => onChange(event.target.checked ? [...selectedValues, option.value] : selectedValues.filter((item) => item !== option.value))} className="h-4 w-4 rounded border-slate-300 text-amber-600" /><span className="font-medium">{option.label}</span></label>;
        })}
      </div>
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
  const area = String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const aliases: Record<string, string> = {
    MAY: "MOVEMENT",
    MOVEMENT: "MOVEMENT",
    VO: "CASE",
    CASE: "CASE",
    KINH: "CRYSTAL",
    GLASS: "CRYSTAL",
    CRYSTAL: "CRYSTAL",
    NUM: "CROWN",
    CROWN: "CROWN",
    MAT_SO: "DIAL",
    DIAL: "DIAL",
    HANDS: "HANDS_MARKERS",
    HAND_MARKERS: "HANDS_MARKERS",
    HANDS_MARKERS: "HANDS_MARKERS",
    KIM: "HANDS_MARKERS",
    KIM_COC: "HANDS_MARKERS",
    DAY: "BRACELET",
    STRAP: "BRACELET",
    BRACELET: "BRACELET",
    TONG_QUAT: "GENERAL",
    GENERAL: "GENERAL",
  };
  return aliases[area] ?? area;
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
