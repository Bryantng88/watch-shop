"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "../../shared/acquisition.dto";
import { toDraftItem } from "../../shared/acquisition.mapper";
import {
    computeActiveAcquisitionTotal,
    toNonEmptyString,
} from "../../shared/helper";
import {
    getAiMetaFromDescription,
    getWatchFlagsFromDescription,
} from "../../metadata";
import * as repoAcq from "./acquisition-write.repo";

// nếu AI/spec job bạn chưa move sang domains/acquisition/server/ai
// thì tạm giữ import cũ trước rồi move sau
import {
    enqueueAcquisitionSpecJob,
    processQueuedAcquisitionSpecJobs,
} from "@/app/(admin)/admin/acquisitions/_server/ai/acquisition-spec-job.service";

// nếu invoice/service request chưa move thì giữ import cũ trước
import { createInvoiceFromAcquisition } from "@/app/(admin)/admin/invoices/_servers/invoices.repo";
import { createTechnicalCheckFromAcquisitionTx } from "@/app/(admin)/admin/services/_server/service_request.service";

type ExistingAcqItem = Awaited<ReturnType<typeof repoAcq.findAcqItems>>[number];

async function resolveVendorIdForPosting(
    acq: Awaited<ReturnType<typeof repoAcq.getAcqtById>>,
    vendorName: string
) {
    let vendorId = acq?.vendorId ?? null;

    if (!vendorId && vendorName) {
        const vendor = await prisma.vendor.findFirst({
            where: { name: vendorName },
            select: { id: true },
        });
        vendorId = vendor?.id ?? null;
    }

    return vendorId;
}

async function maybeCreateTechnicalCheckForPostedWatch(
    tx: DB,
    input: {
        acqId: string;
        productId: string;
        variantId: string;
        productSku?: string | null;
        variantSku?: string | null;
        primaryImageUrl?: string | null;
        needService?: boolean;
    }
) {
    if (!input.needService) return;

    await createTechnicalCheckFromAcquisitionTx(tx as any, {
        productId: input.productId,
        variantId: input.variantId,
        skuSnapshot: input.productSku ?? input.variantSku ?? null,
        primaryImageUrlSnapshot: input.primaryImageUrl ?? null,
        notes: `Tạo từ phiếu nhập ${input.acqId}: Kiểm tra kỹ thuật tổng quát`,
    });
}

export async function createAcquisitionWithItem(input: dto.CreateAcquisitionInput) {
    return prisma.$transaction(async (tx) => {
        let vendorId = input.vendorId;

        if (!vendorId && input.quickVendorName) {
            const newVendor = await tx.vendor.create({
                data: { name: input.quickVendorName },
            });
            vendorId = newVendor.id;
        }

        if (!vendorId) {
            throw new Error("Thiếu vendor");
        }

        const acq = await repoAcq.createDraft(tx, {
            vendorId,
            currency: input.currency,
            type: input.type,
            createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
            notes: input.notes,
        });

        let total = 0;

        for (const raw of input.items) {
            const item = toDraftItem(raw);

            const createdItem = await repoAcq.createAcqItem(tx, acq.id, item as any);
            total += Number(item.quantity ?? 0) * Number(item.unitCost ?? 0);

            if ((item.productType ?? "WATCH") === "WATCH") {
                const aiMeta = item.aiMeta ?? {};
                const firstImage = Array.isArray(aiMeta?.images) ? aiMeta.images[0] : null;

                await repoAcq.createWatchDraftForAcquisitionItem(tx, {
                    acquisitionItemId: createdItem.id,
                    acquisitionId: acq.id,
                    vendorId,
                    title: item.productTitle ?? "Watch draft",
                    quantity: Number(item.quantity ?? 1),
                    unitCost: Number(item.unitCost ?? 0),
                    imageKey: firstImage?.key ?? null,
                    imageUrl: firstImage?.url ?? null,
                });
            }
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        return { id: acq.id };
    });
}

export async function postAcquisition(acqId: string, vendorName?: string | null) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (acq.accquisitionStt !== "DRAFT") {
        throw new Error("Chỉ phiếu DRAFT mới được duyệt");
    }

    const vendorId = await resolveVendorIdForPosting(acq, vendorName ?? "");
    if (!vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }

    const items = acq.acquisitionItem ?? [];
    if (!items.length) {
        throw new Error("Phiếu nhập chưa có dòng nào");
    }

    const result = await prisma.$transaction(
        async (tx) => {
            for (const item of items) {
                if ((item.productType ?? "WATCH") !== "WATCH") continue;

                if (!item.productId) {
                    throw new Error(
                        `Dòng "${item.productTitle ?? item.id}" chưa được linked product/watch draft`
                    );
                }

                let resolvedVariantId = item.variantId ?? null;

                if (!resolvedVariantId) {
                    const variant = await tx.productVariant.findFirst({
                        where: { productId: item.productId },
                        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
                        select: { id: true },
                    });

                    resolvedVariantId = variant?.id ?? null;

                    if (resolvedVariantId) {
                        await repoAcq.linkAcquisitionItemToProduct(tx, {
                            itemId: item.id,
                            productId: item.productId,
                            variantId: resolvedVariantId,
                        });
                    }
                }

                await enqueueAcquisitionSpecJob(tx as any, {
                    acquisitionItemId: item.id,
                    productId: item.productId,
                });

                const watchFlags = getWatchFlagsFromDescription(item.description);

                if (resolvedVariantId) {
                    await maybeCreateTechnicalCheckForPostedWatch(tx, {
                        acqId: acq.refNo ?? acq.id,
                        productId: item.productId,
                        variantId: resolvedVariantId,
                        productSku: item.product?.sku ?? null,
                        variantSku: null,
                        primaryImageUrl: item.product?.primaryImageUrl ?? null,
                        needService: Boolean(watchFlags?.needService ?? false),
                    });
                }
            }

            await repoAcq.updateAcquisitionItemStatus(tx, {
                acquisitionId: acqId,
                fromStatus: "DRAFT",
                toStatus: "SENT",
            });

            return repoAcq.changeDraftToPost(tx, acqId);
        },
        {
            maxWait: 10000,
            timeout: 60000,
        }
    );

    await prisma.$transaction(
        async (tx) => {
            await createInvoiceFromAcquisition(tx as any, acqId);
        },
        {
            maxWait: 10000,
            timeout: 30000,
        }
    );

    try {
        await processQueuedAcquisitionSpecJobs({
            acquisitionItemIds: items.map((x) => x.id),
            limit: items.length,
            includeFailed: false,
        });
    } catch (error) {
        console.error("[ACQ_POST][SPEC_JOB_NON_BLOCKING_ERROR]", {
            acqId,
            error: error instanceof Error ? error.message : String(error),
        });
    }

    return result;
}

