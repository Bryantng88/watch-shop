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
  CalendarDays,
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
  Settings,
  SlidersHorizontal,
  XCircle,
  Zap,
} from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import {
  rolloverPreviousCycleItemsAction,
  setWorkspaceAutoBindingReceiverAction,
  updateSpaceSharingAction,
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
import {
  SpaceViewFooterTip,
  SpaceViewInfoCell,
  SpaceViewInfoGrid,
  SpaceViewPage,
  SpaceViewPanel,
  SpaceViewSectionHeader,
  SpaceViewSummary,
  SpaceViewSummaryCell,
} from "@/domains/shared/ui/space/SpaceViewShell";
import type { CoordinationDashboardDTO } from "../server/coordination-dashboard.types";
import { isCoreWorkspaceBlueprint } from "@/domains/task/shared/workspace-flow-policy";

type Props = {
  data: CoordinationDashboardDTO;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

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

function formatMoneyCompact(value?: number | null) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) return "0đ";
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`;
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

function viewConfigLabel(value: string) {
  const labels: Record<string, string> = {
    "Technical Service Space": "Không gian kỹ thuật dịch vụ",
    "Media Production Space": "Không gian sản xuất Media",
  };

  return labels[displayText(value)] ?? displayText(value);
}

function modeLabel(mode: CoordinationDashboardDTO["viewConfig"]["modes"][number]) {
  if (mode.key === "media-production-flow") return "Luồng sản xuất Media";
  if (mode.key === "sr-cases") return "Hồ sơ yêu cầu dịch vụ";
  if (mode.key === "technical-issue-flow") return "Bàn xử lý kỹ thuật";
  if (mode.key === "workspace-index") return "Danh sách Workspace";
  return displayText(mode.label);
}

function modeDescription(mode: CoordinationDashboardDTO["viewConfig"]["modes"][number]) {
  if (mode.key === "media-production-flow") {
    return "Chụp ảnh → Xử lý Media → Đăng bài. Mỗi dòng là một Workspace theo stage của luồng.";
  }
  if (mode.key === "workspace-index") {
    return "Danh sách dự phòng cho Workspace thủ công hoặc Workspace độc lập trong Space này.";
  }
  if (mode.key === "sr-cases") {
    return "Mỗi dòng là một Workspace đại diện cho một yêu cầu dịch vụ đang cần theo dõi.";
  }
  if (mode.key === "technical-issue-flow") {
    return "Kiểm tra → Xử lý → Hoàn tất/Theo dõi. Mỗi dòng là một Workspace theo stage kỹ thuật.";
  }

  return displayText(mode.description);
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

function rowModelLabel(value: string) {
  const labels: Record<string, string> = {
    FLOW_STAGE_WORKSPACE: "Workspace theo stage luồng",
    CASE_WORKSPACE: "Workspace hồ sơ",
    WORKSPACE: "Workspace",
  };

  return labels[value] ?? value;
}

function primaryTargetLabel(value: string) {
  const labels: Record<string, string> = {
    workspace: "Workspace",
    businessObject: "Đối tượng nghiệp vụ",
    stage: "Stage",
  };

  return labels[value] ?? value;
}

function workspaceKindLabel(value: string) {
  const labels: Record<string, string> = {
    FLOW_STAGE_WORKSPACE: "Workspace theo stage luồng",
    CASE_WORKSPACE: "Workspace hồ sơ",
    BENCH_WORKSPACE: "Workspace kỹ thuật",
    STANDALONE_WORKSPACE: "Workspace độc lập",
    INDEX_WORKSPACE: "Workspace chỉ mục",
  };

  return labels[value] ?? value;
}

function columnLabel(value: string) {
  const labels: Record<string, string> = {
    Workspace: "Workspace",
    Owner: "Phụ trách",
    Items: "Số item",
    Feedback: "Phản hồi",
    Updated: "Cập nhật",
    "Last activity": "Hoạt động gần nhất",
  };

  return labels[value] ?? displayText(value);
}

function carryoverRuleText(value: string) {
  const cleanValue = displayText(value);
  if (cleanValue.includes("unfinished WATCH items")) {
    return "Chuyển các item đồng hồ chưa hoàn tất đang gắn với Chụp ảnh, Xử lý Media hoặc Đăng bài. Công việc đã đăng hoặc đã kết thúc sẽ không được chuyển tồn.";
  }
  if (cleanValue.includes("active SERVICE_REQUEST cases") || cleanValue.includes("TECHNICAL_ISSUE items")) {
    return "Chuyển các hồ sơ yêu cầu dịch vụ và lỗi kỹ thuật còn đang xử lý. Hồ sơ hoặc lỗi kỹ thuật đã kết thúc sẽ không được chuyển tồn.";
  }

  return cleanValue;
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

function terminalStatesLabel(targetType: string, states: string[]) {
  return `${targetTypeLabel(targetType)}: bỏ qua ${states.join(", ")}`;
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

function OwnerCell({
  owner,
}: {
  owner: CoordinationDashboardDTO["workTickets"][number]["owner"];
}) {
  const src = resolveMediaPreviewSrc(owner.avatarUrl);

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500 lg:hidden">Phụ trách</div>
      <div className="mt-1 inline-flex min-w-0 items-center gap-2 lg:mt-0">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${owner.isSystem ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={owner.label} className="h-full w-full object-cover" />
          ) : owner.isSystem ? (
            "S"
          ) : (
            initials(owner.label)
          )}
        </span>
        <span className="truncate font-medium text-slate-800">{owner.label}</span>
      </div>
    </div>
  );
}

type SpaceShareScope = "SPACE" | "CORE_FLOW";

function shareUserLabel(user?: CoordinationDashboardDTO["spaceSharing"]["users"][number] | null) {
  return user?.name || user?.email || "Unassigned";
}

function SpaceShareAvatar({
  user,
}: {
  user: CoordinationDashboardDTO["spaceSharing"]["users"][number];
}) {
  const label = shareUserLabel(user);
  const src = resolveMediaPreviewSrc(user.avatarUrl);

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600">
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
  const [selectedUserId, setSelectedUserId] = useState("");
  const [sharingScope, setSharingScope] = useState<SpaceShareScope>(
    activeCoreFlow ? "CORE_FLOW" : "SPACE",
  );
  const [localScopeIds, setLocalScopeIds] = useState(sharing.scopeUserIds);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const activeScope =
    sharingScope === "CORE_FLOW" && activeCoreFlow ? "CORE_FLOW" : "SPACE";
  const activeCoreFlowKey = activeCoreFlow?.key ?? null;
  const activeSharedIds =
    activeScope === "CORE_FLOW" && activeCoreFlowKey
      ? localScopeIds.coreFlows[activeCoreFlowKey] ?? []
      : localScopeIds.space;
  const sharedIdSet = new Set(activeSharedIds);
  const visibleSharedUsers = activeSharedIds
    .map((id) => sharing.sharedUsers.find((user) => user.id === id) ?? sharing.users.find((user) => user.id === id))
    .filter(Boolean) as CoordinationDashboardDTO["spaceSharing"]["users"];
  const availableUsers = sharing.users.filter((user) => !sharedIdSet.has(user.id));

  useEffect(() => {
    if (!activeCoreFlow && sharingScope === "CORE_FLOW") {
      setSharingScope("SPACE");
    }
  }, [activeCoreFlow, sharingScope]);

  function updateSharedUsers(nextSharedIds: string[]) {
    const nextScopeIds =
      activeScope === "CORE_FLOW" && activeCoreFlowKey
        ? {
            ...localScopeIds,
            coreFlows: {
              ...localScopeIds.coreFlows,
              [activeCoreFlowKey]: nextSharedIds,
            },
          }
        : {
            ...localScopeIds,
            space: nextSharedIds,
          };

    setLocalScopeIds(nextScopeIds);
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

  function addSelected() {
    if (!selectedUserId) return;
    updateSharedUsers(Array.from(new Set([...activeSharedIds, selectedUserId])));
    setSelectedUserId("");
  }

  function removeUser(userId: string) {
    updateSharedUsers(activeSharedIds.filter((id) => id !== userId));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-950">Shared with</h3>
          <div className="mt-2 text-[11px] font-medium text-slate-500">
            {activeScope === "CORE_FLOW" && activeCoreFlow ? coreFlowLabel(activeCoreFlow) : "Entire space"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 text-sm font-semibold text-violet-700 shadow-sm hover:bg-violet-50"
        >
          <Plus className="h-4 w-4" />
          Thêm
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-0">
        {visibleSharedUsers.length ? (
          <>
            {(isExpanded ? visibleSharedUsers : visibleSharedUsers.slice(0, 3)).map((user) => (
          <span
            key={user.id}
            className="inline-flex max-w-full items-center gap-2 rounded-full text-sm font-medium text-slate-700 -ml-2 first:ml-0"
          >
            <SpaceShareAvatar user={user} />
            {isExpanded ? (
              <>
                <span className="max-w-[160px] truncate">{shareUserLabel(user)}</span>
                <button
                  type="button"
                  onClick={() => removeUser(user.id)}
                  disabled={isPending}
                  className="rounded-full p-0.5 text-slate-400 hover:bg-white hover:text-rose-600"
                  aria-label={`Remove shared access for ${shareUserLabel(user)}`}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </>
            ) : null}
          </span>
            ))}
            {visibleSharedUsers.length > 3 && !isExpanded ? (
              <span className="-ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 px-2 text-xs font-semibold text-slate-500">
                +{visibleSharedUsers.length - 3}
              </span>
            ) : null}
          </>
        ) : (
          <div className="text-xs text-slate-500">
            Not shared with anyone yet.
          </div>
        )}
      </div>

      {isExpanded ? (
      <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <select
          value={activeScope}
          onChange={(event) => setSharingScope(event.target.value as SpaceShareScope)}
          disabled={isPending}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          {activeCoreFlow ? (
            <option value="CORE_FLOW">Share this core flow</option>
          ) : null}
          <option value="SPACE">Share entire space</option>
        </select>
        <select
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value)}
          disabled={isPending || !availableUsers.length}
          className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="">Add participant</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {shareUserLabel(user)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addSelected}
          disabled={isPending || !selectedUserId}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
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
  const [activeViewModeKey, setActiveViewModeKey] = useState(
    data.viewConfig.defaultModeKey,
  );
  const initialTitle = data.blueprints[0]?.workspaceDefinition.defaultName ?? "";
  const [title, setTitle] = useState(initialTitle);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workTicketView, setWorkTicketView] = useState<"LIST" | "TI_BOARD">("LIST");
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

  async function updateAutoBindingReceiver(nextReceiverId: string) {
    if (!selectedBlueprint) return;

    const nextWorkspace = selectedBlueprint.usage.activeWorkspaces.find(
      (workspace) => workspace.id === nextReceiverId,
    );
    const message = nextWorkspace
      ? `Workspace "${displayText(nextWorkspace.title)}" sẽ tự động nhận item nghiệp vụ cho Blueprint này.`
      : "Blueprint này chưa có Workspace tự động nhận item nghiệp vụ.";
    const ok = await dialog.confirm({
      title: "Cập nhật Workspace nhận item tự động",
      message,
      confirmText: "Cập nhật",
      cancelText: "Hủy",
      tone: nextWorkspace ? "warning" : "danger",
    });

    if (!ok) return;

    setError(null);
    startTransition(async () => {
      try {
        await setWorkspaceAutoBindingReceiverAction({
          taskId: data.cycle.id,
          taskItemId: nextReceiverId || null,
          context: data.context,
          blueprintKey: selectedBlueprint.key,
          blueprintSource: selectedBlueprint.source,
        });
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Không thể cập nhật Workspace tự động nhận item.");
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
      meta={
        <>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Tuần {data.week.weekNumber}/{data.week.year}
          </span>
          <span>
            {formatDate(data.week.startDate)} - {formatDate(data.week.endDate)}
          </span>
          <span className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <select
              value={data.week.periodKey}
              onChange={(event) => {
                const option = data.filters.weekOptions.find(
                  (item) => item.value === event.target.value,
                );
                if (option) updateDate(option.date);
              }}
              className="h-8 w-[132px] border-0 bg-white px-2 text-xs font-semibold text-slate-700 outline-none"
              aria-label="Chọn tuần"
            >
              {data.filters.weekOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="h-5 w-px bg-slate-200" />
            <input
              type="date"
              value={data.filters.selectedDate}
              onChange={(event) => updateDate(event.target.value)}
              className="h-8 w-[142px] border-0 bg-white px-2 text-xs font-semibold text-slate-700 outline-none"
              aria-label="Chọn ngày"
            />
          </span>
        </>
      }
      actions={
        !isCreateFormOpen ? (
          <>
            <button
              type="button"
              disabled={isPending || !data.viewConfig.carryover.enabled}
              onClick={() => void rolloverPreviousCycle()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <RotateCcw className="h-4 w-4" />
              {actionLabel(data.viewConfig.carryover.actionLabel)}
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus className="h-4 w-4" />
              Tạo Workspace
            </button>
          </>
        ) : null
      }
    >

          <div className="hidden">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Tuần</span>
              <select
                value={data.week.periodKey}
                onChange={(event) => {
                  const option = data.filters.weekOptions.find(
                    (item) => item.value === event.target.value,
                  );
                  if (option) updateDate(option.date);
                }}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400"
              >
                {data.filters.weekOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Khoảng ngày</span>
              <input
                type="date"
                value={data.filters.selectedDate}
                onChange={(event) => updateDate(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400"
              />
            </label>
          </div>

        <section className="hidden gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {data.report.map((metric) => (
            <div
              key={metric.key}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-medium uppercase text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {metric.value}
              </div>
            </div>
          ))}
        </section>

        <SpaceViewPanel>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className={`${isCreateFormOpen ? "flex" : "hidden"} flex-col gap-3 lg:flex-row lg:items-center lg:justify-between`}>
              <h2 className="text-sm font-semibold text-slate-900">
                {prefixedLabel("Space", data.cycle.title)}
              </h2>

              {!isCreateFormOpen ? (
                <div className="hidden flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending || !data.viewConfig.carryover.enabled}
                    onClick={() => void rolloverPreviousCycle()}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {actionLabel(data.viewConfig.carryover.actionLabel)}
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
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Plus className="h-4 w-4" />
                  Tạo Workspace
                </button>
                </div>
              ) : null}
              <form
                className={`${isCreateFormOpen ? "flex" : "hidden"} min-w-0 flex-col gap-2 sm:flex-row sm:items-center`}
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
                  className="h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400 sm:w-56"
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
                  className="h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400 sm:w-64"
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
                  className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
              </form>
            </div>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            {selectedBlueprint ? (
              <SpaceViewSummary>
                <SpaceViewSummaryCell as="label">
                  <span className="font-bold uppercase tracking-wide text-slate-500">Blueprint</span>
                  <select
                    value={blueprintKey}
                    onChange={(event) => {
                      const nextKey = event.target.value;
                      const nextBlueprint = data.blueprints.find(
                        (blueprint) => blueprint.selectionKey === nextKey,
                      );
                      setBlueprintKey(nextKey);
                      if (isCreateFormOpen) {
                        setTitle(nextBlueprint?.workspaceDefinition.defaultName ?? "");
                      }
                    }}
                    className="mt-3 h-8 w-full rounded-md border-0 bg-transparent px-0 text-base font-semibold text-slate-950 outline-none focus:ring-0"
                  >
                    {data.blueprints.map((blueprint) => (
                      <option key={blueprint.selectionKey} value={blueprint.selectionKey}>
                        {blueprintSelectLabel(blueprint)}
                      </option>
                    ))}
                  </select>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                      <Monitor className="h-3.5 w-3.5" />
                    </span>
                    {viewConfigLabel(data.viewConfig.label)}
                  </div>
                </SpaceViewSummaryCell>

                <SpaceViewSummaryCell>
                  <div className="font-bold uppercase tracking-wide text-slate-500">Workspace đang mở</div>
                  <div className={`mt-3 text-base font-semibold ${selectedBlueprint.usage.active ? "text-slate-950" : "text-slate-500"}`}>
                    {selectedBlueprint.usage.active} đang hoạt động / {selectedBlueprint.usage.total} tổng
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-100">
                    <div
                      className="h-full rounded-full bg-violet-600"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            selectedBlueprint.usage.total
                              ? (selectedBlueprint.usage.active / selectedBlueprint.usage.total) * 100
                              : 0,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                </SpaceViewSummaryCell>

                <SpaceViewSummaryCell as="label">
                  <span className="font-bold uppercase tracking-wide text-slate-500">Tự động nhận item</span>
                  <select
                    value={selectedBlueprint.usage.receiverId ?? ""}
                    disabled={isPending || !selectedBlueprint.usage.activeWorkspaces.length}
                    onChange={(event) => void updateAutoBindingReceiver(event.target.value)}
                    className="mt-3 h-8 w-full rounded-md border-0 bg-transparent px-0 text-base font-semibold text-slate-950 outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    <option value="">Chưa chọn Workspace nhận item</option>
                    {selectedBlueprint.usage.activeWorkspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {prefixedLabel("Workspace", workspace.title)}
                      </option>
                    ))}
                  </select>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Đang bật
                  </span>
                </SpaceViewSummaryCell>

                <SpaceViewSummaryCell>
                  <div className="font-bold uppercase tracking-wide text-slate-500">Quy tắc chuyển tồn</div>
                  <div className="mt-3 text-sm leading-5 text-slate-700">
                    {carryoverRuleText(data.viewConfig.carryover.processingRule)}
                  </div>
                  {data.viewConfig.carryover.terminalStatesByTargetType ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(data.viewConfig.carryover.terminalStatesByTargetType).map(
                        ([targetType, states]) => (
                          <span
                            key={targetType}
                            className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 font-semibold text-violet-700"
                          >
                            {terminalStatesLabel(targetType, states)}
                          </span>
                        ),
                      )}
                    </div>
                  ) : null}
                </SpaceViewSummaryCell>

                <div className="flex items-start justify-end p-5">
                  <button
                    type="button"
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-violet-100 bg-violet-50 px-3 text-xs font-semibold text-violet-700"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Chỉnh sửa cài đặt
                  </button>
                </div>
              </SpaceViewSummary>
            ) : null}
            <div className="mt-4">
              <SpaceSharingEditor
                taskId={data.cycle.id}
                context={data.context}
                activeCoreFlow={activeCoreFlow}
                sharing={data.spaceSharing}
              />
            </div>
            {activeViewMode ? (
              <SpaceViewInfoGrid>
                <SpaceViewInfoCell icon={<Monitor className="h-4 w-4" />} label="Chế độ xem Space">
                  <div className="mt-3 text-sm font-semibold text-slate-950">
                    {modeLabel(activeViewMode)}
                  </div>
                  <div className="mt-3">
                    {data.viewConfig.modes.length > 1 ? (
                      <select
                        value={activeViewMode.key}
                        onChange={(event) => setActiveViewModeKey(event.target.value)}
                        className="h-9 w-full rounded-md border border-sky-200 bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm outline-none focus:border-violet-300"
                      >
                        {data.viewConfig.modes.map((mode) => (
                          <option key={mode.key} value={mode.key}>
                            {modeLabel(mode)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-medium text-slate-900">
                        {modeLabel(activeViewMode)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 leading-5 text-slate-600">
                    {modeDescription(activeViewMode)}
                  </div>
                  {activeCoreFlow ? (
                    <div className="mt-3 font-semibold text-violet-700">
                      Luồng: {coreFlowLabel(activeCoreFlow)}
                    </div>
                  ) : null}
                </SpaceViewInfoCell>

                <SpaceViewInfoCell icon={<Filter className="h-4 w-4" />} label="Quy tắc hiển thị">
                  <div className="mt-4 space-y-2 leading-5 text-slate-700">
                    <div>Dòng: {rowModelLabel(activeViewMode.rowModel)} / Đích: {primaryTargetLabel(activeViewMode.primaryTarget)}</div>
                    {activeViewMode.allowedWorkspaceKinds?.length ? (
                      <div>Loại Workspace: {activeViewMode.allowedWorkspaceKinds.map(workspaceKindLabel).join(", ")}</div>
                    ) : null}
                    {activeViewMode.coreFlowKey ? (
                      <div>Luồng chính: {activeCoreFlow ? coreFlowLabel(activeCoreFlow) : activeViewMode.coreFlowKey}</div>
                    ) : null}
                    <div>
                      Cột: {activeViewMode.columns.map((column) => columnLabel(column.label)).join(", ")}
                    </div>
                  </div>
                </SpaceViewInfoCell>

                <SpaceViewInfoCell icon={<RotateCcw className="h-4 w-4" />} label="Quy tắc chuyển tồn" className="lg:after:hidden">
                  <div className="mt-4 leading-5 text-slate-700">
                    {carryoverRuleText(data.viewConfig.carryover.processingRule)}
                  </div>
                  {data.viewConfig.carryover.terminalStatesByTargetType ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(data.viewConfig.carryover.terminalStatesByTargetType).map(
                        ([targetType, states]) => (
                          <span
                            key={targetType}
                            className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 font-semibold text-violet-700"
                          >
                            {terminalStatesLabel(targetType, states)}
                          </span>
                        ),
                      )}
                    </div>
                  ) : null}
                </SpaceViewInfoCell>
              </SpaceViewInfoGrid>
            ) : null}
            {activeViewMode ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white text-xs text-slate-700 shadow-[0_8px_24px_rgba(30,43,79,0.06)]">
                <SpaceViewSectionHeader
                  title={activeCoreFlow ? coreFlowLabel(activeCoreFlow) : modeLabel(activeViewMode)}
                  badge={
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-semibold text-slate-700">
                      {activeCoreFlow
                        ? `Item: ${targetTypeLabel(activeCoreFlow.itemTargetType)}`
                        : rowModelLabel(activeViewMode.rowModel)}
                    </span>
                  }
                  description={
                    <>
                      <span>
                        {activeCoreFlow
                          ? coreFlowDescription(activeCoreFlow)
                          : modeDescription(activeViewMode)}
                      </span>
                      {activeCoreFlow ? (
                        <span className="mt-3 flex flex-wrap items-center gap-1">
                          {activeCoreFlow.stages
                            .slice()
                            .sort((left, right) => left.sortOrder - right.sortOrder)
                            .map((stage, index) => (
                              <span key={stage.key} className="inline-flex items-center gap-1">
                                {index > 0 ? (
                                  <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                                ) : null}
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 shadow-sm">
                                  {stageLabel(stage.label)}
                                </span>
                              </span>
                            ))}
                        </span>
                      ) : (
                        <span className="mt-3 flex flex-wrap items-center gap-1">
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 shadow-sm">
                            {rowModelLabel(activeViewMode.rowModel)}
                          </span>
                          <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 shadow-sm">
                            {primaryTargetLabel(activeViewMode.primaryTarget)}
                          </span>
                        </span>
                      )}
                    </>
                  }
                  actions={
                    <>
                      {isTechnicalIssueFlowMode ? (
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm"
                      >
                        Tất cả trạng thái
                      </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setWorkTicketView("TI_BOARD")}
                        disabled={!canShowTechnicalIssueBoard}
                        className={cn(
                          "inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium shadow-sm",
                          isTechnicalIssueBoardView
                            ? "border-violet-300 bg-white text-violet-700"
                            : "border-slate-200 bg-white text-slate-500 hover:text-slate-700",
                          !canShowTechnicalIssueBoard && "cursor-not-allowed opacity-50",
                        )}
                        aria-label="Xem dạng lưới"
                      >
                        <Grid2X2 className="h-4 w-4" />
                        <span className="hidden xl:inline">Board TI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorkTicketView("LIST")}
                        className={cn(
                          "inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium shadow-sm",
                          !isTechnicalIssueBoardView
                            ? "border-violet-300 bg-white text-violet-700"
                            : "border-slate-200 bg-white text-slate-500 hover:text-slate-700",
                        )}
                        aria-label="Xem dạng danh sách"
                      >
                        <List className="h-4 w-4" />
                        <span className="hidden xl:inline">List</span>
                      </button>
                    </>
                  }
                />
              </div>
            ) : null}
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
            <div>Phụ trách</div>
            <div>Tiến độ / Item</div>
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
            {displayedWorkTickets.map((ticket) => (
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

                <OwnerCell owner={ticket.owner} />
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

            {!displayedWorkTickets.length ? (
              <div className="flex items-center gap-3 px-4 py-10 text-sm text-slate-500">
                <Inbox className="h-5 w-5" />
                {activeEmptyState}
              </div>
            ) : null}
          </div>
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
        </SpaceViewPanel>
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
  const completed = summary.done;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const items = [
    { label: "Sẵn sàng", value: summary.ready },
    { label: "Đang xử lý", value: summary.review },
    { label: "Phản hồi", value: summary.feedback },
    { label: "Xong", value: summary.done },
  ];

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-violet-700">
        <span>{completed} / {total || 0}</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${progress}%` }}
        />
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
