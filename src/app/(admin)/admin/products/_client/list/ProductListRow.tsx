"use client";

import Link from "next/link";
import RowActionsMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import StatusBadge from "@/components/badges/StatusBadge";
import MediaPickerInline from "@/components/media/MediaPickerInline";
import MiniDotLabel from "@/components/_shared/MiniDotLabel";

import InlineMoneyEditor from "./InlineMoneyEditor";
import {
  fmtDT,
  fmtMoney,
  getContentStatusBadgeValue,
  getInventoryStatusTextClass,
  getPostReadinessState,
  getProductInventoryStatusText,
  getServiceLabel,
} from "./helpers";
import type { ProductRow } from "./types";

export default function ProductListRow({
  product,
  checked,
  canViewCost,
  canEditPrice,
  pendingImage,
  onCheckedChange,
  onImageUploaded,
  onOpenReadiness,
  onPriceSaved,
}: {
  product: ProductRow;
  checked: boolean;
  canViewCost: boolean;
  canEditPrice: boolean;
  pendingImage?: boolean;
  onCheckedChange: (checked: boolean) => void;
  onImageUploaded: (productId: string, fileKey: string) => void;
  onOpenReadiness: (product: ProductRow) => void;
  onPriceSaved: (productId: string, patch: Partial<ProductRow>) => void;
}) {
  const service = getServiceLabel(product);
  const readiness = getPostReadinessState(product);

  return (
    <tr className="border-t border-slate-100 align-top hover:bg-slate-50/50">
      <td className="px-4 py-4">
        <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
      </td>

      <td className="px-4 py-4">
        <MediaPickerInline
          value={product.primaryImageUrl ?? null}
          onChange={(fileKey) => onImageUploaded(product.id, fileKey)}
          pending={pendingImage}
          profile="inline"
          compact
        />
      </td>

      <td className="min-w-[240px] px-4 py-4">
        <div className="font-medium text-slate-900">{product.title || "-"}</div>
        <div className="mt-1 text-xs text-slate-500">{product.brand || "-"} · {product.type || "-"}</div>
        {service ? (
          <div className="mt-2">
            <MiniDotLabel label={service.label} tone={service.tone} />
          </div>
        ) : null}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">{product.variantSnapshot?.sku || "-"}</td>
      <td className="px-4 py-4 text-sm text-slate-700">{product.vendorName || "-"}</td>
      <td className="px-4 py-4">
        <span className={getInventoryStatusTextClass(product.status)}>{getProductInventoryStatusText(product.status)}</span>
      </td>
      <td className="px-4 py-4 text-sm">
        {product.acquisitionId ? (
          <Link href={`/admin/acquisitions/${product.acquisitionId}`} className="font-medium text-sky-700 hover:underline">
            {product.acquisitionRefNo || "-"}
          </Link>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-4 text-right text-sm text-slate-900">
        {canEditPrice ? (
          <InlineMoneyEditor
            productId={product.id}
            field="minPrice"
            value={product.minPrice}
            label="Giá bán"
            onSaved={(v) => onPriceSaved(product.id, { minPrice: v })}
          />
        ) : (
          fmtMoney(product.minPrice)
        )}
      </td>
      <td className="px-4 py-4 text-right text-sm text-emerald-700">{fmtMoney(product.salePrice)}</td>
      {canViewCost ? <td className="px-4 py-4 text-right text-sm text-slate-900">{fmtMoney(product.purchasePrice)}</td> : null}
      <td className="px-4 py-4">
        <div className="flex flex-col items-start gap-1">
          <StatusBadge value={getContentStatusBadgeValue(product) as any} />
          <button type="button" onClick={() => onOpenReadiness(product)} className="text-left">
            <MiniDotLabel label={readiness.label} tone={readiness.tone} />
          </button>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">{fmtDT(product.updatedAt)}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{fmtDT(product.createdAt)}</td>
      <td className="px-4 py-4 text-right">
        <RowActionsMenu actions={[]} />
      </td>
    </tr>
  );
}
