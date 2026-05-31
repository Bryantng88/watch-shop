import {
    FormState,
    MachineType,
    QuickIssue,
    ScoreBlock,
} from "./types";

export function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function parseMoney(value?: string | number) {
    if (value === undefined || value === null || value === "") return 0;
    const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

export function parseNumber(value?: string) {
    if (!value) return 0;
    const numeric = Number(value.toString().replace(/[^\d.-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export function makeId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
}

export function mapMovementSpecLabelToMachineType(
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

export function emptyQuickIssue(): QuickIssue {
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

export function createInitialFormState(machineType: MachineType): FormState {
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
            enabled: false,
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
        movementCalibre: ""
    };
}

export function calculateAppearanceScore(
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

export function buildTechnicalSummaryForSale(params: {
    machineStatus: "GOOD" | "ISSUE";
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