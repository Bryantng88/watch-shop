"use client";

import ToolbarCountChip from "@/components/_shared/ToolbarCountChip";
import type { Counts, ViewKey } from "./types";

const tabs: Array<{ key: ViewKey; label: string }> = [
  { key: "draft", label: "Chờ duyệt" },
  { key: "all", label: "Tất cả" },
  { key: "posted", label: "Đã post" },
  { key: "in_service", label: "Chờ service" },
  { key: "hold", label: "Ký gửi / Giữ hàng" },
  { key: "sold", label: "Đã bán" },
];

export default function ProductListViewTabs({
  value,
  counts,
  onChange,
}: {
  value: ViewKey;
  counts: Counts;
  onChange: (next: ViewKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <ToolbarCountChip
          key={tab.key}
          label={tab.label}
          count={counts[tab.key] ?? 0}
          active={value === tab.key}
          onClick={() => onChange(tab.key)}
        />
      ))}
    </div>
  );
}
