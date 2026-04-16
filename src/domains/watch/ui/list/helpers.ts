import type { Counts, ViewKey, WatchRow } from "./types";

export function fmtMoney(value?: number | string | null) {
    if (value == null || value === "") return "-";
    const n = Number(value);
    if (!Number.isFinite(n)) return "-";
    return new Intl.NumberFormat("vi-VN").format(n);
}

export function fmtDT(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

export function hasValidPrice(row: WatchRow) {
    const price = Number(row.minPrice ?? row.salePrice ?? row.listPrice ?? 0);
    return Number.isFinite(price) && price > 0;
}

export function hasValidImage(row: WatchRow) {
    const count = Number(row.imagesCount ?? 0);
    if (Number.isFinite(count) && count > 0) return true;
    return Boolean(row.primaryImageUrl?.trim());
}

export function hasMissingImageReadiness(row: WatchRow) {
    if ((row.publishMissing ?? []).includes("images")) return true;
    return !hasValidImage(row);
}

export function hasMissingCoreReadinessInfo(row: WatchRow) {
    const missing = new Set(row.publishMissing ?? []);
    if (missing.size > 0) {
        for (const key of missing) {
            if (key !== "images") return true;
        }
        return false;
    }
    return !hasValidPrice(row) || !Boolean(row.hasContent ?? row.computed?.hasContent);
}

export function getDetailedPublishMissing(row: WatchRow) {
    const known = new Set(["images", "price", "content"]);
    return (row.publishMissing ?? []).filter((item) => !known.has(item));
}

export function getQuickFixHints(row: WatchRow) {
    const hints: string[] = [];
    const missing = new Set(row.publishMissing ?? []);

    if (missing.has("images") || (!row.publishMissing?.length && !hasValidImage(row))) {
        hints.push("Bổ sung đủ ảnh watch ở media hoặc trang edit.");
    }

    if (missing.has("price") || (!row.publishMissing?.length && !hasValidPrice(row))) {
        hints.push("Cập nhật giá bán / giá chốt tối thiểu để đủ readiness.");
    }

    if (missing.has("content") || (!row.publishMissing?.length && !(row.hasContent ?? row.computed?.hasContent))) {
        hints.push("Bổ sung summary, body hoặc bullet specs cho watch content.");
    }

    if (getDetailedPublishMissing(row).length > 0) {
        hints.push("Rà lại watch spec và metadata còn thiếu trong form chỉnh sửa.");
    }

    return Array.from(new Set(hints));
}

export function getServiceMeta(serviceState?: string | null) {
    switch (String(serviceState || "").toUpperCase()) {
        case "DONE":
            return { label: "Đã sửa xong", tone: "success" as const };
        case "IN_PROGRESS":
            return { label: "Đang service", tone: "warning" as const };
        case "PENDING":
            return { label: "Chờ xử lý", tone: "danger" as const };
        default:
            return { label: "Không cần service", tone: "muted" as const };
    }
}

export function getReadinessLabel(stage?: string | null) {
    switch (String(stage || "").toUpperCase()) {
        case "READY":
            return "Sẵn sàng bán";
        case "PROCESSING":
            return "Đang hoàn thiện";
        case "HOLD":
            return "Đang hold";
        case "SOLD":
            return "Đã bán";
        default:
            return "Chưa bắt đầu";
    }
}

export function getPostReadinessState(row: WatchRow) {
    if (hasMissingCoreReadinessInfo(row)) {
        return { label: "Missing Info", tone: "orange" as const };
    }
    if (hasMissingImageReadiness(row)) {
        return { label: "Missing Image", tone: "orange" as const };
    }
    return { label: "Ready to post", tone: "green" as const };
}

export function toneClass(tone?: "success" | "warning" | "danger" | "muted" | "accent") {
    switch (tone) {
        case "success":
            return "text-emerald-700";
        case "warning":
            return "text-amber-700";
        case "danger":
            return "text-rose-600";
        case "accent":
            return "text-orange-600";
        default:
            return "text-slate-700";
    }
}

export function buildCounts(
    input: Partial<Counts> | undefined,
    total: number,
    currentView: ViewKey,
    rows: WatchRow[]
): Counts {
    if (input && Object.values(input).some((value) => Number(value ?? 0) >= 0)) {
        return {
            draft: Number(input.draft ?? 0),
            processing: Number(input.processing ?? 0),
            ready: Number(input.ready ?? 0),
            hold: Number(input.hold ?? 0),
            sold: Number(input.sold ?? 0),
            all: Number(input.all ?? 0),
            hasContent: Number(input.hasContent ?? 0),
            hasImages: Number(input.hasImages ?? 0),
        };
    }

    return {
        draft: currentView === "draft" ? total : 0,
        processing: currentView === "processing" ? total : 0,
        ready: currentView === "ready" ? total : 0,
        hold: currentView === "hold" ? total : 0,
        sold: currentView === "sold" ? total : 0,
        all: currentView === "all" ? total : 0,
        hasContent: rows.filter((row) => row.hasContent ?? row.computed?.hasContent).length,
        hasImages: rows.filter((row) => row.hasImages ?? row.computed?.hasImages ?? hasValidImage(row)).length,
    };
}
