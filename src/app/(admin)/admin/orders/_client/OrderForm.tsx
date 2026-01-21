"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductSearchInput from "../../__components/ProductSearchInput";
import type { OrderDraftForEdit, OrderDraftInput, OrderItemInput } from "../_servers/order.type";

/** ==============================
 * Types
 * ============================== */
type Customer = {
    id: string;
    name: string;
    phone: string;
    city?: string | null;
    district?: string | null;
    ward?: string | null;
    address?: string | null;
};

type PaymentMethod = "BANK_TRANSFER" | "COD" | "CREDIT_CARD";
type ReserveType = "DEPOSIT" | "COD";

// ✅ NEW
type ServiceScope = "WITH_PURCHASE" | "CUSTOMER_OWNED";

type ServiceCatalog = {
    id: string;
    code?: string | null;
    name: string;
    defaultPrice?: number | null;
    isActive?: boolean;
};

type Props =
    | {
        mode: "create";
        initialData: null;
        orderId?: never;
        services?: ServiceCatalog[];
        title?: string;
        subtitle?: string;
        backHref?: string;
        backLabel?: string;
    }
    | {
        mode: "edit";
        orderId: string;
        initialData: OrderDraftForEdit;
        services?: ServiceCatalog[];
        title?: string;
        subtitle?: string;
        backHref?: string;
        backLabel?: string;
    };

const PAYMENT_METHODS: PaymentMethod[] = ["BANK_TRANSFER", "COD", "CREDIT_CARD"];

/** ==============================
 * Helpers
 * ============================== */
function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + (cur ? ` ${cur}` : "");
}

function uid() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(16).slice(2);
}

