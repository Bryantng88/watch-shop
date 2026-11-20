"use client";
import { useRef } from "react";
import { AdminRowActionMenu } from "@/domains/shared/ui/admin-design-contract/AdminRowActionMenu";
import { OpenTargetAction, isOpenTargetTransition, type TaskItemQueueItem } from "@/domains/task/ui/task-work/QueueWorkQueue";
import { manualTransitionActionLabel } from "@/domains/task/ui/task-work/manual-transition-feedback";
import type { CoordinationFlowListItemDTO } from "../server/coordination-dashboard.types";

/** Editor launchers stay mounted so closing the menu never discards editor state. */
export function MediaRowActions({ item, actions, status, disabled, onActivate, onReloadRequested, onTransitionApplied, onAction }: {
  item: CoordinationFlowListItemDTO;
  actions: CoordinationFlowListItemDTO["manualTransitions"];
  status: React.ReactNode;
  disabled: boolean;
  onActivate: () => void;
  onReloadRequested?: () => void | Promise<void>;
  onTransitionApplied: NonNullable<React.ComponentProps<typeof OpenTargetAction>["onTransitionApplied"]>;
  onAction: (action: CoordinationFlowListItemDTO["manualTransitions"][number]) => void;
}) {
  const launchers = useRef(new Map<string, () => void>());
  return <>
    {actions.filter(isOpenTargetTransition).map(action => <OpenTargetAction key={action.actionKey}
      showIcon={false} className="hidden" queueItem={item as TaskItemQueueItem} transition={action}
      triggerRef={activate => { if (activate) launchers.current.set(action.actionKey, activate); else launchers.current.delete(action.actionKey); }}
      onActivate={onActivate} onRefreshRequested={onReloadRequested} onTransitionApplied={onTransitionApplied} />)}
    <AdminRowActionMenu label={`Xử lý: ${item.preview.title || item.preview.ref || "Media"}`} status={status} disabled={disabled}
      actions={actions.map(action => ({ key: action.actionKey, label: manualTransitionActionLabel(action), onSelect: () => {
        if (isOpenTargetTransition(action)) launchers.current.get(action.actionKey)?.(); else onAction(action);
      } }))} />
  </>;
}
