"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    AlertTriangle,
    Plus,
    Trash2,
    Wrench,
    ScanSearch,
    Lock,
    ChevronDown,
    ChevronUp,
    Image as ImageIcon,
} from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";
import InlineImagePicker from "@/app/(admin)/admin/products/_components/InlineImagePicker";
import TechnicalImagePicker from "@/components/media/TechnicalImagePicker";

type Props = {
    serviceRequestId: string;
    panel: any;
    onSaved?: () => void | Promise<void>;
    readOnly?: boolean;
};

type MachineType = "MECHANICAL" | "QUARTZ";
type HealthStatus = "GOOD" | "ISSUE";
type ExecutionType = "INHOUSE" | "VENDOR";

type MovementAction =
    | "SERVICE"
    | "REPLACE_PART"
    | "REGULATE"
    | "WATERPROOF"
    | "REPLACE_MOVEMENT"
    | "BATTERY_CHANGE";

type CosmeticAction =
    | "SPA_CASE"
    | "POLISH_CASE"
    | "REPLATE_CASE"
    | "POLISH_GLASS"
    | "REPLACE_GLASS"
    | "CLEAN_DIAL"
    | "REPLACE_DIAL"
    | "KEEP_ORIGINAL";

type CrownAction =
    | "FIX_CROWN"
    | "REPLACE_CROWN"
    | "RETHREAD"
    | "STEM_ADJUST"
    | "WATERPROOF";

type MovementLine = {
    id: string;
    sourceIssueId?: string;
    action?: MovementAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
    summary?: string;
    boardStatus?: string;
    isFromBoard?: boolean;
};

type QuickIssue = {
    enabled: boolean;
    action?: CosmeticAction;
    execution?: ExecutionType;
    vendorId?: string;
    estimatedCost?: string;
    sourceIssueId?: string;
    summary?: string;
    boardStatus?: string;
    isFromBoard?: boolean;
};

type CrownIssue = {
    status: HealthStatus;
    action?: CrownAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
    sourceIssueId?: string;
    summary?: string;
    boardStatus?: string;
    isFromBoard?: boolean;
};

type ScoreBlock = {
    issues: string[];
    manualDeduction: string;
};

type FormState = {
    machineType: MachineType;
    movementStatus: HealthStatus;
    showBeforeSpecs: boolean;
    beforeSpecs: { rate: string; amp: string; err: string };
    afterSpecs: { rate: string; amp: string; err: string };
    movementLines: MovementLine[];
    caseIssue: QuickIssue;
    crystalIssue: QuickIssue;
    dialIssue: QuickIssue;
    crownIssue: CrownIssue;
    appearance: {
        case: ScoreBlock;
        crystal: ScoreBlock;
        dial: ScoreBlock;
    };
    technicalImageFileKey: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function parseMoney(value?: string | number) {
    if (value === undefined || value === null || value === "") return 0;
    const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function parseNumber(value?: string) {
    if (!value) return 0;
    const numeric = Number(value.toString().replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function makeId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
}

function mapMovementSpecLabelToMachineType(
    movementSpecLabel?: string | null
): MachineType {
    const raw = String(movementSpecLabel || "").toUpperCase();
    if (
        raw.includes("QUARTZ") ||
        raw.includes("SOLAR") ||
        raw.includes("KINETIC") ||
        raw.includes("MECHAQUARTZ")
    ) {
        return "QUARTZ";
    }
    return "MECHANICAL";
}

function emptyQuickIssue(): QuickIssue {
    return {
        enabled: false,
        action: undefined,
        execution: "INHOUSE",
        vendorId: undefined,
        estimatedCost: "",
        sourceIssueId: undefined,
        summary: "",
        boardStatus: "",
        isFromBoard: false,
    };
}

function createInitialFormState(machineType: MachineType): FormState {
    return {
        machineType,
        movementStatus: "GOOD",
        showBeforeSpecs: false,
        beforeSpecs: { rate: "", amp: "", err: "" },
        afterSpecs: { rate: "", amp: "", err: "" },
        movementLines: [{ id: makeId(), execution: "INHOUSE", cost: "", isFromBoard: false }],
        caseIssue: emptyQuickIssue(),
        crystalIssue: emptyQuickIssue(),
        dialIssue: emptyQuickIssue(),
        crownIssue: {
            status: "GOOD",
            action: undefined,
            execution: "INHOUSE",
            vendorId: undefined,
            partId: undefined,
            cost: "",
            sourceIssueId: undefined,
            summary: "",
            boardStatus: "",
            isFromBoard: false,
        },
        appearance: {
            case: { issues: [], manualDeduction: "" },
            crystal: { issues: [], manualDeduction: "" },
            dial: { issues: [], manualDeduction: "" },
        },
        technicalImageFileKey: "",
    };
}

function calculateAppearanceScore(
    block: ScoreBlock,
    definitions: { code: string; label: string; deduction: number }[]
) {
    const issueDeduction = block.issues.reduce((sum, code) => {
        const found = definitions.find((item) => item.code === code);
        return sum + (found?.deduction ?? 0);
    }, 0);
    const manual = Math.max(0, parseNumber(block.manualDeduction));
    return Math.max(0, 100 - issueDeduction - manual);
}

function buildTechnicalSummaryForSale(params: {
    machineStatus: HealthStatus;
    machineIssueTitles: string[];
    appearanceScore: number;
    appearanceDefects: string[];
    afterSpecs?: { rate?: string; amp?: string; err?: string } | null;
    machineType: MachineType;
}) {
    const {
        machineStatus,
        machineIssueTitles,
        appearanceScore,
        appearanceDefects,
        afterSpecs,
        machineType,
    } = params;

    const machineText =
        machineStatus === "GOOD" || machineIssueTitles.length === 0
            ? "Máy: Tốt"
            : `Máy: Cần thao tác kỹ thuật - ${machineIssueTitles.join(", ")}`;

    const appearanceText =
        appearanceDefects.length > 0
            ? `Ngoại hình: ${appearanceScore}/100 • ${appearanceDefects.join(", ")}`
            : `Ngoại hình: ${appearanceScore}/100 • Không ghi nhận khuyết điểm đáng kể`;

    const rate = String(afterSpecs?.rate || "").trim();
    const amp = String(afterSpecs?.amp || "").trim();
    const err = String(afterSpecs?.err || "").trim();

    const measurementText =
        machineType === "MECHANICAL" && (rate || amp || err)
            ? `Thông số máy đo: ${[
                rate ? `Rate ${rate}` : null,
                amp ? `Amp ${amp}` : null,
                err ? `Err ${err}` : null,
            ]
                .filter(Boolean)
                .join(" • ")}`
            : null;

    return [machineText, appearanceText, measurementText]
        .filter(Boolean)
        .join("\n");
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
        <div className="space-y-2">
            <div>
                <div className="text-sm font-medium text-slate-700">{label}</div>
                {hint ? <div className="mt-0.5 text-xs text-slate-500">{hint}</div> : null}
            </div>
            {children}
        </div>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500",
                props.className
            )}
        />
    );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500",
                props.className
            )}
        />
    );
}

