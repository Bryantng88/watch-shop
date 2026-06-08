"use client";

import type { ReactNode } from "react";
import {
    Ban,
    Building2,
    CheckCircle2,
    CircleDashed,
    Clock3,
    CreditCard,
    FileText,
    FileWarning,
    Globe2,
    HandCoins,
    ImageIcon,
    Package,
    PackageOpen,
    RotateCcw,
    Send,
    Truck,
    WalletMinimal,
    Watch,
    Wrench,
    Check,
    DollarSign,
    PackageX,
    ClipboardList,
    BookOpen,

    Settings2,
    Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md";

export function DomainSignalIcon({
    icon,
    title,
    label,
    withLabel = false,
    size = "sm",
    className,
}: {
    icon: ReactNode;
    title?: string;
    label?: string;
    withLabel?: boolean;
    size?: Size;
    className?: string;
}) {
    const toneClass =
        className ?? "bg-slate-50 text-slate-500 ring-slate-200";

    return (
        <span
            title={title}
            aria-label={title}
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1",
                size === "xs" && (withLabel ? "h-5 gap-1 px-2 text-[10px]" : "h-5 w-5"),
                size === "sm" && (withLabel ? "h-6 gap-1.5 px-2 text-[11px]" : "h-6 w-6"),
                size === "md" && (withLabel ? "h-8 gap-2 px-3 text-xs" : "h-8 w-8"),
                toneClass,
            )}
        >
            <span
                className={cn(
                    size === "xs" && "[&>svg]:h-3 [&>svg]:w-3",
                    size === "sm" && "[&>svg]:h-3.5 [&>svg]:w-3.5",
                    size === "md" && "[&>svg]:h-4 [&>svg]:w-4",
                )}
            >
                {icon}
            </span>

            {withLabel && label ? <span>{label}</span> : null}
        </span>
    );
}

export function DomainSignalGroup({ children }: { children: ReactNode }) {
    return <div className="mt-2 flex flex-wrap items-center gap-1.5">{children}</div>;
}

export function DoneSignalIcon({
    title = "Hoàn tất",
    className,
}: {
    title?: string;
    className?: string;
}) {
    return (
        <DomainSignalIcon
            size="md"
            title={title}
            icon={<CheckCircle2 />}
            className={cn("bg-emerald-50 text-emerald-700 ring-emerald-200", className)}
        />
    );
}

export function ProductCountSignalIcon({ count }: { count?: number | string | null }) {
    const n = Number(count ?? 0);
    const Icon = n > 1 ? PackageOpen : Package;
    return <DomainSignalIcon title={n > 1 ? "Đơn nhiều sản phẩm" : "Đơn một sản phẩm"} icon={<Icon />} />;
}

export function OrderSourceSignalIcon({ source }: { source?: string | null }) {
    const value = String(source ?? "").toUpperCase();

    if (value === "WEB") return <DomainSignalIcon title="Nguồn đơn: Web" icon={<Globe2 />} />;
    if (value === "WATCH" || value === "WATCH_QUICK_ORDER") {
        return <DomainSignalIcon title="Nguồn đơn: Tạo từ watch" icon={<Watch />} />;
    }

    return <DomainSignalIcon title="Nguồn đơn: Tạo tay" icon={<Building2 />} />;
}

export function ReserveTypeSignalIcon({ reserveType }: { reserveType?: string | null }) {
    const value = String(reserveType ?? "").toUpperCase();

    if (value === "COD") return <DomainSignalIcon title="COD - thu tiền khi giao hàng" icon={<HandCoins />} />;
    if (value === "DEPOSIT") return <DomainSignalIcon title="Deposit - có cọc" icon={<WalletMinimal />} />;

    return <DomainSignalIcon title="Thanh toán full" icon={<CreditCard />} />;
}

export function WatchContentSignalIcon() {
    return <DomainSignalIcon title="Có content" icon={<FileText />} />;
}

export function WatchGalleryImageSignalIcon() {
    return <DomainSignalIcon title="Có ảnh gallery" icon={<ImageIcon />} />;
}

export function WatchServiceSignalIcon() {
    return <DomainSignalIcon title="Có service / kỹ thuật" icon={<Wrench />} />;
}

