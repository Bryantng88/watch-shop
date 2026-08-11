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
import { ensureInitialPaymentForAcquisitionTx, recordPaymentMutations } from "@/domains/payment/server";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { restoreBuyBackWatchAfterAcquisitionPostTx } from "../server";
import { emitWatchBoughtBackEvent, emitWatchCreatedEvent } from "@/domains/watch/server/events";
import { emitStrapBusinessEvent } from "@/domains/strap/server/events";
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

type CreatedStrapEvent = {
    variantId: string;
    productId: string;
    eventKey: "strap.created" | "strap.received";
    quantity: number;
    balanceAfter: number;
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

    const totalCost = items.reduce(
        (sum, item) => sum + Number(item.unitCost ?? 0) * Number(item.quantity ?? 1),
        0,
    );
    if (totalCost <= 0) {
        throw new Error("Phiếu nhập có tổng giá trị bằng 0 nên không thể duyệt. Vui lòng cập nhật giá nhập trước khi duyệt.");
    }

    const pendingInlineImages: PendingInlineImageAttach[] = [];
    const createdWatchEvents: CreatedWatchEvent[] = [];
    const createdStrapEvents: CreatedStrapEvent[] = [];
    const projectionDeliveryKeys: string[] = [];
    const returningTradeInProductIds = isTradeIn
        ? items.map((item) => item.productId).filter((id): id is string => Boolean(id))
        : [];

    const result = await runBusinessEventTransaction(
        async (tx, delivery) => {
            const track = <T extends { projectionDeliveryKey?: string | null }>(event: T) => {
                delivery.track(event);
                const key = String(event.projectionDeliveryKey ?? "").trim();
                if (key) projectionDeliveryKeys.push(key);
                return event;
            };
            for (const [index, item] of items.entries()) {
                let productId = item.productId;
                const audienceSegment = item.audienceSegment ?? acq.audienceSegment;

                if (!productId) {
                    if (item.productType === "WATCH_CLASP") {
                        const clasp = await repoAcq.createClaspDraftForAcquisitionItem(tx, {
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
                        const strap = await repoAcq.createStrapDraftForAcquisitionItem(tx, {
                            acquisitionItemId: item.id,
                            vendorId,
                            title: item.productTitle ?? "Dây đồng hồ",
                            quantity: Number(item.quantity ?? 1),
                            unitCost: Number(item.unitCost ?? 0),
                            spec: getStrapSpecFromDescription(item.description) ?? {},
                        });
                        productId = strap.productId;
                        createdStrapEvents.push({
                            variantId: strap.variantId,
                            productId: strap.productId,
                            eventKey: strap.created ? "strap.created" : "strap.received",
                            quantity: Number(item.quantity ?? 1),
                            balanceAfter: strap.balanceAfter,
                        });
                        continue;
                    }
                    const draft = await repoAcq.createWatchDraftForAcquisitionItem(tx, {
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
                        tx,
                        item.id
                    );
                }

            }

            await repoAcq.updateAcquisitionItemStatus(tx, {
                acquisitionId: acqId,
                fromStatus: "DRAFT",
                toStatus: "SENT",
            });

            // Recompute at approval time as well so drafts created before the
            // quantity-aware total fix still receive the correct payment amount.
            await repoAcq.updateAcquisitionCost(tx, acqId, totalCost);

            const posted = await repoAcq.changeDraftToPost(tx, acqId);

            const paymentResult = await ensureInitialPaymentForAcquisitionTx(tx, acqId);

            // BUY_BACK: chỉ khi phiếu nhập được POST mới trả watch về kho.
            // SaleStage không bị hard-code; helper sẽ quyết định READY/PROCESSING
            // theo dữ liệu content + gallery hiện có.
            const restoredWatches = await restoreBuyBackWatchAfterAcquisitionPostTx(tx, acqId, {
                tradeInProductIds: returningTradeInProductIds,
            });

            if (paymentResult.created) {
                const paymentEvents = await recordPaymentMutations(tx, [
                    { paymentId: paymentResult.payment.id, eventKey: "payment.created" },
                ], { skipProjectionKeys: ["acquisition-list"] });
                paymentEvents.forEach((event) => track(event));
            }

            track(await repoAcq.emitAcquisitionBusinessEvent(tx, {
                eventKey: "acquisition.posted",
                acquisitionId: acqId,
                payload: { skipProjection: true, totalAmount: totalCost },
            }));

            for (const event of createdWatchEvents) {
                track(await emitWatchCreatedEvent(tx, {
                    watch: {
                        id: event.watchId,
                        productId: event.productId,
                        saleStage: event.saleStage,
                        audienceSegment: event.audienceSegment,
                        mediaPipelineKey: event.mediaPipelineKey,
                    },
                    acquisitionId: event.acquisitionId,
                    acquisitionItemId: event.acquisitionItemId,
                }));
            }

            for (const event of createdStrapEvents) {
                track(await emitStrapBusinessEvent(tx, {
                    eventKey: event.eventKey,
                    variantId: event.variantId,
                    productId: event.productId,
                    payload: {
                        acquisitionId: acqId,
                        quantity: event.quantity,
                        balanceAfter: event.balanceAfter,
                    },
                }));
            }

            for (const watch of restoredWatches ?? []) {
                track(await emitWatchBoughtBackEvent(tx, {
                    watch: {
                        id: watch.watchId,
                        productId: watch.productId,
                        saleStage: watch.saleStage,
                    },
                    acquisitionId: acqId,
                    acquisitionType: isTradeIn ? "TRADE_IN" : "BUY_BACK",
                    unitCost: watch.unitCost,
                    sourceOrderItemId: watch.sourceOrderItemId,
                }));
            }

            track(await repoAcq.emitAcquisitionBusinessEvent(tx, {
                eventKey: "acquisition.items.updated",
                acquisitionId: acqId,
                payload: { source: "POST_FINALIZED", totalAmount: totalCost },
            }));

            return { posted, paymentResult, restoredWatches };
        },
        {
            deferConsumers,
            maxWait: 5000,
            timeout: 15000,
        }
    );

    const inlineImagesByWatchId = new Map(
        pendingInlineImages.map((pending) => [pending.watchId, pending]),
    );

    await Promise.all(createdWatchEvents.map(async (event) => {
        const pending = inlineImagesByWatchId.get(event.watchId);
        if (pending) {
            await attachInlineImageToAcquisitionWatchDraft(pending);
        }
    }));

    return {
        ...result.posted,
        projectionDeliveryKeys: Array.from(new Set(projectionDeliveryKeys)),
    };
}
