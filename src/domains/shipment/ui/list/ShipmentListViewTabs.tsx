"use client";

import SegmentTabs from "@/domains/shared/ui/list/SegmentTabs";
import type { ShipmentViewKey } from "./types";
import { SHIPMENT_LIST_VIEWS } from "./types";

type Props = {
  value: ShipmentViewKey;
  counts?: Partial<Record<ShipmentViewKey, number>>;
  onChange: (value: ShipmentViewKey) => void;
};

export default function ShipmentListViewTabs({ value, counts, onChange }: Props) {
  return (
    <SegmentTabs
      value={value}
      onChange={onChange}
      items={SHIPMENT_LIST_VIEWS.map((item) => ({
        key: item.key,
        label: item.label,
        count: counts?.[item.key],
      }))}
    />
  );
}
