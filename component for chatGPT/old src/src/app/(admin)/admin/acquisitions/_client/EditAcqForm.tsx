"use client";

import Link from "next/link";
import { ProductType } from "@prisma/client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Archive,
    ChevronRight,
    Package,
    Plus,
    Save,
    ShoppingBag,
    Trash2,
    Wallet,
    Watch,
} from "lucide-react";
import {
    applyQuickWatchSpecToFlags,
    getQuickWatchSpecChips,
    parseQuickWatchSpec,
    type QuickWatchSpec,
} from "../_shared/quick-watch-rule";

type WatchFlags = {
    hasStrap: boolean;
    needService: boolean;
    hasClasp: boolean;
};

type StrapSpec = {
    material: string;
    lugWidthMM: number;
    buckleWidthMM: number;
    color: string;
    quickRelease: boolean;
    sellPrice: number;
};

type Line = {
    id: string;
    title: string;
    quantity: number;
    unitCost: number;
    productType: string;
    status?: string;
    linkedProductId?: string | null;
    watchFlags?: WatchFlags;
    strapSpec?: StrapSpec;
    quickSpec?: QuickWatchSpec | null;
};

type Props = {
    acquisition: {
        id: string;
        refNo?: string;
        vendorId: string;
        acquiredAt: string;
        notes: string;
        currency: string;
        type: string;
        status?: string;
    };
    items: Line[];
    vendors: { id: string; name: string }[];
    productTypes: string[];
    readOnly?: boolean;
};

