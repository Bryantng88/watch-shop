"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  ChevronRight,
  Activity,
  MoreHorizontal,
  X,
} from "lucide-react";
import type { CoordinationFlowListItemDTO } from "../server/coordination-dashboard.types";
import { cn } from "@/lib/utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { WorkflowStatusSignal } from "@/domains/shared/ui/signals";
import {
  applyQueueItemManualTransitionsAction,
  submitOperationalBlueprintActionAction,
} from "@/domains/task/actions/task.actions";
import {
  isOpenTargetTransition,
  OpenTargetAction,
  QueueItemThumbnail,
  type TaskItemQueueItem,
} from "@/domains/task/ui/task-work/QueueWorkQueue";
import { PAYMENT_PURPOSE_LABEL } from "@/domains/payment/shared/payment.constants";
import type { TaskItemActivityViewModel } from "@/domains/task/server/activity";
import {
  manualTransitionActionLabel,
  manualTransitionOutcomeMovesOutOfCurrentStage,
} from "@/domains/task/ui/task-work/manual-transition-feedback";
import { useManualTransitionFeedback } from "@/domains/task/ui/task-work/use-manual-transition-feedback";
import { PostTargetChip } from "@/domains/shared/ui/post-target/PostTargetChip";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { ResponsiveSelectionCheckbox } from "@/domains/shared/ui/selection/ResponsiveSelectionCheckbox";

type FlowStage = {
  key: string;
  label: string;
  workspaceKey: string;
  sortOrder: number;
};

type Props = {
  items: CoordinationFlowListItemDTO[];
  stages: FlowStage[];
  query: string;
  statusFilter: string;
  paymentFilter: string;
  activeStage: string;
  imageOverrides?: Record<string, string | null>;
  pending?: boolean;
  completedIcon?: "success" | "published";
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onItemsMovedFromStage?: (input: {
    itemIds: string[];
    fromStageKey: string;
    toStageKey?: string;
  }) => void;
  onReloadRequested?: () => void | Promise<void>;
};

type OperationalActionField = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "select" | "multiselect" | "money" | "number" | "boolean" | "date";
  required: boolean;
  options?: Array<{ value: string; label: string }>;
};

type OperationalActionForm = {
  key: string;
  label: string;
  description?: string | null;
  fields: OperationalActionField[];
  initialFields: Record<string, string>;
};

function operationalActionFromMetadata(metadata: unknown): OperationalActionForm | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const candidate = (metadata as Record<string, unknown>).operationalBlueprintAction;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
  const action = candidate as Record<string, unknown>;
  const initialFieldsCandidate =
    (metadata as Record<string, unknown>).operationalInitialFields;
  const initialFields =
    initialFieldsCandidate &&
    typeof initialFieldsCandidate === "object" &&
    !Array.isArray(initialFieldsCandidate)
      ? Object.fromEntries(
          Object.entries(initialFieldsCandidate).map(([fieldKey, value]) => [
            fieldKey,
            value == null ? "" : String(value),
          ]),
        )
      : {};
  const key = String(action.key ?? "").trim();
  if (!key) return null;
  return {
    key,
    label: String(action.label ?? key),
    description: action.description ? String(action.description) : null,
    fields: Array.isArray(action.fields)
      ? action.fields.filter(
          (field): field is OperationalActionField =>
            Boolean(field) && typeof field === "object" && !Array.isArray(field),
        )
      : [],
    initialFields,
  };
}

