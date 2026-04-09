"use client";

import Link from "next/link";
import RowActionsMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import MediaPickerInline from "@/components/media/MediaPickerInline";
import StatusBadge from "@/components/badges/StatusBadge";
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
  hasMissingCoreReadinessInfo,
  hasMissingImageReadiness,
  isWomenWatch,
} from "./helpers";
import type { ProductRow } from "./types";

type Props = {
  product: ProductRow;
  checked: boolean;
  canViewCost: boolean;
  canEditPrice: boolean;
  pendingImage?: boolean;
  onCheckedChange: (checked: boolean) => void;
  onImageUploaded: (productId: string, fileKey: string) => void;
  onOpenReadiness: (product: ProductRow) => void;
  onPriceSaved: (productId: string, patch: Partial<ProductRow>) => void;

  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onService: (productId: string) => void;
};

export default function ProductListRow({
  product,
  checked,
  canViewCost,
  canEditPrice,
  pendingImage = false,
  onCheckedChange,
  onImageUploaded,
  onOpenReadiness,
  onPriceSaved,
  onView,
  onEdit,
  onDelete,
  onService,
}: Props) {
  const service = getServiceLabel(product);
  const readiness = getPostReadinessState(product);

  return (
    <tr className="border-t border-slate-100 align-top hover:bg-slate-50/50">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
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
        <div className="mt-1 text-xs text-slate-500">
          {`${(product.brand || "-").toLowerCase()} · ${(product.type || "-").toLowerCase()}`}
        </div>

        {service ? (
          <div className="mt-2">
            <MiniDotLabel label={service.label} tone={service.tone} />
          </div>
        ) : null}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {product.variantSnapshot?.sku || "-"}
      </td>

      <td className="px-4 py-4 text-sm text-slate-700">
        {product.vendorName || "-"}
      </td>

      <td className="px-4 py-4">
        <span className={getInventoryStatusTextClass(product.status)}>
          {getProductInventoryStatusText(product.status)}
        </span>
      </td>

      <td className="px-4 py-4 text-sm">
        {product.acquisitionId && product.acquisitionRefNo ? (
          <Link
            href={`/admin/acquisitions/${product.acquisitionId}/edit`}
            className="font-medium text-sky-700 hover:underline"
          >
            {product.acquisitionRefNo}
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

      <td className="px-4 py-4 text-right text-sm text-emerald-700">
        {product.salePrice != null ? fmtMoney(product.salePrice) : "-"}
      </td>

      {canViewCost ? (
        <td className="px-4 py-4 text-right text-sm text-slate-900">
          {fmtMoney(product.purchasePrice)}
        </td>
      ) : null}

      <td className="px-4 py-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex h-[20px] items-center">
            <StatusBadge status={getContentStatusBadgeValue(product) as any} />
          </div>

          <button
            type="button"
            onClick={() => onOpenReadiness(product)}
            className="text-left"
          >
            <div className="flex flex-col">
              <MiniDotLabel label={readiness.label} tone={readiness.tone} />
              {!isWomenWatch(product) &&
                hasMissingCoreReadinessInfo(product) &&
                hasMissingImageReadiness(product) ? (
                <MiniDotLabel
                  label="Missing Image"
                  tone="gray"
                  className="mt-0.5"
                />
              ) : null}
            </div>
          </button>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {fmtDT(product.updatedAt)}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        {fmtDT(product.createdAt)}
      </td>

      <td className="px-4 py-4 text-right">
        <RowActionsMenu
          actions={[
            {
              key: "view",
              label: "Xem chi tiết",
              onClick: () => onView(product.id),
            },
            {
              key: "edit",
              label: "Chỉnh sửa",
              onClick: () => onEdit(product.id),
            },
            {
              key: "service",
              label: "Tạo service request",
              onClick: () => onService(product.id),
            },
            {
              key: "delete",
              label: "Xóa sản phẩm",
              onClick: () => onDelete(product.id),
              danger: true,
            },
          ]}
        />
      </td>
    </tr>
  );
}