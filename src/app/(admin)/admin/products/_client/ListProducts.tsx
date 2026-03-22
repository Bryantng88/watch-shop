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
import ServiceHistoryModal from "./ServiceHistoryModal";

type ViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";
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
    material?: string | null;
    variantsCount?: number;
    imagesCount?: number;
    ordersCount?: number;
    serviceRequests?: number;
    reservations?: number;
    primaryImageUrl?: string | null;
    updatedAt?: string | null;
    createdAt?: string | null;
    status?: string | null;
    title?: string | null;
    minPrice?: number | null;
    purchasePrice?: number | null;
    salePrice?: number | null;
    stockQty?: number | null;
    strapSpec?: {
        lugWidthMM?: number | null;
        buckleWidthMM?: number | null;
        color?: string | null;
        material?: string | null;
        quickRelease?: boolean | null;
    } | null;
    isVariantInfoComplete?: boolean;
    isWatchSpecComplete?: boolean;
    isInfoComplete?: boolean;
    missingVariantFields?: string[];
    missingWatchSpecFields?: string[];
    hasOpenService?: boolean;
    openServiceStatus?: string | null;
    latestServiceStatus?: string | null;
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
    categories?: Array<{ id: string; name: string; code: string; scope: string }>;
    productTypes: Array<{ label: string; value: string }>;
    canViewCost: boolean;
    canEditPrice: boolean;
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

function hasMissingReadinessInfo(p: ProductRow) {
    return !hasValidImage(p) || !hasValidPrice(p) || !p.isInfoComplete;
}

function getQuickFixHints(p: ProductRow) {
    const hints: string[] = [];

    if (!hasValidImage(p)) hints.push("Thêm ảnh ngay ở ô ảnh bên trái của dòng sản phẩm.");
    if (!hasValidPrice(p)) hints.push("Có thể chỉnh nhanh giá ngay tại cột Giá bán.");
    if (!p.isInfoComplete) hints.push("Các trường variant/spec cần bổ sung ở trang chỉnh sửa sản phẩm.");

    return hints;
}

function getServiceLabel(p: ProductRow) {
    if (p.hasOpenService || p.openServiceStatus) {
        return {
            label: `Đang service${p.openServiceStatus ? ` (${p.openServiceStatus})` : ""}`,
            tone: "blue" as const,
        };
    }

    if (p.latestServiceStatus === "COMPLETED" || p.latestServiceStatus === "DELIVERED") {
        return {
            label: "Đã service xong",
            tone: "green" as const,
        };
    }

    if (p.latestServiceStatus === "CANCELED") {
        return {
            label: "Service đã hủy",
            tone: "gray" as const,
        };
    }

    if (p.latestServiceStatus) {
        return {
            label: `Service gần nhất (${p.latestServiceStatus})`,
            tone: "blue" as const,
        };
    }

    return null;
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

function InlineMoneyEditor({
    productId,
    field,
    value,
    label,
    onSaved,
}: {
    productId: string;
    field: "minPrice" | "salePrice";
    value: number | null | undefined;
    label: string;
    onSaved: (v: number | null) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value == null ? "" : String(value));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setDraft(value == null ? "" : String(value));
    }, [value]);

    async function save() {
        const trimmed = draft.trim();
        const nextValue = trimmed === "" ? null : Number(trimmed);

        if (nextValue != null && (!Number.isFinite(nextValue) || nextValue < 0)) {
            alert(`${label} không hợp lệ`);
            return;
        }

        try {
            setSaving(true);

            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    [field]: nextValue,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || `Cập nhật ${label.toLowerCase()} thất bại`);
            }

            onSaved(nextValue);
            setEditing(false);
        } catch (e: any) {
            alert(e?.message || `Cập nhật ${label.toLowerCase()} thất bại`);
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
                    placeholder="Để trống = bỏ"
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
                        setDraft(value == null ? "" : String(value));
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
            className="group inline-flex items-center justify-end gap-2 rounded px-2 py-1 hover:bg-gray-50"
            title={`Chỉnh nhanh ${label.toLowerCase()}`}
        >
            <span className={field === "salePrice" ? "text-emerald-700 font-medium" : "font-semibold"}>
                {fmtMoney(value)}
            </span>
            <span className="text-xs text-gray-400 opacity-0 transition group-hover:opacity-100">
                sửa
            </span>
        </button>
    );
}

