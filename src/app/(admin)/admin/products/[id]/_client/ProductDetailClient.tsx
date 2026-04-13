"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    ExternalLink,
    FileText,
    History,
    Pencil,
    Save,
    Settings2,
    ShoppingCart,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Wrench,
} from "lucide-react";

import DotLabel from "@/app/(admin)/admin/__components/DotLabel";
import { useNotify } from "@/components/feedback/AppToastProvider";

type ProductDetailPayload = {
    product: any;
    serviceHistory: any[];
    tradeHistory?: {
        acquisitions: any[];
        orders: any[];
    };
    acquisitionHistory?: any[];
    orderHistory?: any[];
};

type ProductDetailClientProps = {
    data: ProductDetailPayload;
    canViewTradeFinancials: boolean;
};

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function fmtDate(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtMoney(value?: number | null, currency = "VND") {
    if (value == null || !Number.isFinite(Number(value))) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(Number(value))} ${currency}`;
}

function boolText(value?: boolean | null) {
    if (value == null) return "-";
    return value ? "Có" : "Không";
}

function signedImageUrl(key?: string | null) {
    if (!key) return "";
    return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

function toneForStatus(status?: string | null): "green" | "blue" | "gray" | "orange" {
    const s = String(status ?? "").toUpperCase();

    if (["AVAILABLE", "ACTIVE", "READY", "COMPLETED", "PUBLISHED", "PAID", "DELIVERED"].includes(s)) {
        return "green";
    }
    if (["HOLD", "IN_SERVICE", "RESERVED", "WAIT_APPROVAL", "DIAGNOSING", "DRAFT", "PENDING"].includes(s)) {
        return "orange";
    }
    if (["SOLD", "ARCHIVED", "HIDDEN", "CANCELED", "CANCELLED", "FAILED", "REFUNDED"].includes(s)) {
        return "gray";
    }

    return "blue";
}

function profitTone(value?: number | null) {
    if (value == null || !Number.isFinite(Number(value))) return "text-slate-500";
    if (Number(value) > 0) return "text-emerald-600";
    if (Number(value) < 0) return "text-red-600";
    return "text-slate-600";
}

function CollapsibleSection({
    title,
    desc,
    icon,
    defaultOpen = true,
    right,
    children,
}: {
    title: string;
    desc?: string;
    icon: React.ReactNode;
    defaultOpen?: boolean;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 text-left"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-slate-900">{title}</h2>
                        {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {right}
                    <span className="text-slate-400">
                        {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </span>
                </div>
            </button>

            {open ? <div className="p-5">{children}</div> : null}
        </section>
    );
}

function Field({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className={cls("text-sm text-slate-900", mono && "font-mono")}>{value}</div>
        </div>
    );
}

function TinyStat({
    label,
    value,
    hint,
}: {
    label: string;
    value: React.ReactNode;
    hint?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
            {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
    );
}

export default function ProductDetailClient({
    data,
    canViewTradeFinancials,
}: ProductDetailClientProps) {
    const notify = useNotify();
    const product = data.product;

    const tradeHistory = data.tradeHistory ?? {
        acquisitions: data.acquisitionHistory ?? [],
        orders: data.orderHistory ?? [],
    };

    const gallery = useMemo(() => {
        const out: string[] = [];
        const seen = new Set<string>();

        if (product?.primaryImageUrl && !seen.has(product.primaryImageUrl)) {
            seen.add(product.primaryImageUrl);
            out.push(product.primaryImageUrl);
        }

        for (const img of product?.image ?? []) {
            const key = img?.fileKey;
            if (!key || seen.has(key)) continue;
            seen.add(key);
            out.push(key);
        }

        return out;
    }, [product]);

    const [activeImage, setActiveImage] = useState<string>(gallery[0] ?? "");
    const [content, setContent] = useState(product?.content?.generatedContent ?? product?.postContent ?? "");
    const [promptNote, setPromptNote] = useState(product?.content?.promptNote ?? product?.aiPromptUsed ?? "");
    const [specBullets, setSpecBullets] = useState<string[]>(
        Array.isArray(product?.content?.specBullets) ? product.content.specBullets : []
    );
    const [hashtags, setHashtags] = useState<string[]>(
        Array.isArray(product?.content?.hashtags) ? product.content.hashtags : []
    );

    const bulletText = useMemo(() => {
        return (specBullets ?? [])
            .filter(Boolean)
            .map((item) => `▪️ ${String(item).trim()}`)
            .join("\n");
    }, [specBullets]);

    const hashtagText = useMemo(() => {
        return (hashtags ?? [])
            .filter(Boolean)
            .map((tag) => String(tag).trim())
            .join(" ");
    }, [hashtags]);

    const fullPostText = useMemo(() => {
        return [content?.trim(), bulletText, hashtagText]
            .filter((part) => part && String(part).trim().length > 0)
            .join("\n\n");
    }, [content, bulletText, hashtagText]);
    const [saving, setSaving] = useState(false);
    const [contentStatus, setContentStatus] = useState<string | null>(product?.contentStatus ?? null);
    const [generatedAt, setGeneratedAt] = useState<string | null>(
        product?.content?.generatedAt ?? product?.aiGeneratedAt ?? null
    );

    const latestVariant = product?.variants?.[0] ?? null;
    const latestAcqItem = latestVariant?.acquisitionItem?.[0] ?? null;

    const baseCostPrice =
        latestVariant?.costPrice != null
            ? Number(latestVariant.costPrice)
            : latestAcqItem?.unitCost != null
                ? Number(latestAcqItem.unitCost)
                : null;

    const openService = (data.serviceHistory ?? []).find((x) =>
        !["COMPLETED", "DELIVERED", "CANCELED", "CANCELLED"].includes(String(x.status ?? "").toUpperCase())
    );

    const normalizedOrders = useMemo(() => {
        return (tradeHistory.orders ?? []).map((item: any) => {
            const qty = Number(item?.quantity ?? 0);
            const subtotal =
                item?.subtotal != null
                    ? Number(item.subtotal)
                    : item?.unitPriceAgreed != null
                        ? Number(item.unitPriceAgreed) * qty
                        : null;

            const estimatedCost =
                baseCostPrice != null && Number.isFinite(baseCostPrice)
                    ? baseCostPrice * Math.max(qty, 0)
                    : null;

            const estimatedProfit =
                subtotal != null && estimatedCost != null
                    ? subtotal - estimatedCost
                    : null;

            return {
                ...item,
                quantity: qty,
                subtotal,
                estimatedCost,
                estimatedProfit,
            };
        });
    }, [tradeHistory.orders, baseCostPrice]);

    const totalRevenue = useMemo(() => {
        return normalizedOrders.reduce((sum: number, item: any) => sum + Number(item.subtotal ?? 0), 0);
    }, [normalizedOrders]);

    const totalEstimatedCost = useMemo(() => {
        return normalizedOrders.reduce((sum: number, item: any) => sum + Number(item.estimatedCost ?? 0), 0);
    }, [normalizedOrders]);

    const totalEstimatedProfit = useMemo(() => {
        return normalizedOrders.reduce((sum: number, item: any) => sum + Number(item.estimatedProfit ?? 0), 0);
    }, [normalizedOrders]);

    async function handleSaveContent() {
        try {
            setSaving(true);

            const res = await fetch(`/api/admin/products/${product.id}/content`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    generatedContent: content,
                    promptNote,
                    syncSnapshot: true,
                }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(json?.error || "Không lưu được nội dung");
            }

            setContentStatus(json?.product?.contentStatus ?? "DRAFT");
            setGeneratedAt(json?.content?.generatedAt ?? new Date().toISOString());
            setSpecBullets(Array.isArray(json?.content?.specBullets) ? json.content.specBullets : []);
            setHashtags(Array.isArray(json?.content?.hashtags) ? json.content.hashtags : []);

            notify.success({
                title: "Đã lưu",
                message: "Nội dung sản phẩm đã được cập nhật.",
            });
        } catch (error: any) {
            notify.error({
                title: "Lưu thất bại",
                message: error?.message || "Không lưu được nội dung",
            });
        } finally {
            setSaving(false);
        }
    }
    async function handleCopyFullPost() {
        try {
            await navigator.clipboard.writeText(fullPostText || "");
            notify.success({
                title: "Đã copy",
                message: "Đã copy toàn bộ bài đăng.",
            });
        } catch {
            notify.error({
                title: "Copy thất bại",
                message: "Không copy được toàn bộ bài đăng.",
            });
        }
    }

    async function handleCopyHashtags() {
        try {
            await navigator.clipboard.writeText(hashtagText || "");
            notify.success({
                title: "Đã copy",
                message: "Đã copy hashtags.",
            });
        } catch {
            notify.error({
                title: "Copy thất bại",
                message: "Không copy được hashtags.",
            });
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/admin/products" className="hover:text-slate-700">
                            Sản phẩm
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="truncate">{product.title}</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {product.title}
                            </h1>

                            <DotLabel label={product.status || "-"} tone={toneForStatus(product.status)} />
                            <DotLabel label={contentStatus || "-"} tone={toneForStatus(contentStatus)} />
                            {openService ? (
                                <DotLabel
                                    label={`Service ${openService.status || ""}`}
                                    tone={toneForStatus(openService.status)}
                                />
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span>ID: <span className="font-mono text-slate-700">{product.id}</span></span>
                            <span>Brand: <span className="font-medium text-slate-700">{product.brand?.name || "-"}</span></span>
                            <span>Category: <span className="font-medium text-slate-700">{product.ProductCategory?.name || "-"}</span></span>
                            <span>Updated: <span className="font-medium text-slate-700">{fmtDate(product.updatedAt)}</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/admin/products"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        ← Quay lại
                    </Link>

                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        <Pencil className="h-4 w-4" />
                        Chỉnh sửa
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
                                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                                    {activeImage ? (
                                        <img
                                            src={signedImageUrl(activeImage)}
                                            alt={product.title}
                                            className="h-[420px] w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-[420px] items-center justify-center text-sm text-slate-400">
                                            Chưa có ảnh
                                        </div>
                                    )}
                                </div>

                                {gallery.length > 1 ? (
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {gallery.map((imgKey) => (
                                            <button
                                                key={imgKey}
                                                type="button"
                                                onClick={() => setActiveImage(imgKey)}
                                                className={cls(
                                                    "overflow-hidden rounded-2xl border p-1 transition",
                                                    imgKey === activeImage
                                                        ? "border-slate-900 ring-2 ring-slate-200"
                                                        : "border-slate-200 hover:border-slate-300"
                                                )}
                                            >
                                                <img
                                                    src={signedImageUrl(imgKey)}
                                                    alt="thumb"
                                                    className="h-16 w-16 rounded-xl object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div className="p-5">
                                <div className={cls("grid grid-cols-1 gap-3", canViewTradeFinancials ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
                                    <TinyStat
                                        label="Giá bán"
                                        value={fmtMoney(latestVariant?.salePrice ?? latestVariant?.price, "VND")}
                                    />

                                    {canViewTradeFinancials ? (
                                        <TinyStat
                                            label="Giá vốn"
                                            value={fmtMoney(baseCostPrice, "VND")}
                                            hint={latestVariant?.costPrice != null ? "Lấy từ variant.costPrice" : "Fallback từ acquisition gần nhất"}
                                        />
                                    ) : null}

                                    <TinyStat label="SKU" value={latestVariant?.sku || "-"} />
                                    <TinyStat label="Tồn kho" value={latestVariant?.stockQty ?? 0} />
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Brand" value={product.brand?.name || "-"} />
                                    <Field label="Vendor" value={product.vendor?.name || "-"} />
                                    <Field label="Danh mục" value={product.ProductCategory?.name || "-"} />
                                    <Field label="Tag" value={product.tag || "-"} />
                                    <Field label="Slug" value={product.slug || "-"} mono />
                                    <Field label="Tạo lúc" value={fmtDate(product.createdAt)} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <CollapsibleSection
                        title="Thông số & cấu hình"
                        desc="Snapshot hiện tại của sản phẩm."
                        icon={<Settings2 className="h-5 w-5" />}
                        defaultOpen
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field label="Ref" value={product.watchSpec?.ref || "-"} />
                            <Field label="Model" value={product.watchSpec?.model || "-"} />
                            <Field label="Năm" value={product.watchSpec?.year || "-"} />
                            <Field label="Kiểu vỏ" value={product.watchSpec?.caseType || "-"} />
                            <Field label="Giới tính" value={product.watchSpec?.gender || "-"} />
                            <Field label="Bộ máy" value={product.watchSpec?.movement || "-"} />
                            <Field label="Caliber" value={product.watchSpec?.caliber || "-"} />
                            <Field label="Mặt kính" value={product.watchSpec?.glass || "-"} />
                            <Field label="Loại dây" value={product.watchSpec?.strap || "-"} />
                            <Field label="Dài" value={product.watchSpec?.length ?? "-"} />
                            <Field label="Ngang" value={product.watchSpec?.width ?? "-"} />
                            <Field label="Dày" value={product.watchSpec?.thickness ?? "-"} />
                            <Field label="Có box" value={boolText(product.watchSpec?.boxIncluded)} />
                            <Field label="Có booklet" value={boolText(product.watchSpec?.bookletIncluded)} />
                            <Field label="Có card" value={boolText(product.watchSpec?.cardIncluded)} />
                            <Field label="Có dây" value={boolText(product.watchSpec?.hasStrap)} />
                            <Field label="Có khóa" value={boolText(product.watchSpec?.hasClasp)} />
                            <Field label="Đã serviced" value={boolText(product.watchSpec?.isServiced)} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Snapshot hỗ trợ gen nội dung"
                        desc="Dữ liệu được sync tự động từ Product + WatchSpec."
                        icon={<FileText className="h-5 w-5" />}
                        defaultOpen
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Tiêu đề" value={product.content?.titleSnapshot || "-"} />
                            <Field label="Brand" value={product.content?.brandSnapshot || "-"} />
                            <Field label="Ref" value={product.content?.refSnapshot || "-"} />
                            <Field label="Kích thước" value={product.content?.sizeSnapshot || "-"} />
                            <Field label="Loại máy" value={product.content?.movementSnapshot || "-"} />
                            <Field label="Chất liệu kính" value={product.content?.glassSnapshot || "-"} />
                            <Field label="Dây / khóa" value={product.content?.strapClaspSnapshot || "-"} />
                            <Field label="Model" value={product.content?.modelSnapshot || "-"} />
                            <Field label="Năm sản xuất" value={product.content?.yearSnapshot || "-"} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Nội dung bài đăng"
                        desc="Bạn dán nội dung lấy từ ChatGPT/OpenAI vào đây."
                        icon={<Sparkles className="h-5 w-5" />}
                        defaultOpen
                        right={
                            <div className="hidden text-xs text-slate-500 sm:block">
                                {generatedAt ? `Lưu lần cuối: ${fmtDate(generatedAt)}` : "Chưa có nội dung"}
                            </div>
                        }
                    >
                        <div className="space-y-5">


                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            Preview bài đăng hoàn chỉnh
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            Ghép sẵn nội dung + bullet spec + hashtag để copy đăng Facebook / Instagram nhanh.
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCopyHashtags}
                                            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                        >
                                            Copy hashtags
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCopyFullPost}
                                            className="inline-flex items-center rounded-2xl border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                                        >
                                            Copy full post
                                        </button>
                                    </div>
                                </div>

                                <textarea
                                    value={fullPostText}
                                    readOnly
                                    rows={16}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none"
                                />

                                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Bullet spec
                                        </div>
                                        {specBullets.length ? (
                                            <div className="space-y-2">
                                                {specBullets.map((item, idx) => (
                                                    <div
                                                        key={`${item}-${idx}`}
                                                        className="text-sm leading-6 text-slate-700"
                                                    >
                                                        ▪️ {item}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500">Chưa có bullet spec.</div>
                                        )}
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Hashtags
                                        </div>
                                        {hashtags.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {hashtags.map((tag, idx) => (
                                                    <span
                                                        key={`${tag}-${idx}`}
                                                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500">Chưa có hashtag.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    <span>Content status: <b className="text-slate-700">{contentStatus || "-"}</b></span>
                                    <span>Generated at: <b className="text-slate-700">{generatedAt ? fmtDate(generatedAt) : "-"}</b></span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSaveContent}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" />
                                    {saving ? "Đang lưu..." : "Lưu nội dung"}
                                </button>
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                        title="Lịch sử service"
                        desc="Toàn bộ service request và các log gần nhất."
                        icon={<Wrench className="h-5 w-5" />}
                        defaultOpen
                        right={<div className="text-xs text-slate-500">{data.serviceHistory.length} service</div>}
                    >
                        {!data.serviceHistory.length ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                                Chưa có lịch sử service.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.serviceHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="text-base font-semibold text-slate-900">
                                                        {item.serviceCatalog?.name || item.refNo || item.id}
                                                    </div>
                                                    <DotLabel
                                                        label={item.status || "-"}
                                                        tone={toneForStatus(item.status)}
                                                    />
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                    <span>RefNo: <b className="text-slate-700">{item.refNo || "-"}</b></span>
                                                    <span>Scope: <b className="text-slate-700">{item.scope || "-"}</b></span>
                                                    <span>Vendor: <b className="text-slate-700">{item.vendorName || "-"}</b></span>
                                                    <span>Order: <b className="text-slate-700">{item.order?.refNo || "-"}</b></span>
                                                    <span>Cập nhật: <b className="text-slate-700">{fmtDate(item.updatedAt || item.createdAt)}</b></span>
                                                </div>

                                                {item.notes ? (
                                                    <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                                        {item.notes}
                                                    </div>
                                                ) : null}
                                            </div>

                                            <Link
                                                href={`/admin/services/${item.id}`}
                                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                            >
                                                Mở service
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>

                                        {item.latestLogs?.length ? (
                                            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                                                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                    Maintenance log gần nhất ({item.maintenanceCount ?? item.latestLogs.length})
                                                </div>

                                                {item.latestLogs.map((log: any) => (
                                                    <div
                                                        key={log.id}
                                                        className="rounded-xl border border-slate-200 bg-white p-3"
                                                    >
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                            <span>Event: <b className="text-slate-700">{log.eventType || "-"}</b></span>
                                                            <span>Vendor: <b className="text-slate-700">{log.vendorName || "-"}</b></span>
                                                            <span>Ngày: <b className="text-slate-700">{fmtDate(log.servicedAt || log.createdAt)}</b></span>
                                                            <span>Cost: <b className="text-slate-700">{fmtMoney(log.totalCost, log.currency || "VND")}</b></span>
                                                        </div>

                                                        {log.notes ? (
                                                            <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                                                {log.notes}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CollapsibleSection>

                    {canViewTradeFinancials ? (
                        <CollapsibleSection
                            title="Lịch sử mua bán"
                            desc="Gồm cả chiều nhập hàng và chiều bán ra."
                            icon={<History className="h-5 w-5" />}
                            defaultOpen
                            right={
                                <div className="text-xs text-slate-500">
                                    {tradeHistory.acquisitions.length} nhập • {normalizedOrders.length} bán
                                </div>
                            }
                        >
                            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                                <TinyStat
                                    label="Tổng doanh thu"
                                    value={fmtMoney(totalRevenue, "VND")}
                                />
                                <TinyStat
                                    label="Tổng giá vốn ước tính"
                                    value={fmtMoney(totalEstimatedCost, "VND")}
                                    hint={baseCostPrice != null ? `Base cost: ${fmtMoney(baseCostPrice, "VND")}` : "Chưa có giá vốn"}
                                />
                                <TinyStat
                                    label="Lãi / lỗ ước tính"
                                    value={
                                        <span className={cls("inline-flex items-center gap-1", profitTone(totalEstimatedProfit))}>
                                            {totalEstimatedProfit != null && totalEstimatedProfit > 0 ? (
                                                <TrendingUp className="h-4 w-4" />
                                            ) : totalEstimatedProfit != null && totalEstimatedProfit < 0 ? (
                                                <TrendingDown className="h-4 w-4" />
                                            ) : null}
                                            {fmtMoney(totalEstimatedProfit, "VND")}
                                        </span>
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900">Chiều nhập</h3>
                                    </div>

                                    {!tradeHistory.acquisitions.length ? (
                                        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                                            Chưa có lịch sử nhập.
                                        </div>
                                    ) : (
                                        tradeHistory.acquisitions.map((item: any) => (
                                            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {item.acquisition?.refNo || item.id}
                                                            </div>
                                                            <DotLabel
                                                                label={item.acquisition?.accquisitionStt || item.status || "-"}
                                                                tone="blue"
                                                            />
                                                        </div>

                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                            <span>Loại: <b className="text-slate-700">{item.acquisition?.type || "-"}</b></span>
                                                            <span>Ngày nhập: <b className="text-slate-700">{fmtDate(item.acquisition?.acquiredAt || item.createdAt)}</b></span>
                                                            <span>Vendor: <b className="text-slate-700">{item.acquisition?.vendor?.name || "-"}</b></span>
                                                            <span>Customer: <b className="text-slate-700">{item.acquisition?.customer?.name || "-"}</b></span>
                                                            <span>SL: <b className="text-slate-700">{item.quantity}</b></span>
                                                            <span>Giá vốn: <b className="text-slate-700">{fmtMoney(item.unitCost, item.currency || "VND")}</b></span>
                                                        </div>
                                                    </div>

                                                    {item.acquisition?.id ? (
                                                        <Link
                                                            href={`/admin/acquisitions/${item.acquisition.id}/edit`}
                                                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                        >
                                                            Mở phiếu nhập
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </Link>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900">Chiều bán</h3>
                                    </div>

                                    {!normalizedOrders.length ? (
                                        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                                            Chưa có lịch sử bán.
                                        </div>
                                    ) : (
                                        normalizedOrders.map((item: any) => (
                                            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {item.order?.refNo || item.id}
                                                            </div>
                                                            <DotLabel
                                                                label={item.order?.status || "-"}
                                                                tone={toneForStatus(item.order?.status)}
                                                            />
                                                        </div>

                                                        <div className="text-sm text-slate-800">{item.title}</div>

                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                            <span>Ngày bán: <b className="text-slate-700">{fmtDate(item.order?.createdAt || item.createdAt)}</b></span>
                                                            <span>Khách: <b className="text-slate-700">{item.order?.customerName || "-"}</b></span>
                                                            <span>Nguồn: <b className="text-slate-700">{item.order?.source || "-"}</b></span>
                                                            <span>Payment: <b className="text-slate-700">{item.order?.paymentStatus || "-"}</b></span>
                                                            <span>SL: <b className="text-slate-700">{item.quantity}</b></span>
                                                            <span>Đơn giá: <b className="text-slate-700">{fmtMoney(item.unitPriceAgreed, "VND")}</b></span>
                                                            <span>Subtotal: <b className="text-slate-700">{fmtMoney(item.subtotal, "VND")}</b></span>
                                                        </div>

                                                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                                                                Giá vốn ước tính:{" "}
                                                                <b className="text-slate-800">{fmtMoney(item.estimatedCost, "VND")}</b>
                                                            </div>
                                                            <div
                                                                className={cls(
                                                                    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs",
                                                                    profitTone(item.estimatedProfit)
                                                                )}
                                                            >
                                                                Lãi / lỗ ước tính:{" "}
                                                                <b>{fmtMoney(item.estimatedProfit, "VND")}</b>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {item.order?.id ? (
                                                        <Link
                                                            href={`/admin/orders/${item.order.id}`}
                                                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                        >
                                                            Mở đơn hàng
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </Link>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CollapsibleSection>
                    ) : null}
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <div className="space-y-6 xl:sticky xl:top-4">
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 text-sm font-semibold text-slate-900">Tóm tắt nhanh</div>

                            <div className="grid grid-cols-2 gap-3">
                                <TinyStat label="Service mở" value={openService ? "Có" : "Không"} />
                                <TinyStat label="Số lần service" value={data.serviceHistory.length} />
                                {canViewTradeFinancials ? (
                                    <>
                                        <TinyStat label="Số lần nhập" value={tradeHistory.acquisitions.length} />
                                        <TinyStat label="Số lần bán" value={normalizedOrders.length} />
                                    </>
                                ) : (
                                    <>
                                        <TinyStat label="SKU" value={latestVariant?.sku || "-"} />
                                        <TinyStat label="Tồn kho" value={latestVariant?.stockQty ?? 0} />
                                    </>
                                )}
                            </div>

                            <div className="mt-5 space-y-4 border-t border-slate-200 pt-4">
                                <Field label="Trạng thái sản phẩm" value={product.status || "-"} />
                                <Field label="Content status" value={contentStatus || "-"} />
                                <Field label="Lần gen nội dung" value={generatedAt ? fmtDate(generatedAt) : "-"} />
                                <Field label="Loại sản phẩm" value={product.type || "-"} />
                                {canViewTradeFinancials ? (
                                    <>
                                        <Field label="Giá vốn base" value={fmtMoney(baseCostPrice, "VND")} />
                                        <Field
                                            label="Lãi / lỗ ước tính"
                                            value={
                                                <span className={profitTone(totalEstimatedProfit)}>
                                                    {fmtMoney(totalEstimatedProfit, "VND")}
                                                </span>
                                            }
                                        />
                                    </>
                                ) : null}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}