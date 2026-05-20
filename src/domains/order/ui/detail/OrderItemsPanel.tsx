"use client";

import { ImageIcon, PackageCheck } from "lucide-react";
import { buildMediaUrl, EmptyState, fmtMoney, itemLineTotal, SectionCard, SoftMetric, type OrderDetailData } from "./shared";

export default function OrderItemsPanel({ data }: { data: OrderDetailData }) {
  const currency = data.currency || "VND";
  const items = data.items ?? [];

  return (
    <SectionCard icon={<PackageCheck className="h-5 w-5" />} title="Sản phẩm / dịch vụ" subtitle={`${items.length} dòng trong đơn`}>
      {items.length ? (
        <div className="space-y-4">
          {items.map((item) => {
            const imageSrc = buildMediaUrl(item.img);
            const unitPrice = Number(item.unitPriceAgreed ?? item.listPrice ?? 0);
            const lineTotal = itemLineTotal(item);

            return (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      {imageSrc ? (
                        <img src={imageSrc} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {item.kind || "PRODUCT"}
                        </span>
                        {item.productId ? <span className="font-mono text-xs text-slate-400">{item.productId}</span> : null}
                      </div>

                      <div className="mt-2 text-base font-semibold text-slate-950">{item.title}</div>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                        {item.linkedProductTitle ? <span>{item.linkedProductTitle}</span> : null}
                        {item.variantId ? <span className="font-mono text-xs">Variant: {item.variantId}</span> : null}
                        {item.serviceScope ? <span>{item.serviceScope}</span> : null}
                      </div>

                      {item.customerItemNote ? (
                        <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">
                          {item.customerItemNote}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-slate-950 px-5 py-4 text-right text-white lg:min-w-[180px]">
                    <div className="text-xs text-white/60">Thành tiền</div>
                    <div className="mt-1 text-xl font-semibold tracking-tight">{fmtMoney(lineTotal, currency)}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <SoftMetric label="Số lượng" value={item.quantity} />
                  <SoftMetric label="Giá niêm yết" value={fmtMoney(item.listPrice, currency)} />
                  <SoftMetric label="Giá chốt" value={fmtMoney(unitPrice, currency)} />
                  <SoftMetric label="Line total" value={fmtMoney(lineTotal, currency)} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState text="Đơn chưa có sản phẩm." />
      )}
    </SectionCard>
  );
}
