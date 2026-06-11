"use client";

import { useMemo, useState, useTransition } from "react";
import {
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
import { createServiceRequestFromTaskAction } from "@/domains/service/actions/service-from-task.actions";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { linkTaskExecutionAction } from "../../actions/task-execution.actions";

type Props = {
  task: any;
  onDone?: () => void;
};

type LinkTargetOption = {
  type: TaskExecutionTargetType;
  label: string;
  helper: string;
};

const LINK_TARGET_OPTIONS: LinkTargetOption[] = [
  { type: TaskExecutionTargetType.ORDER, label: "Order", helper: "Dán Order ID cần link với task này." },
  { type: TaskExecutionTargetType.SHIPMENT, label: "Shipment", helper: "Dán Shipment ID cần link với task này." },
  { type: TaskExecutionTargetType.PAYMENT, label: "Payment", helper: "Dán Payment ID cần link với task này." },
  { type: TaskExecutionTargetType.SERVICE_REQUEST, label: "Service Request", helper: "Dán Service Request ID cần link với task này." },
  { type: TaskExecutionTargetType.TECHNICAL_ISSUE, label: "Technical Issue", helper: "Dán Technical Issue ID cần link với task này." },
];

function suggestedTarget(task: any): TaskExecutionTargetType {
  const domain = String(task?.domain ?? "").toUpperCase();
  if (domain === "ORDER") return TaskExecutionTargetType.ORDER;
  if (domain === "SHIPMENT") return TaskExecutionTargetType.SHIPMENT;
  if (domain === "PAYMENT") return TaskExecutionTargetType.PAYMENT;
  if (domain === "TECHNICAL_ISSUE") return TaskExecutionTargetType.TECHNICAL_ISSUE;
  if (domain === "SERVICE") return TaskExecutionTargetType.SERVICE_REQUEST;
  return TaskExecutionTargetType.ORDER;
}

function targetIcon(type: TaskExecutionTargetType) {
  if (type === TaskExecutionTargetType.ORDER) return <ReceiptText className="h-4 w-4" />;
  if (type === TaskExecutionTargetType.SHIPMENT) return <Truck className="h-4 w-4" />;
  if (type === TaskExecutionTargetType.PAYMENT) return <WalletCards className="h-4 w-4" />;
  if (type === TaskExecutionTargetType.SERVICE_REQUEST) return <Wrench className="h-4 w-4" />;
  return <Link2 className="h-4 w-4" />;
}

function resolveWatchProduct(task: any) {
  return task?.watch?.product ?? task?.workCase?.watch?.product ?? null;
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
  return Number.isFinite(numberPrice) && numberPrice > 0 ? String(numberPrice) : "";
}

export default function TaskDomainActions({ task, onDone }: Props) {
  const notify = useNotify();
  const [pending, startTransition] = useTransition();

  const [orderOpen, setOrderOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [orderPrice, setOrderPrice] = useState(() => resolveDefaultPrice(task));
  const [orderNote, setOrderNote] = useState("");

  const [linkOpen, setLinkOpen] = useState(false);
  const [targetType, setTargetType] = useState<TaskExecutionTargetType>(() => suggestedTarget(task));
  const [targetId, setTargetId] = useState("");
  const [note, setNote] = useState("");

  const canCreateOrder = Boolean(task?.watchId || task?.watch?.id || task?.workCase?.watch?.id);
  const canCreateService = Boolean(task?.watchId || task?.watch?.id || task?.workCase?.watch?.id);
  const currentTarget = useMemo(
    () => LINK_TARGET_OPTIONS.find((item) => item.type === targetType) ?? LINK_TARGET_OPTIONS[0],
    [targetType],
  );

  function openOrderModal() {
    setOrderPrice(resolveDefaultPrice(task));
    setOrderNote(task?.description ?? "");
    setOrderOpen(true);
  }

  function createOrder() {
    const cleanCustomerName = customerName.trim();
    if (!cleanCustomerName) {
      notify.error("Vui lòng nhập tên khách hàng");
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
        });
        notify.success(`Đã tạo Order${result?.order?.refNo ? ` ${result.order.refNo}` : ""} từ task`);
        setCustomerName("");
        setShipPhone("");
        setOrderPrice("");
        setOrderNote("");
        setOrderOpen(false);
        onDone?.();
      } catch (error: any) {
        notify.error(error?.message || "Không tạo được Order");
      }
    });
  }

  function createService() {
    startTransition(async () => {
      try {
        await createServiceRequestFromTaskAction({
          taskId: task.id,
          note: `Tạo từ task: ${task.title}`,
        });
        notify.success("Đã tạo/link Service Request từ task");
        onDone?.();
      } catch (error: any) {
        notify.error(error?.message || "Không tạo được Service Request");
      }
    });
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

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Thực thi nghiệp vụ</p>
      <h3 className="mt-1 text-base font-semibold text-slate-950">Tạo / link nghiệp vụ từ task</h3>
      <p className="mt-1 text-sm text-slate-500">
        Task chỉ là hướng xử lý. Nghiệp vụ thật vẫn nằm ở Order, Shipment, Payment, Service và được ghi lại thành execution.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canCreateOrder || pending}
          onClick={openOrderModal}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingBag className="h-4 w-4" />
          Tạo Order
        </button>

        <button
          type="button"
          disabled={!canCreateService || pending}
          onClick={createService}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <Wrench className="h-4 w-4" />
          {pending ? "Đang tạo..." : "Tạo Service Request"}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => setLinkOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <Link2 className="h-4 w-4" />
          Link nghiệp vụ đã có
        </button>
      </div>

      {!canCreateOrder ? (
        <p className="mt-3 text-xs text-amber-600">Task cần gắn Watch hoặc Work Case có Watch để tạo Order.</p>
      ) : null}

      {orderOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h4 className="text-base font-semibold text-slate-950">Tạo Order từ task</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Order được tạo ở trạng thái DRAFT, reserve/cọc = NONE. Watch sẽ được HOLD theo rule Order hiện tại.
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

            <div className="space-y-4 px-6 py-5">
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
                  Giá này là giá trị order. Cọc đang để NONE, phù hợp case giao xem thử/không cọc.
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
                <h4 className="text-base font-semibold text-slate-950">Link nghiệp vụ đã có</h4>
                <p className="mt-1 text-sm text-slate-500">Dùng khi người xử lý đã tạo Order/Shipment/Payment ở màn hình nghiệp vụ rồi muốn gắn kết quả về task.</p>
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
                  onChange={(event) => setTargetType(event.target.value as TaskExecutionTargetType)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-slate-400"
                >
                  {LINK_TARGET_OPTIONS.map((item) => (
                    <option key={item.type} value={item.type}>{item.label}</option>
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
                <span className="mt-1 block text-xs font-normal text-slate-400">{currentTarget.helper}</span>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Ghi chú
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Order được tạo để xử lý yêu cầu khách đeo thử không cọc."
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
    </section>
  );
}