const CURRENCIES = ["VND", "USD", "EUR"] as const;
const ACQ_TYPES = ["PURCHASE", "BUY_BACK", "TRADE_IN", "CONSIGNMENT"] as const;
const STRAP_MATERIALS = [
    { value: "LEATHER", label: "Da" },
    { value: "BRACELET", label: "Kim loại" },
    { value: "RUBBER", label: "Cao su" },
    { value: "NATO", label: "NATO" },
    { value: "CANVASS", label: "Canvas" },
    { value: "SPECIAL", label: "Khác" },
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function formatMoney(value: number, currency: string) {
    return `${new Intl.NumberFormat("vi-VN").format(value)} ${currency}`;
}

function defaultWatchFlags(): WatchFlags {
    return {
        hasStrap: true,
        needService: false,
        hasClasp: false,
    };
}

function defaultStrapSpec(): StrapSpec {
    return {
        material: "LEATHER",
        lugWidthMM: 20,
        buckleWidthMM: 18,
        color: "",
        quickRelease: true,
        sellPrice: 0,
    };
}

function normalizeWatchFlags(flags?: Partial<WatchFlags> | null): WatchFlags {
    return {
        hasStrap: !!flags?.hasStrap,
        needService: !!flags?.needService,
        hasClasp: !!flags?.hasClasp,
    };
}

function normalizeStrapSpec(spec?: Partial<StrapSpec> | null): StrapSpec {
    return {
        material: spec?.material || "LEATHER",
        lugWidthMM: Number(spec?.lugWidthMM ?? 20),
        buckleWidthMM: Number(spec?.buckleWidthMM ?? 18),
        color: spec?.color || "",
        quickRelease: spec?.quickRelease == null ? true : Boolean(spec.quickRelease),
        sellPrice: Number(spec?.sellPrice ?? 0),
    };
}

function buildWatchLineState(title = "", currentFlags?: WatchFlags) {
    const quickSpec = parseQuickWatchSpec(title);
    return {
        quickSpec,
        watchFlags: applyQuickWatchSpecToFlags(quickSpec, currentFlags ?? defaultWatchFlags()),
    };
}

function newLine(productType = ProductType.WATCH): Line {
    const watchState = buildWatchLineState("");

    return {
        id: `tmp-${uid()}`,
        title: "",
        quantity: 1,
        unitCost: 0,
        productType,
        watchFlags: productType === ProductType.WATCH ? watchState.watchFlags : undefined,
        strapSpec: productType === ProductType.WATCH_STRAP ? defaultStrapSpec() : undefined,
        quickSpec: productType === ProductType.WATCH ? watchState.quickSpec : undefined,
    };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <div className="mb-1.5 text-sm font-medium text-slate-700">{children}</div>;
}

function CardSection({
    title,
    desc,
    icon,
    children,
    right,
}: {
    title: string;
    desc?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div className="flex items-start gap-3">
                    {icon ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                            {icon}
                        </div>
                    ) : null}
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                        {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
                    </div>
                </div>
                {right}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

function TinyStat({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function FlagCheckbox({
    checked,
    label,
    disabled,
    onChange,
}: {
    checked: boolean;
    label: string;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
            {label}
        </label>
    );
}

function QuickRuleChips({ spec }: { spec?: QuickWatchSpec | null }) {
    const chips = getQuickWatchSpecChips(spec);
    if (!chips.length) {
        return (
            <p className="mt-2 text-xs text-slate-500">
                Gợi ý: <span className="font-medium">seiko tự động tròn mặt đen dây thép</span>
            </p>
        );
    }

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((chip) => (
                <span
                    key={chip}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                >
                    {chip}
                </span>
            ))}
        </div>
    );
}

export default function EditAcqForm({
    acquisition,
    items: initialItems,
    vendors,
    productTypes,
    readOnly = false,
}: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState({ ...acquisition });
    const [lines, setLines] = useState<Line[]>(
        (initialItems ?? []).map((item) => {
            const isWatch = item.productType === ProductType.WATCH;
            const watchState = isWatch
                ? buildWatchLineState(item.title, normalizeWatchFlags(item.watchFlags))
                : null;

            return {
                ...item,
                watchFlags: isWatch ? watchState?.watchFlags : undefined,
                quickSpec: isWatch ? watchState?.quickSpec : undefined,
                strapSpec:
                    item.productType === ProductType.WATCH_STRAP
                        ? normalizeStrapSpec(item.strapSpec)
                        : undefined,
            };
        })
    );
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const total = useMemo(
        () => lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitCost || 0), 0),
        [lines]
    );

    function setLine(id: string, patch: Partial<Line>) {
        setLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;

                const nextType = (patch.productType ?? line.productType) as string;
                const nextTitle = patch.title ?? line.title;
                const watchState =
                    nextType === ProductType.WATCH
                        ? buildWatchLineState(nextTitle, normalizeWatchFlags(patch.watchFlags ?? line.watchFlags))
                        : null;

                return {
                    ...line,
                    ...patch,
                    watchFlags: nextType === ProductType.WATCH ? watchState?.watchFlags : undefined,
                    quickSpec: nextType === ProductType.WATCH ? watchState?.quickSpec : undefined,
                    strapSpec:
                        nextType === ProductType.WATCH_STRAP
                            ? normalizeStrapSpec(patch.strapSpec ?? line.strapSpec)
                            : undefined,
                };
            })
        );
    }

    function setWatchTitle(id: string, title: string) {
        setLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const watchState = buildWatchLineState(title, normalizeWatchFlags(line.watchFlags));
                return {
                    ...line,
                    title,
                    watchFlags: watchState.watchFlags,
                    quickSpec: watchState.quickSpec,
                };
            })
        );
    }

    function setWatchFlag(id: string, key: keyof WatchFlags, value: boolean) {
        setLines((prev) =>
            prev.map((line) =>
                line.id === id
                    ? {
                        ...line,
                        watchFlags: normalizeWatchFlags({
                            ...(line.watchFlags ?? defaultWatchFlags()),
                            [key]: value,
                        }),
                    }
                    : line
            )
        );
    }

    function setStrapField<K extends keyof StrapSpec>(id: string, key: K, value: StrapSpec[K]) {
        setLines((prev) =>
            prev.map((line) =>
                line.id === id
                    ? {
                        ...line,
                        strapSpec: normalizeStrapSpec({
                            ...(line.strapSpec ?? defaultStrapSpec()),
                            [key]: value,
                        }),
                    }
                    : line
            )
        );
    }

    function addLine() {
        const defaultType = productTypes.includes(ProductType.WATCH)
            ? ProductType.WATCH
            : productTypes[0] || ProductType.WATCH;
        setLines((prev) => [...prev, newLine(defaultType as ProductType)]);
    }

    function removeLine(id: string) {
        setLines((prev) => prev.filter((line) => line.id !== id));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (readOnly) return;

        setErr(null);
        setOkMsg(null);

        if (!formData.vendorId) {
            setErr("Phải chọn vendor.");
            return;
        }

        const items = lines
            .map((line) => {
                const quickSpec =
                    line.productType === ProductType.WATCH ? parseQuickWatchSpec(line.title?.trim()) : null;

                return {
                    id: line.id,
                    title: line.title?.trim(),
                    quantity: Number(line.quantity) || 0,
                    unitCost: Number(line.unitCost) || 0,
                    productType: line.productType,
                    ...(line.productType === ProductType.WATCH
                        ? {
                            watchFlags: applyQuickWatchSpecToFlags(
                                quickSpec,
                                normalizeWatchFlags(line.watchFlags)
                            ),
                            quickSpec,
                        }
                        : {}),
                    ...(line.productType === ProductType.WATCH_STRAP
                        ? {
                            strapSpec: normalizeStrapSpec(line.strapSpec),
                        }
                        : {}),
                };
            })
            .filter((line) => line.title && line.quantity > 0);

        if (!items.length) {
            setErr("Phải có ít nhất 1 dòng hợp lệ.");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch(`/api/admin/acquisitions/${acquisition.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendorId: formData.vendorId,
                    acquiredAt: formData.acquiredAt,
                    currency: formData.currency,
                    type: formData.type,
                    notes: formData.notes,
                    items,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Cập nhật phiếu nhập thất bại");

            setOkMsg(
                formData.status === "POSTED"
                    ? "Đã lưu điều chỉnh phiếu nhập đã post. Các dòng bị bỏ sẽ được hủy và product liên quan sẽ bị archive."
                    : "Đã lưu toàn bộ thay đổi của phiếu nhập."
            );
            router.refresh();
        } catch (error: any) {
            setErr(error?.message || "Lỗi cập nhật phiếu nhập");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 pb-28">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/admin/acquisitions" className="hover:text-slate-700">
                                Phiếu nhập
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span>{formData.refNo || acquisition.id}</span>
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    {formData.refNo || acquisition.id}
                                </h2>

                                {formData.status ? (
                                    <span
                                        className={cx(
                                            "rounded-full px-2.5 py-1 text-xs font-medium border",
                                            formData.status === "POSTED" &&
                                            "border-sky-200 bg-sky-50 text-sky-700",
                                            formData.status === "CANCELED" &&
                                            "border-rose-200 bg-rose-50 text-rose-700",
                                            formData.status !== "POSTED" &&
                                            formData.status !== "CANCELED" &&
                                            "border-slate-200 bg-slate-50 text-slate-700"
                                        )}
                                    >
                                        {formData.status}
                                    </span>
                                ) : null}
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Refactor giao diện theo format phiếu kỹ thuật, không thay đổi logic lưu dữ liệu.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <TinyStat label="Dòng SP" value={lines.length} />
                        <TinyStat
                            label="Đồng hồ"
                            value={lines.filter((x) => x.productType === ProductType.WATCH).length}
                        />
                        <TinyStat
                            label="Dây"
                            value={lines.filter((x) => x.productType === ProductType.WATCH_STRAP).length}
                        />
                        <TinyStat label="Tổng" value={formatMoney(total, formData.currency)} />
                    </div>
                </div>
            </section>

            {formData.status === "POSTED" ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                    Phiếu này đã post. Khi bạn bỏ một dòng khỏi phiếu và lưu lại, hệ thống sẽ hủy dòng đó trong phiếu nhập
                    và archive product liên quan, không xóa cứng dữ liệu.
                </div>
            ) : null}

            {readOnly ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Phiếu này không còn chỉnh sửa được vì đã hủy. Bạn vẫn có thể xem đầy đủ thông tin tại đây.
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                    <CardSection
                        title="Thông tin phiếu"
                        desc="Giữ nguyên các field nghiệp vụ hiện tại."
                        icon={<ShoppingBag className="h-5 w-5" />}
                    >
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5">
                            <div className="xl:col-span-2">
                                <FieldLabel>Vendor</FieldLabel>
                                <select
                                    value={formData.vendorId}
                                    disabled={readOnly}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, vendorId: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-100"
                                >
                                    <option value="">-- Chọn vendor --</option>
                                    {vendors.map((vendor) => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <FieldLabel>Ngày nhập</FieldLabel>
                                <input
                                    type="datetime-local"
                                    value={formData.acquiredAt?.slice(0, 16) || ""}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, acquiredAt: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-100"
                                />
                            </div>

                            <div>
                                <FieldLabel>Loại phiếu</FieldLabel>
                                <select
                                    value={formData.type}
                                    disabled={readOnly}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-100"
                                >
                                    {ACQ_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                    {!ACQ_TYPES.includes(formData.type as any) ? (
                                        <option value={formData.type}>{formData.type}</option>
                                    ) : null}
                                </select>
                            </div>

                            <div>
                                <FieldLabel>Tiền tệ</FieldLabel>
                                <select
                                    value={formData.currency}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, currency: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-100"
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                    {!CURRENCIES.includes(formData.currency as any) ? (
                                        <option value={formData.currency}>{formData.currency}</option>
                                    ) : null}
                                </select>
                            </div>

                            <div className="lg:col-span-2 xl:col-span-5">
                                <FieldLabel>Ghi chú</FieldLabel>
                                <textarea
                                    value={formData.notes || ""}
                                    disabled={readOnly}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                                    className="min-h-[110px] w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-100"
                                />
                            </div>
                        </div>
                    </CardSection>

                    <CardSection
                        title="Dòng sản phẩm"
                        desc="Chỉnh nhanh toàn bộ item của phiếu ngay tại đây."
                        icon={<Package className="h-5 w-5" />}
                        right={
                            !readOnly ? (
                                <button
                                    type="button"
                                    onClick={addLine}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm dòng
                                </button>
                            ) : null
                        }
                    >
                        <div className="space-y-4">
                            {lines.map((line, idx) => {
                                const money = (Number(line.quantity) || 0) * (Number(line.unitCost) || 0);
                                const isWatch = line.productType === ProductType.WATCH;
                                const isStrap = line.productType === ProductType.WATCH_STRAP;

                                return (
                                    <div
                                        key={line.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                                                    Dòng #{idx + 1}
                                                </span>

                                                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                                                    {line.productType}
                                                </span>

                                                {line.linkedProductId ? (
                                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                        Đã link product
                                                    </span>
                                                ) : null}

                                                {line.status ? (
                                                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                                                        {line.status}
                                                    </span>
                                                ) : null}
                                            </div>

                                            {!readOnly ? (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLine(line.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    {formData.status === "POSTED" ? "Hủy dòng" : "Xóa dòng"}
                                                </button>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                                            <div className="xl:col-span-5">
                                                <FieldLabel>Mô tả nhanh / tên sản phẩm</FieldLabel>
                                                <input
                                                    type="text"
                                                    value={line.title}
                                                    disabled={readOnly}
                                                    onChange={(e) =>
                                                        isWatch
                                                            ? setWatchTitle(line.id, e.target.value)
                                                            : setLine(line.id, { title: e.target.value })
                                                    }
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                    placeholder={
                                                        isWatch
                                                            ? "VD: seiko tự động tròn mặt đen dây thép"
                                                            : "Tên sản phẩm"
                                                    }
                                                />
                                                {isWatch ? <QuickRuleChips spec={line.quickSpec} /> : null}
                                            </div>

                                            <div className="xl:col-span-3">
                                                <FieldLabel>Loại sản phẩm</FieldLabel>
                                                <select
                                                    value={line.productType}
                                                    disabled={readOnly}
                                                    onChange={(e) => setLine(line.id, { productType: e.target.value })}
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                >
                                                    {productTypes.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="xl:col-span-2">
                                                <FieldLabel>Số lượng</FieldLabel>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={line.quantity}
                                                    disabled={readOnly}
                                                    onChange={(e) =>
                                                        setLine(line.id, { quantity: Number(e.target.value) })
                                                    }
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                />
                                            </div>

                                            <div className="xl:col-span-2">
                                                <FieldLabel>Đơn giá</FieldLabel>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={line.unitCost}
                                                    disabled={readOnly}
                                                    onChange={(e) =>
                                                        setLine(line.id, { unitCost: Number(e.target.value) })
                                                    }
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                />
                                            </div>
                                        </div>

                                        {isWatch ? (
                                            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="mb-3 text-sm font-medium text-slate-700">
                                                    Trạng thái tiếp nhận đồng hồ
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <FlagCheckbox
                                                        checked={!!line.watchFlags?.needService}
                                                        label="Service"
                                                        disabled={readOnly}
                                                        onChange={(v) => setWatchFlag(line.id, "needService", v)}
                                                    />
                                                    <FlagCheckbox
                                                        checked={!!line.watchFlags?.hasStrap}
                                                        label="Có dây"
                                                        disabled={readOnly}
                                                        onChange={(v) => setWatchFlag(line.id, "hasStrap", v)}
                                                    />
                                                    <FlagCheckbox
                                                        checked={!!line.watchFlags?.hasClasp}
                                                        label="Có khóa"
                                                        disabled={readOnly}
                                                        onChange={(v) => setWatchFlag(line.id, "hasClasp", v)}
                                                    />
                                                </div>
                                            </div>
                                        ) : null}

                                        {isStrap ? (
                                            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="mb-4 text-sm font-medium text-slate-700">
                                                    Thông tin dây
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
                                                    <div className="xl:col-span-2">
                                                        <FieldLabel>Chất liệu</FieldLabel>
                                                        <select
                                                            value={line.strapSpec?.material ?? "LEATHER"}
                                                            disabled={readOnly}
                                                            onChange={(e) =>
                                                                setStrapField(line.id, "material", e.target.value)
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                        >
                                                            {STRAP_MATERIALS.map((m) => (
                                                                <option key={m.value} value={m.value}>
                                                                    {m.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Đầu dây</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={Number(line.strapSpec?.lugWidthMM ?? 20)}
                                                            disabled={readOnly}
                                                            onChange={(e) =>
                                                                setStrapField(
                                                                    line.id,
                                                                    "lugWidthMM",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Đuôi dây</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={Number(line.strapSpec?.buckleWidthMM ?? 18)}
                                                            disabled={readOnly}
                                                            onChange={(e) =>
                                                                setStrapField(
                                                                    line.id,
                                                                    "buckleWidthMM",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Màu sắc</FieldLabel>
                                                        <input
                                                            type="text"
                                                            value={line.strapSpec?.color ?? ""}
                                                            disabled={readOnly}
                                                            onChange={(e) =>
                                                                setStrapField(line.id, "color", e.target.value)
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Giá bán dự kiến</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            step="0.01"
                                                            value={Number(line.strapSpec?.sellPrice ?? 0)}
                                                            disabled={readOnly}
                                                            onChange={(e) =>
                                                                setStrapField(
                                                                    line.id,
                                                                    "sellPrice",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <FlagCheckbox
                                                        checked={!!line.strapSpec?.quickRelease}
                                                        label="Quick release"
                                                        disabled={readOnly}
                                                        onChange={(v) =>
                                                            setStrapField(line.id, "quickRelease", v)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                                            <div className="text-sm text-slate-500">Thành tiền dòng này</div>
                                            <div className="text-base font-semibold text-slate-900">
                                                {formatMoney(money, formData.currency)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardSection>

                    {err ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {err}
                        </div>
                    ) : null}

                    {okMsg ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {okMsg}
                        </div>
                    ) : null}
                </div>

                <div className="space-y-6">
                    <CardSection
                        title="Tổng quan"
                        desc="Nhìn nhanh trước khi lưu."
                        icon={<Wallet className="h-5 w-5" />}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="text-sm text-slate-600">Số dòng sản phẩm</span>
                                <span className="font-semibold text-slate-900">{lines.length}</span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="text-sm text-slate-600">Dòng đồng hồ</span>
                                <span className="font-semibold text-slate-900">
                                    {lines.filter((x) => x.productType === ProductType.WATCH).length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="text-sm text-slate-600">Dòng dây</span>
                                <span className="font-semibold text-slate-900">
                                    {lines.filter((x) => x.productType === ProductType.WATCH_STRAP).length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900 px-4 py-3">
                                <span className="text-sm text-slate-200">Tổng cộng</span>
                                <span className="text-lg font-semibold text-white">
                                    {formatMoney(total, formData.currency)}
                                </span>
                            </div>
                        </div>
                    </CardSection>

                    {formData.status === "POSTED" ? (
                        <CardSection
                            title="Lưu ý khi phiếu đã post"
                            desc="Chỉ hiển thị nhắc nghiệp vụ, không đổi logic."
                            icon={<Archive className="h-5 w-5" />}
                        >
                            <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                                Khi bỏ một dòng và lưu lại, hệ thống hiểu là hủy dòng đó trong phiếu nhập,
                                đồng thời archive product liên quan.
                            </div>
                        </CardSection>
                    ) : null}
                </div>
            </div>

            {!readOnly ? (
                <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setLines((prev) => [...prev, newLine(ProductType.WATCH)])}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                            >
                                <Watch className="h-4 w-4" />
                                Thêm đồng hồ
                            </button>

                            {productTypes.includes(ProductType.WATCH_STRAP) ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLines((prev) => [...prev, newLine(ProductType.WATCH_STRAP)])
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                                >
                                    <Package className="h-4 w-4" />
                                    Thêm dây
                                </button>
                            ) : null}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <div className="text-xs text-slate-500">Tổng cộng</div>
                                <div className="text-base font-semibold text-slate-900">
                                    {formatMoney(total, formData.currency)}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? "Đang lưu..." : "Lưu toàn bộ phiếu nhập"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </form>
    );
}