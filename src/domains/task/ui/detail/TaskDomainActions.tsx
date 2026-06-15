"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  ExternalLink,
  Link2,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Truck,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
import { TaskExecutionTargetType } from "@prisma/client";
import { createOrderFromTaskAction } from "@/domains/order/actions/order-from-task.actions";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  executeTaskActionAction,
  previewTaskActionAction,
} from "../../actions/task-action-execution.actions";
import { linkTaskExecutionAction } from "../../actions/task-execution.actions";
import { resolveTaskActions } from "../../utils/task-action-revolver";

type Props = {
  task: any;
  onDone?: () => void;
};

type ServiceExecutionMode = "SR_ONLY" | "SR_WITH_TECHNICAL_ISSUE";

type LinkTargetOption = {
  type: TaskExecutionTargetType;
  label: string;
  helper: string;
};

const LINK_TARGET_OPTIONS: LinkTargetOption[] = [
  {
    type: TaskExecutionTargetType.ORDER,
    label: "Order",
    helper: "Dán Order ID cần link với task này.",
  },
  {
    type: TaskExecutionTargetType.SHIPMENT,
    label: "Shipment",
    helper: "Dán Shipment ID cần link với task này.",
  },
  {
    type: TaskExecutionTargetType.PAYMENT,
    label: "Payment",
    helper: "Dán Payment ID cần link với task này.",
  },
  {
    type: TaskExecutionTargetType.SERVICE_REQUEST,
    label: "Service Request",
    helper: "Dán Service Request ID cần link với task này.",
  },
  {
    type: TaskExecutionTargetType.TECHNICAL_ISSUE,
    label: "Technical Issue",
    helper: "Dán Technical Issue ID cần link với task này.",
  },
];

function suggestedTarget(task: any): TaskExecutionTargetType {
  const targetType = String(task?.taskAction?.targetType ?? "").toUpperCase();

  if (
    targetType &&
    Object.values(TaskExecutionTargetType).includes(
      targetType as TaskExecutionTargetType,
    )
  ) {
    return targetType as TaskExecutionTargetType;
  }

  const domain = String(task?.domain ?? "").toUpperCase();

  if (domain === "ORDER") return TaskExecutionTargetType.ORDER;
  if (domain === "SHIPMENT") return TaskExecutionTargetType.SHIPMENT;
  if (domain === "PAYMENT") return TaskExecutionTargetType.PAYMENT;
  if (domain === "TECHNICAL_ISSUE") return TaskExecutionTargetType.TECHNICAL_ISSUE;
  if (domain === "SERVICE") return TaskExecutionTargetType.SERVICE_REQUEST;

  return TaskExecutionTargetType.ORDER;
}

function targetIcon(type: TaskExecutionTargetType) {
  if (type === TaskExecutionTargetType.ORDER) {
    return <ReceiptText className="h-4 w-4" />;
  }

  if (type === TaskExecutionTargetType.SHIPMENT) {
    return <Truck className="h-4 w-4" />;
  }

  if (type === TaskExecutionTargetType.PAYMENT) {
    return <WalletCards className="h-4 w-4" />;
  }

  if (type === TaskExecutionTargetType.SERVICE_REQUEST) {
    return <Wrench className="h-4 w-4" />;
  }

  return <Link2 className="h-4 w-4" />;
}

function resolveWatchProduct(task: any) {
  return task?.watch?.product ?? task?.workCase?.watch?.product ?? null;
}

function resolveWatchProductId(task: any) {
  return task?.watch?.productId ?? task?.workCase?.watch?.productId ?? null;
}

function resolveDefaultPrice(task: any) {
  const product = resolveWatchProduct(task);

  const price =
    product?.watch?.watchPrice?.salePrice ??
    product?.watch?.watchPrice?.listPrice ??
    product?.watchPrice?.salePrice ??
    product?.watchPrice?.listPrice ??
    0;

  const numberPrice = Number(price ?? 0);

  return Number.isFinite(numberPrice) && numberPrice > 0
    ? String(numberPrice)
    : "";
}

function firstExecution(task: any, targetType: TaskExecutionTargetType) {
  return (
    (task.executions ?? []).find((item: any) => item.targetType === targetType) ??
    null
  );
}

