"use client";
import React from "react";
import Link from "next/link";
import type { OrderServicesDraft } from "./service-order-contract";
const money = (value: string | number) =>
  new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
export default function OrderServicesDraftReview({
  draft,
  busy,
  onApprove,
}: {
  draft: OrderServicesDraft;
  busy: boolean;
  onApprove: () => void;
}) {
  return (
    <section
      aria-label="Duyệt dịch vụ bổ sung"
      className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm"
    >
      <h3 className="font-semibold">
        Thêm dịch vụ ·{" "}
        <Link
          className="text-blue-700 underline"
          href={"/admin/orders/" + encodeURIComponent(draft.plan.orderId)}
        >
          {draft.orderReference}
        </Link>
        {draft.customerName ? ` · ${draft.customerName}` : ""}
      </h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {draft.rows.map((r) => (
          <li
            key={r.parentOrderItemId + ":" + r.serviceCatalogId}
            className="py-2"
          >
            <span className="block text-xs text-slate-500">{r.watchLabel}</span>
            <span>
              {r.serviceName} · {money(r.price)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-medium">
        Thêm {money(draft.increase)} · Tổng đơn {money(draft.afterSubtotal)}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Giữ các dịch vụ hiện có. Đơn đã post sẽ tạo phiếu kỹ thuật cho dịch vụ
        mới; đơn nháp chờ post. Chưa ghi nhận thu tiền. Chỉnh chiếc đồng hồ,
        dịch vụ hoặc giá bằng tin nhắn trước khi duyệt.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onApprove}
        className="mt-3 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Đang cập nhật…" : `Thêm ${draft.rows.length} dịch vụ`}
      </button>
    </section>
  );
}
