"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CircleDollarSign,
    Package,
    Percent,
    Phone,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Truck,
    Wrench,
    X,
} from "lucide-react";

import ProductSearchInput from "../../__components/ProductSearchInput";
import {
    AdminCard,
    AdminField,
    AdminHeader,
    AdminStickySubmit,
    StatPill,
    ToneBadge,
    ui,
} from "../../__components/AdminFormLayout";

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

function localInputToIso(v?: string | null) {
    if (!v) return nowIso();

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

            serviceCatalogId: it.serviceCatalogId ?? null,
            serviceScope: it.serviceScope ?? null,
            linkedOrderItemId: it.linkedOrderItemId ?? null,
            customerItemNote: it.customerItemNote ?? null,
        })) as any,
    } as any;
}

function useDebounce<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
}

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

function SectionNote({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "gray" | "red" | "amber" | "blue" | "green";
}) {
    const toneCls =
        tone === "red"
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : tone === "amber"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : tone === "blue"
                    ? "border-sky-200 bg-sky-50 text-sky-800"
                    : tone === "green"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-700";

    return <div className={ui("rounded-xl border px-4 py-3 text-sm", toneCls)}>{children}</div>;
}

function Modal({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <div className="mt-3">{children}</div>
            </div>
        </div>
    );
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

    const [showPostConfirm, setShowPostConfirm] = useState(false);
    const [postAfterSave, setPostAfterSave] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

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
     * Service/Discount toggles
     * -------------------------- */
    const [enableService, setEnableService] = useState(false);
    const [enableDiscount, setEnableDiscount] = useState(false);

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

                if (it.serviceScope === "WITH_PURCHASE" && !it.linkedOrderItemId) {
                    return "SERVICE đi kèm sản phẩm: vui lòng chọn sản phẩm áp cho.";
                }
                if (it.serviceScope === "CUSTOMER_OWNED" && !String(it.customerItemNote ?? "").trim()) {
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

    const orderStats = (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill label="Items" value={items.length} />
            <StatPill label="Sản phẩm" value={productLineItems.length} />
            <StatPill label="Dịch vụ" value={serviceItems.length} />
            <StatPill label="Tổng" value={fmtMoney(total, "VND")} />
        </div>
    );

    return (
        <form
            className="space-y-6 pb-28"
            onSubmit={(e) => {
                e.preventDefault();
                void submit();
            }}
        >
            <AdminHeader
                sectionLabel="Đơn hàng"
                title={computedTitle}
                subtitle={computedSubtitle}
                backHref={computedBackHref}
                backLabel={computedBackLabel}
                rightStats={orderStats}
                badge={
                    <ToneBadge tone={props.mode === "create" ? "amber" : "blue"}>
                        {props.mode === "create" ? "DRAFT" : "EDIT"}
                    </ToneBadge>
                }
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                    {/* Customer */}
                    <AdminCard
                        title="Khách hàng"
                        desc="Tìm khách cũ theo số điện thoại hoặc nhập nhanh thông tin khách mới."
                        right={
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                                <Phone className="h-5 w-5" />
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <AdminField label="Số điện thoại" hint="Nhập số để gợi ý khách hàng cũ">
                                <div className="relative">
                                    <input
                                        className="h-10 w-full rounded-xl border border-slate-300 px-3"
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
                                        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                            {loadingSuggest && (
                                                <div className="px-3 py-2 text-sm text-slate-500">Đang tìm…</div>
                                            )}

                                            {!loadingSuggest &&
                                                suggestCustomers.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        className="w-full px-3 py-2 text-left hover:bg-slate-50"
                                                        onClick={() => applyCustomer(c)}
                                                    >
                                                        <div className="font-medium text-slate-900">{c.name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {c.phone}
                                                            {c.address ? ` • ${c.address}` : ""}
                                                        </div>
                                                    </button>
                                                ))}

                                            {!loadingSuggest && suggestCustomers.length === 0 && (
                                                <div className="px-3 py-2 text-sm text-slate-500">
                                                    Không tìm thấy khách cũ
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </AdminField>

                            <AdminField label="Tên khách hàng" hint="Nếu khách mới, nhập trực tiếp ở đây">
                                <input
                                    className="h-10 w-full rounded-xl border border-slate-300 px-3"
                                    value={(form as any).customerName ?? ""}
                                    onChange={(e) => set("customerName" as any, e.target.value as any)}
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </AdminField>
                        </div>
                    </AdminCard>

                    {/* Shipping */}
                    <AdminCard
                        title="Giao hàng"
                        desc="Có thể tắt shipment nếu khách tới lấy trực tiếp."
                        right={
                            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={Boolean((form as any).hasShipment)}
                                    onChange={(e) => set("hasShipment" as any, e.target.checked as any)}
                                />
                                Có shipment
                            </label>
                        }
                    >
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div className="text-sm text-slate-500">
                                {Boolean((form as any).hasShipment)
                                    ? "Đơn này có giao hàng, cần nhập đầy đủ địa chỉ."
                                    : "Đơn này là pickup, có thể bỏ qua thông tin địa chỉ."}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <AdminField label="Tỉnh / Thành phố">
                                <input
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={ui(
                                        "h-10 w-full rounded-xl border border-slate-300 px-3",
                                        !Boolean((form as any).hasShipment) && "bg-slate-50 text-slate-400"
                                    )}
                                    value={(form as any).shipCity ?? ""}
                                    onChange={(e) => set("shipCity" as any, e.target.value as any)}
                                    placeholder="VD: Hồ Chí Minh"
                                />
                            </AdminField>

                            <AdminField label="Quận / Huyện">
                                <input
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={ui(
                                        "h-10 w-full rounded-xl border border-slate-300 px-3",
                                        !Boolean((form as any).hasShipment) && "bg-slate-50 text-slate-400"
                                    )}
                                    value={(form as any).shipDistrict ?? ""}
                                    onChange={(e) => set("shipDistrict" as any, (e.target.value || null) as any)}
                                    placeholder="VD: Quận 1"
                                />
                            </AdminField>

                            <AdminField label="Phường / Xã">
                                <input
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={ui(
                                        "h-10 w-full rounded-xl border border-slate-300 px-3",
                                        !Boolean((form as any).hasShipment) && "bg-slate-50 text-slate-400"
                                    )}
                                    value={(form as any).shipWard ?? ""}
                                    onChange={(e) => set("shipWard" as any, e.target.value as any)}
                                    placeholder="VD: Bến Nghé"
                                />
                            </AdminField>
                        </div>

                        <div className="mt-4">
                            <AdminField label="Địa chỉ chi tiết">
                                <textarea
                                    disabled={!Boolean((form as any).hasShipment)}
                                    className={ui(
                                        "min-h-[90px] w-full rounded-xl border border-slate-300 px-3 py-2",
                                        !Boolean((form as any).hasShipment) && "bg-slate-50 text-slate-400"
                                    )}
                                    value={(form as any).shipAddress ?? ""}
                                    onChange={(e) => set("shipAddress" as any, e.target.value as any)}
                                    placeholder="Số nhà, tên đường, ghi chú giao hàng…"
                                />
                            </AdminField>

                            {!Boolean((form as any).hasShipment) && (
                                <div className="mt-2 text-xs text-slate-500">
                                    Đang chọn <b>pickup</b> nên không cần nhập địa chỉ giao hàng.
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    {/* Items */}
                    <AdminCard
                        title="Nội dung đơn hàng"
                        desc="Thêm sản phẩm, dịch vụ và giảm giá trong cùng một đơn."
                        right={
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={enableService}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setEnableService(checked);
                                            if (!checked) {
                                                serviceItems.forEach((x) => removeItemById(x.id));
                                            }
                                        }}
                                    />
                                    Có dịch vụ
                                </label>

                                <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={enableDiscount}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setEnableDiscount(checked);
                                            if (!checked) clearDiscount();
                                            if (checked && !discountItem) ensureDiscount(0);
                                        }}
                                    />
                                    Giảm giá
                                </label>
                            </div>
                        }
                    >
                        <div className="space-y-6">
                            {/* Product add */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">Thêm sản phẩm</div>
                                        <div className="text-sm text-slate-500">
                                            Chọn sản phẩm hiện có để đưa vào đơn.
                                        </div>
                                    </div>
                                </div>

                                <ProductSearchInput
                                    value=""
                                    onSelect={(p) => {
                                        addItem({
                                            kind: "PRODUCT",
                                            title: p.title,
                                            productId: p.id,
                                            quantity: 1,
                                            listPrice: Number((p as any).price ?? 0),
                                            img: (p as any).primaryImageUrl ?? null,
                                        } as any);
                                    }}
                                />
                            </div>

                            {/* Product block */}
                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-4 w-4 text-slate-500" />
                                        <div className="text-sm font-semibold text-slate-800">Sản phẩm trong đơn</div>
                                    </div>
                                    <ToneBadge>{productLineItems.length} dòng</ToneBadge>
                                </div>

                                {productLineItems.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                        Chưa có sản phẩm nào trong đơn.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {productLineItems.map((it) => {
                                            const lineTotal =
                                                Number(it.quantity ?? 1) * Number(it.listPrice ?? 0);

                                            return (
                                                <div
                                                    key={it.id}
                                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                                >
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <ToneBadge tone="gray">Sản phẩm</ToneBadge>
                                                                <div className="font-semibold text-slate-900">
                                                                    {it.title}
                                                                </div>
                                                            </div>

                                                            {it.productId ? (
                                                                <div className="mt-1 text-xs text-slate-500">
                                                                    productId: {it.productId}
                                                                </div>
                                                            ) : null}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeItemById(it.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Xóa
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                        <AdminField label="Số lượng">
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                className="h-10 w-full rounded-xl border border-slate-300 px-3 text-right"
                                                                value={Number(it.quantity ?? 1)}
                                                                onChange={(e) =>
                                                                    updateItemById(it.id, {
                                                                        quantity: Math.max(
                                                                            1,
                                                                            Number(e.target.value || 1)
                                                                        ),
                                                                    } as any)
                                                                }
                                                            />
                                                        </AdminField>

                                                        <AdminField label="Đơn giá">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                className="h-10 w-full rounded-xl border border-slate-300 px-3 text-right"
                                                                value={Number(it.listPrice ?? 0)}
                                                                onChange={(e) =>
                                                                    updateItemById(it.id, {
                                                                        listPrice: Number(e.target.value || 0),
                                                                    } as any)
                                                                }
                                                            />
                                                        </AdminField>

                                                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                            <div className="text-xs uppercase tracking-wide text-slate-500">
                                                                Thành tiền
                                                            </div>
                                                            <div className="mt-1 text-base font-semibold text-slate-900">
                                                                {fmtMoney(lineTotal, "VND")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Service block */}
                            {enableService && (
                                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-700">
                                                <Wrench className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sky-900">Dịch vụ đi kèm</div>
                                                <div className="text-sm text-sky-800/80">
                                                    Áp cho sản phẩm trong đơn hoặc nhận đồ khách mang tới.
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                addItem({
                                                    kind: "SERVICE",
                                                    title: "",
                                                    quantity: 1,
                                                    listPrice: 0,
                                                    productId: null,
                                                    serviceCatalogId: null,
                                                    serviceScope: "WITH_PURCHASE" as ServiceScope,
                                                    linkedOrderItemId: null,
                                                    customerItemNote: null,
                                                } as any)
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Thêm dịch vụ
                                        </button>
                                    </div>

                                    {serviceItems.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-sky-200 bg-white px-4 py-8 text-center text-sm text-sky-700">
                                            Đã bật block dịch vụ nhưng chưa có dòng nào.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {serviceItems.map((it, index) => (
                                                <div
                                                    key={it.id}
                                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                                >
                                                    <div className="mb-4 flex items-start justify-between gap-3">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <ToneBadge tone="blue">Dịch vụ #{index + 1}</ToneBadge>
                                                            {it.title ? (
                                                                <span className="text-sm font-medium text-slate-900">
                                                                    {it.title}
                                                                </span>
                                                            ) : null}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeItemById(it.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Xóa
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <AdminField label="Danh mục dịch vụ">
                                                            <select
                                                                className="h-10 w-full rounded-xl border border-slate-300 px-3"
                                                                value={it.serviceCatalogId ?? ""}
                                                                onChange={(e) => {
                                                                    const catalogId = e.target.value || null;
                                                                    const selected = serviceOptions.find((x) => x.id === catalogId);
                                                                    updateItemById(it.id, {
                                                                        serviceCatalogId: catalogId,
                                                                        title: selected?.name ?? "",
                                                                        listPrice: Number(selected?.defaultPrice ?? 0),
                                                                    } as any);
                                                                }}
                                                            >
                                                                <option value="">-- Chọn dịch vụ --</option>
                                                                {serviceOptions.map((s) => (
                                                                    <option key={s.id} value={s.id}>
                                                                        {s.code ? `${s.code} - ${s.name}` : s.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </AdminField>

                                                        <AdminField label="Phạm vi áp dụng">
                                                            <select
                                                                className="h-10 w-full rounded-xl border border-slate-300 px-3"
                                                                value={it.serviceScope ?? "WITH_PURCHASE"}
                                                                onChange={(e) =>
                                                                    updateItemById(it.id, {
                                                                        serviceScope: e.target.value as ServiceScope,
                                                                        linkedOrderItemId:
                                                                            e.target.value === "WITH_PURCHASE"
                                                                                ? it.linkedOrderItemId ?? null
                                                                                : null,
                                                                        customerItemNote:
                                                                            e.target.value === "CUSTOMER_OWNED"
                                                                                ? it.customerItemNote ?? ""
                                                                                : null,
                                                                    } as any)
                                                                }
                                                            >
                                                                <option value="WITH_PURCHASE">Đi kèm sản phẩm mua</option>
                                                                <option value="CUSTOMER_OWNED">Đồ khách mang tới</option>
                                                            </select>
                                                        </AdminField>

                                                        <AdminField label="Số lượng">
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                className="h-10 w-full rounded-xl border border-slate-300 px-3 text-right"
                                                                value={Number(it.quantity ?? 1)}
                                                                onChange={(e) =>
                                                                    updateItemById(it.id, {
                                                                        quantity: Math.max(1, Number(e.target.value || 1)),
                                                                    } as any)
                                                                }
                                                            />
                                                        </AdminField>

                                                        <AdminField label="Đơn giá">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                className="h-10 w-full rounded-xl border border-slate-300 px-3 text-right"
                                                                value={Number(it.listPrice ?? 0)}
                                                                onChange={(e) =>
                                                                    updateItemById(it.id, {
                                                                        listPrice: Number(e.target.value || 0),
                                                                    } as any)
                                                                }
                                                            />
                                                        </AdminField>
                                                    </div>

                                                    {it.serviceScope !== "CUSTOMER_OWNED" && (
                                                        <div className="mt-4">
                                                            <AdminField
                                                                label="Áp cho sản phẩm"
                                                                hint="Bắt buộc nếu dịch vụ đi kèm sản phẩm"
                                                            >
                                                                <select
                                                                    className="h-10 w-full rounded-xl border border-slate-300 px-3"
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
                                                            </AdminField>
                                                        </div>
                                                    )}

                                                    {it.serviceScope === "CUSTOMER_OWNED" && (
                                                        <div className="mt-4">
                                                            <AdminField
                                                                label="Mô tả đồ khách mang tới"
                                                                hint="VD: seiko tròn mặt đen, đang chạy sai giờ"
                                                            >
                                                                <textarea
                                                                    className="min-h-[90px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                                                    value={it.customerItemNote ?? ""}
                                                                    onChange={(e) =>
                                                                        updateItemById(it.id, {
                                                                            customerItemNote: e.target.value,
                                                                        } as any)
                                                                    }
                                                                    placeholder="Mô tả tình trạng/ngoại hình..."
                                                                />
                                                            </AdminField>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Discount block */}
                            {enableDiscount && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-700">
                                                <Percent className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-rose-900">Giảm giá toàn đơn</div>
                                                <div className="text-sm text-rose-800/80">
                                                    Nhập số dương. Hệ thống sẽ tự trừ vào tổng.
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="rounded-lg px-2 py-1 text-sm font-medium text-rose-700 hover:bg-rose-100"
                                            onClick={() => {
                                                setEnableDiscount(false);
                                                clearDiscount();
                                            }}
                                        >
                                            Bỏ giảm giá
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="md:col-span-2">
                                            <AdminField label="Số tiền giảm">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="h-10 w-full rounded-xl border border-rose-300 px-3 text-right font-semibold text-rose-700"
                                                    value={discountItem ? Math.abs(Number(discountItem.listPrice ?? 0)) : ""}
                                                    onChange={(e) => {
                                                        const v = Number(e.target.value || 0);
                                                        if (!Number.isFinite(v) || v <= 0) {
                                                            clearDiscount();
                                                            return;
                                                        }
                                                        ensureDiscount(v);
                                                    }}
                                                    placeholder="VD: 200000"
                                                />
                                            </AdminField>
                                        </div>

                                        <div className="rounded-xl border border-rose-200 bg-white px-4 py-3">
                                            <div className="text-xs uppercase tracking-wide text-rose-600">Tác động</div>
                                            <div className="mt-1 text-lg font-semibold text-rose-700">
                                                {discountItem
                                                    ? `− ${fmtMoney(Math.abs(Number(discountItem.listPrice ?? 0)), "VND")}`
                                                    : "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Summary item table */}
                            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="w-[120px] px-3 py-3 text-left">Loại</th>
                                            <th className="px-3 py-3 text-left">Tên</th>
                                            <th className="w-[120px] px-3 py-3 text-right">SL</th>
                                            <th className="w-[160px] px-3 py-3 text-right">Đơn giá</th>
                                            <th className="w-[180px] px-3 py-3 text-right">Thành tiền</th>
                                            <th className="w-[90px] px-3 py-3 text-right">Xóa</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
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

                                                let subNote: string | null = null;
                                                if (isService) {
                                                    if (it.serviceScope === "CUSTOMER_OWNED") {
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
                                                        className={ui(
                                                            "border-b",
                                                            isDiscount ? "bg-rose-50" : "hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <td className="px-3 py-3 align-top">
                                                            <ToneBadge tone={kindTone(it.kind)}>
                                                                {kindLabel(it.kind)}
                                                            </ToneBadge>
                                                        </td>

                                                        <td className="px-3 py-3">
                                                            <div className={ui("font-medium", isDiscount && "text-rose-700")}>
                                                                {it.title}
                                                            </div>
                                                            {subNote ? (
                                                                <div
                                                                    className={ui(
                                                                        "mt-1 text-xs",
                                                                        isDiscount ? "text-rose-700/80" : "text-slate-500"
                                                                    )}
                                                                >
                                                                    {subNote}
                                                                </div>
                                                            ) : null}
                                                        </td>

                                                        <td className="px-3 py-3 text-right align-top">
                                                            {isDiscount ? (
                                                                <span className="text-slate-400">—</span>
                                                            ) : isProduct ? (
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    className="h-10 w-24 rounded-xl border border-slate-300 px-2 text-right"
                                                                    value={Number(it.quantity ?? 1)}
                                                                    onChange={(e) =>
                                                                        updateItemById(it.id, {
                                                                            quantity: Math.max(
                                                                                1,
                                                                                Number(e.target.value || 1)
                                                                            ),
                                                                        } as any)
                                                                    }
                                                                />
                                                            ) : (
                                                                <span className="inline-flex h-10 w-24 items-center justify-end">
                                                                    {Number(it.quantity ?? 1)}
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-3 text-right align-top">
                                                            <span
                                                                className={ui(
                                                                    "inline-flex h-10 w-[140px] items-center justify-end",
                                                                    isDiscount && "font-medium text-rose-700"
                                                                )}
                                                            >
                                                                {fmtMoney(price, "VND")}
                                                            </span>
                                                        </td>

                                                        <td
                                                            className={ui(
                                                                "px-3 py-3 text-right font-semibold align-top",
                                                                isDiscount && "text-rose-700"
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
                                                                className="text-xs font-medium text-rose-600 hover:underline"
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
                                            <td colSpan={4} className="px-3 py-3 text-right text-sm text-slate-600">
                                                Tổng
                                            </td>
                                            <td className="px-3 py-3 text-right font-bold">
                                                {fmtMoney(total, "VND")}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    <AdminCard
                        title="Thông tin đơn hàng"
                        desc="Ngày tạo, thanh toán, cọc và ghi chú nội bộ."
                        right={
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            <AdminField label="Ngày tạo">
                                <input
                                    type="datetime-local"
                                    className="h-10 w-full rounded-xl border border-slate-300 px-3"
                                    value={isoToLocalInput((form as any).createdAt)}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        set("createdAt" as any, v ? localInputToIso(v) : nowIso());
                                    }}
                                />
                            </AdminField>

                            <AdminField label="Phương thức thanh toán">
                                <select
                                    className="h-10 w-full rounded-xl border border-slate-300 px-3"
                                    value={(form as any).paymentMethod ?? "BANK_TRANSFER"}
                                    onChange={(e) => {
                                        const next = e.target.value as PaymentMethod;
                                        set("paymentMethod" as any, next as any);

                                        if (next !== "COD" && (form as any).reserve?.type === "COD") {
                                            setReserveTouched(true);
                                            set("reserve" as any, null as any);
                                        }
                                    }}
                                >
                                    {PAYMENT_METHODS.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </AdminField>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <CircleDollarSign className="h-4 w-4 text-slate-500" />
                                    <div className="text-sm font-semibold text-slate-800">Tiền cọc / giữ hàng</div>
                                </div>

                                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={Boolean((form as any).reserve)}
                                        onChange={(e) => {
                                            setReserveTouched(true);
                                            if (e.target.checked) {
                                                const suggested =
                                                    (form as any).paymentMethod === "COD"
                                                        ? Math.round(total * 0.1)
                                                        : 0;
                                                set("reserve" as any, {
                                                    type:
                                                        (form as any).paymentMethod === "COD"
                                                            ? "COD"
                                                            : "DEPOSIT",
                                                    amount: suggested,
                                                    expiresAt: null,
                                                } as any);
                                            } else {
                                                set("reserve" as any, null as any);
                                            }
                                        }}
                                    />
                                    Bật cọc / giữ hàng
                                    {(form as any).paymentMethod === "COD" && (
                                        <span className="text-xs text-amber-600">(bắt buộc với COD)</span>
                                    )}
                                </label>

                                {(form as any).reserve && (
                                    <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-3">
                                        <AdminField label="Loại cọc">
                                            <select
                                                className="h-10 w-full rounded-xl border border-slate-300 px-3"
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
                                        </AdminField>

                                        <AdminField
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
                                                className="h-10 w-full rounded-xl border border-slate-300 px-3"
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
                                        </AdminField>

                                        <AdminField
                                            label="Giữ hàng đến"
                                            hint="Hết hạn có thể huỷ đơn nếu chưa thanh toán"
                                        >
                                            <input
                                                type="datetime-local"
                                                value={isoToLocalInput((form as any).reserve.expiresAt)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve" as any, {
                                                        ...(form as any).reserve,
                                                        expiresAt: e.target.value
                                                            ? localInputToIso(e.target.value)
                                                            : null,
                                                    } as any);
                                                }}
                                                className="h-10 w-full rounded-xl border border-slate-300 px-3"
                                                disabled={(form as any).paymentMethod === "COD"}
                                            />
                                        </AdminField>

                                        <div className="text-xs text-slate-500">
                                            Thường dùng cho COD hoặc giữ hàng cho khách.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <AdminField label="Ghi chú">
                                <textarea
                                    className="min-h-[100px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                    value={(form as any).notes ?? ""}
                                    onChange={(e) => set("notes" as any, (e.target.value || null) as any)}
                                    placeholder="Ghi chú nội bộ…"
                                />
                            </AdminField>
                        </div>
                    </AdminCard>

                    <AdminCard title="Tóm tắt đơn" desc="Đối chiếu nhanh trước khi lưu.">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="text-sm text-slate-600">Số item</span>
                                <span className="font-semibold text-slate-900">{items.length}</span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="text-sm text-slate-600">Tổng tiền</span>
                                <span className="font-semibold text-slate-900">{fmtMoney(total, "VND")}</span>
                            </div>

                            {(form as any).reserve && (
                                <>
                                    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                        <span className="text-sm text-amber-800">Đã cọc</span>
                                        <span className="font-semibold text-amber-800">
                                            − {fmtMoney(depositAmount, "VND")}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                                        <span className="text-sm text-rose-700">Còn phải thu</span>
                                        <span className="font-semibold text-rose-700">
                                            {fmtMoney(remainingAmount, "VND")}
                                        </span>
                                    </div>

                                    {(form as any).reserve.expiresAt && (
                                        <div className="text-xs text-slate-500">
                                            Giữ hàng đến:{" "}
                                            {new Date((form as any).reserve.expiresAt).toLocaleString("vi-VN")}
                                        </div>
                                    )}
                                </>
                            )}

                            {!(form as any).reserve && (
                                <div className="pt-2 text-xs text-slate-500">
                                    RefNo / Shipment / ServiceRequest sẽ sinh khi Admin duyệt POST.
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    {errMsg ? <SectionNote tone="red">{errMsg}</SectionNote> : null}
                </div>
            </div>

            <AdminStickySubmit
                saving={saving}
                submitLabel={props.mode === "create" ? "Tạo Draft" : "Lưu thay đổi"}
                onCancelHref={computedBackHref}
                total={
                    <div>
                        <div className="text-xs text-slate-500">Tổng đơn</div>
                        <div className="text-base font-semibold text-slate-900">{fmtMoney(total, "VND")}</div>
                    </div>
                }
            />

            {/* Create success modal */}
            {props.mode === "create" && showSuccessModal && (
                <Modal title="Tạo đơn thành công 🎉">
                    <p className="text-sm text-slate-600">
                        Bạn muốn tiếp tục tạo đơn mới hay quay lại danh sách đơn hàng?
                    </p>

                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                            onClick={() => {
                                setShowSuccessModal(false);
                                if (createdOrderId) router.push(`/admin/orders/${createdOrderId}`);
                                else router.push("/admin/orders");
                            }}
                        >
                            Xem chi tiết
                        </button>

                        <button
                            type="button"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                            onClick={() => {
                                setShowSuccessModal(false);
                                resetFormForNewOrder();
                            }}
                        >
                            Tạo đơn mới
                        </button>
                    </div>
                </Modal>
            )}

            {/* Edit confirm */}
            {showPostConfirm && props.mode === "edit" && (
                <Modal title="Xác nhận lưu thay đổi">
                    <p className="text-sm text-slate-600">
                        Bạn muốn <b>lưu thay đổi</b> cho đơn hàng này.
                        <br />
                        Nếu chọn <b>Duyệt (POST) luôn</b> thì đơn chuyển sang <b>POSTED</b> và hệ thống tạo các bản ghi
                        liên quan.
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                                id="postAfterSave"
                                type="checkbox"
                                checked={postAfterSave}
                                onChange={(e) => setPostAfterSave(e.target.checked)}
                            />
                            Duyệt (POST) luôn sau khi lưu
                        </label>
                    </div>

                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
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
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
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
                </Modal>
            )}
        </form>
    );
}