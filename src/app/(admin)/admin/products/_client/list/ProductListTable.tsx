"use client";

import DataTableShell from "@/components/_shared/DataTableShell";
import ProductListRow from "./ProductListRow";
import type { ProductRow } from "./types";

export default function ProductListTable({
  items,
  selectedIds,
  pendingImageProductId,
  canViewCost,
  canEditPrice,
  onToggleOne,
  onToggleAll,
  onImageUploaded,
  onOpenReadiness,
  onPriceSaved,
}: {
  items: ProductRow[];
  selectedIds: string[];
  pendingImageProductId?: string | null;
  canViewCost: boolean;
  canEditPrice: boolean;
  onToggleOne: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onImageUploaded: (productId: string, fileKey: string) => void;
  onOpenReadiness: (product: ProductRow) => void;
  onPriceSaved: (productId: string, patch: Partial<ProductRow>) => void;
}) {
  const allChecked = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <DataTableShell>
      <table className="min-w-full">
        <thead className="bg-slate-50 text-left">
          <tr className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <th className="px-4 py-4"><input type="checkbox" checked={allChecked} onChange={(e) => onToggleAll(e.target.checked)} /></th>
            <th className="px-4 py-4">Ảnh</th>
            <th className="px-4 py-4">Tên</th>
            <th className="px-4 py-4">SKU</th>
            <th className="px-4 py-4">Vendor</th>
            <th className="px-4 py-4">Trạng thái</th>
            <th className="px-4 py-4">Phiếu nhập</th>
            <th className="px-4 py-4 text-right">Giá bán</th>
            <th className="px-4 py-4 text-right">Sale</th>
            {canViewCost ? <th className="px-4 py-4 text-right">Giá mua</th> : null}
            <th className="px-4 py-4">Bài đăng</th>
            <th className="px-4 py-4">Cập nhật</th>
            <th className="px-4 py-4">Tạo lúc</th>
            <th className="px-4 py-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <ProductListRow
              key={product.id}
              product={product}
              checked={selectedIds.includes(product.id)}
              pendingImage={pendingImageProductId === product.id}
              canViewCost={canViewCost}
              canEditPrice={canEditPrice}
              onCheckedChange={(checked) => onToggleOne(product.id, checked)}
              onImageUploaded={onImageUploaded}
              onOpenReadiness={onOpenReadiness}
              onPriceSaved={onPriceSaved}
            />
          ))}
        </tbody>
      </table>
    </DataTableShell>
  );
}
