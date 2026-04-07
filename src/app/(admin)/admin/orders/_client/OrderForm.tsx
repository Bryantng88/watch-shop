"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ServiceOption = {
    id: string;
    code?: string | null;
    name: string;
    defaultPrice?: number | null;
    isActive?: boolean;
};

type ProductSearchItem = {
    id: string;
    title: string;
    price: number;
    primaryImageUrl?: string | null;
    vendorName?: string | null;
};

type FormItem = {
    id?: string;
    kind: "PRODUCT" | "SERVICE";
    productId?: string | null;
    variantId?: string | null;
    title: string;
    quantity: number;
    listPrice: number;
    unitPriceAgreed: number;
    img?: string | null;
    serviceCatalogId?: string | null;
    serviceScope?: "WITH_PURCHASE" | "CUSTOMER_ITEM" | null;
    linkedOrderItemId?: string | null;
    customerItemNote?: string | null;
};

type Props = {
    mode: "create" | "edit";
    orderId?: string;
    initialData?: any;
    services?: ServiceOption[];
    backHref?: string;
    backLabel?: string;
};

function money(n?: number | null) {
    return new Intl.NumberFormat("vi-VN").format(Number(n || 0));
}

function inputNumber(v: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function normalizeInitialItems(initialData: any): FormItem[] {
    if (!Array.isArray(initialData?.items)) return [];

    return initialData.items.map((it: any) => ({
        id: it.id,
        kind: (it.kind || "PRODUCT") as "PRODUCT" | "SERVICE",
        productId: it.productId ?? null,
        variantId: it.variantId ?? null,
        title: it.title ?? "",
        quantity: Number(it.quantity ?? 1),
        listPrice: Number(it.listPrice ?? it.unitPriceAgreed ?? it.unitPrice ?? 0),
        unitPriceAgreed: Number(it.unitPriceAgreed ?? it.listPrice ?? it.unitPrice ?? 0),
        img: it.img ?? it.product?.primaryImageUrl ?? null,
        serviceCatalogId: it.serviceCatalogId ?? null,
        serviceScope: it.serviceScope ?? null,
        linkedOrderItemId: it.linkedOrderItemId ?? null,
        customerItemNote: it.customerItemNote ?? null,
    }));
}

export default function OrderFormClient({
    mode,
    orderId,
    initialData,
    services = [],
    backHref = "/admin/orders",
    backLabel = "← Quay lại",
}: Props) {
    const isEdit = mode === "edit";

    const [customerName, setCustomerName] = useState(initialData?.customerName ?? "");
    const [shipPhone, setShipPhone] = useState(initialData?.shipPhone ?? "");
    const [hasShipment, setHasShipment] = useState(Boolean(initialData?.hasShipment ?? false));
    const [shipAddress, setShipAddress] = useState(initialData?.shipAddress ?? "");
    const [shipCity, setShipCity] = useState(initialData?.shipCity ?? "");
    const [shipDistrict, setShipDistrict] = useState(initialData?.shipDistrict ?? "");
    const [shipWard, setShipWard] = useState(initialData?.shipWard ?? "");
    const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod ?? "BANK");
    const [notes, setNotes] = useState(initialData?.notes ?? "");
    const [createdAt, setCreatedAt] = useState(() => {
        const raw = initialData?.createdAt
            ? new Date(initialData.createdAt)
            : new Date();

        const pad = (n: number) => String(n).padStart(2, "0");
        return `${raw.getFullYear()}-${pad(raw.getMonth() + 1)}-${pad(raw.getDate())}T${pad(
            raw.getHours()
        )}:${pad(raw.getMinutes())}`;
    });

    const [reserveType, setReserveType] = useState(initialData?.reserve?.type ?? "");
    const [reserveAmount, setReserveAmount] = useState(
        Number(initialData?.reserve?.amount ?? 0)
    );
    const [reserveExpiresAt, setReserveExpiresAt] = useState(() => {
        const raw = initialData?.reserve?.expiresAt;
        if (!raw) return "";
        const d = new Date(raw);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
            d.getHours()
        )}:${pad(d.getMinutes())}`;
    });

    const [items, setItems] = useState<FormItem[]>(() => normalizeInitialItems(initialData));

    const [productQuery, setProductQuery] = useState("");
    const [productResults, setProductResults] = useState<ProductSearchItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = productQuery.trim();
        if (!q) {
            setProductResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setIsSearching(true);
                const res = await fetch(`/api/admin/products/search?q=${encodeURIComponent(q)}`);
                const json = await res.json();
                setProductResults(Array.isArray(json?.items) ? json.items : []);
            } catch {
                setProductResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [productQuery]);

    function patchItem(index: number, patch: Partial<FormItem>) {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...patch };

            if (
                patch.listPrice != null &&
                patch.unitPriceAgreed == null &&
                next[index].kind !== "SERVICE"
            ) {
                next[index].unitPriceAgreed = Number(patch.listPrice);
            }

            return next;
        });
    }

    function removeItem(index: number) {
        setItems((prev) => prev.filter((_, i) => i !== index));
    }

    function moveItem(index: number, dir: -1 | 1) {
        setItems((prev) => {
            const next = [...prev];
            const target = index + dir;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    function addProduct(row: ProductSearchItem) {
        setItems((prev) => [
            ...prev,
            {
                kind: "PRODUCT",
                productId: row.id,
                variantId: null,
                title: row.title,
                quantity: 1,
                listPrice: Number(row.price ?? 0),
                unitPriceAgreed: Number(row.price ?? 0),
                img: row.primaryImageUrl ?? null,
                serviceCatalogId: null,
                serviceScope: null,
                linkedOrderItemId: null,
                customerItemNote: null,
            },
        ]);
        setProductQuery("");
        setProductResults([]);
    }

    function addService(svc: ServiceOption) {
        setItems((prev) => [
            ...prev,
            {
                kind: "SERVICE",
                productId: null,
                variantId: null,
                title: svc.name,
                quantity: 1,
                listPrice: Number(svc.defaultPrice ?? 0),
                unitPriceAgreed: Number(svc.defaultPrice ?? 0),
                img: null,
                serviceCatalogId: svc.id,
                serviceScope: "CUSTOMER_ITEM",
                linkedOrderItemId: null,
                customerItemNote: "",
            },
        ]);
    }

    const productItems = items.filter((it) => it.kind === "PRODUCT");

    const subtotal = useMemo(() => {
        return items.reduce((sum, it) => sum + Number(it.unitPriceAgreed || 0) * Number(it.quantity || 0), 0);
    }, [items]);

    async function handleSubmit() {
        try {
            setSubmitting(true);
            setError(null);

            if (!customerName.trim()) {
                throw new Error("Vui lòng nhập tên khách hàng");
            }

            if (items.length === 0) {
                throw new Error("Đơn hàng phải có ít nhất 1 dòng");
            }

            const payload = {
                customerName: customerName.trim(),
                shipPhone: shipPhone.trim(),
                hasShipment,
                shipAddress: shipAddress.trim(),
                shipCity: shipCity.trim(),
                shipDistrict: shipDistrict.trim(),
                shipWard: shipWard.trim(),
                createdAt: new Date(createdAt).toISOString(),
                paymentMethod,
                notes: notes?.trim() || null,
                status: initialData?.status ?? "DRAFT",
                reserve: reserveType
                    ? {
                        type: reserveType,
                        amount: Number(reserveAmount || 0),
                        expiresAt: reserveExpiresAt
                            ? new Date(reserveExpiresAt).toISOString()
                            : null,
                    }
                    : null,
                items: items.map((it) => ({
                    id: it.id,
                    kind: it.kind,
                    productId: it.productId ?? null,
                    variantId: it.variantId ?? null,
                    title: it.title,
                    quantity: Number(it.quantity || 1),
                    listPrice: Number(it.listPrice || 0),
                    unitPriceAgreed: Number(it.unitPriceAgreed || 0),
                    img: it.img ?? null,
                    serviceCatalogId: it.serviceCatalogId ?? null,
                    serviceScope: it.kind === "SERVICE" ? it.serviceScope ?? "CUSTOMER_ITEM" : null,
                    linkedOrderItemId:
                        it.kind === "SERVICE" && it.serviceScope === "WITH_PURCHASE"
                            ? it.linkedOrderItemId ?? null
                            : null,
                    customerItemNote:
                        it.kind === "SERVICE" && it.serviceScope === "CUSTOMER_ITEM"
                            ? it.customerItemNote ?? null
                            : null,
                })),
            };

            const res = await fetch(
                isEdit ? `/api/admin/orders/${orderId}` : "/api/admin/orders",
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(json?.error || "Lưu đơn hàng thất bại");
            }

            if (isEdit && orderId) {
                window.location.href = `/admin/orders/${orderId}`;
                return;
            }

            window.location.href = `/admin/orders/${json?.id ?? ""}` || "/admin/orders";
        } catch (e: any) {
            setError(e?.message || "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    }

    const canEdit = !initialData?.status || initialData?.status === "DRAFT" || initialData?.status === "RESERVED";

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">
                        {isEdit ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng"}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Đồng bộ layout với phiếu nhập, gọn và dễ thao tác hơn.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={backHref}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                        {backLabel}
                    </Link>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canEdit || submitting}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo đơn"}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {!canEdit ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Đơn hàng đang ở trạng thái <b>{initialData?.status}</b>, không thể chỉnh sửa.
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <section className="rounded-2xl border border-neutral-200 bg-white">
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Thông tin khách hàng</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Tên khách hàng</label>
                                <input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    placeholder="Nguyễn Văn A"
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Số điện thoại</label>
                                <input
                                    value={shipPhone}
                                    onChange={(e) => setShipPhone(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    placeholder="09xxxxxxxx"
                                    disabled={!canEdit}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white">
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Giao hàng & thanh toán</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Ngày tạo</label>
                                <input
                                    type="datetime-local"
                                    value={createdAt}
                                    onChange={(e) => setCreatedAt(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Phương thức thanh toán</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit}
                                >
                                    <option value="BANK">Chuyển khoản</option>
                                    <option value="CASH">Tiền mặt</option>
                                    <option value="COD">COD</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 flex items-center gap-2">
                                <input
                                    id="hasShipment"
                                    type="checkbox"
                                    checked={hasShipment}
                                    onChange={(e) => setHasShipment(e.target.checked)}
                                    disabled={!canEdit}
                                />
                                <label htmlFor="hasShipment" className="text-sm text-neutral-700">
                                    Có giao hàng
                                </label>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-neutral-700">Địa chỉ</label>
                                <input
                                    value={shipAddress}
                                    onChange={(e) => setShipAddress(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    placeholder="Số nhà, tên đường"
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Thành phố / Tỉnh</label>
                                <input
                                    value={shipCity}
                                    onChange={(e) => setShipCity(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Quận / Huyện</label>
                                <input
                                    value={shipDistrict}
                                    onChange={(e) => setShipDistrict(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Phường / Xã</label>
                                <input
                                    value={shipWard}
                                    onChange={(e) => setShipWard(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white">
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Giữ hàng / đặt cọc</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Loại giữ hàng</label>
                                <select
                                    value={reserveType}
                                    onChange={(e) => setReserveType(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit}
                                >
                                    <option value="">Không áp dụng</option>
                                    <option value="DEPOSIT">Đặt cọc</option>
                                    <option value="HOLD">Giữ hàng</option>
                                    <option value="COD">COD</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Số tiền</label>
                                <input
                                    type="number"
                                    value={reserveAmount}
                                    onChange={(e) => setReserveAmount(inputNumber(e.target.value))}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit || !reserveType}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700">Hết hạn</label>
                                <input
                                    type="datetime-local"
                                    value={reserveExpiresAt}
                                    onChange={(e) => setReserveExpiresAt(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                    disabled={!canEdit || !reserveType}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white">
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Sản phẩm / dịch vụ</h2>
                        </div>

                        <div className="space-y-5 p-5">
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-neutral-700">Thêm sản phẩm</div>

                                <div className="relative">
                                    <input
                                        value={productQuery}
                                        onChange={(e) => setProductQuery(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                                        placeholder="Tìm theo tên sản phẩm..."
                                        disabled={!canEdit}
                                    />

                                    {productQuery.trim() && (
                                        <div className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-neutral-200 bg-white shadow-lg">
                                            {isSearching ? (
                                                <div className="px-4 py-3 text-sm text-neutral-500">Đang tìm...</div>
                                            ) : productResults.length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-neutral-500">
                                                    Không có kết quả
                                                </div>
                                            ) : (
                                                productResults.map((row) => (
                                                    <button
                                                        key={row.id}
                                                        type="button"
                                                        onClick={() => addProduct(row)}
                                                        className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left hover:bg-neutral-50"
                                                    >
                                                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                                                            {row.primaryImageUrl ? (
                                                                <Image
                                                                    src={row.primaryImageUrl}
                                                                    alt={row.title}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="48px"
                                                                />
                                                            ) : null}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="truncate text-sm font-medium text-neutral-900">
                                                                {row.title}
                                                            </div>
                                                            <div className="mt-1 text-xs text-neutral-500">
                                                                {money(row.price)} đ
                                                                {row.vendorName ? ` • ${row.vendorName}` : ""}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-sm font-medium text-neutral-700">Thêm dịch vụ</div>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((svc) => (
                                        <button
                                            key={svc.id}
                                            type="button"
                                            onClick={() => addService(svc)}
                                            disabled={!canEdit}
                                            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                                        >
                                            + {svc.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {items.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">
                                        Chưa có dòng nào.
                                    </div>
                                ) : (
                                    items.map((it, index) => {
                                        const linkedProductOptions = productItems
                                            .filter((x) => x.id && x.id !== it.id)
                                            .map((x) => ({ id: x.id!, title: x.title }));

                                        return (
                                            <div
                                                key={it.id ?? `${it.kind}-${index}`}
                                                className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4"
                                            >
                                                <div className="flex flex-wrap items-start gap-4">
                                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                                                        {it.img ? (
                                                            <Image
                                                                src={it.img}
                                                                alt={it.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                                                                {it.kind}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-12">
                                                        <div className="space-y-2 md:col-span-5">
                                                            <label className="text-xs font-medium text-neutral-600">Tên</label>
                                                            <input
                                                                value={it.title}
                                                                onChange={(e) =>
                                                                    patchItem(index, { title: e.target.value })
                                                                }
                                                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                                                                disabled={!canEdit}
                                                            />
                                                        </div>

                                                        <div className="space-y-2 md:col-span-2">
                                                            <label className="text-xs font-medium text-neutral-600">Số lượng</label>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={it.quantity}
                                                                onChange={(e) =>
                                                                    patchItem(index, {
                                                                        quantity: Math.max(
                                                                            1,
                                                                            inputNumber(e.target.value)
                                                                        ),
                                                                    })
                                                                }
                                                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                                                                disabled={!canEdit}
                                                            />
                                                        </div>

                                                        <div className="space-y-2 md:col-span-2">
                                                            <label className="text-xs font-medium text-neutral-600">Đơn giá</label>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                value={it.unitPriceAgreed}
                                                                onChange={(e) =>
                                                                    patchItem(index, {
                                                                        listPrice: inputNumber(e.target.value),
                                                                        unitPriceAgreed: inputNumber(e.target.value),
                                                                    })
                                                                }
                                                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                                                                disabled={!canEdit}
                                                            />
                                                        </div>

                                                        <div className="space-y-2 md:col-span-2">
                                                            <label className="text-xs font-medium text-neutral-600">Loại</label>
                                                            <div className="flex h-10 items-center rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-700">
                                                                {it.kind}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2 md:col-span-1">
                                                            <label className="text-xs font-medium text-neutral-600">Tổng</label>
                                                            <div className="flex h-10 items-center justify-end rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900">
                                                                {money(it.unitPriceAgreed * it.quantity)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveItem(index, -1)}
                                                            disabled={!canEdit || index === 0}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-700 disabled:opacity-40"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveItem(index, 1)}
                                                            disabled={!canEdit || index === items.length - 1}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-700 disabled:opacity-40"
                                                        >
                                                            ↓
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            disabled={!canEdit}
                                                            className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm text-red-600 disabled:opacity-40"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>

                                                {it.kind === "SERVICE" ? (
                                                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
                                                        <div className="space-y-2 md:col-span-4">
                                                            <label className="text-xs font-medium text-neutral-600">
                                                                Phạm vi dịch vụ
                                                            </label>
                                                            <select
                                                                value={it.serviceScope ?? "CUSTOMER_ITEM"}
                                                                onChange={(e) =>
                                                                    patchItem(index, {
                                                                        serviceScope: e.target.value as
                                                                            | "WITH_PURCHASE"
                                                                            | "CUSTOMER_ITEM",
                                                                        linkedOrderItemId: null,
                                                                    })
                                                                }
                                                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                                                                disabled={!canEdit}
                                                            >
                                                                <option value="CUSTOMER_ITEM">Đồ khách mang tới</option>
                                                                <option value="WITH_PURCHASE">Đi kèm sản phẩm mua</option>
                                                            </select>
                                                        </div>

                                                        {it.serviceScope === "WITH_PURCHASE" ? (
                                                            <div className="space-y-2 md:col-span-8">
                                                                <label className="text-xs font-medium text-neutral-600">
                                                                    Áp cho sản phẩm
                                                                </label>
                                                                <select
                                                                    value={it.linkedOrderItemId ?? ""}
                                                                    onChange={(e) =>
                                                                        patchItem(index, {
                                                                            linkedOrderItemId:
                                                                                e.target.value || null,
                                                                        })
                                                                    }
                                                                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                                                                    disabled={!canEdit}
                                                                >
                                                                    <option value="">Chọn sản phẩm liên kết</option>
                                                                    {linkedProductOptions.map((opt) => (
                                                                        <option key={opt.id} value={opt.id}>
                                                                            {opt.title}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2 md:col-span-8">
                                                                <label className="text-xs font-medium text-neutral-600">
                                                                    Ghi chú đồ khách
                                                                </label>
                                                                <input
                                                                    value={it.customerItemNote ?? ""}
                                                                    onChange={(e) =>
                                                                        patchItem(index, {
                                                                            customerItemNote: e.target.value,
                                                                        })
                                                                    }
                                                                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                                                                    placeholder="Ví dụ: thay pin cho đồng hồ khách mang tới"
                                                                    disabled={!canEdit}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white">
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Ghi chú</h2>
                        </div>

                        <div className="p-5">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={5}
                                className="w-full rounded-2xl border border-neutral-200 px-3 py-3 text-sm outline-none focus:border-neutral-400"
                                placeholder="Ghi chú thêm..."
                                disabled={!canEdit}
                            />
                        </div>
                    </section>
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <section className="rounded-2xl border border-neutral-200 bg-white">
                        <div className="border-b border-neutral-200 px-5 py-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Tổng hợp</h2>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Số dòng</span>
                                <span className="font-medium text-neutral-900">{items.length}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Sản phẩm</span>
                                <span className="font-medium text-neutral-900">
                                    {items.filter((x) => x.kind === "PRODUCT").length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Dịch vụ</span>
                                <span className="font-medium text-neutral-900">
                                    {items.filter((x) => x.kind === "SERVICE").length}
                                </span>
                            </div>

                            <div className="h-px bg-neutral-200" />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-500">Tạm tính</span>
                                <span className="text-lg font-semibold text-neutral-900">
                                    {money(subtotal)} đ
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canEdit || submitting}
                                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Đang lưu..." : isEdit ? "Cập nhật đơn hàng" : "Tạo đơn hàng"}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}