"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ImagePlus, Plus, ScanSearch, Wrench } from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";
import TechnicalImagePicker from "@/components/media/TechnicalImagePicker";

import {
    FormState,
    TechnicalAssessmentPanelProps,
    CosmeticAction,
    ExecutionType,
} from "./types";
import {
    buildTechnicalSummaryForSale,
    calculateAppearanceScore,
    createInitialFormState,
    emptyQuickIssue,
    formatCurrency,
    mapMovementSpecLabelToMachineType,
    parseMoney,
    parseNumber,
} from "./utils";
import {
    Button,
    Field,
    SectionCard,
    SelectInput,
    StatusToggle,
    TextInput,
} from "./primitives";
import { MovementIssueRow, StaticIssueSummary } from "./issue-rows";
import QuickIssueCard from "./quick-issue-card";
import { CollapsibleDefects } from "./final-summary";

const QUICK_PANEL_HEIGHT = "h-[190px]";

function cosmeticActionLabel(action?: CosmeticAction) {
    const map: Record<string, string> = {
        SPA_CASE: "Spa vỏ",
        POLISH_CASE: "Đánh bóng vỏ",
        REPLATE_CASE: "Mạ lại vỏ",
        POLISH_GLASS: "Đánh bóng kính",
        REPLACE_GLASS: "Thay kính",
        CLEAN_DIAL: "Vệ sinh mặt số",
        REPLACE_DIAL: "Thay mặt số",
        KEEP_ORIGINAL: "Giữ nguyên",
    };
    return action ? map[action] || action : undefined;
}

function crownActionLabel(action?: string) {
    const map: Record<string, string> = {
        FIX_CROWN: "Sửa núm",
        REPLACE_CROWN: "Thay núm",
        RETHREAD: "Làm ren",
        STEM_ADJUST: "Chỉnh ty",
        WATERPROOF: "Chống nước",
    };
    return action ? map[action] || action : undefined;
}

function QuickIssueRowCard({
    title,
    subtitle,
    executionLabel,
    costText,
    children,
}: {
    title: string;
    subtitle?: string;
    executionLabel?: string;
    costText?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70 shadow-inner">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white/60 px-5 py-4">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-sky-700">{subtitle || "Đang soạn"}</div>
                </div>

                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                        {executionLabel || "Nội bộ"}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                        Chi phí dự kiến {costText || "0đ"}
                    </div>
                </div>
            </div>

            <div className="px-5 py-5">{children}</div>
        </div>
    );
}