function ReadinessDetailModal({
    product,
    open,
    onClose,
    onEdit,
}: {
    product: ProductRow | null;
    open: boolean;
    onClose: () => void;
    onEdit: (id: string) => void;
}) {
    if (!open || !product) return null;

    const missingVariantFields = Array.from(new Set(product.missingVariantFields ?? []));
    const missingWatchSpecFields = Array.from(new Set(product.missingWatchSpecFields ?? []));
    const quickFixHints = getQuickFixHints(product);

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
                    <div>
                        <div className="text-lg font-semibold">Kiểm tra thông tin sản phẩm</div>
                        <div className="mt-1 text-sm text-gray-600">{product.title || "-"}</div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4 text-sm">
                    <div className="flex flex-wrap gap-2">
                        <DotLabel
                            label={hasValidImage(product) ? "Đã có ảnh" : "Thiếu ảnh"}
                            tone={hasValidImage(product) ? "green" : "orange"}
                        />
                        <DotLabel
                            label={hasValidPrice(product) ? "Đã có giá" : "Thiếu giá"}
                            tone={hasValidPrice(product) ? "green" : "orange"}
                        />
                        <DotLabel
                            label={product.isInfoComplete ? "Đủ variant/spec" : "Thiếu variant/spec"}
                            tone={product.isInfoComplete ? "green" : "orange"}
                        />
                        {(() => {
                            const serviceLabel = getServiceLabel(product);
                            return serviceLabel ? (
                                <DotLabel label={serviceLabel.label} tone={serviceLabel.tone} />
                            ) : null;
                        })()}
                    </div>

                    {hasMissingReadinessInfo(product) ? (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <div className="font-medium text-orange-900">Các mục còn thiếu</div>

                            <div className="mt-3 space-y-3 text-orange-900">
                                {!hasValidImage(product) ? <div>• Chưa có ảnh hiển thị</div> : null}
                                {!hasValidPrice(product) ? <div>• Chưa có giá bán hợp lệ</div> : null}

                                {!!missingVariantFields.length && (
                                    <div>
                                        <div className="font-medium">Variant còn thiếu</div>
                                        <div className="mt-1 text-sm">{missingVariantFields.join(", ")}</div>
                                    </div>
                                )}

                                {!!missingWatchSpecFields.length && (
                                    <div>
                                        <div className="font-medium">Watch spec còn thiếu</div>
                                        <div className="mt-1 text-sm">{missingWatchSpecFields.join(", ")}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                            Sản phẩm đã đủ thông tin cơ bản để post.
                        </div>
                    )}

                    {quickFixHints.length ? (
                        <div className="rounded-lg border bg-gray-50 p-4">
                            <div className="font-medium text-gray-900">Gợi ý bổ sung nhanh</div>
                            <div className="mt-2 space-y-1 text-gray-700">
                                {quickFixHints.map((hint) => (
                                    <div key={hint}>• {hint}</div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {product.hasOpenService ? (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
                            Sản phẩm đang trong quá trình service nên chưa nên bulk post cho đến khi hoàn tất.
                        </div>
                    ) : product.latestServiceStatus === "COMPLETED" || product.latestServiceStatus === "DELIVERED" ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                            Sản phẩm đã có service hoàn tất gần nhất.
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(product.id)}
                        className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                        Bổ sung ngay
                    </button>
                </div>
            </div>
        </div>
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
    const [showBulkSaleModal, setShowBulkSaleModal] = useState(false);
    const [bulkSaleValue, setBulkSaleValue] = useState("");
    const [bulkSaleSaving, setBulkSaleSaving] = useState(false);

    const [readinessProduct, setReadinessProduct] = useState<ProductRow | null>(null);
    const [openReadinessModal, setOpenReadinessModal] = useState(false);

    const [serviceHistoryProduct, setServiceHistoryProduct] = useState<ProductRow | null>(null);
    const [serviceHistoryOpen, setServiceHistoryOpen] = useState(false);

    const [openService, setOpenService] = useState(false);
    const [serviceProductId, setServiceProductId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
        setShowBulkSaleModal(false);
        setBulkSaleValue("");
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

    const selectableIds = useMemo(() => rows.map((x) => x.id), [rows]);

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

    function openReadinessDetail(product: ProductRow) {
        setServiceHistoryOpen(false);
        setServiceHistoryProduct(null);
        setReadinessProduct(product);
        setOpenReadinessModal(true);
    }

    function openServiceHistory(product: ProductRow) {
        setOpenReadinessModal(false);
        setReadinessProduct(null);
        setServiceHistoryProduct(product);
        setServiceHistoryOpen(true);
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

    function patchLocalPrice(id: string, price: number | null) {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, minPrice: price } : row))
        );
    }

    function patchLocalSalePrice(id: string, salePrice: number | null) {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, salePrice } : row))
        );
    }

    async function applyBulkSale() {
        const trimmed = bulkSaleValue.trim();
        const nextSalePrice = trimmed === "" ? null : Number(trimmed);

        if (nextSalePrice != null && (!Number.isFinite(nextSalePrice) || nextSalePrice < 0)) {
            alert("Giá sale không hợp lệ");
            return;
        }

        try {
            setBulkSaleSaving(true);

            const res = await fetch("/api/admin/products/bulk-sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productIds: selectedIds,
                    salePrice: nextSalePrice,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || "Bulk sale thất bại");
            }

            setRows((prev) =>
                prev.map((row) =>
                    selectedIds.includes(row.id)
                        ? { ...row, salePrice: nextSalePrice }
                        : row
                )
            );

            setShowBulkSaleModal(false);
            setBulkSaleValue("");
            router.refresh();
        } catch (e: any) {
            alert(e?.message || "Bulk sale thất bại");
        } finally {
            setBulkSaleSaving(false);
        }
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
                        onClick={() => setShowBulkSaleModal(true)}
                        type="button"
                    >
                        Bulk sale
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
                                    const data = await res.json().catch(() => null);
                                    if (!res.ok) {
                                        alert(data?.message || data?.error || "Bulk post thất bại");
                                        return;
                                    }

                                    if (Array.isArray(data?.failed) && data.failed.length > 0) {
                                        const firstFailed = data.failed.slice(0, 3).map((item: any) => {
                                            const title = item?.title || item?.id || "Unknown";
                                            const reasons = Array.isArray(item?.reasons)
                                                ? item.reasons.join(" | ")
                                                : "";
                                            return `- ${title}: ${reasons}`;
                                        });

                                        alert(`Đã post ${data?.count ?? 0} sản phẩm. Còn ${data.failed.length} sản phẩm chưa đạt điều kiện.\n\n${firstFailed.join("\n")}`);
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

            {!isStrapCatalog && showBulkSaleModal && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[420px] p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Bulk sale</h3>

                        <div className="text-sm text-gray-600">
                            Áp dụng giá sale cho <b>{selectedIds.length}</b> sản phẩm.
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Giá sale</div>
                            <input
                                type="number"
                                min={0}
                                value={bulkSaleValue}
                                onChange={(e) => setBulkSaleValue(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                                placeholder="Để trống để xóa sale"
                            />
                            <div className="text-xs text-gray-500">
                                Nhập giá sale cố định. Để trống để bỏ sale hàng loạt.
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => {
                                    setShowBulkSaleModal(false);
                                    setBulkSaleValue("");
                                }}
                                type="button"
                                disabled={bulkSaleSaving}
                            >
                                Hủy
                            </button>

                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={applyBulkSale}
                                type="button"
                                disabled={bulkSaleSaving}
                            >
                                {bulkSaleSaving ? "Đang lưu..." : "Xác nhận"}
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
                                        <tr key={p.id} className="border-t [&>td]:align-middle">
                                            <td className="px-4 py-5">
                                                <InlineImagePicker
                                                    imageUrl={p.primaryImageUrl ?? null}
                                                    onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                />
                                            </td>

                                            <td className="px-3 py-5">
                                                <div className="font-medium text-sm">{p.title || "-"}</div>
                                            </td>

                                            <td className="px-3 py-5">
                                                <StrapSpecText p={p} />
                                            </td>

                                            <td className="px-3 py-5 text-right font-semibold">
                                                {Number(p.stockQty ?? 0)}
                                            </td>

                                            <td className="px-3 py-5 text-right">
                                                {fmtMoney(p.purchasePrice)}
                                            </td>

                                            <td className="px-3 py-5 text-right">
                                                {props.canEditPrice ? (
                                                    <InlineMoneyEditor
                                                        productId={p.id}
                                                        field="minPrice"
                                                        value={p.minPrice}
                                                        label="Giá bán"
                                                        onSaved={(v) => patchLocalPrice(p.id, v)}
                                                    />
                                                ) : (
                                                    <div className="font-semibold">{fmtMoney(p.minPrice)}</div>
                                                )}
                                            </td>

                                            <td className="px-3 py-5">{p.vendorName || "-"}</td>

                                            <td className="px-3 py-5">{fmtDT(p.updatedAt)}</td>

                                            <td className="px-3 py-5 text-right">
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
                                                    setSelectedIds([]);
                                                    setShowBulkBar(false);
                                                }
                                            }}
                                        />
                                    </th>

                                    <th className="px-3 py-3">Ảnh</th>
                                    <th className="px-3 py-3">Tên</th>
                                    <th className="px-3 py-3">Vendor</th>
                                    <th className="px-3 py-3 text-right">Giá bán</th>
                                    <th className="px-3 py-3 text-right">Sale</th>
                                    {props.canViewCost && <th className="px-3 py-3 text-right">Giá mua</th>}
                                    <th className="px-3 py-3">Trạng thái</th>
                                    <th className="px-3 py-3">Cập nhật</th>
                                    <th className="px-3 py-3">Tạo lúc</th>
                                    <th className="px-3 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={props.canViewCost ? 11 : 10}
                                            className="px-3 py-10 text-center text-gray-500"
                                        >
                                            Không có dữ liệu trong tab này
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => {
                                        const checked = selectedIds.includes(p.id);

                                        return (
                                            <tr key={p.id} className="border-t [&>td]:align-middle">
                                                <td className="px-3 py-5">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedIds((prev) => Array.from(new Set([...prev, p.id])));
                                                            } else {
                                                                setSelectedIds((prev) => prev.filter((id) => id !== p.id));
                                                            }
                                                        }}
                                                    />
                                                </td>

                                                <td className="px-4 py-5">
                                                    <div className="scale-110 origin-left">
                                                        <InlineImagePicker
                                                            imageUrl={p.primaryImageUrl ?? null}
                                                            onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="px-3 py-5">
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-sm leading-5">{p.title || "-"}</div>

                                                        <div className="text-[11px] text-gray-400 uppercase tracking-wide">
                                                            {`${(p.brand || "-").toLowerCase()} · ${(p.type || "-").toLowerCase()}`}
                                                        </div>

                                                        <div className="flex flex-col items-start gap-1 pt-1">
                                                            {hasMissingReadinessInfo(p) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openReadinessDetail(p);
                                                                    }}
                                                                    className="rounded-full text-left"
                                                                >
                                                                    <DotLabel label="Chưa đủ thông tin" tone="orange" />
                                                                </button>
                                                            ) : (
                                                                <DotLabel label="Đã đủ thông tin" tone="green" />
                                                            )}

                                                            {(() => {
                                                                const serviceLabel = getServiceLabel(p);
                                                                return serviceLabel ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            openServiceHistory(p);
                                                                        }}
                                                                        className="rounded-full text-left"
                                                                    >
                                                                        <DotLabel label={serviceLabel.label} tone={serviceLabel.tone} />
                                                                    </button>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-5 whitespace-nowrap">{p.vendorName || "-"}</td>

                                                <td className="px-3 py-5 text-right">
                                                    {props.canEditPrice ? (
                                                        <InlineMoneyEditor
                                                            productId={p.id}
                                                            field="minPrice"
                                                            value={p.minPrice}
                                                            label="Giá bán"
                                                            onSaved={(v) => patchLocalPrice(p.id, v)}
                                                        />
                                                    ) : (
                                                        <div className="font-semibold text-base">{fmtMoney(p.minPrice)}</div>
                                                    )}
                                                </td>

                                                <td className="px-3 py-5 text-right">
                                                    {props.canEditPrice ? (
                                                        <InlineMoneyEditor
                                                            productId={p.id}
                                                            field="salePrice"
                                                            value={p.salePrice}
                                                            label="Giá sale"
                                                            onSaved={(v) => patchLocalSalePrice(p.id, v)}
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-emerald-700">
                                                            {p.salePrice != null ? fmtMoney(p.salePrice) : "-"}
                                                        </div>
                                                    )}
                                                </td>

                                                {props.canViewCost && (
                                                    <td className="px-3 py-5 text-right">
                                                        <div className="text-sm">{fmtMoney(p.purchasePrice)}</div>
                                                    </td>
                                                )}

                                                <td className="px-3 py-5 whitespace-nowrap">
                                                    <StatusBadge status={p.status} />
                                                </td>

                                                <td className="px-3 py-5 whitespace-nowrap">
                                                    <div className="text-sm leading-5">{fmtDT(p.updatedAt)}</div>
                                                </td>

                                                <td className="px-3 py-5 whitespace-nowrap">
                                                    <div className="text-sm leading-5">{fmtDT(p.createdAt)}</div>
                                                </td>

                                                <td className="px-3 py-5 text-right">
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

            <ReadinessDetailModal
                open={openReadinessModal}
                product={readinessProduct}
                onClose={() => {
                    setOpenReadinessModal(false);
                    setReadinessProduct(null);
                }}
                onEdit={(id) => router.push(`/admin/products/${id}/edit`)}
            />


            <ServiceHistoryModal
                open={serviceHistoryOpen}
                onClose={() => {
                    setServiceHistoryOpen(false);
                    setServiceHistoryProduct(null);
                }}
                product={serviceHistoryProduct ? {
                    id: serviceHistoryProduct.id,
                    title: serviceHistoryProduct.title,
                    openServiceStatus: serviceHistoryProduct.openServiceStatus,
                    latestServiceStatus: serviceHistoryProduct.latestServiceStatus,
                } : null}
            />

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