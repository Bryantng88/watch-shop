"use client";

import {
  Banknote,
  Boxes,
  ClipboardList,
  ShieldCheck,
  Truck,
  Watch,
} from "lucide-react";

import type { AdminDashboardData } from "../shared";
import DashboardMetricCard from "./DashboardMetricCard";
import { ActionList, DashboardPanel, PipelineList } from "./DashboardPanel";
import RecentActivityList from "./RecentActivityList";
import { ADMIN_OPERATION_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";

function money(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))} VND`;
}

export default function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
  return (
    <main className={ADMIN_OPERATION_CONTENT_CLASS}>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi nhanh watch, đơn hàng, giao hàng, payment và nguồn hàng.
          </p>
        </div>

        <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 ring-1 ring-slate-200 md:block">
          Mission Control
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((item) => <DashboardMetricCard key={item.key} item={item} />)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardPanel
          title="Tài chính"
          subtitle="Tổng quan tiền thu, còn phải thu và COD chờ xử lý."
          totalLabel="Tổng đơn"
          total={data.order.total}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Order value</div>
                  <div className="mt-1 text-xl font-bold">{money(data.finance.orderValue)}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="text-white/50">Đã thu</div>
                  <div className="mt-1 font-semibold">{money(data.finance.paidAmount)}</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="text-white/50">Còn thu</div>
                  <div className="mt-1 font-semibold">{money(data.finance.remainingAmount)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">COD chờ đối soát</div>
                <div className="mt-2 text-xl font-bold text-amber-700">{money(data.finance.collectedCodAmount)}</div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Payment pending</div>
                <div className="mt-2 text-xl font-bold text-slate-700">{money(data.finance.pendingPaymentAmount)}</div>
              </div>
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Cần xử lý" subtitle="Các điểm nghẽn vận hành cần ưu tiên.">
          <ActionList items={[...data.order.actions, ...data.shipment.actions]} />
        </DashboardPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-4">
        <DashboardPanel title="Watch" subtitle="Pipeline sản phẩm." total={data.watch.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Watch className="h-5 w-5" />
          </div>
          <PipelineList items={data.watch.pipeline} />
        </DashboardPanel>

        <DashboardPanel title="Order" subtitle="Trạng thái đơn hàng." total={data.order.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
            <ClipboardList className="h-5 w-5" />
          </div>
          <PipelineList items={data.order.pipeline} />
        </DashboardPanel>

        <DashboardPanel title="Shipment" subtitle="Vận hành giao hàng." total={data.shipment.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
            <Truck className="h-5 w-5" />
          </div>
          <PipelineList items={data.shipment.pipeline} />
        </DashboardPanel>

        <DashboardPanel title="Acquisition" subtitle="Nguồn hàng và phiếu nhập." total={data.acquisition.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Boxes className="h-5 w-5" />
          </div>
          <PipelineList items={data.acquisition.pipeline} />
        </DashboardPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <DashboardPanel title="Watch readiness" subtitle="Content, gallery và review pipeline.">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <PipelineList items={data.watch.readiness} />
        </DashboardPanel>

        <DashboardPanel title="Hoạt động gần đây" subtitle="Các cập nhật mới nhất trong hệ thống.">
          <RecentActivityList items={data.recent} />
        </DashboardPanel>
      </section>

      <div className="mt-6 text-right text-xs text-slate-400">
        Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(data.generatedAt))}
      </div>
    </main>
  );
}
