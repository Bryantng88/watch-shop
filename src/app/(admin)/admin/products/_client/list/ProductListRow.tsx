"use client";

import RowActionMenu from "@/app/(admin)/admin/__components/RowActionMenu";
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

  const data = await res.json().catch(() => null);
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

function fmtMoney(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) return "-";
  return Number(value).toLocaleString("vi-VN");
}

function fmtDT(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("vi-VN");
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
  if (product.primaryImageUrl) params.set("img", product.primaryImageUrl);

  return `/admin/orders/new?${params.toString()}`;
}

function getServiceMeta(serviceState?: string) {
  switch (serviceState) {
    case "DONE":
      return { label: "Đã sửa xong", tone: "success" as const };
    case "IN_PROGRESS":
      return { label: "Đang service", tone: "warning" as const };
    case "PENDING":
      return { label: "Chờ xử lý", tone: "danger" as const };
    default:
      return { label: "Không cần service", tone: "muted" as const };
  }
}

function getReadinessLabel(stage?: string) {
  switch (stage) {
    case "READY":
      return "Sẵn sàng bán";
    case "PROCESSING":
      return "Đang hoàn thiện";
    case "HOLD":
      return "Đang hold";
    case "SOLD":
      return "Đã bán";
    default:
      return "Chưa bắt đầu";
  }
}

function toneClass(tone?: "success" | "warning" | "danger" | "muted" | "accent") {
  switch (tone) {
    case "success":
      return "text-emerald-700";
    case "warning":
      return "text-amber-700";
    case "danger":
      return "text-rose-600";
    case "accent":
      return "text-orange-600";
    case "muted":
    default:
      return "text-slate-700";
  }
}

function MetaRow({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "success" | "warning" | "danger" | "muted" | "accent";
}) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-2">
      <div className="text-[13px] leading-8 text-slate-400">{label}</div>
      <div className={["min-w-0 truncate text-[14px] font-medium leading-8", toneClass(tone)].join(" ")}>
        {value}
      </div>
    </div>
  );
}

export default function ProductListRow({
  product,
  checked,
  canViewCost,
  onCheckedChange,
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

  const thumbnailSrc = product.primaryImageUrl ?? null;

  const hasContent = Boolean(product.computed?.hasContent);
  const hasImages = Boolean(product.computed?.hasImages);
  const serviceMeta = getServiceMeta(product.computed?.serviceState);
  const readinessLabel = getReadinessLabel(product.computed?.readinessStage);

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50/40">
      <td className="px-4 py-5 align-middle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
      </td>

      <td className="px-4 py-5 align-middle">
        <div className="flex items-center gap-4">
          <Thumbnail src={thumbnailSrc} alt={product.title || "product"} />

          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium leading-6 text-slate-900">
              <span className="line-clamp-2 break-words">{product.title || "-"}</span>
            </div>

            <div className="mt-1 truncate text-xs text-slate-500">
              {`${(product.brand || "-").toLowerCase()} · ${(product.type || "-").toLowerCase()}`}
            </div>

            {product.variantSnapshot?.sku ? (
              <div className="mt-1 text-xs text-slate-400">
                SKU: {product.variantSnapshot.sku || product.sku}
              </div>
            ) : null}

            <div className="mt-2 text-xs font-medium text-slate-500">
              {readinessLabel}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-5 align-middle">
        <div className="space-y-0">
          <MetaRow
            label="Content"
            value={hasContent ? "Đã có" : "Chưa có"}
            tone={hasContent ? "success" : "danger"}
          />
          <MetaRow
            label="Image"
            value={hasImages ? "Đã có" : "Chưa có"}
            tone={hasImages ? "success" : "danger"}
          />
          <MetaRow
            label="Service"
            value={serviceMeta.label}
            tone={serviceMeta.tone}
          />
        </div>
      </td>

      <td className="px-4 py-5 align-middle">
        <div className="space-y-0">
          <MetaRow
            label="Bán"
            value={fmtMoney(product.minPrice)}
            tone="accent"
          />
          <MetaRow
            label="Sale"
            value={fmtMoney(product.salePrice)}
            tone="muted"
          />
          {canViewCost ? (
            <MetaRow
              label="Mua"
              value={fmtMoney(product.purchasePrice)}
              tone="muted"
            />
          ) : null}
        </div>
      </td>

      <td className="px-4 py-5 align-middle">
        <div className="space-y-1 text-sm leading-6 text-slate-600">
          <div>{fmtDT(product.updatedAt)}</div>
          <div className="text-xs text-slate-400">
            Tạo: {fmtDT(product.createdAt)}
          </div>
          {product.vendorName ? (
            <div className="pt-1 text-xs text-slate-400">
              Vendor: {product.vendorName}
            </div>
          ) : null}
        </div>
      </td>

      <td className="relative overflow-visible px-4 py-5 text-right align-middle">
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