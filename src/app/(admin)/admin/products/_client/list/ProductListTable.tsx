"use client";

import ProductListRow from "./ProductListRow";
import type { ProductRow } from "./types";

type Props = {
  items: ProductRow[];
  selectedIds: string[];
  canViewCost: boolean;
  canEditPrice: boolean;
  onToggleOne: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpenReadiness: (product: ProductRow) => void;
  onPriceSaved: (productId: string, patch: Partial<ProductRow>) => void;
  onPriceCommit: (
    productId: string,
    field: "minPrice" | "salePrice" | "purchasePrice",
    value: number | null
  ) => Promise<void>;
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
  onToggleOne,
  onToggleAll,
  onOpenReadiness,
  onPriceSaved,
  onPriceCommit,
  onView,
  onEdit,
  onDelete,
  onService,
}: Props) {
  const allChecked =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-slate-950">Danh sách dữ liệu</div>
          <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500">
            {items.length} mục
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col className="w-12" />
            <col className="w-[36%]" />
            <col className="w-[22%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[8%]" />
          </colgroup>

          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => onToggleAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                Post readiness
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                Pricing
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-500">
                Cập nhật
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-semibold text-slate-500">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((product) => (
              <ProductListRow
                key={product.id}
                product={product}
                checked={selectedIds.includes(product.id)}
                canViewCost={canViewCost}
                canEditPrice={canEditPrice}
                onCheckedChange={(checked) => onToggleOne(product.id, checked)}
                onOpenReadiness={onOpenReadiness}
                onPriceSaved={onPriceSaved}
                onPriceCommit={onPriceCommit}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onService={onService}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}