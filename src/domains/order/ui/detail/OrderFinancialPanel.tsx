"use client";
import { ADMIN_DETAIL as detail } from "@/domains/shared/ui/admin-design-contract/AdminDetail";

import { CreditCard } from "lucide-react";
import { fmtMoney, orderTotal, SectionCard, toNumber, type OrderDetailData } from "./shared";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}

export default function OrderFinancialPanel({ data }: { data: OrderDetailData }) {
  const currency = data.currency || "VND";
  const total = orderTotal(data);
  const depositRequired = toNumber(data.depositRequired);
  const paid = toNumber(data.depositPaid);
  const depositGap = Math.max(depositRequired - paid, 0);
  const remaining = Math.max(total - paid, 0);

  return (
    <SectionCard id="order-payment" icon={<CreditCard className="h-5 w-5" />} title="Thanh toán" subtitle="Tổng tiền và khoản đã nhận">
      <div className="space-y-4">
        <div className="space-y-3">
          <Row label="Tạm tính" value={fmtMoney(total, currency)} />
          <Row label="Cọc yêu cầu" value={fmtMoney(depositRequired, currency)} />
          <Row label="Đã nhận" value={fmtMoney(paid, currency)} />
          <Row label="Cọc còn thiếu" value={fmtMoney(depositGap, currency)} />
        </div>

        <div className={detail.focus}>
          <div className={detail.focusLabel}>Còn phải thu</div>
          <div className={detail.focusValue}>{fmtMoney(remaining, currency)}</div>
          <div className={detail.metadata}>
            Số tiền còn lại cần xử lý để hoàn tất tài chính của order.
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
