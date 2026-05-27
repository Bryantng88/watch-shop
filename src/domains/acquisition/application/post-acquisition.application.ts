"use server";

import { prisma, type DB } from "@/server/db/client";
import {
    enqueueAcquisitionSpecJob,
} from "../server/acquisition-spec-job.service";
import {
    getAiMetaFromDescription,
    getWatchFlagsFromDescription,
} from "../shared/acquisition-item-metadata";
import * as repoAcq from "../server";
import {
    attachInlineImageToAcquisitionWatchDraft,
    pickFirstAcquisitionInlineImage,
    type AcquisitionInlineImageInput,
} from "../server/acquisition-media.service";
import { createInitialPaymentForAcquisitionTx } from "@/domains/payment/server";
import { createTechnicalCheckFromAcquisitionTx } from "@/app/(admin)/admin/services/_server/service_request.service";

type PendingInlineImageAttach = {
    acquisitionId: string;
    productId: string;
    image: AcquisitionInlineImageInput;
    sortOrder: number;
};

type PendingTechnicalCheck = {
    acqId: string;
    productId: string;
    productSku?: string | null;
    primaryImageUrl?: string | null;
};

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

export async function postAcquisitionApplication(
    input: string | { acquisitionId: string; vendorName?: string | null },
    legacyVendorName?: string | null
) {
    const acqId = typeof input === "string"
        ? input
        : input.acquisitionId;

    const vendorName = typeof input === "string"
        ? legacyVendorName ?? ""
        : input.vendorName ?? "";

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

    const pendingInlineImages: PendingInlineImageAttach[] = [];
    const pendingTechnicalChecks: PendingTechnicalCheck[] = [];

    const result = await prisma.$transaction(
        async (tx) => {
            for (const [index, item] of items.entries()) {
                let productId = item.productId;
                let productSku = item.product?.sku ?? null;
                let primaryImageUrl = item.product?.primaryImageUrl ?? null;

                if (!productId) {
                    const draft = await repoAcq.createWatchDraftForAcquisitionItem(tx as any, {
                        acquisitionItemId: item.id,
                        acquisitionId: acqId,
                        vendorId,
                        title: item.productTitle ?? "Watch draft",
                        unitCost: Number(item.unitCost ?? 0),
                    });

                    productId = draft.productId;

                    const inlineImage = pickFirstAcquisitionInlineImage(
                        getAiMetaFromDescription(item.description)?.images
                    );

                    if (inlineImage) {
                        pendingInlineImages.push({
                            acquisitionId: acqId,
                            productId,
                            image: inlineImage,
                            sortOrder: index,
                        });
                    }
                } else {
                    await repoAcq.syncLinkedProductFromAcquisitionItem(
                        tx as any,
                        item.id
                    );
                }

                await enqueueAcquisitionSpecJob(tx as any, {
                    acquisitionItemId: item.id,
                    productId,
                });

                const watchFlags = getWatchFlagsFromDescription(item.description);

                if (watchFlags?.needService) {
                    pendingTechnicalChecks.push({
                        acqId: acq.refNo ?? acq.id,
                        productId,
                        productSku,
                        primaryImageUrl,
                    });
                }
            }

            await repoAcq.updateAcquisitionItemStatus(tx as any, {
                acquisitionId: acqId,
                fromStatus: "DRAFT",
                toStatus: "SENT",
            });

            const posted = await repoAcq.changeDraftToPost(tx as any, acqId);

            await createInitialPaymentForAcquisitionTx(tx as any, acqId);

            return posted;
        },
        {
            maxWait: 5000,
            timeout: 15000,
        }
    );

    // NON BLOCKING IMAGE ATTACH
    Promise.allSettled(
        pendingInlineImages.map((pending) =>
            attachInlineImageToAcquisitionWatchDraft(pending)
        )
    ).catch(console.error);

    // NON BLOCKING TECHNICAL CHECK
    Promise.allSettled(
        pendingTechnicalChecks.map((item) =>
            prisma.$transaction(async (tx) => {
                await createTechnicalCheckFromAcquisitionTx(tx as any, {
                    productId: item.productId,
                    variantId: null,
                    skuSnapshot: item.productSku ?? null,
                    primaryImageUrlSnapshot: item.primaryImageUrl ?? null,
                    notes: `Tạo từ phiếu nhập ${item.acqId}`,
                });
            })
        )
    ).catch(console.error);

    return result;
}