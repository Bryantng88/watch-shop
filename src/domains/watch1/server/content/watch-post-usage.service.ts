import { prisma } from "@/server/db/client";
import {
    getWatchPostUsageStateRepo,
    markWatchPostUsageRepo,
    type WatchPostUsageKind,
} from "./watch-post-usage.repo";

function reviewStatus(row: any, targetType: "CONTENT" | "IMAGE") {
    return String(
        row?.reviewStates?.find(
            (item: any) => String(item?.targetType).toUpperCase() === targetType
        )?.status ?? "DRAFT"
    ).toUpperCase();
}

function hasMeaningfulContent(row: any) {
    const content = row?.watchContent;
    if (!content) return false;

    return Boolean(
        String(content.titleOverride ?? "").trim() ||
        String(content.body ?? "").trim() ||
        String(content.hookText ?? "").trim() ||
        String(content.summary ?? "").trim() ||
        (Array.isArray(content.bulletSpecs) &&
            content.bulletSpecs.some((item: any) => String(item ?? "").trim()))
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
}) {
    return prisma.$transaction(async (tx) => {
        const current = await getWatchPostUsageStateRepo(tx as any, input.productId);

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
            tx as any,
            input.productId,
            input.kind
        );

        return buildUsagePayload(updated);
    });
}
