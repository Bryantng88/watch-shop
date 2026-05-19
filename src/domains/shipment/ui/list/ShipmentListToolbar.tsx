"use client";

import { Truck } from "lucide-react";

export default function ShipmentListToolbar({ total }: { total: number }) {
  return (
    <div className="flex flex-col gap-4 px-1 py-1 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-slate-950">Danh sách shipment</h1>
        <p className="mt-2 text-sm text-slate-500">
          Theo dõi giao hàng, tạo phí ship, xác nhận COD, hoàn tất giao hàng hoặc hoàn trả.
        </p>
      </div>

      <div className="inline-flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4 self-start">
        <Truck className="h-4 w-4 text-slate-400" />
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Tổng shipment</div>
        <div className="text-xl font-semibold leading-none text-slate-950">{total}</div>
      </div>
    </div>
  );
}
