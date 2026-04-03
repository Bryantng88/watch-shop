"use client";

import * as React from "react";
import {
    AlertTriangle,
    Camera,
    ChevronDown,
    ChevronRight,
    CircleCheck,
    Plus,
    ScanSearch,
    ShieldCheck,
    Trash2,
    Wrench,
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

type AppearanceIssueCode = string;

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

type TechnicalAssessmentFormState = {
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
    caseAppearance: AppearanceBlockValue;
    glassAppearance: AppearanceBlockValue;
    dialAppearance: AppearanceBlockValue;
    crownRepair: CrownRepairState;
    conclusion: string;
    hasEditedConclusion: boolean;
};

type CatalogAction = {
    id: string;
    code: string;
    name: string;
    appliesTo: string;
    requiresPart: boolean;
    defaultExecutionMode: string | null;
};

type CatalogPart = {
    id: string;
    code: string;
    name: string;
    partGroup: string;
};

type CatalogAppearanceIssue = {
    id: string;
    code: string;
    label: string;
    deductionScore: number;
};

type TechnicalCatalogs = {
    movementActions: CatalogAction[];
    crownActions?: CatalogAction[];
    parts: CatalogPart[];
    appearanceIssues: {
        CASE: CatalogAppearanceIssue[];
        CRYSTAL: CatalogAppearanceIssue[];
        DIAL: CatalogAppearanceIssue[];
    };
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
        beforeSpecs?: { rate?: string; amp?: string; err?: string };
        afterSpecs?: { rate?: string; amp?: string; err?: string };
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

const fallbackVendors = [
    { id: "v1", name: "Vendor A" },
    { id: "v2", name: "Vendor B" },
    { id: "v3", name: "Vendor C" },
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

function createInitialFormState(): TechnicalAssessmentFormState {
    return {
        machineType: "MECHANICAL",
        movementStatus: "GOOD",
        showBeforeSpecs: false,
        beforeSpecs: { rate: "", amp: "", err: "" },
        afterSpecs: { rate: "", amp: "", err: "" },
        movementLines: [{ id: makeId(), execution: "INHOUSE" }],
        caseAppearance: emptyAppearanceBlock(),
        glassAppearance: emptyAppearanceBlock(),
        dialAppearance: emptyAppearanceBlock(),
        crownRepair: {
            status: "GOOD",
            action: undefined,
            execution: undefined,
            vendorId: undefined,
            partId: undefined,
            cost: "",
            note: "",
        },
        conclusion: "",
        hasEditedConclusion: false,
    };
}

function Pill({ children, tone = "gray" }: { children: React.ReactNode; tone?: "neutral" | "amber" | "gray" }) {
    const styles = {
        neutral: "border-slate-200 bg-slate-50 text-slate-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        gray: "border-slate-200 bg-slate-100 text-slate-700",
    };

    return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", styles[tone])}>{children}</span>;
}

function ApprovalPill({ status }: { status?: ApprovalStatus }) {
    if (status === "APPROVED") return <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Đã duyệt</span>;
    if (status === "REJECTED") return <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">Từ chối</span>;
    return <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Chờ duyệt</span>;
}

function SectionCard({ title, icon, badge, children }: { title: string; icon?: React.ReactNode; badge?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">{icon}</div>
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                </div>
                {badge}
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </section>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cx("h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400", props.className)} />;
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={cx("h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400", props.className)} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={cx("min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400", props.className)} />;
}

function Button({ children, variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
    const styles = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
        outline: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
    };

    return <button {...props} className={cx("inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition disabled:opacity-50", styles[variant], className)}>{children}</button>;
}

function CompactStatusToggle({ value, onChange, goodText = "Đẹp / ổn", issueText = "Cần xử lý" }: { value: HealthStatus | FunctionalStatus; onChange: (value: HealthStatus | FunctionalStatus) => void; goodText?: string; issueText?: string }) {
    return (
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button type="button" onClick={() => onChange("GOOD")} className={cx("rounded-lg px-4 py-2 text-sm font-medium transition", value === "GOOD" ? "border border-slate-300 bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/70" : "text-slate-500 hover:text-slate-800")}>{goodText}</button>
            <button type="button" onClick={() => onChange("ISSUE")} className={cx("rounded-lg px-4 py-2 text-sm font-medium transition", value === "ISSUE" ? "border border-amber-200 bg-amber-50 text-amber-800 shadow-sm ring-1 ring-amber-100" : "text-slate-500 hover:text-slate-800")}>{issueText}</button>
        </div>
    );
}

function statusBadge(status: HealthStatus, goodLabel = "Đẹp / ổn", issueLabel = "Cần xử lý") {
    return status === "GOOD" ? <Pill tone="neutral">{goodLabel}</Pill> : <Pill tone="amber">{issueLabel}</Pill>;
}

function calculateAppearanceScore(block: AppearanceBlockValue, definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]) {
    const issueDeduction = block.issues.reduce((sum, code) => {
        const found = definitions.find((item) => item.code === code);
        return sum + (found?.deduction ?? 0);
    }, 0);
    const manual = Math.max(0, parseNumber(block.manualDeduction));
    return Math.max(0, 100 - issueDeduction - manual);
}

function issueSummary(block: AppearanceBlockValue, definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]) {
    return block.issues.map((code) => definitions.find((item) => item.code === code)?.label).filter(Boolean).join(", ");
}

function IssueCheckboxGroup({ options, selected, onChange }: { options: { code: AppearanceIssueCode; label: string; deduction: number }[]; selected: AppearanceIssueCode[]; onChange: (next: AppearanceIssueCode[]) => void }) {
    function toggleIssue(code: AppearanceIssueCode) {
        if (selected.includes(code)) return onChange(selected.filter((item) => item !== code));
        onChange([...selected, code]);
    }

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((item) => {
                const active = selected.includes(item.code);
                return (
                    <button key={item.code} type="button" onClick={() => toggleIssue(item.code)} className={cx("rounded-full border px-3 py-1.5 text-sm transition", active ? "border-slate-300 bg-slate-100 text-slate-900" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300")}>{item.label}<span className="ml-1 text-slate-400">(-{item.deduction})</span></button>
                );
            })}
        </div>
    );
}

function ScorePill({ score }: { score: number }) {
    const tone = score >= 90 ? "border-slate-300 bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/70" : score >= 80 ? "border-slate-300 bg-slate-50 text-slate-800 shadow-sm" : "border-amber-200 bg-amber-50/70 text-amber-800 shadow-sm";
    return <div className={cx("rounded-full border px-3 py-1 text-xs font-semibold", tone)}>{score}/100</div>;
}

function CosmeticProposalFields({ title, value, onChange, actionOptions, vendors }: { title: string; value: CosmeticProposal; onChange: (value: CosmeticProposal) => void; actionOptions: { value: CosmeticProposalAction; label: string }[]; vendors: Array<{ id: string; name: string }> }) {
    const isVendor = value.execution === "VENDOR";
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Đề xuất xử lý</div>
                    <div className="mt-1 text-sm text-slate-500">Đề xuất này sẽ sinh Technical Issue để theo dõi tiếp sau khi lưu phiếu.</div>
                </div>
                {value.enabled ? <ApprovalPill status={value.approvalStatus} /> : null}
            </div>
            <div className="space-y-4">
                <CompactStatusToggle value={value.enabled ? "ISSUE" : "GOOD"} onChange={(v) => onChange({ ...value, enabled: v === "ISSUE", requiresApproval: false, approvalStatus: undefined })} goodText="Không đề xuất" issueText="Có đề xuất" />
                {value.enabled ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Phương án đề xuất">
                            <SelectInput value={value.action ?? ""} onChange={(e) => onChange({ ...value, action: e.target.value as CosmeticProposalAction })}>
                                <option value="">Chọn phương án</option>
                                {actionOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </SelectInput>
                        </Field>
                        <Field label="Thực hiện dự kiến">
                            <SelectInput value={value.execution ?? ""} onChange={(e) => onChange({ ...value, execution: e.target.value as ExecutionType, vendorId: e.target.value === "VENDOR" ? value.vendorId : undefined })}>
                                <option value="">Chọn hình thức</option>
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>
                        <Field label="Chi phí dự kiến">
                            <TextInput inputMode="numeric" placeholder="0" value={value.estimatedCost ?? ""} onChange={(e) => onChange({ ...value, estimatedCost: e.target.value })} />
                        </Field>
                        {isVendor ? (
                            <Field label="Vendor dự kiến">
                                <SelectInput value={value.vendorId ?? ""} onChange={(e) => onChange({ ...value, vendorId: e.target.value })}>
                                    <option value="">Chọn vendor</option>
                                    {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
                                </SelectInput>
                            </Field>
                        ) : null}
                        <div className="md:col-span-3">
                            <Field label="Lý do đề xuất">
                                <TextArea placeholder={`Ví dụ: ${title.toLowerCase()} chưa đủ đẹp để lên bài, cần xử lý trước khi sale đăng bán.`} value={value.note ?? ""} onChange={(e) => onChange({ ...value, note: e.target.value })} />
                            </Field>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function CollapsibleAppearanceCard({ title, score, summary, defaultOpen = false, children }: { title: string; score: number; summary: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = React.useState(defaultOpen);
    React.useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
            <button type="button" onClick={() => setOpen((prev) => !prev)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 truncate text-sm text-slate-500">{summary || "Chưa ghi nhận khuyết điểm"}</div>
                </div>
                <div className="flex items-center gap-2">
                    <ScorePill score={score} />
                    {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                </div>
            </button>
            {open ? <div className="border-t border-slate-200 bg-slate-50/40 p-4">{children}</div> : null}
        </div>
    );
}

function AppearanceScoreBlock({ title, description, value, onChange, definitions, proposalActions, vendors }: { title: string; description?: string; value: AppearanceBlockValue; onChange: (value: AppearanceBlockValue) => void; definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]; proposalActions: { value: CosmeticProposalAction; label: string }[]; vendors: Array<{ id: string; name: string }> }) {
    const score = calculateAppearanceScore(value, definitions);
    const summary = issueSummary(value, definitions);
    return (
        <CollapsibleAppearanceCard title={title} score={score} summary={summary} defaultOpen={value.issues.length > 0 || value.proposal.enabled}>
            <div className="space-y-4">
                {description ? <div className="text-sm text-slate-500">{description}</div> : null}
                <Field label="Khuyết điểm ghi nhận"><IssueCheckboxGroup options={definitions} selected={value.issues} onChange={(issues) => onChange({ ...value, issues })} /></Field>
                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                    <Field label="Trừ thêm"><TextInput inputMode="numeric" placeholder="0" value={value.manualDeduction} onChange={(e) => onChange({ ...value, manualDeduction: e.target.value })} /></Field>
                    <Field label="Tóm tắt nhanh"><div className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600">{summary || "Chưa ghi nhận khuyết điểm"}</div></Field>
                </div>
                <Field label="Ghi chú"><TextArea placeholder="Ghi chú thêm về tình trạng thực tế..." value={value.note ?? ""} onChange={(e) => onChange({ ...value, note: e.target.value })} /></Field>
                <CosmeticProposalFields title={title} value={value.proposal} onChange={(proposal) => onChange({ ...value, proposal })} actionOptions={proposalActions} vendors={vendors} />
            </div>
        </CollapsibleAppearanceCard>
    );
}

function CrownFunctionalBlock({ value, onChange, vendors, crownActions, parts }: { value: CrownRepairState; onChange: (value: CrownRepairState) => void; vendors: Array<{ id: string; name: string }>; crownActions: CatalogAction[]; parts: CatalogPart[] }) {
    const isIssue = value.status === "ISSUE";
    const isVendor = value.execution === "VENDOR";
    const selectedCrownAction = (crownActions ?? []).find(
        (x) => x.code === value.action
    );
    const crownNeedsPart = !!selectedCrownAction?.requiresPart;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <div className="text-sm font-semibold text-slate-900">Núm</div>
                <Pill tone={isIssue ? "amber" : "neutral"}>{isIssue ? "Cần xử lý" : "Ổn"}</Pill>
            </div>
            <div className="space-y-4 bg-slate-50/40 p-4">
                <div>
                    <div className="mb-2 text-sm font-medium text-slate-700">Tình trạng chức năng</div>
                    <CompactStatusToggle value={value.status} onChange={(status) => onChange({ ...value, status: status as FunctionalStatus })} goodText="Ổn" issueText="Cần xử lý" />
                </div>
                {isIssue ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Xử lý">
                            <SelectInput value={value.action ?? ""} onChange={(e) => { const picked = crownActions.find((x) => x.code === e.target.value); onChange({ ...value, action: e.target.value as CrownAction, execution: picked?.defaultExecutionMode === "VENDOR" ? "VENDOR" : value.execution, partId: picked?.requiresPart ? value.partId : undefined }); }}>
                                <option value="">Chọn xử lý</option>
                                {crownActions.map((item) => <option key={item.id} value={item.code}>{item.name}</option>)}
                            </SelectInput>
                        </Field>
                        <Field label="Thực hiện">
                            <SelectInput value={value.execution ?? ""} onChange={(e) => onChange({ ...value, execution: e.target.value as ExecutionType, vendorId: e.target.value === "VENDOR" ? value.vendorId : undefined })}>
                                <option value="">Chọn hình thức</option>
                                <option value="INHOUSE">Nội bộ</option>
                                <option value="VENDOR">Vendor</option>
                            </SelectInput>
                        </Field>
                        <Field label="Chi phí"><TextInput inputMode="numeric" placeholder="0" value={value.cost ?? ""} onChange={(e) => onChange({ ...value, cost: e.target.value })} /></Field>
                        {isVendor ? <Field label="Vendor"><SelectInput value={value.vendorId ?? ""} onChange={(e) => onChange({ ...value, vendorId: e.target.value })}><option value="">Chọn vendor</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</SelectInput></Field> : null}
                        {crownNeedsPart ? <Field label="Danh mục linh kiện"><SelectInput value={value.partId ?? ""} onChange={(e) => onChange({ ...value, partId: e.target.value })}><option value="">Chọn linh kiện</option>{parts.map((part) => <option key={part.id} value={part.id}>{part.name}</option>)}</SelectInput></Field> : null}
                        <div className="md:col-span-3"><Field label="Ghi chú"><TextArea placeholder="Ví dụ: núm trượt ren, lên cót nặng tay, cần thay cả ti..." value={value.note ?? ""} onChange={(e) => onChange({ ...value, note: e.target.value })} /></Field></div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function generateTechnicalConclusion(params: { movementStatus: HealthStatus; machineType: MachineType; movementLines: MovementLine[]; appearanceScore: number; caseAppearance: AppearanceBlockValue; glassAppearance: AppearanceBlockValue; dialAppearance: AppearanceBlockValue; crownRepair: CrownRepairState; caseDefs: { code: AppearanceIssueCode; label: string; deduction: number }[]; glassDefs: { code: AppearanceIssueCode; label: string; deduction: number }[]; dialDefs: { code: AppearanceIssueCode; label: string; deduction: number }[]; }) {
    const { movementStatus, machineType, movementLines, appearanceScore, caseAppearance, glassAppearance, dialAppearance, crownRepair, caseDefs, glassDefs, dialDefs } = params;
    function movementActionLabel(action?: MovementAction) {
        switch (action) {
            case "SERVICE": return "lau dầu";
            case "REPLACE_PART": return "thay linh kiện";
            case "REGULATE": return "chỉnh sai số";
            case "WATERPROOF": return "chống nước";
            case "REPLACE_MOVEMENT": return "thay máy";
            case "BATTERY_CHANGE": return "thay pin";
            default: return null;
        }
    }
    function issueLabels(issues: AppearanceIssueCode[], definitions: { code: AppearanceIssueCode; label: string; deduction: number }[]) {
        return issues.map((code) => definitions.find((item) => item.code === code)?.label).filter((value): value is string => Boolean(value));
    }
    const caseScore = calculateAppearanceScore(caseAppearance, caseDefs);
    const glassScore = calculateAppearanceScore(glassAppearance, glassDefs);
    const dialScore = calculateAppearanceScore(dialAppearance, dialDefs);
    const lines: string[] = [];
    if (movementStatus === "GOOD") {
        lines.push(`✓ Máy: ${machineType === "MECHANICAL" ? "Máy cơ" : "Máy pin"} chạy ổn${machineType === "MECHANICAL" ? ", đã ghi nhận thông số kiểm tra." : "."}`);
    } else {
        const actions = movementLines.map((line) => movementActionLabel(line.action)).filter((value): value is string => Boolean(value));
        lines.push(`⚠ Máy: Cần xử lý kỹ thuật${actions.length ? ` (${actions.join(", ")})` : ""}.`);
    }
    const caseIssues = issueLabels(caseAppearance.issues, caseDefs);
    lines.push(caseIssues.length ? `⚠ Vỏ: ${caseIssues.join(", ")} (${caseScore}/100).` : `✓ Vỏ: Chưa ghi nhận khuyết điểm (${caseScore}/100).`);
    const glassIssues = issueLabels(glassAppearance.issues, glassDefs);
    lines.push(glassIssues.length ? `⚠ Kính: ${glassIssues.join(", ")} (${glassScore}/100).` : `✓ Kính: Chưa ghi nhận khuyết điểm (${glassScore}/100).`);
    const dialIssues = issueLabels(dialAppearance.issues, dialDefs);
    lines.push(dialIssues.length ? `⚠ Mặt số: ${dialIssues.join(", ")} (${dialScore}/100).` : `✓ Mặt số: Chưa ghi nhận khuyết điểm (${dialScore}/100).`);
    lines.push(crownRepair.status === "ISSUE" ? "⚠ Núm: Cần xử lý." : "✓ Núm: Hoạt động ổn.");
    lines.push(`Điểm ngoại hình tổng thể: ${appearanceScore}/100.`);
    return lines.join("\n");
}

function buildSubmitPayload(params: { serviceRequestId: string; productName?: string; productSku?: string | null; productImage?: string | null; movementSpecLabel?: string | null; machineType: MachineType; movementStatus: HealthStatus; showBeforeSpecs: boolean; beforeSpecs: { rate: string; amp: string; err: string }; afterSpecs: { rate: string; amp: string; err: string }; movementLines: MovementLine[]; caseAppearance: AppearanceBlockValue; glassAppearance: AppearanceBlockValue; dialAppearance: AppearanceBlockValue; crownRepair: CrownRepairState; conclusion: string; caseDefs: { code: AppearanceIssueCode; label: string; deduction: number }[]; glassDefs: { code: AppearanceIssueCode; label: string; deduction: number }[]; dialDefs: { code: AppearanceIssueCode; label: string; deduction: number }[]; }): TechnicalAssessmentSubmitPayload {
    const { serviceRequestId, productName, productSku, productImage, movementSpecLabel, machineType, movementStatus, showBeforeSpecs, beforeSpecs, afterSpecs, movementLines, caseAppearance, glassAppearance, dialAppearance, crownRepair, conclusion, caseDefs, glassDefs, dialDefs } = params;
    const caseScore = calculateAppearanceScore(caseAppearance, caseDefs);
    const glassScore = calculateAppearanceScore(glassAppearance, glassDefs);
    const dialScore = calculateAppearanceScore(dialAppearance, dialDefs);
    const appearanceScore = Math.round(caseScore * 0.4 + glassScore * 0.2 + dialScore * 0.4);
    const movementCost = movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const crownCost = parseMoney(crownRepair.cost);
    const cosmeticProposalCost = parseMoney(caseAppearance.proposal.enabled ? caseAppearance.proposal.estimatedCost : "") + parseMoney(glassAppearance.proposal.enabled ? glassAppearance.proposal.estimatedCost : "") + parseMoney(dialAppearance.proposal.enabled ? dialAppearance.proposal.estimatedCost : "");
    const totalCost = movementCost + crownCost + cosmeticProposalCost;

    return {
        serviceRequestId,
        productSnapshot: { name: productName, sku: productSku, image: productImage, movementSpecLabel },
        movement: {
            machineType,
            status: movementStatus,
            beforeSpecs: machineType === "MECHANICAL" && showBeforeSpecs ? { rate: beforeSpecs.rate || undefined, amp: beforeSpecs.amp || undefined, err: beforeSpecs.err || undefined } : undefined,
            afterSpecs: machineType === "MECHANICAL" ? { rate: afterSpecs.rate || undefined, amp: afterSpecs.amp || undefined, err: afterSpecs.err || undefined } : undefined,
            lines: movementStatus === "ISSUE" ? movementLines.map((line) => ({ action: line.action, execution: line.execution, vendorId: line.vendorId, partId: line.partId, cost: parseMoney(line.cost), note: line.note })) : [],
        },
        appearance: {
            score: appearanceScore,
            case: { score: caseScore, issues: caseAppearance.issues, manualDeduction: parseNumber(caseAppearance.manualDeduction), note: caseAppearance.note, proposal: { enabled: caseAppearance.proposal.enabled, action: caseAppearance.proposal.action, estimatedCost: parseMoney(caseAppearance.proposal.estimatedCost), execution: caseAppearance.proposal.execution, vendorId: caseAppearance.proposal.vendorId, note: caseAppearance.proposal.note, requiresApproval: false, approvalStatus: undefined } },
            glass: { score: glassScore, issues: glassAppearance.issues, manualDeduction: parseNumber(glassAppearance.manualDeduction), note: glassAppearance.note, proposal: { enabled: glassAppearance.proposal.enabled, action: glassAppearance.proposal.action, estimatedCost: parseMoney(glassAppearance.proposal.estimatedCost), execution: glassAppearance.proposal.execution, vendorId: glassAppearance.proposal.vendorId, note: glassAppearance.proposal.note, requiresApproval: false, approvalStatus: undefined } },
            dial: { score: dialScore, issues: dialAppearance.issues, manualDeduction: parseNumber(dialAppearance.manualDeduction), note: dialAppearance.note, proposal: { enabled: dialAppearance.proposal.enabled, action: dialAppearance.proposal.action, estimatedCost: parseMoney(dialAppearance.proposal.estimatedCost), execution: dialAppearance.proposal.execution, vendorId: dialAppearance.proposal.vendorId, note: dialAppearance.proposal.note, requiresApproval: false, approvalStatus: undefined } },
            crown: { status: crownRepair.status, action: crownRepair.action, execution: crownRepair.execution, vendorId: crownRepair.vendorId, partId: crownRepair.partId, cost: parseMoney(crownRepair.cost), note: crownRepair.note },
        },
        financialSummary: { movementCost, crownCost, cosmeticProposalCost, totalCost },
        conclusion,
    };
}

async function saveTechnicalAssessment(payload: TechnicalAssessmentSubmitPayload) {
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

export default function TechnicalAssessmentModal({ open, serviceRequestId, onClose, onSaved, productName = "takeo kuchi méo pin mặt xanh", productSku = "-", productImage = null, movementSpecLabel = "-" }: TechnicalAssessmentModalProps) {
    const [form, setForm] = React.useState<TechnicalAssessmentFormState>(createInitialFormState());
    const [saving, setSaving] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [catalogs, setCatalogs] = React.useState<TechnicalCatalogs | null>(null);
    const [panelLoading, setPanelLoading] = React.useState(false);

    React.useEffect(() => {
        if (!open || !serviceRequestId) return;
        setForm(createInitialFormState());
        setErrorMessage(null);
    }, [open, serviceRequestId]);

    React.useEffect(() => {
        if (!open || !serviceRequestId) return;
        let cancelled = false;
        async function loadPanel() {
            try {
                setPanelLoading(true);
                const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/technical-panel`, { cache: "no-store" });
                if (!res.ok) throw new Error("Load technical panel failed");
                const json = await res.json();
                const data = json?.data;
                if (cancelled || !data) return;
                setCatalogs(data.catalogs ?? null);
            } catch (error) {
                console.error(error);
                if (!cancelled) setCatalogs(null);
            } finally {
                if (!cancelled) setPanelLoading(false);
            }
        }
        loadPanel();
        return () => { cancelled = true; };
    }, [open, serviceRequestId]);

    const CASE_ISSUES = React.useMemo(() => (catalogs?.appearanceIssues?.CASE ?? []).map((x) => ({ code: x.code as AppearanceIssueCode, label: x.label, deduction: x.deductionScore })), [catalogs]);
    const GLASS_ISSUES = React.useMemo(() => (catalogs?.appearanceIssues?.CRYSTAL ?? []).map((x) => ({ code: x.code as AppearanceIssueCode, label: x.label, deduction: x.deductionScore })), [catalogs]);
    const DIAL_ISSUES = React.useMemo(() => (catalogs?.appearanceIssues?.DIAL ?? []).map((x) => ({ code: x.code as AppearanceIssueCode, label: x.label, deduction: x.deductionScore })), [catalogs]);

    const vendors = fallbackVendors;
    const movementActions = catalogs?.movementActions ?? [];
    const crownActions = catalogs?.crownActions ?? [];
    const parts = catalogs?.parts ?? [];

    const caseScore = calculateAppearanceScore(form.caseAppearance, CASE_ISSUES);
    const glassScore = calculateAppearanceScore(form.glassAppearance, GLASS_ISSUES);
    const dialScore = calculateAppearanceScore(form.dialAppearance, DIAL_ISSUES);
    const appearanceScore = Math.round(caseScore * 0.4 + glassScore * 0.2 + dialScore * 0.4);
    const movementCost = form.movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const crownCost = parseMoney(form.crownRepair.cost);
    const cosmeticProposalCost = parseMoney(form.caseAppearance.proposal.enabled ? form.caseAppearance.proposal.estimatedCost : "") + parseMoney(form.glassAppearance.proposal.enabled ? form.glassAppearance.proposal.estimatedCost : "") + parseMoney(form.dialAppearance.proposal.enabled ? form.dialAppearance.proposal.estimatedCost : "");
    const totalCost = movementCost + crownCost + cosmeticProposalCost;

    const autoConclusion = React.useMemo(() => generateTechnicalConclusion({ movementStatus: form.movementStatus, machineType: form.machineType, movementLines: form.movementLines, appearanceScore, caseAppearance: form.caseAppearance, glassAppearance: form.glassAppearance, dialAppearance: form.dialAppearance, crownRepair: form.crownRepair, caseDefs: CASE_ISSUES, glassDefs: GLASS_ISSUES, dialDefs: DIAL_ISSUES }), [form.movementStatus, form.machineType, form.movementLines, appearanceScore, form.caseAppearance, form.glassAppearance, form.dialAppearance, form.crownRepair, CASE_ISSUES, GLASS_ISSUES, DIAL_ISSUES]);

    React.useEffect(() => {
        if (!form.hasEditedConclusion) {
            setForm((prev) => ({ ...prev, conclusion: autoConclusion }));
        }
    }, [autoConclusion, form.hasEditedConclusion]);

    function addMovementLine() { setForm((prev) => ({ ...prev, movementLines: [...prev.movementLines, { id: makeId(), execution: "INHOUSE" }] })); }
    function updateMovementLine(id: string, patch: Partial<MovementLine>) { setForm((prev) => ({ ...prev, movementLines: prev.movementLines.map((line) => line.id === id ? { ...line, ...patch } : line) })); }
    function removeMovementLine(id: string) { setForm((prev) => ({ ...prev, movementLines: prev.movementLines.filter((line) => line.id !== id) })); }

    async function handleSave() {
        if (!serviceRequestId) return setErrorMessage("Thiếu service request id");
        try {
            setSaving(true); setErrorMessage(null);
            const payload = buildSubmitPayload({ serviceRequestId, productName, productSku, productImage, movementSpecLabel, machineType: form.machineType, movementStatus: form.movementStatus, showBeforeSpecs: form.showBeforeSpecs, beforeSpecs: form.beforeSpecs, afterSpecs: form.afterSpecs, movementLines: form.movementLines, caseAppearance: form.caseAppearance, glassAppearance: form.glassAppearance, dialAppearance: form.dialAppearance, crownRepair: form.crownRepair, conclusion: form.conclusion, caseDefs: CASE_ISSUES, glassDefs: GLASS_ISSUES, dialDefs: DIAL_ISSUES });
            await saveTechnicalAssessment(payload);
            await onSaved();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Lưu thất bại");
        } finally {
            setSaving(false);
        }
    }

    const isMechanical = form.machineType === "MECHANICAL";
    const needsRepair = form.movementStatus === "ISSUE";
    const imageSrc = productImage ? `/api/media/sign?key=${encodeURIComponent(productImage)}` : null;

    if (!open) return null;

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
                                                src={`/api/media/sign?key=${encodeURIComponent(productImage)}`}
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
                        badge={statusBadge(form.movementStatus, "Chạy tốt")}
                    >
                        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
                            <Field label="Loại máy">
                                <SelectInput
                                    value={form.machineType}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            machineType: e.target.value as MachineType,
                                        }))
                                    }
                                >
                                    <option value="MECHANICAL">Máy cơ</option>
                                    <option value="QUARTZ">Máy pin</option>
                                </SelectInput>
                            </Field>

                            <Field label="Tình trạng máy">
                                <CompactStatusToggle
                                    value={form.movementStatus}
                                    onChange={(v) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            movementStatus: v as HealthStatus,
                                        }))
                                    }
                                    goodText="Chạy tốt"
                                    issueText="Cần xử lý"
                                />
                            </Field>
                        </div>

                        {form.movementStatus === "GOOD" ? (
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

                                                        {form.movementLines.length > 1 && (
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
                                                                {form.machineType === "MECHANICAL" ? (
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
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                                            <div className="mb-3 text-sm font-semibold text-slate-900">
                                                Thông số trước xử lý
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
                                        <Field label="Rate">
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
                                        <Field label="Amp">
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
                                        <Field label="Err">
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
                            value={form.caseAppearance}
                            onChange={(next) =>
                                setForm((prev) => ({
                                    ...prev,
                                    caseAppearance: next,
                                }))
                            }
                            definitions={CASE_ISSUES}
                            proposalActions={CASE_PROPOSAL_ACTIONS}
                            vendors={vendors}
                        />

                        <AppearanceScoreBlock
                            title="Kính"
                            description="Tính điểm theo độ trong, độ xước, nứt hoặc tình trạng xuống cấp của kính."
                            value={form.glassAppearance}
                            onChange={(next) =>
                                setForm((prev) => ({
                                    ...prev,
                                    glassAppearance: next,
                                }))
                            }
                            definitions={GLASS_ISSUES}
                            proposalActions={GLASS_PROPOSAL_ACTIONS}
                            vendors={vendors}
                        />

                        <AppearanceScoreBlock
                            title="Mặt số"
                            description="Tính điểm theo độ sạch, độ đều màu, tình trạng cọc số, kim và bề mặt."
                            value={form.dialAppearance}
                            onChange={(next) =>
                                setForm((prev) => ({
                                    ...prev,
                                    dialAppearance: next,
                                }))
                            }
                            definitions={DIAL_ISSUES}
                            proposalActions={DIAL_PROPOSAL_ACTIONS}
                            vendors={vendors}
                        />

                        <CrownFunctionalBlock
                            value={form.crownRepair}
                            onChange={(next) =>
                                setForm((prev) => ({
                                    ...prev,
                                    crownRepair: next,
                                }))
                            }
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
                                            src={`/api/media/sign?key=${encodeURIComponent(productImage)}`}
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

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Kết luận / hướng xử lý
                                    </label>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                conclusion: autoConclusion,
                                                hasEditedConclusion: false,
                                            }))
                                        }
                                    >
                                        Tự tổng hợp
                                    </Button>
                                </div>

                                <TextArea
                                    className="min-h-[160px]"
                                    placeholder="Ví dụ: máy chạy ổn, ngoại hình tổng thể 84/100..."
                                    value={form.conclusion}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            conclusion: e.target.value,
                                            hasEditedConclusion: true,
                                        }))
                                    }
                                />
                            </div>
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
