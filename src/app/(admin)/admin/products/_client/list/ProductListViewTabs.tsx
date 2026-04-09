"use client";

import type { Counts, ViewKey } from "./types";

const items: Array<{ key: ViewKey; label: string }> = [
  { key: "draft", label: "Chờ duyệt" },
  { key: "all", label: "Tất cả" },
  { key: "posted", label: "Đã post" },
  { key: "in_service", label: "Chờ service" },
  { key: "hold", label: "Ký gửi / Giữ hàng" },
  { key: "sold", label: "Đã bán" },
];

type Props = {
  value: ViewKey;
  counts: Counts;
  onChange: (value: ViewKey) => void;
};

function getCount(counts: Counts, key: ViewKey) {
  switch (key) {
    case "all":
      return counts.all;
    case "draft":
      return counts.draft;
    case "posted":
      return counts.posted;
    case "in_service":
      return counts.in_service;
    case "hold":
      return counts.hold;
    case "sold":
      return counts.sold;
    default:
      return 0;
  }
}

export default function ProductListViewTabs({
  value,
  counts,
  onChange,
}: Props) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex min-w-max items-center gap-6 overflow-x-auto">
        {items.map((item) => {
          const active = item.key === value;
          const count = getCount(counts, item.key);

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={[
                "relative inline-flex h-12 shrink-0 items-center whitespace-nowrap text-sm transition",
                active
                  ? "font-semibold text-slate-950"
                  : "font-medium text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              <span>{item.label}</span>
              <span
                className={[
                  "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                  active
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-400",
                ].join(" ")}
              >
                {count}
              </span>

              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}