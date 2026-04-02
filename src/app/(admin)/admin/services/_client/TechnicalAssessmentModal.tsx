"use client";

import * as React from "react";
import {
    Wrench,
    ShieldCheck,
    CircleCheck,
    AlertTriangle,
    Plus,
    Trash2,
    Camera,
    ChevronDown,
    ScanSearch,
} from "lucide-react";

type MachineType = "MECHANICAL" | "QUARTZ";
type HealthStatus = "GOOD" | "ISSUE";
type FunctionalStatus = "GOOD" | "ISSUE";
type ExecutionType = "INHOUSE" | "VENDOR";

type MovementAction =
    | "SERVICE"
    | "REPLACE_PART"
    | "REGULATE"
    | "WATERPROOF"
    | "REPLACE_MOVEMENT"
    | "BATTERY_CHANGE";

type CrownAction =
    | "FIX_CROWN"
    | "REPLACE_CROWN"
    | "RETHREAD"
    | "STEM_ADJUST"
    | "WATERPROOF";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type CosmeticProposalAction =
    | "NO_ACTION"
    | "SPA_CASE"
    | "POLISH_CASE"
    | "REPLATE_CASE"
    | "POLISH_GLASS"
    | "REPLACE_GLASS"
    | "CLEAN_DIAL"
    | "REPLACE_DIAL"
    | "KEEP_ORIGINAL"
    | "REVIEW_WITH_ADMIN";

type AppearanceIssueCode =
    | "CASE_LIGHT_SCRATCH"
    | "CASE_HEAVY_SCRATCH"
    | "CASE_DENT"
    | "CASE_PLATING_WORN"
    | "CASE_OVERPOLISHED"
    | "GLASS_LIGHT_SCRATCH"
    | "GLASS_HEAVY_SCRATCH"
    | "GLASS_CLOUDY"
    | "GLASS_CRACKED"
    | "DIAL_SPOTS"
    | "DIAL_FADING"
    | "DIAL_STAIN"
    | "DIAL_MARKER_DAMAGE";

type MovementLine = {
    id: string;
    action?: MovementAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
    note?: string;
};

type CosmeticProposal = {
    enabled: boolean;
    action?: CosmeticProposalAction;
    estimatedCost?: string;
    execution?: ExecutionType;
    vendorId?: string;
    note?: string;
    requiresApproval: boolean;
    approvalStatus?: ApprovalStatus;
};

type AppearanceBlockValue = {
    issues: AppearanceIssueCode[];
    manualDeduction: string;
    note?: string;
    proposal: CosmeticProposal;
};

type CrownRepairState = {
    status: FunctionalStatus;
    action?: CrownAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
    note?: string;
};

export type TechnicalAssessmentSubmitPayload = {
    serviceRequestId: string;
    productSnapshot: {
        name?: string;
        sku?: string | null;
        image?: string | null;
        movementSpecLabel?: string | null;
    };
    movement: {
        machineType: MachineType;
        status: HealthStatus;
        beforeSpecs?: {
            rate?: string;
            amp?: string;
            err?: string;
        };
        afterSpecs?: {
            rate?: string;
            amp?: string;
            err?: string;
        };
        lines: Array<{
            action?: MovementAction;
            execution?: ExecutionType;
            vendorId?: string;
            partId?: string;
            cost?: number;
            note?: string;
        }>;
    };
    appearance: {
        score: number;
        case: {
            score: number;
            issues: AppearanceIssueCode[];
            manualDeduction: number;
            note?: string;
            proposal: {
                enabled: boolean;
                action?: CosmeticProposalAction;
                estimatedCost?: number;
                execution?: ExecutionType;
                vendorId?: string;
                note?: string;
                requiresApproval: boolean;
                approvalStatus?: ApprovalStatus;
            };
        };
        glass: {
            score: number;
            issues: AppearanceIssueCode[];
            manualDeduction: number;
            note?: string;
            proposal: {
                enabled: boolean;
                action?: CosmeticProposalAction;
                estimatedCost?: number;
                execution?: ExecutionType;
                vendorId?: string;
                note?: string;
                requiresApproval: boolean;
                approvalStatus?: ApprovalStatus;
            };
        };
        dial: {
            score: number;
            issues: AppearanceIssueCode[];
            manualDeduction: number;
            note?: string;
            proposal: {
                enabled: boolean;
                action?: CosmeticProposalAction;
                estimatedCost?: number;
                execution?: ExecutionType;
                vendorId?: string;
                note?: string;
                requiresApproval: boolean;
                approvalStatus?: ApprovalStatus;
            };
        };
        crown: {
            status: FunctionalStatus;
            action?: CrownAction;
            execution?: ExecutionType;
            vendorId?: string;
            partId?: string;
            cost?: number;
            note?: string;
        };
    };
    financialSummary: {
        movementCost: number;
        crownCost: number;
        cosmeticProposalCost: number;
        totalCost: number;
    };
    conclusion?: string;
};

