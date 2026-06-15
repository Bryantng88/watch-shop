import { TaskExecutionTargetType } from "@prisma/client";

export type TaskActionKey =
    | "ORDER_CREATE"
    | "PAYMENT_LINK"
    | "SHIPMENT_LINK"
    | "SERVICE_CREATE"
    | "TECHNICAL_ISSUE_CREATE"
    | "WATCH_PRICE_UPDATE"
    | "WATCH_CONTENT_EDIT"
    | "WATCH_IMAGE_EDIT";

function s(value: unknown) {
    return String(value ?? "").trim().toUpperCase();
}

function isTechnicalIssueTask(task: any) {
    const domain = s(task?.domain);
    const typeCode = s(task?.taskType?.code);
    const typeName = s(task?.taskType?.name);
    const actionCode = s(task?.taskAction?.code);
    const actionName = s(task?.taskAction?.name);
    const targetType = s(task?.taskAction?.targetType);
    const completionRuleKey = s(task?.taskAction?.completionRuleKey);

    const text = `${domain} ${typeCode} ${typeName} ${actionCode} ${actionName} ${completionRuleKey}`;

    return (
        targetType === TaskExecutionTargetType.TECHNICAL_ISSUE ||
        Boolean(task?.taskAction?.technicalDetailCatalogId) ||
        Boolean(task?.taskAction?.serviceCatalogId) ||
        Boolean(task?.taskAction?.supplyCatalogId) ||
        Boolean(task?.taskAction?.mechanicalPartCatalogId) ||
        completionRuleKey.includes("TECHNICAL_ISSUE") ||
        completionRuleKey.includes("ISSUE_DONE") ||
        text.includes("WATCH_SERVICE") ||
        text.includes("TECHNICAL") ||
        text.includes("ISSUE") ||
        text.includes("KIỂM TRA") ||
        text.includes("KIEM TRA") ||
        text.includes("SERVICE")
    );
}

export function resolveTaskActions(task: any): TaskActionKey[] {
    const domain = s(task?.domain);
    const typeCode = s(task?.taskType?.code);
    const typeName = s(task?.taskType?.name);
    const actionCode = s(task?.taskAction?.code);
    const actionName = s(task?.taskAction?.name);
    const targetType = s(task?.taskAction?.targetType);
    const text = `${domain} ${typeCode} ${typeName} ${actionCode} ${actionName}`;

    if (isTechnicalIssueTask(task)) return ["TECHNICAL_ISSUE_CREATE"];

    if (targetType === TaskExecutionTargetType.SERVICE_REQUEST) return ["SERVICE_CREATE"];
    if (targetType === TaskExecutionTargetType.PAYMENT) return ["PAYMENT_LINK"];
    if (targetType === TaskExecutionTargetType.SHIPMENT) return ["SHIPMENT_LINK"];
    if (targetType === TaskExecutionTargetType.ORDER) return ["ORDER_CREATE"];

    if (domain === "ORDER" || text.includes("ORDER") || text.includes("SALE")) return ["ORDER_CREATE"];
    if (domain === "PAYMENT" || text.includes("PAYMENT")) return ["PAYMENT_LINK"];
    if (domain === "SHIPMENT" || text.includes("SHIPMENT") || text.includes("DELIVERY")) return ["SHIPMENT_LINK"];
    if (domain === "SERVICE") return ["TECHNICAL_ISSUE_CREATE"];

    if (domain === "WATCH" && text.includes("PRICE")) return ["WATCH_PRICE_UPDATE"];
    if (domain === "WATCH" && text.includes("CONTENT")) return ["WATCH_CONTENT_EDIT"];
    if (domain === "WATCH" && (text.includes("IMAGE") || text.includes("PHOTO") || text.includes("HÌNH"))) return ["WATCH_IMAGE_EDIT"];

    return [];
}