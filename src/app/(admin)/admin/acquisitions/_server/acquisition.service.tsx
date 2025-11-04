"use server";

import prisma from "@/server/db/client";

import { acqFiltersSchema } from "./dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
import { CreateAcqWithItemInput } from "./dto";
import { AcquisitionType } from "@prisma/client";
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


// Tạo phiếu nhập mới (DRAFT) và thêm item đầu tiên
export async function createAcquisitionWithItem(input: {
    vendorId: string;
    currency?: string;
    type?: AcquisitionType;
    acquiredAt?: Date;
    notes?: string | null;
    item: { productId: string; variantId?: string | null; quantity?: number; unitCost?: number; };
}) {
    return prisma.$transaction(async (tx) => {
        return repoAcq.upsertDraftAndAddItem(tx, input);
    });
}

// Chuyển phiếu sang POSTED
export async function postAcquisition(acqId: string) {
    return prisma.$transaction(async (tx) => {
        return repoAcq.post(tx, acqId);
    });
}


// Đăng (POSTED) – ví dụ có transaction
//export async function postAcquisition(id: string) {
//return prisma.$transaction(async (tx) => {
//const acq = await repo.acqGetById(id, tx);
//if (!acq) throw new Error("Không tìm thấy phiếu nhập");
//if (acq.acquisitionStt !== "DRAFT") throw new Error("Chỉ đăng phiếu DRAFT");
//if (!acq.AcquisitionItem.length) throw new Error("Phiếu chưa có sản phẩm");

// (nếu bạn có ghi tồn kho, làm ở đây bằng repo StockIn, tất cả dùng chung tx)
// await stockRepo.createFromAcquisition(acq, tx);

//return repo.acqUpdate(id, { acquisitionStt: "POSTED" }, tx);
//});
//}

// Huỷ
export async function cancelAcquisition(id: string) {
    const acq = await repo.acqGetById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.acquisitionStt === "POSTED") throw new Error("Không thể huỷ phiếu đã đăng");
    return repo.acqUpdate(id, { acquisitionStt: "CANCELED" });
}
