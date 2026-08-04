"use server";

import { prisma } from "@/server/db/client";
import {
    getAiMetaFromDescription,
    getPricingFromDescription,
} from "../shared/acquisition-item-metadata";
import { getClaspSpecFromDescription, getStrapSpecFromDescription } from "../shared/acquisition-item-metadata";
import * as repoAcq from "../server";
import {
    attachInlineImageToAcquisitionWatchDraft,
    pickFirstAcquisitionInlineImage,
    type AcquisitionInlineImageInput,
} from "../server/acquisition-media.service";
import { ensureInitialPaymentForAcquisitionTx, publishPaymentMutations } from "@/domains/payment/server";
import { restoreBuyBackWatchAfterAcquisitionPostTx } from "../server";
import { emitWatchBoughtBackEvent, emitWatchCreatedEvent } from "@/domains/watch/server/events";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";

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
    input: string | {
        acquisitionId: string;
        vendorName?: string | null;
        deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
    },
    legacyVendorName?: string | null
) {
    const acqId = typeof input === "string"
        ? input
        : input.acquisitionId;

    const vendorName = typeof input === "string"
        ? legacyVendorName ?? ""
        : input.vendorName ?? "";
    const deferConsumers = typeof input === "string" ? undefined : input.deferConsumers;

    const acq = await repoAcq.getAcqtById(acqId);

    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (acq.accquisitionStt !== "DRAFT") {
        throw new Error("Chỉ phiếu DRAFT mới được duyệt");
    }

    const vendorId = await resolveVendorIdForPosting(acq, vendorName);

    const isBuyBack = acq.type === "BUY_BACK";

    const isTradeIn = acq.type === "TRADE_IN";

    if (!isBuyBack && !isTradeIn && !acq.vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }
    const items = acq.acquisitionItem ?? [];

    if (!items.length) {
        throw new Error("Phiếu nhập chưa có dòng nào");
    }

    const pendingInlineImages: PendingInlineImageAttach[] = [];
    const createdWatchEvents: CreatedWatchEvent[] = [];
    const returningTradeInProductIds = isTradeIn
        ? items.map((item) => item.productId).filter((id): id is string => Boolean(id))
        : [];

    const result = await prisma.$transaction(
        async (tx) => {
            for (const [index, item] of items.entries()) {
                let productId = item.productId;
                const isReturningSoldWatch = Boolean(productId && (isBuyBack || isTradeIn));
                const audienceSegment = item.audienceSegment ?? acq.audienceSegment;

                if (!productId) {
                    if (item.productType === "WATCH_CLASP") {
                        const clasp = await repoAcq.createClaspDraftForAcquisitionItem(tx as any, {
                            acquisitionItemId: item.id,
                            vendorId,
                            title: item.productTitle ?? "Khóa đồng hồ",
                            quantity: Number(item.quantity ?? 1),
                            unitCost: Number(item.unitCost ?? 0),
                            spec: getClaspSpecFromDescription(item.description) ?? {},
                        });
                        productId = clasp.productId;
                        continue;
                    }
                    if (item.productType === "WATCH_STRAP") {
                        const strap = await repoAcq.createStrapDraftForAcquisitionItem(tx as any, {
                            acquisitionItemId: item.id,
                            vendorId,
                            title: item.productTitle ?? "Dây đồng hồ",
                            quantity: Number(item.quantity ?? 1),
                            unitCost: Number(item.unitCost ?? 0),
                            spec: getStrapSpecFromDescription(item.description) ?? {},
                        });
                        productId = strap.productId;
                        continue;
                    }
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
            const restoredWatches = await restoreBuyBackWatchAfterAcquisitionPostTx(tx as any, acqId, {
                tradeInProductIds: returningTradeInProductIds,
            });

            return { posted, paymentResult, restoredWatches };
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
        ], {
            deferConsumers,
            skipProjectionKeys: ["acquisition-list"],
        });
    }

    await repoAcq.emitAcquisitionBusinessEvent(prisma, {
        eventKey: "acquisition.posted",
        acquisitionId: acqId,
        payload: { skipProjection: true },
        deferConsumers,
    });

    await Promise.all(createdWatchEvents.map(async (event) => {
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
            deferConsumers,
        });
    }));

    await Promise.all((result.restoredWatches ?? []).map((watch) =>
        emitWatchBoughtBackEvent(prisma, {
            watch: {
                id: watch.watchId,
                productId: watch.productId,
                saleStage: watch.saleStage,
            },
            acquisitionId: acqId,
            acquisitionType: isTradeIn ? "TRADE_IN" : "BUY_BACK",
            unitCost: watch.unitCost,
            sourceOrderItemId: watch.sourceOrderItemId,
            deferConsumers,
        })
    ));

    await repoAcq.emitAcquisitionBusinessEvent(prisma, {
        eventKey: "acquisition.items.updated",
        acquisitionId: acqId,
        payload: { source: "POST_FINALIZED" },
    });

    return result.posted;
}
