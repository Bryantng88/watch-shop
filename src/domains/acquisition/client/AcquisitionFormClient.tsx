"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    Box,
    CalendarDays,
    ChevronRight,
    ClipboardCheck,
    FileText,
    Loader2,
    PackagePlus,
    Plus,
    Save,
    WalletCards,
    X,
} from "lucide-react";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { createQuickVendor } from "@/domains/vendor/client/vendor.actions";
import AcquisitionBulkImagePicker from "../ui/new/AcquisitionBulkImagePicker";
import {
    applyPreparedImagesTopDown,
    createEmptyWatchLine,
} from "./form/acquisition-form.mapper";
import { submitInlineAcquisition } from "./form/acquisition-form.submit";
import type {
    AcquisitionFormVendor,
    AcquisitionPreparedImage,
    AcquisitionWatchLine,
} from "./form/acquisition-form.types";
import WatchLineCard from "../ui/new/WatchLineCard";

type Props = {
    vendors: AcquisitionFormVendor[];
};

const FIELD_CLASS =
    "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

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
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                    {icon}
                </div>
                <div className="min-w-0">
                    <div className="text-base font-semibold text-slate-950">{title}</div>
                    <div className="mt-1 text-sm leading-5 text-slate-500">{description}</div>
                </div>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
    );
}

