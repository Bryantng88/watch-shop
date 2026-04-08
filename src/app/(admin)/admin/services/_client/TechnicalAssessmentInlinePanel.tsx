"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    AlertTriangle,
    Camera,
    ExternalLink,
    Plus,
    Trash2,
    Wrench,
    ScanSearch,
    Lock,
    ArrowRightCircle,
} from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";

type Props = {
    serviceRequestId: string;
    panel: any;
    onSaved?: () => void | Promise<void>;
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
    conclusion: string;
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
        conclusion: "",
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
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400",
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
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400",
                props.className
            )}
        />
    );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cx(
                "min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400",
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
                "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition disabled:opacity-50",
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

function StatusToggle({
    value,
    onChange,
    goodText,
    issueText,
}: {
    value: HealthStatus;
    onChange: (value: HealthStatus) => void;
    goodText: string;
    issueText: string;
}) {
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
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="grid gap-3 xl:grid-cols-[160px_minmax(0,1.2fr)_minmax(220px,0.9fr)_auto] xl:items-center">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-500" />
                        <div className="text-sm font-semibold text-slate-900">
                            Dòng #{lineNo}
                        </div>
                    </div>
                    <div className="mt-2 h-px w-16 bg-slate-300" />

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                            Issue đã tạo
                        </span>

                        {boardStatus ? (
                            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-700">
                                Board: {boardStatus}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                        {summary || "Issue đã được ghi nhận và đang theo dõi tại Issue Board"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {actionLabel ? (
                            <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                                {actionLabel}
                            </span>
                        ) : null}

                        {execution ? (
                            <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                                {execution === "VENDOR" ? "Vendor" : "Nội bộ"}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            Chi phí dự kiến: <span className="ml-1 font-semibold text-slate-900">{cost || "0đ"}</span>
                        </div>

                        {vendorName ? (
                            <div className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                Vendor: <span className="ml-1 font-semibold text-slate-900">{vendorName}</span>
                            </div>
                        ) : null}

                        {partName ? (
                            <div className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                Linh kiện: <span className="ml-1 font-semibold text-slate-900">{partName}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center xl:justify-end">
                    <Button type="button" variant="outline" onClick={onGoBoard} className="whitespace-nowrap">
                        <ArrowRightCircle className="mr-2 h-4 w-4" />
                        Xem ở Issue Board
                    </Button>
                </div>
            </div>
        </div>
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
}: {
    title: string;
    open: boolean;
    issueMeta?: any;
    staticView?: boolean;
    onOpen: () => void;
    onClose: () => void;
    onGoBoard: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                        {open
                            ? issueMeta?.summary || "Issue đã được ghi nhận."
                            : "Không phát sinh issue ở hạng mục này."}
                    </div>
                </div>

                {!open ? (
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
                )}
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
}) {
    const isVendor = line.execution === "VENDOR";
    const isReplacePart = line.action === "REPLACE_PART";
    const vendorName = vendors.find((v: any) => v.id === line.vendorId)?.name ?? "";
    const partName = parts.find((p: any) => p.id === line.partId)?.name ?? "";

    if (line.isFromBoard) {
        return (
            <StaticIssueSummary
                lineNo={index + 1}
                summary={line.summary || line.action}
                boardStatus={line.boardStatus}
                execution={line.execution}
                cost={formatCurrency(parseMoney(line.cost))}
                vendorName={vendorName}
                partName={partName}
                actionLabel={undefined}
                onGoBoard={onGoBoard}
            />
        );
    }
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-4 pt-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Dòng #{index + 1}</div>
                        <div className="mt-2 h-px w-20 bg-slate-300" />
                    </div>

                    {canRemove ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={onRemove}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    ) : (
                        <div className="h-8 w-8" />
                    )}
                </div>
            </div>

            <div className="space-y-4 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Xử lý">
                        <SelectInput
                            value={line.action ?? ""}
                            onChange={(e) =>
                                onChange({
                                    action: e.target.value as MovementAction,
                                    partId:
                                        e.target.value === "REPLACE_PART"
                                            ? line.partId
                                            : undefined,
                                })
                            }
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
                                    vendorId:
                                        e.target.value === "VENDOR"
                                            ? line.vendorId
                                            : undefined,
                                })
                            }
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
                        />
                    </Field>
                </div>

                {(isReplacePart || isVendor) ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {isReplacePart ? (
                            <Field label="Linh kiện">
                                <SelectInput
                                    value={line.partId ?? ""}
                                    onChange={(e) => onChange({ partId: e.target.value })}
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
        </div>
    );
}
export default function TechnicalAssessmentInlinePanel({
    serviceRequestId,
    panel,
    onSaved,
}: Props) {
    const notify = useNotify();
    const router = useRouter();

    const sr = panel?.serviceRequest ?? {};
    const catalogs = panel?.catalogs ?? {};
    const assessment = panel?.technicalAssessment ?? panel?.assessment ?? null;
    const technicalIssues = panel?.technicalIssues ?? [];
    const movementLabel = sr?.movement ?? null;
    const productId = sr?.productId ?? panel?.serviceRequest?.productId ?? null;

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
            next.conclusion = assessment.conclusion ?? "";
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
        setForm((prev) => ({
            ...prev,
            movementLines: [...prev.movementLines, { id: makeId(), execution: "INHOUSE", cost: "", isFromBoard: false }],
        }));
    }

    function removeMovementLine(id: string) {
        setForm((prev) => ({
            ...prev,
            movementLines: prev.movementLines.filter((line) => line.id !== id),
        }));
    }

    function updateMovementLine(id: string, patch: Partial<MovementLine>) {
        setForm((prev) => ({
            ...prev,
            movementLines: prev.movementLines.map((line) =>
                line.id === id ? { ...line, ...patch } : line
            ),
        }));
    }

    function markIssueOpened(title: string) {
        notify.success({
            title: "Đã ghi nhận issue",
            message: `${title} đã được mở issue. Phần điều phối tiếp theo sẽ xử lý tại Issue Board.`,
        });
    }

    async function handleSave() {
        try {
            setSaving(true);
            setErrorMessage(null);

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
                conclusion: form.conclusion,
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
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                            {sr?.primaryImageUrl ? (
                                <img
                                    src={`/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`}
                                    alt={sr?.productTitle || "product"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                    No image
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-sm">
                                <Camera className="h-4 w-4 text-slate-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xl font-semibold text-slate-900">{sr?.productTitle || "-"}</div>
                            <div className="text-sm text-slate-500">SKU: {sr?.skuSnapshot || "-"}</div>
                            <div className="text-sm text-slate-500">Bộ máy theo spec: {sr?.movement || "-"}</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {productId ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/admin/products/${productId}/edit`)}
                            >
                                Sửa spec sản phẩm
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        ) : null}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/services/issues-board")}
                        >
                            Đi tới Issue Board
                        </Button>

                        <ScorePill score={appearanceScore} />
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                            Tổng chi phí: {formatCurrency(totalCost)}
                        </span>
                    </div>
                </div>
            </div>

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
                        />
                    </Field>
                </div>

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
                                        Ghi nhận nhanh các hạng mục xử lý, Issue Board sẽ điều phối tiếp.
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

                                <Button type="button" onClick={addMovementLine}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm dòng
                                </Button>
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
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </SectionCard>

            <SectionCard
                title="Ghi nhận issue nhanh"
                subtitle="Issue đã tạo sẽ khóa tại phiếu và chỉ còn hiển thị tổng quát."
                icon={<ScanSearch className="h-5 w-5" />}
            >
                <QuickIssueCard
                    title="Vỏ"
                    open={form.caseIssue.enabled}
                    issueMeta={form.caseIssue}
                    staticView={form.caseIssue.isFromBoard}
                    onOpen={() => {
                        setForm((prev) => ({
                            ...prev,
                            caseIssue: { ...prev.caseIssue, enabled: true, isFromBoard: false },
                        }));
                        markIssueOpened("Issue phần vỏ");
                    }}
                    onClose={() =>
                        setForm((prev) => ({
                            ...prev,
                            caseIssue: emptyQuickIssue(),
                        }))
                    }
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
                        setForm((prev) => ({
                            ...prev,
                            crystalIssue: { ...prev.crystalIssue, enabled: true, isFromBoard: false },
                        }));
                        markIssueOpened("Issue phần kính");
                    }}
                    onClose={() =>
                        setForm((prev) => ({
                            ...prev,
                            crystalIssue: emptyQuickIssue(),
                        }))
                    }
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
                        setForm((prev) => ({
                            ...prev,
                            dialIssue: { ...prev.dialIssue, enabled: true, isFromBoard: false },
                        }));
                        markIssueOpened("Issue phần mặt số");
                    }}
                    onClose={() =>
                        setForm((prev) => ({
                            ...prev,
                            dialIssue: emptyQuickIssue(),
                        }))
                    }
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
                            />
                        </Field>
                    </div>
                </QuickIssueCard>
            </SectionCard>

            <SectionCard
                title="Tổng kết kỹ thuật"
                subtitle="Kết luận cuối cùng của kỹ thuật viên."
                icon={<Wrench className="h-5 w-5" />}
                badge={<ScorePill score={appearanceScore} />}
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Điểm ngoại hình</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">{appearanceScore}/100</div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Chi phí kỹ thuật</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(totalCost)}</div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Trạng thái đóng SR</div>
                        <div className="mt-2 text-base font-semibold text-slate-900">Sẵn sàng sau khi mọi issue hoàn tất</div>
                    </div>
                </div>

                <Field label="Kết luận kỹ thuật">
                    <TextArea
                        value={form.conclusion}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                conclusion: e.target.value,
                            }))
                        }
                    />
                </Field>

                {errorMessage ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="flex flex-wrap justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/services/issues-board")}
                    >
                        Đi tới Issue Board
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu đánh giá kỹ thuật"}
                    </Button>
                </div>
            </SectionCard>
        </div>
    );
}