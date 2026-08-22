"use client";

import { useState } from "react";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  OrderCustomerPanel,
  OrderFinancialPanel,
  OrderHeader,
  OrderItemsPanel,
  OrderNotesPanel,
  OrderOpsPanel,
  OrderStatusPanel,
  OrderTimelinePanel,
  type OrderDetailData,
} from "@/domains/order/ui/detail";
import { ADMIN_DETAIL_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";

type ActionName = "post" | "verify" | "cancel";

export default function OrderDetailClient({ data }: { data: OrderDetailData }) {
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const [busyAction, setBusyAction] = useState<ActionName | null>(null);

  async function runAction(action: ActionName) {
    const config = {
      post: {
        url: `/api/admin/orders/${data.id}/post`,
        title: "Duyệt đơn hàng?",
        message: "Sau khi duyệt, order tiếp tục giữ watch. Watch chỉ chuyển SOLD khi order hoàn tất theo flow.",
        confirmText: "Duyệt đơn",
        loading: "Đang duyệt đơn",
        success: "Đã duyệt đơn và đồng bộ watch.",
      },
      verify: {
        url: `/api/admin/orders/${data.id}/verify`,
        title: "Xác minh đơn web?",
        message: "Đơn web sẽ được đánh dấu đã xác minh.",
        confirmText: "Xác minh",
        loading: "Đang xác minh",
        success: "Đã xác minh đơn hàng.",
      },
      cancel: {
        url: `/api/admin/orders/${data.id}/cancel`,
        title: "Hủy đơn hàng?",
        message: "Nếu không còn order active khác, watch liên quan sẽ được release khỏi HOLD/SOLD.",
        confirmText: "Hủy đơn",
        loading: "Đang hủy đơn",
        success: "Đã hủy đơn và đồng bộ lại trạng thái watch.",
      },
    }[action];

    const ok = await dialog.confirm({
      tone: action === "cancel" ? "danger" : "warning",
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
    });

    if (!ok) return;

    setBusyAction(action);
    progress.show({ title: config.loading, message: "Đang xử lý qua order domain" });

    try {
      const res = await fetch(config.url, { method: "POST" });
      if (!res.ok) throw new Error(await res.text().catch(() => "Thao tác thất bại"));

      notify.success({ title: "Thành công", message: config.success });
      window.location.reload();
    } catch (error: unknown) {
      notify.error({ title: "Không thể xử lý", message: error instanceof Error ? error.message : "Thao tác thất bại" });
    } finally {
      progress.hide();
      setBusyAction(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
    <div className={`${ADMIN_DETAIL_CONTENT_CLASS} max-w-[1500px] space-y-4`}>
      <OrderHeader data={data} />

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <OrderItemsPanel data={data} />
          <OrderCustomerPanel data={data} />
          <OrderTimelinePanel data={data} />
          <OrderNotesPanel data={data} />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[76px] xl:self-start">
          <OrderOpsPanel data={data} busyAction={busyAction} onAction={runAction} />
          <OrderFinancialPanel data={data} />
          <OrderStatusPanel data={data} />
        </aside>
      </div>
    </div>
    </main>
  );
}
