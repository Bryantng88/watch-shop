"use server";

import { prisma, type DB } from "@/server/db/client";
import { createInvoiceFromAcquisition } from "@/app/(admin)/admin/invoices/_servers/invoices.repo";
import { createTechnicalCheckFromAcquisitionTx } from "@/app/(admin)/admin/services/_server/service_request.service";
import {
    enqueueAcquisitionSpecJob,
    processAcquisitionSpecJobsByItemIds,
} from "../server/ai/acquisition-spec-job.service";
import { getWatchFlagsFromDescription } from "../server/metadata";
import * as repoAcq from "../server";

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
        productSku?: string | null;
        primaryImageUrl?: string | null;
        needService?: boolean;
    }
) {
    if (!input.needService) return;

    await createTechnicalCheckFromAcquisitionTx(tx as any, {
        productId: input.productId,
        variantId: null,
        skuSnapshot: input.productSku ?? null,
        primaryImageUrlSnapshot: input.primaryImageUrl ?? null,
        notes: `Tạo từ phiếu nhập ${input.acqId}: Kiểm tra kỹ thuật tổng quát`,
    });
}

export async function postAcquisitionApplication(
    input: string | { acquisitionId: string; vendorName?: string | null },
    legacyVendorName?: string | null
) {
    const acqId = typeof input === "string" ? input : input.acquisitionId;
    const vendorName =
        typeof input === "string" ? legacyVendorName ?? "" : input.vendorName ?? "";

    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (acq.accquisitionStt !== "DRAFT") {
        throw new Error("Chỉ phiếu DRAFT mới được duyệt");
    }

    const vendorId = await resolveVendorIdForPosting(acq, vendorName);
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
                if (!item.productId) {
                    throw new Error(
                        `Dòng "${item.productTitle ?? item.id}" chưa được linked product/watch draft`
                    );
                }

                await enqueueAcquisitionSpecJob(tx as any, {
                    acquisitionItemId: item.id,
                    productId: item.productId,
                });

                const watchFlags = getWatchFlagsFromDescription(item.description);

                await maybeCreateTechnicalCheckForPostedWatch(tx, {
                    acqId: acq.refNo ?? acq.id,
                    productId: item.productId,
                    productSku: item.product?.sku ?? null,
                    primaryImageUrl: item.product?.primaryImageUrl ?? null,
                    needService: Boolean(watchFlags?.needService ?? false),
                });
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
        await processAcquisitionSpecJobsByItemIds({
            acquisitionItemIds: items.map((x) => x.id),
        });
    } catch (error) {
        console.error("[ACQ_POST][SPEC_JOB_NON_BLOCKING_ERROR]", {
            acqId,
            error: error instanceof Error ? error.message : String(error),
        });
    }

    return result;
}

export async function postMultipleAcquisitionsApplication(
    input: string[] | { acquisitionIds: string[] }
) {
    const acquisitionIds = Array.isArray(input) ? input : input.acquisitionIds;
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

            await postAcquisitionApplication({ acquisitionId: acqId });
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

export const postAcquisition = postAcquisitionApplication;
export const postMultipleAcquisitions = postMultipleAcquisitionsApplication;
