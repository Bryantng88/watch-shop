"use client";

export default function ProductListBulkBar({
  selectedCount,
  children,
}: {
  selectedCount: number;
  children?: React.ReactNode;
}) {
  if (selectedCount <= 0) return null;

  return (
    <div className="sticky top-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-sm font-medium text-slate-700">Đã chọn <span className="font-semibold text-slate-950">{selectedCount}</span> sản phẩm</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