function QuickIssueDraftEditor({
    title,
    value,
    vendors,
    disabled,
    actionOptions,
    onChange,
    onGoBoard,
}: {
    title: string;
    value: FormState["caseIssue"] | FormState["crystalIssue"] | FormState["dialIssue"];
    vendors: any[];
    disabled: boolean;
    actionOptions: Array<{ value: CosmeticAction; label: string }>;
    onChange: (patch: Partial<FormState["caseIssue"]>) => void;
    onGoBoard: () => void;
}) {
    if (value.isFromBoard) {
        return (
            <StaticIssueSummary
                lineNo={1}
                summary={value.summary || `${title} đã được ghi nhận tại Issue Board`}
                boardStatus={value.boardStatus}
                execution={value.execution}
                cost={formatCurrency(parseMoney(value.estimatedCost))}
                vendorName={value.vendorName || vendors.find((v: any) => v.id === value.vendorId)?.name}
                actionLabel={cosmeticActionLabel(value.action)}
                onGoBoard={onGoBoard}
                readOnly={disabled}
            />
        );
    }

    const isVendor = value.execution === "VENDOR";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                    <Field label={`${title} - phương án xử lý`}>
                        <SelectInput
                            value={value.action ?? ""}
                            onChange={(e) => onChange({ action: e.target.value as CosmeticAction })}
                            disabled={disabled}
                        >
                            <option value="">Chọn phương án</option>
                            {actionOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </SelectInput>
                    </Field>
                </div>

                <div className="md:col-span-4">
                    <Field label="Thực hiện">
                        <SelectInput
                            value={value.execution ?? "INHOUSE"}
                            onChange={(e) =>
                                onChange({
                                    execution: e.target.value as ExecutionType,
                                    vendorId: e.target.value === "VENDOR" ? value.vendorId : undefined,
                                })
                            }
                            disabled={disabled}
                        >
                            <option value="INHOUSE">Nội bộ</option>
                            <option value="VENDOR">Vendor</option>
                        </SelectInput>
                    </Field>
                </div>

                <div className="md:col-span-3">
                    <Field label="Chi phí dự kiến">
                        <TextInput
                            inputMode="numeric"
                            placeholder="0"
                            value={value.estimatedCost ?? ""}
                            onChange={(e) => onChange({ estimatedCost: e.target.value })}
                            disabled={disabled}
                        />
                    </Field>
                </div>
            </div>

            {isVendor ? (
                <div className="mt-4">
                    <Field label="Vendor">
                        <SelectInput
                            value={value.vendorId ?? ""}
                            onChange={(e) => onChange({ vendorId: e.target.value })}
                            disabled={disabled}
                        >
                            <option value="">Chọn vendor</option>
                            {vendors.map((vendor: any) => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </SelectInput>
                    </Field>
                </div>
            ) : null}
        </div>
    );
}

function CrownIssueDraftEditor({
    value,
    vendors,
    disabled,
    onChange,
    onGoBoard,
}: {
    value: FormState["crownIssue"];
    vendors: any[];
    disabled: boolean;
    onChange: (patch: Partial<FormState["crownIssue"]>) => void;
    onGoBoard: () => void;
}) {
    if (value.isFromBoard) {
        return (
            <StaticIssueSummary
                lineNo={1}
                summary={value.summary || "Núm đã được ghi nhận tại Issue Board"}
                boardStatus={value.boardStatus}
                execution={value.execution}
                cost={formatCurrency(parseMoney(value.cost))}
                vendorName={value.vendorName || vendors.find((v: any) => v.id === value.vendorId)?.name}
                actionLabel={crownActionLabel(value.action)}
                onGoBoard={onGoBoard}
                readOnly={disabled}
            />
        );
    }

    const isVendor = value.execution === "VENDOR";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                    <Field label="Núm - phương án xử lý">
                        <SelectInput
                            value={value.action ?? ""}
                            onChange={(e) => onChange({ action: e.target.value as any })}
                            disabled={disabled}
                        >
                            <option value="">Chọn phương án</option>
                            <option value="FIX_CROWN">Sửa núm</option>
                            <option value="REPLACE_CROWN">Thay núm</option>
                            <option value="RETHREAD">Làm ren</option>
                            <option value="STEM_ADJUST">Chỉnh ty</option>
                            <option value="WATERPROOF">Chống nước</option>
                        </SelectInput>
                    </Field>
                </div>

                <div className="md:col-span-4">
                    <Field label="Thực hiện">
                        <SelectInput
                            value={value.execution ?? "INHOUSE"}
                            onChange={(e) =>
                                onChange({
                                    execution: e.target.value as ExecutionType,
                                    vendorId: e.target.value === "VENDOR" ? value.vendorId : undefined,
                                })
                            }
                            disabled={disabled}
                        >
                            <option value="INHOUSE">Nội bộ</option>
                            <option value="VENDOR">Vendor</option>
                        </SelectInput>
                    </Field>
                </div>

                <div className="md:col-span-3">
                    <Field label="Chi phí dự kiến">
                        <TextInput
                            inputMode="numeric"
                            placeholder="0"
                            value={value.cost ?? ""}
                            onChange={(e) => onChange({ cost: e.target.value })}
                            disabled={disabled}
                        />
                    </Field>
                </div>
            </div>

            {isVendor ? (
                <div className="mt-4">
                    <Field label="Vendor">
                        <SelectInput
                            value={value.vendorId ?? ""}
                            onChange={(e) => onChange({ vendorId: e.target.value })}
                            disabled={disabled}
                        >
                            <option value="">Chọn vendor</option>
                            {vendors.map((vendor: any) => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </SelectInput>
                    </Field>
                </div>
            ) : null}
        </div>
    );
}

export default function TechnicalAssessmentInlinePanelContainer({
    serviceRequestId,
    panel,
    onSaved,
    readOnly = false,
}: TechnicalAssessmentPanelProps) {
    const notify = useNotify();
    const router = useRouter();

    const sr = panel?.serviceRequest ?? {};
    const catalogs = panel?.catalogs ?? {};
    const assessment = panel?.technicalAssessment ?? panel?.assessment ?? null;
    const technicalIssues = panel?.technicalIssues ?? [];
    const movementLabel = sr?.movement ?? null;
    const isCompleted = String(sr?.status || "").toUpperCase() === "COMPLETED";
    const isLocked = readOnly || isCompleted;

    const inheritedMachineType = React.useMemo(
        () => mapMovementSpecLabelToMachineType(movementLabel),
        [movementLabel]
    );

    const [form, setForm] = React.useState<FormState>(createInitialFormState(inheritedMachineType));
    const [saving, setSaving] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const vendors = catalogs?.vendors ?? [];
    const parts = catalogs?.mechanicalPartCatalogs ?? catalogs?.parts ?? [];
    const caseDefs = (catalogs?.appearanceIssues?.CASE ?? []).map((x: any) => ({
        code: x.code,
        label: x.label,
        deduction: Number(x.deductionScore ?? 0),
    }));
    const crystalDefs = (catalogs?.appearanceIssues?.CRYSTAL ?? []).map((x: any) => ({
        code: x.code,
        label: x.label,
        deduction: Number(x.deductionScore ?? 0),
    }));
    const dialDefs = (catalogs?.appearanceIssues?.DIAL ?? []).map((x: any) => ({
        code: x.code,
        label: x.label,
        deduction: Number(x.deductionScore ?? 0),
    }));

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
            next.movementCalibre = panel?.serviceRequest?.movementCalibre ?? "";
        }

        const movementIssues = technicalIssues.filter(
            (x: any) => String(x.area || "").toUpperCase() === "MOVEMENT"
        );

        if (movementIssues.length > 0) {
            next.movementStatus = "ISSUE";
            next.movementLines = movementIssues.map((issue: any) => ({
                id: crypto.randomUUID?.() || String(Math.random()),
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
                vendorName: issue.vendorNameSnap ?? issue.Vendor?.name ?? "",
                isFromBoard: true,
            }));
        }

        const mapQuickIssue = (area: string) =>
            technicalIssues.find((x: any) => String(x.area || "").toUpperCase() === area);

        const caseIssue = mapQuickIssue("CASE");
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
                vendorName: caseIssue.vendorNameSnap ?? caseIssue.Vendor?.name ?? "",
                isFromBoard: true,
            };
        }

        const crystalIssue = mapQuickIssue("CRYSTAL");
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
                vendorName: crystalIssue.vendorNameSnap ?? crystalIssue.Vendor?.name ?? "",
                isFromBoard: true,
            };
        }

        const dialIssue = mapQuickIssue("DIAL");
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
                vendorName: dialIssue.vendorNameSnap ?? dialIssue.Vendor?.name ?? "",
                isFromBoard: true,
            };
        }

        const crownIssue = mapQuickIssue("CROWN");
        if (crownIssue) {
            next.crownIssue = {
                enabled: true,
                status: "ISSUE",
                execution:
                    String(crownIssue.actionMode || "").toUpperCase() === "VENDOR"
                        ? "VENDOR"
                        : "INHOUSE",
                vendorId: crownIssue.vendorId ?? "",
                cost: crownIssue.estimatedCost != null ? String(crownIssue.estimatedCost) : "",
                sourceIssueId: crownIssue.id,
                summary: crownIssue.summary ?? crownIssue.note ?? "",
                boardStatus: crownIssue.executionStatus ?? "",
                vendorName: crownIssue.vendorNameSnap ?? crownIssue.Vendor?.name ?? "",
                isFromBoard: true,
            };
        }

        setForm(next);
    }, [assessment, inheritedMachineType, panel?.serviceRequest?.movementCalibre, technicalIssues]);

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

    const caseScore = calculateAppearanceScore(form.appearance.case, caseDefs);
    const crystalScore = calculateAppearanceScore(form.appearance.crystal, crystalDefs);
    const dialScore = calculateAppearanceScore(form.appearance.dial, dialDefs);
    const appearanceScore = Math.round(caseScore * 0.4 + crystalScore * 0.2 + dialScore * 0.4);

    const movementCost = form.movementLines.reduce((sum, line) => sum + parseMoney(line.cost), 0);
    const issueProposalCost =
        parseMoney(form.caseIssue.enabled ? form.caseIssue.estimatedCost : "") +
        parseMoney(form.crystalIssue.enabled ? form.crystalIssue.estimatedCost : "") +
        parseMoney(form.dialIssue.enabled ? form.dialIssue.estimatedCost : "") +
        parseMoney(form.crownIssue.status === "ISSUE" ? form.crownIssue.cost : "");
    const totalCost = movementCost + issueProposalCost;

    const openQuickIssueCount = [
        form.caseIssue.enabled,
        form.crystalIssue.enabled,
        form.dialIssue.enabled,
        form.crownIssue.status === "ISSUE",
    ].filter(Boolean).length;

    const quickIssueSummary = {
        caseIssue: form.caseIssue.enabled
            ? form.caseIssue.summary || "Đang chuẩn bị ghi nhận issue."
            : "Không phát sinh issue ở hạng mục này.",
        crystalIssue: form.crystalIssue.enabled
            ? form.crystalIssue.summary || "Đang chuẩn bị ghi nhận issue."
            : "Không phát sinh issue ở hạng mục này.",
        dialIssue: form.dialIssue.enabled
            ? form.dialIssue.summary || "Đang chuẩn bị ghi nhận issue."
            : "Không phát sinh issue ở hạng mục này.",
        crownIssue: form.crownIssue.status === "ISSUE"
            ? form.crownIssue.summary || "Đang chuẩn bị ghi nhận issue."
            : "Không phát sinh issue ở hạng mục này.",
    };

    function addMovementLine() {
        if (isLocked) return;
        setForm((prev) => ({
            ...prev,
            movementLines: [
                ...prev.movementLines,
                {
                    id: crypto.randomUUID?.() || String(Math.random()),
                    execution: "INHOUSE",
                    cost: "",
                    isFromBoard: false,
                },
            ],
        }));
    }

    function removeMovementLine(id: string) {
        if (isLocked) return;
        setForm((prev) => ({
            ...prev,
            movementLines: prev.movementLines.filter((line) => line.id !== id),
        }));
    }

    function updateMovementLine(id: string, patch: any) {
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
            { key: "Núm", data: { ...form.crownIssue, enabled: form.crownIssue.status === "ISSUE" } },
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
                    calibre: form.movementCalibre || undefined,
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
                        action: form.crownIssue.action,
                        execution: form.crownIssue.execution,
                        vendorId: form.crownIssue.vendorId || undefined,
                        partId: form.crownIssue.partId || undefined,
                        cost: parseMoney(form.crownIssue.cost),
                    },
                },
                financialSummary: {
                    movementCost,
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
                    <div className="text-sm font-medium">
                        {form.movementStatus === "GOOD" ? (
                            <span className="text-emerald-700">Máy đang ổn định</span>
                        ) : (
                            <span className="text-amber-700">Máy cần xử lý kỹ thuật</span>
                        )}
                    </div>
                }
            >
                <div className="grid gap-3 xl:grid-cols-[220px_240px_220px]">
                    <Field label="Loại máy">
                        <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
                            {form.machineType === "MECHANICAL" ? "Máy cơ" : "Máy pin"}
                            <span className="ml-2 text-xs font-normal text-slate-500">
                                (từ spec)
                            </span>
                        </div>
                    </Field>

                    <Field label="Movement calibre">
                        <TextInput
                            value={form.movementCalibre}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    movementCalibre: e.target.value,
                                }))
                            }
                            disabled={isLocked}
                            placeholder="565, 7009A..."
                        />
                    </Field>

                    <Field label="Tình trạng máy">
                        <div className="flex h-11 items-center">
                            <StatusToggle
                                value={form.movementStatus}
                                onChange={(value) =>
                                    setForm((prev) => ({ ...prev, movementStatus: value }))
                                }
                                goodText="Chạy tốt"
                                issueText="Cần xử lý"
                                disabled={isLocked}
                            />
                        </div>
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
                                        Ghi nhận nhanh các hạng mục xử lý, Issue Board sẽ điều phối tiếp sau khi lưu phiếu.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 shadow-inner">
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

                            <div className="space-y-4">
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

            <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
                <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                                <ScanSearch className="h-5 w-5 text-slate-600" />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-slate-900">Ghi nhận issue nhanh</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Mở nhanh từng hạng mục, phần cấu hình chi tiết nằm riêng ở phía dưới.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`${QUICK_PANEL_HEIGHT} overflow-y-auto px-5 py-4`}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Danh sách issue nhanh</div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Chỉ giữ launcher gọn ở đây để thao tác nhanh.
                                </div>
                            </div>

                            <div className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                                {openQuickIssueCount} issue mở
                            </div>
                        </div>

                        <div className="space-y-3">
                            <QuickIssueCard
                                title="Vỏ"
                                description={quickIssueSummary.caseIssue}
                                isOpen={Boolean(form.caseIssue.enabled)}
                                disabled={isLocked}
                                onToggle={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        caseIssue: prev.caseIssue.enabled
                                            ? emptyQuickIssue()
                                            : { ...emptyQuickIssue(), enabled: true, execution: prev.caseIssue.execution || "INHOUSE" },
                                    }))
                                }
                            />

                            <QuickIssueCard
                                title="Kính"
                                description={quickIssueSummary.crystalIssue}
                                isOpen={Boolean(form.crystalIssue.enabled)}
                                disabled={isLocked}
                                onToggle={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        crystalIssue: prev.crystalIssue.enabled
                                            ? emptyQuickIssue()
                                            : { ...emptyQuickIssue(), enabled: true, execution: prev.crystalIssue.execution || "INHOUSE" },
                                    }))
                                }
                            />

                            <QuickIssueCard
                                title="Mặt số"
                                description={quickIssueSummary.dialIssue}
                                isOpen={Boolean(form.dialIssue.enabled)}
                                disabled={isLocked}
                                onToggle={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        dialIssue: prev.dialIssue.enabled
                                            ? emptyQuickIssue()
                                            : { ...emptyQuickIssue(), enabled: true, execution: prev.dialIssue.execution || "INHOUSE" },
                                    }))
                                }
                            />

                            <QuickIssueCard
                                title="Núm"
                                description={quickIssueSummary.crownIssue}
                                isOpen={Boolean(form.crownIssue.status === "ISSUE")}
                                disabled={isLocked}
                                onToggle={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        crownIssue: prev.crownIssue.status === "ISSUE"
                                            ? {
                                                ...prev.crownIssue,
                                                enabled: false,
                                                status: "GOOD",
                                                action: undefined,
                                                vendorId: undefined,
                                                cost: "",
                                                execution: "INHOUSE",
                                                isFromBoard: false,
                                                sourceIssueId: undefined,
                                                summary: "",
                                                boardStatus: "",
                                                vendorName: undefined,
                                            }
                                            : {
                                                ...prev.crownIssue,
                                                enabled: true,
                                                status: "ISSUE",
                                                execution: prev.crownIssue.execution || "INHOUSE",
                                            },
                                    }))
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                                <ImagePlus className="h-5 w-5 text-slate-600" />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-slate-900">Ảnh máy đo thực tế</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Block này luôn cố định ở đây để kỹ thuật đối chiếu nhanh.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`${QUICK_PANEL_HEIGHT} px-5 py-4`}>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <TechnicalImagePicker
                                value={form.technicalImageFileKey || null}
                                onChange={(fileKey) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        technicalImageFileKey: fileKey || "",
                                    }))
                                }
                                disabled={isLocked}
                                compact={false}
                            />
                        </div>

                        <div className="mt-3 flex items-center gap-2">
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
                    </div>
                </section>
            </div>

            {openQuickIssueCount > 0 ? (
                <SectionCard
                    title="Các dòng issue nhanh"
                    subtitle="Các hạng mục mở nhanh được cấu hình chi tiết tại đây, tách riêng khỏi launcher phía trên."
                    icon={<Wrench className="h-5 w-5" />}
                    badge={
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                            {openQuickIssueCount} issue mở
                        </span>
                    }
                >
                    <div className="space-y-4">
                        {form.caseIssue.enabled ? (
                            <QuickIssueRowCard
                                title="Issue vỏ"
                                subtitle={form.caseIssue.isFromBoard ? "Đã ghi nhận từ Issue Board" : "Đang soạn"}
                                executionLabel={form.caseIssue.execution === "VENDOR" ? "Vendor" : "Nội bộ"}
                                costText={formatCurrency(parseMoney(form.caseIssue.estimatedCost))}
                            >
                                <QuickIssueDraftEditor
                                    title="Vỏ"
                                    value={form.caseIssue}
                                    vendors={vendors}
                                    disabled={isLocked}
                                    actionOptions={[
                                        { value: "SPA_CASE", label: "Spa vỏ" },
                                        { value: "POLISH_CASE", label: "Đánh bóng vỏ" },
                                        { value: "REPLATE_CASE", label: "Mạ lại vỏ" },
                                        { value: "KEEP_ORIGINAL", label: "Giữ nguyên" },
                                    ]}
                                    onChange={(patch) =>
                                        setForm((prev) => ({ ...prev, caseIssue: { ...prev.caseIssue, ...patch } }))
                                    }
                                    onGoBoard={() => router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)}
                                />
                            </QuickIssueRowCard>
                        ) : null}

                        {form.crystalIssue.enabled ? (
                            <QuickIssueRowCard
                                title="Issue kính"
                                subtitle={form.crystalIssue.isFromBoard ? "Đã ghi nhận từ Issue Board" : "Đang soạn"}
                                executionLabel={form.crystalIssue.execution === "VENDOR" ? "Vendor" : "Nội bộ"}
                                costText={formatCurrency(parseMoney(form.crystalIssue.estimatedCost))}
                            >
                                <QuickIssueDraftEditor
                                    title="Kính"
                                    value={form.crystalIssue}
                                    vendors={vendors}
                                    disabled={isLocked}
                                    actionOptions={[
                                        { value: "POLISH_GLASS", label: "Đánh bóng kính" },
                                        { value: "REPLACE_GLASS", label: "Thay kính" },
                                        { value: "KEEP_ORIGINAL", label: "Giữ nguyên" },
                                    ]}
                                    onChange={(patch) =>
                                        setForm((prev) => ({ ...prev, crystalIssue: { ...prev.crystalIssue, ...patch } }))
                                    }
                                    onGoBoard={() => router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)}
                                />
                            </QuickIssueRowCard>
                        ) : null}

                        {form.dialIssue.enabled ? (
                            <QuickIssueRowCard
                                title="Issue mặt số"
                                subtitle={form.dialIssue.isFromBoard ? "Đã ghi nhận từ Issue Board" : "Đang soạn"}
                                executionLabel={form.dialIssue.execution === "VENDOR" ? "Vendor" : "Nội bộ"}
                                costText={formatCurrency(parseMoney(form.dialIssue.estimatedCost))}
                            >
                                <QuickIssueDraftEditor
                                    title="Mặt số"
                                    value={form.dialIssue}
                                    vendors={vendors}
                                    disabled={isLocked}
                                    actionOptions={[
                                        { value: "CLEAN_DIAL", label: "Vệ sinh mặt số" },
                                        { value: "REPLACE_DIAL", label: "Thay mặt số" },
                                        { value: "KEEP_ORIGINAL", label: "Giữ nguyên" },
                                    ]}
                                    onChange={(patch) =>
                                        setForm((prev) => ({ ...prev, dialIssue: { ...prev.dialIssue, ...patch } }))
                                    }
                                    onGoBoard={() => router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)}
                                />
                            </QuickIssueRowCard>
                        ) : null}

                        {form.crownIssue.status === "ISSUE" ? (
                            <QuickIssueRowCard
                                title="Issue núm"
                                subtitle={form.crownIssue.isFromBoard ? "Đã ghi nhận từ Issue Board" : "Đang soạn"}
                                executionLabel={form.crownIssue.execution === "VENDOR" ? "Vendor" : "Nội bộ"}
                                costText={formatCurrency(parseMoney(form.crownIssue.cost))}
                            >
                                <CrownIssueDraftEditor
                                    value={form.crownIssue}
                                    vendors={vendors}
                                    disabled={isLocked}
                                    onChange={(patch) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            crownIssue: { ...prev.crownIssue, ...patch, status: "ISSUE", enabled: true },
                                        }))
                                    }
                                    onGoBoard={() => router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)}
                                />
                            </QuickIssueRowCard>
                        ) : null}
                    </div>
                </SectionCard>
            ) : null}

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
                    <CollapsibleDefects title="Vỏ" score={caseScore} defects={caseDefectLabels} />
                    <CollapsibleDefects title="Kính" score={crystalScore} defects={crystalDefectLabels} />
                    <CollapsibleDefects title="Mặt số" score={dialScore} defects={dialDefectLabels} />

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
                                            technicalImageFileKey: fileKey || "",
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