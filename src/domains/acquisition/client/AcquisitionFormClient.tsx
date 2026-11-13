"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { AdminPageCanvas, AdminPageHeader } from "@/domains/shared/ui/admin-design-contract";
import { useRouter } from "next/navigation";
import {
    Box,
    Loader2,
    PackagePlus,
    Plus,
    Save,
    Sparkles,
    Search,
    WalletCards,
    X,
} from "lucide-react";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { createQuickVendor } from "@/domains/vendor/client/vendor.actions";
import AcquisitionBulkImagePicker from "../ui/new/AcquisitionBulkImagePicker";
import {
    applyPreparedImagesTopDown,
    createEmptyWatchLine,
} from "./form/acquisition-form.mapper";
import { submitInlineAcquisition } from "./form/acquisition-form.submit";
import { waitForOperationProjectionDeliveries } from "@/domains/coordination/ui/operation-delivery.client";
import type {
    AcquisitionFormVendor,
    AcquisitionPreparedImage,
    AcquisitionTradeInOrder,
    AcquisitionWatchLine,
} from "./form/acquisition-form.types";
import { useAcquisitionQuickNames } from "./form/use-acquisition-quick-names";
import WatchLineCard from "../ui/new/WatchLineCard";
import AcquisitionCreatedDialog from "../ui/navigation/AcquisitionCreatedDialog";

type Props = {
    vendors: AcquisitionFormVendor[];
    canApprove: boolean;
};

const EMPTY_PURCHASED_WATCHES: NonNullable<AcquisitionTradeInOrder["purchasedWatches"]> = [];

const FIELD_CLASS =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

