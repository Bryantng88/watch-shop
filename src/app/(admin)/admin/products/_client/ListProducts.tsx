"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ProductListBulkBar,
  ProductListFilters,
  ProductListTable,
  ProductListToolbar,
  ProductListViewTabs,
  ProductReadinessModal,
} from "./list";
import type { CatalogKey, Counts, ProductListPageProps, ProductRow, ViewKey } from "./list/types";

type FilterState = {
  q: string;
  sku: string;
  type: string;
  brandId: string;
  vendorId: string;
  image: string;
  sort: string;
};

function buildCounts(input: ProductListPageProps["counts"], total: number, currentView: ViewKey): Counts {
  if (input && Object.values(input).some((value) => Number(value ?? 0) >= 0)) {
    return {
      all: Number(input.all ?? 0),
      draft: Number(input.draft ?? 0),
      posted: Number(input.posted ?? 0),
      in_service: Number(input.in_service ?? 0),
      hold: Number(input.hold ?? 0),
      sold: Number(input.sold ?? 0),
    };
  }

  return {
    all: currentView === "all" ? total : 0,
    draft: currentView === "draft" ? total : 0,
    posted: currentView === "posted" ? total : 0,
    in_service: currentView === "in_service" ? total : 0,
    hold: currentView === "hold" ? total : 0,
    sold: currentView === "sold" ? total : 0,
  };
}

function setParam(next: URLSearchParams, key: string, value?: string | null) {
  if (!value) next.delete(key);
  else next.set(key, value);
}

function BulkPostConfirm({
  open,
  count,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-950">Bulk post sản phẩm</h3>
          <p className="mt-1 text-sm text-slate-500">Bạn đang chuẩn bị post {count} sản phẩm đã chọn.</p>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Đang post..." : "Xác nhận post"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkSaleModal({
  open,
  count,
  value,
  saving,
  onChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  count: number;
  value: string;
  saving: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-950">Bulk sale</h3>
          <p className="mt-1 text-sm text-slate-500">Áp dụng giá sale cho {count} sản phẩm đã chọn.</p>
        </div>

        <div className="space-y-2 px-5 py-4">
          <label className="space-y-2">
            <div className="text-sm font-medium text-slate-800">Giá sale</div>
            <input
              type="number"
              min={0}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Để trống để bỏ sale"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            />
          </label>
          <div className="text-xs text-slate-500">Nhập giá sale cố định. Để trống để xóa sale hàng loạt.</div>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
      <div>
        Tổng: <span className="font-semibold text-slate-950">{total}</span> • Trang <span className="font-semibold text-slate-950">{page}</span>/<span className="font-semibold text-slate-950">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPage(Math.max(1, page - 1))}
        >
          ← Trước
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPage(Math.min(totalPages, page + 1))}
        >
          Sau →
        </button>
      </div>
    </div>
  );
}

