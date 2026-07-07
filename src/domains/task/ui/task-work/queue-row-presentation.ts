export type QueueRowProgress = {
  profile: boolean;
  content: boolean;
  image: boolean;
  completed: number;
  total: number;
  updatedAt?: string | null;
} | null;

export type QueueRowTransition = {
  actionKey: string;
  label?: string | null;
  manualActionLabel?: string | null;
  enabled: boolean;
  reason: string | null;
  metadata?: unknown;
};

export type QueueRowItem = {
  status: string;
  targetType?: string | null;
  latestActivityTitle?: string | null;
  mediaWorkProgress?: QueueRowProgress;
};

type ResolveQueueRowPresentationInput<TAction extends QueueRowTransition> = {
  queueItem: QueueRowItem;
  workflowActions: TAction[];
  workspace: {
    workTypeKey?: string | null;
    flowKey?: string | null;
  };
  isOpenTargetAction: (action: TAction) => boolean;
};

export type QueueRowDisplayMode = "ACTIVE";

export type QueueRowStatus = {
  value: string;
  source: "queue" | "activity-signal";
  reason: string | null;
};

export type QueueRowProgressBadge = {
  label: string;
  title: string | null;
};

export type QueueRowNextStep<TAction extends QueueRowTransition> = {
  primaryAction: TAction | null;
  secondaryActions: TAction[];
};

export type QueueRowPresentation<TAction extends QueueRowTransition> = {
  displayMode: QueueRowDisplayMode;
  status: QueueRowStatus;
  latestActivityLabel: string;
  progress: QueueRowProgress;
  progressLabel: string | null;
  progressBadge: QueueRowProgressBadge | null;
  nextStep: QueueRowNextStep<TAction>;
};

export function mediaProgressLabel(progress?: QueueRowProgress) {
  if (!progress) return null;

  const parts = [
    progress.profile ? "Thông tin" : null,
    progress.content ? "Content" : null,
    progress.image ? "Hình ảnh" : null,
  ].filter(Boolean);

  return `${progress.completed}/${progress.total}${
    parts.length ? ` - ${parts.join(", ")}` : ""
  }`;
}

function progressBadge(progress?: QueueRowProgress): QueueRowProgressBadge | null {
  if (!progress) return null;

  return {
    label: `${progress.completed}/${progress.total}`,
    title: mediaProgressLabel(progress),
  };
}

export function shouldShowMediaWorkProgress(workspaceWorkTypeKey?: string | null) {
  return workspaceWorkTypeKey === "media-processing";
}

function isMediaReworkSignal(queueItem: QueueRowItem) {
  const latest = String(queueItem.latestActivityTitle ?? "").toLowerCase();

  return latest.includes("unapproved") || latest.includes("recalled");
}

function resolveQueueRowStatus(
  queueItem: QueueRowItem,
  workspaceWorkTypeKey?: string | null,
): QueueRowStatus {
  if (
    workspaceWorkTypeKey === "media-processing" &&
    queueItem.targetType === "WATCH" &&
    isMediaReworkSignal(queueItem)
  ) {
    return {
      value: "FEEDBACK",
      source: "activity-signal",
      reason: "Latest media activity indicates rework.",
    };
  }

  return {
    value: queueItem.status,
    source: "queue",
    reason: null,
  };
}

export function queueLatestActivityLabel(
  queueItem: QueueRowItem,
  workspaceWorkTypeKey?: string | null,
) {
  const title = String(queueItem.latestActivityTitle ?? "").trim();
  const progress = shouldShowMediaWorkProgress(workspaceWorkTypeKey)
    ? mediaProgressLabel(queueItem.mediaWorkProgress)
    : null;

  if (/^media work saved/i.test(title)) {
    return progress ? `Đã lưu xử lý dở ${progress}` : "Đã lưu xử lý dở";
  }

  return title || "-";
}

export function splitWorkflowActions<TAction extends QueueRowTransition>(
  actions: TAction[],
  workspaceWorkTypeKey: string | null | undefined,
  isOpenTargetAction: (action: TAction) => boolean,
) {
  if (!actions.length) return { primary: null, secondary: [] as TAction[] };

  if (workspaceWorkTypeKey === "publish") {
    const primary = actions.find((action) => !isOpenTargetAction(action)) ?? actions[0];

    return {
      primary,
      secondary: actions.filter((action) => action !== primary),
    };
  }

  return {
    primary: actions[0],
    secondary: actions.slice(1),
  };
}

export function resolveQueueRowPresentation<TAction extends QueueRowTransition>({
  queueItem,
  workflowActions,
  workspace,
  isOpenTargetAction,
}: ResolveQueueRowPresentationInput<TAction>): QueueRowPresentation<TAction> {
  const workspaceWorkTypeKey = workspace.workTypeKey;
  const showProgress = shouldShowMediaWorkProgress(workspaceWorkTypeKey);
  const scopedProgress = showProgress ? queueItem.mediaWorkProgress ?? null : null;
  const actions = splitWorkflowActions(
    workflowActions,
    workspaceWorkTypeKey,
    isOpenTargetAction,
  );

  return {
    displayMode: "ACTIVE",
    status: resolveQueueRowStatus(queueItem, workspaceWorkTypeKey),
    latestActivityLabel: queueLatestActivityLabel(queueItem, workspaceWorkTypeKey),
    progress: scopedProgress,
    progressLabel: mediaProgressLabel(scopedProgress),
    progressBadge: progressBadge(scopedProgress),
    nextStep: {
      primaryAction: actions.primary,
      secondaryActions: actions.secondary,
    },
  };
}
