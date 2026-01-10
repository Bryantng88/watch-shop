"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductSearchInput from "../../__components/ProductSearchInput";

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

type ReserveType = "NONE" | "COD_DEPOSIT" | "HOLD"



type ServiceCatalog = {
    id: string;
    code?: string | null;
    name: string;
    defaultPrice?: number | null;
    isActive?: boolean;
};

type OrderLine = {
    id: string;
    kind: "PRODUCT" | "SERVICE" | "DISCOUNT"

    // PRODUCT
    productId?: string;
    variantId?: string;
    primaryImageUrl?: string | null;

    // SERVICE
    serviceCatalogId?: string;

    title: string;
    quantity: number;
    price: number;
};

type Props = {

    // nếu bạn đã có list service catalog từ server thì truyền vào cho đẹp
    services?: ServiceCatalog[];
};

const PAYMENT_METHODS = ["BANK_TRANSFER", "COD", "CARD"] as const;

/** ==============================
 * Helpers
 * ============================== */
function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + (cur ? ` ${cur}` : "");
}

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function uid() {
    // crypto.randomUUID() ok trên modern browsers
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(16).slice(2);
}

/** ==============================
 * UI atoms
 * ============================== */
function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
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

function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "blue" | "green" }) {
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
export default function NewOrderFormOptimized({ services = [] }: Props) {
    const router = useRouter();

    /** --------------------------
     * Form State
     * -------------------------- */
    type ItemTab = "PRODUCT" | "SERVICE" | "DISCOUNT";

    const [activeTab, setActiveTab] =
        useState<ItemTab>("PRODUCT");

    const [formData, setFormData] = useState({
        shipPhone: "",
        customerId: "",
        customerName: "",

        shipCity: "",
        shipDistrict: "",
        shipWard: "",
        shipAddress: "",

        paymentMethod: "BANK_TRANSFER",
        notes: "",
        orderDate: new Date().toISOString().slice(0, 16),
        currency: "VND",
    });
    const [suggestCustomers, setSuggestCustomers] = useState<Customer[]>([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [lines, setLines] = useState<OrderLine[]>([]);
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
    const [reserve, setReserve] = useState<{
        enabled: boolean;
        amount: number;
        expiresAt: string;
    }>({
        enabled: false,
        amount: 0,
        expiresAt: "",
    });

    /** --------------------------
     * Derived
     * -------------------------- */
    const total = useMemo(() => {
        return lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.price) || 0), 0);
    }, [lines]);

    const serviceOptions = useMemo(() => {
        return (services || []).filter((s) => s.isActive !== false);
    }, [services]);
    const depositAmount = reserve.enabled ? Number(reserve.amount || 0) : 0;

    const remainingAmount = useMemo(() => {
        return Math.max(0, total - depositAmount);
    }, [total, depositAmount]);
    const [autoDepositApplied, setAutoDepositApplied] = useState(false);
    const [reserveTouched, setReserveTouched] = useState(false);

    /** --------------------------
     * Auto fill customer by phone
     * -------------------------- */
    function useDebounce<T>(value: T, delay = 300) {
        const [debounced, setDebounced] = useState(value);

        useEffect(() => {
            const t = setTimeout(() => setDebounced(value), delay);
            return () => clearTimeout(t);
        }, [value, delay]);

        return debounced;
    }
    const debouncedPhone = useDebounce(formData.shipPhone, 300);
    useEffect(() => {
        if (formData.paymentMethod !== "COD") return;

        // nếu user đã chỉnh tay → không auto nữa
        if (reserveTouched) return;

        const deposit = Math.round(total * 0.1);

        setReserve({
            enabled: true,
            amount: deposit,
            expiresAt: reserve.expiresAt || "", // giữ nguyên nếu có
        });
    }, [formData.paymentMethod, total]);

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
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                if (!aborted) {
                    setSuggestCustomers(Array.isArray(data) ? data : []);
                }
            })
            .catch(() => {
                if (!aborted) setSuggestCustomers([]);
            })
            .finally(() => {
                if (!aborted) setLoadingSuggest(false);
            });

        return () => {
            aborted = true; // 🚫 cancel response cũ
        };
    }, [debouncedPhone]);

    /** --------------------------
     * Handlers
     * -------------------------- */
    function set<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    function addLine(line: Omit<OrderLine, "id">) {
        setLines((prev) => [...prev, { id: uid(), ...line }]);
    }

    function updateLine(id: string, patch: Partial<OrderLine>) {
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    }

    function removeLine(id: string) {
        setLines((prev) => prev.filter((l) => l.id !== id));
    }

    function clearMessages() {
        setErrMsg(null);
        setOkMsg(null);
    }
    function applyCustomer(c: Customer) {
        setSelectedCustomerId(c.id);
        setFormData((prev) => ({
            ...prev,
            customerId: c.id,
            customerName: c.name,

            shipPhone: c.phone,
            shipCity: c.city ?? "",
            shipDistrict: c.district ?? "",
            shipWard: c.ward ?? "",
            shipAddress: c.address ?? "",
        }));

        setSuggestCustomers([]);
        setShowSuggest(false);

    }
    /** --------------------------
     * Validate minimal
     * -------------------------- */
    function validate() {
        if (!formData.shipPhone.trim()) return "Vui lòng nhập số điện thoại.";
        if (!formData.customerName.trim()) return "Vui lòng nhập tên khách hàng.";
        if (lines.length === 0) return "Vui lòng thêm ít nhất 1 sản phẩm/dịch vụ.";
        for (const l of lines) {
            if (!l.title) return "Có dòng item thiếu tiêu đề.";
            if (!l.quantity || l.quantity < 1) return "Số lượng phải >= 1.";
            if (l.price == null || Number.isNaN(Number(l.price))) return "Đơn giá không hợp lệ.";
            if (l.kind === "PRODUCT" && !l.productId) return "Có dòng PRODUCT thiếu productId.";
            if (l.kind === "SERVICE" && !l.serviceCatalogId) return "Có dòng SERVICE thiếu serviceCatalogId.";
        }
        return null;
    }
    function resetFormForNewOrder() {
        setFormData({
            shipPhone: "",
            customerId: "",
            customerName: "",
            shipCity: "",
            shipDistrict: "",
            shipWard: "",
            shipAddress: "",
            paymentMethod: "COD",
            notes: "",
            orderDate: new Date().toISOString().slice(0, 16),
            currency: "VND",
        });

        setLines([]);
        setSelectedCustomerId(null);
        setSuggestCustomers([]);
        setShowSuggest(false);
        setErrMsg(null);
        setOkMsg(null);
    }
    function plusDaysISO(days: number) {
        const d = new Date();
        d.setDate(d.getDate() + days);

        // format yyyy-MM-ddTHH:mm cho input datetime-local
        return d.toISOString().slice(0, 16);
    }
    useEffect(() => {
        if (formData.paymentMethod !== "COD") return;

        if (reserveTouched) return;

        const deposit = Math.round(total * 0.1);

        setReserve({
            enabled: true,
            amount: deposit,
            expiresAt: "", // 🚫 COD KHÔNG GIỮ HÀNG
        });
    }, [formData.paymentMethod, total]);

    useEffect(() => {
        if (formData.paymentMethod === "COD") return;

        if (!reserve.enabled) return;
        if (reserveTouched) return;

        setReserve((prev) => ({
            ...prev,
            expiresAt: prev.expiresAt || plusDaysISO(7),
        }));
    }, [formData.paymentMethod, reserve.enabled]);


    useEffect(() => {
        setReserveTouched(false);

        if (formData.paymentMethod === "COD") {
            setReserve((prev) => ({
                ...prev,
                expiresAt: "",
            }));
        }
    }, [formData.paymentMethod]);


    /** --------------------------
     * Submit
     * - mode: "DRAFT" (tạo/sửa draft)
     * - duyệt POSTED sẽ làm ở màn khác + require admin
     * -------------------------- */
    async function submit(mode: "DRAFT" = "DRAFT") {
        clearMessages();
        const v = validate();
        if (v) {
            setErrMsg(v);
            return;
        }

        setSaving(true);
        try {
            const payload = {
                mode, // backend bạn có thể dùng để set status
                shipPhone: formData.shipPhone.trim(),
                customerId: formData.customerId || null,
                customerName: formData.customerName.trim(),

                shipCity: formData.shipCity || null,
                shipDistrict: formData.shipDistrict || null,
                shipWard: formData.shipWard || null,
                shipAddress: formData.shipAddress || null,

                paymentMethod: formData.paymentMethod,
                notes: formData.notes || null,
                currency: formData.currency,
                orderDate: new Date(formData.orderDate),
                reserve: reserve.enabled
                    ? {
                        type:
                            formData.paymentMethod === "COD"
                                ? "COD"
                                : "DEPOSIT",
                        amount: Number(reserve.amount || 0),
                        expiresAt:
                            formData.paymentMethod === "COD"
                                ? null
                                : reserve.expiresAt
                                    ? new Date(reserve.expiresAt)
                                    : null,
                    }
                    : {
                        type: "NONE",
                        amount: 0,
                        expiresAt: null,
                    },
                items: lines.map((l) => ({
                    kind: l.kind,
                    title: l.title,
                    quantity: l.quantity,
                    price: l.price,

                    productId: l.kind === "PRODUCT" ? l.productId : null,
                    variantId: l.kind === "PRODUCT" ? l.variantId ?? null : null,

                    serviceCatalogId: l.kind === "SERVICE" ? l.serviceCatalogId : null,
                })),
            };

            const res = await fetch("/api/admin/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || "Tạo đơn thất bại");
            }
            const data = await res.json(); // nên trả orderLite { id, refNo? }

            setCreatedOrderId(data?.id ?? null);
            setShowSuccessModal(true);
            // reset items nếu muốn
            // setLines([]);
            // router.push("/admin/orders"); router.refresh();
            router.refresh();
        } catch (e: any) {
            setErrMsg(e?.message || "Lỗi không xác định");
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
                    <h1 className="text-xl font-semibold">Tạo đơn hàng</h1>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <Badge>Draft</Badge>
                        <span>Đơn nháp — chỉ khi ADMIN duyệt mới sinh RefNo + Shipment/ServiceRequest.</span>
                    </div>
                </div>

                <Link href="/admin/orders" className="rounded-md border px-3 py-2 hover:bg-gray-50">
                    ← Danh sách
                </Link>
            </div>

            {/* Grid: left (customer + shipping) / right (payment + notes) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: customer + shipping */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Khách hàng">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Số điện thoại" hint="Nhập số để gợi ý khách hàng cũ">
                                <div className="relative">
                                    <input
                                        className="h-9 w-full rounded border px-3"
                                        value={formData.shipPhone ?? ""}
                                        onChange={(e) => {
                                            const v = e.target.value;

                                            setFormData((prev) => ({
                                                ...prev,
                                                shipPhone: v,
                                            }));

                                            // ⚠️ chỉ reset nếu đang có customer được chọn
                                            if (selectedCustomerId) {
                                                setSelectedCustomerId(null);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    customerId: "",
                                                    customerName: "",
                                                    shipCity: "",
                                                    shipDistrict: "",
                                                    shipWard: "",
                                                    shipAddress: "",
                                                }));
                                            }

                                            setShowSuggest(true);

                                        }}

                                        placeholder="VD: 0909xxxxxx"
                                        onBlur={() => {
                                            // delay để click được item
                                            setTimeout(() => setShowSuggest(false), 150);
                                        }}
                                        onFocus={() => {
                                            if (suggestCustomers.length > 0) setShowSuggest(true);
                                        }}
                                    />

                                    {/* SUGGEST BOX */}
                                    {showSuggest && (loadingSuggest || suggestCustomers.length > 0) && (
                                        <div className="absolute z-30 mt-1 w-full rounded-md border bg-white shadow-lg max-h-64 overflow-auto">
                                            {loadingSuggest && (
                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                    Đang tìm…
                                                </div>
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
                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                    Không tìm thấy khách cũ
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Field>


                            <Field label="Tên khách hàng" hint="Nếu khách mới, bạn nhập tên vào đây">
                                <input
                                    className="h-9 rounded border px-3"
                                    value={formData.customerName}
                                    onChange={(e) => set("customerName", e.target.value)}
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </Field>
                        </div>
                        {formData.customerId ? (
                            <div className="mt-2">
                                <Badge tone="green">Khách hàng cũ</Badge>
                                <span className="ml-2 text-xs text-gray-500">
                                    ID: <span className="font-mono">{formData.customerId}</span>
                                </span>
                            </div>
                        ) : (
                            <div className="mt-2">
                                <Badge>Khách mới</Badge>
                            </div>
                        )}
                    </Card>

                    <Card title="Giao hàng">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Tỉnh / Thành phố">
                                <input
                                    className="h-9 rounded border px-3"
                                    value={formData.shipCity}
                                    onChange={(e) => set("shipCity", e.target.value)}
                                    placeholder="VD: Hồ Chí Minh"
                                />
                            </Field>

                            <Field label="Quận / Huyện">
                                <input
                                    className="h-9 rounded border px-3"
                                    value={formData.shipDistrict}
                                    onChange={(e) => set("shipDistrict", e.target.value)}
                                    placeholder="VD: Quận 1"
                                />
                            </Field>

                            <Field label="Phường / Xã">
                                <input
                                    className="h-9 rounded border px-3"
                                    value={formData.shipWard}
                                    onChange={(e) => set("shipWard", e.target.value)}
                                    placeholder="VD: Bến Nghé"
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Địa chỉ chi tiết">
                                <textarea
                                    className="min-h-[70px] w-full rounded border px-3 py-2"
                                    value={formData.shipAddress}
                                    onChange={(e) => set("shipAddress", e.target.value)}
                                    placeholder="Số nhà, tên đường, ghi chú giao hàng…"
                                />
                            </Field>
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
                                <div className="text-sm text-gray-600">
                                    Tìm và thêm sản phẩm vào đơn. (Đồng hồ thường giới hạn số lượng = 1 tuỳ rule của bạn)
                                </div>

                                <ProductSearchInput
                                    value=""
                                    onSelect={(p: any) => {
                                        addLine({
                                            kind: "PRODUCT",
                                            productId: p.id,
                                            title: p.title,
                                            primaryImageUrl: p.primaryImageUrl ?? null,
                                            quantity: 1,
                                            price: Number(p.price ?? 0),
                                        });
                                    }}
                                />
                            </div>
                        )}

                        {activeTab === "SERVICE" && (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    Thêm dịch vụ (bảo dưỡng, đánh bóng, thay pin…). ServiceRequest sẽ được tạo khi ADMIN duyệt POST.
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

                                                    addLine({
                                                        kind: "SERVICE",
                                                        serviceCatalogId: s.id,
                                                        title: s.name,
                                                        quantity: 1,
                                                        price: Number(s.defaultPrice ?? 0),
                                                    });

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

                                            addLine({
                                                kind: "DISCOUNT",
                                                title: "Giảm giá",
                                                quantity: 1,
                                                price: -Math.abs(value), // 🔥 luôn âm
                                            });

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
                        {lines.length > 0 ? (
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
                                        {lines.map((l) => {
                                            const isDiscount = l.kind === "DISCOUNT";
                                            const lineTotal = Number(l.quantity) * Number(l.price);

                                            return (
                                                <tr
                                                    key={l.id}
                                                    className={cls(
                                                        "border-b hover:bg-gray-50",
                                                        isDiscount && "bg-red-50"
                                                    )}
                                                >
                                                    {/* KIND */}
                                                    <td className="px-3 py-2">
                                                        <Badge
                                                            tone={
                                                                l.kind === "SERVICE"
                                                                    ? "blue"
                                                                    : l.kind === "DISCOUNT"
                                                                        ? "green"
                                                                        : "gray"
                                                            }
                                                        >
                                                            {l.kind}
                                                        </Badge>
                                                    </td>

                                                    {/* TITLE */}
                                                    <td className="px-3 py-2">
                                                        <div className="font-medium">{l.title}</div>

                                                        {!isDiscount && (
                                                            <div className="text-[11px] text-gray-500">
                                                                {l.kind === "PRODUCT" ? (
                                                                    <>
                                                                        productId:{" "}
                                                                        <span className="font-mono">{l.productId}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        serviceCatalogId:{" "}
                                                                        <span className="font-mono">
                                                                            {l.serviceCatalogId}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}

                                                        {isDiscount && (
                                                            <div className="text-[11px] text-red-600">
                                                                Giảm giá toàn đơn
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* QUANTITY */}
                                                    <td className="px-3 py-2 text-right">
                                                        {isDiscount ? (
                                                            <span className="text-gray-500">—</span>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                className="h-8 w-20 rounded border px-2 text-right"
                                                                value={l.quantity}
                                                                onChange={(e) =>
                                                                    updateLine(l.id, {
                                                                        quantity: Math.max(
                                                                            1,
                                                                            Number(e.target.value || 1)
                                                                        ),
                                                                    })
                                                                }
                                                            />
                                                        )}
                                                    </td>

                                                    {/* PRICE */}
                                                    <td className="px-3 py-2 text-right">
                                                        <input
                                                            type="number"
                                                            className={cls(
                                                                "h-8 w-28 rounded border px-2 text-right",
                                                                isDiscount && "text-red-600"
                                                            )}
                                                            value={l.price}
                                                            onChange={(e) =>
                                                                updateLine(l.id, {
                                                                    price: isDiscount
                                                                        ? -Math.abs(Number(e.target.value || 0))
                                                                        : Number(e.target.value || 0),
                                                                })
                                                            }
                                                        />
                                                    </td>

                                                    {/* SUBTOTAL */}
                                                    <td
                                                        className={cls(
                                                            "px-3 py-2 text-right font-semibold",
                                                            isDiscount && "text-red-600"
                                                        )}
                                                    >
                                                        {fmtMoney(lineTotal, formData.currency)}
                                                    </td>

                                                    {/* REMOVE */}
                                                    <td className="px-3 py-2 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLine(l.id)}
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
                                            <td className="px-3 py-3 text-right font-bold">{fmtMoney(total, formData.currency)}</td>
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

                {/* Right: order meta */}
                <div className="space-y-6">
                    <Card title="Thông tin đơn hàng">
                        <div className="space-y-4">
                            <Field label="Ngày tạo">
                                <input
                                    type="datetime-local"
                                    className="h-9 w-full rounded border px-3"
                                    value={formData.orderDate}
                                    onChange={(e) => set("orderDate", e.target.value)}
                                />
                            </Field>

                            <Field label="Thanh toán">
                                <select
                                    className="h-9 w-full rounded border px-2"
                                    value={formData.paymentMethod}
                                    onChange={(e) => set("paymentMethod", e.target.value as any)}
                                >
                                    {PAYMENT_METHODS.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            {/* RESERVE / DEPOSIT */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={reserve.enabled}
                                        disabled={formData.paymentMethod === "COD"}
                                        onChange={(e) =>
                                            setReserve((prev) => ({
                                                ...prev,
                                                enabled: e.target.checked,
                                            }))
                                        }
                                    />
                                    <span className="font-medium">
                                        Đặt cọc giữ hàng
                                        {formData.paymentMethod === "COD" && (
                                            <span className="ml-1 text-xs text-orange-600">
                                                (bắt buộc với COD)
                                            </span>
                                        )}
                                    </span>
                                </label>


                                {reserve.enabled && (
                                    <div className="space-y-3 rounded-md border bg-gray-50 p-3">
                                        <Field
                                            label="Số tiền cọc"

                                            hint={
                                                formData.paymentMethod === "COD"
                                                    ? "Mặc định 10% giá trị đơn, có thể chỉnh sửa"
                                                    : "Khách trả trước để giữ hàng"
                                            }
                                        >
                                            <input
                                                type="number"
                                                min={0}
                                                className="h-9 w-full rounded border px-3"
                                                value={reserve.amount || ""}
                                                onChange={(e) =>
                                                    setReserve((prev) => ({
                                                        ...prev,
                                                        amount: Number(e.target.value || 0),
                                                    }))
                                                }
                                                placeholder="VD: 5000000"
                                            />
                                        </Field>

                                        <Field
                                            label="Giữ hàng đến"
                                            hint="Hết hạn có thể huỷ đơn nếu chưa thanh toán"
                                        >
                                            <input
                                                type="number"
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    setReserve((prev) => ({
                                                        ...prev,
                                                        amount: Number(e.target.value || 0),
                                                    }));
                                                }}
                                            />

                                            <input
                                                type="datetime-local"
                                                onChange={(e) => {
                                                    setReserveTouched(true);
                                                    setReserve((prev) => ({
                                                        ...prev,
                                                        expiresAt: e.target.value,
                                                    }));
                                                }}
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
                                    value={formData.notes}
                                    onChange={(e) => set("notes", e.target.value)}
                                    placeholder="Ghi chú nội bộ…"
                                />
                            </Field>
                        </div>
                    </Card>
                    <Card title="Tóm tắt">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số item</span>
                                <span className="font-medium">{lines.length}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Tổng tiền</span>
                                <span className="font-semibold">
                                    {fmtMoney(total, formData.currency)}
                                </span>
                            </div>

                            {/* DEPOSIT */}
                            {reserve.enabled && (
                                <>
                                    <div className="flex justify-between text-amber-700">
                                        <span>Đã cọc</span>
                                        <span className="font-medium">
                                            − {fmtMoney(depositAmount, formData.currency)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-semibold text-red-700 border-t pt-2">
                                        <span>Còn phải thu</span>
                                        <span>
                                            {fmtMoney(remainingAmount, formData.currency)}
                                        </span>
                                    </div>

                                    {reserve.expiresAt && (
                                        <div className="text-xs text-gray-500">
                                            ⏰ Giữ hàng đến:{" "}
                                            {new Date(reserve.expiresAt).toLocaleString("vi-VN")}
                                        </div>
                                    )}
                                </>
                            )}

                            {!reserve.enabled && (
                                <div className="pt-2 text-xs text-gray-500">
                                    * RefNo / Shipment / ServiceRequest sẽ sinh khi Admin duyệt POST.
                                </div>
                            )}
                        </div>
                    </Card>


                    {errMsg ? <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errMsg}</div> : null}
                    {okMsg ? <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{okMsg}</div> : null}
                </div>


            </div>

            {/* Sticky footer actions */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="text-sm">
                        <span className="text-gray-600">Tổng:</span>{" "}
                        <span className="font-semibold">{fmtMoney(total, formData.currency)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => history.back()}
                            className="h-9 rounded border px-4 hover:bg-gray-50"
                            disabled={saving}
                        >
                            Hủy
                        </button>

                        <button
                            type="button"
                            onClick={() => submit("DRAFT")}
                            disabled={saving}
                            className="h-9 rounded border px-4 hover:bg-gray-50"
                        >
                            {saving ? "Đang lưu…" : "Lưu draft"}
                        </button>

                        <button
                            type="button"
                            onClick={() => submit("DRAFT")}
                            disabled={saving}
                            className="h-9 rounded bg-black px-4 text-white hover:bg-neutral-800"
                        >
                            {saving ? "Đang tạo…" : "Tạo đơn"}
                        </button>
                    </div>
                </div>
            </div>
            {showSuccessModal && (
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
                                    router.push("/admin/orders");
                                }}
                            >
                                Về danh sách
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
