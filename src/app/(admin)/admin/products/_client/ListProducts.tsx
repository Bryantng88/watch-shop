"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RowActionsMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import CreateServiceRequestModal from "./CreateServiceRequestModal";
import type { BrandLite, ProductListItem } from "@/features/products/types";
import DotLabel from "../../__components/DotLabel";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import StatusBadge from "@/components/badges/StatusBadge";
import InlineImagePicker from "../_components/InlineImagePicker";

type ViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";
type StrapViewKey = "all" | "draft" | "posted";
type CatalogKey = "product" | "strap";

type Counts = {
    all: number;
    draft: number;
    posted: number;
    in_service: number;
    hold: number;
    sold: number;
};

type ProductRow = ProductListItem & {
    slug?: string;
    brand?: string | null;
    type?: string | null;
    vendorName?: string | null;
    primaryImageUrl?: string | null;
    updatedAt?: string | null;
    createdAt?: string | null;
    status?: string | null;
    title?: string | null;
    minPrice?: number | null;
    stockQty?: number | null;
    purchasePrice?: number | null;
    strapSpec?: {
        lugWidthMM?: number | null;
        buckleWidthMM?: number | null;
        color?: string | null;
        material?: string | null;
        quickRelease?: boolean | null;
    } | null;
};

type PageProps = {
    items: ProductRow[];
    total: number;
    counts?: Partial<Counts>;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    brands: BrandLite[];
    productTypes: Array<{ label: string; value: string }>;
};

function fmtMoney(n?: number | null) {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n));
}

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function hasValidPrice(p: ProductRow) {
    const price = Number(p.minPrice ?? 0);
    return Number.isFinite(price) && price > 0;
}

function hasValidImage(p: ProductRow) {
    const img = p.primaryImageUrl;
    return typeof img === "string" && img.trim().length > 0;
}

function StrapSpecText({ p }: { p: ProductRow }) {
    const s = p.strapSpec;
    if (!s) return <span>-</span>;

    return (
        <span>
            {s.material || "-"} / {s.lugWidthMM || "-"} - {s.buckleWidthMM || "-"} / {s.color || "-"} /{" "}
            {s.quickRelease ? "QR" : "No QR"}
        </span>
    );
}

function InlinePriceEditor({
    productId,
    value,
    onSaved,
}: {
    productId: string;
    value: number | null | undefined;
    onSaved: (v: number) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value ?? 0));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setDraft(String(value ?? 0));
    }, [value]);

    async function save() {
        const nextValue = Number(draft || 0);
        if (!Number.isFinite(nextValue) || nextValue < 0) {
            alert("Giá bán không hợp lệ");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: nextValue }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Cập nhật giá thất bại");
            }

            onSaved(nextValue);
            setEditing(false);
        } catch (e: any) {
            alert(e?.message || "Cập nhật giá thất bại");
        } finally {
            setSaving(false);
        }
    }

    if (editing) {
        return (
            <div className="flex items-center justify-end gap-2">
                <input
                    type="number"
                    min={0}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-28 rounded border px-2 py-1 text-right"
                />
                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                >
                    {saving ? "..." : "Lưu"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setEditing(false);
                        setDraft(String(value ?? 0));
                    }}
                    disabled={saving}
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                >
                    Hủy
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setEditing(true)}
            className="group inline-flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50"
            title="Chỉnh nhanh giá bán"
        >
            <span className="font-semibold">{fmtMoney(value)}</span>
            <span className="text-xs text-gray-400 opacity-0 transition group-hover:opacity-100">sửa</span>
        </button>
    );
}

