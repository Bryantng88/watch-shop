"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
  selectedCount: number;
};

export default function OrderListToolbar({ selectedCount }: Props) {
  return (
    <div className="flex flex-col gap-4 px-1 py-1 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
          Danh sách đơn hàng
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Quản lý đơn hàng, xác minh, xử lý giao hàng và đồng bộ trạng thái watch.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start">
        <div className="inline-flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Đã chọn
          </div>
          <div className="text-xl font-semibold leading-none text-slate-950">
            {selectedCount}
          </div>
        </div>

        <Link
          href="/admin/orders/new"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Tạo đơn hàng
        </Link>
      </div>
    </div>
  );
}
