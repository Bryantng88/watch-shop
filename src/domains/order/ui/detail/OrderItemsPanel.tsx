"use client";

import Image from "next/image";
import { ImageIcon, PackageCheck } from "lucide-react";
import {
  buildMediaUrl,
  EmptyState,
  fmtMoney,
  itemLineTotal,
  SectionCard,
  type OrderDetailData,
} from "./shared";

export default function OrderItemsPanel({ data }: { data: OrderDetailData }) {
  const currency = data.currency || "VND";
  const items = data.items ?? [];

  return (
    <SectionCard
      icon={<PackageCheck className="h-5 w-5" />}
      title="Sản phẩm / dịch vụ"
      subtitle={`${items.length} dòng trong đơn`}
    >
      {items.length ? (
        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_70px_140px] gap-3 border-b border-slate-100 bg-slate-50 py-3 text-xs font-medium text-slate-500">
            <div>Sản phẩm</div>
            <div className="hidden text-right sm:block">Số lượng</div>
            <div className="text-right">Thành tiền</div>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const imageSrc = buildMediaUrl(item.img);
              const unitPrice = Number(item.unitPriceAgreed ?? item.listPrice ?? 0);
              const lineTotal = itemLineTotal(item);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_70px_140px] items-center gap-3 py-3 transition hover:bg-slate-50/70"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {imageSrc ? (
                        <Image src={imageSrc} alt={item.title} width={56} height={56} unoptimized className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {item.kind === "SERVICE" ? "Dịch vụ" : "Sản phẩm"}
                        </span>
                        {item.variantId ? (
                          <span className="truncate font-mono text-[11px] text-slate-400">
                            {item.variantId}
                          </span>
                        ) : null}
                      </div>

                      <div title={item.title} className="mt-1 truncate text-sm font-semibold tabular-nums text-slate-950">
                        {item.title}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>{item.quantity} × {fmtMoney(unitPrice, currency)}</span>
                        {item.listPrice != null ? <span className="hidden sm:inline">Niêm yết: {fmtMoney(item.listPrice, currency)}</span> : null}
                        {item.linkedProductTitle ? <span className="truncate">{item.linkedProductTitle}</span> : null}
                        {item.serviceScope ? <span>{item.serviceScope === "CUSTOMER_OWNED" ? "Đồng hồ khách gửi" : item.serviceScope === "WITH_PURCHASE" ? "Kèm sản phẩm" : item.serviceScope}</span> : null}
                      </div>

                      {item.customerItemNote ? (
                        <div className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                          {item.customerItemNote}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-semibold tabular-nums text-slate-950">{item.quantity}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums text-slate-950">
                      {fmtMoney(lineTotal, currency)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState text="Đơn chưa có sản phẩm." />
      )}
    </SectionCard>
  );
}
