"use client";
import { ADMIN_REPORT as reportStyles, ADMIN_REPORT_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminReport";
import { AdminMoney } from "@/domains/shared/ui/admin-design-contract/AdminMoney";
import { AdminWorkspaceHeading } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceHeading";

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

function money(value: number) { return <AdminMoney amount={value}/>; }

export default function AdminDashboardClient({ data, embedded = false }: { data: AdminDashboardData; embedded?: boolean }) {
  return (
    <main style={ADMIN_REPORT_STYLE} className={`${reportStyles.report} ${embedded ? "min-w-0 space-y-4" : ADMIN_OPERATION_CONTENT_CLASS}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {embedded ? <AdminWorkspaceHeading>Báo cáo tổng quan</AdminWorkspaceHeading> : <h1 className="text-3xl font-bold tracking-tight text-slate-950">Báo cáo tổng quan</h1>}
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi nhanh watch, đơn hàng, giao hàng, payment và nguồn hàng.
          </p>
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
            <div className="rounded-lg bg-slate-50 p-5 text-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Giá trị đơn hàng</div>
                  <div className="mt-1 text-xl font-bold">{money(data.finance.orderValue)}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-100 p-3">
                  <div className="text-slate-500">Đã thu</div>
                  <div className="mt-1 font-semibold">{money(data.finance.paidAmount)}</div>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <div className="text-slate-500">Còn thu</div>
                  <div className="mt-1 font-semibold">{money(data.finance.remainingAmount)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">COD chờ đối soát</div>
                <div className="mt-2 text-xl font-bold text-amber-700">{money(data.finance.collectedCodAmount)}</div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Thanh toán chờ xử lý</div>
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
        <DashboardPanel title="Đồng hồ" subtitle="Pipeline sản phẩm." total={data.watch.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Watch className="h-5 w-5" />
          </div>
          <PipelineList items={data.watch.pipeline} />
        </DashboardPanel>

        <DashboardPanel title="Đơn hàng" subtitle="Trạng thái đơn hàng." total={data.order.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
            <ClipboardList className="h-5 w-5" />
          </div>
          <PipelineList items={data.order.pipeline} />
        </DashboardPanel>

        <DashboardPanel title="Giao hàng" subtitle="Vận hành giao hàng." total={data.shipment.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-100">
            <Truck className="h-5 w-5" />
          </div>
          <PipelineList items={data.shipment.pipeline} />
        </DashboardPanel>

        <DashboardPanel title="Phiếu nhập" subtitle="Nguồn hàng và phiếu nhập." total={data.acquisition.total}>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Boxes className="h-5 w-5" />
          </div>
          <PipelineList items={data.acquisition.pipeline} />
        </DashboardPanel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <DashboardPanel title="Mức độ sẵn sàng" subtitle="Content, gallery và review pipeline.">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
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
