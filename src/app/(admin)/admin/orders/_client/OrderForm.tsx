"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductSearchInput from "../../__components/ProductSearchInput";
import type { OrderDraftForEdit, OrderDraftInput, OrderItemInput } from "../_servers/order.type";
//import { PaymentMethod, ReserveType } from "@prisma/client";

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
    // "2026-01-16T10:30" -> local time -> iso
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
}

function nowIso() {
    return new Date().toISOString();
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
        paymentMethod: d.paymentMethod,
        notes: d.notes ?? null,

        reserve: d.reserve
            ? {
                type: d.reserve.type,
                amount: Number(d.reserve.amount),
                expiresAt: d.reserve.expiresAt ?? null,
            }
            : null,

        items: (d.items || []).map((it) => ({
            id: it.id,
            kind: it.kind as any,
            productId: it.productId ?? null,
            title: it.title,
            quantity: it.quantity,
            unitPrice: Number(it.unitPrice),
            // ✅ unitPrice đang dùng để tính tiền hiện tại 
            variantId: (it as any).variantId ?? null,
            // ✅ listPrice để đồng bộ schema (nếu bạn chỉ có 1 giá thì set bằng unitPrice)
            listPrice: Number((it as any).listPrice ?? (it as any).unitPrice ?? 0),

            // ✅ nếu chưa có logic “agreed” thì default true/false tuỳ bạn
            unitPriceAgreed: Number((it as any).unitPriceAgreed ?? true),

            // ✅ ảnh / meta (nếu chưa dùng thì null)
            img: (it as any).img ?? null,
        })),
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

/** ==============================
 * MAIN
 * ============================== */
export default function OrderFormClient(props: Props) {
    console.log("RENDER props:", props.mode, props.orderId, props.initialData);

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
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
        props.backLabel ??
        (props.mode === "create" ? "← Danh sách" : "← Quay lại chi tiết");

    /** --------------------------
     * Form State
     * -------------------------- */
    type ItemTab = "PRODUCT" | "SERVICE" | "DISCOUNT";
    const [activeTab, setActiveTab] = useState<ItemTab>("PRODUCT");

    const initial = useMemo<OrderDraftInput>(() => {
        if (props.mode === "edit") return toInputFromEdit(props.initialData);
        return emptyDraft();
    }, [props]);

    const [form, setForm] = useState<OrderDraftInput>(() => emptyDraft());

    // ✅ SYNC lại state khi vào edit / initialData đổi
    useEffect(() => {
        if (props.mode === "edit") {
            // debug nhanh: xem có data thật không
            console.log("[OrderForm] initialData:", props.initialData);

            setForm(toInputFromEdit(props.initialData));
        } else {
            setForm(emptyDraft());
        }
    }, [props.mode, props.mode === "edit" ? props.initialData?.id : "create"]);


    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    // create-only modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
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
            next[idx] = { ...next[idx], ...patch };
            return { ...prev, items: next };
        });
    }

    function addItem(item: Omit<OrderItemInput, "id">) {
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { id: uid(), ...item } as any],
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
        return form.items.reduce(
            (s, it) => s + Number(it.quantity || 0) * Number(it.listPrice || 0),
            0
        );
    }, [form.items]);

    const serviceOptions = useMemo(() => {
        return (services || []).filter((s) => s.isActive !== false);
    }, [services]);

    const depositAmount = useMemo(() => {
        return form.reserve ? Number(form.reserve.amount || 0) : 0;
    }, [form.reserve]);

    const remainingAmount = useMemo(() => {
        return Math.max(0, total - depositAmount);
    }, [total, depositAmount]);

    /** --------------------------
     * Reserve UX helpers
     * -------------------------- */
    const [reserveTouched, setReserveTouched] = useState(false);

    // COD => auto enable reserve nếu chưa touched + chưa có reserve
    useEffect(() => {
        if (form.paymentMethod !== "COD") return;
        if (reserveTouched) return;

        const deposit = Math.round(total * 0.1);

        set("reserve", {
            type: "COD" as ReserveType,
            amount: deposit,
            expiresAt: null, // COD: không giữ hạn theo UI của bạn
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.paymentMethod, total]);

    /** --------------------------
     * Validate
     * -------------------------- */
    function validate() {
        if (!form.shipPhone?.trim()) return "Vui lòng nhập số điện thoại.";
        if (!form.customerName?.trim()) return "Vui lòng nhập tên khách hàng.";
        if (!form.items.length) return "Vui lòng thêm ít nhất 1 sản phẩm/dịch vụ.";

        if (form.hasShipment) {
            if (!form.shipCity?.trim()) return "Vui lòng nhập Tỉnh/TP.";
            if (!form.shipDistrict?.trim()) return "Vui lòng nhập Quận/Huyện.";
            if (!form.shipAddress?.trim()) return "Vui lòng nhập địa chỉ giao hàng.";
        }

        for (const it of form.items) {
            if (!it.title?.trim()) return "Có dòng item thiếu tiêu đề.";
            if (!it.quantity || it.quantity < 1) return "Số lượng phải >= 1.";
            if (it.listPrice == null || Number.isNaN(Number(it.listPrice))) return "Đơn giá không hợp lệ.";

            if (it.kind === "PRODUCT" && !it.productId) return "Có dòng PRODUCT thiếu productId.";
            // SERVICE/DISCOUNT: backend bạn đang dùng title + unitPrice nên ok
        }

        return null;
    }

    function resetFormForNewOrder() {
        setReserveTouched(false);
        setForm(emptyDraft());
        setActiveTab("PRODUCT");
        setSuggestCustomers([]);
        setShowSuggest(false);
        setErrMsg(null);
    }

    /** --------------------------
     * Submit
     * -------------------------- */
    async function submit() {
        setErrMsg(null);

        const v = validate();
        if (v) {
            setErrMsg(v);
            return;
        }

        setSaving(true);
        try {
            if (props.mode === "create") {
                const res = await fetch("/api/admin/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error(await res.text());

                const data = await res.json();
                setCreatedOrderId(data?.id ?? null);
                setShowSuccessModal(true);
                router.refresh();
                return;
            }

            // edit
            const res = await fetch(`/api/admin/orders/${props.orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(await res.text());

            router.push(`/admin/orders/${props.orderId}`);
            router.refresh();
        } catch (e: any) {
            setErrMsg(e?.message || "Lưu thất bại");
        } finally {
            setSaving(false);
        }
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
                    <Card title="Khách hàng">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Số điện thoại" hint="Nhập số để gợi ý khách hàng cũ">
                                <div className="relative">
                                    <input
                                        className="h-9 w-full rounded border px-3"
                                        value={form.shipPhone ?? ""}
                                        onChange={(e) => {
                                            set("shipPhone", e.target.value);
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
                                    value={form.customerName}
                                    onChange={(e) => set("customerName", e.target.value)}
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
                                    checked={form.hasShipment}
                                    onChange={(e) => set("hasShipment", e.target.checked)}
                                />
                                Có shipment (giao hàng)
                            </label>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Tỉnh / Thành phố">
                                <input
                                    disabled={!form.hasShipment}
                                    className={cls(
                                        "h-9 rounded border px-3",
                                        !form.hasShipment && "bg-gray-50 text-gray-500"
                                    )}
                                    value={form.shipCity ?? ""}
                                    onChange={(e) => set("shipCity", e.target.value)}
                                    placeholder="VD: Hồ Chí Minh"
                                />
                            </Field>

                            <Field label="Quận / Huyện">
                                <input
                                    disabled={!form.hasShipment}
                                    className={cls(
                                        "h-9 rounded border px-3",
                                        !form.hasShipment && "bg-gray-50 text-gray-500"
                                    )}
                                    value={form.shipDistrict ?? ""}
                                    onChange={(e) => set("shipDistrict", e.target.value || null)}
                                    placeholder="VD: Quận 1"
                                />
                            </Field>

                            <Field label="Phường / Xã">
                                <input
                                    disabled={!form.hasShipment}
                                    className={cls(
                                        "h-9 rounded border px-3",
                                        !form.hasShipment && "bg-gray-50 text-gray-500"
                                    )}
                                    value={form.shipWard ?? ""}
                                    onChange={(e) => set("shipWard", e.target.value)}
                                    placeholder="VD: Bến Nghé"
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Địa chỉ chi tiết">
                                <textarea
                                    disabled={!form.hasShipment}
                                    className={cls(
                                        "min-h-[70px] w-full rounded border px-3 py-2",
                                        !form.hasShipment && "bg-gray-50 text-gray-500"
                                    )}
                                    value={form.shipAddress ?? ""}
                                    onChange={(e) => set("shipAddress", e.target.value)}
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
                                        activeTab === "PRODUCT"
                                            ? "bg-black text-white border-black"
                                            : "bg-white hover:bg-gray-50"
                                    )}
                                >
                                    Sản phẩm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("SERVICE")}
                                    className={cls(
                                        "h-8 rounded px-3 text-sm border",
                                        activeTab === "SERVICE"
                                            ? "bg-black text-white border-black"
                                            : "bg-white hover:bg-gray-50"
                                    )}
                                >
                                    Dịch vụ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("DISCOUNT")}
                                    className={cls(
                                        "h-8 rounded px-3 text-sm border",
                                        activeTab === "DISCOUNT"
                                            ? "bg-black text-white border-black"
                                            : "bg-white hover:bg-gray-50"
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
                                        } as any);
                                    }}
                                />
                            </div>
                        )}

                        {activeTab === "SERVICE" && (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    Thêm dịch vụ. ServiceRequest sẽ được tạo khi ADMIN duyệt POST.
                                </div>

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

                                                    addItem({
                                                        kind: "SERVICE",
                                                        title: s.name,
                                                        productId: null,
                                                        quantity: 1,
                                                        unitPrice: Number(s.defaultPrice ?? 0),
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

                                            const value = Number((e.target as HTMLInputElement).value);
                                            if (!value || value <= 0) return;

                                            addItem({
                                                kind: "DISCOUNT",
                                                title: "Giảm giá",
                                                productId: null,
                                                quantity: 1,
                                                unitPrice: -Math.abs(value),
                                            } as any);

                                            (e.target as HTMLInputElement).value = "";
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
                                        {form.items.map((it, idx) => {
                                            const isDiscount = it.kind === "DISCOUNT";
                                            const lineTotal = Number(it.quantity) * Number(it.listPrice);

                                            return (
                                                <tr
                                                    key={it.id ?? idx}
                                                    className={cls("border-b hover:bg-gray-50", isDiscount && "bg-red-50")}
                                                >
                                                    <td className="px-3 py-2">
                                                        <Badge tone={it.kind === "SERVICE" ? "blue" : it.kind === "DISCOUNT" ? "green" : "gray"}>
                                                            {it.kind}
                                                        </Badge>
                                                    </td>

                                                    <td className="px-3 py-2">
                                                        <input
                                                            className="h-8 w-full rounded border px-2"
                                                            value={it.title}
                                                            onChange={(e) => updateItem(idx, { title: e.target.value })}
                                                        />

                                                        {it.kind === "PRODUCT" && (
                                                            <div className="text-[11px] text-gray-500 mt-1">
                                                                productId: <span className="font-mono">{it.productId}</span>
                                                            </div>
                                                        )}

                                                        {isDiscount && (
                                                            <div className="text-[11px] text-red-600 mt-1">Giảm giá toàn đơn</div>
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-2 text-right">
                                                        {isDiscount ? (
                                                            <span className="text-gray-500">—</span>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                className="h-8 w-20 rounded border px-2 text-right"
                                                                value={it.quantity}
                                                                onChange={(e) =>
                                                                    updateItem(idx, {
                                                                        quantity: Math.max(1, Number(e.target.value || 1)),
                                                                    })
                                                                }
                                                            />
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-2 text-right">
                                                        <input
                                                            type="number"
                                                            className={cls(
                                                                "h-8 w-28 rounded border px-2 text-right",
                                                                isDiscount && "text-red-600"
                                                            )}
                                                            value={it.listPrice}
                                                            onChange={(e) =>
                                                                updateItem(idx, {
                                                                    listPrice: isDiscount
                                                                        ? -Math.abs(Number(e.target.value || 0))
                                                                        : Number(e.target.value || 0),
                                                                })
                                                            }
                                                        />
                                                    </td>

                                                    <td className={cls("px-3 py-2 text-right font-semibold", isDiscount && "text-red-600")}>
                                                        {fmtMoney(lineTotal, "VND")}
                                                    </td>

                                                    <td className="px-3 py-2 text-right">
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
                                    value={isoToLocalInput(form.createdAt)}
                                    onChange={(e) => set("createdAt", localInputToIso(e.target.value))}
                                />
                            </Field>

                            <Field label="Thanh toán">
                                <select
                                    className="h-9 w-full rounded border px-2"
                                    value={form.paymentMethod}
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
                                        disabled={form.paymentMethod === "COD"} // COD bắt buộc theo UX bạn đang muốn
                                        onChange={(e) => {
                                            setReserveTouched(true);
                                            if (!e.target.checked) set("reserve", null);
                                            else
                                                set("reserve", {
                                                    type: "DEPOSIT" as ReserveType,
                                                    amount: 0,
                                                    expiresAt: null,
                                                });
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
                                                value={form.reserve.type}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve", { ...form.reserve!, type: e.target.value as any });
                                                }}
                                            >
                                                <option value="DEPOSIT">DEPOSIT</option>
                                                <option value="COD">COD</option>
                                                <option value="HOLD">HOLD</option>
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
                                                value={Number(form.reserve.amount ?? 0)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve", {
                                                        ...form.reserve!,
                                                        amount: Number(e.target.value || 0),
                                                    });
                                                }}
                                                placeholder="VD: 5000000"
                                            />
                                        </Field>

                                        <Field label="Giữ hàng đến" hint="Hết hạn có thể huỷ đơn nếu chưa thanh toán">
                                            <input
                                                type="datetime-local"
                                                value={isoToLocalInput(form.reserve.expiresAt)}
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    set("reserve", {
                                                        ...form.reserve!,
                                                        expiresAt: e.target.value ? localInputToIso(e.target.value) : null,
                                                    });
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
                                    value={form.notes ?? ""}
                                    onChange={(e) => set("notes", e.target.value || null)}
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

                                    {form.reserve.expiresAt && (
                                        <div className="text-xs text-gray-500">
                                            ⏰ Giữ hàng đến: {new Date(form.reserve.expiresAt).toLocaleString("vi-VN")}
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
                            type="button"
                            onClick={submit}
                            disabled={saving}
                            className="h-9 rounded bg-black px-4 text-white hover:bg-neutral-800 disabled:opacity-60"
                        >
                            {saving
                                ? "Đang lưu…"
                                : props.mode === "create"
                                    ? "Tạo Draft"
                                    : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Create success modal (chỉ show khi create) */}
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
        </div>
    );
}
