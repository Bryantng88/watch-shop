import { prisma } from "@/server/db/client";
import { emitWatchPublishAssetsDownloadedEvent } from "@/domains/watch/server/events";
import {
    getWatchPostUsageStateRepo,
    markWatchPostUsageRepo,
    type WatchPostUsageKind,
} from "./watch-post-usage.repo";

type WatchPostUsageState = NonNullable<
    Awaited<ReturnType<typeof getWatchPostUsageStateRepo>>
>;

function reviewStatus(row: WatchPostUsageState, targetType: "CONTENT" | "IMAGE") {
    return String(
        row.reviewStates.find(
            (item) => String(item.targetType).toUpperCase() === targetType
        )?.status ?? "DRAFT"
    ).toUpperCase();
}

function hasMeaningfulContent(row: WatchPostUsageState) {
    const content = row.watchContent;
    if (!content) return false;

    return Boolean(
        String(content.titleOverride ?? "").trim() ||
        String(content.body ?? "").trim() ||
        String(content.hookText ?? "").trim() ||
        String(content.summary ?? "").trim() ||
        (
            Array.isArray(content.bulletSpecs) &&
            content.bulletSpecs.some((item) => String(item ?? "").trim())
        )
    );
}

function buildUsagePayload(row: {
    productId: string;
    isContentDownloaded: boolean;
    isImageDownloaded: boolean;
}) {
    return {
        productId: row.productId,
        isContentDownloaded: Boolean(row.isContentDownloaded),
        isImageDownloaded: Boolean(row.isImageDownloaded),
        isPosted: Boolean(row.isContentDownloaded && row.isImageDownloaded),
    };
}

export async function markWatchPostUsage(input: {
    productId: string;
    kind: WatchPostUsageKind;
    actorUserId?: string | null;
}) {
    const result = await prisma.$transaction(async (tx) => {
        const current = await getWatchPostUsageStateRepo(tx, input.productId);

        if (!current) {
            throw new Error("Không tìm thấy watch.");
        }

        if (input.kind === "CONTENT_COPIED") {
            if (reviewStatus(current, "CONTENT") !== "APPROVED") {
                throw new Error("Content cần được duyệt trước khi đánh dấu đã copy.");
            }

            if (!hasMeaningfulContent(current)) {
                throw new Error("Watch chưa có content để copy.");
            }
        }

        if (input.kind === "IMAGE_DOWNLOADED") {
            if (reviewStatus(current, "IMAGE") !== "APPROVED") {
                throw new Error("Hình ảnh cần được duyệt trước khi đánh dấu đã tải.");
            }

            if (!current.product?.productImage?.length) {
                throw new Error("Watch chưa có ảnh GALLERY để tải.");
            }
        }

        const updated = await markWatchPostUsageRepo(
            tx,
            input.productId,
            input.kind
        );

        return {
            current,
            usage: buildUsagePayload(updated),
        };
    });

    await emitWatchPublishAssetsDownloadedEvent(prisma, {
        watch: {
            id: result.current.id,
            productId: result.current.productId,
            saleStage: result.current.saleStage,
            product: {
                title: result.current.product?.title ?? null,
                sku: result.current.product?.sku ?? null,
                primaryImageUrl: result.current.product?.primaryImageUrl ?? null,
                status: result.current.product?.status ?? null,
            },
        },
        actorUserId: input.actorUserId ?? null,
        sourceId: `publish-assets-downloaded:${result.current.id}:${input.kind}`,
        note: input.kind === "CONTENT_COPIED"
            ? "Publish content copied from Watch detail."
            : "Publish gallery assets downloaded from Watch detail.",
        extraPayload: {
            publishAssetKind: input.kind,
            isContentDownloaded: result.usage.isContentDownloaded,
            isImageDownloaded: result.usage.isImageDownloaded,
            isPosted: result.usage.isPosted,
        },
    });

    return result.usage;
}
