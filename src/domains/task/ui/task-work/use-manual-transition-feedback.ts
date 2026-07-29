"use client";

import { useAppProgress, type AppProgressStep } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  manualTransitionActionLabel,
  manualTransitionErrorFeedback,
  manualTransitionSuccessFeedback,
} from "./manual-transition-feedback";

type Transition = Parameters<typeof manualTransitionActionLabel>[0];
type Item = {
  id: string;
  label?: string | null;
};

function resultSteps(
  items: Item[],
  results: Array<{ bindingId: string; ok: boolean; reason?: string }>,
): AppProgressStep[] {
  const byId = new Map(results.map((result) => [result.bindingId, result]));
  return items.map((item) => {
    const result = byId.get(item.id);
    return {
      id: item.id,
      label: item.label || "Item",
      detail: result?.ok ? "Đã cập nhật và đồng bộ danh sách." : result?.reason || "Không thể thực hiện.",
      status: result?.ok ? "done" : "error",
    };
  });
}

export function useManualTransitionFeedback() {
  const appProgress = useAppProgress();
  const notify = useNotify();

  function begin(transition: Transition, items: Item[]) {
    const actionLabel = manualTransitionActionLabel(transition);
    appProgress.show({
      title: `Đang ${actionLabel.toLocaleLowerCase("vi")}`,
      message: `Đang xử lý ${items.length} item. Vui lòng chờ kết quả từ workflow.`,
      percent: 0,
      steps: items.map((item) => ({
        id: item.id,
        label: item.label || "Item",
        detail: "Đang chờ workflow xử lý.",
        status: "running",
      })),
    });
  }

  function success(
    transition: Transition,
    item: Item,
    outcome?: { toState?: string | null } | null,
  ) {
    appProgress.update({
      title: `${manualTransitionActionLabel(transition)} thành công`,
      message: "Workflow đã hoàn tất và danh sách đang được đồng bộ.",
      percent: 100,
      steps: [{
        id: item.id,
        label: item.label || "Item",
        detail: "Đã cập nhật và đồng bộ danh sách.",
        status: "done",
      }],
    });
    notify.success(manualTransitionSuccessFeedback({
      itemLabel: item.label,
      transition,
      outcome,
    }));
    window.setTimeout(() => appProgress.hide(), 1200);
  }

  function failure(transition: Transition, item: Item, message: string) {
    appProgress.update({
      title: `Không thể ${manualTransitionActionLabel(transition).toLocaleLowerCase("vi")}`,
      message,
      percent: 100,
      steps: [{
        id: item.id,
        label: item.label || "Item",
        detail: message,
        status: "error",
      }],
    });
    notify.error(manualTransitionErrorFeedback(transition, message));
    window.setTimeout(() => appProgress.hide(), 3000);
  }

  function bulkResult(
    transition: Transition,
    items: Item[],
    results: Array<{ bindingId: string; ok: boolean; reason?: string }>,
  ) {
    const applied = results.filter((result) => result.ok).length;
    const failed = results.length - applied;
    const summary = failed
      ? `Đã xử lý ${applied}/${results.length} item; ${failed} item lỗi vẫn được giữ lại.`
      : `Đã xử lý thành công ${applied} item và đồng bộ danh sách.`;

    appProgress.update({
      title: failed ? "Hoàn tất một phần" : `${manualTransitionActionLabel(transition)} thành công`,
      message: summary,
      percent: 100,
      steps: resultSteps(items, results),
    });
    if (failed) {
      notify.warning({ title: "Hoàn tất một phần", message: summary });
    } else {
      notify.success({ title: `${manualTransitionActionLabel(transition)} thành công`, message: summary });
    }
    window.setTimeout(() => appProgress.hide(), failed ? 3000 : 1400);
  }

  return { begin, success, failure, bulkResult };
}