export default function ListProducts(props: ProductListPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [rows, setRows] = useState<ProductRow[]>(props.items ?? []);
  const [pendingImageProductId, setPendingImageProductId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkPostOpen, setBulkPostOpen] = useState(false);
  const [bulkPostLoading, setBulkPostLoading] = useState(false);
  const [bulkSaleOpen, setBulkSaleOpen] = useState(false);
  const [bulkSaleValue, setBulkSaleValue] = useState("");
  const [bulkSaleSaving, setBulkSaleSaving] = useState(false);
  const [bulkServiceLoading, setBulkServiceLoading] = useState(false);
  const [readinessProduct, setReadinessProduct] = useState<ProductRow | null>(null);

  useEffect(() => {
    setRows(props.items ?? []);
  }, [props.items]);

  const currentView: ViewKey = useMemo(() => {
    const view = (sp.get("view") || "draft").toLowerCase();
    if (["all", "draft", "posted", "in_service", "hold", "sold"].includes(view)) {
      return view as ViewKey;
    }
    return "draft";
  }, [sp]);

  const currentCatalog: CatalogKey = useMemo(() => {
    const catalog = (sp.get("catalog") || "product").toLowerCase();
    return catalog === "strap" ? "strap" : "product";
  }, [sp]);

  const isStrapCatalog = currentCatalog === "strap";

  const counts = useMemo(() => buildCounts(props.counts, props.total, currentView), [props.counts, props.total, currentView]);

  const [filters, setFilters] = useState<FilterState>({
    q: sp.get("q") ?? "",
    sku: sp.get("sku") ?? "",
    type: sp.get("type") ?? "",
    brandId: sp.get("brandId") ?? "",
    vendorId: sp.get("vendorId") ?? "",
    image: sp.get("hasImages") ?? "",
    sort: sp.get("sort") ?? "updatedDesc",
  });

  useEffect(() => {
    setFilters({
      q: sp.get("q") ?? "",
      sku: sp.get("sku") ?? "",
      type: sp.get("type") ?? "",
      brandId: sp.get("brandId") ?? "",
      vendorId: sp.get("vendorId") ?? "",
      image: sp.get("hasImages") ?? "",
      sort: sp.get("sort") ?? "updatedDesc",
    });
  }, [sp]);

  useEffect(() => {
    setSelectedIds([]);
    setBulkPostOpen(false);
    setBulkSaleOpen(false);
    setBulkSaleValue("");
  }, [currentCatalog, currentView, props.page, props.total]);

  function pushParams(mutator: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(sp.toString());
    mutator(next);
    router.push(`${pathname}?${next.toString()}`);
  }

  function handleViewChange(view: ViewKey) {
    pushParams((next) => {
      if (view === "draft") next.delete("view");
      else next.set("view", view);
      next.set("page", "1");
    });
  }

  function handleCatalogChange(catalog: CatalogKey) {
    pushParams((next) => {
      if (catalog === "product") next.delete("catalog");
      else next.set("catalog", "strap");
      next.delete("type");
      next.delete("brandId");
      next.set("page", "1");
    });
  }

  function handleApplyFilters() {
    pushParams((next) => {
      setParam(next, "q", filters.q.trim() || null);
      setParam(next, "sku", isStrapCatalog ? null : filters.sku.trim() || null);
      setParam(next, "type", isStrapCatalog ? null : filters.type || null);
      setParam(next, "brandId", isStrapCatalog ? null : filters.brandId || null);
      setParam(next, "vendorId", filters.vendorId || null);
      setParam(next, "hasImages", filters.image || null);
      setParam(next, "sort", filters.sort || "updatedDesc");
      next.set("page", "1");
    });
  }

  function handleClearFilters() {
    setFilters({
      q: "",
      sku: "",
      type: "",
      brandId: "",
      vendorId: "",
      image: "",
      sort: "updatedDesc",
    });

    pushParams((next) => {
      ["q", "sku", "type", "brandId", "vendorId", "hasImages", "sort"].forEach((key) => next.delete(key));
      next.set("page", "1");
    });
  }

  function handlePage(page: number) {
    pushParams((next) => {
      next.set("page", String(page));
    });
  }

  function handleToggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((item) => item !== id);
    });
  }

  function handleToggleAll(checked: boolean) {
    if (checked) {
      setSelectedIds(rows.map((item) => item.id));
      return;
    }
    setSelectedIds([]);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("Xoá thất bại");
      return;
    }

    router.refresh();
  }

  async function handleImageUploaded(productId: string, fileKey: string) {
    try {
      setPendingImageProductId(productId);

      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: [{ key: fileKey }] }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Cập nhật ảnh thất bại");
      }

      const nextCover = data?.coverImageUrl || fileKey;
      setRows((prev) => prev.map((row) => (row.id === productId ? { ...row, primaryImageUrl: nextCover, imagesCount: Math.max(Number(row.imagesCount ?? 0), 1) } : row)));
      router.refresh();
    } catch (error: any) {
      window.alert(error?.message || "Cập nhật ảnh thất bại");
    } finally {
      setPendingImageProductId(null);
    }
  }

  function handlePriceSaved(productId: string, patch: Partial<ProductRow>) {
    setRows((prev) => prev.map((row) => (row.id === productId ? { ...row, ...patch } : row)));
  }

  async function handleBulkPost() {
    try {
      setBulkPostLoading(true);

      const res = await fetch("/api/admin/products/bulk-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedIds }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Bulk post thất bại");
      }

      if (Array.isArray(data?.failed) && data.failed.length > 0) {
        const preview = data.failed.slice(0, 3).map((item: any) => {
          const title = item?.title || item?.id || "Unknown";
          const reasons = Array.isArray(item?.reasons) ? item.reasons.join(" | ") : "";
          return `- ${title}: ${reasons}`;
        });

        window.alert(
          `Đã post ${data?.count ?? 0} sản phẩm. Còn ${data.failed.length} sản phẩm chưa đạt điều kiện.\n\n${preview.join("\n")}`
        );
      }

      setBulkPostOpen(false);
      setSelectedIds([]);
      router.refresh();
    } catch (error: any) {
      window.alert(error?.message || "Bulk post thất bại");
    } finally {
      setBulkPostLoading(false);
    }
  }

  async function handleBulkSale() {
    const trimmed = bulkSaleValue.trim();
    const salePrice = trimmed === "" ? null : Number(trimmed);

    if (salePrice != null && (!Number.isFinite(salePrice) || salePrice < 0)) {
      window.alert("Giá sale không hợp lệ");
      return;
    }

    try {
      setBulkSaleSaving(true);

      const res = await fetch("/api/admin/products/bulk-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedIds, salePrice }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Bulk sale thất bại");
      }

      setRows((prev) => prev.map((row) => (selectedIds.includes(row.id) ? { ...row, salePrice } : row)));
      setBulkSaleOpen(false);
      setBulkSaleValue("");
      router.refresh();
    } catch (error: any) {
      window.alert(error?.message || "Bulk sale thất bại");
    } finally {
      setBulkSaleSaving(false);
    }
  }

  async function handleBulkService() {
    const ids = Array.from(new Set(selectedIds.filter(Boolean)));
    if (!ids.length) return;

    try {
      setBulkServiceLoading(true);

      const res = await fetch("/api/admin/service-requests/from-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: ids, scope: "WITH_PURCHASE" }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Tạo service request thất bại");
      }

      window.alert(data?.message || `Đã tạo ${data?.count ?? ids.length} service request`);
      setSelectedIds([]);
      router.refresh();
    } catch (error: any) {
      window.alert(error?.message || "Tạo service request thất bại");
    } finally {
      setBulkServiceLoading(false);
    }
  }

  const typeOptions = isStrapCatalog ? [] : props.productTypes.map((item) => ({ label: item.label, value: item.value }));
  const brandOptions = isStrapCatalog ? [] : props.brands.map((item) => ({ label: item.name, value: item.id }));
  const vendorOptions = props.vendors.map((item) => ({ label: item.name, value: item.id }));

  return (
    <div className="space-y-4">
      <ProductListToolbar
        selectedCount={selectedIds.length}
        catalog={currentCatalog}
        onCatalogChange={handleCatalogChange}
      />

      <ProductListViewTabs
        value={currentView}
        counts={counts}
        onChange={handleViewChange}
      />

      <ProductListFilters
        filters={filters}
        typeOptions={typeOptions}
        brandOptions={brandOptions}
        vendorOptions={vendorOptions}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {!isStrapCatalog ? (
        <ProductListBulkBar selectedCount={selectedIds.length}>
          <button
            type="button"
            onClick={() => setBulkPostOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Bulk post
          </button>
          <button
            type="button"
            onClick={() => setBulkSaleOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Bulk sale
          </button>
          <button
            type="button"
            onClick={handleBulkService}
            disabled={bulkServiceLoading}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {bulkServiceLoading ? "Đang tạo..." : "Bulk request service"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Bỏ chọn
          </button>
        </ProductListBulkBar>
      ) : null}

      <ProductListTable
        items={rows}
        selectedIds={selectedIds}
        pendingImageProductId={pendingImageProductId}
        canViewCost={props.canViewCost}
        canEditPrice={props.canEditPrice}
        onToggleOne={handleToggleOne}
        onToggleAll={handleToggleAll}
        onImageUploaded={handleImageUploaded}
        onOpenReadiness={(product) => setReadinessProduct(product)}
        onPriceSaved={handlePriceSaved}
      />

      <Pagination
        page={props.page}
        totalPages={props.totalPages}
        total={props.total}
        onPage={handlePage}
      />

      <BulkPostConfirm
        open={bulkPostOpen}
        count={selectedIds.length}
        onClose={() => setBulkPostOpen(false)}
        onConfirm={handleBulkPost}
        loading={bulkPostLoading}
      />

      <BulkSaleModal
        open={bulkSaleOpen}
        count={selectedIds.length}
        value={bulkSaleValue}
        saving={bulkSaleSaving}
        onChange={setBulkSaleValue}
        onClose={() => {
          setBulkSaleOpen(false);
          setBulkSaleValue("");
        }}
        onConfirm={handleBulkSale}
      />

      <ProductReadinessModal
        open={!!readinessProduct}
        product={readinessProduct}
        onClose={() => setReadinessProduct(null)}
        onEdit={(id) => router.push(`/admin/products/${id}/edit`)}
      />
    </div>
  );
}
