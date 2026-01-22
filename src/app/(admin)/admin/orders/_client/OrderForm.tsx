"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductSearchInput from "../../__components/ProductSearchInput";
import type {
    OrderDraftForEdit,
    OrderDraftInput,
    OrderItemInput,
} from "../_servers/order.type";

/** ==============================
 * Local Types (UI-only)
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

type ServiceScope = "BUNDLED_PRODUCT" | "CUSTOMER_ITEM";

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
    const v = Number(n);
    if (!Number.isFinite(v)) return "-";
    return new Intl.NumberFormat("vi-VN").format(v) + (cur ? ` ${cur}` : "");
}

function uid() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(16).slice(2);
}

function nowIso() {
    return new Date().toISOString();
}

// ISO -> datetime-local (YYYY-MM-DDTHH:mm)
// ISO -> datetime-local (YYYY-MM-DDTHH:mm)
function isoToLocalInput(iso?: string | Date | null) {
    if (!iso) return "";
    const d = iso instanceof Date ? iso : new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// datetime-local (YYYY-MM-DDTHH:mm) -> ISO (robust)
function localInputToIso(v?: string | null) {
    if (!v) return nowIso();

    // Expect "2026-01-21T19:40"
    const [datePart, timePart] = v.split("T");
    if (!datePart || !timePart) return nowIso();

    const [y, m, d] = datePart.split("-").map((x) => Number(x));
    const [hh, mm] = timePart.split(":").map((x) => Number(x));

    if (
        !Number.isFinite(y) ||
        !Number.isFinite(m) ||
        !Number.isFinite(d) ||
        !Number.isFinite(hh) ||
        !Number.isFinite(mm)
    ) {
        return nowIso();
    }

    // local time -> ISO
    const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
    if (Number.isNaN(dt.getTime())) return nowIso();
    return dt.toISOString();
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
        paymentMethod: "BANK_TRANSFER" as any,
        notes: null,

        reserve: null,
        items: [],
    } as any;
}

function toInputFromEdit(d: OrderDraftForEdit): OrderDraftInput {
    return {
        customerName: d.customerName || "",
        shipPhone: d.shipPhone ?? "",

        hasShipment: Boolean((d as any).hasShipment),
        shipAddress: (d as any).shipAddress ?? "",
        shipCity: (d as any).shipCity ?? "",
        shipDistrict: (d as any).shipDistrict ?? null,
        shipWard: (d as any).shipWard ?? "",

        createdAt: (d as any).createdAt ?? nowIso(),
        paymentMethod: (d as any).paymentMethod as any,
        notes: (d as any).notes ?? null,

        reserve: (d as any).reserve
            ? {
                type: (d as any).reserve.type,
                amount: Number((d as any).reserve.amount || 0),
                expiresAt: (d as any).reserve.expiresAt ?? null,
            }
            : null,

        items: ((d as any).items || []).map((it: any) => ({
            id: it.id,
            kind: it.kind,
            productId: it.productId ?? null,
            variantId: it.variantId ?? null,
            title: it.title ?? "",
            quantity: Number(it.quantity ?? 1),
            listPrice: Number(it.listPrice ?? it.unitPrice ?? 0),
            img: it.img ?? null,

            // service fields
            serviceCatalogId: it.serviceCatalogId ?? null,
            serviceScope: it.serviceScope ?? null,
            linkedOrderItemId: it.linkedOrderItemId ?? null,
            customerItemNote: it.customerItemNote ?? null,
        })) as any,
    } as any;
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
    tone?: "gray" | "blue" | "green" | "red";
}) {
    const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
    const toneCls =
        tone === "blue"
            ? "bg-blue-50 text-blue-700"
            : tone === "green"
                ? "bg-green-50 text-green-700"
                : tone === "red"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-100 text-gray-700";
    return <span className={cls(base, toneCls)}>{children}</span>;
}

/** ==============================
 * MAIN
 * ============================== */
