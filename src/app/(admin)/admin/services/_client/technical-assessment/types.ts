export type MachineType = "MECHANICAL" | "QUARTZ";
export type HealthStatus = "GOOD" | "ISSUE";
export type ExecutionType = "INHOUSE" | "VENDOR";

export type MovementAction =
    | "SERVICE"
    | "REPLACE_PART"
    | "REGULATE"
    | "WATERPROOF"
    | "REPLACE_MOVEMENT"
    | "BATTERY_CHANGE";

export type CosmeticAction =
    | "SPA_CASE"
    | "POLISH_CASE"
    | "REPLATE_CASE"
    | "POLISH_GLASS"
    | "REPLACE_GLASS"
    | "CLEAN_DIAL"
    | "REPLACE_DIAL"
    | "KEEP_ORIGINAL";

export type CrownAction =
    | "FIX_CROWN"
    | "REPLACE_CROWN"
    | "RETHREAD"
    | "STEM_ADJUST"
    | "WATERPROOF";

export type MovementLine = {
    id: string;
    sourceIssueId?: string;
    action?: MovementAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
    summary?: string;
    boardStatus?: string;
    vendorName?: string;
    isFromBoard?: boolean;
};

export type QuickIssue = {
    enabled: boolean;
    action?: CosmeticAction;
    execution?: ExecutionType;
    vendorId?: string;
    estimatedCost?: string;
    sourceIssueId?: string;
    summary?: string;
    boardStatus?: string;
    vendorName?: string;
    isFromBoard?: boolean;
};

export type CrownIssue = {
    enabled?: boolean;
    status: HealthStatus;
    action?: CrownAction;
    execution?: ExecutionType;
    vendorId?: string;
    partId?: string;
    cost?: string;
    sourceIssueId?: string;
    summary?: string;
    boardStatus?: string;
    vendorName?: string;
    isFromBoard?: boolean;
};

export type ScoreBlock = {
    issues: string[];
    manualDeduction: string;
};

export type FormState = {
    machineType: MachineType;
    movementStatus: HealthStatus;
    movementCalibre: string;
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

export type TechnicalAssessmentPanelProps = {
    serviceRequestId: string;
    panel: any;
    onSaved?: () => void | Promise<void>;
    readOnly?: boolean;
};

