"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreditCard, PackageCheck, ShieldCheck, Truck, UserRound, XCircle } from "lucide-react";

import GuardNotice from "@/domains/shared/feedback/GuardNotice";
import InlineNotice from "@/domains/shared/feedback/InlineNotice";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";
import OrderInventoryNotice from "@/old_files/orderOLD/shared/OrderInventoryNotice";
import OrderPageHeader from "@/old_files/orderOLD/ui/OrderPageHeader";
import OrderStatusBadge from "@/old_files/orderOLD/ui/OrderStatusBadge";
import { cx, fmtDate, fmtMoney, sourceLabel, verificationLabel } from "@/old_files/orderOLD/ui/order-ui.helpers";
import { getOrderInventoryEffect } from "@/old_files/orderOLD/shared/order-status";

type OrderDetailItem = {
  id: string;
  title: string;
  quantity: number;
  kind?: string | null;
  listPrice: number;
  unitPriceAgreed?: number | null;
  subtotal?: number | null;
  img?: string | null;
  productId?: string | null;
  variantId?: string | null;
  serviceScope?: string | null;
  customerItemNote?: string | null;
  linkedProductTitle?: string | null;
};

type OrderDetailData = {
  id: string;
  refNo?: string | null;
  status: string;
  source?: string | null;
  verificationStatus?: string | null;
  reserveType?: string | null;
  reserveUntil?: string | null;
  customerName?: string | null;
  shipPhone?: string | null;
  shipAddress?: string | null;
  shipWard?: string | null;
  shipDistrict?: string | null;
  shipCity?: string | null;
  paymentMethod?: string | null;
  depositRequired?: number | null;
  depositPaid?: number | null;
  hasShipment?: boolean | null;
  currency?: string | null;
  subtotal?: number | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  items: OrderDetailItem[];
};

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">{label}</div>
      <div className={cx("mt-1 text-sm text-slate-900", mono && "font-mono text-[13px]")}>{value}</div>
    </div>
  );
}

