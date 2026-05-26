"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import ShipmentListRow from "./ShipmentListRow";
import { buildHref } from "./helpers";
import type { ShipmentListItem } from "./types";

export default function ShipmentListTable({
  items,
  total,
  page,
  totalPages,
  pathname,
  searchParams,
  onEdit,
  onDelivered,
  onReturned,
  onReceiveReturn,
  onCreateFee,
}: {
  items: ShipmentListItem[];
  total: number;
  page: number;
  totalPages: number;
  pathname: string;
  searchParams: URLSearchParams;
  onEdit?: (row: ShipmentListItem) => void;
  onCreateFee?: (row: ShipmentListItem) => void;
  onDelivered?: (row: ShipmentListItem) => void;
  onReturned?: (row: ShipmentListItem) => void;
  onReceiveReturn?: (row: ShipmentListItem) => void;
}) {
  return (
    <div className="relative overflow-visible rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-950">Danh sách giao hàng</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            {total} shipment
          </span>
        </div>
      </div>

      <div className="relative overflow-visible">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="w-[15%] px-5 py-4">Shipment</th>
              <th className="w-[11%] px-5 py-4">Order</th>
              <th className="w-[13%] px-5 py-4">Khách hàng</th>
              <th className="w-[23%] px-5 py-4">Địa chỉ</th>
              <th className="w-[13%] px-5 py-4">Vận chuyển</th>
              <th className="w-[10%] px-5 py-4">Trạng thái</th>
              <th className="w-[9%] px-5 py-4 text-right">Phí ship</th>
              <th className="w-[9%] px-5 py-4">Cập nhật</th>
              <th className="w-[7%] px-1 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <ShipmentListRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onCreateFee={onCreateFee}
                onDelivered={onDelivered}
                onReturned={onReturned}
                onReceiveReturn={onReceiveReturn}
              />
            ))}

            {!items.length ? (
              <tr>
                <td colSpan={9} className="px-5 py-14 text-center text-sm text-slate-500">
                  Không có shipment phù hợp.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="relative z-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
        <div>
          Tổng: <b className="text-slate-900">{total}</b> shipment · Trang {page}/{totalPages}
        </div>

        <div className="flex gap-2">
          <Link
            aria-disabled={page <= 1}
            href={buildHref(pathname, searchParams, { page: String(Math.max(1, page - 1)) })}
            className={cn("rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-50", page <= 1 && "pointer-events-none opacity-40")}
          >
            Trước
          </Link>

          <Link
            aria-disabled={page >= totalPages}
            href={buildHref(pathname, searchParams, { page: String(Math.min(totalPages, page + 1)) })}
            className={cn("rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-50", page >= totalPages && "pointer-events-none opacity-40")}
          >
            Sau
          </Link>
        </div>
      </div>
    </div>
  );
}
