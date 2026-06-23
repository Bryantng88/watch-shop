import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

export function targetLabel(type: string) {
    if (type === "SERVICE_REQUEST") return "Service Request";
    if (type === "TECHNICAL_ISSUE") return "Technical Issue";
    if (type === "ORDER") return "Order";
    if (type === "SHIPMENT") return "Shipment";
    if (type === "PAYMENT") return "Payment";
    if (type === "WATCH") return "Watch";
    if (type === "WORK_CASE") return "Phiếu xử lý";
    if (type === "ACQUISITION") return "Acquisition";
    return type || "Nghiệp vụ";
}

export function targetHref(type: string, id: string) {
    if (type === "SERVICE_REQUEST") return `/admin/service/${id}`;
    if (type === "TECHNICAL_ISSUE") return `/admin/service/issues?issueId=${id}`;
    if (type === "ORDER") return `/admin/orders/${id}`;
    if (type === "SHIPMENT") return `/admin/shipments/${id}`;
    if (type === "PAYMENT") return `/admin/payments`;
    if (type === "WATCH") return `/admin/watches/${id}`;
    if (type === "WORK_CASE") return `/admin/work-cases/${id}`;
    if (type === "ACQUISITION") return `/admin/acquisitions/${id}`;
    return null;
}

export function getExecutionTitle(item: any) {
    if (item.targetType === "TECHNICAL_ISSUE") {
        return (
            item.technicalIssue?.summary ||
            item.targetTitle ||
            item.targetRefNo ||
            item.targetCode ||
            item.targetId
        );
    }

    if (item.targetType === "SERVICE_REQUEST") {
        return (
            item.serviceRequest?.refNo ||
            item.targetRefNo ||
            item.targetCode ||
            item.targetTitle ||
            item.targetId
        );
    }

    return (
        item.targetRefNo ||
        item.targetCode ||
        item.targetTitle ||
        item.refNo ||
        item.targetId
    );
}

export function getBusinessStatus(item: any) {
    return (
        item.businessStageLabel ||
        item.targetStatus ||
        item.status ||
        item.actionType ||
        "-"
    );
}

export function cleanBusinessStatusLabel(status: string, targetType?: string) {
    const raw = String(status || "").trim();
    const type = targetLabel(String(targetType || ""));

    const prefix = `${type} · `;
    if (raw.startsWith(prefix)) return raw.slice(prefix.length);

    return raw;
}

export function businessStageTone(tone?: string | null) {
    if (tone === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (tone === "progress") return "bg-blue-50 text-blue-700 ring-blue-100";
    if (tone === "cancelled") return "bg-slate-100 text-slate-500 ring-slate-200";
    return "bg-amber-50 text-amber-700 ring-amber-100";
}

export function statusTone(status: string) {
    const value = String(status || "").toUpperCase();

    if (["DONE", "COMPLETED", "DELIVERED", "PAID", "CREATED"].includes(value)) {
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    }

    if (["IN_PROGRESS", "PROCESSING", "LINKED", "UPDATED"].includes(value)) {
        return "bg-blue-50 text-blue-700 ring-blue-100";
    }

    if (["CONFIRMED", "READY", "OPEN"].includes(value)) {
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }

    if (["CANCELLED", "CANCELED"].includes(value)) {
        return "bg-slate-100 text-slate-500 ring-slate-200";
    }

    return "bg-slate-50 text-slate-600 ring-slate-200";
}

export function statusTextTone(status: string, tone?: string | null) {
    if (tone === "done") return "text-emerald-600";
    if (tone === "progress") return "text-blue-600";
    if (tone === "cancelled") return "text-slate-500";

    const value = String(status || "").toUpperCase();

    if (["DONE", "COMPLETED", "DELIVERED", "PAID", "CREATED"].includes(value)) {
        return "text-emerald-600";
    }

    if (["IN_PROGRESS", "PROCESSING", "LINKED", "UPDATED"].includes(value)) {
        return "text-blue-600";
    }

    if (["CONFIRMED", "READY", "OPEN", "HOLD"].includes(value)) {
        return "text-amber-600";
    }

    if (["CANCELLED", "CANCELED"].includes(value)) {
        return "text-slate-500";
    }

    return "text-slate-500";
}

export function isTrackingExecution(execution: any) {
    return execution?.metadataJson?.linkMode === "TRACKING";
}

export function executionModeLabel(execution: any) {
    return isTrackingExecution(execution) ? "Theo dõi" : "Thông tin";
}

export function executionPreviewType(targetType: string): BusinessEntityPreview["type"] {
    if (targetType === "SERVICE_REQUEST") return "SERVICE";
    return targetType as BusinessEntityPreview["type"];
}

export function executionToPreview(item: any): BusinessEntityPreview {
    return {
        type: executionPreviewType(item.targetType),
        id: item.targetId,
        refNo: item.targetRefNo || null,
        title: getExecutionTitle(item),
        subtitle: `${executionModeLabel(item)} · ${targetLabel(item.targetType)}`,
        status: item.targetStatus || item.businessStage || null,
        href: targetHref(item.targetType, item.targetId),
    } as BusinessEntityPreview;
}