export function WatchReadinessSignalIcon({ state }: { state?: string | null }) {
    const value = String(state ?? "").toUpperCase();

    if (value === "APPROVED") {
        return <DoneSignalIcon title="Đã duyệt" />;
    }

    if (value === "POSTED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đã đăng"
                icon={<Send />}
                className="bg-violet-50 text-violet-600 ring-violet-100"
            />
        );
    }

    if (value === "PENDING") {
        return (
            <DomainSignalIcon
                size="md"
                title="Chờ duyệt"
                icon={<Clock3 />}
                className="bg-amber-50 text-amber-600 ring-amber-100"
            />
        );
    }

    if (value === "PARTIAL") {
        return (
            <DomainSignalIcon
                size="md"
                title="Duyệt một phần"
                icon={<FileWarning />}
                className="bg-orange-50 text-orange-600 ring-orange-100"
            />
        );
    }

    return (
        <DomainSignalIcon
            size="md"
            title="Chưa gửi duyệt"
            icon={<CircleDashed />}
            className="bg-slate-50 text-slate-400 ring-slate-200"
        />
    );
}

export function ShipmentStatusSignalIcon({ status }: { status?: string | null }) {
    const value = String(status ?? "").toUpperCase();

    if (value === "RETURNING") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đang hoàn"
                icon={<Truck className="-scale-x-100" />}
                className="bg-amber-50 text-amber-600 ring-amber-100"
            />
        );
    }

    if (value === "DELIVERED") {
        return <DoneSignalIcon title="Đã giao" />;
    }

    if (value === "SHIPPED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đang giao"
                icon={<Truck />}
                className="bg-amber-50 text-amber-600 ring-amber-100"
            />
        );
    }

    if (value === "RETURNED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Hoàn trả"
                icon={<PackageX />}
                className="bg-orange-50 text-orange-600 ring-orange-100"
            />
        );
    }

    if (value === "CANCELLED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đã huỷ"
                icon={<Ban />}
                className="bg-slate-100 text-slate-500 ring-slate-200"
            />
        );
    }

    return (
        <DomainSignalIcon
            size="md"
            title="Chờ giao"
            icon={<Package />}
            className="bg-blue-50 text-blue-600 ring-blue-100"
        />
    );
}
export function PaymentDoneSignalIcon() {
    return <DoneSignalIcon title="Đã thanh toán" />;
}

export function PaymentOpenSignalIcon() {
    return (
        <DomainSignalIcon
            size="md"
            title="Chưa thanh toán"
            icon={<CreditCard />}
            className="bg-slate-50 text-slate-400 ring-slate-200"
        />
    );
}

function toSignalNumber(value: number | string | null | undefined) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

type PaymentSignalState = "CANCELED" | "PAID" | "PARTIAL" | "UNPAID";

function resolvePaymentSignalState({
    status,
    totalAmount,
    remainingAmount,
    collectedAmount,
}: {
    status?: string | null;
    totalAmount?: number | string | null;
    remainingAmount?: number | string | null;
    collectedAmount?: number | string | null;
}): PaymentSignalState {
    const key = String(status ?? "").toUpperCase();
    const total = toSignalNumber(totalAmount);
    const remaining = toSignalNumber(remainingAmount);
    const collected = toSignalNumber(collectedAmount);

    // Quan trọng: trạng thái huỷ phải ưu tiên tuyệt đối.
    // Không được để rule `remaining <= 0` đẩy đơn đã huỷ sang PAID.
    if (key === "CANCELED" || key === "CANCELLED") {
        return "CANCELED";
    }

    if (key === "PAID" || key === "FULL_PAID" || key === "FULLY_PAID") {
        return "PAID";
    }

    if (
        key === "PARTIAL_PAID" ||
        key === "PARTIALLY_PAID" ||
        key === "PARTIAL" ||
        collected > 0 ||
        (total > 0 && remaining > 0 && remaining < total)
    ) {
        return "PARTIAL";
    }

    if (total > 0 && remaining <= 0) {
        return "PAID";
    }

    return "UNPAID";
}

