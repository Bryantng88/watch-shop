"use client";

import { UserRound } from "lucide-react";
import { DetailText, fullAddress, SectionCard, type OrderDetailData } from "./shared";

const PAYMENT_METHOD_LABELS: Record<string, string> = { BANK_TRANSFER: "Chuyển khoản", CASH: "Tiền mặt", COD: "Thu hộ COD" };

export default function OrderCustomerPanel({ data }: { data: OrderDetailData }) {
  return (
    <SectionCard icon={<UserRound className="h-5 w-5" />} title="Khách hàng" subtitle="Thông tin người mua và giao nhận">
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        <DetailText label="Khách hàng" value={data.customerName || "-"} />
        <DetailText label="Điện thoại" value={data.shipPhone || "-"} />
        <DetailText label="Thanh toán" value={PAYMENT_METHOD_LABELS[data.paymentMethod || ""] || data.paymentMethod || "-"} />
        <DetailText label="Giao hàng" value={data.hasShipment ? "Có giao hàng" : "Không giao hàng"} />
        <div className="md:col-span-2">
          <DetailText label="Địa chỉ" value={fullAddress(data)} />
        </div>
      </div>
    </SectionCard>
  );
}