export default function OrderFormClient(props: Props) {
    const router = useRouter();
    const services = props.services ?? [];

    const computedTitle =
        props.title ?? (props.mode === "create" ? "Tạo đơn hàng" : "Sửa đơn hàng");

    const computedSubtitle =
        props.subtitle ??
        (props.mode === "create"
            ? "Đơn nháp — chỉ khi ADMIN duyệt mới sinh RefNo + Shipment/ServiceRequest."
            : "Chỉ cho phép sửa khi đơn hàng còn DRAFT/RESERVED.");

    const computedBackHref =
        props.backHref ??
        (props.mode === "create" ? "/admin/orders" : `/admin/orders/${props.orderId}`);

    const computedBackLabel =
        props.backLabel ?? (props.mode === "create" ? "← Danh sách" : "← Quay lại chi tiết");

    /** --------------------------
     * Form State
     * -------------------------- */
    const [form, setForm] = useState<OrderDraftInput>(() => emptyDraft());
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    // edit confirm modal (save + optional post)
    const [showPostConfirm, setShowPostConfirm] = useState(false);
    const [postAfterSave, setPostAfterSave] = useState(false);

    // create-only success modal (optional)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

    // Sync initialData for edit/create
    useEffect(() => {
        if (props.mode === "edit") setForm(toInputFromEdit(props.initialData));
        else setForm(emptyDraft());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mode, props.mode === "edit" ? (props.initialData as any)?.id : "create"]);

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

    const debouncedPhone = useDebounce((form as any).shipPhone ?? "", 300);

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
        setForm((prev: any) => ({
            ...prev,
            customerName: c.name,
            shipPhone: c.phone,
            shipCity: c.city ?? prev.shipCity ?? "",
            shipDistrict: c.district ?? prev.shipDistrict ?? null,
            shipWard: c.ward ?? prev.shipWard ?? "",
            shipAddress: c.address ?? prev.shipAddress ?? "",
        }));
        setSuggestCustomers([]);
        setShowSuggest(false);
    }

    /** --------------------------
     * Helpers setForm / items
     * -------------------------- */
    function set<K extends keyof OrderDraftInput>(key: K, value: OrderDraftInput[K]) {
        setForm((prev: any) => ({ ...prev, [key]: value }));
    }

    function addItem(item: Omit<OrderItemInput, "id">) {
        setForm((prev: any) => ({
            ...prev,
            items: [...(prev.items ?? []), { id: uid(), ...item }],
        }));
    }

    function updateItemById(id: string, patch: Partial<OrderItemInput>) {
        setForm((prev: any) => ({
            ...prev,
            items: (prev.items ?? []).map((x: any) => (x.id === id ? { ...x, ...patch } : x)),
        }));
    }

    function removeItemById(id: string) {
        setForm((prev: any) => ({
            ...prev,
            items: (prev.items ?? []).filter((x: any) => x.id !== id),
        }));
    }

    /** --------------------------
     * Derived collections
     * -------------------------- */
    const items = useMemo<any[]>(() => ((form as any).items ?? []) as any[], [form]);

    const productLineItems = useMemo<any[]>(
        () => items.filter((x) => x.kind === "PRODUCT"),
        [items]
    );

    const serviceItems = useMemo<any[]>(
        () => items.filter((x) => x.kind === "SERVICE"),
        [items]
    );

    const discountItem = useMemo<any | null>(
        () => items.find((x) => x.kind === "DISCOUNT") ?? null,
        [items]
    );

    const serviceOptions = useMemo(() => {
        return (services || []).filter((s) => s.isActive !== false);
    }, [services]);

    const total = useMemo(() => {
        return items.reduce((s, it) => {
            const q = Number(it.quantity ?? 0);
            const p = Number(it.listPrice ?? 0);
            return s + q * p;
        }, 0);
    }, [items]);

    /** --------------------------
     * Reserve UX helpers
     * -------------------------- */
    const [reserveTouched, setReserveTouched] = useState(false);

    const depositAmount = useMemo(() => {
        return (form as any).reserve ? Number((form as any).reserve.amount || 0) : 0;
    }, [form]);

    const remainingAmount = useMemo(() => {
        return Math.max(0, total - depositAmount);
    }, [total, depositAmount]);

    // COD => auto enable reserve nếu chưa touched + chưa có reserve
    useEffect(() => {
        if ((form as any).paymentMethod !== "COD") return;
        if (reserveTouched) return;

        const deposit = Math.round(total * 0.1);

        set("reserve" as any, {
            type: "COD" as any,
            amount: deposit,
            expiresAt: null,
        } as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(form as any).paymentMethod, total]);

    /** --------------------------
     * Service/Discount block toggles
     * -------------------------- */
    const [enableService, setEnableService] = useState(false);
    const [enableDiscount, setEnableDiscount] = useState(false);

    // Keep toggles in sync with existing items (edit mode)
    useEffect(() => {
        setEnableService(serviceItems.length > 0);
        setEnableDiscount(Boolean(discountItem));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(serviceItems as any).length, discountItem?.id]);

    function ensureDiscount(amountPositive: number) {
        const value = Math.max(0, Number(amountPositive || 0));
        if (!Number.isFinite(value) || value <= 0) return;

        if (discountItem) {
            updateItemById(discountItem.id, {
                title: "Giảm giá",
                quantity: 1,
                listPrice: -Math.abs(value),
                productId: null,
            } as any);
            return;
        }

        addItem({
            kind: "DISCOUNT",
            title: "Giảm giá",
            productId: null,
            quantity: 1,
            listPrice: -Math.abs(value),
        } as any);
    }

    function clearDiscount() {
        if (discountItem?.id) removeItemById(discountItem.id);
    }

    /** --------------------------
     * Validate
     * -------------------------- */
    function validate(): string | null {
        const shipPhone = String((form as any).shipPhone ?? "").trim();
        const customerName = String((form as any).customerName ?? "").trim();

        if (!shipPhone) return "Vui lòng nhập số điện thoại.";
        if (!customerName) return "Vui lòng nhập tên khách hàng.";
        if (items.length === 0) return "Vui lòng thêm ít nhất 1 sản phẩm/dịch vụ/giảm giá.";

        if ((form as any).hasShipment) {
            if (!String((form as any).shipCity ?? "").trim()) return "Vui lòng nhập Tỉnh/TP.";
            if (!String((form as any).shipDistrict ?? "").trim()) return "Vui lòng nhập Quận/Huyện.";
            if (!String((form as any).shipAddress ?? "").trim()) return "Vui lòng nhập địa chỉ giao hàng.";
        }

        // item rules
        for (const it of items) {
            if (!it.kind) return "Có dòng item thiếu loại.";
            if (!String(it.title ?? "").trim()) return "Có dòng item thiếu tiêu đề.";
            if (it.kind !== "DISCOUNT") {
                if (!it.quantity || Number(it.quantity) < 1) return "Số lượng phải >= 1.";
            }
            if (it.listPrice == null || Number.isNaN(Number(it.listPrice))) return "Đơn giá không hợp lệ.";

            if (it.kind === "PRODUCT" && !it.productId) return "Có dòng PRODUCT thiếu productId.";

            if (it.kind === "SERVICE") {
                if (!it.serviceCatalogId) return "Dòng SERVICE thiếu serviceCatalogId.";
                if (!it.serviceScope) return "Dòng SERVICE thiếu serviceScope.";

                if (it.serviceScope === "BUNDLED_PRODUCT" && !it.linkedOrderItemId) {
                    return "SERVICE đi kèm sản phẩm: vui lòng chọn sản phẩm áp cho.";
                }
                if (it.serviceScope === "CUSTOMER_ITEM" && !String(it.customerItemNote ?? "").trim()) {
                    return "SERVICE đồ khách mang tới: vui lòng nhập mô tả.";
                }
            }
        }

        return null;
    }

    /** --------------------------
     * Submit flows
     * -------------------------- */
    async function saveDraftOnly() {
        setErrMsg(null);
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${(props as any).orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(await res.text());
            router.refresh();
        } finally {
            setSaving(false);
        }
    }

    async function postOrderNow(orderId: string) {
        const res = await fetch(`/api/admin/orders/${orderId}/post`, { method: "POST" });
        if (!res.ok) throw new Error(await res.text());
    }

    async function submit() {
        setErrMsg(null);

        const v = validate();
        if (v) {
            setErrMsg(v);
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

                // nếu bạn muốn popup thay vì redirect ngay:
                // setCreatedOrderId(data.id);
                // setShowSuccessModal(true);
                // return;

                router.push(`/admin/orders/${data.id}`);
                router.refresh();
            } catch (e: any) {
                setErrMsg(e?.message || "Tạo thất bại");
            } finally {
                setSaving(false);
            }
            return;
        }

        // EDIT => open confirm (save + optional post)
        setShowPostConfirm(true);
    }

    function resetFormForNewOrder() {
        setReserveTouched(false);
        setForm(emptyDraft());
        setEnableService(false);
        setEnableDiscount(false);
        setSuggestCustomers([]);
        setShowSuggest(false);
        setErrMsg(null);
    }

    /** --------------------------
     * Render helpers
     * -------------------------- */
    function kindLabel(kind: string) {
        if (kind === "PRODUCT") return "Sản phẩm";
        if (kind === "SERVICE") return "Dịch vụ";
        if (kind === "DISCOUNT") return "Giảm giá";
        return kind;
    }

    function kindTone(kind: string) {
        if (kind === "SERVICE") return "blue" as const;
        if (kind === "DISCOUNT") return "green" as const;
        return "gray" as const;
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

                <Link
                    href={computedBackHref}
                    className="rounded-md border px-3 py-2 hover:bg-gray-50 text-sm"
                >
                    {computedBackLabel}
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer */}
                    <Card title="Khách hàng">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Số điện thoại" hint="Nhập số để gợi ý khách hàng cũ">
                                <div className="relative">
                                    <input
                                        className="h-9 w-full rounded border px-3"
                                        value={(form as any).shipPhone ?? ""}
                                        onChange={(e) => {
                                            set("shipPhone" as any, e.target.value as any);
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
                                            {loadingSuggest && (
                                                <div className="px-3 py-2 text-sm text-gray-500">Đang tìm…</div>
                                            )}

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
                                    value={(form as any).customerName ?? ""}
                                    onChange={(e) => set("customerName" as any, e.target.value as any)}
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
                                <input
                                    type="checkbox"
                                    checked={Boolean((form as any).hasShipment)}
                                    onChange={(e) => set("hasShipment" as any, e.target.checked as any)}
                                />
                                Có shipment (giao hàng)
                            </label>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Tỉnh / Thành phố">
                                <input
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={cls(
                                        "h-9 rounded border px-3",
                                        !Boolean((form as any).hasShipment) && "bg-gray-50 text-gray-500"
                                    )}
                                    value={(form as any).shipCity ?? ""}
                                    onChange={(e) => set("shipCity" as any, e.target.value as any)}
                                    placeholder="VD: Hồ Chí Minh"
                                />
                            </Field>

                            <Field label="Quận / Huyện">
                                <input
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={cls(
                                        "h-9 rounded border px-3",
                                        !Boolean((form as any).hasShipment) && "bg-gray-50 text-gray-500"
                                    )}
                                    value={(form as any).shipDistrict ?? ""}
                                    onChange={(e) => set("shipDistrict" as any, (e.target.value || null) as any)}
                                    placeholder="VD: Quận 1"
                                />
                            </Field>

                            <Field label="Phường / Xã">
                                <input
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={cls(
                                        "h-9 rounded border px-3",
                                        !Boolean((form as any).hasShipment) && "bg-gray-50 text-gray-500"
                                    )}
                                    value={(form as any).shipWard ?? ""}
                                    onChange={(e) => set("shipWard" as any, e.target.value as any)}
                                    placeholder="VD: Bến Nghé"
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Địa chỉ chi tiết">
                                <textarea
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={cls(
                                        "min-h-[70px] w-full rounded border px-3 py-2",
                                        !Boolean((form as any).hasShipment) && "bg-gray-50 text-gray-500"
                                    )}
                                    value={(form as any).shipAddress ?? ""}
                                    onChange={(e) => set("shipAddress" as any, e.target.value as any)}
                                    placeholder="Số nhà, tên đường, ghi chú giao hàng…"
                                />
                            </Field>

                            {!Boolean((form as any).hasShipment) && (
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
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={enableService}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setEnableService(checked);
                                            if (!checked) {
                                                // remove all service items
                                                serviceItems.forEach((s) => removeItemById(s.id));
                                            }
                                        }}
                                    />
                                    Dịch vụ
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={enableDiscount}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setEnableDiscount(checked);
                                            if (!checked) clearDiscount();
                                            else {
                                                // nếu bật lên mà chưa có thì tạo khung mặc định (0 => chưa tạo line)
                                                // user nhập sẽ tạo line
                                            }
                                        }}
                                    />
                                    Giảm giá
                                </label>
                            </div>
                        }
                    >
                        {/* Product add */}
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
                                        listPrice: Number(p.price ?? 0),
                                    } as any);
                                }}
                            />
                        </div>

                        {/* Service block */}
                        {enableService && (
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="font-semibold">Dịch vụ</div>
                                        <div className="text-xs text-gray-500">
                                            ServiceRequest sẽ được tạo khi ADMIN duyệt POST.
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                        <div className="md:col-span-2">
                                            <Field label="Chọn dịch vụ để thêm">
                                                <select
                                                    className="h-9 w-full rounded border px-2 bg-white"
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        const id = e.target.value;
                                                        if (!id) return;
                                                        const s = serviceOptions.find((x) => x.id === id);
                                                        if (!s) return;

                                                        // default apply to first product (if exists)
                                                        const firstProductId = productLineItems[0]?.id ?? null;

                                                        addItem({
                                                            kind: "SERVICE",
                                                            title: s.name,
                                                            productId: null,
                                                            quantity: 1,
                                                            listPrice: Number(s.defaultPrice ?? 0),

                                                            serviceCatalogId: s.id,
                                                            serviceScope: "BUNDLED_PRODUCT" as any,
                                                            linkedOrderItemId: firstProductId,
                                                            customerItemNote: null,
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
                                        <div className="text-xs text-gray-500 md:text-right">
                                            Có {serviceItems.length} dịch vụ
                                        </div>
                                    </div>
                                </div>

                                {serviceItems.length > 0 && (
                                    <div className="space-y-3">
                                        {serviceItems.map((it) => (
                                            <div key={it.id} className="rounded-lg border p-4 bg-white space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="font-medium">{it.title}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {it.serviceCatalogId ? (
                                                                <>
                                                                    serviceCatalogId:{" "}
                                                                    <span className="font-mono">{it.serviceCatalogId}</span>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="text-xs text-red-600 hover:underline"
                                                        onClick={() => removeItemById(it.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <Field label="Phạm vi dịch vụ">
                                                        <select
                                                            className="h-9 w-full rounded border px-2"
                                                            value={(it.serviceScope ?? "BUNDLED_PRODUCT") as any}
                                                            onChange={(e) => {
                                                                const scope = e.target.value as ServiceScope;
                                                                updateItemById(it.id, {
                                                                    serviceScope: scope as any,
                                                                    linkedOrderItemId:
                                                                        scope === "BUNDLED_PRODUCT" ? it.linkedOrderItemId ?? null : null,
                                                                    customerItemNote: scope === "CUSTOMER_ITEM" ? it.customerItemNote ?? "" : null,
                                                                } as any);
                                                            }}
                                                        >
                                                            <option value="BUNDLED_PRODUCT">Đi kèm sản phẩm</option>
                                                            <option value="CUSTOMER_ITEM">Đồ khách mang tới</option>
                                                        </select>
                                                    </Field>

                                                    <Field label="Số lượng">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="h-9 w-full rounded border px-2"
                                                            value={Number(it.quantity ?? 1)}
                                                            onChange={(e) =>
                                                                updateItemById(it.id, {
                                                                    quantity: Math.max(1, Number(e.target.value || 1)),
                                                                } as any)
                                                            }
                                                        />
                                                    </Field>

                                                    <Field label="Đơn giá">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="h-9 w-full rounded border px-2 text-right"
                                                            value={Number(it.listPrice ?? 0)}
                                                            onChange={(e) =>
                                                                updateItemById(it.id, { listPrice: Number(e.target.value || 0) } as any)
                                                            }
                                                        />
                                                    </Field>
                                                </div>

                                                {it.serviceScope !== "CUSTOMER_ITEM" && (
                                                    <Field label="Áp cho sản phẩm" hint="Bắt buộc nếu dịch vụ đi kèm sản phẩm">
                                                        <select
                                                            className="h-9 w-full rounded border px-2"
                                                            value={it.linkedOrderItemId ?? ""}
                                                            onChange={(e) =>
                                                                updateItemById(it.id, {
                                                                    linkedOrderItemId: e.target.value || null,
                                                                } as any)
                                                            }
                                                        >
                                                            <option value="">-- Chọn sản phẩm --</option>
                                                            {productLineItems.map((p) => (
                                                                <option key={p.id} value={p.id}>
                                                                    {p.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </Field>
                                                )}

                                                {it.serviceScope === "CUSTOMER_ITEM" && (
                                                    <Field
                                                        label="Mô tả đồ khách mang tới"
                                                        hint="VD: seiko tròn mặt đen, đang chạy sai giờ"
                                                    >
                                                        <textarea
                                                            className="min-h-[70px] w-full rounded border px-3 py-2"
                                                            value={it.customerItemNote ?? ""}
                                                            onChange={(e) =>
                                                                updateItemById(it.id, { customerItemNote: e.target.value } as any)
                                                            }
                                                            placeholder="Mô tả tình trạng/ngoại hình..."
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Discount block */}
                        {enableDiscount && (
                            <div className="mt-6 rounded-lg border bg-red-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-red-700">Giảm giá toàn đơn</div>
                                        <div className="text-xs text-red-700/70">
                                            Nhập số dương. Hệ thống sẽ tự trừ vào tổng.
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="text-sm text-red-700 hover:underline"
                                        onClick={() => {
                                            setEnableDiscount(false);
                                            clearDiscount();
                                        }}
                                    >
                                        Bỏ giảm giá
                                    </button>
                                </div>

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <div className="md:col-span-2">
                                        <Field label="Số tiền giảm">
                                            <input
                                                type="number"
                                                min={0}
                                                className="h-10 w-full rounded border px-3 text-right text-red-700 font-semibold"
                                                value={discountItem ? Math.abs(Number(discountItem.listPrice ?? 0)) : ""}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value || 0);
                                                    if (!Number.isFinite(v) || v <= 0) {
                                                        // nếu user xóa input => xóa line discount
                                                        clearDiscount();
                                                        return;
                                                    }
                                                    ensureDiscount(v);
                                                }}
                                                placeholder="VD: 200000"
                                            />
                                        </Field>
                                    </div>

                                    <div className="md:text-right">
                                        <div className="text-xs text-gray-600">Tác động</div>
                                        <div className="text-lg font-semibold text-red-700">
                                            {discountItem ? `− ${fmtMoney(Math.abs(Number(discountItem.listPrice ?? 0)), "VND")}` : "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Line items table (simple, clean) */}
                        <div className="mt-6 overflow-x-auto border rounded-lg">
                            <table className="min-w-full text-sm border-collapse">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-3 py-2 text-left w-[110px]">Loại</th>
                                        <th className="px-3 py-2 text-left">Tên</th>
                                        <th className="px-3 py-2 text-right w-[120px]">SL</th>
                                        <th className="px-3 py-2 text-right w-[160px]">Đơn giá</th>
                                        <th className="px-3 py-2 text-right w-[180px]">Thành tiền</th>
                                        <th className="px-3 py-2 text-right w-[80px]">Xóa</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-4 text-gray-500">
                                                Chưa có item nào. Hãy thêm sản phẩm/dịch vụ/giảm giá.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((it) => {
                                            const isProduct = it.kind === "PRODUCT";
                                            const isService = it.kind === "SERVICE";
                                            const isDiscount = it.kind === "DISCOUNT";

                                            const qty = isDiscount ? 1 : Number(it.quantity ?? 1);
                                            const price = Number(it.listPrice ?? 0);
                                            const lineTotal = qty * price;

                                            // service extra display
                                            let subNote: string | null = null;
                                            if (isService) {
                                                if (it.serviceScope === "CUSTOMER_ITEM") {
                                                    subNote = String(it.customerItemNote ?? "").trim() || null;
                                                } else if (it.linkedOrderItemId) {
                                                    const p = productLineItems.find((x) => x.id === it.linkedOrderItemId);
                                                    subNote = p ? `Áp cho: ${p.title}` : "Áp cho: (chưa chọn)";
                                                }
                                            }

                                            if (isProduct && it.productId) {
                                                subNote = `productId: ${it.productId}`;
                                            }

                                            if (isDiscount) {
                                                subNote = "Giảm giá toàn đơn";
                                            }

                                            return (
                                                <tr
                                                    key={it.id}
                                                    className={cls(
                                                        "border-b",
                                                        isDiscount && "bg-red-50",
                                                        !isDiscount && "hover:bg-gray-50"
                                                    )}
                                                >
                                                    <td className="px-3 py-3 align-top">
                                                        <Badge tone={kindTone(it.kind)}>{kindLabel(it.kind)}</Badge>
                                                    </td>

                                                    <td className="px-3 py-3">
                                                        <div className={cls("font-medium", isDiscount && "text-red-700")}>
                                                            {it.title}
                                                        </div>
                                                        {subNote ? (
                                                            <div className={cls("mt-1 text-xs", isDiscount ? "text-red-700/70" : "text-gray-500")}>
                                                                {subNote}
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                    <td className="px-3 py-3 text-right align-top">
                                                        {isDiscount ? (
                                                            <span className="text-gray-500">—</span>
                                                        ) : isProduct ? (
                                                            // product qty editable
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                className="h-9 w-24 rounded border px-2 text-right"
                                                                value={Number(it.quantity ?? 1)}
                                                                onChange={(e) =>
                                                                    updateItemById(it.id, {
                                                                        quantity: Math.max(1, Number(e.target.value || 1)),
                                                                    } as any)
                                                                }
                                                            />
                                                        ) : (
                                                            // service qty editable? -> keep edit in service block, so show readonly here
                                                            <span className="inline-flex h-9 w-24 items-center justify-end">
                                                                {Number(it.quantity ?? 1)}
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-3 text-right align-top">
                                                        {isProduct ? (
                                                            // product price locked
                                                            <span className="inline-flex h-9 items-center justify-end w-[140px] font-medium">
                                                                {fmtMoney(price, "VND")}
                                                            </span>
                                                        ) : isService ? (
                                                            // service price locked in line item (edited in block)
                                                            <span className="inline-flex h-9 items-center justify-end w-[140px]">
                                                                {fmtMoney(price, "VND")}
                                                            </span>
                                                        ) : (
                                                            // discount price locked in line item (edited in block)
                                                            <span className="inline-flex h-9 items-center justify-end w-[140px] text-red-700 font-medium">
                                                                {fmtMoney(price, "VND")}
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td
                                                        className={cls(
                                                            "px-3 py-3 text-right font-semibold align-top",
                                                            isDiscount && "text-red-700"
                                                        )}
                                                    >
                                                        {fmtMoney(lineTotal, "VND")}
                                                    </td>

                                                    <td className="px-3 py-3 text-right align-top">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (it.kind === "DISCOUNT") setEnableDiscount(false);
                                                                removeItemById(it.id);
                                                            }}
                                                            className="text-red-600 hover:underline text-xs"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
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
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        // nếu user clear input -> set nowIso để tránh Invalid Date
                                        set("createdAt" as any, localInputToIso(v) as any);
                                    }}
                                />
                            </Field>

                            <Field label="Thanh toán">
                                <select
                                    className="h-9 w-full rounded border px-2"
                                    value={(form as any).paymentMethod as any}
                                    onChange={(e) => {
                                        setReserveTouched(false);
                                        set("paymentMethod" as any, e.target.value as any);
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
                                        checked={Boolean((form as any).reserve)}
                                        disabled={(form as any).paymentMethod === "COD"}
                                        onChange={(e) => {
                                            setReserveTouched(true);
                                            if (!e.target.checked) set("reserve" as any, null as any);
                                            else
                                                set("reserve" as any, {
                                                    type: "DEPOSIT",
                                                    amount: 0,
                                                    expiresAt: null,
                                                } as any);
                                        }}
                                    />
                                    <span className="font-medium">
                                        Đặt cọc giữ hàng
                                        {(form as any).paymentMethod === "COD" && (
                                            <span className="ml-1 text-xs text-orange-600">(bắt buộc với COD)</span>
                                        )}
                                    </span>
                                </label>

                                {(form as any).reserve && (
                                    <div className="space-y-3 rounded-md border bg-gray-50 p-3">
                                        <Field label="Loại cọc">
                                            <select
                                                className="h-9 w-full rounded border px-2"
                                                value={(form as any).reserve.type}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve" as any, {
                                                        ...(form as any).reserve,
                                                        type: e.target.value,
                                                    } as any);
                                                }}
                                            >
                                                <option value="DEPOSIT">DEPOSIT</option>
                                                <option value="COD">COD</option>
                                            </select>
                                        </Field>

                                        <Field
                                            label="Số tiền cọc"
                                            hint={
                                                (form as any).paymentMethod === "COD"
                                                    ? "Mặc định 10% giá trị đơn, có thể chỉnh sửa"
                                                    : "Khách trả trước để giữ hàng"
                                            }
                                        >
                                            <input
                                                type="number"
                                                min={0}
                                                className="h-9 w-full rounded border px-3"
                                                value={Number((form as any).reserve.amount ?? 0)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve" as any, {
                                                        ...(form as any).reserve,
                                                        amount: Number(e.target.value || 0),
                                                    } as any);
                                                }}
                                                placeholder="VD: 5000000"
                                            />
                                        </Field>

                                        <Field label="Giữ hàng đến" hint="Hết hạn có thể huỷ đơn nếu chưa thanh toán">
                                            <input
                                                type="datetime-local"
                                                value={isoToLocalInput((form as any).reserve.expiresAt)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve" as any, {
                                                        ...(form as any).reserve,
                                                        expiresAt: e.target.value ? localInputToIso(e.target.value) : null,
                                                    } as any);
                                                }}
                                                className="h-9 w-full rounded border px-3"
                                                disabled={(form as any).paymentMethod === "COD"}
                                            />
                                        </Field>

                                        <div className="text-xs text-gray-500">
                                            💡 Thường dùng cho COD hoặc giữ hàng cho khách VIP
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Field label="Ghi chú">
                                <textarea
                                    className="min-h-[90px] w-full rounded border px-3 py-2"
                                    value={(form as any).notes ?? ""}
                                    onChange={(e) => set("notes" as any, (e.target.value || null) as any)}
                                    placeholder="Ghi chú nội bộ…"
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card title="Tóm tắt">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số item</span>
                                <span className="font-medium">{items.length}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Tổng tiền</span>
                                <span className="font-semibold">{fmtMoney(total, "VND")}</span>
                            </div>

                            {(form as any).reserve && (
                                <>
                                    <div className="flex justify-between text-amber-700">
                                        <span>Đã cọc</span>
                                        <span className="font-medium">− {fmtMoney(depositAmount, "VND")}</span>
                                    </div>

                                    <div className="flex justify-between font-semibold text-red-700 border-t pt-2">
                                        <span>Còn phải thu</span>
                                        <span>{fmtMoney(remainingAmount, "VND")}</span>
                                    </div>

                                    {(form as any).reserve.expiresAt && (
                                        <div className="text-xs text-gray-500">
                                            ⏰ Giữ hàng đến:{" "}
                                            {new Date((form as any).reserve.expiresAt).toLocaleString("vi-VN")}
                                        </div>
                                    )}
                                </>
                            )}

                            {!(form as any).reserve && (
                                <div className="pt-2 text-xs text-gray-500">
                                    * RefNo / Shipment / ServiceRequest sẽ sinh khi Admin duyệt POST.
                                </div>
                            )}
                        </div>
                    </Card>

                    {errMsg ? (
                        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errMsg}
                        </div>
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
                            className={cls(
                                "h-9 rounded border px-4 hover:bg-gray-50 flex items-center",
                                saving && "pointer-events-none opacity-60"
                            )}
                        >
                            Hủy
                        </Link>

                        <button
                            className="rounded-md bg-black text-white px-4 h-9 text-sm hover:bg-neutral-800 disabled:opacity-60"
                            onClick={submit}
                            disabled={saving}
                            type="button"
                        >
                            {saving ? "Đang lưu..." : props.mode === "create" ? "Tạo Draft" : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Create success modal (optional) */}
            {props.mode === "create" && showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold">Tạo đơn thành công 🎉</h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Bạn muốn tiếp tục tạo đơn mới hay quay lại danh sách đơn hàng?
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    if (createdOrderId) router.push(`/admin/orders/${createdOrderId}`);
                                    else router.push("/admin/orders");
                                }}
                            >
                                Xem chi tiết
                            </button>

                            <button
                                className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    resetFormForNewOrder();
                                }}
                            >
                                Tạo đơn mới
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit confirm (save + optional post) */}
            {showPostConfirm && props.mode === "edit" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
                        <h3 className="text-lg font-semibold">Xác nhận lưu thay đổi</h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Bạn muốn <b>lưu thay đổi</b> cho đơn hàng này.
                            <br />
                            Nếu chọn <b>Duyệt (POST) luôn</b> thì đơn chuyển sang <b>POSTED</b> và hệ thống tạo các
                            bản ghi liên quan (payments / shipment / service request...).
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
                                className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
                                onClick={async () => {
                                    setSaving(true);
                                    setErrMsg(null);
                                    try {
                                        await saveDraftOnly();
                                        if (postAfterSave) await postOrderNow((props as any).orderId);

                                        setShowPostConfirm(false);
                                        setPostAfterSave(false);

                                        router.push(`/admin/orders/${(props as any).orderId}`);
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
