import type { ServiceRequestCounts, ServiceRequestViewKey } from "./types";

export const SERVICE_REQUEST_VIEW_TABS: Array<{ key: ServiceRequestViewKey; label: string }> = [
    { key: "all", label: "Tất cả" },
    { key: "draft", label: "Draft" },
    { key: "in_progress", label: "Đang xử lý" },
    { key: "done", label: "Hoàn tất" },
    { key: "canceled", label: "Đã hủy" },
];

export const SERVICE_REQUEST_SORT_OPTIONS = [
    { value: "updatedDesc", label: "Cập nhật ↓" },
    { value: "updatedAsc", label: "Cập nhật ↑" },
    { value: "createdDesc", label: "Tạo ↓" },
    { value: "createdAsc", label: "Tạo ↑" },
];

export function normalizeServiceRequestView(value?: string | null): ServiceRequestViewKey {
    const view = (value || "all").toLowerCase();
    if (view === "draft" || view === "in_progress" || view === "done" || view === "canceled") return view;
    return "all";
}

export function buildServiceRequestCounts(input: {
    counts?: Partial<ServiceRequestCounts>;
    total: number;
    currentView: ServiceRequestViewKey;
}): ServiceRequestCounts {
    if (input.counts?.all != null) {
        return {
            all: input.counts.all ?? 0,
            draft: input.counts.draft ?? 0,
            in_progress: input.counts.in_progress ?? 0,
            done: input.counts.done ?? 0,
            canceled: input.counts.canceled ?? 0,
        };
    }

    return {
        all: input.currentView === "all" ? input.total : 0,
        draft: input.currentView === "draft" ? input.total : 0,
        in_progress: input.currentView === "in_progress" ? input.total : 0,
        done: input.currentView === "done" ? input.total : 0,
        canceled: input.currentView === "canceled" ? input.total : 0,
    };
}

export function formatServiceDateTime(value?: string | Date | null) {
    if (!value) return "-";
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return "-";

    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function compactDateTime(value?: string | Date | null) {
    if (!value) return "-";
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return "-";

    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
}

export function formatServiceScope(scope?: string | null) {
    const value = String(scope || "-").toUpperCase();
    if (value === "WITH_PURCHASE") return "hàng shop";
    if (value === "CUSTOMER_OWNED") return "hàng khách";
    if (value === "INTERNAL") return "nội bộ";
    return value.replaceAll("_", " ").toLowerCase();
}

export function serviceScopeTone(scope?: string | null): "success" | "warning" | "info" | "muted" {
    const value = String(scope || "").toUpperCase();
    if (value === "WITH_PURCHASE" || value === "INTERNAL") return "info";
    if (value === "CUSTOMER_OWNED") return "warning";
    return "muted";
}

export function serviceStatusTone(status?: string | null): "success" | "warning" | "info" | "muted" {
    const value = String(status || "").toUpperCase();
    if (value === "DONE" || value === "COMPLETED" || value === "DELIVERED") return "success";
    if (value === "CANCELED" || value === "CANCELLED") return "muted";
    if (value === "IN_PROGRESS" || value === "DIAGNOSING" || value === "WAIT_APPROVAL") return "info";
    return "warning";
}

export function isServiceRequestClosable(status?: string | null) {
    const value = String(status || "").toUpperCase();
    return value !== "COMPLETED" && value !== "DONE" && value !== "DELIVERED" && value !== "CANCELED" && value !== "CANCELLED";
}

export function serviceImageItem(fileKeyOrUrl?: string | null) {
    if (!fileKeyOrUrl) return null;

    if (fileKeyOrUrl.startsWith("http://") || fileKeyOrUrl.startsWith("https://") || fileKeyOrUrl.startsWith("/")) {
        return { url: fileKeyOrUrl };
    }

    return { fileKey: fileKeyOrUrl };
}
