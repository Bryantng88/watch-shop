"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "./acquisition.dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
//mport { CreateAcqWithItemInput } from "./acquisition.dto";
import { AcquisitionType } from "@prisma/client";
import * as repoProd from "../../products/_server/product.repo";
import { convertOffsetToTimes } from "framer-motion";
import { Prisma } from "@prisma/client";

// List cho admin table
export async function getAdminAcquisitionList(raw: unknown) {
    const f = dto.acqFiltersSchema.parse(raw);
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.max(1, Math.min(200, f.pageSize ?? DEFAULT_PAGE_SIZE));

    const { rows, total } = await repoAcq.acqList(
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
        itemCount: a._count.acquisitionItem,
        hasInvoice: a._count.invoice > 0,
        acquiredAt: a.acquiredAt,
        cost: a.cost,
        currency: a.currency ?? "VND",
    }));

    return { items, total, page, pageSize };
}

// Chi tiết
export async function getAcquisitionDetail(id: string) {

    const acq = await repoAcq.acqGetById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    return acq;
}

// Tạo mới (Draft)


// Tạo phiếu nhập mới (DRAFT) và thêm item đầu tiên
export async function createAcquisitionWithItem(input: dto.CreateAcquisitionInput) {

    return await prisma.$transaction(async (tx) => {
        let vendorId = input.vendorId;
        if (!vendorId && input.quickVendorName) {
            const newVendor = await tx.vendor.create({
                data: { name: input.quickVendorName }
            });
            vendorId = newVendor.id;
        }

        const acq = await repoAcq.createDraft(tx, {
            vendorId,
            currency: input.currency,
            type: input.type,
            acquiredAt: input.acquiredAt ? new Date(input.acquiredAt) : undefined,
            notes: input.notes,
        })
        let total = 0;
        //
        for (const it of input.items) {
            if (it.productType === "WATCH" && it.quantity > 1) {
                for (let i = 0; i < it.quantity; ++i) {

                    const prod = await repoProd.createProductDraft(tx, it.title, vendorId);
                    await repoAcq.addAcqItem(tx, acq.id, prod.id, it.unitCost)
                }
            } else {
                const prod = await repoProd.createProductDraft(tx, it.title, vendorId);
                await repoAcq.addAcqItem(tx, acq.id, prod.id, it.unitCost)
            }
            //const prod = await repoProd.createProductDraft(tx, it.title, vendorId);


            //await repoAcq.addAcqItem(tx, acq.id, prod.id, it.quantity, it.unitCost)
            total += (it.quantity ?? 1) * (it.unitCost ?? 0);


        }
        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        return { id: acq.id }
    });
}

// Chuyển phiếu sang POSTED
export async function postAcquisition(acqId: string) {
    return prisma.$transaction(async (tx) => {
        return repoAcq.changeDraftToPost(tx, acqId);
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


export async function updateAcquisitionWithItems(acqId: string, input: any) {
    return prisma.$transaction(async tx => {
        const vendorId = input.vendorId;
        // 1. Update acquisition
        await repoAcq.updateAcquisition(acqId, tx, {
            vendorId,
            acquiredAt: input.acquiredAt ? new Date(input.acquiredAt) : undefined,
            notes: input.notes,
            currency: input.currency,
            type: input.type,
        });
        // 2. Xoá item đã remove
        if (input.removedIds?.length) {
            await repoAcq.deleteAcquisitionItems(tx, input.removedIds);
        }
        // 3. Xử lý từng item
        for (const item of input.items) {
            if (item.id) {
                await repoAcq.updateAcqItem(tx, item.id, {
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                });
                continue; // QUAN TRỌNG: bỏ qua không tạo product mới
            }
            if (item.productType === "WATCH" && item.quantity > 1) {

                for (let i = 0; i < item.quantity; i++) {
                    const prod = await repoProd.createProductDraft(
                        tx,
                        item.title,
                        vendorId,
                    );
                    await repoAcq.addAcqItem(tx, acqId, prod.id, item.unitCost);
                }
            } else {
                // Các loại khác hoặc WATCH quantity = 1
                const prod = await repoProd.createProductDraft(
                    tx,
                    item.title,
                    vendorId,
                );
                await repoAcq.addAcqItem(tx, acqId, prod.id, item.unitCost);
            }
        }
        return { ok: true };
    });
}