function hasActiveExecution(task: any, targetType: TaskExecutionTargetType) {
  return Boolean(
    (task.executions ?? []).find((item: any) => {
      if (item.targetType !== targetType) return false;

      const status = String(
        item.targetStatus ??
        item.status ??
        item.order?.status ??
        item.shipment?.status ??
        item.payment?.status ??
        "",
      ).toUpperCase();

      return status !== "CANCELLED" && status !== "CANCELED";
    }),
  );
}

function actionLabel(task: any) {
  return task?.taskAction?.name || task?.taskType?.name || "Thực thi action";
}

export default function TaskDomainActions({ task, onDone }: Props) {
  const notify = useNotify();
  const [pending, startTransition] = useTransition();

  const actions = useMemo(() => resolveTaskActions(task), [task]);

  const shouldCreateOrder = actions.includes("ORDER_CREATE");
  const shouldLinkPayment = actions.includes("PAYMENT_LINK");
  const shouldLinkShipment = actions.includes("SHIPMENT_LINK");
  const shouldCreateService = actions.includes("SERVICE_CREATE");
  const shouldCreateTechnicalIssue = actions.includes("TECHNICAL_ISSUE_CREATE");
  const shouldUpdateWatchPrice = actions.includes("WATCH_PRICE_UPDATE");
  const shouldEditWatchContent = actions.includes("WATCH_CONTENT_EDIT");
  const shouldEditWatchImage = actions.includes("WATCH_IMAGE_EDIT");

  const watchProductId = resolveWatchProductId(task);
  const canUseWatch = Boolean(task?.watchId || task?.watch?.id || task?.workCase?.watch?.id);

  const orderExecution = firstExecution(task, TaskExecutionTargetType.ORDER);
  const hasOrderExecution = hasActiveExecution(task, TaskExecutionTargetType.ORDER);

  const [serviceMode, setServiceMode] =
    useState<ServiceExecutionMode>("SR_ONLY");

  const [orderOpen, setOrderOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [orderPrice, setOrderPrice] = useState(() => resolveDefaultPrice(task));
  const [orderNote, setOrderNote] = useState("");
  const [hasShipment, setHasShipment] = useState(false);
  const [shipAddress, setShipAddress] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipDistrict, setShipDistrict] = useState("");
  const [shipWard, setShipWard] = useState("");

  const [serviceConfirmOpen, setServiceConfirmOpen] = useState(false);
  const [servicePreview, setServicePreview] = useState<any>(null);

  const [linkOpen, setLinkOpen] = useState(false);
  const [targetType, setTargetType] = useState<TaskExecutionTargetType>(() =>
    suggestedTarget(task),
  );
  const [targetId, setTargetId] = useState("");
  const [note, setNote] = useState("");

  const currentTarget = useMemo(
    () =>
      LINK_TARGET_OPTIONS.find((item) => item.type === targetType) ??
      LINK_TARGET_OPTIONS[0],
    [targetType],
  );

  function resetOrderForm() {
    setCustomerName("");
    setShipPhone("");
    setOrderPrice("");
    setOrderNote("");
    setHasShipment(false);
    setShipAddress("");
    setShipCity("");
    setShipDistrict("");
    setShipWard("");
  }

  function openOrderModal() {
    setOrderPrice(resolveDefaultPrice(task));
    setOrderNote(task?.description ?? "");
    setHasShipment(false);
    setShipAddress("");
    setShipCity("");
    setShipDistrict("");
    setShipWard("");
    setOrderOpen(true);
  }

  function openLinkModal(type: TaskExecutionTargetType) {
    setTargetType(type);
    setTargetId("");
    setNote("");
    setLinkOpen(true);
  }

  function createOrder() {
    const cleanCustomerName = customerName.trim();

    if (!cleanCustomerName) {
      notify.error("Vui lòng nhập tên khách hàng");
      return;
    }

    if (hasShipment && !shipAddress.trim()) {
      notify.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createOrderFromTaskAction({
          taskId: task.id,
          customerName: cleanCustomerName,
          shipPhone: shipPhone.trim() || null,
          unitPriceAgreed: orderPrice.trim() || null,
          note: orderNote.trim() || null,
          hasShipment,
          shipAddress: shipAddress.trim() || null,
          shipCity: shipCity.trim() || null,
          shipDistrict: shipDistrict.trim() || null,
          shipWard: shipWard.trim() || null,
        });

        notify.success(
          `Đã tạo Order${result?.order?.refNo ? ` ${result.order.refNo}` : ""} từ task`,
        );

        resetOrderForm();
        setOrderOpen(false);
        onDone?.();
      } catch (error: any) {
        notify.error(error?.message || "Không tạo được Order");
      }
    });
  }

  function executeBusinessAction(mode: ServiceExecutionMode) {
    startTransition(async () => {
      try {
        const result = await executeTaskActionAction(task.id, mode);

        notify.success(result?.message || "Đã thực thi action từ task");
        setServicePreview(null);
        onDone?.();
      } catch (error: any) {
        notify.error(error?.message || "Không thực thi được action");
      }
    });
  }

  function openServiceConfirm() {
    startTransition(async () => {
      try {
        const preview = await previewTaskActionAction(task.id);

        setServicePreview(preview);
        setServiceMode("SR_ONLY");
        setServiceConfirmOpen(true);
      } catch (error: any) {
        notify.error(error?.message || "Không xem trước được nghiệp vụ sẽ tạo");
      }
    });
  }

  function closeServiceConfirm() {
    setServiceConfirmOpen(false);
    setServicePreview(null);
    setServiceMode("SR_ONLY");
  }

  function linkExisting() {
    const cleanTargetId = targetId.trim();

    if (!cleanTargetId) {
      notify.error("Bạn cần nhập ID nghiệp vụ cần link");
      return;
    }

    startTransition(async () => {
      try {
        await linkTaskExecutionAction({
          taskId: task.id,
          targetType,
          targetId: cleanTargetId,
          actionType: "LINKED",
          note: note.trim() || `Link ${currentTarget.label} vào task`,
          syncTaskRelation: true,
        });

        notify.success(`Đã link ${currentTarget.label} vào task`);
        setTargetId("");
        setNote("");
        setLinkOpen(false);
        onDone?.();
      } catch (error: any) {
        notify.error(error?.message || `Không link được ${currentTarget.label}`);
      }
    });
  }

  const hasAnyPrimaryAction =
    shouldCreateOrder ||
    shouldLinkPayment ||
    shouldLinkShipment ||
    shouldCreateService ||
    shouldCreateTechnicalIssue ||
    shouldUpdateWatchPrice ||
    shouldEditWatchContent ||
    shouldEditWatchImage;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Thực thi nghiệp vụ
      </p>

      <h3 className="mt-1 text-base font-semibold text-slate-950">
        Action theo task
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Task Type là nhóm việc, Action là việc cụ thể. Action sẽ quyết định
        tạo/link nghiệp vụ nào và task sẽ theo dõi target nào.
      </p>

      {task?.taskAction ? (
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Action:{" "}
          <span className="font-semibold text-slate-950">
            {task.taskAction.name}
          </span>

          {task.taskAction.completionRuleKey ? (
            <span className="ml-2 text-xs text-slate-400">
              Rule: {task.taskAction.completionRuleKey}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {shouldCreateOrder ? (
          <>
            <button
              type="button"
              disabled={!canUseWatch || pending || hasOrderExecution}
              onClick={openOrderModal}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <ShoppingBag className="h-4 w-4" />
              {hasOrderExecution ? "Đã tạo Order" : "Tạo Order"}
            </button>

            {orderExecution ? (
              <Link
                href={`/admin/orders/${orderExecution.targetId}`}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                Mở Order <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
          </>
        ) : null}

        {shouldCreateTechnicalIssue ? (
          <button
            type="button"
            disabled={!canUseWatch || pending}
            onClick={openServiceConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Wrench className="h-4 w-4" />
            {pending ? "Đang tạo..." : `Thực thi service: ${actionLabel(task)}`}
          </button>
        ) : null}

        {shouldCreateService && !shouldCreateTechnicalIssue ? (
          <button
            type="button"
            disabled={!canUseWatch || pending}
            onClick={openServiceConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Wrench className="h-4 w-4" />
            {pending ? "Đang tạo..." : "Tạo/Gán Service Request"}
          </button>
        ) : null}

        {shouldLinkPayment ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => openLinkModal(TaskExecutionTargetType.PAYMENT)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <WalletCards className="h-4 w-4" />
            Link Payment
          </button>
        ) : null}

        {shouldLinkShipment ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => openLinkModal(TaskExecutionTargetType.SHIPMENT)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Truck className="h-4 w-4" />
            Link Shipment
          </button>
        ) : null}

        {shouldUpdateWatchPrice && watchProductId ? (
          <Link
            href={`/admin/watches/${watchProductId}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Cập nhật giá Watch <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}

        {shouldEditWatchContent && watchProductId ? (
          <Link
            href={`/admin/watches/${watchProductId}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Sửa content Watch <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}

        {shouldEditWatchImage && watchProductId ? (
          <Link
            href={`/admin/watches/${watchProductId}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Sửa hình Watch <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}

        <button
          type="button"
          disabled={pending}
          onClick={() => openLinkModal(suggestedTarget(task))}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <Link2 className="h-4 w-4" />
          Liên kết nghiệp vụ
        </button>
      </div>

      {!hasAnyPrimaryAction ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Action này chưa có nghiệp vụ tự động. Người nhận có thể xử lý thủ
          công hoặc link nghiệp vụ đã có.
        </div>
      ) : null}

      {(shouldCreateService || shouldCreateTechnicalIssue || shouldCreateOrder) &&
        !canUseWatch ? (
        <p className="mt-3 text-xs text-amber-600">
          Task cần gắn Watch hoặc Work Case có Watch để thực thi action này.
        </p>
      ) : null}

      {orderOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h4 className="text-base font-semibold text-slate-950">
                  Tạo Order từ task
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Order được tạo ở trạng thái DRAFT, reserve/cọc = NONE. Nếu
                  tick shipment, đơn sẽ có thông tin giao hàng để xử lý tiếp.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOrderOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
              <label className="block text-sm font-medium text-slate-700">
                Tên khách hàng
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Nhập tên khách hàng"
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Số điện thoại
                <input
                  value={shipPhone}
                  onChange={(event) => setShipPhone(event.target.value)}
                  placeholder="Không bắt buộc"
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasShipment}
                    onChange={(event) => setHasShipment(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    Tạo shipment cho đơn hàng này
                  </span>
                </label>

                <p className="mt-1 pl-6 text-xs text-slate-500">
                  Dùng cho case giao xem thử/đeo thử hoặc đơn cần giao hàng ngay
                  sau khi tạo.
                </p>
              </div>

              {hasShipment ? (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Địa chỉ giao hàng
                    <input
                      value={shipAddress}
                      onChange={(event) => setShipAddress(event.target.value)}
                      placeholder="Nhập địa chỉ giao hàng"
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </label>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Tỉnh / Thành phố
                      <input
                        value={shipCity}
                        onChange={(event) => setShipCity(event.target.value)}
                        placeholder="Ví dụ: TP.HCM"
                        className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Quận / Huyện
                      <input
                        value={shipDistrict}
                        onChange={(event) => setShipDistrict(event.target.value)}
                        placeholder="Ví dụ: Quận 1"
                        className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Phường / Xã
                    <input
                      value={shipWard}
                      onChange={(event) => setShipWard(event.target.value)}
                      placeholder="Ví dụ: Bến Nghé"
                      className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </label>
                </div>
              ) : null}

              <label className="block text-sm font-medium text-slate-700">
                Giá chốt
                <input
                  value={orderPrice}
                  onChange={(event) => setOrderPrice(event.target.value)}
                  inputMode="numeric"
                  placeholder="Ví dụ: 3500000"
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                />
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  Giá này là giá trị order. Cọc đang để NONE.
                </span>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Ghi chú
                <textarea
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Khách xin giao đồng hồ xem thử, chưa cọc."
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setOrderOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={createOrder}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingBag className="h-4 w-4" />
                {pending ? "Đang tạo..." : "Tạo Order"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {linkOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h4 className="text-base font-semibold text-slate-950">
                  Liên kết nghiệp vụ
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Dùng khi người xử lý đã tạo Order/Shipment/Payment/SR/TI ở
                  màn hình nghiệp vụ rồi muốn gắn kết quả về task.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLinkOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <label className="block text-sm font-medium text-slate-700">
                Loại nghiệp vụ
                <select
                  value={targetType}
                  onChange={(event) =>
                    setTargetType(event.target.value as TaskExecutionTargetType)
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-slate-400"
                >
                  {LINK_TARGET_OPTIONS.map((item) => (
                    <option key={item.type} value={item.type}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                ID nghiệp vụ
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 focus-within:border-slate-400">
                  {targetIcon(targetType)}
                  <input
                    value={targetId}
                    onChange={(event) => setTargetId(event.target.value)}
                    placeholder="Dán ID record ở đây"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  {currentTarget.helper}
                </span>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Ghi chú
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Nghiệp vụ đã được tạo để xử lý task này."
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setLinkOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={linkExisting}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <PackageCheck className="h-4 w-4" />
                {pending ? "Đang link..." : "Link vào task"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {serviceConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h4 className="text-base font-semibold text-slate-950">
                  Thực thi nghiệp vụ Service
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Chọn cách xử lý task này trước khi tiếp tục.
                </p>
              </div>

              <button
                type="button"
                onClick={closeServiceConfirm}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5 text-sm">
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setServiceMode("SR_ONLY")}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    serviceMode === "SR_ONLY"
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="font-semibold">Tạo / gán Service Request</div>
                  <div
                    className={[
                      "mt-1 text-xs",
                      serviceMode === "SR_ONLY"
                        ? "text-slate-300"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    Dùng khi mới tiếp nhận yêu cầu, cần đánh giá thêm trước khi
                    mở Technical Issue.
                  </div>
                </button>

                {servicePreview?.technicalIssue ? (
                  <button
                    type="button"
                    onClick={() => setServiceMode("SR_WITH_TECHNICAL_ISSUE")}
                    className={[
                      "rounded-2xl border p-4 text-left transition",
                      serviceMode === "SR_WITH_TECHNICAL_ISSUE"
                        ? "border-blue-600 bg-blue-50 text-blue-950"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="font-semibold">
                      Tạo / gán Service Request + mở Technical Issue
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Dùng khi đã xác định rõ vấn đề cần xử lý ngay.
                    </div>
                  </button>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Service Request
                </div>

                {servicePreview?.serviceRequest?.willCreate ? (
                  <p className="mt-2 font-semibold text-slate-950">
                    Sẽ tạo Service Request mới
                  </p>
                ) : (
                  <p className="mt-2 font-semibold text-slate-950">
                    Sẽ dùng SR active:{" "}
                    {servicePreview?.serviceRequest?.refNo ||
                      servicePreview?.serviceRequest?.id}
                  </p>
                )}

                <p className="mt-1 text-slate-500">
                  Trạng thái: {servicePreview?.serviceRequest?.status || "DRAFT"}
                </p>
              </div>

              {serviceMode === "SR_WITH_TECHNICAL_ISSUE" &&
                servicePreview?.technicalIssue ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-blue-400">
                    Issue sẽ được tạo
                  </div>

                  <p className="mt-2 font-semibold text-slate-950">
                    {servicePreview.technicalIssue.summary}
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Loại: {servicePreview.technicalIssue.issueType}</div>
                    <div>Khu vực: {servicePreview.technicalIssue.area || "-"}</div>
                    <div>Xử lý: {servicePreview.technicalIssue.actionMode}</div>
                    <div>Action: {servicePreview.technicalIssue.actionName}</div>
                  </div>
                </div>
              ) : null}

              <p className="text-sm text-slate-500">
                {serviceMode === "SR_WITH_TECHNICAL_ISSUE"
                  ? servicePreview?.message
                  : "Task sẽ được gắn với Service Request. Technical Issue có thể được mở sau trong màn hình Service nếu cần."}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={closeServiceConfirm}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setServiceConfirmOpen(false);
                  executeBusinessAction(serviceMode);
                }}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
              >
                {serviceMode === "SR_WITH_TECHNICAL_ISSUE"
                  ? "Tạo SR + Issue"
                  : "Tạo/Gán SR"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}