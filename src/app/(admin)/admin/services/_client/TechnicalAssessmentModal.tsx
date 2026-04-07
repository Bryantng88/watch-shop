"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Plus,
    Sparkles,
    Trash2,
    Wrench,
} from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved?: () => void | Promise<void>;
    serviceRequestId: string | null;

    productName?: string;
    productSku?: string | null;
    productImage?: string | null;
    movementSpecLabel?: string | null;

    initialSavedPayload?: any;
    initialAssessment?: any;
    initialIssues?: any[];
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

type AppearanceIssueCode = string;

type MovementLine = {
    id: string;
    action?: MovementAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
};

type CompactIssue = {
    enabled: boolean;
    action?: CosmeticAction;
    execution?: ExecutionType;
    vendorId?: string;
    estimatedCost?: string;
};

type CrownIssue = {
    status: HealthStatus;
    action?: CrownAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
};

type ScoreBlock = {
    issues: AppearanceIssueCode[];
    manualDeduction: string;
};

type FormState = {
    machineType: MachineType;
    movementStatus: HealthStatus;
    showBeforeSpecs: boolean;
    beforeSpecs: {
        rate: string;
        amp: string;
        err: string;
    };
    afterSpecs: {
        rate: string;
        amp: string;
        err: string;
    };
    movementLines: MovementLine[];

    caseIssue: CompactIssue;
    crystalIssue: CompactIssue;
    dialIssue: CompactIssue;
    crownIssue: CrownIssue;

    appearance: {
        case: ScoreBlock;
        crystal: ScoreBlock;
        dial: ScoreBlock;
    };

    conclusion: string;
    hasEditedConclusion: boolean;
};

type CatalogAppearanceIssue = {
    id: string;
    code: string;
    label: string;
    deductionScore: number;
};

type TechnicalCatalogs = {
    vendors: Array<{ id: string; name: string }>;
    parts?: Array<{ id: string; code: string; name: string }>;
    appearanceIssues: {
        CASE: CatalogAppearanceIssue[];
        CRYSTAL: CatalogAppearanceIssue[];
        DIAL: CatalogAppearanceIssue[];
    };
};

type PanelResponse = {
    serviceRequest?: {
        productId?: string | null;
    };
    assessment?: any;
    technicalAssessment?: any;
    technicalIssues?: any[];
    catalogs?: TechnicalCatalogs | null;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function makeId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
}

function parseMoney(value?: string | number) {
    if (value === undefined || value === null || value === "") return 0;
    const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function parseNumber(value?: string) {
    if (!value) return 0;
    const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
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

function emptyCompactIssue(): CompactIssue {
    return {
        enabled: false,
        action: undefined,
        execution: "INHOUSE",
        vendorId: undefined,
        estimatedCost: "",
    };
}

function createInitialState(machineType: MachineType): FormState {
    return {
        machineType,
        movementStatus: "GOOD",
        showBeforeSpecs: false,
        beforeSpecs: { rate: "", amp: "", err: "" },
        afterSpecs: { rate: "", amp: "", err: "" },
        movementLines: [{ id: makeId(), execution: "INHOUSE" }],

        caseIssue: emptyCompactIssue(),
        crystalIssue: emptyCompactIssue(),
        dialIssue: emptyCompactIssue(),
        crownIssue: {
            status: "GOOD",
            action: undefined,
            execution: "INHOUSE",
            vendorId: undefined,
            partId: undefined,
            cost: "",
        },

        appearance: {
            case: { issues: [], manualDeduction: "" },
            crystal: { issues: [], manualDeduction: "" },
            dial: { issues: [], manualDeduction: "" },
        },

        conclusion: "",
        hasEditedConclusion: false,
    };
}

function calculateAppearanceScore(
    block: ScoreBlock,
    definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]
) {
    const issueDeduction = block.issues.reduce((sum, code) => {
        const found = definitions.find((item) => item.code === code);
        return sum + (found?.deduction ?? 0);
    }, 0);

    const manual = Math.max(0, parseNumber(block.manualDeduction));
    return Math.max(0, 100 - issueDeduction - manual);
}

function issueSummary(
    block: ScoreBlock,
    definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]
) {
    return block.issues
        .map((code) => definitions.find((item) => item.code === code)?.label)
        .filter(Boolean)
        .join(", ");
}

