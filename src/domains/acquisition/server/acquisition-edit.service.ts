import { prisma } from "@/server/db/client";
import { getPaymentOwnerSummaryProjection } from "@/domains/projection/server/payment-owner-summary.projection";
import {
    getAiMetaFromDescription,
} from "../shared/acquisition-item-metadata";

function toNumber(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function signedUrlFromKey(key?: string | null) {
    if (!key) return null;
    return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

function pickImage(description?: string | null, product?: any) {
    const meta = getAiMetaFromDescription(description ?? null);
    const firstMetaImage = Array.isArray(meta?.images) ? meta.images[0] : null;

    const key = firstMetaImage?.key ?? product?.storefrontImageKey ?? null;
    const url = firstMetaImage?.url ?? product?.primaryImageUrl ?? signedUrlFromKey(key);

    return {
        imageKey: key,
        imageUrl: url,
    };
}

export async function getAcquisitionEditDetail(acquisitionId: string, includeFinancials = false) {
    const acquisition = await prisma.acquisition.findUnique({
        where: { id: acquisitionId },
        include: {
            vendor: { select: { id: true, name: true } },
            acquisitionItem: {
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            sku: true,
                            primaryImageUrl: true,
                            storefrontImageKey: true,
                        },
                    },
                },
                orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            },
        },
    });

    if (!acquisition) return null;

    const items = acquisition.acquisitionItem.map((item) => {
        const aiMeta = getAiMetaFromDescription(item.description ?? null);
        const image = pickImage(item.description, item.product);

        return {
            id: item.id,
            productId: item.productId ?? null,
            linkedWatchSku: item.product?.sku ?? null,
            linkedWatchTitle: item.product?.title ?? null,
            title: item.productTitle ?? item.product?.title ?? "Untitled watch",
            quantity: item.quantity ?? 1,
            productType: item.productType,
            sourceOrderItemId: item.sourceOrderItemId ?? null,
            unitCost: includeFinancials ? toNumber(item.unitCost) : null,
            imageKey: image.imageKey,
            imageUrl: image.imageUrl,
            aiHint: String(aiMeta?.aiHint ?? ""),
            status: item.status ?? null,
        };
    });

    const paymentSummary = includeFinancials
        ? await getPaymentOwnerSummaryProjection(prisma, "ACQUISITION", acquisitionId)
        : null;

    return {
        id: acquisition.id,
        refNo: acquisition.refNo ?? null,
        status: acquisition.accquisitionStt,
        audienceSegment: acquisition.audienceSegment,
        vendorId: acquisition.vendorId ?? null,
        vendorName: acquisition.vendor?.name ?? null,
        currency: acquisition.currency ?? "VND",
        type: acquisition.type,
        notes: acquisition.notes ?? "",
        totalAmount: includeFinancials ? toNumber(acquisition.totalAmount) : null,
        paidAmount: includeFinancials ? (paymentSummary?.paidTotal ?? 0) + (paymentSummary?.collectedTotal ?? 0) : null,
        unpaidAmount: includeFinancials ? paymentSummary?.unpaidTotal ?? 0 : null,
        items,
    };
}
