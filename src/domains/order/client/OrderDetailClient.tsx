"use client";

import { useState } from "react";

import GuardNotice from "@/domains/shared/feedback/GuardNotice";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import OrderInventoryNotice from "@/domains/order/shared/OrderInventoryNotice";
import { getOrderInventoryEffect } from "@/domains/order/shared/order-status";
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

type ActionName = "post" | "verify" | "cancel";

export default function OrderDetailClient({ data }: { data: OrderDetailData }) {
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const [busyAction, setBusyAction] = useState<ActionName | null>(null);

  const effect = getOrderInventoryEffect(data.status);
  const firstProductTitle = data.items?.find((item) => item.title)?.title ?? null;

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
    } catch (error: any) {
      notify.error({ title: "Không thể xử lý", message: error?.message || "Thao tác thất bại" });
    } finally {
      progress.hide();
      setBusyAction(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 pt-6 lg:px-6">
      <OrderHeader data={data} />

      <OrderInventoryNotice status={data.status} productTitle={firstProductTitle} compact />

      {effect === "SOLD" ? (
        <GuardNotice
          title="Watch trong đơn này đang được khóa SOLD"
          message="Mọi thay đổi liên quan sản phẩm nên đi qua Order để tránh lệch tồn kho giữa Product/Watch và đơn hàng."
          tone="danger"
          icon="lock"
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <OrderItemsPanel data={data} />
          <OrderCustomerPanel data={data} />
          <OrderTimelinePanel data={data} />
          <OrderNotesPanel data={data} />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-4 xl:col-span-4 xl:self-start">
          <OrderOpsPanel data={data} busyAction={busyAction} onAction={runAction} />
          <OrderFinancialPanel data={data} />
          <OrderStatusPanel data={data} />
        </aside>
      </div>
    </div>
  );
}