export default function AdminProductListPageClient(props: PageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const [rows, setRows] = useState<ProductRow[]>(props.items ?? []);
    useEffect(() => setRows(props.items ?? []), [props.items]);

    const currentView: ViewKey = useMemo(() => {
        const v = (sp.get("view") || "all").toLowerCase();
        if (v === "draft" || v === "posted" || v === "in_service" || v === "hold" || v === "sold") {
            return v as ViewKey;
        }
        return "all";
    }, [sp]);

    const currentCatalog: CatalogKey = useMemo(() => {
        const v = (sp.get("catalog") || "product").toLowerCase();
        return v === "strap" ? "strap" : "product";
    }, [sp]);

    const isStrapCatalog = currentCatalog === "strap";

    function setView(view: string) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function setCatalog(catalog: CatalogKey) {
        const next = new URLSearchParams(sp.toString());
        if (catalog === "product") next.delete("catalog");
        else next.set("catalog", "strap");
        next.delete("type");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    const q = sp.get("q") ?? "";
    const type = sp.get("type") ?? "";
    const brandId = sp.get("brandId") ?? "";
    const hasImages = sp.get("hasImages") ?? "";
    const sort = sp.get("sort") ?? "updatedDesc";

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const [openService, setOpenService] = useState(false);
    const [serviceProductId, setServiceProductId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
    }, [currentCatalog, currentView, q, type, brandId, hasImages, sort, props.page]);

    useEffect(() => {
        setShowBulkBar(selectedIds.length > 0);
    }, [selectedIds.length]);

    const counts: Counts = useMemo(() => {
        const server = props.counts;
        if (server && Object.values(server).some((v) => Number(v ?? 0) >= 0)) {
            return {
                all: Number(server.all ?? 0),
                draft: Number(server.draft ?? 0),
                posted: Number(server.posted ?? 0),
                in_service: Number(server.in_service ?? 0),
                hold: Number(server.hold ?? 0),
                sold: Number(server.sold ?? 0),
            };
        }

        return {
            all: currentView === "all" ? props.total : 0,
            draft: currentView === "draft" ? props.total : 0,
            posted: currentView === "posted" ? props.total : 0,
            in_service: currentView === "in_service" ? props.total : 0,
            hold: currentView === "hold" ? props.total : 0,
            sold: currentView === "sold" ? props.total : 0,
        };
    }, [props.counts, props.total, currentView]);

    const selectableIds = useMemo(
        () => rows.filter((p) => hasValidPrice(p) && hasValidImage(p)).map((x) => x.id),
        [rows]
    );

    const allChecked =
        selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

    const someChecked =
        selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

    const [formQ, setFormQ] = useState(q);
    const [formType, setFormType] = useState(type);
    const [formBrandId, setFormBrandId] = useState(brandId);
    const [formHasImages, setFormHasImages] = useState(hasImages);
    const [formSort, setFormSort] = useState(sort);

    useEffect(() => setFormQ(q), [q]);
    useEffect(() => setFormType(type), [type]);
    useEffect(() => setFormBrandId(brandId), [brandId]);
    useEffect(() => setFormHasImages(hasImages), [hasImages]);
    useEffect(() => setFormSort(sort), [sort]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(form: {
        q: string;
        type: string;
        brandId: string;
        hasImages: string;
        sort: string;
    }) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", form.q.trim() || null);

        if (!isStrapCatalog) {
            setParam(next, "type", form.type || null);
            setParam(next, "brandId", form.brandId || null);
        } else {
            next.delete("type");
            next.delete("brandId");
        }

        setParam(next, "hasImages", form.hasImages || null);
        setParam(next, "sort", form.sort || "updatedDesc");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
        next.delete("type");
        next.delete("brandId");
        next.delete("hasImages");
        next.delete("sort");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function goPage(p: number) {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        router.push(`${pathname}?${next.toString()}`);
    }

    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
            alert("Xoá thất bại!");
            return;
        }
        router.refresh();
    }

    async function updateProductImage(productId: string, fileKey: string) {
        try {
            const res = await fetch(`/api/admin/products/${productId}/images`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    files: [{ key: fileKey }],
                }),
            });

            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                alert(msg || "Cập nhật ảnh thất bại");
                return;
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Cập nhật ảnh thất bại");
        }
    }

    function patchLocalPrice(id: string, price: number) {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, minPrice: price } : row))
        );
    }

    const segmentTabs = isStrapCatalog
        ? [
            { key: "all", label: "Tất cả", count: counts.all },
            { key: "draft", label: "Chờ duyệt", count: counts.draft },
            { key: "posted", label: "Đã post", count: counts.posted },
        ]
        : [
            { key: "all", label: "Tất cả", count: counts.all },
            { key: "draft", label: "Chờ duyệt", count: counts.draft },
            { key: "posted", label: "Đã post", count: counts.posted },
            { key: "in_service", label: "Chờ service", count: counts.in_service },
            { key: "hold", label: "Ký gửi / Giữ hàng", count: counts.hold },
            { key: "sold", label: "Đã bán", count: counts.sold },
        ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-3">
                    <div className="inline-flex rounded-lg border bg-white p-1">
                        <button
                            type="button"
                            onClick={() => setCatalog("product")}
                            className={`rounded-md px-3 py-1.5 text-sm ${!isStrapCatalog ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Sản phẩm
                        </button>

                        <button
                            type="button"
                            onClick={() => setCatalog("strap")}
                            className={`rounded-md px-3 py-1.5 text-sm ${isStrapCatalog ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Dây
                        </button>
                    </div>

                    <h1 className="text-2xl font-semibold">
                        {isStrapCatalog ? "Quản lý dây" : "Sản phẩm"}
                    </h1>
                </div>

                <Link
                    href={isStrapCatalog ? "/admin/acquisitions/new?focus=strap" : "/admin/products/new"}
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                    {isStrapCatalog ? "+ Nhập dây" : "+ Tạo sản phẩm"}
                </Link>
            </div>

            <SegmentTabs
                active={currentView}
                onChange={(v) => setView(v as string)}
                tabs={segmentTabs as any}
            />

            <form
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters({
                        q: formQ,
                        type: formType,
                        brandId: formBrandId,
                        hasImages: formHasImages,
                        sort: formSort,
                    });
                }}
            >
                <div className={`grid grid-cols-1 gap-3 ${isStrapCatalog ? "lg:grid-cols-3" : "lg:grid-cols-5"}`}>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tìm kiếm</div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder={isStrapCatalog ? "Tên dây / chất liệu..." : "Tên / mã / brand..."}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    {!isStrapCatalog && (
                        <>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Type</div>
                                <select
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">(All)</option>
                                    {props.productTypes.map((x) => (
                                        <option key={x.value} value={x.value}>
                                            {x.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500 mb-1">Brand</div>
                                <select
                                    value={formBrandId}
                                    onChange={(e) => setFormBrandId(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">(All)</option>
                                    {props.brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Image</div>
                        <select
                            value={formHasImages}
                            onChange={(e) => setFormHasImages(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">(All)</option>
                            <option value="yes">Có ảnh</option>
                            <option value="no">Chưa có ảnh</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Sắp xếp</div>
                        <select
                            value={formSort}
                            onChange={(e) => setFormSort(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="updatedDesc">Cập nhật ↓</option>
                            <option value="updatedAsc">Cập nhật ↑</option>
                            <option value="createdDesc">Tạo ↓</option>
                            <option value="createdAsc">Tạo ↑</option>
                            <option value="titleAsc">Title A → Z</option>
                            <option value="titleDesc">Title Z → A</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        Lọc
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    >
                        Clear
                    </button>

                    {!isStrapCatalog && (
                        <div className="ml-auto text-sm text-gray-600">
                            Đã chọn: <b>{selectedIds.length}</b>
                        </div>
                    )}
                </div>
            </form>

            {!isStrapCatalog && showBulkBar && (
                <div className="p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} product đã chọn
                    </span>

                    <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Bulk post
                    </button>

                    <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => {
                            setSelectedIds([]);
                            setShowBulkBar(false);
                        }}
                        type="button"
                    >
                        Bỏ chọn
                    </button>
                </div>
            )}

            {!isStrapCatalog && showBulkConfirm && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[420px] p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Post products</h3>

                        <div className="text-sm text-gray-600">
                            Bạn đang post <b>{selectedIds.length}</b> sản phẩm.
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => setShowBulkConfirm(false)}
                                type="button"
                            >
                                Hủy
                            </button>

                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={async () => {
                                    const res = await fetch("/api/admin/products/bulk-post", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ productIds: selectedIds }),
                                    });
                                    if (!res.ok) {
                                        alert(await res.text());
                                        return;
                                    }
                                    setShowBulkConfirm(false);
                                    setSelectedIds([]);
                                    setShowBulkBar(false);
                                    router.refresh();
                                }}
                                type="button"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {isStrapCatalog ? (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-700">
                                    <th className="px-3 py-3">Ảnh</th>
                                    <th className="px-3 py-3">Tên dây</th>
                                    <th className="px-3 py-3">Spec</th>
                                    <th className="px-3 py-3 text-right">Tồn kho</th>
                                    <th className="px-3 py-3 text-right">Giá nhập</th>
                                    <th className="px-3 py-3 text-right">Giá bán</th>
                                    <th className="px-3 py-3">Vendor</th>
                                    <th className="px-3 py-3">Cập nhật</th>
                                    <th className="px-3 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-3 py-10 text-center text-gray-500">
                                            Không có dây nào trong tab này
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => (
                                        <tr key={p.id} className="border-t">
                                            <td className="px-4 py-3 align-middle">
                                                <InlineImagePicker
                                                    imageUrl={p.primaryImageUrl ?? null}
                                                    onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                />
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-medium text-sm">{p.title || "-"}</div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <StrapSpecText p={p} />
                                            </td>

                                            <td className="px-3 py-4 text-right font-semibold">
                                                {Number(p.stockQty ?? 0)}
                                            </td>

                                            <td className="px-3 py-4 text-right">
                                                {fmtMoney(p.purchasePrice)}
                                            </td>

                                            <td className="px-3 py-4 text-right">
                                                <InlinePriceEditor
                                                    productId={p.id}
                                                    value={p.minPrice}
                                                    onSaved={(v) => patchLocalPrice(p.id, v)}
                                                />
                                            </td>

                                            <td className="px-3 py-4 align-top">{p.vendorName || "-"}</td>

                                            <td className="px-3 py-4 align-top">{fmtDT(p.updatedAt)}</td>

                                            <td className="px-3 py-4 align-top text-right">
                                                <RowActionsMenu
                                                    onEdit={() => router.push(`/admin/products/${p.id}/edit`)}
                                                    onDelete={() => handleDelete(p.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-700">
                                    <th className="w-10 px-3 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allChecked}
                                            ref={(el) => {
                                                if (el) el.indeterminate = someChecked;
                                            }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    const merged = Array.from(new Set([...selectedIds, ...selectableIds]));
                                                    setSelectedIds(merged);
                                                    setShowBulkBar(merged.length > 0);
                                                } else {
                                                    const next = selectedIds.filter((id) => !selectableIds.includes(id));
                                                    setSelectedIds(next);
                                                    setShowBulkBar(next.length > 0);
                                                }
                                            }}
                                        />
                                    </th>

                                    <th className="px-3 py-3">Ảnh</th>
                                    <th className="px-3 py-3">Tên</th>
                                    <th className="px-3 py-3">Vendor</th>
                                    <th className="px-3 py-3">Giá bán</th>
                                    <th className="px-3 py-3">Trạng thái</th>
                                    <th className="px-3 py-3">Cập nhật</th>
                                    <th className="px-3 py-3">Tạo lúc</th>
                                    <th className="px-3 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-3 py-10 text-center text-gray-500">
                                            Không có dữ liệu trong tab này
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => {
                                        const checked = selectedIds.includes(p.id);

                                        return (
                                            <tr key={p.id} className="border-t">
                                                <td className="px-3 py-4 align-top">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        disabled={!hasValidPrice(p) || !hasValidImage(p)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedIds((prev) =>
                                                                    Array.from(new Set([...prev, p.id]))
                                                                );
                                                            } else {
                                                                setSelectedIds((prev) =>
                                                                    prev.filter((id) => id !== p.id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </td>

                                                <td className="px-4 py-3 align-middle">
                                                    <div className="scale-110 origin-left">
                                                        <InlineImagePicker
                                                            imageUrl={p.primaryImageUrl ?? null}
                                                            onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="px-3 py-4 align-top">
                                                    <div className="font-medium text-sm">{p.title || "-"}</div>

                                                    <div className="mt-1 text-[11px] text-gray-400 uppercase tracking-wide">
                                                        {(p.brand || "-").toLowerCase()} · {(p.type || "-").toLowerCase()}
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap gap-2">
                                                        <DotLabel
                                                            label={p.primaryImageUrl ? "Hiển thị ảnh" : "Thiếu ảnh"}
                                                            tone={p.primaryImageUrl ? "green" : "orange"}
                                                        />
                                                        <DotLabel
                                                            label={hasValidPrice(p) ? "Hiển thị giá" : "Thiếu giá"}
                                                            tone={hasValidPrice(p) ? "green" : "orange"}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="px-3 py-4 align-top">
                                                    {p.vendorName || "-"}
                                                </td>

                                                <td className="px-3 py-4 align-top">
                                                    <InlinePriceEditor
                                                        productId={p.id}
                                                        value={p.minPrice}
                                                        onSaved={(v) => patchLocalPrice(p.id, v)}
                                                    />
                                                </td>

                                                <td className="px-3 py-4 align-top">
                                                    <StatusBadge status={p.status} />
                                                </td>

                                                <td className="px-3 py-4 align-top">
                                                    <div className="text-sm">{fmtDT(p.updatedAt)}</div>
                                                </td>

                                                <td className="px-3 py-4 align-top">
                                                    <div className="text-sm">{fmtDT(p.createdAt)}</div>
                                                </td>

                                                <td className="px-3 py-4 align-top text-right">
                                                    <RowActionsMenu
                                                        onEdit={() => router.push(`/admin/products/${p.id}/edit`)}
                                                        onDelete={() => handleDelete(p.id)}
                                                        onService={() => {
                                                            setServiceProductId(p.id);
                                                            setOpenService(true);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-700">
                <div>
                    Tổng: <b>{props.total}</b> • Trang <b>{props.page}</b>/<b>{props.totalPages}</b>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="px-3 py-2 border rounded-lg disabled:opacity-50"
                        disabled={props.page <= 1}
                        onClick={() => goPage(Math.max(1, props.page - 1))}
                    >
                        ← Trước
                    </button>

                    <button
                        type="button"
                        className="px-3 py-2 border rounded-lg disabled:opacity-50"
                        disabled={props.page >= props.totalPages}
                        onClick={() => goPage(Math.min(props.totalPages, props.page + 1))}
                    >
                        Sau →
                    </button>
                </div>
            </div>

            <CreateServiceRequestModal
                open={openService}
                onClose={() => {
                    setOpenService(false);
                    setServiceProductId(null);
                }}
                productId={serviceProductId ?? ""}
            />
        </div>
    );
}