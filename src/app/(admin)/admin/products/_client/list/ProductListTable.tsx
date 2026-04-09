"use client";

import DataTableShell from "@/components/_shared/DataTableShell";
import ProductListRow from "./ProductListRow";
import type { ProductRow } from "./types";

type Props = {
  items: ProductRow[];
  selectedIds: string[];
  canViewCost: boolean;
  canEditPrice: boolean;
  pendingImageProductId?: string | null;

  onToggleAll: (checked: boolean) => void;
  onToggleOne: (productId: string, checked: boolean) => void;
  onImageUploaded: (productId: string, fileKey: string) => void;
  onOpenReadiness: (product: ProductRow) => void;
  onPriceSaved: (productId: string, patch: Partial<ProductRow>) => void;

  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onService: (productId: string) => void;
};

export default function ProductListTable({
  items,
  selectedIds,
  canViewCost,
  canEditPrice,
  pendingImageProductId = null,
  onToggleAll,
  onToggleOne,
  onImageUploaded,
  onOpenReadiness,
  onPriceSaved,
  onView,
  onEdit,
  onDelete,
  onService,
}: Props) {
  const allChecked = items.length > 0 && items.every((p) => selectedIds.includes(p.id));

  return (
    <DataTableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => onToggleAll(e.target.checked)}
              />
            </th>
            <th className="px-4 py-3 text-left">Ảnh</th>
            <th className="px-4 py-3 text-left">Tên</th>
            <th className="px-4 py-3 text-left">SKU</th>
            <th className="px-4 py-3 text-left">Vendor</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-left">Phiếu nhập</th>
            <th className="px-4 py-3 text-right">Giá bán</th>
            <th className="px-4 py-3 text-right">Sale</th>
            {canViewCost ? (
              <th className="px-4 py-3 text-right">Giá mua</th>
            ) : null}
            <th className="px-4 py-3 text-left">Bài đăng</th>
            <th className="px-4 py-3 text-left">Cập nhật</th>
            <th className="px-4 py-3 text-left">Tạo lúc</th>
            <th className="px-4 py-3 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {items.map((product) => (
            <ProductListRow
              key={product.id}
              product={product}
              checked={selectedIds.includes(product.id)}
              canViewCost={canViewCost}
              canEditPrice={canEditPrice}
              pendingImage={pendingImageProductId === product.id}
              onCheckedChange={(checked) => onToggleOne(product.id, checked)}
              onImageUploaded={onImageUploaded}
              onOpenReadiness={onOpenReadiness}
              onPriceSaved={onPriceSaved}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onService={onService}
            />
          ))}
        </tbody>
      </table>
    </DataTableShell>
  );
}