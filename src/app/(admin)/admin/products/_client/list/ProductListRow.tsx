"use client";

import Link from "next/link";
import RowActionMenu from "@/app/(admin)/admin/__components/RowActionMenu"
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
  onCheckedChange: (checked: boolean) => void;
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

async function callApi(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Action failed");

  return data;
}
type ProductRowAction = "quick_order" | "buy_back" | "consign_to";

function getProductRowActions(status?: string | null): ProductRowAction[] {
  const s = String(status || "").toUpperCase();

  if (s === "SOLD") return ["buy_back"];
  if (s === "CONSIGNED_TO") return [];

  return ["quick_order", "consign_to"];
}

function resolveImageSrc(input?: string | null) {
  if (!input) return null;
  if (
    input.startsWith("http://") ||
    input.startsWith("https://") ||
    input.startsWith("data:") ||
    input.startsWith("/api/") ||
    input.startsWith("/")
  ) {
    return input;
  }
  return `/api/media/sign?key=${encodeURIComponent(input)}`;
}

function PriceLine({
  label,
  value,
  valueClassName,
  extra,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <div className="flex items-center justify-end gap-2">
        <div className={["min-w-[92px] text-right font-medium", valueClassName || "text-slate-900"].join(" ")}>
          {value}
        </div>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>
    </div>
  );
}

function Thumbnail({ src, alt }: { src?: string | null; alt: string }) {
  const resolved = resolveImageSrc(src);

  if (!resolved) {
    return (
      <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-100 ring-1 ring-slate-200" />
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
    />
  );
}
function buildQuickOrderHref(product: ProductRow) {
  const params = new URLSearchParams();

  params.set("mode", "quick");
  params.set("productId", product.id);

  if (product.title) params.set("title", product.title);
  if (product.minPrice != null) params.set("listPrice", String(product.minPrice));
  if (product.variantSnapshot?.sku) params.set("sku", product.variantSnapshot.sku);

  return `/admin/orders/new?${params.toString()}`;
}
export default function ProductListRow({
  product,
  checked,
  canViewCost,
  canEditPrice,
  onCheckedChange,
  onOpenReadiness,
  onPriceSaved,
  onPriceCommit,
  onView,
  onEdit,
  onDelete,
  onService,
}: Props) {

  const actions = getProductRowActions(product.status);



  const handleBuyBack = async () => {
    const price = Number(prompt("Giá mua lại?") || 0);
    if (!price) return;

    await callApi(`/api/admin/products/${product.id}/buy-back`, {
      unitCost: price,
      needService: true,
    });

    window.location.reload();
  };

  const handleConsign = async () => {
    const vendorId = prompt("Vendor ID?");
    if (!vendorId) return;

    await callApi(`/api/admin/products/${product.id}/consign-to`, {
      vendorId,
    });

    window.location.reload();
  };

  const service = getServiceLabel(product);
  const readiness = getPostReadinessState(product);
  const hasMissingImage =
    !isWomenWatch(product) &&
    hasMissingCoreReadinessInfo(product) &&
    hasMissingImageReadiness(product);

  const thumbnailSrc =
    product.primaryImageUrl ??
    product.primaryImageKey ??
    null;

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50/50">
      <td className="px-4 py-4 align-middle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="flex items-center gap-4">
          <Thumbnail
            src={thumbnailSrc}
            alt={product.title || "product"}
          />

          <div className="min-w-0 flex-1 self-start">

            <div className="text-[14px] font-medium text-slate-900">
              <span className="line-clamp-2 break-words">
                {product.title || "-"}
              </span>
            </div>

            <div className="mt-1 truncate text-xs text-slate-500">
              {`${(product.brand || "-").toLowerCase()} · ${(product.type || "-").toLowerCase()}`}
            </div>

            {product.variantSnapshot?.sku ? (
              <div className="mt-1 text-xs text-slate-400">
                SKU: {product.variantSnapshot.sku || product.sku}
              </div>
            ) : null}

            {service ? (
              <div className="mt-2">
                <MiniDotLabel label={service.label} tone={service.tone} />
              </div>
            ) : null}
          </div>
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="space-y-2">
          <div className={getInventoryStatusTextClass(product.status)}>
            {getProductInventoryStatusText(product.status)}
          </div>

          <div className="text-sm">
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
          </div>

          <div className="space-y-1">
            <StatusBadge status={getContentStatusBadgeValue(product) as any} />
            <button
              type="button"
              onClick={() => onOpenReadiness(product)}
              className="block text-left"
            >
              <div className="space-y-1">
                <MiniDotLabel label={readiness.label} tone={readiness.tone} />
                {hasMissingImage ? (
                  <MiniDotLabel label="Missing Image" tone="gray" />
                ) : null}
              </div>
            </button>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="space-y-2 rounded-2xl bg-slate-50/70 px-3 py-3 ring-1 ring-slate-100">
          <PriceLine
            label="Bán"
            value={fmtMoney(product.minPrice)}
            valueClassName="text-orange-600"
            extra={
              canEditPrice ? (
                <InlineMoneyEditor
                  value={product.minPrice}
                  label="Giá bán"
                  compact
                  iconOnly
                  onSubmit={async (v) => {
                    await onPriceCommit(product.id, "minPrice", v);
                    onPriceSaved(product.id, { minPrice: v });
                  }}
                />
              ) : null
            }
          />

          <PriceLine
            label="Sale"
            value={product.salePrice != null ? fmtMoney(product.salePrice) : "-"}
            valueClassName="text-emerald-700"
          />

          {canViewCost ? (
            <PriceLine
              label="Mua"
              value={fmtMoney(product.purchasePrice)}
              valueClassName="text-slate-400"
            />
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4 align-middle">
        <div className="space-y-1 text-sm leading-6 text-slate-600">
          <div>{fmtDT(product.updatedAt)}</div>
          <div className="text-xs text-slate-400">Tạo: {fmtDT(product.createdAt)}</div>
          {product.vendorName ? (
            <div className="pt-1 text-xs text-slate-400">Vendor: {product.vendorName}</div>
          ) : null}
        </div>
      </td>
      <td className="relative px-4 py-4 text-right align-middle overflow-visible">
        <RowActionMenu
          align="right"
          actions={[
            {
              key: "view",
              label: "Xem chi tiết",
              icon: "view",
              onClick: () => onView(product.id),
            },
            {
              key: "edit",
              label: "Chỉnh sửa",
              icon: "edit",
              onClick: () => onEdit(product.id),
            },
            {
              key: "service",
              label: "Tạo service request",
              icon: "service",
              onClick: () => onService(product.id),
            },

            /* ===== NEW ACTION ===== */

            {
              key: "quick",
              label:
                String(product.status).toUpperCase() === "IN_SERVICE"
                  ? "Tạo đơn nhanh • ưu tiên kỹ thuật"
                  : "Tạo đơn nhanh",
              icon: "product",
              href: buildQuickOrderHref(product),
              hidden: !actions.includes("quick_order"),
            },

            {
              key: "buyback",
              label: "Buy back",
              icon: "move",
              onClick: handleBuyBack,
              hidden: !actions.includes("buy_back"),
            },

            {
              key: "consign",
              label: "Consign to",
              icon: "archive",
              onClick: handleConsign,
              hidden: !actions.includes("consign_to"),
            },

            {
              key: "delete",
              label: "Xóa sản phẩm",
              icon: "delete",
              onClick: () => onDelete(product.id),
              danger: true,
            },
          ]}
        />
      </td>
    </tr>
  );
}