function Button({
    children,
    variant = "primary",
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "ghost";
}) {
    const styles = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
        outline: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
    };

    return (
        <button
            {...props}
            className={cx(
                "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                styles[variant],
                className
            )}
        >
            {children}
        </button>
    );
}

function SectionCard({
    title,
    subtitle,
    icon,
    badge,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>
                    <div>
                        <div className="text-base font-semibold text-slate-900">{title}</div>
                        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
                    </div>
                </div>
                {badge}
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </section>
    );
}

function ScorePill({ score }: { score: number }) {
    const tone =
        score >= 90
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : score >= 75
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-red-200 bg-red-50 text-red-700";

    return (
        <span className={cx("inline-flex rounded-full border px-3 py-1 text-sm font-semibold", tone)}>
            {score}/100
        </span>
    );
}

function StaticStatusPill({
    value,
    goodText,
    issueText,
}: {
    value: HealthStatus;
    goodText: string;
    issueText: string;
}) {
    return (
        <span
            className={cx(
                "inline-flex rounded-full border px-3 py-1.5 text-sm font-medium",
                value === "GOOD"
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
            )}
        >
            {value === "GOOD" ? goodText : issueText}
        </span>
    );
}

function StatusToggle({
    value,
    onChange,
    goodText,
    issueText,
    disabled = false,
}: {
    value: HealthStatus;
    onChange: (value: HealthStatus) => void;
    goodText: string;
    issueText: string;
    disabled?: boolean;
}) {
    if (disabled) {
        return <StaticStatusPill value={value} goodText={goodText} issueText={issueText} />;
    }

    return (
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
                type="button"
                onClick={() => onChange("GOOD")}
                className={cx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    value === "GOOD"
                        ? "border border-slate-300 bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                )}
            >
                {goodText}
            </button>
            <button
                type="button"
                onClick={() => onChange("ISSUE")}
                className={cx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    value === "ISSUE"
                        ? "border border-amber-200 bg-amber-50 text-amber-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                )}
            >
                {issueText}
            </button>
        </div>
    );
}

function IssueRow({
    index,
    title,
    modeLabel,
    costText,
    boardText,
    onOpenBoard,
    readOnly = false,
}: {
    index: number;
    title: string;
    modeLabel?: string;
    costText?: string;
    boardText?: string;
    onOpenBoard?: () => void;
    readOnly?: boolean;
}) {
    const tone =
        boardText?.includes("DONE")
            ? "bg-emerald-400"
            : boardText?.includes("PROCESS")
                ? "bg-sky-400"
                : boardText?.includes("CANCELED")
                    ? "bg-slate-300"
                    : "bg-amber-400";

    return (
        <div className="flex items-center gap-4 px-4 py-3 transition hover:bg-slate-50/60">
            <div className={cx("w-[3px] self-stretch rounded-full", tone)} />

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">#{index}</span>
                    <span className="truncate text-sm font-semibold text-slate-900">
                        {title}
                    </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {modeLabel ? <span>{modeLabel}</span> : null}
                    {boardText ? <span>{boardText}</span> : null}
                </div>
            </div>

            <div className="shrink-0 text-sm font-medium text-slate-700">
                {costText || "0đ"}
            </div>

            {!readOnly && onOpenBoard ? (
                <button
                    type="button"
                    onClick={onOpenBoard}
                    className="shrink-0 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    Issue Board →
                </button>
            ) : null}
        </div>
    );
}

function StaticIssueSummary({
    lineNo,
    summary,
    boardStatus,
    execution,
    cost,
    vendorName,
    partName,
    actionLabel,
    onGoBoard,
    readOnly = false,
}: {
    lineNo: number;
    summary?: string;
    boardStatus?: string;
    execution?: string;
    cost?: string;
    vendorName?: string;
    partName?: string;
    actionLabel?: string;
    onGoBoard: () => void;
    readOnly?: boolean;
}) {
    const metaParts = [
        actionLabel,
        execution ? (execution === "VENDOR" ? "Vendor" : "Nội bộ") : undefined,
        vendorName ? `Vendor: ${vendorName}` : undefined,
        partName ? `Linh kiện: ${partName}` : undefined,
    ].filter(Boolean) as string[];

    return (
        <IssueRow
            index={lineNo}
            title={summary || "Issue đã được ghi nhận và đang theo dõi tại Issue Board"}
            modeLabel={metaParts.join(" • ")}
            boardText={boardStatus ? `Board: ${boardStatus}` : undefined}
            costText={cost || "0đ"}
            onOpenBoard={onGoBoard}
            readOnly={readOnly || String(boardStatus || "").toUpperCase() === "CANCELED"}
        />
    );
}

function QuickIssueCard({
    title,
    open,
    issueMeta,
    staticView,
    onOpen,
    onClose,
    onGoBoard,
    children,
    isLocked,
}: {
    title: string;
    open: boolean;
    issueMeta?: any;
    staticView?: boolean;
    onOpen: () => void;
    onClose: () => void;
    onGoBoard: () => void;
    children: React.ReactNode;
    isLocked: boolean;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                        {open
                            ? issueMeta?.summary || "Đang chuẩn bị ghi nhận issue."
                            : "Không phát sinh issue ở hạng mục này."}
                    </div>
                </div>

                {!isLocked ? (
                    !open ? (
                        <Button type="button" variant="outline" onClick={onOpen}>
                            Mở issue
                        </Button>
                    ) : staticView ? (
                        <Button type="button" variant="outline" onClick={onGoBoard}>
                            Đi Issue Board
                        </Button>
                    ) : (
                        <Button type="button" variant="outline" onClick={onClose}>
                            Bỏ issue
                        </Button>
                    )
                ) : null}
            </div>

            {open ? (
                <div className="border-t border-slate-200 bg-white p-4">
                    {staticView ? (
                        <StaticIssueSummary
                            lineNo={1}
                            summary={issueMeta?.summary}
                            boardStatus={issueMeta?.boardStatus}
                            execution={issueMeta?.execution}
                            cost={
                                issueMeta?.estimatedCost
                                    ? formatCurrency(parseMoney(issueMeta.estimatedCost))
                                    : "0đ"
                            }
                            vendorName={issueMeta?.vendorName}
                            actionLabel={undefined}
                            onGoBoard={onGoBoard}
                            readOnly={isLocked}
                        />
                    ) : (
                        children
                    )}
                </div>
            ) : null}
        </div>
    );
}

function MovementIssueRow({
    index,
    line,
    machineType,
    parts,
    vendors,
    onChange,
    onRemove,
    canRemove,
    onGoBoard,
    isLocked,
}: {
    index: number;
    line: MovementLine;
    machineType: MachineType;
    parts: any[];
    vendors: any[];
    onChange: (patch: Partial<MovementLine>) => void;
    onRemove: () => void;
    canRemove: boolean;
    onGoBoard: () => void;
    isLocked: boolean;
}) {
    const isVendor = line.execution === "VENDOR";
    const isReplacePart = line.action === "REPLACE_PART";
    const vendorName = vendors.find((v: any) => v.id === line.vendorId)?.name ?? "";
    const partName = parts.find((p: any) => p.id === line.partId)?.name ?? "";

    if (line.isFromBoard) {
        const actionLabelMap: Record<string, string> = {
            SERVICE: "Lau dầu / service máy",
            REPLACE_PART: "Thay linh kiện",
            REGULATE: "Chỉnh sai số / dây tóc",
            WATERPROOF: "Chống nước",
            REPLACE_MOVEMENT: "Thay máy mới",
            BATTERY_CHANGE: "Thay pin",
        };

        return (
            <StaticIssueSummary
                lineNo={index + 1}
                summary={line.summary || (line.action ? actionLabelMap[line.action] || line.action : undefined)}
                boardStatus={line.boardStatus}
                execution={line.execution}
                cost={formatCurrency(parseMoney(line.cost))}
                vendorName={vendorName}
                partName={partName}
                actionLabel={line.action ? actionLabelMap[line.action] || line.action : undefined}
                onGoBoard={onGoBoard}
                readOnly={isLocked}
            />
        );
    }

    return (
        <div className="rounded-2xl bg-slate-50/70 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Dòng #{index + 1}</span>
                        <span className="text-xs text-slate-400">Đang soạn</span>
                    </div>
                </div>

                {canRemove && !isLocked ? (
                    <Button
                        type="button"
                        variant="ghost"
                        className="px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                ) : null}
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr_180px]">
                <Field label="Xử lý">
                    <SelectInput
                        value={line.action ?? ""}
                        onChange={(e) =>
                            onChange({
                                action: e.target.value as MovementAction,
                                partId: e.target.value === "REPLACE_PART" ? line.partId : undefined,
                            })
                        }
                        disabled={isLocked}
                    >
                        <option value="">Chọn xử lý</option>
                        {machineType === "MECHANICAL" ? (
                            <>
                                <option value="SERVICE">Lau dầu / service máy</option>
                                <option value="REPLACE_PART">Thay linh kiện</option>
                                <option value="REGULATE">Chỉnh sai số / dây tóc</option>
                                <option value="WATERPROOF">Chống nước</option>
                                <option value="REPLACE_MOVEMENT">Thay máy mới</option>
                            </>
                        ) : (
                            <>
                                <option value="BATTERY_CHANGE">Thay pin</option>
                                <option value="REPLACE_PART">Thay linh kiện</option>
                                <option value="WATERPROOF">Chống nước</option>
                                <option value="REPLACE_MOVEMENT">Thay máy mới</option>
                            </>
                        )}
                    </SelectInput>
                </Field>

                <Field label="Thực hiện">
                    <SelectInput
                        value={line.execution ?? "INHOUSE"}
                        onChange={(e) =>
                            onChange({
                                execution: e.target.value as ExecutionType,
                                vendorId: e.target.value === "VENDOR" ? line.vendorId : undefined,
                            })
                        }
                        disabled={isLocked}
                    >
                        <option value="INHOUSE">Nội bộ</option>
                        <option value="VENDOR">Vendor</option>
                    </SelectInput>
                </Field>

                <Field label="Chi phí">
                    <TextInput
                        inputMode="numeric"
                        placeholder="0"
                        value={line.cost ?? ""}
                        onChange={(e) => onChange({ cost: e.target.value })}
                        disabled={isLocked}
                    />
                </Field>
            </div>

            {(isReplacePart || isVendor) ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {isReplacePart ? (
                        <Field label="Linh kiện">
                            <SelectInput
                                value={line.partId ?? ""}
                                onChange={(e) => onChange({ partId: e.target.value })}
                                disabled={isLocked}
                            >
                                <option value="">Chọn linh kiện</option>
                                {parts.map((part: any) => (
                                    <option key={part.id} value={part.id}>
                                        {part.code ? `${part.code} - ` : ""}{part.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                    ) : <div />}

                    {isVendor ? (
                        <Field label="Vendor">
                            <SelectInput
                                value={line.vendorId ?? ""}
                                onChange={(e) => onChange({ vendorId: e.target.value })}
                                disabled={isLocked}
                            >
                                <option value="">Chọn vendor</option>
                                {vendors.map((vendor: any) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                    ) : <div />}
                </div>
            ) : null}
        </div>
    );
}

function MeasurementCompact({
    machineType,
    value,
    onChange,
    disabled,
}: {
    machineType: MachineType;
    value: {
        beforeSpecs: { rate: string; amp: string; err: string };
        afterSpecs: { rate: string; amp: string; err: string };
        showBeforeSpecs: boolean;
    };
    onChange: (patch: Partial<FormState>) => void;
    disabled?: boolean;
}) {
    const [open, setOpen] = React.useState(false);

    if (machineType !== "MECHANICAL") return null;

    const hasAfter =
        value.afterSpecs.rate || value.afterSpecs.amp || value.afterSpecs.err;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Thông số máy đo</div>
                    <div className="mt-1 text-xs text-slate-500">
                        Rate / Amp / Err sau xử lý. Có thể mở rộng để nhập thông số trước xử lý nếu cần.
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={disabled}
                >
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {open ? "Thu gọn" : hasAfter ? "Sửa thông số" : "Nhập thông số"}
                </button>
            </div>

            {!open ? (
                <div className="grid gap-3 border-t border-slate-100 px-4 py-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Rate</div>
                        <div className="mt-1 text-base font-semibold text-slate-900">
                            {value.afterSpecs.rate || "-"}
                        </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Amp</div>
                        <div className="mt-1 text-base font-semibold text-slate-900">
                            {value.afterSpecs.amp || "-"}
                        </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Err</div>
                        <div className="mt-1 text-base font-semibold text-slate-900">
                            {value.afterSpecs.err || "-"}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Rate">
                            <TextInput
                                value={value.afterSpecs.rate}
                                onChange={(e) =>
                                    onChange({
                                        afterSpecs: { ...value.afterSpecs, rate: e.target.value },
                                    } as Partial<FormState>)
                                }
                                placeholder="+8"
                                disabled={disabled}
                            />
                        </Field>
                        <Field label="Amp">
                            <TextInput
                                value={value.afterSpecs.amp}
                                onChange={(e) =>
                                    onChange({
                                        afterSpecs: { ...value.afterSpecs, amp: e.target.value },
                                    } as Partial<FormState>)
                                }
                                placeholder="248"
                                disabled={disabled}
                            />
                        </Field>
                        <Field label="Err">
                            <TextInput
                                value={value.afterSpecs.err}
                                onChange={(e) =>
                                    onChange({
                                        afterSpecs: { ...value.afterSpecs, err: e.target.value },
                                    } as Partial<FormState>)
                                }
                                placeholder="0.2"
                                disabled={disabled}
                            />
                        </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={value.showBeforeSpecs}
                            onChange={(e) => onChange({ showBeforeSpecs: e.target.checked })}
                            disabled={disabled}
                        />
                        Lưu thêm thông số trước xử lý
                    </label>

                    {value.showBeforeSpecs ? (
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field label="Rate trước xử lý">
                                <TextInput
                                    value={value.beforeSpecs.rate}
                                    onChange={(e) =>
                                        onChange({
                                            beforeSpecs: { ...value.beforeSpecs, rate: e.target.value },
                                        } as Partial<FormState>)
                                    }
                                    disabled={disabled}
                                />
                            </Field>
                            <Field label="Amp trước xử lý">
                                <TextInput
                                    value={value.beforeSpecs.amp}
                                    onChange={(e) =>
                                        onChange({
                                            beforeSpecs: { ...value.beforeSpecs, amp: e.target.value },
                                        } as Partial<FormState>)
                                    }
                                    disabled={disabled}
                                />
                            </Field>
                            <Field label="Err trước xử lý">
                                <TextInput
                                    value={value.beforeSpecs.err}
                                    onChange={(e) =>
                                        onChange({
                                            beforeSpecs: { ...value.beforeSpecs, err: e.target.value },
                                        } as Partial<FormState>)
                                    }
                                    disabled={disabled}
                                />
                            </Field>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default function TechnicalAssessmentInlinePanel({
    serviceRequestId,
    panel,
    onSaved,
    readOnly = false,
}: Props) {
    const notify = useNotify();
    const router = useRouter();

    const sr = panel?.serviceRequest ?? {};
    const catalogs = panel?.catalogs ?? {};
    const assessment = panel?.technicalAssessment ?? panel?.assessment ?? null;
    const technicalIssues = panel?.technicalIssues ?? [];
    const movementLabel = sr?.movement ?? null;
    const isCompleted = String(sr?.status || "").toUpperCase() === "COMPLETED";
    const isLocked = readOnly || isCompleted;

    const inheritedMachineType = React.useMemo<MachineType>(
        () => mapMovementSpecLabelToMachineType(movementLabel),
        [movementLabel]
    );

    const [form, setForm] = React.useState<FormState>(createInitialFormState(inheritedMachineType));
    const [saving, setSaving] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const vendors = catalogs?.vendors ?? [];
    const parts = catalogs?.mechanicalPartCatalogs ?? catalogs?.parts ?? [];
    const caseDefs =
        (catalogs?.appearanceIssues?.CASE ?? []).map((x: any) => ({
            code: x.code,
            label: x.label,
            deduction: Number(x.deductionScore ?? 0),
        })) ?? [];
    const crystalDefs =
        (catalogs?.appearanceIssues?.CRYSTAL ?? []).map((x: any) => ({
            code: x.code,
            label: x.label,
            deduction: Number(x.deductionScore ?? 0),
        })) ?? [];
    const dialDefs =
        (catalogs?.appearanceIssues?.DIAL ?? []).map((x: any) => ({
            code: x.code,
            label: x.label,
            deduction: Number(x.deductionScore ?? 0),
        })) ?? [];

    const caseDefectLabels = form.appearance.case.issues
        .map((code) => caseDefs.find((x: any) => x.code === code)?.label)
        .filter(Boolean) as string[];

    const crystalDefectLabels = form.appearance.crystal.issues
        .map((code) => crystalDefs.find((x: any) => x.code === code)?.label)
        .filter(Boolean) as string[];

    const dialDefectLabels = form.appearance.dial.issues
        .map((code) => dialDefs.find((x: any) => x.code === code)?.label)
        .filter(Boolean) as string[];

    const allAppearanceDefects = [
        ...caseDefectLabels,
        ...crystalDefectLabels,
        ...dialDefectLabels,
    ];

    const machineIssueTitles = technicalIssues
        .filter(
            (x: any) =>
                String(x.area || "").toUpperCase() === "MOVEMENT" &&
                String(x.executionStatus || "").toUpperCase() !== "CANCELED"
        )
        .map((x: any) => x.summary || x.note || "Issue máy")
        .filter(Boolean);

    React.useEffect(() => {
        const next = createInitialFormState(inheritedMachineType);

        if (assessment) {
            next.movementStatus = assessment.movementStatus === "ISSUE" ? "ISSUE" : "GOOD";
            next.showBeforeSpecs =
                assessment.preRate != null ||
                assessment.preAmplitude != null ||
                assessment.preBeatError != null;
            next.beforeSpecs = {
                rate: assessment.preRate != null ? String(assessment.preRate) : "",
                amp: assessment.preAmplitude != null ? String(assessment.preAmplitude) : "",
                err: assessment.preBeatError != null ? String(assessment.preBeatError) : "",
            };
            next.afterSpecs = {
                rate: assessment.postRate != null ? String(assessment.postRate) : "",
                amp: assessment.postAmplitude != null ? String(assessment.postAmplitude) : "",
                err: assessment.postBeatError != null ? String(assessment.postBeatError) : "",
            };
            next.technicalImageFileKey = assessment?.imageFileKey ?? "";
        }

        const movementIssues = technicalIssues.filter(
            (x: any) => String(x.area || "").toUpperCase() === "MOVEMENT"
        );

        if (movementIssues.length > 0) {
            next.movementStatus = "ISSUE";
            next.movementLines = movementIssues.map((issue: any) => ({
                id: makeId(),
                sourceIssueId: issue.id,
                action: undefined,
                execution:
                    String(issue.actionMode || "").toUpperCase() === "VENDOR"
                        ? "VENDOR"
                        : "INHOUSE",
                vendorId: issue.vendorId ?? "",
                partId: issue.mechanicalPartCatalogId ?? "",
                cost: issue.estimatedCost != null ? String(issue.estimatedCost) : "",
                summary: issue.summary ?? issue.note ?? "",
                boardStatus: issue.executionStatus ?? "",
                isFromBoard: true,
            }));
        }

        const caseIssue = technicalIssues.find(
            (x: any) => String(x.area || "").toUpperCase() === "CASE"
        );
        if (caseIssue) {
            next.caseIssue = {
                enabled: true,
                execution:
                    String(caseIssue.actionMode || "").toUpperCase() === "VENDOR"
                        ? "VENDOR"
                        : "INHOUSE",
                vendorId: caseIssue.vendorId ?? "",
                estimatedCost: caseIssue.estimatedCost != null ? String(caseIssue.estimatedCost) : "",
                sourceIssueId: caseIssue.id,
                summary: caseIssue.summary ?? caseIssue.note ?? "",
                boardStatus: caseIssue.executionStatus ?? "",
                isFromBoard: true,
            };
        }

        const crystalIssue = technicalIssues.find(
            (x: any) => String(x.area || "").toUpperCase() === "CRYSTAL"
        );
        if (crystalIssue) {
            next.crystalIssue = {
                enabled: true,
                execution:
                    String(crystalIssue.actionMode || "").toUpperCase() === "VENDOR"
                        ? "VENDOR"
                        : "INHOUSE",
                vendorId: crystalIssue.vendorId ?? "",
                estimatedCost: crystalIssue.estimatedCost != null ? String(crystalIssue.estimatedCost) : "",
                sourceIssueId: crystalIssue.id,
                summary: crystalIssue.summary ?? crystalIssue.note ?? "",
                boardStatus: crystalIssue.executionStatus ?? "",
                isFromBoard: true,
            };
        }

        const dialIssue = technicalIssues.find(
            (x: any) => String(x.area || "").toUpperCase() === "DIAL"
        );
        if (dialIssue) {
            next.dialIssue = {
                enabled: true,
                execution:
                    String(dialIssue.actionMode || "").toUpperCase() === "VENDOR"
                        ? "VENDOR"
                        : "INHOUSE",
                vendorId: dialIssue.vendorId ?? "",
                estimatedCost: dialIssue.estimatedCost != null ? String(dialIssue.estimatedCost) : "",
                sourceIssueId: dialIssue.id,
                summary: dialIssue.summary ?? dialIssue.note ?? "",
                boardStatus: dialIssue.executionStatus ?? "",
                isFromBoard: true,
            };
        }

        const crownIssue = technicalIssues.find(
            (x: any) => String(x.area || "").toUpperCase() === "CROWN"
        );
        if (crownIssue) {
            next.crownIssue = {
                status: "ISSUE",
                execution:
                    String(crownIssue.actionMode || "").toUpperCase() === "VENDOR"
                        ? "VENDOR"
                        : "INHOUSE",
                vendorId: crownIssue.vendorId ?? "",
                partId: crownIssue.mechanicalPartCatalogId ?? "",
                cost: crownIssue.estimatedCost != null ? String(crownIssue.estimatedCost) : "",
                sourceIssueId: crownIssue.id,
                summary: crownIssue.summary ?? crownIssue.note ?? "",
                boardStatus: crownIssue.executionStatus ?? "",
                isFromBoard: true,
            };
        }

        setForm(next);
    }, [assessment, inheritedMachineType, technicalIssues]);

    const caseScore = calculateAppearanceScore(form.appearance.case, caseDefs);
    const crystalScore = calculateAppearanceScore(form.appearance.crystal, crystalDefs);
    const dialScore = calculateAppearanceScore(form.appearance.dial, dialDefs);
    const appearanceScore = Math.round(caseScore * 0.4 + crystalScore * 0.2 + dialScore * 0.4);

    const movementCost = form.movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const crownCost = parseMoney(form.crownIssue.cost);
    const issueProposalCost =
        parseMoney(form.caseIssue.enabled ? form.caseIssue.estimatedCost : "") +
        parseMoney(form.crystalIssue.enabled ? form.crystalIssue.estimatedCost : "") +
        parseMoney(form.dialIssue.enabled ? form.dialIssue.estimatedCost : "");
    const totalCost = movementCost + crownCost + issueProposalCost;

    function addMovementLine() {
        if (isLocked) return;
        setForm((prev) => ({
            ...prev,
            movementLines: [...prev.movementLines, { id: makeId(), execution: "INHOUSE", cost: "", isFromBoard: false }],
        }));
    }

    function removeMovementLine(id: string) {
        if (isLocked) return;
        setForm((prev) => ({
            ...prev,
            movementLines: prev.movementLines.filter((line) => line.id !== id),
        }));
    }

    function updateMovementLine(id: string, patch: Partial<MovementLine>) {
        if (isLocked) return;
        setForm((prev) => ({
            ...prev,
            movementLines: prev.movementLines.map((line) =>
                line.id === id ? { ...line, ...patch } : line
            ),
        }));
    }

    function validateBeforeSave() {
        if (form.movementStatus === "ISSUE") {
            const editableMovementLines = form.movementLines.filter((x) => !x.isFromBoard);

            for (const [index, line] of editableMovementLines.entries()) {
                if (!String(line.action || "").trim()) {
                    throw new Error(`Dòng xử lý máy #${index + 1} chưa chọn phương án xử lý.`);
                }

                if (
                    String(line.execution || "").toUpperCase() === "VENDOR" &&
                    !String(line.vendorId || "").trim()
                ) {
                    throw new Error(`Dòng xử lý máy #${index + 1} đang chọn vendor nhưng chưa chọn vendor cụ thể.`);
                }

                if (
                    String(line.action || "").toUpperCase() === "REPLACE_PART" &&
                    !String(line.partId || "").trim()
                ) {
                    throw new Error(`Dòng xử lý máy #${index + 1} đang thay linh kiện nhưng chưa chọn linh kiện.`);
                }
            }
        }

        const quickBlocks = [
            { key: "Vỏ", data: form.caseIssue },
            { key: "Kính", data: form.crystalIssue },
            { key: "Mặt số", data: form.dialIssue },
        ];

        for (const block of quickBlocks) {
            if (block.data.enabled && !block.data.isFromBoard) {
                if (!String(block.data.action || "").trim()) {
                    throw new Error(`${block.key} đã mở issue nhưng chưa chọn phương án xử lý.`);
                }

                if (
                    String(block.data.execution || "").toUpperCase() === "VENDOR" &&
                    !String(block.data.vendorId || "").trim()
                ) {
                    throw new Error(`${block.key} đang chọn vendor nhưng chưa chọn vendor cụ thể.`);
                }
            }
        }

        if (form.machineType === "MECHANICAL" && !String(form.technicalImageFileKey || "").trim()) {
            throw new Error("Máy cơ bắt buộc phải có ít nhất 1 ảnh kỹ thuật.");
        }
    }

    function CollapsibleDefects({
        title,
        score,
        defects,
    }: {
        title: string;
        score: number;
        defects: string[];
    }) {
        const [open, setOpen] = React.useState(false);

        return (
            <div className="rounded-2xl border border-slate-200 bg-white">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                    <div>
                        <div className="text-sm font-semibold text-slate-900">{title}</div>
                        <div className="mt-1 text-xs text-slate-500">
                            {defects.length > 0 ? `${defects.length} khuyết điểm` : "Không ghi nhận khuyết điểm"}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ScorePill score={score} />
                        <span className="text-sm text-slate-400">{open ? "−" : "+"}</span>
                    </div>
                </button>

                {open ? (
                    <div className="border-t border-slate-200 px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                            {defects.length > 0 ? (
                                defects.map((item, index) => (
                                    <span
                                        key={`${item}-${index}`}
                                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                                    >
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-slate-500">Không có khuyết điểm được ghi nhận.</span>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    function TechnicalFinalSummary({
        machineIssueTitles,
        appearanceScore,
        appearanceDefects,
        machineStatus,
        machineType,
        afterSpecs,
    }: {
        machineIssueTitles: string[];
        appearanceScore: number;
        appearanceDefects: string[];
        machineStatus: HealthStatus;
        machineType: MachineType;
        afterSpecs: { rate: string; amp: string; err: string };
    }) {
        const summaryText = buildTechnicalSummaryForSale({
            machineStatus,
            machineIssueTitles,
            appearanceScore,
            appearanceDefects,
            afterSpecs,
            machineType,
        });

        return (
            <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">Kết quả kỹ thuật gửi sale</div>

                    <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {summaryText}
                    </div>
                </div>
            </div>
        );
    }

    async function handleSave() {
        if (isLocked) return;

        try {
            setSaving(true);
            setErrorMessage(null);

            validateBeforeSave();

            const generatedConclusion = buildTechnicalSummaryForSale({
                machineStatus: form.movementStatus,
                machineIssueTitles,
                appearanceScore,
                appearanceDefects: allAppearanceDefects,
                afterSpecs: form.afterSpecs,
                machineType: form.machineType,
            });

            const payload = {
                serviceRequestId,
                movement: {
                    machineType: form.machineType,
                    status: form.movementStatus,
                    beforeSpecs:
                        form.machineType === "MECHANICAL" && form.showBeforeSpecs
                            ? form.beforeSpecs
                            : undefined,
                    afterSpecs:
                        form.machineType === "MECHANICAL"
                            ? form.afterSpecs
                            : undefined,
                    lines:
                        form.movementStatus === "ISSUE"
                            ? form.movementLines
                                .filter((line) => !line.isFromBoard)
                                .map((line) => ({
                                    action: line.action,
                                    execution: line.execution,
                                    vendorId: line.vendorId || undefined,
                                    partId: line.partId || undefined,
                                    cost: parseMoney(line.cost),
                                }))
                            : [],
                },
                appearance: {
                    score: appearanceScore,
                    case: {
                        score: caseScore,
                        issues: form.appearance.case.issues,
                        manualDeduction: parseNumber(form.appearance.case.manualDeduction),
                        proposal: form.caseIssue.isFromBoard
                            ? {
                                enabled: true,
                                action: undefined,
                                execution: form.caseIssue.execution,
                                vendorId: form.caseIssue.vendorId || undefined,
                                estimatedCost: parseMoney(form.caseIssue.estimatedCost),
                                requiresApproval: false,
                            }
                            : {
                                enabled: form.caseIssue.enabled,
                                action: form.caseIssue.action,
                                execution: form.caseIssue.execution,
                                vendorId: form.caseIssue.vendorId || undefined,
                                estimatedCost: parseMoney(form.caseIssue.estimatedCost),
                                requiresApproval: false,
                            },
                    },
                    glass: {
                        score: crystalScore,
                        issues: form.appearance.crystal.issues,
                        manualDeduction: parseNumber(form.appearance.crystal.manualDeduction),
                        proposal: form.crystalIssue.isFromBoard
                            ? {
                                enabled: true,
                                action: undefined,
                                execution: form.crystalIssue.execution,
                                vendorId: form.crystalIssue.vendorId || undefined,
                                estimatedCost: parseMoney(form.crystalIssue.estimatedCost),
                                requiresApproval: false,
                            }
                            : {
                                enabled: form.crystalIssue.enabled,
                                action: form.crystalIssue.action,
                                execution: form.crystalIssue.execution,
                                vendorId: form.crystalIssue.vendorId || undefined,
                                estimatedCost: parseMoney(form.crystalIssue.estimatedCost),
                                requiresApproval: false,
                            },
                    },
                    dial: {
                        score: dialScore,
                        issues: form.appearance.dial.issues,
                        manualDeduction: parseNumber(form.appearance.dial.manualDeduction),
                        proposal: form.dialIssue.isFromBoard
                            ? {
                                enabled: true,
                                action: undefined,
                                execution: form.dialIssue.execution,
                                vendorId: form.dialIssue.vendorId || undefined,
                                estimatedCost: parseMoney(form.dialIssue.estimatedCost),
                                requiresApproval: false,
                            }
                            : {
                                enabled: form.dialIssue.enabled,
                                action: form.dialIssue.action,
                                execution: form.dialIssue.execution,
                                vendorId: form.dialIssue.vendorId || undefined,
                                estimatedCost: parseMoney(form.dialIssue.estimatedCost),
                                requiresApproval: false,
                            },
                    },
                    crown: {
                        status: form.crownIssue.status,
                        action: form.crownIssue.isFromBoard ? undefined : form.crownIssue.action,
                        execution: form.crownIssue.execution,
                        vendorId: form.crownIssue.vendorId || undefined,
                        partId: form.crownIssue.partId || undefined,
                        cost: parseMoney(form.crownIssue.cost),
                    },
                },
                financialSummary: {
                    movementCost,
                    crownCost,
                    cosmeticProposalCost: issueProposalCost,
                    totalCost,
                },
                conclusion: generatedConclusion,
                imageFileKey: form.technicalImageFileKey || null,
            };

            const res = await fetch("/api/admin/service-requests/technical-assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Lưu đánh giá kỹ thuật thất bại");

            notify.success({
                title: "Đã lưu đánh giá kỹ thuật",
                message: "Phiếu kỹ thuật đã được cập nhật.",
            });

            await onSaved?.();
        } catch (e: any) {
            setErrorMessage(e?.message || "Lưu thất bại");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            {isLocked ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Service request đã hoàn tất. Phiếu kỹ thuật hiện ở chế độ chỉ xem.
                </div>
            ) : null}

            <SectionCard
                title="Đánh giá bộ máy"
                subtitle="Kiểm tra máy và ghi nhận issue kỹ thuật nếu cần."
                icon={<Wrench className="h-5 w-5" />}
                badge={
                    form.movementStatus === "GOOD" ? (
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                            Chạy tốt
                        </span>
                    ) : (
                        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700">
                            Cần xử lý
                        </span>
                    )
                }
            >
                <div className="grid gap-4 md:grid-cols-[260px_1fr]">
                    <Field label="Loại máy">
                        <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
                            {form.machineType === "MECHANICAL" ? "Máy cơ" : "Máy pin"}
                            <span className="ml-2 text-xs font-normal text-slate-500">
                                (kế thừa từ spec)
                            </span>
                        </div>
                    </Field>

                    <Field label="Tình trạng máy">
                        <StatusToggle
                            value={form.movementStatus}
                            onChange={(value) => setForm((prev) => ({ ...prev, movementStatus: value }))}
                            goodText="Chạy tốt"
                            issueText="Cần xử lý"
                            disabled={isLocked}
                        />
                    </Field>
                </div>

                <MeasurementCompact
                    machineType={form.machineType}
                    value={{
                        beforeSpecs: form.beforeSpecs,
                        afterSpecs: form.afterSpecs,
                        showBeforeSpecs: form.showBeforeSpecs,
                    }}
                    onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                    disabled={isLocked}
                />

                {form.movementStatus === "ISSUE" ? (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-amber-800">Máy cần xử lý kỹ thuật</div>
                                    <div className="mt-1 text-sm text-amber-700/90">
                                        Ghi nhận nhanh các hạng mục xử lý, Issue Board sẽ điều phối tiếp sau khi lưu phiếu.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Các dòng xử lý máy</div>
                                    <div className="text-sm text-slate-500">
                                        Dòng đã tạo issue sẽ khóa lại để chỉ hiển thị tổng quát. Dòng mới vẫn có thể chỉnh sửa.
                                    </div>
                                </div>

                                {!isLocked ? (
                                    <Button type="button" onClick={addMovementLine}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm dòng
                                    </Button>
                                ) : null}
                            </div>

                            <div className="space-y-3">
                                {form.movementLines.map((line, index) => (
                                    <MovementIssueRow
                                        key={line.id}
                                        index={index}
                                        line={line}
                                        machineType={form.machineType}
                                        parts={parts}
                                        vendors={vendors}
                                        canRemove={form.movementLines.length > 1 && !line.isFromBoard}
                                        onRemove={() => removeMovementLine(line.id)}
                                        onChange={(patch) => updateMovementLine(line.id, patch)}
                                        onGoBoard={() =>
                                            router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)
                                        }
                                        isLocked={isLocked}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </SectionCard>

            <SectionCard
                title="Ghi nhận issue nhanh"
                subtitle="Issue chỉ được ghi nhận thực sự khi phiếu được lưu thành công."
                icon={<ScanSearch className="h-5 w-5" />}
            >
                <QuickIssueCard
                    title="Vỏ"
                    open={form.caseIssue.enabled}
                    issueMeta={form.caseIssue}
                    staticView={form.caseIssue.isFromBoard}
                    onOpen={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            caseIssue: { ...prev.caseIssue, enabled: true, isFromBoard: false },
                        }));
                    }}
                    onClose={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            caseIssue: emptyQuickIssue(),
                        }));
                    }}
                    onGoBoard={() =>
                        router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)
                    }
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Phương án xử lý">
                            <SelectInput
                                value={form.caseIssue.action ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        caseIssue: {
                                            ...prev.caseIssue,
                                            action: e.target.value as CosmeticAction,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="">Chọn phương án</option>
                                <option value="SPA_CASE">Spa vỏ nhẹ</option>
                                <option value="POLISH_CASE">Đánh bóng vỏ</option>
                                <option value="REPLATE_CASE">Mạ lại vỏ</option>
                                <option value="KEEP_ORIGINAL">Giữ nguyên</option>
                            </SelectInput>
                        </Field>
                        <Field label="Thực hiện">
                            <SelectInput
                                value={form.caseIssue.execution ?? "INHOUSE"}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        caseIssue: {
                                            ...prev.caseIssue,
                                            execution: e.target.value as ExecutionType,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>
                        <Field label="Chi phí dự kiến">
                            <TextInput
                                inputMode="numeric"
                                value={form.caseIssue.estimatedCost ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        caseIssue: {
                                            ...prev.caseIssue,
                                            estimatedCost: e.target.value,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            />
                        </Field>
                    </div>
                </QuickIssueCard>

                <QuickIssueCard
                    title="Kính"
                    open={form.crystalIssue.enabled}
                    issueMeta={form.crystalIssue}
                    staticView={form.crystalIssue.isFromBoard}
                    onOpen={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            crystalIssue: { ...prev.crystalIssue, enabled: true, isFromBoard: false },
                        }));
                    }}
                    onClose={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            crystalIssue: emptyQuickIssue(),
                        }));
                    }}
                    onGoBoard={() =>
                        router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)
                    }
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Phương án xử lý">
                            <SelectInput
                                value={form.crystalIssue.action ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        crystalIssue: {
                                            ...prev.crystalIssue,
                                            action: e.target.value as CosmeticAction,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="">Chọn phương án</option>
                                <option value="POLISH_GLASS">Đánh bóng kính</option>
                                <option value="REPLACE_GLASS">Thay kính</option>
                                <option value="KEEP_ORIGINAL">Giữ nguyên</option>
                            </SelectInput>
                        </Field>
                        <Field label="Thực hiện">
                            <SelectInput
                                value={form.crystalIssue.execution ?? "INHOUSE"}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        crystalIssue: {
                                            ...prev.crystalIssue,
                                            execution: e.target.value as ExecutionType,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>
                        <Field label="Chi phí dự kiến">
                            <TextInput
                                inputMode="numeric"
                                value={form.crystalIssue.estimatedCost ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        crystalIssue: {
                                            ...prev.crystalIssue,
                                            estimatedCost: e.target.value,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            />
                        </Field>
                    </div>
                </QuickIssueCard>

                <QuickIssueCard
                    title="Mặt số"
                    open={form.dialIssue.enabled}
                    issueMeta={form.dialIssue}
                    staticView={form.dialIssue.isFromBoard}
                    onOpen={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            dialIssue: { ...prev.dialIssue, enabled: true, isFromBoard: false },
                        }));
                    }}
                    onClose={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            dialIssue: emptyQuickIssue(),
                        }));
                    }}
                    onGoBoard={() =>
                        router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)
                    }
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Phương án xử lý">
                            <SelectInput
                                value={form.dialIssue.action ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        dialIssue: {
                                            ...prev.dialIssue,
                                            action: e.target.value as CosmeticAction,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="">Chọn phương án</option>
                                <option value="CLEAN_DIAL">Vệ sinh nhẹ</option>
                                <option value="REPLACE_DIAL">Thay mặt số</option>
                                <option value="KEEP_ORIGINAL">Giữ nguyên</option>
                            </SelectInput>
                        </Field>
                        <Field label="Thực hiện">
                            <SelectInput
                                value={form.dialIssue.execution ?? "INHOUSE"}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        dialIssue: {
                                            ...prev.dialIssue,
                                            execution: e.target.value as ExecutionType,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>
                        <Field label="Chi phí dự kiến">
                            <TextInput
                                inputMode="numeric"
                                value={form.dialIssue.estimatedCost ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        dialIssue: {
                                            ...prev.dialIssue,
                                            estimatedCost: e.target.value,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            />
                        </Field>
                    </div>
                </QuickIssueCard>
            </SectionCard>

            <SectionCard
                title="Tổng kết kỹ thuật"
                subtitle="Phần kết quả cuối cùng của kỹ thuật, đồng thời là nội dung sale sẽ nhìn thấy ở chi tiết sản phẩm."
                icon={<Wrench className="h-5 w-5" />}
                badge={
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                        Tổng chi phí: {formatCurrency(totalCost)}
                    </span>
                }
            >

                <div className="grid gap-4 lg:grid-cols-2">
                    <CollapsibleDefects
                        title="Vỏ"
                        score={caseScore}
                        defects={caseDefectLabels}
                    />

                    <CollapsibleDefects
                        title="Kính"
                        score={crystalScore}
                        defects={crystalDefectLabels}
                    />

                    <CollapsibleDefects
                        title="Mặt số"
                        score={dialScore}
                        defects={dialDefectLabels}
                    />

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-sm font-semibold text-slate-900">Điểm ngoại hình tổng</div>
                        <div className="mt-2 text-3xl font-semibold text-slate-900">{appearanceScore}/100</div>
                        <div className="mt-2 text-sm text-slate-500">
                            Điểm tổng kết cuối cùng cho sản phẩm sau đánh giá kỹ thuật.
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)] md:items-start">
                        <div className="flex justify-center md:justify-start">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
                                <TechnicalImagePicker
                                    value={form.technicalImageFileKey || null}
                                    onChange={(fileKey) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            technicalImageFileKey: fileKey,
                                        }))
                                    }
                                    disabled={isLocked}
                                    compact={false}
                                    className="h-16 w-16 rounded-xl border-0 bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="min-w-0 md:border-l md:border-slate-100 md:pl-4">
                            <div className="flex items-center gap-2">
                                <div className="text-sm font-semibold text-slate-950">
                                    Kết quả kỹ thuật gửi sale
                                </div>

                                {form.technicalImageFileKey ? (
                                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                                        Có ảnh kỹ thuật
                                    </span>
                                ) : (
                                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                        Chưa có ảnh
                                    </span>
                                )}
                            </div>

                            <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                                {buildTechnicalSummaryForSale({
                                    machineStatus: form.movementStatus,
                                    machineIssueTitles,
                                    appearanceScore,
                                    appearanceDefects: allAppearanceDefects,
                                    afterSpecs: form.afterSpecs,
                                    machineType: form.machineType,
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {isLocked ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Service request đã hoàn tất. Phiếu kỹ thuật hiện ở chế độ chỉ xem.
                    </div>
                ) : null}

                {errorMessage ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                {!isLocked ? (
                    <div className="flex flex-wrap justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)}
                        >
                            Đi tới Issue Board
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu đánh giá kỹ thuật"}
                        </Button>
                    </div>
                ) : null}
            </SectionCard>
        </div>
    );
}