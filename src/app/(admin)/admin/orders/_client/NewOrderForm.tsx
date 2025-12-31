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
    shipPhone: string;
    city?: string | null;
    district?: string | null;
    ward?: string | null;
    address?: string | null;
};

type ServiceCatalog = {
    id: string;
    code?: string | null;
    name: string;
    defaultPrice?: number | null;
    isActive?: boolean;
};

type OrderLine = {
    id: string;
    kind: "PRODUCT" | "SERVICE";

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
    customers: Customer[];
    // nếu bạn đã có list service catalog từ server thì truyền vào cho đẹp
    services?: ServiceCatalog[];
};

const PAYMENT_METHODS = ["COD", "BANK_TRANSFER", "CARD"] as const;

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
export default function NewOrderFormOptimized({ customers, services = [] }: Props) {
    const router = useRouter();

    /** --------------------------
     * Form State
     * -------------------------- */
    const [activeTab, setActiveTab] = useState<"PRODUCT" | "SERVICE">("PRODUCT");

    const [formData, setFormData] = useState({
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
    const [suggestCustomers, setSuggestCustomers] = useState<Customer[]>([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [lines, setLines] = useState<OrderLine[]>([]);
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    /** --------------------------
     * Derived
     * -------------------------- */
    const total = useMemo(() => {
        return lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.price) || 0), 0);
    }, [lines]);

    const serviceOptions = useMemo(() => {
        return (services || []).filter((s) => s.isActive !== false);
    }, [services]);

    /** --------------------------
     * Auto fill customer by phone
     * -------------------------- */
    useEffect(() => {
        const phone = (formData.shipPhone ?? "").trim();

        if (phone.length < 3) {
            setSuggestCustomers([]);
            return;
        }

        const matches = customers.filter((c) =>
            c.shipPhone?.includes(phone)
        );

        setSuggestCustomers(matches);

        // ✅ Nếu chỉ có 1 khách → auto-fill toàn bộ
        if (matches.length === 1) {
            const c = matches[0];

            setFormData((prev) => ({
                ...prev,
                customerId: c.id,
                customerName: c.name ?? prev.customerName,

                shipCity: c.city ?? prev.shipCity,
                shipDistrict: c.district ?? prev.shipDistrict,
                shipWard: c.ward ?? prev.shipWard,
                shipAddress: c.address ?? prev.shipAddress,
            }));
        }
    }, [formData.shipPhone, customers]);


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
        setFormData((prev) => ({
            ...prev,
            customerId: c.id,
            customerName: c.name,

            shipPhone: c.shipPhone,
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

            setOkMsg("Đã tạo đơn (DRAFT) thành công!");
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
                                        value={formData.shipPhone}
                                        onChange={(e) => {
                                            const v = e.target.value;

                                            setFormData((prev) => ({
                                                ...prev,
                                                shipPhone: v,

                                                // 🔥 QUAN TRỌNG: invalidate khách cũ
                                                customerId: "",
                                                customerName: prev.customerId ? "" : prev.customerName,

                                                shipCity: "",
                                                shipDistrict: "",
                                                shipWard: "",
                                                shipAddress: "",
                                            }));

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
                                                            {c.shipPhone}
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
                            </div>
                        }
                    >
                        {activeTab === "PRODUCT" ? (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    Tìm và thêm sản phẩm vào đơn. (Đồng hồ thường giới hạn số lượng = 1 tuỳ rule của bạn)
                                </div>

                                <ProductSearchInput
                                    value=""
                                    onSelect={(p: any) => {
                                        // p: { id, title, primaryImageUrl, price, type? }
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
                        ) : (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    Thêm dịch vụ (bảo dưỡng, đánh bóng, thay pin…). ServiceRequest sẽ được tạo khi ADMIN duyệt POST.
                                </div>

                                {/* Simple service picker (replace bằng ServiceSearchInput sau) */}
                                <div className="flex flex-wrap gap-2 items-end">
                                    <div className="flex-1 min-w-[240px]">
                                        <Field label="Chọn dịch vụ">
                                            <select
                                                className="h-9 w-full rounded border px-2"
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
                                                defaultValue=""
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

                                    <div className="text-xs text-gray-500 pb-2">
                                        {serviceOptions.length === 0 ? "Chưa có danh sách dịch vụ — bạn có thể truyền props services." : null}
                                    </div>
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
                                            const lineTotal = Number(l.quantity) * Number(l.price);
                                            return (
                                                <tr key={l.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-3 py-2">
                                                        <Badge tone={l.kind === "SERVICE" ? "blue" : "gray"}>{l.kind}</Badge>
                                                    </td>

                                                    <td className="px-3 py-2">
                                                        <div className="font-medium">{l.title}</div>
                                                        <div className="text-[11px] text-gray-500">
                                                            {l.kind === "PRODUCT" ? (
                                                                <>
                                                                    productId: <span className="font-mono">{l.productId}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    serviceCatalogId: <span className="font-mono">{l.serviceCatalogId}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-3 py-2 text-right">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="h-8 w-20 rounded border px-2 text-right"
                                                            value={l.quantity}
                                                            onChange={(e) => updateLine(l.id, { quantity: Math.max(1, Number(e.target.value || 1)) })}
                                                        />
                                                    </td>

                                                    <td className="px-3 py-2 text-right">
                                                        <input
                                                            type="number"
                                                            className="h-8 w-28 rounded border px-2 text-right"
                                                            value={l.price}
                                                            onChange={(e) => updateLine(l.id, { price: Number(e.target.value || 0) })}
                                                        />
                                                    </td>

                                                    <td className="px-3 py-2 text-right font-semibold">{fmtMoney(lineTotal, formData.currency)}</td>

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
                                <span className="font-semibold">{fmtMoney(total, formData.currency)}</span>
                            </div>

                            <div className="pt-2 text-xs text-gray-500">
                                * RefNo/Shipment/ServiceRequest sẽ sinh khi Admin duyệt POST.
                            </div>
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
        </div>
    );
}
