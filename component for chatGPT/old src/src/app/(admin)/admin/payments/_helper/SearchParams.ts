export type PaymentListSort =
    | "createdDesc"
    | "createdAsc"
    | "paidDesc"
    | "paidAsc"
    | "amountDesc"
    | "amountAsc";

export type PaymentViewKey = "all" | "unpaid" | "paid" | "canceled";

export type PaymentListInput = {
    q?: string;
    purpose?: string;

    /**
     * status là filter thực thi ở server
     * view là filter UI từ tab
     */
    status?: string;
    view?: PaymentViewKey;

    type?: string;
    direction?: string;
    method?: string;

    currency?: string;

    // date filters
    paidFrom?: string; // ISO date or yyyy-mm-dd
    paidTo?: string;
    createdFrom?: string;
    createdTo?: string;

    sort?: PaymentListSort;

    page?: number;
    pageSize?: number;
};

function toStr(v: unknown) {
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s : "";
}

function toInt(v: unknown, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toView(v: unknown): PaymentViewKey | undefined {
    const s = toStr(v).toLowerCase();
    if (s === "all" || s === "unpaid" || s === "paid" || s === "canceled") {
        return s;
    }
    return undefined;
}

export function parsePaymentListSearchParams(sp: URLSearchParams): PaymentListInput {
    const q = toStr(sp.get("q"));
    const purpose = toStr(sp.get("purpose"));
    const status = toStr(sp.get("status"));
    const view = toView(sp.get("view"));

    const type = toStr(sp.get("type"));
    const direction = toStr(sp.get("direction"));
    const method = toStr(sp.get("method"));
    const currency = toStr(sp.get("currency"));

    const paidFrom = toStr(sp.get("paidFrom"));
    const paidTo = toStr(sp.get("paidTo"));
    const createdFrom = toStr(sp.get("createdFrom"));
    const createdTo = toStr(sp.get("createdTo"));

    const sort = (toStr(sp.get("sort")) as PaymentListSort) || "createdDesc";

    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);

    return {
        q: q || undefined,
        purpose: purpose || undefined,
        status: status || undefined,
        view: view || "all",
        type: type || undefined,
        direction: direction || undefined,
        method: method || undefined,
        currency: currency || undefined,

        paidFrom: paidFrom || undefined,
        paidTo: paidTo || undefined,
        createdFrom: createdFrom || undefined,
        createdTo: createdTo || undefined,

        sort,
        page,
        pageSize,
    };
}