type TechnicalAssessmentModalProps = {
    open: boolean;
    serviceRequestId: string | null;
    onClose: () => void;
    onSaved: () => void | Promise<void>;
    productName?: string;
    productSku?: string | null;
    productImage?: string | null;
    movementSpecLabel?: string | null;
};

const vendors = [
    { id: "v1", name: "Vendor A" },
    { id: "v2", name: "Vendor B" },
    { id: "v3", name: "Vendor C" },
];

const parts = [
    { id: "p1", name: "Pin" },
    { id: "p2", name: "Dây tóc" },
    { id: "p3", name: "Núm" },
    { id: "p4", name: "Kính" },
    { id: "p5", name: "Bánh xe cân bằng" },
];

const CASE_ISSUES: { code: AppearanceIssueCode; label: string; deduction: number }[] = [
    { code: "CASE_LIGHT_SCRATCH", label: "Trầy nhẹ", deduction: 5 },
    { code: "CASE_HEAVY_SCRATCH", label: "Trầy nhiều", deduction: 12 },
    { code: "CASE_DENT", label: "Cấn móp", deduction: 15 },
    { code: "CASE_PLATING_WORN", label: "Mòn mạ", deduction: 18 },
    { code: "CASE_OVERPOLISHED", label: "Bóng lại nhiều / mất nét", deduction: 10 },
];

const GLASS_ISSUES: { code: AppearanceIssueCode; label: string; deduction: number }[] = [
    { code: "GLASS_LIGHT_SCRATCH", label: "Xước nhẹ", deduction: 4 },
    { code: "GLASS_HEAVY_SCRATCH", label: "Xước nhiều", deduction: 10 },
    { code: "GLASS_CLOUDY", label: "Mờ / ố", deduction: 12 },
    { code: "GLASS_CRACKED", label: "Nứt / vỡ", deduction: 25 },
];

const DIAL_ISSUES: { code: AppearanceIssueCode; label: string; deduction: number }[] = [
    { code: "DIAL_SPOTS", label: "Đốm nhẹ", deduction: 8 },
    { code: "DIAL_FADING", label: "Xuống màu", deduction: 10 },
    { code: "DIAL_STAIN", label: "Ố / bẩn / mốc", deduction: 16 },
    { code: "DIAL_MARKER_DAMAGE", label: "Lỗi cọc / số / kim", deduction: 20 },
];

const CASE_PROPOSAL_ACTIONS: { value: CosmeticProposalAction; label: string }[] = [
    { value: "NO_ACTION", label: "Không xử lý" },
    { value: "SPA_CASE", label: "Spa vỏ nhẹ" },
    { value: "POLISH_CASE", label: "Đánh bóng vỏ" },
    { value: "REPLATE_CASE", label: "Mạ lại vỏ" },
    { value: "KEEP_ORIGINAL", label: "Giữ nguyên vì ưu tiên zin" },
    { value: "REVIEW_WITH_ADMIN", label: "Báo admin xem xét riêng" },
];

const GLASS_PROPOSAL_ACTIONS: { value: CosmeticProposalAction; label: string }[] = [
    { value: "NO_ACTION", label: "Không xử lý" },
    { value: "POLISH_GLASS", label: "Đánh bóng kính" },
    { value: "REPLACE_GLASS", label: "Thay kính" },
    { value: "KEEP_ORIGINAL", label: "Giữ nguyên vì ưu tiên zin" },
    { value: "REVIEW_WITH_ADMIN", label: "Báo admin xem xét riêng" },
];