function normalize(value?: string | null) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function paymentDirection(direction?: string | null) {
  return String(direction ?? "").toUpperCase() === "OUT"
    ? { label: "Chi", sign: "-", className: "bg-rose-50 text-rose-700 ring-rose-200" }
    : { label: "Thu", sign: "+", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
}

function paymentPurpose(purpose?: string | null) {
  const key = String(purpose ?? "").toUpperCase();
  return PAYMENT_PURPOSE_LABEL[key] ?? (
    key === "MAINTENANCE_COST"
      ? "Chi phí bảo trì"
      : key === "SERVICE_FEE"
        ? "Phí dịch vụ"
        : key === "ACQUISITION_DEPOSIT"
          ? "Cọc thu mua"
          : key === "ACQUISITION_REMAIN"
            ? "Còn lại thu mua"
            : key === "ACQUISITION_FULL"
              ? "Toàn bộ thu mua"
              : key || "Khác"
  );
}

function paymentOwnerLabel(ownerType?: string | null) {
  const key = String(ownerType ?? "").toUpperCase();
  if (key === "ORDER") return "Khách hàng";
  if (key === "ACQUISITION") return "Vendor";
  if (key === "TECHNICAL_ISSUE" || key === "SERVICE_REQUEST" || key === "SERVICE") {
    return "Đối tác dịch vụ";
  }
  return "Đối tượng";
}

function formatMoney(amount: number, currency: string, sign = "") {
  const value = Math.round(Number(amount) || 0).toLocaleString("vi-VN");
  return currency === "VND" ? `${sign}${value}đ` : `${sign}${value} ${currency}`;
}

function itemStatus(item: CoordinationFlowListItemDTO) {
  if (item.isWorkflowDone || item.status === "DONE") return "DONE";
  if (item.status === "FEEDBACK" || item.status === "RETURNED") return "FEEDBACK";
  return "OPEN";
}

function UserAvatar({
  label,
  avatarUrl,
  isSystem = false,
}: {
  label: string;
  avatarUrl?: string | null;
  isSystem?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = avatarUrl
    ? resolveMediaPreviewSrc(avatarUrl) ?? avatarUrl
    : null;
  const fallback = isSystem ? "S" : label.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-[10px] font-bold text-white">
      {imageSrc && !imageFailed ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="28px"
          unoptimized
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : fallback}
    </span>
  );
}

export default function FlowItemListView({
  items,
  stages,
  query,
  statusFilter,
  paymentFilter,
  activeStage,
  imageOverrides = {},
  pending = false,
  completedIcon,
  pagination,
  onPageChange,
  onItemsMovedFromStage,
  onReloadRequested,
}: Props) {
  const progress = useAppProgress();
  const transitionFeedback = useManualTransitionFeedback();
  const [isActionPending, startActionTransition] = useTransition();
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [optimisticallyMovedIds, setOptimisticallyMovedIds] = useState<string[]>([]);
  const [reconcileItem, setReconcileItem] = useState<CoordinationFlowListItemDTO | null>(null);
  const [isBulkReconcileOpen, setIsBulkReconcileOpen] = useState(false);
  const [activityTarget, setActivityTarget] =
    useState<CoordinationFlowListItemDTO | null>(null);
  const [activityItems, setActivityItems] = useState<TaskItemActivityViewModel[]>([]);
  const [activityPagination, setActivityPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [operationalAction, setOperationalAction] = useState<{
    item: CoordinationFlowListItemDTO;
    action: OperationalActionForm;
  } | null>(null);
  const [operationalFields, setOperationalFields] = useState<Record<string, string>>({});
  const [bulkReconcileAmounts, setBulkReconcileAmounts] = useState<Record<string, string>>({});
  const [bulkReconcileFields, setBulkReconcileFields] = useState({
    method: "BANK_TRANSFER",
    occurredAt: new Date().toISOString().slice(0, 10),
    transactionReference: "",
    reviewNote: "",
  });
  useEffect(() => {
    const authoritativeIds = new Set(items.map((item) => item.id));
    setOptimisticallyMovedIds((current) =>
      current.filter((id) => authoritativeIds.has(id)),
    );
    setSelectedIds((current) => current.filter((id) => authoritativeIds.has(id)));
  }, [items]);
  useEffect(() => {
    setActionError(null);
  }, [activeStage]);
  const [reconcileFields, setReconcileFields] = useState({
    reviewedAmount: "",
    method: "BANK_TRANSFER",
    occurredAt: new Date().toISOString().slice(0, 10),
    transactionReference: "",
    counterparty: "",
    contact: "",
    reviewNote: "",
  });
  const stageByKey = useMemo(() => new Map(
    stages.flatMap((stage) => [
      [normalize(stage.key), stage],
      [normalize(stage.workspaceKey), stage],
    ]),
  ), [stages]);
  const showPaymentAmount = items.some((item) => Boolean(item.payment));
  const showStatusColumn =
    !showPaymentAmount && !normalize(activeStage).includes("photography");
  const showProgressColumn = normalize(activeStage).includes("media-processing");
  const showPublishChannels = normalize(activeStage).includes("publish");
  const showReshootNote = normalize(activeStage).includes("photography");
  const visibleItems = useMemo(() => {
    const cleanQuery = query.trim().toLocaleLowerCase("vi");
    return items.filter((item) => {
      if (optimisticallyMovedIds.includes(item.id)) return false;
      const stage = stageByKey.get(normalize(item.flowStageKey));
      if (activeStage !== "ALL" && stage?.key !== activeStage) return false;
      if (statusFilter !== "ALL" && itemStatus(item) !== statusFilter) return false;
      const paymentStatus = item.payment?.status ?? "NONE";
      if (paymentFilter === "UNPAID" && !["UNPAID", "PARTIAL"].includes(paymentStatus)) return false;
      if (paymentFilter === "PAID" && paymentStatus !== "PAID") return false;
      if (paymentFilter === "NONE" && item.payment) return false;
      if (!cleanQuery) return true;
      return [
        item.preview.title,
        item.preview.ref,
        item.preview.status,
        item.currentWorkflowStateLabel,
        item.payment?.counterparty,
        item.payment?.ownerRef,
        item.payment ? paymentDirection(item.payment.direction).label : null,
        item.payment ? paymentPurpose(item.payment.purpose) : null,
      ].filter(Boolean).join(" ").toLocaleLowerCase("vi").includes(cleanQuery);
    });
  }, [activeStage, items, optimisticallyMovedIds, paymentFilter, query, stageByKey, statusFilter]);
  const visibleIds = visibleItems.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const selectedItems = items.filter(
    (item) =>
      selectedIds.includes(item.id) &&
      !optimisticallyMovedIds.includes(item.id),
  );
  const selectedPaymentItems = selectedItems.filter(
    (item) => item.payment && !["PAID", "COLLECTED", "CANCELED", "CANCELLED"].includes(item.payment.status),
  );
  const commonActions = selectedItems.length
    ? selectedItems[0].manualTransitions.filter(
        (transition) =>
          transition.enabled &&
          !isOpenTargetTransition(transition) &&
          selectedItems.every((item) =>
            item.manualTransitions.some(
              (candidate) =>
                candidate.enabled &&
                !isOpenTargetTransition(candidate) &&
                candidate.actionKey === transition.actionKey,
            ),
          ),
      )
    : [];
  const reconciliationIsIncome =
    String(reconcileItem?.payment?.direction ?? "").toUpperCase() !== "OUT";
  const reconciliationExpectedAmount = Number(reconcileItem?.payment?.amount ?? 0);
  const reconciliationReviewedAmount = Number(reconcileFields.reviewedAmount || 0);
  const reconciliationIsSplit =
    reconciliationReviewedAmount < reconciliationExpectedAmount;
  const bulkAllIncome =
    selectedPaymentItems.length > 0 &&
    selectedPaymentItems.every(
      (item) => String(item.payment?.direction ?? "").toUpperCase() !== "OUT",
    );
  const bulkAllExpense =
    selectedPaymentItems.length > 0 &&
    selectedPaymentItems.every(
      (item) => String(item.payment?.direction ?? "").toUpperCase() === "OUT",
    );
  const bulkExpectedTotal = selectedPaymentItems.reduce(
    (total, item) => total + Number(item.payment?.amount ?? 0),
    0,
  );
  const bulkReviewedTotal = selectedPaymentItems.reduce(
    (total, item) => total + Number(bulkReconcileAmounts[item.id] ?? 0),
    0,
  );
  const bulkRemainingTotal = Math.max(0, bulkExpectedTotal - bulkReviewedTotal);
  const bulkCurrency = selectedPaymentItems[0]?.payment?.currency ?? "VND";

  async function loadActivityPage(
    item: CoordinationFlowListItemDTO,
    page: number,
  ) {
    setActivityTarget(item);
    setActivityLoading(true);
    setActivityError(null);
    try {
      const params = new URLSearchParams({
        targetType: item.targetType,
        targetId: item.targetId,
        page: String(page),
        pageSize: "10",
      });
      const response = await fetch(
        `/api/admin/coordination/operation/activity?${params.toString()}`,
        { cache: "no-store" },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Không thể tải hoạt động.");
      setActivityItems(Array.isArray(result?.items) ? result.items : []);
      if (result?.pagination) setActivityPagination(result.pagination);
    } catch (error) {
      setActivityError(
        error instanceof Error ? error.message : "Không thể tải hoạt động.",
      );
    } finally {
      setActivityLoading(false);
    }
  }

  function runAction(
    item: CoordinationFlowListItemDTO,
    transition: CoordinationFlowListItemDTO["manualTransitions"][number],
  ) {
    const actionKey = transition.actionKey;
    const feedbackItem = {
      id: item.id,
      label: item.preview.title || item.preview.ref,
    };
    setActionError(null);
    setPendingActionId(item.id);
    transitionFeedback.begin(transition, [feedbackItem]);
    startActionTransition(async () => {
      try {
        const response = await fetch("/api/admin/task-items/manual-transition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bindingId: item.id, actionKey }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(result?.error ?? "Không thể thực hiện action.");
        }
        if (!result?.result?.applied) {
          throw new Error(result?.result?.reason ?? "Không thể thực hiện action.");
        }
        const movedOut = manualTransitionOutcomeMovesOutOfCurrentStage(result?.result);
        if (movedOut) {
          setOptimisticallyMovedIds((current) => [...current, item.id]);
          onItemsMovedFromStage?.({
            itemIds: [item.id],
            fromStageKey: item.flowStageKey || activeStage,
          });
        }
        transitionFeedback.success(transition, feedbackItem, result?.result);
        if (!movedOut) void onReloadRequested?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Không thể cập nhật workflow.";
        setActionError(message);
        transitionFeedback.failure(transition, feedbackItem, message);
      } finally {
        setPendingActionId(null);
      }
    });
  }

  function reconcileModalTransition(
    item: CoordinationFlowListItemDTO,
    outcome: { fromStageKey?: string; toStageKey?: string },
  ) {
    const fromStageKey = outcome.fromStageKey || item.flowStageKey || activeStage;
    const movedOut =
      Boolean(outcome.toStageKey) &&
      normalize(outcome.toStageKey) !== normalize(fromStageKey);

    if (!movedOut) return;

    setOptimisticallyMovedIds((current) =>
      current.includes(item.id) ? current : [...current, item.id],
    );
    setSelectedIds((current) => current.filter((id) => id !== item.id));
    onItemsMovedFromStage?.({
      itemIds: [item.id],
      fromStageKey,
      toStageKey: outcome.toStageKey,
    });
  }

  function openOperationalAction(
    item: CoordinationFlowListItemDTO,
    action: OperationalActionForm,
  ) {
    setActionError(null);
    setOperationalFields(Object.fromEntries(
      action.fields.map((field) => [
        field.key,
        action.initialFields[field.key] ??
          (field.kind === "select" ? field.options?.[0]?.value ?? "" : ""),
      ]),
    ));
    setOperationalAction({ item, action });
  }

  function submitOperationalAction() {
    if (!operationalAction) return;
    const missing = operationalAction.action.fields.find(
      (field) => field.required && !String(operationalFields[field.key] ?? "").trim(),
    );
    if (missing) {
      setActionError(`Vui lòng nhập ${missing.label}.`);
      return;
    }
    setActionError(null);
    setPendingActionId(operationalAction.item.id);
    progress.show({
      title: `Đang ${operationalAction.action.label.toLocaleLowerCase("vi")}`,
      message:
        operationalAction.item.preview.title ??
        operationalAction.item.preview.ref ??
        operationalAction.item.targetId,
      percent: 20,
    });
    startActionTransition(async () => {
      try {
        await submitOperationalBlueprintActionAction({
          taskItemId: operationalAction.item.taskItemId,
          actionKey: operationalAction.action.key,
          targetType: operationalAction.item.targetType,
          targetId: operationalAction.item.targetId,
          fields: operationalFields,
        });
        progress.update({
          percent: 85,
          message: "Đã xử lý nghiệp vụ, đang đồng bộ danh sách và trạng thái.",
        });
        setOperationalAction(null);
        setOperationalFields({});
        await onReloadRequested?.();
        progress.update({ percent: 100, message: "Đã hoàn tất." });
        window.setTimeout(() => progress.hide(), 700);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể thực hiện thao tác vận chuyển.";
        setActionError(message);
        progress.update({ message });
        window.setTimeout(() => progress.hide(), 1400);
      } finally {
        setPendingActionId(null);
      }
    });
  }

  function runBulkAction(actionKey: string) {
    const transition = commonActions.find((candidate) => candidate.actionKey === actionKey);
    if (!transition) return;
    const feedbackItems = selectedItems.map((item) => ({
      id: item.id,
      label: item.preview.title || item.preview.ref,
    }));
    setActionError(null);
    setPendingActionId("BULK");
    transitionFeedback.begin(transition, feedbackItems);
    startActionTransition(async () => {
      try {
        const result = await applyQueueItemManualTransitionsAction({
          items: selectedItems.map((item) => ({
            bindingId: item.id,
            actionKey,
          })),
        });
        const movedIds = result.results
          .filter((entry) =>
            entry.ok && manualTransitionOutcomeMovesOutOfCurrentStage(entry)
          )
          .map((entry) => entry.bindingId);
        const succeededIds = result.results
          .filter((entry) => entry.ok)
          .map((entry) => entry.bindingId);
        if (movedIds.length) {
          setOptimisticallyMovedIds((current) => [...current, ...movedIds]);
          onItemsMovedFromStage?.({
            itemIds: movedIds,
            fromStageKey: activeStage,
          });
        }
        setSelectedIds((current) => current.filter((id) => !succeededIds.includes(id)));
        transitionFeedback.bulkResult(transition, feedbackItems, result.results);
        if (!result.ok) {
          const labels = new Map(feedbackItems.map((item) => [item.id, item.label]));
          const failureDetails = result.results
            .filter((entry) => !entry.ok)
            .map((entry) =>
              `${labels.get(entry.bindingId) || entry.bindingId}: ${entry.reason || "Không thể thực hiện transition"}`
            );
          setActionError(
            `Đã xử lý ${result.applied}/${result.results.length} item. Lỗi: ${failureDetails.join("; ")}`,
          );
        }
        if (movedIds.length !== succeededIds.length) {
          void onReloadRequested?.();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Không thể cập nhật các item.";
        setActionError(message);
        transitionFeedback.failure(transition, { id: "BULK", label: `${feedbackItems.length} item` }, message);
      } finally {
        setPendingActionId(null);
      }
    });
  }

  function openReconcileModal(item: CoordinationFlowListItemDTO) {
    if (!item.payment) return;
    setActionError(null);
    setReconcileFields({
      reviewedAmount: String(item.payment.amount),
      method: item.payment.method ?? "BANK_TRANSFER",
      occurredAt: new Date().toISOString().slice(0, 10),
      transactionReference: "",
      counterparty: item.payment.counterparty ?? item.payment.ownerRef ?? "",
      contact: item.payment.contact ?? "",
      reviewNote: "",
    });
    setReconcileItem(item);
  }

  function submitReconciliation() {
    if (!reconcileItem?.payment || isActionPending) return;
    const expectedAmount = Number(reconcileItem.payment.amount);
    const reviewedAmount = Number(reconcileFields.reviewedAmount);
    if (!Number.isFinite(reviewedAmount) || reviewedAmount <= 0) {
      setActionError("Số tiền thực tế phải lớn hơn 0.");
      return;
    }
    if (reviewedAmount > expectedAmount) {
      setActionError("Số tiền thực tế lớn hơn dự kiến. Vui lòng xử lý khoản thừa riêng.");
      return;
    }
    const reconciliationResult = reviewedAmount < expectedAmount ? "PARTIAL" : "MATCHED";
    if (!reconcileFields.method || !reconcileFields.occurredAt || !reconcileFields.counterparty.trim()) {
      setActionError("Vui lòng nhập đủ phương thức, ngày giao dịch và đối tượng.");
      return;
    }
    if (reconciliationResult === "PARTIAL" && !reconcileFields.reviewNote.trim()) {
      setActionError("Vui lòng ghi chú lý do split Payment.");
      return;
    }

    setPendingActionId(reconcileItem.id);
    setActionError(null);
    progress.show({
      title: "Đang đối soát Payment",
      message: `${reconcileItem.preview.title ?? reconcileItem.targetId} · ${new Intl.NumberFormat("vi-VN").format(reviewedAmount)} VND`,
      percent: 25,
    });
    startActionTransition(async () => {
      try {
        await submitOperationalBlueprintActionAction({
          taskItemId: reconcileItem.taskItemId,
          actionKey: "reconcile_payment",
          targetType: "PAYMENT",
          targetId: reconcileItem.targetId,
          fields: {
            ...reconcileFields,
            reviewedAmount: String(reviewedAmount),
            reconciliationResult,
          },
        });
        setOptimisticallyMovedIds((current) => [...current, reconcileItem.id]);
        setSelectedIds((current) => current.filter((id) => id !== reconcileItem.id));
        onItemsMovedFromStage?.({
          itemIds: [reconcileItem.id],
          fromStageKey: reconcileItem.flowStageKey || activeStage,
          toStageKey: stages.find((stage) =>
            normalize(stage.key).includes("settled") ||
            normalize(stage.workspaceKey).includes("settled")
          )?.key,
        });
        setReconcileItem(null);
        progress.update({
          percent: 90,
          message: "Đã ghi nhận thanh toán, đang đồng bộ sang bước hoàn tất.",
        });
        window.setTimeout(() => progress.hide(), 900);
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Không thể xác nhận đối soát.");
      } finally {
        setPendingActionId(null);
        window.setTimeout(() => progress.hide(), 1500);
      }
    });
  }

  function openBulkReconcileModal() {
    if (!selectedPaymentItems.length) return;
    setActionError(null);
    setBulkReconcileAmounts(Object.fromEntries(
      selectedPaymentItems.map((item) => [item.id, String(item.payment?.amount ?? 0)]),
    ));
    setBulkReconcileFields({
      method: "BANK_TRANSFER",
      occurredAt: new Date().toISOString().slice(0, 10),
      transactionReference: "",
      reviewNote: "",
    });
    setIsBulkReconcileOpen(true);
  }

  function submitBulkReconciliation() {
    if (!selectedPaymentItems.length || isActionPending) return;
    const invalidItem = selectedPaymentItems.find((item) => {
      const actual = Number(bulkReconcileAmounts[item.id]);
      const expected = Number(item.payment?.amount ?? 0);
      return !Number.isFinite(actual) || actual <= 0 || actual > expected;
    });
    if (invalidItem) {
      setActionError(`Số tiền thực tế của ${invalidItem.preview.title ?? "Payment"} không hợp lệ.`);
      return;
    }
    const hasSplit = selectedPaymentItems.some(
      (item) => Number(bulkReconcileAmounts[item.id]) < Number(item.payment?.amount ?? 0),
    );
    if (!bulkReconcileFields.method || !bulkReconcileFields.occurredAt) {
      setActionError("Vui lòng chọn phương thức và ngày giao dịch.");
      return;
    }
    if (hasSplit && !bulkReconcileFields.reviewNote.trim()) {
      setActionError("Vui lòng ghi chú lý do khi bulk có Payment cần split.");
      return;
    }

    setPendingActionId("BULK_RECONCILE");
    setActionError(null);
    progress.show({
      title: "Đang đối soát Payment hàng loạt",
      message: `Đang xử lý ${selectedPaymentItems.length} khoản thanh toán.`,
      percent: 10,
    });
    startActionTransition(async () => {
      const succeeded: string[] = [];
      const failed: string[] = [];
      for (const [index, item] of selectedPaymentItems.entries()) {
        const reviewedAmount = Number(bulkReconcileAmounts[item.id]);
        const expectedAmount = Number(item.payment?.amount ?? 0);
        try {
          await submitOperationalBlueprintActionAction({
            taskItemId: item.taskItemId,
            actionKey: "reconcile_payment",
            targetType: "PAYMENT",
            targetId: item.targetId,
            fields: {
              reviewedAmount: String(reviewedAmount),
              method: bulkReconcileFields.method,
              occurredAt: bulkReconcileFields.occurredAt,
              transactionReference: bulkReconcileFields.transactionReference,
              counterparty: item.payment?.counterparty ?? item.payment?.ownerRef ?? "Chưa xác định",
              contact: item.payment?.contact ?? "",
              reconciliationResult: reviewedAmount < expectedAmount ? "PARTIAL" : "MATCHED",
              reviewNote: bulkReconcileFields.reviewNote,
            },
          });
          succeeded.push(item.id);
        } catch (error) {
          failed.push(`${item.preview.title ?? item.targetId}: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
        }
        progress.update({
          percent: Math.min(85, 10 + Math.round(((index + 1) / selectedPaymentItems.length) * 75)),
          message: `Đã xử lý ${index + 1}/${selectedPaymentItems.length} khoản thanh toán.`,
        });
      }

      if (succeeded.length) {
        setOptimisticallyMovedIds((current) => [...current, ...succeeded]);
        setSelectedIds((current) => current.filter((id) => !succeeded.includes(id)));
        onItemsMovedFromStage?.({
          itemIds: succeeded,
          fromStageKey: activeStage,
          toStageKey: stages.find((stage) =>
            normalize(stage.key).includes("settled") ||
            normalize(stage.workspaceKey).includes("settled")
          )?.key,
        });
      }
      if (failed.length) {
        setActionError(`Đã xử lý ${succeeded.length}/${selectedPaymentItems.length}. Lỗi: ${failed.join("; ")}`);
      } else {
        setIsBulkReconcileOpen(false);
      }
      progress.update({
        percent: failed.length ? 90 : 95,
        message: failed.length
          ? `Hoàn tất ${succeeded.length}/${selectedPaymentItems.length}; ${failed.length} khoản cần kiểm tra lại.`
          : "Đã đối soát xong, đang đồng bộ dashboard.",
      });
      setPendingActionId(null);
      window.setTimeout(() => progress.hide(), failed.length ? 1800 : 900);
    });
  }

  const hiddenItemsStillInServerPage = items.filter((item) =>
    optimisticallyMovedIds.includes(item.id),
  ).length;
  const effectiveTotal = Math.max(
    0,
    pagination.total - hiddenItemsStillInServerPage,
  );
  const effectiveTotalPages = Math.max(
    1,
    Math.ceil(effectiveTotal / pagination.pageSize),
  );

  return (
    <div className="bg-white">
      {selectedItems.length ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-violet-100 bg-violet-50 px-5 py-3">
          <span className="text-sm font-semibold text-violet-900">Đã chọn {selectedItems.length} item</span>
          {selectedPaymentItems.length ? (
            <button
              type="button"
              disabled={isActionPending}
              onClick={openBulkReconcileModal}
              className="h-8 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
            >
              Đối soát {selectedPaymentItems.length} payment
            </button>
          ) : null}
          {commonActions.slice(0, 2).map((transition) => (
            <button
              key={transition.actionKey}
              type="button"
              disabled={isActionPending}
              onClick={() => runBulkAction(transition.actionKey)}
              className="h-8 rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60"
            >
              {pendingActionId === "BULK" ? "Đang xử lý..." : manualTransitionActionLabel(transition)}
            </button>
          ))}
          {!commonActions.length && !selectedPaymentItems.length ? <span className="text-xs text-violet-600">Các item đã chọn không có action chung.</span> : null}
          <button type="button" onClick={() => setSelectedIds([])} className="ml-auto text-xs font-semibold text-violet-700 hover:text-violet-900">Bỏ chọn</button>
        </div>
      ) : null}
      {actionError ? (
        <div className="border-b border-rose-100 bg-rose-50 px-5 py-2 text-xs font-medium text-rose-700">
          {actionError}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className={cn(
          "w-full border-collapse",
          showPaymentAmount
            ? "min-w-[1080px]"
            : showPublishChannels
              ? "min-w-[1120px]"
              : "min-w-[980px]",
        )}>
          <thead>
            <tr className="border-b border-slate-200 bg-[#fbfcfe] text-left text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">
              <th className="w-12 px-5 py-3">
                <ResponsiveSelectionCheckbox
                  aria-label="Chọn tất cả item đang hiển thị"
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) => setSelectedIds(checked ? Array.from(new Set([...selectedIds, ...visibleIds])) : selectedIds.filter((id) => !visibleIds.includes(id)))}
                />
              </th>
              <th className="px-2 py-3">Item</th>
              {showReshootNote ? <th className="w-80 px-4 py-3">Yêu cầu xử lý</th> : null}
              {showStatusColumn ? <th className="px-4 py-3">Trạng thái</th> : null}
              {showProgressColumn ? <th className="w-40 px-4 py-3">Progress</th> : null}
              {showPublishChannels ? <th className="w-56 px-4 py-3">Kênh đăng</th> : null}
              {showPaymentAmount ? <th className="w-52 px-4 py-3">Đối tượng</th> : null}
              {showPaymentAmount ? <th className="w-44 px-4 py-3">Loại khoản</th> : null}
              {showPaymentAmount ? <th className="w-40 px-4 py-3 text-right">Số tiền</th> : null}
              {!showPaymentAmount ? <th className="w-44 px-4 py-3">Thao tác</th> : null}
              <th className="px-4 py-3">Người thao tác</th>
              <th className="px-4 py-3 text-center">Cập nhật</th>
              <th className="w-64 px-4 py-3">Thao tác cuối</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!pending && visibleItems.map((item) => {
              const stage = stageByKey.get(normalize(item.flowStageKey));
              const href = item.href || `/admin/task-items/${item.taskItemId}`;
              const checked = selectedIds.includes(item.id);
              const imageUrl = imageOverrides[item.targetId] || item.preview.imageUrl;
              const thumbnailItem = imageOverrides[item.targetId]
                ? {
                    ...item,
                    preview: {
                      ...item.preview,
                      imageUrl,
                      imageUrls: imageUrl ? [imageUrl] : [],
                    },
                  }
                : item;
              const enabledActions = item.manualTransitions.filter((transition) => transition.enabled);
              const mediaOpenTransition = item.targetType === "WATCH" && stage?.key === "media-processing"
                ? {
                    actionKey: "open-watch-media",
                    label: "Xử lý media",
                    fromState: item.currentWorkflowState || "NEW",
                    toState: item.currentWorkflowState || "NEW",
                    manualActionLabel: "Xử lý media",
                    enabled: true,
                    reason: null,
                    metadata: {
                      intent: "OPEN_TARGET",
                      presentation: "MODAL",
                      targetRoute: "watch.edit",
                      targetMode: "media",
                      focus: "media",
                      from: "media-workspace",
                      expectedEventKey: "watch.media.asset.attached",
                    },
                  }
                : null;
              const primaryAction = mediaOpenTransition ?? enabledActions[0] ?? null;
              const canOpenReconciliation = Boolean(
                item.payment &&
                itemStatus(item) !== "DONE" &&
                !normalize(item.flowStageKey).includes("settled"),
              );
              return (
                <tr key={item.id} className={cn("group transition hover:bg-slate-50", checked && "bg-violet-50/50")}>
                  <td className="px-5 py-3">
                    <ResponsiveSelectionCheckbox
                      aria-label={`Chọn ${item.preview.title ?? "item"}`}
                      checked={checked}
                      onCheckedChange={(nextChecked) => setSelectedIds((current) => nextChecked ? [...current, item.id] : current.filter((id) => id !== item.id))}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <Link href={href} className="flex min-w-0 items-center gap-3">
                      <QueueItemThumbnail item={thumbnailItem as TaskItemQueueItem} />
                      <span className="min-w-0">
                        <span className="block max-w-[340px] truncate text-sm font-semibold text-slate-950">{item.preview.title || "Item chưa đặt tên"}</span>
                        <span className="mt-1 block truncate text-xs text-slate-500">{item.preview.ref || item.targetType}</span>
                      </span>
                    </Link>
                  </td>
                  {showReshootNote ? (
                    <td className="px-4 py-3">
                      {item.reshootNote ? (
                        <div
                          title={item.reshootNote}
                          className="max-w-80 whitespace-normal text-xs font-medium leading-5 text-amber-800"
                        >
                          {item.reshootNote}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  ) : null}
                  {showStatusColumn ? (
                    <td className="px-4 py-3">
                      <WorkflowStatusSignal
                        status={item.currentWorkflowState || item.status}
                        label={item.currentWorkflowStateLabel || item.preview.status}
                        completedIcon={completedIcon}
                      />
                    </td>
                  ) : null}
                  {showProgressColumn ? <td className="px-4 py-3">
                    {item.mediaWorkProgress?.total ? (
                      <div className="w-36">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                          <span className={item.mediaWorkProgress.completed >= item.mediaWorkProgress.total ? "text-emerald-700" : "text-blue-700"}>
                            {item.mediaWorkProgress.completed}/{item.mediaWorkProgress.total}
                          </span>
                          <span className="text-slate-400">
                            {Math.round((item.mediaWorkProgress.completed / item.mediaWorkProgress.total) * 100)}%
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-[width]",
                              item.mediaWorkProgress.completed >= item.mediaWorkProgress.total
                                ? "bg-emerald-500"
                                : "bg-blue-500",
                            )}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  (item.mediaWorkProgress.completed /
                                    item.mediaWorkProgress.total) *
                                    100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : <span className="text-xs text-slate-400">-</span>}
                  </td> : null}
                  {showPublishChannels ? (
                    <td className="px-4 py-3">
                      {item.preview.postTargets?.length ? (
                        <div className="flex max-w-52 flex-wrap items-center gap-1.5">
                          {item.preview.postTargets.slice(0, 2).map((target) => (
                            <PostTargetChip
                              key={target.id}
                              title={target.platform ? `${target.name} · ${target.platform}` : target.name}
                              className="text-[11px]"
                            >
                              {target.name}
                            </PostTargetChip>
                          ))}
                          {item.preview.postTargets.length > 2 ? (
                            <span
                              title={item.preview.postTargets.slice(2).map((target) => target.name).join(", ")}
                              className="text-[11px] font-semibold text-slate-400"
                            >
                              +{item.preview.postTargets.length - 2}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Chưa chọn kênh</span>
                      )}
                    </td>
                  ) : null}
                  {showPaymentAmount ? (
                    <td className="px-4 py-3">
                      {item.payment ? (
                        <>
                          <div className="max-w-48 truncate text-xs font-semibold text-slate-800">
                            {item.payment.counterparty ?? item.payment.ownerRef ?? "Chưa xác định"}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {paymentOwnerLabel(item.payment.ownerType)}
                            {item.payment.contact ? ` · ${item.payment.contact}` : ""}
                          </div>
                        </>
                      ) : <span className="text-xs text-slate-400">-</span>}
                    </td>
                  ) : null}
                  {showPaymentAmount ? (
                    <td className="px-4 py-3">
                      {item.payment ? (
                        <>
                          <div className="text-xs font-semibold text-slate-800">
                            {paymentPurpose(item.payment.purpose)}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {item.payment.type ?? item.payment.ownerType}
                          </div>
                        </>
                      ) : <span className="text-xs text-slate-400">-</span>}
                    </td>
                  ) : null}
                  {showPaymentAmount ? (
                    <td className="px-4 py-3 text-right">
                      {item.payment ? (
                        <>
                          {canOpenReconciliation ? (
                            <button
                              type="button"
                              disabled={isActionPending}
                              onClick={() => openReconcileModal(item)}
                              title={`Mở đối soát ${paymentDirection(item.payment?.direction).label.toLowerCase()}`}
                              className={cn(
                                "ml-auto block text-sm font-bold tabular-nums underline-offset-4 transition hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 disabled:cursor-wait disabled:opacity-60",
                                String(item.payment.direction).toUpperCase() === "OUT"
                                  ? "text-rose-700 hover:text-rose-800"
                                  : "text-emerald-700 hover:text-emerald-800",
                              )}
                            >
                              {formatMoney(
                                item.payment.amount,
                                item.payment.currency,
                                paymentDirection(item.payment.direction).sign,
                              )}
                            </button>
                          ) : (
                            <div className={cn(
                              "text-sm font-bold tabular-nums",
                              String(item.payment.direction).toUpperCase() === "OUT"
                                ? "text-rose-700"
                                : "text-emerald-700",
                            )}>
                              {formatMoney(
                                item.payment.amount,
                                item.payment.currency,
                                paymentDirection(item.payment.direction).sign,
                              )}
                            </div>
                          )}
                          <div className="mt-1 text-[11px] font-medium text-slate-500">
                            {item.payment.method ?? "Chưa có phương thức"}
                          </div>
                        </>
                      ) : <span className="text-xs text-slate-400">-</span>}
                    </td>
                  ) : null}
                  {!showPaymentAmount ? <td className="px-4 py-3">
                    {item.targetType === "WATCH" && showPublishChannels && enabledActions.length ? (
                      enabledActions.length === 1 ? (
                        isOpenTargetTransition(enabledActions[0]) ? (
                          <OpenTargetAction
                            queueItem={item as TaskItemQueueItem}
                            taskItemId={item.taskItemId}
                            transition={enabledActions[0]}
                            onTransitionApplied={(outcome) => reconcileModalTransition(item, outcome)}
                            className="inline-flex h-8 max-w-40 items-center gap-1.5 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                          />
                        ) : (
                          <button
                            type="button"
                            disabled={isActionPending}
                            onClick={() => runAction(item, enabledActions[0])}
                            title={manualTransitionActionLabel(enabledActions[0])}
                            className="h-8 max-w-40 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-wait disabled:opacity-60"
                          >
                            {pendingActionId === item.id
                              ? "Äang xá»­ lÃ½..."
                              : manualTransitionActionLabel(enabledActions[0])}
                          </button>
                        )
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {isOpenTargetTransition(enabledActions[0]) ? (
                            <OpenTargetAction
                              queueItem={item as TaskItemQueueItem}
                              taskItemId={item.taskItemId}
                              transition={enabledActions[0]}
                              onTransitionApplied={(outcome) => reconcileModalTransition(item, outcome)}
                              className="inline-flex h-8 max-w-40 items-center gap-1.5 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                            />
                          ) : (
                            <button
                              type="button"
                              disabled={isActionPending}
                              onClick={() => runAction(item, enabledActions[0])}
                              title={manualTransitionActionLabel(enabledActions[0])}
                              className="h-8 max-w-36 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-wait disabled:opacity-60"
                            >
                              {pendingActionId === item.id
                                ? "Äang xá»­ lÃ½..."
                                : manualTransitionActionLabel(enabledActions[0])}
                            </button>
                          )}
                          <details className="relative">
                            <summary
                              title="ThÃªm thao tÃ¡c"
                              aria-label="ThÃªm thao tÃ¡c"
                              className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 [&::-webkit-details-marker]:hidden"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </summary>
                            <div className="absolute right-0 z-30 mt-1 min-w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                              {enabledActions.slice(1).map((transition) =>
                                isOpenTargetTransition(transition) ? (
                                  <OpenTargetAction
                                    key={transition.actionKey}
                                    queueItem={item as TaskItemQueueItem}
                                    taskItemId={item.taskItemId}
                                    transition={transition}
                                    onTransitionApplied={(outcome) => reconcileModalTransition(item, outcome)}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                                  />
                                ) : (
                                  <button
                                    key={transition.actionKey}
                                    type="button"
                                    disabled={isActionPending}
                                    onClick={() => runAction(item, transition)}
                                    className="block h-8 w-full rounded-lg px-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-wait disabled:opacity-60"
                                  >
                                    {manualTransitionActionLabel(transition)}
                                  </button>
                                ),
                              )}
                            </div>
                          </details>
                        </div>
                      )
                    ) : item.targetType === "SHIPMENT" && enabledActions.length ? (
                      <div className="flex items-center gap-1.5">
                        {(() => {
                          const transition = enabledActions[0];
                          const action = operationalActionFromMetadata(transition.metadata);
                          return (
                            <button
                              type="button"
                              disabled={isActionPending}
                              onClick={() =>
                                action
                                  ? openOperationalAction(item, action)
                                  : runAction(item, transition)
                              }
                              title={manualTransitionActionLabel(transition)}
                              className="h-8 max-w-40 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-wait disabled:opacity-60"
                            >
                              {pendingActionId === item.id
                                ? "Đang xử lý..."
                                : manualTransitionActionLabel(transition)}
                            </button>
                          );
                        })()}
                        {enabledActions.length > 1 ? (
                          <details className="group relative">
                            <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-300 hover:text-violet-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </summary>
                            <div className="absolute right-0 top-9 z-30 min-w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                              {enabledActions.slice(1).map((transition) => {
                                const action = operationalActionFromMetadata(transition.metadata);
                                return (
                                  <button
                                    key={transition.actionKey}
                                    type="button"
                                    disabled={isActionPending}
                                    onClick={() =>
                                      action
                                        ? openOperationalAction(item, action)
                                        : runAction(item, transition)
                                    }
                                    className="block h-8 w-full rounded-lg px-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
                                  >
                                    {manualTransitionActionLabel(transition)}
                                  </button>
                                );
                              })}
                            </div>
                          </details>
                        ) : null}
                      </div>
                    ) : primaryAction && isOpenTargetTransition(primaryAction) ? (
                      <OpenTargetAction
                        queueItem={item as TaskItemQueueItem}
                        taskItemId={item.taskItemId}
                        transition={primaryAction}
                        onTransitionApplied={(outcome) => reconcileModalTransition(item, outcome)}
                        className="inline-flex h-8 max-w-40 items-center gap-1.5 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                      />
                    ) : primaryAction ? (
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={() => runAction(item, primaryAction)}
                        title={manualTransitionActionLabel(primaryAction)}
                        className="h-8 max-w-36 truncate rounded-lg border border-violet-200 bg-violet-50/70 px-3 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-wait disabled:opacity-60"
                      >
                        {pendingActionId === item.id ? "Đang xử lý..." : manualTransitionActionLabel(primaryAction)}
                      </button>
                    ) : null}
                  </td> : null}
                  <td className="px-4 py-3">
                    {item.lastUpdatedBy ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          label={item.lastUpdatedBy.label}
                          avatarUrl={item.lastUpdatedBy.avatarUrl}
                          isSystem={item.lastUpdatedBy.isSystem}
                        />
                        <span className="max-w-36 truncate text-xs font-medium text-slate-700">{item.lastUpdatedBy.label}</span>
                      </div>
                    ) : <span className="text-xs text-slate-400">Hệ thống</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">{formatTime(item.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void loadActivityPage(item, 1)}
                      className="flex max-w-64 items-center gap-2 text-left text-xs text-slate-600 transition hover:text-violet-700"
                    >
                      <Activity className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {item.latestActivityTitle || "Chưa có thao tác"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={href} aria-label="Mở item" className="text-slate-400 transition group-hover:text-violet-600"><ChevronRight className="h-4 w-4" /></Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pending ? <div className="px-5 py-12 text-center text-sm text-slate-500">Đang tải danh sách item...</div> : null}
      {!pending && !visibleItems.length ? (
        <div className="flex flex-col items-center px-5 py-14 text-center">
          <CheckCircle2 className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">Không có item phù hợp</p>
          <p className="mt-1 text-xs text-slate-500">Thử chọn bước khác hoặc xóa bớt bộ lọc.</p>
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
        <span>Hiển thị {visibleItems.length} / {effectiveTotal} item</span>
        {effectiveTotalPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending || pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>
            <span className="min-w-20 text-center font-semibold text-slate-700">
              {pagination.page} / {effectiveTotalPages}
            </span>
            <button
              type="button"
              disabled={pending || pagination.page >= effectiveTotalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        ) : null}
      </div>

      {isBulkReconcileOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] ring-1 ring-slate-200">
            <div className={cn(
              "flex items-start justify-between border-b px-6 py-5",
              bulkAllIncome
                ? "border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-white to-white"
                : bulkAllExpense
                  ? "border-rose-100 bg-gradient-to-r from-rose-50/80 via-white to-white"
                  : "border-violet-100 bg-gradient-to-r from-violet-50/80 via-white to-white",
            )}>
              <div className="flex items-start gap-3">
                <span className={cn(
                  "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
                  bulkAllIncome
                    ? "bg-emerald-100/80 text-emerald-700 ring-emerald-200"
                    : bulkAllExpense
                      ? "bg-rose-100/80 text-rose-700 ring-rose-200"
                      : "bg-violet-100/80 text-violet-700 ring-violet-200",
                )}>
                  {bulkAllIncome
                    ? <ArrowDownToLine className="h-5 w-5" />
                    : bulkAllExpense
                      ? <ArrowUpFromLine className="h-5 w-5" />
                      : <CheckCircle2 className="h-5 w-5" />}
                </span>
                <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {bulkAllIncome
                    ? "Xác nhận thu tiền hàng loạt"
                    : bulkAllExpense
                      ? "Xác nhận chi tiền hàng loạt"
                      : "Đối soát dòng tiền hàng loạt"}
                  {" · "}{selectedPaymentItems.length} Payment
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Điều chỉnh số thực tế từng dòng. Khoản thấp hơn dự kiến sẽ tự động split.
                </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => setIsBulkReconcileOpen(false)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <div className={cn(
                "relative mb-5 overflow-hidden rounded-2xl border p-4",
                bulkAllIncome
                  ? "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 shadow-[0_12px_32px_rgba(16,185,129,0.10)]"
                  : bulkAllExpense
                    ? "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-rose-50/30"
                    : "border-violet-100 bg-gradient-to-br from-violet-50 via-white to-violet-50/30",
              )}>
                <div className={cn(
                  "pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full blur-3xl",
                  bulkAllIncome
                    ? "bg-emerald-300/25"
                    : bulkAllExpense
                      ? "bg-rose-300/20"
                      : "bg-violet-300/20",
                )} />
                <div className="relative grid items-center gap-4 sm:grid-cols-[0.8fr_1.25fr_1fr]">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Tổng dự kiến</div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">
                      {formatMoney(bulkExpectedTotal, bulkCurrency)}
                    </div>
                  </div>
                  <div className="sm:border-x sm:border-slate-200/70 sm:px-5">
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.08em]",
                      bulkAllIncome
                        ? "text-emerald-600"
                        : bulkAllExpense
                          ? "text-rose-600"
                          : "text-violet-600",
                    )}>
                      {bulkAllIncome ? "Tổng tiền sẽ ghi nhận" : bulkAllExpense ? "Tổng tiền thực chi" : "Tổng thực tế"}
                    </div>
                    <div className={cn(
                      "mt-1 text-2xl font-bold tabular-nums tracking-[-0.025em]",
                      bulkAllIncome
                        ? "text-emerald-700"
                        : bulkAllExpense
                          ? "text-rose-700"
                          : "text-violet-700",
                    )}>
                      {formatMoney(bulkReviewedTotal, bulkCurrency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Kết quả batch</div>
                    <div className={cn("mt-1 text-sm font-bold", bulkRemainingTotal > 0 ? "text-amber-700" : "text-emerald-700")}>
                      {bulkRemainingTotal > 0
                        ? `Có split · còn ${formatMoney(bulkRemainingTotal, bulkCurrency)}`
                        : "Tất cả khớp đủ"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[minmax(220px,1fr)_150px_170px_150px] gap-3 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                  <div>Payment / Đối tượng</div>
                  <div className="text-right">Dự kiến</div>
                  <div className="text-right">Thực tế</div>
                  <div>Kết quả</div>
                </div>
                {selectedPaymentItems.map((item) => {
                  const expected = Number(item.payment?.amount ?? 0);
                  const actual = Number(bulkReconcileAmounts[item.id]);
                  const split = Number.isFinite(actual) && actual < expected;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[minmax(220px,1fr)_150px_170px_150px] items-center gap-3 border-t border-slate-100 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {item.preview.title ?? "Payment"}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-500">
                          {item.payment?.counterparty ?? item.payment?.ownerRef ?? item.preview.ref}
                        </div>
                      </div>
                      <div className="text-right text-sm font-bold tabular-nums text-slate-800">
                        {formatMoney(expected, item.payment?.currency ?? "VND")}
                      </div>
                      <input
                        type="number"
                        min="1"
                        max={expected}
                        value={bulkReconcileAmounts[item.id] ?? ""}
                        onChange={(event) => setBulkReconcileAmounts((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))}
                        className={cn(
                          "h-10 rounded-xl border border-slate-200 px-3 text-right text-sm font-semibold tabular-nums outline-none transition focus:ring-3",
                          String(item.payment?.direction ?? "").toUpperCase() === "OUT"
                            ? "focus:border-rose-400 focus:ring-rose-100"
                            : "focus:border-emerald-400 focus:ring-emerald-100",
                        )}
                      />
                      <div className={cn("text-xs font-bold", split ? "text-amber-700" : "text-emerald-700")}>
                        {split
                          ? `Split · còn ${formatMoney(expected - actual, item.payment?.currency ?? "VND")}`
                          : "Khớp đủ"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700">
                  Phương thức chung
                  <select
                    value={bulkReconcileFields.method}
                    onChange={(event) => setBulkReconcileFields((current) => ({ ...current, method: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-violet-400"
                  >
                    <option value="BANK_TRANSFER">Chuyển khoản</option>
                    <option value="CASH">Tiền mặt</option>
                    <option value="COD">COD</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Ngày giao dịch
                  <input
                    type="date"
                    value={bulkReconcileFields.occurredAt}
                    onChange={(event) => setBulkReconcileFields((current) => ({ ...current, occurredAt: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Mã chứng từ chung
                  <input
                    value={bulkReconcileFields.transactionReference}
                    onChange={(event) => setBulkReconcileFields((current) => ({ ...current, transactionReference: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-violet-400"
                  />
                </label>
              </div>

              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Ghi chú chung
                <textarea
                  rows={3}
                  value={bulkReconcileFields.reviewNote}
                  onChange={(event) => setBulkReconcileFields((current) => ({ ...current, reviewNote: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-violet-400"
                  placeholder="Bắt buộc nếu có ít nhất một Payment cần split"
                />
              </label>

              {actionError ? (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {actionError}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => setIsBulkReconcileOpen(false)}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isActionPending}
                onClick={submitBulkReconciliation}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0",
                  bulkAllIncome
                    ? "bg-emerald-600 shadow-[0_10px_24px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_12px_28px_rgba(5,150,105,0.32)]"
                    : bulkAllExpense
                      ? "bg-slate-950 shadow-lg hover:bg-slate-800"
                      : "bg-violet-600 shadow-[0_10px_24px_rgba(124,58,237,0.22)] hover:bg-violet-700",
                )}
              >
                {bulkAllIncome
                  ? <ArrowDownToLine className="h-4 w-4" />
                  : bulkAllExpense
                    ? <ArrowUpFromLine className="h-4 w-4" />
                    : <CheckCircle2 className="h-4 w-4" />}
                {pendingActionId === "BULK_RECONCILE"
                  ? "Đang đối soát..."
                  : bulkAllIncome
                    ? `Xác nhận đã nhận ${selectedPaymentItems.length} khoản`
                    : bulkAllExpense
                      ? `Xác nhận đã chi ${selectedPaymentItems.length} khoản`
                      : `Xác nhận ${selectedPaymentItems.length} Payment`}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {reconcileItem?.payment ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] ring-1 ring-slate-200">
            <div className={cn(
              "flex items-start justify-between border-b px-6 py-5",
              reconciliationIsIncome
                ? "border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-white to-white"
                : "border-rose-100 bg-gradient-to-r from-rose-50/80 via-white to-white",
            )}>
              <div className="flex items-start gap-3">
                <span className={cn(
                  "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
                  reconciliationIsIncome
                    ? "bg-emerald-100/80 text-emerald-700 ring-emerald-200"
                    : "bg-rose-100/80 text-rose-700 ring-rose-200",
                )}>
                  {reconciliationIsIncome
                    ? <ArrowDownToLine className="h-5 w-5" />
                    : <ArrowUpFromLine className="h-5 w-5" />}
                </span>
                <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {reconciliationIsIncome ? "Xác nhận thu tiền" : "Xác nhận chi tiền"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {reconcileItem.preview.title} · {reconcileItem.preview.ref}
                </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => setReconcileItem(null)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className={cn(
                "relative overflow-hidden rounded-2xl border p-4",
                reconciliationIsIncome
                  ? "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 shadow-[0_12px_32px_rgba(16,185,129,0.10)]"
                  : "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-rose-50/30",
              )}>
                <div className={cn(
                  "pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full blur-3xl",
                  reconciliationIsIncome ? "bg-emerald-300/25" : "bg-rose-300/20",
                )} />
                <div className="relative grid items-center gap-4 sm:grid-cols-[0.8fr_1.25fr_1fr]">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Dự kiến</div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">
                      {formatMoney(reconcileItem.payment.amount, reconcileItem.payment.currency)}
                    </div>
                  </div>
                  <div className="sm:border-x sm:border-slate-200/70 sm:px-5">
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.08em]",
                      reconciliationIsIncome ? "text-emerald-600" : "text-rose-600",
                    )}>
                      {reconciliationIsIncome ? "Số tiền sẽ ghi nhận" : "Số tiền thực chi"}
                    </div>
                    <div className={cn(
                      "mt-1 text-2xl font-bold tabular-nums tracking-[-0.025em]",
                      reconciliationIsIncome ? "text-emerald-700" : "text-rose-700",
                    )}>
                      {formatMoney(reconciliationReviewedAmount, reconcileItem.payment.currency)}
                    </div>
                  </div>
                  <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400">Kết quả</div>
                  <div className={cn(
                    "mt-1 text-sm font-bold",
                    reconciliationIsSplit
                      ? "text-amber-700"
                      : "text-emerald-700",
                  )}>
                    {reconciliationIsSplit
                      ? `Split · còn ${formatMoney(
                        reconciliationExpectedAmount - reconciliationReviewedAmount,
                        reconcileItem.payment.currency,
                      )}`
                      : reconciliationIsIncome
                        ? "Khớp đủ · sẵn sàng ghi nhận"
                        : "Khớp đủ · chuyển Settled"}
                  </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Số tiền thực tế
                  <input
                    type="number"
                    min="1"
                    max={reconcileItem.payment.amount}
                    value={reconcileFields.reviewedAmount}
                    onChange={(event) => setReconcileFields((current) => ({ ...current, reviewedAmount: event.target.value }))}
                    className={cn(
                      "mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-semibold tabular-nums outline-none transition focus:ring-3",
                      reconciliationIsIncome
                        ? "focus:border-emerald-400 focus:ring-emerald-100"
                        : "focus:border-rose-400 focus:ring-rose-100",
                    )}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Phương thức
                  <select
                    value={reconcileFields.method}
                    onChange={(event) => setReconcileFields((current) => ({ ...current, method: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-violet-400"
                  >
                    <option value="BANK_TRANSFER">Chuyển khoản</option>
                    <option value="CASH">Tiền mặt</option>
                    <option value="COD">COD</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Ngày giao dịch
                  <input
                    type="date"
                    value={reconcileFields.occurredAt}
                    onChange={(event) => setReconcileFields((current) => ({ ...current, occurredAt: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Mã giao dịch / chứng từ
                  <input
                    value={reconcileFields.transactionReference}
                    onChange={(event) => setReconcileFields((current) => ({ ...current, transactionReference: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Đối tượng
                  <input
                    value={reconcileFields.counterparty}
                    onChange={(event) => setReconcileFields((current) => ({ ...current, counterparty: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Liên hệ
                  <input
                    value={reconcileFields.contact}
                    onChange={(event) => setReconcileFields((current) => ({ ...current, contact: event.target.value }))}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-violet-400"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Ghi chú {Number(reconcileFields.reviewedAmount) < Number(reconcileItem.payment.amount) ? "(bắt buộc khi split)" : ""}
                <textarea
                  rows={3}
                  value={reconcileFields.reviewNote}
                  onChange={(event) => setReconcileFields((current) => ({ ...current, reviewNote: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-violet-400"
                />
              </label>

              {actionError ? (
                <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {actionError}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => setReconcileItem(null)}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isActionPending}
                onClick={submitReconciliation}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0",
                  reconciliationIsIncome
                    ? "bg-emerald-600 shadow-[0_10px_24px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_12px_28px_rgba(5,150,105,0.32)]"
                    : "bg-slate-950 shadow-lg hover:bg-slate-800",
                )}
              >
                {reconciliationIsIncome
                  ? <ArrowDownToLine className="h-4 w-4" />
                  : <ArrowUpFromLine className="h-4 w-4" />}
                {isActionPending
                  ? "Đang đối soát..."
                  : reconciliationIsSplit
                    ? reconciliationIsIncome
                      ? "Xác nhận nhận một phần"
                      : "Xác nhận chi một phần"
                    : reconciliationIsIncome
                      ? "Xác nhận đã nhận tiền"
                      : "Xác nhận đã chi tiền"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {operationalAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  {operationalAction.action.label}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {operationalAction.item.preview.title ??
                    operationalAction.item.preview.ref ??
                    operationalAction.item.targetId}
                </p>
                {operationalAction.action.description ? (
                  <p className="mt-2 text-sm text-slate-600">
                    {operationalAction.action.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => setOperationalAction(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-4">
              {operationalAction.action.fields.map((field) => {
                const value = operationalFields[field.key] ?? "";
                const commonClass =
                  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100";
                return (
                  <label key={field.key} className="block text-sm font-semibold text-slate-700">
                    {field.label}
                    {field.required ? <span className="text-rose-600"> *</span> : null}
                    {field.kind === "select" ? (
                      <select
                        value={value}
                        onChange={(event) =>
                          setOperationalFields((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        className={commonClass}
                      >
                        {(field.options ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.kind === "textarea" ? (
                      <textarea
                        rows={3}
                        value={value}
                        onChange={(event) =>
                          setOperationalFields((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        className={commonClass}
                      />
                    ) : (
                      <input
                        type={
                          field.kind === "money" || field.kind === "number"
                            ? "number"
                            : field.kind === "date"
                              ? "date"
                              : "text"
                        }
                        min={field.kind === "money" || field.kind === "number" ? 0 : undefined}
                        step={field.kind === "money" ? 1000 : undefined}
                        value={value}
                        onChange={(event) =>
                          setOperationalFields((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        className={commonClass}
                      />
                    )}
                  </label>
                );
              })}
              {actionError ? (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {actionError}
                </p>
              ) : null}
            </div>
            <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => setOperationalAction(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isActionPending}
                onClick={submitOperationalAction}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isActionPending ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {activityTarget ? (
        <div className="fixed inset-0 z-[90] flex justify-end bg-slate-950/30">
          <button
            type="button"
            aria-label="Đóng hoạt động"
            className="absolute inset-0 cursor-default"
            onClick={() => setActivityTarget(null)}
          />
          <aside className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-950">Hoạt động</h3>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {activityTarget.preview.title ?? activityTarget.preview.ref ?? activityTarget.targetId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivityTarget(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {activityLoading ? (
                <p className="py-10 text-center text-sm text-slate-500">Đang tải hoạt động...</p>
              ) : null}
              {activityError ? (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{activityError}</p>
              ) : null}
              {!activityLoading && !activityError && !activityItems.length ? (
                <p className="py-10 text-center text-sm text-slate-500">Chưa có hoạt động.</p>
              ) : null}
              {activityItems.map((activity) => (
                <article key={activity.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {activity.actorLabel} · {formatTime(activity.occurredAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                      {activity.sourceType}
                    </span>
                  </div>
                  {activity.body ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{activity.body}</p>
                  ) : null}
                  {activity.replies.length ? (
                    <div className="mt-3 space-y-2 border-l-2 border-violet-100 pl-3">
                      {activity.replies.map((reply) => (
                        <div key={reply.id} className="rounded-lg bg-slate-50 px-3 py-2">
                          <p className="text-xs font-semibold text-slate-700">{reply.actorLabel}</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <span className="text-xs text-slate-500">
                Trang {activityPagination.page}/{activityPagination.totalPages} · {activityPagination.total} hoạt động
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={activityLoading || activityPagination.page <= 1}
                  onClick={() => void loadActivityPage(activityTarget, activityPagination.page - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  Trước
                </button>
                <button
                  type="button"
                  disabled={activityLoading || activityPagination.page >= activityPagination.totalPages}
                  onClick={() => void loadActivityPage(activityTarget, activityPagination.page + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </footer>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
