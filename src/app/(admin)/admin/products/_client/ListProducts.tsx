"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RowActionsMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import type { BrandLite, ProductListItem } from "@/features/products/types";
import DotLabel from "../../__components/DotLabel";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import StatusBadge from "@/components/badges/StatusBadge";
import InlineImagePicker from "../_components/InlineImagePicker";

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
    brandId?: string | null;
    category?:
    | string
    | {
        id?: string | null;
        name?: string | null;
        code?: string | null;
        slug?: string | null;
    }
    | null;
    variantSnapshot?: {
        price?: number | null;
        availabilityStatus?: string | null;
        stockQty?: number | null;
        sku?: string | null;
    } | null;
    updatedAt?: string | null;
    createdAt?: string | null;
    status?: string | null;
    contentStatus?: string | null;
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
    acquisitionId?: string | null;
    acquisitionRefNo?: string | null;
    isReadyToPublish?: boolean;
    publishMissing?: string[];
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
    vendors: Array<{ id: string; name: string }>;
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
    const count = Number(p.imagesCount ?? 0);
    if (Number.isFinite(count) && count > 0) return true;

    const img = p.primaryImageUrl;
    return typeof img === "string" && img.trim().length > 0;
}

function hasMissingImageReadiness(p: ProductRow) {
    if ((p.publishMissing ?? []).includes("images")) return true;
    return !hasValidImage(p);
}

function hasMissingCoreReadinessInfo(p: ProductRow) {
    const missing = new Set(p.publishMissing ?? []);
    const hasStructuredMissing = missing.size > 0;

    if (hasStructuredMissing) {
        for (const key of missing) {
            if (key !== "images") return true;
        }
        return false;
    }

    return !hasValidPrice(p) || !p.isInfoComplete;
}

function hasMissingReadinessInfo(p: ProductRow) {
    return hasMissingImageReadiness(p) || hasMissingCoreReadinessInfo(p);
}

function getQuickFixHints(p: ProductRow) {
    const hints: string[] = [];
    const missing = new Set(p.publishMissing ?? []);

    if (missing.has("images") || (!p.publishMissing && !hasValidImage(p))) {
        hints.push("Bổ sung đủ ảnh sản phẩm ở cột ảnh bên trái hoặc trong trang edit.");
    }
    if (missing.has("brandId")) {
        hints.push("Chọn thương hiệu trong trang chỉnh sửa sản phẩm.");
    }
    if (missing.has("variant") || (!p.publishMissing && !hasValidPrice(p))) {
        hints.push("Cập nhật giá bán, trạng thái kho hoặc tồn kho của variant.");
    }
    if ((p.publishMissing ?? []).some((field) => !["images", "brandId", "variant"].includes(field)) || !p.isInfoComplete) {
        hints.push("Bổ sung đầy đủ watch spec / variant trong trang chỉnh sửa sản phẩm.");
    }

    return Array.from(new Set(hints));
}

function isPublishMissing(product: ProductRow, key: string) {
    return (product.publishMissing ?? []).includes(key);
}

function getPublishImageRequirement(product: ProductRow) {
    return product.type === "WATCH_STRAP" ? 1 : 4;
}

function getDetailedPublishMissing(product: ProductRow) {
    const known = new Set(["images", "brandId", "variant", "watchSpec"]);
    return (product.publishMissing ?? []).filter((item) => !known.has(item));
}

function getProductInventoryStatusText(status?: string | null) {
    switch (String(status || "").toUpperCase()) {
        case "AVAILABLE":
            return "Availalbe";
        case "HOLD":
            return "Giữ hàng";
        case "SOLD":
            return "Đã bán";
        case "IN_SERVICE":
            return "In Service";
        case "CONSIGNED_TO":
            return "Gửi đối tác";
        case "CONSIGNED_FROM":
            return "Ký gửi";
        case "DRAFT":
            return "Nháp";
        default:
            return status || "-";
    }
}

function getInventoryStatusTextClass(status?: string | null) {
    const s = String(status || "").toUpperCase();

    switch (s) {
        case "AVAILABLE":
            return "text-sm font-medium text-emerald-700";
        case "IN_SERVICE":
            return "text-sm font-medium text-amber-700";
        case "HOLD":
            return "text-sm font-medium text-slate-600";
        case "SOLD":
            return "text-sm font-medium text-rose-700";
        case "CONSIGNED_TO":
        case "CONSIGNED_FROM":
            return "text-sm font-medium text-violet-700";
        case "DRAFT":
            return "text-sm font-medium text-slate-500";
        default:
            return "text-sm font-medium text-slate-500";
    }
}

