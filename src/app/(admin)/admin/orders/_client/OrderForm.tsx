"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(v?: string | null) {
    if (!v) return nowIso();
    const [datePart, timePart] = v.split("T");
    if (!datePart || !timePart) return nowIso();

    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm] = timePart.split(":").map(Number);

    if ([y, m, d, hh, mm].some((x) => !Number.isFinite(x))) return nowIso();

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

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <div className="mt-3">{children}</div>
            </div>
        </div>
    );
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

function InlineCheckbox({
    checked,
    label,
    onChange,
}: {
    checked: boolean;
    label: string;
    onChange: (next: boolean) => void;
}) {
    return (
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            {label}
        </label>
    );
}

function BlockIcon({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "sky" | "emerald" | "amber" }) {
    const cls =
        tone === "sky"
            ? "border-sky-200 bg-sky-50 text-sky-700"
            : tone === "emerald"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : tone === "amber"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-slate-50 text-slate-700";

    return <div className={ui("flex h-10 w-10 items-center justify-center rounded-xl border", cls)}>{children}</div>;
}

function PreviewImage({ src, alt }: { src?: string | null; alt: string }) {
    if (!src) {
        return (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                <Package className="h-5 w-5" />
            </div>
        );
    }

    const signed = src.startsWith("http")
        ? src
        : `/api/media/sign?key=${encodeURIComponent(src)}&purpose=inline`;

    return (
        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <Image src={signed} alt={alt} fill className="object-cover" sizes="64px" />
        </div>
    );
}

function ProductLineCard({
    item,
    onUpdate,
    onRemove,
}: {
    item: any;
    onUpdate: (patch: Partial<OrderItemInput>) => void;
    onRemove: () => void;
}) {
    const lineTotal = Number(item.quantity ?? 1) * Number(item.listPrice ?? 0);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                    <PreviewImage src={item.img} alt={item.title} />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <ToneBadge>Sản phẩm</ToneBadge>
                            <div className="truncate text-base font-semibold text-slate-900">{item.title || "Sản phẩm chưa đặt tên"}</div>
                        </div>

                        {item.productId ? (
                            <div className="mt-1 text-xs text-slate-500">productId: {item.productId}</div>
                        ) : null}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRemove}
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
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-right"
                        value={Number(item.quantity ?? 1)}
                        onChange={(e) =>
                            onUpdate({
                                quantity: Math.max(1, Number(e.target.value || 1)),
                            } as any)
                        }
                    />
                </AdminField>

                <AdminField label="Đơn giá">
                    <input
                        type="number"
                        min={0}
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-right"
                        value={Number(item.listPrice ?? 0)}
                        onChange={(e) => onUpdate({ listPrice: Number(e.target.value || 0) } as any)}
                    />
                </AdminField>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Thành tiền</div>
                    <div className="mt-1 text-base font-semibold text-slate-900">{fmtMoney(lineTotal, "VND")}</div>
                </div>
            </div>
        </div>
    );
}

