"use client";

import { Clock3, Settings2 } from "lucide-react";
import { CollapsibleSection, Field, TinyStat } from "./shared";

export function WatchOverviewPanel({ detail }: { detail: any }) {
  return (
    <CollapsibleSection
      title="Thông số & cấu hình"
      desc="Snapshot chính của watch."
      icon={<Settings2 className="h-5 w-5" />}
      defaultOpen
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Model" value={detail?.spec?.model || "-"} />
        <Field label="Reference" value={detail?.spec?.referenceNumber || "-"} />
        <Field label="Nickname" value={detail?.spec?.nickname || "-"} />
        <Field label="Case shape" value={detail?.spec?.caseShape || "-"} />
        <Field label="Case size" value={detail?.spec?.caseSizeMM ? `${detail.spec.caseSizeMM} mm` : "-"} />
        <Field label="Lug to lug" value={detail?.spec?.lugToLugMM ? `${detail.spec.lugToLugMM} mm` : "-"} />
        <Field label="Lug width" value={detail?.spec?.lugWidthMM ? `${detail.spec.lugWidthMM} mm` : "-"} />
        <Field label="Thickness" value={detail?.spec?.thicknessMM ? `${detail.spec.thicknessMM} mm` : "-"} />
        <Field label="Dial" value={detail?.spec?.dialColor || "-"} />
        <Field label="Crystal" value={detail?.spec?.crystal || "-"} />
        <Field label="Calibre" value={detail?.spec?.calibre || detail?.watch?.movementCalibre || "-"} />
        <Field label="Movement" value={detail?.watch?.movementType || "-"} />
        <Field label="Serial" value={detail?.watch?.serialNumber || "-"} mono />
        <Field label="Year text" value={detail?.watch?.yearText || "-"} />
        <Field label="Primary material" value={detail?.spec?.primaryCaseMaterial || "-"} />
        <Field label="Secondary material" value={detail?.spec?.secondaryCaseMaterial || "-"} />
        <Field label="Material profile" value={detail?.spec?.materialProfile || "-"} />
        <Field label="Gold treatment" value={detail?.spec?.goldTreatment || "-"} />
        <Field label="Gold color" value={Array.isArray(detail?.spec?.goldColors) ? detail.spec.goldColors.join(", ") || "-" : "-"} />
        <Field label="Gold karat" value={detail?.spec?.goldKarat || "-"} />
      </div>
    </CollapsibleSection>
  );
}

export function WatchOpsPanel({ detail }: { detail: any }) {
  return (
    <CollapsibleSection
      title="Tổng quan vận hành"
      desc="Những điểm cần nhìn nhanh giống product detail."
      icon={<Clock3 className="h-5 w-5" />}
      defaultOpen
    >
      <div className="grid grid-cols-1 gap-3">
        <TinyStat label="Product status" value={detail?.status || "-"} />
        <TinyStat label="Sale state" value={detail?.watch?.saleState || "-"} />
        <TinyStat label="Service state" value={detail?.watch?.serviceState || "-"} />
        <TinyStat label="Stock state" value={detail?.watch?.stockState || "-"} />
        <TinyStat label="Giới tính" value={detail?.watch?.gender || "-"} />
        <TinyStat label="Site channel" value={detail?.watch?.siteChannel || "-"} />
      </div>
    </CollapsibleSection>
  );
}