function buildAutoConclusion(params: {
    machineType: MachineType;
    movementStatus: HealthStatus;
    movementLines: MovementLine[];
    caseScore: number;
    crystalScore: number;
    dialScore: number;
    appearanceScore: number;
    crownStatus: HealthStatus;
    caseSummary: string;
    crystalSummary: string;
    dialSummary: string;
}) {
    const {
        machineType,
        movementStatus,
        movementLines,
        caseScore,
        crystalScore,
        dialScore,
        appearanceScore,
        crownStatus,
        caseSummary,
        crystalSummary,
        dialSummary,
    } = params;

    const lines: string[] = [];

    lines.push(`Loại máy: ${machineType === "MECHANICAL" ? "Máy cơ" : "Máy pin"}.`);

    if (movementStatus === "GOOD") {
        lines.push("Bộ máy chạy ổn, chưa ghi nhận issue kỹ thuật.");
    } else {
        const count = movementLines.filter((x) => x.action).length;
        lines.push(`Bộ máy cần xử lý kỹ thuật${count > 0 ? ` (${count} hạng mục)` : ""}.`);
    }

    lines.push(caseSummary ? `Vỏ: ${caseSummary} (${caseScore}/100).` : `Vỏ: ổn (${caseScore}/100).`);
    lines.push(
        crystalSummary ? `Kính: ${crystalSummary} (${crystalScore}/100).` : `Kính: ổn (${crystalScore}/100).`
    );
    lines.push(dialSummary ? `Mặt số: ${dialSummary} (${dialScore}/100).` : `Mặt số: ổn (${dialScore}/100).`);
    lines.push(crownStatus === "ISSUE" ? "Núm: cần xử lý." : "Núm: hoạt động ổn.");
    lines.push(`Điểm ngoại hình tổng thể: ${appearanceScore}/100.`);

    return lines.join("\n");
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

function IssueQuickCard({
    title,
    open,
    onOpen,
    onClose,
    children,
}: {
    title: string;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                        {open
                            ? "Issue đã được ghi nhận. Phần điều phối tiếp theo xử lý ở Issue Board."
                            : "Không phát sinh issue ở hạng mục này."}
                    </div>
                </div>

                {open ? (
                    <Button type="button" variant="outline" onClick={onClose}>
                        Bỏ issue
                    </Button>
                ) : (
                    <Button type="button" variant="outline" onClick={onOpen}>
                        Mở issue
                    </Button>
                )}
            </div>

            {open ? <div className="border-t border-slate-200 bg-white p-4">{children}</div> : null}
        </div>
    );
}

function IssueChipGroup({
    options,
    selected,
    onChange,
}: {
    options: { code: AppearanceIssueCode; label: string; deduction: number }[];
    selected: AppearanceIssueCode[];
    onChange: (next: AppearanceIssueCode[]) => void;
}) {
    function toggle(code: AppearanceIssueCode) {
        if (selected.includes(code)) {
            onChange(selected.filter((x) => x !== code));
            return;
        }
        onChange([...selected, code]);
    }

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((item) => {
                const active = selected.includes(item.code);
                return (
                    <button
                        key={item.code}
                        type="button"
                        onClick={() => toggle(item.code)}
                        className={cx(
                            "rounded-full border px-3 py-2 text-sm transition",
                            active
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        {item.label} <span className="opacity-70">(-{item.deduction})</span>
                    </button>
                );
            })}
        </div>
    );
}

function CollapsibleScoreCard({
    title,
    score,
    summary,
    defaultOpen = false,
    children,
}: {
    title: string;
    score: number;
    summary: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);

    useEffect(() => {
        if (defaultOpen) setOpen(true);
    }, [defaultOpen]);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50"
            >
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 truncate text-sm text-slate-500">
                        {summary || "Chưa ghi nhận khuyết điểm"}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ScorePill score={score} />
                    {open ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                </div>
            </button>

            {open ? <div className="border-t border-slate-200 bg-slate-50/50 p-4">{children}</div> : null}
        </div>
    );
}

async function saveTechnicalAssessment(payload: any) {
    const res = await fetch("/api/admin/service-requests/technical-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let message = "Lưu đánh giá kỹ thuật thất bại";
        try {
            const data = await res.json();
            message = data?.error || message;
        } catch { }
        throw new Error(message);
    }

    return res.json();
}

export default function TechnicalAssessmentModal({
    open,
    onClose,
    onSaved,
    serviceRequestId,
    productName = "-",
    productSku = "-",
    productImage = null,
    movementSpecLabel = "-",
}: Props) {
    const router = useRouter();
    const notify = useNotify();

    const inheritedMachineType = useMemo<MachineType>(
        () => mapMovementSpecLabelToMachineType(movementSpecLabel),
        [movementSpecLabel]
    );

    const [form, setForm] = useState<FormState>(createInitialState(inheritedMachineType));
    const [catalogs, setCatalogs] = useState<TechnicalCatalogs | null>(null);
    const [panel, setPanel] = useState<PanelResponse | null>(null);
    const [panelLoading, setPanelLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const productId = panel?.serviceRequest?.productId ?? null;
    const vendors = catalogs?.vendors ?? [];
    const parts = catalogs?.parts ?? [];

    useEffect(() => {
        if (!open || !serviceRequestId) return;

        let cancelled = false;

        async function loadPanel() {
            try {
                setPanelLoading(true);
                setErrorMessage(null);

                const res = await fetch(
                    `/api/admin/service-requests/${serviceRequestId}/technical-assessment`,
                    { cache: "no-store" }
                );

                if (!res.ok) {
                    throw new Error("Load technical assessment failed");
                }

                const json = await res.json().catch(() => null);
                if (!json || cancelled) return;

                const data = json?.data ?? json;
                setPanel(data);
                setCatalogs(data?.catalogs ?? null);
                setForm((prev) => createInitialState(prev.machineType));
            } catch (e: any) {
                if (!cancelled) {
                    setErrorMessage(e?.message || "Không thể tải dữ liệu phiếu kỹ thuật");
                }
            } finally {
                if (!cancelled) setPanelLoading(false);
            }
        }

        loadPanel();

        return () => {
            cancelled = true;
        };
    }, [open, serviceRequestId]);

    const CASE_ISSUES = useMemo(
        () =>
            (catalogs?.appearanceIssues?.CASE ?? []).map((x) => ({
                code: x.code,
                label: x.label,
                deduction: x.deductionScore,
            })),
        [catalogs]
    );

    const CRYSTAL_ISSUES = useMemo(
        () =>
            (catalogs?.appearanceIssues?.CRYSTAL ?? []).map((x) => ({
                code: x.code,
                label: x.label,
                deduction: x.deductionScore,
            })),
        [catalogs]
    );

    const DIAL_ISSUES = useMemo(
        () =>
            (catalogs?.appearanceIssues?.DIAL ?? []).map((x) => ({
                code: x.code,
                label: x.label,
                deduction: x.deductionScore,
            })),
        [catalogs]
    );

    const caseScore = calculateAppearanceScore(form.appearance.case, CASE_ISSUES);
    const crystalScore = calculateAppearanceScore(form.appearance.crystal, CRYSTAL_ISSUES);
    const dialScore = calculateAppearanceScore(form.appearance.dial, DIAL_ISSUES);
    const appearanceScore = Math.round(caseScore * 0.4 + crystalScore * 0.2 + dialScore * 0.4);

    const caseSummary = issueSummary(form.appearance.case, CASE_ISSUES);
    const crystalSummary = issueSummary(form.appearance.crystal, CRYSTAL_ISSUES);
    const dialSummary = issueSummary(form.appearance.dial, DIAL_ISSUES);

    const movementCost = form.movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const crownCost = parseMoney(form.crownIssue.cost);
    const issueProposalCost =
        parseMoney(form.caseIssue.enabled ? form.caseIssue.estimatedCost : "") +
        parseMoney(form.crystalIssue.enabled ? form.crystalIssue.estimatedCost : "") +
        parseMoney(form.dialIssue.enabled ? form.dialIssue.estimatedCost : "");
    const totalCost = movementCost + crownCost + issueProposalCost;

    const autoConclusion = useMemo(
        () =>
            buildAutoConclusion({
                machineType: form.machineType,
                movementStatus: form.movementStatus,
                movementLines: form.movementLines,
                caseScore,
                crystalScore,
                dialScore,
                appearanceScore,
                crownStatus: form.crownIssue.status,
                caseSummary,
                crystalSummary,
                dialSummary,
            }),
        [
            form.machineType,
            form.movementStatus,
            form.movementLines,
            caseScore,
            crystalScore,
            dialScore,
            appearanceScore,
            form.crownIssue.status,
            caseSummary,
            crystalSummary,
            dialSummary,
        ]
    );

    useEffect(() => {
        if (!form.hasEditedConclusion) {
            setForm((prev) => ({ ...prev, conclusion: autoConclusion }));
        }
    }, [autoConclusion, form.hasEditedConclusion]);

    function addMovementLine() {
        setForm((prev) => ({
            ...prev,
            movementLines: [...prev.movementLines, { id: makeId(), execution: "INHOUSE" }],
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
        if (!serviceRequestId) {
            setErrorMessage("Thiếu service request id");
            return;
        }

        try {
            setSaving(true);
            setErrorMessage(null);

            const payload = {
                serviceRequestId,
                productSnapshot: {
                    name: productName,
                    sku: productSku,
                    image: productImage,
                    movementSpecLabel,
                },
                movement: {
                    machineType: form.machineType,
                    status: form.movementStatus,
                    beforeSpecs:
                        form.machineType === "MECHANICAL" && form.showBeforeSpecs
                            ? {
                                rate: form.beforeSpecs.rate || undefined,
                                amp: form.beforeSpecs.amp || undefined,
                                err: form.beforeSpecs.err || undefined,
                            }
                            : undefined,
                    afterSpecs:
                        form.machineType === "MECHANICAL"
                            ? {
                                rate: form.afterSpecs.rate || undefined,
                                amp: form.afterSpecs.amp || undefined,
                                err: form.afterSpecs.err || undefined,
                            }
                            : undefined,
                    lines:
                        form.movementStatus === "ISSUE"
                            ? form.movementLines.map((line) => ({
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
                        proposal: {
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
                        proposal: {
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
                        proposal: {
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
                        action: form.crownIssue.action,
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

            await saveTechnicalAssessment(payload);

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

    if (!open || !serviceRequestId) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-[1001] flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                            Đánh giá kỹ thuật
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {serviceRequestId ? `Service Request: ${serviceRequestId}` : "Chưa có mã phiếu"}
                        </p>
                    </div>

                    <Button type="button" variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50/60 p-6">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:items-start">
                            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                {productImage ? (
                                    <img
                                        src={`/api/media/sign?key=${encodeURIComponent(productImage)}`}
                                        alt={productName}
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
                                <div className="text-xl font-semibold text-slate-900">{productName}</div>
                                <div className="text-sm text-slate-500">SKU: {productSku || "-"}</div>
                                <div className="text-sm text-slate-500">
                                    Bộ máy theo spec: {movementSpecLabel || "-"}
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1">
                                    <ScorePill score={appearanceScore} />
                                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                                        Tổng chi phí: {formatCurrency(totalCost)}
                                    </span>
                                </div>
                            </div>

                            {productId ? (
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push(`/admin/products/${productId}/edit`)}
                                    >
                                        Sửa spec sản phẩm
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </section>

                    {panelLoading ? (
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                            Đang tải dữ liệu phiếu kỹ thuật...
                        </section>
                    ) : null}

                    <SectionCard
                        title="Đánh giá bộ máy"
                        subtitle="Đây là phần kiểm tra và ghi nhận xử lý kỹ thuật cho máy."
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
                                        (kế thừa từ spec sản phẩm)
                                    </span>
                                </div>
                            </Field>

                            <Field label="Tình trạng máy">
                                <StatusToggle
                                    value={form.movementStatus}
                                    onChange={(value) =>
                                        setForm((prev) => ({ ...prev, movementStatus: value }))
                                    }
                                    goodText="Chạy tốt"
                                    issueText="Cần xử lý"
                                />
                            </Field>
                        </div>

                        {form.movementStatus === "GOOD" ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-white">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-emerald-800">
                                            Máy đang hoạt động ổn
                                        </div>
                                        <div className="mt-1 text-sm text-emerald-700/90">
                                            Không cần mở issue bộ máy ở vòng xử lý này.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white">
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-amber-800">Máy cần xử lý kỹ thuật</div>
                                            <div className="mt-1 text-sm text-amber-700/90">
                                                Ghi nhận nhanh các hạng mục xử lý. Điều phối chi tiết sẽ tiếp tục ở Issue Board.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Các dòng xử lý máy</div>
                                            <div className="text-sm text-slate-500">
                                                Mỗi dòng là một issue kỹ thuật cho bộ máy.
                                            </div>
                                        </div>

                                        <Button type="button" onClick={addMovementLine}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm dòng
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {form.movementLines.map((line, index) => {
                                            const isVendor = line.execution === "VENDOR";
                                            const isReplacePart = line.action === "REPLACE_PART";

                                            return (
                                                <div
                                                    key={line.id}
                                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                                >
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div className="text-sm font-semibold text-slate-900">
                                                            Dòng #{index + 1}
                                                        </div>

                                                        {form.movementLines.length > 1 ? (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                                onClick={() => removeMovementLine(line.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        ) : null}
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-3">
                                                        <Field label="Xử lý">
                                                            <SelectInput
                                                                value={line.action ?? ""}
                                                                onChange={(e) =>
                                                                    updateMovementLine(line.id, {
                                                                        action: e.target.value as MovementAction,
                                                                        partId:
                                                                            e.target.value === "REPLACE_PART"
                                                                                ? line.partId
                                                                                : undefined,
                                                                    })
                                                                }
                                                            >
                                                                <option value="">Chọn xử lý</option>
                                                                {form.machineType === "MECHANICAL" ? (
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
                                                                    updateMovementLine(line.id, {
                                                                        execution: e.target.value as ExecutionType,
                                                                        vendorId:
                                                                            e.target.value === "VENDOR" ? line.vendorId : undefined,
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
                                                                onChange={(e) =>
                                                                    updateMovementLine(line.id, {
                                                                        cost: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </Field>

                                                        {isReplacePart ? (
                                                            <Field label="Linh kiện">
                                                                <SelectInput
                                                                    value={line.partId ?? ""}
                                                                    onChange={(e) =>
                                                                        updateMovementLine(line.id, {
                                                                            partId: e.target.value,
                                                                        })
                                                                    }
                                                                >
                                                                    <option value="">Chọn linh kiện</option>
                                                                    {parts.map((part) => (
                                                                        <option key={part.id} value={part.id}>
                                                                            {part.code ? `${part.code} - ` : ""}{part.name}
                                                                        </option>
                                                                    ))}
                                                                </SelectInput>
                                                            </Field>
                                                        ) : null}

                                                        {isVendor ? (
                                                            <Field label="Vendor">
                                                                <SelectInput
                                                                    value={line.vendorId ?? ""}
                                                                    onChange={(e) =>
                                                                        updateMovementLine(line.id, {
                                                                            vendorId: e.target.value,
                                                                        })
                                                                    }
                                                                >
                                                                    <option value="">Chọn vendor</option>
                                                                    {vendors.map((vendor) => (
                                                                        <option key={vendor.id} value={vendor.id}>
                                                                            {vendor.name}
                                                                        </option>
                                                                    ))}
                                                                </SelectInput>
                                                            </Field>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {form.machineType === "MECHANICAL" ? (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">
                                                    Thông số đo kiểm
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    Có thể nhập trước và sau xử lý nếu cần.
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        showBeforeSpecs: !prev.showBeforeSpecs,
                                                    }))
                                                }
                                            >
                                                Thông số trước xử lý
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>

                                        {form.showBeforeSpecs ? (
                                            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                                                <div className="mb-3 text-sm font-semibold text-slate-900">
                                                    Trước xử lý
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    <Field label="Rate">
                                                        <TextInput
                                                            value={form.beforeSpecs.rate}
                                                            onChange={(e) =>
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    beforeSpecs: {
                                                                        ...prev.beforeSpecs,
                                                                        rate: e.target.value,
                                                                    },
                                                                }))
                                                            }
                                                        />
                                                    </Field>
                                                    <Field label="Amp">
                                                        <TextInput
                                                            value={form.beforeSpecs.amp}
                                                            onChange={(e) =>
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    beforeSpecs: {
                                                                        ...prev.beforeSpecs,
                                                                        amp: e.target.value,
                                                                    },
                                                                }))
                                                            }
                                                        />
                                                    </Field>
                                                    <Field label="Err">
                                                        <TextInput
                                                            value={form.beforeSpecs.err}
                                                            onChange={(e) =>
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    beforeSpecs: {
                                                                        ...prev.beforeSpecs,
                                                                        err: e.target.value,
                                                                    },
                                                                }))
                                                            }
                                                        />
                                                    </Field>
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <Field label="Rate sau xử lý">
                                                <TextInput
                                                    value={form.afterSpecs.rate}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            afterSpecs: {
                                                                ...prev.afterSpecs,
                                                                rate: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </Field>
                                            <Field label="Amp sau xử lý">
                                                <TextInput
                                                    value={form.afterSpecs.amp}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            afterSpecs: {
                                                                ...prev.afterSpecs,
                                                                amp: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </Field>
                                            <Field label="Err sau xử lý">
                                                <TextInput
                                                    value={form.afterSpecs.err}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            afterSpecs: {
                                                                ...prev.afterSpecs,
                                                                err: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="Ghi nhận issue nhanh"
                        subtitle="Tạo issue gọn tại phiếu, còn điều phối vận hành để Issue Board xử lý."
                        icon={<Sparkles className="h-5 w-5" />}
                        badge={
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                                Luồng nhẹ cho kỹ thuật
                            </span>
                        }
                    >
                        <IssueQuickCard
                            title="Vỏ"
                            open={form.caseIssue.enabled}
                            onOpen={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    caseIssue: {
                                        ...prev.caseIssue,
                                        enabled: true,
                                        execution: prev.caseIssue.execution ?? "INHOUSE",
                                    },
                                }));
                                markIssueOpened("Issue phần vỏ");
                            }}
                            onClose={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    caseIssue: emptyCompactIssue(),
                                }))
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
                                                    vendorId:
                                                        e.target.value === "VENDOR"
                                                            ? prev.caseIssue.vendorId
                                                            : undefined,
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

                                {form.caseIssue.execution === "VENDOR" ? (
                                    <Field label="Vendor">
                                        <SelectInput
                                            value={form.caseIssue.vendorId ?? ""}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    caseIssue: {
                                                        ...prev.caseIssue,
                                                        vendorId: e.target.value,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="">Chọn vendor</option>
                                            {vendors.map((vendor) => (
                                                <option key={vendor.id} value={vendor.id}>
                                                    {vendor.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </Field>
                                ) : null}
                            </div>
                        </IssueQuickCard>

                        <IssueQuickCard
                            title="Kính"
                            open={form.crystalIssue.enabled}
                            onOpen={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    crystalIssue: {
                                        ...prev.crystalIssue,
                                        enabled: true,
                                        execution: prev.crystalIssue.execution ?? "INHOUSE",
                                    },
                                }));
                                markIssueOpened("Issue phần kính");
                            }}
                            onClose={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    crystalIssue: emptyCompactIssue(),
                                }))
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
                                                    vendorId:
                                                        e.target.value === "VENDOR"
                                                            ? prev.crystalIssue.vendorId
                                                            : undefined,
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

                                {form.crystalIssue.execution === "VENDOR" ? (
                                    <Field label="Vendor">
                                        <SelectInput
                                            value={form.crystalIssue.vendorId ?? ""}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    crystalIssue: {
                                                        ...prev.crystalIssue,
                                                        vendorId: e.target.value,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="">Chọn vendor</option>
                                            {vendors.map((vendor) => (
                                                <option key={vendor.id} value={vendor.id}>
                                                    {vendor.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </Field>
                                ) : null}
                            </div>
                        </IssueQuickCard>

                        <IssueQuickCard
                            title="Mặt số"
                            open={form.dialIssue.enabled}
                            onOpen={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    dialIssue: {
                                        ...prev.dialIssue,
                                        enabled: true,
                                        execution: prev.dialIssue.execution ?? "INHOUSE",
                                    },
                                }));
                                markIssueOpened("Issue phần mặt số");
                            }}
                            onClose={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    dialIssue: emptyCompactIssue(),
                                }))
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
                                                    vendorId:
                                                        e.target.value === "VENDOR"
                                                            ? prev.dialIssue.vendorId
                                                            : undefined,
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

                                {form.dialIssue.execution === "VENDOR" ? (
                                    <Field label="Vendor">
                                        <SelectInput
                                            value={form.dialIssue.vendorId ?? ""}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    dialIssue: {
                                                        ...prev.dialIssue,
                                                        vendorId: e.target.value,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="">Chọn vendor</option>
                                            {vendors.map((vendor) => (
                                                <option key={vendor.id} value={vendor.id}>
                                                    {vendor.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </Field>
                                ) : null}
                            </div>
                        </IssueQuickCard>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Núm</div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        Ghi nhận nhanh nếu phần núm cần xử lý kỹ thuật.
                                    </div>
                                </div>

                                <StatusToggle
                                    value={form.crownIssue.status}
                                    onChange={(value) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            crownIssue: {
                                                ...prev.crownIssue,
                                                status: value,
                                            },
                                        }))
                                    }
                                    goodText="Ổn"
                                    issueText="Cần xử lý"
                                />
                            </div>

                            {form.crownIssue.status === "ISSUE" ? (
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field label="Xử lý">
                                        <SelectInput
                                            value={form.crownIssue.action ?? ""}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    crownIssue: {
                                                        ...prev.crownIssue,
                                                        action: e.target.value as CrownAction,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="">Chọn xử lý</option>
                                            <option value="FIX_CROWN">Sửa núm</option>
                                            <option value="REPLACE_CROWN">Thay núm</option>
                                            <option value="RETHREAD">Làm ren</option>
                                            <option value="STEM_ADJUST">Chỉnh ty</option>
                                            <option value="WATERPROOF">Chống nước</option>
                                        </SelectInput>
                                    </Field>

                                    <Field label="Thực hiện">
                                        <SelectInput
                                            value={form.crownIssue.execution ?? "INHOUSE"}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    crownIssue: {
                                                        ...prev.crownIssue,
                                                        execution: e.target.value as ExecutionType,
                                                        vendorId:
                                                            e.target.value === "VENDOR"
                                                                ? prev.crownIssue.vendorId
                                                                : undefined,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="INHOUSE">Nội bộ</option>
                                            <option value="VENDOR">Vendor</option>
                                        </SelectInput>
                                    </Field>

                                    <Field label="Chi phí">
                                        <TextInput
                                            inputMode="numeric"
                                            value={form.crownIssue.cost ?? ""}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    crownIssue: {
                                                        ...prev.crownIssue,
                                                        cost: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </Field>

                                    <Field label="Linh kiện">
                                        <SelectInput
                                            value={form.crownIssue.partId ?? ""}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    crownIssue: {
                                                        ...prev.crownIssue,
                                                        partId: e.target.value,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="">Chọn linh kiện</option>
                                            {parts.map((part) => (
                                                <option key={part.id} value={part.id}>
                                                    {part.code ? `${part.code} - ` : ""}{part.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </Field>

                                    {form.crownIssue.execution === "VENDOR" ? (
                                        <Field label="Vendor">
                                            <SelectInput
                                                value={form.crownIssue.vendorId ?? ""}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        crownIssue: {
                                                            ...prev.crownIssue,
                                                            vendorId: e.target.value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="">Chọn vendor</option>
                                                {vendors.map((vendor) => (
                                                    <option key={vendor.id} value={vendor.id}>
                                                        {vendor.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </Field>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Tổng kết đánh giá ngoại hình"
                        subtitle="Phần này gom toàn bộ chấm điểm để kỹ thuật tổng kết một lần ở cuối phiếu."
                        icon={<Sparkles className="h-5 w-5" />}
                        badge={<ScorePill score={appearanceScore} />}
                    >
                        <CollapsibleScoreCard
                            title="Vỏ"
                            score={caseScore}
                            summary={caseSummary}
                            defaultOpen={form.appearance.case.issues.length > 0}
                        >
                            <div className="space-y-4">
                                <Field label="Khuyết điểm ghi nhận">
                                    <IssueChipGroup
                                        options={CASE_ISSUES}
                                        selected={form.appearance.case.issues}
                                        onChange={(issues) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                appearance: {
                                                    ...prev.appearance,
                                                    case: { ...prev.appearance.case, issues },
                                                },
                                            }))
                                        }
                                    />
                                </Field>

                                <Field
                                    label="Trừ thêm"
                                    hint="Nhập thêm nếu cần điều chỉnh ngoài các lựa chọn mặc định."
                                >
                                    <TextInput
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={form.appearance.case.manualDeduction}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                appearance: {
                                                    ...prev.appearance,
                                                    case: {
                                                        ...prev.appearance.case,
                                                        manualDeduction: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                    />
                                </Field>
                            </div>
                        </CollapsibleScoreCard>

                        <CollapsibleScoreCard
                            title="Kính"
                            score={crystalScore}
                            summary={crystalSummary}
                            defaultOpen={form.appearance.crystal.issues.length > 0}
                        >
                            <div className="space-y-4">
                                <Field label="Khuyết điểm ghi nhận">
                                    <IssueChipGroup
                                        options={CRYSTAL_ISSUES}
                                        selected={form.appearance.crystal.issues}
                                        onChange={(issues) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                appearance: {
                                                    ...prev.appearance,
                                                    crystal: { ...prev.appearance.crystal, issues },
                                                },
                                            }))
                                        }
                                    />
                                </Field>

                                <Field label="Trừ thêm">
                                    <TextInput
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={form.appearance.crystal.manualDeduction}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                appearance: {
                                                    ...prev.appearance,
                                                    crystal: {
                                                        ...prev.appearance.crystal,
                                                        manualDeduction: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                    />
                                </Field>
                            </div>
                        </CollapsibleScoreCard>

                        <CollapsibleScoreCard
                            title="Mặt số"
                            score={dialScore}
                            summary={dialSummary}
                            defaultOpen={form.appearance.dial.issues.length > 0}
                        >
                            <div className="space-y-4">
                                <Field label="Khuyết điểm ghi nhận">
                                    <IssueChipGroup
                                        options={DIAL_ISSUES}
                                        selected={form.appearance.dial.issues}
                                        onChange={(issues) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                appearance: {
                                                    ...prev.appearance,
                                                    dial: { ...prev.appearance.dial, issues },
                                                },
                                            }))
                                        }
                                    />
                                </Field>

                                <Field label="Trừ thêm">
                                    <TextInput
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={form.appearance.dial.manualDeduction}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                appearance: {
                                                    ...prev.appearance,
                                                    dial: {
                                                        ...prev.appearance.dial,
                                                        manualDeduction: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                    />
                                </Field>
                            </div>
                        </CollapsibleScoreCard>
                    </SectionCard>

                    <SectionCard
                        title="Tổng kết kỹ thuật"
                        subtitle="Kết luận cuối cùng của kỹ thuật viên sau khi đánh giá và mở issue cần thiết."
                        icon={<Wrench className="h-5 w-5" />}
                        badge={
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                                Tổng chi phí: {formatCurrency(totalCost)}
                            </span>
                        }
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Điểm ngoại hình</div>
                                <div className="mt-2 text-2xl font-semibold text-slate-900">
                                    {appearanceScore}/100
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Chi phí kỹ thuật</div>
                                <div className="mt-2 text-2xl font-semibold text-slate-900">
                                    {formatCurrency(totalCost)}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Trạng thái đóng SR</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    Sẵn sàng sau khi mọi issue hoàn tất
                                </div>
                            </div>
                        </div>

                        <Field label="Kết luận kỹ thuật">
                            <TextArea
                                value={form.conclusion}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        conclusion: e.target.value,
                                        hasEditedConclusion: true,
                                    }))
                                }
                            />
                        </Field>
                    </SectionCard>

                    {errorMessage ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                            Điểm ngoại hình <span className="ml-1 font-semibold text-slate-950">{appearanceScore}/100</span>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                            Tổng chi phí <span className="ml-1 font-semibold text-slate-950">{formatCurrency(totalCost)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                            Hủy
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={saving || panelLoading}>
                            {saving ? "Đang lưu..." : "Lưu đánh giá kỹ thuật"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}