function ServiceLineCard({
    item,
    productItems,
    serviceOptions,
    onUpdate,
    onRemove,
}: {
    item: any;
    productItems: any[];
    serviceOptions: ServiceCatalog[];
    onUpdate: (patch: Partial<OrderItemInput>) => void;
    onRemove: () => void;
}) {
    return (
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                    <BlockIcon tone="sky">
                        <Wrench className="h-5 w-5" />
                    </BlockIcon>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <ToneBadge tone="blue">Dịch vụ</ToneBadge>
                            <div className="font-semibold text-slate-900">{item.title || "Dịch vụ chưa chọn"}</div>
                        </div>
                        <div className="mt-1 text-sm text-slate-500">Áp cho sản phẩm trong đơn hoặc nhận đồ khách mang tới.</div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                    <X className="h-4 w-4" />
                    Xóa
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <AdminField label="Danh mục dịch vụ">
                    <select
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3"
                        value={item.serviceCatalogId ?? ""}
                        onChange={(e) => {
                            const picked = serviceOptions.find((s) => s.id === e.target.value);
                            onUpdate({
                                serviceCatalogId: e.target.value || null,
                                title: picked?.name ?? "",
                                listPrice: Number(picked?.defaultPrice ?? item.listPrice ?? 0),
                            } as any);
                        }}
                    >
                        <option value="">Chọn dịch vụ</option>
                        {serviceOptions.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.code ? `${s.code} • ` : ""}
                                {s.name}
                            </option>
                        ))}
                    </select>
                </AdminField>

                <AdminField label="Phạm vi áp dụng">
                    <select
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3"
                        value={item.serviceScope ?? "WITH_PURCHASE"}
                        onChange={(e) =>
                            onUpdate({
                                serviceScope: e.target.value as ServiceScope,
                                linkedOrderItemId: e.target.value === "WITH_PURCHASE" ? item.linkedOrderItemId ?? null : null,
                                customerItemNote: e.target.value === "CUSTOMER_OWNED" ? item.customerItemNote ?? "" : null,
                            } as any)
                        }
                    >
                        <option value="WITH_PURCHASE">Đi kèm sản phẩm bán</option>
                        <option value="CUSTOMER_OWNED">Đồ khách mang tới</option>
                    </select>
                </AdminField>

                <AdminField label="Đơn giá">
                    <input
                        type="number"
                        min={0}
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-right"
                        value={Number(item.listPrice ?? 0)}
                        onChange={(e) => onUpdate({ listPrice: Number(e.target.value || 0) } as any)}
                    />
                </AdminField>

                {item.serviceScope === "WITH_PURCHASE" ? (
                    <AdminField label="Áp cho sản phẩm nào">
                        <select
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3"
                            value={item.linkedOrderItemId ?? ""}
                            onChange={(e) => onUpdate({ linkedOrderItemId: e.target.value || null } as any)}
                        >
                            <option value="">Chọn sản phẩm</option>
                            {productItems.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    </AdminField>
                ) : (
                    <AdminField label="Mô tả món khách mang tới" hint="Ví dụ: thay pin cho đồng hồ Tissot mặt trắng">
                        <input
                            className="h-11 w-full rounded-xl border border-slate-300 px-3"
                            value={item.customerItemNote ?? ""}
                            onChange={(e) => onUpdate({ customerItemNote: e.target.value } as any)}
                            placeholder="Nhập mô tả"
                        />
                    </AdminField>
                )}

                <AdminField label="Số lượng">
                    <input
                        type="number"
                        min={1}
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-right"
                        value={Number(item.quantity ?? 1)}
                        onChange={(e) => onUpdate({ quantity: Math.max(1, Number(e.target.value || 1)) } as any)}
                    />
                </AdminField>
            </div>
        </div>
    );
}