const DIAL_PROPOSAL_ACTIONS: { value: CosmeticProposalAction; label: string }[] = [
    { value: "NO_ACTION", label: "Không xử lý" },
    { value: "CLEAN_DIAL", label: "Vệ sinh nhẹ" },
    { value: "REPLACE_DIAL", label: "Thay mặt số" },
    { value: "KEEP_ORIGINAL", label: "Giữ nguyên vì ưu tiên zin" },
    { value: "REVIEW_WITH_ADMIN", label: "Báo admin xem xét riêng" },
];

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function parseMoney(value?: string) {
    if (!value) return 0;
    const numeric = Number(value.toString().replace(/[^\d]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function parseNumber(value?: string) {
    if (!value) return 0;
    const numeric = Number(value.toString().replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function makeId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
}

function emptyProposal(): CosmeticProposal {
    return {
        enabled: false,
        action: undefined,
        estimatedCost: "",
        execution: undefined,
        vendorId: undefined,
        note: "",
        requiresApproval: false,
        approvalStatus: undefined,
    };
}

function emptyAppearanceBlock(): AppearanceBlockValue {
    return {
        issues: [],
        manualDeduction: "",
        note: "",
        proposal: emptyProposal(),
    };
}

function Pill({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "amber" | "gray";
}) {
    const styles = {
        neutral: "border-slate-200 bg-slate-50 text-slate-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        gray: "border-slate-200 bg-slate-100 text-slate-700",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                styles[tone]
            )}
        >
            {children}
        </span>
    );
}

function ApprovalPill({ status }: { status?: ApprovalStatus }) {
    if (status === "APPROVED") {
        return (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Đã duyệt
            </span>
        );
    }

    if (status === "REJECTED") {
        return (
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                Từ chối
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            Chờ duyệt
        </span>
    );
}

function SectionCard({
    title,
    icon,
    badge,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                </div>
                {badge}
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </section>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition",
                "placeholder:text-slate-400 focus:border-slate-400",
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
                "min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition",
                "placeholder:text-slate-400 focus:border-slate-400",
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

function CompactStatusToggle({
    value,
    onChange,
    goodText = "Đẹp / ổn",
    issueText = "Cần xử lý",
}: {
    value: HealthStatus | FunctionalStatus;
    onChange: (value: HealthStatus | FunctionalStatus) => void;
    goodText?: string;
    issueText?: string;
}) {
    return (
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
                type="button"
                onClick={() => onChange("GOOD")}
                className={cx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    value === "GOOD"
                        ? "border border-slate-300 bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/70"
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
                        ? "border border-amber-200 bg-amber-50 text-amber-800 shadow-sm ring-1 ring-amber-100"
                        : "text-slate-500 hover:text-slate-800"
                )}
            >
                {issueText}
            </button>
        </div>
    );
}

function statusBadge(status: HealthStatus, goodLabel = "Đẹp / ổn", issueLabel = "Cần xử lý") {
    return status === "GOOD" ? (
        <Pill tone="neutral">{goodLabel}</Pill>
    ) : (
        <Pill tone="amber">{issueLabel}</Pill>
    );
}

function calculateAppearanceScore(
    block: AppearanceBlockValue,
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
    block: AppearanceBlockValue,
    definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]
) {
    return block.issues
        .map((code) => definitions.find((item) => item.code === code)?.label)
        .filter(Boolean)
        .join(", ");
}

function IssueCheckboxGroup({
    options,
    selected,
    onChange,
}: {
    options: { code: AppearanceIssueCode; label: string; deduction: number }[];
    selected: AppearanceIssueCode[];
    onChange: (next: AppearanceIssueCode[]) => void;
}) {
    function toggleIssue(code: AppearanceIssueCode) {
        if (selected.includes(code)) {
            onChange(selected.filter((item) => item !== code));
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
                        onClick={() => toggleIssue(item.code)}
                        className={cx(
                            "rounded-full border px-3 py-1.5 text-sm transition",
                            active
                                ? "border-slate-300 bg-slate-100 text-slate-900"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        )}
                    >
                        {item.label}
                        <span className="ml-1 text-slate-400">(-{item.deduction})</span>
                    </button>
                );
            })}
        </div>
    );
}

function ScorePill({ score }: { score: number }) {
    const tone =
        score >= 90
            ? "border-slate-300 bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/70"
            : score >= 80
                ? "border-slate-300 bg-slate-50 text-slate-800 shadow-sm"
                : "border-amber-200 bg-amber-50/70 text-amber-800 shadow-sm";

    return (
        <div className={cx("rounded-full border px-3 py-1 text-xs font-semibold", tone)}>
            {score}/100
        </div>
    );
}

