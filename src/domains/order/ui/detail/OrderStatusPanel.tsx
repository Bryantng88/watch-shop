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
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-1">
          <DetailText label="Order status" value={<OrderStateBadge status={data.status} />} />
          <DetailText label="Inventory effect" value={<InventoryEffectBadge status={data.status} />} />
          <DetailText label="Nguồn" value={sourceLabel(data.source)} />
          <DetailText label="Xác minh" value={verificationLabel(data.verificationStatus)} />
          <DetailText label="Tạo lúc" value={fmtDate(data.createdAt)} />
          <DetailText label="Cập nhật" value={fmtDate(data.updatedAt)} />
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">
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
