
import { prisma, DB, dbOrTx } from "@/server/db/client";

export async function genRefNoIncrement(tx: DB) {
    const db = dbOrTx(tx);
    const year = new Date().getFullYear();
    // Tìm số lớn nhất đã tồn tại trong năm
    const last = await db.acquisition.findFirst({
        where: { refNo: { startsWith: `AC-${year}-` } },
        orderBy: { refNo: "desc" },
        select: { refNo: true }
    });
    let nextNum = 1;
    if (last?.refNo) {
        // Extract số thứ tự cuối cùng
        const match = last.refNo.match(/NK-\d{4}-(\d+)/);
        if (match) nextNum = parseInt(match[1]) + 1;
    }
    const refNo = `AC-${year}-${String(nextNum).padStart(6, "0")}`;
    return refNo;
}
