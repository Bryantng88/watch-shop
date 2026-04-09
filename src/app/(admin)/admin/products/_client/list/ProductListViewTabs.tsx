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
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-max items-center rounded-2xl bg-slate-100 p-1">
        {items.map((item) => {
          const active = item.key === value;
          const count = getCount(counts, item.key);

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={[
                "inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm transition",
                active
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className={active ? "font-semibold" : "font-medium"}>
                {item.label}
              </span>

              <span
                className={[
                  "inline-flex min-w-[22px] items-center justify-center rounded-full px-2 py-0.5 text-[11px]",
                  active
                    ? "bg-slate-950 text-white"
                    : "bg-white/80 text-slate-500",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}