function VendorQuickField({
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
                        Vendor moi
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
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled || pending}
                    className={`${FIELD_CLASS} ${selected ? "pl-11" : ""}`}
                >
                    <option value="">Chon vendor</option>
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
                                Ten vendor moi
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
                                Dien thoai
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
                            className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
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
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Dong form them vendor"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default function AcquisitionFormClient({ vendors: initialVendors }: Props) {
    const notify = useNotify();
    const dialog = useAppDialog();
    const progress = useAppProgress();
    const router = useRouter();

    const [vendors, setVendors] = useState<AcquisitionFormVendor[]>(initialVendors);
    const [vendorId, setVendorId] = useState("");
    const [createdAt, setCreatedAt] = useState(() =>
        toLocalDateTimeInputValue(new Date()),
    );
    const [currency, setCurrency] = useState("VND");
    const [type, setType] = useState("PURCHASE");
    const [notes, setNotes] = useState("");
    const [watchLines, setWatchLines] = useState<AcquisitionWatchLine[]>([
        createEmptyWatchLine(),
    ]);
    const [submitting, setSubmitting] = useState(false);

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
        setVendorId("");
        setCreatedAt(toLocalDateTimeInputValue(new Date()));
        setCurrency("VND");
        setType("PURCHASE");
        setNotes("");
        setWatchLines([createEmptyWatchLine()]);
    }

    function updateLine(id: string, next: AcquisitionWatchLine) {
        setWatchLines((prev) => prev.map((line) => (line.id === id ? next : line)));
    }

    function removeLine(id: string) {
        setWatchLines((prev) => {
            const next = prev.filter((line) => line.id !== id);
            return next.length ? next : [createEmptyWatchLine()];
        });
    }

    function addWatchLine() {
        setWatchLines((prev) => [...prev, createEmptyWatchLine()]);
    }

    function importPreparedImages(images: AcquisitionPreparedImage[]) {
        setWatchLines((prev) => applyPreparedImagesTopDown(prev, images));
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
            title: "Da duyet phieu nhap",
            message: "Watch moi da duoc tao va projection da nhan event.",
            steps: [
                { id: "post", label: "Duyet phieu nhap", status: "done" },
                { id: "event", label: "Dong bo Watch List projection", status: "done" },
            ],
        });
    }

    async function submit() {
        if (!vendorId) {
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
                vendorId,
                createdAt: new Date(createdAt).toISOString(),
                currency,
                type,
                notes: notes || null,
                items: validLines,
            });
            const acquisitionId = String(result?.id ?? result?.data?.id ?? "").trim();
            if (!acquisitionId) throw new Error("Khong nhan duoc id phieu nhap moi.");

            progress.update({
                title: "Da luu phieu nhap",
                message: "Chon buoc tiep theo de tranh tao trung phieu draft.",
                steps: [
                    { id: "draft", label: "Tao phieu DRAFT", status: "done" },
                    { id: "items", label: "Luu danh sach watch", status: "done" },
                ],
            });
            progress.hide();

            const shouldPost = await dialog.confirm({
                title: "Duyet phieu nay luon?",
                message:
                    "Phieu vua duoc luu o trang thai DRAFT. Hay duyet ngay de tao Watch, hoac tao phieu moi de form duoc reset va tranh luu trung.",
                confirmText: "Duyet phieu nay",
                cancelText: "Tao phieu moi",
                tone: "success",
            });

            if (shouldPost) {
                await postCreatedAcquisition(acquisitionId);
                notify.success({
                    title: "Da duyet phieu nhap",
                    message: "Watch moi da duoc tao va Watch List projection se cap nhat.",
                });
                router.push(`/admin/acquisitions/${acquisitionId}`);
                router.refresh();
                return;
            }

            resetForm();
            notify.success({
                title: "San sang tao phieu moi",
                message: "Form da duoc lam moi de khong tao trung phieu draft cu.",
            });
        } catch (error) {
            notify.error({
                title: "Luu phieu nhap that bai",
                message: getErrorMessage(error, "Khong the luu phieu nhap."),
            });
        } finally {
            setSubmitting(false);
            progress.hide();
        }
    }

    return (
        <div className="min-h-screen pb-24">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Quan ly Space</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                    <span>Ky thuat Spaces</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                    <span className="font-medium text-slate-800">Tao phieu nhap watch</span>
                </nav>

                <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <BookOpen className="h-4 w-4" />
                    Xem huong dan
                </button>
            </div>

            <section className="mb-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.85fr)] lg:items-center">
                    <div className="flex min-w-0 items-center gap-5">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                            <Box className="h-11 w-11" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-3xl font-bold text-slate-950">
                                Tao phieu nhap watch
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Chon nhieu anh tu NAS roi do vao cac dong watch dang trong, tu tren xuong duoi.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-50 text-violet-700">
                                    <ClipboardCheck className="h-4 w-4" />
                                </span>
                                <div>
                                    <div className="text-[11px] font-bold uppercase text-slate-500">Trang thai</div>
                                    <div className="mt-1 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                                        DRAFT
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="text-[11px] font-bold uppercase text-slate-500">Tong dong ho</div>
                            <div className="mt-2 text-2xl font-bold text-slate-950">{validLineCount || watchLines.length}</div>
                            <div className="mt-1 text-sm text-slate-500">item</div>
                        </div>
                        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="text-[11px] font-bold uppercase text-slate-500">Tong gia tri</div>
                            <div className="mt-2 text-xl font-bold text-slate-950">{formatMoney(totalWatchCost, currency)}</div>
                            <div className="mt-1 text-sm text-slate-500">Gia nhap du kien</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={<Box className="h-5 w-5" />}
                            title="Thong tin phieu"
                            description="Vendor, thoi gian tiep nhan, loai phieu va ghi chu chung."
                        />

                        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                            <VendorQuickField
                                value={vendorId}
                                vendors={vendors}
                                disabled={submitting}
                                onChange={setVendorId}
                                onVendorsChange={setVendors}
                            />

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Ngay nhap <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={createdAt}
                                        onChange={(e) => setCreatedAt(e.target.value)}
                                        className={`${FIELD_CLASS} pr-10`}
                                    />
                                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Tien te <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className={FIELD_CLASS}
                                >
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Loai phieu <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className={FIELD_CLASS}
                                >
                                    <option value="PURCHASE">PURCHASE</option>
                                    <option value="BUY_BACK">BUY_BACK</option>
                                    <option value="TRADE_IN">TRADE_IN</option>
                                    <option value="CONSIGNMENT">CONSIGNMENT</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-slate-900">
                                        Ghi chu
                                    </label>
                                    <span className="text-xs text-slate-400">{notes.length}/500</span>
                                </div>
                                <textarea
                                    value={notes}
                                    maxLength={500}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Nhap ghi chu khong bat buoc..."
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={<PackagePlus className="h-5 w-5" />}
                            title="Danh sach watch"
                            description="Chon nhieu anh tu NAS, he thong se do vao cac dong dang trong truoc roi moi them dong moi."
                            actions={
                                <>
                                    <AcquisitionBulkImagePicker
                                        onImport={importPreparedImages}
                                        disabled={submitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={addWatchLine}
                                        disabled={submitting}
                                        className="inline-flex h-10 items-center gap-2 rounded-md border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Them dong watch
                                    </button>
                                </>
                            }
                        />

                        <div className="space-y-4 p-4">
                            {watchLines.map((line, index) => (
                                <WatchLineCard
                                    key={line.id}
                                    line={line}
                                    index={index}
                                    onChange={(next) => updateLine(line.id, next)}
                                    onRemove={() => removeLine(line.id)}
                                    canRemove={watchLines.length > 1}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={addWatchLine}
                                disabled={submitting}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed border-violet-200 bg-violet-50/40 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Plus className="h-4 w-4" />
                                Them dong watch
                            </button>
                        </div>
                    </section>
                </div>

                <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-700">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-slate-950">Luu phieu</div>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Phieu duoc tao o trang thai draft. Sau khi luu, he thong se hoi ban muon duyet luon hay tao phieu moi.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={submitting}
                            onClick={submit}
                            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Luu phieu nhap
                        </button>

                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => resetForm()}
                            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <PackagePlus className="h-4 w-4" />
                            Lam moi form
                        </button>
                    </div>
                </aside>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => router.push("/admin/acquisitions")}
                        className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        Huy
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:flex">
                            <WalletCards className="h-4 w-4 text-slate-400" />
                            {formatMoney(totalWatchCost, currency)}
                        </div>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={submit}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-violet-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Xac nhan & Tao phieu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
