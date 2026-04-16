// helpers/genRefNo.ts

type RefNoOptions = {
    model: any;          // Prisma model (tx.order, tx.shipment, tx.acquisition...)
    prefix: string;      // OD | PN | SH ...
    field?: string;      // default "refNo"
    padding?: number;    // default 6 => 000001
    date?: Date;         // optional: inject date for testing
};

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function ddmmyy(d: Date) {
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}${mm}${yy}`;
}

export async function genRefNo(
    tx: any,
    { model, prefix, field = "refNo", padding = 6, date }: RefNoOptions
) {
    const now = date ?? new Date();
    const codeDate = ddmmyy(now);

    // VD: "OD-200126-"
    const startsWith = `${prefix}-${codeDate}-`;

    // Tìm refNo lớn nhất trong ngày (theo prefix + ddmmyy)
    const last = await model.findFirst({
        where: { [field]: { startsWith } },
        orderBy: { [field]: "desc" },
        select: { [field]: true },
    });

    let nextNum = 1;

    if (last?.[field]) {
        // Bắt số cuối: OD-200126-000123 -> 123
        const m = String(last[field]).match(/-(\d+)$/);
        if (m?.[1]) nextNum = parseInt(m[1], 10) + 1;
    }

    const padded = String(nextNum).padStart(padding, "0");
    return `${prefix}-${codeDate}-${padded}`;
}
