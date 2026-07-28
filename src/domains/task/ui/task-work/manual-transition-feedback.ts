import type { TaskItemQueueTransition } from "./QueueWorkQueue";

type Transition = Pick<
  TaskItemQueueTransition,
  "actionKey" | "label" | "manualActionLabel" | "toState"
>;

function clean(value?: string | null) {
  return String(value ?? "").trim();
}

export function manualTransitionActionLabel(transition: Transition) {
  if (clean(transition.actionKey) === "mark-posted") return "Xác nhận đã đăng";
  return clean(transition.manualActionLabel) || clean(transition.label) || "Thao tác";
}

export function manualTransitionMovesOutOfCurrentStage(transition: Transition) {
  return clean(transition.toState).toUpperCase() === "DONE";
}

export function manualTransitionSuccessFeedback(input: {
  itemLabel?: string | null;
  transition: Transition;
}) {
  const actionLabel = manualTransitionActionLabel(input.transition);
  const subject = clean(input.itemLabel) || "Item";

  return {
    title: `${actionLabel} thành công`,
    message: manualTransitionMovesOutOfCurrentStage(input.transition)
      ? `${subject} đã hoàn tất bước hiện tại và được chuyển sang bước tiếp theo.`
      : `${subject} đã được cập nhật trạng thái.`,
  };
}

export function manualTransitionErrorFeedback(
  transition: Transition,
  message: string,
) {
  return {
    title: `Không thể ${manualTransitionActionLabel(transition).toLocaleLowerCase("vi")}`,
    message,
  };
}
