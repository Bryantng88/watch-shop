import prisma from "../db/client";

import * as acquisitionAiService from "@/app/(admin)/admin/acquisitions/_server/acquisition-ai.service";
import { buildProductTitleFromSpec } from "../lib/product-title.builder";


export async function runGenerateSpecJob(input: {
    itemId: string;
    productId: string;
    aiMeta: any;
}) {
    try {
        const aiDraft = await acquisitionAiService.generateAcquisitionDraft({
            origin: process.env.APP_URL!,
            imageEntries: input.aiMeta?.images ?? [],
            imageUrls: [],
            titleHint: null,
            hintText: input.aiMeta?.aiHint ?? null,
        });

        const extracted = aiDraft.extractedSpec;

        const brand =
            extracted?.brandName ??
            extracted?.suggestedFacts?.probableBrand ??
            extracted?.probableVisualFacts?.probableBrand;

        const title = buildProductTitleFromSpec({
            brand,
            model: extracted?.modelFamily,
            movement: extracted?.movement,
            dialColor: extracted?.dialColor,
        });

        await prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: { id: input.productId },
                data: {
                    name: title,
                    specStatus: "READY",
                },
            });

            // 👉 call lại createWatchSpecSafe ở đây
            await createWatchSpecSafe(tx, {
                productId: input.productId,
                itemId: input.itemId,
                aiExtracted: extracted,
            });
        });

    } catch (e) {
        console.error("[SPEC_JOB_FAILED]", e);

        await prisma.product.update({
            where: { id: input.productId },
            data: {
                specStatus: "FAILED",
            },
        });
    }
}