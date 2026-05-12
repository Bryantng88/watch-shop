"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CircleDollarSign, Handshake, PackageCheck, RotateCcw, ShieldCheck, Wrench } from "lucide-react";

import { Button, FieldLabel, SectionCard } from "./shared";
import { transitionWatchStateAction } from "../../client/edit/watch-state.actions";
import type { WatchFormValues } from "../../client/form/watch-form.types";

type StatePatch = {
    header?: Partial<WatchFormValues["header"]>;
    basic?: Partial<WatchFormValues["basic"]>;
};

type Props = {
    productId: string;
    saleState: string;
    serviceState: string;
    stockState: string;
    productStatus: string;
    onChange: (patch: StatePatch) => void;
};

type ActionItem = {
    label: string;
    action: Parameters<typeof transitionWatchStateAction>[0]["action"];
    icon: React.ReactNode;
    variant?: "primary" | "outline" | "danger";
};

function formatState(value: string | null | undefined) {
    const v = String(value ?? "").trim();
    return v || "-";
}

function StatePill({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                {label}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
                {formatState(value)}
            </div>
        </div>
    );
}

export default function WatchStateSection({
    productId,
    saleState,
    serviceState,
    stockState,
    productStatus,
    onChange,
}: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const actions: ActionItem[] = [
        {
            label: "Sẵn sàng bán",
            action: "MARK_READY",
            icon: <PackageCheck className="h-4 w-4" />,
            variant: "primary",
        },
        {
            label: "Giữ khách",
            action: "MARK_HOLD",
            icon: <Handshake className="h-4 w-4" />,
            variant: "outline",
        },
        {
            label: "Bỏ giữ",
            action: "RELEASE_HOLD",
            icon: <RotateCcw className="h-4 w-4" />,
            variant: "outline",
        },
        {
            label: "Đã bán",
            action: "MARK_SOLD",
            icon: <CircleDollarSign className="h-4 w-4" />,
            variant: "danger",
        },
        {
            label: "Ký gửi",
            action: "MARK_CONSIGNED_TO",
            icon: <ShieldCheck className="h-4 w-4" />,
            variant: "outline",
        },
        {
            label: "Cần service",
            action: "MARK_SERVICE_PENDING",
            icon: <Wrench className="h-4 w-4" />,
            variant: "outline",
        },
        {
            label: "Đang service",
            action: "MARK_IN_SERVICE",
            icon: <Wrench className="h-4 w-4" />,
            variant: "outline",
        },
        {
            label: "Service xong",
            action: "MARK_SERVICE_DONE",
            icon: <PackageCheck className="h-4 w-4" />,
            variant: "outline",
        },
    ];

    const runAction = (action: ActionItem["action"]) => {
        startTransition(async () => {
            const result = await transitionWatchStateAction({ productId, action });

            onChange({
                header: {
                    status: result.productStatus,
                    serviceState: result.serviceState,
                },
                basic: {
                    saleState: result.saleState,
                    serviceState: result.serviceState,
                    stockState: result.stockState,
                },
            });

            router.refresh();
        });
    };

    return (
        <SectionCard
            icon={<PackageCheck className="h-5 w-5" />}
            title="Trạng thái bán hàng"
            subtitle="Không sửa tay trong form chính. Các trạng thái quan trọng đi qua transition để tránh lệch business."
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <StatePill label="Sale" value={saleState} />
                <StatePill label="Service" value={serviceState} />
                <StatePill label="Stock" value={stockState} />
                <StatePill label="Product" value={productStatus} />
            </div>

            <div className="mt-4">
                <FieldLabel>Action</FieldLabel>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    {actions.map((item) => (
                        <Button
                            key={item.action}
                            type="button"
                            variant={item.variant === "primary" ? "primary" : "outline"}
                            disabled={pending}
                            onClick={() => runAction(item.action)}
                            className={
                                item.variant === "danger"
                                    ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                    : "justify-start"
                            }
                        >
                            <span className="mr-2 inline-flex">{item.icon}</span>
                            {pending ? "Đang xử lý..." : item.label}
                        </Button>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