export default function OrderFormClient(props: Props) {
    const router = useRouter();
    const services = props.services ?? [];

    const computedTitle = props.title ?? (props.mode === "create" ? "Tạo đơn hàng" : "Sửa đơn hàng");
    const computedSubtitle =
        props.subtitle ??
        (props.mode === "create"
            ? "Đồng bộ layout với phiếu nhập và trang sản phẩm, ưu tiên rõ ràng khi thao tác nhanh."
            : "Chỉ cho phép sửa khi đơn hàng còn DRAFT/RESERVED.");
    const computedBackHref = props.backHref ?? (props.mode === "create" ? "/admin/orders" : `/admin/orders/${props.orderId}`);
    const computedBackLabel = props.backLabel ?? (props.mode === "create" ? "← Danh sách" : "← Quay lại chi tiết");

    const [form, setForm] = useState<OrderDraftInput>(() => emptyDraft());
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [showPostConfirm, setShowPostConfirm] = useState(false);
    const [postAfterSave, setPostAfterSave] = useState(false);

    const [suggestCustomers, setSuggestCustomers] = useState<Customer[]>([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [reserveTouched, setReserveTouched] = useState(false);
    const [enableService, setEnableService] = useState(false);
    const [enableDiscount, setEnableDiscount] = useState(false);

    useEffect(() => {
        if (props.mode === "edit") setForm(toInputFromEdit(props.initialData));
        else setForm(emptyDraft());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mode, props.mode === "edit" ? (props.initialData as any)?.id : "create"]);

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

    const items = useMemo<any[]>(() => ((form as any).items ?? []) as any[], [form]);
    const productLineItems = useMemo<any[]>(() => items.filter((x) => x.kind === "PRODUCT"), [items]);
    const serviceItems = useMemo<any[]>(() => items.filter((x) => x.kind === "SERVICE"), [items]);
    const discountItem = useMemo<any | null>(() => items.find((x) => x.kind === "DISCOUNT") ?? null, [items]);
    const serviceOptions = useMemo(() => (services || []).filter((s) => s.isActive !== false), [services]);

    const total = useMemo(() => {
        return items.reduce((s, it) => s + Number(it.quantity ?? 0) * Number(it.listPrice ?? 0), 0);
    }, [items]);

    const depositAmount = useMemo(() => ((form as any).reserve ? Number((form as any).reserve.amount || 0) : 0), [form]);
    const remainingAmount = useMemo(() => Math.max(0, total - depositAmount), [total, depositAmount]);

    useEffect(() => {
        if ((form as any).paymentMethod !== "COD") return;
        if (reserveTouched) return;

        set("reserve" as any, {
            type: "COD" as any,
            amount: Math.round(total * 0.1),
            expiresAt: null,
        } as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(form as any).paymentMethod, total]);

    useEffect(() => {
        setEnableService(serviceItems.length > 0);
        setEnableDiscount(Boolean(discountItem));
    }, [serviceItems.length, discountItem]);

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
            if (it.kind !== "DISCOUNT" && (!it.quantity || Number(it.quantity) < 1)) return "Số lượng phải >= 1.";
            if (it.listPrice == null || Number.isNaN(Number(it.listPrice))) return "Đơn giá không hợp lệ.";
            if (it.kind === "PRODUCT" && !it.productId) return "Có dòng PRODUCT thiếu productId.";

            if (it.kind === "SERVICE") {
                if (!it.serviceCatalogId) return "Dòng SERVICE thiếu serviceCatalogId.";
                if (!it.serviceScope) return "Dòng SERVICE thiếu serviceScope.";
                if (it.serviceScope === "WITH_PURCHASE" && !it.linkedOrderItemId) return "SERVICE đi kèm sản phẩm: vui lòng chọn sản phẩm áp cho.";
                if (it.serviceScope === "CUSTOMER_OWNED" && !String(it.customerItemNote ?? "").trim()) return "SERVICE đồ khách mang tới: vui lòng nhập mô tả.";
            }
        }

        return null;
    }

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
                badge={<ToneBadge tone={props.mode === "create" ? "amber" : "blue"}>{props.mode === "create" ? "DRAFT" : "EDIT"}</ToneBadge>}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                    <AdminCard
                        title="Thông tin khách hàng"
                        desc="Bố cục giống phiếu nhập: thông tin chính đặt trước, thao tác nhanh và ít nhiễu thị giác."
                        right={<BlockIcon><Phone className="h-5 w-5" /></BlockIcon>}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <AdminField label="Số điện thoại" hint="Nhập số để gợi ý khách hàng cũ">
                                <div className="relative">
                                    <input
                                        className="h-11 w-full rounded-xl border border-slate-300 px-3"
                                        value={(form as any).shipPhone ?? ""}
                                        onChange={(e) => {
                                            set("shipPhone" as any, e.target.value as any);
                                            setShowSuggest(true);
                                        }}
                                        placeholder="VD: 0909xxxxxx"
                                        onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                                        onFocus={() => suggestCustomers.length > 0 && setShowSuggest(true)}
                                    />

                                    {showSuggest && (loadingSuggest || suggestCustomers.length > 0) && (
                                        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                            {loadingSuggest && <div className="px-3 py-2 text-sm text-slate-500">Đang tìm…</div>}
                                            {!loadingSuggest &&
                                                suggestCustomers.map((c) => (
                                                    <button key={c.id} type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => applyCustomer(c)}>
                                                        <div className="font-medium text-slate-900">{c.name}</div>
                                                        <div className="text-xs text-slate-500">{c.phone}{c.address ? ` • ${c.address}` : ""}</div>
                                                    </button>
                                                ))}
                                            {!loadingSuggest && suggestCustomers.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">Không tìm thấy khách cũ</div>}
                                        </div>
                                    )}
                                </div>
                            </AdminField>

                            <AdminField label="Tên khách hàng">
                                <input
                                    className="h-11 w-full rounded-xl border border-slate-300 px-3"
                                    value={(form as any).customerName ?? ""}
                                    onChange={(e) => set("customerName" as any, e.target.value as any)}
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </AdminField>
                        </div>
                    </AdminCard>

                    <AdminCard
                        title="Giao hàng"
                        desc="Format đồng bộ với phiếu nhập: có trạng thái rõ, input chia cột, nhìn vào là biết đơn pickup hay giao tận nơi."
                        right={<InlineCheckbox checked={Boolean((form as any).hasShipment)} label="Có shipment" onChange={(next) => set("hasShipment" as any, next as any)} />}
                    >
                        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            <BlockIcon><Truck className="h-5 w-5" /></BlockIcon>
                            <div>
                                {Boolean((form as any).hasShipment)
                                    ? "Đơn này có giao hàng, cần nhập đầy đủ địa chỉ."
                                    : "Đơn này là pickup, có thể bỏ qua thông tin địa chỉ."}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <AdminField label="Tỉnh / Thành phố">
                                <input disabled={!Boolean((form as any).hasShipment)} className="h-11 w-full rounded-xl border border-slate-300 px-3 disabled:bg-slate-50" value={(form as any).shipCity ?? ""} onChange={(e) => set("shipCity" as any, e.target.value as any)} />
                            </AdminField>
                            <AdminField label="Quận / Huyện">
                                <input disabled={!Boolean((form as any).hasShipment)} className="h-11 w-full rounded-xl border border-slate-300 px-3 disabled:bg-slate-50" value={(form as any).shipDistrict ?? ""} onChange={(e) => set("shipDistrict" as any, e.target.value as any)} />
                            </AdminField>
                            <AdminField label="Phường / Xã">
                                <input disabled={!Boolean((form as any).hasShipment)} className="h-11 w-full rounded-xl border border-slate-300 px-3 disabled:bg-slate-50" value={(form as any).shipWard ?? ""} onChange={(e) => set("shipWard" as any, e.target.value as any)} />
                            </AdminField>
                        </div>

                        <div className="mt-4">
                            <AdminField label="Địa chỉ chi tiết">
                                <input disabled={!Boolean((form as any).hasShipment)} className="h-11 w-full rounded-xl border border-slate-300 px-3 disabled:bg-slate-50" value={(form as any).shipAddress ?? ""} onChange={(e) => set("shipAddress" as any, e.target.value as any)} />
                            </AdminField>
                        </div>
                    </AdminCard>

                    <AdminCard
                        title="Sản phẩm và dịch vụ"
                        desc="Tách rõ block tìm sản phẩm, dòng sản phẩm, dịch vụ kèm theo và giảm giá như logic phiếu nhập."
                        right={<BlockIcon><ShoppingCart className="h-5 w-5" /></BlockIcon>}
                    >
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Thêm sản phẩm vào đơn</div>
                                        <div className="text-xs text-slate-500">Chọn từ kho hiện có, sẽ tự lấy tên, ảnh và giá bán hiện tại.</div>
                                    </div>
                                    <ToneBadge>{productLineItems.length} sản phẩm</ToneBadge>
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

                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-slate-500" />
                                        <div className="text-sm font-semibold text-slate-800">Dòng sản phẩm trong đơn</div>
                                    </div>
                                    <ToneBadge>{productLineItems.length} dòng</ToneBadge>
                                </div>

                                {productLineItems.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">Chưa có sản phẩm nào trong đơn.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {productLineItems.map((it) => (
                                            <ProductLineCard key={it.id} item={it} onUpdate={(patch) => updateItemById(it.id, patch)} onRemove={() => removeItemById(it.id)} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
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
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm dịch vụ
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (enableDiscount) {
                                            setEnableDiscount(false);
                                            clearDiscount();
                                        } else {
                                            setEnableDiscount(true);
                                            ensureDiscount(Math.abs(Number(discountItem?.listPrice ?? 0)) || 100000);
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <Percent className="h-4 w-4" />
                                    {enableDiscount ? "Bỏ giảm giá" : "Thêm giảm giá"}
                                </button>
                            </div>

                            {enableService && (
                                <div className="space-y-3 rounded-2xl border border-sky-200 bg-sky-50/40 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <BlockIcon tone="sky"><Wrench className="h-5 w-5" /></BlockIcon>
                                            <div>
                                                <div className="font-semibold text-sky-900">Dịch vụ đi kèm</div>
                                                <div className="text-sm text-sky-800/80">Có thể áp cho sản phẩm trong đơn hoặc hàng khách mang tới.</div>
                                            </div>
                                        </div>
                                        <ToneBadge tone="blue">{serviceItems.length} dòng</ToneBadge>
                                    </div>

                                    {serviceItems.map((it) => (
                                        <ServiceLineCard
                                            key={it.id}
                                            item={it}
                                            productItems={productLineItems}
                                            serviceOptions={serviceOptions}
                                            onUpdate={(patch) => updateItemById(it.id, patch)}
                                            onRemove={() => removeItemById(it.id)}
                                        />
                                    ))}
                                </div>
                            )}

                            {enableDiscount && discountItem && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                                    <div className="mb-4 flex items-center gap-3">
                                        <BlockIcon tone="emerald"><Percent className="h-5 w-5" /></BlockIcon>
                                        <div>
                                            <div className="font-semibold text-emerald-900">Giảm giá đơn hàng</div>
                                            <div className="text-sm text-emerald-800/80">Giảm trừ trực tiếp trên tổng đơn.</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <AdminField label="Tiêu đề">
                                            <input className="h-11 w-full rounded-xl border border-slate-300 px-3" value={discountItem.title ?? "Giảm giá"} onChange={(e) => updateItemById(discountItem.id, { title: e.target.value || "Giảm giá" } as any)} />
                                        </AdminField>
                                        <AdminField label="Giá trị giảm">
                                            <input type="number" min={0} className="h-11 w-full rounded-xl border border-slate-300 px-3 text-right" value={Math.abs(Number(discountItem.listPrice ?? 0))} onChange={(e) => ensureDiscount(Number(e.target.value || 0))} />
                                        </AdminField>
                                        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3">
                                            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Tác động lên đơn</div>
                                            <div className="mt-1 text-base font-semibold text-emerald-700">- {fmtMoney(Math.abs(Number(discountItem.listPrice ?? 0)), "VND")}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    <AdminCard
                        title="Thanh toán và giữ hàng"
                        desc="Nhóm logic thanh toán ở một block riêng, tương tự cách phiếu nhập gom giá trị và trạng thái giao dịch."
                        right={<BlockIcon tone="amber"><CircleDollarSign className="h-5 w-5" /></BlockIcon>}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <AdminField label="Ngày tạo đơn">
                                <input type="datetime-local" className="h-11 w-full rounded-xl border border-slate-300 px-3" value={isoToLocalInput((form as any).createdAt)} onChange={(e) => set("createdAt" as any, localInputToIso(e.target.value) as any)} />
                            </AdminField>

                            <AdminField label="Phương thức thanh toán">
                                <select className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3" value={(form as any).paymentMethod ?? "BANK_TRANSFER"} onChange={(e) => set("paymentMethod" as any, e.target.value as any)}>
                                    {PAYMENT_METHODS.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </AdminField>

                            <div className="flex items-end">
                                <InlineCheckbox
                                    checked={Boolean((form as any).reserve)}
                                    label="Có giữ hàng / cọc"
                                    onChange={(next) => {
                                        setReserveTouched(true);
                                        if (!next) {
                                            set("reserve" as any, null as any);
                                            return;
                                        }
                                        set("reserve" as any, {
                                            type: (form as any).paymentMethod === "COD" ? "COD" : "MANUAL",
                                            amount: Math.round(total * ((form as any).paymentMethod === "COD" ? 0.1 : 0.3)),
                                            expiresAt: null,
                                        } as any);
                                    }}
                                />
                            </div>
                        </div>

                        {(form as any).reserve ? (
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <AdminField label="Số tiền cọc" hint={(form as any).paymentMethod === "COD" ? "Mặc định 10% giá trị đơn, có thể chỉnh sửa" : "Khách trả trước để giữ hàng"}>
                                    <input type="number" min={0} className="h-11 w-full rounded-xl border border-slate-300 px-3 text-right" value={Number((form as any).reserve.amount ?? 0)} onChange={(e) => {
                                        setReserveTouched(true);
                                        set("reserve" as any, { ...(form as any).reserve, amount: Number(e.target.value || 0) } as any);
                                    }} />
                                </AdminField>

                                <AdminField label="Giữ hàng đến" hint="Hết hạn có thể huỷ đơn nếu chưa thanh toán">
                                    <input type="datetime-local" disabled={(form as any).paymentMethod === "COD"} className="h-11 w-full rounded-xl border border-slate-300 px-3 disabled:bg-slate-50" value={isoToLocalInput((form as any).reserve.expiresAt)} onChange={(e) => {
                                        setReserveTouched(true);
                                        set("reserve" as any, { ...(form as any).reserve, expiresAt: e.target.value ? localInputToIso(e.target.value) : null } as any);
                                    }} />
                                </AdminField>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                        <div className="text-xs font-medium uppercase tracking-wide text-amber-700">Đã cọc</div>
                                        <div className="mt-1 text-base font-semibold text-amber-800">{fmtMoney(depositAmount, "VND")}</div>
                                    </div>
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                                        <div className="text-xs font-medium uppercase tracking-wide text-rose-700">Còn phải thu</div>
                                        <div className="mt-1 text-base font-semibold text-rose-700">{fmtMoney(remainingAmount, "VND")}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                Chưa bật giữ hàng/cọc. RefNo / Shipment / ServiceRequest sẽ sinh khi Admin duyệt POST.
                            </div>
                        )}

                        <div className="mt-4">
                            <AdminField label="Ghi chú nội bộ">
                                <textarea className="min-h-[110px] w-full rounded-xl border border-slate-300 px-3 py-2" value={(form as any).notes ?? ""} onChange={(e) => set("notes" as any, (e.target.value || null) as any)} placeholder="Ghi chú nội bộ…" />
                            </AdminField>
                        </div>
                    </AdminCard>

                    {errMsg ? <SectionNote tone="red">{errMsg}</SectionNote> : null}
                </div>

                <div className="space-y-6">
                    <AdminCard
                        title="Tóm tắt đơn"
                        desc="Panel phải giống logic của phiếu nhập: xem nhanh số dòng, tiền hàng, cọc và phần còn lại."
                        right={<BlockIcon tone="amber"><ShieldCheck className="h-5 w-5" /></BlockIcon>}
                    >
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <StatPill label="Items" value={items.length} />
                                <StatPill label="Sản phẩm" value={productLineItems.length} />
                                <StatPill label="Dịch vụ" value={serviceItems.length} />
                                <StatPill label="Tổng" value={fmtMoney(total, "VND")} />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Tiền hàng / dịch vụ</span>
                                    <span className="font-semibold text-slate-900">{fmtMoney(total, "VND")}</span>
                                </div>

                                {(form as any).reserve ? (
                                    <>
                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className="text-amber-800">Đã cọc</span>
                                            <span className="font-semibold text-amber-800">- {fmtMoney(depositAmount, "VND")}</span>
                                        </div>
                                        <div className="mt-3 h-px bg-slate-200" />
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="font-medium text-slate-700">Còn phải thu</span>
                                            <span className="text-lg font-semibold text-slate-900">{fmtMoney(remainingAmount, "VND")}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-3 h-px bg-slate-200" />
                                )}
                            </div>

                            <SectionNote tone="blue">Layout này giữ cùng nhịp với phiếu nhập và các trang chi tiết/edit sản phẩm: block rõ, khoảng cách rộng, panel phải dành cho phần kết luận nhanh.</SectionNote>
                        </div>
                    </AdminCard>
                </div>
            </div>

            <AdminStickySubmit
                saving={saving}
                submitLabel={props.mode === "create" ? "Tạo Draft" : "Lưu thay đổi"}
                onCancelHref={computedBackHref}
                total={<div><div className="text-xs text-slate-500">Tổng đơn</div><div className="text-base font-semibold text-slate-900">{fmtMoney(total, "VND")}</div></div>}
            />

            {showPostConfirm && props.mode === "edit" && (
                <Modal title="Xác nhận lưu thay đổi">
                    <p className="text-sm text-slate-600">
                        Bạn muốn <b>lưu thay đổi</b> cho đơn hàng này.
                        <br />
                        Nếu chọn <b>Duyệt (POST) luôn</b> thì đơn chuyển sang <b>POSTED</b> và hệ thống tạo các bản ghi liên quan.
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={postAfterSave} onChange={(e) => setPostAfterSave(e.target.checked)} />
                            Duyệt (POST) luôn sau khi lưu
                        </label>
                    </div>

                    <div className="mt-5 flex justify-end gap-2">
                        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50" onClick={() => {
                            setShowPostConfirm(false);
                            setPostAfterSave(false);
                        }} disabled={saving}>
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
