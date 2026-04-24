"use client";

import { Clock3, Settings2 } from "lucide-react";
import { DetailField, SectionCard, SidebarStat } from "./shared";

export function WatchOverviewPanel({ detail }: { detail: any }) {
  const spec = detail?.spec ?? {};
  const watch = detail?.watch ?? {};

  return (
    <SectionCard
      title="Spec & vật liệu"
      subtitle="Snapshot spec chính của watch."
      icon={<Settings2 className="h-5 w-5" />}
      defaultOpen
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <DetailField label="Model" value={spec.model || "-"} />
        <DetailField label="Reference" value={spec.referenceNumber || "-"} />
        <DetailField label="Nickname" value={spec.nickname || "-"} />
        <DetailField label="Case shape" value={spec.caseShape || "-"} />
        <DetailField label="Case size" value={spec.caseSizeMM ? `${spec.caseSizeMM} mm` : "-"} />
        <DetailField label="Lug to lug" value={spec.lugToLugMM ? `${spec.lugToLugMM} mm` : "-"} />
        <DetailField label="Thickness" value={spec.thicknessMM ? `${spec.thicknessMM} mm` : "-"} />
        <DetailField label="Dial" value={spec.dialColor || "-"} />
        <DetailField label="Crystal" value={spec.crystal || "-"} />
        <DetailField label="Calibre" value={spec.calibre || watch.movementCalibre || "-"} />
        <DetailField label="Movement" value={watch.movementType || spec.movementType || "-"} />
        <DetailField label="Serial" value={watch.serialNumber || "-"} mono />
        <DetailField label="Year text" value={watch.yearText || "-"} />
        <DetailField label="Material profile" value={spec.materialProfile || "-"} />
        <DetailField label="Primary material" value={spec.primaryCaseMaterial || "-"} />
        <DetailField label="Secondary material" value={spec.secondaryCaseMaterial || "-"} />
        <DetailField label="Gold treatment" value={spec.goldTreatment || "-"} />
        <DetailField
          label="Gold color"
          value={Array.isArray(spec.goldColors) ? spec.goldColors.join(", ") || "-" : "-"}
        />
        <DetailField label="Gold karat" value={spec.goldKarat || "-"} />
        <DetailField label="Bracelet type" value={spec.braceletType || "-"} />
        <DetailField label="Buckle type" value={spec.buckleType || "-"} />
      </div>
    </SectionCard>
  );
}

export function WatchOpsPanel({ detail }: { detail: any }) {
  const watch = detail?.watch ?? {};

  return (
    <SectionCard
      title="Tổng quan vận hành"
      subtitle="Những trạng thái cần nhìn nhanh."
      icon={<Clock3 className="h-5 w-5" />}
      defaultOpen
    >
      <div className="space-y-3">
        <SidebarStat label="Product status" value={detail?.status || "-"} />
        <SidebarStat label="Sale state" value={watch.saleState || "-"} />
        <SidebarStat label="Service state" value={watch.serviceState || "-"} />
        <SidebarStat label="Stock state" value={watch.stockState || "-"} />
        <SidebarStat label="Gender" value={watch.gender || "-"} />
        <SidebarStat label="Site channel" value={watch.siteChannel || "-"} />
      </div>
    </SectionCard>
  );
}