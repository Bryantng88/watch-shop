"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "./acquisition.dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
//mport { CreateAcqWithItemInput } from "./acquisition.dto";
import { AcquisitionType, ProductType } from "@prisma/client";
import * as repoProd from "../../products/_server/product.repo";
import * as repoVendor from "../../vendors/_server/vendor.repo"
import { convertOffsetToTimes } from "framer-motion";
import { Prisma } from "@prisma/client";
import { createInvoiceFromAcquisition } from "../../invoices/_servers/invoices.repo";
import { ItemInput } from "./acquisition.dto";

// List cho admin table
export async function getAdminAcquisitionList(raw: unknown) {
    const f = dto.acqFiltersSchema.parse(raw);
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.max(1, Math.min(200, f.pageSize ?? DEFAULT_PAGE_SIZE));

    const { rows, total } = await repoAcq.getAcqList(
        buildAcqWhere(f),
        buildAcqOrderBy(f.sort),
        (page - 1) * pageSize,
        pageSize
    );

    const items = rows.map(a => ({
        id: a.id,
        refNo: a.refNo,
        notes: a.notes,
        type: a.type,
        status: a.accquisitionStt,
        vendorName: a.vendor.name,
        itemCount: a._count.acquisitionItem,
        hasInvoice: a._count.invoice > 0,
        createdAt: a.createdAt,
        cost: a.cost,
        updatedAt: a.updatedAt,
        currency: a.currency ?? "VND",
    }));
    return { items, total, page, pageSize };
}

// Chi tiết
export async function getAcquisitionDetail(id: string) {

    const acq = await repoAcq.getAcqtById(id);
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
            createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
            notes: input.notes,
        })
        let total = 0;
        console.log('in ra test o api ')
        for (const it of input.items) {
            // WATCH & quantity > 1 ⇒ tạo nhiều product draft
            if (it.productType === "WATCH" && it.quantity > 1) {
                for (let i = 0; i < it.quantity; i++) {
                    console.log('in ra test o api ' + it.unitCost)

                    await repoAcq.createAcqItem(tx, acq.id, {
                        title: it.title,
                        quantity: 1,
                        unitCost: it.unitCost,
                        productType: it.productType ?? ProductType.WATCH
                    });
                    total += it.unitCost;
                }
            } else
                await repoAcq.createAcqItem(tx, acq.id, it);
            total += (it.quantity ?? 1) * (it.unitCost ?? 0);
        }
        await repoAcq.updateAcquisitionCost(tx, acq.id, total);
        return { id: acq.id }
    });
}

// Chuyển phiếu sang POSTED
export async function postAcquisition(acqId: string, vendorName: string) {
    return prisma.$transaction(async (tx) => {
        const items = await repoAcq.getAqcItems(tx, acqId)
        const vendorId = await repoVendor.getVendorByName(tx, vendorName)
        for (const item of items) {
            if (!item.productId) {
                await repoProd.createProductDraft(tx, item.productTitle, item.productType, item.quantity, vendorId)
            }
        }
        await createInvoiceFromAcquisition(tx, acqId)
        return repoAcq.changeDraftToPost(tx, acqId);
    });
}

export async function postMultipleAcquisitions(items: { id: string; vendor: string }[]) {
    const results = [];
    for (const acq of items) {
        try {
            await postAcquisition(acq.id, acq.vendor); // dùng logic postAcquisition như đã hướng dẫn phía trên
            results.push({ id: acq.id, ok: true });
        } catch (e) {
            results.push({ id: acq.id, ok: false, error: (e as Error).message });
        }
    }
    return results;
}
// Hủy phiếu
export async function cancelAcquisition(id: string) {
    const acq = await repoAcq.acqGetById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.acquisitionStt === "POSTED") throw new Error("Không thể huỷ phiếu đã đăng");
    return repoAcq.acqUpdate(id, { acquisitionStt: "CANCELED" });
}

//Update acquisition item
export async function updateAcqItem(tx: DB, it: any) {
    return tx.acquisitionItem.update({
        where: { id: it.id },
        data: {
            productTitle: it.title,
            quantity: it.quantity,
            unitCost: it.unitPrice,
        },
    });
}
// 


export async function updateAcquisitionItems(
    tx: DB,
    acqId: string,
    items: ItemInput[]
) {
    const existing = await repoAcq.findAcqItems(tx, acqId);

    const existingIds = new Set(existing.map(i => i.id));
    const receivedIds = new Set(items.map(i => i.id));

    const toDelete = [...existingIds].filter(id => !receivedIds.has(id));

    if (toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const it of items) {
        console.log('in ra id : ' + it.id, it.unitPrice)
        if (it.id.startsWith("tmp-")) {
            await repoAcq.createAcqItem(tx, acqId, it);
        } else {
            await updateAcqItem(tx, it);
        }
    }

    const all = await repoAcq.findAcqItems(tx, acqId);

    const total = all.reduce(
        (s, r) => s + Number(r.quantity) * Number(r.unitCost ?? 0),
        0
    );

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}


/* export async function updateAcquisitionWithItems(acqId: string, input: any) {
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
                    if (item.productType === "WATCH" && item.quantity > 1) {
                        for (let i = 0; i < item.quantity; i++) {
                            await repoAcq.addAcqItem(tx, acq.id, 1, it.productType ?? ProductType, it.unitCost, it.title);
                        }
                    } else
                        await repoAcq.addAcqItem(tx, acq.id, it.quantity, it.productType ?? ProductType.WATCH, it.unitCost, it.title)
                    total += (it.quantity ?? 1) * (it.unitCost ?? 0);
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
*/