function CosmeticProposalFields({
    title,
    value,
    onChange,
    actionOptions,
}: {
    title: string;
    value: CosmeticProposal;
    onChange: (value: CosmeticProposal) => void;
    actionOptions: { value: CosmeticProposalAction; label: string }[];
}) {
    const isVendor = value.execution === "VENDOR";

    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Đề xuất xử lý</div>
                    <div className="mt-1 text-sm text-slate-500">
                        Đề xuất này nên được sale/admin duyệt trước khi thực hiện.
                    </div>
                </div>

                {value.enabled ? <ApprovalPill status={value.approvalStatus} /> : null}
            </div>

            <div className="space-y-4">
                <div>
                    <CompactStatusToggle
                        value={value.enabled ? "ISSUE" : "GOOD"}
                        onChange={(v) =>
                            onChange({
                                ...value,
                                enabled: v === "ISSUE",
                                requiresApproval: v === "ISSUE",
                                approvalStatus: v === "ISSUE" ? value.approvalStatus ?? "PENDING" : undefined,
                            })
                        }
                        goodText="Không đề xuất"
                        issueText="Có đề xuất"
                    />
                </div>

                {value.enabled ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Phương án đề xuất">
                            <SelectInput
                                value={value.action ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        action: e.target.value as CosmeticProposalAction,
                                    })
                                }
                            >
                                <option value="">Chọn phương án</option>
                                {actionOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>

                        <Field label="Thực hiện dự kiến">
                            <SelectInput
                                value={value.execution ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        execution: e.target.value as ExecutionType,
                                        vendorId:
                                            e.target.value === "VENDOR" ? value.vendorId : undefined,
                                    })
                                }
                            >
                                <option value="">Chọn hình thức</option>
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>

                        <Field label="Chi phí dự kiến">
                            <TextInput
                                inputMode="numeric"
                                placeholder="0"
                                value={value.estimatedCost ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        estimatedCost: e.target.value,
                                    })
                                }
                            />
                        </Field>

                        {isVendor ? (
                            <Field label="Vendor dự kiến">
                                <SelectInput
                                    value={value.vendorId ?? ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
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

                        <div className="md:col-span-3">
                            <Field label="Lý do đề xuất">
                                <TextArea
                                    placeholder={`Ví dụ: ${title.toLowerCase()} chưa đủ đẹp để lên bài, nên đề xuất xử lý trước khi sale/admin quyết.`}
                                    value={value.note ?? ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
                                            note: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function AppearanceScoreBlock({
    title,
    description,
    value,
    onChange,
    definitions,
    proposalActions,
}: {
    title: string;
    description?: string;
    value: AppearanceBlockValue;
    onChange: (value: AppearanceBlockValue) => void;
    definitions: { code: AppearanceIssueCode; label: string; deduction: number }[];
    proposalActions: { value: CosmeticProposalAction; label: string }[];
}) {
    const score = calculateAppearanceScore(value, definitions);
    const summary = issueSummary(value, definitions);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    {description ? <div className="mt-1 text-sm text-slate-500">{description}</div> : null}
                </div>
                <ScorePill score={score} />
            </div>

            <div className="grid gap-4">
                <Field label="Khuyết điểm ghi nhận">
                    <IssueCheckboxGroup
                        options={definitions}
                        selected={value.issues}
                        onChange={(issues) => onChange({ ...value, issues })}
                    />
                </Field>

                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                    <Field label="Trừ thêm">
                        <TextInput
                            inputMode="numeric"
                            placeholder="0"
                            value={value.manualDeduction}
                            onChange={(e) => onChange({ ...value, manualDeduction: e.target.value })}
                        />
                    </Field>

                    <Field label="Tóm tắt nhanh">
                        <div className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
                            {summary || "Chưa ghi nhận khuyết điểm"}
                        </div>
                    </Field>
                </div>

                <Field label="Ghi chú">
                    <TextArea
                        placeholder="Ghi chú thêm về tình trạng thực tế..."
                        value={value.note ?? ""}
                        onChange={(e) => onChange({ ...value, note: e.target.value })}
                    />
                </Field>

                <CosmeticProposalFields
                    title={title}
                    value={value.proposal}
                    onChange={(proposal) => onChange({ ...value, proposal })}
                    actionOptions={proposalActions}
                />
            </div>
        </div>
    );
}

function CrownFunctionalBlock({
    value,
    onChange,
}: {
    value: CrownRepairState;
    onChange: (value: CrownRepairState) => void;
}) {
    const isIssue = value.status === "ISSUE";
    const isVendor = value.execution === "VENDOR";
    const isReplace = value.action === "REPLACE_CROWN";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Núm</div>
                <Pill tone={isIssue ? "amber" : "neutral"}>
                    {isIssue ? "Cần xử lý" : "Ổn"}
                </Pill>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="mb-2 text-sm font-medium text-slate-700">Tình trạng chức năng</div>
                    <CompactStatusToggle
                        value={value.status}
                        onChange={(status) =>
                            onChange({
                                ...value,
                                status,
                            })
                        }
                        goodText="Ổn"
                        issueText="Cần xử lý"
                    />
                </div>

                {isIssue ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Xử lý">
                            <SelectInput
                                value={value.action ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        action: e.target.value as CrownAction,
                                        partId:
                                            e.target.value === "REPLACE_CROWN"
                                                ? value.partId
                                                : undefined,
                                    })
                                }
                            >
                                <option value="">Chọn xử lý</option>
                                <option value="FIX_CROWN">Fix núm</option>
                                <option value="REPLACE_CROWN">Thay núm</option>
                                <option value="RETHREAD">Làm lại ren</option>
                                <option value="STEM_ADJUST">Chỉnh ti / trục núm</option>
                                <option value="WATERPROOF">Xử lý chống nước</option>
                            </SelectInput>
                        </Field>

                        <Field label="Thực hiện">
                            <SelectInput
                                value={value.execution ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        execution: e.target.value as ExecutionType,
                                        vendorId:
                                            e.target.value === "VENDOR"
                                                ? value.vendorId
                                                : undefined,
                                    })
                                }
                            >
                                <option value="">Chọn hình thức</option>
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>

                        <Field label="Chi phí">
                            <TextInput
                                inputMode="numeric"
                                placeholder="0"
                                value={value.cost ?? ""}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        cost: e.target.value,
                                    })
                                }
                            />
                        </Field>

                        {isVendor ? (
                            <Field label="Vendor">
                                <SelectInput
                                    value={value.vendorId ?? ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
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

                        {isReplace ? (
                            <Field label="Danh mục linh kiện">
                                <SelectInput
                                    value={value.partId ?? ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
                                            partId: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Chọn linh kiện</option>
                                    <option value="crown">Núm</option>
                                    <option value="stem">Ti / trục núm</option>
                                    <option value="tube">Ống núm</option>
                                </SelectInput>
                            </Field>
                        ) : null}

                        <div className="md:col-span-3">
                            <Field label="Ghi chú">
                                <TextArea
                                    placeholder="Ví dụ: núm trượt ren, lên cót nặng tay, cần thay cả ti..."
                                    value={value.note ?? ""}
                                    onChange={(e) =>
                                        onChange({
                                            ...value,
                                            note: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function buildSubmitPayload(params: {
    serviceRequestId: string;
    productName?: string;
    productSku?: string | null;
    productImage?: string | null;
    movementSpecLabel?: string | null;
    machineType: MachineType;
    movementStatus: HealthStatus;
    showBeforeSpecs: boolean;
    beforeSpecs: { rate: string; amp: string; err: string };
    afterSpecs: { rate: string; amp: string; err: string };
    movementLines: MovementLine[];
    caseAppearance: AppearanceBlockValue;
    glassAppearance: AppearanceBlockValue;
    dialAppearance: AppearanceBlockValue;
    crownRepair: CrownRepairState;
    conclusion: string;
}): TechnicalAssessmentSubmitPayload {
    const {
        serviceRequestId,
        productName,
        productSku,
        productImage,
        movementSpecLabel,
        machineType,
        movementStatus,
        showBeforeSpecs,
        beforeSpecs,
        afterSpecs,
        movementLines,
        caseAppearance,
        glassAppearance,
        dialAppearance,
        crownRepair,
        conclusion,
    } = params;

    const caseScore = calculateAppearanceScore(caseAppearance, CASE_ISSUES);
    const glassScore = calculateAppearanceScore(glassAppearance, GLASS_ISSUES);
    const dialScore = calculateAppearanceScore(dialAppearance, DIAL_ISSUES);
    const appearanceScore = Math.round(caseScore * 0.4 + glassScore * 0.2 + dialScore * 0.4);

    const movementCost = movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const crownCost = parseMoney(crownRepair.cost);
    const cosmeticProposalCost =
        parseMoney(caseAppearance.proposal.enabled ? caseAppearance.proposal.estimatedCost : "") +
        parseMoney(glassAppearance.proposal.enabled ? glassAppearance.proposal.estimatedCost : "") +
        parseMoney(dialAppearance.proposal.enabled ? dialAppearance.proposal.estimatedCost : "");
    const totalCost = movementCost + crownCost + cosmeticProposalCost;

    return {
        serviceRequestId,
        productSnapshot: {
            name: productName,
            sku: productSku,
            image: productImage,
            movementSpecLabel,
        },
        movement: {
            machineType,
            status: movementStatus,
            beforeSpecs: showBeforeSpecs
                ? {
                    rate: beforeSpecs.rate || undefined,
                    amp: beforeSpecs.amp || undefined,
                    err: beforeSpecs.err || undefined,
                }
                : undefined,
            afterSpecs:
                movementStatus === "ISSUE"
                    ? {
                        rate: afterSpecs.rate || undefined,
                        amp: afterSpecs.amp || undefined,
                        err: afterSpecs.err || undefined,
                    }
                    : undefined,
            lines:
                movementStatus === "ISSUE"
                    ? movementLines.map((line) => ({
                        action: line.action,
                        execution: line.execution,
                        vendorId: line.vendorId,
                        partId: line.partId,
                        cost: parseMoney(line.cost),
                        note: line.note,
                    }))
                    : [],
        },
        appearance: {
            score: appearanceScore,
            case: {
                score: caseScore,
                issues: caseAppearance.issues,
                manualDeduction: parseNumber(caseAppearance.manualDeduction),
                note: caseAppearance.note,
                proposal: {
                    enabled: caseAppearance.proposal.enabled,
                    action: caseAppearance.proposal.action,
                    estimatedCost: parseMoney(caseAppearance.proposal.estimatedCost),
                    execution: caseAppearance.proposal.execution,
                    vendorId: caseAppearance.proposal.vendorId,
                    note: caseAppearance.proposal.note,
                    requiresApproval: caseAppearance.proposal.requiresApproval,
                    approvalStatus: caseAppearance.proposal.approvalStatus,
                },
            },
            glass: {
                score: glassScore,
                issues: glassAppearance.issues,
                manualDeduction: parseNumber(glassAppearance.manualDeduction),
                note: glassAppearance.note,
                proposal: {
                    enabled: glassAppearance.proposal.enabled,
                    action: glassAppearance.proposal.action,
                    estimatedCost: parseMoney(glassAppearance.proposal.estimatedCost),
                    execution: glassAppearance.proposal.execution,
                    vendorId: glassAppearance.proposal.vendorId,
                    note: glassAppearance.proposal.note,
                    requiresApproval: glassAppearance.proposal.requiresApproval,
                    approvalStatus: glassAppearance.proposal.approvalStatus,
                },
            },
            dial: {
                score: dialScore,
                issues: dialAppearance.issues,
                manualDeduction: parseNumber(dialAppearance.manualDeduction),
                note: dialAppearance.note,
                proposal: {
                    enabled: dialAppearance.proposal.enabled,
                    action: dialAppearance.proposal.action,
                    estimatedCost: parseMoney(dialAppearance.proposal.estimatedCost),
                    execution: dialAppearance.proposal.execution,
                    vendorId: dialAppearance.proposal.vendorId,
                    note: dialAppearance.proposal.note,
                    requiresApproval: dialAppearance.proposal.requiresApproval,
                    approvalStatus: dialAppearance.proposal.approvalStatus,
                },
            },
            crown: {
                status: crownRepair.status,
                action: crownRepair.action,
                execution: crownRepair.execution,
                vendorId: crownRepair.vendorId,
                partId: crownRepair.partId,
                cost: parseMoney(crownRepair.cost),
                note: crownRepair.note,
            },
        },
        financialSummary: {
            movementCost,
            crownCost,
            cosmeticProposalCost,
            totalCost,
        },
        conclusion,
    };
}

async function saveTechnicalAssessment(payload: TechnicalAssessmentSubmitPayload) {
    const res = await fetch("/api/admin/service-requests/technical-assessment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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
    serviceRequestId,
    onClose,
    onSaved,
    productName = "takeo kuchi méo pin mặt xanh",
    productSku = "-",
    productImage = null,
    movementSpecLabel = "-",
}: TechnicalAssessmentModalProps) {
    const [machineType, setMachineType] = React.useState<MachineType>("MECHANICAL");
    const [movementStatus, setMovementStatus] = React.useState<HealthStatus>("GOOD");
    const [showBeforeSpecs, setShowBeforeSpecs] = React.useState(false);

    const [beforeSpecs, setBeforeSpecs] = React.useState({
        rate: "",
        amp: "",
        err: "",
    });

    const [afterSpecs, setAfterSpecs] = React.useState({
        rate: "",
        amp: "",
        err: "",
    });

    const [movementLines, setMovementLines] = React.useState<MovementLine[]>([
        {
            id: makeId(),
            execution: "INHOUSE",
        },
    ]);

    const [caseAppearance, setCaseAppearance] = React.useState<AppearanceBlockValue>(emptyAppearanceBlock());
    const [glassAppearance, setGlassAppearance] = React.useState<AppearanceBlockValue>(emptyAppearanceBlock());
    const [dialAppearance, setDialAppearance] = React.useState<AppearanceBlockValue>(emptyAppearanceBlock());

    const [crownRepair, setCrownRepair] = React.useState<CrownRepairState>({
        status: "GOOD",
        action: undefined,
        execution: undefined,
        vendorId: undefined,
        partId: undefined,
        cost: "",
        note: "",
    });

    const [conclusion, setConclusion] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    if (!open) return null;

    const caseScore = calculateAppearanceScore(caseAppearance, CASE_ISSUES);
    const glassScore = calculateAppearanceScore(glassAppearance, GLASS_ISSUES);
    const dialScore = calculateAppearanceScore(dialAppearance, DIAL_ISSUES);
    const appearanceScore = Math.round(caseScore * 0.4 + glassScore * 0.2 + dialScore * 0.4);

    const movementCost = movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const crownCost = parseMoney(crownRepair.cost);
    const cosmeticProposalCost =
        parseMoney(caseAppearance.proposal.enabled ? caseAppearance.proposal.estimatedCost : "") +
        parseMoney(glassAppearance.proposal.enabled ? glassAppearance.proposal.estimatedCost : "") +
        parseMoney(dialAppearance.proposal.enabled ? dialAppearance.proposal.estimatedCost : "");
    const totalCost = movementCost + crownCost + cosmeticProposalCost;

    function addMovementLine() {
        setMovementLines((prev) => [
            ...prev,
            {
                id: makeId(),
                execution: "INHOUSE",
            },
        ]);
    }

    function updateMovementLine(id: string, patch: Partial<MovementLine>) {
        setMovementLines((prev) =>
            prev.map((line) => (line.id === id ? { ...line, ...patch } : line))
        );
    }

    function removeMovementLine(id: string) {
        setMovementLines((prev) => prev.filter((line) => line.id !== id));
    }

    async function handleSave() {
        if (!serviceRequestId) {
            setErrorMessage("Thiếu service request id");
            return;
        }

        try {
            setSaving(true);
            setErrorMessage(null);

            const payload = buildSubmitPayload({
                serviceRequestId,
                productName,
                productSku,
                productImage,
                movementSpecLabel,
                machineType,
                movementStatus,
                showBeforeSpecs,
                beforeSpecs,
                afterSpecs,
                movementLines,
                caseAppearance,
                glassAppearance,
                dialAppearance,
                crownRepair,
                conclusion,
            });

            await saveTechnicalAssessment(payload);
            await onSaved();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Lưu thất bại");
        } finally {
            setSaving(false);
        }
    }

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
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                        {productImage ? (
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                No image
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-sm"
                                        >
                                            <Camera className="h-4 w-4 text-slate-600" />
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-lg font-semibold text-slate-900">{productName}</div>
                                        <div className="text-sm text-slate-500">SKU: {productSku || "-"}</div>
                                        <div className="text-sm text-slate-500">
                                            Bộ máy từ spec: {movementSpecLabel || "-"}
                                        </div>
                                        <div className="pt-1">
                                            <Pill tone="neutral">
                                                Điểm ngoại hình: {appearanceScore}/100
                                            </Pill>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <SectionCard
                        title="Đánh giá máy"
                        icon={<Wrench className="h-5 w-5" />}
                        badge={statusBadge(movementStatus, "Chạy tốt")}
                    >
                        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
                            <Field label="Loại máy">
                                <SelectInput
                                    value={machineType}
                                    onChange={(e) => setMachineType(e.target.value as MachineType)}
                                >
                                    <option value="MECHANICAL">Máy cơ</option>
                                    <option value="QUARTZ">Máy pin</option>
                                </SelectInput>
                            </Field>

                            <Field label="Tình trạng máy">
                                <CompactStatusToggle
                                    value={movementStatus}
                                    onChange={(v) => setMovementStatus(v as HealthStatus)}
                                    goodText="Chạy tốt"
                                    issueText="Cần xử lý"
                                />
                            </Field>
                        </div>

                        {movementStatus === "GOOD" ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white">
                                        <CircleCheck className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-800">
                                            Máy chạy ổn, không cần can thiệp kỹ thuật
                                        </div>
                                        <div className="mt-1 text-sm text-slate-500">
                                            Khi chọn chạy tốt thì ẩn toàn bộ thông số trước/sau và block xử lý.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white">
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-amber-800">Máy cần xử lý kỹ thuật</div>
                                            <div className="mt-1 text-sm text-amber-700/90">
                                                Chỉ bung các phần chuyên sâu khi thực sự có vấn đề.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Xử lý máy</div>
                                            <div className="text-sm text-slate-500">
                                                Mỗi dòng là một nghiệp vụ kỹ thuật
                                            </div>
                                        </div>

                                        <Button type="button" onClick={addMovementLine}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm dòng
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {movementLines.map((line, index) => {
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

                                                        {movementLines.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                                onClick={() => removeMovementLine(line.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
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
                                                                {machineType === "MECHANICAL" ? (
                                                                    <>
                                                                        <option value="SERVICE">Lau dầu</option>
                                                                        <option value="REPLACE_PART">Thay linh kiện</option>
                                                                        <option value="REGULATE">
                                                                            Nắn chỉnh dây tóc / chỉnh sai số
                                                                        </option>
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
                                                                value={line.execution ?? ""}
                                                                onChange={(e) =>
                                                                    updateMovementLine(line.id, {
                                                                        execution: e.target.value as ExecutionType,
                                                                        vendorId:
                                                                            e.target.value === "VENDOR"
                                                                                ? line.vendorId
                                                                                : undefined,
                                                                    })
                                                                }
                                                            >
                                                                <option value="">Chọn hình thức</option>
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

                                                        {isReplacePart ? (
                                                            <Field label="Linh kiện cần thay">
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
                                                                            {part.name}
                                                                        </option>
                                                                    ))}
                                                                </SelectInput>
                                                            </Field>
                                                        ) : null}

                                                        <div className="md:col-span-3">
                                                            <Field label="Ghi chú">
                                                                <TextArea
                                                                    placeholder="Ghi rõ linh kiện thay, sai số, xử lý chống nước..."
                                                                    value={line.note ?? ""}
                                                                    onChange={(e) =>
                                                                        updateMovementLine(line.id, {
                                                                            note: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">
                                                Thông số sau xử lý
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                Chỉ nhập khi thực sự có kiểm tra lại thông số
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowBeforeSpecs((prev) => !prev)}
                                        >
                                            Thông số trước xử lý
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>

                                    {showBeforeSpecs ? (
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                                            <div className="mb-3 text-sm font-semibold text-slate-900">
                                                Thông số trước xử lý
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-3">
                                                <Field label="Rate">
                                                    <TextInput
                                                        value={beforeSpecs.rate}
                                                        onChange={(e) =>
                                                            setBeforeSpecs((prev) => ({
                                                                ...prev,
                                                                rate: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </Field>
                                                <Field label="Amp">
                                                    <TextInput
                                                        value={beforeSpecs.amp}
                                                        onChange={(e) =>
                                                            setBeforeSpecs((prev) => ({
                                                                ...prev,
                                                                amp: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </Field>
                                                <Field label="Err">
                                                    <TextInput
                                                        value={beforeSpecs.err}
                                                        onChange={(e) =>
                                                            setBeforeSpecs((prev) => ({
                                                                ...prev,
                                                                err: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </Field>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <Field label="Rate">
                                            <TextInput
                                                value={afterSpecs.rate}
                                                onChange={(e) =>
                                                    setAfterSpecs((prev) => ({
                                                        ...prev,
                                                        rate: e.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>
                                        <Field label="Amp">
                                            <TextInput
                                                value={afterSpecs.amp}
                                                onChange={(e) =>
                                                    setAfterSpecs((prev) => ({
                                                        ...prev,
                                                        amp: e.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>
                                        <Field label="Err">
                                            <TextInput
                                                value={afterSpecs.err}
                                                onChange={(e) =>
                                                    setAfterSpecs((prev) => ({
                                                        ...prev,
                                                        err: e.target.value,
                                                    }))
                                                }
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="Đánh giá ngoại hình"
                        icon={<ShieldCheck className="h-5 w-5" />}
                        badge={
                            <div className="flex items-center gap-2">
                                <Pill tone="gray">Vỏ / kính / mặt số</Pill>
                                <ScorePill score={appearanceScore} />
                            </div>
                        }
                    >
                        <AppearanceScoreBlock
                            title="Vỏ"
                            description="Tính điểm dựa trên mức độ hoàn thiện vỏ, cạnh nét, mòn mạ, trầy xước."
                            value={caseAppearance}
                            onChange={setCaseAppearance}
                            definitions={CASE_ISSUES}
                            proposalActions={CASE_PROPOSAL_ACTIONS}
                        />

                        <AppearanceScoreBlock
                            title="Kính"
                            description="Tính điểm theo độ trong, độ xước, nứt hoặc tình trạng xuống cấp của kính."
                            value={glassAppearance}
                            onChange={setGlassAppearance}
                            definitions={GLASS_ISSUES}
                            proposalActions={GLASS_PROPOSAL_ACTIONS}
                        />

                        <AppearanceScoreBlock
                            title="Mặt số"
                            description="Tính điểm theo độ sạch, độ đều màu, tình trạng cọc số, kim và bề mặt."
                            value={dialAppearance}
                            onChange={setDialAppearance}
                            definitions={DIAL_ISSUES}
                            proposalActions={DIAL_PROPOSAL_ACTIONS}
                        />

                        <CrownFunctionalBlock
                            value={crownRepair}
                            onChange={setCrownRepair}
                        />
                    </SectionCard>

                    <SectionCard
                        title="Kết luận kỹ thuật"
                        icon={<ScanSearch className="h-5 w-5" />}
                        badge={
                            <div className="flex items-center gap-2">
                                <ScorePill score={appearanceScore} />
                                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                                    Tổng chi phí: {formatCurrency(totalCost)}
                                </div>
                            </div>
                        }
                    >
                        <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Ảnh kỹ thuật
                                </label>
                                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                    {productImage ? (
                                        <img
                                            src={productImage}
                                            alt={productName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                            No image
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Field label="Kết luận / hướng xử lý">
                                <TextArea
                                    className="min-h-[160px]"
                                    placeholder="Ví dụ: máy chạy ổn, ngoại hình tổng thể 84/100, kính có xước nhẹ, mặt số sạch, núm cần fix..."
                                    value={conclusion}
                                    onChange={(e) => setConclusion(e.target.value)}
                                />
                            </Field>
                        </div>
                    </SectionCard>
                </div>

                <div className="border-t border-slate-200 bg-white px-6 py-4">
                    <div className="space-y-3">
                        {errorMessage ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                    <span className="mr-2 text-slate-500">Điểm ngoại hình</span>
                                    <span className="text-base font-semibold text-slate-950">
                                        {appearanceScore}/100
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                    <span className="mr-2 text-slate-500">Tổng chi phí xử lý</span>
                                    <span className="text-base font-semibold text-slate-950">
                                        {formatCurrency(totalCost)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                                    Hủy
                                </Button>
                                <Button type="button" onClick={handleSave} disabled={saving}>
                                    {saving ? "Đang lưu..." : "Lưu đánh giá kỹ thuật"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}