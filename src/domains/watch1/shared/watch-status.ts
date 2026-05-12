export const WATCH_LIST_VIEWS = [
    "draft",
    "processing",
    "ready",
    "hold",
    "sold",
    "all",
] as const;

export type WatchListView = (typeof WATCH_LIST_VIEWS)[number];

export const WATCH_SALE_STATE = {
    DRAFT: "DRAFT",
    READY: "READY",
    HOLD: "HOLD",
    SOLD: "SOLD",
    CONSIGNED_TO: "CONSIGNED_TO",
    IN_SERVICE: "IN_SERVICE",
} as const;

export type WatchSaleState =
    (typeof WATCH_SALE_STATE)[keyof typeof WATCH_SALE_STATE];

export const WATCH_SERVICE_STATE = {
    NOT_REQUIRED: "NOT_REQUIRED",
    PENDING: "PENDING",
    IN_SERVICE: "IN_SERVICE",
    DONE: "DONE",
} as const;

export type WatchServiceState =
    (typeof WATCH_SERVICE_STATE)[keyof typeof WATCH_SERVICE_STATE];

export const WATCH_STOCK_STATE = {
    IN_STOCK: "IN_STOCK",
    OUT_OF_STOCK: "OUT_OF_STOCK",
    RESERVED: "RESERVED",
} as const;

export type WatchStockState =
    (typeof WATCH_STOCK_STATE)[keyof typeof WATCH_STOCK_STATE];

export function normalizeWatchListView(value?: string | null): WatchListView {
    const view = String(value ?? "").toLowerCase();
    return WATCH_LIST_VIEWS.includes(view as WatchListView)
        ? (view as WatchListView)
        : "draft";
}

export function normalizeWatchSaleState(value?: string | null): WatchSaleState {
    const state = String(value ?? "").toUpperCase();

    if (state === WATCH_SALE_STATE.READY) return WATCH_SALE_STATE.READY;
    if (state === WATCH_SALE_STATE.HOLD) return WATCH_SALE_STATE.HOLD;
    if (state === WATCH_SALE_STATE.SOLD) return WATCH_SALE_STATE.SOLD;
    if (state === WATCH_SALE_STATE.CONSIGNED_TO) return WATCH_SALE_STATE.CONSIGNED_TO;
    if (state === WATCH_SALE_STATE.IN_SERVICE) return WATCH_SALE_STATE.IN_SERVICE;

    return WATCH_SALE_STATE.DRAFT;
}

export function normalizeWatchServiceState(
    value?: string | null
): WatchServiceState {
    const state = String(value ?? "").toUpperCase();

    if (state === WATCH_SERVICE_STATE.PENDING) return WATCH_SERVICE_STATE.PENDING;
    if (state === WATCH_SERVICE_STATE.IN_SERVICE) return WATCH_SERVICE_STATE.IN_SERVICE;
    if (state === WATCH_SERVICE_STATE.DONE) return WATCH_SERVICE_STATE.DONE;

    return WATCH_SERVICE_STATE.NOT_REQUIRED;
}

export function normalizeWatchStockState(value?: string | null): WatchStockState {
    const state = String(value ?? "").toUpperCase();

    if (state === WATCH_STOCK_STATE.OUT_OF_STOCK) return WATCH_STOCK_STATE.OUT_OF_STOCK;
    if (state === WATCH_STOCK_STATE.RESERVED) return WATCH_STOCK_STATE.RESERVED;

    return WATCH_STOCK_STATE.IN_STOCK;
}

export function isWatchTerminalSaleState(value?: string | null) {
    const state = normalizeWatchSaleState(value);
    return state === WATCH_SALE_STATE.HOLD || state === WATCH_SALE_STATE.SOLD;
}

export function isWatchServiceReady(value?: string | null) {
    const state = String(value ?? "").toUpperCase();

    return (
        !state ||
        state === "NONE" ||
        state === "NO_SERVICE" ||
        state === "NOT_REQUIRED" ||
        state === "COMPLETED" ||
        state === "DONE"
    );
}


export const WATCH_SALE_STATE_OPTIONS = [
    { value: WATCH_SALE_STATE.DRAFT, label: "Draft" },
    { value: WATCH_SALE_STATE.READY, label: "Ready" },
    { value: WATCH_SALE_STATE.HOLD, label: "Hold" },
    { value: WATCH_SALE_STATE.SOLD, label: "Sold" },
    { value: WATCH_SALE_STATE.CONSIGNED_TO, label: "Ký gửi đi" },
    { value: WATCH_SALE_STATE.IN_SERVICE, label: "Đang service" },
] as const;

export const WATCH_SERVICE_STATE_OPTIONS = [
    { value: WATCH_SERVICE_STATE.NOT_REQUIRED, label: "Không cần service" },
    { value: WATCH_SERVICE_STATE.PENDING, label: "Chờ service" },
    { value: WATCH_SERVICE_STATE.IN_SERVICE, label: "Đang service" },
    { value: WATCH_SERVICE_STATE.DONE, label: "Đã xong" },
] as const;

export const WATCH_STOCK_STATE_OPTIONS = [
    { value: WATCH_STOCK_STATE.IN_STOCK, label: "Còn hàng" },
    { value: WATCH_STOCK_STATE.RESERVED, label: "Đang giữ" },
    { value: WATCH_STOCK_STATE.OUT_OF_STOCK, label: "Hết hàng" },
] as const;
