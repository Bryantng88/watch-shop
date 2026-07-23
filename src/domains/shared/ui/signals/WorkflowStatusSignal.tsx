import {
  VisualStatusSignal,
  type VisualStatusIcon,
  type VisualStatusTone,
} from "./VisualStatusSignal";

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

  if (["DONE", "COMPLETED", "APPROVED", "PUBLISHED"].includes(normalized)) {
    return {
      label: "Đã hoàn tất",
      detail: "Đã hoàn tất",
      tone: "emerald",
      icon: completedIcon,
    };
  }

  if (["RETURNED", "FEEDBACK", "NEEDS_REWORK", "REJECTED"].includes(normalized)) {
    return {
      label: "Cần xử lý lại",
      detail: "Cần xử lý lại",
      tone: "amber",
      icon: "warning",
    };
  }

  if (["REVIEW", "PENDING_REVIEW", "WAITING_REVIEW"].includes(normalized)) {
    return {
      label: "Chờ duyệt",
      detail: "Đang chờ duyệt",
      tone: "blue",
      icon: "waiting",
    };
  }

  if (["IN_PROGRESS", "PROCESSING", "ACTIVE"].includes(normalized)) {
    return {
      label: "Đang xử lý",
      detail: "Đang xử lý",
      tone: "blue",
      icon: "waiting",
    };
  }

  if (["NEW", "TODO", "PENDING", "READY"].includes(normalized)) {
    return {
      label: "Chưa xử lý",
      detail: "Chờ bắt đầu",
      tone: "slate",
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
}: {
  status?: string | null;
  label?: string | null;
  completedIcon?: VisualStatusIcon;
}) {
  const presentation = workflowStatusPresentation(status, label, completedIcon);

  return (
    <VisualStatusSignal
      label={presentation.label}
      detail={presentation.detail}
      tone={presentation.tone}
      icon={presentation.icon}
    />
  );
}
