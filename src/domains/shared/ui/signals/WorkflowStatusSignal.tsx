import { ADMIN_UI_FOUNDATION as F } from "../admin-design-contract/admin-ui.foundation";
import {
  VisualStatusSignal,
  type VisualStatusIcon,
  type VisualStatusTone,
} from "./VisualStatusSignal";
import { operationalStagePresentation } from "./operational-stage-presentation";

type WorkflowStatusPresentation = {
  label: string;
  detail: string;
  tone: VisualStatusTone;
  icon: VisualStatusIcon;
};

function normalize(value?: string | null) {
  return String(value ?? "").trim().toUpperCase();
}

function workflowStatusPresentation(
  status?: string | null,
  label?: string | null,
  completedIcon: VisualStatusIcon = "success",
): WorkflowStatusPresentation {
  const normalized = normalize(status || label);
  const displayLabel = String(label ?? "").trim();

  if (["CANCELLED", "CANCELED"].includes(normalized)) {
    return {
      label: displayLabel || "Đã hủy",
      detail: "Đã hủy",
      tone: operationalStagePresentation(normalized).tone,
      icon: "warning",
    };
  }

  if (normalized === "CONVERTED") {
    return {
      label: displayLabel || "Đã tạo đơn nháp",
      detail: "Đã tạo đơn nháp",
      tone: operationalStagePresentation(normalized).tone,
      icon: completedIcon,
    };
  }

  if (["DONE", "COMPLETED", "APPROVED", "PUBLISHED"].includes(normalized)) {
    return {
      label: "Đã hoàn tất",
      detail: "Đã hoàn tất",
      tone: operationalStagePresentation(normalized).tone,
      icon: completedIcon,
    };
  }

  if (normalized === "ASSETS_DOWNLOADED") {
    return {
      label: "Đã tải content/image",
      detail: "Đã tải content/image",
      tone: "blue",
      icon: "success",
    };
  }

  if (["RETURNED", "FEEDBACK", "NEEDS_REWORK", "REJECTED"].includes(normalized)) {
    return {
      label: "Cần xử lý lại",
      detail: "Cần xử lý lại",
      tone: operationalStagePresentation(normalized).tone,
      icon: "warning",
    };
  }

  if (["REVIEW", "PENDING_REVIEW", "WAITING_REVIEW"].includes(normalized)) {
    return {
      label: "Chờ duyệt",
      detail: "Đang chờ duyệt",
      tone: operationalStagePresentation(normalized).tone,
      icon: "waiting",
    };
  }

  if (["IN_PROGRESS", "PROCESSING", "ACTIVE"].includes(normalized)) {
    return {
      label: "Đang xử lý",
      detail: "Đang xử lý",
      tone: operationalStagePresentation(normalized).tone,
      icon: "waiting",
    };
  }

  if (normalized === "READY") {
    return {
      label: displayLabel || "Sẵn sàng",
      detail: "Sẵn sàng xử lý",
      tone: operationalStagePresentation(normalized).tone,
      icon: "neutral",
    };
  }

  if (["NEW", "TODO", "PENDING"].includes(normalized)) {
    return {
      label: "Chưa xử lý",
      detail: "Chờ bắt đầu",
      tone: operationalStagePresentation(normalized).tone,
      icon: "neutral",
    };
  }

  return {
    label: displayLabel || "Chưa xử lý",
    detail: "Chưa xử lý",
    tone: "slate",
    icon: "neutral",
  };
}

export function WorkflowStatusSignal({
  status,
  label,
  completedIcon,
  compact = false,
  marker = false,
}: {
  status?: string | null;
  label?: string | null;
  completedIcon?: VisualStatusIcon;
  compact?: boolean;
  marker?: boolean;
}) {
  const presentation = workflowStatusPresentation(status, label, completedIcon);
  if (compact) return <span className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium leading-4 text-slate-600" title={[presentation.label, presentation.detail].filter(Boolean).join(" · ")}>
    {marker && <span aria-hidden="true" className="shrink-0 rounded-full" style={{ width: F.badge.dotSize, height: F.badge.dotSize, backgroundColor: ({ slate: F.colors.neutralDot, blue: F.colors.focusLabel, emerald: F.colors.successDot, amber: F.colors.attentionDot, rose: F.colors.dangerDot, violet: F.colors.focusLabel })[presentation.tone] }} />}
    <span className="truncate">{presentation.label}</span>
  </span>;


  return (
    <VisualStatusSignal
      label={presentation.label}
      detail={presentation.detail}
      tone={presentation.tone}
      icon={presentation.icon}
    />
  );
}
