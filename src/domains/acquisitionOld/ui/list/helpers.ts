export function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function fmtMoney(value: number | null) {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(value)) + " VND";
}

export function fmtDate(value: string) {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString("vi-VN");
    } catch {
        return value;
    }
}

export function statusTone(status: string) {
    switch (String(status).toUpperCase()) {
        case "POSTED":
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
        case "DRAFT":
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
        case "RETURNED":
            return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
        case "CANCELLED":
            return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
        default:
            return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
}