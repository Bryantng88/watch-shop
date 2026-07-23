"use server";

import { prisma } from "@/server/db/client";
import {
    enqueueAcquisitionSpecJob,
} from "../server/acquisition-spec-job.service";
import {
    getAiMetaFromDescription,
    getPricingFromDescription,
} from "../shared/acquisition-item-metadata";
import * as repoAcq from "../server";
import {
    attachInlineImageToAcquisitionWatchDraft,
    pickFirstAcquisitionInlineImage,
    type AcquisitionInlineImageInput,
} from "../server/acquisition-media.service";
import { ensureInitialPaymentForAcquisitionTx, publishPaymentMutations } from "@/domains/payment/server";
import { restoreBuyBackWatchAfterAcquisitionPostTx } from "../server";
import { emitWatchCreatedEvent } from "@/domains/watch/server/events";

type PendingInlineImageAttach = {
    acquisitionId: string;
    acquisitionItemId: string;
    watchId: string;
    productId: string;
    image: AcquisitionInlineImageInput;
    sortOrder: number;
};

type CreatedWatchEvent = {
    acquisitionId: string;
    acquisitionItemId: string;
    watchId: string;
    productId: string;
    saleStage: "DRAFT";
    audienceSegment: "MEN" | "WOMEN" | "UNISEX";
    mediaPipelineKey: "MEN_STANDARD" | "WOMEN_LITE" | "UNISEX_STANDARD";
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

    const isBuyBack = acq.type === "BUY_BACK";

    if (!isBuyBack && !acq.vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }
    const items = acq.acquisitionItem ?? [];

    if (!items.length) {
        throw new Error("Phiếu nhập chưa có dòng nào");
    }

    const pendingInlineImages: PendingInlineImageAttach[] = [];
    const createdWatchEvents: CreatedWatchEvent[] = [];

    const result = await prisma.$transaction(
        async (tx) => {
            for (const [index, item] of items.entries()) {
                let productId = item.productId;
                const audienceSegment = item.audienceSegment ?? acq.audienceSegment;

                if (!productId) {
                    const draft = await repoAcq.createWatchDraftForAcquisitionItem(tx as any, {
                        acquisitionItemId: item.id,
                        acquisitionId: acqId,
                        vendorId,
                        title: item.productTitle ?? "Watch draft",
                        unitCost: Number(item.unitCost ?? 0),
                        salePrice: getPricingFromDescription(item.description)?.proposedSalePrice ?? null,
                        audienceSegment,
                    });

                    productId = draft.productId;

                    createdWatchEvents.push({
                        acquisitionId: acqId,
                        acquisitionItemId: item.id,
                        watchId: draft.watchId,
                        productId: draft.productId,
                        saleStage: "DRAFT",
                        audienceSegment,
                        mediaPipelineKey:
                            audienceSegment === "WOMEN"
                                ? "WOMEN_LITE"
                                : audienceSegment === "UNISEX"
                                    ? "UNISEX_STANDARD"
                                    : "MEN_STANDARD",
                    });

                    const inlineImage = pickFirstAcquisitionInlineImage(
                        getAiMetaFromDescription(item.description)?.images
                    );

                    if (inlineImage) {
                        pendingInlineImages.push({
                            acquisitionId: acqId,
                            acquisitionItemId: item.id,
                            watchId: draft.watchId,
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
            }

            await repoAcq.updateAcquisitionItemStatus(tx as any, {
                acquisitionId: acqId,
                fromStatus: "DRAFT",
                toStatus: "SENT",
            });

            const posted = await repoAcq.changeDraftToPost(tx as any, acqId);

            const paymentResult = await ensureInitialPaymentForAcquisitionTx(tx as any, acqId);

            // BUY_BACK: chỉ khi phiếu nhập được POST mới trả watch về kho.
            // SaleStage không bị hard-code; helper sẽ quyết định READY/PROCESSING
            // theo dữ liệu content + gallery hiện có.
            await restoreBuyBackWatchAfterAcquisitionPostTx(tx as any, acqId);

            return { posted, paymentResult };
        },
        {
            maxWait: 5000,
            timeout: 15000,
        }
    );

    const inlineImagesByWatchId = new Map(
        pendingInlineImages.map((pending) => [pending.watchId, pending]),
    );

    if (result.paymentResult.created) {
        await publishPaymentMutations([
            { paymentId: result.paymentResult.payment.id, eventKey: "payment.created" },
        ]);
    }

    await repoAcq.emitAcquisitionBusinessEvent(prisma, {
        eventKey: "acquisition.posted",
        acquisitionId: acqId,
    });

    for (const event of createdWatchEvents) {
        const pending = inlineImagesByWatchId.get(event.watchId);
        if (pending) {
            await attachInlineImageToAcquisitionWatchDraft(pending);
        }

        await emitWatchCreatedEvent(prisma, {
            watch: {
                id: event.watchId,
                productId: event.productId,
                saleStage: event.saleStage,
                audienceSegment: event.audienceSegment,
                mediaPipelineKey: event.mediaPipelineKey,
            },
            acquisitionId: event.acquisitionId,
            acquisitionItemId: event.acquisitionItemId,
        });
    }

    return result.posted;
}