function toLocalDateTimeInputValue(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function formatMoney(value: number, currency = "VND") {
    return `${new Intl.NumberFormat("vi-VN").format(value)} ${currency}`;
}

function mergeVendors(
    current: AcquisitionFormVendor[],
    incoming: AcquisitionFormVendor[],
) {
    const byId = new Map<string, AcquisitionFormVendor>();

    for (const vendor of [...current, ...incoming]) {
        if (!vendor?.id) continue;
        byId.set(vendor.id, vendor);
    }

    return Array.from(byId.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

function SectionHeader({
    icon,
    title,
    description,
    actions,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500">
                    {icon}
                </div>
                <div className="min-w-0">
                    <div className="text-base font-semibold text-slate-950">{title}</div>
                    <div className="sr-only">{description}</div>
                </div>
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
    );
}

const VendorQuickField = memo(function VendorQuickField({
    value,
    vendors,
    disabled,
    onChange,
    onVendorsChange,
}: {
    value: string;
    vendors: AcquisitionFormVendor[];
    disabled?: boolean;
    onChange: (vendorId: string) => void;
    onVendorsChange: (vendors: AcquisitionFormVendor[]) => void;
}) {
    const notify = useNotify();
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [pending, startTransition] = useTransition();

    function handleCreate() {
        const cleanName = name.trim();
        if (!cleanName || pending) return;

        startTransition(async () => {
            try {
                const vendor = await createQuickVendor({
                    name: cleanName,
                    phone: phone.trim() || null,
                });
                onVendorsChange(mergeVendors(vendors, [vendor]));
                onChange(vendor.id);
                setName("");
                setPhone("");
                setCreating(false);
                notify.success({
                    title: "Da tao vendor",
                    message: `Vendor ${vendor.name} da duoc chon cho phieu nhap.`,
                });
            } catch (error) {
                notify.error({
                    title: "Khong the tao vendor",
                    message: getErrorMessage(error, "Co loi xay ra khi tao vendor."),
                });
            }
        });
    }

    const selected = vendors.find((vendor) => vendor.id === value);

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-900">
                    Vendor <span className="text-rose-500">*</span>
                </label>
                {!creating ? (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setCreating(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 transition hover:text-violet-800 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Thêm vendor
                    </button>
                ) : null}
            </div>

            <div className="relative">
                {selected ? (
                    <span className="pointer-events-none absolute left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                        {selected.name.slice(0, 2).toUpperCase()}
                    </span>
                ) : null}
                <select
                    aria-label="Vendor"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled || pending}
                    className={`${FIELD_CLASS} ${selected ? "pl-11" : ""}`}
                >
                    <option value="">Chọn vendor</option>
                    {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                        </option>
                    ))}
                </select>
            </div>

            {creating ? (
                <div className="mt-3 rounded-md border border-violet-100 bg-violet-50/70 p-3">
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto_auto] md:items-end">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                                Tên vendor mới
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={pending}
                                placeholder="VD: Cho Nhat"
                                className={FIELD_CLASS}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                                Điện thoại
                            </label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={pending}
                                placeholder="Tuy chon"
                                className={FIELD_CLASS}
                            />
                        </div>
                        <button
                            type="button"
                            disabled={pending || !name.trim()}
                            onClick={handleCreate}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                            {pending ? "Dang them" : "Them"}
                        </button>
                        <button
                            type="button"
                            disabled={pending}
                            onClick={() => {
                                setName("");
                                setPhone("");
                                setCreating(false);
                            }}
                            className="inline-flex h-10 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Dong form them vendor"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
});

function TradeInOrderField({
    value,
    disabled,
    onChange,
}: {
    value: AcquisitionTradeInOrder | null;
    disabled?: boolean;
    onChange: (order: AcquisitionTradeInOrder | null) => void;
}) {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<AcquisitionTradeInOrder[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query.trim();
        if (q.length < 2 || value) {
            setItems([]);
            return;
        }
        let cancelled = false;
        const timer = window.setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/acquisitions/trade-in-orders?q=${encodeURIComponent(q)}`);
                const json = await res.json().catch(() => null);
                if (!cancelled) setItems(Array.isArray(json?.items) ? json.items : []);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 300);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [query, value]);

    return (
        <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
                Đơn hàng trade-in <span className="text-rose-500">*</span>
            </label>
            {value ? (
                <div className="flex items-center justify-between gap-4 rounded-md border border-violet-200 bg-violet-50 px-4 py-3">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-violet-950">{value.refNo || value.id}</div>
                        <div className="mt-1 text-xs text-violet-700">
                            {value.customerName} · {value.customerPhone || "Chưa có SĐT"} · {value.status}
                        </div>
                    </div>
                    <button type="button" disabled={disabled} onClick={() => { onChange(null); setQuery(""); }} className="rounded-md border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700">
                        Chọn lại
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} placeholder="Tìm theo mã đơn, tên khách hoặc số điện thoại..." className={`${FIELD_CLASS} pl-10`} />
                    {query.trim().length >= 2 ? (
                        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-2 shadow-xl">
                            {loading ? <div className="px-3 py-4 text-sm text-slate-500">Đang tìm đơn hàng...</div> : items.length ? items.map((order) => (
                                <button key={order.id} type="button" onClick={() => { onChange(order); setQuery(""); }} className="block w-full rounded-md px-3 py-3 text-left hover:bg-slate-50">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-semibold text-slate-900">{order.refNo || order.id}</span>
                                        <span className="text-xs font-medium text-slate-500">{order.status}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">{order.customerName} · {order.customerPhone || "Chưa có SĐT"}</div>
                                </button>
                            )) : <div className="px-3 py-4 text-sm text-slate-500">Không tìm thấy đơn hàng.</div>}
                        </div>
                    ) : null}
                </div>
            )}
            <p className="mt-2 text-xs text-slate-500">Phiếu nhập sẽ kế thừa Customer và liên kết giao dịch từ Order này.</p>
        </div>
    );
}

export default function AcquisitionFormClient({ vendors: initialVendors, canApprove }: Props) {
    const notify = useNotify();
    const progress = useAppProgress();
    const router = useRouter();

    const [vendors, setVendors] = useState<AcquisitionFormVendor[]>(initialVendors);
    const [vendorId, setVendorId] = useState("");
    const [createdAt, setCreatedAt] = useState(() =>
        toLocalDateTimeInputValue(new Date()),
    );
    const [currency, setCurrency] = useState("VND");
    const [type, setType] = useState("PURCHASE");
    const [tradeInOrder, setTradeInOrder] = useState<AcquisitionTradeInOrder | null>(null);
    const [audienceSegment, setAudienceSegment] = useState<"MEN" | "WOMEN">("MEN");
    const [notes, setNotes] = useState("");
    const [watchLines, setWatchLines] = useState<AcquisitionWatchLine[]>([
        createEmptyWatchLine("MEN"),
    ]);
    const quickNames = useAcquisitionQuickNames(watchLines, setWatchLines);
    const [submitting, setSubmitting] = useState(false);
    const submitLockRef = useRef(false);
    const createdAcquisitionIdRef = useRef<string | null>(null);
    const [createdAcquisition, setCreatedAcquisition] = useState<{ id: string; type: string; audienceSegment: "MEN" | "WOMEN" } | null>(null);

    const totalWatchCost = useMemo(() => {
        return watchLines.reduce((sum, line) => {
            const cost = line.cost === "" ? 0 : Number(line.cost || 0);
            return sum + cost;
        }, 0);
    }, [watchLines]);

    const validLineCount = useMemo(() => {
        return watchLines.filter(
            (line) =>
                line.imageKey ||
                line.imageUrl ||
                line.quickInput.trim() ||
                line.aiHint.trim() ||
                Number(line.cost || 0) > 0 ||
                Number(line.salePrice || 0) > 0,
        ).length;
    }, [watchLines]);

    function resetForm() {
        createdAcquisitionIdRef.current = null;
        setVendorId("");
        setCreatedAt(toLocalDateTimeInputValue(new Date()));
        setCurrency("VND");
        setType("PURCHASE");
        setTradeInOrder(null);
        setAudienceSegment("MEN");
        setNotes("");
        setWatchLines([createEmptyWatchLine("MEN")]);
    }

    const updateLine = useCallback((id: string, patch: Partial<AcquisitionWatchLine>) => {
        setWatchLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)));
    }, []);

    const removeLine = useCallback((id: string) => {
        setWatchLines((prev) => {
            const next = prev.filter((line) => line.id !== id);
            return next.length ? next : [createEmptyWatchLine(audienceSegment)];
        });
    }, [audienceSegment]);

    function addWatchLine() {
        setWatchLines((prev) => [...prev, createEmptyWatchLine(audienceSegment)]);
    }

    function importPreparedImages(images: AcquisitionPreparedImage[]) {
        setWatchLines((prev) => applyPreparedImagesTopDown(prev, images, audienceSegment));
    }

    function applyAudienceSegmentToAll(segment: "MEN" | "WOMEN") {
        setAudienceSegment(segment);
        setWatchLines((prev) =>
            prev.map((line) => ({ ...line, audienceSegment: segment })),
        );
    }

    async function postCreatedAcquisition(acquisitionId: string) {
        progress.show({
            title: "Dang duyet phieu nhap",
            message: "He thong dang tao Watch va ban event watch.created.",
            steps: [
                { id: "post", label: "Duyet phieu nhap", status: "running" },
                { id: "event", label: "Dong bo Watch List projection", status: "pending" },
            ],
        });

        const res = await fetch(`/api/admin/acquisitions/${acquisitionId}/post`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendorName: "" }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Khong the duyet phieu nhap.");

        progress.update({
            title: "Dang dong bo du lieu",
            message: "Phieu da duoc duyet. He thong dang cho projection cap nhat.",
            steps: [
                { id: "post", label: "Duyet phieu nhap", status: "done" },
                { id: "event", label: "Dong bo Watch List projection", status: "running" },
            ],
        });
        await waitForOperationProjectionDeliveries(json?.data ?? json);

        progress.update({
            title: "Da duyet phieu nhap",
            message: "Watch moi da duoc tao va projection da nhan event.",
            steps: [
                { id: "post", label: "Duyet phieu nhap", status: "done" },
                { id: "event", label: "Dong bo Watch List projection", status: "done" },
            ],
        });
    }

    async function submit() {
        // React state does not disable the button until the next render. This ref
        // closes the small window where rapid clicks could send duplicate requests.
        if (submitLockRef.current || quickNames.busy) return;
        if (createdAcquisitionIdRef.current) {
            notify.warning({
                title: "Phiếu nhập đã được tạo",
                message: "Dữ liệu này đã được lưu thành phiếu DRAFT. Vui lòng bấm Làm mới form nếu muốn tạo phiếu mới.",
            });
            return;
        }

        if (type === "TRADE_IN" && !tradeInOrder) {
            notify.warning({
                title: "Thiếu đơn hàng",
                message: "Vui lòng chọn đơn hàng phát sinh trade-in.",
            });
            return;
        }

        if (type === "TRADE_IN") {
            const purchasedLines = watchLines.filter((line) => line.tradeInSource === "CUSTOMER_PURCHASE");
            if (purchasedLines.some((line) => !line.sourceOrderItemId)) {
                notify.warning({
                    title: "Chưa chọn Watch đã mua",
                    message: "Mỗi dòng có nguồn từ lịch sử mua cần chọn đúng Watch của khách.",
                });
                return;
            }
            const sourceIds = purchasedLines.map((line) => line.sourceOrderItemId!);
            if (new Set(sourceIds).size !== sourceIds.length) {
                notify.warning({
                    title: "Watch bị chọn trùng",
                    message: "Một Watch đã mua chỉ được dùng cho một dòng trade-in.",
                });
                return;
            }
        }

        if (type !== "TRADE_IN" && !vendorId) {
            notify.warning({
                title: "Thieu vendor",
                message: "Vui long chon vendor truoc khi luu phieu nhap.",
            });
            return;
        }

        const validLines = watchLines.filter(
            (line) =>
                line.imageKey ||
                line.imageUrl ||
                line.quickInput.trim() ||
                line.aiHint.trim() ||
                Number(line.cost || 0) > 0 ||
                Number(line.salePrice || 0) > 0,
        );

        if (!validLines.length) {
            notify.warning({
                title: "Phieu nhap chua co du lieu",
                message: "Vui long nhap thong tin watch, gia hoac chon anh truoc khi luu.",
            });
            return;
        }

        const totalCost = validLines.reduce(
            (sum, line) => sum + Number(line.cost === "" ? 0 : line.cost || 0),
            0,
        );
        if (totalCost <= 0) {
            notify.warning({
                title: "Chưa có giá nhập",
                message: "Phiếu nhập có tổng giá trị bằng 0 nên không thể duyệt. Vui lòng nhập giá trước khi tạo phiếu.",
            });
            return;
        }

        submitLockRef.current = true;
        setSubmitting(true);
        progress.show({
            title: "Dang luu phieu nhap",
            message: "He thong dang tao draft va gan anh tu NAS.",
            steps: [
                { id: "draft", label: "Tao phieu DRAFT", status: "running" },
                { id: "items", label: "Luu danh sach watch", status: "pending" },
            ],
        });

        try {
            const result = await submitInlineAcquisition({
                audienceSegment,
                vendorId,
                sourceOrderId: type === "TRADE_IN" ? tradeInOrder?.id ?? null : null,
                createdAt: new Date(createdAt).toISOString(),
                currency,
                type,
                notes: notes || null,
                items: validLines,
            });
            const acquisitionId = String(result?.id ?? result?.data?.id ?? "").trim();
            if (!acquisitionId) throw new Error("Khong nhan duoc id phieu nhap moi.");
            createdAcquisitionIdRef.current = acquisitionId;

            await waitForOperationProjectionDeliveries(result);

            progress.update({
                title: "Da luu phieu nhap",
                message: "Chon buoc tiep theo de tranh tao trung phieu draft.",
                steps: [
                    { id: "draft", label: "Tao phieu DRAFT", status: "done" },
                    { id: "items", label: "Luu danh sach watch", status: "done" },
                ],
            });
            progress.hide();

            setCreatedAcquisition({ id: acquisitionId, type, audienceSegment });
        } catch (error) {
            notify.error({
                title: "Luu phieu nhap that bai",
                message: getErrorMessage(error, "Khong the luu phieu nhap."),
            });
        } finally {
            submitLockRef.current = false;
            setSubmitting(false);
            progress.hide();
        }
    }

    return (
        <AdminPageCanvas className="pb-24">
            <AdminPageHeader eyebrow="KHO HÀNG / PHIẾU NHẬP" title="Tạo phiếu nhập đồng hồ"
                description="Chọn vendor, thêm đồng hồ rồi lưu phiếu. Giá VND nhập theo đơn vị nghìn."
                meta={<span className="text-sm tabular-nums text-slate-500">{validLineCount || watchLines.length} đồng hồ · <strong className="text-slate-900">{formatMoney(totalWatchCost, currency)}</strong></span>} />
            <div className="grid gap-4">
                <div className="space-y-4">
                    <section className="bg-white">
                        <SectionHeader
                            icon={<Box className="h-5 w-5" />}
                            title="Thông tin phiếu"
                            description="Vendor, thoi gian tiep nhan, loai phieu va ghi chu chung."
                        />

                        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
                            {type === "TRADE_IN" ? (
                                <TradeInOrderField
                                    value={tradeInOrder}
                                    disabled={submitting || quickNames.busy}
                                    onChange={(order) => {
                                        setTradeInOrder(order);
                                        setWatchLines((current) => current.map((line) => ({
                                            ...line,
                                            tradeInSource: "EXTERNAL",
                                            sourceOrderItemId: null,
                                        })));
                                    }}
                                />
                            ) : (
                                <VendorQuickField
                                    value={vendorId}
                                    vendors={vendors}
                                    disabled={submitting || quickNames.busy}
                                    onChange={setVendorId}
                                    onVendorsChange={setVendors}
                                />
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Ngày nhập <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={createdAt}
                                        onChange={(e) => setCreatedAt(e.target.value)}
                                        className={FIELD_CLASS}
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Loại phiếu <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    aria-label="Loại phiếu"
                                    value={type}
                                    onChange={(e) => {
                                        const nextType = e.target.value;
                                        setType(nextType);
                                        if (nextType !== "TRADE_IN") setTradeInOrder(null);
                                    }}
                                    className={FIELD_CLASS}
                                >
                                    <option value="PURCHASE">Thu mua</option>
                                    <option value="BUY_BACK">Mua lại</option>
                                    <option value="TRADE_IN">Đổi đồng hồ</option>
                                    <option value="CONSIGNMENT">Ký gửi</option>
                                </select>
                            </div>

                        </div>
                        <details className="pb-4 text-xs text-slate-500">
                            <summary className="cursor-pointer py-2">Ghi chú & tùy chọn</summary>
                            <div className="grid gap-4 py-2 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Giới tính mặc định
                                </label>
                                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                                    {(["MEN", "WOMEN"] as const).map((segment) => (
                                        <button
                                            key={segment}
                                            type="button"
                                            disabled={submitting || quickNames.busy}
                                            onClick={() => applyAudienceSegmentToAll(segment)}
                                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                                audienceSegment === segment
                                                    ? "bg-white text-violet-700 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            {segment === "MEN" ? "Nam" : "Nữ"}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Áp dụng cho toàn bộ danh sách. Bạn vẫn có thể đổi riêng từng dòng.
                                </p>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Tiền tệ <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    aria-label="Tiền tệ"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className={FIELD_CLASS}
                                >
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-slate-900">
                                        Ghi chú
                                    </label>
                                    <span className="text-xs text-slate-400">{notes.length}/500</span>
                                </div>
                                <textarea
                                    value={notes}
                                    maxLength={500}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Nhập ghi chú..."
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                                />
                            </div>
                            </div>
                        </details>
                    </section>

                    <section className="bg-white">
                        <SectionHeader
                            icon={<PackagePlus className="h-5 w-5" />}
                            title="Danh sách đồng hồ"
                            description="Chon nhieu anh tu NAS, he thong se do vao cac dong dang trong truoc roi moi them dong moi."
                            actions={
                                <>
                                    <button type="button" onClick={() => void quickNames.generate()} disabled={submitting || quickNames.busy || !quickNames.count}
                                        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-800 disabled:opacity-40">
                                        {quickNames.busy ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4"/>}
                                        {quickNames.busy ? "Codex đang đọc ảnh…" : "Codex gợi ý tên"}
                                    </button>
                                    {quickNames.busy && <button type="button" onClick={quickNames.stop} className="min-h-10 px-2 text-xs text-slate-600 underline">Dừng chờ</button>}
                                    <AcquisitionBulkImagePicker
                                        onImport={importPreparedImages}
                                        disabled={submitting || quickNames.busy}
                                        audienceSegment={audienceSegment}
                                    />
                                    <button
                                        type="button"
                                        onClick={addWatchLine}
                                        disabled={submitting || quickNames.busy}
                                        className="inline-flex h-10 items-center gap-2 rounded-md border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm đồng hồ
                                    </button>
                                </>
                            }
                        />

                        <p className="py-2 text-xs leading-5 text-slate-500">Tên theo thứ tự: thương hiệu · dòng/model · mã tham chiếu · biệt danh · loại máy. Chỉ điền thông tin đã biết; năm sản xuất có thể bổ sung sau. Chọn ảnh NAS rồi nhờ Codex gợi ý tối đa 12 ảnh/lượt. Đây là bản nháp để bạn chỉnh, chưa đủ để tự đăng storefront.</p>
                        {quickNames.error && <p role="alert" className="pb-2 text-xs text-amber-800">{quickNames.error}</p>}
                        <div className="divide-y divide-slate-100">
                            {watchLines.map((line, index) => (
                                <WatchLineCard
                                    key={line.id}
                                    line={line}
                                    currency={currency}
                                    codexStatus={quickNames.statuses[line.id]}
                                    index={index}
                                    onChange={updateLine}
                                    onRemove={removeLine}
                                    canRemove={watchLines.length > 1}
                                    tradeIn={type === "TRADE_IN"}
                                    purchasedWatches={tradeInOrder?.purchasedWatches ?? EMPTY_PURCHASED_WATCHES}
                                />
                            ))}


                        </div>
                    </section>
                </div>


            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        disabled={submitting || quickNames.busy}
                        onClick={() => router.push("/admin/acquisitions")}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        Hủy
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:flex">
                            <WalletCards className="h-4 w-4 text-slate-400" />
                            {formatMoney(totalWatchCost, currency)}
                        </div>
                        <button
                            type="button"
                            disabled={submitting || quickNames.busy}
                            onClick={submit}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Lưu phiếu nhập
                        </button>
                    </div>
                </div>
            </div>

            <AcquisitionCreatedDialog
                open={Boolean(createdAcquisition)}
                canApprove={canApprove}
                title={createdAcquisition?.type === "TRADE_IN" ? "Đã tạo phiếu Trade-in" : "Đã tạo phiếu nhập"}
                message="Phiếu đang ở trạng thái DRAFT. Bạn có thể tạo phiếu mới, mở phiếu vừa tạo hoặc duyệt ngay."
                stayLabel="Tạo phiếu mới"
                onStay={() => {
                    setCreatedAcquisition(null);
                    resetForm();
                    notify.success({ title: "Sẵn sàng tạo phiếu mới", message: "Form đã được làm mới." });
                }}
                onOpen={() => {
                    if (!createdAcquisition) return;
                    router.push(`/admin/acquisitions?focus=${encodeURIComponent(createdAcquisition.id)}`);
                }}
                onApprove={async () => {
                    if (!createdAcquisition) return;
                    try {
                        await postCreatedAcquisition(createdAcquisition.id);
                        progress.hide();
                        const segment = createdAcquisition.audienceSegment;
                        setCreatedAcquisition(null);
                        resetForm();
                        notify.success({ title: "Đã duyệt phiếu nhập", message: "Watch đã được tạo và đồng bộ vào danh sách." });
                        router.push(`/admin/watches?segment=${segment}`);
                        router.refresh();
                    } catch (error) {
                        progress.hide();
                        const message = getErrorMessage(error, "Không thể duyệt phiếu nhập.");
                        notify.error({ title: "Duyệt phiếu thất bại", message });
                        throw error;
                    }
                }}
            />
        </AdminPageCanvas>
    );
}