export async function postMultipleAcquisitions(acquisitionIds: string[]) {
    const posted: string[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const acqId of acquisitionIds) {
        try {
            const acq = await repoAcq.getAcqtById(acqId);

            if (!acq) {
                failed.push({ id: acqId, error: "Không tìm thấy phiếu nhập" });
                continue;
            }

            if (acq.accquisitionStt !== "DRAFT") {
                failed.push({ id: acqId, error: "Chỉ phiếu DRAFT mới được duyệt" });
                continue;
            }

            await postAcquisition(acqId, "");
            posted.push(acqId);
        } catch (error) {
            failed.push({
                id: acqId,
                error: error instanceof Error ? error.message : "Bulk post failed",
            });
        }
    }

    return { posted, failed };
}

export async function updateAcquisitionItems(
    tx: DB,
    acqId: string,
    items: dto.ItemInput[]
) {
    const acq = await tx.acquisition.findUnique({
        where: { id: acqId },
        select: { accquisitionStt: true },
    });

    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    const existing = await repoAcq.findAcqItems(tx, acqId);
    const existingIds = new Set(existing.map((i) => i.id));
    const receivedIds = new Set(items.map((i) => i.id));
    const toDelete = [...existingIds].filter((id) => !receivedIds.has(id));

    if (acq.accquisitionStt !== "POSTED" && toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const raw of items) {
        const item = toDraftItem(raw);

        if (raw.id.startsWith("tmp-")) {
            const createdItem = await repoAcq.createAcqItem(tx, acqId, item as any);

            if ((item.productType ?? "WATCH") === "WATCH" && acq.accquisitionStt !== "POSTED") {
                const aiMeta = item.aiMeta ?? {};
                const firstImage = Array.isArray(aiMeta?.images) ? aiMeta.images[0] : null;

                const acqRow = await tx.acquisition.findUnique({
                    where: { id: acqId },
                    select: { vendorId: true },
                });

                if (!acqRow?.vendorId) {
                    throw new Error("Phiếu nhập không có vendor");
                }

                await repoAcq.createWatchDraftForAcquisitionItem(tx, {
                    acquisitionItemId: createdItem.id,
                    acquisitionId: acqId,
                    vendorId: acqRow.vendorId,
                    title: item.productTitle ?? "Watch draft",
                    quantity: Number(item.quantity ?? 1),
                    unitCost: Number(item.unitCost ?? 0),
                    imageKey: firstImage?.key ?? null,
                    imageUrl: firstImage?.url ?? null,
                });
            }

            continue;
        }

        await repoAcq.updateAcqItem(tx, {
            ...item,
            id: raw.id,
        } as any);

        await repoAcq.syncLinkedProductFromAcquisitionItem(tx, raw.id);
    }

    const all = await repoAcq.findAcqItems(tx, acqId);
    const total = computeActiveAcquisitionTotal(all as any[]);

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}

export async function cancelAcquisition(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt === "POSTED") {
        throw new Error("Không thể hủy phiếu đã đăng");
    }

    return prisma.acquisition.update({
        where: { id },
        data: { accquisitionStt: "CANCELED" as any },
    });
}