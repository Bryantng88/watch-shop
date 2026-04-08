"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus, ScanSearch, Wrench } from "lucide-react";
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
    ScorePill,
    SectionCard,
    SelectInput,
    StatusToggle,
    TextInput,
} from "./primitives";
import { MovementIssueRow } from "./issue-rows";
import { MeasurementCompact } from "./measurement-compact";
import { QuickIssueCard } from "./quick-issue-card";
import { CollapsibleDefects, TechnicalFinalSummary } from "./final-summary";

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
    }, [assessment, inheritedMachineType, technicalIssues]);

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

    function addMovementLine() {
        if (isLocked) return;
        setForm((prev) => ({
            ...prev,
            movementLines: [
                ...prev.movementLines,
                { id: crypto.randomUUID?.() || String(Math.random()), execution: "INHOUSE", cost: "", isFromBoard: false },
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
                <div className="grid gap-3 md:grid-cols-[220px_220px_1fr]">
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

                        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 shadow-inner">                            <div className="mb-4 flex items-center justify-between">
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
                    isLocked={isLocked}
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
                                            vendorId:
                                                e.target.value === "VENDOR"
                                                    ? prev.caseIssue.vendorId
                                                    : "",
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
                        {String(form.caseIssue.execution || "").toUpperCase() === "VENDOR" ? (
                            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
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

                                {!isLocked ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/admin/vendors")}
                                    >
                                        + Vendor mới
                                    </Button>
                                ) : null}
                            </div>
                        ) : null}
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
                    isLocked={isLocked}
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
                        {String(form.crystalIssue.execution || "").toUpperCase() === "VENDOR" ? (
                            <div className="md:col-span-3">
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
                            </div>
                        ) : null}
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
                    isLocked={isLocked}
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
                        {String(form.dialIssue.execution || "").toUpperCase() === "VENDOR" ? (
                            <div className="md:col-span-3">
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
                            </div>
                        ) : null}
                    </div>
                </QuickIssueCard>

                <QuickIssueCard
                    title="Núm"
                    open={form.crownIssue.status === "ISSUE"}
                    issueMeta={form.crownIssue}
                    staticView={form.crownIssue.isFromBoard}
                    onOpen={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            crownIssue: { ...prev.crownIssue, enabled: true, status: "ISSUE", isFromBoard: false },
                        }));
                    }}
                    onClose={() => {
                        if (isLocked) return;
                        setForm((prev) => ({
                            ...prev,
                            crownIssue: {
                                ...prev.crownIssue,
                                enabled: false,
                                status: "GOOD",
                                action: undefined,
                                execution: "INHOUSE",
                                vendorId: "",
                                partId: "",
                                cost: "",
                                summary: "",
                                boardStatus: "",
                                isFromBoard: false,
                            },
                        }));
                    }}
                    onGoBoard={() =>
                        router.push(`/admin/services/issues-board?serviceRequestId=${serviceRequestId}`)
                    }
                    isLocked={isLocked}
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Phương án xử lý">
                            <SelectInput
                                value={form.crownIssue.action ?? ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        crownIssue: {
                                            ...prev.crownIssue,
                                            action: e.target.value as any,
                                        },
                                    }))
                                }
                                disabled={isLocked}
                            >
                                <option value="">Chọn phương án</option>
                                <option value="FIX_CROWN">Canh chỉnh / xử lý núm</option>
                                <option value="RETHREAD">Làm ren / phục hồi ren</option>
                                <option value="STEM_ADJUST">Canh chỉnh ty</option>
                                <option value="REPLACE_CROWN">Thay núm mới</option>
                                <option value="WATERPROOF">Xử lý chống nước</option>
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
                                            execution: e.target.value as any,
                                            vendorId: e.target.value === "VENDOR" ? prev.crownIssue.vendorId : "",
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
                                disabled={isLocked}
                            />
                        </Field>
                        {String(form.crownIssue.execution || "").toUpperCase() === "VENDOR" ? (
                            <div className="md:col-span-3">
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
                            </div>
                        ) : null}
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