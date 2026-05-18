export const WATCH_LIST_VIEWS = [
    "draft",
    "processing",
    "ready",
    "hold",
    "sold",
    "all",
] as const;

export type WatchListView = (typeof WATCH_LIST_VIEWS)[number];

export const WATCH_SALE_STAGE = {
    DRAFT: "DRAFT",
    PROCESSING: "PROCESSING",
    READY: "READY",
    HOLD: "HOLD",
    SOLD: "SOLD",
    CONSIGNED_TO: "CONSIGNED_TO",
} as const;

export type WatchSaleStage =
    (typeof WATCH_SALE_STAGE)[keyof typeof WATCH_SALE_STAGE];

export const WATCH_SERVICE_STAGE = {
    NOT_REQUIRED: "NOT_REQUIRED",
    PENDING: "PENDING",
    IN_SERVICE: "IN_SERVICE",
    DONE: "DONE",
} as const;

export type WatchServiceStage =
    (typeof WATCH_SERVICE_STAGE)[keyof typeof WATCH_SERVICE_STAGE];

export const WATCH_STOCK_STAGE = {
    IN_STOCK: "IN_STOCK",
    OUT_OF_STOCK: "OUT_OF_STOCK",
    RESERVED: "RESERVED",
} as const;

export type WatchStockStage =
    (typeof WATCH_STOCK_STAGE)[keyof typeof WATCH_STOCK_STAGE];

export function normalizeWatchListView(value?: string | null): WatchListView {
    const view = String(value ?? "").toLowerCase();
    return WATCH_LIST_VIEWS.includes(view as WatchListView)
        ? (view as WatchListView)
        : "draft";
}

export function normalizeWatchSaleStage(value?: string | null): WatchSaleStage {
    const stage = String(value ?? "").toUpperCase();

    if (stage === WATCH_SALE_STAGE.PROCESSING) return WATCH_SALE_STAGE.PROCESSING;
    if (stage === WATCH_SALE_STAGE.READY) return WATCH_SALE_STAGE.READY;
    if (stage === WATCH_SALE_STAGE.HOLD) return WATCH_SALE_STAGE.HOLD;
    if (stage === WATCH_SALE_STAGE.SOLD) return WATCH_SALE_STAGE.SOLD;
    if (stage === WATCH_SALE_STAGE.CONSIGNED_TO) return WATCH_SALE_STAGE.CONSIGNED_TO;

    if (stage === "IN_SERVICE") return WATCH_SALE_STAGE.PROCESSING;

    return WATCH_SALE_STAGE.DRAFT;
}

export function normalizeWatchServiceStage(
    value?: string | null,
): WatchServiceStage {
    const stage = String(value ?? "").toUpperCase();

    if (stage === WATCH_SERVICE_STAGE.PENDING) return WATCH_SERVICE_STAGE.PENDING;
    if (stage === WATCH_SERVICE_STAGE.IN_SERVICE) return WATCH_SERVICE_STAGE.IN_SERVICE;
    if (stage === WATCH_SERVICE_STAGE.DONE) return WATCH_SERVICE_STAGE.DONE;

    return WATCH_SERVICE_STAGE.NOT_REQUIRED;
}

export function normalizeWatchStockStage(value?: string | null): WatchStockStage {
    const stage = String(value ?? "").toUpperCase();

    if (stage === WATCH_STOCK_STAGE.OUT_OF_STOCK) return WATCH_STOCK_STAGE.OUT_OF_STOCK;
    if (stage === WATCH_STOCK_STAGE.RESERVED) return WATCH_STOCK_STAGE.RESERVED;

    return WATCH_STOCK_STAGE.IN_STOCK;
}

export function isWatchTerminalSaleStage(value?: string | null) {
    const stage = normalizeWatchSaleStage(value);
    return stage === WATCH_SALE_STAGE.HOLD || stage === WATCH_SALE_STAGE.SOLD;
}

export function isWatchServiceReady(value?: string | null) {
    const stage = normalizeWatchServiceStage(value);
    return (
        stage === WATCH_SERVICE_STAGE.NOT_REQUIRED ||
        stage === WATCH_SERVICE_STAGE.DONE
    );
}

export const WATCH_SALE_STAGE_OPTIONS = [
    { value: WATCH_SALE_STAGE.DRAFT, label: "Draft" },
    { value: WATCH_SALE_STAGE.PROCESSING, label: "Processing" },
    { value: WATCH_SALE_STAGE.READY, label: "Ready" },
    { value: WATCH_SALE_STAGE.HOLD, label: "Hold" },
    { value: WATCH_SALE_STAGE.SOLD, label: "Sold" },
    { value: WATCH_SALE_STAGE.CONSIGNED_TO, label: "Ký gửi đi" },
] as const;

export const WATCH_SERVICE_STAGE_OPTIONS = [
    { value: WATCH_SERVICE_STAGE.NOT_REQUIRED, label: "Không cần service" },
    { value: WATCH_SERVICE_STAGE.PENDING, label: "Chờ service" },
    { value: WATCH_SERVICE_STAGE.IN_SERVICE, label: "Đang service" },
    { value: WATCH_SERVICE_STAGE.DONE, label: "Đã xong" },
] as const;

export const WATCH_STOCK_STAGE_OPTIONS = [
    { value: WATCH_STOCK_STAGE.IN_STOCK, label: "Còn hàng" },
    { value: WATCH_STOCK_STAGE.RESERVED, label: "Đang giữ" },
    { value: WATCH_STOCK_STAGE.OUT_OF_STOCK, label: "Hết hàng" },
] as const;