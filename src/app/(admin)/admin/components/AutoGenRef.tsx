// helpers/genRefNo.ts

type RefNoOptions = {
    model: any;            // Prisma model (tx.acquisition, tx.invoice, ...)
    prefix: string;        // PN, INV, PO, ...
    field?: string;        // mặc định "refNo"
    padding?: number;      // mặc định 6 → 000001
};

export async function genRefNo(
    tx: any,
    { model, prefix, field = "refNo", padding = 6 }: RefNoOptions
) {
    const year = new Date().getFullYear();

    // Ví dụ: "PN-2025-%"
    const startsWith = `${prefix}-${year}-`;

    // Tìm refNo lớn nhất hiện có trong năm
    const last = await model.findFirst({
        where: { [field]: { startsWith } },
        orderBy: { [field]: "desc" },
        select: { [field]: true },
    });

    let nextNum = 1;

    if (last?.[field]) {
        // Bắt số cuối: PN-2025-000123 → 123
        const match = last[field].match(/-(\d+)$/);
        if (match) nextNum = parseInt(match[1]) + 1;
    }

    const padded = String(nextNum).padStart(padding, "0");
    return `${prefix}-${year}-${padded}`;
}
