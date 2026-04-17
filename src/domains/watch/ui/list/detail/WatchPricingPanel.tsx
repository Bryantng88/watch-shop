"use client";

import { BadgeDollarSign } from "lucide-react";
import { CollapsibleSection, TinyStat, fmtMoney } from "./shared";

export default function WatchPricingPanel({ detail, canViewTradeFinancials = false }: { detail: any; canViewTradeFinancials?: boolean; }) {
  return (
    <CollapsibleSection
      title="Pricing"
      desc="Khối giá giống tinh thần product detail."
      icon={<BadgeDollarSign className="h-5 w-5" />}
      defaultOpen
    >
      <div className="grid grid-cols-1 gap-3">
        <TinyStat label="Giá bán" value={fmtMoney(detail?.price?.salePrice)} emphasize />
        <TinyStat label="Giá niêm yết" value={fmtMoney(detail?.price?.listPrice)} />
        {canViewTradeFinancials ? <TinyStat label="Giá mua" value={fmtMoney(detail?.price?.costPrice)} /> : null}
        <TinyStat label="Giá tối thiểu" value={fmtMoney(detail?.price?.minPrice)} />
        <TinyStat label="Service cost" value={fmtMoney(detail?.price?.serviceCost)} />
        <TinyStat label="Landed cost" value={fmtMoney(detail?.price?.landedCost)} />
      </div>
    </CollapsibleSection>
  );
}