// ISO -> datetime-local (YYYY-MM-DDTHH:mm)
function isoToLocalInput(iso?: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// datetime-local -> ISO
function localInputToIso(v?: string | null) {
    if (!v) return new Date().toISOString();
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
}

function nowIso() {
    return new Date().toISOString();
}

// ✅ normalize để item nào cũng có đủ field cần tính & render
function normalizeItem(partial: Omit<OrderItemInput, "id">): Omit<OrderItemInput, "id"> {
    const listPrice =
        (partial as any).listPrice != null
            ? Number((partial as any).listPrice || 0)
            : (partial as any).unitPrice != null
                ? Number((partial as any).unitPrice || 0)
                : 0;

    const unitPrice =
        (partial as any).unitPrice != null ? Number((partial as any).unitPrice || 0) : listPrice;

    return {
        ...partial,
        // đảm bảo 2 field giá luôn có
        ...(partial as any),
        listPrice,
        unitPrice,

        // các field hay bị thiếu do schema bạn đang strict
        variantId: (partial as any).variantId ?? null,
        img: (partial as any).img ?? null,

        // ⚠️ bạn đang dùng number (0/1). giữ nguyên để khỏi TS lỗi
        unitPriceAgreed: (partial as any).unitPriceAgreed ?? 1,
    } as any;
}

function emptyDraft(): OrderDraftInput {
    return {
        customerName: "",
        shipPhone: "",

        hasShipment: true,
        shipAddress: "",
        shipCity: "",
        shipDistrict: null,
        shipWard: "",

        createdAt: nowIso(),
        paymentMethod: "BANK_TRANSFER" as PaymentMethod,
        notes: null,

        reserve: null,
        items: [],
    };
}

function toInputFromEdit(d: OrderDraftForEdit): OrderDraftInput {
    return {
        customerName: d.customerName || "",
        shipPhone: d.shipPhone ?? "",

        hasShipment: Boolean(d.hasShipment),
        shipAddress: d.shipAddress ?? "",
        shipCity: d.shipCity ?? "",
        shipDistrict: d.shipDistrict ?? null,
        shipWard: d.shipWard ?? "",

        createdAt: d.createdAt ?? nowIso(),
        paymentMethod: d.paymentMethod as any,
        notes: d.notes ?? null,

        reserve: d.reserve
            ? {
                type: d.reserve.type as any,
                amount: Number(d.reserve.amount),
                expiresAt: d.reserve.expiresAt ?? null,
            }
            : null,

        items: (d.items || []).map((it) => {
            const unitPrice = Number((it as any).unitPrice ?? 0);
            const listPrice = Number((it as any).listPrice ?? unitPrice ?? 0);

            return {
                id: it.id,
                kind: (it as any).kind,
                productId: (it as any).productId ?? null,
                title: (it as any).title ?? "",
                quantity: Number((it as any).quantity ?? 1),
                unitPrice,
                listPrice,

                variantId: (it as any).variantId ?? null,
                unitPriceAgreed: Number((it as any).unitPriceAgreed ?? 1),
                img: (it as any).img ?? null,

                // ✅ NEW
                serviceScope: (it as any).serviceScope ?? null,
                linkedOrderItemId: (it as any).linkedOrderItemId ?? null,
            } as any;
        }),
    };
}

/** ==============================
 * UI atoms
 * ============================== */
function Card({
    title,
    children,
    right,
}: {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{title}</h3>
                {right}
            </div>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function Field({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">{label}</label>
            {children}
            {hint ? <div className="text-[11px] text-gray-500">{hint}</div> : null}
        </div>
    );
}

function Badge({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "gray" | "blue" | "green";
}) {
    const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
    const toneCls =
        tone === "blue"
            ? "bg-blue-50 text-blue-700"
            : tone === "green"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-700";
    return <span className={cls(base, toneCls)}>{children}</span>;
}
function kindTone(kind: string) {
    if (kind === "SERVICE") return "blue";
    if (kind === "DISCOUNT") return "green";
    return "gray";
}

function kindLabel(kind: string) {
    if (kind === "SERVICE") return "Dịch vụ";
    if (kind === "DISCOUNT") return "Giảm giá";
    return "Sản phẩm";
}

/** ==============================
 * MAIN
 * ============================== */
export default function OrderFormClient(props: Props) {
    const router = useRouter();
    const services = props.services ?? [];

    const computedTitle = props.title ?? (props.mode === "create" ? "Tạo đơn hàng" : "Sửa đơn hàng");

    const computedSubtitle =
        props.subtitle ??
        (props.mode === "create"
            ? "Đơn nháp — chỉ khi ADMIN duyệt mới sinh RefNo + Shipment/ServiceRequest."
            : "Chỉ cho phép sửa khi đơn hàng còn DRAFT/RESERVED.");

    const computedBackHref =
        props.backHref ?? (props.mode === "create" ? "/admin/orders" : `/admin/orders/${props.orderId}`);

    const computedBackLabel =
        props.backLabel ?? (props.mode === "create" ? "← Danh sách" : "← Quay lại chi tiết");

    /** --------------------------
     * Form State
     * -------------------------- */
    type ItemTab = "PRODUCT" | "SERVICE" | "DISCOUNT";
    const [activeTab, setActiveTab] = useState<ItemTab>("PRODUCT");

    const [form, setForm] = useState<OrderDraftInput>(() => emptyDraft());

    // ✅ Sync state cho edit/create
    useEffect(() => {
        if (props.mode === "edit") {
            setForm(toInputFromEdit(props.initialData));
        } else {
            setForm(emptyDraft());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mode, props.mode === "edit" ? props.initialData?.id : "create"]);

    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    /** --------------------------
     * Customer suggest by phone
     * -------------------------- */
    const [suggestCustomers, setSuggestCustomers] = useState<Customer[]>([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);

    function useDebounce<T>(value: T, delay = 300) {
        const [debounced, setDebounced] = useState(value);
        useEffect(() => {
            const t = setTimeout(() => setDebounced(value), delay);
            return () => clearTimeout(t);
        }, [value, delay]);
        return debounced;
    }

    const debouncedPhone = useDebounce(form.shipPhone ?? "", 300);

    useEffect(() => {
        const phone = (debouncedPhone ?? "").trim();
        if (phone.length < 3) {
            setSuggestCustomers([]);
            setLoadingSuggest(false);
            return;
        }

        let aborted = false;
        setLoadingSuggest(true);

        fetch(`/api/admin/customers/search?phone=${encodeURIComponent(phone)}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
                if (!aborted) setSuggestCustomers(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!aborted) setSuggestCustomers([]);
            })
            .finally(() => {
                if (!aborted) setLoadingSuggest(false);
            });

        return () => {
            aborted = true;
        };
    }, [debouncedPhone]);

    function applyCustomer(c: Customer) {
        setForm((prev) => ({
            ...prev,
            customerName: c.name,
            shipPhone: c.phone,
            shipCity: c.city ?? prev.shipCity ?? null,
            shipDistrict: c.district ?? prev.shipDistrict ?? null,
            shipWard: c.ward ?? prev.shipWard ?? null,
            shipAddress: c.address ?? prev.shipAddress ?? null,
        }));
        setSuggestCustomers([]);
        setShowSuggest(false);
    }

    /** --------------------------
     * Helpers setForm
     * -------------------------- */
    function set<K extends keyof OrderDraftInput>(key: K, value: OrderDraftInput[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function updateItem(idx: number, patch: Partial<OrderItemInput>) {
        setForm((prev) => {
            const next = [...prev.items];
            next[idx] = { ...next[idx], ...patch } as any;
            return { ...prev, items: next };
        });
    }

    function addItem(item: Omit<OrderItemInput, "id">) {
        const normalized = normalizeItem(item);
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { id: uid(), ...normalized } as any],
        }));
    }

    function removeItem(idx: number) {
        setForm((prev) => {
            const next = [...prev.items];
            next.splice(idx, 1);
            return { ...prev, items: next };
        });
    }

    /** --------------------------
     * Derived
     * -------------------------- */
    const total = useMemo(() => {
        return form.items.reduce((s, it: any) => s + Number(it.quantity || 0) * Number(it.listPrice || 0), 0);
    }, [form.items]);

    const serviceOptions = useMemo(() => {
        return (services || []).filter((s) => s.isActive !== false);
    }, [services]);

    const depositAmount = useMemo(() => {
        return form.reserve ? Number((form.reserve as any).amount || 0) : 0;
    }, [form.reserve]);

    const remainingAmount = useMemo(() => {
        return Math.max(0, total - depositAmount);
    }, [total, depositAmount]);

    // ✅ NEW: list product items để service chọn link
    const productItems = useMemo(() => {
        return form.items
            .filter((x: any) => x.kind === "PRODUCT")
            .map((x: any) => ({ id: x.id, title: x.title }));
    }, [form.items]);

    /** --------------------------
     * Reserve UX helpers
     * -------------------------- */
    const [reserveTouched, setReserveTouched] = useState(false);

    // COD => auto enable reserve nếu chưa touched
    useEffect(() => {
        if (form.paymentMethod !== "COD") return;
        if (reserveTouched) return;

        const deposit = Math.round(total * 0.1);

        set("reserve", {
            type: "COD" as ReserveType,
            amount: deposit,
            expiresAt: null,
        } as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.paymentMethod, total]);

    /** --------------------------
     * Submit
     * -------------------------- */
    const [showPostConfirm, setShowPostConfirm] = useState(false);
    const [postAfterSave, setPostAfterSave] = useState(false);

    async function saveDraftOnly() {
        if (props.mode !== "edit") return;

        const res = await fetch(`/api/admin/orders/${props.orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(await res.text());
    }

    async function postOrderNow(orderId: string) {
        const res = await fetch(`/api/admin/orders/${orderId}/post`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hasShipment: Boolean(form.hasShipment) }),
        });
        if (!res.ok) throw new Error(await res.text());
    }

    async function submit() {
        setErrMsg(null);

        if (!form.customerName?.trim()) {
            setErrMsg("Vui lòng nhập tên khách hàng");
            return;
        }
        if (form.hasShipment && !form.shipAddress?.trim()) {
            setErrMsg("Vui lòng nhập địa chỉ giao hàng (vì bạn chọn Có shipment)");
            return;
        }
        if (!form.items.length) {
            setErrMsg("Vui lòng thêm ít nhất 1 sản phẩm/dịch vụ.");
            return;
        }

        // CREATE
        if (props.mode === "create") {
            setSaving(true);
            try {
                const res = await fetch("/api/admin/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                router.push(`/admin/orders/${data.id}`);
                router.refresh();
            } catch (e: any) {
                setErrMsg(e?.message || "Tạo thất bại");
            } finally {
                setSaving(false);
            }
            return;
        }

        // EDIT => mở confirm
        setShowPostConfirm(true);
    }

    /** --------------------------
     * UI
     * -------------------------- */
    return (
        <div className="space-y-4 pb-24">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">{computedTitle}</h1>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <Badge>{props.mode === "create" ? "Draft" : "Edit"}</Badge>
                        <span>{computedSubtitle}</span>
                    </div>
                </div>

                <Link href={computedBackHref} className="rounded-md border px-3 py-2 hover:bg-gray-50 text-sm">
                    {computedBackLabel}
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Khách hàng">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Số điện thoại" hint="Nhập số để gợi ý khách hàng cũ">
                                <div className="relative">
                                    <input
                                        className="h-9 w-full rounded border px-3"
                                        value={form.shipPhone ?? ""}
                                        onChange={(e) => {
                                            set("shipPhone", e.target.value as any);
                                            setShowSuggest(true);
                                        }}
                                        placeholder="VD: 0909xxxxxx"
                                        onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                                        onFocus={() => {
                                            if (suggestCustomers.length > 0) setShowSuggest(true);
                                        }}
                                    />

                                    {showSuggest && (loadingSuggest || suggestCustomers.length > 0) && (
                                        <div className="absolute z-30 mt-1 w-full rounded-md border bg-white shadow-lg max-h-64 overflow-auto">
                                            {loadingSuggest && <div className="px-3 py-2 text-sm text-gray-500">Đang tìm…</div>}

                                            {!loadingSuggest &&
                                                suggestCustomers.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                                        onClick={() => applyCustomer(c)}
                                                    >
                                                        <div className="font-medium">{c.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {c.phone}
                                                            {c.address ? ` • ${c.address}` : ""}
                                                        </div>
                                                    </button>
                                                ))}

                                            {!loadingSuggest && suggestCustomers.length === 0 && (
                                                <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy khách cũ</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Field>

                            <Field label="Tên khách hàng" hint="Nếu khách mới, bạn nhập tên vào đây">
                                <input
                                    className="h-9 rounded border px-3"
                                    value={form.customerName ?? ""}
                                    onChange={(e) => set("customerName", e.target.value as any)}
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </Field>
                        </div>
                    </Card>

                    {/* Shipping */}
                    <Card
                        title="Giao hàng"
                        right={
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={Boolean(form.hasShipment)} onChange={(e) => set("hasShipment", e.target.checked as any)} />
                                Có shipment (giao hàng)
                            </label>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Tỉnh / Thành phố">
                                <input
                                    disabled={!form.hasShipment}
                                    className={cls("h-9 rounded border px-3", !form.hasShipment && "bg-gray-50 text-gray-500")}
                                    value={(form.shipCity ?? "") as any}
                                    onChange={(e) => set("shipCity", e.target.value as any)}
                                    placeholder="VD: Hồ Chí Minh"
                                />
                            </Field>

                            <Field label="Quận / Huyện">
                                <input
                                    disabled={!form.hasShipment}
                                    className={cls("h-9 rounded border px-3", !form.hasShipment && "bg-gray-50 text-gray-500")}
                                    value={(form.shipDistrict ?? "") as any}
                                    onChange={(e) => set("shipDistrict", (e.target.value || null) as any)}
                                    placeholder="VD: Quận 1"
                                />
                            </Field>

                            <Field label="Phường / Xã">
                                <input
                                    disabled={!form.hasShipment}
                                    className={cls("h-9 rounded border px-3", !form.hasShipment && "bg-gray-50 text-gray-500")}
                                    value={(form.shipWard ?? "") as any}
                                    onChange={(e) => set("shipWard", e.target.value as any)}
                                    placeholder="VD: Bến Nghé"
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Địa chỉ chi tiết">
                                <textarea
                                    disabled={!form.hasShipment}
                                    className={cls("min-h-[70px] w-full rounded border px-3 py-2", !form.hasShipment && "bg-gray-50 text-gray-500")}
                                    value={(form.shipAddress ?? "") as any}
                                    onChange={(e) => set("shipAddress", e.target.value as any)}
                                    placeholder="Số nhà, tên đường, ghi chú giao hàng…"
                                />
                            </Field>

                            {!form.hasShipment && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Đang chọn <b>pickup</b> nên không cần nhập địa chỉ giao hàng.
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Items */}
                    <Card
                        title="Nội dung đơn hàng"
                        right={
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("PRODUCT")}
                                    className={cls(
                                        "h-8 rounded px-3 text-sm border",
                                        activeTab === "PRODUCT" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
                                    )}
                                >
                                    Sản phẩm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("SERVICE")}
                                    className={cls(
                                        "h-8 rounded px-3 text-sm border",
                                        activeTab === "SERVICE" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
                                    )}
                                >
                                    Dịch vụ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("DISCOUNT")}
                                    className={cls(
                                        "h-8 rounded px-3 text-sm border",
                                        activeTab === "DISCOUNT" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
                                    )}
                                >
                                    Giảm giá
                                </button>
                            </div>
                        }
                    >
                        {activeTab === "PRODUCT" && (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">Tìm và thêm sản phẩm vào đơn.</div>

                                <ProductSearchInput
                                    value=""
                                    onSelect={(p: any) => {
                                        addItem({
                                            kind: "PRODUCT",
                                            productId: p.id,
                                            title: p.title,
                                            quantity: 1,
                                            unitPrice: Number(p.price ?? 0),
                                            listPrice: Number(p.price ?? 0),
                                            variantId: p.variantId ?? null,
                                            img: p.primaryImageUrl ?? null,
                                            unitPriceAgreed: 1,
                                        } as any);
                                    }}
                                />
                            </div>
                        )}

                        {activeTab === "SERVICE" && (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">Thêm dịch vụ. ServiceRequest sẽ được tạo khi ADMIN duyệt POST.</div>

                                <div className="flex flex-wrap gap-2 items-end">
                                    <div className="flex-1 min-w-[240px]">
                                        <Field label="Chọn dịch vụ">
                                            <select
                                                className="h-9 w-full rounded border px-2"
                                                defaultValue=""
                                                onChange={(e) => {
                                                    const id = e.target.value;
                                                    if (!id) return;
                                                    const s = serviceOptions.find((x) => x.id === id);
                                                    if (!s) return;

                                                    const firstProductId = productItems[0]?.id ?? null;

                                                    addItem({
                                                        kind: "SERVICE",
                                                        title: s.name,
                                                        productId: null,
                                                        quantity: 1,
                                                        unitPrice: Number(s.defaultPrice ?? 0),
                                                        listPrice: Number(s.defaultPrice ?? 0),
                                                        unitPriceAgreed: 1,
                                                        variantId: null,
                                                        img: null,

                                                        // ✅ NEW
                                                        serviceScope: (firstProductId ? "WITH_PURCHASE" : "CUSTOMER_OWNED") as ServiceScope,
                                                        linkedOrderItemId: firstProductId,
                                                    } as any);

                                                    e.currentTarget.value = "";
                                                }}
                                            >
                                                <option value="" disabled>
                                                    -- Chọn --
                                                </option>
                                                {serviceOptions.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.code ? `${s.code} — ` : ""}
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DISCOUNT TAB */}
                        {activeTab === "DISCOUNT" && (
                            <div className="space-y-3 max-w-sm">
                                <div className="text-sm text-gray-600">
                                    Thêm <b>giảm giá cho toàn bộ đơn hàng</b>
                                </div>

                                <Field label="Số tiền giảm">
                                    <input
                                        type="number"
                                        min={0}
                                        className="h-9 w-full rounded border px-3"
                                        placeholder="VD: 500000"
                                        onKeyDown={(e) => {
                                            if (e.key !== "Enter") return;

                                            const raw = (e.currentTarget.value ?? "").trim();
                                            const value = Number(raw);
                                            if (!Number.isFinite(value) || value <= 0) return;

                                            addItem({
                                                kind: "DISCOUNT",
                                                title: "Giảm giá",
                                                productId: null,
                                                quantity: 1,
                                                unitPrice: -Math.abs(value),
                                                listPrice: -Math.abs(value),

                                                // các field strict
                                                variantId: null,
                                                img: null,
                                                unitPriceAgreed: 1,
                                            } as any);

                                            // ✅ clear input để khỏi phải nhập lần 2
                                            e.currentTarget.value = "";
                                        }}
                                    />
                                </Field>

                                <div className="text-xs text-gray-500">
                                    Nhấn <b>Enter</b> để thêm. Giá trị sẽ được trừ trực tiếp vào tổng tiền.
                                </div>
                            </div>
                        )}

                        {/* Items table */}
                        {form.items.length > 0 ? (
                            <div className="mt-5 overflow-x-auto border rounded-lg">
                                <table className="min-w-full text-sm border-collapse">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Loại</th>
                                            <th className="px-3 py-2 text-left">Tên</th>
                                            <th className="px-3 py-2 text-right">SL</th>
                                            <th className="px-3 py-2 text-right">Đơn giá</th>
                                            <th className="px-3 py-2 text-right">Thành tiền</th>
                                            <th className="px-3 py-2 text-right">Xóa</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {form.items.map((it: any, idx) => {
                                            const isDiscount = it.kind === "DISCOUNT";
                                            const isProduct = it.kind === "PRODUCT";
                                            const isService = it.kind === "SERVICE";

                                            const qty = isDiscount ? 1 : Number(it.quantity || 0);
                                            const price = Number(it.listPrice || 0);
                                            const lineTotal = qty * price;

                                            // ✅ khóa sửa title cho SERVICE + DISCOUNT (và PRODUCT như trước)
                                            const lockTitle = isProduct || isService || isDiscount;

                                            return (
                                                <tr
                                                    key={it.id ?? idx}
                                                    className={cls("border-b", isDiscount && "bg-red-50")}
                                                >
                                                    {/* Loại */}
                                                    <td className="px-3 py-3 align-top">
                                                        <Badge tone={kindTone(it.kind)}>{kindLabel(it.kind)}</Badge>
                                                    </td>

                                                    {/* Tên + meta */}
                                                    <td className="px-3 py-3 align-top">
                                                        {/* Title */}
                                                        {lockTitle ? (
                                                            <div className={cls("font-medium", isDiscount && "text-red-700")}>
                                                                {it.title}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                className="h-9 w-full rounded border px-3"
                                                                value={it.title ?? ""}
                                                                onChange={(e) => updateItem(idx, { title: e.target.value })}
                                                            />
                                                        )}

                                                        {/* Meta dưới title: gọn, nhẹ */}
                                                        {isProduct && it.productId ? (
                                                            <div className="mt-1 text-[11px] text-gray-500">
                                                                productId: <span className="font-mono">{it.productId}</span>
                                                            </div>
                                                        ) : null}

                                                        {isDiscount ? (
                                                            <div className="mt-1 text-[11px] text-red-600">
                                                                Giảm giá toàn đơn
                                                            </div>
                                                        ) : null}

                                                        {/* ✅ SERVICE meta: scope + linked product gọn 1 hàng */}
                                                        {isService ? (
                                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                <div className="text-[11px] text-gray-500">
                                                                    Phạm vi:
                                                                </div>

                                                                <select
                                                                    className="h-8 rounded border px-2 text-sm bg-white"
                                                                    value={it.serviceScope ?? "CUSTOMER_OWNED"}
                                                                    onChange={(e) => {
                                                                        const scope = e.target.value as ServiceScope;
                                                                        updateItem(idx, {
                                                                            serviceScope: scope as any,
                                                                            linkedOrderItemId:
                                                                                scope === "WITH_PURCHASE"
                                                                                    ? it.linkedOrderItemId ?? productItems[0]?.id ?? null
                                                                                    : null,
                                                                        } as any);
                                                                    }}
                                                                >
                                                                    <option value="WITH_PURCHASE">Đi kèm sản phẩm</option>
                                                                    <option value="CUSTOMER_OWNED">Đồ khách mang tới</option>
                                                                </select>

                                                                <div className="text-[11px] text-gray-500">
                                                                    Áp cho:
                                                                </div>

                                                                <select
                                                                    className="h-8 min-w-[220px] rounded border px-2 text-sm bg-white"
                                                                    disabled={(it.serviceScope ?? "CUSTOMER_OWNED") !== "WITH_PURCHASE"}
                                                                    value={it.linkedOrderItemId ?? ""}
                                                                    onChange={(e) =>
                                                                        updateItem(idx, { linkedOrderItemId: e.target.value || null } as any)
                                                                    }
                                                                >
                                                                    <option value="">-- Chọn sản phẩm --</option>
                                                                    {productItems.map((p) => (
                                                                        <option key={p.id} value={p.id}>
                                                                            {p.title}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                {(it.serviceScope ?? "CUSTOMER_OWNED") === "WITH_PURCHASE" &&
                                                                    productItems.length === 0 && (
                                                                        <div className="text-[11px] text-orange-600">
                                                                            (Cần thêm 1 sản phẩm để gắn dịch vụ)
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                    {/* SL */}
                                                    <td className="px-3 py-3 align-top text-right">
                                                        {isDiscount ? (
                                                            <span className="text-gray-500">—</span>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                className="h-9 w-20 rounded border px-2 text-right"
                                                                value={Number(it.quantity ?? 1)}
                                                                onChange={(e) =>
                                                                    updateItem(idx, { quantity: Math.max(1, Number(e.target.value || 1)) } as any)
                                                                }
                                                            />
                                                        )}
                                                    </td>

                                                    {/* Đơn giá */}
                                                    <td className="px-3 py-3 align-top text-right">
                                                        {isProduct ? (
                                                            <div className="h-9 inline-flex items-center justify-end font-medium w-28">
                                                                {fmtMoney(price, "VND")}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                className={cls(
                                                                    "h-9 w-28 rounded border px-2 text-right",
                                                                    isDiscount && "text-red-600"
                                                                )}
                                                                value={Number.isFinite(price) ? price : 0}
                                                                onChange={(e) => {
                                                                    const v = Number(e.target.value || 0);
                                                                    const next = isDiscount ? -Math.abs(v) : v;
                                                                    updateItem(idx, { listPrice: next, unitPrice: next } as any);
                                                                }}
                                                            />
                                                        )}
                                                    </td>

                                                    {/* Thành tiền */}
                                                    <td className={cls("px-3 py-3 align-top text-right font-semibold", isDiscount && "text-red-600")}>
                                                        {fmtMoney(lineTotal, "VND")}
                                                    </td>

                                                    {/* Xóa */}
                                                    <td className="px-3 py-3 align-top text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(idx)}
                                                            className="text-red-600 hover:underline text-xs"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>


                                    <tfoot>
                                        <tr>
                                            <td colSpan={4} className="px-3 py-3 text-right text-sm text-gray-600">
                                                Tổng
                                            </td>
                                            <td className="px-3 py-3 text-right font-bold">{fmtMoney(total, "VND")}</td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="mt-4 text-sm text-gray-500">Chưa có item nào. Hãy thêm sản phẩm hoặc dịch vụ.</div>
                        )}
                    </Card>
                </div>

                {/* Right */}
                <div className="space-y-6">
                    <Card title="Thông tin đơn hàng">
                        <div className="space-y-4">
                            <Field label="Ngày tạo">
                                <input
                                    type="datetime-local"
                                    className="h-9 w-full rounded border px-3"
                                    value={isoToLocalInput((form as any).createdAt)}
                                    onChange={(e) => set("createdAt" as any, localInputToIso(e.target.value) as any)}
                                />
                            </Field>

                            <Field label="Thanh toán">
                                <select
                                    className="h-9 w-full rounded border px-2"
                                    value={form.paymentMethod as any}
                                    onChange={(e) => {
                                        setReserveTouched(false);
                                        set("paymentMethod", e.target.value as any);
                                    }}
                                >
                                    {PAYMENT_METHODS.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            {/* RESERVE */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form.reserve)}
                                        disabled={form.paymentMethod === "COD"}
                                        onChange={(e) => {
                                            setReserveTouched(true);
                                            if (!e.target.checked) set("reserve", null as any);
                                            else
                                                set("reserve", {
                                                    type: "DEPOSIT" as ReserveType,
                                                    amount: 0,
                                                    expiresAt: null,
                                                } as any);
                                        }}
                                    />
                                    <span className="font-medium">
                                        Đặt cọc giữ hàng
                                        {form.paymentMethod === "COD" && (
                                            <span className="ml-1 text-xs text-orange-600">(bắt buộc với COD)</span>
                                        )}
                                    </span>
                                </label>

                                {form.reserve && (
                                    <div className="space-y-3 rounded-md border bg-gray-50 p-3">
                                        <Field label="Loại cọc">
                                            <select
                                                className="h-9 w-full rounded border px-2"
                                                value={(form.reserve as any).type}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve", { ...(form.reserve as any), type: e.target.value as any } as any);
                                                }}
                                            >
                                                <option value="DEPOSIT">DEPOSIT</option>
                                                <option value="COD">COD</option>
                                            </select>
                                        </Field>

                                        <Field
                                            label="Số tiền cọc"
                                            hint={
                                                form.paymentMethod === "COD"
                                                    ? "Mặc định 10% giá trị đơn, có thể chỉnh sửa"
                                                    : "Khách trả trước để giữ hàng"
                                            }
                                        >
                                            <input
                                                type="number"
                                                min={0}
                                                className="h-9 w-full rounded border px-3"
                                                value={Number((form.reserve as any).amount ?? 0)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve", { ...(form.reserve as any), amount: Number(e.target.value || 0) } as any);
                                                }}
                                                placeholder="VD: 5000000"
                                            />
                                        </Field>

                                        <Field label="Giữ hàng đến" hint="Hết hạn có thể huỷ đơn nếu chưa thanh toán">
                                            <input
                                                type="datetime-local"
                                                value={isoToLocalInput((form.reserve as any).expiresAt)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve", {
                                                        ...(form.reserve as any),
                                                        expiresAt: e.target.value ? localInputToIso(e.target.value) : null,
                                                    } as any);
                                                }}
                                                className="h-9 w-full rounded border px-3"
                                                disabled={form.paymentMethod === "COD"}
                                            />
                                        </Field>

                                        <div className="text-xs text-gray-500">💡 Thường dùng cho COD hoặc giữ hàng cho khách VIP</div>
                                    </div>
                                )}
                            </div>

                            <Field label="Ghi chú">
                                <textarea
                                    className="min-h-[90px] w-full rounded border px-3 py-2"
                                    value={(form.notes ?? "") as any}
                                    onChange={(e) => set("notes", (e.target.value || null) as any)}
                                    placeholder="Ghi chú nội bộ…"
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card title="Tóm tắt">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số item</span>
                                <span className="font-medium">{form.items.length}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Tổng tiền</span>
                                <span className="font-semibold">{fmtMoney(total, "VND")}</span>
                            </div>

                            {form.reserve && (
                                <>
                                    <div className="flex justify-between text-amber-700">
                                        <span>Đã cọc</span>
                                        <span className="font-medium">− {fmtMoney(depositAmount, "VND")}</span>
                                    </div>

                                    <div className="flex justify-between font-semibold text-red-700 border-t pt-2">
                                        <span>Còn phải thu</span>
                                        <span>{fmtMoney(remainingAmount, "VND")}</span>
                                    </div>

                                    {(form.reserve as any).expiresAt && (
                                        <div className="text-xs text-gray-500">
                                            ⏰ Giữ hàng đến: {new Date((form.reserve as any).expiresAt).toLocaleString("vi-VN")}
                                        </div>
                                    )}
                                </>
                            )}

                            {!form.reserve && (
                                <div className="pt-2 text-xs text-gray-500">
                                    * RefNo / Shipment / ServiceRequest sẽ sinh khi Admin duyệt POST.
                                </div>
                            )}
                        </div>
                    </Card>

                    {errMsg ? (
                        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errMsg}</div>
                    ) : null}
                </div>
            </div>

            {/* Sticky footer actions */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="text-sm">
                        <span className="text-gray-600">Tổng:</span>{" "}
                        <span className="font-semibold">{fmtMoney(total, "VND")}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={computedBackHref}
                            className={cls("h-9 rounded border px-4 hover:bg-gray-50 flex items-center", saving && "pointer-events-none opacity-60")}
                        >
                            Hủy
                        </Link>

                        <button
                            className="rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-60"
                            onClick={submit}
                            disabled={saving}
                            type="button"
                        >
                            {saving ? "Đang lưu..." : props.mode === "create" ? "Tạo Draft" : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>

            {/* EDIT confirm: lưu + optionally post */}
            {showPostConfirm && props.mode === "edit" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
                        <h3 className="text-lg font-semibold">Xác nhận lưu thay đổi</h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Bạn muốn <b>lưu thay đổi</b> cho đơn hàng này.
                            <br />
                            Nếu bạn chọn <b>Duyệt (POST) luôn</b> thì đơn sẽ chuyển sang <b>POSTED</b> và hệ thống tạo các bản ghi liên quan.
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                            <input
                                id="postAfterSave"
                                type="checkbox"
                                checked={postAfterSave}
                                onChange={(e) => setPostAfterSave(e.target.checked)}
                            />
                            <label htmlFor="postAfterSave" className="text-sm">
                                Duyệt (POST) luôn sau khi lưu
                            </label>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                                onClick={() => {
                                    setShowPostConfirm(false);
                                    setPostAfterSave(false);
                                }}
                                disabled={saving}
                            >
                                Hủy
                            </button>

                            <button
                                type="button"
                                className="rounded bg-black text-white px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-60"
                                onClick={async () => {
                                    setSaving(true);
                                    setErrMsg(null);
                                    try {
                                        await saveDraftOnly();
                                        if (postAfterSave) {
                                            await postOrderNow(props.orderId);
                                        }
                                        setShowPostConfirm(false);
                                        setPostAfterSave(false);
                                        router.push(`/admin/orders/${props.orderId}`);
                                        router.refresh();
                                    } catch (e: any) {
                                        setErrMsg(e?.message || "Thao tác thất bại");
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                            >
                                {saving ? "Đang xử lý..." : postAfterSave ? "Lưu & POST" : "Chỉ lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