export default function OrderDetailClient({ data }: { data: OrderDetailData }) {
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const currency = data.currency || "VND";
  const effect = getOrderInventoryEffect(data.status);
  const fullAddress = useMemo(() => [data.shipAddress, data.shipWard, data.shipDistrict, data.shipCity].filter(Boolean).join(", ") || "-", [data.shipAddress, data.shipWard, data.shipDistrict, data.shipCity]);
  const depositRequired = Number(data.depositRequired || 0);
  const depositPaid = Number(data.depositPaid || 0);
  const remainingDeposit = Math.max(depositRequired - depositPaid, 0);
  const canPost = data.status === "DRAFT" || data.status === "RESERVED";
  const canVerify = data.source === "WEB" && data.verificationStatus === "PENDING";
  const canCancel = data.status !== "CANCELLED" && data.status !== "COMPLETED";

  async function runAction(action: "post" | "verify" | "cancel") {
    const config = {
      post: {
        url: `/api/admin/orders/${data.id}/post`,
        title: "Duyệt đơn hàng?",
        message: "Sau khi duyệt, watch trong đơn sẽ chuyển sang SOLD.",
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

    const ok = await dialog.confirm({ tone: action === "cancel" ? "danger" : "warning", title: config.title, message: config.message, confirmText: config.confirmText });
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
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 pt-6 lg:px-6">
      <OrderPageHeader
        eyebrow="Order detail"
        title={data.refNo?.trim() || "Đơn hàng chưa phát sinh mã"}
        description={<span>Mã hệ thống: <span className="font-mono text-slate-700">{data.id}</span></span>}
        backHref="/admin/orders"
        backLabel="← Danh sách đơn hàng"
        actions={
          <>
            <Link href={`/admin/orders/${data.id}/edit`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Chỉnh sửa</Link>
            <OrderStatusBadge status={data.status} />
          </>
        }
      />

      <OrderInventoryNotice status={data.status} />
      {effect === "SOLD" ? (
        <GuardNotice title="Watch trong đơn này đang được khóa SOLD" message="Mọi thay đổi liên quan sản phẩm nên đi qua Order để tránh lệch tồn kho giữa Product/Watch và đơn hàng." tone="danger" icon="lock" />
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <SectionCard icon={<UserRound className="h-5 w-5" />} title="Khách hàng" subtitle="Thông tin người mua và giao nhận">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Khách hàng" value={data.customerName || "-"} />
              <Field label="Điện thoại" value={data.shipPhone || "-"} />
              <Field label="Thanh toán" value={data.paymentMethod || "-"} />
              <Field label="Shipment" value={data.hasShipment ? "Có giao hàng" : "Không"} />
              <div className="md:col-span-2 xl:col-span-4"><Field label="Địa chỉ" value={fullAddress} /></div>
            </div>
          </SectionCard>

          <SectionCard icon={<PackageCheck className="h-5 w-5" />} title="Sản phẩm / dịch vụ" subtitle={`${data.items?.length || 0} dòng trong đơn`}>
            <div className="space-y-3">
              {data.items?.length ? data.items.map((item) => {
                const lineTotal = Number(item.subtotal ?? item.unitPriceAgreed ?? item.listPrice ?? 0) * Number(item.quantity || 1);
                return (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{item.kind || "PRODUCT"}</span>
                          {item.productId ? <span className="font-mono text-xs text-slate-400">{item.productId}</span> : null}
                        </div>
                        <div className="mt-2 text-base font-semibold text-slate-950">{item.title}</div>
                        {item.customerItemNote ? <div className="mt-1 text-sm text-slate-500">{item.customerItemNote}</div> : null}
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                        <div className="text-xs text-slate-500">Thành tiền</div>
                        <div className="mt-1 text-base font-semibold text-slate-950">{fmtMoney(lineTotal, currency)}</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <Field label="SL" value={item.quantity} />
                      <Field label="Giá niêm yết" value={fmtMoney(item.listPrice, currency)} />
                      <Field label="Giá chốt" value={fmtMoney(item.unitPriceAgreed ?? item.listPrice, currency)} />
                      <Field label="Line total" value={fmtMoney(lineTotal, currency)} />
                    </div>
                  </div>
                );
              }) : <InlineNotice title="Đơn chưa có sản phẩm" tone="warning" />}
            </div>
          </SectionCard>

          <SectionCard icon={<Truck className="h-5 w-5" />} title="Ghi chú nội bộ" subtitle="Lưu ý vận hành đơn hàng">
            <div className="min-h-[120px] whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{data.notes?.trim() || "Chưa có ghi chú."}</div>
          </SectionCard>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          <SectionCard icon={<CreditCard className="h-5 w-5" />} title="Thanh toán" subtitle="Tổng tiền và cọc">
            <div className="space-y-3">
              <Field label="Tạm tính" value={fmtMoney(data.subtotal, currency)} />
              <Field label="Cọc yêu cầu" value={fmtMoney(depositRequired, currency)} />
              <Field label="Đã nhận cọc" value={fmtMoney(depositPaid, currency)} />
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <div className="text-xs text-white/60">Cọc còn thiếu</div>
                <div className="mt-1 text-sm font-semibold">{fmtMoney(remainingDeposit, currency)}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Trạng thái" subtitle="Nguồn đơn và xác minh">
            <div className="space-y-3">
              <Field label="Order status" value={<OrderStatusBadge status={data.status} />} />
              <Field label="Inventory effect" value={effect} />
              <Field label="Nguồn" value={sourceLabel(data.source)} />
              <Field label="Xác minh" value={verificationLabel(data.verificationStatus)} />
              <Field label="Tạo lúc" value={fmtDate(data.createdAt)} />
              <Field label="Cập nhật" value={fmtDate(data.updatedAt)} />
            </div>
          </SectionCard>

          <SectionCard icon={<XCircle className="h-5 w-5" />} title="Thao tác" subtitle="Tất cả action sẽ đi qua order domain">
            <div className="space-y-3">
              <Button type="button" className="w-full" disabled={!canPost || busyAction != null} onClick={() => runAction("post")}>{busyAction === "post" ? "Đang duyệt..." : "Duyệt đơn"}</Button>
              <Button type="button" variant="outline" className="w-full" disabled={!canVerify || busyAction != null} onClick={() => runAction("verify")}>{busyAction === "verify" ? "Đang xác minh..." : "Verify đơn web"}</Button>
              <Button type="button" variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50" disabled={!canCancel || busyAction != null} onClick={() => runAction("cancel")}>{busyAction === "cancel" ? "Đang hủy..." : "Hủy đơn"}</Button>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
