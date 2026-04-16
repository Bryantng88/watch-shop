"use client";

import type { CatalogKey } from "./types";

type Props = {
  selectedCount: number;
  catalog: CatalogKey;
  onCatalogChange: (value: CatalogKey) => void;
};

export default function ProductListToolbar({
  selectedCount,
  catalog,
  onCatalogChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 px-1 py-1 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
            Danh sách sản phẩm
          </h1>

          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => onCatalogChange("product")}
              className={[
                "rounded-full px-3 py-1.5 text-sm transition",
                catalog === "product"
                  ? "bg-white font-semibold text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              Sản phẩm
            </button>

            <button
              type="button"
              onClick={() => onCatalogChange("strap")}
              className={[
                "rounded-full px-3 py-1.5 text-sm transition",
                catalog === "strap"
                  ? "bg-white font-semibold text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              Dây
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Quản lý danh sách sản phẩm theo hướng gọn, ưu tiên bảng dữ liệu và thao tác nhanh.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start">
        <div className="inline-flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Đã chọn
          </div>
          <div className="text-xl font-semibold leading-none text-slate-950">
            {selectedCount}
          </div>
        </div>
      </div>
    </div>
  );
}