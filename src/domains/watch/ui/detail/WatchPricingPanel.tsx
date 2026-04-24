"use client";

import { BadgeDollarSign } from "lucide-react";
import { SectionCard, SidebarStat, fmtMoney } from "./shared";

export default function WatchPricingPanel({
  detail,
  canViewTradeFinancials = false,
}: {
  detail: any;
  canViewTradeFinancials?: boolean;
}) {
  const price = detail?.price ?? {};

  const sale = Number(price.salePrice || 0);
  const landed = Number(price.landedCost || 0);
  const cost = Number(price.costPrice || 0);
  const service = Number(price.serviceCost || 0);
  const baseCost = landed > 0 ? landed : cost + service;
  const profit = sale > 0 && baseCost > 0 ? sale - baseCost : null;

  return (
    <SectionCard
      icon={<BadgeDollarSign className="h-5 w-5" />}
      title="Pricing"
      subtitle="Giá bán, giá sàn và chi phí vận hành."
      defaultOpen
    >
      <div className="space-y-3">
        <SidebarStat
          label="Giá bán"
          value={fmtMoney(price.salePrice)}
          emphasize
        />

        <SidebarStat
          label="Giá sàn"
          value={fmtMoney(price.minPrice)}
        />

        {canViewTradeFinancials ? (
          <>
            <div className="my-4 border-t border-slate-200" />

            <SidebarStat label="Giá mua" value={fmtMoney(price.costPrice)} />
            <SidebarStat label="Service cost" value={fmtMoney(price.serviceCost)} />
            <SidebarStat label="Landed cost" value={fmtMoney(price.landedCost)} />
            <SidebarStat
              label="Lãi gộp tạm tính"
              value={profit == null ? "-" : fmtMoney(profit)}
            />
          </>
        ) : null}
        {price.pricingNote ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Pricing note
            </div>
            <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {price.pricingNote}
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}