export function PaymentStateSignalIcon(props: {
    status?: string | null;
    totalAmount?: number | string | null;
    remainingAmount?: number | string | null;
    collectedAmount?: number | string | null;
}) {
    const state = resolvePaymentSignalState(props);

    if (state === "CANCELED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Thanh toán đã huỷ"
                icon={<Ban />}
                className="bg-slate-100 text-slate-500 ring-slate-200"
            />
        );
    }

    if (state === "PAID") {
        return <DoneSignalIcon title="Đã thanh toán đủ" />;
    }

    const title =
        state === "PARTIAL"
            ? "Đã thanh toán một phần"
            : "Chưa thanh toán";

    return (
        <span
            title={title}
            aria-label={title}
            className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center"
        >
            <span
                className={cn(
                    "relative inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition",
                    state === "PARTIAL" && "bg-white text-amber-600 ring-amber-100",
                    state === "UNPAID" && "bg-slate-100 text-slate-400 ring-slate-300",
                )}
            >
                {state === "PARTIAL" ? (
                    <svg className="absolute inset-0 h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-200"
                        />
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="48 88"
                            strokeLinecap="round"
                            className="text-amber-500"
                        />
                    </svg>
                ) : null}

                <DollarSign className="relative z-10 h-4 w-4 stroke-[2.2]" />
            </span>
        </span>
    );
}


export const shipmentSignalLineClass = {
    READY: "bg-blue-200",
    SHIPPED: "bg-amber-200",
    DELIVERED: "bg-emerald-200",
} as const;

export const inactiveShipmentSignalClass =
    "bg-slate-50 text-slate-300 ring-slate-200";

export function ShipmentStateSignalIcon({
    status,
    className,
}: {
    status?: string | null;
    className?: string;
}) {
    const key = String(status ?? "").toUpperCase();
    if (key === "RETURNING") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đang hoàn"
                icon={<RotateCcw className="h-3.5 w-3.5 stroke-[2.4]" />}
                className="bg-orange-50 text-orange-600 ring-orange-100"
            />
        );
    }
    if (key === "DELIVERED") {
        return <DoneSignalIcon title="Đã giao" className={className} />;
    }

    if (key === "SHIPPED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đang giao"
                icon={<Truck />}
                className={cn("bg-amber-50 text-amber-600 ring-amber-100", className)}
            />
        );
    }

    if (key === "RETURNED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Hoàn trả"
                icon={<PackageX />}
                className={cn("bg-orange-50 text-orange-600 ring-orange-100", className)}
            />
        );
    }

    if (key === "CANCELLED" || key === "CANCELED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đã huỷ"
                icon={<Ban />}
                className={cn("bg-slate-100 text-slate-500 ring-slate-200", className)}
            />
        );
    }

    return (
        <DomainSignalIcon
            size="md"
            title="Chờ giao"
            icon={<Package />}
            className={cn("bg-blue-50 text-blue-600 ring-blue-100", className)}
        />
    );
}

export function TaskSignalIcon({
    count,
    title = "Task",
    onClick,
    disabled
}: {
    count?: number | string | null;
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
}) {
    const n = Number(count ?? 0);

    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled}
            className="relative inline-flex shrink-0"
        >
            <DomainSignalIcon
                size="sm"
                title={title}
                icon={<ClipboardList />}
                className={
                    n > 0
                        ? "bg-amber-50 text-amber-700 ring-amber-200"
                        : "bg-slate-50 text-slate-400 ring-slate-200"
                }
            />

            {n > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white">
                    {n > 9 ? "9+" : n}
                </span>
            ) : null}
        </button>
    );
}

export function WatchContentSectionSignalIcon({
    title = "Content",
}: {
    title?: string;
}) {
    return (
        <DomainSignalIcon
            size="sm"
            title={title}
            icon={<BookOpen />}
            className="bg-blue-50 text-blue-700 ring-blue-100"
        />
    );
}

export function WatchImageSectionSignalIcon({
    title = "Hình ảnh",
}: {
    title?: string;
}) {
    return (
        <DomainSignalIcon
            size="sm"
            title={title}
            icon={<ImageIcon />}
            className="bg-indigo-50 text-indigo-700 ring-indigo-100"
        />
    );
}

export function WatchSpecSectionSignalIcon({
    title = "Thông số",
}: {
    title?: string;
}) {
    return (
        <DomainSignalIcon
            size="sm"
            title={title}
            icon={<Settings2 />}
            className="bg-slate-50 text-slate-600 ring-slate-200"
        />
    );
}

export function WatchPricingSectionSignalIcon({
    title = "Pricing",
}: {
    title?: string;
}) {
    return (
        <DomainSignalIcon
            size="sm"
            title={title}
            icon={<Tag />}
            className="bg-emerald-50 text-emerald-700 ring-emerald-100"
        />
    );
}