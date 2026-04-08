"use client";

import * as React from "react";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleDollarSign,
    ClipboardList,
    ExternalLink,
    Lock,
    PencilLine,
} from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
    return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export function SectionCard({
    title,
    subtitle,
    actions,
    children,
}: {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-base font-semibold text-slate-950">{title}</div>
                    {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
                </div>
                {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function HeaderActionButton({
    children,
    onClick,
    primary = false,
    icon,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    primary?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                primary
                    ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
        >
            {icon}
            {children}
        </button>
    );
}

export function StatusBadge({ status }: { status?: string | null }) {
    const normalized = String(status || "").toUpperCase();

    const map: Record<string, string> = {
        COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
        IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-700",
        PENDING: "border-amber-200 bg-amber-50 text-amber-700",
        OPEN: "border-sky-200 bg-sky-50 text-sky-700",
        DRAFT: "border-slate-200 bg-slate-50 text-slate-700",
        CANCELED: "border-rose-200 bg-rose-50 text-rose-700",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                map[normalized] || "border-slate-200 bg-slate-50 text-slate-700"
            )}
        >
            {normalized || "-"}
        </span>
    );
}

export function ServiceRequestHeroCompact({
    imageSrc,
    title,
    sku,
    refValue,
    movement,
    model,
    status,
    scope,
    technician,
    updatedAt,
    appearanceScore,
    totalCost,
    onEditSpec,
    onOpenIssueBoard,
    hideIssueBoardAction = false,
}: {
    imageSrc?: string | null;
    title?: string | null;
    sku?: string | null;
    refValue?: string | null;
    movement?: string | null;
    model?: string | null;
    status?: string | null;
    scope?: string | null;
    technician?: string | null;
    updatedAt?: string | null;
    appearanceScore: number;
    totalCost: number;
    onEditSpec?: () => void;
    onOpenIssueBoard?: () => void;
    hideIssueBoardAction?: boolean;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex min-w-0 gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {imageSrc ? (
                            <img src={imageSrc} alt={title || "product"} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                No image
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={status} />
                            {scope ? (
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                                    {scope}
                                </span>
                            ) : null}
                        </div>

                        <h2 className="mt-3 line-clamp-2 text-2xl font-semibold tracking-tight text-slate-950">
                            {title || "-"}
                        </h2>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                            <span>SKU: <span className="font-medium text-slate-700">{sku || "-"}</span></span>
                            <span>Ref: <span className="font-medium text-slate-700">{refValue || "-"}</span></span>
                            <span>Model: <span className="font-medium text-slate-700">{model || "-"}</span></span>
                            <span>Máy: <span className="font-medium text-slate-700">{movement || "-"}</span></span>
                            <span>KTV: <span className="font-medium text-slate-700">{technician || "-"}</span></span>
                            <span>Cập nhật: <span className="font-medium text-slate-700">{updatedAt || "-"}</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 xl:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                            {appearanceScore}/100
                        </div>
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                            {formatCurrency(totalCost)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {onEditSpec ? (
                            <HeaderActionButton onClick={onEditSpec} icon={<PencilLine className="h-4 w-4" />}>
                                Sửa spec sản phẩm
                            </HeaderActionButton>
                        ) : null}

                        {!hideIssueBoardAction && onOpenIssueBoard ? (
                            <HeaderActionButton
                                onClick={onOpenIssueBoard}
                                primary
                                icon={<ExternalLink className="h-4 w-4" />}
                            >
                                Đi tới Issue Board
                            </HeaderActionButton>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function OverviewStatCard({
    label,
    value,
    helper,
    icon,
    accent = "slate",
}: {
    label: string;
    value: React.ReactNode;
    helper?: string;
    icon?: React.ReactNode;
    accent?: "slate" | "sky" | "emerald" | "amber";
}) {
    const accents: Record<string, string> = {
        slate: "before:bg-slate-300",
        sky: "before:bg-sky-400",
        emerald: "before:bg-emerald-400",
        amber: "before:bg-amber-400",
    };

    return (
        <div
            className={cx(
                "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1",
                accents[accent] || accents.slate
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        {label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
                    {helper ? <div className="mt-1 text-sm text-slate-500">{helper}</div> : null}
                </div>
                {icon ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500">
                        {icon}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function OverviewGrid({
    totalIssue,
    openIssue,
    doneIssue,
    vendorCount,
}: {
    totalIssue: number;
    openIssue: number;
    doneIssue: number;
    vendorCount: number;
}) {
    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <OverviewStatCard
                label="Tổng issue"
                value={totalIssue}
                helper="Tất cả hạng mục đã ghi nhận"
                accent="slate"
                icon={<ClipboardList className="h-5 w-5" />}
            />
            <OverviewStatCard
                label="Issue đang mở"
                value={openIssue}
                helper="Đang cần theo dõi tiếp"
                accent="sky"
                icon={<AlertTriangle className="h-5 w-5" />}
            />
            <OverviewStatCard
                label="Issue đã xong"
                value={doneIssue}
                helper="Đã xử lý hoàn tất"
                accent="emerald"
                icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <OverviewStatCard
                label="Số lần thuê vendor"
                value={vendorCount}
                helper="Tổng số hạng mục thuê ngoài"
                accent="amber"
                icon={<CircleDollarSign className="h-5 w-5" />}
            />
        </div>
    );
}

export function ReadonlyAlert({
    message,
    action,
}: {
    message: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="rounded-xl border border-amber-200 bg-white/80 p-2 text-amber-700">
                    <Lock className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold">Phiếu đã hoàn tất • Chế độ chỉ xem</div>
                    <div className="mt-1 text-sm text-amber-800">{message}</div>
                </div>
            </div>
            {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </div>
    );
}

export function CompletedSummaryCard({
    conclusion,
    points,
    totalCost,
    score,
}: {
    conclusion?: string | null;
    points: string[];
    totalCost: number;
    score: number;
}) {
    const normalizedPoints = points.filter(Boolean).slice(0, 6);

    return (
        <SectionCard
            title="Kết luận kỹ thuật"
            subtitle="Phiên bản rút gọn để xem nhanh kết quả service."
        >
            <div className="grid gap-4 lg:grid-cols-[1.4fr_280px]">
                <div className="rounded-2xl bg-slate-50/70 p-4">
                    <div className="text-sm font-semibold text-slate-800">Tóm tắt xử lý</div>

                    {conclusion ? (
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {conclusion}
                        </p>
                    ) : null}

                    {normalizedPoints.length > 0 ? (
                        <div className="mt-4 space-y-2">
                            {normalizedPoints.map((item, idx) => (
                                <div
                                    key={`${item}-${idx}`}
                                    className="flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-sm text-slate-700"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : !conclusion ? (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-sm text-slate-600">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                            Chưa có kết luận chi tiết. Mở phiếu để xem đầy đủ từng hạng mục.
                        </div>
                    ) : null}
                </div>

                <div className="space-y-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
                            Điểm thẩm mỹ
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-emerald-700">{score}/100</div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            Tổng phí service
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">
                            {formatCurrency(totalCost)}
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}