"use client";

type Props = {
  selectedCount: number;
  createHref: string;
  title?: string;
  subtitle?: string;
};

export default function ProductListToolbar({
  selectedCount,
  createHref,
  title = "Danh sách sản phẩm",
  subtitle = "Quản lý danh sách sản phẩm theo hướng gọn, ưu tiên bảng dữ liệu và thao tác nhanh.",
}: Props) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Đã chọn
          </div>
          <div className="mt-1 text-2xl font-semibold leading-none text-slate-900">
            {selectedCount}
          </div>
        </div>

        <a
          href={createHref}
          className="inline-flex h-11 items-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Tạo sản phẩm
        </a>
      </div>
    </div>
  );
}