"use server";

import prisma from "@/server/db/client";

import { acqFiltersSchema } from "./dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repo from "./acquisition.repo";
import { acquisitionRepo } from "./acquisition.repo";
import { CreateAcqWithItemInput } from "./dto";
// List cho admin table
export async function getAdminAcquisitionList(raw: unknown) {
    const f = acqFiltersSchema.parse(raw);
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.max(1, Math.min(200, f.pageSize ?? DEFAULT_PAGE_SIZE));

    const { rows, total } = await repo.acqList(
        buildAcqWhere(f),
        buildAcqOrderBy(f.sort),
        (page - 1) * pageSize,
        pageSize
    );

    const items = rows.map(a => ({
        id: a.id,
        refNo: a.refNo,
        type: a.type,
        status: a.accquisitionStt,
        vendorName: a.vendor?.name ?? null,
        itemCount: a._count.AcquisitionItem,
        hasInvoice: a._count.Invoice > 0,
        acquiredAt: a.acquiredAt,
        cost: a.cost,
        currency: a.currency ?? "VND",
    }));

    return { items, total, page, pageSize };
}

// Chi tiết
export async function getAcquisitionDetail(id: string) {
    const acq = await repo.acqGetById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    return acq;
}

// Tạo mới (Draft)
export async function createAcquisitionWithItem(input: CreateAcqWithItemInput) {
    return prisma.$transaction(async (tx) => {
        const repo = acquisitionRepo(tx);

        // 1) Gọi repo để tạo/tái sử dụng phiếu và thêm dòng
        const acq = await repo.createWithItem(input); // { id }

        // 2) (Khuyến nghị) Recalc tổng tiền từ tất cả item sau khi thêm
        //    để cost luôn khớp khi người dùng thêm nhiều lần trong ngày
        const items = await tx.acquisitionItem.findMany({
            where: { acquisitionId: acq.id },
            select: { quantity: true, unitCost: true },
        });
        const total = items.reduce(
            (s, it) => s + Number(it.quantity) * Number(it.unitCost ?? 0),
            0
        );
        await tx.acquisition.update({
            where: { id: acq.id },
            data: { cost: total },
        });

        // 3) Trả về kết quả gọn cho API/UI
        return { acquisitionId: acq.id, cost: total };
    });
}

// Đăng (POSTED) – ví dụ có transaction
export async function postAcquisition(id: string) {
    return prisma.$transaction(async (tx) => {
        const acq = await repo.acqGetById(id, tx);
        if (!acq) throw new Error("Không tìm thấy phiếu nhập");
        if (acq.acquisitionStt !== "DRAFT") throw new Error("Chỉ đăng phiếu DRAFT");
        if (!acq.AcquisitionItem.length) throw new Error("Phiếu chưa có sản phẩm");

        // (nếu bạn có ghi tồn kho, làm ở đây bằng repo StockIn, tất cả dùng chung tx)
        // await stockRepo.createFromAcquisition(acq, tx);

        return repo.acqUpdate(id, { acquisitionStt: "POSTED" }, tx);
    });
}

// Huỷ
export async function cancelAcquisition(id: string) {
    const acq = await repo.acqGetById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.acquisitionStt === "POSTED") throw new Error("Không thể huỷ phiếu đã đăng");
    return repo.acqUpdate(id, { acquisitionStt: "CANCELED" });
}
