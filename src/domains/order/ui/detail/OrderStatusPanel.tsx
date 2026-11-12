"use client";

import { ShieldCheck } from "lucide-react";
import { sourceLabel, verificationLabel } from "@/domains/order/ui/order-ui.helpers";
import { getOrderInventoryEffect } from "@/domains/order/shared/order-status";
import { DetailText, fmtDate, InventoryEffectBadge, OrderStateBadge, SectionCard, type OrderDetailData } from "./shared";

export default function OrderStatusPanel({ data }: { data: OrderDetailData }) {
  const effect = getOrderInventoryEffect(data.status);

  return (
    <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Trạng thái" subtitle="Nguồn đơn và tác động tồn kho">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <DetailText label="Đơn hàng" value={<OrderStateBadge status={data.status} />} />
          <DetailText label="Tồn kho" value={<InventoryEffectBadge status={data.status} />} />
          <DetailText label="Nguồn" value={sourceLabel(data.source)} />
          <DetailText label="Xác minh" value={verificationLabel(data.verificationStatus)} />
          <DetailText label="Tạo lúc" value={fmtDate(data.createdAt)} />
          <DetailText label="Cập nhật" value={fmtDate(data.updatedAt)} />
        </div>

        <div className="text-xs leading-5 text-slate-500">
          {effect === "HOLD"
            ? "Order này đang giữ watch và sẽ chặn quick order khác cho cùng sản phẩm."
            : effect === "SOLD"
              ? "Order này đã khóa SOLD. Mọi thay đổi tồn kho nên đi qua action của order."
              : "Order này không còn giữ hoặc khóa tồn kho."}
        </div>
      </div>
    </SectionCard>
  );
}