function getContentStatusBadgeValue(p: ProductRow) {
    const current = String(p.contentStatus ?? "").toUpperCase();
    if (current === "PUBLISHED") return "POSTED";
    if (current === "ARCHIVED") return "ARCHIVED";
    return "DRAFT";
}

function getServiceLabel(p: ProductRow) {
    const current = p.openServiceStatus ?? p.latestServiceStatus ?? null;

    switch (current) {
        case "DRAFT":
            return {
                label: "Cần service",
                tone: "orange" as const,
            };

        case "DIAGNOSING":
        case "WAIT_APPROVAL":
        case "IN_PROGRESS":
            return {
                label: "Đang service",
                tone: "blue" as const,
            };

        case "COMPLETED":
        case "DELIVERED":
            return {
                label: "Đã service",
                tone: "green" as const,
            };

        case "CANCELED":
            return {
                label: "Đã hủy service",
                tone: "gray" as const,
            };

        default:
            return null;
    }
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

function getCategoryKey(product: ProductRow) {
    const raw =
        typeof product.category === "string"
            ? product.category
            : product.category?.code ?? product.category?.slug ?? product.category?.name ?? null;

    return String(raw || "").trim().toUpperCase();
}

function isWomenWatch(product: ProductRow) {
    const key = getCategoryKey(product);
    return key === "WOMEN_WATCH" || key === "LADIES_WATCH" || key === "NU_WATCH";
}

function getPostReadinessState(product: ProductRow) {
    if (isWomenWatch(product)) {
        return {
            label: "Post thủ công",
            tone: "orange" as const,
        };
    }

    if (hasMissingCoreReadinessInfo(product)) {
        return {
            label: "Missing Info",
            tone: "orange" as const,
        };
    }

    if (hasMissingImageReadiness(product)) {
        return {
            label: "Missing Image",
            tone: "orange" as const,
        };
    }

    return {
        label: "Ready to post",
        tone: "green" as const,
    };
}

function MiniDotLabel({
    label,
    tone,
    className = "",
}: {
    label: string;
    tone: "orange" | "green" | "blue" | "gray";
    className?: string;
}) {
    const map: Record<string, string> = {
        orange: "text-orange-600",
        green: "text-emerald-600",
        blue: "text-blue-600",
        gray: "text-slate-500",
    };

    return (
        <span className={`inline-flex items-center gap-1 text-[10px] leading-4 font-medium ${map[tone]} ${className}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${tone === "orange"
                ? "bg-orange-500"
                : tone === "green"
                    ? "bg-emerald-500"
                    : tone === "blue"
                        ? "bg-blue-500"
                        : "bg-slate-400"
                }`}
            />
            <span>{label}</span>
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
    const detailedPublishMissing = Array.from(new Set(getDetailedPublishMissing(product)));
    const quickFixHints = getQuickFixHints(product);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
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
                            label={
                                isPublishMissing(product, "images")
                                    ? `Thiếu ảnh (cần ${getPublishImageRequirement(product)})`
                                    : "Ảnh đạt yêu cầu"
                            }
                            tone={isPublishMissing(product, "images") ? "orange" : "green"}
                        />
                        <DotLabel
                            label={isPublishMissing(product, "brandId") ? "Thiếu thương hiệu" : "Đã có thương hiệu"}
                            tone={isPublishMissing(product, "brandId") ? "orange" : "green"}
                        />
                        <DotLabel
                            label={isPublishMissing(product, "variant") ? "Variant chưa đạt" : "Variant đạt"}
                            tone={isPublishMissing(product, "variant") ? "orange" : "green"}
                        />
                        <DotLabel
                            label={
                                ((product.publishMissing ?? []).some((item) => !["images", "brandId", "variant"].includes(item)) ||
                                    !product.isInfoComplete)
                                    ? "Thiếu spec"
                                    : "Spec đạt"
                            }
                            tone={
                                ((product.publishMissing ?? []).some((item) => !["images", "brandId", "variant"].includes(item)) ||
                                    !product.isInfoComplete)
                                    ? "orange"
                                    : "green"
                            }
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
                                {isPublishMissing(product, "images") ? (
                                    <div>
                                        • Chưa đủ ảnh hiển thị ({Number(product.imagesCount ?? 0)}/
                                        {getPublishImageRequirement(product)})
                                    </div>
                                ) : null}
                                {isPublishMissing(product, "brandId") ? <div>• Chưa chọn thương hiệu</div> : null}
                                {isPublishMissing(product, "variant") ? (
                                    <div>• Variant chưa đủ điều kiện bán (cần có giá và trạng thái phù hợp)</div>
                                ) : null}

                                {!!missingVariantFields.length && (
                                    <div>
                                        <div className="font-medium">Variant còn thiếu</div>
                                        <div className="mt-1 text-sm">{missingVariantFields.join(", ")}</div>
                                    </div>
                                )}

                                {(isPublishMissing(product, "watchSpec") ||
                                    !!missingWatchSpecFields.length ||
                                    !!detailedPublishMissing.length) && (
                                        <div>
                                            <div className="font-medium">Watch spec còn thiếu</div>
                                            <div className="mt-1 text-sm">
                                                {[...missingWatchSpecFields, ...detailedPublishMissing]
                                                    .filter(Boolean)
                                                    .join(", ") || "Thiếu watch spec"}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                            Sản phẩm đã sẵn sàng public.
                        </div>
                    )}

                    {isWomenWatch(product) ? (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
                            Đồng hồ nữ đi theo luồng quản lý bài đăng thủ công. Có thể giữ trạng thái draft và lên bài thủ công sau.
                        </div>
                    ) : null}

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
    const [bulkServiceLoading, setBulkServiceLoading] = useState(false);

    const [rows, setRows] = useState<ProductRow[]>(props.items ?? []);
    useEffect(() => setRows(props.items ?? []), [props.items]);

    const currentView: ViewKey = useMemo(() => {
        const v = (sp.get("view") || "draft").toLowerCase();
        if (v === "draft" || v === "posted" || v === "in_service" || v === "hold" || v === "sold") {
            return v as ViewKey;
        }
        return "draft";
    }, [sp]);

    const currentCatalog: CatalogKey = useMemo(() => {
        const v = (sp.get("catalog") || "product").toLowerCase();
        return v === "strap" ? "strap" : "product";
    }, [sp]);

    const isStrapCatalog = currentCatalog === "strap";

    function setView(view: string) {
        const next = new URLSearchParams(sp.toString());
        if (view === "draft") next.delete("view");
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
    const sku = sp.get("sku") ?? "";
    const type = sp.get("type") ?? "";
    const brandId = sp.get("brandId") ?? "";
    const vendorId = sp.get("vendorId") ?? "";
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

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
        setShowBulkSaleModal(false);
        setBulkSaleValue("");
    }, [currentCatalog, currentView, q, sku, type, brandId, vendorId, hasImages, sort, props.page]);

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
    const [formSku, setFormSku] = useState(sku);
    const [formType, setFormType] = useState(type);
    const [formBrandId, setFormBrandId] = useState(brandId);
    const [formVendorId, setFormVendorId] = useState(vendorId);
    const [formHasImages, setFormHasImages] = useState(hasImages);
    const [formSort, setFormSort] = useState(sort);

    useEffect(() => setFormQ(q), [q]);
    useEffect(() => setFormSku(sku), [sku]);
    useEffect(() => setFormType(type), [type]);
    useEffect(() => setFormBrandId(brandId), [brandId]);
    useEffect(() => setFormVendorId(vendorId), [vendorId]);
    useEffect(() => setFormHasImages(hasImages), [hasImages]);
    useEffect(() => setFormSort(sort), [sort]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(form: {
        q: string;
        sku: string;
        type: string;
        brandId: string;
        vendorId: string;
        hasImages: string;
        sort: string;
    }) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", form.q.trim() || null);
        setParam(next, "sku", form.sku.trim() || null);

        if (!isStrapCatalog) {
            setParam(next, "type", form.type || null);
            setParam(next, "brandId", form.brandId || null);
        } else {
            next.delete("type");
            next.delete("brandId");
        }

        setParam(next, "vendorId", form.vendorId || null);
        setParam(next, "hasImages", form.hasImages || null);
        setParam(next, "sort", form.sort || "updatedDesc");
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
        next.delete("sku");
        next.delete("type");
        next.delete("brandId");
        next.delete("vendorId");
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
        setReadinessProduct(product);
        setOpenReadinessModal(true);
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

            const data = await res.json().catch(() => ({} as any));
            const nextCover = data?.coverImageUrl || fileKey;
            setRows((prev) => prev.map((row) => (row.id === productId ? { ...row, primaryImageUrl: nextCover } : row)));
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

    async function createTechnicalServiceRequests(productIds: string[]) {
        const ids = Array.from(new Set((productIds ?? []).filter(Boolean)));
        if (!ids.length) return;

        try {
            setBulkServiceLoading(true);

            const res = await fetch("/api/admin/service-requests/from-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productIds: ids,
                    scope: "WITH_PURCHASE",
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.ok === false) {
                throw new Error(data?.error || data?.message || "Tạo service request thất bại");
            }

            alert(data?.message || `Đã tạo ${data?.count ?? ids.length} service request`);
            router.refresh();
        } catch (error: any) {
            alert(error?.message || "Tạo service request thất bại");
        } finally {
            setBulkServiceLoading(false);
        }
    }

    const segmentTabs = isStrapCatalog
        ? [
            { key: "draft", label: "Chờ duyệt", count: counts.draft },
            { key: "all", label: "Tất cả", count: counts.all },
            { key: "posted", label: "Đã post", count: counts.posted },
        ]
        : [
            { key: "draft", label: "Chờ duyệt", count: counts.draft },
            { key: "all", label: "Tất cả", count: counts.all },
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
                            className={`rounded-md px-3 py-1.5 text-sm ${!isStrapCatalog ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                            Sản phẩm
                        </button>

                        <button
                            type="button"
                            onClick={() => setCatalog("strap")}
                            className={`rounded-md px-3 py-1.5 text-sm ${isStrapCatalog ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"}`}
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
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
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
                        sku: formSku,
                        type: formType,
                        brandId: formBrandId,
                        vendorId: formVendorId,
                        hasImages: formHasImages,
                        sort: formSort,
                    });
                }}
            >
                <div className={`grid grid-cols-1 gap-3 ${isStrapCatalog ? "lg:grid-cols-5" : "lg:grid-cols-7"}`}>
                    <div>
                        <div className="mb-1 text-xs text-gray-500">Tìm kiếm</div>
                        <input
                            value={formQ}
                            onChange={(e) => setFormQ(e.target.value)}
                            placeholder={isStrapCatalog ? "Tên dây / chất liệu..." : "Tên / brand..."}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    {!isStrapCatalog && (
                        <div>
                            <div className="mb-1 text-xs text-gray-500">SKU</div>
                            <input
                                value={formSku}
                                onChange={(e) => setFormSku(e.target.value)}
                                placeholder="SKU..."
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>
                    )}

                    {!isStrapCatalog && (
                        <>
                            <div>
                                <div className="mb-1 text-xs text-gray-500">Type</div>
                                <select
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
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
                                <div className="mb-1 text-xs text-gray-500">Brand</div>
                                <select
                                    value={formBrandId}
                                    onChange={(e) => setFormBrandId(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
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
                        <div className="mb-1 text-xs text-gray-500">Vendor</div>
                        <select
                            value={formVendorId}
                            onChange={(e) => setFormVendorId(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="">(All)</option>
                            {props.vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="mb-1 text-xs text-gray-500">Image</div>
                        <select
                            value={formHasImages}
                            onChange={(e) => setFormHasImages(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="">(All)</option>
                            <option value="yes">Có ảnh</option>
                            <option value="no">Chưa có ảnh</option>
                        </select>
                    </div>

                    <div>
                        <div className="mb-1 text-xs text-gray-500">Sắp xếp</div>
                        <select
                            value={formSort}
                            onChange={(e) => setFormSort(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
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
                    <button type="submit" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                        Lọc
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
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
                <div className="flex items-center gap-4 rounded border bg-blue-50 p-3">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} product đã chọn
                    </span>

                    <button
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Bulk post
                    </button>

                    <button
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => setShowBulkSaleModal(true)}
                        type="button"
                    >
                        Bulk sale
                    </button>

                    <button
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => {
                            setSelectedIds([]);
                            setShowBulkBar(false);
                        }}
                        type="button"
                    >
                        Bỏ chọn
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={!selectedIds.length || bulkServiceLoading}
                        onClick={() => createTechnicalServiceRequests(selectedIds)}
                    >
                        {bulkServiceLoading ? "Đang tạo..." : "Bulk request service"}
                    </button>
                </div>
            )}

            {!isStrapCatalog && showBulkConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="w-[420px] space-y-4 rounded-lg bg-white p-5">
                        <h3 className="text-lg font-semibold">Post products</h3>

                        <div className="text-sm text-gray-600">
                            Bạn đang post <b>{selectedIds.length}</b> sản phẩm.
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="rounded border px-3 py-1"
                                onClick={() => setShowBulkConfirm(false)}
                                type="button"
                            >
                                Hủy
                            </button>

                            <button
                                className="rounded bg-blue-600 px-3 py-1 text-white"
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

                                        alert(
                                            `Đã post ${data?.count ?? 0} sản phẩm. Còn ${data.failed.length} sản phẩm chưa đạt điều kiện.\n\n${firstFailed.join("\n")}`
                                        );
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="w-[420px] space-y-4 rounded-lg bg-white p-5">
                        <h3 className="text-lg font-semibold">Bulk sale</h3>

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
                                className="rounded border px-3 py-1"
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
                                className="rounded bg-blue-600 px-3 py-1 text-white"
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

            <div className="overflow-hidden rounded-xl border">
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
                                            <td className="min-w-[76px] w-[76px] px-4 py-5">
                                                <InlineImagePicker
                                                    imageUrl={p.primaryImageUrl ?? null}
                                                    onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                />
                                            </td>

                                            <td className="px-3 py-5">
                                                <div className="text-sm font-medium">{p.title || "-"}</div>
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
                                    <th className="px-3 py-3">SKU</th>
                                    <th className="px-3 py-3">Vendor</th>
                                    <th className="px-3 py-3 whitespace-nowrap">Trạng thái</th>
                                    <th className="px-3 py-3 whitespace-nowrap">Phiếu nhập</th>
                                    <th className="px-3 py-3 text-right">Giá bán</th>
                                    <th className="px-3 py-3 text-right">Sale</th>
                                    {props.canViewCost && <th className="px-3 py-3 text-right">Giá mua</th>}
                                    <th className="px-3 py-3">Bài đăng</th>
                                    <th className="px-3 py-3">Cập nhật</th>
                                    <th className="px-3 py-3">Tạo lúc</th>
                                    <th className="px-3 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={props.canViewCost ? 12 : 11}
                                            className="px-3 py-10 text-center text-gray-500"
                                        >
                                            Không có dữ liệu trong tab này
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => {
                                        const checked = selectedIds.includes(p.id);
                                        const postState = getPostReadinessState(p);

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
                                                    <div className="origin-left scale-110">
                                                        <InlineImagePicker
                                                            imageUrl={p.primaryImageUrl ?? null}
                                                            onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="px-3 py-5">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium leading-5">{p.title || "-"}</div>

                                                        <div className="text-[11px] uppercase tracking-wide text-gray-400">
                                                            {`${(p.brand || "-").toLowerCase()} · ${(p.type || "-").toLowerCase()}`}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5 text-sm font-mono">
                                                    {p.variantSnapshot?.sku || "-"}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">{p.vendorName || "-"}</td>

                                                <td className="whitespace-nowrap px-3 py-5 align-middle">
                                                    <span className={getInventoryStatusTextClass(p.status)}>
                                                        {getProductInventoryStatusText(p.status)}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">
                                                    {p.acquisitionId && p.acquisitionRefNo ? (
                                                        <Link
                                                            href={`/admin/acquisitions/${p.acquisitionId}/edit`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {p.acquisitionRefNo}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5 text-right align-middle">
                                                    {props.canEditPrice ? (
                                                        <InlineMoneyEditor
                                                            productId={p.id}
                                                            field="minPrice"
                                                            value={p.minPrice}
                                                            label="Giá bán"
                                                            onSaved={(v) => patchLocalPrice(p.id, v)}
                                                        />
                                                    ) : (
                                                        <div className="tabular-nums text-[17px] font-semibold leading-none text-gray-950">
                                                            {fmtMoney(p.minPrice)}
                                                        </div>
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

                                                <td className="whitespace-nowrap px-3 py-5 align-middle">
                                                    <div className="flex flex-col justify-center">
                                                        <div className="flex h-[20px] items-center">
                                                            <StatusBadge status={getContentStatusBadgeValue(p)} />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openReadinessDetail(p);
                                                            }}
                                                            className="mt-1 text-left"
                                                        >
                                                            <div className="flex flex-col">
                                                                <MiniDotLabel label={postState.label} tone={postState.tone} />
                                                                {!isWomenWatch(p) && hasMissingCoreReadinessInfo(p) && hasMissingImageReadiness(p) && (
                                                                    <MiniDotLabel label="Missing Image" tone="gray" className="mt-0.5" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">
                                                    <div className="text-sm leading-5">{fmtDT(p.updatedAt)}</div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">
                                                    <div className="text-sm leading-5">{fmtDT(p.createdAt)}</div>
                                                </td>

                                                <td className="px-3 py-5 text-right">
                                                    <RowActionsMenu
                                                        onView={() => router.push(`/admin/products/${p.id}`)}
                                                        onEdit={() => router.push(`/admin/products/${p.id}/edit`)}
                                                        onDelete={() => handleDelete(p.id)}
                                                        onService={() => {
                                                            createTechnicalServiceRequests([p.id]);
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
                        className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        disabled={props.page <= 1}
                        onClick={() => goPage(Math.max(1, props.page - 1))}
                    >
                        ← Trước
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2 disabled:opacity-50"
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
        </div>
    );
}